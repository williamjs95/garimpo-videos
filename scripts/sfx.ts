/**
 * Synthesizes the sounds the Remotion library lacks as WAV files: a soft thud
 * and a footstep in public/sfx, plus the series' own music in public/music
 * (the looping background theme and the closing jingle). Run once: npm run sfx
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { log, PUBLIC } from "./lib/shared.ts";

const RATE = 44100;

/** Mono 16-bit WAV from samples in the range -1 to 1. */
const wav = (samples: number[]): Buffer => {
  const data = Buffer.alloc(samples.length * 2);
  samples.forEach((s, i) => {
    data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, s)) * 32767), i * 2);
  });
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write("WAVEfmt ", 8);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(RATE, 24);
  header.writeUInt32LE(RATE * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(data.length, 40);
  return Buffer.concat([header, data]);
};

const render = (
  seconds: number,
  at: (t: number, i: number) => number,
): number[] =>
  Array.from({ length: Math.floor(seconds * RATE) }, (_, i) => at(i / RATE, i));

// Deterministic noise, so the files are identical on every run.
let seed = 7;
const noise = (): number => {
  seed = (seed * 16807) % 2147483647;
  return (seed / 2147483647) * 2 - 1;
};

/** Cartoon bonk: a low tone dropping in pitch, with a short slap on top. */
const thud = render(0.45, (t) => {
  const freq = 150 * Math.exp(-t * 9) + 45;
  const body = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 9);
  const slap = noise() * Math.exp(-t * 70) * 0.5;
  return (body + slap) * 0.9;
});

/** Soft footstep: a muffled tap. */
let last = 0;
const step = render(0.12, (t) => {
  // One-pole low-pass over noise takes the hiss out.
  last += (noise() - last) * 0.12;
  return (
    last * Math.exp(-t * 45) * 2.2 +
    Math.sin(2 * Math.PI * 95 * t) * Math.exp(-t * 40) * 0.5
  );
});

// ---------------------------------------------------------------------------
// Music. An original theme, so no licence applies: a bouncy tune in C with a
// choro feel, played on marimba over a plucked bass, soft chords and a shaker.

const hz = (midi: number): number => 440 * 2 ** ((midi - 69) / 12);

type Voice = (freq: number, t: number) => number;

const marimba: Voice = (f, t) =>
  (Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 7) +
    Math.sin(2 * Math.PI * f * 4 * t) * Math.exp(-t * 22) * 0.35) *
  Math.min(1, t * 400);

const bass: Voice = (f, t) =>
  (Math.sin(2 * Math.PI * f * t) + Math.sin(2 * Math.PI * f * 2 * t) * 0.3) *
  Math.exp(-t * 5) *
  Math.min(1, t * 200);

const pad: Voice = (f, t) =>
  (Math.sin(2 * Math.PI * f * t) + Math.sin(2 * Math.PI * f * 3 * t) * 0.12) *
  Math.exp(-t * 11) *
  Math.min(1, t * 300);

const bell: Voice = (f, t) =>
  (Math.sin(2 * Math.PI * f * t) +
    Math.sin(2 * Math.PI * f * 2.76 * t) * 0.4 * Math.exp(-t * 6)) *
  Math.exp(-t * 2.6) *
  Math.min(1, t * 500);

/** Adds one note to a track. With `wrap`, the tail carries over to the start, so the loop has no seam. */
const play = (
  track: number[],
  voice: Voice,
  midi: number,
  at: number,
  gain: number,
  wrap = false,
  length = 1.4,
): void => {
  const start = Math.floor(at * RATE);
  const f = hz(midi);
  for (let i = 0; i < length * RATE; i++) {
    const index = wrap ? (start + i) % track.length : start + i;
    if (index >= track.length) break;
    track[index] = (track[index] ?? 0) + voice(f, i / RATE) * gain;
  }
};

const BPM = 112;
const EIGHTH = 60 / BPM / 2;
/** Off-beat eighths land a little late, for a light swing. */
const beatAt = (eighth: number): number =>
  (eighth + (eighth % 2 === 1 ? 0.16 : 0)) * EIGHTH;

