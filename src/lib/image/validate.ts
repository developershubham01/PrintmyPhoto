export const MAX_FILE_BYTES = 15 * 1024 * 1024; // 15 MB
export const ACCEPTED_MIME = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
export const ACCEPTED_EXT = [".jpg", ".jpeg", ".png", ".webp"];

export interface FileValidation {
  ok: boolean;
  reason?: string;
}

export function validateImageFile(file: File): FileValidation {
  const nameLower = file.name.toLowerCase();
  const hasKnownExt = ACCEPTED_EXT.some((e) => nameLower.endsWith(e));
  const typeOk = file.type ? ACCEPTED_MIME.includes(file.type.toLowerCase()) : hasKnownExt;

  if (nameLower.endsWith(".heic") || nameLower.endsWith(".heif") || file.type === "image/heic") {
    return {
      ok: false,
      reason:
        "HEIC photos (iPhone format) are not supported yet. In your phone settings choose “Most compatible”, or convert the photo to JPG and try again.",
    };
  }
  if (!typeOk) {
    return {
      ok: false,
      reason: "Unsupported file type. Please upload a JPG, PNG or WebP image.",
    };
  }
  if (file.size > MAX_FILE_BYTES) {
    return {
      ok: false,
      reason: `That file is ${(file.size / 1024 / 1024).toFixed(1)} MB — the maximum is 15 MB. Tip: screenshots and straight-from-camera photos are usually fine.`,
    };
  }
  if (file.size < 1024) {
    return { ok: false, reason: "That file looks empty or corrupted. Please try another photo." };
  }
  return { ok: true };
}

/** Decodes a File into an ImageBitmap with friendly error handling. */
export async function decodeImageFile(file: File): Promise<ImageBitmap> {
  const buffer = await file.arrayBuffer();
  try {
    const bitmap = await createImageBitmap(new Blob([buffer], { type: file.type || "image/png" }));
    if (bitmap.width < 50 || bitmap.height < 50) {
      bitmap.close();
      throw new Error("tiny");
    }
    return bitmap;
  } catch (error) {
    if (error instanceof Error && error.message === "tiny") {
      throw new Error(
        "That image is too small to print (minimum 50 × 50 pixels). Please choose a larger photo.",
      );
    }
    throw new Error(
      "We couldn't decode that image. It may be corrupted or in an unsupported format — try exporting it as JPG first.",
    );
  }
}
