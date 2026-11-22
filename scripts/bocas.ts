/**
 * Draws a set of mouth shapes for Portuguese lip sync on each character's
 * most-used poses. Only a crop around the mouth is edited; the new mouth is
 * pasted back through a soft ellipse, color-matched to the face, and an edit
 * that changes anything outside the mouth is rejected and redrawn.
 *
 * Writes public/cast/<id>/bocas/<pose>-<shape>.png and bocas.json.
 * Usage: npm run bocas                         (missing shapes only)
 *        npm run bocas -- ze                   (one character)
 *        npm run bocas -- ze explicando aberta (one shape, to try it)
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { toFile } from "openai";
import { PNG } from "pngjs";
import type { Mouth } from "../src/types.ts";
import { crop, flatten, resize } from "./lib/raster.ts";
import {
  loadCast,
  log,
  MODELS,
  openai,
  PUBLIC,
  readJson,
  writeJson,
} from "./lib/shared.ts";

/**
 * Shapes drawn per pose. The closed mouth is the pose drawing itself, and the
 * wide-open mouth is its existing "-fala" twin: asked to open wide, the image
 * model also drops the jaw, which leaves a ghost chin when pasted.
 */
export const SHAPES: Record<string, string> = {
  dentes:
    "mouth slightly open with the upper and lower teeth together and visible, lips relaxed, as when saying 'ss' or 'te'",
  meio: "mouth slightly open with a small gap between the lips, relaxed, as when saying 'eh'",
  redonda: "lips rounded into an open 'O' shape, as when saying 'oh'",
  bico: "lips pushed forward into a small round pucker, as when saying 'oo'",
  fv: "upper front teeth resting on the lower lip, as when saying 'f'",
};

/** Two most-used speaking poses per character (counted from episodes 1-10). */
const POSES: Record<string, string[]> = {
  lici: ["animado", "chocado"],
  ze: ["animado", "explicando"],
  norberto: ["explicando", "animado"],
  katia: ["neutro", "explicando"],
};

const EDIT_SIZE = 1024;
const ATTEMPTS = 3;
/** Mean color change allowed outside the mouth (0-255), after color matching. */
const MAX_DRIFT = 22;

const cast = loadCast();
const [only, onlyPose, onlyShape] = process.argv.slice(2);

type Region = {
  x0: number;
  y0: number;
  size: number;
  /** Mouth ellipse inside the crop, as fractions of the crop. */
  mouth: Mouth;
};

/** Square crop around the mouth: nose to chin, cheek to cheek. */
const regionFor = (img: PNG, m: Mouth): Region => {
  const size = Math.round(
    Math.max(m.rx * img.width * 5.2, m.ry * img.height * 7, 300),
  );
  const cx = Math.round(m.x * img.width);
  const cy = Math.round(m.y * img.height);
  const x0 = cx - Math.round(size / 2);
  const y0 = cy - Math.round(size / 2);
  return {
    x0,
    y0,
    size,
    mouth: {
      x: 0.5,
      y: 0.5,
      rx: Math.min(0.46, (m.rx * img.width * 1.5) / size),
      ry: Math.min(0.46, (m.ry * img.height * 2.0) / size),
    },
  };
};

/** 1 inside the mouth ellipse, fading to 0 at its edge. */
const inside = (m: Mouth, fx: number, fy: number): number => {
  const d = Math.hypot((fx - m.x) / m.rx, (fy - m.y) / m.ry);
  return Math.max(0, Math.min(1, (1 - d) / 0.3));
};

/** The band just around the pasted mouth, where a mismatch would show as a seam. */
const inRing = (m: Mouth, fx: number, fy: number): boolean => {
  const d = Math.hypot((fx - m.x) / m.rx, (fy - m.y) / m.ry);
  return d >= 0.85 && d <= 1.5;
};

/** Pulls `patch` colors to `ref` using the band around the mouth. */
const matchOutside = (patch: PNG, ref: PNG, m: Mouth): void => {
  const stats = (img: PNG) => {
    const sum = [0, 0, 0];
    const sq = [0, 0, 0];
    let n = 0;
    for (let y = 0; y < img.height; y++) {
      for (let x = 0; x < img.width; x++) {
        if (!inRing(m, x / img.width, y / img.height)) continue;
        const i = (y * img.width + x) * 4;
        if ((ref.data[i + 3] ?? 0) < 200) continue;
        n++;
        for (let c = 0; c < 3; c++) {
          const v = img.data[i + c] ?? 0;
          sum[c] = sum[c]! + v;
          sq[c] = sq[c]! + v * v;
        }
      }
    }
    const mean = sum.map((s) => s / Math.max(1, n));
    const std = sq.map((s, c) =>
      Math.sqrt(Math.max(1, s / Math.max(1, n) - mean[c]! ** 2)),
    );
    return { mean, std };
  };
  const a = stats(patch);
  const b = stats(ref);
  for (let i = 0; i < patch.data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      const v =
        (((patch.data[i + c] ?? 0) - a.mean[c]!) / a.std[c]!) * b.std[c]! +
        b.mean[c]!;
      patch.data[i + c] = Math.max(0, Math.min(255, Math.round(v)));
    }
  }
};

