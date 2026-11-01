# Task 6-c — Educational Blog (10 articles + index + article page)

## Files written (only the 3 allowed)
1. `src/content/blog/articles.ts` — NEW. Plain TS data (no "use client"). Exports: `BlogBlock`, `BlogArticle`, `ARTICLE_TAGS`, `ARTICLES` (10 articles), `getArticle(slug?)`, `relatedArticles(slug, count=3)` (same-tag first, then newest).
2. `src/components/pages/BlogPage.tsx` — overwrote placeholder. `export function BlogPage()` exact. PageShell ("Blog & Guides", lede, crumbs Blog), tag filter chips (All + Sizes/Printing/Backgrounds/Guides, useState, aria-pressed, 44px targets), date-sorted card grid (badge, font-display title, description, formatted date, Clock + min read, "Read guide" hover-lift), count line, ToolCta.
3. `src/components/pages/BlogArticlePage.tsx` — overwrote placeholder. `export function BlogArticlePage(props: { slug?: string })` exact. Friendly "Article not found" PageShell (no fake content) for unknown slugs. Meta row (tag badge + date + reading time) + Separator, `prose-alma` block renderer (p/h2/h3/ul/ol/table in `overflow-x-auto rounded-2xl border bg-card shadow-card scroll-slim` with min-w-[520px] + caption, callout `border-alma-accent/30 bg-accent/40 p-5`, cta → ToolCta "Make your passport photo now"). Regex link parser `renderInline` splits `[label](href)`; `https?://` gets target=_blank rel=noopener noreferrer, `#/...` plain anchors. "Related guides" cards (same-tag first) + closing ToolCta.

## Deviation note (intentional)
Spec's crumb arrays included `{label:"Home"}`, but `PageShell` already renders a hardcoded Home crumb — passing Home again renders "Home › Home". Crumbs passed are `[{Blog}]` / `[{Blog, href:"/blog"}, {article.title}]` so the visible trail is exactly Home › Blog / Home › Blog › Article title.

## Content
10 original articles, slugs/tags/dates per spec, 2025-01-10 → 2025-02-20, readingMinutes = round(words/200) = 3 each. Total ≈ 5,576 words. All grid counts verified against the `computeGrid` formula (4×6: 35×45→6, 51×51→2, 25×35→9, 33×48→4, 50×70→2; A4: 35×45→30, 51×51→15 with margin 4 / gap 2). Official links only where given: passportindia.gov.in (target blank). Every government-requirement claim hedged with "verify with the issuing authority" callouts. No emojis.

## QA
- `bun run lint`: 0 findings in my 3 files (4 pre-existing errors in CookieConsent/BackgroundStep/UploadStep/ThemeToggle + warnings in SizeStep/analytics — untouched).
- `bunx tsc --noEmit`: 0 errors in my 3 files (8 pre-existing in sitemap.ts/editor-store.ts — untouched).
- Automated link sweep: all internal `#/` markers resolve to real routes/country ids/article slugs; only approved external URL used.
- dev.log: compiles clean, GET / 200.
