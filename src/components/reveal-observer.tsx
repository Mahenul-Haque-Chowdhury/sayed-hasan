// src/components/reveal-observer.tsx
"use client";

import { useEffect } from "react";

/**
 * Enables [data-reveal] entrances once JS is running and motion is allowed.
 * Content is fully visible by default (no JS, reduced motion, or failures).
 */
export function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    // Anything already on screen stays visible, so nothing flashes on reload mid-page.
    const vh = window.innerHeight;
    for (const el of elements) {
      const rect = el.getBoundingClientRect();
      if (rect.top < vh * 0.92 && rect.bottom > 0) el.classList.add("is-in");
    }

    root.classList.add("reveal-ready");

    // A fully clipped element never intersects (its own clip-path counts), so
    // wipe reveals are observed through their parent instead.
    const targets = new Map<Element, HTMLElement[]>();
    for (const el of elements) {
      if (el.classList.contains("is-in")) continue;
      const proxy = el.dataset.reveal?.startsWith("wipe") && el.parentElement ? el.parentElement : el;
      targets.set(proxy, [...(targets.get(proxy) ?? []), el]);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          targets.get(entry.target)?.forEach((el) => el.classList.add("is-in"));
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
    );

    targets.forEach((_, proxy) => observer.observe(proxy));

    return () => {
      observer.disconnect();
      root.classList.remove("reveal-ready");
    };
  }, []);

  return null;
}
