/**
 * Converts a hex color like "#5c0005" or "5C0005" into { r, g, b },
 * each from 0 to 255. Same idea as toRgb() in the Java version.
 */
export function hexToRgb(hex) {
  const h = hex.replace(/^#/, "");

  // Must be exactly 6 hex digits, or every color after this would be NaN
  // without this, bad color makes ever distance NaN -> < threshold is false, 
  // then the whole image turn black with no error (without saying anything or letting u know)
  // this if statement will give you a clear msg if it happend
  if (!/^[0-9a-fA-F]{6}$/.test(h)) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

// calculates distance between 2 rgb colors using the eucilidean form from centroid finder
export function colorDistance(r1, g1, b1, r2, g2, b2) {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

/**
 * Turns red, green, and blue (each 0 to 255) into a hex color like "#5c0005".
 * The opposite of hexToRgb.
 */
export function rgbToHex(r, g, b) {
  // toString(16) turn a num into hex (92 -> "5c") n padStart(2, "0") make single digits 2 characters (0 -> "00")
  return "#" + [r, g, b].map((value) => value.toString(16).padStart(2, "0")).join("");
}