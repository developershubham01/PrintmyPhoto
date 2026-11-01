import type { Adjustments } from "@/types/editor";

export type CanvasSource = HTMLCanvasElement | ImageBitmap;

/** Max dimension for the full-quality baked canvas (keeps memory sane, still > 300 DPI needs). */
export const BAKE_MAX_DIM = 4000;
/** Max dimension for the fast preview baked canvas. */
export const PREVIEW_MAX_DIM = 1400;

export function isNeutral(a: Adjustments): boolean {
  return a.brightness === 1 && a.contrast === 1 && a.saturation === 1;
}

function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  return canvas;
}

export function drawScaled(
  src: CanvasSource,
  maxDim: number,
): HTMLCanvasElement {
  const sw = src.width;
  const sh = src.height;
  const scale = Math.min(1, maxDim / Math.max(sw, sh));
  const canvas = createCanvas(sw * scale, sh * scale);
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(src as CanvasImageSource, 0, 0, canvas.width, canvas.height);
  return canvas;
}

/**
 * Bakes brightness / contrast / saturation into a canvas using per-pixel math.
 * This avoids relying on ctx.filter (uneven browser support) and guarantees the
 * preview matches the exported file exactly.
 */
export function bakeAdjustments(
  src: CanvasSource,
  adj: Adjustments,
  maxDim: number,
): HTMLCanvasElement {
  const base = drawScaled(src, maxDim);
  if (isNeutral(adj)) return base;

  const ctx = base.getContext("2d")!;
  const imageData = ctx.getImageData(0, 0, base.width, base.height);
  const data = imageData.data;
  const { brightness, contrast, saturation } = adj;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Brightness (multiplicative, keeps blacks black)
    r *= brightness;
    g *= brightness;
    b *= brightness;

    // Contrast around mid gray
    r = (r - 127.5) * contrast + 127.5;
    g = (g - 127.5) * contrast + 127.5;
    b = (b - 127.5) * contrast + 127.5;

    // Saturation around luminance
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    r = luma + (r - luma) * saturation;
    g = luma + (g - luma) * saturation;
    b = luma + (b - luma) * saturation;

    data[i] = clamp255(r);
    data[i + 1] = clamp255(g);
    data[i + 2] = clamp255(b);
  }

  ctx.putImageData(imageData, 0, 0);
  return base;
}

function clamp255(v: number): number {
  return v < 0 ? 0 : v > 255 ? 255 : v;
}
