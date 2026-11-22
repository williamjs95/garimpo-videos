import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import OpenAI from "openai";

export const ROOT = join(import.meta.dirname, "..", "..");
export const PUBLIC = join(ROOT, "public");
export const EPISODES = join(ROOT, "episodes");

// .env.local first so it wins: loadEnvFile never overwrites a variable already set.
for (const file of [".env.local", ".env"]) {
  if (existsSync(join(ROOT, file))) {
    process.loadEnvFile(join(ROOT, file));
  }
}

export const MODELS = {
  text: process.env.OPENAI_TEXT_MODEL ?? "gpt-5-mini",
  tts: process.env.OPENAI_TTS_MODEL ?? "gpt-audio-1.5",
  image: process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-1-mini",
  /** Draws poses from the base drawing. Needs a model with high input fidelity so poses stay aligned. */
  imageEdit: process.env.OPENAI_IMAGE_EDIT_MODEL ?? "gpt-image-1.5",
  transcribe: process.env.OPENAI_TRANSCRIBE_MODEL ?? "whisper-1",
  /** 0.25 to 4. Short-form pacing wants a bit faster than natural. */
  ttsSpeed: Number(process.env.OPENAI_TTS_SPEED ?? "1.2"),
};

let client: OpenAI | undefined;
export const openai = (): OpenAI => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      "OPENAI_API_KEY não encontrada. Copie .env.example para .env.local e preencha a chave.",
    );
  }
  client ??= new OpenAI();
  return client;
};

export type Character = {
  id: string;
  name: string;
  role: string;
  look: string;
  /** Fixed line the character is known for. */
  catchphrase: string;
  /** Height relative to the tallest character (1). Short characters use less. */
  scale?: number;
  /** Pose directions that replace the shared ones for this character. */
  poses?: Record<string, string>;
  voice: string;
  voiceStyle: string;
  color: string;
};

export type Cast = {
  style: string;
  /** pose id -> drawing direction. "neutro" is the base every other pose is drawn from. */
  poses: Record<string, string>;
  characters: Character[];
  locations: Record<string, string>;
};

export const loadCast = (): Cast =>
  JSON.parse(readFileSync(join(ROOT, "cast.json"), "utf8")) as Cast;

export type ScriptLine = {
  character: string;
  text: string;
  emotion: string;
  location: string;
  /** Drawing used while this line plays; a key of cast.poses. */
  pose: string;
  /** "close" pushes in on the speaker's face. */
  camera: "normal" | "close" | "dupla";
  /** Who shares the frame in a "dupla" shot. */
  com?: string;
  /** Visual gag: "brilho" lights up the speaker, "queda" drops fxProp on fxTarget after the line. */
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
  /** "entra": the speaker walks in as the line starts. "sai": walks out when it ends. "frente": steps toward the camera while speaking. */
  move?: "" | "entra" | "sai" | "frente";
  /** Pose of everyone who is listening during this line. Empty means neutro. */
  plateia?: string;
  /** Sound effect at the start of the line. */
  som?: "" | "scratch" | "ding" | "whoosh" | "ronco" | "tique";
  /** Text on a sign the character holds up instead of speaking. */
  placa?: string;
  /** Length of a silent beat (a line with empty `text`), in milliseconds. */
  pausaMs?: number;
  /** What the speaker's phone shows, as "label|value" (e.g. "Prazo|hoje"). */
  tela?: string;
  /** Poses that stick from this line on, e.g. someone falls asleep. Empty pose clears it. */
  estado?: { quem: string; pose: string }[];
};

/** Poses nobody speaks in, so they need no mouth-open twin. */
export const MUTE_POSES = ["dormindo"];

export type ScriptProp = {
  id: string;
  description: string;
  /** How heavy it is when it falls: "leve", "medio" (default) or "pesado". */
  peso?: "leve" | "medio" | "pesado";
};

/** An object that stands on the floor beside a character all episode long. */
export type ScriptScenery = {
  /** Id of an entry in `props`. */
  prop: string;
  /** Character it stands next to. */
  junto: string;
  lado?: "esquerda" | "direita";
  /** Height in pixels; a character is about 1000. */
  altura?: number;
};

export type EpisodeScript = {
  /** Position in the series, starting at 1. Shown on the title card and in file names. */
  number?: number;
  slug: string;
  title: string;
  hook: string;
  mentionsGarimpo: boolean;
  /** Objects used by "queda" gags and by `cenario`, drawn once by npm run art. */
  props?: ScriptProp[];
  cenario?: ScriptScenery[];
  /** Left-to-right order of the characters on stage. Default: order of appearance. */
  posicoes?: string[];
  lines: ScriptLine[];
  post: {
    tiktok: string;
    reels: string;
    shortsTitle: string;
    shortsDescription: string;
    hashtags: string[];
  };
};

export const readJson = <T>(path: string): T =>
  JSON.parse(readFileSync(path, "utf8")) as T;

export const writeJson = (path: string, data: unknown): void => {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
};

/** "ep03-slug": the name of an episode's video and stills. */
export const outName = (script: EpisodeScript): string =>
  script.number
    ? `ep${String(script.number).padStart(2, "0")}-${script.slug}`
    : script.slug;

export const episodeDir = (slug: string): string => join(EPISODES, slug);

export const requireSlug = (): string => {
  const slug = process.argv[2];
  if (!slug) {
    throw new Error(
      "Informe o slug do episódio. Ex.: npm run voice -- cida-wifi",
    );
  }
  if (!existsSync(join(episodeDir(slug), "script.json"))) {
    throw new Error(
      `episodes/${slug}/script.json não existe. Rode npm run write primeiro.`,
    );
  }
  return slug;
};

export const log = (msg: string): void => {
  console.log(`› ${msg}`);
};

/**
 * Audio file name for a line, derived from everything that shapes the voice.
 * A line keeps its recording when the script is reordered, and gets a new one
 * as soon as its text, direction or voice changes.
 */
export const voiceFile = (character: Character, line: ScriptLine): string => {
  const key = [
    character.voice,
    character.voiceStyle,
    line.text,
    line.emotion,
    MODELS.tts,
    MODELS.ttsSpeed,
  ].join("|");
  const hash = createHash("sha1").update(key).digest("hex").slice(0, 10);
  return `${character.id}-${hash}.mp3`;
};
