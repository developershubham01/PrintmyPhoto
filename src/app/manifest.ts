import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "printmyphoto — Free Passport & ID Photo Maker",
    short_name: "printmyphoto",
    description:
      "Free passport photo maker: crop photos to official country sizes, customize backgrounds, and tile on 4×6 or A4 sheets for high-quality 300 DPI printing.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f5ed",
    theme_color: "#2c471b",
    categories: ["photography", "utilities", "productivity"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
