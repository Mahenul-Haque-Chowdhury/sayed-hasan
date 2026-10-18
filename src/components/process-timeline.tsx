// src/components/process-timeline.tsx
"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { processSteps } from "@/content/process";
import { toTimecode } from "@/lib/timecode";

/** Total "duration" the playhead readout represents: five minutes at 24 fps. */
const TOTAL_FRAMES = 5 * 60 * 24;

/** Cumulative start of each step, as a fraction of the timeline. */
const starts = processSteps.reduce<number[]>((acc, step, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + processSteps[i - 1].length / 100);
  return acc;
}, []);

export function ProcessTimeline() {
  const listRef = useRef<HTMLOListElement>(null);
  const readoutRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const reduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [vertical, setVertical] = useState(false);
  const [domStarts, setDomStarts] = useState<number[]>(starts);

  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 80%", "end 45%"] });
  const percent = useTransform(scrollYProgress, (v) => `${(reduceMotion ? 1 : v) * 100}%`);

  // Step boundaries follow the real layout (columns on desktop, rows on mobile).
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const measure = () => {
      const isVertical = !mq.matches;
      setVertical(isVertical);
      const box = list.getBoundingClientRect();
      const items = Array.from(list.children) as HTMLElement[];
      setDomStarts(
        items.map((el) => {
          const r = el.getBoundingClientRect();
          return isVertical ? (r.top - box.top) / box.height : (r.left - box.left) / box.width;
        }),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    mq.addEventListener("change", measure);
    return () => {
      ro.disconnect();
      mq.removeEventListener("change", measure);
    };
  }, []);

  // Progress is quantised so React only re-renders ~100 times across the whole pass.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setProgress(Math.round(v * 100) / 100);
    const tc = toTimecode(v * TOTAL_FRAMES);
    readoutRefs.current.forEach((el) => {
      if (el) el.textContent = tc;
    });
  });

  const p = reduceMotion ? 1 : progress;
  const current = domStarts.reduce((idx, start, i) => (p >= start + 0.005 ? i : idx), -1);
  const fillFor = (i: number) => {
    const start = domStarts[i];
    const end = domStarts[i + 1] ?? 1;
    return Math.min(1, Math.max(0, (p - start) / (end - start)));
  };

  return (
    <div className="relative mt-16 lg:mt-24">
      {/* Ruler (desktop) */}
      <div aria-hidden="true" className="relative hidden h-9 lg:block">
        <div className="absolute inset-x-0 bottom-0 h-2 bg-[repeating-linear-gradient(to_right,rgb(242_235_221/0.3)_0_1px,transparent_1px_2%)]" />
      </div>

      <div className="relative">
        <ol
          ref={listRef}
          className="relative flex flex-col border-l border-line lg:flex-row lg:border-y lg:border-l-0"
        >
          {processSteps.map((step, i) => {
            const played = i < current;
            const isCurrent = i === current;
            return (
              <li
                key={step.number}
                className="relative flex flex-col gap-3 py-7 pl-7 pr-2 lg:border-l lg:border-line lg:px-5 lg:py-6 lg:first:border-l-0"
                style={{ flexBasis: vertical ? undefined : `${step.length}%` }}
              >
                {/* Clip bar, filled up to the playhead */}
                <span
                  aria-hidden="true"
                  className="absolute -left-px top-7 h-[calc(100%-3.5rem)] w-0.75 overflow-hidden radius-ui bg-ivory/15 lg:static lg:mb-2 lg:block lg:h-2.5 lg:w-full"
                >
                  <span
                    className={`block h-full w-full origin-top bg-ember transition-[transform,opacity] duration-300 ease-out lg:origin-left ${
                      isCurrent ? "opacity-100" : "opacity-50"
                    }`}
                    style={{ transform: `${vertical ? "scaleY" : "scaleX"}(${fillFor(i)})` }}
                  />
                </span>
                <span
                  className={`eyebrow transition-colors duration-500 ${
                    isCurrent || played ? "text-ember" : "text-ivory-dim"
                  }`}
                >
                  {step.number}
                </span>
                <h3 className="display heading-item text-ivory">{step.title}</h3>
                <p className="max-w-[26ch] text-[0.9375rem] leading-relaxed text-ivory-dim">{step.description}</p>
              </li>
            );
          })}
        </ol>

        {/* Playhead: horizontal travel on desktop */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -top-9 bottom-0 left-0 hidden w-full lg:block motion-reduce:lg:hidden"
          style={{ x: percent }}
        >
          <div className="absolute bottom-0 left-0 top-0 w-px bg-ember" />
          <div className="absolute -left-[6px] top-0 h-3 w-[13px] bg-ember [clip-path:polygon(0_0,100%_0,100%_55%,50%_100%,0_55%)]" />
          <span
            ref={(el) => {
              readoutRefs.current[0] = el;
            }}
            className="eyebrow tabular absolute -top-6 left-2 whitespace-nowrap bg-ember px-1.5 py-0.5 text-[0.625rem] text-ink"
          >
            00:00:00:00
          </span>
        </motion.div>

        {/* Playhead: vertical travel on mobile */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 h-full w-full lg:hidden motion-reduce:hidden"
          style={{ y: percent }}
        >
          <div className="absolute -left-2 right-0 top-0 h-px bg-gradient-to-r from-ember to-ember/0" />
          <div className="absolute -left-[7px] -top-[6px] h-[13px] w-[13px] rotate-45 bg-ember" />
        </motion.div>
      </div>
    </div>
  );
}
