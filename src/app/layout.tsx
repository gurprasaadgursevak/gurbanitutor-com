import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gurbani Tutor — A learning companion for Gurbani",
  description:
    "Read Sri Guru Granth Sahib Ji and Sri Guru Dasam Granth Sahib Ji, track daily Nitnem, count Simran on a mala, take Gurbani Abhiyaas challenges, and study the Gurmukhi dictionary. Free on iPhone.",
  openGraph: {
    title: "Gurbani Tutor",
    description: "A learning companion for Gurbani. Free on iPhone.",
    url: "https://gurbanitutor.com",
    siteName: "Gurbani Tutor",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
