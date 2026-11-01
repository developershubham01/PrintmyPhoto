# Passport Photo & Print Studio

A free, production-ready **online passport photo maker and print studio**: upload a photo,
crop it to your country's size, customize the background, arrange copies on printable paper,
and download a print-ready 300 DPI **PDF / JPG / PNG** — with **no login, no signup, no
payment**, and photos that **never leave the browser**.

## Highlights

- **8-step editor** — upload (file / drag-drop / paste / camera / sample), crop & adjust
  (zoom, pan, rotate, brightness, contrast, saturation, face-position guide), approximate
  background removal + color replacement, searchable country size catalogue (19 countries)
  plus custom dimensions, paper selection (4×6, 5×7, A4, A5, Letter, Legal, A3, custom),
  automatic grid arrangement with adjustable margins/gaps and drag-to-position (overlap
  protection), realistic print preview with zoom, and exact-size exports.
- **Honest math** — all layout calculations use physical millimetres; the PDF page is created
  at the exact paper size (1 pt = 1/72 in) via `pdf-lib`, with the sheet rendered at 300 DPI.
- **Privacy by architecture** — everything runs client-side (Canvas + Web APIs). No photo is
  ever uploaded, stored, or shared. Consent-gated, aggregate-only analytics. Optional
  AdSense stays off until configured and approved.
- **SEO / GEO / AEO** — semantic HTML, JSON-LD (Organization, WebSite, WebApplication, HowTo),
  sitemap.xml, robots.txt, unique per-page titles/descriptions, FAQ + HowTo content, original
  10-article blog, country size guides with links to official government sources.

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui · Framer Motion ·
Zustand · pdf-lib · @fontsource (Fraunces + Archivo). No database required.

## Getting started

```bash
bun install        # or npm install
bun run dev        # http://localhost:3000
bun run lint       # ESLint
```

## Environment variables

See `.env.example` — all values are optional. The app is fully functional with none set.
AdSense and analytics stay disabled until configured **and** the visitor accepts cookies.

## Architecture notes

```
src/
  app/                    layout (metadata/JSON-LD), page, sitemap.ts, robots.ts
  components/
    layout/               AppShell, Navbar, Footer, ThemeProvider/Toggle, Logo
    editor/               EditorShell (stepper), steps/*, CropperStage, SheetWorkspace
    home/                 editorial landing page sections
    pages/                virtual content pages + shared PageShell
    ads/ consent/ seo/    AdSlot, CookieConsent, JSON-LD helpers
  lib/
    image/                validate, bake (color adjustments), crop, bg-removal,
                          compose, quality, sample
    export/               raster (300 DPI sheet), pdf (exact physical size), print
    store/                editor-store (undo/redo), consent-store
    layout-calculator.ts  grid math in millimetres
    dimensions.ts         mm/cm/in/px/pt conversions
  data/                   passport-sizes, paper-sizes, faqs
  content/blog/           10 original articles (structured blocks)
  types/                  shared domain types
```

### Routing model

The studio ships as a **single Next.js route (`/`) with hash-based virtual pages**
(`#/passport-photo-maker`, `#/passport-photo-sizes`, `#/blog/…`, etc.) so it runs in
sandboxed previews that only serve `/`. Every virtual page is a standalone component in
`src/components/pages/`. To move to real URLs in production, render each component from a
matching App Router route (`app/passport-photo-maker/page.tsx` → `<MakerPage/>`, etc.), add
per-route `metadata`, and keep `sitemap.ts` as-is — no component changes needed.

### Privacy guarantees implemented

- Image decoding, editing, composition, and PDF/JPG/PNG generation happen in the browser.
- No `fetch`/XHR ever transmits image data. Analytics events carry counts and enum values only.
- `ImageBitmap` and canvases are released/cleared on replace, reset, and unload.
- Object URLs for downloads are revoked automatically.
- The only localStorage key the site itself sets is `pps-consent` (your cookie choice).

## Deployment

Any Next.js 16-compatible host (Vercel, Cloudflare Workers via OpenNext, self-hosted):

```bash
bun run build       # production build
bun run start       # serve (standalone)
```

Set `NEXT_PUBLIC_SITE_URL` to the production origin. Configure AdSense only after approval,
then flip `NEXT_PUBLIC_ADSENSE_ENABLED=1`, add the client + slot IDs, and update
`public/ads.txt` with your real `pub-` ID.

## Honest-use notice

This tool helps you prepare and print photos. It does **not** guarantee compliance with any
government document standard — requirements vary by country, document type, application
channel and time. Always verify with the official issuing authority (linked from the size
guides) before submitting photos anywhere.
