// src/components/hero/hero-scene.tsx
"use client";

import { motion, type MotionValue } from "motion/react";
import type { ReactNode } from "react";
import styles from "./hero.module.css";

interface HeroSceneProps {
  /** Optional showreel video element, rendered over the composition. */
  media?: ReactNode;
  /** Scroll-linked values, only supplied on the expanding window. */
  motionValues?: {
    thirds: MotionValue<number>;
    card: MotionValue<number>;
    cardY: MotionValue<number>;
  };
}

/**
 * Abstract cinematic composition: a sun cut by the horizon, anamorphic flare,
 * thirds guides. Sized to the viewport and centred, so the resting frame and the
 * expanded frame show the same picture.
 */
export function HeroScene({ media, motionValues }: HeroSceneProps) {
  return (
    <div className={styles.scene}>
      <div aria-hidden="true">
        <div className={styles.halo} />
        <div className={styles.sun} />
        <div className={styles.water} />
        <div className={styles.horizon} />
        <div className={styles.flare} />
      </div>
      {media}
      <div aria-hidden="true">
        <motion.div className={styles.thirds} style={motionValues ? { opacity: motionValues.thirds } : undefined} />
        <div className={styles.vignette} />
        <div className="grain absolute inset-0" />
      </div>

      {motionValues && (
        <motion.div aria-hidden="true" style={{ opacity: motionValues.card }}>
          <div className={styles.cardScrim} />
          <motion.div
            style={{ y: motionValues.cardY }}
            className="absolute inset-x-0 bottom-0 px-[var(--gutter)] pb-[max(2.5rem,8svh)]"
          >
            <p className="display heading-xl text-ivory">
              Scroll through
              <br />
              <em>the edit</em>
              <span className="text-ember">.</span>
            </p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
