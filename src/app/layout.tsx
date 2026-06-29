import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Sans_Gurmukhi } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import ServiceWorkerRegistration from "./ServiceWorkerRegistration";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Same font the iOS app bundles (NotoSansGurmukhi-Regular/Bold). Loaded
// site-wide so any [lang="pa"] element renders identically across web and
// app.
const notoGurmukhi = Noto_Sans_Gurmukhi({
  variable: "--font-noto-gurmukhi",
  subsets: ["gurmukhi", "latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gurbanitutor.com"),
  title: "Gurbani Tutor · A learning companion for Gurbani",
  description:
    "Read Sri Guru Granth Sahib Ji and Sri Dasam Guru Granth Sahib Ji, track daily Nitnem, count Simran on a mala, take Gurbani Abhiyaas challenges, and study the Gurmukhi dictionary. Free on iPhone.",
  icons: {
    icon: [{ url: "/app-icon.png", type: "image/png" }],
    apple: [{ url: "/app-icon.png" }],
    shortcut: ["/app-icon.png"],
  },
  openGraph: {
    title: "Gurbani Tutor",
    description: "A learning companion for Gurbani. Free on iPhone.",
    url: "https://gurbanitutor.com",
    siteName: "Gurbani Tutor",
    type: "website",
    images: [{ url: "/app-icon.png", width: 1024, height: 1024 }],
  },
  appleWebApp: {
    capable: true,
    title: "Gurbani Tutor",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#b45309",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-gurmukhi-font="guruGranthUni"
      className={`${geistSans.variable} ${geistMono.variable} ${notoGurmukhi.variable} h-full antialiased`}
    >
      <head>
        {/* Apply the Sangat's stored Gurmukhi-font choice before first paint
            so users who explicitly picked Noto don't see a flash of
            GuruGranthUni (the new site default). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var f=localStorage.getItem('gurmukhi_font');if(f==='notoSans'||f==='guruGranthUni'){document.documentElement.dataset.gurmukhiFont=f;}}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <ServiceWorkerRegistration />
        {/* Vercel Web Analytics — cookieless, no PII collection. Shows
            pageviews, top pages, and referrers in the Vercel dashboard. */}
        <Analytics />
      </body>
    </html>
  );
}
