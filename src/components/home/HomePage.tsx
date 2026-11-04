"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/lib/store/editor-store";
import { AdSlot } from "@/components/ads/AdSlot";
import { POPULAR_SIZES, findCountry } from "@/data/passport-sizes";
import { PAPER_SIZES } from "@/data/paper-sizes";
import { FAQS } from "@/data/faqs";
import { computeGrid } from "@/lib/layout-calculator";
import { formatDimensions } from "@/lib/dimensions";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CloudUpload,
  Crop,
  Download,
  Eraser,
  Eye,
  Heart,
  Landmark,
  LayoutGrid,
  Lock,
  Printer,
  Ruler,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const BG_COLORS = ["#ffffff", "#f7f5ed", "#e8e8e8", "#d7e5ea", "#f4edda"];

export function HomePage() {
  return (
    <div>
      <Hero />
      <div className="container-editorial mt-10">
        <AdSlot slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP} format="horizontal" />
      </div>
      <HowItWorks />
      <UploadCta />
      <PopularSizes />
      <PaperSizesSection />
      <BackgroundSection />
      <WhySection />
      <PrivacySection />
      <MidEducational />
      <div className="container-editorial">
        <AdSlot slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_MID} format="horizontal" />
      </div>
      <FaqTeaser />
      <FinalCta />
      <div className="container-editorial mb-12">
        <AdSlot slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM} format="horizontal" />
      </div>
    </div>
  );
}

/* ─────────────────────────────── Hero ─────────────────────────────── */

function Hero() {
  return (
    <section className="hero-wash relative overflow-hidden border-b border-border/70">
      <div className="container-editorial grid items-center gap-10 py-10 sm:py-14 md:py-20 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border bg-card/80 px-3.5 py-1.5 text-[12px] font-semibold text-alma-collard dark:text-alma-kiwi shadow-card"
          >
            <Sparkles className="h-3.5 w-3.5 text-alma-orange" aria-hidden="true" />
            Free forever · No sign-up · Photos never leave your browser
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            className="mt-5 text-balance font-display text-[clamp(2.3rem,5.5vw,4.1rem)] font-semibold leading-[1.03]"
          >
            Your Perfect Passport Photo,{" "}
            <span className="relative whitespace-nowrap text-alma-collard dark:text-alma-kiwi">
              Ready to Print.
              <svg
                aria-hidden="true"
                viewBox="0 0 220 12"
                className="absolute -bottom-2 left-0 w-full text-alma-support opacity-90"
                preserveAspectRatio="none"
              >
                <path d="M2 9C60 3 160 3 218 8" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mt-5 max-w-xl text-[16px] sm:text-[17px] leading-relaxed text-muted-foreground"
          >
            Create, customize and print passport-size photographs in minutes. Upload your photo,
            choose your size and download a print-ready sheet — arranged automatically on 4×6, A4,
            Letter and more.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="mt-7 flex flex-wrap gap-3"
          >
            <Button
              className="btn-gradient h-12 sm:h-13 rounded-xl px-6 sm:px-7 text-[15px] sm:text-[15.5px] font-semibold"
              onClick={() => (window.location.hash = "#/passport-photo-maker")}
            >
              Create Your Photo
              <ArrowRight className="ml-2 h-4.5 w-4.5" aria-hidden="true" />
            </Button>
            <Button
              variant="secondary"
              className="h-12 sm:h-13 rounded-xl px-6 sm:px-7 text-[15px] sm:text-[15.5px] font-semibold"
              onClick={() => (window.location.hash = "#/passport-photo-sizes")}
            >
              Explore Photo Sizes
            </Button>
          </motion.div>
          <div className="mt-8 grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:gap-x-6 sm:gap-y-2 text-[12.5px] sm:text-[13px] text-muted-foreground">
            {[
              { icon: <ShieldCheck className="h-4 w-4 text-alma-collard dark:text-alma-kiwi shrink-0" aria-hidden="true" />, text: "Browser-side processing" },
              { icon: <Zap className="h-4 w-4 text-alma-orange shrink-0" aria-hidden="true" />, text: "300 DPI print-ready PDF" },
              { icon: <Landmark className="h-4 w-4 text-alma-accent shrink-0" aria-hidden="true" />, text: "35+ country size presets" },
              { icon: <Smartphone className="h-4 w-4 text-alma-teal shrink-0" aria-hidden="true" />, text: "Works on mobile" },
            ].map((t) => (
              <span key={t.text} className="inline-flex items-center gap-1.5">
                {t.icon}
                <span>{t.text}</span>
              </span>
            ))}
          </div>
        </div>

        <HeroMockup />
      </div>
    </section>
  );
}

