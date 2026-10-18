// src/components/motion-provider.tsx
"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Motion components drop transform animations when the OS asks for reduced motion. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
