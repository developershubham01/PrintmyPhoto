# printmyphoto

A free, privacy-first **online passport photo maker and print studio**. Upload or snap a portrait, crop to exact international document sizes, change or remove the background, arrange multiple copies on printable paper (4×6, A4, 5×7, Letter, etc.), and download a print-ready 300 DPI **PDF, JPG, or PNG** — with **no login, no signup, no payment**, and photos that **never leave your device**.

---

## Table of Contents

- [Key Features](#key-features)
- [Design System (Alma)](#design-system-alma)
- [Complete Pages & Workflow Guide](#complete-pages--workflow-guide)
  - [1. Landing Page (`/` or `#/`)](#1-landing-page--or-)
  - [2. Passport Photo Maker & 8-Step Wizard (`#/passport-photo-maker`)](#2-passport-photo-maker--8-step-wizard-passport-photo-maker)
  - [3. Passport Photo Sizes Directory (`#/passport-photo-sizes`)](#3-passport-photo-sizes-directory-passport-photo-sizes)
  - [4. Photo Printing Guide (`#/photo-printing-guide`)](#4-photo-printing-guide-photo-printing-guide)
  - [5. How It Works (`#/how-it-works`)](#5-how-it-works-how-it-works)
  - [6. Frequently Asked Questions (`#/faq`)](#6-frequently-asked-questions-faq)
  - [7. Blog & Editorial Guides (`#/blog`)](#7-blog--editorial-guides-blog)
  - [8. Company & Trust Pages (`#/about`, `#/contact`)](#8-company--trust-pages-about-contact)
  - [9. Legal & Compliance Pages (`#/privacy-policy`, `#/terms`, `#/disclaimer`, `#/cookie-policy`)](#9-legal--compliance-pages-privacy-policy-terms-disclaimer-cookie-policy)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Image Processing & Layout Engine](#image-processing--layout-engine)
- [Routing Model](#routing-model)
- [Getting Started & Local Development](#getting-started--local-development)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Honest-Use & Government Compliance Notice](#honest-use--government-compliance-notice)

---

## Key Features

- **100% Client-Side Privacy:** All image decoding, canvas manipulation, color baking, edge-detection background removal, sheet composition, and PDF generation occur locally in the user's browser using HTML5 Canvas and Web APIs. No photo is ever uploaded to a server or stored remotely.
- **Physical Precision Layout Math:** Calculates placements in physical millimetres and typographic points ($1\text{ pt} = 1/72\text{ in}$). The exported PDF is rendered at the exact paper size and 300 DPI print resolution without scaling artifacts.
- **Customizable Backgrounds:** Adaptive multi-corner flood-fill algorithm with horizontal lighting gradient interpolation, edge feathering, and solid color replacement (White, Off-white, Light grey, Light blue, Cream, Light green, custom hex, or transparency).
- **International Size Presets:** Built-in specifications for 19+ countries (US, UK, Canada, Australia, India, Schengen, Japan, etc.) with links to official government passport agency guidelines.
- **Interactive Sheet Workspace:** Drag-and-drop photo positioning on standard paper formats with overlap protection, automatic grid alignment, 1 mm snapping, duplication, and photo removal.
- **SEO & Accessibility:** Accessible semantic HTML, JSON-LD structured data (Organization, WebSite, WebApplication, HowTo), responsive drawer navigation, and light/dark theme support.

---

## Design System (Alma)

`printmyphoto` is built upon the **Alma Design System**, prioritizing a warm, organic, editorial aesthetic:

- **Color Tokens:**
  - `--alma-aioli` (`#f7f5ed`): Warm cream background.
  - `--alma-teriyaki` (`#33140c`): Deep organic ink for high-contrast typography.
  - `--alma-collard` (`#3c5627`): Primary botanical green for buttons, badges, and accents.
  - `--alma-kiwi` (`#aadf49`): Vibrant highlight green used for success indicators and dark mode accents.
  - `--alma-yogurt` (`#fffdf5`): Elevated warm surface for cards, popovers, and footers.
  - `--alma-accent` (`#146c84`): Calming teal for links, focus rings, and section kickers.
  - `--alma-support` (`#c3d638`): Decorative lime highlights.
  - `--alma-orange` (`#f3b34f`): Citrus warm accent for badges and notice callouts.
- **Typography:**
  - **Display / Headlines:** *Fraunces Variable* (`@fontsource-variable/fraunces`) — High-contrast editorial serif.
  - **Body / Controls:** *Archivo Variable* (`@fontsource-variable/archivo`) — Grotesque sans-serif for UI clarity.
- **Radii & Shadows:** Soft organic curves (`rounded-xl` / 20px, `rounded-2xl` / 32px) and warm teriyaki-tinted shadows (`shadow-card`, `shadow-lift`, `shadow-soft`).

---

## Complete Pages & Workflow Guide

### 1. Landing Page (`/` or `#/`)
Located in [`src/components/home/HomePage.tsx`](src/components/home/HomePage.tsx).
- **Marquee Hero:** Features soft radial gradient washes (`.hero-wash`), floating UI cards (paper picker, PDF thumbnail with floating animation), and an interactive crop card mockup with live background color switching.
- **How It Works Overview:** High-level 3-step summary explaining upload, sizing, and printing.
- **Popular Sizes Quick Picker:** Fast visual access to standard formats (US 2×2", UK 35×45 mm, India, Schengen, Canada).
- **Paper Formats Grid:** Demonstrates sheet capacities across 4×6, A4, 5×7, and Letter paper.
- **Background Changer Showcase:** Interactive demonstration of solid and transparent background replacements.
- **Privacy & FAQ Teasers:** Reassurance regarding local in-browser processing and direct links into detailed guides.

---

### 2. Passport Photo Maker & 8-Step Wizard (`#/passport-photo-maker`)
The core editing studio orchestrated by [`src/components/editor/EditorShell.tsx`](src/components/editor/EditorShell.tsx) with persistent Stepper, quick tools (Undo, Redo, Reset), and step-by-step navigation.

```
Step 1: Upload ──> Step 2: Crop ──> Step 3: Background ──> Step 4: Size
      │
      └──> Step 5: Paper ──> Step 6: Arrange ──> Step 7: Preview ──> Step 8: Download
```

#### Step 1: Upload Photo ([`UploadStep.tsx`](src/components/editor/steps/UploadStep.tsx))
- **File Input Options:** Drag-and-drop box, native file picker (JPG, PNG, WebP up to 15 MB), clipboard paste (`Ctrl+V`), local webcam capture modal, or a built-in synthetic sample portrait.
- **Input Validation:** Inspects image resolution, dimensions, and file integrity before decoding to an in-memory `ImageBitmap`.
- **Quality Checklist:** Guidance on neutral facial expressions, even lighting, and plain backdrops.

#### Step 2: Crop & Adjust ([`CropperStage.tsx`](src/components/editor/CropperStage.tsx))
- **Interactive Crop Canvas:** Pan by dragging, zoom via slider/wheel/pinch (0.3× to 5×), 90-degree clockwise and counter-clockwise rotation, and fill-frame positioning.
- **Color Corrections:** Live brightness (0.5×–1.5×), contrast (0.5×–1.5×), and saturation (0×–2×) sliders with debounced rebaking.
- **Biometric Head Position Guide:** Optional overlay displaying chin, eye-level, and crown markers conforming to international ICAO / ISO standards.

#### Step 3: Background ([`BackgroundStep.tsx`](src/components/editor/steps/BackgroundStep.tsx))
- **Mode Selection:**
  - *Original:* Retains the raw photo background untouched.
  - *Color Replacement:* Solid backdrops in standard passport shades (White, Off-white, Light grey, Light blue, Cream, Light green) or any custom color via the native color picker.
  - *Transparent:* Preserves alpha transparency with a checkerboard preview indicator.
- **Edge-Detection Background Removal:** Fully client-side algorithm (`bg-removal.ts`) using adaptive corner sampling, horizontal lighting interpolation, and separable 5×5 box blur edge feathering.
- **Sensitivity Slider:** Adjustable edge tolerance (8–80) to fine-tune hair and shoulder borders.

#### Step 4: Photo Size ([`SizeStep.tsx`](src/components/editor/steps/SizeStep.tsx))
- **Searchable Country Directory:** Filterable by country name (United States, United Kingdom, India, Canada, Australia, Schengen, Japan, etc.).
- **Dimension Formats:** Instant display in mm, cm, inches, and 300 DPI pixels.
- **Official Issuing Authority Links:** Direct outbound links to state departments, passport agencies, and embassies.
- **Custom Dimensions:** Arbitrary width and height entry with unit conversion.

#### Step 5: Paper Selection ([`PaperStep.tsx`](src/components/editor/steps/PaperStep.tsx))
- **Standard Paper Formats:** 4×6 in (10×15 cm), 5×7 in (13×18 cm), A4 (210×297 mm), Letter (8.5×11 in), A5, Legal, A3, and custom dimensions.
- **Orientation Toggle:** Portrait vs. Landscape.
- **Live Fit Estimator:** Displays approximately how many copies fit based on default margins and gaps.

#### Step 6: Arrange ([`ArrangeStep.tsx`](src/components/editor/steps/ArrangeStep.tsx))
- **Two-Column Workspace:**
  - *Interactive Canvas ([`SheetWorkspace.tsx`](src/components/editor/SheetWorkspace.tsx)):* Real-time paper rendering. Supports selecting individual photos, dragging to position, 1 mm magnetic snapping, duplicating, and removing copies with automatic overlap prevention.
  - *Controls Panel:* Margin slider (0–20 mm), horizontal and vertical gap sliders (0–15 mm), column and row stepper inputs, and "Reset to grid" button.
- **Sheet Summary Card:** Live calculation of total photos placed, grid layout, paper size, margins, and printable sheet coverage percentage.

#### Step 7: Print Preview ([`PreviewStep.tsx`](src/components/editor/steps/PreviewStep.tsx))
- **True Physical Scale Simulation:** View the entire sheet with zoom controls (Fit, 50%, 75%, 100%).
- **DPI Quality Diagnostic:** Calculates effective source DPI based on the crop transform and warns if resolution is below the 300 DPI target.
- **Printer Setting Checklist:** Reminders to disable "Fit to page" and configure "Actual size / 100%".

#### Step 8: Download & Print ([`DownloadStep.tsx`](src/components/editor/steps/DownloadStep.tsx))
- **Export Options:**
  - **PDF (Recommended):** Vector-dimensioned document created via `pdf-lib` where 1 pt = 1/72 in, embedding the 300 DPI raster sheet.
  - **JPG Sheet:** 300 DPI print-ready raster image.
  - **PNG Sheet:** 300 DPI image supporting transparency.
  - **Direct Print Dialog:** Triggers native browser print dialog with pre-configured paper dimensions.
- **Pre-Submission Checklist:** Final verification of document validity rules.

---

### 3. Passport Photo Sizes Directory (`#/passport-photo-sizes`)
Located in [`src/components/pages/SizesPage.tsx`](src/components/pages/SizesPage.tsx).
- **Searchable Country Grid:** Fast search across 19+ countries and multiple document types (Passport, Visa, ID card, OCI, DV Lottery).
- **Comprehensive Size Data:** Width and height in mm and inches, pixel dimensions at 300 DPI, popular format indicators, and specific government criteria.
- **Embassy & Agency Citations:** Verified links to official issuing authorities (e.g., travel.state.gov, gov.uk, mofa.go.jp).
- **Paper Yield Table:** Displays how many photos fit per sheet across 4×6, A4, 5×7, and Letter.

---

### 4. Photo Printing Guide (`#/photo-printing-guide`)
Located in [`src/components/pages/PrintingGuidePage.tsx`](src/components/pages/PrintingGuidePage.tsx).
- **Paper Matrix & Layout Table:** Exact copy yields and printable area percentages for standard sheet sizes.
- **Printer Configuration Guide:** Explains critical print settings (e.g., selecting paper type, disabling automatic scaling, borderless printing caveats).
- **Home vs. Commercial Printing:** Compares home inkjet printers with commercial 4×6 photo kiosks (Walgreens, CVS, Boots, local photo labs).
- **Cutting & Trimming Instructions:** How to trim individual photos accurately using rulers and cutting guides.

---

### 5. How It Works (`#/how-it-works`)
Located in [`src/components/pages/HowItWorksPage.tsx`](src/components/pages/HowItWorksPage.tsx).
- **Phase 1 (Upload):** How local camera and drag-and-drop processing works in memory.
- **Phase 2 (Crop & Comply):** Applying biometric head ratios and color balancing.
- **Phase 3 (Arrangement):** Millimetre grid calculations and paper utilization.
- **Phase 4 (Export):** Generating uncompressed 300 DPI PDF and image files.

---

### 6. Frequently Asked Questions (`#/faq`)
Located in [`src/components/pages/FaqPage.tsx`](src/components/pages/FaqPage.tsx).
Grouped into four thematic accordion sections:
1. **Sizes & Dimensions:** Global standards, 2×2 inch vs. 35×45 mm formats, and custom sizes.
2. **Printing & Quality:** Maintaining 300 DPI, printer driver settings, and preventing shrinkage.
3. **Privacy & Architecture:** Clarification that photos never touch any server or cloud storage.
4. **Compliance & Acceptance:** Honest guidance regarding embassy scrutiny and official requirements.

---

### 7. Blog & Editorial Guides (`#/blog` and `#/blog/:slug`)
Located in [`src/components/pages/BlogPage.tsx`](src/components/pages/BlogPage.tsx) and [`BlogArticlePage.tsx`](src/components/pages/BlogArticlePage.tsx).
Contains 10 long-form, structured editorial articles written in `.prose-alma`:
1. *How to Print Passport Photos on 4×6 Paper at Home*
2. *Standard Passport Photo Sizes Around the World*
3. *Avoid Passport Photo Rejection: 9 Common Mistakes*
4. *Light Blue vs. White vs. Off-White Backgrounds*
5. *Printing on A4 Paper: How Many Fit and How to Cut Them*
6. *Biometric Photo Rules Explained: Eyes, Mouth, and Head Height*
7. *Smartphone Passport Photos: Lighting, Shadows, and Distance*
8. *Understanding DPI: Why 300 DPI Matters for Print*
9. *Visa Photo vs. Passport Photo: Key Differences*
10. *Cutting Passport Photos with Clean, Straight Edges*

---

### 8. Company & Trust Pages (`#/about`, `#/contact`)
- **About Us ([`AboutPage.tsx`](src/components/pages/AboutPage.tsx)):** Overview of the project's privacy-first ethos, browser-side architecture, and editorial independence.
- **Contact Us ([`ContactPage.tsx`](src/components/pages/ContactPage.tsx)):** Validated feedback form with subject routing (Feedback, Bug report, Feature request, Privacy question) and toast confirmations.

---

### 9. Legal & Compliance Pages
- **Privacy Policy ([`PrivacyPolicyPage.tsx`](src/components/pages/PrivacyPolicyPage.tsx)):** Comprehensive disclosure of zero photo retention, local `ImageBitmap` memory release, and cookie usage.
- **Terms and Conditions ([`TermsPage.tsx`](src/components/pages/TermsPage.tsx)):** Terms of use for the free utility.
- **Disclaimer ([`DisclaimerPage.tsx`](src/components/pages/DisclaimerPage.tsx)):** Explicit notice stating `printmyphoto` is not affiliated with any government office and does not guarantee official document acceptance.
- **Cookie Policy ([`CookiePolicyPage.tsx`](src/components/pages/CookiePolicyPage.tsx)):** Explains the consent-gated `pps-consent` local storage key.

---

## Architecture & Tech Stack

```
src/
├── app/                  # Next.js 16 App Router (layout, page, sitemap.ts, robots.ts, globals.css)
├── components/
│   ├── ads/              # Consent-gated Google AdSense slot components
│   ├── consent/          # Cookie banner & consent store integration
│   ├── editor/           # Photo studio wizard shell, canvas stages, and 8 step components
│   │   └── steps/        # UploadStep, CropperStage, BackgroundStep, SizeStep, PaperStep, ArrangeStep, PreviewStep, DownloadStep
│   ├── home/             # Marquee hero and editorial landing sections
│   ├── layout/           # Navbar, Footer, Logo, ThemeProvider, ThemeToggle
│   ├── pages/            # Virtual content pages (Sizes, Printing Guide, How It Works, FAQ, About, Contact, Legal)
│   ├── seo/              # JSON-LD structured data generators
│   └── ui/               # shadcn / Radix UI primitive components
├── content/blog/         # 10 original articles with structured block rendering
├── data/                 # Catalogues for passport photo sizes, paper dimensions, and FAQs
├── hooks/                # Reusable UI and viewport hooks
├── lib/
│   ├── export/           # PDF document generation (pdf-lib), rasterizer, and print triggers
│   ├── image/            # Image decoding, color adjustment baking, adaptive bg-removal, composition, quality
│   ├── store/            # Zustand stores (editor-store with undo/redo, consent-store)
│   ├── dimensions.ts     # Physical unit conversions (mm, cm, in, px, pt at specified DPI)
│   ├── layout-calculator.ts # True millimetre grid math and overlap detection
│   └── router.ts         # Hash-based routing and document metadata management
└── types/                # Domain TypeScript interfaces (adjustments, placements, dimensions, paper)
```

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) & React 19 | High-performance React rendering and Turbopack dev server |
| **Styling** | Tailwind CSS 4 & tw-animate-css | Utility-first CSS using Alma design tokens |
| **Components** | Radix UI Primitives & shadcn/ui | Accessible dialogs, sliders, accordions, and sheets |
| **State** | Zustand 5 | Reactive editor state with undo/redo history stacks |
| **PDF Generation** | `pdf-lib` | Client-side point-accurate PDF creation ($1\text{ pt} = 1/72\text{ in}$) |
| **Icons** | Lucide React | Consistent, lightweight vector iconography |
| **Notifications** | Sonner | Accessible toast notifications |

---

## Image Processing & Layout Engine

### 1. Adaptive Background Removal ([`bg-removal.ts`](src/lib/image/bg-removal.ts))
1. **Corner Sampling:** Samples top-left, top-center, and top-right regions (guaranteed backdrop in passport portraits) while excluding the bottom torso.
2. **Lighting Interpolation:** Interpolates expected backdrop color across the image width to accommodate lateral room lighting gradients.
3. **Perceptual Color Distance:** Uses human-weighted RGB Euclidean distance ($\sqrt{0.299 \Delta R^2 + 0.587 \Delta G^2 + 0.114 \Delta B^2}$).
4. **Boundary Flood-Fill:** Seeds BFS from top and upper side borders ($y \le 70\%$) with torso protection in the lower-middle zone.
5. **Separable 5×5 Box Blur Feathering:** Produces clean, anti-aliased transitions between hair/shoulders and the background.

### 2. Physical Layout Calculator ([`layout-calculator.ts`](src/lib/layout-calculator.ts))
- **Millimetre Precision:** Calculates maximum possible columns and rows given paper dimensions, margins, and horizontal/vertical gaps:
  $$\text{cols} = \left\lfloor \frac{\text{paperW} - 2 \cdot \text{margin} + \text{gapX}}{\text{photoW} + \text{gapX}} \right\rfloor$$
- **Overlap Protection:** Real-time AABB (Axis-Aligned Bounding Box) collision detection prevents dragging photos on top of one another.

### 3. Exact PDF Export ([`pdf.ts`](src/lib/export/pdf.ts))
- Creates a PDF page sized to the paper's exact physical points:
  $$\text{points} = \text{mm} \times \frac{72}{25.4}$$
- Embeds the 300 DPI raster composite at $100\%$ scale with zero re-sampling or page-fit distortions.

---

## Routing Model

`printmyphoto` is built as a **single Next.js route (`/`) with hash-based virtual routing** (`#/passport-photo-maker`, `#/passport-photo-sizes`, `#/blog/:slug`, etc.).

**Advantages:**
- Operates in sandboxed hosting environments that only expose a root index route.
- Instant, zero-latency tab and view transitions with animated page mounting.
- Pre-configured for direct migration to Next.js App Router subdirectories (`app/passport-photo-maker/page.tsx` → `<MakerPage />`) when dedicated server routes are desired.

---

## Getting Started & Local Development

### Prerequisites
- Node.js 18+ (tested on Node v20 and v24)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/printmyphoto.git
cd printmyphoto

# Install dependencies
npm install

# Start development server (Turbopack on port 3000)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server with Turbopack on port 3000 |
| `npm run build` | Builds the standalone production bundle |
| `npm run start` | Runs the production build server |
| `npm run lint` | Runs ESLint across the codebase |

---

## Environment Variables

All environment variables are optional. The studio is fully functional with none set.

```env
# Production domain URL (used for canonical URLs and JSON-LD schema)
NEXT_PUBLIC_SITE_URL=https://printmyphoto.com

# Google AdSense configuration (disabled by default until configured)
NEXT_PUBLIC_ADSENSE_ENABLED=0
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT_TOP=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_SIDE=1234567891
NEXT_PUBLIC_ADSENSE_SLOT_MID=1234567892
NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM=1234567893
```

---

## Deployment

The application can be deployed to any modern host supporting Next.js 16 (Vercel, Netlify, Cloudflare Workers via OpenNext, AWS Amplify, or Docker):

```bash
npm run build
```

The output is configured for `output: "standalone"` in [`next.config.ts`](next.config.ts), generating a lightweight Node.js server container in `.next/standalone`.

---

## Honest-Use & Government Compliance Notice

`printmyphoto` is an independent utility designed to help users prepare, format, and print photos at accurate physical dimensions. **It is not affiliated with any government agency, embassy, or passport office.**

Document standards vary significantly by country, application channel (in-person vs. online digital upload), and time. Users should always check the official government authority links provided in the [Sizes Directory](#3-passport-photo-sizes-directory-passport-photo-sizes) before submitting photos for official passports or visas.
