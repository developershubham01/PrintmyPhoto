"use client";

import { PageShell, ToolCta } from "@/components/pages/PageShell";
import { AlertTriangle, FileSearch, ScanLine, Gauge, Scale, Landmark } from "lucide-react";

const POINTS = [
  {
    icon: Landmark,
    title: "Requirements vary — and change",
    text: "Photo rules differ between countries, document types (passport, visa, ID), application channels (online vs. paper) and time. Always verify the current rules with the official issuing authority before you apply or pay for prints.",
  },
  {
    icon: ScanLine,
    title: "Background removal is approximate",
    text: "The automatic background tool is an image-processing estimate. It can leave halos, miss fine hair detail or over-cover shadows. Some authorities require a professional-quality, uniform background that no automated edit can promise.",
  },
  {
    icon: Gauge,
    title: "Quality checks are estimates, not certification",
    text: "Resolution, brightness and sharpness indicators in the editor are computed heuristics on your device. They are helpful guidance — not a certificate that your photo meets any official standard.",
  },
  {
    icon: FileSearch,
    title: "Not official guidance",
    text: "Our guides are independent editorial summaries with links to official sources. We are not a government service and nothing here constitutes professional or legal advice for your specific application.",
  },
];

export function DisclaimerPage() {
  return (
    <PageShell
      title="Disclaimer"
      lede="The one page to read before you print: what this tool can do honestly, and the guarantees it deliberately does not make."
      crumbs={[{ label: "Disclaimer" }]}
      updated="February 2025"
      showAds={false}
    >
      <div
        role="note"
        aria-label="Important disclaimer"
        className="rounded-2xl border border-alma-orange/40 bg-alma-orange/10 p-5"
      >
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-alma-orange" aria-hidden="true" />
          <p className="text-[15px] leading-relaxed text-foreground">
            <strong className="font-semibold">
              printmyphoto is not a government service and is not affiliated with any
              passport office, consulate or issuing authority.
            </strong>{" "}
            Photo requirements vary by country, document type, application channel and time — this
            tool does not guarantee compliance with any official standard. Always confirm the
            current requirements with the authority that will judge your photo before you submit an
            application or pay for printing.
          </p>
        </div>
      </div>

      <div className="prose-alma mt-8">
        <h2>Why this page exists</h2>
        <p>
          A passport photo is judged by a human clerk or an automated system operating rules we
          neither write nor see. Being honest about that boundary is part of our editorial
          standard: the tool is genuinely useful for cropping, background cleanup and print layout
          — and it is exactly as authoritative as a well-researched guide, nothing more.
        </p>
        <p>
          The sections below spell out the limits in detail so nothing important is buried in
          legalese.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {POINTS.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-2xl border bg-card p-6 shadow-card">
            <Icon className="h-5 w-5 text-alma-collard" aria-hidden="true" />
            <h3 className="mt-3 font-display text-[17px] font-semibold leading-snug">{title}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>

      <div className="prose-alma mt-8">
        <h2>Verify with the official source</h2>
        <p>
          For every country in our size guide we link the official issuing authority&apos;s own
          photo requirements. Those pages are the single source of truth for dimensions,
          background, expression, head coverage, recency rules and whether digital uploads have
          separate standards. Start from our{" "}
          <a href="#/passport-photo-sizes">passport photo sizes by country</a> reference, then
          follow the official link for your application.
        </p>
        <h2>No professional or legal advice</h2>
        <p>
          Nothing on this site — guides, hints, warnings or indicators — constitutes legal,
          professional or immigration advice, and using the tool does not create any relationship
          with an adviser. If your application is unusual, time-critical or high-stakes, consult
          the issuing authority directly or a qualified professional.
        </p>
      </div>

      <ToolCta
        title="Make the photo, then double-check"
        text="Use the maker to get a clean, correctly sized, print-ready sheet — then spend one minute confirming the rules with your issuing authority before you submit anything."
      />
    </PageShell>
  );
}
