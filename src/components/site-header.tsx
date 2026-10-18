// src/components/site-header.tsx
"use client";

import { motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { chapters, openingChapter, site, type Chapter } from "@/content/site";
import { scrollToFrames, toTimecode } from "@/lib/timecode";
import { ExternalLabel } from "./external-label";
import { getLenis } from "./smooth-scroll";

const allChapters: Chapter[] = [openingChapter, ...chapters];

export function SiteHeader() {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 260, damping: 40, restDelta: 0.001 });
  const timecodeRef = useRef<HTMLSpanElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<Chapter>(openingChapter);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    if (timecodeRef.current) timecodeRef.current.textContent = toTimecode(scrollToFrames(y));
    setScrolled(y > 24);
  });

  // Track the chapter currently crossing the middle of the viewport.
  useEffect(() => {
    const sections = allChapters
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const match = allChapters.find((c) => c.id === entry.target.id);
          if (match) setActive(match);
        }
      },
      { rootMargin: "-45% 0px -54% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const closeMenu = useCallback((returnFocus: boolean) => {
    setMenuOpen(false);
    if (returnFocus) menuButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    getLenis()?.stop();
    firstMenuLinkRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu(true);
    };
    const onResize = () => {
      if (window.innerWidth >= 1024) closeMenu(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      root.style.overflow = "";
      getLenis()?.start();
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen, closeMenu]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
          scrolled || menuOpen
            ? "border-b border-line bg-ink"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        {/* Thin scroll progress: the sequence playhead */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[2px] origin-left bg-ember"
          style={{ scaleX: progress }}
        />

        <div className="shell flex h-[var(--header-h)] items-center justify-between gap-6">
          <a
            href="#top"
            className="wordmark group relative z-10 flex min-h-11 items-center gap-3 text-[1.125rem] text-ivory lg:text-[1.5rem]"
            onClick={() => closeMenu(false)}
          >
            <span aria-hidden="true" className="h-[1.05em] w-[3px] bg-ember transition-transform duration-300 group-hover:scale-y-125" />
            {site.wordmark}
            <span className="sr-only">, back to top</span>
          </a>

          {/* Timecode readout */}
          <p aria-hidden="true" className="eyebrow tabular hidden text-ivory-dim xl:block">
            TC <span ref={timecodeRef}>00:00:00:00</span>
          </p>

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            <ul className="flex items-center">
              {chapters
                .filter((c) => c.id !== "contact")
                .map((c) => (
                  <li key={c.id}>
                    <a
                      href={`#${c.id}`}
                      aria-current={active.id === c.id ? "location" : undefined}
                      className={`relative flex min-h-12 items-center px-4 text-base transition-colors duration-300 hover:text-ivory ${
                        active.id === c.id ? "text-ivory" : "text-ivory-dim"
                      }`}
                    >
                      {c.nav}
                      <span
                        aria-hidden="true"
                        className={`absolute inset-x-4 bottom-2 h-px origin-left bg-ember transition-transform duration-500 ${
                          active.id === c.id ? "scale-x-100" : "scale-x-0"
                        }`}
                      />
                    </a>
                  </li>
                ))}
            </ul>
            <a href="#contact" className="btn btn-ghost ml-4 min-h-12 px-6 text-base">
              Let&rsquo;s work together
            </a>
          </nav>

          <button
            ref={menuButtonRef}
            type="button"
            className="eyebrow relative z-10 flex min-h-11 min-w-11 items-center justify-center gap-3 text-ivory lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => (menuOpen ? closeMenu(false) : setMenuOpen(true))}
          >
            <span>{menuOpen ? "Close" : "Menu"}</span>
            <span aria-hidden="true" className="relative block h-3 w-5">
              <span
                className={`absolute left-0 h-px w-5 bg-ivory transition-transform duration-300 ${
                  menuOpen ? "top-1.5 rotate-45" : "top-0.5"
                }`}
              />
              <span
                className={`absolute left-0 h-px w-5 bg-ivory transition-transform duration-300 ${
                  menuOpen ? "top-1.5 -rotate-45" : "top-2.5"
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <nav
        id="mobile-menu"
        aria-label="Mobile"
        data-lenis-prevent
        inert={!menuOpen}
        className={`fixed inset-0 z-40 flex flex-col bg-ink pt-[var(--header-h)] duration-700 ease-[var(--ease-cut)] motion-reduce:transition-none lg:hidden ${
          menuOpen
            ? "visible transition-[clip-path] [clip-path:inset(0_0_0_0)]"
            : "invisible transition-[clip-path,visibility] [clip-path:inset(0_0_100%_0)]"
        }`}
      >
        <div className="shell flex flex-1 flex-col justify-between overflow-y-auto pb-8 pt-6">
          <ul className="border-t border-line">
            {chapters.map((c, i) => (
              <li key={c.id} className="border-b border-line">
                <a
                  ref={i === 0 ? firstMenuLinkRef : undefined}
                  href={`#${c.id}`}
                  onClick={() => closeMenu(false)}
                  className="flex min-h-16 items-baseline gap-5 py-3 text-ivory"
                >
                  <span className="eyebrow w-6 text-ember">{c.number}</span>
                  <span className="display text-[clamp(2.5rem,11vw,4rem)]">{c.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <a
              href={site.upworkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary w-full"
              onClick={() => closeMenu(false)}
            >
              Contact me on Upwork <ExternalLabel />
              <span aria-hidden="true" className="btn-arrow btn-arrow-up">
                ↗
              </span>
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
