/**
 * Synthesizes the few sound effects the Remotion library lacks (a soft thud
 * and a footstep) as small WAV files in public/sfx. Run once: npm run sfx
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

const dir = join(PUBLIC, "sfx");
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, "thud.wav"), wav(thud));
writeFileSync(join(dir, "step.wav"), wav(step));
log("Efeitos gerados em public/sfx");
