import assert from "node:assert/strict";
import { colorDistance, hexToRgb, rgbToHex } from "../src/lib/colors.js";
/**
 * Tests for src/lib/colors.js, ported from EuclideanColorDistanceTest.java.
 * Same colors, same expected answers as the Java tests.
 */
// Same tolerance as the Java tests (assertEquals(expected, actual, 0.0001))
function assertClose(actual, expected) {
  assert.ok(Math.abs(actual - expected) < 0.0001, `expected ${expected}, got ${actual}`);
}

// Distance between two hex colors, so the tests read like the Java ones
function distance(hexA, hexB) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  return colorDistance(a.r, a.g, a.b, b.r, b.g, b.b);
}

describe("colorDistance", () => {
  it("same color is 0", () => {
    assertClose(distance("ffffff", "ffffff"), 0);
  });

  it("black to white is the largest distance", () => {
    assertClose(distance("000000", "ffffff"), 441.6729559300637);
  });

  it("only red differs", () => {
    assertClose(distance("ff0000", "000000"), 255);
  });

  it("only green differs", () => {
    assertClose(distance("00ff00", "000000"), 255);
  });

  it("only blue differs", () => {
    assertClose(distance("0000ff", "000000"), 255);
  });

  it("red to blue (catches mixing up red and blue)", () => {
    assertClose(distance("ff0000", "0000ff"), 360.62445840513925);
  });

  it("mixed colors", () => {
    assertClose(distance("123456", "654321"), 99.61425600786265);
  });

  it("is the same in both directions", () => {
    assertClose(distance("123456", "654321"), distance("654321", "123456"));
  });
});

describe("hexToRgb", () => {
  it("splits a color into red, green, blue", () => {
    assert.deepEqual(hexToRgb("123456"), { r: 0x12, g: 0x34, b: 0x56 });
  });

  it("works with a # in front and capital letters", () => {
    assert.deepEqual(hexToRgb("#5C0005"), { r: 92, g: 0, b: 5 });
  });

  it("rejects a bad color", () => {
    assert.throws(() => hexToRgb("zz"));
  });
});

describe("rgbToHex", () => {
  it("turns red, green, blue into a hex color", () => {
    assert.equal(rgbToHex(92, 0, 5), "#5c0005");
  });

  it("pads single digits with a 0", () => {
    assert.equal(rgbToHex(0, 0, 0), "#000000");
  });

  it("is the opposite of hexToRgb", () => {
    const { r, g, b } = hexToRgb("#a1b2c3");
    assert.equal(rgbToHex(r, g, b), "#a1b2c3");
  });
});