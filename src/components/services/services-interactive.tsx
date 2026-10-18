// src/components/services/services-interactive.tsx
"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { services, type Service } from "@/content/services";
import { ServiceStage } from "./service-stage";

export function ServicesInteractive() {
  return (
    <>
      <div className="mt-16 hidden lg:block">
        <ServiceTabs />
      </div>
      <div className="mt-12 lg:hidden">
        <ServiceAccordion />
      </div>
    </>
  );
}

/* ── Desktop: tabs drive a large visual stage ───────────────────────────── */
function ServiceTabs() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const active = services[activeIndex];

  const select = (i: number) => {
    const next = (i + services.length) % services.length;
    setActiveIndex(next);
    tabsRef.current[next]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const keys: Record<string, () => void> = {
      ArrowDown: () => select(i + 1),
      ArrowRight: () => select(i + 1),
      ArrowUp: () => select(i - 1),
      ArrowLeft: () => select(i - 1),
      Home: () => select(0),
      End: () => select(services.length - 1),
    };
    const action = keys[e.key];
    if (action) {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="grid grid-cols-12 gap-x-10 xl:gap-x-16">
      <div
        role="tablist"
        aria-label="Services"
        aria-orientation="vertical"
        className="sticky top-[calc(var(--header-h)+2rem)] col-span-5 self-start border-t border-line xl:col-span-4"
        data-reveal="rise"
      >
        {services.map((s, i) => {
          const selected = i === activeIndex;
          return (
            <button
              key={s.id}
              ref={(el) => {
                tabsRef.current[i] = el;
              }}
              id={`${baseId}-tab-${s.id}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveIndex(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`group relative flex w-full items-baseline gap-5 border-b border-line py-6 pl-5 pr-2 text-left transition-colors duration-300 ${
                selected ? "text-ivory" : "text-ivory-dim hover:text-ivory"
              }`}
            >
              <span
                aria-hidden="true"
                className={`absolute left-0 top-0 h-full w-[2px] origin-top bg-ember transition-transform duration-500 ease-[var(--ease-out-expo)] ${
                  selected ? "scale-y-100" : "scale-y-0"
                }`}
              />
              <span className={`eyebrow w-7 shrink-0 ${selected ? "text-ember" : ""}`}>{s.number}</span>
              <span className="display heading-item">{s.title}</span>
            </button>
          );
        })}
      </div>

      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${active.id}`}
        className="col-span-7 xl:col-span-8"
        data-reveal="fade"
      >
        <ServiceStage service={active} />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex items-start justify-between gap-10"
          >
            <p className="max-w-[36ch] text-lg leading-relaxed text-ivory">{active.description}</p>
            <Deliverables service={active} className="max-w-[22rem] justify-end" />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Mobile & tablet: accordion ─────────────────────────────────────────── */
function ServiceAccordion() {
  const [open, setOpen] = useState<string | null>(services[0].id);
  const baseId = useId();

  return (
    <div className="border-t border-line">
      {services.map((s) => {
        const isOpen = open === s.id;
        const buttonId = `${baseId}-btn-${s.id}`;
        const panelId = `${baseId}-panel-${s.id}`;
        return (
          <div key={s.id} className="border-b border-line">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : s.id)}
                className="flex min-h-16 w-full items-baseline gap-4 py-5 text-left"
              >
                <span className={`eyebrow w-7 shrink-0 ${isOpen ? "text-ember" : "text-ivory-dim"}`}>
                  {s.number}
                </span>
                <span className="display heading-item flex-1">{s.title}</span>
                <span aria-hidden="true" className="relative h-4 w-4 shrink-0 self-center">
                  <span className="absolute left-0 top-1/2 h-px w-4 bg-ivory" />
                  <span
                    className={`absolute left-1/2 top-0 h-4 w-px bg-ivory transition-transform duration-300 ${
                      isOpen ? "scale-y-0" : "scale-y-100"
                    }`}
                  />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!isOpen}
              className={`grid transition-[grid-template-rows] duration-500 ease-[var(--ease-out-expo)] motion-reduce:transition-none ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="pb-8 pt-1">
                  <ServiceStage service={s} compact />
                  <p className="mt-6 text-ivory">{s.description}</p>
                  <Deliverables service={s} className="mt-5" />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Deliverables({ service, className = "" }: { service: Service; className?: string }) {
  return (
    <ul aria-label="Included" className={`flex flex-wrap gap-2 ${className}`}>
      {service.deliverables.map((d) => (
        <li key={d} className="radius-ui border border-line px-3 py-1.5 text-sm text-ivory-dim">
          {d}
        </li>
      ))}
    </ul>
  );
}
