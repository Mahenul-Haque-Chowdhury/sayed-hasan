// src/content/site.ts
// Site-wide identity, links, portrait, and optional showreel.
import type { StaticImageData } from "next/image";
import portraitImage from "../../public/sayed-hasan-from-editsbysayed.jpg";

export interface Portrait {
  /** Static import (gives automatic size + blur placeholder) or a /public path. */
  src: StaticImageData;
  alt: string;
}

export interface Showreel {
  /**
   * Direct video file URL (.mp4 / .webm), e.g. "/showreel.mp4".
   * When set, it plays muted and looped inside the hero frame, with
   * pause and sound controls. Leave null for the designed composition.
   */
  videoUrl: string | null;
  /** Optional still frame shown before the video loads. */
  poster: string | null;
}

export interface Credential {
  value: string;
  label: string;
}

export interface SiteConfig {
  name: string;
  wordmark: string;
  role: string;
  upworkUrl: string;
  /** Set to null to fall back to the typographic portrait slot. */
  portrait: Portrait | null;
  showreel: Showreel;
  credentials: Credential[];
}

export const site: SiteConfig = {
  name: "Sayed Hasan",
  wordmark: "SAYED HASAN",
  role: "Video editor",
  upworkUrl: "https://www.upwork.com/freelancers/~015317c3bb29fc4926",
  portrait: {
    src: portraitImage,
    alt: "Sayed Hasan in a beige blazer and black shirt, standing on a tree-lined path.",
  },
  showreel: {
    videoUrl: null,
    poster: null,
  },
  credentials: [
    { value: "850+", label: "Hours of editing experience" },
    { value: "100%", label: "Job Success" },
    { value: "Top Rated", label: "Status on Upwork" },
  ],
};

export interface Chapter {
  id: string;
  number: string;
  label: string;
  nav: string;
}

export const chapters: Chapter[] = [
  { id: "work", number: "01", label: "Selected work", nav: "Work" },
  { id: "services", number: "02", label: "Services", nav: "Services" },
  { id: "about", number: "03", label: "Meet Sayed", nav: "About" },
  { id: "process", number: "04", label: "The process", nav: "Process" },
  { id: "contact", number: "05", label: "Contact", nav: "Contact" },
];

export const openingChapter: Chapter = {
  id: "top",
  number: "00",
  label: "Opening",
  nav: "Top",
};
