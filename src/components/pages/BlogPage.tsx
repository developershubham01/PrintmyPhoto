"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Clock } from "lucide-react";
import { PageShell, ToolCta } from "@/components/pages/PageShell";
import { Badge } from "@/components/ui/badge";
import { ARTICLES, ARTICLE_TAGS, type BlogArticle } from "@/content/blog/articles";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2025-02-10" → "Feb 10, 2025" (manual parse avoids timezone drift). */
function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d || m < 1 || m > 12) return iso;
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

function ArticleCard({ article }: { article: BlogArticle }) {
  return (
    <li className="h-full">
      <a
        href={`#/blog/${article.slug}`}
        className="group flex h-full flex-col rounded-2xl border bg-card p-6 shadow-card outline-none transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-alma-accent/60"
      >
        <div className="flex items-center justify-between gap-3">
          <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
            {article.tag}
          </Badge>
          <time dateTime={article.date} className="text-xs text-muted-foreground">
            {formatDate(article.date)}
          </time>
        </div>
        <h3 className="mt-4 font-display text-xl font-semibold leading-snug text-foreground">
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-[14.5px] leading-relaxed text-muted-foreground">
          {article.description}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {article.readingMinutes} min read
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-alma-accent">
            Read guide
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </span>
        </div>
      </a>
    </li>
  );
}

export function BlogPage() {
  const [activeTag, setActiveTag] = useState<(typeof ARTICLE_TAGS)[number]>("All");

  const sorted = useMemo(
    () => [...ARTICLES].sort((a, b) => b.date.localeCompare(a.date)),
    [],
  );
  const filtered =
    activeTag === "All" ? sorted : sorted.filter((article) => article.tag === activeTag);

  return (
    <PageShell
      title="Blog & Guides"
      lede="Original, practical guides on making, editing and printing passport photos — country sizes, 4×6 and A4 sheet layouts, background rules and the mistakes that get photos rejected. Written by the studio team, updated regularly."
      crumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
      kicker="printmyphoto"
    >
      <section aria-label="Filter guides by topic">
        <div role="group" aria-label="Filter guides by topic" className="flex flex-wrap gap-2">
          {ARTICLE_TAGS.map((tag) => {
            const selected = tag === activeTag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(tag)}
                aria-pressed={selected}
                className={`inline-flex min-h-[44px] items-center rounded-full border px-4 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alma-accent/60 ${selected
                    ? "border-transparent bg-alma-collard text-alma-yogurt shadow-card"
                    : "border-border bg-card text-foreground/80 hover:border-alma-collard/40 hover:text-foreground"
                  }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-sm text-muted-foreground" aria-live="polite">
          Showing {filtered.length} {filtered.length === 1 ? "guide" : "guides"}
          {activeTag !== "All" ? ` in ${activeTag}` : ""}
        </p>
      </section>

      <section aria-labelledby="all-guides" className="mt-8">
        <h2 id="all-guides" className="font-display text-2xl font-semibold">
          {activeTag === "All" ? "All guides" : `${activeTag} guides`}
        </h2>
        {filtered.length > 0 ? (
          <ul className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </ul>
        ) : (
          <p className="mt-6 rounded-2xl border bg-card p-6 text-muted-foreground shadow-card">
            No guides in this topic yet — check back soon.
          </p>
        )}
      </section>

      <ToolCta
        title="Put a guide into practice"
        text="Crop, adjust and arrange your passport photo in the browser — free, no sign-up, and your photo never leaves your device."
      />
    </PageShell>
  );
}
