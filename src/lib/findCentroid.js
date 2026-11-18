/**
 * Finds connected groups of 1s in a binary image, ported from DfsBinaryGroupFinder.java.
 *
 * Works on the flat array from binarize(): pixel (x, y) is at index y * width + x.
 *
 * - Pixels connect up, down, left, and right, NOT diagonally.
 * - A group's centroid is the average x and average y of its pixels,
 *   using integer division (Math.floor), like the Java version.
 * - Groups come back sorted largest first. Ties go to the larger x,
 *   then the larger y (Group.compareTo, in descending order).
 */

/**
 * @param {Uint8Array | number[]} binary - one 0 or 1 per pixel, row by row
 * @param {number} width
 * @param {number} height
 * @returns {{ size: number, x: number, y: number }[]} groups, largest first
 */
export function findGroups(binary, width, height) {
  validate(binary, width, height);

  const visited = new Uint8Array(width * height);
  const groups = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      if (binary[i] === 1 && !visited[i]) {
        groups.push(exploreGroup(binary, visited, width, height, x, y));
      }
    }
  }

  // Biggest first; ties go to the larger x, then the larger y
  groups.sort((a, b) => b.size - a.size || b.x - a.x || b.y - a.y);
  return groups;
}

/**
 * Returns the centroid of the largest group, or null if there are no groups.
 * This is where the dot gets drawn.
 */
export function findCentroid(binary, width, height) {
  const groups = findGroups(binary, width, height);
  return groups.length > 0 ? groups[0] : null;
}

/**
 * Explores one group with a stack (iterative DFS, so big groups can't
 * overflow the call stack) and returns its size and centroid.
 */
function exploreGroup(binary, visited, width, height, startX, startY) {
  // Up, down, left, right
  const dx = [0, 0, -1, 1];
  const dy = [-1, 1, 0, 0];

  let sumX = 0;
  let sumY = 0;
  let size = 0;

  // Mark a pixel visited when it is pushed, so it is never pushed twice
  const stack = [startY * width + startX];
  visited[startY * width + startX] = 1;

  while (stack.length > 0) {
    const i = stack.pop();
    const x = i % width;
    const y = Math.floor(i / width);

    size++;
    sumX += x;
    sumY += y;

    for (let k = 0; k < 4; k++) {
      const nx = x + dx[k];
      const ny = y + dy[k];
      if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;

      const ni = ny * width + nx;
      if (binary[ni] === 1 && !visited[ni]) {
        visited[ni] = 1;
        stack.push(ni);
      }
    }
  }

  return { size, x: Math.floor(sumX / size), y: Math.floor(sumY / size) };
}

/**
 * Same idea as validate() in the Java version:
 * a non-empty image whose size matches width * height, with only 0s and 1s.
 */
function validate(binary, width, height) {
  if (binary == null) {
    throw new TypeError("image must not be null");
  }
  if (!(width > 0 && height > 0)) {
    throw new Error("image must not be empty");
  }
  if (binary.length !== width * height) {
    throw new Error("image size must match width * height");
  }
  for (let i = 0; i < binary.length; i++) {
    if (binary[i] !== 0 && binary[i] !== 1) {
      throw new Error("image must contain only 0s and 1s");
    }
  }
}