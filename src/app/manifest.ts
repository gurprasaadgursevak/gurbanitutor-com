import type { MetadataRoute } from "next";

/**
 * Web App Manifest. Telling Chrome/Edge/Android/iOS Safari that this site can
 * be installed to the home screen and launched as a standalone app.
 *
 * Served at /manifest.webmanifest automatically by Next.js.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Gurbani Tutor",
    short_name: "Gurbani Tutor",
    description:
      "A learning companion for Gurbani. Read Sri Guru Granth Sahib Ji and Sri Dasam Guru Granth Sahib Ji, study Arths, track daily Nitnem and Simran, and learn Santhiya.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fffbeb",
    theme_color: "#b45309",
    categories: ["education", "books", "lifestyle"],
    icons: [
      {
        src: "/app-icon.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/app-icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/app-icon.png",
        sizes: "1024x1024",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Gurbani Search",
        short_name: "Search",
        description: "Search Sri Guru Granth Sahib Ji and Sri Dasam Guru Granth Sahib Ji",
        url: "/search",
      },
      {
        name: "Arths Dictionary",
        short_name: "Arths",
        description: "Browse Gurbani words and meanings",
        url: "/arths",
      },
      {
        name: "Sri Pothi Sahib",
        short_name: "Pothi",
        description: "Read free Pothis",
        url: "/pothi",
      },
      {
        name: "Santhiya Classes",
        short_name: "Santhiya",
        description: "Join the WhatsApp group and learn Santhiya",
        url: "/santhiya",
      },
    ],
  };
}