// Eight bars, eight eighth-notes each. 0 is a rest.
const MELODY = [
  [76, 79, 76, 72, 74, 76, 72, 0],
  [67, 72, 76, 79, 76, 0, 72, 0],
  [77, 81, 77, 72, 74, 77, 81, 0],
  [79, 77, 74, 71, 74, 0, 67, 0],
  [76, 79, 76, 72, 74, 76, 79, 0],
  [81, 79, 76, 72, 69, 72, 76, 0],
  [77, 76, 74, 69, 67, 71, 74, 77],
  [76, 0, 72, 0, 67, 69, 71, 0],
].flat();
// One chord per half bar: [bass root, bass fifth, chord notes].
const C = [36, 43, 60, 64, 67];
const F = [41, 36, 60, 65, 69];
const G7 = [43, 38, 59, 62, 65];
const AM = [45, 40, 60, 64, 69];
const DM = [38, 45, 62, 65, 69];
const HARMONY = [C, C, C, C, F, F, G7, G7, C, C, AM, AM, DM, G7, C, G7];

const theme = new Array<number>(Math.floor(64 * EIGHTH * RATE)).fill(0);
MELODY.forEach((note, i) => {
  if (note) play(theme, marimba, note, beatAt(i), 0.3, true);
});
HARMONY.forEach((chord, half) => {
  const [root = 36, fifth = 43, ...notes] = chord;
  const first = half * 4;
  play(theme, bass, root, beatAt(first), 0.42, true);
  play(theme, bass, fifth, beatAt(first + 2), 0.34, true);
  // Chords answer on the off-beats: the "pah" of an oom-pah.
  for (const eighth of [first + 1, first + 3]) {
    for (const n of notes) play(theme, pad, n, beatAt(eighth), 0.07, true, 0.5);
  }
});
for (let i = 0; i < 64; i++) {
  const start = Math.floor(beatAt(i) * RATE);
  const gain = i % 2 === 1 ? 0.05 : 0.025;
  let low = 0;
  for (let n = 0; n < 0.05 * RATE; n++) {
    const white = noise();
    low += (white - low) * 0.5;
    // High-passed noise: the hiss without the rumble.
    const index = (start + n) % theme.length;
    theme[index] =
      (theme[index] ?? 0) + (white - low) * Math.exp((-n / RATE) * 90) * gain;
  }
}

// Closing jingle, timed to the end card: a falling whistle as the iris shuts,
// the theme's opening run as the card appears, then two chords to finish.
const jingle = new Array<number>(Math.floor(2.8 * RATE)).fill(0);
let phase = 0;
for (let i = 0; i < 0.55 * RATE; i++) {
  const t = i / RATE;
  const freq = 1250 * Math.exp(-t * 2.4) * (1 + 0.02 * Math.sin(t * 50));
  phase += (2 * Math.PI * freq) / RATE;
  const shape = Math.min(1, t * 40) * Math.min(1, (0.55 - t) * 12);
  jingle[i] = Math.sin(phase) * shape * 0.22;
}
[67, 72, 76, 79].forEach((n, i) => {
  play(jingle, marimba, n, 0.65 + i * 0.09, 0.4);
});
[81, 79, 76].forEach((n, i) => {
  play(jingle, marimba, n, 1.04 + i * 0.15, 0.4);
});
for (const n of [43, 59, 62, 65, 67]) play(jingle, pad, n, 1.52, 0.16);
play(jingle, bass, 36, 1.8, 0.5, false, 1);
for (const n of [60, 64, 67, 72]) play(jingle, marimba, n, 1.8, 0.24);
play(jingle, bell, 84, 1.8, 0.2, false, 1);
play(jingle, bell, 91, 1.86, 0.1, false, 1);
// Fade the very end so the file never clicks.
for (let i = 0; i < 0.25 * RATE; i++) {
  const index = jingle.length - 1 - i;
  jingle[index] = (jingle[index] ?? 0) * (i / (0.25 * RATE));
}

/** Scales a track so its loudest sample sits just under full volume. */
const normalize = (track: number[]): number[] => {
  const peak = track.reduce((m, v) => Math.max(m, Math.abs(v)), 0.001);
  return track.map((v) => (v / peak) * 0.85);
};

// ---------------------------------------------------------------------------
// Musical sound effects, in the cartoon tradition of scoring the action.

/** Plucked string, for footsteps: three rising notes. */
const pluck: Voice = (f, t) =>
  (Math.sin(2 * Math.PI * f * t) +
    Math.sin(2 * Math.PI * f * 2 * t) * 0.4 * Math.exp(-t * 30)) *
  Math.exp(-t * 16) *
  Math.min(1, t * 600);
