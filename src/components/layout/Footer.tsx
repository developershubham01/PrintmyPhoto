"use client";

import Link from "next/link";
import { ShieldCheck, Lock, RefreshCcw } from "lucide-react";
import { useConsentStore } from "@/lib/store/consent-store";

const COLUMNS: Array<{ title: string; links: Array<{ label: string; href: string }> }> = [
  {
    title: "Product",
    links: [
      { label: "Passport Photo Maker", href: "/passport-photo-maker" },
      { label: "Photo Editor", href: "/editor" },
      { label: "Passport Photo Sizes", href: "/passport-photo-sizes" },
      { label: "Photo Printing Guide", href: "/photo-printing-guide" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "How It Works", href: "/how-it-works" },
      { label: "Blog & Guides", href: "/blog" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms and Conditions", href: "/terms" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Cookie Policy", href: "/cookie-policy" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Disclaimer", href: "/disclaimer" },
      { label: "Terms and Conditions", href: "/terms" },
    ],
  },
];

export function Footer() {
  const resetConsent = useConsentStore((s) => s.reset);

  return (
    <footer className="mt-auto border-t border-border/70 bg-alma-yogurt dark:bg-card">
      <div className="container-editorial py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="max-w-xs">
            <p className="font-display text-xl font-bold">
              Print<span className="text-alma-collard dark:text-alma-kiwi">my</span>Photo
            </p>
            <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
              Free online passport photo maker and print studio. Crop, customize and arrange
              passport-size photos on your paper, then download a print-ready PDF — no account
              required.
            </p>
            <div className="mt-4 flex items-start gap-2 rounded-xl border bg-card p-3 text-[12.5px] leading-relaxed text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-alma-collard" aria-hidden="true" />
              <span>
                Your photos are processed locally in your browser wherever possible. We do not
                require an account to use this tool. Your photographs are not permanently stored by
                this website.
              </span>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={`${col.title} links`}>
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={`${col.title}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="rounded text-[14px] text-foreground/85 transition-colors hover:text-alma-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border/70 pt-6 text-[13px] text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} PrintmyPhoto. Free forever. Always verify
            photo requirements with the official issuing authority.
          </p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" aria-hidden="true" /> Browser-side processing
            </span>
            <button
              type="button"
              onClick={resetConsent}
              className="inline-flex items-center gap-1.5 rounded underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
            >
              <RefreshCcw className="h-3.5 w-3.5" aria-hidden="true" /> Cookie preferences
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
