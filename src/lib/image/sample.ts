/**
 * Creates the built-in sample portrait (fully local, SVG-free — drawn with Canvas2D).
 * Used by "Try with a sample photo" so users can test the editor without uploading
 * anything. The flat backdrop makes the background-removal demo work nicely.
 */
export function createSamplePhoto(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 1200;
  const ctx = canvas.getContext("2d")!;

  // Warm studio backdrop with a gentle vignette
  const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bg.addColorStop(0, "#e9e2cf");
  bg.addColorStop(1, "#d9d0b8");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const vignette = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height * 0.42,
    canvas.width * 0.2,
    canvas.width / 2,
    canvas.height * 0.42,
    canvas.width * 0.85,
  );
  vignette.addColorStop(0, "rgba(255,255,255,0.16)");
  vignette.addColorStop(1, "rgba(60,60,40,0.12)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Shoulders / jacket
  ctx.fillStyle = "#4a6a68";
  ctx.beginPath();
  ctx.ellipse(canvas.width / 2, canvas.height * 1.02, canvas.width * 0.42, canvas.height * 0.38, 0, 0, Math.PI * 2);
  ctx.fill();

  // Shirt collar triangle
  ctx.fillStyle = "#f4efe1";
  ctx.beginPath();
  ctx.moveTo(canvas.width * 0.5, canvas.height * 0.72);
  ctx.lineTo(canvas.width * 0.38, canvas.height * 0.98);
  ctx.lineTo(canvas.width * 0.62, canvas.height * 0.98);
  ctx.closePath();
  ctx.fill();

  // Neck
  ctx.fillStyle = "#c9987a";
  ctx.fillRect(canvas.width * 0.435, canvas.height * 0.55, canvas.width * 0.13, canvas.height * 0.17);

  // Head
  ctx.fillStyle = "#d8a988";
  ctx.beginPath();
  ctx.ellipse(canvas.width / 2, canvas.height * 0.4, canvas.width * 0.155, canvas.height * 0.165, 0, 0, Math.PI * 2);
  ctx.fill();

  // Hair
  ctx.fillStyle = "#3f3129";
  ctx.beginPath();
  ctx.ellipse(canvas.width / 2, canvas.height * 0.325, canvas.width * 0.16, canvas.height * 0.105, 0, Math.PI, 0);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(canvas.width * 0.5, canvas.height * 0.36, canvas.width * 0.158, canvas.height * 0.08, 0, 0, Math.PI * 2);
  ctx.fill();

  // Ears
  ctx.fillStyle = "#c9987a";
  ctx.beginPath();
  ctx.ellipse(canvas.width * 0.345, canvas.height * 0.42, canvas.width * 0.022, canvas.height * 0.03, 0, 0, Math.PI * 2);
  ctx.ellipse(canvas.width * 0.655, canvas.height * 0.42, canvas.width * 0.022, canvas.height * 0.03, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = "#2e2620";
  ctx.beginPath();
  ctx.ellipse(canvas.width * 0.44, canvas.height * 0.395, canvas.width * 0.018, canvas.height * 0.011, 0, 0, Math.PI * 2);
  ctx.ellipse(canvas.width * 0.56, canvas.height * 0.395, canvas.width * 0.018, canvas.height * 0.011, 0, 0, Math.PI * 2);
  ctx.fill();

  // Brows
  ctx.strokeStyle = "#3f3129";
  ctx.lineWidth = canvas.width * 0.012;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(canvas.width * 0.405, canvas.height * 0.362);
  ctx.lineTo(canvas.width * 0.475, canvas.height * 0.352);
  ctx.moveTo(canvas.width * 0.525, canvas.height * 0.352);
  ctx.lineTo(canvas.width * 0.595, canvas.height * 0.362);
  ctx.stroke();

  // Nose + mouth
  ctx.strokeStyle = "rgba(120,80,60,0.65)";
  ctx.lineWidth = canvas.width * 0.008;
  ctx.beginPath();
  ctx.moveTo(canvas.width * 0.5, canvas.height * 0.42);
  ctx.quadraticCurveTo(canvas.width * 0.515, canvas.height * 0.455, canvas.width * 0.49, canvas.height * 0.462);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(canvas.width * 0.455, canvas.height * 0.5);
  ctx.quadraticCurveTo(canvas.width * 0.5, canvas.height * 0.518, canvas.width * 0.545, canvas.height * 0.5);
  ctx.stroke();

  return canvas;
}

/** Converts a canvas to a File so it can flow through the normal upload pipeline. */
export async function canvasToFile(canvas: HTMLCanvasElement, name = "sample-photo.png"): Promise<File> {
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png");
  });
  return new File([blob], name, { type: "image/png" });
}
