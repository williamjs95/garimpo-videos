/** Small raster helpers on top of pngjs: crop, resize and paste. */
import { PNG } from "pngjs";

export const crop = (
  img: PNG,
  x0: number,
  y0: number,
  w: number,
  h: number,
): PNG => {
  const out = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const sx = Math.min(img.width - 1, Math.max(0, x0 + x));
      const sy = Math.min(img.height - 1, Math.max(0, y0 + y));
      const i = (sy * img.width + sx) * 4;
      const o = (y * w + x) * 4;
      for (let c = 0; c < 4; c++) out.data[o + c] = img.data[i + c] ?? 0;
    }
  }
  return out;
};

/** Bilinear resize. */
export const resize = (img: PNG, w: number, h: number): PNG => {
  const out = new PNG({ width: w, height: h });
  const sxk = img.width / w;
  const syk = img.height / h;
  for (let y = 0; y < h; y++) {
    const fy = Math.min(img.height - 1, Math.max(0, (y + 0.5) * syk - 0.5));
    const y1 = Math.floor(fy);
    const y2 = Math.min(img.height - 1, y1 + 1);
    const ty = fy - y1;
    for (let x = 0; x < w; x++) {
      const fx = Math.min(img.width - 1, Math.max(0, (x + 0.5) * sxk - 0.5));
      const x1 = Math.floor(fx);
      const x2 = Math.min(img.width - 1, x1 + 1);
      const tx = fx - x1;
      const o = (y * w + x) * 4;
      for (let c = 0; c < 4; c++) {
        const at = (xx: number, yy: number): number =>
          img.data[(yy * img.width + xx) * 4 + c] ?? 0;
        const top = at(x1, y1) * (1 - tx) + at(x2, y1) * tx;
        const bottom = at(x1, y2) * (1 - tx) + at(x2, y2) * tx;
        out.data[o + c] = Math.round(top * (1 - ty) + bottom * ty);
      }
    }
  }
  return out;
};

/** Copy with every transparent pixel painted `bg`, so an editor sees a solid image. */
export const flatten = (img: PNG, bg: [number, number, number]): PNG => {
  const out = new PNG({ width: img.width, height: img.height });
  for (let i = 0; i < img.data.length; i += 4) {
    const a = (img.data[i + 3] ?? 0) / 255;
    for (let c = 0; c < 3; c++) {
      out.data[i + c] = Math.round(
        (img.data[i + c] ?? 0) * a + bg[c]! * (1 - a),
      );
    }
    out.data[i + 3] = 255;
  }
  return out;
};
