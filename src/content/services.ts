// src/content/services.ts
import type { ProjectFormat } from "./projects";

/** A clip on the illustrative timeline: [start %, length %]. */
export type Clip = readonly [number, number];

export interface Lane {
  name: "V2" | "V1" | "A1" | "A2";
  role: string;
  clips: Clip[];
}

export interface Service {
  id: string;
  number: string;
  title: string;
  /** One word the edit is built to do, shown large on the stage. */
  verb: string;
  description: string;
  deliverables: string[];
  format: ProjectFormat;
  lanes: Lane[];
}

export const services: Service[] = [
  {
    id: "faceless",
    number: "01",
    title: "Faceless YouTube & channel automation",
    verb: "Narrate",
    description: "Script, voice, and visuals, built on a template that keeps every episode consistent.",
    deliverables: ["Scripting", "AI voiceover", "Stock and AI visuals", "Series templates"],
    format: "16:9",
    lanes: [
      { name: "V2", role: "Graphics", clips: [[4, 6], [17, 5], [29, 8], [45, 5], [57, 9], [73, 6], [86, 8]] },
      {
        name: "V1",
        role: "B-roll",
        clips: [[0, 9], [9, 7], [16, 11], [27, 6], [33, 10], [43, 8], [51, 12], [63, 7], [70, 9], [79, 11], [90, 10]],
      },
      { name: "A1", role: "Voiceover", clips: [[0, 48], [49, 51]] },
      { name: "A2", role: "Music", clips: [[0, 100]] },
    ],
  },
  {
    id: "documentary",
    number: "02",
    title: "Documentary & storytelling",
    verb: "Unfold",
    description: "Interviews, archive, narration, and score cut into a story that holds to the last frame.",
    deliverables: ["Story structure", "Interview and archive", "Sound and score", "Color and titles"],
    format: "2.39:1",
    lanes: [
      { name: "V2", role: "Titles", clips: [[6, 10], [54, 9]] },
      { name: "V1", role: "Picture", clips: [[0, 21], [21, 31], [52, 17], [69, 31]] },
      { name: "A1", role: "Interview", clips: [[2, 44], [52, 46]] },
      { name: "A2", role: "Score", clips: [[10, 90]] },
    ],
  },
  {
    id: "ugc",
    number: "03",
    title: "UGC, product reviews & explainers",
    verb: "Show",
    description: "Clear hooks and product moments that read at a glance, plus AI-assisted UGC variations.",
    deliverables: ["Hook variations", "Product demos", "Captions and callouts", "AI-assisted UGC"],
    format: "4:5",
    lanes: [
      { name: "V2", role: "Captions", clips: [[0, 12], [13, 10], [24, 14], [39, 12], [52, 10], [63, 14], [78, 10], [89, 11]] },
      { name: "V1", role: "Picture", clips: [[0, 38], [38, 16], [54, 21], [75, 25]] },
      { name: "A1", role: "Voice", clips: [[0, 100]] },
      { name: "A2", role: "SFX", clips: [[2, 3], [38, 3], [54, 3], [75, 3], [95, 3]] },
    ],
  },
  {
    id: "shorts",
    number: "04",
    title: "YouTube Shorts, TikTok & Reels",
    verb: "Hook",
    description: "Vertical edits paced for the scroll, with fast openings and animated captions.",
    deliverables: ["Long-form to vertical", "Animated captions", "Hooks and loops", "Batch delivery"],
    format: "9:16",
    lanes: [
      {
        name: "V2",
        role: "Captions",
        clips: [[0, 7], [8, 6], [15, 8], [24, 6], [31, 7], [39, 6], [46, 8], [55, 6], [62, 7], [70, 6], [77, 8], [86, 6], [93, 7]],
      },
      {
        name: "V1",
        role: "Picture",
        clips: [[0, 5], [5, 4], [9, 7], [16, 5], [21, 6], [27, 4], [31, 8], [39, 5], [44, 6], [50, 4], [54, 7], [61, 5], [66, 6], [72, 4], [76, 8], [84, 5], [89, 6], [95, 5]],
      },
      { name: "A1", role: "Voice", clips: [[0, 100]] },
      { name: "A2", role: "Music", clips: [[0, 100]] },
    ],
  },
];
