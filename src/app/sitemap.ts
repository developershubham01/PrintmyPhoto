import type { MetadataRoute } from "next";
import { SITE } from "@/components/seo/JsonLd";
import { ALL_COUNTRIES } from "@/data/passport-sizes";
import { ARTICLES } from "@/content/blog/articles";

/**
 * Comprehensive sitemap for Google and other search engines.
 * Dynamically indexes all static pages, 35+ country size guides, and educational articles.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Core static pages
  const staticPaths: Array<{ path: string; priority: number; freq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" }> = [
    { path: "/", priority: 1.0, freq: "daily" },
    { path: "/passport-photo-maker", priority: 0.98, freq: "daily" },
    { path: "/editor", priority: 0.9, freq: "weekly" },
    { path: "/passport-photo-sizes", priority: 0.95, freq: "weekly" },
    { path: "/photo-printing-guide", priority: 0.9, freq: "weekly" },
    { path: "/how-it-works", priority: 0.85, freq: "weekly" },
    { path: "/faq", priority: 0.85, freq: "weekly" },
    { path: "/blog", priority: 0.85, freq: "daily" },
    { path: "/about", priority: 0.6, freq: "monthly" },
    { path: "/contact", priority: 0.6, freq: "monthly" },
    { path: "/privacy-policy", priority: 0.5, freq: "monthly" },
    { path: "/terms", priority: 0.5, freq: "monthly" },
    { path: "/disclaimer", priority: 0.5, freq: "monthly" },
    { path: "/cookie-policy", priority: 0.5, freq: "monthly" },
  ];

  const coreEntries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${SITE.url}${p.path}`,
    lastModified: now,
    changeFrequency: p.freq,
    priority: p.priority,
  }));

  // Country-specific guides (e.g. /passport-photo-sizes/united-states, /india, etc.)
  const countryEntries: MetadataRoute.Sitemap = ALL_COUNTRIES.map((c) => ({
    url: `${SITE.url}/passport-photo-sizes/${c.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  // Blog guides (e.g. /blog/print-passport-photos-on-4x6-paper, etc.)
  const blogEntries: MetadataRoute.Sitemap = ARTICLES.map((a) => ({
    url: `${SITE.url}/blog/${a.slug}`,
    lastModified: new Date(a.date),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...coreEntries, ...countryEntries, ...blogEntries];
}
