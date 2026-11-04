"use client";

import { cn } from "@/lib/utils";

/** Brand mark — high-contrast editorial camera emblem in Alma colors. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex shrink-0 select-none items-center gap-2.5", className)}>
      <span
        aria-hidden="true"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[image:var(--alma-gradient-primary)] shadow-card transition-transform group-hover:scale-105"
      >
        <svg viewBox="0 0 24 24" className="h-5.5 w-5.5" fill="none">
          <rect
            x="3.5"
            y="3.5"
            width="17"
            height="17"
            rx="4"
            fill="#fffdf5"
            fillOpacity="0.94"
          />
          {/* Inner portrait silhouette with biometric guide frame */}
          <circle cx="12" cy="10" r="2.75" fill="#3c5627" />
          <path
            d="M6.5 20.5c.6-3.4 2.8-5.25 5.5-5.25s4.9 1.85 5.5 5.25"
            fill="#3c5627"
          />
          <circle cx="16.8" cy="7.2" r="1.4" fill="#c3d638" />
        </svg>
      </span>
      <span className="leading-tight">
        <span className="block font-display text-[20px] font-bold tracking-tight text-foreground">
          Print<span className="text-alma-collard dark:text-alma-kiwi">my</span>Photo
        </span>
        <span className="block font-sans text-[9px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/90">
          Photo &amp; Print Studio
        </span>
      </span>
    </span>
  );
}
