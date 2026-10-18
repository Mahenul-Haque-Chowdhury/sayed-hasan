// src/components/services/service-stage.tsx
"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";
import type { Lane, Service } from "@/content/services";
import styles from "./service-stage.module.css";

const ratio: Record<Service["format"], string> = {
  "16:9": "16 / 9",
  "2.39:1": "2.39 / 1",
  "4:5": "4 / 5",
  "9:16": "9 / 16",
};

const laneClass: Record<Lane["name"], string> = {
  V2: styles.clipGfx,
  V1: styles.clipPicture,
  A1: styles.clipVoice,
  A2: styles.clipMusic,
};

const glowAt = ["30% 70%", "72% 62%", "50% 30%", "60% 80%"];

interface ServiceStageProps {
  service: Service;
  compact?: boolean;
}

/** A viewer monitor plus an illustrative timeline for the selected service. */
export function ServiceStage({ service, compact = false }: ServiceStageProps) {
  const reduceMotion = useReducedMotion();
  const index = Number(service.number) - 1;

  return (
    <div className="radius-ui overflow-hidden border border-line bg-ink-2">
      {/* Viewer */}
      <div className={`${styles.monitor} relative aspect-video overflow-hidden bg-ink`}>
        <AnimatePresence initial={false}>
          <motion.div
            key={service.id}
            className="absolute inset-0"
            initial={reduceMotion ? { opacity: 0 } : { clipPath: "inset(0 0 0 100%)" }}
            animate={reduceMotion ? { opacity: 1 } : { clipPath: "inset(0 0 0 0%)" }}
            exit={{ opacity: 0, transition: { duration: 0.01, delay: reduceMotion ? 0 : 0.6 } }}
            transition={{ duration: 0.6, ease: [0.83, 0, 0.17, 1] }}
          >
            <div
              aria-hidden="true"
              className={styles.screen}
              style={{ "--ar": ratio[service.format], "--glow": glowAt[index % glowAt.length] } as CSSProperties}
            >
              <div className={styles.guide}>
                <span className={`${styles.guideLabel} eyebrow`}>{service.format}</span>
              </div>
              <p className={`${styles.verb} display`}>
                <em>{service.verb}</em>
                <span className="text-ember">.</span>
              </p>
              <div className="grain absolute inset-0" />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Timeline */}
      <div
        role="img"
        aria-label={`Illustrative timeline for ${service.title}: ${service.lanes
          .map((l) => `${l.name} ${l.role}`)
          .join(", ")}.`}
        className={`relative ${compact ? "px-3 py-3" : "px-4 py-4 md:px-5"}`}
      >
        <div aria-hidden="true" className={styles.tracks}>
          <div className={styles.ruler} />
          {service.lanes.map((lane, laneIndex) => (
            <div key={lane.name} className={styles.lane}>
              <span className={`${styles.laneLabel} eyebrow`}>
                <span className="text-ivory">{lane.name}</span>
              </span>
              <div className={styles.track}>
                {lane.clips.map(([start, length], j) => (
                  <motion.span
                    key={`${service.id}-${j}`}
                    className={`${styles.clip} ${laneClass[lane.name]}`}
                    style={{ left: `${start}%`, width: `${length}%` }}
                    initial={reduceMotion ? false : { scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, delay: laneIndex * 0.06 + j * 0.018, ease: [0.16, 1, 0.3, 1] }}
                  />
                ))}
              </div>
            </div>
          ))}
          <div className={styles.playhead} />
        </div>
      </div>
    </div>
  );
}
