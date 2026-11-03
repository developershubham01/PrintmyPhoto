import { PDFDocument } from "pdf-lib";
import { mmToPt } from "@/lib/dimensions";
import { canvasToBlob } from "@/lib/export/raster";

export interface PdfOptions {
  sheetCanvas: HTMLCanvasElement;
  paperWmm: number;
  paperHmm: number;
  /** Keep alpha via PNG embedding (larger file). Otherwise high-quality JPEG. */
  preserveAlpha?: boolean;
}

/**
 * Builds a print-ready PDF whose page has the *exact physical dimensions* of the
 * paper (1 pt = 1/72 in) and contains the 300 DPI sheet stretched edge-to-edge.
 * No scaling, no margins, no fit-to-page surprises — the PDF page IS the paper.
 */
export async function generateSheetPdf(opts: PdfOptions): Promise<Blob> {
  const { sheetCanvas, paperWmm, paperHmm, preserveAlpha } = opts;

  const pdf = await PDFDocument.create();
  const pageWpt = mmToPt(paperWmm);
  const pageHpt = mmToPt(paperHmm);
  const page = pdf.addPage([pageWpt, pageHpt]);

  let embedded;
  if (preserveAlpha) {
    const pngBlob = await canvasToBlob(sheetCanvas, "image/png");
    embedded = await pdf.embedPng(await pngBlob.arrayBuffer());
  } else {
    const jpegBlob = await canvasToBlob(sheetCanvas, "image/jpeg", 0.95);
    embedded = await pdf.embedJpg(await jpegBlob.arrayBuffer());
  }

  page.drawImage(embedded, {
    x: 0,
    y: 0,
    width: pageWpt,
    height: pageHpt,
  });

  pdf.setTitle(`Passport photo sheet — ${paperWmm} × ${paperHmm} mm`);
  pdf.setSubject("Print-ready passport photo sheet at 300 DPI");
  pdf.setProducer("Passport Photo & Print Studio");
  pdf.setCreationDate(new Date());

  const bytes = await pdf.save();
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
}
