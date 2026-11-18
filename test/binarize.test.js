/**
 * Tests for src/lib/binarize.js, ported from DistanceImageBinarizerTest.java.
 */
import assert from "node:assert/strict";
import { binarize } from "../src/lib/binarize.js";
import { hexToRgb } from "../src/lib/colors.js";

/**
 * Builds fake getImageData pixels from rows of hex colors.
 * Returns { rgba, width, height }. Alpha is always 255.
 */
function imageFrom(rows) {
  const height = rows.length;
  const width = rows[0].length;
  const rgba = new Uint8ClampedArray(width * height * 4);
  rows.forEach((row, y) =>
    row.forEach((hex, x) => {
      const { r, g, b } = hexToRgb(hex);
      const p = (y * width + x) * 4;
      rgba[p] = r;
      rgba[p + 1] = g;
      rgba[p + 2] = b;
      rgba[p + 3] = 255;
    })
  );
  return { rgba, width, height };
}

// Runs binarize and returns a plain array, so it's easy to compare
function run(rows, targetHex, threshold) {
  const { rgba, width, height } = imageFrom(rows);
  return Array.from(binarize(rgba, width, height, hexToRgb(targetHex), threshold));
}

describe("binarize", () => {
  it("the exact target color is white (1)", () => {
    assert.deepEqual(run([["ff0000"]], "ff0000", 10), [1]);
  });

  it("distance exactly equal to the threshold is black (0)", () => {
    // f5 = 245, so red differs by exactly 10
    assert.deepEqual(run([["f50000"]], "ff0000", 10), [0]);
  });

  it("distance just below the threshold is white (1)", () => {
    // f6 = 246, so red differs by 9
    assert.deepEqual(run([["f60000"]], "ff0000", 10), [1]);
  });

  it("keeps pixels in row-by-row order (3 wide, 2 tall)", () => {
    const result = run(
      [
        ["000000", "000000", "ff0000"],
        ["000000", "000000", "000000"],
      ],
      "ff0000",
      10
    );
    // Pixel (x=2, y=0) is at index 0 * 3 + 2 = 2
    assert.deepEqual(result, [0, 0, 1, 0, 0, 0]);
  });

  it("close red is white, blue is black", () => {
    // fa0000 is 5 away from red; blue is 360 away
    assert.deepEqual(run([["ff0000", "fa0000", "0000ff"]], "ff0000", 10), [1, 1, 0]);
  });

  it("ignores alpha", () => {
    const { rgba, width, height } = imageFrom([["ff0000"]]);
    // Half-transparent pixel: the color should still match
    rgba[3] = 128;
    assert.deepEqual(Array.from(binarize(rgba, width, height, hexToRgb("ff0000"), 10)), [1]);
  });

  it("a threshold of 442 makes every pixel white", () => {
    assert.deepEqual(run([["000000", "ffffff"]], "000000", 442), [1, 1]);
  });

  it("a threshold of 0 makes every pixel black", () => {
    assert.deepEqual(run([["ff0000"]], "ff0000", 0), [0]);
  });
});