import { readFileSync, writeFileSync } from "node:fs";
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
