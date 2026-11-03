"use client";

import { PageShell, ToolCta } from "@/components/pages/PageShell";
import {
  MonitorSmartphone,
  Printer,
  Ruler,
  ShieldCheck,
  BadgeCheck,
  Coins,
  Sparkles,
  PenLine,
  TriangleAlert,
  ArrowRight,
} from "lucide-react";

const FEATURES = [
  {
    icon: MonitorSmartphone,
    title: "Runs entirely in your browser",
    text: "Your photo is decoded and edited with HTML5 Canvas on your own device. It is never uploaded — there is no server-side photo storage, because none is needed.",
  },
  {
    icon: Ruler,
    title: "Exact millimetre layout",
    text: "Photos are placed at true physical size — 35×45 mm, 2×2 inch and more — arranged edge-to-edge on 4×6, A4 and other paper sizes with cut guides.",
  },
  {
    icon: Printer,
    title: "Print-ready 300 DPI output",
    text: "Export a PDF composed at 300 DPI so a home or shop printer produces crisp, correctly sized photos without scaling surprises.",
  },
];

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: "Privacy first",
    text: "Your photos are processed locally in your browser wherever possible. We do not require an account to use this tool. Your photographs are not permanently stored by this website.",
  },
  {
    icon: BadgeCheck,
    title: "Honesty over hype",
    text: "We never claim our photos are guaranteed to be accepted by any authority. Requirements change, and our guides say so — and always point to official sources.",
  },
  {
    icon: Coins,
    title: "Free, no accounts",
    text: "No sign-up, no paywall, no watermarks on the essentials. A useful tool should not demand your email address before it lets you crop a photo.",
  },
  {
    icon: Sparkles,
    title: "Quality by default",
    text: "300 DPI output, exact millimetre dimensions and careful print layout — the same care a print shop would apply, built into the tool from the start.",
  },
];

const LIMITS = [
  "We are not a government service, photographer or immigration adviser, and we are not affiliated with any issuing authority.",
  "We do not review, approve or store your photos — we never receive them.",
  "We cannot guarantee that any photo meets the rules of a specific country, document type or application channel.",
  "We do not offer paid printing or shipping; you print the file yourself, at home or at a shop of your choice.",
];

export function AboutPage() {
  return (
    <PageShell
      title="A photo studio that never sees your photos"
      lede="printmyphoto is a free, privacy-first web tool for making and printing passport-style photos — built on a simple idea: the safest place for your photograph is your own device."
      crumbs={[{ label: "About" }]}
      updated="February 2025"
      kicker="About us"
    >
      <div className="prose-alma">
        <h2>Our mission</h2>
        <p>
          Getting a passport photo used to mean paying a shop for a sheet of prints, or handing
          your face to an app that uploads it to unknown servers. It should be simpler than that.
          We built printmyphoto to make honest, private photo printing available to
          everyone: pick a photo, crop it to the exact size you need, tidy the background, arrange
          a print sheet and download it — free, in about a minute, without an account and without
          your images ever leaving your browser.
        </p>
        <p>
          The tool is operated as a free web project by a small editorial team that maintains the
          maker, the size guides and the printing guides published on this site.
        </p>

        <h2>How it works</h2>
        <p>
          Three ideas carry the whole product. Everything else is detail around them.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-2xl border bg-card p-6 shadow-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
              <Icon className="h-5 w-5 text-alma-collard" aria-hidden="true" />
            </div>
            <h3 className="mt-4 font-display text-[16.5px] font-semibold leading-snug">{title}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>

      <div className="prose-alma mt-4">
        <h2>The principles behind it</h2>
      </div>

      <div className="mt-2 grid gap-4 sm:grid-cols-2">
        {PRINCIPLES.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-2xl border bg-card p-6 shadow-card">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                <Icon className="h-4.5 w-4.5 text-alma-accent" aria-hidden="true" />
              </div>
              <h3 className="font-display text-[16.5px] font-semibold">{title}</h3>
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>

      <div className="prose-alma mt-4">
        <h2>The technology</h2>
        <p>
          The site is built with Next.js and TypeScript. Photo editing runs on the HTML5 Canvas
          API: your image is decoded into an in-memory bitmap, drawn and composed at true print
          size, then exported as a PDF assembled with pdf-lib — all inside your browser tab.
          Downloads are produced as local blob URLs that are revoked automatically. Because no
          processing happens on a server, there is no upload step to wait for, no photo library to
          breach, and no reason for the site to ask who you are.
        </p>

        <h2>Editorial standards</h2>
        <p>
          The guides on this site — size references, printing tips and the FAQ — are written and
          reviewed by the site&apos;s editorial team. We hold ourselves to a few concrete rules:
        </p>
        <ul>
          <li>
            Every country size page links the official issuing authority as the source of truth;
          </li>
          <li>
            Updates are dated, and the &quot;Last updated&quot; line on each page is kept current;
          </li>
          <li>
            We state uncertainty plainly: where requirements vary or change, we say so instead of
            inventing a confident answer;
          </li>
          <li>
            No fabricated statistics, no fake testimonials, no claims of government affiliation.
          </li>
        </ul>

        <h2>What we are not</h2>
        <p>
          Equal to what we promise is what we refuse to pretend. This project has real limits, and
          we would rather you know them upfront:
        </p>
      </div>

      <div className="mt-2 rounded-2xl border bg-card p-6 shadow-card">
        <div className="flex items-center gap-3">
          <TriangleAlert className="h-5 w-5 text-alma-orange" aria-hidden="true" />
          <h3 className="font-display text-[17px] font-semibold">Limitations, stated plainly</h3>
        </div>
        <ul className="mt-4 space-y-2.5 text-[14px] leading-relaxed text-muted-foreground">
          {LIMITS.map((item) => (
            <li key={item} className="flex gap-2.5">
              <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-alma-collard" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { href: "#/how-it-works", label: "See how it works, step by step" },
          { href: "#/blog", label: "Read the guides and printing tips" },
          { href: "#/contact", label: "Say hello or report a bug" },
        ].map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="group flex items-center justify-between gap-3 rounded-2xl border bg-card p-5 shadow-card transition-transform hover:-translate-y-0.5"
          >
            <span className="text-[14.5px] font-medium">{link.label}</span>
            <ArrowRight
              className="h-4 w-4 shrink-0 text-alma-collard transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        ))}
      </div>

      <ToolCta
        title="Try it — nothing to sign up for"
        text="The whole studio runs in your browser tab. Open the maker, bring a photo, and download a print-ready sheet in about a minute."
      />

      <div className="prose-alma flex items-start gap-3 text-[13.5px] text-muted-foreground">
        <PenLine className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
        <p>
          This page is maintained by the editorial team of printmyphoto and was last
          reviewed in February 2025.
        </p>
      </div>
    </PageShell>
  );
}
