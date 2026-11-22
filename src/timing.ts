import {
  DROP_MS,
  EXIT_MS,
  END_CARD_MS,
  type EpisodeProps,
  FPS,
  GAP_MS,
} from "./types.ts";

export type TimedLine = {
  index: number;
  from: number;
  durationInFrames: number;
  /** Frames of speech, before the gap and any gag hold. */
  speechFrames: number;
};

const msToFrames = (ms: number): number => Math.round((ms / 1000) * FPS);

/** Start frame and length of every line, laid out back to back with a short gap. */
export const layoutLines = (
  lines: EpisodeProps["lines"],
  speechRate = 1,
): TimedLine[] => {
  let cursor = 0;
  return lines.map((line, index) => {
    const rate = line.rate ?? speechRate;
    const speechFrames = Math.max(1, msToFrames(line.durationMs / rate));
    const hold =
      (line.fx.includes("queda") ? DROP_MS : 0) +
      (line.move === "sai" ? EXIT_MS : 0);
    const durationInFrames = speechFrames + msToFrames(GAP_MS + hold);
    const timed = { index, from: cursor, durationInFrames, speechFrames };
    cursor += durationInFrames;
    return timed;
  });
};

export const END_CARD_FRAMES = msToFrames(END_CARD_MS);

/** Every episode is its lines followed by the closing card. */
export const totalFrames = (
  lines: EpisodeProps["lines"],
  speechRate = 1,
): number => {
  const laid = layoutLines(lines, speechRate);
  const last = laid[laid.length - 1];
  const end = last ? last.from + last.durationInFrames : FPS;
  return end + END_CARD_FRAMES;
};
