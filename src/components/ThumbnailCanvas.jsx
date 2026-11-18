import { useEffect, useRef } from "react";
import { binarize } from "../lib/binarize.js";
import { hexToRgb } from "../lib/colors.js";
import { findCentroid } from "../lib/findCentroid.js";
import { drawCentroidDot } from "../lib/drawCentroidDot.js";

/**
 * The original video frame, with a dot on the centroid of the largest group.
 *
 * Props: image (a loaded HTMLImageElement), color ("#5c0005"), threshold (number)
 */
export default function ThumbnailCanvas({ image, color, threshold }) {
  const canvasRef = useRef(null);

  // Redraw whenever the image, color, or threshold changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const width = image.naturalWidth;
    const height = image.naturalHeight;

    /*
     * The canvas uses the image's real size, so pixel (x, y) on the canvas
     * is pixel (x, y) in the frame. CSS shrinks it to fit on screen.
     */
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(image, 0, 0);

    // Find the centroid from the frame's pixels, the same way BinarizedCanvas does
    const { data } = ctx.getImageData(0, 0, width, height);
    const binary = binarize(data, width, height, hexToRgb(color), threshold);
    const centroid = findCentroid(binary, width, height);

    if (centroid) {
      drawCentroidDot(ctx, centroid.x, centroid.y, width);
    }
  }, [image, color, threshold]);

  return (
    <canvas
      ref={canvasRef}
      data-testid="thumbnail-canvas"
      style={{ width: "100%", height: "auto", display: "block", borderRadius: 8 }}
    />
  );
}