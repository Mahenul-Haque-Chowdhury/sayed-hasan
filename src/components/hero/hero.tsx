// src/components/hero/hero.tsx
"use client";

import { motion, useMotionValue, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { site } from "@/content/site";
import { clamp01, easeInOutCubic } from "@/lib/timecode";
import { HeroScene } from "./hero-scene";
import { ShowreelControls, ShowreelVideo } from "./showreel";
import styles from "./hero.module.css";

const delay = (s: number) => ({ "--delay": `${s}s` }) as CSSProperties;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const MARK = 14;

/** Geometry of the resting slot relative to the pinned stage, in px. */
interface Metrics {
  W: number;
  H: number;
  w: number;
  h: number;
  dx: number;
  dy: number;
  header: number;
  gutter: number;
}

const EMPTY: Metrics = { W: 1, H: 1, w: 1, h: 1, dx: 0, dy: 0, header: 64, gutter: 24 };

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const metrics = useMotionValue<Metrics>(EMPTY);

  // Expand over the first ~70% of the pinned scroll, then hold on the title card.
  const p = useTransform(scrollYProgress, (v) => easeInOutCubic(clamp01(v / 0.7)));
  const q = useTransform(scrollYProgress, (v) => clamp01((v - 0.64) / 0.24));

  // Window: translate + scale from the slot to full-bleed…
  const winX = useTransform(() => metrics.get().dx * (1 - p.get()));
  const winY = useTransform(() => metrics.get().dy * (1 - p.get()));
  const winSX = useTransform(() => lerp(metrics.get().w / metrics.get().W, 1, p.get()));
  const winSY = useTransform(() => lerp(metrics.get().h / metrics.get().H, 1, p.get()));
  // …while the picture counter-scales, so it is never distorted or repainted.
  const picSX = useTransform(() => 1 / winSX.get());
  const picSY = useTransform(() => 1 / winSY.get());

  // Corner marks follow the window edge, settling inside the header and gutters.
  const edge = () => {
    const m = metrics.get();
    const t = p.get();
    const cx = m.W / 2 + m.dx * (1 - t);
    const cy = m.H / 2 + m.dy * (1 - t);
    const hw = (m.W * winSX.get()) / 2;
    const hh = (m.H * winSY.get()) / 2;
    const top = 10 + t * (m.header + 6);
    const side = 10 + t * Math.max(0, m.gutter - 10);
    const bottom = 10 + t * 12;
    return {
      left: cx - hw + side,
      right: cx + hw - side - MARK,
      top: cy - hh + top,
      bottom: cy + hh - bottom - MARK,
    };
  };
  const cLeft = useTransform(() => edge().left);
  const cRight = useTransform(() => edge().right);
  const cTop = useTransform(() => edge().top);
  const cBottom = useTransform(() => edge().bottom);

  // Headline pushed out of frame as the window opens.
  const upY = useTransform(() => p.get() * -0.38 * metrics.get().H);
  const downY = useTransform(() => p.get() * 0.34 * metrics.get().H);
  const textOpacity = useTransform(p, (t) => clamp01(1 - t * 1.4));
  const thirds = useTransform(p, (t) => 1 - t);
  const cardY = useTransform(q, (t) => (1 - t) * 24);

  useEffect(() => {
    const stage = stageRef.current;
    const slot = slotRef.current;
    const shell = shellRef.current;
    if (!stage || !slot || !shell) return;

    const measure = () => {
      const s = stage.getBoundingClientRect();
      const f = slot.getBoundingClientRect();
      if (!s.width || !f.width) return;
      metrics.set({
        W: s.width,
        H: s.height,
        w: f.width,
        h: f.height,
        dx: f.left + f.width / 2 - (s.left + s.width / 2),
        dy: f.top + f.height / 2 - (s.top + s.height / 2),
        header: document.querySelector("header")?.getBoundingClientRect().height ?? 64,
        gutter: parseFloat(getComputedStyle(shell).paddingLeft) || 24,
      });
      setReady(true);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    ro.observe(slot);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => ro.disconnect();
  }, [metrics]);

  const reel = site.showreel.videoUrl;
  const reelInSlot = Boolean(reel) && reduceMotion === true;
  const reelInWindow = Boolean(reel) && !reelInSlot;
  // Under reduced motion the hero is not pinned, so the copy stays put.
  const up = reduceMotion ? undefined : { y: upY, opacity: textOpacity };
  const down = reduceMotion ? undefined : { y: downY, opacity: textOpacity };

  return (
    <section
      id="top"
      ref={sectionRef}
      aria-labelledby="hero-title"
      className="relative h-[170svh] lg:h-[210svh] motion-reduce:h-auto"
    >
      <h1 id="hero-title" className="sr-only">
        Sayed Hasan, video editor. Every frame earns attention.
      </h1>

      <div
        ref={stageRef}
        className="sticky top-0 h-svh min-h-144 overflow-hidden motion-reduce:relative"
      >
        <div
          ref={shellRef}
          className="shell relative flex h-full flex-col pb-5 pt-[calc(var(--header-h)+0.5rem)] lg:pb-7"
        >
          {/* Line one */}
          <motion.p
            aria-hidden="true"
            className={`${styles.headline} ${styles.moving} display mt-[2svh] text-ivory lg:mt-[3svh]`}
            style={up}
          >
            <span className="ln">
              <span className={styles.rise} style={delay(0.15)}>
                Every frame
              </span>
            </span>
          </motion.p>

          {/* Band: supporting copy + the frame */}
          <div className="grid min-h-[9rem] flex-1 grid-cols-1 gap-x-8 py-[1.6svh] lg:grid-cols-12 lg:py-[2.2svh]">
            <motion.div
              className={`${styles.moving} hidden flex-col justify-end lg:col-span-4 lg:flex`}
              style={down}
            >
              <HeroCopy />
            </motion.div>

            <div className={`${styles.slotArea} relative h-full lg:col-span-8`}>
              <div ref={slotRef} className={styles.slot}>
                <HeroScene
                  media={reelInSlot && reel ? <ShowreelVideo ref={videoRef} src={reel} autoPlay={false} /> : null}
                />
                <div className="crop-marks pointer-events-none absolute inset-2.5" aria-hidden="true" />
                <div className={styles.shutter} aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* Line two */}
          <motion.p
            aria-hidden="true"
            className={`${styles.headline} ${styles.moving} display text-right text-ivory`}
            style={down}
          >
            <span className="ln">
              <span className={styles.rise} style={delay(0.28)}>
                earns <em>attention</em>
                <span className="text-ember">.</span>
              </span>
            </span>
          </motion.p>

          {/* Mobile copy */}
          <motion.div className={`${styles.moving} mt-4 flex flex-col gap-3 lg:hidden`} style={down}>
            <HeroCopy />
            {reel && <ShowreelControls videoRef={videoRef} />}
          </motion.div>

          {/* Desktop footer row */}
          <motion.div className={`${styles.moving} mt-4 hidden lg:block`} style={down}>
            <div
              className={`${styles.fadeIn} eyebrow flex items-center justify-between text-ivory-dim`}
              style={delay(0.9)}
            >
              <span className="flex items-center gap-4">
                Scroll through the edit
                <span aria-hidden="true" className="relative block h-px w-16 overflow-hidden bg-line">
                  <span className={`${styles.scrollCue} absolute inset-0 block origin-left bg-ember`} />
                </span>
              </span>
              {reel && <ShowreelControls videoRef={videoRef} />}
            </div>
          </motion.div>
        </div>

        {/* The window that opens to full bleed */}
        <motion.div
          className={styles.window}
          data-ready={ready}
          style={{ x: winX, y: winY, scaleX: winSX, scaleY: winSY }}
        >
          <motion.div className={styles.picture} style={{ scaleX: picSX, scaleY: picSY }}>
            <HeroScene
              motionValues={{ thirds, card: q, cardY }}
              media={reelInWindow && reel ? <ShowreelVideo ref={videoRef} src={reel} autoPlay /> : null}
            />
          </motion.div>
          <div className={styles.shutter} aria-hidden="true" />
        </motion.div>

        {/* Corner marks */}
        <motion.div aria-hidden="true" data-ready={ready} className={`${styles.corner} ${styles.tl}`} style={{ x: cLeft, y: cTop }}>
          <span className={`${styles.cornerLabel} eyebrow flex items-center gap-2`}>
            <span className="h-1.5 w-1.5 rounded-full bg-ember" />
            Program
          </span>
        </motion.div>
        <motion.div aria-hidden="true" data-ready={ready} className={`${styles.corner} ${styles.tr}`} style={{ x: cRight, y: cTop }}>
        </motion.div>
        <motion.div aria-hidden="true" data-ready={ready} className={`${styles.corner} ${styles.bl}`} style={{ x: cLeft, y: cBottom }} />
        <motion.div aria-hidden="true" data-ready={ready} className={`${styles.corner} ${styles.br}`} style={{ x: cRight, y: cBottom }} />
      </div>
    </section>
  );
}

function HeroCopy() {
  return (
    <div className="flex flex-col gap-5 md:gap-7">
      <p
        className={`${styles.fadeIn} max-w-[30ch] text-[0.98rem] leading-relaxed text-ivory-dim md:text-lg lg:text-xl`}
        style={delay(0.55)}
      >
        Video editing for YouTube creators, brands, and storytellers.{" "}
        <span className="text-ivory">Human craft, accelerated by AI.</span>
      </p>
      <div className={`${styles.fadeIn} flex flex-wrap gap-3`} style={delay(0.7)}>
        <a href="#work" className="btn btn-primary flex-1 whitespace-nowrap px-4 text-sm sm:flex-none sm:px-5.5 sm:text-[0.9375rem]">
          Explore my work
          <span aria-hidden="true" className="btn-arrow hidden sm:inline">
            →
          </span>
        </a>
        <a href="#contact" className="btn btn-ghost flex-1 whitespace-nowrap px-4 text-sm sm:flex-none sm:px-5.5 sm:text-[0.9375rem]">
          Let&rsquo;s work together
        </a>
      </div>
    </div>
  );
}
