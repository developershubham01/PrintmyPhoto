"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { orientedPaper, useEditorStore } from "@/lib/store/editor-store";
import { useFinalPhotoCanvas } from "@/components/editor/useFinalPhotoCanvas";
import { placementsOverlap, snap } from "@/lib/layout-calculator";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Copy, Trash2, Magnet, Focus } from "lucide-react";
import { cn } from "@/lib/utils";

export type ZoomMode = "fit" | "50" | "75" | "100";

const CSS_PX_PER_MM = 96 / 25.4;

interface SheetWorkspaceProps {
  mode: "arrange" | "preview";
  zoom: ZoomMode;
}

/**
 * Interactive print-sheet canvas: renders the paper at accurate proportions,
 * supports selecting, dragging (with overlap prevention), duplicating and
 * removing individual photos, plus keyboard nudging.
 */
export function SheetWorkspace({ mode, zoom }: SheetWorkspaceProps) {
  const paper = useEditorStore((s) => s.paper);
  const orientation = useEditorStore((s) => s.orientation);
  const photoSize = useEditorStore((s) => s.photoSize);
  const placements = useEditorStore((s) => s.placements);
  const selectedId = useEditorStore((s) => s.selectedId);
  const selectPlacement = useEditorStore((s) => s.selectPlacement);
  const updatePlacement = useEditorStore((s) => s.updatePlacement);
  const commitPlacement = useEditorStore((s) => s.commitPlacement);
  const duplicatePlacement = useEditorStore((s) => s.duplicatePlacement);
  const removePlacement = useEditorStore((s) => s.removePlacement);
  const layoutGuides = useEditorStore((s) => s.layout);
  const photoCanvas = useFinalPhotoCanvas();

  const { paperW, paperH } = orientedPaper(paper, orientation);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [availW, setAvailW] = useState(640);
  const [snapOn, setSnapOn] = useState(true);
  const dragRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    baseX: number;
    baseY: number;
    moved: boolean;
    overlapping: boolean;
  } | null>(null);
  const raf = useRef(0);

  const pxPerMm = useMemo(() => {
    const viewH = typeof window !== "undefined" ? window.innerHeight : 800;
    const fitScale = Math.min(
      (availW - 24) / paperW,
      Math.max(0.8, (viewH * 0.62) / paperH),
    );
    if (zoom === "fit") return fitScale;
    const requested = (parseInt(zoom, 10) / 100) * CSS_PX_PER_MM;
    return Math.min(requested, Math.max(fitScale, requested)); // allow scroll zoom-in
  }, [availW, paperW, paperH, zoom]);

  // Track available width
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      setAvailW(Math.max(280, entries[0]?.contentRect.width ?? 640));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = Math.max(1, Math.round(paperW * pxPerMm * dpr));
    const ch = Math.max(1, Math.round(paperH * pxPerMm * dpr));
    if (canvas.width !== cw || canvas.height !== ch) {
      canvas.width = cw;
      canvas.height = ch;
    }
    const ctx = canvas.getContext("2d")!;
    const m = pxPerMm * dpr;

    // Paper
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, cw, ch);

    // Margin guide (subtle)
    if (mode === "arrange" && layoutGuides.margin > 0) {
      ctx.strokeStyle = "rgba(20,108,132,0.35)";
      ctx.setLineDash([6 * dpr, 5 * dpr]);
      ctx.lineWidth = 1;
      ctx.strokeRect(
        layoutGuides.margin * m,
        layoutGuides.margin * m,
        cw - 2 * layoutGuides.margin * m,
        ch - 2 * layoutGuides.margin * m,
      );
      ctx.setLineDash([]);
    }

    // Photos
    const pw = photoSize.widthMm * m;
    const ph = photoSize.heightMm * m;
    for (const p of placements) {
      if (photoCanvas) {
        ctx.drawImage(photoCanvas, p.x * m, p.y * m, pw, ph);
      } else {
        ctx.fillStyle = "#e8e4d5";
        ctx.fillRect(p.x * m, p.y * m, pw, ph);
      }
      if (p.id === selectedId && mode === "arrange") {
        ctx.strokeStyle = "rgba(20,108,132,0.95)";
        ctx.lineWidth = Math.max(1.5, 2 * dpr);
        ctx.strokeRect(p.x * m, p.y * m, pw, ph);
      }
    }

    // Paper border
    ctx.strokeStyle = "rgba(51,20,12,0.25)";
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, cw - 1, ch - 1);
  }, [paperW, paperH, pxPerMm, placements, photoCanvas, photoSize, selectedId, mode, layoutGuides.margin]);

  useEffect(() => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [draw]);

  const toMm = (clientX: number, clientY: number) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * paperW,
      y: ((clientY - rect.top) / rect.height) * paperH,
    };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (mode !== "arrange" || !canvasRef.current) return;
    const mm = toMm(e.clientX, e.clientY);
    // Hit-test topmost first
    const hit = [...placements].reverse().find(
      (p) => mm.x >= p.x && mm.x <= p.x + photoSize.widthMm && mm.y >= p.y && mm.y <= p.y + photoSize.heightMm,
    );
    if (!hit) {
      selectPlacement(null);
      return;
    }
    selectPlacement(hit.id);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    dragRef.current = {
      id: hit.id,
      startX: mm.x,
      startY: mm.y,
      baseX: hit.x,
      baseY: hit.y,
      moved: false,
      overlapping: false,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d || !canvasRef.current) return;
    const mm = toMm(e.clientX, e.clientY);
    let nx = d.baseX + (mm.x - d.startX);
    let ny = d.baseY + (mm.y - d.startY);
    if (snapOn) {
      nx = snap(nx, 1);
      ny = snap(ny, 1);
    }
    nx = Math.min(Math.max(0, nx), Math.max(0, paperW - photoSize.widthMm));
    ny = Math.min(Math.max(0, ny), Math.max(0, paperH - photoSize.heightMm));
    d.moved = true;
    d.overlapping = placements.some(
      (o) => o.id !== d.id && placementsOverlap({ id: d.id, x: nx, y: ny }, o, photoSize.widthMm, photoSize.heightMm),
    );
    updatePlacement(d.id, nx, ny);
  };

  const endDrag = () => {
    const d = dragRef.current;
    dragRef.current = null;
    if (!d || !d.moved) return;
    const current = useEditorStore.getState().placements.find((p) => p.id === d.id);
    if (!current) return;
    const ok = useEditorStore.getState().commitPlacement(d.id, current.x, current.y);
    if (!ok) {
      // Overlap prevention: snap back to the exact pre-drag position.
      useEditorStore.getState().updatePlacement(d.id, d.baseX, d.baseY);
      toast.error("Photos can't overlap — the move was reverted.", { duration: 2500 });
    }
  };

  // Keyboard controls for the selected photo
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (mode !== "arrange" || !selectedId) return;
    const current = placements.find((p) => p.id === selectedId);
    if (!current) return;
    const step = e.shiftKey ? 2 : 0.5;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    if (moves[e.key]) {
      e.preventDefault();
      const [dx, dy] = moves[e.key];
      commitPlacement(selectedId, current.x + dx, current.y + dy);
    } else if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      removePlacement(selectedId);
    } else if (e.key.toLowerCase() === "d") {
      e.preventDefault();
      duplicatePlacement(selectedId);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3" ref={containerRef}>
      <div className="flex w-full flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Toggle
            pressed={snapOn}
            onPressedChange={setSnapOn}
            variant="outline"
            size="sm"
            aria-label="Snap to 1 mm grid"
            className="h-9 rounded-lg"
          >
            <Magnet className="mr-1.5 h-4 w-4" aria-hidden="true" /> Snap 1 mm
          </Toggle>
          <span className="hidden text-xs text-muted-foreground sm:inline">
            Drag photos · arrows nudge · D duplicate · Del remove
          </span>
        </div>
        {mode === "arrange" && selectedId && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 rounded-lg" onClick={() => {
              const ok = duplicatePlacement(selectedId);
              if (!ok) toast.info("No free space on this sheet — remove a photo or choose larger paper.", { duration: 3500 });
            }}>
              <Copy className="mr-1.5 h-4 w-4" aria-hidden="true" /> Duplicate
            </Button>
            <Button variant="outline" size="sm" className="h-9 rounded-lg text-destructive hover:text-destructive" onClick={() => removePlacement(selectedId)}>
              <Trash2 className="mr-1.5 h-4 w-4" aria-hidden="true" /> Remove
            </Button>
          </div>
        )}
      </div>

      <div
        className={cn(
          "w-full overflow-auto rounded-xl bg-secondary/50 p-3 scroll-slim dot-grid",
          mode === "preview" && "flex justify-center",
        )}
        style={{ maxHeight: "72vh" }}
      >
        <canvas
          ref={canvasRef}
          role="application"
          aria-label={
            mode === "arrange"
              ? `Interactive print sheet, ${paperW} by ${paperH} millimetres, ${placements.length} photos. Drag photos to reposition.`
              : `Print preview, ${paperW} by ${paperH} millimetres, ${placements.length} photos.`
          }
          tabIndex={mode === "arrange" ? 0 : -1}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className={cn(
            "block rounded-sm shadow-card",
            mode === "arrange" ? "cursor-grab active:cursor-grabbing" : "cursor-default",
          )}
          style={{
            width: paperW * pxPerMm,
            height: paperH * pxPerMm,
            maxWidth: "none",
          }}
        />
      </div>

      {mode === "arrange" && (
        <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Focus className="h-3.5 w-3.5" aria-hidden="true" />
          {selectedId
            ? "Photo selected — use the buttons above or arrow keys."
            : "Click a photo to select it, then drag to fine-tune its position."}
        </p>
      )}
    </div>
  );
}
