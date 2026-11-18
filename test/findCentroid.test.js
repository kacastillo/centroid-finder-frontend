/**
 * Tests for src/lib/findCentroid.js, ported from DfsBinaryGroupFinderTest.java.
 *
 * The tests write images as rows (like the Java tests),
 * and find() flattens them into the format binarize() returns.
 */
import assert from "node:assert/strict";
import { findGroups, findCentroid } from "../src/lib/findCentroid.js";

// Same as the group(size, x, y) helper in the Java tests
const group = (size, x, y) => ({ size, x, y });

// Flattens rows into one array, row by row, and runs findGroups
function find(rows) {
  return findGroups(rows.flat(), rows[0].length, rows.length);
}

describe("findGroups", () => {
  // ---------- no groups ----------

  it("a single 0 has no groups", () => {
    assert.deepEqual(find([[0]]), []);
  });

  it("all zeros has no groups", () => {
    assert.deepEqual(find([[0, 0, 0], [0, 0, 0]]), []);
  });

  // ---------- groups and centroids ----------

  it("a single pixel", () => {
    assert.deepEqual(find([[1]]), [group(1, 0, 0)]);
  });

  it("horizontal line", () => {
    assert.deepEqual(find([[1, 1, 1]]), [group(3, 1, 0)]);
  });

  it("vertical line (sumY = 6, 6 / 4 = 1)", () => {
    assert.deepEqual(find([[1], [1], [1], [1]]), [group(4, 0, 1)]);
  });

  it("all ones", () => {
    assert.deepEqual(find([[1, 1, 1], [1, 1, 1]]), [group(6, 1, 0)]);
  });

  it("L shape", () => {
    assert.deepEqual(find([[1, 0], [1, 0], [1, 1]]), [group(4, 0, 1)]);
  });

  it("U shape is one group", () => {
    assert.deepEqual(find([[1, 0, 1], [1, 0, 1], [1, 1, 1]]), [group(7, 1, 1)]);
  });

  it("centroid uses integer division (1 / 2 = 0, not 0.5)", () => {
    assert.deepEqual(find([[1, 1]]), [group(2, 0, 0)]);
  });

  it("diagonal pixels are not connected", () => {
    assert.deepEqual(find([[1, 0], [0, 1]]), [group(1, 1, 1), group(1, 0, 0)]);
  });

  it("a group at the right edge doesn't wrap to the next row", () => {
    // (x=1, y=0) and (x=0, y=1) are next to each other in the flat array,
    // but not in the image
    assert.deepEqual(find([[0, 1], [1, 0]]), [group(1, 1, 0), group(1, 0, 1)]);
  });

  // ---------- sorting ----------

  it("larger group comes first", () => {
    assert.deepEqual(find([[1, 0, 1, 1, 1]]), [group(3, 3, 0), group(1, 0, 0)]);
  });

  it("ties broken by larger x first", () => {
    assert.deepEqual(find([[1, 0, 1, 0, 1]]), [group(1, 4, 0), group(1, 2, 0), group(1, 0, 0)]);
  });

  it("ties broken by larger y when x is the same", () => {
    assert.deepEqual(find([[1], [0], [1]]), [group(1, 0, 2), group(1, 0, 0)]);
  });

  // ---------- invalid input ----------

  it("null image throws", () => {
    assert.throws(() => findGroups(null, 1, 1), TypeError);
  });

  it("empty image throws", () => {
    assert.throws(() => findGroups([], 0, 0), Error);
  });

  it("size that doesn't match width * height throws", () => {
    assert.throws(() => findGroups([1, 0, 1], 2, 2), Error);
  });

  it("a value other than 0 or 1 throws", () => {
    assert.throws(() => findGroups([1, 2], 2, 1), Error);
  });

  // ---------- big input ----------

  it("a 1000 x 1000 image of 1s doesn't overflow the stack", () => {
    const binary = new Uint8Array(1000 * 1000).fill(1);
    assert.deepEqual(findGroups(binary, 1000, 1000), [group(1000000, 499, 499)]);
  });
});

describe("findCentroid", () => {
  it("returns the largest group", () => {
    assert.deepEqual(findCentroid([1, 0, 1, 1, 1], 5, 1), group(3, 3, 0));
  });

  it("returns null when there are no groups", () => {
    assert.equal(findCentroid([0, 0], 2, 1), null);
  });
});