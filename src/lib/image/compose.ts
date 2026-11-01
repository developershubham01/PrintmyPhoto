import type { BackgroundSettings } from "@/types/editor";
import { backgroundRemovedCopy } from "@/lib/image/bg-removal";

/**
 * Composites the final photo: cropped photo + background treatment.
 * Returns a canvas exactly photoW×photoH pixels at the requested DPI.
 *
 * - mode "original": photo as-is (JPG flattening will fill white where alpha exists).
 * - mode "color": solid color under the photo; when autoRemove is on, the backdrop
 *   is first made transparent so the color shows through.
 * - mode "transparent": alpha preserved (PNG only; PDF/JPG renders on white).
 */
export function composeFinalPhoto(
  croppedCanvas: HTMLCanvasElement,
  bg: BackgroundSettings,
  targetW: number,
  targetH: number,
): HTMLCanvasElement {
  const out = document.createElement("canvas");
  out.width = targetW;
  out.height = targetH;
  const ctx = out.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const photo =
    croppedCanvas.width === targetW && croppedCanvas.height === targetH
      ? croppedCanvas
      : (() => {
          const scaled = document.createElement("canvas");
          scaled.width = targetW;
          scaled.height = targetH;
          scaled
            .getContext("2d")!
            .drawImage(croppedCanvas, 0, 0, targetW, targetH);
          return scaled;
        })();

  if (bg.mode === "color") {
    ctx.fillStyle = bg.color;
    ctx.fillRect(0, 0, targetW, targetH);
    if (bg.autoRemove) {
      const { canvas: removed } = backgroundRemovedCopy(photo, bg.tolerance);
      ctx.drawImage(removed, 0, 0);
    } else {
      ctx.drawImage(photo, 0, 0);
    }
    return out;
  }

  if (bg.mode === "transparent") {
    if (bg.autoRemove) {
      const { canvas: removed } = backgroundRemovedCopy(photo, bg.tolerance);
      ctx.drawImage(removed, 0, 0);
    } else {
      ctx.drawImage(photo, 0, 0);
    }
    return out;
  }

  // original
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, targetW, targetH);
  ctx.drawImage(photo, 0, 0);
  return out;
}
