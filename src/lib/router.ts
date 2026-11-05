"use client";

import { useCallback, useEffect, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics";
import {
  type RouteId,
  type RouteMatch,
  type RouteMeta,
  ROUTE_META,
  parsePath,
  parseHash,
  PATH_TO_ROUTE,
} from "./routes";

// Re-export pure types and helpers for client consumers
export type { RouteId, RouteMatch, RouteMeta };
export { ROUTE_META, parsePath, parseHash, PATH_TO_ROUTE };

function setMetaDescription(description: string) {
  if (typeof document === "undefined") return;
  let el = document.querySelector('meta[name="description"]');
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", "description");
    document.head.appendChild(el);
  }
  el.setAttribute("content", description);
}

export function useAppRoute(): RouteMatch & { navigate: (to: string) => void } {
  const pathname = usePathname();
  const router = useRouter();
  const [, startTransition] = useTransition();

  // Redirect legacy hash URLs (e.g. `/#/faq` -> `/faq`) without reloading
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash.startsWith("#/")) {
      const cleanPath = window.location.hash.replace(/^#/, "");
      window.history.replaceState(null, "", cleanPath);
      startTransition(() => {
        router.replace(cleanPath);
      });
    }
  }, [router]);

  const match = parsePath(pathname || "/");

  useEffect(() => {
    const meta = ROUTE_META[match.route];
    if (meta && typeof document !== "undefined") {
      document.title = meta.title;
      setMetaDescription(meta.description);
    }
    trackEvent("page_view", { route: match.route, param: match.param ?? "" });
  }, [match.route, match.param]);

  const navigate = useCallback(
    (to: string) => {
      let target = to;
      if (target.startsWith("#/")) {
        target = target.replace(/^#/, "");
      } else if (target.startsWith("#")) {
        target = target.replace(/^#/, "/");
      } else if (!target.startsWith("/")) {
        target = `/${target}`;
      }

      if (pathname === target) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      startTransition(() => {
        router.push(target);
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [pathname, router],
  );

  return { ...match, navigate };
}

export const useHashRoute = useAppRoute;
