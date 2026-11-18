import { useEffect, useRef } from "react";
import { binarize } from "../lib/binarize.js";
import { hexToRgb, rgbToHex } from "../lib/colors.js";
import { findCentroid } from "../lib/findCentroid.js";
import { drawCentroidDot } from "../lib/drawCentroidDot.js";

/**
 * The original video frame, with a dot on the centroid of the largest group.
 *
 * Eyedropper: clicking a spot on the frame picks that pixel's color.
 *
 * Props: image (a loaded HTMLImageElement), color ("#5c0005"), threshold (number),
 *        onPickColor(newColor) - optional, called with the clicked pixel's color
 */
export default function ThumbnailCanvas({ image, color, threshold, onPickColor }) {
  const canvasRef = useRef(null);

  /*
   * The frame's original pixels, saved before the dot is drawn on top,
   * so the eyedropper never picks up the green ring's color.
   */
  const pixelsRef = useRef(null);

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

    // Save the original pixels for the eyedropper
    const { data } = ctx.getImageData(0, 0, width, height);
    pixelsRef.current = data;

    // Find the centroid from the frame's pixels, the same way BinarizedCanvas does
    const binary = binarize(data, width, height, hexToRgb(color), threshold);
    const centroid = findCentroid(binary, width, height);

    if (centroid) {
      drawCentroidDot(ctx, centroid.x, centroid.y, width);
    }
  }, [image, color, threshold]);

  /**
   * Eyedropper: works out which frame pixel was clicked and sends its color up.
   */
  function handleClick(event) {
    const canvas = canvasRef.current;
    const pixels = pixelsRef.current;
    if (!onPickColor || !canvas || !pixels) return;

    /*
     * The canvas is drawn smaller on screen than its real size,
     * so scale the click position from screen pixels to frame pixels.
     */
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((event.clientX - rect.left) / rect.width) * canvas.width);
    const y = Math.floor(((event.clientY - rect.top) / rect.height) * canvas.height);

    // Ignore clicks that land just outside the frame (on the border)
    if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) return;

    // Each pixel takes 4 slots: red, green, blue, alpha
    const p = (y * canvas.width + x) * 4;
    onPickColor(rgbToHex(pixels[p], pixels[p + 1], pixels[p + 2]));
  }

  return (
    <canvas
      ref={canvasRef}
      data-testid="thumbnail-canvas"
      onClick={handleClick}
      title={onPickColor ? "Click to pick this color" : undefined}
      style={{
        width: "100%",
        height: "auto",
        display: "block",
        borderRadius: 8,
        cursor: onPickColor ? "crosshair" : "default",
      }}
    />
  );
}