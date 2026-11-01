"use client";

import { create } from "zustand";
import {
  IDENTITY_TRANSFORM,
  NEUTRAL_ADJUSTMENTS,
  type Adjustments,
  type BackgroundSettings,
  type EditorStep,
  type Orientation,
  type Placement,
  type Transform,
} from "@/types/editor";
import { DEFAULT_SIZE } from "@/data/passport-sizes";
import type { PhotoSizeOption } from "@/types/editor";
import { DEFAULT_PAPER } from "@/data/paper-sizes";
import { bakeAdjustments, PREVIEW_MAX_DIM, BAKE_MAX_DIM } from "@/lib/image/bake";
import { decodeImageFile, validateImageFile } from "@/lib/image/validate";
import { canvasToFile, createSamplePhoto } from "@/lib/image/sample";
import {
  clampToPaper,
  computeGrid,
  findOverlap,
  makeId,
  round3,
} from "@/lib/layout-calculator";
import { trackEvent } from "@/lib/analytics";

export interface EditorPhotoSize {
  widthMm: number;
  heightMm: number;
  label: string;
  countryId: string | null;
  id: string;
  note?: string;
}

export interface EditorPaper {
  id: string;
  label: string;
  widthMm: number;
  heightMm: number;
  custom?: boolean;
}

export interface LayoutSettingsLike {
  margin: number;
  gapX: number;
  gapY: number;
  cols: number | null;
  rows: number | null;
}

export interface Snapshot {
  transform: Transform;
  adjustments: Adjustments;
  bg: BackgroundSettings;
  photoSize: EditorPhotoSize;
  paper: EditorPaper;
  orientation: Orientation;
  layout: LayoutSettingsLike;
  placements: Placement[];
}

export type { EditorStep };

export const DEFAULT_LAYOUT: LayoutSettingsLike = {
  margin: 4,
  gapX: 2,
  gapY: 2,
  cols: null,
  rows: null,
};

export const DEFAULT_BG: BackgroundSettings = {
  mode: "original",
  color: "#ffffff",
  autoRemove: false,
  tolerance: 32,
};

interface EditorState {
  step: EditorStep;
  sourceBitmap: ImageBitmap | null;
  sourceMeta: { name: string; sizeBytes: number; type: string } | null;
  previewBaked: HTMLCanvasElement | null;
  bakedVersion: number;
  transform: Transform;
  adjustments: Adjustments;
  bg: BackgroundSettings;
  photoSize: EditorPhotoSize;
  paper: EditorPaper;
  orientation: Orientation;
  layout: LayoutSettingsLike;
  placements: Placement[];
  selectedId: string | null;
  faceGuide: boolean;
  isProcessing: boolean;
  processingLabel: string;
  history: { past: Snapshot[]; future: Snapshot[] };

  // Navigation
  setStep: (step: EditorStep) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Source image
  loadImage: (file: File) => Promise<void>;
  loadSample: () => Promise<void>;
  clearImage: () => void;

  // Editing
  setTransform: (partial: Partial<Transform>) => void;
  commitTransform: () => void;
  rotate: (dir: "left" | "right") => void;
  resetEdits: () => void;
  setAdjustments: (partial: Partial<Adjustments>) => void;
  rebake: () => void;
  ensureExportBaked: () => HTMLCanvasElement | null;
  setFaceGuide: (on: boolean) => void;

  // Background
  setBg: (partial: Partial<BackgroundSettings>) => void;

  // Size / paper / layout
  setPhotoSize: (option: PhotoSizeOption) => void;
  setCustomPhotoSize: (widthMm: number, heightMm: number, unitLabel: string) => void;
  setPaper: (paper: EditorPaper) => void;
  setOrientation: (o: Orientation) => void;
  setLayout: (partial: Partial<LayoutSettingsLike>) => void;
  autoArrange: () => void;

  // Placements
  updatePlacement: (id: string, x: number, y: number) => void;
  commitPlacement: (id: string, x: number, y: number) => boolean;
  duplicatePlacement: (id: string) => boolean;
  removePlacement: (id: string) => void;
  selectPlacement: (id: string | null) => void;

  // History / reset
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  resetAll: () => void;
  setProcessing: (on: boolean, label?: string) => void;
}

