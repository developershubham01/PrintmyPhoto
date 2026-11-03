"use client";

import { useCallback, useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * Virtual (hash-based) router.
 *
 * The studio ships as a single Next.js route (`/`) with client-side virtual pages,
 * so every feature works in sandboxed previews where only `/` is served. Each
 * virtual page is a standalone component and can be lifted into a real App Router
 * route in production without changes (see README → "Production routing").
 */

export type RouteId =
  | "home"
  | "maker"
  | "editor"
  | "sizes"
  | "country"
  | "printing-guide"
  | "how-it-works"
  | "about"
  | "contact"
  | "privacy-policy"
  | "terms"
  | "disclaimer"
  | "cookie-policy"
  | "faq"
  | "blog"
  | "blog-article";

export interface RouteMatch {
  route: RouteId;
  param?: string;
}

const PATH_TO_ROUTE: Record<string, RouteId> = {
  "/": "home",
  "/passport-photo-maker": "maker",
  "/editor": "editor",
  "/passport-photo-sizes": "sizes",
  "/photo-printing-guide": "printing-guide",
  "/how-it-works": "how-it-works",
  "/about": "about",
  "/contact": "contact",
  "/privacy-policy": "privacy-policy",
  "/terms": "terms",
  "/disclaimer": "disclaimer",
  "/cookie-policy": "cookie-policy",
  "/faq": "faq",
  "/blog": "blog",
};

export function parseHash(hash: string): RouteMatch {
  const raw = hash.replace(/^#/, "");
  if (!raw || raw === "/") return { route: "home" };
  const countryMatch = raw.match(/^\/passport-photo-sizes\/([a-z0-9-]+)$/);
  if (countryMatch) return { route: "country", param: countryMatch[1] };
  const articleMatch = raw.match(/^\/blog\/([a-z0-9-]+)$/);
  if (articleMatch) return { route: "blog-article", param: articleMatch[1] };
  const route = PATH_TO_ROUTE[raw];
  return { route: route ?? "home" };
}

export interface RouteMeta {
  title: string;
  description: string;
}

export const ROUTE_META: Record<RouteId, RouteMeta> = {
  home: {
    title: "printmyphoto — Free Passport Photo Maker & Print Studio",
    description:
      "Create, customize and print passport-size photographs in minutes with printmyphoto. Crop, change backgrounds, arrange on 4×6, A4 and more, and download a print-ready PDF. Free, no sign-up.",
  },
  maker: {
    title: "Passport Photo Maker — printmyphoto",
    description:
      "Make passport size photos online for free with printmyphoto. Crop to 35×45 mm, 2×2 inch and more, fix the background and download a 300 DPI print-ready sheet.",
  },
  editor: {
    title: "Photo Editor — printmyphoto",
    description:
      "Crop, rotate and adjust your passport photo, then arrange copies on your paper size and download a print-ready PDF, JPG or PNG at 300 DPI.",
  },
  sizes: {
    title: "Passport Photo Sizes by Country (mm & inches) — printmyphoto",
    description:
      "Passport photo sizes for the US, UK, India, Canada, Australia, Schengen and more — exact mm and inch dimensions, pixel sizes at 300 DPI, and links to official sources.",
  },
  country: {
    title: "Passport Photo Size Guide — printmyphoto",
    description:
      "Exact passport photo dimensions, background rules and printing tips, with links to the official issuing authority.",
  },
  "printing-guide": {
    title: "Photo Printing Guide — printmyphoto",
    description:
      "How to print passport photos at home on 4×6 or A4 paper: printer settings, actual-size scaling, 300 DPI, paper choices and a size calculator.",
  },
  "how-it-works": {
    title: "How It Works — printmyphoto",
    description:
      "See how the free passport photo maker works: upload, crop, customize the background, arrange on paper and download. Everything runs in your browser.",
  },
  about: {
    title: "About — printmyphoto",
    description:
      "Who we are: a free, privacy-first passport photo and printing tool that processes everything in your browser.",
  },
  contact: {
    title: "Contact — printmyphoto",
    description: "Get in touch with the printmyphoto team — feedback, bugs and partnership enquiries.",
  },
  "privacy-policy": {
    title: "Privacy Policy — printmyphoto",
    description:
      "How printmyphoto handles your photos (in your browser), cookies, analytics and advertising.",
  },
  terms: {
    title: "Terms and Conditions — printmyphoto",
    description: "The terms that apply when you use printmyphoto free passport photo maker and print studio.",
  },
  disclaimer: {
    title: "Disclaimer — printmyphoto",
    description:
      "Important disclaimer: photo requirements vary by authority. This tool does not guarantee compliance with any official document standard.",
  },
  "cookie-policy": {
    title: "Cookie Policy — printmyphoto",
    description: "What cookies and local storage printmyphoto uses and how to control them.",
  },
  faq: {
    title: "FAQ — printmyphoto",
    description:
      "Answers to common passport photo questions: sizes, how many photos fit on 4×6 or A4, background rules, printing at home and privacy.",
  },
  blog: {
    title: "Blog — printmyphoto",
    description:
      "Original guides on making, editing and printing passport photos: country sizes, 4×6 and A4 layouts, backgrounds and common mistakes.",
  },
  "blog-article": {
    title: "Blog Guide — printmyphoto",
    description: "Passport photo guides and printing tips from printmyphoto.",
  },
};

function setMetaDescription(description: string) {
  let el = document.querySelector('meta[name="description"]');
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", "description");
    document.head.appendChild(el);
  }
  el.setAttribute("content", description);
}

export function useHashRoute(): RouteMatch & { navigate: (to: string) => void } {
  const [match, setMatch] = useState<RouteMatch>(() =>
    typeof window === "undefined" ? { route: "home" } : parseHash(window.location.hash),
  );

  useEffect(() => {
    const apply = () => {
      const parsed = parseHash(window.location.hash);
      setMatch(parsed);
      const meta = ROUTE_META[parsed.route];
      if (meta) {
        document.title = meta.title;
        setMetaDescription(meta.description);
      }
      trackEvent("page_view", { route: parsed.route, param: parsed.param ?? "" });
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  const navigate = useCallback((to: string) => {
    const target = to.startsWith("#") ? to : `#${to.startsWith("/") ? to : `/${to}`}`;
    if (window.location.hash === target) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    window.location.hash = target;
    window.scrollTo({ top: 0 });
  }, []);

  return { ...match, navigate };
}
