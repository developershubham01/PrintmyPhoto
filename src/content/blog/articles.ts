/**
 * Blog content — original educational articles for the Passport Photo & Print Studio.
 *
 * Plain TypeScript data (no "use client"): imported by client components.
 * Inline links inside p / ul / callout text use the marker format
 * [label](/route) for internal hash routes and [label](https://url) for
 * external sources; the article renderer parses them into real anchors.
 */

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][]; caption?: string }
  | { type: "callout"; title: string; text: string }
  | { type: "cta" };

export interface BlogArticle {
  slug: string;
  title: string;
  description: string;
  /** ISO date, e.g. "2025-02-10". */
  date: string;
  readingMinutes: number;
  tag: "Sizes" | "Printing" | "Backgrounds" | "Guides";
  blocks: BlogBlock[];
}

export const ARTICLE_TAGS = ["All", "Sizes", "Printing", "Backgrounds", "Guides"] as const;

export const ARTICLES: BlogArticle[] = [
  {
    slug: "how-to-make-passport-size-photos-online-free",
    title: "How to Make Passport Size Photos Online for Free",
    description:
      "A complete walkthrough of the free, four-phase flow for making passport size photos in your browser — what makes a good source photo, how cropping and backgrounds work, and why browser-side tools are the privacy-safe choice.",
    date: "2025-01-10",
    readingMinutes: 3,
    tag: "Guides",
    blocks: [
      {
        type: "p",
        text: "Yes — you can make a passport-size photo online for free in about five minutes, without downloading software or paying a studio. You need a phone or digital camera, a plain wall, and a browser-based tool like the [free passport photo maker](/passport-photo-maker). This guide walks through the full flow, explains what makes a good source photo, and shows why browser-side tools are the privacy-safe choice.",
      },
      { type: "h2", text: "What does 'passport size' actually mean?" },
      {
        type: "p",
        text: "There is no single worldwide 'passport size'. Most countries use a 35×45 mm portrait, the United States uses a 2×2 inch (50.8×50.8 mm) square, and visa applications can have their own dimensions entirely. Before you start, check the exact size for your document on the [passport photo sizes reference](/passport-photo-sizes) — picking the right preset up front saves you from re-cropping later.",
      },
      { type: "h2", text: "What makes a good source photo?" },
      {
        type: "p",
        text: "The final photo can only look as good as the picture you start with. A modern smartphone is more than enough — the shooting conditions are what matter:",
      },
      {
        type: "ul",
        items: [
          "Daylight, not ceiling lights: face a window so your face is evenly lit with no harsh shadows.",
          "A plain background: stand one or two steps in front of a white or light-coloured wall.",
          "Camera at eye level: ask someone to take the photo, or prop the phone against a stack of books — selfies taken from below distort the face.",
          "Head and shoulders fully visible: leave some space around your head so the crop tool has room to work.",
          "No filters and no beauty apps: heavy retouching alters facial features and is a common rejection reason.",
          "The original camera file, not a screenshot or a compressed chat attachment — resolution matters at print size.",
        ],
      },
      { type: "h2", text: "How does the four-phase flow work?" },
      {
        type: "ol",
        items: [
          "Upload and crop — drop your photo into the [photo maker](/passport-photo-maker), choose your country's size preset and align the guide lines with your eyes and chin. The visual walkthrough lives on the [how it works](/how-it-works) page.",
          "Adjust — straighten any tilt and fine-tune brightness and contrast until the face is evenly exposed.",
          "Background — optionally remove the original background and replace it with plain white or light grey. Skip this if you already photographed against a clean wall.",
          "Arrange and export — place copies on 4×6 inch or A4 paper and download a print-ready PDF at 300 DPI, or save a single digital image.",
        ],
      },
      { type: "h2", text: "Why are browser-side tools safer for your photos?" },
      {
        type: "p",
        text: "A browser-side tool processes your image on your own device: JavaScript reads the picture into memory and every crop, adjustment and export happens locally. Nothing is uploaded, nothing is stored on a server, and closing the tab erases everything. Upload-based services, by contrast, copy your likeness onto machines you know nothing about. Browser-side processing is also faster — there is no upload wait — which is why the whole flow above takes minutes instead of a studio trip.",
      },
      { type: "h2", text: "What do you get at the end?" },
      {
        type: "p",
        text: "A correctly cropped photo at 300 DPI, laid out on your chosen paper size with cut-friendly gaps. Print it on photo paper following the [photo printing guide](/photo-printing-guide), cut along the gaps, and you have prints comparable to a photo studio's — for the price of a sheet of paper.",
      },
      {
        type: "callout",
        title: "Requirements change — verify before you print",
        text: "Every issuing authority updates its photo rules from time to time. This guide explains the general workflow; always double-check the current requirements with the official authority for your document before printing or submitting.",
      },
      { type: "cta" },
    ],
  },
  {
    slug: "indian-passport-photo-size-guide",
    title: "Indian Passport Photo Size Guide",
    description:
      "Indian passports use 35×45 mm photos, OCI cards and US visas use a 51×51 mm square, and local ID forms often want 20×25 mm stamps. Exact dimensions, pixel sizes, and how many copies fit on a sheet.",
    date: "2025-01-13",
    readingMinutes: 3,
    tag: "Sizes",
    blocks: [
      {
        type: "p",
        text: "The short answer: an Indian passport photo is 35×45 mm (3.5×4.5 cm), while OCI card and US visa applications use a 51×51 mm square photo. Stamp-size photos around 20×25 mm are common for local ID forms. Here is the full breakdown, including how many copies fit on one sheet.",
      },
      { type: "h2", text: "What is the official Indian passport photo size?" },
      {
        type: "p",
        text: "Indian passports require a 35×45 mm colour photo taken against a plain light background, and the same size is used for renewals at Passport Seva Kendras. The equivalent measurements:",
      },
      {
        type: "table",
        headers: ["Format", "Value"],
        rows: [
          ["Millimetres", "35 × 45 mm"],
          ["Centimetres", "3.5 × 4.5 cm"],
          ["Inches", "≈ 1.38 × 1.77 in"],
          ["Pixels at 300 DPI", "≈ 413 × 531 px"],
        ],
        caption: "Pixel values are rounded; the print size in millimetres is what authorities measure.",
      },
      {
        type: "p",
        text: "You can generate this exact size with the [passport photo maker](/passport-photo-maker) by choosing the India preset, or read the full country page for [Indian passport photo requirements](/passport-photo-sizes/india). The official Passport Seva portal — [passportindia.gov.in](https://www.passportindia.gov.in) — is the authoritative source for the current rules.",
      },
      { type: "h2", text: "When do you need the 51×51 mm square photo?" },
      {
        type: "p",
        text: "Two common cases need the square 51×51 mm (2×2 inch) format even in India: OCI (Overseas Citizen of India) card applications and US visa applications submitted from India. Because the shape differs from the passport's rectangle, you cannot simply trim one into the other — cutting a 35×45 mm photo down to a square chops off the top of the head or the chin. Crop each format separately from your original, and let the tool's presets do the measuring: 51 mm converts to about 602 × 602 pixels at 300 DPI.",
      },
      {
        type: "table",
        headers: ["Document", "Photo size", "Shape"],
        rows: [
          ["Indian passport", "35 × 45 mm", "Rectangle"],
          ["OCI card", "51 × 51 mm", "Square"],
          ["US visa (applied from India)", "51 × 51 mm", "Square"],
          ["Local IDs and paper forms", "≈ 20 × 25 mm (stamp)", "Small rectangle"],
        ],
      },
      { type: "h2", text: "What about stamp-size photos for local IDs?" },
      {
        type: "p",
        text: "Ration cards, school forms, library cards and similar paperwork often ask for 'stamp size' photos, typically around 20 × 25 mm or 25 × 35 mm depending on the office. These are smaller crops of the same source photograph. Because each office sets its own convention, confirm the exact size with the office asking for the photo before printing a batch.",
      },
      { type: "h2", text: "What else does a compliant Indian passport photo need?" },
      {
        type: "p",
        text: "Size is only the headline requirement. As a general rule, Indian passport photos are expected to show a neutral expression with a closed mouth, the full face centred with both edges of the face visible, and a plain light background without shadows. Glasses glare, heavy retouching and head coverings (unless worn daily for religious reasons) are the usual trouble spots. The specifics are published and revised by the authorities — treat any list, including this one, as guidance to verify rather than a legal guarantee.",
      },
      { type: "h2", text: "How many Indian passport photos fit on one sheet?" },
      {
        type: "p",
        text: "On 4×6 inch photo paper with 4 mm margins and 2 mm gaps, six 35×45 mm photos fit in a 2×3 grid. On A4 paper you fit thirty. The dedicated guides cover [printing on 4×6 paper](/blog/print-passport-photos-on-4x6-paper), [printing on A4 paper](/blog/print-passport-photos-on-a4-paper) and the arithmetic behind [how many photos fit on 4×6 paper](/blog/how-many-passport-photos-fit-on-4x6-paper).",
      },
      {
        type: "callout",
        title: "Requirements change — verify with the issuing authority",
        text: "Photo specifications are revised by the authorities from time to time. Before printing or submitting, confirm the current specification with Passport Seva or the consulate handling your application.",
      },
      { type: "cta" },
    ],
  },
  {
    slug: "print-passport-photos-on-4x6-paper",
    title: "How to Print Passport Photos on 4×6 Paper",
    description:
      "The exact workflow for printing passport photos on 4×6 inch paper: arranging the grid in the editor, exporting a print-ready PDF, the printer settings that matter (Actual size, not fit to page), and how to cut cleanly.",
    date: "2025-01-16",
    readingMinutes: 3,
    tag: "Printing",
    blocks: [
      {
        type: "p",
        text: "To print passport photos on 4×6 paper: choose the 4×6 inch paper size in the [photo maker](/passport-photo-maker), arrange the copies in a grid, export a print-ready PDF, and print at Actual size (100% scale) on photo paper. Three settings decide everything — paper size, scale and quality. Get those right and every print measures exactly 35×45 mm.",
      },
      { type: "h2", text: "Step-by-step: from photo to printed sheet" },
      {
        type: "ol",
        items: [
          "Crop your photo to the size you need — for example 35×45 mm — in the [passport photo maker](/passport-photo-maker).",
          "In the arrange step, select 4×6 inch (101.6 × 152.4 mm) as the paper size.",
          "Let the auto-arrange place as many copies as fit — six for a 35×45 mm photo — or drag them yourself. Keep the gaps between photos; they are your cutting lines.",
          "Download the sheet as a PDF. A PDF keeps its physical dimensions, so the printer knows exactly how big every photo should be.",
          "Print the PDF on 4×6 photo paper using the settings in the table below.",
        ],
      },
      {
        type: "table",
        headers: ["Setting", "Choose"],
        rows: [
          ["Paper size", "4×6 in (10 × 15 cm)"],
          ["Scale / zoom", "Actual size, 100%"],
          ["Fit to page", "Off"],
          ["Quality", "High / Best (photo)"],
          ["Paper type", "Photo paper — glossy or matte"],
        ],
        caption: "The settings that matter in your printer dialog. Everything else can stay on its default.",
      },
      { type: "h2", text: "Why does 'fit to page' ruin passport photos?" },
      {
        type: "p",
        text: "Fit-to-page and any automatic scaling enlarge the sheet slightly to fill the paper — which silently changes the size of every photo on it. A 35 mm wide photo can come out at 33 mm or 37 mm, and either can be grounds for rejection at the counter. Always print at Actual size / 100%. If your printer offers borderless printing, use it; if not, accept the small margin — never compensate by rescaling.",
      },
      { type: "h2", text: "Which paper should you use?" },
      {
        type: "ul",
        items: [
          "Glossy photo paper, 200–260 gsm, gives the standard studio look and dries fast.",
          "Matte photo paper avoids glare; most authorities accept either finish.",
          "Plain office paper is fine for a test print but too thin for a submitted photo — it bends and the surface scuffs.",
        ],
      },
      {
        type: "p",
        text: "For printers, DPI and paper in more depth, see the [photo printing guide](/photo-printing-guide). And if you are wondering exactly how many copies squeeze onto one sheet, the answer — with the arithmetic — is in [how many passport photos fit on 4×6 paper](/blog/how-many-passport-photos-fit-on-4x6-paper).",
      },
      { type: "h2", text: "How do you cut the printed photos?" },
      {
        type: "p",
        text: "Let the sheet dry for a minute, then cut along the gaps you left between the photos. A paper trimmer gives the cleanest edges; a steel ruler with a craft knife is nearly as good. Scissors work in a pinch — cut slightly inside the photo edge rather than into it, and trim off any white slivers so no print ends up smaller than specification.",
      },
      {
        type: "callout",
        title: "Check the size after printing",
        text: "Hold a ruler against the first print: 35 × 45 mm should mean 35 × 45 mm. If it is off, the culprit is almost always a scaling setting — reprint at Actual size. And as always, confirm the current photo specification with your issuing authority before submitting.",
      },
      { type: "cta" },
    ],
  },
  {
    slug: "print-passport-photos-on-a4-paper",
    title: "How to Print Passport Photos on A4 Paper",
    description:
      "A4 paper holds thirty 35×45 mm passport photos or fifteen 51×51 mm squares. Full counts for common sizes, the step-by-step printing workflow, batch tips for family renewals, and a cutting guide.",
    date: "2025-01-20",
    readingMinutes: 3,
    tag: "Printing",
    blocks: [
      {
        type: "p",
        text: "A4 paper measures 210 × 297 mm. With 4 mm page margins and 2 mm gaps you can fit thirty 35×45 mm passport photos on one sheet in a 5×6 grid — or fifteen 51×51 mm square photos in a 3×5 grid. Here are the counts for common sizes, the exact workflow, and how to cut the sheet cleanly.",
      },
      { type: "h2", text: "How many passport photos fit on A4?" },
      {
        type: "table",
        headers: ["Photo size", "Grid", "Photos per A4 sheet"],
        rows: [
          ["35 × 45 mm (India, UK, EU)", "5 × 6", "30"],
          ["51 × 51 mm / 2×2 in (OCI, US)", "3 × 5", "15"],
          ["50 × 70 mm (Canada)", "3 × 4", "12"],
          ["33 × 48 mm (China)", "5 × 5", "25"],
        ],
        caption: "Counts assume 4 mm page margins and 2 mm gaps between photos.",
      },
      {
        type: "p",
        text: "These numbers come from the same layout engine that powers the [passport photo maker](/passport-photo-maker), so arranging the sheet there reproduces exactly these counts with the gaps included.",
      },
      { type: "h2", text: "Step-by-step: printing an A4 sheet" },
      {
        type: "ol",
        items: [
          "Crop your photo to the required size in the [photo maker](/passport-photo-maker).",
          "In the arrange step, choose A4 (210 × 297 mm) as the paper size.",
          "Check the auto-arranged grid — the sheet is centred with even margins, and the gaps between photos double as cutting guides.",
          "Download the PDF and print it on A4 photo paper at Actual size / 100% scale, with fit-to-page turned off and quality set to High.",
        ],
      },
      { type: "h2", text: "Printing for the whole family" },
      {
        type: "p",
        text: "Renewing three passports at once? Prepare each person's photo separately and export one A4 sheet per person — the arranger works with one photo size per sheet, which keeps every copy identical and the cutting simple. A single A4 sheet of thirty photos is more than enough even for paperwork-hungry applications, and the leftovers are handy for the stamp-size photos local forms often ask for.",
      },
      {
        type: "p",
        text: "One more habit worth adopting: label the back of each cut photo in pencil (name and date) before the sheets get shuffled across the kitchen table. Mixed-up family members are the most common home-printing mishap, and pencil does not bleed through photo paper the way most pens do.",
      },
      { type: "h2", text: "How do you cut thirty photos without a guillotine?" },
      {
        type: "p",
        text: "Use the gaps as cutting lines. First cut the sheet into strips along the vertical gaps, then slice each strip along the horizontal gaps. A paper trimmer or guillotine makes quick work of it; a steel ruler and craft knife also give clean edges. Cut inside the gap rather than into the photo, and every print keeps its full specified dimension.",
      },
      {
        type: "p",
        text: "Printing a smaller batch instead? The [4×6 inch printing guide](/blog/print-passport-photos-on-4x6-paper) covers the standard photo-lab sheet, and the [photo printing guide](/photo-printing-guide) goes deeper on printer settings and paper choices.",
      },
      {
        type: "callout",
        title: "Requirements change — verify before you submit",
        text: "Photo sizes and finishes are set by each issuing authority and do get revised. Confirm the current specification for your document before printing the final batch.",
      },
      { type: "cta" },
    ],
  },
  {
    slug: "passport-photo-background-requirements",
    title: "Passport Photo Background Requirements Explained",
    description:
      "Why passport photos need a plain light background, which colours are typically accepted, what gets photos rejected, and how the tool's approximate background removal with its tolerance slider actually works.",
    date: "2025-01-24",
    readingMinutes: 3,
    tag: "Backgrounds",
    blocks: [
      {
        type: "p",
        text: "Most passport authorities require a plain, light background — white, off-white or light grey — with no shadows, patterns or other people visible. The rule exists because biometric software needs a clean outline of your head, and because uniform backgrounds print reliably. What exactly counts as acceptable differs by country, so treat this as the general rule and verify the details with your issuing authority.",
      },
      { type: "h2", text: "Why do passport photos need a plain background?" },
      {
        type: "p",
        text: "Two reasons. First, biometric face detection measures the distance between your eyes, the height of your head and the proportions of your face; a busy background makes the outline of the head hard to isolate and can fail automated checks. Second, the photo is reproduced inside an official document — a smooth, light background keeps the printed result clean and consistent for ten years of use.",
      },
      { type: "h2", text: "Which background colours are accepted?" },
      {
        type: "table",
        headers: ["Background", "Typical status"],
        rows: [
          ["White / off-white", "Widely accepted — the safest choice"],
          ["Light grey", "Accepted by many authorities, including the US"],
          ["Light blue / cream", "Sometimes accepted for visas and IDs — verify first"],
          ["Dark, red or bright colours", "Generally not accepted for passports"],
          ["Patterned or textured", "Not accepted"],
        ],
        caption: "Acceptance varies by authority — always verify with the official source for your document.",
      },
      {
        type: "p",
        text: "The [passport photo maker](/passport-photo-maker) can replace your background with plain white or light grey after upload, and the [sizes reference](/passport-photo-sizes) notes the typical requirement per country.",
      },
      { type: "h2", text: "What gets a photo rejected?" },
      {
        type: "ul",
        items: [
          "Shadows on the background — usually from standing too close to the wall or from overhead lighting.",
          "Visible texture: brick walls, curtains, foliage, mesh or gradient wallpaper.",
          "Other people or objects — even a hand, a chair back or a pet in the frame.",
          "Clothing the same colour as the background, which makes the shoulders disappear.",
          "Harsh facial shadows from unshielded bulbs or direct midday sun.",
        ],
      },
      { type: "h2", text: "How do you get a clean background at home?" },
      {
        type: "ul",
        items: [
          "Stand 1–2 steps in front of the wall, not against it — distance is what prevents your shadow from landing behind you.",
          "Use window light as the only source and turn off room lamps, which mix colour temperatures.",
          "Wear something that contrasts with the wall — dark clothing on a white wall, light clothing on a grey one.",
          "Check the frame edges before shooting: no door frames, plants or the corner of a sofa.",
        ],
      },
      { type: "h2", text: "How does the tool's background removal work?" },
      {
        type: "p",
        text: "The browser-based background tool performs an approximate removal: it estimates where the subject ends and the background begins, then recolours the background while keeping you untouched. A tolerance slider controls how aggressively similar-coloured pixels are treated as background. It works best when you start from a plain wall and your hair has a clear edge against it — and it is an approximation, not a studio-grade mask, so always check the result at full zoom.",
      },
      {
        type: "p",
        text: "For the practical steps, read [how to change a passport photo background](/blog/how-to-change-passport-photo-background) — including the tolerance slider and the cases where replacement is a bad idea.",
      },
      {
        type: "callout",
        title: "An approximation you should verify",
        text: "Background replacement is a convenience, not a guarantee. If the edges look rough or your authority is strict, retake the photo against a plain wall instead of fixing it in software — and confirm the current background rules with the official issuing authority before you submit.",
      },
      { type: "cta" },
    ],
  },
  {
    slug: "how-to-change-passport-photo-background",
    title: "How to Change a Passport Photo Background",
    description:
      "Step-by-step: enable background removal in the photo maker, choose white or light grey, tune the tolerance slider and check the hair edges — plus the cases where you should not replace the background at all.",
    date: "2025-01-28",
    readingMinutes: 3,
    tag: "Backgrounds",
    blocks: [
      {
        type: "p",
        text: "To change a passport photo background: enable background removal in the [passport photo maker](/passport-photo-maker), choose plain white or light grey, tune the tolerance slider until the edges look clean, then zoom in and check the hair before exporting. It takes about a minute — here is the detailed walkthrough.",
      },
      { type: "h2", text: "Step by step: replacing the background" },
      {
        type: "ol",
        items: [
          "Upload your original photo — ideally one taken against a plain wall in even light.",
          "Open the background step and switch background removal on.",
          "Pick the replacement colour: plain white is the safest choice; light grey also works for most authorities.",
          "Adjust the tolerance slider. Low tolerance keeps more of the original edge but can leave background patches; high tolerance removes more but can eat into hair.",
          "Zoom in around the hair and shoulders. If the edge looks ragged or haloed, nudge the tolerance a small step at a time.",
          "Continue to the arrange step and export your print sheet or digital file as usual.",
        ],
      },
      { type: "h2", text: "Which replacement colour should you choose?" },
      {
        type: "p",
        text: "White is the default for a reason: it is the most widely accepted passport background worldwide. Light grey is the better alternative when you wear white or very light clothing, because it keeps your shoulders visible against the background. Anything else — blue, red, gradients — risks rejection. If a form specifically asks for a coloured background, use exactly the shade the authority names and verify it in writing.",
      },
      { type: "h2", text: "When should you not replace the background?" },
      {
        type: "ul",
        items: [
          "Very curly, fuzzy or flyaway hair against a busy background — approximate edge detection struggles here and the result can look unnatural.",
          "When the original background is already plain and light — there is nothing to fix.",
          "When the authority expects an unedited photo — some visa processes say so explicitly, so verify before altering anything.",
          "When your clothing melts into the new colour — pick a different replacement shade or retake the photo in different clothes.",
        ],
      },
      { type: "h3", text: "Quick answers" },
      {
        type: "ul",
        items: [
          "Why does my hair look ragged? The tolerance is fighting the fine strands — lower it slightly, or retake the photo against a plainer wall.",
          "Does the tolerance slider reduce photo quality? No — it only decides which pixels count as background; the photo itself keeps its full resolution.",
          "Can I use any colour I like? For submissions, no: stick to white or light grey unless your authority states otherwise.",
          "Should I replace the background on every photo I take? No — if the wall behind you was already plain and light, skip the step entirely.",
        ],
      },
      {
        type: "p",
        text: "Curious why authorities care so much about the background in the first place? The explanation — biometric face detection and print consistency — is in [passport photo background requirements explained](/blog/passport-photo-background-requirements).",
      },
      {
        type: "callout",
        title: "Requirements change — verify with the issuing authority",
        text: "Background rules differ per document and get revised over time. Before submitting an edited photo, confirm that background replacement is acceptable for your specific application.",
      },
      { type: "cta" },
    ],
  },
  {
    slug: "how-many-passport-photos-fit-on-4x6-paper",
    title: "How Many Passport Photos Fit on 4×6 Paper?",
    description:
      "Six 35×45 mm passport photos fit on one 4×6 inch sheet in a 2×3 grid. Here is the arithmetic behind the number, plus counts for 51×51 mm, 25×35 mm and other photo sizes.",
    date: "2025-02-03",
    readingMinutes: 3,
    tag: "Printing",
    blocks: [
      {
        type: "p",
        text: "Six 35×45 mm passport photos fit on one 4×6 inch sheet — a 2×3 grid — with 4 mm page margins and 2 mm gaps between photos. That is the standard photo-lab layout, and it is exactly what the [passport photo maker](/passport-photo-maker) produces. Below is the arithmetic behind the number, plus the counts for other photo sizes.",
      },
      { type: "h2", text: "How is the count calculated?" },
      {
        type: "p",
        text: "4×6 inch paper is 101.6 × 152.4 mm. Subtract a 4 mm margin on each side and the printable area is 93.6 × 144.4 mm. Each column needs one photo width plus one 2 mm gap, so:",
      },
      {
        type: "ul",
        items: [
          "Columns: floor((93.6 + 2) ÷ (35 + 2)) = floor(95.6 ÷ 37) = 2",
          "Rows: floor((144.4 + 2) ÷ (45 + 2)) = floor(146.4 ÷ 47) = 3",
          "Total: 2 × 3 = 6 photos",
        ],
      },
      {
        type: "p",
        text: "The '+ gap' trick is the standard way to count a grid: n photos in a row need (n − 1) gaps between them, which is why you can add one gap back to the printable width before dividing.",
      },
      { type: "h2", text: "Counts for other photo sizes" },
      {
        type: "table",
        headers: ["Photo size", "Grid", "Photos per 4×6 sheet"],
        rows: [
          ["35 × 45 mm (India, UK, EU)", "2 × 3", "6"],
          ["25 × 35 mm (stamp size)", "3 × 3", "9"],
          ["33 × 48 mm (China)", "2 × 2", "4"],
          ["51 × 51 mm / 2×2 in (OCI, US)", "1 × 2", "2"],
          ["50 × 70 mm (Canada)", "1 × 2", "2"],
        ],
        caption: "With 4 mm margins and 2 mm gaps. Removing the gaps rarely gains a photo — the margins are what constrain the grid.",
      },
      { type: "h2", text: "What changes the count?" },
      {
        type: "ul",
        items: [
          "Margins: shrinking the page margin from 4 mm to 2 mm still fits two 35×45 mm columns — a third needs 37 × 3 = 111 mm, more than the 101.6 mm paper width.",
          "Gaps: even with zero gaps, 101.6 − 8 = 93.6 mm is not enough for three 35 mm columns (105 mm).",
          "Orientation: photos print portrait-up; rotating them sideways is not acceptable for submission prints.",
          "Larger photos: the 51×51 mm square fits only one column and two rows — two photos per sheet — which is why square formats usually make more sense on A4.",
        ],
      },
      { type: "h2", text: "Do the printed photos end up full size?" },
      {
        type: "p",
        text: "Yes, if the sheet is printed at Actual size. The grid is computed in physical millimetres, exported into a PDF with the paper's true dimensions, and the printer reproduces it 1:1 at 100% scale. The moment 'fit to page' or a zoom percentage sneaks in, every photo on the sheet grows or shrinks with it — so measure the first print with a ruler before cutting the whole batch.",
      },
      {
        type: "p",
        text: "Need a bigger batch? An A4 sheet holds thirty 35×45 mm photos — see [printing passport photos on A4](/blog/print-passport-photos-on-a4-paper). For printer settings, read [how to print passport photos on 4×6 paper](/blog/print-passport-photos-on-4x6-paper) or the general [photo printing guide](/photo-printing-guide).",
      },
      {
        type: "callout",
        title: "Print at Actual size — the count only helps if the size is right",
        text: "A full grid is useless if the printer rescales the sheet. Print the PDF at Actual size / 100% with fit-to-page off, then measure the first print to confirm. And verify the photo specification with your issuing authority before submitting.",
      },
      { type: "cta" },
    ],
  },
  {
    slug: "passport-photos-without-photoshop",
    title: "How to Make Passport Photos Without Photoshop",
    description:
      "You do not need professional software for a compliant passport photo. What a browser tool does instead of Photoshop, a side-by-side comparison, and the full mobile workflow.",
    date: "2025-02-07",
    readingMinutes: 3,
    tag: "Guides",
    blocks: [
      {
        type: "p",
        text: "You do not need Photoshop — or any paid software — to make a compliant passport photo. A free browser tool covers everything a passport photo actually requires: cropping to an exact size, light exposure fixes, a plain background and a print-ready sheet. Photoshop solves problems that passport photos simply do not have.",
      },
      { type: "h2", text: "What does a passport photo actually need?" },
      {
        type: "ul",
        items: [
          "An exact crop — 35×45 mm, 2×2 inches or whatever your authority specifies.",
          "Even lighting on the face and a plain, light background.",
          "A neutral expression, open eyes, no glare on glasses, and a recent likeness.",
          "Enough resolution for a crisp 300 DPI print.",
          "Copies arranged on standard paper for printing.",
        ],
      },
      {
        type: "p",
        text: "Notice what is missing: layers, masks, curves, plugins. Those are general-purpose editing tools; a passport photo needs a specialised pipeline — which is exactly what the [passport photo maker](/passport-photo-maker) implements. The visual walkthrough is on the [how it works](/how-it-works) page.",
      },
      { type: "h2", text: "Photoshop vs a free online tool" },
      {
        type: "table",
        headers: ["Task", "Photoshop", "Free browser tool"],
        rows: [
          ["Crop to 35×45 mm", "Set units to mm, resize the canvas by hand", "Preset — one click"],
          ["Replace the background", "Manual selection and masking skills", "One toggle, approximate removal"],
          ["Arrange a print sheet", "Build the layout yourself", "Auto-arranged with cutting gaps"],
          ["Export a print-ready PDF", "Configurable but fiddly", "One download at 300 DPI"],
          ["Cost", "Paid subscription", "Free"],
          ["Learning curve", "Hours to days", "Minutes"],
        ],
      },
      { type: "h2", text: "What does the browser tool do, end to end?" },
      {
        type: "p",
        text: "Upload, crop to a country preset, straighten and adjust brightness, optionally replace the background, then arrange copies on 4×6 or A4 and download a print-ready PDF. The whole flow runs in your browser — the photo is never uploaded to a server — and the five-minute version of this workflow is in [how to make passport size photos online for free](/blog/how-to-make-passport-size-photos-online-free).",
      },
      { type: "h2", text: "Can you do all of this on a phone?" },
      {
        type: "p",
        text: "Yes. Shoot the photo with the default camera app (no beauty filters), open the maker in the mobile browser, and follow the same steps. Cropping, the tolerance slider and the PDF export are all built for touch, so you can go from sofa to printable sheet without a computer. For the printing half — paper, settings and cutting — follow the [photo printing guide](/photo-printing-guide).",
      },
      { type: "h2", text: "When is Photoshop still worth it?" },
      {
        type: "p",
        text: "For what it was built for: creative retouching, compositing, print production. If you already know it and pay for it, nothing stops you from preparing passport photos with it — but you will be doing by hand what a specialised tool does in one click, and manual measuring is exactly where size mistakes creep in. For the narrow job of producing a compliant photo and a print sheet, a purpose-built tool is simply the faster and cheaper route.",
      },
      {
        type: "callout",
        title: "Convenience is not a compliance guarantee",
        text: "A tool can produce a technically perfect print, but the rules are set by your issuing authority. Verify the current photo specification for your document before submitting.",
      },
      { type: "cta" },
    ],
  },
  {
    slug: "passport-photo-dimensions-by-country",
    title: "Passport Photo Dimensions in Different Countries",
    description:
      "There is no single worldwide passport photo size. A reference table for the US, UK, India, Canada, Australia, Schengen visas, China, Japan, Malaysia, the UAE and Russia — with links to per-country details.",
    date: "2025-02-13",
    readingMinutes: 3,
    tag: "Sizes",
    blocks: [
      {
        type: "p",
        text: "There is no single worldwide passport photo size. The most common is 35×45 mm, used everywhere from the UK to Australia, while the United States and Canada hold on to their own formats. The table below lists the dimensions most often asked about — always verify with the official issuing authority, because requirements do change.",
      },
      { type: "h2", text: "Passport photo sizes by country" },
      {
        type: "table",
        headers: ["Country / document", "Photo size", "Notes"],
        rows: [
          ["United States (passport)", "2 × 2 in (50.8 × 50.8 mm)", "Square — verify with the U.S. Department of State"],
          ["United Kingdom (passport)", "35 × 45 mm", "Verify with HM Passport Office"],
          ["India (passport)", "35 × 45 mm", "51 × 51 mm square for OCI and US visas — see [passportindia.gov.in](https://www.passportindia.gov.in)"],
          ["Canada (passport)", "50 × 70 mm", "Verify with Immigration, Refugees and Citizenship Canada"],
          ["Australia (passport)", "35 × 45 mm", "Verify with the Australian Passport Office"],
          ["Schengen / EU visa", "35 × 45 mm", "Common visa format — verify with the consulate you apply to"],
          ["China (passport / visa)", "33 × 48 mm", "Verify with the Chinese embassy or consulate"],
          ["Japan (passport)", "35 × 45 mm", "Verify with the Ministry of Foreign Affairs"],
          ["Malaysia (passport)", "35 × 50 mm", "Verify with the Immigration Department"],
          ["United Arab Emirates", "43 × 55 mm", "Verify with the federal issuing authority"],
          ["Russia (passport)", "35 × 45 mm", "Verify with the issuing authority"],
        ],
        caption: "Commonly published dimensions, not a guarantee — each issuing authority defines and revises its own specification.",
      },
      { type: "h2", text: "Why is there no single international standard?" },
      {
        type: "p",
        text: "ICAO — the UN agency that sets travel-document standards — publishes guidance on biometric portraits (face height, neutral expression, plain background), but the exact physical dimensions are left to each issuing state. That is why 35×45 mm dominates yet never became universal: legacy formats, local printing conventions and institutional inertia keep the outliers alive. The practical consequence: always pick the size for the specific document you are applying for, not the 'most common' one.",
      },
      { type: "h2", text: "What about pixel sizes and DPI?" },
      {
        type: "p",
        text: "Physical millimetres are what authorities check, but digital submissions are sometimes requested in pixels. The conversion is straightforward: pixels = millimetres ÷ 25.4 × DPI. At 300 DPI — the print quality everything here targets — that gives:",
      },
      {
        type: "table",
        headers: ["Photo size", "Pixels at 300 DPI"],
        rows: [
          ["35 × 45 mm", "≈ 413 × 531 px"],
          ["51 × 51 mm / 2 × 2 in", "≈ 602 × 602 px"],
          ["33 × 48 mm", "≈ 390 × 567 px"],
          ["50 × 70 mm", "≈ 591 × 827 px"],
        ],
        caption: "Rounded to the nearest pixel. Any modern phone camera comfortably exceeds these sizes.",
      },
      { type: "h2", text: "Find your country's size in the tool" },
      {
        type: "p",
        text: "The [passport photo maker](/passport-photo-maker) ships with presets for all the countries above, and the [sizes reference](/passport-photo-sizes) lists millimetre, centimetre, inch and 300 DPI pixel values per country. Direct links:",
      },
      {
        type: "ul",
        items: [
          "[United States passport photo size](/passport-photo-sizes/united-states)",
          "[United Kingdom passport photo size](/passport-photo-sizes/united-kingdom)",
          "[India passport photo size](/passport-photo-sizes/india)",
          "[Canada passport photo size](/passport-photo-sizes/canada)",
          "[Australia passport photo size](/passport-photo-sizes/australia)",
          "[Schengen / EU visa photo size](/passport-photo-sizes/schengen-eu)",
          "[China passport photo size](/passport-photo-sizes/china)",
          "[Japan passport photo size](/passport-photo-sizes/japan)",
        ],
      },
      {
        type: "callout",
        title: "Sizes change — verify before printing",
        text: "This table reflects commonly published dimensions. Photo requirements are set and revised by each issuing authority; confirm the current specification before you print or submit.",
      },
      { type: "cta" },
    ],
  },
  {
    slug: "common-passport-photo-mistakes",
    title: "10 Common Passport Photo Mistakes (and How to Avoid Them)",
    description:
      "Wrong size, head position, shadows, busy backgrounds, old photos, glasses glare, smiling, low resolution, fit-to-page printing and bad cutting — the ten rejections reasons, each with the fix.",
    date: "2025-02-20",
    readingMinutes: 3,
    tag: "Guides",
    blocks: [
      {
        type: "p",
        text: "Most rejected passport photos fail for the same ten reasons — and every one of them is avoidable at home. Here is the full list, why each item matters, and the fix.",
      },
      { type: "h2", text: "The 10 most common mistakes" },
      {
        type: "ol",
        items: [
          "Wrong photo size. Each authority specifies exact dimensions — 35×45 mm for India and the UK, 2×2 inches for the US — and a mismatch is an automatic rejection. Pick your country's preset in the [passport photo maker](/passport-photo-maker) instead of guessing.",
          "Head too small or too large. Biometric checks measure the head as a share of the photo height; a head that fills the frame or floats in it fails. Use the crop guides to place the top of the head and the chin on the marked lines.",
          "Shadows on the face or background. Overhead bulbs and direct sun throw shadows that automated checks read as defects. Face a window and keep the wall a couple of steps behind you.",
          "Busy or patterned background. Brick, foliage and curtains make the head outline hard to isolate. Retake against a plain wall, or use the approximate [background replacement](/blog/passport-photo-background-requirements) — after confirming it is acceptable for your authority.",
          "An old photo. 'Recent' normally means taken within the last six months, because the photo must match your current face. Retake it — do not dig out a decade-old favourite.",
          "Glare on glasses. Lens reflections can hide your eyes entirely. Tilt the glasses slightly, turn off the flash, or remove the glasses if your authority allows.",
          "Smiling or expressive face. A neutral expression with a closed mouth and open eyes is the requirement almost everywhere — grins, frowns and raised eyebrows all cause trouble.",
          "Low resolution. A screenshot or a compressed chat download turns into a blurry print at 300 DPI. Always start from the original camera file.",
          "Printing with 'fit to page'. Fit-to-page rescales the sheet and silently changes every photo's size by a few millimetres — enough for rejection. Print at Actual size / 100% as shown in the [4×6 printing guide](/blog/print-passport-photos-on-4x6-paper).",
          "Cutting badly. Crooked scissor work that slices into the photo leaves a print smaller than specification. Cut along the gaps with a trimmer or a ruler and craft knife — the [A4 printing guide](/blog/print-passport-photos-on-a4-paper) shows how.",
        ],
      },
      { type: "h2", text: "What happens if your photo is rejected?" },
      {
        type: "p",
        text: "Usually nothing dramatic: the application is put on hold until you supply a compliant photo, which costs you days or weeks of waiting while the paperwork sits in a queue. That delay is the real price of a rejected photo — and the reason this checklist exists. Ten minutes of care at home beats a month of waiting.",
      },
      { type: "h2", text: "Final checklist before you print" },
      {
        type: "ul",
        items: [
          "Size matches the official requirement for your document — verified with the issuing authority.",
          "Head centred, eyes level, neutral expression, mouth closed.",
          "Plain, light background with no shadows, objects or other people.",
          "Photo taken within the last six months, at full camera resolution.",
          "Printed at Actual size on photo paper and cut along the gaps.",
        ],
      },
      {
        type: "p",
        text: "More answers live on the [FAQ page](/faq), and the [photo printing guide](/photo-printing-guide) covers paper and printer settings in depth.",
      },
      {
        type: "callout",
        title: "Requirements change — verify before you submit",
        text: "These are the commonly observed rejection reasons, not official rules. The specification that counts is the one published by the authority issuing your document.",
      },
      { type: "cta" },
    ],
  },
];

export function getArticle(slug?: string): BlogArticle | undefined {
  if (!slug) return undefined;
  return ARTICLES.find((article) => article.slug === slug);
}

/** Same-tag articles first (newest first), then the rest — capped at `count`. */
export function relatedArticles(slug: string, count = 3): BlogArticle[] {
  const current = ARTICLES.find((article) => article.slug === slug);
  const others = ARTICLES.filter((article) => article.slug !== slug).sort((a, b) =>
    b.date.localeCompare(a.date),
  );
  if (!current) return others.slice(0, count);
  const sameTag = others.filter((article) => article.tag === current.tag);
  const rest = others.filter((article) => article.tag !== current.tag);
  return [...sameTag, ...rest].slice(0, count);
}
