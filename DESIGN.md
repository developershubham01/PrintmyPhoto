# DESIGN.md — Alma Design System for Passport Photo & Print Studio

This document defines the design language of **Passport Photo & Print Studio**. It adapts the
supplied Alma design references into a professional photo-printing product: premium, organic,
minimalist, editorial, warm, modern, clean and trustworthy. It is the single source of truth
for visual decisions.

---

## 1. Brand personality

| Trait      | How it shows up                                                    |
| ---------- | ------------------------------------------------------------------ |
| Premium    | Generous whitespace, serif display type, soft deep shadows          |
| Organic    | Warm off-whites, botanical greens, soft rounded corners, blob washes|
| Minimalist | One idea per section, restrained color, quiet borders               |
| Editorial  | Serif headlines, article-like rhythm, numbered steps, tables        |
| Warm       | Cream/aioli backgrounds, teriyaki ink, orange accents               |
| Trustworthy| Calm teal accents, honest copy, consistent spacing, no dark patterns|

## 2. Color palette

### Core Alma tokens (defined in `src/app/globals.css`)

| Token              | Hex       | Usage                                            |
| ------------------ | --------- | ------------------------------------------------ |
| `--alma-support`   | `#c3d638` | Lime highlights, badges, small accents           |
| `--alma-orange`    | `#f3b34f` | Warm accent, warnings, illustration highlights   |
| `--alma-accent`    | `#146c84` | Links, focus, informational accents (teal-blue)  |
| `--alma-teal`      | `#61929a` | Secondary accents, scrollbars, diagrams          |
| `--alma-muted`     | `#cecca1` | Soft olive for decorative fills                  |
| `--alma-kiwi`      | `#aadf49` | Fresh green highlights, dark-mode primary        |
| `--alma-collard`   | `#3c5627` | Primary green: buttons, active states, headings  |
| `--alma-aioli`     | `#f7f5ed` | Page background (light)                          |
| `--alma-yogurt`    | `#fffdf5` | Elevated warm surface                            |
| `--alma-surface`   | `#fffefc` | Card surface                                     |
| `--alma-teriyaki`  | `#33140c` | Primary ink / text                               |
| `--alma-gray`      | `#a1a1a1` | Neutral gray for de-emphasized meta text         |

### Semantic mapping (shadcn/ui variables)

- `--background` → `#f7f5ed` (aioli), `--foreground` → `#33140c` (teriyaki)
- `--card` → `#fffefc`, `--popover` → `#fffdf5`
- `--primary` → `#3c5627` (collard) with `#fffdf5` foreground
- `--ring` → `#146c84` (accent) for visible keyboard focus
- `--destructive` → warm red `#b3402a`
- **Dark mode**: warm charcoal `#17130e` background, cream `#f3edde` ink, kiwi `#a9cc55` primary.

### Gradients

```css
/* Primary buttons (use .btn-gradient utility) */
--alma-gradient-primary: linear-gradient(135deg, #3c5627 0%, #2c471b 55%, #14684f 100%);

/* Hero / section washes (use .hero-wash utility) */
--alma-gradient-hero:
  radial-gradient(60% 60% at 20% 25%, rgb(170 223 73 / 0.35), transparent 70%),
  radial-gradient(55% 55% at 82% 18%, rgb(243 179 79 / 0.28), transparent 70%),
  radial-gradient(70% 60% at 55% 95%, rgb(97 146 154 / 0.22), transparent 72%);
```

Rules: never place green-gradient buttons next to orange CTAs in the same group; the
gradient is reserved for the single most important action per view.

## 3. Typography

| Role    | Font                          | Notes                                          |
| ------- | ----------------------------- | ---------------------------------------------- |
| Display | **Fraunces Variable** (`@fontsource-variable/fraunces`) | GT Alpina–like warm serif. Headlines h1–h4, step titles, big numbers. SemiBold 560–620 weight, tight tracking (`-0.01em`). |
| Body    | **Archivo Variable** (`@fontsource-variable/archivo`)   | HAL Four Grotesk–like grotesque. All UI + prose. 400–500 weight. |

- Base body size 15.5–16px, line-height 1.7–1.85 for prose.
- Display scale: h1 `clamp(2.5rem, 6vw, 4.25rem)`, h2 `2rem–2.5rem`, h3 `1.25–1.5rem`.
- Use `font-display` Tailwind utility (mapped to `--font-display`) for headlines.

