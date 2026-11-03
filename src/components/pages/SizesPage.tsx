"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { ALL_COUNTRIES, POPULAR_SIZES, findCountry } from "@/data/passport-sizes";
import { formatDimensions, formatPixels } from "@/lib/dimensions";
import { computeGrid } from "@/lib/layout-calculator";
import type { CountryInfo, PhotoSizeOption } from "@/types/editor";
import { ArrowLeft, ArrowRight, ExternalLink, Info, Search } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Shared constants + live layout math (same engine the editor uses)  */
/* ------------------------------------------------------------------ */

const PHOTO_W = 35;
const PHOTO_H = 45;
const MARGIN_MM = 4;
const GAP_MM = 2;
const UPDATED = "February 2025";

/** 35 × 45 mm photos, 4 mm margin, 2 mm gaps — for every catalogue paper. */
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

/** Popular sizes deduplicated by width × height, sorted narrowest first. */
const POPULAR_UNIQUE = Object.values(
  POPULAR_SIZES.reduce<Record<string, PhotoSizeOption>>((acc, s) => {
    const key = `${s.widthMm}x${s.heightMm}`;
    if (!acc[key]) acc[key] = s;
    return acc;
  }, {}),
).sort((a, b) => a.widthMm - b.widthMm);

/** Friendly names for the widely used formats (grounded in the catalogue notes). */
const SIZE_NICKNAMES: Record<string, string> = {
  "35x45": "International standard (ICAO-style)",
  "50.8x50.8": "U.S. 2 × 2 inch square",
  "51x51": "Square consular format",
  "50x70": "Canadian format",
};

const POPULAR_COUNTRY_IDS = [
  "united-states",
  "united-kingdom",
  "india",
  "canada",
  "australia",
  "schengen-eu",
];

const SIZE_FAQ_IDS = [1, 2, 3, 8];

function exampleCountries(widthMm: number, heightMm: number): { names: string[]; extra: number } {
  const matches = ALL_COUNTRIES.filter((c) =>
    c.sizes.some((s) => s.widthMm === widthMm && s.heightMm === heightMm),
  );
  return {
    names: matches.slice(0, 3).map((c) => c.name),
    extra: Math.max(0, matches.length - 3),
  };
}

/** Wrapper for wide data tables: rounded card look + slim scrollbar on the inner scroll container. */
function tableWrap(): string {
  return [
    "overflow-x-auto rounded-2xl border bg-card shadow-card scroll-slim",
    "[&_[data-slot=table-container]]:[scrollbar-width:thin]",
    "[&_[data-slot=table-container]]:[scrollbar-color:rgb(97_146_154/0.55)_transparent]",
  ].join(" ");
}

/* ------------------------------------------------------------------ */
/* Reusable pieces                                                     */
/* ------------------------------------------------------------------ */

