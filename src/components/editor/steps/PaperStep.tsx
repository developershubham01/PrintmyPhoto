"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PAPER_SIZES } from "@/data/paper-sizes";
import { orientedPaper, useEditorStore } from "@/lib/store/editor-store";
import type { Orientation, PaperOption, Unit } from "@/types/editor";
import { formatDimensions, fromMm, toMm } from "@/lib/dimensions";
import { Check, Info, Printer } from "lucide-react";
import { cn } from "@/lib/utils";

export function PaperStep() {
  const paper = useEditorStore((s) => s.paper);
  const setPaper = useEditorStore((s) => s.setPaper);
  const orientation = useEditorStore((s) => s.orientation);
  const setOrientation = useEditorStore((s) => s.setOrientation);
  const photoSize = useEditorStore((s) => s.photoSize);
  const autoArrange = useEditorStore((s) => s.autoArrange);

  const [unit, setUnit] = useState<Unit>("mm");
  const [customW, setCustomW] = useState("100");
  const [customH, setCustomH] = useState("150");

  const applyPaper = (opt: PaperOption) => {
    setPaper({ id: opt.id, label: opt.label, widthMm: opt.widthMm, heightMm: opt.heightMm });
    // Immediately compute a fresh arrangement for the new paper.
    setTimeout(autoArrange, 0);
  };

  const applyCustomPaper = () => {
    const w = toMm(parseFloat(customW), unit);
    const h = toMm(parseFloat(customH), unit);
    if (!Number.isFinite(w) || !Number.isFinite(h) || w < 30 || h < 30 || w > 800 || h > 800) return;
    setPaper({
      id: "custom-paper",
      label: `Custom (${customW} × ${customH} ${unit})`,
      widthMm: w,
      heightMm: h,
      custom: true,
    });
    setTimeout(autoArrange, 0);
  };

  const { paperW, paperH } = orientedPaper(paper, orientation);

  // How many of the current photos fit on the oriented paper (quick reference).
  const fits = (() => {
    const cols = Math.max(1, Math.floor((paperW - 8) / (photoSize.widthMm + 2)));
    const rows = Math.max(1, Math.floor((paperH - 8) / (photoSize.heightMm + 2)));
    return cols * rows;
  })();

  return (
    <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-10">
      <div className="space-y-5">
        <div>
          <h3 className="font-display text-lg font-semibold">Choose your paper</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            The studio arranges as many copies as fit on this sheet. Photo paper, cardstock or
            plain paper all work — pick what your printer supports.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {PAPER_SIZES.map((p) => {
            const active = paper.id === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPaper(p)}
                aria-pressed={active}
                className={cn(
                  "flex flex-col items-center gap-2.5 rounded-xl border bg-card p-4 transition-all",
                  active
                    ? "border-alma-collard ring-2 ring-alma-collard/25"
                    : "border-border hover:border-alma-collard/40 hover:shadow-card",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "w-10 rounded-[4px] border-2 bg-alma-yogurt",
                    active ? "border-alma-collard" : "border-border",
                  )}
                  style={{ height: (40 * p.heightMm) / p.widthMm }}
                />
                <span className="flex items-center gap-1.5 text-sm font-semibold">
                  {p.label}
                  {active && <Check className="h-4 w-4 text-alma-collard" aria-hidden="true" />}
                </span>
                <span className="text-[11.5px] tabular-nums text-muted-foreground">
                  {formatDimensions(p.widthMm, p.heightMm)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Orientation */}
        <div>
          <Label className="mb-2 block text-sm font-medium">Orientation</Label>
          <div className="grid grid-cols-2 gap-2.5" role="group" aria-label="Paper orientation">
            {(["portrait", "landscape"] as Orientation[]).map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => {
                  setOrientation(o);
                  setTimeout(autoArrange, 0);
                }}
                aria-pressed={orientation === o}
                className={cn(
                  "flex items-center justify-center gap-2.5 rounded-xl border bg-card p-3.5 text-sm font-medium capitalize transition-all",
                  orientation === o
                    ? "border-alma-collard ring-2 ring-alma-collard/25"
                    : "border-border hover:border-alma-collard/40",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "w-6 rounded-[3px] border-2 bg-alma-yogurt",
                    orientation === o ? "border-alma-collard" : "border-border",
                    o === "portrait" ? "h-8" : "h-4",
                  )}
                />
                {o}
              </button>
            ))}
          </div>
        </div>

        {/* Custom paper */}
        <div className="rounded-xl border bg-card p-4">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Printer className="h-4 w-4 text-alma-accent" aria-hidden="true" /> Custom paper size
          </p>
          <div className="mt-3 flex flex-wrap items-end gap-3">
            <div>
              <Label htmlFor="paper-w" className="mb-1 block text-xs text-muted-foreground">Width</Label>
              <Input
                id="paper-w"
                type="number"
                inputMode="decimal"
                value={customW}
                onChange={(e) => setCustomW(e.target.value)}
                className="h-11 w-24 rounded-lg"
              />
            </div>
            <div>
              <Label htmlFor="paper-h" className="mb-1 block text-xs text-muted-foreground">Height</Label>
              <Input
                id="paper-h"
                type="number"
                inputMode="decimal"
                value={customH}
                onChange={(e) => setCustomH(e.target.value)}
                className="h-11 w-24 rounded-lg"
              />
            </div>
            <div>
              <Label htmlFor="paper-unit" className="mb-1 block text-xs text-muted-foreground">Unit</Label>
              <select
                id="paper-unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value as Unit)}
                className="h-11 rounded-lg border bg-card px-3 text-sm"
                aria-label="Custom paper unit"
              >
                <option value="mm">mm</option>
                <option value="cm">cm</option>
                <option value="in">inches</option>
              </select>
            </div>
            <Button variant="outline" className="h-11 rounded-xl px-5" onClick={applyCustomPaper}>
              Use custom paper
            </Button>
          </div>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-2xl border bg-card p-6 shadow-card">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Selected paper
          </p>
          <p className="mt-1 font-display text-2xl font-semibold">{paper.label}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatDimensions(paperW, paperH)} · {orientation}
          </p>
          <div className="mt-4 rounded-xl bg-secondary/60 p-3.5 text-[13.5px] leading-relaxed">
            Approximately <strong>{fits}</strong> × {photoSize.label} photos fit on this sheet with
            typical spacing. The next step calculates the exact arrangement with your margins and
            gaps.
          </div>
        </div>

        <div className="flex gap-2.5 rounded-2xl border border-alma-accent/25 bg-alma-accent/5 p-4 text-[13px] leading-relaxed">
          <Info className="mt-0.5 h-4.5 w-4.5 shrink-0 text-alma-accent" aria-hidden="true" />
          <span>
            <strong>Printing tip.</strong> The downloaded PDF is built at the exact physical size of
            this paper. When printing, choose this paper size in the print dialog and set scaling to
            <em> Actual size / 100%</em> — never “Fit to page”. See the{" "}
            <a href="#/photo-printing-guide" className="font-semibold text-alma-accent underline underline-offset-2">
              printing guide
            </a>{" "}
            for details.
          </span>
        </div>
      </aside>
    </div>
  );
}
