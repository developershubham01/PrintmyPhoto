"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { composeFinalPhoto } from "@/lib/image/compose";
import { renderCroppedPhoto } from "@/lib/image/crop";
import {
  canvasToBlob,
  downloadBlob,
  renderSheetCanvas,
} from "@/lib/export/raster";
import { generateSheetPdf } from "@/lib/export/pdf";
import { printSheet } from "@/lib/export/print";
import { orientedPaper, useEditorStore } from "@/lib/store/editor-store";
import { mmToPx } from "@/lib/dimensions";
import { trackEvent } from "@/lib/analytics";
import {
  CheckCircle2,
  Download,
  FileImage,
  FileText,
  ImageIcon,
  Loader2,
  Printer,
  RotateCcw,
} from "lucide-react";

type ExportKind = "pdf" | "jpg" | "png";

export function DownloadStep() {
  const [busy, setBusy] = useState<ExportKind | "print" | null>(null);
  const [printOpen, setPrintOpen] = useState(false);
  const [lastFile, setLastFile] = useState<string | null>(null);

  const ensureExportBaked = useEditorStore((s) => s.ensureExportBaked);
  const transform = useEditorStore((s) => s.transform);
  const bg = useEditorStore((s) => s.bg);
  const photoSize = useEditorStore((s) => s.photoSize);
  const paper = useEditorStore((s) => s.paper);
  const orientation = useEditorStore((s) => s.orientation);
  const placements = useEditorStore((s) => s.placements);
  const resetAll = useEditorStore((s) => s.resetAll);

  const { paperW, paperH } = orientedPaper(paper, orientation);
  const dpi = 300;

  /** Renders the full 300 DPI sheet using the full-resolution baked source. */
  const renderFinalSheet = async (): Promise<HTMLCanvasElement> => {
    const baked = ensureExportBaked();
    if (!baked) throw new Error("No photo loaded.");
    const photoW = Math.round(mmToPx(photoSize.widthMm, dpi));
    const photoH = Math.round(mmToPx(photoSize.heightMm, dpi));
    const cropped = renderCroppedPhoto(baked, transform, photoSize.widthMm, photoSize.heightMm, dpi);
    const photoCanvas = composeFinalPhoto(cropped, bg, photoW, photoH);
    return renderSheetCanvas({
      paperWmm: paperW,
      paperHmm: paperH,
      dpi,
      placements,
      photoWmm: photoSize.widthMm,
      photoHmm: photoSize.heightMm,
      photoCanvas,
    });
  };

  const baseName = `passport-photos-${photoSize.widthMm}x${photoSize.heightMm}mm-${paperW}x${paperH}mm-300dpi`;

  const doExport = async (kind: ExportKind) => {
    setBusy(kind);
    try {
      const sheet = await renderFinalSheet();
      if (kind === "pdf") {
        const preserveAlpha = bg.mode === "transparent" && bg.autoRemove;
        const blob = await generateSheetPdf({
          sheetCanvas: sheet,
          paperWmm: paperW,
          paperHmm: paperH,
          preserveAlpha,
        });
        const name = `${baseName}.pdf`;
        downloadBlob(blob, name);
        setLastFile(name);
        trackEvent("pdf_downloaded", { count: placements.length });
        toast.success(`PDF downloaded — ${name}`, { duration: 4000 });
      } else if (kind === "jpg") {
        const blob = await canvasToBlob(sheet, "image/jpeg", 0.95);
        const name = `${baseName}.jpg`;
        downloadBlob(blob, name);
        setLastFile(name);
        trackEvent("jpg_downloaded", { count: placements.length });
        toast.success(`JPG downloaded — ${name}`, { duration: 4000 });
      } else {
        const blob = await canvasToBlob(sheet, "image/png");
        const name = `${baseName}.png`;
        downloadBlob(blob, name);
        setLastFile(name);
        trackEvent("png_downloaded", { count: placements.length });
        toast.success(`PNG downloaded — ${name}`, { duration: 4000 });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Export failed — please try again.");
    } finally {
      setBusy(null);
    }
  };

  const doPrint = () => {
    setPrintOpen(true);
  };

  const confirmPrint = async () => {
    setPrintOpen(false);
    setBusy("print");
    try {
      const sheet = await renderFinalSheet();
      const dataUrl = sheet.toDataURL("image/jpeg", 0.95);
      printSheet(dataUrl, paperW, paperH);
      trackEvent("print_started", { count: placements.length });
      toast.success("Print dialog opened — remember to pick Actual size / 100%.", {
        duration: 6000,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not prepare the print.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-10">
      <div className="min-w-0 space-y-4">
        <div>
          <h3 className="font-display text-xl font-semibold">Download &amp; print</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Your sheet is rendered at 300 DPI with exact physical dimensions —{" "}
            {placements.length} × {photoSize.label} photos on {paper.label}.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <DownloadCard
            icon={<FileText className="h-5 w-5" aria-hidden="true" />}
            title="PDF (recommended)"
            description="Exact paper size, print-ready. Best for shops and home printers."
            cta="Download PDF"
            loading={busy === "pdf"}
            onClick={() => doExport("pdf")}
            primary
          />
          <DownloadCard
            icon={<FileImage className="h-5 w-5" aria-hidden="true" />}
            title="JPG image"
            description="High-quality 300 DPI photo sheet for quick sharing or printing."
            cta="Download JPG"
            loading={busy === "jpg"}
            onClick={() => doExport("jpg")}
          />
          <DownloadCard
            icon={<ImageIcon className="h-5 w-5" aria-hidden="true" />}
            title="PNG image"
            description="Lossless quality; keeps transparency if you chose it."
            cta="Download PNG"
            loading={busy === "png"}
            onClick={() => doExport("png")}
          />
          <DownloadCard
            icon={<Printer className="h-5 w-5" aria-hidden="true" />}
            title="Print directly"
            description="Opens your browser's print dialog with correct paper size."
            cta="Print now"
            loading={busy === "print"}
            onClick={doPrint}
          />
        </div>

        {lastFile && (
          <div className="flex items-center gap-2.5 rounded-xl border border-alma-collard/30 bg-accent/40 p-4 text-sm">
            <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-alma-collard" aria-hidden="true" />
            <span>
              Downloaded <strong className="font-mono text-[13px]">{lastFile}</strong> — check your
              downloads folder.
            </span>
          </div>
        )}

        <Button
          variant="outline"
          className="h-11 rounded-xl"
          onClick={() => {
            resetAll();
            toast.info("Session cleared — all photo data removed from memory.");
          }}
        >
          <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
          Start over (clears everything)
        </Button>
      </div>

      <aside className="min-w-0 space-y-4">
        <div className="rounded-2xl border bg-card p-5 shadow-card">
          <p className="font-display text-lg font-semibold">Printing checklist</p>
          <ol className="mt-3 space-y-2.5 text-[13.5px] leading-relaxed text-muted-foreground">
            {[
              "Open the downloaded PDF (or print directly).",
              "In the print dialog, select your paper size (e.g. 4×6 in or A4).",
              "Set scaling to “Actual size” / 100%.",
              "Disable “Fit to page”, “Shrink to fit” and any “scale to paper” options.",
              "Use photo paper or cardstock; pick the highest quality setting.",
              "Print one test sheet and measure a photo with a ruler to confirm 100% scale.",
            ].map((step, i) => (
              <li key={i} className="flex gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-bold text-alma-collard">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-2xl border border-alma-orange/40 bg-alma-orange/10 p-4 text-[13px] leading-relaxed">
          <strong className="font-semibold">Before you submit anywhere:</strong> verify size,
          background, head position and photo age against the official requirements of your
          document. This tool does not guarantee compliance with any government standard.
        </div>
      </aside>

      <Dialog open={printOpen} onOpenChange={setPrintOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Ready to print</DialogTitle>
            <DialogDescription>
              Two quick settings make the photos come out at exactly {photoSize.label}:
            </DialogDescription>
          </DialogHeader>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-alma-collard" aria-hidden="true" />
              Paper size: <strong className="text-foreground">{paper.label}</strong>
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-alma-collard" aria-hidden="true" />
              Scale: <strong className="text-foreground">Actual size / 100%</strong> (not Fit to
              page)
            </li>
          </ul>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setPrintOpen(false)}>
              Cancel
            </Button>
            <Button className="btn-gradient rounded-xl" onClick={confirmPrint}>
              <Printer className="mr-2 h-4 w-4" aria-hidden="true" />
              Open print dialog
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DownloadCard({
  icon,
  title,
  description,
  cta,
  onClick,
  loading,
  primary,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: string;
  onClick: () => void;
  loading?: boolean;
  primary?: boolean;
}) {
  return (
    <div
      className={
        primary
          ? "flex flex-col rounded-2xl border-2 border-alma-collard/40 bg-card p-5 shadow-card"
          : "flex flex-col rounded-2xl border bg-card p-5 shadow-card"
      }
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-alma-collard">
        {icon}
      </span>
      <p className="mt-3 font-display text-[17px] font-semibold">{title}</p>
      <p className="mt-1 flex-1 text-[13px] leading-relaxed text-muted-foreground">{description}</p>
      <Button
        className={cnDownloadBtn(primary)}
        onClick={onClick}
        disabled={loading}
        aria-label={cta}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            Rendering 300 DPI…
          </>
        ) : (
          <>
            <Download className="mr-2 h-4 w-4" aria-hidden="true" />
            {cta}
          </>
        )}
      </Button>
    </div>
  );
}

function cnDownloadBtn(primary?: boolean): string {
  return [
    "mt-4 h-11 rounded-xl font-semibold",
    primary ? "btn-gradient" : "",
  ].join(" ");
}
