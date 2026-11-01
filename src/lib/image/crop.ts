import type { Transform } from "@/types/editor";
import { mmToPx } from "@/lib/dimensions";

/**
 * Renders the cropped photo into a canvas of the exact physical size
 * (photoWmm × photoHmm at `dpi`), applying zoom / pan / rotation.
 *
 * The transform model mirrors the interactive cropper:
 * - Base "cover" scale makes the rotated source fully cover the frame at zoom = 1.
 * - offsetX/offsetY are fractions of the frame size and are clamped so the
 *   frame is never left empty at zoom ≥ 1.
 */
export function renderCroppedPhoto(
  source: HTMLCanvasElement | ImageBitmap,
  transform: Transform,
  photoWmm: number,
  photoHmm: number,
  dpi: number,
): HTMLCanvasElement {
  const frameW = Math.max(1, Math.round(mmToPx(photoWmm, dpi)));
  const frameH = Math.max(1, Math.round(mmToPx(photoHmm, dpi)));

  const canvas = document.createElement("canvas");
  canvas.width = frameW;
  canvas.height = frameH;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const srcW = source.width;
  const srcH = source.height;
  const swapped = transform.rotation % 180 !== 0;
  const visW = swapped ? srcH : srcW;
  const visH = swapped ? srcW : srcH;

  const baseScale = Math.max(frameW / visW, frameH / visH);
  const drawScale = baseScale * transform.zoom;

  // Clamp pan so the frame stays covered whenever the drawn image is larger than the frame.
  const drawnW = visW * drawScale;
  const drawnH = visH * drawScale;
  const maxOffX = Math.max(0, (drawnW - frameW) / 2) / frameW;
  const maxOffY = Math.max(0, (drawnH - frameH) / 2) / frameH;
  const offX = clamp(transform.offsetX, -maxOffX, maxOffX);
  const offY = clamp(transform.offsetY, -maxOffY, maxOffY);

  ctx.translate(frameW / 2 + offX * frameW, frameH / 2 + offY * frameH);
  ctx.rotate((transform.rotation * Math.PI) / 180);
  ctx.scale(drawScale, drawScale);
  ctx.drawImage(source as CanvasImageSource, -srcW / 2, -srcH / 2);

  return canvas;
}

/** Pixels of source resolution that end up inside the frame — used for DPI checks.
 * Scaling is isotropic, so the effective DPI is identical in x and y:
 * source px per frame mm = 1 / (baseScale_in_mm * zoom), and DPI = that × 25.4.
 */
export function effectiveSourceDpi(
  source: HTMLCanvasElement | ImageBitmap,
  transform: Transform,
  photoWmm: number,
  photoHmm: number,
): number {
  const swapped = transform.rotation % 180 !== 0;
  const visW = swapped ? source.height : source.width;
  const visH = swapped ? source.width : source.height;
  // baseScale in frame-mm per source-px (cover fit)
  const baseScale = Math.max(photoWmm / visW, photoHmm / visH);
  if (baseScale <= 0 || transform.zoom <= 0) return 0;
  return 25.4 / (baseScale * transform.zoom);
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(Math.max(v, min), max);
}
