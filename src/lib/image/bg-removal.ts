/**
 * Automatic background removal — border flood-fill.
 *
 * HONESTY CONTRACT: this is a fast, fully-local *approximation*. It works well on
 * plain, evenly-lit backgrounds and will struggle on busy scenes, gradients or
 * when the subject's colors are close to the backdrop. The UI must always label
 * the result as approximate and let the user revert.
 *
 * Algorithm:
 * 1. Sample the 1px border ring of the cropped photo and average it → backdrop seed color.
 * 2. BFS from every border pixel whose color is within `tolerance` of the seed.
 * 3. A neighbor joins the mask ONLY if it is close to the seed color. We deliberately do
 *    NOT region-grow toward similar neighbors: that walks anti-aliased gradients into the
 *    subject and erodes faces. Seed-only matching is safer and predictable.
 * 4. The binary mask is feathered (3×3 box blur) for natural edges.
 */

export interface RemovalResult {
  canvas: HTMLCanvasElement;
  removedRatio: number;
}

export function removeBackgroundFlat(
  source: HTMLCanvasElement,
  toleranceInput = 32,
): RemovalResult {
  const w = source.width;
  const h = source.height;
  const ctx = source.getContext("2d", { willReadFrequently: true })!;
  const image = ctx.getImageData(0, 0, w, h);
  const data = image.data;

  // Tolerance 0-100 (UI) → RGB distance 0-255 scale. 32 ≈ default balanced.
  const tol = Math.max(4, Math.min(120, toleranceInput * 1.2));

  // --- 1. Sample border ring -------------------------------------------------
  let sr = 0;
  let sg = 0;
  let sb = 0;
  let count = 0;
  const sampleAt = (x: number, y: number) => {
    const i = (y * w + x) * 4;
    sr += data[i];
    sg += data[i + 1];
    sb += data[i + 2];
    count++;
  };
  for (let x = 0; x < w; x++) {
    sampleAt(x, 0);
    sampleAt(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    sampleAt(0, y);
    sampleAt(w - 1, y);
  }
  const seedR = sr / count;
  const seedG = sg / count;
  const seedB = sb / count;

  // --- 2. BFS flood fill -----------------------------------------------------
  const total = w * h;
  const mask = new Uint8Array(total); // 1 = background
  const queue = new Int32Array(total);
  let head = 0;
  let tail = 0;

  const push = (idx: number) => {
    if (!mask[idx]) {
      mask[idx] = 1;
      queue[tail++] = idx;
    }
  };

  const distToSeed = (i: number): number => {
    const p = i * 4;
    const dr = data[p] - seedR;
    const dg = data[p + 1] - seedG;
    const db = data[p + 2] - seedB;
    return Math.sqrt(dr * dr + dg * dg + db * db);
  };

  // Seed from border pixels close to the average backdrop color.
  const borderIndices: number[] = [];
  for (let x = 0; x < w; x++) {
    borderIndices.push(x, (h - 1) * w + x);
  }
  for (let y = 0; y < h; y++) {
    borderIndices.push(y * w, y * w + w - 1);
  }
  for (const idx of borderIndices) {
    if (distToSeed(idx) <= tol) push(idx);
  }

  while (head < tail) {
    const cur = queue[head++];
    const cx = cur % w;
    const cy = (cur - cx) / w;

    // Visit 4 neighbours
    if (cx > 0) tryVisit(cur - 1);
    if (cx < w - 1) tryVisit(cur + 1);
    if (cy > 0) tryVisit(cur - w);
    if (cy < h - 1) tryVisit(cur + w);

    function tryVisit(next: number) {
      if (mask[next]) return;
      if (distToSeed(next) <= tol) {
        mask[next] = 1;
        queue[tail++] = next;
      }
    }
  }

  const removed = tail;
  const removedRatio = removed / total;

  // --- 3. Feather the mask (3×3 box blur) ------------------------------------
  const blurred = new Float32Array(total);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sum = 0;
      let n = 0;
      for (let dy = -1; dy <= 1; dy++) {
        const yy = y + dy;
        if (yy < 0 || yy >= h) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx;
          if (xx < 0 || xx >= w) continue;
          sum += mask[yy * w + xx];
          n++;
        }
      }
      blurred[y * w + x] = sum / n;
    }
  }

  // --- 4. Write alpha ---------------------------------------------------------
  for (let i = 0; i < total; i++) {
    const p = i * 4 + 3;
    const keepAlpha = Math.round(255 * (1 - blurred[i]));
    if (keepAlpha < data[p]) data[p] = keepAlpha;
  }

  ctx.putImageData(image, 0, 0);
  return { canvas: source, removedRatio };
}

/** Creates a copy of `source` with the background removed (keeps the original untouched). */
export function backgroundRemovedCopy(
  source: HTMLCanvasElement,
  tolerance: number,
): RemovalResult {
  const copy = document.createElement("canvas");
  copy.width = source.width;
  copy.height = source.height;
  copy.getContext("2d")!.drawImage(source, 0, 0);
  return removeBackgroundFlat(copy, tolerance);
}

/** Border-color uniformity check → drives the "background may be uneven" warning. */
export function borderUniformity(source: HTMLCanvasElement): {
  stdDev: number;
  uniform: boolean;
} {
  const w = source.width;
  const h = source.height;
  const ctx = source.getContext("2d", { willReadFrequently: true })!;
  const d = ctx.getImageData(0, 0, w, h).data;

  let sum = 0;
  let sumSq = 0;
  let n = 0;
  const sample = (x: number, y: number) => {
    const i = (y * w + x) * 4;
    const luma = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
    sum += luma;
    sumSq += luma * luma;
    n++;
  };
  const step = Math.max(1, Math.floor(Math.max(w, h) / 200));
  for (let x = 0; x < w; x += step) {
    sample(x, 0);
    sample(x, h - 1);
  }
  for (let y = 0; y < h; y += step) {
    sample(0, y);
    sample(w - 1, y);
  }
  const mean = sum / n;
  const stdDev = Math.sqrt(Math.max(0, sumSq / n - mean * mean));
  return { stdDev, uniform: stdDev < 26 };
}
