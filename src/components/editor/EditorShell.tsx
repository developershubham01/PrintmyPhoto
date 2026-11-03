"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AdSlot } from "@/components/ads/AdSlot";
import { useEditorStore } from "@/lib/store/editor-store";
import { UploadStep } from "@/components/editor/steps/UploadStep";
import { CropperStage } from "@/components/editor/CropperStage";
import { BackgroundStep } from "@/components/editor/steps/BackgroundStep";
import { SizeStep } from "@/components/editor/steps/SizeStep";
import { PaperStep } from "@/components/editor/steps/PaperStep";
import { ArrangeStep } from "@/components/editor/steps/ArrangeStep";
import { PreviewStep } from "@/components/editor/steps/PreviewStep";
import { DownloadStep } from "@/components/editor/steps/DownloadStep";
import { trackEvent } from "@/lib/analytics";
import {
  ChevronLeft,
  ChevronRight,
  CloudUpload,
  Crop,
  Eraser,
  LayoutGrid,
  Printer,
  Ruler,
  Redo2,
  Scan,
  ShieldCheck,
  Undo2,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { EditorStep } from "@/types/editor";

const STEPS: Array<{
  id: EditorStep;
  label: string;
  short: string;
  icon: React.ReactNode;
}> = [
  { id: "upload", label: "1 · Upload photo", short: "Upload", icon: <CloudUpload className="h-4 w-4" aria-hidden="true" /> },
  { id: "edit", label: "2 · Crop & adjust", short: "Edit", icon: <Crop className="h-4 w-4" aria-hidden="true" /> },
  { id: "background", label: "3 · Background", short: "Background", icon: <Eraser className="h-4 w-4" aria-hidden="true" /> },
  { id: "size", label: "4 · Photo size", short: "Size", icon: <Ruler className="h-4 w-4" aria-hidden="true" /> },
  { id: "paper", label: "5 · Paper", short: "Paper", icon: <Printer className="h-4 w-4" aria-hidden="true" /> },
  { id: "arrange", label: "6 · Arrange", short: "Arrange", icon: <LayoutGrid className="h-4 w-4" aria-hidden="true" /> },
  { id: "preview", label: "7 · Preview", short: "Preview", icon: <Scan className="h-4 w-4" aria-hidden="true" /> },
  { id: "download", label: "8 · Download & print", short: "Download", icon: <Download className="h-4 w-4" aria-hidden="true" /> },
];

export function EditorShell() {
  const step = useEditorStore((s) => s.step);
  const setStep = useEditorStore((s) => s.setStep);
  const nextStep = useEditorStore((s) => s.nextStep);
  const prevStep = useEditorStore((s) => s.prevStep);
  const sourceBitmap = useEditorStore((s) => s.sourceBitmap);
  const placements = useEditorStore((s) => s.placements);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const canUndo = useEditorStore((s) => s.history.past.length > 0);
  const canRedo = useEditorStore((s) => s.history.future.length > 0);
  const resetAll = useEditorStore((s) => s.resetAll);
  const isProcessing = useEditorStore((s) => s.isProcessing);
  const processingLabel = useEditorStore((s) => s.processingLabel);

  // Global shortcuts: undo/redo
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === "y" || (e.shiftKey && e.key.toLowerCase() === "z"))) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  const guardNext = () => {
    const s = useEditorStore.getState();
    if (s.step === "upload" && !s.sourceBitmap) return;
    if (s.step === "paper") {
      if (s.placements.length === 0) s.autoArrange();
      setTimeout(() => useEditorStore.getState().nextStep(), 0);
      return;
    }
    nextStep();
  };

  return (
    <div className="pb-14">
      {/* Stepper with integrated Quick Tools toolbar */}
      <nav aria-label="Editor steps" className="border-b border-border/70 bg-alma-yogurt/70 dark:bg-card/60">
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-1 scroll-slim">
            {STEPS.map((s, i) => {
              const active = s.id === step;
              const reachable =
                i === 0 || (sourceBitmap && (i <= 3 || placements.length > 0 || i <= stepIndex));
              const done = i < stepIndex;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => reachable && setStep(s.id)}
                  disabled={!reachable}
                  aria-current={active ? "step" : undefined}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-medium transition-colors cursor-pointer",
                    active && "bg-secondary text-alma-collard dark:text-alma-kiwi font-semibold shadow-xs",
                    !active && reachable && "text-muted-foreground hover:bg-secondary/60",
                    !reachable && "opacity-40 cursor-not-allowed",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold",
                      active
                        ? "bg-alma-collard text-alma-yogurt"
                        : done
                          ? "bg-alma-kiwi/60 text-alma-collard"
                          : "bg-secondary/70 text-muted-foreground",
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className="hidden md:inline">{s.label.replace(/^\d+ · /, "")}</span>
                  <span className="md:hidden">{s.short}</span>
                </button>
              );
            })}
          </div>

          {/* Quick tools: Undo, Redo, Reset */}
          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <Button
              variant="outline"
              size="sm"
              className="h-8.5 rounded-lg px-2.5 text-xs"
              onClick={undo}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="mr-1 h-3.5 w-3.5" aria-hidden="true" /> Undo
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8.5 rounded-lg px-2.5 text-xs"
              onClick={redo}
              disabled={!canRedo}
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="mr-1 h-3.5 w-3.5" aria-hidden="true" /> Redo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8.5 rounded-lg px-2.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => {
                resetAll();
                toast.info("Session cleared — all photo data removed from memory.");
              }}
              title="Reset session and start over"
            >
              Reset
            </Button>
          </div>
        </div>
      </nav>

      {/* Step content */}
      <div className="mx-auto w-full max-w-[1280px] px-4 pt-8 sm:px-6 lg:px-8">
        <div className="w-full min-w-0">
          {step === "upload" && <UploadStep />}
          {step === "edit" && <CropperStage />}
          {step === "background" && <BackgroundStep />}
          {step === "size" && <SizeStep />}
          {step === "paper" && <PaperStep />}
          {step === "arrange" && <ArrangeStep />}
          {step === "preview" && <PreviewStep />}
          {step === "download" && <DownloadStep />}

          {/* Step navigation */}
          {step !== "download" && (
            <div className="mt-10 flex items-center justify-between border-t border-border/70 pt-6">
              <Button
                variant="ghost"
                className="h-12 rounded-xl px-4"
                onClick={prevStep}
                disabled={stepIndex === 0}
              >
                <ChevronLeft className="mr-1 h-4 w-4" aria-hidden="true" /> Back
              </Button>
              <Button
                className="btn-gradient h-12 rounded-xl px-7 text-[15px] font-semibold"
                onClick={guardNext}
                disabled={step === "upload" && !sourceBitmap}
              >
                Continue <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          )}
          {step === "download" && (
            <div className="mt-10 flex justify-start border-t border-border/70 pt-6">
              <Button variant="ghost" className="h-12 rounded-xl px-4" onClick={prevStep}>
                <ChevronLeft className="mr-1 h-4 w-4" aria-hidden="true" /> Back to preview
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Desktop bottom ad — outside the editing workspace */}
      <div className="mx-auto mt-12 hidden max-w-[1280px] px-4 sm:px-6 lg:block lg:px-8">
        <AdSlot slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM} format="horizontal" />
      </div>

      {/* Processing overlay */}
      {isProcessing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-teriyaki/25 backdrop-blur-sm"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-3 rounded-2xl border bg-card px-6 py-5 shadow-soft">
            <span
              className="h-5 w-5 animate-spin rounded-full border-2 border-alma-collard border-t-transparent"
              aria-hidden="true"
            />
            <span className="text-sm font-medium">{processingLabel || "Working…"}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/** MakerPage = marketing header + editor. Rendered at #/passport-photo-maker and #/editor. */
export function MakerPage({ mode }: { mode: "maker" | "editor" }) {
  useEffect(() => {
    trackEvent("editor_opened");
  }, []);

  return (
    <div>
      {mode === "maker" ? (
        <section className="hero-wash dot-grid border-b border-border/70">
          <div className="container-editorial py-10 text-center md:py-14">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-alma-accent">
              Free · No sign-up · 300 DPI
            </p>
            <h1 className="mx-auto mt-3 max-w-2xl text-balance font-display text-4xl font-semibold leading-[1.06] md:text-5xl">
              Passport Photo Maker
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-muted-foreground">
              Upload a photo, crop it to your country&apos;s size, fix the background, and download
              a print-ready sheet. Everything runs in your browser — your photo never leaves your
              device.
            </p>
          </div>
        </section>
      ) : null}
      <EditorShell />
    </div>
  );
}
