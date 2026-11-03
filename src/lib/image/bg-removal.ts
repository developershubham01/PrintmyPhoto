/**
 * Automatic background removal — robust border flood-fill with gradient adaptation.
 *
 * Designed specifically for portrait / passport photos:
 * 1. Sample backdrop reference colors from top-left, top-center, and top-right corners/edges.
 *    (Top 15% and upper side edges are guaranteed backdrop in portrait framing).
 * 2. Calculate local expected background color via bilinear/horizontal interpolation
 *    to handle realistic room lighting gradients across the backdrop.
 * 3. Seed BFS flood-fill from top border (y=0) and upper left/right borders (y <= h * 0.7).
 *    Never seed from the bottom edge or lower sides where clothing/shoulders are located.
 * 4. Flood fill connects all outer backdrop pixels matching the backdrop reference within `tolerance`.
 * 5. Feather edges (separable 5x5 box blur) to produce smooth, non-jagged cutout boundaries.
 */

export interface RemovalResult {
  canvas: HTMLCanvasElement;
  removedRatio: number;
}

/** Color tuple in [r, g, b] */
type RGB = [number, number, number];

/** Calculate perceptual color distance between two RGB colors */
function colorDistance(
  r1: number,
  g1: number,
  b1: number,
  r2: number,
  g2: number,
  b2: number,
): number {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  // Perceptual weighting: human eye is most sensitive to green, then red, then blue
  return Math.sqrt(0.299 * dr * dr + 0.587 * dg * dg + 0.114 * db * db);
}

/**
 * Removes the background of a portrait photo using adaptive corner sampling,
 * gradient interpolation, and boundary-seeded flood-fill.
 */