function HeroMockup() {
  const [bg, setBg] = useState(BG_COLORS[0]);
  const [paperFormat, setPaperFormat] = useState<"4x6" | "a4" | "letter">("4x6");

  const photoCount = paperFormat === "4x6" ? 6 : paperFormat === "a4" ? 30 : 24;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.55, ease: "easeOut" }}
      className="relative mx-auto w-full max-w-[460px] px-2 sm:px-0"
      aria-hidden="true"
    >
      {/* Soft atmospheric ambient glow */}
      <div className="absolute -left-6 -top-6 h-36 w-36 rounded-full bg-alma-kiwi/25 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-6 -right-4 h-40 w-40 rounded-full bg-alma-orange/20 blur-3xl pointer-events-none" />
      <div className="absolute right-6 top-16 h-24 w-24 rounded-full bg-alma-teal/15 blur-2xl pointer-events-none" />

      {/* Main Editor Card */}
      <div className="relative rounded-[28px] sm:rounded-[32px] border bg-card/95 p-4 sm:p-5 shadow-lift backdrop-blur">
        {/* Card header with official biometric pill badge */}
        <div className="flex items-center justify-between border-b border-border/70 pb-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-alma-orange/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-alma-support/90" />
            <span className="h-2.5 w-2.5 rounded-full bg-alma-teal/70" />
          </div>
          <span className="rounded-full bg-[#f0eee1] dark:bg-card px-3 py-1 text-[10.5px] font-bold uppercase tracking-wider text-alma-collard dark:text-alma-kiwi border border-border/60">
            STEP 2 · CROP &amp; BIOMETRIC GUIDE
          </span>
        </div>

        {/* Center layout: Photo on left, Sliders & Background on right */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Photo frame with official biometric guidelines */}
          <div
            className="relative w-[150px] overflow-hidden rounded-2xl border-2 border-[#435a29] dark:border-alma-kiwi/80 shadow-card transition-colors duration-200 shrink-0"
            style={{ aspectRatio: "35/45", backgroundColor: bg }}
          >
            <SamplePortrait />
            <svg viewBox="0 0 100 130" className="absolute inset-0 h-full w-full pointer-events-none">
              {/* Yellow/lime dashed eye level line */}
              <line x1="0" y1="49" x2="100" y2="49" stroke="#c3d638" strokeWidth="1" strokeDasharray="4 2.5" />
              {/* Center vertical dashed axis */}
              <line x1="50" y1="0" x2="50" y2="130" stroke="rgba(20,108,132,0.4)" strokeWidth="0.8" strokeDasharray="4 3" />
              {/* Biometric dashed oval face guide */}
              <ellipse cx="50" cy="53" rx="24" ry="32" fill="none" stroke="rgba(20,108,132,0.85)" strokeWidth="1" strokeDasharray="5 3" />
            </svg>
          </div>

          {/* Sliders & Color Swatches */}
          <div className="flex flex-col justify-between py-1 w-full sm:w-auto">
            <div className="space-y-2.5">
              {[
                { label: "Zoom 115%", pct: "72%" },
                { label: "Brightness +5%", pct: "55%" },
                { label: "Contrast +3%", pct: "53%" },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-2">
                  <div className="h-2 w-24 rounded-full bg-[#f0eee1] dark:bg-secondary overflow-hidden">
                    <div className="h-full bg-alma-collard dark:bg-alma-kiwi rounded-full" style={{ width: row.pct }} />
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground">{row.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-3.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                BACKGROUND
              </p>
              <div className="flex items-center gap-1.5">
                {BG_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-label={`Background ${c}`}
                    onClick={() => setBg(c)}
                    className={cn(
                      "h-6.5 w-6.5 rounded-full border border-black/15 transition-transform hover:scale-110 cursor-pointer",
                      bg === c && "ring-2 ring-alma-collard dark:ring-alma-kiwi ring-offset-2 ring-offset-card",
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom dimensions bar */}
        <div className="mt-4 flex items-center justify-between rounded-xl bg-[#f0eee1] dark:bg-secondary/60 px-4 py-2.5">
          <span className="text-[12px] font-semibold text-alma-collard dark:text-alma-kiwi">35 × 45 mm · 300 DPI</span>
          <span className="text-[11px] text-muted-foreground font-mono">413 × 531 px</span>
        </div>
      </div>

      {/* Floating: Interactive Paper Selector Badge (Top Left) */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-2 sm:-left-5 top-7 hidden rounded-2xl border bg-card/95 p-3.5 shadow-lift backdrop-blur sm:block z-20"
      >
        <p className="text-[9.5px] font-bold uppercase tracking-wider text-muted-foreground">PAPER FORMAT</p>
        <div className="mt-1.5 flex items-center gap-1.5">
          {(["4x6", "a4", "letter"] as const).map((fmt) => {
            const labels = { "4x6": "4×6 in", a4: "A4", letter: "Letter" };
            const active = paperFormat === fmt;
            return (
              <button
                key={fmt}
                type="button"
                onClick={() => setPaperFormat(fmt)}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer",
                  active
                    ? "bg-alma-collard text-white dark:bg-alma-kiwi dark:text-alma-collard shadow-xs"
                    : "border bg-card text-foreground/80 hover:bg-secondary",
                )}
              >
                {labels[fmt]}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Floating: Live PDF Preview Badge (Bottom Right) */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        className="absolute -bottom-6 -right-2 sm:-right-5 hidden rounded-2xl border bg-card/95 p-3.5 shadow-lift backdrop-blur sm:block z-20"
      >
        <div className="flex items-center gap-2.5">
          <div className="grid grid-cols-3 gap-1 rounded-md border border-border bg-white dark:bg-muted p-1.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="h-3.5 w-3 rounded-[2px] border border-black/10 transition-colors" style={{ backgroundColor: bg }} />
            ))}
          </div>
          <div>
            <p className="flex items-center gap-1 text-[12.5px] font-bold text-alma-collard dark:text-alma-kiwi">
              <BadgeCheck className="h-4 w-4" /> {photoCount} photos
            </p>
            <p className="text-[10px] text-muted-foreground font-medium">Print-ready PDF</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Elegant passport portrait illustration matching biometric passport standards. */
function SamplePortrait() {
  return (
    <svg viewBox="0 0 100 130" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="suitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e2c38" />
          <stop offset="100%" stopColor="#131e28" />
        </linearGradient>
        <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#eed5c4" />
          <stop offset="100%" stopColor="#e3c2ac" />
        </linearGradient>
      </defs>

      {/* Torso & Suit jacket shoulders */}
      <path
        d="M10 130 C16 104 32 94 44 92 L50 102 L56 92 C68 94 84 104 90 130 Z"
        fill="url(#suitGrad)"
      />
      {/* Crisp white shirt collar notch */}
      <path d="M44 92 L50 110 L56 92 L50 99 Z" fill="#ffffff" />
      <path d="M49 99 L50 120 L51 99 Z" fill="#146c84" />
      <path d="M37 94 L45 112 L42 114 L33 98 Z" fill="#17222c" />
      <path d="M63 94 L55 112 L58 114 L67 98 Z" fill="#17222c" />

      {/* Neck */}
      <rect x="44" y="76" width="12" height="18" rx="3" fill="url(#skinGrad)" />
      <path d="M44 82 C47 86 53 86 56 82 Z" fill="rgba(0,0,0,0.06)" />

      {/* Ears */}
      <ellipse cx="29" cy="54" rx="2.8" ry="5.5" fill="#e3c2ac" />
      <ellipse cx="71" cy="54" rx="2.8" ry="5.5" fill="#e3c2ac" />

      {/* Head oval */}
      <ellipse cx="50" cy="53" rx="21" ry="25.5" fill="url(#skinGrad)" />

      {/* Styled Hair */}
      <path
        d="M29 50 C29 28 38 21 50 21 C62 21 71 28 71 50 C71 36 62 29 50 29 C38 29 29 36 29 50 Z"
        fill="#221811"
      />
      <path
        d="M29 46 C31 29 40 23 50 23 C60 23 69 29 71 46 C68 35 60 31 50 31 C40 31 32 35 29 46 Z"
        fill="#221811"
      />

      {/* Eyebrows */}
      <path d="M37 45 Q42 43 47 45" stroke="#1e140d" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M53 45 Q58 43 63 45" stroke="#1e140d" strokeWidth="1.8" strokeLinecap="round" fill="none" />

      {/* Eyes with reflections */}
      <ellipse cx="42" cy="50" rx="3.2" ry="2.2" fill="#1e140d" />
      <ellipse cx="58" cy="50" rx="3.2" ry="2.2" fill="#1e140d" />
      <circle cx="43" cy="49.2" r="0.8" fill="#ffffff" />
      <circle cx="59" cy="49.2" r="0.8" fill="#ffffff" />

      {/* Nose bridge & tip */}
      <path d="M49.5 49 L49 59 Q50 61 51.5 59" stroke="#caa28b" strokeWidth="1.4" strokeLinecap="round" fill="none" />

      {/* Neutral mouth (official passport requirement) */}
      <path d="M45 70 Q50 71 55 70" stroke="#b06a58" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/* ──────────────────────────── How it works ──────────────────────────── */

const HOW_STEPS = [
  {
    icon: <CloudUpload className="h-6 w-6" aria-hidden="true" />,
    title: "Upload your photo",
    text: "Drop in a JPG, PNG or WebP, use your camera, or try the sample. Your photo is processed on your device — it is never uploaded to a server.",
  },
  {
    icon: <Crop className="h-6 w-6" aria-hidden="true" />,
    title: "Crop & customize",
    text: "Zoom and position your face with the guide overlay, fine-tune brightness and contrast, and optionally replace the background with a plain color.",
  },
  {
    icon: <Printer className="h-6 w-6" aria-hidden="true" />,
    title: "Print or download",
    text: "The studio arranges every copy on your paper size with correct spacing, then you download a 300 DPI PDF, JPG or PNG — or print directly.",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-heading" className="container-editorial py-14 md:py-20">
      <p className="text-center text-[12px] font-semibold uppercase tracking-[0.2em] text-alma-accent">
        How it works
      </p>
      <h2 id="how-heading" className="mt-3 text-center font-display text-3xl font-semibold md:text-4xl">
        Three simple steps
      </h2>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {HOW_STEPS.map((s, i) => (
          <motion.article
            key={s.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.08 }}
            className="relative rounded-2xl border bg-card p-6 shadow-card"
          >
            <span className="absolute right-5 top-5 font-display text-4xl font-semibold text-secondary">
              {i + 1}
            </span>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-alma-collard">
              {s.icon}
            </span>
            <h3 className="mt-4 font-display text-xl font-semibold">{s.title}</h3>
            <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">{s.text}</p>
          </motion.article>
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Want the full walkthrough?{" "}
        <a href="#/how-it-works" className="font-semibold text-alma-accent underline underline-offset-4">
          See how it works in detail
        </a>
      </p>
    </section>
  );
}

/* ──────────────────────────── Upload CTA ──────────────────────────── */

function UploadCta() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const loadImage = useEditorStore((s) => s.loadImage);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await loadImage(file);
        window.location.hash = "#/passport-photo-maker";
      } catch {
        window.location.hash = "#/passport-photo-maker";
      }
    }
  };

  return (
    <section aria-labelledby="upload-cta" className="container-editorial">
      <div className="relative overflow-hidden rounded-[32px] border border-alma-collard/30 bg-[image:var(--alma-gradient-primary)] p-8 text-alma-yogurt shadow-lift md:p-12">
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-alma-kiwi/25 blur-2xl pointer-events-none"
        />
        <div className="relative grid items-center gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <h2 id="upload-cta" className="font-display text-3xl font-semibold md:text-4xl">
              Ready in about three minutes
            </h2>
            <p className="mt-3 max-w-xl text-[15.5px] leading-relaxed opacity-90">
              No account, no watermark, no email required. Upload a photo and the studio handles
              cropping, sizing and sheet layout for you.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={handleFileChange}
              aria-label="Upload photo"
            />
            <Button
              type="button"
              variant="white"
              className="h-14 rounded-2xl bg-white text-[#2a3d1c] hover:bg-[#fffdf5] hover:text-[#2a3d1c] px-8 text-[16px] font-bold shadow-lift transition-all hover:scale-[1.02] active:scale-[0.98] border border-white/50 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <CloudUpload className="mr-2 h-5 w-5 text-alma-collard shrink-0" aria-hidden="true" />
              Upload your photo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Popular sizes ─────────────────────────── */

function PopularSizes() {
  const setPhotoSize = useEditorStore((s) => s.setPhotoSize);

  return (
    <section aria-labelledby="sizes-heading" className="container-editorial py-14 md:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-alma-accent">
            Photo sizes
          </p>
          <h2 id="sizes-heading" className="mt-3 font-display text-3xl font-semibold md:text-4xl">
            Popular passport photo sizes
          </h2>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Preconfigured presets with exact physical dimensions. Requirements vary by authority —
            every preset links to the official source so you can double-check.
          </p>
        </div>
        <Button variant="outline" className="h-12 rounded-xl px-6 font-semibold" onClick={() => (window.location.hash = "#/passport-photo-sizes")}>
          All countries
          <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {POPULAR_SIZES.slice(0, 6).map((s) => {
          const country = findCountry(s.countryId);
          return (
            <div
              key={s.id}
              onClick={() => {
                setPhotoSize({ ...s, countryId: s.countryId ?? null });
                window.location.hash = "#/passport-photo-maker";
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setPhotoSize({ ...s, countryId: s.countryId ?? null });
                  window.location.hash = "#/passport-photo-maker";
                }
              }}
              className="group flex items-center gap-4 rounded-2xl border bg-card p-5 text-left shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift cursor-pointer"
            >
              <span
                aria-hidden="true"
                className="h-16 w-13 shrink-0 rounded-lg border-2 border-alma-collard/40 bg-alma-yogurt transition-colors group-hover:border-alma-collard"
                style={{ width: (64 * s.widthMm) / s.heightMm, height: 64 }}
              />
              <span className="flex-1">
                <span className="flex items-center gap-2 font-display text-lg font-semibold">
                  {country?.flag} {formatDimensions(s.widthMm, s.heightMm)}
                </span>
                <span className="mt-0.5 block text-[13px] text-muted-foreground">{s.label}</span>
                <span className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-alma-collard dark:text-alma-kiwi group-hover:underline">
                  Use this size in maker
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ──────────────────────── Paper sizes (live math) ─────────────────────── */

function PaperSizesSection() {
  const setPaper = useEditorStore((s) => s.setPaper);
  const rows = useMemo(() => {
    return PAPER_SIZES.map((p) => {
      const grid = computeGrid({
        paperW: p.widthMm,
        paperH: p.heightMm,
        photoW: 35,
        photoH: 45,
        margin: 4,
        gapX: 2,
        gapY: 2,
      });
      return { paper: p, count: grid.placements.length, grid: `${grid.cols} × ${grid.rows}` };
    });
  }, []);

  return (
    <section aria-labelledby="paper-heading" className="border-y border-border/70 bg-alma-yogurt/70 py-14 md:py-20 dark:bg-card/40">
      <div className="container-editorial">
        <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-alma-accent">
          Paper sizes
        </p>
        <h2 id="paper-heading" className="mt-3 font-display text-3xl font-semibold md:text-4xl">
          How many photos fit on your paper?
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          Live calculation for standard 35 × 45 mm photos with a 4 mm margin and 2 mm gaps — the
          same math the arranger uses for your exact settings.
        </p>
        <div className="mt-8 overflow-x-auto rounded-2xl border bg-card shadow-card scroll-slim">
          <table className="w-full min-w-[560px] text-left text-sm">
            <caption className="sr-only">Number of 35×45 mm passport photos per paper size</caption>
            <thead>
              <tr className="border-b bg-secondary/50 text-[13px] uppercase tracking-wide text-muted-foreground">
                <th scope="col" className="px-5 py-3.5 font-semibold">Paper</th>
                <th scope="col" className="px-5 py-3.5 font-semibold">Dimensions</th>
                <th scope="col" className="px-5 py-3.5 font-semibold">Grid</th>
                <th scope="col" className="px-5 py-3.5 text-center font-semibold">Photos per sheet</th>
                <th scope="col" className="px-5 py-3.5 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ paper, count, grid }) => (
                <tr key={paper.id} className="border-b border-border/60 last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-3.5 font-semibold">{paper.label}</td>
                  <td className="px-5 py-3.5 tabular-nums text-muted-foreground">
                    {formatDimensions(paper.widthMm, paper.heightMm)}
                  </td>
                  <td className="px-5 py-3.5 tabular-nums text-muted-foreground">{grid}</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 font-display text-[15px] font-bold text-alma-collard dark:text-alma-kiwi">
                      <LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />
                      {count}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8.5 rounded-lg px-3 text-xs font-semibold text-alma-collard dark:text-alma-kiwi hover:bg-secondary"
                      onClick={() => {
                        setPaper(paper);
                        window.location.hash = "#/passport-photo-maker";
                      }}
                    >
                      Use this paper
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-[13px] text-muted-foreground">
          Using a different photo size or spacing?{" "}
          <a href="#/passport-photo-maker" className="font-semibold text-alma-accent underline underline-offset-2">
            The arranger calculates it exactly
          </a>
          .
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────── Background customization ─────────────────────── */

function BackgroundSection() {
  const [color, setColor] = useState(BG_COLORS[0]);
  const setBg = useEditorStore((s) => s.setBg);

  return (
    <section aria-labelledby="bg-heading" className="container-editorial py-14 md:py-20">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-alma-accent">
            Background customization
          </p>
          <h2 id="bg-heading" className="mt-3 font-display text-3xl font-semibold md:text-4xl">
            A clean background in one click
          </h2>
          <p className="mt-4 text-[15.5px] leading-relaxed text-muted-foreground">
            Most documents require a plain, light background. The automatic remover is approximate
            and runs entirely on your device: it lifts you off the original backdrop, then you drop
            the cutout onto white, off-white, light grey, cream — or any custom color.
          </p>
          <ul className="mt-5 space-y-2.5 text-[14.5px]">
            {[
              "Tolerance slider to fine-tune tricky edges like hair",
              "Uniformity warning when your source background is uneven",
              "Transparent PNG export where supported",
              "Honest labeling — we never promise guaranteed compliance",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4.5 w-4.5 shrink-0 text-alma-collard dark:text-alma-kiwi" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <Button
              className="btn-gradient h-11 rounded-xl px-6 font-semibold"
              onClick={() => {
                setBg({ mode: "color", color, autoRemove: true });
                window.location.hash = "#/passport-photo-maker";
              }}
            >
              Start photo maker with this background
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[380px]">
          <div className="rounded-[32px] border bg-card p-6 shadow-lift">
            <div
              className="mx-auto w-[190px] overflow-hidden rounded-2xl border-2 border-[#435a29] dark:border-alma-kiwi/80 shadow-card transition-colors duration-300"
              style={{ aspectRatio: "35/45", backgroundColor: color }}
            >
              <SamplePortrait />
            </div>
            <div className="mt-5 flex justify-center gap-2.5">
              {BG_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={`Try ${c} background`}
                  aria-pressed={color === c}
                  onClick={() => setColor(c)}
                  className={cn(
                    "h-9 w-9 rounded-full border border-black/15 transition-transform hover:scale-110 cursor-pointer",
                    color === c && "ring-2 ring-alma-collard dark:ring-alma-kiwi ring-offset-2 ring-offset-card",
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <p className="mt-4 text-center text-[12.5px] text-muted-foreground font-medium">
              Try it — pick a background color
            </p>
          </div>
          <div className="absolute -left-3 top-8 hidden rounded-2xl border bg-card/95 p-3 shadow-lift backdrop-blur sm:block">
            <Eraser className="h-5 w-5 text-alma-accent" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────── Why this tool ───────────────────────────── */

const WHY = [
  { icon: <Lock className="h-5 w-5" aria-hidden="true" />, title: "Truly private", text: "Photos are processed locally in your browser. No upload, no storage, no sharing." },
  { icon: <Ruler className="h-5 w-5" aria-hidden="true" />, title: "Exact physical sizes", text: "Layouts are computed in millimetres and exported at 300 DPI — the PDF page is exactly your paper." },
  { icon: <Zap className="h-5 w-5" aria-hidden="true" />, title: "Fast & free", text: "No account, no watermark, no paywall. From upload to downloadable sheet in about three minutes." },
  { icon: <Landmark className="h-5 w-5" aria-hidden="true" />, title: "Country presets", text: "US 2×2 in, UK/India/EU 35×45 mm, Canada 50×70 mm and more — plus custom dimensions." },
  { icon: <LayoutGrid className="h-5 w-5" aria-hidden="true" />, title: "Smart arrangement", text: "Automatic grid with adjustable margins and gaps, plus drag-to-position with overlap protection." },
  { icon: <Smartphone className="h-5 w-5" aria-hidden="true" />, title: "Any device", text: "Fully responsive and touch-friendly — crop, arrange and download from your phone or desktop." },
];

function WhySection() {
  return (
    <section aria-labelledby="why-heading" className="border-y border-border/70 bg-alma-yogurt/70 py-14 md:py-20 dark:bg-card/40">
      <div className="container-editorial">
        <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-alma-accent">Why use this tool</p>
        <h2 id="why-heading" className="mt-3 font-display text-3xl font-semibold md:text-4xl">
          Built like a photo studio, priced like a library
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WHY.map((w, i) => (
            <motion.div
              key={w.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 3) * 0.07 }}
              className="rounded-2xl border bg-card p-5 shadow-card"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-alma-collard">
                {w.icon}
              </span>
              <h3 className="mt-3.5 font-display text-lg font-semibold">{w.title}</h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">{w.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── Privacy ─────────────────────────────── */

function PrivacySection() {
  return (
    <section aria-labelledby="privacy-heading" className="container-editorial py-14 md:py-20">
      <div className="grid items-center gap-8 rounded-[32px] border bg-card p-8 shadow-card md:grid-cols-[auto_1fr] md:p-10">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-alma-collard">
          <ShieldCheck className="h-8 w-8" aria-hidden="true" />
        </span>
        <div>
          <h2 id="privacy-heading" className="font-display text-2xl font-semibold md:text-3xl">
            Privacy and security
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            Your photos are processed locally in your browser wherever possible. We do not require
            an account to use this tool. Your photographs are not permanently stored by this
            website.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { icon: <Eye className="h-3.5 w-3.5" aria-hidden="true" />, t: "No image uploads" },
              { icon: <Heart className="h-3.5 w-3.5" aria-hidden="true" />, t: "No tracking of photos" },
              { icon: <Lock className="h-3.5 w-3.5" aria-hidden="true" />, t: "Cleared when you leave" },
            ].map((chip) => (
              <span key={chip.t} className="inline-flex items-center gap-1.5 rounded-full border bg-secondary/60 px-3 py-1.5 text-[12.5px] font-medium">
                {chip.icon}
                {chip.t}
              </span>
            ))}
          </div>
          <p className="mt-4 text-[13px] text-muted-foreground">
            Read the full{" "}
            <a href="#/privacy-policy" className="font-semibold text-alma-accent underline underline-offset-2">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Mid educational (GEO) ───────────────────────── */

function MidEducational() {
  return (
    <section aria-labelledby="edu-heading" className="container-editorial max-w-[860px] py-6 md:py-10">
      <h2 id="edu-heading" className="font-display text-2xl font-semibold md:text-3xl">
        Passport photo printing, explained
      </h2>
      <div className="prose-alma mt-4">
        <p>
          A passport photo is one of the few documents where a single millimetre matters. Most
          countries accept photos in the ICAO-style 35 × 45 mm format — the United Kingdom, India,
          Australia and the Schengen visa process all use it — while the United States requires a
          2 × 2 inch (51 × 51 mm) square and Canada uses 50 × 70 mm. Because the requirements are
          set by each issuing authority and change over time, always confirm the size, background
          and recency rules in the official guidance for your document before you print.
        </p>
        <p>
          Printing at home is straightforward with the right settings. The two rules that matter
          are paper and scale: choose the exact paper size you actually loaded, and set the print
          dialog to <strong>Actual size / 100%</strong> — never “Fit to page”, which silently
          rescales your sheet and makes every photo the wrong size. Photo papers like 4 × 6 inch
          postcard stock fit six 35 × 45 mm photos with tidy margins, while a single A4 sheet holds
          around thirty — enough for an entire family&apos;s renewals.
        </p>
        <p>
          Quality depends on your source photo. A crisp, well-lit image holds 300 DPI at passport
          size easily; screenshots and heavily compressed images may not, which is why the editor
          measures the effective resolution of your crop and tells you before you commit to
          printing. Learn more in the{" "}
          <a href="#/photo-printing-guide">photo printing guide</a> or browse{" "}
          <a href="#/passport-photo-sizes">sizes by country</a>.
        </p>
      </div>
    </section>
  );
}

/* ───────────────────────────── FAQ teaser ───────────────────────────── */

function FaqTeaser() {
  return (
    <section aria-labelledby="faq-heading" className="container-editorial max-w-[860px] py-14 md:py-20">
      <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-alma-accent">FAQ</p>
      <h2 id="faq-heading" className="mt-3 font-display text-3xl font-semibold md:text-4xl">
        Frequently asked questions
      </h2>
      <Accordion type="single" collapsible className="mt-6">
        {FAQS.slice(0, 6).map((f, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger className="text-left font-display text-[17px] font-semibold">
              {f.question}
            </AccordionTrigger>
            <AccordionContent className="text-[14.5px] leading-relaxed text-muted-foreground">
              {f.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <div className="mt-6">
        <Button variant="outline" className="h-12 rounded-xl px-6 font-semibold" onClick={() => (window.location.hash = "#/faq")}>
          All questions
          <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </section>
  );
}

/* ────────────────────────────── Final CTA ────────────────────────────── */

function FinalCta() {
  return (
    <section aria-labelledby="final-cta" className="container-editorial pb-4">
      <div className="relative overflow-hidden rounded-[32px] border bg-card p-10 text-center shadow-lift md:p-14">
        <div aria-hidden="true" className="absolute inset-0 hero-wash opacity-70" />
        <div className="relative">
          <h2 id="final-cta" className="mx-auto max-w-2xl text-balance font-display text-3xl font-semibold md:text-[40px]">
            Your perfect passport photo is three minutes away
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15.5px] text-muted-foreground">
            Free, private and print-ready. Start with a photo from your phone or computer — no
            account needed.
          </p>
          <Button
            className="btn-gradient mt-8 h-14 rounded-2xl px-9 text-[16px] font-semibold"
            onClick={() => (window.location.hash = "#/passport-photo-maker")}
          >
            Create Your Photo
            <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  );
}
