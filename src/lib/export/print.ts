/**
 * Direct printing: renders the sheet image at exact physical size inside a hidden
 * iframe and opens the browser print dialog. `@page size` asks the browser for the
 * right paper; the on-screen instructions tell users to pick "Actual size / 100%".
 */
export function printSheet(
  dataUrl: string,
  paperWmm: number,
  paperHmm: number,
): void {
  const existing = document.getElementById("ppc-print-frame");
  if (existing) existing.remove();

  const iframe = document.createElement("iframe");
  iframe.id = "ppc-print-frame";
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "1px";
  iframe.style.height = "1px";
  iframe.style.opacity = "0";
  iframe.style.border = "0";

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Passport photo sheet</title>
<style>
  @page { size: ${paperWmm}mm ${paperHmm}mm; margin: 0; }
  html, body { margin: 0; padding: 0; background: #fff; }
  img { display: block; width: ${paperWmm}mm; height: ${paperHmm}mm; }
</style>
</head>
<body>
  <img src="${dataUrl}" alt="Passport photo sheet">
</body>
</html>`;

  iframe.srcdoc = html;
  document.body.appendChild(iframe);

  const cleanup = () => {
    setTimeout(() => {
      const frame = document.getElementById("ppc-print-frame");
      if (frame) frame.remove();
    }, 60_000);
  };

  iframe.onload = () => {
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch {
        // Some browsers block programmatic print — the user can print manually.
      }
      cleanup();
    }, 350);
  };
}
