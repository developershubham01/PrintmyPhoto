"use client";

import { cn } from "@/lib/utils";

/** Brand mark — a rounded photo frame with a portrait silhouette in Alma colors. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span
        aria-hidden="true"
        className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[image:var(--alma-gradient-primary)] shadow-card"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
          <rect x="4" y="3" width="16" height="18" rx="3" fill="#fffdf5" fillOpacity="0.92" />
          <circle cx="12" cy="10" r="2.6" fill="#3c5627" />
          <path d="M6.8 21c.6-3.2 2.6-5 5.2-5s4.6 1.8 5.2 5" fill="#3c5627" />
          <circle cx="17.5" cy="6.5" r="1.6" fill="#c3d638" />
        </svg>
      </span>
      <span className="leading-none">
        <span className="block font-display text-[17px] font-semibold tracking-tight">
          Passport Photo
        </span>
        <span className="block text-[10.5px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          Print Studio
        </span>
      </span>
    </span>
  );
}
