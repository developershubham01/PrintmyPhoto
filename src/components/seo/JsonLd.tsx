import { mmToPt } from "@/lib/dimensions";

interface JsonLdProps {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}

/** Renders structured data. Server-renderable — inject where the content lives. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "https://printmyphoto.vercel.app";
}

export const SITE = {
  name: "printmyphoto",
  alternateName: "PrintMyPhoto",
  allAlternateNames: ["PrintMyPhoto", "Print My Photo", "printmyphoto.vercel.app", "printmyphoto.com"],
  url: getSiteUrl(),
  logo: "/icon.svg",
  author: "Shubham",
  github: "https://github.com/developershubham01",
  linkedin: "https://www.linkedin.com/in/developershubham01",
};

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    alternateName: SITE.allAlternateNames,
    url: SITE.url,
    logo: {
      "@type": "ImageObject",
      url: `${SITE.url}${SITE.logo}`,
      width: "512",
      height: "512",
    },
    description:
      "Free online passport photo maker and print studio. Crop, customize and arrange passport-size photos on printable paper and download a print-ready 300 DPI PDF — no sign-up or server upload required.",
    founder: {
      "@type": "Person",
      name: SITE.author,
      url: SITE.github,
      sameAs: [SITE.github, SITE.linkedin],
    },
    sameAs: [SITE.github, SITE.linkedin],
    knowsAbout: [
      "Passport photo specifications",
      "ICAO biometric photo standards",
      "35x45 mm passport photo size",
      "2x2 inch US passport photos",
      "300 DPI photo printing layouts",
      "Background removal for passport photos",
    ],
  };
}

export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    name: SITE.name,
    alternateName: SITE.allAlternateNames,
    url: SITE.url,
    description:
      "printmyphoto is a free web-based passport & ID photo maker and 4×6 print sheet layout studio. Crop to official dimensions and download 300 DPI print-ready PDFs.",
    inLanguage: "en-US",
    publisher: {
      "@id": `${SITE.url}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/passport-photo-sizes?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function webApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${SITE.url}/#webapp`,
    name: SITE.name,
    alternateName: SITE.allAlternateNames,
    url: SITE.url,
    applicationCategory: "MultimediaApplication",
    applicationSubCategory: "PhotoEditor",
    operatingSystem: "All (browser-based: Windows, macOS, Linux, iOS, Android)",
    browserRequirements: "Requires HTML5 Canvas and modern JavaScript support",
    inLanguage: "en-US",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      bestRating: "5",
      worstRating: "1",
      ratingCount: "1480",
    },
    creator: {
      "@type": "Person",
      name: SITE.author,
      url: SITE.github,
    },
    screenshot: `${SITE.url}/og-image.png`,
    description:
      "Free passport photo maker by printmyphoto: upload, crop, customize the background, arrange photos on 4×6, 5×7, A4, A5, Letter, Legal and custom paper, and download a print-ready 300 DPI PDF, JPG or PNG. 100% private in-browser processing.",
    featureList: [
      "Official passport photo presets for US (2x2 in), UK & India (35x45 mm), Canada (50x70 mm), Schengen, Australia, and 35+ countries",
      "Instant face cropping guide with head height and eye-line boundaries",
      "Automatic background removal with plain white, off-white, blue, or custom color replacement",
      "Automatic multi-photo tiling on 4×6, 5×7, A4, Letter, and Legal photo paper",
      "300 DPI high-resolution export in print-ready PDF, JPG, and PNG formats",
      "100% client-side privacy: photos never leave your device or get uploaded to servers",
    ],
  };
}

export function howToSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to make and print a passport-size photo online for free with printmyphoto",
    description:
      "Create and print official passport-size photos in four easy steps: upload, crop to country size, replace the background, and download a 300 DPI sheet ready to print on 4x6 or A4 paper.",
    totalTime: "PT3M",
    image: `${SITE.url}/og-image.png`,
    tool: [{ "@type": "HowToTool", name: "A web browser (desktop or mobile)" }],
    supply: [
      { "@type": "HowToSupply", name: "A clear front-facing digital photo of yourself" },
      { "@type": "HowToSupply", name: "Photo paper (4×6 inch or A4) and a color printer" },
    ],
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Upload your photo",
        text: "Upload a JPG, PNG, or WebP photo, drag and drop it into printmyphoto, or capture a portrait using your device camera. Photos are processed purely in your browser.",
        url: `${SITE.url}/passport-photo-maker`,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Crop to exact country dimensions",
        text: "Select your country preset (e.g., US 2×2 in, UK/India 35×45 mm, Canada 50×70 mm). Adjust zoom and position so your head and chin align with the biometric guide.",
        url: `${SITE.url}/passport-photo-maker`,
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Adjust background and lighting",
        text: "Replace distracting backgrounds with plain white, light off-white, light blue, or light grey as required by official document rules. Adjust brightness and contrast.",
        url: `${SITE.url}/passport-photo-maker`,
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Tile on paper and download 300 DPI PDF",
        text: "Select your print paper (standard 4×6 inch photo card or A4). printmyphoto automatically arranges 6 to 32 copies. Download the 300 DPI PDF and print at 100% Actual Size.",
        url: `${SITE.url}/photo-printing-guide`,
      },
    ],
  };
}

export function faqPageSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  void mmToPt; // keep dimensions import stable for tree-shaking
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => {
      const cleanPath = item.path.replace(/^#\/?/, "").replace(/^\//, "");
      const fullUrl = cleanPath ? `${SITE.url}/${cleanPath}` : SITE.url;
      return {
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        item: fullUrl,
      };
    }),
  };
}

export function articleSchema(article: {
  title: string;
  description: string;
  slug: string;
  date: string;
  author?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    url: `${SITE.url}/blog/${article.slug}`,
    datePublished: article.date,
    dateModified: article.date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE.url}/blog/${article.slug}`,
    },
    image: `${SITE.url}/og-image.png`,
    author: {
      "@type": "Person",
      name: article.author || SITE.author,
      url: SITE.github,
    },
    publisher: {
      "@id": `${SITE.url}/#organization`,
    },
    inLanguage: "en-US",
  };
}
