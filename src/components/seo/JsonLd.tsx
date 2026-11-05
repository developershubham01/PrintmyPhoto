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

export const SITE = {
  name: "printmyphoto",
  alternateName: "PrintMyPhoto",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://printmyphoto.com",
  logo: "/icon.svg",
};

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    alternateName: SITE.alternateName,
    url: SITE.url,
    logo: `${SITE.url}${SITE.logo}`,
    description:
      "Free online passport photo maker and print studio. Crop, customize and arrange passport-size photos on printable paper and download a print-ready PDF — no account required.",
    sameAs: [
      "https://github.com/developershubham01",
      "https://www.linkedin.com/in/developershubham01",
    ],
  };
}

export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.url}/passport-photo-sizes?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function webApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE.name,
    url: SITE.url,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any (browser-based)",
    browserRequirements: "Requires a modern browser with HTML5 Canvas support",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    creator: {
      "@type": "Person",
      name: "Shubham",
      url: "https://github.com/developershubham01",
    },
    description:
      "Free passport photo maker: upload, crop, customize the background, arrange photos on 4×6, A4, Letter and other paper sizes, and download a print-ready 300 DPI PDF, JPG or PNG. No sign-up; photos are processed locally in your browser.",
    featureList: [
      "Passport photo cropping with country presets",
      "Brightness, contrast and saturation adjustments",
      "Approximate automatic background removal with color replacement",
      "Automatic photo arrangement on 4×6, 5×7, A4, A5, Letter, Legal and custom paper",
      "300 DPI print-ready PDF, JPG and PNG export",
    ],
  };
}

export function howToSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to make a passport-size photo online for free",
    description:
      "Create and print a passport-size photo in four steps: upload, crop to your country's size, customize the background, and download a print-ready sheet.",
    totalTime: "PT3M",
    tool: [{ "@type": "HowToTool", name: "A web browser" }],
    supply: [{ "@type": "HowToSupply", name: "A digital photo of yourself" }],
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Upload your photo",
        text: "Upload a JPG, PNG or WebP photo, drag and drop it, or capture one with your camera. Photos stay on your device.",
        url: `${SITE.url}/#how-it-works`,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Crop and adjust",
        text: "Zoom, drag and rotate until your head is correctly positioned inside the photo frame, then fine-tune brightness and contrast.",
        url: `${SITE.url}/#how-it-works`,
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Choose size and background",
        text: "Pick your country's passport photo size (or custom dimensions) and optionally replace the background with a plain color.",
        url: `${SITE.url}/#how-it-works`,
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Print or download",
        text: "The tool arranges multiple copies on your paper size, then you download a 300 DPI PDF or image and print at actual size.",
        url: `${SITE.url}/#how-it-works`,
      },
    ],
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  void mmToPt; // keep dimensions import stable for tree-shaking
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE.url}/#${item.path}`,
    })),
  };
}
