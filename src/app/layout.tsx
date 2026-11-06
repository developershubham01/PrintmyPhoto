import type { Metadata, Viewport } from "next";
import Script from "next/script";
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
    default: "printmyphoto — Free Passport & ID Photo Maker & Print Studio",
    template: "%s — printmyphoto",
  },
  description:
    "Create, customize and print passport-size photographs in minutes with printmyphoto. Upload your photo, choose your size, arrange copies on 4×6, A4 or Letter paper and download a print-ready 300 DPI PDF. Free, no sign-up, photos processed 100% in your browser.",
  keywords: [
    "printmyphoto",
    "free passport photo maker online",
    "passport size photo maker",
    "passport photo editor",
    "passport photo printing online",
    "make passport size photo at home",
    "passport photo 4x6 print",
    "passport photo A4 sheet",
    "passport photo background changer",
    "passport photo maker India",
    "US passport photo 2x2 online",
    "UK passport photo 35x45 mm",
    "Canada passport photo 50x70 mm",
    "Schengen visa photo maker",
    "digital passport photo free",
    "biometric passport photo maker",
    "print passport photos Walmart Walgreens CVS",
    "300 DPI passport photo PDF",
    "id photo maker online free",
    "visa photo size requirements",
    "white background photo editor online",
  ],
  applicationName: SITE.name,
  authors: [
    { name: "Shubham Sharma", url: "https://github.com/developershubham01" },
    { name: SITE.name, url: SITE.url },
  ],
  creator: "Shubham (developershubham01)",
  publisher: SITE.name,
  alternates: {
    canonical: SITE.url,
  },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: "printmyphoto — Free Passport Photo Maker & Print Studio",
    description:
      "Crop, customize and arrange passport-size photos on printable paper. Download a print-ready 300 DPI PDF — free, no sign-up, processed in your browser.",
    url: SITE.url,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "printmyphoto" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "printmyphoto — Free Passport Photo Maker & Print Studio",
    description:
      "Create and print passport-size photos in minutes with printmyphoto. Free, no sign-up, browser-side processing.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  category: "photography",
  verification: {
    google: "AuouB7FfoY0LntvW6UFh5Dz1xMnz8XbJoLT9hAtmtwY",
  },
  other: {
    "google-adsense-account": "ca-pub-2733238354385302",
  },
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
        {/* Google Tag Manager (noscript fallback) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MSDBP6K9"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <ThemeProvider>
          {children}
          <Toaster position="bottom-center" richColors closeButton />
        </ThemeProvider>
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtm.js?id=GTM-MSDBP6K9"
        />
        <Script id="gtm-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          `}
        </Script>
        {/* Google AdSense */}
        <Script
          id="google-adsense"
          strategy="afterInteractive"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-2733238354385302"}`}
          crossOrigin="anonymous"
        />
        <JsonLd data={organizationSchema()} />
        <JsonLd data={webSiteSchema()} />
        <JsonLd data={webApplicationSchema()} />
      </body>
    </html>
  );
}
