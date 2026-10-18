// src/components/hero/hero-scene.tsx
"use client";

import { motion, type MotionValue } from "motion/react";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { projects } from "@/content/projects";
import styles from "./hero.module.css";

interface HeroSceneProps {
  /** Optional showreel video element, rendered over the composition. */
  media?: ReactNode;
  /** Render the moving work reel. Off for the resting copy once the window takes over. */
  withReel?: boolean;
  /** Scroll-linked values, only supplied on the expanding window. */
  motionValues?: {
    thirds: MotionValue<number>;
    card: MotionValue<number>;
    cardY: MotionValue<number>;
  };
}

/** Every project still, in portfolio order. */
const stills = projects.flatMap((p) => (p.thumbnail ? [p.thumbnail] : []));

/** Three rows, each starting at a different project so no column repeats. */
const rows = [0, 2, 4].map((shift) => [...stills.slice(shift), ...stills.slice(0, shift)]);

const rowStyle: { className: string; style: CSSProperties }[] = [
  { className: `${styles.rowLeft} ${styles.rowDim}`, style: { "--dur": "95s", "--offset": "-30s" } as CSSProperties },
  { className: styles.rowRight, style: { "--dur": "80s", "--offset": "-12s" } as CSSProperties },
  { className: `${styles.rowLeft} ${styles.rowDim}`, style: { "--dur": "110s", "--offset": "-55s" } as CSSProperties },
];

/**
 * The opening composition, sized to the viewport and centred so the resting
 * frame and the expanded frame show the same picture. With project stills it is
 * a slow-moving reel of the work; without any, an abstract horizon.
 */
export function HeroScene({ media, withReel = true, motionValues }: HeroSceneProps) {
  const hasReel = stills.length > 0;

  return (
    <div className={styles.scene}>
      {hasReel ? (
        withReel && (
          <div aria-hidden="true" className={styles.reel}>
            {rows.map((row, r) => (
              <div key={r} className={`${styles.row} ${rowStyle[r].className}`} style={rowStyle[r].style}>
                {[...row, ...row].map((src, i) => (
                  <div key={`${src}-${i}`} className={styles.tile}>
                    <Image
                      src={src}
                      alt=""
                      fill
                      loading="eager"
                      sizes="(min-width: 2000px) 420px, (min-width: 715px) 21vw, 150px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )
      ) : (
        <div aria-hidden="true">
          <div className={styles.halo} />
          <div className={styles.sun} />
          <div className={styles.water} />
          <div className={styles.horizon} />
          <div className={styles.flare} />
        </div>
      )}
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
