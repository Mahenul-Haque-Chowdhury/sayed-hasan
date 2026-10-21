// src/components/contact.tsx
import type { CSSProperties } from "react";
import { emailHref, site } from "@/content/site";
import { CopyEmail } from "./copy-email";
import { ChapterMarker } from "./chapter-marker";
import { ExternalLabel } from "./external-label";
import { Dot } from "./section-heading";

export function Contact() {
  const year = new Date().getFullYear();

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="on-paper relative overflow-clip bg-ivory text-ink"
    >
      <div className="shell pt-[var(--section-y)]">
        <ChapterMarker number="05" label="Contact" tone="paper" />

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:items-end lg:gap-10">
          <h2 id="contact-title" data-reveal="lines" className="display heading-xl lg:col-span-8">
            <span className="ln">
              <span>Let&rsquo;s make</span>
            </span>{" "}
            <span className="ln" style={{ "--i": 1 } as CSSProperties}>
              <span>something</span>
            </span>{" "}
            <span className="ln" style={{ "--i": 2 } as CSSProperties}>
              <span>
                <em>worth watching</em>
                <Dot tone="deep" />
              </span>
            </span>
          </h2>

          <div
            data-reveal="rise"
            style={{ "--delay": "0.15s" } as CSSProperties}
            className="flex flex-col gap-8 lg:col-span-4 lg:pb-4"
          >
            <p className="max-w-[30ch] text-lg leading-relaxed md:text-xl md:leading-relaxed">
              Have a channel, campaign, or documentary in mind? Let&rsquo;s talk about the edit.
            </p>
            <div className="flex flex-col gap-3 sm:items-start">
              <a
                href={site.upworkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ink min-h-16 w-full justify-between px-7 text-base sm:w-80 md:text-lg"
              >
                Contact me on Upwork
                <ExternalLabel />
                <span aria-hidden="true" className="btn-arrow btn-arrow-up text-ember">
                  ↗
                </span>
              </a>
              <a
                href={emailHref}
                className="btn min-h-16 w-full justify-between border border-ink-line px-7 text-base text-ink hover:border-ink hover:bg-ink/5 sm:w-80 md:text-lg"
              >
                Email me
                <span aria-hidden="true" className="btn-arrow">
                  →
                </span>
              </a>
            </div>
            <CopyEmail email={site.email} />
          </div>
        </div>
      </div>

      {/* End card */}
      <footer className="shell mt-[var(--section-y)] pb-8">
        <div className="eyebrow flex items-center justify-between gap-4 border-t border-ink-line pt-6 text-paper-dim">
          <p>
            © {year} {site.name}
          </p>
          <a href="#top" className="link-underline flex min-h-11 items-center text-ink">
            Back to top ↑
          </a>
        </div>
        <p
          aria-hidden="true"
          className="wordmark mt-8 select-none whitespace-nowrap text-center text-[clamp(2.5rem,18vw,18.5rem)] leading-[0.8] text-ink"
        >
          {site.wordmark}
        </p>
        <p className="eyebrow mt-6 text-center text-paper-dim">
          Designed by{" "}
          <a
            href="https://mahenul.com"
            target="_blank"
            rel="noopener"
            className="link-underline text-ink"
          >
            Mahenul Haque Chowdhury
          </a>
        </p>
      </footer>
    </section>
  );
}
