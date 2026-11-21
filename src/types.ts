export type Word = {
  text: string;
  startMs: number;
  endMs: number;
};

export type Line = {
  character: string;
  text: string;
  emotion: string;
  location: string;
  /** Drawing used while this line plays. */
  pose: string;
  /** "close" pushes in on the speaker's face. */
  camera: "normal" | "close";
  /** "brilho" lights up the speaker; "queda" drops `fxProp` on `fxTarget` after the line. */
  fx: "" | "brilho" | "queda" | "brilho+queda";
  fxProp: string;
  fxTarget: string;
  /** "entra": the speaker walks in as the line starts. "sai": walks out when it ends. */
  move: "" | "entra" | "sai";
  /** Pose of everyone who is listening during this line. Empty means neutro. */
  plateia: string;
  /** Sound effect at the start of the line. */
  som: "" | "scratch" | "ding" | "whoosh";
  /** Silence trimmed from the start of the audio file. */
  offsetMs: number;
  /** Path relative to public/, used with staticFile(). */
  audio: string;
  durationMs: number;
  words: Word[];
};

/** Where the mouth is in a pose drawing, as fractions of the image (0 to 1). */
export type Mouth = { x: number; y: number; rx: number; ry: number };

export type CastMember = {
  id: string;
  name: string;
  color: string;
  /** Folder relative to public/ holding `<pose>.png` and `<pose>-fala.png`. */
  dir: string;
  /** Height relative to the tallest character (1). */
  scale: number;
  /** pose id -> mouth region. A pose missing here talks by bouncing only. */
  mouths: Record<string, Mouth>;
  /** Eye region of the neutro drawing, for blinking. */
  blink: Mouth | null;
};

export type EpisodeProps = {
  slug: string;
  hook: string;
  lines: Line[];
  cast: CastMember[];
  /** location id -> path relative to public/ */
  backgrounds: Record<string, string>;
  /** prop id -> path relative to public/ */
  props: Record<string, string>;
  /** Shows the site handle at the end. */
  showHandle: boolean;
  /** End-card call to action, e.g. "Parte 2 →". Empty string hides it. */
  outro?: string;
  /** Audio playback speed (pitch preserved). Timings in `lines` are at 1x. */
  speechRate?: number;
};

export const FPS = 30;
/** Pause between lines, in milliseconds. */
export const GAP_MS = 180;
/** Extra hold at the end so the last line breathes before the loop. */
export const TAIL_MS = 1200;
/** How long the end card (site handle + outro) stays on screen. */
export const END_CARD_MS = 1800;
/** Extra time after a line for a "queda" gag to play out. */
export const DROP_MS = 1100;
/** Frames a dropped prop takes to reach the target's head. */
export const DROP_FALL_FRAMES = 8;
