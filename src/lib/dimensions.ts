import type { Unit } from "@/types/editor";

export const MM_PER_INCH = 25.4;
/** CSS reference DPI used to map physical mm to on-screen pixels. */
export const CSS_DPI = 96;
/** Export DPI for print-ready output. */
export const PRINT_DPI = 300;

export function mmToPx(mm: number, dpi: number): number {
  return (mm / MM_PER_INCH) * dpi;
}

export function pxToMm(px: number, dpi: number): number {
  return (px / dpi) * MM_PER_INCH;
}

/** 1 point = 1/72 inch — used by the PDF generator for exact page sizes. */
export function mmToPt(mm: number): number {
  return (mm / MM_PER_INCH) * 72;
}

export function convertUnit(value: number, from: Unit, to: Unit): number {
  const toMm = (v: number): number =>
    from === "mm" ? v : from === "cm" ? v * 10 : v * MM_PER_INCH;
  const fromMm = (v: number): number =>
    to === "mm" ? v : to === "cm" ? v / 10 : v / MM_PER_INCH;
  return fromMm(toMm(value));
}

export function toMm(value: number, unit: Unit): number {
  return convertUnit(value, unit, "mm");
}

export function fromMm(valueMm: number, unit: Unit): number {
  return convertUnit(valueMm, "mm", unit);
}

export function formatNumber(value: number, maxDecimals = 1): string {
  const rounded = Number(value.toFixed(maxDecimals));
  return String(rounded);
}

export function formatMm(mm: number): string {
  return `${formatNumber(mm)} mm`;
}

/** Formats a width × height pair in the requested unit, e.g. `35 × 45 mm`. */
export function formatDimensions(
  widthMm: number,
  heightMm: number,
  unit: Unit = "mm",
  decimals = 1,
): string {
  const w = formatNumber(fromMm(widthMm, unit), decimals);
  const h = formatNumber(fromMm(heightMm, unit), decimals);
  return `${w} × ${h} ${unit}`;
}

export function formatInches(widthMm: number, heightMm: number): string {
  return `${formatNumber(widthMm / MM_PER_INCH, 2)}″ × ${formatNumber(
    heightMm / MM_PER_INCH,
    2,
  )}″`;
}

/** Human-readable pixel dimensions at a given DPI, e.g. `413 × 531 px @ 300 DPI`. */
export function formatPixels(
  widthMm: number,
  heightMm: number,
  dpi: number = PRINT_DPI,
): string {
  const w = Math.round(mmToPx(widthMm, dpi));
  const h = Math.round(mmToPx(heightMm, dpi));
  return `${w} × ${h} px @ ${dpi} DPI`;
}

export function aspectRatio(widthMm: number, heightMm: number): string {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const w = Math.round(widthMm * 100);
  const h = Math.round(heightMm * 100);
  const d = gcd(w, h) || 1;
  const rw = w / d;
  const rh = h / d;
  if (rw <= 50 && rh <= 50) return `${rw}:${rh}`;
  return formatNumber(widthMm / heightMm, 3);
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
