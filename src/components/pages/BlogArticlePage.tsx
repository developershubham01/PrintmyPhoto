"use client";

import type { ReactNode } from "react";
import { ArrowRight, CalendarDays, Clock, FileQuestion } from "lucide-react";
import { PageShell, ToolCta } from "@/components/pages/PageShell";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  getArticle,
  relatedArticles,
  type BlogArticle,
  type BlogBlock,
} from "@/content/blog/articles";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2025-02-10" → "Feb 10, 2025" (manual parse avoids timezone drift). */
function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d || m < 1 || m > 12) return iso;
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

const INLINE_LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/;

/**
 * Parses `[label](href)` markers into real anchors.
 * Internal `#/...` targets stay plain anchors; `https?://` targets open in a new
 * tab with `rel="noopener noreferrer"`. Everything else is returned as text.
 */
function renderInline(text: string): ReactNode[] {
  const segments = text.split(INLINE_LINK_PATTERN);
  const nodes: ReactNode[] = [];
  for (let i = 0; i < segments.length; i += 3) {
    const plain = segments[i];
    if (plain) nodes.push(plain);
    const label = segments[i + 1];
    const href = segments[i + 2];
    if (label && href) {
      const external = /^https?:\/\//i.test(href);
      nodes.push(
        external ? (
          <a key={nodes.length} href={href} target="_blank" rel="noopener noreferrer">
            {label}
          </a>
        ) : (
          <a key={nodes.length} href={href}>
            {label}
          </a>
        ),
      );
    }
  }
  return nodes;
}

function Block({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case "p":
      return <p>{renderInline(block.text)}</p>;
    case "h2":
      return <h2>{block.text}</h2>;
    case "h3":
      return <h3>{block.text}</h3>;
    case "ul":
      return (
        <ul>
          {block.items.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol>
          {block.items.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ol>
      );
    case "table":
      return (
        <figure className="my-6 overflow-x-auto rounded-2xl border bg-card shadow-card scroll-slim">
          <table className="mb-0 w-full min-w-[520px] text-sm">
            <thead>
              <tr>
                {block.headers.map((header, i) => (
                  <th key={i} scope="col">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci}>{renderInline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {block.caption && (
            <figcaption className="px-4 pb-3 pt-1 text-xs leading-relaxed text-muted-foreground">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case "callout":
      return (
        <aside className="my-6 rounded-2xl border border-alma-accent/30 bg-accent/40 p-5">
          <p className="font-display text-[15.5px] font-semibold text-foreground">{block.title}</p>
          <p className="mt-1.5 text-[14.5px] leading-relaxed text-foreground/85">
            {renderInline(block.text)}
          </p>
        </aside>
      );
    case "cta":
      return (
        <ToolCta
          title="Make your passport photo now"
          text="Free, no sign-up — your photo never leaves your browser."
        />
      );
    default:
      return null;
  }
}

function RelatedCard({ article }: { article: BlogArticle }) {
  return (
    <li className="h-full">
      <a
        href={`#/blog/${article.slug}`}
        className="group flex h-full flex-col rounded-2xl border bg-card p-6 shadow-card outline-none transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-alma-accent/60"
      >
        <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
          {article.tag}
        </Badge>
        <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-foreground">
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {article.description}
        </p>
        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-alma-accent">
          Read guide
          <ArrowRight
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </a>
    </li>
  );
}

export function BlogArticlePage(props: { slug?: string }) {
  const article = getArticle(props.slug);

  if (!article) {
    return (
      <PageShell
        title="Article not found"
        lede="The guide you are looking for does not exist, may have been renamed, or the link is incomplete."
        crumbs={[{ label: "Blog" }]}
        kicker="Blog"
      >
        <div className="rounded-2xl border bg-card p-6 shadow-card md:p-8">
          <div className="flex items-start gap-4">
            <span className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-alma-collard">
              <FileQuestion className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-display text-xl font-semibold">Looking for a guide?</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                All published guides live on the blog index — from country size references to
                printing walkthroughs and background rules.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="#/blog"
                  className="inline-flex h-11 items-center rounded-xl bg-alma-collard px-5 text-sm font-semibold text-alma-yogurt shadow-card transition-transform hover:-translate-y-0.5"
                >
                  Browse all guides
                </a>
                <a
                  href="#/passport-photo-sizes"
                  className="inline-flex h-11 items-center rounded-xl border bg-card px-5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
                >
                  Passport photo sizes
                </a>
              </div>
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  const related = relatedArticles(article.slug, 3);

  return (
    <PageShell
      crumbs={[{ label: "Blog", href: "/blog" }, { label: article.title }]}
      title={article.title}
      lede={article.description}
      updated={formatDate(article.date)}
      kicker={article.tag}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
          {article.tag}
        </Badge>
        <span className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
          <time dateTime={article.date}>{formatDate(article.date)}</time>
        </span>
        <span className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          {article.readingMinutes} min read
        </span>
      </div>

      <Separator className="my-6" />

      <article className="prose-alma">
        {article.blocks.map((block, i) => (
          <Block key={i} block={block} />
        ))}
      </article>

      <section aria-labelledby="related-guides" className="mt-14">
        <h2 id="related-guides" className="font-display text-2xl font-semibold">
          Related guides
        </h2>
        <ul className="mt-6 grid gap-6 md:grid-cols-3">
          {related.map((item) => (
            <RelatedCard key={item.slug} article={item} />
          ))}
        </ul>
      </section>

      <ToolCta
        title="Make your passport photo now"
        text="Free, no sign-up — your photo never leaves your browser."
      />
    </PageShell>
  );
}
