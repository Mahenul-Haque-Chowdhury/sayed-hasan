// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist_Mono, Mona_Sans } from "next/font/google";
import { MotionProvider } from "@/components/motion-provider";
import { SiteHeader } from "@/components/site-header";
import { SmoothScroll } from "@/components/smooth-scroll";
import "lenis/dist/lenis.css";
import "./globals.css";

/** One variable superfamily: condensed for display, normal width for reading. */
const sans = Mona_Sans({
  subsets: ["latin"],
  axes: ["wdth"],
  style: ["normal", "italic"],
  variable: "--font-mona",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const description =
  "Sayed Hasan is a video editor for YouTube creators, brands, and storytellers: faceless channels, documentaries, AI-powered UGC, product reviews, Shorts, and Reels. Human craft, accelerated by AI.";

export const metadata: Metadata = {
  title: "Sayed Hasan · Video Editor for YouTube, Documentaries & Brands",
  description,
  applicationName: "Sayed Hasan",
  authors: [{ name: "Sayed Hasan" }],
  keywords: [
    "video editor",
    "YouTube video editor",
    "faceless YouTube",
    "documentary editor",
    "UGC video editing",
    "YouTube Shorts editor",
    "Reels editor",
    "Sayed Hasan",
  ],
  openGraph: {
    type: "website",
    title: "Sayed Hasan · Video Editor",
    description,
    siteName: "Sayed Hasan",
  },
  twitter: {
    card: "summary",
    title: "Sayed Hasan · Video Editor",
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0a09",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <MotionProvider>
          <SmoothScroll />
          <SiteHeader />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
