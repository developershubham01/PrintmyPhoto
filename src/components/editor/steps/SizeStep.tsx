"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ALL_COUNTRIES, POPULAR_SIZES, findCountry } from "@/data/passport-sizes";
import { useEditorStore } from "@/lib/store/editor-store";
import type { PhotoSizeOption, Unit } from "@/types/editor";
import {
  aspectRatio,
  formatDimensions,
  formatPixels,
  fromMm,
  toMm,
} from "@/lib/dimensions";
import { Check, Info, Ruler, Search, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export function SizeStep() {
  const photoSize = useEditorStore((s) => s.photoSize);
  const setPhotoSize = useEditorStore((s) => s.setPhotoSize);
  const setCustomPhotoSize = useEditorStore((s) => s.setCustomPhotoSize);
  const [query, setQuery] = useState("");
  const [activeCountry, setActiveCountry] = useState<string | null>(
    photoSize.countryId ?? "generic",
  );
  const [unit, setUnit] = useState<Unit>("mm");
  const [customW, setCustomW] = useState(() => String(fromMm(photoSize.widthMm, "mm")));
  const [customH, setCustomH] = useState(() => String(fromMm(photoSize.heightMm, "mm")));

  const filteredCountries = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_COUNTRIES;
    return ALL_COUNTRIES.map((c) => ({
      ...c,
      sizes: c.sizes.filter(
        (s) =>
          s.label.toLowerCase().includes(q) ||
          `${formatDimensions(s.widthMm, s.heightMm)}`.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q),
      ),
    })).filter((c) => c.sizes.length > 0 || c.name.toLowerCase().includes(q));
  }, [query]);

  const sizesToShow = useMemo(() => {
    if (query.trim()) {
      return filteredCountries.flatMap((c) =>
        c.sizes.map((s) => ({ ...s, countryId: c.id })),
      );
    }
    const country = findCountry(activeCountry);
    return country ? country.sizes.map((s) => ({ ...s, countryId: country.id })) : [];
  }, [query, filteredCountries, activeCountry]);

  const applySize = (opt: PhotoSizeOption) => {
    setPhotoSize({ ...opt, countryId: opt.countryId ?? null });
  };

  const applyCustom = () => {
    const w = toMm(parseFloat(customW), unit);
    const h = toMm(parseFloat(customH), unit);
    if (!Number.isFinite(w) || !Number.isFinite(h) || w < 10 || h < 10 || w > 500 || h > 500) {
      return;
    }
    setCustomPhotoSize(w, h, `${customW} × ${customH} ${unit}`);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-10">
      <div className="min-w-0 space-y-5">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search country or size — e.g. India, 2×2, 35×45…"
            className="h-12 rounded-xl pl-11 text-[15px]"
            aria-label="Search countries and photo sizes"
          />
        </div>

        {/* Popular chips */}
        <div className="flex flex-wrap gap-2">
          {POPULAR_SIZES.slice(0, 8).map((s) => {
            const active =
              photoSize.widthMm === s.widthMm && photoSize.heightMm === s.heightMm;
            return (
              <button
                key={`pop-${s.id}`}
                type="button"
                onClick={() => applySize(s)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors",
                  active
                    ? "border-alma-collard bg-alma-collard text-alma-yogurt"
                    : "border-border bg-card hover:border-alma-collard/50",
                )}
              >
                {s.label} · {formatDimensions(s.widthMm, s.heightMm)}
              </button>
            );
          })}
        </div>

        {/* Country tabs */}
        {!query.trim() && (
          <div>
            <Label htmlFor="country-select" className="mb-1.5 block text-sm font-medium">Country / region</Label>
            <Select
              value={activeCountry ?? "generic"}
              onValueChange={(v) => setActiveCountry(v)}
            >
              <SelectTrigger id="country-select" className="h-12 rounded-xl text-[15px]" aria-label="Select country">
                <SelectValue placeholder="Choose a country" />
              </SelectTrigger>
              <SelectContent className="max-h-72 rounded-xl">
                {ALL_COUNTRIES.map((c) => (
                  <SelectItem key={c.id} value={c.id} className="rounded-lg">
                    {c.flag} {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Size list */}
        <div className="max-h-[380px] space-y-2.5 overflow-y-auto pr-1 scroll-slim" aria-label="Photo size options">
          {sizesToShow.map((s) => {
            const active = photoSize.widthMm === s.widthMm && photoSize.heightMm === s.heightMm;
            const country = findCountry(s.countryId);
            return (
              <button
                key={`${s.countryId}-${s.id}`}
                type="button"
                onClick={() => applySize(s)}
                aria-pressed={active}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-xl border bg-card p-4 text-left transition-all",
                  active
                    ? "border-alma-collard ring-2 ring-alma-collard/25"
                    : "border-border hover:border-alma-collard/40 hover:shadow-card",
                )}
              >
                <div>
                  <p className="flex items-center gap-2 text-[15px] font-semibold">
                    {country && !query.trim() ? null : (
                      <span aria-hidden="true">{country?.flag}</span>
                    )}
                    {s.label}
                    {active && <Check className="h-4 w-4 text-alma-collard" aria-hidden="true" />}
                  </p>
                  <p className="mt-0.5 text-[13px] text-muted-foreground">
                    {query.trim() && country ? `${country.name} — ` : ""}
                    {s.note ?? "Reference size — verify with the issuing authority."}
                  </p>
                </div>
                <span className="shrink-0 rounded-lg bg-secondary px-3 py-1.5 font-mono text-[13px] font-semibold text-alma-collard">
                  {formatDimensions(s.widthMm, s.heightMm)}
                </span>
              </button>
            );
          })}
          {sizesToShow.length === 0 && (
            <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
              No matches — try a different search, or enter custom dimensions below.
            </p>
          )}
        </div>

        {/* Custom size */}
        <div className="rounded-xl border bg-card p-4">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Ruler className="h-4 w-4 text-alma-accent" aria-hidden="true" /> Custom dimensions
          </p>
          <div className="mt-3 flex flex-wrap items-end gap-3">
            <div>
              <Label htmlFor="custom-w" className="mb-1 block text-xs text-muted-foreground">Width</Label>
              <Input
                id="custom-w"
                type="number"
                inputMode="decimal"
                min={10}
                max={500}
                value={customW}
                onChange={(e) => setCustomW(e.target.value)}
                className="h-11 w-24 rounded-lg"
              />
            </div>
            <div>
              <Label htmlFor="custom-h" className="mb-1 block text-xs text-muted-foreground">Height</Label>
              <Input
                id="custom-h"
                type="number"
                inputMode="decimal"
                min={10}
                max={500}
                value={customH}
                onChange={(e) => setCustomH(e.target.value)}
                className="h-11 w-24 rounded-lg"
              />
            </div>
            <div>
              <Label htmlFor="custom-unit" className="mb-1 block text-xs text-muted-foreground">Unit</Label>
              <Select value={unit} onValueChange={(v) => setUnit(v as Unit)}>
                <SelectTrigger id="custom-unit" className="h-11 w-28 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-lg">
                  <SelectItem value="mm">mm</SelectItem>
                  <SelectItem value="cm">cm</SelectItem>
                  <SelectItem value="in">inches</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="btn-gradient h-11 rounded-xl px-5" onClick={applyCustom}>
              Use custom size
            </Button>
          </div>
        </div>
      </div>

      {/* Info panel */}
      <aside className="min-w-0 space-y-4">
        <div className="rounded-2xl border bg-card p-6 shadow-card">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Selected size
          </p>
          <p className="mt-1 font-display text-2xl font-semibold">{photoSize.label}</p>

          <div className="mt-4 flex items-center gap-4">
            <div
              className="shrink-0 rounded-lg border border-alma-collard/50 bg-alma-yogurt shadow-inner"
              style={{
                width: 52,
                height: Math.min(72, (52 * photoSize.heightMm) / photoSize.widthMm),
              }}
              aria-hidden="true"
            />
            <dl className="grid flex-1 gap-1.5 text-[13.5px]">
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Dimensions</dt>
                <dd className="font-semibold tabular-nums">
                  {formatDimensions(photoSize.widthMm, photoSize.heightMm, "mm")} ·{" "}
                  {formatDimensions(photoSize.widthMm, photoSize.heightMm, "in", 2)}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">At 300 DPI</dt>
                <dd className="font-semibold tabular-nums">
                  {formatPixels(photoSize.widthMm, photoSize.heightMm)}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Aspect ratio</dt>
                <dd className="font-semibold tabular-nums">
                  {aspectRatio(photoSize.widthMm, photoSize.heightMm)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-4 flex gap-2.5 rounded-xl border border-alma-orange/40 bg-alma-orange/10 p-3.5 text-[13px] leading-relaxed">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-alma-orange" aria-hidden="true" />
            <span>
              Official requirements vary by document, application channel and authority — and they
              change over time. Check the official source for your application before printing.
            </span>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Info className="h-4 w-4 text-alma-accent" aria-hidden="true" />
            Why the size matters
          </p>
          <p className="prose-alma mt-2 text-[13.5px]">
            The photo frame you crop here is printed at exactly these physical dimensions on the
            final sheet. A millimetre of difference can cause an application to be rejected — the
            editor renders at 300 DPI ({formatPixels(photoSize.widthMm, photoSize.heightMm)}) so
            printed edges stay crisp. See the{" "}
            <a href="#/passport-photo-sizes">full size guide by country</a> for reference values and
            official source links.
          </p>
        </div>
      </aside>
    </div>
  );
}

