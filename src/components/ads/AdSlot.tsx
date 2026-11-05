"use client";

import { useEffect, useRef } from "react";
import { useConsentStore } from "@/lib/store/consent-store";

/**
 * Reusable, CLS-safe ad slot.
 *
 * - Reserves its height up front (min-height) so ads can never shift layout.
 * - Renders a real AdSense unit when NEXT_PUBLIC_ADSENSE_CLIENT + a slot id are
 *   configured AND the visitor accepted cookies; otherwise shows a neutral,
 *   clearly-labelled placeholder (never styled like a button or download).
 * - Ads are disabled by default — no script loads until env config exists.
 */

type AdFormat = "horizontal" | "rectangle" | "vertical";

const FORMAT_MIN_H: Record<AdFormat, string> = {
  horizontal: "min-h-[100px] md:min-h-[120px]",
  rectangle: "min-h-[250px]",
  vertical: "min-h-[600px]",
};

interface AdSlotProps {
  slotId?: string;
  format?: AdFormat;
  label?: string;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function AdSlot({
  slotId,
  format = "horizontal",
  label = "Advertisement",
  className = "",
}: AdSlotProps) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-2733238354385302";
  const adsEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "1";
  const consented = useConsentStore((s) => s.status === "accepted");
  const pushed = useRef(false);

  const active = Boolean(adsEnabled && client && slotId && consented);

  useEffect(() => {
    if (!active || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle ?? []).push({});
    } catch {
      // AdSense script not ready — the unit stays empty; no error is surfaced.
    }
  }, [active]);

  return (
    <aside
      aria-label={label}
      className={`w-full ${className}`}
      data-ad-placeholder={!active || undefined}
    >
      <p className="mb-1 text-center text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">
        {label}
      </p>
      {active ? (
        <ins
          className="adsbygoogle block w-full"
          style={{ display: "block", minHeight: FORMAT_MIN_H[format].replace("min-h-[", "").replace("]", "") }}
          data-ad-client={client}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <div
          className={`flex ${FORMAT_MIN_H[format]} w-full items-center justify-center rounded-xl border border-dashed border-border/80 bg-secondary/40`}
        >
          <span className="max-w-[280px] text-center text-xs text-muted-foreground/80">
            Ad space — ads stay switched off until this site is approved and configured for
            Google AdSense.
          </span>
        </div>
      )}
    </aside>
  );
}
