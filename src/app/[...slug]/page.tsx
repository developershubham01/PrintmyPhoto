import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import {
  JsonLd,
  SITE,
  howToSchema,
  faqPageSchema,
  breadcrumbSchema,
  articleSchema,
} from "@/components/seo/JsonLd";
import { ROUTE_META, parsePath } from "@/lib/routes";
import { findCountry } from "@/data/passport-sizes";
import { getArticle } from "@/content/blog/articles";
import { FAQS } from "@/data/faqs";

interface CatchAllPageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateMetadata({
  params,
}: CatchAllPageProps): Promise<Metadata> {
  const { slug } = await params;
  const path = "/" + (slug?.join("/") || "");
  const match = parsePath(path);
  const canonicalUrl = `${SITE.url}${path}`;

  let title = "printmyphoto — Free Passport Photo Maker & Print Studio";
  let description =
    "Create, customize and print passport-size photographs in minutes with printmyphoto. Free, no sign-up, processed 100% in your browser.";

  if (match.route === "country" && match.param) {
    const country = findCountry(match.param);
    if (country) {
      const primarySize = country.sizes[0];
      const sizeStr = primarySize
        ? primarySize.widthMm === 50.8 && primarySize.heightMm === 50.8
          ? "2×2 Inch (51×51 mm)"
          : `${primarySize.widthMm}×${primarySize.heightMm} mm`
        : "";
      title = `${country.name} Passport Photo Size ${sizeStr} & Requirements — printmyphoto`;
      description = `Official ${country.name} passport photo size requirements (${sizeStr}), background rules, and free 300 DPI 4×6 print sheet layout on printmyphoto.`;
    }
  } else if (match.route === "blog-article" && match.param) {
    const article = getArticle(match.param);
    if (article) {
      title = `${article.title} — printmyphoto`;
      description = article.description;
    }
  } else if (ROUTE_META[match.route]) {
    title = ROUTE_META[match.route].title;
    description = ROUTE_META[match.route].description;
  }

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: match.route === "blog-article" ? "article" : "website",
      siteName: SITE.name,
      title,
      description,
      url: canonicalUrl,
      images: [
        {
          url: `${SITE.url}/og-image.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE.url}/og-image.png`],
    },
  };
}

export default async function CatchAllPage({ params }: CatchAllPageProps) {
  const { slug } = await params;
  const path = "/" + (slug?.join("/") || "");
  const match = parsePath(path);

  // Dynamic breadcrumbs
  const breadcrumbs: Array<{ name: string; path: string }> = [
    { name: "Home", path: "/" },
  ];

  let specificSchema: Record<string, unknown> | null = null;

  if (match.route === "country" && match.param) {
    const country = findCountry(match.param);
    breadcrumbs.push({ name: "Passport Photo Sizes", path: "/passport-photo-sizes" });
    if (country) {
      breadcrumbs.push({ name: country.name, path });
    }
  } else if (match.route === "blog-article" && match.param) {
    const article = getArticle(match.param);
    breadcrumbs.push({ name: "Blog", path: "/blog" });
    if (article) {
      breadcrumbs.push({ name: article.title, path });
      specificSchema = articleSchema({
        title: article.title,
        description: article.description,
        slug: article.slug,
        date: article.date,
      });
    }
  } else if (match.route === "faq") {
    breadcrumbs.push({ name: "FAQ", path: "/faq" });
    specificSchema = faqPageSchema(FAQS);
  } else if (match.route === "sizes") {
    breadcrumbs.push({ name: "Passport Photo Sizes", path: "/passport-photo-sizes" });
  } else if (match.route === "printing-guide") {
    breadcrumbs.push({ name: "Photo Printing Guide", path: "/photo-printing-guide" });
  } else if (match.route === "how-it-works") {
    breadcrumbs.push({ name: "How It Works", path: "/how-it-works" });
  } else if (match.route === "maker" || match.route === "editor") {
    breadcrumbs.push({ name: "Passport Photo Maker", path: "/passport-photo-maker" });
  } else if (ROUTE_META[match.route]) {
    breadcrumbs.push({ name: ROUTE_META[match.route].title.split(" — ")[0], path });
  }

  return (
    <>
      <AppShell />
      <JsonLd data={howToSchema()} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      {specificSchema && <JsonLd data={specificSchema} />}
    </>
  );
}
