"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { renderCroppedPhoto } from "@/lib/image/crop";
import { borderUniformity } from "@/lib/image/bg-removal";
import { composeFinalPhoto } from "@/lib/image/compose";
import { useEditorStore } from "@/lib/store/editor-store";
import { mmToPx } from "@/lib/dimensions";
import { Eraser, Info, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const PRESETS: Array<{ id: string; label: string; color: string }> = [
  { id: "white", label: "White", color: "#ffffff" },
  { id: "off-white", label: "Off-white", color: "#f7f5ed" },
  { id: "light-grey", label: "Light grey", color: "#e8e8e8" },
  { id: "light-blue", label: "Light blue", color: "#d7e5ea" },
  { id: "cream", label: "Cream", color: "#f4edda" },
  { id: "light-green", label: "Light green", color: "#e4eed2" },
];

export function BackgroundStep() {
  const bg = useEditorStore((s) => s.bg);
  const setBg = useEditorStore((s) => s.setBg);
  const previewBaked = useEditorStore((s) => s.previewBaked);
  const transform = useEditorStore((s) => s.transform);
  const photoSize = useEditorStore((s) => s.photoSize);
  const [uniformity, setUniformity] = useState<{ stdDev: number; uniform: boolean } | null>(null);
  const [customColor, setCustomColor] = useState(bg.color);

  // Render a fast preview at 150 DPI whenever relevant state changes (derived, synchronous).
  const previewCanvas = useMemo(() => {
    if (!previewBaked) return null;
    const dpi = 150;
    const w = Math.round(mmToPx(photoSize.widthMm, dpi));
    const h = Math.round(mmToPx(photoSize.heightMm, dpi));
    const cropped = renderCroppedPhoto(previewBaked, transform, photoSize.widthMm, photoSize.heightMm, dpi);
    return composeFinalPhoto(cropped, bg, w, h);
  }, [previewBaked, transform, bg, photoSize]);

  const runRemovalAnalysis = () => {
    if (!previewBaked) return;
    try {
      // Analyze the actual crop at modest resolution for speed.
      const cropped = renderCroppedPhoto(previewBaked, transform, photoSize.widthMm, photoSize.heightMm, 160);
      const u = borderUniformity(cropped);
      setUniformity(u);
      if (!u.uniform) {
        toast.warning(
          "Your background looks uneven. Automatic removal is approximate — check the edges carefully before using the result.",
          { duration: 6000 },
        );
      }
    } catch {
      // non-fatal
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-10">
      {/* Preview */}
      <div className="flex flex-col items-center gap-3">
        <div className="checker-bg w-full max-w-[340px] overflow-hidden rounded-xl border shadow-card">
          {previewCanvas ? (
            <canvas
              aria-label="Photo preview with selected background"
              className="block h-auto w-full"
              ref={(el) => {
                if (el && previewCanvas) {
                  el.width = previewCanvas.width;
                  el.height = previewCanvas.height;
                  el.getContext("2d")!.drawImage(previewCanvas, 0, 0);
                }
              }}
            />
          ) : (
            <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
              No photo loaded
            </div>
          )}
        </div>
        {bg.mode === "transparent" && (
          <p className="text-xs text-muted-foreground">
            Checkerboard = transparency. Transparency is kept in PNG downloads; PDF and JPG render
            on white.
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="space-y-6">
        <div>
          <h3 className="font-display text-lg font-semibold">Background</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Optional. Most official photos require a plain, light background — always confirm the
            exact rule with the issuing authority.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
          <ModeCard
            active={bg.mode === "original"}
            label="Original"
            onClick={() => setBg({ mode: "original" })}
            swatch={null}
          />
          {PRESETS.map((p) => (
            <ModeCard
              key={p.id}
              active={bg.mode === "color" && bg.color.toLowerCase() === p.color.toLowerCase()}
              label={p.label}
              swatch={p.color}
              onClick={() => {
                setBg({ mode: "color", color: p.color });
                if (!bg.autoRemove) {
                  toast.info("Turn on “Remove original background” so the new color can show through.", {
                    duration: 4500,
                  });
                }
              }}
            />
          ))}
          <ModeCard
            active={bg.mode === "transparent"}
            label="Transparent"
            swatch={null}
            checker
            onClick={() => setBg({ mode: "transparent" })}
          />
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div>
            <Label htmlFor="custom-color" className="mb-1.5 block text-sm font-medium">Custom color</Label>
            <div className="flex items-center gap-2">
              <Input
                id="custom-color"
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="h-11 w-16 cursor-pointer rounded-lg p-1"
                aria-label="Pick a custom background color"
              />
              <Button
                variant="outline"
                className="h-11 rounded-xl"
                onClick={() => setBg({ mode: "color", color: customColor })}
              >
                Apply color
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <Eraser className="mt-0.5 h-4.5 w-4.5 shrink-0 text-alma-accent" aria-hidden="true" />
              <div>
                <Label htmlFor="auto-remove" className="text-sm font-semibold">
                  Remove original background
                </Label>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Automatic and approximate. Works best on plain, evenly lit backgrounds. Keeps the
                  process fully on your device.
                </p>
              </div>
            </div>
            <Switch
              id="auto-remove"
              checked={bg.autoRemove}
              onCheckedChange={(on) => {
                setBg({ autoRemove: on });
                if (on) runRemovalAnalysis();
              }}
              aria-label="Toggle automatic background removal"
            />
          </div>

          {bg.autoRemove && (
            <div className="mt-4 space-y-3 border-t pt-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="tolerance" className="text-sm">Edge tolerance</Label>
                <span className="text-xs tabular-nums text-muted-foreground">{bg.tolerance}</span>
              </div>
              <Slider
                id="tolerance"
                value={[bg.tolerance]}
                min={8}
                max={80}
                step={1}
                onValueChange={([v]) => setBg({ tolerance: v })}
                aria-label="Background removal tolerance"
              />
              <p className="text-xs text-muted-foreground">
                Higher removes more (may eat hair edges), lower keeps more (may leave background
                patches).
              </p>
            </div>
          )}
        </div>

        {uniformity && !uniformity.uniform && (
          <div className="flex gap-2.5 rounded-xl border border-alma-orange/40 bg-alma-orange/10 p-4 text-[13px] leading-relaxed">
            <TriangleAlert className="mt-0.5 h-4.5 w-4.5 shrink-0 text-alma-orange" aria-hidden="true" />
            <span>
              <strong>Uneven background detected.</strong> The removal result will be approximate.
              For best results, photograph against a smooth, evenly lit wall.
            </span>
          </div>
        )}

        <div className="flex gap-2.5 rounded-xl border border-alma-accent/25 bg-alma-accent/5 p-4 text-[13px] leading-relaxed">
          <Info className="mt-0.5 h-4.5 w-4.5 shrink-0 text-alma-accent" aria-hidden="true" />
          <span>
            We clearly label background removal as <strong>approximate</strong> — fine hair, glasses
            edges and shadows may need manual correction. This tool never guarantees compliance
            with any official document standard.
          </span>
        </div>
      </div>
    </div>
  );
}

function ModeCard({
  active,
  label,
  swatch,
  checker,
  onClick,
}: {
  active: boolean;
  label: string;
  swatch: string | null;
  checker?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex flex-col items-center gap-2 rounded-xl border bg-card p-2.5 text-center transition-all",
        active
          ? "border-alma-collard ring-2 ring-alma-collard/30"
          : "border-border hover:border-alma-collard/40",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "h-9 w-full rounded-lg border border-black/10",
          checker && "checker-bg",
        )}
        style={swatch ? { backgroundColor: swatch } : !swatch && !checker ? { background: "linear-gradient(135deg,#e8e2d2,#d6cdb4)" } : undefined}
      />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

