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
  camera: "normal" | "close" | "dupla";
  /** Who shares the frame in a "dupla" shot. */
  com?: string;
  /** "brilho" lights up the speaker; "queda" drops `fxProp` on `fxTarget` after the line. */
  fx:
    | ""
    | "brilho"
    | "queda"
    | "brilho+queda"
    | "coracoes"
    | "briga"
    | "arremesso";
  fxProp: string;
  fxTarget: string;
  /** "entra": the speaker walks in as the line starts. "sai": walks out when it ends. */
  move: "" | "entra" | "sai";
  /** Pose of everyone who is listening during this line. Empty means neutro. */
  plateia: string;
  /** Sound effect at the start of the line. */
  som: "" | "scratch" | "ding" | "whoosh" | "ronco" | "tique";
  /** Text on a sign the character holds up. Lines with no `text` are silent beats. */
  placa?: string;
  /** What the speaker's phone shows, as "label|value" (e.g. "Prazo|hoje"). */
  tela?: string;
  /** Poses that stick from this line on (someone falls asleep), until changed. */
  estado?: { quem: string; pose: string }[];
  /** Playback speed of this line when it differs from the episode's (a line that is unclear sped up). */
  rate?: number;
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
  /** Where the soles are in the drawing, as a fraction of its height. */
  feet?: number;
};

/** An object standing on the floor next to a character for the whole scene. */
export type Scenery = {
  prop: string;
  beside: string;
  /** -1 puts it on the character's left, 1 on the right. */
  side: -1 | 1;
  /** Height in world pixels (a character is about 1000). */
  height: number;
};

export type EpisodeProps = {
  slug: string;
  /** Episode number in the series, shown on the title card. */
  number?: number;
  /** Left-to-right order of the characters on stage. Default: order of appearance. */
  order?: string[];
  hook: string;
  lines: Line[];
  cast: CastMember[];
  /** location id -> path relative to public/ */
  backgrounds: Record<string, string>;
  /** prop id -> path relative to public/ */
  props: Record<string, string>;
  scenery?: Scenery[];
  /** Background music, relative to public/. Loops under the whole episode. */
  music?: string;
  /** Audio playback speed (pitch preserved). Timings in `lines` are at 1x. */
  speechRate?: number;
};

export const FPS = 30;
/** Pause between lines, in milliseconds. */
export const GAP_MS = 180;
/**
 * Length of the closing every episode ends on: the iris shuts on the last
 * speaker, then the site address writes itself. Matches public/music/vinheta.wav.
 */
export const END_CARD_MS = 2800;
export const SITE = "garimpoeditais.com.br";
export const DEFAULT_MUSIC = "music/trilha.wav";
export const JINGLE = "music/vinheta.wav";
/** Extra time after a line for a "queda" gag to play out. */
export const DROP_MS = 1500;
/** Frames a dropped prop hangs in the air first, while everyone looks up. */
export const DROP_HANG_FRAMES = 13;
/** Frames a dropped prop takes to reach the target's head. */
export const DROP_FALL_FRAMES = 8;
