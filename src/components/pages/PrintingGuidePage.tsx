"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageShell, ToolCta } from "@/components/pages/PageShell";
import { FAQS } from "@/data/faqs";
import { PAPER_SIZES } from "@/data/paper-sizes";
import { formatDimensions, formatPixels } from "@/lib/dimensions";
import { computeGrid } from "@/lib/layout-calculator";
import {
  CircleCheck,
  FileText,
  ImageUp,
  Info,
  Paintbrush,
  Printer,
  Scissors,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Live layout math — 35 × 45 mm photos, 4 mm margin, 2 mm gaps        */
/* ------------------------------------------------------------------ */

const PHOTO_W = 35;
const PHOTO_H = 45;
const MARGIN_MM = 4;
const GAP_MM = 2;
const UPDATED = "February 2025";

const SHEET_ROWS = PAPER_SIZES.map((paper) => {
  const grid = computeGrid({
    paperW: paper.widthMm,
    paperH: paper.heightMm,
    photoW: PHOTO_W,
    photoH: PHOTO_H,
    margin: MARGIN_MM,
    gapX: GAP_MM,
    gapY: GAP_MM,
  });
  return { paper, grid };
});

const TABLE_WRAP = [
  "overflow-x-auto rounded-2xl border bg-card shadow-card scroll-slim",
  "[&_[data-slot=table-container]]:[scrollbar-width:thin]",
  "[&_[data-slot=table-container]]:[scrollbar-color:rgb(97_146_154/0.55)_transparent]",
].join(" ");

const PRINT_FAQ_IDS = [7, 6, 2, 3];

/* ------------------------------------------------------------------ */
/* Reusable pieces                                                     */
/* ------------------------------------------------------------------ */

function PhotosPerPaperTable() {
  return (
    <div className={TABLE_WRAP}>
      <Table
        className="min-w-[640px]"
        aria-label="How many 35 × 45 mm passport photos fit on each paper size"
      >
        <TableHeader>
          <TableRow>
            <TableHead>Paper size</TableHead>
            <TableHead>Dimensions</TableHead>
            <TableHead>Grid (cols × rows)</TableHead>
            <TableHead>Photos per sheet</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {SHEET_ROWS.map(({ paper, grid }) => (
            <TableRow key={paper.id}>
              <TableCell className="font-medium">{paper.label}</TableCell>
              <TableCell className="tabular-nums">
                {formatDimensions(paper.widthMm, paper.heightMm)}
              </TableCell>
              <TableCell className="tabular-nums">
                {grid.fits ? `${grid.cols} × ${grid.rows}` : "Too small"}
              </TableCell>
              <TableCell className="font-semibold tabular-nums text-alma-collard">
                {grid.placements.length}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableCaption>
          Calculated for {formatDimensions(PHOTO_W, PHOTO_H)} photos with a {MARGIN_MM} mm page
          margin and {GAP_MM} mm gaps. Other photo sizes and spacings are recalculated live in the
          maker&rsquo;s arrange step.
        </TableCaption>
      </Table>
    </div>
  );
}

function PrintingFaq() {
  return (
    <Accordion type="single" collapsible className="rounded-2xl border bg-card px-5 shadow-card">
      {PRINT_FAQ_IDS.map((i) => (
        <AccordionItem key={i} value={`print-faq-${i}`}>
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

function RelatedLinkCards() {
  const links = [
    {
      href: "/passport-photo-sizes",
      title: "Passport photo sizes",
      text: "Exact dimensions for every country, with official sources.",
    },
    {
      href: "/how-it-works",
      title: "How the tool works",
      text: "Upload, crop, arrange and download in four phases.",
    },
    {
      href: "/blog",
      title: "Blog and tips",
      text: "More guides on backgrounds, paper and common mistakes.",
    },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {links.map((l) => (
        <a
          key={l.href}
          href={l.href}
          className="group rounded-2xl border bg-card p-5 shadow-card transition-transform hover:-translate-y-0.5"
        >
          <p className="font-display text-[16px] font-semibold text-alma-collard group-hover:text-alma-accent">
            {l.title}
          </p>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">{l.text}</p>
        </a>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function PrintingGuidePage() {
  const checklist = [
    {
      icon: ImageUp,
      title: "A suitable digital photo",
      text: "A JPG, PNG or WebP taken straight-on in even light, with room around the head for cropping.",
    },
    {
      icon: FileText,
      title: "A print-ready sheet",
      text: "Downloaded from the photo maker as a 300 DPI PDF (recommended), JPG or PNG.",
    },
    {
      icon: Printer,
      title: "A colour printer",
      text: "Inkjet or colour laser. Photo paper trays help, but the normal tray works with care.",
    },
    {
      icon: Paintbrush,
      title: "Fresh ink or toner",
      text: "Low ink shows up as banding and washed-out skin tones long before a document page does.",
    },
    {
      icon: CircleCheck,
      title: "Photo paper",
      text: "Glossy, matte or premium cardstock in the size you arranged — most often 4 × 6 in or A4.",
    },
    {
      icon: Scissors,
      title: "Scissors or a paper trimmer",
      text: "A trimmer keeps the cuts square, which matters more than most people expect.",
    },
  ];

  return (
    <PageShell
      title="Photo Printing Guide — Print Passport Photos at Home"
      lede="Everything you need to turn a digital photo into correctly sized passport prints at home: what to prepare, which printer settings matter, how many photos fit on each paper size, and how to fix prints that come out wrong."
      crumbs={[{ label: "Printing Guide" }]}
      updated={UPDATED}
      kicker="Home printing"
    >
      <div className="prose-alma">
        <p>
          <strong>Short answer: yes, you can print usable passport photos at home</strong> with an
          ordinary colour printer. Two things decide whether the prints work: exact physical size
          and print quality. Get the scaling right (Actual size, never Fit to page) and render at
          300 DPI on decent photo paper, and a home print is hard to tell apart from a lab print.
          Whether a home print is <em>accepted</em> is a different question — some application
          channels expect professionally produced or digitally signed photos — so verify your
          authority&rsquo;s rules before relying on home prints.
        </p>
        <p>
          This guide walks through the whole process with the sheets produced by our{" "}
          <a href="/passport-photo-maker">free passport photo maker</a>. If you are still choosing
          a size, start with the <a href="/passport-photo-sizes">size directory</a>; each country
          entry links to the official rules.
        </p>

        <h2>What do you need to print passport photos at home?</h2>
        <p>Six things. None of them are exotic:</p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2" aria-label="Checklist of what you need">
        {checklist.map((item) => (
          <li
            key={item.title}
            className="flex gap-3.5 rounded-2xl border bg-card p-5 shadow-card"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-alma-collard">
              <item.icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block font-display text-[15.5px] font-semibold">{item.title}</span>
              <span className="mt-1 block text-[13.5px] leading-relaxed text-muted-foreground">
                {item.text}
              </span>
            </span>
          </li>
        ))}
      </ul>

      <div className="prose-alma">
        <h2>How do I print passport photos on 4 × 6 inch paper?</h2>
        <p>
          4 × 6 inch (101.6 × 152.4 mm) is the cheapest and most common photo paper format. One
          sheet holds six 35 × 45 mm photos with standard margins, which is usually more than a
          single application needs.
        </p>
        <ol>
          <li>
            Open the <a href="/passport-photo-maker">photo maker</a>, upload your photo and crop it
            to your country&rsquo;s size.
          </li>
          <li>
            Choose 4 × 6 in as the paper size. The arrange step packs the copies automatically — six
            35 × 45 mm photos fit with a 4 mm margin and 2 mm gaps.
          </li>
          <li>
            Download the print-ready PDF. It is rendered at 300 DPI with exact physical dimensions.
          </li>
          <li>
            Load the 4 × 6 photo paper into the printer — the photo tray if there is one, coated
            side facing the correct way for your model.
          </li>
          <li>
            Open the PDF and press print. In the print dialog, set the paper size to 4 × 6 in so it
            matches what is loaded.
          </li>
          <li>
            Set scaling to <strong>Actual size / 100%</strong> and switch off Fit to page or Shrink
            to fit. This is the step that decides whether the photos measure 35 × 45 mm.
          </li>
          <li>
            Set print quality to the highest or photo setting, and pick the paper type that matches
            the loaded paper so the printer lays down the right amount of ink.
          </li>
          <li>
            Print, let the ink dry for a few minutes, then cut along the cell edges with scissors or
            a trimmer.
          </li>
        </ol>

        <h2>How do I print passport photos on A4 paper?</h2>
        <p>
          A4 (210 × 297 mm) fits around thirty 35 × 45 mm photos — ideal when several family members
          apply at once or you want spares for future applications.
        </p>
        <ol>
          <li>
            In the maker, choose A4 as the paper size and arrange your copies. With a 4 mm margin
            and 2 mm gaps the grid comes out at 5 columns × 6 rows = 30 photos of 35 × 45 mm.
          </li>
          <li>Download the 300 DPI PDF.</li>
          <li>
            Do a test print on plain paper first. Measure one photo with a ruler: it must be exactly
            35 × 45 mm. If it is not, your scaling setting is wrong — go back to Actual size.
          </li>
          <li>
            Load A4 photo paper or a premium matte stock and print at Actual size / 100% with
            quality set to High or Best.
          </li>
          <li>Cut the sheet into individual photos once it is dry.</li>
        </ol>
        <p>
          If the outer rows come out clipped, your printer&rsquo;s unprintable margin is larger than
          the page margin in your layout. Raise the page margin in the arrange step until the
          preview shows every photo inside the printable area, then reprint.
        </p>

        <h2>Which printer settings matter for passport photos?</h2>
        <p>
          Five settings decide the result. Everything else in the dialog can stay at its default.
        </p>
      </div>

      <div className={TABLE_WRAP}>
        <Table className="min-w-[720px]" aria-label="Printer settings comparison for passport photos">
          <TableHeader>
            <TableRow>
              <TableHead>Setting</TableHead>
              <TableHead>Choose this</TableHead>
              <TableHead>Avoid</TableHead>
              <TableHead className="min-w-[240px] whitespace-normal">Why it matters</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Scaling</TableCell>
              <TableCell>Actual size / 100%</TableCell>
              <TableCell>Fit to page, Shrink oversized pages</TableCell>
              <TableCell className="whitespace-normal text-muted-foreground">
                Fit-to-page rescales the whole sheet, so every photo prints at the wrong millimetre
                size and fails a ruler check.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Paper size</TableCell>
              <TableCell>The size actually loaded (4 × 6 in, A4…)</TableCell>
              <TableCell>Whatever was used last time</TableCell>
              <TableCell className="whitespace-normal text-muted-foreground">
                A mismatch between dialog and tray shifts the grid and can clip the outer photos.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Print quality</TableCell>
              <TableCell>Highest / Photo / Best</TableCell>
              <TableCell>Draft, Fast, Economy</TableCell>
              <TableCell className="whitespace-normal text-muted-foreground">
                Draft modes drop resolution and ink density — faces print banded and pale.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Paper type</TableCell>
              <TableCell>Match the loaded stock (glossy, matte…)</TableCell>
              <TableCell>Plain paper preset for photo paper</TableCell>
              <TableCell className="whitespace-normal text-muted-foreground">
                The paper preset controls how much ink is sprayed and how it dries; the wrong one
                smudges or mutes colours.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Colour handling</TableCell>
              <TableCell>Printer manages colours (default)</TableCell>
              <TableCell>Stacked filters and custom profiles</TableCell>
              <TableCell className="whitespace-normal text-muted-foreground">
                Two systems adjusting the same image produce odd casts. Unless you calibrate
                deliberately, let the printer&rsquo;s photo profile work alone.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div
        className="mt-8 rounded-2xl border border-alma-collard/30 bg-accent/40 p-5"
        role="note"
      >
        <p className="text-[15px] leading-relaxed">
          <strong className="font-semibold text-alma-collard">Actual size / 100%</strong> means the
          printer reproduces every millimetre of the PDF at exactly its physical size: a 35 × 45 mm
          photo in the file becomes a 35 × 45 mm photo on paper. It is sometimes called
          &ldquo;No scaling&rdquo; or &ldquo;Real size&rdquo;. If you see Fit, Scale, Shrink to fit
          or Fit to printable area selected instead, turn it off — those options silently resize the
          sheet, and the mistake is invisible until you measure the print or the application is
          rejected.
        </p>
      </div>

      <div className="prose-alma">
        <h2>Which paper should I use for passport photos?</h2>
        <p>
          Any decent photo stock works; the finish is mostly a matter of preference and what your
          printer handles well.
        </p>
      </div>

      <div className={TABLE_WRAP}>
        <Table className="min-w-[700px]" aria-label="Paper finish comparison for passport photos">
          <TableHeader>
            <TableRow>
              <TableHead>Paper</TableHead>
              <TableHead>Look and feel</TableHead>
              <TableHead className="min-w-[200px] whitespace-normal">Best for</TableHead>
              <TableHead className="min-w-[220px] whitespace-normal">Watch out for</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Glossy photo paper</TableCell>
              <TableCell className="whitespace-normal">
                Shiny surface, punchy colours, lab-style finish
              </TableCell>
              <TableCell className="whitespace-normal text-muted-foreground">
                The closest match to professionally printed passport photos.
              </TableCell>
              <TableCell className="whitespace-normal text-muted-foreground">
                Shows fingerprints and glare; let prints dry before stacking.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Matte / lustre photo paper</TableCell>
              <TableCell className="whitespace-normal">
                Soft, low-glare finish with slightly muted colour
              </TableCell>
              <TableCell className="whitespace-normal text-muted-foreground">
                Scanning and digital upload pipelines; writing on the back of prints.
              </TableCell>
              <TableCell className="whitespace-normal text-muted-foreground">
                Cheaper matte stock can look flat — use a premium weight.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Cardstock / heavy photo card</TableCell>
              <TableCell className="whitespace-normal">Thick and stiff, very durable</TableCell>
              <TableCell className="whitespace-normal text-muted-foreground">
                Prints that must survive handling without bending.
              </TableCell>
              <TableCell className="whitespace-normal text-muted-foreground">
                Check your printer&rsquo;s maximum paper weight; heavy stock can jam or misfeed.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Plain paper</TableCell>
              <TableCell className="whitespace-normal">Everyday office paper</TableCell>
              <TableCell className="whitespace-normal text-muted-foreground">
                A proof sheet to check layout and true size before committing to photo paper.
              </TableCell>
              <TableCell className="whitespace-normal text-muted-foreground">
                Colours look dull and the paper curls — treat it as a proof, not a submission.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="prose-alma">
        <p>
          Whichever finish you pick, print on the coated (printing) side and handle the surface by
          the edges. Both glossy and matte are widely used for passport prints; the requirements
          that actually matter — size, background, head position — come from your authority, not
          from the paper box.
        </p>

        <h2>How many passport photos fit on each paper size?</h2>
        <p>
          The table below uses the same numbers as the maker&rsquo;s arrange step:{" "}
          {formatDimensions(PHOTO_W, PHOTO_H)} photos, a {MARGIN_MM} mm page margin and {GAP_MM} mm
          gaps. Need a different photo size? The{" "}
          <a href="/passport-photo-sizes">size directory</a> lists every option.
        </p>
      </div>

      <PhotosPerPaperTable />

      <div className="prose-alma">
        <h2>Why do my printed passport photos come out wrong?</h2>
        <p>
          Almost every home-printing problem has one of five causes. Find the symptom, fix the
          cause, reprint.
        </p>
      </div>

      <div className={TABLE_WRAP}>
        <Table className="min-w-[720px]" aria-label="Troubleshooting common passport printing problems">
          <TableHeader>
            <TableRow>
              <TableHead>Symptom</TableHead>
              <TableHead className="min-w-[220px] whitespace-normal">Likely cause</TableHead>
              <TableHead className="min-w-[260px] whitespace-normal">Fix</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium whitespace-normal">
                Photos print too small or too big
              </TableCell>
              <TableCell className="whitespace-normal text-muted-foreground">
                Fit-to-page or a scaling percentage was applied in the print dialog.
              </TableCell>
              <TableCell className="whitespace-normal text-muted-foreground">
                Reprint with Actual size / 100%, then verify one photo with a ruler.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium whitespace-normal">
                Photos look blurry or pixelated
              </TableCell>
              <TableCell className="whitespace-normal text-muted-foreground">
                The source photo does not carry enough resolution for a 300 DPI print of this size.
              </TableCell>
              <TableCell className="whitespace-normal text-muted-foreground">
                A 35 × 45 mm print needs about {formatPixels(PHOTO_W, PHOTO_H)}. Retake the photo
                close-up in good light instead of enlarging a small crop — the maker warns you when
                the effective resolution is low.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium whitespace-normal">
                Colours look wrong or washed out
              </TableCell>
              <TableCell className="whitespace-normal text-muted-foreground">
                Double colour management (the app and the printer both adjusting the image) or a
                paper-type preset that does not match the loaded stock.
              </TableCell>
              <TableCell className="whitespace-normal text-muted-foreground">
                Print with the printer&rsquo;s default photo profile and set the paper type to match
                the paper. Avoid stacking extra filters on top.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium whitespace-normal">
                Outer photos are cut off at the edges
              </TableCell>
              <TableCell className="whitespace-normal text-muted-foreground">
                The printer&rsquo;s unprintable margin is larger than the page margin in your
                layout.
              </TableCell>
              <TableCell className="whitespace-normal text-muted-foreground">
                Increase the page margin in the arrange step until everything sits inside the
                printable area, then reprint.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium whitespace-normal">
                Bands or streaks across the print
              </TableCell>
              <TableCell className="whitespace-normal text-muted-foreground">
                Clogged printhead or low ink.
              </TableCell>
              <TableCell className="whitespace-normal text-muted-foreground">
                Run the printer&rsquo;s cleaning cycle, check ink levels, and reprint on a fresh
                sheet.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium whitespace-normal">
                Prints curl or smudge
              </TableCell>
              <TableCell className="whitespace-normal text-muted-foreground">
                Ink not fully dry, or you printed on the wrong side of the paper.
              </TableCell>
              <TableCell className="whitespace-normal text-muted-foreground">
                Let prints dry flat for a few minutes and confirm you printed on the coated side.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="prose-alma">
        <h2>How much does it cost to print passport photos at home?</h2>
        <p>
          Honestly: it depends on your printer, your paper and how many sheets you waste — so we
          won&rsquo;t quote fake prices. What actually drives the cost:
        </p>
        <ul>
          <li>
            <strong>Paper.</strong> Photo paper is bought per sheet, and one 4 × 6 inch sheet holds
            six 35 × 45 mm photos — so each photo consumes a sixth of a sheet.
          </li>
          <li>
            <strong>Ink.</strong> Full-coverage photo printing uses far more ink than documents.
            Fresh ink produces consistent skin tones; fading cartridges produce banding that no
            setting fixes.
          </li>
          <li>
            <strong>Wasted test sheets.</strong> A plain-paper proof before the final print usually
            saves money overall — one proof beats two ruined photo sheets.
          </li>
          <li>
            <strong>Printer wear.</strong> Maintenance cycles consume ink on any inkjet; heavy photo
            printing accelerates that. It is rarely decisive for occasional passport photos.
          </li>
        </ul>
        <p>
          If you only print one set every few years, a local photo shop or kiosk may work out
          cheaper than buying photo paper — and some application channels require professionally
          produced photos anyway, so check that before stocking up on supplies. For families or
          repeat applications, home printing is usually the economical route.
        </p>

        <h2>Printing questions, answered</h2>
        <p>The questions we hear most about printing passport photos correctly.</p>
      </div>

      <PrintingFaq />

      <ToolCta
        title="Make the sheet, then print it at home"
        text="Crop your photo, arrange copies on 4 × 6 or A4 and download a 300 DPI print-ready PDF — then follow the steps above to print it at exactly the right size."
      />

      <div className="prose-alma">
        <h2>Related guides</h2>
      </div>
      <RelatedLinkCards />

      <div className="mt-10 flex gap-3 rounded-2xl border border-alma-collard/25 bg-secondary/60 p-5">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-alma-collard" aria-hidden="true" />
        <p className="text-[14px] leading-relaxed text-foreground/85">
          <span className="font-semibold">A note on acceptance.</span> This guide explains how to
          print at the correct physical size; it does not tell you whether your authority accepts
          home prints. Requirements vary by authority, document type and application channel, and
          they change over time. This tool does not guarantee compliance — verify size, background,
          head position and photo age against the official source for your document before
          submitting anything. Questions? The <a href="/faq">FAQ</a> covers the most common ones.
        </p>
      </div>
    </PageShell>
  );
}
