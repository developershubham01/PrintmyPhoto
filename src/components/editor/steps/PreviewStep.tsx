"use client";

import { useState } from "react";
import { SheetWorkspace, type ZoomMode } from "@/components/editor/SheetWorkspace";
import { orientedPaper, useEditorStore } from "@/lib/store/editor-store";
import { qualityReport } from "@/lib/image/quality";
import { effectiveSourceDpi } from "@/lib/image/crop";
import { formatDimensions } from "@/lib/dimensions";
import { Toggle } from "@/components/ui/toggle";
import { CheckCircle2, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const ZOOMS: Array<{ value: ZoomMode; label: string }> = [
  { value: "fit", label: "Fit" },
  { value: "50", label: "50%" },
  { value: "75", label: "75%" },
  { value: "100", label: "100%" },
];

export function PreviewStep() {
  const [zoom, setZoom] = useState<ZoomMode>("fit");
  const paper = useEditorStore((s) => s.paper);
  const orientation = useEditorStore((s) => s.orientation);
  const photoSize = useEditorStore((s) => s.photoSize);
  const transform = useEditorStore((s) => s.transform);
  const previewBaked = useEditorStore((s) => s.previewBaked);
  const sourceBitmap = useEditorStore((s) => s.sourceBitmap);
  const { paperW, paperH } = orientedPaper(paper, orientation);

  const dpi = previewBaked
    ? effectiveSourceDpi(previewBaked, transform, photoSize.widthMm, photoSize.heightMm)
    : (sourceBitmap ? effectiveSourceDpi(sourceBitmap, transform, photoSize.widthMm, photoSize.heightMm) : 0);
  const quality = qualityReport(dpi);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold">Print preview</h3>
          <p className="text-sm text-muted-foreground">
            {paper.label} · {formatDimensions(paperW, paperH)} · {orientation} — exact proportions
          </p>
        </div>
        <div
          className="flex gap-1.5 rounded-xl border bg-card p-1"
          role="group"
          aria-label="Preview zoom"
        >
          {ZOOMS.map((z) => (
            <Toggle
              key={z.value}
              pressed={zoom === z.value}
              onPressedChange={() => setZoom(z.value)}
              variant="outline"
              size="sm"
              className={cn(
                "h-9 rounded-lg px-3 text-[13px]",
                zoom === z.value && "bg-alma-collard text-alma-yogurt hover:bg-alma-collard",
              )}
              aria-label={`Zoom ${z.label}`}
            >
              {z.label}
            </Toggle>
          ))}
        </div>
      </div>

      <SheetWorkspace mode="preview" zoom={zoom} />

      <div className="grid gap-3 md:grid-cols-2">
        <div className="flex gap-2.5 rounded-xl border border-alma-collard/30 bg-accent/40 p-4 text-[13px] leading-relaxed">
          <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-alma-collard" aria-hidden="true" />
          <span>
            This preview uses the same layout math as your download — photos are placed at exact
            physical sizes with {formatDimensions(photoSize.widthMm, photoSize.heightMm)} each.
          </span>
        </div>
        {quality.ok ? (
          <div className="flex gap-2.5 rounded-xl border border-alma-collard/30 bg-accent/40 p-4 text-[13px] leading-relaxed">
            <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-alma-collard" aria-hidden="true" />
            <span>
              Good resolution — the cropped photo holds roughly {quality.effectiveDpi} DPI, at or
              above the 300 DPI print target.
            </span>
          </div>
        ) : (
          <div className="flex gap-2.5 rounded-xl border border-alma-orange/40 bg-alma-orange/10 p-4 text-[13px] leading-relaxed">
            <TriangleAlert className="mt-0.5 h-4.5 w-4.5 shrink-0 text-alma-orange" aria-hidden="true" />
            <span>{quality.warnings[0]}</span>
          </div>
        )}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Printer settings can still rescale the sheet — when printing, choose <strong>Actual size
        / 100%</strong> and disable <strong>Fit to page</strong>.
      </p>
    </div>
  );
}
