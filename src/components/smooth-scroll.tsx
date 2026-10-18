// src/components/smooth-scroll.tsx
"use client";

import Lenis from "lenis";
import { cancelFrame, frame } from "motion/react";
import { useEffect } from "react";

let instance: Lenis | null = null;

/** The active smooth-scroll instance, or null (reduced motion / not mounted). */
export const getLenis = () => instance;

/**
 * Inertial wheel scrolling, driven by Motion's frame loop so scroll position and
 * scroll-linked animation update in the same frame. Touch devices keep native
 * scrolling; reduced-motion users keep native scrolling everywhere.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.9,
      autoRaf: false,
      prevent: (node) => node.closest("[data-lenis-prevent]") !== null,
    });
    instance = lenis;

    const update = ({ timestamp }: { timestamp: number }) => lenis.raf(timestamp);
    frame.update(update, true);

    // Same-page links glide to their target, then hand focus to it so keyboard
    // and screen-reader users land where the page scrolled.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      const id = link?.getAttribute("href")?.slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      lenis.start();
      lenis.scrollTo(id === "top" ? 0 : target, {
        onComplete: () => {
          if (!target.matches("a, button, input, [tabindex]")) target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
        },
      });
      history.replaceState(null, "", `#${id}`);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelFrame(update);
      lenis.destroy();
      instance = null;
    };
  }, []);

  return null;
}
