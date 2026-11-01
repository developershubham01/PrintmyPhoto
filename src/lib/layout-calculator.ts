import type { LayoutSettings, Placement } from "@/types/editor";

/**
 * Layout calculator — all math is done in physical millimetres, never CSS pixels.
 *
 * Coordinate system: origin (0,0) is the top-left corner of the paper.
 * A placement stores the top-left corner of a photo in mm.
 */

const EPS = 1e-6;

export interface GridSpec {
  paperW: number;
  paperH: number;
  photoW: number;
  photoH: number;
  /** Minimum page margin in mm. */
  margin: number;
  gapX: number;
  gapY: number;
  /** Manual column/row overrides (null = automatic maximum). */
  cols?: number | null;
  rows?: number | null;
}

export interface GridResult {
  cols: number;
  rows: number;
  /** Maximum columns/rows that physically fit with the given margin + gaps. */
  maxCols: number;
  maxRows: number;
  placements: Placement[];
  /** Grid bounds in mm (useful for guides + stats). */
  gridW: number;
  gridH: number;
  startX: number;
  startY: number;
  /** False when the photo cannot fit on the paper at all. */
  fits: boolean;
  reason?: string;
}

export function makeId(counter: number): string {
  return `p${counter.toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

/** Maximum columns/rows that fit inside the content area (paper minus margins). */
export function maxGrid(spec: Omit<GridSpec, "cols" | "rows">): {
  maxCols: number;
  maxRows: number;
} {
  const contentW = spec.paperW - 2 * spec.margin;
  const contentH = spec.paperH - 2 * spec.margin;
  const usableCols = Math.max(0, contentW + spec.gapX);
  const usableRows = Math.max(0, contentH + spec.gapY);
  const maxCols = Math.max(1, Math.floor(usableCols / (spec.photoW + spec.gapX) + EPS));
  const maxRows = Math.max(1, Math.floor(usableRows / (spec.photoH + spec.gapY) + EPS));
  return { maxCols, maxRows };
}

/**
 * Computes a centered grid of placements.
 * Photos that cannot fit are never emitted — the grid is always within paper bounds.
 */
export function computeGrid(spec: GridSpec): GridResult {
  const { paperW, paperH, photoW, photoH, margin, gapX, gapY } = spec;

  if (photoW <= 0 || photoH <= 0) {
    return empty(spec, "Photo size must be greater than zero.");
  }
  if (photoW > paperW || photoH > paperH) {
    return empty(spec, "The photo is larger than the paper.");
  }
  // If margins make the content area smaller than one photo, fall back to the
  // tightest possible margin so at least one photo fits.
  let m = margin;
  const minMargin = Math.min(margin, Math.max(0, (Math.min(paperW, paperH) - 1) / 2));
  if (photoW + 2 * m > paperW || photoH + 2 * m > paperH) {
    m = Math.max(0, minMargin);
  }

  const { maxCols, maxRows } = maxGrid({ ...spec, margin: m });
  const cols = Math.min(Math.max(1, spec.cols ?? maxCols), maxCols);
  const rows = Math.min(Math.max(1, spec.rows ?? maxRows), maxRows);

  const gridW = cols * photoW + (cols - 1) * gapX;
  const gridH = rows * photoH + (rows - 1) * gapY;

  // If the grid overflows the paper (possible with large manual gaps), reduce gaps.
  const effectiveGapX = gridW > paperW ? Math.max(0, (paperW - cols * photoW) / (cols - 1 || 1)) : gapX;
  const effectiveGapY = gridH > paperH ? Math.max(0, (paperH - rows * photoH) / (rows - 1 || 1)) : gapY;
  const finalW = cols * photoW + (cols - 1) * effectiveGapX;
  const finalH = rows * photoH + (rows - 1) * effectiveGapY;

  // Center the grid inside the content box, clamped to paper.
  const contentStartX = m;
  const contentStartY = m;
  let startX = contentStartX + Math.max(0, (paperW - 2 * m - finalW) / 2);
  let startY = contentStartY + Math.max(0, (paperH - 2 * m - finalH) / 2);
  startX = Math.min(Math.max(0, startX), Math.max(0, paperW - finalW));
  startY = Math.min(Math.max(0, startY), Math.max(0, paperH - finalH));

  const placements: Placement[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      placements.push({
        id: `g${r}-${c}`,
        x: round3(startX + c * (photoW + effectiveGapX)),
        y: round3(startY + r * (photoH + effectiveGapY)),
      });
    }
  }

  return {
    cols,
    rows,
    maxCols,
    maxRows,
    placements,
    gridW: round3(finalW),
    gridH: round3(finalH),
    startX: round3(startX),
    startY: round3(startY),
    fits: true,
  };
}

function empty(spec: GridSpec, reason: string): GridResult {
  return {
    cols: 0,
    rows: 0,
    maxCols: 0,
    maxRows: 0,
    placements: [],
    gridW: 0,
    gridH: 0,
    startX: 0,
    startY: 0,
    fits: false,
    reason,
  };
}

/** Clamps a placement so the photo stays fully inside the paper. */
export function clampToPaper(
  x: number,
  y: number,
  paperW: number,
  paperH: number,
  photoW: number,
  photoH: number,
): { x: number; y: number } {
  return {
    x: round3(Math.min(Math.max(0, x), Math.max(0, paperW - photoW))),
    y: round3(Math.min(Math.max(0, y), Math.max(0, paperH - photoH))),
  };
}

/** Axis-aligned overlap test with a small tolerance (mm). */
export function placementsOverlap(
  a: Placement,
  b: Placement,
  photoW: number,
  photoH: number,
  tolerance = 0.05,
): boolean {
  return (
    a.x < b.x + photoW - tolerance &&
    b.x < a.x + photoW - tolerance &&
    a.y < b.y + photoH - tolerance &&
    b.y < a.y + photoH - tolerance
  );
}

/** Finds the first placement in `others` that overlaps `p` (ignoring `excludeId`). */
export function findOverlap(
  p: Placement,
  others: Placement[],
  photoW: number,
  photoH: number,
  excludeId?: string,
): Placement | undefined {
  return others.find(
    (o) => o.id !== excludeId && placementsOverlap(p, o, photoW, photoH),
  );
}

/** Snaps a position to the nearest multiple of `step` mm. */
export function snap(value: number, step: number): number {
  return round3(Math.round(value / step) * step);
}

export function round3(value: number): number {
  return Math.round(value * 1000) / 1000;
}

export interface SheetStats {
  count: number;
  coverage: number;
  usedAreaMm2: number;
  paperAreaMm2: number;
}

export function sheetStats(
  placements: Placement[],
  photoW: number,
  photoH: number,
  paperW: number,
  paperH: number,
): SheetStats {
  const used = placements.length * photoW * photoH;
  const total = paperW * paperH;
  return {
    count: placements.length,
    usedAreaMm2: round3(used),
    paperAreaMm2: round3(total),
    coverage: total > 0 ? Math.round((used / total) * 100) : 0,
  };
}
