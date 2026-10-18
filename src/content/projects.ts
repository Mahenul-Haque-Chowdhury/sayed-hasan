// src/content/projects.ts
// ─────────────────────────────────────────────────────────────────────────────
// Selected work: the single source of truth for portfolio projects.
//
// To add or update a project:
//   1. Set `title`, `category`, `channel`, and `description`.
//   2. Add a `thumbnail` (put the image in /public/work/ and use "/work/name.jpg").
//   3. Set `videoUrl`: a YouTube link (recommended), a Vimeo link, a Google Drive
//      file link shared as "Anyone with the link", or a direct .mp4/.webm file.
//   4. Set `status` to "published".
//
// A project only becomes playable when status is "published" AND videoUrl is set.
// Anything else renders the designed "Project preview coming soon" state.
// ─────────────────────────────────────────────────────────────────────────────

export type ProjectFormat = "16:9" | "2.39:1" | "4:5" | "9:16";
export type ProjectStatus = "coming-soon" | "published";
/** Designed artwork used while a project has no thumbnail. */
export type PosterStyle = "faceless" | "documentary" | "product" | "vertical";

export interface Project {
  id: string;
  title: string;
  category: string;
  /** Channel or client the video was published by, or null. */
  channel: string | null;
  description: string;
  format: ProjectFormat;
  /** Running time shown on the card, e.g. "11:37", or null. */
  duration: string | null;
  /** Image path in /public (e.g. "/work/doc-still.jpg") or null. */
  thumbnail: string | null;
  /** YouTube, Vimeo, Google Drive, or direct video file URL, or null. */
  videoUrl: string | null;
  status: ProjectStatus;
  /** Placeholder artwork style, used only when there is no thumbnail. */
  poster?: PosterStyle;
}

export const projects: Project[] = [
  {
    id: "tasty-origins-new-orleans",
    title: "New Orleans Built Drinking Into The City",
    category: "History documentary",
    channel: "Tasty Origins",
    description: "An 11-minute story about the city's drinking culture, cut for narration and pace.",
    format: "16:9",
    duration: "11:37",
    thumbnail: "/work/tasty-origins-new-orleans.jpg",
    videoUrl: "https://www.youtube.com/watch?v=9oiub8l94LA",
    status: "published",
  },
  {
    id: "combatant-cartel-brock-lesnar",
    title: "What If Brock Lesnar Never Left WWE in 2004",
    category: "Sports storytelling",
    channel: "The Combatant Cartel",
    description: "An alternate-history wrestling story built on narration and wrestling footage.",
    format: "16:9",
    duration: "5:02",
    thumbnail: "/work/combatant-cartel-brock-lesnar.jpg",
    videoUrl: "https://www.youtube.com/watch?v=IB_fUC1LmGo",
    status: "published",
  },
  {
    id: "rise-of-nintendo",
    title: "The Rise of Nintendo",
    category: "Gaming documentary",
    channel: null,
    description: "A gaming-history story with kinetic type, 3D shots, and data graphics.",
    format: "16:9",
    duration: "10:47",
    thumbnail: "/work/rise-of-nintendo.jpg",
    videoUrl: "https://drive.google.com/file/d/1sdQfeS-KS927NdtzesoRd_EIeMqhPMSZ/view",
    status: "published",
  },
  {
    id: "street-blueprint-burglar-vans",
    title: "10 Signs Burglars Leave on Vans They Plan to Rob",
    category: "Faceless explainer",
    channel: "Street Blueprint",
    description: "A 15-minute faceless explainer carried by voiceover and visuals.",
    format: "16:9",
    duration: "15:15",
    thumbnail: "/work/street-blueprint-burglar-vans.jpg",
    videoUrl: "https://www.youtube.com/watch?v=4Og7Ys4iJsA",
    status: "published",
  },
  {
    id: "gta-3-history",
    title: "GTA 3",
    category: "Gaming documentary",
    channel: null,
    description: "Archive interviews, early builds, and gameplay cut into a gaming-history story.",
    format: "16:9",
    duration: "8:12",
    thumbnail: "/work/gta-3-history.jpg",
    videoUrl: "https://drive.google.com/file/d/19QphgCR3fXIIl5MryZ7szNdfSBAu6nw4/view",
    status: "published",
  },
  {
    id: "wnba-commentary",
    title: "WNBA Commentary",
    category: "Creator commentary",
    channel: null,
    description: "A framed talking-head host with animated captions and fast B-roll.",
    format: "16:9",
    duration: "0:40",
    thumbnail: "/work/wnba-commentary.jpg",
    videoUrl: "https://drive.google.com/file/d/1_QoQ9EBWeuC4kXgFPYyWbHEaEYurciOO/view",
    status: "published",
  },
];

export const formatLabel: Record<ProjectFormat, string> = {
  "16:9": "16:9 · Landscape",
  "2.39:1": "2.39:1 · Scope",
  "4:5": "4:5 · Feed",
  "9:16": "9:16 · Vertical",
};

export function isPlayable(project: Project): boolean {
  return project.status === "published" && Boolean(project.videoUrl);
}
