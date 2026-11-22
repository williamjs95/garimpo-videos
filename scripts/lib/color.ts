import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { PNG } from "pngjs";

type Stats = { mean: number[]; std: number[] };

/** Per-channel mean and spread of the opaque pixels. */
const stats = (img: PNG): Stats => {
  const sum = [0, 0, 0];
  const sq = [0, 0, 0];
  let n = 0;
  for (let i = 0; i < img.data.length; i += 4) {
    if ((img.data[i + 3] ?? 0) < 128) continue;
    n++;
    for (let c = 0; c < 3; c++) {
      const v = img.data[i + c] ?? 0;
      sum[c] = (sum[c] ?? 0) + v;
      sq[c] = (sq[c] ?? 0) + v * v;
    }
  }
  const mean = sum.map((s) => s / Math.max(1, n));
  const std = sq.map((s, c) =>
    Math.sqrt(Math.max(1, s / Math.max(1, n) - (mean[c] ?? 0) ** 2)),
  );
  return { mean, std };
};

/**
 * Image edits drift warmer and more saturated with every pass. This pulls a
 * drawing's colors back to the reference drawing's, so poses match the base.
 */
export const matchColors = (target: string, reference: string): void => {
  const img = PNG.sync.read(readFileSync(target));
  const from = stats(img);
  const to = stats(PNG.sync.read(readFileSync(reference)));
  for (let i = 0; i < img.data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      const v = img.data[i + c] ?? 0;
      const out =
        ((v - (from.mean[c] ?? 0)) / (from.std[c] ?? 1)) * (to.std[c] ?? 1) +
        (to.mean[c] ?? 0);
      img.data[i + c] = Math.max(0, Math.min(255, Math.round(out)));
    }
  }
  writeFileSync(target, PNG.sync.write(img));
};

/** How a character's colors are corrected after drawing (cast.json "cores"). */
export type Recolor = {
  /** Skin color the image model tends to paint, as found in the base drawing. */
  pele: [number, number, number];
  /** Skin color the character should have. */
  peleAlvo: [number, number, number];
  /** Optional: hue (0-360) to move a red-orange hairdo to, e.g. 338 for wine. */
  cabeloMatiz?: number;
};

type Rgb = [number, number, number];

const toHsl = (r: number, g: number, b: number): Rgb => {
  const [R, G, B] = [r / 255, g / 255, b / 255];
  const max = Math.max(R, G, B);
  const min = Math.min(R, G, B);
  const l = (max + min) / 2;
  const d = max - min;
  if (!d) return [0, 0, l];
  const s = d / (1 - Math.abs(2 * l - 1));
  let h =
    max === R
      ? ((G - B) / d) % 6
      : max === G
        ? (B - R) / d + 2
        : (R - G) / d + 4;
  h *= 60;
  return [h < 0 ? h + 360 : h, s, l];
};

const toRgb = (h: number, s: number, l: number): Rgb => {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const [r, g, b] =
    h < 60
      ? [c, x, 0]
      : h < 120
        ? [x, c, 0]
        : h < 180
          ? [0, c, x]
          : h < 240
            ? [0, x, c]
            : h < 300
              ? [x, 0, c]
              : [c, 0, x];
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
};

const ramp = (v: number, from: number, to: number): number =>
  Math.max(0, Math.min(1, (v - from) / (to - from)));

const total = (c: Rgb | number[]): number =>
  (c[0] ?? 0) + (c[1] ?? 0) + (c[2] ?? 0) || 1;

/** How far a pixel may stray in hue balance from the skin and still count as skin. */
const SKIN_TOLERANCE = 0.08;

/**
 * Image models paint every cartoon skin the same orange. This moves the skin
 * of one drawing to the character's own tone, keeping its shading, and can
 * move a red-orange hairdo to another hue. The drawing's own skin tone is
 * found first (poses drift), so every pose lands on the same target.
 * Running it again on a corrected drawing changes nothing.
 */
