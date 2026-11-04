"use client";

import type { ReactNode } from "react";
import { AdSlot } from "@/components/ads/AdSlot";
import { ChevronRight, Home } from "lucide-react";

export interface Crumb {
  label: string;
  href?: string;
}

interface PageShellProps {
  title: string;
  lede?: string;
  crumbs: Crumb[];
  updated?: string;
  children: ReactNode;
  /** Optional sidebar (desktop) for in-content ads / related links */
  sidebar?: ReactNode;
  showAds?: boolean;
  kicker?: string;
}

/**
 * Shared layout for content pages: breadcrumb, editorial header, optional
 * sidebar with reserved ad slots, and a bottom responsive ad.
 */
export function PageShell({
  title,
  lede,
  crumbs,
  updated,
  children,
  sidebar,
  showAds = true,
  kicker,
}: PageShellProps) {
  return (
    <div className="pb-16 pt-8 md:pt-12">
      <div className="container-editorial">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1 text-[13px] text-muted-foreground">
            <li>
              <a href="#/" className="inline-flex items-center gap-1 rounded hover:text-foreground">
                <Home className="h-3.5 w-3.5" aria-hidden="true" />
                Home
              </a>
            </li>
            {crumbs.map((c, i) => (
              <li key={i} className="flex items-center gap-1">
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                {c.href ? (
                  <a href={`#${c.href}`} className="rounded hover:text-foreground">
                    {c.label}
                  </a>
                ) : (
                  <span aria-current="page" className="font-medium text-foreground">
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <header className="max-w-3xl">
          {kicker && (
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-alma-accent">
              {kicker}
            </p>
          )}
          <h1 className="text-balance font-display text-4xl font-semibold leading-[1.08] md:text-[44px]">
            {title}
          </h1>
          {lede && <p className="mt-4 text-[16.5px] leading-relaxed text-muted-foreground">{lede}</p>}
          {updated && (
            <p className="mt-3 text-[12.5px] text-muted-foreground">
              Last updated: {updated} · Reviewed by the printmyphoto editorial team
            </p>
          )}
        </header>

        {showAds && (
          <div className="mt-8 lg:hidden">
            <AdSlot slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP} format="horizontal" />
          </div>
        )}

        <div className={sidebar ? "mt-8 grid gap-10 lg:grid-cols-[1fr_300px]" : "mt-8"}>
          <div className="min-w-0">{children}</div>
          {sidebar && (
            <aside className="hidden space-y-6 lg:block">
              {sidebar}
              {showAds && (
                <AdSlot slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDE} format="vertical" />
              )}
            </aside>
          )}
        </div>

        {showAds && (
          <div className="mt-14">
            <AdSlot slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM} format="horizontal" />
          </div>
        )}
      </div>
    </div>
  );
}

/** Simple CTA card used across content pages to route readers to the tool. */
export function ToolCta({ title, text }: { title: string; text: string }) {
  return (
    <div className="my-10 rounded-2xl border bg-[image:var(--alma-gradient-primary)] p-6 text-alma-yogurt shadow-card md:p-8">
      <p className="font-display text-2xl font-semibold">{title}</p>
      <p className="mt-2 max-w-xl text-[14.5px] leading-relaxed opacity-90">{text}</p>
      <a
        href="#/passport-photo-maker"
        className="mt-5 inline-flex h-12 items-center rounded-xl bg-white px-6 text-[15px] font-bold text-[#2a3d1c] shadow-lift transition-all hover:bg-[#fffdf5] hover:scale-[1.02] border border-white/40"
      >
        Open the free photo maker
      </a>
    </div>
  );
}
