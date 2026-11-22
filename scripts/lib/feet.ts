import { readFileSync } from "node:fs";
import { PNG } from "pngjs";

/** Lowest opaque row of a drawing, as a fraction of its height: where the soles are. */
export const findFeet = (path: string): number => {
  const img = PNG.sync.read(readFileSync(path));
  for (let y = img.height - 1; y >= 0; y--) {
    let opaque = 0;
    for (let x = 0; x < img.width; x++) {
      if ((img.data[(y * img.width + x) * 4 + 3] ?? 0) > 128) opaque++;
    }
    // A few stray pixels are not a shoe.
    if (opaque > img.width * 0.02) return (y + 1) / img.height;
  }
  return 1;
};
