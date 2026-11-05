"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Cookie, ShieldCheck } from "lucide-react";
import { useConsentStore } from "@/lib/store/consent-store";

/**
 * Cookie / analytics consent banner.
 * Only non-essential cookies (analytics, advertising) require consent —
 * the app itself stores nothing sensitive in cookies.
 */
export function CookieConsent() {
  const status = useConsentStore((s) => s.status);
  const hydrated = useConsentStore((s) => s.hydrated);
  const setConsent = useConsentStore((s) => s.setConsent);
  const [timedIn, setTimedIn] = useState(false);

  useEffect(() => {
    useConsentStore.getState().hydrate();
  }, []);

  useEffect(() => {
    if (!hydrated || status !== "unset") return;
    const t = setTimeout(() => setTimedIn(true), 1200);
    return () => clearTimeout(t);
  }, [hydrated, status]);

  if (!(hydrated && status === "unset" && timedIn)) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:px-6"
    >
      <div className="container-editorial mx-auto max-w-[1100px] rounded-2xl border bg-popover/95 p-4 shadow-soft backdrop-blur sm:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex items-start gap-3 md:flex-1">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-alma-collard">
              <Cookie className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold">Cookies, analytics &amp; ads</p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                Your photos are always processed locally in your browser — never uploaded. We use
                cookies only for optional, privacy-conscious analytics and future advertising.
                You choose. See our{" "}
                <a href="/cookie-policy" className="font-medium text-alma-accent underline underline-offset-2">
                  Cookie Policy
                </a>{" "}
                and{" "}
                <a href="/privacy-policy" className="font-medium text-alma-accent underline underline-offset-2">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row md:flex-col lg:flex-row">
            <Button
              variant="outline"
              size="sm"
              className="h-11 min-w-[140px] rounded-xl"
              onClick={() => setConsent("essential")}
            >
              <ShieldCheck className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Essential only
            </Button>
            <Button
              size="sm"
              className="btn-gradient h-11 min-w-[140px] rounded-xl"
              onClick={() => setConsent("accepted")}
            >
              Accept all
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
