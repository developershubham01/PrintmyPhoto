/**
 * Privacy-conscious analytics.
 *
 * - Events never include photo data, file contents, or any personal information.
 * - Nothing is sent until the visitor accepts analytics cookies in the consent banner.
 * - If no analytics provider is configured, events are counted in-memory only
 *   (visible in devtools when NEXT_PUBLIC_ANALYTICS_DEBUG=1).
 */

export type AnalyticsEvent =
  | "page_view"
  | "editor_opened"
  | "photo_uploaded"
  | "sample_used"
  | "photo_size_selected"
  | "paper_size_selected"
  | "background_changed"
  | "pdf_downloaded"
  | "jpg_downloaded"
  | "png_downloaded"
  | "print_started";

interface EventProps {
  // Only coarse, non-identifying values are ever allowed here.
  [key: string]: string | number | undefined;
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";
const DEBUG = process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "1";

const consent = { granted: false };
let gtagLoaded = false;

export function setAnalyticsConsent(granted: boolean): void {
  consent.granted = granted;
  if (granted && GA_ID && !gtagLoaded && typeof window !== "undefined") {
    gtagLoaded = true;
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(s);
    (window as unknown as { dataLayer?: unknown[] }).dataLayer =
      (window as unknown as { dataLayer?: unknown[] }).dataLayer ?? [];
    const g = (...args: unknown[]) => {
      (window as unknown as { dataLayer: unknown[] }).dataLayer.push(args);
    };
    (window as unknown as { gtag?: typeof g }).gtag = g;
    g("js", new Date());
    g("config", GA_ID, { anonymize_ip: true });
  }
}

export function trackEvent(event: AnalyticsEvent, props?: EventProps): void {
  if (DEBUG) {
    console.debug(`[analytics] ${event}`, props ?? {});
  }
  if (!consent.granted) return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (gtag) {
    gtag("event", event, props ?? {});
  }
}
