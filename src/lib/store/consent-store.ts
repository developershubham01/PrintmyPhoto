"use client";

import { create } from "zustand";

export type ConsentStatus = "unset" | "accepted" | "essential";

interface ConsentState {
  status: ConsentStatus;
  hydrated: boolean;
  setConsent: (status: Exclude<ConsentStatus, "unset">) => void;
  hydrate: () => void;
  reset: () => void;
}

const STORAGE_KEY = "pps-consent";

export const useConsentStore = create<ConsentState>((set) => ({
  status: "unset",
  hydrated: false,
  setConsent: (status) => {
    set({ status });
    try {
      localStorage.setItem(STORAGE_KEY, status);
    } catch {
      // storage blocked — consent stays in memory for this session
    }
    if (typeof window !== "undefined") {
      import("@/lib/analytics").then(({ setAnalyticsConsent }) =>
        setAnalyticsConsent(status === "accepted"),
      );
    }
  },
  hydrate: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "accepted" || stored === "essential") {
        set({ status: stored, hydrated: true });
        if (stored === "accepted") {
          import("@/lib/analytics").then(({ setAnalyticsConsent }) =>
            setAnalyticsConsent(true),
          );
        }
        return;
      }
    } catch {
      // ignore
    }
    set({ hydrated: true });
  },
  reset: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    set({ status: "unset", hydrated: true });
    if (typeof window !== "undefined") {
      import("@/lib/analytics").then(({ setAnalyticsConsent }) => setAnalyticsConsent(false));
    }
  },
}));
