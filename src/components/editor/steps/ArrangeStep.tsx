"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { SheetWorkspace } from "@/components/editor/SheetWorkspace";
import { orientedPaper, useEditorStore } from "@/lib/store/editor-store";
import { computeGrid, maxGrid, sheetStats } from "@/lib/layout-calculator";
import { formatDimensions } from "@/lib/dimensions";
import { LayoutGrid, RotateCcw, TriangleAlert } from "lucide-react";

export function ArrangeStep() {
  const paper = useEditorStore((s) => s.paper);
  const orientation = useEditorStore((s) => s.orientation);
  const photoSize = useEditorStore((s) => s.photoSize);
  const layout = useEditorStore((s) => s.layout);
  const placements = useEditorStore((s) => s.placements);
  const setLayout = useEditorStore((s) => s.setLayout);
  const autoArrange = useEditorStore((s) => s.autoArrange);
  const pushHistory = useEditorStore((s) => s.pushHistory);

  const { paperW, paperH } = orientedPaper(paper, orientation);

  // Ensure an arrangement exists when entering the step.
  useEffect(() => {
    if (placements.length === 0) autoArrange();
  }, [placements.length, autoArrange]);

  const grid = computeGrid({
    paperW,
    paperH,
    photoW: photoSize.widthMm,
    photoH: photoSize.heightMm,
    margin: layout.margin,
    gapX: layout.gapX,
    gapY: layout.gapY,
    cols: layout.cols,
    rows: layout.rows,
  });
  const { maxCols, maxRows } = maxGrid({
    paperW,
    paperH,
    photoW: photoSize.widthMm,
    photoH: photoSize.heightMm,
    margin: layout.margin,
    gapX: layout.gapX,
    gapY: layout.gapY,
  });
  const stats = sheetStats(placements, photoSize.widthMm, photoSize.heightMm, paperW, paperH);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-10">
      <div className="min-w-0 order-2 space-y-5 lg:order-1">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-semibold">Arrangement</h3>
            <p className="text-sm text-muted-foreground">
              Drag photos to fine-tune, or adjust the automatic grid.
            </p>
          </div>
          <Button
            variant="outline"
            className="h-10 rounded-xl"
            onClick={() => {
              autoArrange();
              pushHistory();
            }}
          >
            <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
            Reset to grid
          </Button>
        </div>

        <SheetWorkspace mode="arrange" zoom="fit" />
      </div>

      {/* Controls panel */}
      <aside className="min-w-0 order-1 space-y-5 lg:order-2">
        <div className="rounded-2xl border bg-card p-5 shadow-card">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <LayoutGrid className="h-4 w-4 text-alma-collard" aria-hidden="true" />
            Automatic grid
          </p>

          <div className="mt-4 space-y-4">
            <SliderField
              id="margin"
              label="Page margin"
              value={layout.margin}
              min={0}
              max={20}
              step={0.5}
              unit="mm"
              onChange={(v) => setLayout({ margin: v })}
            />
            <SliderField
              id="gap-x"
              label="Horizontal gap"
              value={layout.gapX}
              min={0}
              max={15}
              step={0.5}
              unit="mm"
              onChange={(v) => setLayout({ gapX: v })}
            />
            <SliderField
              id="gap-y"
              label="Vertical gap"
              value={layout.gapY}
              min={0}
              max={15}
              step={0.5}
              unit="mm"
              onChange={(v) => setLayout({ gapY: v })}
            />

            <div className="grid grid-cols-2 gap-3">
              <NumberField
                id="cols"
                label={`Columns (max ${maxCols})`}
                value={layout.cols ?? maxCols}
                min={1}
                max={maxCols}
                onChange={(v) => setLayout({ cols: v })}
              />
              <NumberField
                id="rows"
                label={`Rows (max ${maxRows})`}
                value={layout.rows ?? maxRows}
                min={1}
                max={maxRows}
                onChange={(v) => setLayout({ rows: v })}
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-card">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Sheet summary
          </p>
          <dl className="mt-3 space-y-2 text-[13.5px]">
            <Row label="Photos on sheet" value={`${stats.count}`} strong />
            <Row label="Grid" value={`${grid.cols} × ${grid.rows}`} />
            <Row label="Paper" value={`${paper.label} · ${formatDimensions(paperW, paperH)}`} />
            <Row
              label="Photo"
              value={`${formatDimensions(photoSize.widthMm, photoSize.heightMm)} each`}
            />
            <Row label="Margins / gaps" value={`${layout.margin} / ${layout.gapX} × ${layout.gapY} mm`} />
            <Row label="Printable area" value={`≈ ${Math.round(100 - stats.coverage)}% free`} />
          </dl>
        </div>

        {!grid.fits && (
          <div className="flex gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-[13px] leading-relaxed text-destructive">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{grid.reason}</span>
          </div>
        )}

        <p className="px-1 text-xs leading-relaxed text-muted-foreground">
          All calculations use physical millimetres — the exported PDF and images match these
          dimensions exactly at 300 DPI.
        </p>
      </aside>
    </div>
  );
}

function SliderField({
  id,
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
        <span className="text-xs tabular-nums text-muted-foreground">
          {value} {unit}
        </span>
      </div>
      <Slider
        id={id}
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onChange(v)}
        aria-label={label}
      />
    </div>
  );
}

function NumberField({
  id,
  label,
  value,
  min,
  max,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <Label htmlFor={id} className="mb-1.5 block text-[13px] font-medium">{label}</Label>
      <div className="flex items-center rounded-lg border">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          className="h-11 w-10 shrink-0 rounded-l-lg text-lg font-medium text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-40"
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          −
        </button>
        <span className="flex-1 text-center text-sm font-semibold tabular-nums" aria-live="polite">
          {value}
        </span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          className="h-11 w-10 shrink-0 rounded-r-lg text-lg font-medium text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-40"
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
        >
          +
        </button>
      </div>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={strong ? "font-display text-lg font-semibold text-alma-collard" : "font-medium tabular-nums"}>
        {value}
      </dd>
    </div>
  );
}
