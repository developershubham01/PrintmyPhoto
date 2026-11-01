"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useEditorStore } from "@/lib/store/editor-store";
import { renderCroppedPhoto } from "@/lib/image/crop";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Maximize,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  ScanFace,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Interactive crop stage. Renders the baked preview canvas with the current
 * transform at screen resolution, and supports drag-to-pan + wheel/pinch zoom.
 * The transform is stored in frame-fraction units so the export matches 1:1.
 */
export function CropperStage() {
  const previewBaked = useEditorStore((s) => s.previewBaked);
  const bakedVersion = useEditorStore((s) => s.bakedVersion);
  const transform = useEditorStore((s) => s.transform);
  const setTransform = useEditorStore((s) => s.setTransform);
  const commitTransform = useEditorStore((s) => s.commitTransform);
  const photoSize = useEditorStore((s) => s.photoSize);
  const faceGuide = useEditorStore((s) => s.faceGuide);
  const setFaceGuide = useEditorStore((s) => s.setFaceGuide);
  const brightness = useEditorStore((s) => s.adjustments.brightness);
  const contrast = useEditorStore((s) => s.adjustments.contrast);
  const saturation = useEditorStore((s) => s.adjustments.saturation);

  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [wrapW, setWrapW] = useState(360);
  const drag = useRef<{ pointerId: number; startX: number; startY: number; baseX: number; baseY: number } | null>(null);
  const pinch = useRef<{ dist: number; baseZoom: number } | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const raf = useRef(0);

  const aspect = photoSize.widthMm / photoSize.heightMm;
  const frameW = wrapW;
  const frameH = Math.round(wrapW / aspect);

  const bounds = useMemo(() => {
    if (!previewBaked) return { maxOffX: 0, maxOffY: 0 };
    const swapped = transform.rotation % 180 !== 0;
    const visW = swapped ? previewBaked.height : previewBaked.width;
    const visH = swapped ? previewBaked.width : previewBaked.height;
    const baseScale = Math.max(frameW / visW, frameH / visH);
    const drawnW = visW * baseScale * transform.zoom;
    const drawnH = visH * baseScale * transform.zoom;
    return {
      maxOffX: Math.max(0, (drawnW - frameW) / 2) / frameW,
      maxOffY: Math.max(0, (drawnH - frameH) / 2) / frameH,
    };
  }, [previewBaked, transform.rotation, transform.zoom, frameW, frameH]);

  // Track container width (responsive)
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 360;
      setWrapW(Math.max(200, Math.min(w, 520)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Render loop (draws on state change)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !previewBaked) return;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = Math.round(frameW * dpr);
      const ch = Math.round(frameH * dpr);
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
      }
      const dpi = (cw * 25.4) / photoSize.widthMm;
      const rendered = renderCroppedPhoto(
        previewBaked,
        transform,
        photoSize.widthMm,
        photoSize.heightMm,
        dpi,
      );
      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(rendered, 0, 0);
    });
    return () => cancelAnimationFrame(raf.current);
  }, [previewBaked, bakedVersion, transform, frameW, frameH, photoSize]);

  const clampAndApply = useCallback(
    (offX: number, offY: number) => {
      setTransform({
        offsetX: Math.min(Math.max(offX, -bounds.maxOffX), bounds.maxOffX),
        offsetY: Math.min(Math.max(offY, -bounds.maxOffY), bounds.maxOffY),
      });
    },
    [bounds, setTransform],
  );

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) {
      drag.current = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        baseX: transform.offsetX,
        baseY: transform.offsetY,
      };
    } else if (pointers.current.size === 2) {
      const pts = [...pointers.current.values()];
      pinch.current = {
        dist: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y),
        baseZoom: transform.zoom,
      };
      drag.current = null;
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && pinch.current) {
      const pts = [...pointers.current.values()];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const zoom = Math.min(5, Math.max(0.3, pinch.current.baseZoom * (dist / pinch.current.dist)));
      setTransform({ zoom });
      return;
    }

    if (drag.current && drag.current.pointerId === e.pointerId) {
      const dx = (e.clientX - drag.current.startX) / frameW;
      const dy = (e.clientY - drag.current.startY) / frameW;
      clampAndApply(drag.current.baseX + dx, drag.current.baseY + dy);
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const wasInteracting = drag.current !== null || pinch.current !== null;
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (pointers.current.size === 0) {
      drag.current = null;
      if (wasInteracting) commitTransform();
    }
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const next = Math.min(5, Math.max(0.3, transform.zoom * (e.deltaY < 0 ? 1.06 : 0.943)));
    setTransform({ zoom: next });
  };

  const commitZoom = () => commitTransform();

  const zoomBy = (factor: number) => {
    setTransform({ zoom: Math.min(5, Math.max(0.3, transform.zoom * factor)) });
    commitTransform();
  };

  return (
    <div className="flex flex-col items-center gap-5 lg:flex-row lg:items-start lg:gap-8">
      {/* Stage */}
      <div className="flex flex-col items-center gap-3">
        <div
          ref={wrapRef}
          className="relative w-full max-w-[520px] touch-none select-none"
          style={{ minHeight: 200 }}
        >
          <div
            role="img"
            aria-label={`Cropped ${photoSize.label} photo preview. Drag to reposition, scroll to zoom.`}
            tabIndex={0}
            onKeyDown={(e) => {
              const step = e.shiftKey ? 0.05 : 0.01;
              if (e.key === "ArrowLeft") { clampAndApply(transform.offsetX - step, transform.offsetY); e.preventDefault(); }
              if (e.key === "ArrowRight") { clampAndApply(transform.offsetX + step, transform.offsetY); e.preventDefault(); }
              if (e.key === "ArrowUp") { clampAndApply(transform.offsetX, transform.offsetY - step); e.preventDefault(); }
              if (e.key === "ArrowDown") { clampAndApply(transform.offsetX, transform.offsetY + step); e.preventDefault(); }
              if (e.key === "+" || e.key === "=") { zoomBy(1.1); e.preventDefault(); }
              if (e.key === "-") { zoomBy(0.9); e.preventDefault(); }
              if (e.key === "r") rotateFromKeyboard("right");
              if (e.key === "R") rotateFromKeyboard("left");
            }}
            onWheel={onWheel}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onPointerLeave={onPointerUp}
            className="relative overflow-hidden rounded-xl border-2 border-alma-collard/60 shadow-card"
            style={{ aspectRatio: `${photoSize.widthMm} / ${photoSize.heightMm}`, width: "100%" }}
          >
            <canvas
              ref={canvasRef}
              className="block h-full w-full cursor-grab active:cursor-grabbing"
              style={{ width: "100%", height: "100%" }}
            />
            {faceGuide && <GuidesOverlay />}
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Drag to position · scroll or pinch to zoom · arrow keys nudge
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="w-full max-w-[520px] space-y-5 lg:w-72">
        <div className="flex flex-wrap gap-2">
          <ToolbarButton
            label="Rotate left"
            onClick={() => rotateFromKeyboard("left")}
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Rotate L
          </ToolbarButton>
          <ToolbarButton
            label="Rotate right"
            onClick={() => rotateFromKeyboard("right")}
          >
            <RotateCw className="h-4 w-4" aria-hidden="true" /> Rotate R
          </ToolbarButton>
          <ToolbarButton label="Zoom in" onClick={() => zoomBy(1.15)}>
            <ZoomIn className="h-4 w-4" aria-hidden="true" /> Zoom in
          </ToolbarButton>
          <ToolbarButton label="Zoom out" onClick={() => zoomBy(0.87)}>
            <ZoomOut className="h-4 w-4" aria-hidden="true" /> Zoom out
          </ToolbarButton>
          <ToolbarButton
            label="Fill frame (reset position)"
            onClick={() => { setTransform({ zoom: 1, offsetX: 0, offsetY: 0 }); commitTransform(); }}
          >
            <Maximize className="h-4 w-4" aria-hidden="true" /> Fill frame
          </ToolbarButton>
          <ToolbarButton
            label="Reset all edits"
            onClick={() => useEditorStore.getState().resetEdits()}
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset
          </ToolbarButton>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <Label htmlFor="zoom-slider" className="text-sm font-medium">Zoom</Label>
            <span className="text-xs tabular-nums text-muted-foreground">
              {Math.round(transform.zoom * 100)}%
            </span>
          </div>
          <Slider
            id="zoom-slider"
            value={[transform.zoom]}
            min={0.3}
            max={3}
            step={0.01}
            onValueChange={([v]) => setTransform({ zoom: v })}
            onValueCommit={commitZoom}
            aria-label="Zoom level"
          />
        </div>

        <AdjustmentSlider
          id="brightness"
          label="Brightness"
          value={brightness}
          min={0.5}
          max={1.5}
          onChange={(v) => useEditorStore.getState().setAdjustments({ brightness: v })}
          onCommit={() => { useEditorStore.getState().pushHistory(); debouncedRebake(); }}
        />
        <AdjustmentSlider
          id="contrast"
          label="Contrast"
          value={contrast}
          min={0.5}
          max={1.5}
          onChange={(v) => useEditorStore.getState().setAdjustments({ contrast: v })}
          onCommit={() => { useEditorStore.getState().pushHistory(); debouncedRebake(); }}
        />
        <AdjustmentSlider
          id="saturation"
          label="Color saturation"
          value={saturation}
          min={0}
          max={2}
          onChange={(v) => useEditorStore.getState().setAdjustments({ saturation: v })}
          onCommit={() => { useEditorStore.getState().pushHistory(); debouncedRebake(); }}
        />

        <div className="flex items-center justify-between rounded-xl border bg-card px-4 py-3">
          <div className="flex items-center gap-2">
            <ScanFace className="h-4 w-4 text-alma-accent" aria-hidden="true" />
            <Label htmlFor="guide-toggle" className="text-sm">Position guide</Label>
          </div>
          <Switch id="guide-toggle" checked={faceGuide} onCheckedChange={setFaceGuide} aria-label="Toggle face position guide" />
        </div>
      </div>
    </div>
  );

  function rotateFromKeyboard(dir: "left" | "right") {
    useEditorStore.getState().rotate(dir);
  }
}

function ToolbarButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button variant="outline" size="sm" className="h-10 rounded-lg" aria-label={label} onClick={onClick}>
      {children}
    </Button>
  );
}

function AdjustmentSlider({
  id,
  label,
  value,
  min,
  max,
  onChange,
  onCommit,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  onCommit: () => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
        <button
          type="button"
          onClick={() => { onChange(1); onCommit(); }}
          className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
        >
          Reset
        </button>
      </div>
      <Slider
        id={id}
        value={[value]}
        min={min}
        max={max}
        step={0.01}
        onValueChange={([v]) => onChange(v)}
        onValueCommit={onCommit}
        aria-label={label}
      />
    </div>
  );
}

let rebakeTimer: ReturnType<typeof setTimeout> | null = null;
function debouncedRebake() {
  if (rebakeTimer) clearTimeout(rebakeTimer);
  rebakeTimer = setTimeout(() => {
    useEditorStore.getState().rebake();
  }, 160);
}

/** Face-position guidance overlay — visual guidance only, no automated detection. */
function GuidesOverlay() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 130"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      {/* Head height band (~70% of frame height, ICAO-style guidance) */}
      <rect x="0" y="8" width="100" height="72" fill="rgba(20,108,132,0.08)" />
      <line x1="0" y1="8" x2="100" y2="8" stroke="rgba(20,108,132,0.65)" strokeWidth="0.7" strokeDasharray="3 2" />
      <line x1="0" y1="80" x2="100" y2="80" stroke="rgba(20,108,132,0.65)" strokeWidth="0.7" strokeDasharray="3 2" />
      {/* Eye line */}
      <line x1="0" y1="44" x2="100" y2="44" stroke="rgba(195,214,56,0.9)" strokeWidth="0.8" strokeDasharray="4 2.5" />
      {/* Face oval */}
      <ellipse cx="50" cy="46" rx="24" ry="32" fill="none" stroke="rgba(20,108,132,0.75)" strokeWidth="0.8" strokeDasharray="5 3" />
      <text x="4" y="6" fontSize="5" fill="rgba(20,108,132,0.9)" className="font-sans">Head top</text>
      <text x="4" y="87" fontSize="5" fill="rgba(20,108,132,0.9)" className="font-sans">Chin</text>
      <text x="4" y="42" fontSize="5" fill="rgba(101,120,20,0.95)" className="font-sans">Eye line</text>
    </svg>
  );
}
