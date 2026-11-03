"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageShell, ToolCta } from "@/components/pages/PageShell";
import { FAQS } from "@/data/faqs";
import { ArrowRight, CircleCheck } from "lucide-react";

const UPDATED = "February 2025";

/** FAQ indexes grouped by theme (see src/data/faqs.ts). */
const SIZE_FAQ_IDS = [1, 2, 3];
const PRINTING_FAQ_IDS = [6, 7];
const PRIVACY_FAQ_IDS = [0, 4, 5, 9, 10, 11];
const COMPLIANCE_FAQ_IDS = [8];

interface FaqGroup {
  heading: string;
  intro: string;
  ids: number[];
}

const GROUPS: FaqGroup[] = [
  {
    heading: "Sizes & dimensions",
    intro:
      "Which millimetre size applies to your document, and how many copies fit on the paper you plan to print on.",
    ids: SIZE_FAQ_IDS,
  },
  {
    heading: "Printing & quality",
    intro:
      "Resolution, scaling and the printer settings that decide whether your sheet comes out at the exact physical size.",
    ids: PRINTING_FAQ_IDS,
  },
  {
    heading: "Privacy & tool behaviour",
    intro:
      "Where your photo goes (nowhere), what the tool can and cannot do, and what it costs (nothing).",
    ids: PRIVACY_FAQ_IDS,
  },
  {
    heading: "Compliance & acceptance",
    intro:
      "The honest part: what we guarantee, what we cannot, and where the real authority sits.",
    ids: COMPLIANCE_FAQ_IDS,
  },
];

const QUICK_ANSWERS = [
  {
    question: "What is the standard passport photo size?",
    answer:
      "There is no single worldwide standard. The most common international format is 35 × 45 mm; the United States uses a 2 × 2 inch (51 × 51 mm) square and Canada uses 50 × 70 mm. Always verify with the issuing authority.",
    href: "#/passport-photo-sizes",
    linkLabel: "Browse all sizes",
  },
  {
    question: "How many photos fit on 4 × 6 inch paper?",
    answer:
      "Six 35 × 45 mm photos fit in a 2 × 3 grid with typical margins and gaps. The maker recalculates the count live for your size, margins and spacing.",
    href: "#/photo-printing-guide",
    linkLabel: "Read the printing guide",
  },
  {
    question: "Is the tool really free?",
    answer:
      "Yes — no account, no signup, no payment and no watermark. Your photo is processed locally in your browser and is never uploaded to a server.",
    href: "#/passport-photo-maker",
    linkLabel: "Open the photo maker",
  },
];

function FaqAccordion({ ids, openFirst = false }: { ids: number[]; openFirst?: boolean }) {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={openFirst ? `faq-${ids[0]}` : undefined}
      className="rounded-2xl border bg-card px-5 shadow-card"
    >
      {ids.map((i) => (
        <AccordionItem key={i} value={`faq-${i}`}>
          <AccordionTrigger className="min-h-[44px] text-[15px] font-semibold">
            {FAQS[i].question}
          </AccordionTrigger>
          <AccordionContent className="pb-4 text-[14.5px] leading-relaxed text-muted-foreground">
            {FAQS[i].answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function FaqPage() {
  return (
    <PageShell
      title="Frequently Asked Questions"
      lede="Direct answers to the questions people ask most about passport photo sizes, home printing, privacy, and what this free tool does — and deliberately does not do."
      crumbs={[{ label: "FAQ" }]}
      updated={UPDATED}
      kicker="Help centre"
    >
      <div className="prose-alma">
        <p>
          <strong>Most-asked question, answered first:</strong> there is no single worldwide
          passport photo standard — 35 × 45 mm is the most common international format, the United
          States uses a 2 × 2 inch square, and Canada uses 50 × 70 mm. Whatever your country, the
          issuing authority&rsquo;s current guidance is the only rule that counts, so every answer
          below ends the same way: verify with the official source before you submit. The{" "}
          <a href="#/passport-photo-sizes">size directory</a> links to each authority&rsquo;s page.
        </p>
        <p>
          The answers are grouped by theme. Expand a question for the short answer and the context
          behind it.
        </p>

        <h2>Quick answers</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {QUICK_ANSWERS.map((qa) => (
          <div key={qa.question} className="flex flex-col rounded-2xl border bg-card p-6 shadow-card">
            <div className="flex items-start gap-2.5">
              <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-alma-collard" aria-hidden="true" />
              <p className="font-display text-[15.5px] font-semibold leading-snug">{qa.question}</p>
            </div>
            <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-muted-foreground">
              {qa.answer}
            </p>
            <a
              href={qa.href}
              className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-[14px] font-semibold text-alma-accent hover:text-alma-collard"
            >
              {qa.linkLabel}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        ))}
      </div>

      <div className="mt-12 space-y-10">
        {GROUPS.map((group) => (
          <section key={group.heading} aria-label={group.heading}>
            <div className="prose-alma">
              <h2>{group.heading}</h2>
              <p>{group.intro}</p>
            </div>
            <FaqAccordion ids={group.ids} openFirst={group.heading === "Sizes & dimensions"} />
          </section>
        ))}
      </div>

      <ToolCta
        title="Skip the reading — make the photo"
        text="Upload a photo, crop it to your country's size, arrange the copies and download a 300 DPI print-ready sheet. Free, no account, and your photo never leaves your browser."
      />

      <div className="prose-alma">
        <h2>Still stuck?</h2>
        <p>
          If your question is not answered above, tell us via the{" "}
          <a href="#/contact">contact page</a> and we will do our best to help. For anything about
          requirements — sizes, backgrounds, head position, photo age — the answer that matters is
          always on the official page of your issuing authority, linked from each entry in the{" "}
          <a href="#/passport-photo-sizes">size directory</a>.
        </p>
        <p>
          Want to go deeper? The <a href="#/photo-printing-guide">photo printing guide</a> covers
          printer settings and paper choices step by step, and the <a href="#/blog">blog</a> is
          where we publish new guides on making and printing passport photos.
        </p>
      </div>

      <div className="mt-10 flex gap-3 rounded-2xl border border-alma-collard/25 bg-secondary/60 p-5">
        <p className="text-[14px] leading-relaxed text-foreground/85">
          <span className="font-semibold">Accuracy note.</span> These answers describe how the tool
          works today. Photo requirements vary by authority, document type and application channel,
          and they change over time — this tool does not guarantee compliance with any official
          standard. Where requirements are discussed, verify them against the official sources we
          link, never against this page alone.
        </p>
      </div>
    </PageShell>
  );
}
