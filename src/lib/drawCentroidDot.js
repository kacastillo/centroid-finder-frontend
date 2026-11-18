/**
 * Draws a green ring at (x, y) to mark the centroid.
 * Used by both ThumbnailCanvas and BinarizedCanvas, so the dots look the same.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} imageWidth - used to size the ring, so it's visible on big and small frames
 */
export function drawCentroidDot(ctx, x, y, imageWidth) {
  const radius = Math.max(6, imageWidth / 80);

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.lineWidth = Math.max(2, radius / 3);
  ctx.strokeStyle = "#39ff14";
  ctx.stroke();
}