import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { HAND_CONNECTIONS } from "@mediapipe/hands";

/**
 * Draw canvas
 * @param ctx canvas context
 * @param results Hand detection results
 */
export const drawCanvas = (ctx, results) => {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  ctx.save();
  ctx.clearRect(0, 0, width, height);
  ctx.scale(-1, 1);
  ctx.translate(-width, 0);
  ctx.drawImage(results.image, 0, 0, width, height);
  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
        color: "#00FF00",
        lineWidth: 1,
      });
      drawLandmarks(ctx, landmarks, {
        color: "#FF0000",
        lineWidth: 1,
        radius: 2,
      });
    }
    drawCircle(ctx, results.multiHandLandmarks);
  }
  ctx.restore();
};

/**
 * @param ctx
 * @param handLandmarks
 */
const drawCircle = (ctx, handLandmarks) => {
  if (handLandmarks.length > 0 && handLandmarks[0].length > 8) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const [x1, y1, z1] = [
      handLandmarks[0][8].x * width,
      handLandmarks[0][8].y * height,
      handLandmarks[0][8].z * width,
    ];
    const [x2, y2, z2] = [
      handLandmarks[0][4].x * width,
      handLandmarks[0][4].y * height,
      handLandmarks[0][4].z * width,
    ];
    const x = (x1 + x2) / 2;
    const y = (y1 + y2) / 2;
    const r =
      Math.sqrt(
        Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2)
      ) / 2;

    ctx.strokeStyle = "#0082cf";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.stroke();
  }
};