function SizesTable({ sizes, ariaLabel }: { sizes: PhotoSizeOption[]; ariaLabel: string }) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-card scroll-slim [&_[data-slot=table-container]]:[scrollbar-width:thin] [&_[data-slot=table-container]]:[scrollbar-color:rgb(97_146_154/0.55)_transparent]">
      <Table className="min-w-[620px]" aria-label={ariaLabel}>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[170px]">Size</TableHead>
            <TableHead>Millimetres</TableHead>
            <TableHead>Inches</TableHead>
            <TableHead>Pixels @ 300 DPI</TableHead>
            <TableHead className="min-w-[230px] whitespace-normal">Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sizes.map((s) => (
            <TableRow key={s.id}>
              <TableCell className="whitespace-normal font-medium">{s.label}</TableCell>
              <TableCell className="tabular-nums">{formatDimensions(s.widthMm, s.heightMm)}</TableCell>
              <TableCell className="tabular-nums">
                {formatDimensions(s.widthMm, s.heightMm, "in", 2)}
              </TableCell>
              <TableCell className="tabular-nums">{formatPixels(s.widthMm, s.heightMm)}</TableCell>
              <TableCell className="whitespace-normal text-[13.5px] text-muted-foreground">
                {s.note ?? "Reference size for general ID printing."}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function PhotosPerPaperTable() {
  return (
    <div className={tableWrap()}>
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
          margin and {GAP_MM} mm gaps — the same numbers the arrange step in the photo maker shows.
        </TableCaption>
      </Table>
    </div>
  );
}

function PopularSizesTable() {
  return (
    <div className={tableWrap()}>
      <Table className="min-w-[860px]" aria-label="Most common passport photo sizes at a glance">
        <TableHeader>
          <TableRow>
            <TableHead>Size</TableHead>
            <TableHead>Also known as</TableHead>
            <TableHead>Millimetres</TableHead>
            <TableHead>Inches</TableHead>
            <TableHead>Pixels @ 300 DPI</TableHead>
            <TableHead>Ratio (w : h)</TableHead>
            <TableHead className="min-w-[200px] whitespace-normal">Example countries</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {POPULAR_UNIQUE.map((s) => {
            const ex = exampleCountries(s.widthMm, s.heightMm);
            return (
              <TableRow key={s.id}>
                <TableCell className="font-medium tabular-nums">
                  {formatDimensions(s.widthMm, s.heightMm)}
                </TableCell>
                <TableCell className="whitespace-normal">
                  {SIZE_NICKNAMES[`${s.widthMm}x${s.heightMm}`] ?? s.label}
                </TableCell>
                <TableCell className="tabular-nums">
                  {formatDimensions(s.widthMm, s.heightMm)}
                </TableCell>
                <TableCell className="tabular-nums">
                  {formatDimensions(s.widthMm, s.heightMm, "in", 2)}
                </TableCell>
                <TableCell className="tabular-nums">{formatPixels(s.widthMm, s.heightMm)}</TableCell>
                <TableCell className="tabular-nums">
                  {(s.widthMm / s.heightMm).toFixed(2)} : 1
                </TableCell>
                <TableCell className="whitespace-normal text-muted-foreground">
                  {ex.names.join(", ")}
                  {ex.extra > 0 ? ` +${ex.extra} more` : ""}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableCaption>
          Ratios show width divided by height. The 50.8 × 50.8 mm and 51 × 51 mm squares are close
          cousins — some authorities accept either, others do not, so always check the exact figure.
        </TableCaption>
      </Table>
    </div>
  );
}

function OfficialSources({ country }: { country: CountryInfo }) {
  if (country.sources.length === 0) {
    return (
      <p className="text-[14.5px] text-muted-foreground">
        This entry covers generic reference sizes rather than one country&rsquo;s published rules.
        Verify the requirements for your specific document with the issuing authority before
        printing or submitting anything.
      </p>
    );
  }
  return (
    <ul className="space-y-1.5">
      {country.sources.map((src) => (
        <li key={src.url}>
          <a
            href={src.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-1.5 text-[14.5px] font-medium text-alma-accent underline decoration-alma-accent/40 underline-offset-4 transition-colors hover:decoration-alma-accent"
          >
            {src.label}
            <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function SizesFaq() {
  return (
    <Accordion
      type="single"
      collapsible
      className="rounded-2xl border bg-card px-5 shadow-card"
    >
      {SIZE_FAQ_IDS.map((i) => (
        <AccordionItem key={i} value={`size-faq-${i}`}>
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

function IntegrityNote() {
  return (
    <div className="mt-10 flex gap-3 rounded-2xl border border-alma-collard/25 bg-secondary/60 p-5">
      <Info className="mt-0.5 h-5 w-5 shrink-0 text-alma-collard" aria-hidden="true" />
      <p className="text-[14px] leading-relaxed text-foreground/85">
        <span className="font-semibold">An important integrity note.</span> Requirements vary by
        authority, document type and application channel, and they change over time. The sizes on
        this page are widely published reference values for common documents; they are not official
        guidance, and this tool does not guarantee compliance with any authority&rsquo;s rules.
        Verify size, background, head position and photo age on the official source linked in each
        country card before you submit a photo.
      </p>
    </div>
  );
}

function RelatedLinkCards() {
  const links = [
    {
      href: "#/photo-printing-guide",
      title: "Photo printing guide",
      text: "Printer settings, actual-size scaling and paper choices for correct prints.",
    },
    {
      href: "#/how-it-works",
      title: "How the tool works",
      text: "The four phases from upload to a 300 DPI print-ready download.",
    },
    {
      href: "#/faq",
      title: "Frequently asked questions",
      text: "Sizes, counts, privacy and what this free tool does not do.",
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
            <ArrowRight className="ml-1.5 inline h-4 w-4" aria-hidden="true" />
          </p>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">{l.text}</p>
        </a>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Country guide view                                                  */
/* ------------------------------------------------------------------ */

function CountryGuideView({
  country,
  onBack,
}: {
  country: CountryInfo;
  onBack: () => void;
}) {
  const primary = country.sizes[0];
  const paper4x6 = PAPER_SIZES.find((p) => p.id === "4x6");
  const fit4x6 =
    primary && paper4x6
      ? computeGrid({
          paperW: paper4x6.widthMm,
          paperH: paper4x6.heightMm,
          photoW: primary.widthMm,
          photoH: primary.heightMm,
          margin: MARGIN_MM,
          gapX: GAP_MM,
          gapY: GAP_MM,
        })
      : null;

  const lede = primary
    ? `The reference passport photo format for ${country.name} is ${primary.label}: ${formatDimensions(
        primary.widthMm,
        primary.heightMm,
      )} (${formatDimensions(primary.widthMm, primary.heightMm, "in", 2)}). Confirm the current rules with the official source below before you print.`
    : `Reference photo sizes used for ${country.name} documents, with millimetre, inch and pixel conversions for printing.`;

  return (
    <PageShell
      title={`${country.name} Passport Photo Size Guide`}
      lede={lede}
      crumbs={[
        { label: "Passport Photo Sizes", href: "/passport-photo-sizes" },
        { label: country.name },
      ]}
      updated={UPDATED}
      kicker="Country guide"
    >
      <div className="prose-alma">
        <a
          href="#/passport-photo-sizes"
          onClick={(e) => {
            e.preventDefault();
            onBack();
          }}
          className="mb-6 inline-flex min-h-[44px] items-center gap-2 rounded-xl px-2 text-[14px] font-semibold text-alma-accent transition-colors hover:text-alma-collard"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to all sizes
        </a>

        <p>
          {country.note
            ? `${country.note} `
          : ""}
          The measurements below come from the reference catalogue built into our photo maker, and
          every entry links to the issuing authority so you can double-check them. Sizes are only
          one part of the rules: background colour, head height, expression and photo age are
          usually specified separately, and those details differ between passport, visa and ID
          channels.
        </p>

        <h2>What size is a {country.name} passport photo?</h2>
        <p>
          {primary
            ? `The most commonly published format is ${primary.label}, measuring ${formatDimensions(
                primary.widthMm,
                primary.heightMm,
              )} — that is ${formatPixels(primary.widthMm, primary.heightMm)} for digital files. Use the notes column to match the right size to your document.`
          : "The table below lists every reference size for this entry with its conversions."}
        </p>
      </div>

      <SizesTable
        sizes={country.sizes}
        ariaLabel={`${country.name} passport photo sizes in millimetres, inches and pixels`}
      />

      <div className="prose-alma mt-6">
        <h2>How do I print a {country.name} passport photo at the right size?</h2>
        <p>
          A quick printing recipe, from digital photo to correctly sized print:
        </p>
        <ol>
          <li>
            <strong>Choose the size.</strong> Open the{" "}
            <a href="#/passport-photo-maker">free photo maker</a> and search for {country.name}, or
            pick &ldquo;{primary ? primary.label : "your size"}&rdquo;
            {primary
              ? ` — ${formatDimensions(primary.widthMm, primary.heightMm)}`
              : ""}{" "}
            from the size list. Custom millimetres are also supported.
          </li>
          <li>
            <strong>Choose the paper.</strong>{" "}
            {paper4x6 && fit4x6 && fit4x6.fits
              ? `${paper4x6.label} (${formatDimensions(paper4x6.widthMm, paper4x6.heightMm)}) fits ${fit4x6.placements.length} cop${fit4x6.placements.length === 1 ? "y" : "ies"} of this size with a ${MARGIN_MM} mm margin and ${GAP_MM} mm gaps.`
              : "Pick a paper size in the arrange step and the maker packs as many copies as fit."}{" "}
            Larger sheets such as A4 fit more photos per print.
          </li>
          <li>
            <strong>Download the print-ready PDF.</strong> The sheet is rendered at 300 DPI with
            exact physical dimensions, so every photo is the right size on paper.
          </li>
          <li>
            <strong>Print at Actual size / 100%.</strong> Never use Fit to page: scaling changes the
            millimetre size. The <a href="#/photo-printing-guide">photo printing guide</a> explains
            every setting that matters.
          </li>
          <li>
            <strong>Cut and verify.</strong> Cut along the cell edges, then check the official
            source below for background, head-position and photo-age rules before submitting.
          </li>
        </ol>

        <h2>Where can I verify the official rules for {country.name}?</h2>
        <p>
          The links below point to the issuing authority or its published photo guidance.
          Requirements can differ between passport, visa and ID channels and they change over time,
          so the official page is the only authoritative source — treat this directory as a printing
          aid, not as legal guidance.
        </p>
      </div>

      <OfficialSources country={country} />

      <div className="prose-alma mt-10">
        <h2>Keep exploring</h2>
      </div>
      <RelatedLinkCards />

      <ToolCta
        title={`Crop a photo to the ${primary ? formatDimensions(primary.widthMm, primary.heightMm) : "official"} size now`}
        text="Open the free photo maker, pick this size, arrange copies on your paper and download a 300 DPI print-ready sheet. No account, no watermark."
      />

      <div className="prose-alma">
        <h2>Passport photo size questions</h2>
        <p>Short answers to the questions we hear most about sizes and printing.</p>
      </div>
      <SizesFaq />

      <IntegrityNote />
    </PageShell>
  );
}

/* ------------------------------------------------------------------ */
/* Directory view + main export                                        */
/* ------------------------------------------------------------------ */

export function SizesPage({ initialCountry }: { initialCountry?: string }) {
  const [selectedId, setSelectedId] = useState<string | null>(initialCountry ?? null);
  const [query, setQuery] = useState("");

  // Sync selection when the route hands us a different country (adjust-during-render
  // pattern — keeps state derived from props without a cascading effect).
  const [lastInitialCountry, setLastInitialCountry] = useState(initialCountry);
  if (lastInitialCountry !== initialCountry) {
    setLastInitialCountry(initialCountry);
    setSelectedId(initialCountry ?? null);
  }

  // External-system side effect only: land at the top when a country guide opens.
  useEffect(() => {
    if (initialCountry) window.scrollTo({ top: 0 });
  }, [initialCountry]);

  const country = findCountry(selectedId);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_COUNTRIES;
    return ALL_COUNTRIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.region.toLowerCase().includes(q),
    );
  }, [query]);

  const openCountry = (id: string) => {
    setSelectedId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const backToDirectory = () => {
    setSelectedId(null);
    if (typeof window !== "undefined" && window.location.hash.startsWith("#/passport-photo-sizes/")) {
      window.location.hash = "#/passport-photo-sizes";
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (country) {
    return <CountryGuideView country={country} onBack={backToDirectory} />;
  }

  const sidebar = (
    <nav aria-label="Related size guides" className="space-y-6">
      <div className="rounded-2xl border bg-card p-6 shadow-card">
        <p className="font-display text-lg font-semibold">Popular guides</p>
        <ul className="mt-3 space-y-1">
          {POPULAR_COUNTRY_IDS.map((id) => {
            const c = findCountry(id);
            if (!c) return null;
            return (
              <li key={id}>
                <a
                  href={`#/passport-photo-sizes/${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    openCountry(id);
                  }}
                  className="flex min-h-[44px] items-center gap-2.5 rounded-xl px-2.5 text-[14.5px] font-medium text-foreground/85 transition-colors hover:bg-secondary"
                >
                  <span aria-hidden="true" className="text-lg">
                    {c.flag}
                  </span>
                  {c.name}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="rounded-2xl border bg-card p-6 shadow-card">
        <p className="font-display text-lg font-semibold">Related pages</p>
        <ul className="mt-3 space-y-1">
          {[
            { href: "#/photo-printing-guide", label: "Photo printing guide" },
            { href: "#/how-it-works", label: "How the tool works" },
            { href: "#/faq", label: "Frequently asked questions" },
            { href: "#/blog", label: "Blog and printing tips" },
          ].map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="flex min-h-[44px] items-center rounded-xl px-2.5 text-[14.5px] font-medium text-foreground/85 transition-colors hover:bg-secondary"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );

  return (
    <PageShell
      title="Passport Photo Sizes by Country — mm, Inches & Pixels"
      lede="Exact passport, visa and ID photo dimensions for every size built into the photo maker — in millimetres, inches and pixels at 300 DPI — with a link to the official issuing authority for each country."
      crumbs={[{ label: "Passport Photo Sizes" }]}
      updated={UPDATED}
      kicker="Size directory"
      sidebar={sidebar}
    >
      <div className="prose-alma">
        <p>
          <strong>Short answer:</strong> there is no single worldwide standard. Most of Europe, Asia
          and Oceania uses the 35 × 45 mm international format, the United States prints a 2 × 2
          inch (50.8 × 50.8 mm) square, and Canada asks for 50 × 70 mm. The directory below lists
          every reference size in the maker, converted to millimetres, inches and 300 DPI pixels,
          with the official source for each country.
        </p>
        <p>
          Treat this page as a printing reference, not as legal guidance. Requirements vary by
          document type and application channel, they change over time, and many authorities add
          rules a size table cannot capture — background colour, head height, expression, photo age.
          Confirm the details on the official page linked in each country card, then crop your photo
          to the exact millimetre size in the{" "}
          <a href="#/passport-photo-maker">free passport photo maker</a>.
        </p>

        <h2>Which passport photo size do I need?</h2>
        <p>
          The one your issuing authority publishes today. In practice, three steps are enough:
        </p>
        <ol>
          <li>
            Find your country below and read its sizes table — the label tells you which document
            each size is used for.
          </li>
          <li>
            Open the linked official source and check the size together with the background, head
            position and recency rules.
          </li>
          <li>
            Crop the photo to the exact size in the maker and print it at actual size — the{" "}
            <a href="#/photo-printing-guide">photo printing guide</a> shows how.
          </li>
        </ol>

        <h2>Most common sizes at a glance</h2>
        <p>
          These four formats cover the majority of passport, visa and ID applications we see. The
          ratio column is width divided by height — useful when you are checking whether a template
          distorts your photo.
        </p>
      </div>

      <PopularSizesTable />

      <div className="prose-alma">
        <h2>How many passport photos fit on each paper size?</h2>
        <p>
          This table is calculated live with the same layout engine the editor uses:{" "}
          {formatDimensions(PHOTO_W, PHOTO_H)} photos, a {MARGIN_MM} mm page margin and {GAP_MM} mm
          gaps between photos. For other photo sizes or spacings, the arrange step in the{" "}
          <a href="#/passport-photo-maker">photo maker</a> recalculates the grid instantly.
        </p>
      </div>

      <PhotosPerPaperTable />

      <div className="prose-alma">
        <h2>Browse passport photo sizes by country</h2>
        <p>
          Every card lists the reference sizes for that country or region, what each size is used
          for, and the official page where the rules are published. Search by name, or jump straight
          to a popular guide.
        </p>
      </div>

      <div className="mt-6">
        <div className="relative max-w-md">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a country — e.g. India, Germany…"
            aria-label="Search passport photo sizes by country name"
            className="h-12 rounded-xl border-input bg-card pl-11 text-[15px] shadow-card"
          />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[13px] font-medium text-muted-foreground">Popular:</span>
          {POPULAR_COUNTRY_IDS.map((id) => {
            const c = findCountry(id);
            if (!c) return null;
            return (
              <a
                key={id}
                href={`#/passport-photo-sizes/${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  openCountry(id);
                }}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border bg-card px-4 text-[13px] font-medium shadow-card transition-colors hover:bg-secondary"
              >
                <span aria-hidden="true">{c.flag}</span>
                {c.name}
              </a>
            );
          })}
        </div>
        <p className="mt-4 text-[13.5px] text-muted-foreground" role="status">
          Showing {filtered.length} of {ALL_COUNTRIES.length} entries
        </p>

        {filtered.length === 0 ? (
          <div className="mt-6 rounded-2xl border bg-card p-8 text-center shadow-card">
            <p className="font-display text-lg font-semibold">No countries match &ldquo;{query}&rdquo;</p>
            <p className="mt-2 text-[14.5px] text-muted-foreground">
              Try a shorter search, or pick a size from the popular table above — the maker also
              supports custom millimetre sizes.
            </p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-5 inline-flex min-h-[44px] items-center rounded-xl bg-secondary px-5 text-[14.5px] font-semibold text-alma-collard transition-colors hover:bg-accent"
            >
              Clear the search
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {filtered.map((c) => (
              <article key={c.id} className="rounded-2xl border bg-card p-4 shadow-card md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="flex items-center gap-3 font-display text-xl font-semibold">
                    <span aria-hidden="true" className="text-[26px]">
                      {c.flag}
                    </span>
                    {c.name}
                  </h3>
                  <Badge variant="secondary">{c.region}</Badge>
                </div>
                {c.note && (
                  <p className="mt-2 text-[13.5px] italic text-muted-foreground">{c.note}</p>
                )}
                <div className="mt-4">
                  <SizesTable
                    sizes={c.sizes}
                    ariaLabel={`${c.name} passport photo sizes in millimetres, inches and pixels`}
                  />
                </div>
                <div className="mt-4">
                  <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Official source{c.sources.length === 1 ? "" : "s"}
                  </p>
                  <div className="mt-1">
                    <OfficialSources country={c} />
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href={`#/passport-photo-sizes/${c.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      openCountry(c.id);
                    }}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-secondary px-4 text-[14px] font-semibold text-alma-collard transition-colors hover:bg-accent"
                  >
                    Open the {c.name} guide
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <a
                    href="#/passport-photo-maker"
                    className="inline-flex min-h-[44px] items-center rounded-xl border px-4 text-[14px] font-semibold text-foreground/85 transition-colors hover:bg-secondary"
                  >
                    Make this photo
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="prose-alma mt-12">
        <h2>Passport photo size questions</h2>
        <p>The questions people ask most about choosing and printing the right size.</p>
      </div>
      <SizesFaq />

      <ToolCta
        title="Ready to crop your photo to the exact size?"
        text="Open the free photo maker, pick any size from this directory, arrange copies on your paper and download a 300 DPI print-ready sheet — no account, no watermark."
      />

      <IntegrityNote />
    </PageShell>
  );
}
