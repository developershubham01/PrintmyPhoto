"use client";

import { useMemo } from "react";
import { useEditorStore } from "@/lib/store/editor-store";
import { renderCroppedPhoto } from "@/lib/image/crop";
import { composeFinalPhoto } from "@/lib/image/compose";
import { mmToPx } from "@/lib/dimensions";

/**
 * Produces the composed final photo (crop + adjustments + background) as a canvas
 * at exact 300 DPI pixel dimensions for the selected photo size. Used for both
 * the interactive sheet preview and (at full source resolution) the exports.
 */
export function useFinalPhotoCanvas(): HTMLCanvasElement | null {
  const previewBaked = useEditorStore((s) => s.previewBaked);
  const bakedVersion = useEditorStore((s) => s.bakedVersion);
  const transform = useEditorStore((s) => s.transform);
  const bg = useEditorStore((s) => s.bg);
  const photoSize = useEditorStore((s) => s.photoSize);

  return useMemo(() => {
    void bakedVersion;
    if (!previewBaked) return null;
    const w = mmToPx(photoSize.widthMm, 300);
    const h = mmToPx(photoSize.heightMm, 300);
    const cropped = renderCroppedPhoto(previewBaked, transform, photoSize.widthMm, photoSize.heightMm, 300);
    return composeFinalPhoto(cropped, bg, Math.round(w), Math.round(h));
  }, [previewBaked, bakedVersion, transform, bg, photoSize]);
}