/** Mean color difference in the band around the mouth, over opaque pixels of `ref`. */
const driftOutside = (patch: PNG, ref: PNG, m: Mouth): number => {
  let total = 0;
  let n = 0;
  for (let y = 0; y < ref.height; y++) {
    for (let x = 0; x < ref.width; x++) {
      if (!inRing(m, x / ref.width, y / ref.height)) continue;
      const i = (y * ref.width + x) * 4;
      if ((ref.data[i + 3] ?? 0) < 200) continue;
      n++;
      for (let c = 0; c < 3; c++) {
        total += Math.abs((patch.data[i + c] ?? 0) - (ref.data[i + c] ?? 0));
      }
    }
  }
  return total / Math.max(1, n * 3);
};

const drawShape = async (
  id: string,
  pose: string,
  shape: string,
  ref: PNG,
  region: Region,
  out: string,
): Promise<number> => {
  const flat = flatten(resize(ref, EDIT_SIZE, EDIT_SIZE), [235, 235, 235]);
  const input = await toFile(PNG.sync.write(flat), "crop.png", {
    type: "image/png",
  });
  let best: { patch: PNG; drift: number } | undefined;
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    const res = await openai().images.edit({
      model: MODELS.imageEdit,
      image: input,
      prompt: `Close-up of a 2D cartoon character's face. Change ONLY the mouth: ${SHAPES[shape]}. The mouth stays the same width and in the same place. Do not move the jaw, chin, cheeks or face outline. Keep the same character, the same eyes, eyebrows and facial expression, the same skin color, line thickness, art style, framing, size and position. Do not change anything outside the mouth. No text.`,
      size: "1024x1024",
      quality: "medium",
      ...(MODELS.imageEdit === "gpt-image-1.5"
        ? { input_fidelity: "high" as const }
        : {}),
    });
    const b64 = res.data?.[0]?.b64_json;
    if (!b64) continue;
    const edited = resize(
      PNG.sync.read(Buffer.from(b64, "base64")),
      region.size,
      region.size,
    );
    matchOutside(edited, ref, region.mouth);
    if (process.env.BOCAS_DEBUG) {
      const dbg = process.env.BOCAS_DEBUG;
      writeFileSync(
        join(dbg, `${id}-${pose}-${shape}-ref.png`),
        PNG.sync.write(ref),
      );
      writeFileSync(
        join(dbg, `${id}-${pose}-${shape}-${attempt}.png`),
        PNG.sync.write(edited),
      );
    }
    const drift = driftOutside(edited, ref, region.mouth);
    if (!best || drift < best.drift) best = { patch: edited, drift };
    if (drift <= MAX_DRIFT) break;
    log(
      `${id} ${pose} ${shape}: mexeu fora da boca (${drift.toFixed(1)}), de novo…`,
    );
  }
  if (!best) throw new Error(`Sem imagem para ${id} ${pose} ${shape}`);
  // Keep only the mouth: alpha is the soft ellipse, never more opaque than the
  // drawing itself.
  const { patch } = best;
  for (let y = 0; y < patch.height; y++) {
    for (let x = 0; x < patch.width; x++) {
      const i = (y * patch.width + x) * 4;
      const a = inside(region.mouth, x / patch.width, y / patch.height);
      patch.data[i + 3] = Math.round(a * (ref.data[i + 3] ?? 0));
    }
  }
  writeFileSync(out, PNG.sync.write(patch));
  return best.drift;
};

type Bocas = Record<
  string,
  { x0: number; y0: number; size: number; shapes: string[] }
>;

const queue: (() => Promise<void>)[] = [];
for (const c of cast.characters) {
  if (only && only !== c.id) continue;
  const dir = join(PUBLIC, "cast", c.id);
  const mouths = readJson<Record<string, Mouth>>(join(dir, "mouths.json"));
  const index = join(dir, "bocas.json");
  const bocas: Bocas = existsSync(index) ? readJson<Bocas>(index) : {};
  mkdirSync(join(dir, "bocas"), { recursive: true });
  for (const pose of (POSES[c.id] ?? []).filter(
    (p) => !onlyPose || p === onlyPose,
  )) {
    const m = mouths[pose];
    if (!m) continue;
    const img = PNG.sync.read(readFileSync(join(dir, `${pose}.png`)));
    const region = regionFor(img, m);
    const ref = crop(img, region.x0, region.y0, region.size, region.size);
    bocas[pose] = {
      x0: region.x0 / img.width,
      y0: region.y0 / img.height,
      size: region.size / img.width,
      shapes: bocas[pose]?.shapes ?? [],
    };
    for (const shape of Object.keys(SHAPES).filter(
      (s) => !onlyShape || s === onlyShape,
    )) {
      const out = join(dir, "bocas", `${pose}-${shape}.png`);
      if (existsSync(out)) continue;
      queue.push(async () => {
        const drift = await drawShape(c.id, pose, shape, ref, region, out);
        const entry = bocas[pose]!;
        if (!entry.shapes.includes(shape)) entry.shapes.push(shape);
        writeJson(index, bocas);
        log(`${c.name} ${pose} ${shape} (desvio ${drift.toFixed(1)})`);
      });
    }
  }
  writeJson(index, bocas);
}

const workers = Array.from({ length: 3 }, async () => {
  for (let task = queue.shift(); task; task = queue.shift()) await task();
});
await Promise.all(workers);
log("Bocas prontas.");
