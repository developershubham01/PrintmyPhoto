import type { Metadata, Viewport } from "next";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/archivo";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import {
  JsonLd,
  SITE,
  organizationSchema,
  webApplicationSchema,
  webSiteSchema,
} from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Free Passport Photo Maker & Print Studio — Create & Print Photos",
    template: "%s — Passport Photo Print Studio",
  },
  description:
    "Create, customize and print passport-size photographs in minutes. Upload your photo, choose your size, arrange copies on 4×6, A4 or Letter paper and download a print-ready 300 DPI PDF. Free, no sign-up, photos processed in your browser.",
  keywords: [
    "free passport photo maker online",
    "passport size photo maker",
    "passport photo editor",
    "passport photo printing online",
    "make passport size photo at home",
    "passport photo 4x6 print",
    "passport photo A4 sheet",
    "passport photo background changer",
    "passport photo maker India",
  ],
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: "Free Passport Photo Maker & Print Studio",
    description:
      "Crop, customize and arrange passport-size photos on printable paper. Download a print-ready 300 DPI PDF — free, no sign-up, processed in your browser.",
    url: SITE.url,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Passport Photo Print Studio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Passport Photo Maker & Print Studio",
    description:
      "Create and print passport-size photos in minutes. Free, no sign-up, browser-side processing.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  category: "photography",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f5ed" },
    { media: "(prefers-color-scheme: dark)", color: "#17130e" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          {children}
          <Toaster position="bottom-center" richColors closeButton />
        </ThemeProvider>
        <JsonLd data={organizationSchema()} />
        <JsonLd data={webSiteSchema()} />
        <JsonLd data={webApplicationSchema()} />
      </body>
    </html>
  );
}