export const recolor = (
  path: string,
  cfg: Recolor,
  /** Use this skin tone instead of detecting it (a mouth twin uses its pose's). */
  given?: Rgb,
  /** Only change pixels above this height (fraction of the image). */
  maxY = 1,
): Rgb | undefined => {
  const img = PNG.sync.read(readFileSync(path));
  const d = img.data;
  const seed = cfg.pele.map((v) => v / total(cfg.pele));

  // This drawing's skin: the most common color close to the expected one.
  const bins = new Map<string, { n: number; c: Rgb }>();
  for (let i = 0; i < d.length; i += 4) {
    if ((d[i + 3] ?? 0) < 200) continue;
    const px: Rgb = [d[i] ?? 0, d[i + 1] ?? 0, d[i + 2] ?? 0];
    const s = total(px);
    if (s < total(cfg.pele) * 0.6) continue;
    if (Math.hypot(...px.map((v, c) => v / s - (seed[c] ?? 0))) > 0.1) continue;
    const key = `${Math.round((px[0] / s) * 100)},${Math.round((px[1] / s) * 100)},${Math.round(s / 24)}`;
    const bin = bins.get(key) ?? { n: 0, c: [0, 0, 0] };
    bin.n++;
    bin.c = [bin.c[0] + px[0], bin.c[1] + px[1], bin.c[2] + px[2]];
    bins.set(key, bin);
  }
  const top = [...bins.values()].sort((a, b) => b.n - a.n)[0];
  if (!given && (!top || top.n < 200)) return undefined;
  const base: Rgb = given ?? [
    (top?.c[0] ?? 0) / (top?.n ?? 1),
    (top?.c[1] ?? 0) / (top?.n ?? 1),
    (top?.c[2] ?? 0) / (top?.n ?? 1),
  ];
  const baseSum = total(base);
  const tone = base.map((v) => v / baseSum);
  const baseHue = toHsl(...base)[0];
  const ratio = cfg.peleAlvo.map((v, c) => v / (base[c] ?? 1));

  const lastRow = Math.round(maxY * img.height) * img.width * 4;
  for (let i = 0; i < Math.min(d.length, lastRow); i += 4) {
    if ((d[i + 3] ?? 0) < 8) continue;
    const px: Rgb = [d[i] ?? 0, d[i + 1] ?? 0, d[i + 2] ?? 0];
    const s = total(px);
    const off = Math.hypot(...px.map((v, c) => v / s - (tone[c] ?? 0)));
    const shade = s / baseSum;
    const [h, sat, l] = toHsl(...px);
    // Same hue family only: gold jewellery is yellower and stays.
    const weight =
      Math.max(0, 1 - off / SKIN_TOLERANCE) *
      ramp(shade, 0.42, 0.55) *
      ramp(1.35 - shade, 0, 0.1) *
      ramp(14 - Math.abs(h - baseHue), 0, 5);
    if (weight > 0) {
      for (let c = 0; c < 3; c++) {
        const v = px[c] * (1 + weight * ((ratio[c] ?? 1) - 1));
        d[i + c] = Math.max(0, Math.min(255, Math.round(v)));
      }
      continue;
    }
    // Hair, highlights included; anything even faintly skin-like is left alone.
    if (cfg.cabeloMatiz === undefined || off < SKIN_TOLERANCE * 1.6) continue;
    const hair =
      (h >= 4 && h <= 24 ? 1 : 0) *
      ramp(sat, 0.55, 0.75) *
      ramp(0.78 - l, 0, 0.12);
    if (hair === 0) continue;
    const target = cfg.cabeloMatiz - 360;
    let hue = h + (target - h) * hair;
    if (hue < 0) hue += 360;
    const out = toRgb(hue, sat * (1 - 0.15 * hair), l * (1 - 0.05 * hair));
    for (let c = 0; c < 3; c++) d[i + c] = Math.round(out[c] ?? 0);
  }
  writeFileSync(path, PNG.sync.write(img));
  return base;
};

/**
 * Corrects each drawing of a character exactly once. Closed poses are
 * corrected in full; their mouth-open twins and the blink only show around
 * the face, and can share colors with the clothes, so they are corrected above
 * the mouth line with the closed pose's skin tone. A marker file lists the
 * drawings already corrected, so running again, or after a new pose is drawn,
 * only touches what is new. Returns how many drawings were corrected.
 */
export const recolorCharacter = (
  dir: string,
  cfg: Recolor,
  poses: string[],
  mouths: Record<string, { y: number; ry: number }>,
): number => {
  const markerPath = join(dir, "cores.json");
  type Marker = {
    cores: Recolor;
    feitos: string[];
    /** Skin tone found in each closed pose before correction. */
    tons?: Record<string, Rgb>;
  };
  const marker: Marker = existsSync(markerPath)
    ? (JSON.parse(readFileSync(markerPath, "utf8")) as Marker)
    : { cores: cfg, feitos: [] };
  if (JSON.stringify(marker.cores) !== JSON.stringify(cfg)) {
    throw new Error(
      `As cores de ${dir} já foram corrigidas com outra configuração. Restaure os desenhos originais (git) e apague cores.json antes de mudar.`,
    );
  }
  const done = new Set(marker.feitos);
  const headLine = (pose: string): number => {
    const m = mouths[pose] ?? mouths.neutro;
    return m ? Math.min(0.6, m.y + m.ry + 0.06) : 0.45;
  };
  let changed = 0;
  const fix = (file: string, given?: Rgb, maxY?: number): Rgb | undefined => {
    if (done.has(file) || !existsSync(join(dir, file))) return undefined;
    const skin = recolor(join(dir, file), cfg, given, maxY);
    done.add(file);
    changed++;
    return skin;
  };
  for (const pose of poses) {
    // The closed pose's skin tone, measured before or now, drives its twins.
    const skin = fix(`${pose}.png`);
    const tone = skin ?? marker.tons?.[pose];
    if (skin) marker.tons = { ...marker.tons, [pose]: skin };
    if (!tone) continue;
    fix(`${pose}-fala.png`, tone, headLine(pose));
    if (pose === "neutro") fix("neutro-pisca.png", tone, headLine(pose));
  }
  marker.feitos = [...done].sort();
  writeFileSync(markerPath, `${JSON.stringify(marker, null, 2)}\n`);
  return changed;
};
