// src/components/work/stack.tsx
"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

const StackProgress = createContext<MotionValue<number> | null>(null);
const StackEnabled = createContext(false);

type CoverListener = (covered: boolean) => void;
type SubscribeCover = (listener: CoverListener) => () => void;
const CardCover = createContext<SubscribeCover | null>(null);

/** Lets media inside a stacked card react when the next card slides over it. */
export function useCardCover() {
  return useContext(CardCover);
}

function useDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return desktop;
}

/** Cards pin in turn; each settles back as the next one slides over it. */
export function StackContainer({ count, children }: { count: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const desktop = useDesktop();
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <StackProgress.Provider value={scrollYProgress}>
      <StackEnabled.Provider value={desktop && !reduceMotion}>
        <div
          ref={ref}
          role="list"
          aria-label={`${count} featured projects`}
          className="mt-16 flex flex-col gap-6 lg:mt-24 lg:gap-[22svh]"
        >
          {children}
        </div>
      </StackEnabled.Provider>
    </StackProgress.Provider>
  );
}

export function StackCard({ index, count, children }: { index: number; count: number; children: ReactNode }) {
  const progress = useContext(StackProgress);
  if (!progress) throw new Error("StackCard must be rendered inside StackContainer");
  const enabled = useContext(StackEnabled);
  const isLast = index === count - 1;
  const start = index / count;

  const scale = useTransform(progress, [start, 1], [1, 1 - (count - 1 - index) * 0.035]);
  const dim = useTransform(progress, [start, Math.min(1, start + 1 / count)], [0, isLast ? 0 : 0.6]);

  // Tell any playing video in this card when the next card starts covering it.
  const listeners = useRef(new Set<CoverListener>());
  const covered = useRef(false);
  const enabledRef = useRef(enabled);
  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);
  useMotionValueEvent(dim, "change", (v) => {
    const next = enabledRef.current && v > 0.3;
    if (next === covered.current) return;
    covered.current = next;
    listeners.current.forEach((listener) => listener(next));
  });
  const subscribe = useCallback<SubscribeCover>((listener) => {
    listeners.current.add(listener);
    return () => listeners.current.delete(listener);
  }, []);

  return (
    <div
      role="listitem"
      className="lg:sticky lg:top-[calc(var(--header-h)+1.25rem+var(--i)*1.1rem)] lg:h-[min(78svh,48rem)]"
      style={{ "--i": index } as CSSProperties}
    >
      <CardCover.Provider value={subscribe}>
        <motion.div className="relative h-full origin-top" style={enabled ? { scale } : undefined}>
          {children}
          <motion.div
            aria-hidden="true"
            className="radius-ui pointer-events-none absolute inset-0 bg-ink"
            style={{ opacity: enabled ? dim : 0 }}
          />
        </motion.div>
      </CardCover.Provider>
    </div>
  );
}
