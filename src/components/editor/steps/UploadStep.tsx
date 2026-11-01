"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
import {
  Camera,
  FlipHorizontal2,
  ImagePlus,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { useEditorStore } from "@/lib/store/editor-store";
import { ACCEPTED_EXT, MAX_FILE_BYTES } from "@/lib/image/validate";
import { formatBytes } from "@/lib/dimensions";
import { cn } from "@/lib/utils";

export function UploadStep() {
  const loadImage = useEditorStore((s) => s.loadImage);
  const loadSample = useEditorStore((s) => s.loadSample);
  const isProcessing = useEditorStore((s) => s.isProcessing);
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      const file = files?.[0];
      if (!file) return;
      try {
        await loadImage(file);
        toast.success("Photo loaded — it stays on your device.", { duration: 3000 });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not load that photo.");
      }
    },
    [loadImage],
  );

  // Global paste support
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const item = Array.from(e.clipboardData?.items ?? []).find((i) => i.type.startsWith("image/"));
      const file = item?.getAsFile();
      if (file) {
        handleFiles({ 0: file, length: 1, item: () => file } as unknown as FileList);
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [handleFiles]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-10">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload a photo: click, drag and drop, or paste"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex min-h-[300px] cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed bg-card p-8 text-center shadow-card transition-all",
          dragging
            ? "border-alma-collard bg-accent scale-[1.01]"
            : "border-border hover:border-alma-collard/50",
        )}
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-alma-collard">
          <UploadCloud className="h-8 w-8" aria-hidden="true" />
        </span>
        <div>
          <p className="font-display text-xl font-semibold">Drop your photo here</p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            or click to browse · paste from clipboard (Ctrl+V)
          </p>
        </div>
        <div className="mt-2 flex flex-wrap justify-center gap-2.5">
          <Button
            className="btn-gradient h-11 rounded-xl px-6"
            onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
            disabled={isProcessing}
          >
            <ImagePlus className="mr-2 h-4.5 w-4.5" aria-hidden="true" />
            Select photo
          </Button>
          <Button
            variant="outline"
            className="h-11 rounded-xl px-5"
            onClick={(e) => { e.stopPropagation(); setCameraOpen(true); }}
            disabled={isProcessing}
          >
            <Camera className="mr-2 h-4.5 w-4.5" aria-hidden="true" />
            Use camera
          </Button>
          <Button
            variant="secondary"
            className="h-11 rounded-xl px-5"
            onClick={(e) => {
              e.stopPropagation();
              loadSample().catch(() => toast.error("Could not load the sample photo."));
            }}
            disabled={isProcessing}
          >
            <Sparkles className="mr-2 h-4.5 w-4.5" aria-hidden="true" />
            Try sample photo
          </Button>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          JPG · PNG · WebP — up to {formatBytes(MAX_FILE_BYTES)} · photos never leave your device
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXT.join(",")}
          className="sr-only"
          aria-label="Upload photo file"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      <aside className="space-y-4">
        <h2 className="font-display text-lg font-semibold">What makes a good source photo?</h2>
        <ul className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          {[
            "Use the original, highest-resolution image you have — the editor will check that it's sharp enough for 300 DPI printing.",
            "Face the camera directly with a neutral expression and even lighting on your face.",
            "A plain wall behind you makes automatic background replacement far more accurate.",
            "Avoid hats, sunglasses, heavy shadows or filters — most document rules reject them.",
          ].map((tip) => (
            <li key={tip.slice(0, 24)} className="flex gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-alma-support" aria-hidden="true" />
              {tip}
            </li>
          ))}
        </ul>
        <div className="rounded-xl border border-alma-accent/25 bg-alma-accent/5 p-4 text-[13px] leading-relaxed">
          <strong className="font-semibold text-alma-accent">Privacy first.</strong> Your photo is
          processed entirely in your browser using HTML5 Canvas. It is never uploaded to a server,
          never stored, and never shared. Closing the page clears it.
        </div>
      </aside>

      <CameraDialog
        key={cameraOpen ? "cam-open" : "cam-closed"}
        open={cameraOpen}
        onOpenChange={setCameraOpen}
        onCapture={handleFiles}
      />
      {/* Hidden direct-camera capture for mobile devices without getUserMedia permissions UI */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="user"
        className="sr-only"
        aria-label="Capture photo with camera"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        className="sr-only"
        onClick={() => cameraInputRef.current?.click()}
        aria-hidden="true"
        tabIndex={-1}
      >
        fallback camera
      </button>
    </div>
  );
}

function CameraDialog({
  open,
  onOpenChange,
  onCapture,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCapture: (files: FileList | null) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mirrored, setMirrored] = useState(true);

  useEffect(() => {
    if (!open) {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      return;
    }
    let cancelled = false;
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: "user", width: { ideal: 1920 }, height: { ideal: 1080 } } })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          void videoRef.current.play();
        }
      })
      .catch(() => {
        setError(
          "Camera access was blocked or is unavailable. You can use the “Select photo” button instead, or take a photo with your camera app and upload it.",
        );
      });
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [open]);

  const capture = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d")!;
    if (mirrored) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], "camera-photo.png", { type: "image/png" });
      onCapture({ 0: file, length: 1, item: () => file } as unknown as FileList);
      onOpenChange(false);
    }, "image/png");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Take a photo</DialogTitle>
          <DialogDescription>
            Center your face in the frame. The camera preview is local — nothing is recorded or
            uploaded.
          </DialogDescription>
        </DialogHeader>
        {error ? (
          <p className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </p>
        ) : (
          <div className="relative overflow-hidden rounded-xl border bg-foreground/90">
            <video
              ref={videoRef}
              playsInline
              muted
              className="mx-auto block max-h-[52vh] w-auto"
              style={{ transform: mirrored ? "scaleX(-1)" : undefined }}
              aria-label="Camera preview"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 m-auto h-[72%] w-[52%] rounded-[50%] border-2 border-dashed border-white/60"
            />
          </div>
        )}
        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" className="rounded-xl" onClick={() => setMirrored((m) => !m)}>
            <FlipHorizontal2 className="mr-2 h-4 w-4" aria-hidden="true" /> Mirror
          </Button>
          <Button className="btn-gradient rounded-xl" onClick={capture} disabled={Boolean(error)}>
            <Camera className="mr-2 h-4 w-4" aria-hidden="true" /> Capture photo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
