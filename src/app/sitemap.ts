import type { MetadataRoute } from "next";
import { SITE } from "@/components/seo/JsonLd";

/**
 * The studio ships as a single Next.js route with virtual (hash) pages in sandbox
 * previews; in production each virtual page maps 1:1 to a real path below.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths: Array<{ path: string; priority: number; freq: "daily" | "weekly" | "monthly" }> = [
    { path: "/", priority: 1, freq: "weekly" },
    { path: "/passport-photo-maker", priority: 0.95, freq: "weekly" },
    { path: "/passport-photo-sizes", priority: 0.9, freq: "monthly" },
    { path: "/photo-printing-guide", priority: 0.8, freq: "monthly" },
    { path: "/how-it-works", priority: 0.7, freq: "monthly" },
    { path: "/blog", priority: 0.8, freq: "weekly" },
    { path: "/faq", priority: 0.7, freq: "monthly" },
    { path: "/about", priority: 0.5, freq: "monthly" },
    { path: "/contact", priority: 0.5, freq: "monthly" },
    { path: "/privacy-policy", priority: 0.4, freq: "monthly" },
    { path: "/terms", priority: 0.4, freq: "monthly" },
    { path: "/disclaimer", priority: 0.4, freq: "monthly" },
    { path: "/cookie-policy", priority: 0.4, freq: "monthly" },
  ];
  return paths.map((p) => ({
    url: `${SITE.url}${p.path}`,
    lastModified: now,
    changeFrequency: p.freq,
    priority: p.priority,
  }));
}
