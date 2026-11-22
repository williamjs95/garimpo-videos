import { Audio } from "@remotion/media";
import { ding, recordScratch, whip, whoosh } from "@remotion/sfx";
import { interpolate, Sequence, staticFile } from "remotion";
import type { TimedLine } from "./timing";
import { DROP_FALL_FRAMES, DROP_HANG_FRAMES, JINGLE, type Line } from "./types";

type Cue = { at: number; src: string; volume: number };

const sfx = (name: string): string => staticFile(`sfx/${name}.wav`);

const named = (som: string): string | undefined =>
  ({
    scratch: recordScratch,
    ding,
    whoosh,
    ronco: sfx("ronco"),
    tique: sfx("tique"),
  })[som];

/** Sound effects, derived from what happens on screen so scripts stay simple. */
const cuesFor = (lines: Line[], timed: TimedLine[]): Cue[] => {
  const thud = staticFile("sfx/thud.wav");
  const step = staticFile("sfx/step.wav");
  const cues: Cue[] = [{ at: 0, src: whoosh, volume: 0.3 }];
  for (const t of timed) {
    const l = lines[t.index];
    if (!l) continue;
    if (l.camera === "close")
      cues.push({ at: t.from, src: whip, volume: 0.18 });
    if (l.move === "entra") {
      // Each step lands on a plucked note, climbing as they arrive.
      [0, 5, 10].forEach((n, i) => {
        cues.push({ at: t.from + n, src: step, volume: 0.6 });
        cues.push({ at: t.from + n, src: sfx(`pizz${i + 1}`), volume: 0.3 });
      });
    }
    if (l.move === "sai") {
      [0, 5, 10].forEach((n, i) => {
        const at = t.from + t.speechFrames + n;
        cues.push({ at, src: step, volume: 0.6 });
        cues.push({ at, src: sfx(`pizz${3 - i}`), volume: 0.3 });
      });
    }
    if (l.fx.includes("brilho"))
      cues.push({ at: t.from, src: ding, volume: 0.5 });
    if (l.fx.includes("queda")) {
      const start = t.from + t.speechFrames + 2;
      // A whistle climbs while the prop hangs, then dives with it.
      const drop = start + DROP_HANG_FRAMES;
      cues.push({ at: start, src: sfx("sobe"), volume: 0.3 });
      cues.push({ at: drop, src: sfx("desce"), volume: 0.35 });
      cues.push({ at: drop + DROP_FALL_FRAMES, src: thud, volume: 0.9 });
    }
    if (l.fx === "coracoes")
      cues.push({ at: t.from, src: sfx("harpa"), volume: 0.35 });
    if (l.fx === "briga")
      cues.push({ at: t.from, src: sfx("briga"), volume: 0.7 });
    if (l.placa) cues.push({ at: t.from + 4, src: sfx("pop"), volume: 0.6 });
    const extra = named(l.som);
    if (extra) cues.push({ at: t.from, src: extra, volume: 0.45 });
  }
  return cues;
};

/** Quiet enough to sit under the voices. */
const MUSIC_VOLUME = 0.08;

export const Sound: React.FC<{
  lines: Line[];
  timed: TimedLine[];
  music: string;
  /** Frame the closing card starts on: the music hands over to the jingle. */
  cardFrom: number;
}> = ({ lines, timed, music, cardFrom }) => (
  <>
    <Audio
      src={staticFile(music)}
      loop
      volume={(f) =>
        MUSIC_VOLUME *
        interpolate(f, [0, 12, cardFrom - 6, cardFrom + 8], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />
    <Sequence from={cardFrom} layout="none">
      <Audio src={staticFile(JINGLE)} volume={0.6} />
    </Sequence>
    {cuesFor(lines, timed).map((c, i) => (
      <Sequence key={i} from={c.at} layout="none">
        <Audio src={c.src} volume={c.volume} />
      </Sequence>
    ))}
  </>
);