## 4. Layout

- **Max content width:** 1200px → `.container-editorial` (adds 20px mobile / 80px desktop padding).
- **Narrow article width:** 860px → `.container-narrow` (guides, policy pages, blog).
- **Spacing scale:** 4, 8, 16, 22, 24, 32, 48, 80 px (Tailwind: 1, 2, 4, 5.5, 6, 8, 12, 20).
- **Section rhythm:** `py-12 md:py-20` between major homepage sections.
- **Footers:** root wrapper is `min-h-screen flex flex-col`, footer uses `mt-auto` so it sticks
  to the bottom on short pages and is pushed naturally on long pages.

## 5. Radius, borders, shadows

| Token          | Value | Usage                                  |
| -------------- | ----- | -------------------------------------- |
| `--radius-lg`  | 15px  | Inputs, small buttons                  |
| `--radius-xl`  | 20px  | Cards, panels (default card radius)    |
| `--radius-2xl` | 32px  | Hero cards, big editorial blocks       |

- Borders: `1px solid var(--border)` (`#e5e1cd` light, warm alpha in dark). Prefer soft borders
  over hard dividers.
- Shadows: use tokens `shadow-soft`, `shadow-card`, `shadow-lift` (warm teriyaki-tinted, never gray-black).
- Photos and paper previews always get `shadow-card` + 1px border to feel physical.

## 6. Buttons

| Variant       | Class / style                                            | Usage                       |
| ------------- | -------------------------------------------------------- | --------------------------- |
| Primary       | shadcn `Button` + `.btn-gradient`                        | One per view: Start, Download |
| Secondary     | shadcn `secondary` (olive `#efecdb`)                     | Explore, skip actions       |
| Outline       | shadcn `outline`                                         | Toolbar actions             |
| Ghost         | shadcn `ghost`                                           | Icon buttons, toolbar       |
| Destructive   | shadcn `destructive`                                     | Remove photo, reset         |

- Minimum interactive height 44px on touch targets (`h-11`).
- Radius `rounded-xl` (20px) for CTAs, `rounded-lg` (15px) for compact controls.

## 7. Components

- **Cards**: `bg-card`, `border`, `rounded-xl`/`2xl`, `shadow-card`, `p-4`–`p-6`, `gap-4`–`gap-6`.
- **Badges**: pill, `bg-secondary text-secondary-foreground`, kiwi tint for success states.
- **Stepper (editor)**: numbered serif numerals in soft circles, active = collard fill.
- **Ads (`AdSlot`)**: reserved min-height (no layout shift), dashed warm border, small
  `Advertisement` label in `muted-foreground`, never styled like a button.
- **Cookie banner**: yogurt surface, shadow-soft, bottom-fixed, safe-area padding.
- **Paper preview**: real proportions, white paper on warm background, soft drop shadow,
  mm-accurate layout.

## 8. Motion

- Framer Motion for: hero float animations, section reveals (fade+rise 12–20px, 400–600ms,
  `easeOut`), page/view transitions.
- All motion respects `prefers-reduced-motion` (global CSS override included).
- Hover: subtle lift (`-translate-y-0.5`) + shadow deepen; never bouncy on toolbars.

## 9. Iconography & illustration

- **Lucide icons** only, 1.75px stroke feel, `text-primary`/`text-alma-accent`.
- Hero product mockup is built in code (CSS/SVG), not photography, to stay crisp and honest.
- Decorative blobs use brand radial gradients with heavy blur, always behind content.

## 10. Accessibility contract

- Semantic landmarks: `header`, `nav`, `main`, `section` with labelled headings, `footer`.
- All interactive elements: visible `:focus-visible` ring (accent teal), 44px touch targets.
- Contrast: teriyaki on aioli ≈ 13:1; collard on yogurt ≥ 7:1; kiwi only on dark ink.
- Images: meaningful `alt`; decorative images `aria-hidden`.
- Dialogs: shadcn/Radix (focus trap, ESC, aria-modal).
- Toasts via `sonner` with `role="status"` behavior.

## 11. Content voice

- Confident, plain, honest. Short sentences. No hype, no fake claims.
- Always disclose: photo compliance varies by authority; background removal is approximate;
  photos are processed in-browser.
