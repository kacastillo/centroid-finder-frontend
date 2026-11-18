import { colorDistance } from "./colors.js";
/**
 * Turns an image into 0s and 1s, ported from DistanceImageBinarizer.java.
 *
 * A pixel is 1 (white) if its distance to the target color is LESS THAN the
 * threshold, otherwise 0 (black). Exactly at the threshold counts as black,
 * the same as the Java version.
 * 
 **/
export function binarize(rgba, width, height, target, threshold) {
  const out = new Uint8Array(width * height);
  for (let i = 0; i < out.length; i++) {
    // Each pixel takes 4 slots in rgba: red, green, blue, alpha (alpha is ignored)
    const p = i * 4;
    const d = colorDistance(rgba[p], rgba[p + 1], rgba[p + 2], target.r, target.g, target.b);
    out[i] = d < threshold ? 1 : 0;
  }

  return out;
}