const pizz = [60, 64, 67].map((note) => {
  const track = new Array<number>(Math.floor(0.3 * RATE)).fill(0);
  play(track, pluck, note, 0, 0.8, false, 0.3);
  return track;
});

/** Whistle sliding between two pitches. */
const slide = (seconds: number, from: number, to: number): number[] => {
  let angle = 0;
  return render(seconds, (t) => {
    const freq = from * (to / from) ** (t / seconds);
    angle += (2 * Math.PI * freq * (1 + 0.015 * Math.sin(t * 45))) / RATE;
    return (
      Math.sin(angle) *
      Math.min(1, t * 50) *
      Math.min(1, (seconds - t) * 20) *
      0.5
    );
  });
};
/** Rising while the prop hangs in the air, falling as it drops. */
const rise = slide(0.4, 500, 1100);
const fall = slide(0.28, 1300, 350);

/** One snore: a rattling breath in, a whistling breath out. */
let breath = 0;
const snore = render(1.1, (t) => {
  breath += (noise() - breath) * 0.08;
  const inhale =
    breath *
    (0.6 + 0.4 * Math.sign(Math.sin(2 * Math.PI * 38 * t))) *
    Math.sin(Math.PI * Math.min(1, t / 0.55)) *
    5;
  const out = Math.max(0, t - 0.6);
  const exhale =
    t > 0.6
      ? Math.sin(2 * Math.PI * (900 - out * 500) * t) *
        Math.sin(Math.PI * Math.min(1, out / 0.45)) *
        0.18
      : 0;
  return inhale + exhale;
});

/** Three clock ticks, a third of a second apart. */
const ticks = render(1.1, (t) => {
  const since = t % 0.36;
  const high = Math.floor(t / 0.36) % 2 === 0 ? 2100 : 1700;
  return t < 1.08
    ? Math.sin(2 * Math.PI * high * since) * Math.exp(-since * 90) * 0.8
    : 0;
});

/** Cork pop, for a sign shooting up. */
const pop = render(0.16, (t) => {
  const freq = 320 + 900 * Math.exp(-t * 40);
  return Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 28) * 0.9;
});

/** Harp-like run up a chord, for someone falling in love. */
const harp = new Array<number>(Math.floor(1.2 * RATE)).fill(0);
[72, 76, 79, 84, 88, 91].forEach((n, i) => {
  play(harp, bell, n, i * 0.07, 0.3, false, 0.8);
});

/** Scuffle: a flurry of bonks and slaps of different pitch. */
const scuffle = new Array<number>(Math.floor(1.4 * RATE)).fill(0);
for (let i = 0; i < 13; i++) {
  const start = Math.floor((i * 0.095 + Math.abs(noise()) * 0.03) * RATE);
  const pitch = 110 + Math.abs(noise()) * 260;
  for (let n = 0; n < 0.12 * RATE; n++) {
    const t = n / RATE;
    const index = start + n;
    if (index >= scuffle.length) break;
    scuffle[index] =
      (scuffle[index] ?? 0) +
      Math.sin(2 * Math.PI * pitch * Math.exp(-t * 12) * t) *
        Math.exp(-t * 30) *
        0.6 +
      noise() * Math.exp(-t * 80) * 0.35;
  }
}

const music = join(PUBLIC, "music");
mkdirSync(music, { recursive: true });
writeFileSync(join(music, "trilha.wav"), wav(normalize(theme)));
writeFileSync(join(music, "vinheta.wav"), wav(normalize(jingle)));

const dir = join(PUBLIC, "sfx");
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, "thud.wav"), wav(thud));
writeFileSync(join(dir, "step.wav"), wav(step));
pizz.forEach((track, i) => {
  writeFileSync(join(dir, `pizz${i + 1}.wav`), wav(normalize(track)));
});
writeFileSync(join(dir, "sobe.wav"), wav(rise));
writeFileSync(join(dir, "desce.wav"), wav(fall));
writeFileSync(join(dir, "ronco.wav"), wav(normalize(snore)));
writeFileSync(join(dir, "tique.wav"), wav(ticks));
writeFileSync(join(dir, "pop.wav"), wav(pop));
writeFileSync(join(dir, "harpa.wav"), wav(normalize(harp)));
writeFileSync(join(dir, "briga.wav"), wav(normalize(scuffle)));
log("Efeitos gerados em public/sfx e música em public/music");
