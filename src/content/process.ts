// src/content/process.ts
export interface ProcessStep {
  number: string;
  title: string;
  description: string;
  /** Relative length on the timeline, in percent. Steps should sum to 100. */
  length: number;
}

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Brief",
    description: "Goals, audience, references, and timeline.",
    length: 15,
  },
  {
    number: "02",
    title: "Script & story",
    description: "Hook, structure, and story beats.",
    length: 19,
  },
  {
    number: "03",
    title: "Visuals & voice",
    description: "Footage, AI visuals, voiceover, and music.",
    length: 21,
  },
  {
    number: "04",
    title: "Edit & polish",
    description: "Pacing, motion, sound, captions, and color.",
    length: 30,
  },
  {
    number: "05",
    title: "Delivery",
    description: "Final exports for every platform.",
    length: 15,
  },
];
