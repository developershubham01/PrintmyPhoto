/** Shared domain types for the Passport Photo & Print Studio. */

export type Unit = "mm" | "cm" | "in";
export type Rotation = 0 | 90 | 180 | 270;
export type Orientation = "portrait" | "landscape";

export type EditorStep =
  | "upload"
  | "edit"
  | "background"
  | "size"
  | "paper"
  | "arrange"
  | "preview"
  | "download";

export interface Adjustments {
  /** 1 = neutral. Range 0.5 – 1.5 */
  brightness: number;
  /** 1 = neutral. Range 0.5 – 1.5 */
  contrast: number;
  /** 1 = neutral. Range 0 – 2 */
  saturation: number;
}

export const NEUTRAL_ADJUSTMENTS: Adjustments = {
  brightness: 1,
  contrast: 1,
  saturation: 1,
};

export interface Transform {
  /** 1 = cover fit. Range 0.2 – 5 */
  zoom: number;
  /** Horizontal offset as a fraction of the frame width. */
  offsetX: number;
  /** Vertical offset as a fraction of the frame height. */
  offsetY: number;
  rotation: Rotation;
}

export const IDENTITY_TRANSFORM: Transform = {
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
  rotation: 0,
};

export type BackgroundMode = "original" | "color" | "transparent";

export interface BackgroundSettings {
  mode: BackgroundMode;
  /** Hex color used when mode === "color". */
  color: string;
  /** Whether automatic (approximate) background removal is applied. */
  autoRemove: boolean;
  /** Flood-fill tolerance 0–100. */
  tolerance: number;
}

export interface PhotoSizeOption {
  id: string;
  label: string;
  widthMm: number;
  heightMm: number;
  countryId: string | null;
  note?: string;
  popular?: boolean;
  custom?: boolean;
}

export interface PaperOption {
  id: string;
  label: string;
  widthMm: number;
  heightMm: number;
  popular?: boolean;
  custom?: boolean;
}

export interface LayoutSettings {
  /** Minimum page margin in mm. */
  margin: number;
  /** Horizontal gap between photos in mm. */
  gapX: number;
  /** Vertical gap between photos in mm. */
  gapY: number;
  /** Manual column override (null = automatic maximum). */
  cols: number | null;
  /** Manual row override (null = automatic maximum). */
  rows: number | null;
}

export interface Placement {
  id: string;
  /** Left edge in mm from paper left. */
  x: number;
  /** Top edge in mm from paper top. */
  y: number;
}

export interface SourceLink {
  label: string;
  url: string;
}

export interface CountryInfo {
  id: string;
  name: string;
  flag: string;
  region: string;
  sizes: PhotoSizeOption[];
  sources: SourceLink[];
  note?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface QualityReport {
  effectiveDpi: number;
  ok: boolean;
  warnings: string[];
}
