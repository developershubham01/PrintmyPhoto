import type { PaperOption } from "@/types/editor";

/** Physical paper catalogue — dimensions are exact, in millimetres. */
export const PAPER_SIZES: PaperOption[] = [
  { id: "4x6", label: "4 × 6 in", widthMm: 101.6, heightMm: 152.4, popular: true },
  { id: "5x7", label: "5 × 7 in", widthMm: 127, heightMm: 177.8, popular: true },
  { id: "a4", label: "A4", widthMm: 210, heightMm: 297, popular: true },
  { id: "a5", label: "A5", widthMm: 148, heightMm: 210 },
  { id: "letter", label: "US Letter", widthMm: 215.9, heightMm: 279.4, popular: true },
  { id: "legal", label: "US Legal", widthMm: 215.9, heightMm: 355.6 },
  { id: "a3", label: "A3", widthMm: 297, heightMm: 420 },
];

export function findPaper(id: string): PaperOption | undefined {
  return PAPER_SIZES.find((p) => p.id === id);
}

export const DEFAULT_PAPER: PaperOption = PAPER_SIZES[0]; // 4 × 6 in
