"use client";

import { PageShell, ToolCta } from "@/components/pages/PageShell";
import {
  Crop,
  Download,
  LayoutGrid,
  Ruler,
  ShieldCheck,
  TriangleAlert,
  Upload,
} from "lucide-react";

const UPDATED = "February 2025";

interface StepCard {
  n: number;
  title: string;
  text: string;
}

interface Phase {
  icon: typeof Upload;
  label: string;
  heading: string;
  intro: string;
  steps: StepCard[];
}

const PHASES: Phase[] = [
  {
    icon: Upload,
    label: "Phase 1 · Upload",
    heading: "How do I get my photo into the editor?",
    intro:
      "Everything starts with one ordinary photo — no studio needed. The editor opens instantly and the file never leaves your device.",
    steps: [
      {
        n: 1,
        title: "Add your photo",
        text: "Drag and drop a JPG, PNG or WebP file (up to 15 MB), paste it from the clipboard, or take one directly with your camera. The camera preview is local — nothing is recorded or uploaded.",
      },
      {
        n: 2,
        title: "Set yourself up well",
        text: "Follow the live tips before you crop: face the camera directly, keep a neutral expression, and make sure the light on your face is even. Good input makes every later step easier.",
      },
    ],
  },
  {
    icon: Crop,
    label: "Phase 2 · Edit & background",
    heading: "How do I crop the photo and fix the background?",
    intro:
      "The editor gives you manual control over the crop and the background — deliberately, because only you can judge the result against your authority's rules.",
    steps: [
      {
        n: 3,
        title: "Crop and adjust",
        text: "Zoom, rotate and drag until the head sits correctly in the frame, then fine-tune brightness, contrast and saturation with sliders. The preview updates as you go.",
      },
      {
        n: 4,
        title: "Fix the background",
        text: "Optional automatic background removal is approximate and works best on plain, evenly lit backdrops — an edge-tolerance slider helps clean up the result. Then place the photo on white, off-white, light blue, cream or any custom colour.",
      },
    ],
  },
  {
    icon: Ruler,
    label: "Phase 3 · Size & paper",
    heading: "How do I choose the right size and paper?",
    intro:
      "This is where the maker earns its keep: exact millimetre sizes, converted to inches and 300 DPI pixels, matched to the paper you will actually print on.",
    steps: [
      {
        n: 5,
        title: "Pick the exact size",
        text: "Search by country — India, 2×2, 35×45 — or enter custom millimetres. Each size comes from our reference directory, and every country entry links to the official source so you can verify before printing.",
      },
      {
        n: 6,
        title: "Choose your paper",
        text: "Pick 4 × 6 in, 5 × 7 in, A4, A5, US Letter, US Legal or A3. The sheet preview updates immediately, and the printed size never changes — only how many copies fit.",
      },
    ],
  },
  {
    icon: Download,
    label: "Phase 4 · Arrange, preview & download",
    heading: "How do I arrange the copies and download the sheet?",
    intro:
      "The last phase turns one cropped photo into a full print-ready sheet, laid out with real physical measurements.",
    steps: [
      {
        n: 7,
        title: "Arrange the copies",
        text: "The automatic grid packs as many photos as physically fit. Adjust the page margin and the horizontal and vertical gaps, or drag photos around manually if you prefer your own layout.",
      },
      {
        n: 8,
        title: "Preview and download",
        text: "Check the 300 DPI preview, then download a PDF (recommended), JPG or PNG with exact physical dimensions. Print at Actual size / 100% — the photo printing guide explains every printer setting that matters.",
      },
    ],
  },
];