export function removeBackgroundFlat(
  source: HTMLCanvasElement,
  toleranceInput = 32,
): RemovalResult {
  const w = source.width;
  const h = source.height;
  const ctx = source.getContext("2d", { willReadFrequently: true })!;
  const image = ctx.getImageData(0, 0, w, h);
  const data = image.data;
  const total = w * h;

  // Map tolerance slider (8-80) to perceptual distance threshold
  const threshold = Math.max(12, Math.min(130, toleranceInput * 1.45));

  // --- 1. Sample backdrop reference regions ---------------------------------
  // In portrait photos, the person's head is centered, so the top-left, top-center,
  // and top-right are guaranteed background.
  const sampleRegion = (
    startX: number,
    endX: number,
    startY: number,
    endY: number,
  ): RGB => {
    let rSum = 0;
    let gSum = 0;
    let bSum = 0;
    let count = 0;
    const step = Math.max(1, Math.floor(Math.min(endX - startX, endY - startY) / 10));

    for (let y = startY; y < endY; y += step) {
      for (let x = startX; x < endX; x += step) {
        const i = (y * w + x) * 4;
        rSum += data[i];
        gSum += data[i + 1];
        bSum += data[i + 2];
        count++;
      }
    }
    if (count === 0) return [240, 240, 240];
    return [rSum / count, gSum / count, bSum / count];
  };

  const cornerW = Math.max(4, Math.floor(w * 0.22));
  const cornerH = Math.max(4, Math.floor(h * 0.20));
  const topH = Math.max(2, Math.floor(h * 0.06));

  const tlColor = sampleRegion(0, cornerW, 0, cornerH);
  const trColor = sampleRegion(w - cornerW, w, 0, cornerH);
  const tcColor = sampleRegion(Math.floor(w * 0.4), Math.floor(w * 0.6), 0, topH);

  // Function to compute expected background color for any pixel (x, y)
  // using horizontal interpolation to gracefully handle lateral light gradients
  const getExpectedBg = (x: number): RGB => {
    const halfW = w / 2;
    if (x <= halfW) {
      const t = halfW > 0 ? x / halfW : 0;
      return [
        tlColor[0] * (1 - t) + tcColor[0] * t,
        tlColor[1] * (1 - t) + tcColor[1] * t,
        tlColor[2] * (1 - t) + tcColor[2] * t,
      ];
    } else {
      const t = halfW > 0 ? (x - halfW) / halfW : 0;
      return [
        tcColor[0] * (1 - t) + trColor[0] * t,
        tcColor[1] * (1 - t) + trColor[1] * t,
        tcColor[2] * (1 - t) + trColor[2] * t,
      ];
    }
  };

  // --- 2. Initialize Seed Queue ---------------------------------------------
  const mask = new Uint8Array(total); // 1 = background, 0 = subject
  const queue = new Int32Array(total);
  let head = 0;
  let tail = 0;

  const pushSeed = (idx: number) => {
    if (!mask[idx]) {
      mask[idx] = 1;
      queue[tail++] = idx;
    }
  };

  // Check top border (y = 0)
  for (let x = 0; x < w; x++) {
    const p = x * 4;
    const [eR, eG, eB] = getExpectedBg(x);
    const d = colorDistance(data[p], data[p + 1], data[p + 2], eR, eG, eB);
    if (d <= threshold * 1.35) {
      pushSeed(x);
    }
  }

  // Check upper left and right borders (y up to 70% of height, avoiding chest/shoulders)
  const maxSideY = Math.floor(h * 0.70);
  for (let y = 1; y < maxSideY; y++) {
    // Left edge (x = 0)
    const leftIdx = y * w;
    const lp = leftIdx * 4;
    const [leR, leG, leB] = tlColor;
    if (colorDistance(data[lp], data[lp + 1], data[lp + 2], leR, leG, leB) <= threshold * 1.35) {
      pushSeed(leftIdx);
    }

    // Right edge (x = w - 1)
    const rightIdx = y * w + w - 1;
    const rp = rightIdx * 4;
    const [reR, reG, reB] = trColor;
    if (colorDistance(data[rp], data[rp + 1], data[rp + 2], reR, reG, reB) <= threshold * 1.35) {
      pushSeed(rightIdx);
    }
  }

  // Fallback: if corners had shadows and strict check missed, guarantee corner seeds
  if (tail === 0) {
    pushSeed(0);
    pushSeed(w - 1);
  }

  // --- 3. Flood Fill BFS -----------------------------------------------------
  while (head < tail) {
    const cur = queue[head++];
    const cx = cur % w;
    const cy = Math.floor(cur / w);

    const cp = cur * 4;
    const curR = data[cp];
    const curG = data[cp + 1];
    const curB = data[cp + 2];

    // Visit 4-connected neighbors
    if (cx > 0) visitNeighbor(cur - 1, cx - 1, cy);
    if (cx < w - 1) visitNeighbor(cur + 1, cx + 1, cy);
    if (cy > 0) visitNeighbor(cur - w, cx, cy - 1);
    if (cy < h - 1) visitNeighbor(cur + w, cx, cy + 1);

    function visitNeighbor(nextIdx: number, nx: number, ny: number) {
      if (mask[nextIdx]) return;

      const np = nextIdx * 4;
      const nr = data[np];
      const ng = data[np + 1];
      const nb = data[np + 2];

      const [eR, eG, eB] = getExpectedBg(nx);
      const distToExpected = colorDistance(nr, ng, nb, eR, eG, eB);

      // Protect lower torso/chest area (center horizontally, bottom 30%)
      const inTorsoZone = ny > h * 0.68 && nx > w * 0.22 && nx < w * 0.78;
      const effectiveThreshold = inTorsoZone ? threshold * 0.75 : threshold;

      // Pixel matches expected background
      if (distToExpected <= effectiveThreshold) {
        mask[nextIdx] = 1;
        queue[tail++] = nextIdx;
        return;
      }

      // Or if it's very close to current background neighbor (handles smooth soft wall shadows)
      const stepDist = colorDistance(nr, ng, nb, curR, curG, curB);
      if (stepDist <= 12 && distToExpected <= effectiveThreshold * 1.25 && !inTorsoZone) {
        mask[nextIdx] = 1;
        queue[tail++] = nextIdx;
      }
    }
  }

  const removedCount = tail;
  const removedRatio = removedCount / total;

  // --- 4. Feather the Mask (Fast Separable 5x5 Box Blur) --------------------
  // Horizontal pass
  const tempBlur = new Float32Array(total);
  const radius = 2; // radius 2 -> 5x5 window
  for (let y = 0; y < h; y++) {
    const rowOffset = y * w;
    for (let x = 0; x < w; x++) {
      let sum = 0;
      let count = 0;
      for (let dx = -radius; dx <= radius; dx++) {
        const nx = x + dx;
        if (nx >= 0 && nx < w) {
          sum += mask[rowOffset + nx];
          count++;
        }
      }
      tempBlur[rowOffset + x] = sum / count;
    }
  }

  // Vertical pass + Alpha application
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      let sum = 0;
      let count = 0;
      for (let dy = -radius; dy <= radius; dy++) {
        const ny = y + dy;
        if (ny >= 0 && ny < h) {
          sum += tempBlur[ny * w + x];
          count++;
        }
      }
      const bgFraction = sum / count; // 1 = 100% background, 0 = 100% subject
      const idx = y * w + x;
      const p = idx * 4 + 3; // alpha channel

      // Smooth step for clean, anti-aliased edge
      const keepAlpha = Math.round(255 * Math.max(0, Math.min(1, 1 - bgFraction)));
      if (keepAlpha < data[p]) {
        data[p] = keepAlpha;
      }
    }
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

/**
 * Checks background uniformity in the upper regions of the photo
 * (avoids the bottom torso/shoulders to prevent false alarms).
 */
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

  const step = Math.max(1, Math.floor(w / 80));
  // Sample top edge
  for (let x = 0; x < w; x += step) {
    sample(x, 0);
  }

  // Sample top 30% of left and right edges only (where backdrop is)
  const maxSideY = Math.floor(h * 0.35);
  for (let y = 0; y < maxSideY; y += step) {
    sample(0, y);
    sample(w - 1, y);
  }

  const mean = n > 0 ? sum / n : 0;
  const stdDev = n > 0 ? Math.sqrt(Math.max(0, sumSq / n - mean * mean)) : 0;
  return { stdDev, uniform: stdDev < 28 };
}
