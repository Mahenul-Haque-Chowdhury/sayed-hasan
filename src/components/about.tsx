// src/components/about.tsx
import Image from "next/image";
import type { CSSProperties } from "react";
import { site } from "@/content/site";
import { ChapterMarker } from "./chapter-marker";
import { ExternalLabel } from "./external-label";
import { Dot } from "./section-heading";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="section-y relative">
      <div className="shell">
        <ChapterMarker number="03" label="Meet Sayed" />

        <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-x-10 xl:gap-x-16">
          <div className="lg:col-span-5">
            <PortraitFrame />
          </div>

          <div className="flex flex-col lg:col-span-7 lg:pt-4">
            <h2 id="about-title" data-reveal="lines" className="display heading-section">
              <span className="ln">
                <span>Human craft,</span>
              </span>{" "}
              <span className="ln" style={{ "--i": 1 } as CSSProperties}>
                <span>
                  <em>accelerated by AI</em>
                  <Dot />
                </span>
              </span>
            </h2>

            <p
              data-reveal="rise"
              className="mt-10 max-w-[46ch] text-lg leading-relaxed text-ivory md:text-xl md:leading-relaxed"
            >
              I combine storytelling, precise editing, and modern AI tools to help creators and brands turn ideas
              into engaging videos. From scripts and voiceovers to visuals and the final edit, I can handle the
              complete production workflow.
            </p>

            {/* Credentials, presented as profile facts */}
            <div data-reveal="rise" style={{ "--delay": "0.1s" } as CSSProperties} className="mt-14">
              <p className="eyebrow text-ivory-dim">Upwork profile credentials</p>
              <dl className="mt-4 grid border-y border-line sm:grid-cols-3">
                {site.credentials.map((c, i) => (
                  <div
                    key={c.label}
                    className={`flex flex-col-reverse gap-2 py-6 ${
                      i > 0 ? "border-t border-line sm:border-l sm:border-t-0 sm:pl-6" : ""
                    } ${i < site.credentials.length - 1 ? "sm:pr-6" : ""}`}
                  >
                    <dt className="text-sm text-ivory-dim">{c.label}</dt>
                    <dd className="wordmark whitespace-nowrap text-[clamp(1.875rem,2.75vw,3rem)] leading-none text-ivory">
                      {c.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <a
                href={site.upworkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost mt-8"
              >
                View Upwork profile
                <ExternalLabel />
                <span aria-hidden="true" className="btn-arrow btn-arrow-up">
                  ↗
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PortraitFrame() {
  const portrait = site.portrait;

  return (
    <figure className="relative lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
      <div data-reveal="wipe" className="radius-ui relative aspect-[4/5] overflow-hidden bg-ink-3">
        {portrait ? (
          <Image
            src={portrait.src}
            alt={portrait.alt}
            fill
            placeholder="blur"
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover object-[50%_22%] [filter:saturate(0.82)_contrast(1.05)]"
          />
        ) : (
          <PortraitSlot />
        )}
        {/* Scrim for the lower third */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_top,rgb(11_10_9/0.8),transparent_40%)]"
        />
        <div aria-hidden="true" className="crop-marks absolute inset-3" />
      </div>

      {/* Lower third */}
      <figcaption className="absolute bottom-6 left-6 flex flex-col border-l-2 border-ember pl-3 md:bottom-8 md:left-8">
        <span className="display text-[clamp(1.75rem,3vw,2.5rem)] leading-none text-ivory">{site.name}</span>
        <span className="eyebrow mt-2 text-ivory-dim">Video editor</span>
      </figcaption>
    </figure>
  );
}

/** Shown if no portrait is configured: a finished typographic slot. */
function PortraitSlot() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(ellipse_at_50%_35%,rgb(255_92_31/0.16),transparent_65%)]">
      <span aria-hidden="true" className="display text-[clamp(8rem,22vw,16rem)] text-ivory/90">
        S<em className="text-ember">H</em>
      </span>
      <span className="sr-only">Portrait coming soon</span>
    </div>
  );
}
