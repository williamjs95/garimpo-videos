import { readFileSync } from "node:fs";
import { PNG } from "pngjs";
import type { Mouth } from "../../src/types.ts";

const BLOCK = 16;

/** Average color of each BLOCK x BLOCK cell; undefined where mostly transparent. */
const blocks = (
  img: PNG,
  cols: number,
  rows: number,
): (number[] | undefined)[] =>
  Array.from({ length: cols * rows }, (_, n) => {
    const bx = (n % cols) * BLOCK;
    const by = Math.floor(n / cols) * BLOCK;
    const sum = [0, 0, 0];
    let opaque = 0;
    for (let y = by; y < by + BLOCK; y++) {
      for (let x = bx; x < bx + BLOCK; x++) {
        const i = (y * img.width + x) * 4;
        if ((img.data[i + 3] ?? 0) < 128) continue;
        opaque++;
        for (let c = 0; c < 3; c++)
          sum[c] = (sum[c] ?? 0) + (img.data[i + c] ?? 0);
      }
    }
    return opaque > (BLOCK * BLOCK) / 2
      ? sum.map((s) => s / opaque)
      : undefined;
  });

/**
 * Finds the mouth by comparing a pose with its mouth-open twin. The drawings
 * are aligned, so the patch that changed the most is the mouth. Comparing
 * block averages ignores hairline shifts in the outlines.
 * Returns undefined when no clear patch stands out.
 */
export const findMouth = (
  closed: string,
  open: string,
  /** Vertical band to search, as fractions of the image height. */
  band: [number, number] = [0.15, 0.45],
  /** Take every changed patch in the band (two eyes), not only the strongest one. */
  whole = false,
): Mouth | undefined => {
  const a = PNG.sync.read(readFileSync(closed));
  const b = PNG.sync.read(readFileSync(open));
  if (a.width !== b.width || a.height !== b.height) return undefined;
  const cols = Math.floor(a.width / BLOCK);
  // The face is in the top half of a full-body drawing.
  const rows = Math.floor((a.height * 0.5) / BLOCK);
  const A = blocks(a, cols, rows);
  const B = blocks(b, cols, rows);

  // The mouth sits near the middle of a front-facing drawing, inside the band.
  const diff = A.map((p, n) => {
    const q = B[n];
    const fx = ((n % cols) + 0.5) / cols;
    const fy = ((Math.floor(n / cols) + 0.5) * BLOCK) / a.height;
    if (!p || !q || fx < 0.3 || fx > 0.7 || fy < band[0] || fy > band[1]) {
      return 0;
    }
    return p.reduce((s, v, c) => s + Math.abs(v - (q[c] ?? 0)), 0);
  });
  const peak = diff.reduce((m, d, n) => (d > (diff[m] ?? 0) ? n : m), 0);
  const max = diff[peak] ?? 0;
  if (max < 60) return undefined;

  const seen = new Set([peak]);
  if (whole) {
    diff.forEach((d, n) => {
      if (d >= max * 0.4) seen.add(n);
    });
  } else {
    // Grow from the strongest block over neighbours that also changed a lot.
    const queue = [peak];
    for (let n = queue.shift(); n !== undefined; n = queue.shift()) {
      const x = n % cols;
      const y = Math.floor(n / cols);
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ] as const) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
        const m = ny * cols + nx;
        if (seen.has(m) || (diff[m] ?? 0) < max * 0.4) continue;
        seen.add(m);
        queue.push(m);
      }
    }
  }
  const xs = [...seen].map((n) => n % cols);
  const ys = [...seen].map((n) => Math.floor(n / cols));
  const x0 = Math.min(...xs) * BLOCK;
  const x1 = (Math.max(...xs) + 1) * BLOCK;
  const y0 = Math.min(...ys) * BLOCK;
  const y1 = (Math.max(...ys) + 1) * BLOCK;
  // A patch much bigger than a mouth means the whole head changed.
  if (x1 - x0 > a.width * (whole ? 0.45 : 0.3) || y1 - y0 > a.height * 0.16) {
    return undefined;
  }

  const round = (n: number): number => Math.round(n * 1000) / 1000;
  return {
    x: round((x0 + x1) / 2 / a.width),
    y: round((y0 + y1) / 2 / a.height),
    rx: round(Math.max(0.06, ((x1 - x0) / 2 + BLOCK * 1.5) / a.width)),
    ry: round(Math.max(0.035, ((y1 - y0) / 2 + BLOCK * 1.5) / a.height)),
  };
};
