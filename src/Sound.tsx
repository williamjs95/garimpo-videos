import { Audio } from "@remotion/media";
import { ding, recordScratch, whip, whoosh } from "@remotion/sfx";
import { Sequence, staticFile } from "remotion";
import type { TimedLine } from "./timing";
import { DROP_FALL_FRAMES, type Line } from "./types";

type Cue = { at: number; src: string; volume: number };

const named: Record<string, string> = {
  scratch: recordScratch,
  ding,
  whoosh,
};

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
      for (const n of [0, 5, 10]) {
        cues.push({ at: t.from + n, src: step, volume: 0.6 });
      }
    }
    if (l.move === "sai") {
      for (const n of [0, 5, 10]) {
        cues.push({ at: t.from + t.speechFrames + n, src: step, volume: 0.6 });
      }
    }
    if (l.fx.includes("brilho"))
      cues.push({ at: t.from, src: ding, volume: 0.5 });
    if (l.fx.includes("queda")) {
      const start = t.from + t.speechFrames + 2;
      cues.push({ at: start, src: whoosh, volume: 0.35 });
      cues.push({ at: start + DROP_FALL_FRAMES, src: thud, volume: 0.9 });
    }
    const extra = named[l.som];
    if (extra) cues.push({ at: t.from, src: extra, volume: 0.45 });
  }
  return cues;
};

export const Sound: React.FC<{ lines: Line[]; timed: TimedLine[] }> = ({
  lines,
  timed,
}) => (
  <>
    {cuesFor(lines, timed).map((c, i) => (
      <Sequence key={i} from={c.at} layout="none">
        <Audio src={c.src} volume={c.volume} />
      </Sequence>
    ))}
  </>
);
