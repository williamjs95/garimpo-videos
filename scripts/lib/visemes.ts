/**
 * Mouth shapes for Brazilian Portuguese, frame by frame. The text says which
 * shape each sound needs; the voice's loudness says when the mouth is closed
 * and how far it opens. No phoneme aligner is needed: each word's sounds are
 * spread across that word's timing.
 *
 * Shapes: fechada (lips together: p, b, m), dentes (teeth: s, t, d, n, l, r,
 * i), meio (e, and voiced gaps), aberta (a), redonda (o), bico (u, "ão" end,
 * final l), fv (f, v).
 */

export type Shape =
  | "fechada"
  | "dentes"
  | "meio"
  | "aberta"
  | "redonda"
  | "bico"
  | "fv";

type Unit = { shape: Shape; weight: number };

const VOWEL = /[aáàâãeéêiíoóôõuú]/;

const vowelShape = (ch: string): Shape => {
  if ("aáàâã".includes(ch)) return "aberta";
  if ("eéê".includes(ch)) return "meio";
  if ("ií".includes(ch)) return "dentes";
  if ("oóôõ".includes(ch)) return "redonda";
  return "bico";
};

/** The sounds of one written word, in order, as mouth shapes. */
export const soundsOf = (word: string): Unit[] => {
  const w = word.toLowerCase().replace(/[^a-záàâãéêíóôõúç]/g, "");
  const units: Unit[] = [];
  for (let i = 0; i < w.length; i++) {
    const ch = w[i]!;
    const next = w[i + 1] ?? "";
    const rest = w.slice(i + 1);
    // "ão": the mouth opens, then rounds.
    if (ch === "ã" && next === "o") {
      units.push(
        { shape: "aberta", weight: 1 },
        { shape: "bico", weight: 0.7 },
      );
      i++;
      continue;
    }
    // "qu"/"gu" before e or i: the u is silent.
    if (
      (ch === "q" || ch === "g") &&
      next === "u" &&
      /[eéêií]/.test(w[i + 2] ?? "")
    ) {
      units.push({ shape: "dentes", weight: 0.6 });
      i++;
      continue;
    }
    // "lh", "nh", "ch": one sound.
    if ((ch === "l" || ch === "n") && next === "h") {
      units.push({ shape: "dentes", weight: 0.6 });
      i++;
      continue;
    }
    if (ch === "c" && next === "h") {
      units.push({ shape: "bico", weight: 0.6 });
      i++;
      continue;
    }
    if (ch === "h") continue;
    if (VOWEL.test(ch)) {
      units.push({ shape: vowelShape(ch), weight: 1 });
      continue;
    }
    // A nasal after a vowel at the end of a syllable ("tem", "um", "campo")
    // is not a closed mouth in Portuguese.
    const nasalCoda =
      (ch === "m" || ch === "n") &&
      i > 0 &&
      VOWEL.test(w[i - 1]!) &&
      !VOWEL.test(next);
    if (nasalCoda) continue;
    if (ch === "p" || ch === "b" || ch === "m") {
      units.push({ shape: "fechada", weight: 0.6 });
      continue;
    }
    if (ch === "f" || ch === "v") {
      units.push({ shape: "fv", weight: 0.6 });
      continue;
    }
    // A final l sounds like u in Brazil ("sol", "papel").
    if (ch === "l" && !rest) {
      units.push({ shape: "bico", weight: 0.6 });
      continue;
    }
    units.push({ shape: "dentes", weight: 0.5 });
  }
  return units;
};

/**
 * One shape per video frame. `levels` is the loudness track (0 silent, 1 half,
 * 2 loud); `words` carry timings in ms at normal speed, played at `rate`.
 */
export const shapeTrack = (
  levels: number[],
  words: { text: string; startMs: number; endMs: number }[],
  rate: number,
): Shape[] => {
  const fromText: (Shape | undefined)[] = levels.map(() => undefined);
  const frameOf = (ms: number): number => (ms / rate / 1000) * 30;
  for (const w of words) {
    const units = soundsOf(w.text);
    if (units.length === 0) continue;
    const total = units.reduce((s, u) => s + u.weight, 0);
    const start = frameOf(w.startMs);
    const span = frameOf(w.endMs) - start;
    let cursor = start;
    for (const u of units) {
      const end = cursor + (span * u.weight) / total;
      // Shapes lead the sound by a frame, as animators do.
      for (let f = Math.floor(cursor) - 1; f < Math.ceil(end) - 1; f++) {
        if (f >= 0 && f < fromText.length) fromText[f] = u.shape;
      }
      cursor = end;
    }
  }
  const out: Shape[] = levels.map((level, f) => {
    const shape = fromText[f];
    if (level === 0) return "fechada";
    if (shape === "fechada") return "fechada";
    if (!shape) return "meio";
    // A quiet "a" is only half open.
    if (shape === "aberta" && level === 1) return "meio";
    return shape;
  });
  // Every shape holds at least two frames.
  for (let f = 1; f < out.length - 1; f++) {
    if (out[f] !== out[f - 1] && out[f] !== out[f + 1]) {
      out[f + 1] = out[f]!;
      f++;
    }
  }
  return out;
};
