import { mmToPx } from "@/lib/dimensions";
import type { Placement } from "@/types/editor";

export interface SheetRenderOptions {
  paperWmm: number;
  paperHmm: number;
  dpi: number;
  placements: Placement[];
  photoWmm: number;
  photoHmm: number;
  photoCanvas: HTMLCanvasElement;
  /** Base color under everything (photos with transparency sit on this). */
  paperColor?: string;
}

/** Renders the full print sheet at the requested DPI. Photos are placed at exact physical positions. */
export function renderSheetCanvas(opts: SheetRenderOptions): HTMLCanvasElement {
  const { paperWmm, paperHmm, dpi, placements, photoWmm, photoHmm, photoCanvas } = opts;
  const sheetW = Math.round(mmToPx(paperWmm, dpi));
  const sheetH = Math.round(mmToPx(paperHmm, dpi));

  const canvas = document.createElement("canvas");
  canvas.width = sheetW;
  canvas.height = sheetH;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.fillStyle = opts.paperColor ?? "#ffffff";
  ctx.fillRect(0, 0, sheetW, sheetH);

  const pxW = mmToPx(photoWmm, dpi);
  const pxH = mmToPx(photoHmm, dpi);
  for (const p of placements) {
    ctx.drawImage(photoCanvas, mmToPx(p.x, dpi), mmToPx(p.y, dpi), pxW, pxH);
  }
  return canvas;
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: "image/jpeg" | "image/png",
  quality = 0.95,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas export failed"))),
      type,
      quality,
    );
  });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Clean the temporary object URL shortly after the download starts.
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}
