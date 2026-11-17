import { colorDistance } from "./colors.js";

export function binarize(rgba, width, height, target, threshold) {
  const out = new Uint8Array(width * height);
  for (let i = 0; i < out.length; i++) {
    const p = i * 4;
    const d = colorDistance(rgba[p], rgba[p + 1], rgba[p + 2], target.r, target.g, target.b);
    out[i] = d < threshold ? 1 : 0;
  }
  return out;
}