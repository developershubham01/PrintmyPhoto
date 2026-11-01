import type { FaqItem } from "@/types/editor";

/** Frequently asked questions — short, direct answers (AEO) followed by context. */
export const FAQS: FaqItem[] = [
  {
    question: "How do I make a passport-size photo online for free?",
    answer:
      "Upload a photo, crop it to your country's size, adjust the background if needed, then download a print-ready PDF or image sheet. This tool is completely free, needs no account, and processes your photo locally in your browser.",
  },
  {
    question: "What is the standard passport photo size?",
    answer:
      "There is no single worldwide standard. The most common international size is 35 × 45 mm, while the United States uses a 2 × 2 inch (51 × 51 mm) square and Canada uses 50 × 70 mm. Always verify the exact size with the issuing authority of your document.",
  },
  {
    question: "How many passport photos fit on a 4×6 inch paper?",
    answer:
      "For 35 × 45 mm photos, a 4 × 6 inch (101.6 × 152.4 mm) sheet fits 6 photos in a 2 × 3 grid with typical margins and gaps. Use the arrangement calculator in the editor to get the exact count for your size, margins and spacing.",
  },
  {
    question: "How many passport photos fit on A4 paper?",
    answer:
      "For 35 × 45 mm photos with small margins and gaps, an A4 sheet (210 × 297 mm) fits around 30–32 photos in a 5 × 6 or 5 × 7 grid. The exact number depends on your margin and spacing settings.",
  },
  {
    question: "Is my photo uploaded to a server?",
    answer:
      "No. Your photo is processed locally in your browser using HTML5 Canvas. It is never uploaded, stored or shared. Closing or resetting the editor removes it from memory.",
  },
  {
    question: "Can I change the background of my passport photo?",
    answer:
      "Yes. The editor includes an approximate automatic background removal that works best on plain, evenly lit backgrounds. After removal you can place the photo on white, light grey, light blue, cream or any custom color. Results are approximate — check your document's rules before submitting.",
  },
  {
    question: "What resolution is the downloaded file?",
    answer:
      "Downloaded PDFs, JPG and PNG sheets are rendered at 300 DPI — the standard quality for photo printing. Your source photo needs enough resolution for sharp results; the editor warns you if the effective resolution is low.",
  },
  {
    question: "How do I print the sheet at the correct size?",
    answer:
      "Open the downloaded PDF, select your paper size in the print dialog, set scaling to “Actual size” / 100%, and disable “Fit to page” or “Shrink to fit”. Then print on glossy or matte photo paper for best results.",
  },
  {
    question: "Does this tool guarantee my photo will be accepted?",
    answer:
      "No. Requirements vary by country, document type and application channel, and they change over time. Use official government guidance to verify size, background, head position and recency rules before submitting any photo.",
  },
  {
    question: "Is it really free — do I need to sign up?",
    answer:
      "Yes, it is free and there is no login, signup or payment. No account is needed to create, arrange, download or print your photos.",
  },
  {
    question: "Which photo formats can I upload?",
    answer:
      "JPG/JPEG, PNG and WebP files up to 15 MB. On supported devices you can also capture a photo directly with your camera.",
  },
  {
    question: "Can I use this on my phone?",
    answer:
      "Yes. The editor is fully responsive and touch-friendly — you can upload, crop, arrange and download from any modern mobile browser.",
  },
];
