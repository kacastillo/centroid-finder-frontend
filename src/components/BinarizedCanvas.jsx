import { useEffect, useRef } from "react";
import { binarize } from "../lib/binarize.js";
import { hexToRgb } from "../lib/colors.js";
import { findCentroid } from "../lib/findCentroid.js";
import { drawCentroidDot } from "../lib/drawCentroidDot.js";

/**
 * The black-and-white version of the frame: white where a pixel is close
 * enough to the target color, black everywhere else. Draws a dot on the
 * centroid of the largest white group.
 *
 * Props: image (a loaded HTMLImageElement), color ("#5c0005"), threshold (number)
 */
export default function BinarizedCanvas({ image, color, threshold }) {
  const canvasRef = useRef(null);

  // Redraw whenever the image, color, or threshold changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const width = image.naturalWidth;
    const height = image.naturalHeight;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    // Draw the original frame first, only to read its pixels
    ctx.drawImage(image, 0, 0);
    const pixels = ctx.getImageData(0, 0, width, height);

    const binary = binarize(pixels.data, width, height, hexToRgb(color), threshold);

    /*
     * Turn each 0 or 1 into a black or white pixel.
     * Each pixel takes 4 slots: red, green, blue, alpha.
     */
    for (let i = 0; i < binary.length; i++) {
      const value = binary[i] === 1 ? 255 : 0;
      const p = i * 4;
      pixels.data[p] = value;
      pixels.data[p + 1] = value;
      pixels.data[p + 2] = value;
      pixels.data[p + 3] = 255;
    }

    // Replace the frame with the black-and-white pixels
    ctx.putImageData(pixels, 0, 0);

    const centroid = findCentroid(binary, width, height);
    if (centroid) {
      drawCentroidDot(ctx, centroid.x, centroid.y, width);
    }
  }, [image, color, threshold]);

  return (
    <canvas
      ref={canvasRef}
      data-testid="binarized-canvas"
      style={{ width: "100%", height: "auto", display: "block", borderRadius: 8 }}
    />
  );
}