export function HowItWorksPage() {
  return (
    <PageShell
      title="How It Works — 4 Steps to a Print-Ready Passport Photo"
      lede="From an ordinary snapshot to a print-ready sheet in about five minutes. Here is exactly what the free photo maker does at each stage — and what it deliberately leaves to you."
      crumbs={[{ label: "How It Works" }]}
      updated={UPDATED}
      kicker="The process"
    >
      <div className="prose-alma">
        <p>
          <strong>Short answer:</strong> the maker walks you through eight small screens grouped
          into four phases — upload a photo, crop and fix the background, choose a size and paper,
          then arrange the copies and download. Everything runs in your browser: no account, no
          upload to a server, no watermark, no payment.
        </p>
        <p>
          What you end up with is a sheet rendered at 300 DPI with exact physical dimensions — a
          grid of photos you print at Actual size and cut out. What you keep is control: the tool
          never guesses on your behalf about compliance, because only the issuing authority&rsquo;s
          current guidance decides whether a photo is acceptable.
        </p>
      </div>

      <div className="mt-10 space-y-12">
        {PHASES.map((phase) => (
          <section key={phase.label} aria-label={phase.label}>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-alma-collard shadow-card">
                <phase.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-alma-accent">
                {phase.label}
              </p>
            </div>
            <div className="prose-alma">
              <h2>{phase.heading}</h2>
              <p>{phase.intro}</p>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {phase.steps.map((step) => (
                <div key={step.n} className="rounded-2xl border bg-card p-6 shadow-card">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary font-display text-[15px] font-semibold text-alma-collard"
                      aria-hidden="true"
                    >
                      {step.n}
                    </span>
                    <h3 className="font-display text-[16.5px] font-semibold">{step.title}</h3>
                  </div>
                  <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="prose-alma mt-14">
        <h2>What happens to my photo?</h2>
        <p>
          Privacy is a design decision here, not a policy paragraph. The tool is built so that your
          photographs stay with you:
        </p>
      </div>

      <div className="rounded-2xl border border-alma-collard/30 bg-accent/40 p-6 md:p-8">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 shrink-0 text-alma-collard" aria-hidden="true" />
          <p className="font-display text-xl font-semibold text-alma-collard">
            Your photos stay yours
          </p>
        </div>
        <p className="mt-3 text-[15px] leading-relaxed text-foreground/90">
          Your photos are processed locally in your browser wherever possible. We do not require an
          account to use this tool. Your photographs are not permanently stored by this website.
        </p>
        <ul className="mt-4 space-y-2 text-[14px] leading-relaxed text-foreground/85">
          <li className="flex gap-2">
            <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-alma-collard" />
            No upload: cropping, arranging and rendering all happen on your device using HTML5
            Canvas.
          </li>
          <li className="flex gap-2">
            <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-alma-collard" />
            Closing or resetting the editor removes the photo from memory.
          </li>
          <li className="flex gap-2">
            <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-alma-collard" />
            No account, signup or payment is needed to create, arrange, download or print your
            photos.
          </li>
        </ul>
      </div>

      <div className="prose-alma mt-12">
        <h2>What the tool does NOT do</h2>
        <p>
          We would rather lose a quick conversion than quietly mislead you about a document
          application. So, clearly:
        </p>
      </div>

      <div className="rounded-2xl border border-alma-orange/50 bg-secondary/60 p-6 md:p-8">
        <div className="flex items-center gap-3">
          <TriangleAlert className="h-6 w-6 shrink-0 text-alma-orange" aria-hidden="true" />
          <p className="font-display text-xl font-semibold">Honest limitations</p>
        </div>
        <ul className="mt-4 space-y-3 text-[14px] leading-relaxed text-foreground/85">
          <li>
            <strong>No automated face detection.</strong> You position the head and judge the crop
            yourself, against the head-height and eye-line rules your authority publishes.
          </li>
          <li>
            <strong>No guarantee of compliance.</strong> Requirements vary by country, document type
            and application channel, and they change over time. Only the issuing authority&rsquo;s
            official guidance decides acceptance — verify it before submitting.
          </li>
          <li>
            <strong>Approximate background removal.</strong> Edges are estimates, not salon-quality
            cutouts. It works best on plain, evenly lit backgrounds — always inspect the result
            closely.
          </li>
          <li>
            <strong>No e-photo or digital signature codes.</strong> Some application channels expect
            photos produced by registered photographers or official booths; a download from this
            tool cannot replace those systems.
          </li>
          <li>
            <strong>No affiliation.</strong> This studio is an independent printing aid. It is not
            affiliated with, endorsed by, or connected to any government or issuing authority.
          </li>
        </ul>
      </div>

      <div className="prose-alma mt-12">
        <h2>What should I do after downloading?</h2>
        <p>
          Three sensible next moves. First, print the sheet — at home on photo paper (
          <a href="#/photo-printing-guide">the printing guide</a> covers scaling, paper and
          troubleshooting) or take the file to a photo shop or kiosk and ask for an actual-size
          print. Second, verify the current rules for your document against the official source
          linked in our <a href="#/passport-photo-sizes">size directory</a> — background, head
          position and photo age matter as much as the millimetres. Third, keep a copy of the
          digital file: many application channels now ask for an upload as well as prints.
        </p>
        <p>
          Something still unclear? The <a href="#/faq">FAQ</a> answers the questions we hear most,
          and the <a href="#/blog">blog</a> goes deeper into backgrounds, paper choices and common
          mistakes.
        </p>
      </div>

      <ToolCta
        title="Try the four steps now — it is free"
        text="Open the photo maker, upload a photo and see how far you get in five minutes. No account, no upload to a server, no watermark."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <a
          href="#/faq"
          className="group rounded-2xl border bg-card p-6 shadow-card transition-transform hover:-translate-y-0.5"
        >
          <p className="font-display text-[16px] font-semibold text-alma-collard group-hover:text-alma-accent">
            Frequently asked questions
          </p>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">
            Sizes, photo counts per sheet, privacy and tool behaviour — answered directly.
          </p>
        </a>
        <a
          href="#/blog"
          className="group rounded-2xl border bg-card p-6 shadow-card transition-transform hover:-translate-y-0.5"
        >
          <p className="font-display text-[16px] font-semibold text-alma-collard group-hover:text-alma-accent">
            Blog and printing tips
          </p>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">
            Original guides on backgrounds, home printing and avoiding rejection.
          </p>
        </a>
      </div>

      <div className="mt-10 flex gap-3 rounded-2xl border border-alma-collard/25 bg-secondary/60 p-5">
        <LayoutGrid className="mt-0.5 h-5 w-5 shrink-0 text-alma-collard" aria-hidden="true" />
        <p className="text-[14px] leading-relaxed text-foreground/85">
          <span className="font-semibold">One more thing.</span> The eight steps above describe the
          editor as it works today; we improve it regularly. Requirements vary by authority and
          change over time, and this tool does not guarantee compliance with any official document
          standard — the official source for your document is always the final word.
        </p>
      </div>
    </PageShell>
  );
}
