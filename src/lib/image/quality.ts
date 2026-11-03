import type { QualityReport } from "@/types/editor";

/** Estimates print quality from the effective source resolution. */
export function qualityReport(effectiveDpi: number): QualityReport {
  const warnings: string[] = [];
  if (effectiveDpi < 150) {
    warnings.push(
      "Low resolution — this photo will look soft or pixelated when printed. Use the original, un-cropped image for best results.",
    );
  } else if (effectiveDpi < 250) {
    warnings.push(
      "Below the 300 DPI print target — acceptable for casual prints, but sharper sources give better results.",
    );
  }
  return { effectiveDpi: Math.round(effectiveDpi), ok: effectiveDpi >= 250, warnings };
}