const STEP_ORDER: EditorStep[] = [
  "upload",
  "edit",
  "background",
  "size",
  "paper",
  "arrange",
  "preview",
  "download",
];

function snapshotOf(s: EditorState): Snapshot {
  return {
    transform: { ...s.transform },
    adjustments: { ...s.adjustments },
    bg: { ...s.bg },
    photoSize: { ...s.photoSize },
    paper: { ...s.paper },
    orientation: s.orientation,
    layout: { ...s.layout },
    placements: s.placements.map((p) => ({ ...p })),
  };
}

/** Applies orientation to base paper dims (base dims stored as portrait). */
export function orientedPaper(paper: EditorPaper, orientation: Orientation) {
  const short = Math.min(paper.widthMm, paper.heightMm);
  const long = Math.max(paper.widthMm, paper.heightMm);
  return orientation === "portrait"
    ? { paperW: short, paperH: long }
    : { paperW: long, paperH: short };
}

export const useEditorStore = create<EditorState>((set, get) => ({
  step: "upload",
  sourceBitmap: null,
  sourceMeta: null,
  previewBaked: null,
  bakedVersion: 0,
  transform: { ...IDENTITY_TRANSFORM },
  adjustments: { ...NEUTRAL_ADJUSTMENTS },
  bg: { ...DEFAULT_BG },
  photoSize: {
    widthMm: DEFAULT_SIZE.widthMm,
    heightMm: DEFAULT_SIZE.heightMm,
    label: DEFAULT_SIZE.label,
    countryId: DEFAULT_SIZE.countryId,
    id: DEFAULT_SIZE.id,
    note: DEFAULT_SIZE.note,
  },
  paper: {
    id: DEFAULT_PAPER.id,
    label: DEFAULT_PAPER.label,
    widthMm: DEFAULT_PAPER.widthMm,
    heightMm: DEFAULT_PAPER.heightMm,
  },
  orientation: "portrait",
  layout: { ...DEFAULT_LAYOUT },
  placements: [],
  selectedId: null,
  faceGuide: true,
  isProcessing: false,
  processingLabel: "",
  history: { past: [], future: [] },

  setStep: (step) => {
    const s = get();
    if (step !== "upload" && !s.sourceBitmap) return;
    if (["arrange", "preview", "download"].includes(step) && s.placements.length === 0) {
      return;
    }
    set({ step });
    if (step === "upload") trackEvent("editor_opened");
  },

  nextStep: () => {
    const idx = STEP_ORDER.indexOf(get().step);
    if (idx < STEP_ORDER.length - 1) get().setStep(STEP_ORDER[idx + 1]);
  },

  prevStep: () => {
    const idx = STEP_ORDER.indexOf(get().step);
    if (idx > 0) set({ step: STEP_ORDER[idx - 1] });
  },

  loadImage: async (file) => {
    const validation = validateImageFile(file);
    if (!validation.ok) throw new Error(validation.reason);
    get().setProcessing(true, "Loading photo…");
    try {
      const bitmap = await decodeImageFile(file);
      const prev = get().sourceBitmap;
      prev?.close();
      set({
        sourceBitmap: bitmap,
        sourceMeta: { name: file.name, sizeBytes: file.size, type: file.type || "image" },
        transform: { ...IDENTITY_TRANSFORM },
        placements: [],
        selectedId: null,
        step: "edit",
      });
      get().rebake();
      trackEvent("photo_uploaded", { kind: "file" });
    } finally {
      get().setProcessing(false);
    }
  },

  loadSample: async () => {
    get().setProcessing(true, "Preparing sample photo…");
    try {
      const canvas = createSamplePhoto();
      const file = await canvasToFile(canvas);
      const bitmap = await decodeImageFile(file);
      const prev = get().sourceBitmap;
      prev?.close();
      set({
        sourceBitmap: bitmap,
        sourceMeta: { name: "Sample portrait", sizeBytes: file.size, type: "image/png" },
        transform: { ...IDENTITY_TRANSFORM },
        placements: [],
        selectedId: null,
        step: "edit",
      });
      get().rebake();
      trackEvent("sample_used");
    } finally {
      get().setProcessing(false);
    }
  },

  clearImage: () => {
    const prev = get().sourceBitmap;
    prev?.close();
    set({
      sourceBitmap: null,
      sourceMeta: null,
      previewBaked: null,
      transform: { ...IDENTITY_TRANSFORM },
      placements: [],
      selectedId: null,
      step: "upload",
    });
  },

  setTransform: (partial) => set((s) => ({ transform: { ...s.transform, ...partial } })),

  commitTransform: () => get().pushHistory(),

  rotate: (dir) => {
    const s = get();
    const next = (((s.transform.rotation + (dir === "right" ? 90 : 270)) % 360) as Transform["rotation"]);
    set({ transform: { ...s.transform, rotation: next, offsetX: 0, offsetY: 0 } });
    s.pushHistory();
  },

  resetEdits: () => {
    set({ transform: { ...IDENTITY_TRANSFORM }, adjustments: { ...NEUTRAL_ADJUSTMENTS } });
    get().pushHistory();
    get().rebake();
  },

  setAdjustments: (partial) => set((s) => ({ adjustments: { ...s.adjustments, ...partial } })),

  rebake: () => {
    const s = get();
    if (!s.sourceBitmap) return;
    const baked = bakeAdjustments(s.sourceBitmap, s.adjustments, PREVIEW_MAX_DIM);
    set((st) => ({ previewBaked: baked, bakedVersion: st.bakedVersion + 1 }));
  },

  ensureExportBaked: () => {
    const s = get();
    if (!s.sourceBitmap) return null;
    return bakeAdjustments(s.sourceBitmap, s.adjustments, BAKE_MAX_DIM);
  },

  setFaceGuide: (on) => set({ faceGuide: on }),

  setBg: (partial) => {
    set((s) => ({ bg: { ...s.bg, ...partial } }));
    if (partial.mode || partial.autoRemove === true || partial.color) {
      trackEvent("background_changed", { mode: partial.mode ?? "" });
    }
  },

  setPhotoSize: (option) => {
    const s = get();
    set({
      photoSize: {
        widthMm: option.widthMm,
        heightMm: option.heightMm,
        label: option.label,
        countryId: option.countryId,
        id: option.id,
        note: option.note,
      },
      placements: [],
      selectedId: null,
    });
    s.pushHistory();
    trackEvent("photo_size_selected", { size: option.id });
  },

  setCustomPhotoSize: (widthMm, heightMm, unitLabel) => {
    const s = get();
    set({
      photoSize: {
        widthMm: round3(widthMm),
        heightMm: round3(heightMm),
        label: `Custom (${unitLabel})`,
        countryId: null,
        id: "custom",
        note: "Custom dimensions — verify against official requirements before use.",
      },
      placements: [],
      selectedId: null,
    });
    s.pushHistory();
    trackEvent("photo_size_selected", { size: "custom" });
  },

  setPaper: (paper) => {
    const s = get();
    set({ paper, placements: [], selectedId: null });
    s.pushHistory();
    trackEvent("paper_size_selected", { paper: paper.id });
  },

  setOrientation: (o) => {
    const s = get();
    set({ orientation: o, placements: [], selectedId: null });
    s.pushHistory();
  },

  setLayout: (partial) => {
    set((s) => ({ layout: { ...s.layout, ...partial } }));
    get().autoArrange();
  },

  autoArrange: () => {
    const s = get();
    const { paperW, paperH } = orientedPaper(s.paper, s.orientation);
    const grid = computeGrid({
      paperW,
      paperH,
      photoW: s.photoSize.widthMm,
      photoH: s.photoSize.heightMm,
      margin: s.layout.margin,
      gapX: s.layout.gapX,
      gapY: s.layout.gapY,
      cols: s.layout.cols,
      rows: s.layout.rows,
    });
    set({ placements: grid.placements, selectedId: null });
  },

  updatePlacement: (id, x, y) => {
    set((s) => ({
      placements: s.placements.map((p) => (p.id === id ? { ...p, x, y } : p)),
    }));
  },

  commitPlacement: (id, x, y) => {
    const s = get();
    const { paperW, paperH } = orientedPaper(s.paper, s.orientation);
    const clamped = clampToPaper(x, y, paperW, paperH, s.photoSize.widthMm, s.photoSize.heightMm);
    const candidate: Placement = { id, ...clamped };
    const overlap = findOverlap(candidate, s.placements, s.photoSize.widthMm, s.photoSize.heightMm, id);
    if (overlap) {
      // Caller is responsible for reverting the live (pre-commit) position.
      return false;
    }
    set({
      placements: s.placements.map((p) => (p.id === id ? candidate : p)),
    });
    s.pushHistory();
    return true;
  },

  duplicatePlacement: (id): boolean => {
    const s = get();
    const original = s.placements.find((p) => p.id === id);
    if (!original) return false;
    const { paperW, paperH } = orientedPaper(s.paper, s.orientation);
    const pw = s.photoSize.widthMm;
    const ph = s.photoSize.heightMm;
    const offsets: Array<[number, number]> = [
      [pw / 2, 0], [-pw / 2, 0], [0, ph / 2], [0, -ph / 2],
      [pw / 2, ph / 2], [-pw / 2, ph / 2], [pw / 2, -ph / 2], [-pw / 2, -ph / 2],
      [pw * 1.5, 0], [-pw * 1.5, 0], [0, ph * 1.5], [0, -ph * 1.5],
    ];
    for (const [dx, dy] of offsets) {
      const cand = clampToPaper(original.x + dx, original.y + dy, paperW, paperH, pw, ph);
      const overlap = findOverlap({ id: "tmp", ...cand }, s.placements, pw, ph);
      if (!overlap) {
        const newId = makeId(Date.now());
        set({ placements: [...s.placements, { id: newId, ...cand }], selectedId: newId });
        s.pushHistory();
        return true;
      }
    }
    for (let y = 0; y <= paperH - ph + 0.01; y += 2) {
      for (let x = 0; x <= paperW - pw + 0.01; x += 2) {
        const overlap = findOverlap({ id: "tmp", x, y }, s.placements, pw, ph);
        if (!overlap) {
          const newId = makeId(Date.now());
          set({ placements: [...s.placements, { id: newId, x: round3(x), y: round3(y) }], selectedId: newId });
          s.pushHistory();
          return true;
        }
      }
    }
    return false;
  },

  removePlacement: (id) => {
    set((s) => ({
      placements: s.placements.filter((p) => p.id !== id),
      selectedId: s.selectedId === id ? null : s.selectedId,
    }));
    get().pushHistory();
  },

  selectPlacement: (id) => set({ selectedId: id }),

  pushHistory: () => {
    set((s) => ({
      history: {
        past: [...s.history.past.slice(-39), snapshotOf(s)],
        future: [],
      },
    }));
  },

  undo: () => {
    const s = get();
    const { past, future } = s.history;
    if (past.length === 0) return;
    const prev = past[past.length - 1];
    set({
      ...prev,
      history: { past: past.slice(0, -1), future: [snapshotOf(s), ...future].slice(0, 40) },
    });
  },

  redo: () => {
    const s = get();
    const { past, future } = s.history;
    if (future.length === 0) return;
    const next = future[0];
    set({
      ...next,
      history: { past: [...past, snapshotOf(s)], future: future.slice(1) },
    });
  },

  resetAll: () => {
    const prev = get().sourceBitmap;
    prev?.close();
    set({
      step: "upload",
      sourceBitmap: null,
      sourceMeta: null,
      previewBaked: null,
      transform: { ...IDENTITY_TRANSFORM },
      adjustments: { ...NEUTRAL_ADJUSTMENTS },
      bg: { ...DEFAULT_BG },
      photoSize: {
        widthMm: DEFAULT_SIZE.widthMm,
        heightMm: DEFAULT_SIZE.heightMm,
        label: DEFAULT_SIZE.label,
        countryId: DEFAULT_SIZE.countryId,
        id: DEFAULT_SIZE.id,
        note: DEFAULT_SIZE.note,
      },
      paper: {
        id: DEFAULT_PAPER.id,
        label: DEFAULT_PAPER.label,
        widthMm: DEFAULT_PAPER.widthMm,
        heightMm: DEFAULT_PAPER.heightMm,
      },
      orientation: "portrait",
      layout: { ...DEFAULT_LAYOUT },
      placements: [],
      selectedId: null,
      history: { past: [], future: [] },
    });
  },

  setProcessing: (on, label = "") => set({ isProcessing: on, processingLabel: label }),
}));
