/**
 * Checks that a recorded line can be understood, the way a viewer hears it:
 * sped up to the playback rate and transcribed without seeing the script.
 * Also measures loudness, so every line plays at the same level.
 */
import { execFileSync } from "node:child_process";
import { createReadStream, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { MODELS, openai, ROOT } from "./shared.ts";

/** ffmpeg shipped with Remotion, so nothing else needs installing. */
const FFMPEG = join(
  ROOT,
  "node_modules",
  "@remotion",
  `compositor-${process.platform}-${process.arch}`,
  "ffmpeg",
);

/** Runs ffmpeg from its own folder, where its libraries live. Paths must be absolute. */
export const ffmpeg = (args: string[]): string =>
  execFileSync(FFMPEG, ["-hide_banner", "-y", ...args], {
    cwd: dirname(FFMPEG),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

const scratch = mkdtempSync(join(tmpdir(), "diccao-"));
let counter = 0;

const UNITS =
  "zero um dois tres quatro cinco seis sete oito nove dez onze doze treze catorze quinze dezesseis dezessete dezoito dezenove".split(
    " ",
  );
const TENS =
  "_ _ vinte trinta quarenta cinquenta sessenta setenta oitenta noventa".split(
    " ",
  );
const HUNDREDS =
  "_ cento duzentos trezentos quatrocentos quinhentos seiscentos setecentos oitocentos novecentos".split(
    " ",
  );

/** 0 to 999 in words, as a transcription would need to match a script. */
const spell = (n: number): string => {
  if (n === 100) return "cem";
  if (n < 20) return UNITS[n] ?? String(n);
  if (n < 100) {
    const unit = n % 10;
    return `${TENS[Math.floor(n / 10)]}${unit ? ` e ${UNITS[unit]}` : ""}`;
  }
  if (n < 1000) {
    const rest = n % 100;
    return `${HUNDREDS[Math.floor(n / 100)]}${rest ? ` e ${spell(rest)}` : ""}`;
  }
  return String(n);
};

/** Words that sound the same but are written differently. */
const SAME: Record<string, string> = {
  pra: "para",
  pro: "para",
  ta: "esta",
  quatorze: "catorze",
  duzentas: "duzentos",
  trezentas: "trezentos",
  quatrocentas: "quatrocentos",
  quinhentas: "quinhentos",
  duas: "dois",
  uma: "um",
};

/** Lowercase words without accents, numbers spelled out. */
export const words = (text: string): string[] =>
  text
    .replace(/R\$\s?(\d+)(,\d\d)?/g, "$1 reais")
    .replace(/\d+/g, (d) => ` ${spell(Number(d))} `)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter(Boolean)
    .map((w) => SAME[w] ?? w);

/**
 * Share of the script's meaningful words (three letters or more) that the
 * listener did not catch. 0 is perfect; above LIMIT the line is unclear.
 */
export const missed = (script: string, heard: string): number => {
  const want = words(script).filter((w) => w.length >= 3);
  if (want.length === 0) return 0;
  const got = words(heard);
  const joined = new Set(got.slice(1).map((w, i) => `${got[i]}${w}`));
  const pool = new Set(got);
  const lost = want.filter((w) => !pool.has(w) && !joined.has(w));
  return lost.length / want.length;
};

export const LIMIT = 0.25;

/** Plays `file` at `rate` and writes down what a listener would hear. */
export const hear = async (
  file: string,
  rate: number,
  names: string[],
): Promise<string> => {
  const out = join(scratch, `${counter++}.mp3`);
  ffmpeg([
    "-loglevel",
    "error",
    "-i",
    file,
    "-filter:a",
    `atempo=${rate}`,
    out,
  ]);
  const tr = await openai().audio.transcriptions.create({
    model: MODELS.transcribe,
    file: createReadStream(out),
    language: "pt",
    // Names only, never the line: a viewer knows the cast, not the script.
    prompt: names.join(", "),
  });
  return tr.text;
};

export type Loudness = { lufs: number; peak: number };

/** Integrated loudness (LUFS) and true peak (dBTP), read from ffmpeg's report. */
export const loudness = (file: string): Loudness => {
  const log = execFileSync(
    "/bin/sh",
    [
      "-c",
      `"$1" -hide_banner -nostats -i "$2" -vn -af loudnorm=print_format=json -f null - 2>&1`,
      "sh",
      FFMPEG,
      resolve(file),
    ],
    { cwd: dirname(FFMPEG), encoding: "utf8" },
  );
  const read = (key: string): number =>
    Number(new RegExp(`"${key}" : "(-?[\\d.]+|-inf)"`).exec(log)?.[1] ?? NaN);
  return { lufs: read("input_i"), peak: read("input_tp") };
};

/** Every voice line is brought to this level before mixing. */
export const VOICE_LUFS = -18;

/**
 * Copies a voice clip at the common level, never letting its peak pass -1 dBTP.
 * Quiet takes come up, loud ones come down, so no line gets lost in the mix.
 */
export const levelVoice = (src: string, out: string): number => {
  const { lufs, peak } = loudness(src);
  if (!Number.isFinite(lufs)) return 0;
  const gain = Math.min(VOICE_LUFS - lufs, -1 - peak);
  ffmpeg([
    "-loglevel",
    "error",
    "-i",
    resolve(src),
    "-af",
    `volume=${gain.toFixed(2)}dB`,
    "-c:a",
    "libmp3lame",
    "-q:a",
    "2",
    resolve(out),
  ]);
  return gain;
};

/**
 * Brings a finished video to the level social platforms play at (about
 * -14 LUFS, peaks under -1 dBTP), in two passes. The picture is copied as is.
 */
export const masterVideo = (src: string, out: string): Loudness => {
  const log = execFileSync(
    "/bin/sh",
    [
      "-c",
      `"$1" -hide_banner -nostats -i "$2" -vn -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1`,
      "sh",
      FFMPEG,
      resolve(src),
    ],
    { cwd: dirname(FFMPEG), encoding: "utf8" },
  );
  const read = (key: string): string =>
    new RegExp(`"${key}" : "(-?[\\d.]+)"`).exec(log)?.[1] ?? "0";
  const measured = [
    `measured_I=${read("input_i")}`,
    `measured_TP=${read("input_tp")}`,
    `measured_LRA=${read("input_lra")}`,
    `measured_thresh=${read("input_thresh")}`,
    `offset=${read("target_offset")}`,
  ].join(":");
  ffmpeg([
    "-loglevel",
    "error",
    "-i",
    resolve(src),
    "-af",
    `loudnorm=I=-14:TP=-1.5:LRA=11:${measured}:linear=true,aresample=48000`,
    "-c:v",
    "copy",
    "-c:a",
    "aac",
    "-b:a",
    "256k",
    resolve(out),
  ]);
  return loudness(out);
};
