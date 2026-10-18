// src/components/section-heading.tsx
import { Fragment, type CSSProperties, type ReactNode } from "react";
import { ChapterMarker } from "./chapter-marker";

interface SectionHeadingProps {
  id: string;
  number: string;
  label: string;
  /** Each entry is one masked headline line. */
  lines: ReactNode[];
  lede?: string;
}

/** The shared opening for a chapter: marker, headline, and one short line. */
export function SectionHeading({ id, number, label, lines, lede }: SectionHeadingProps) {
  return (
    <>
      <ChapterMarker number={number} label={label} />
      <div className="mt-12 grid items-end gap-8 lg:mt-16 lg:grid-cols-12">
        <h2 id={id} data-reveal="lines" className="display heading-section lg:col-span-8">
          {lines.map((line, i) => (
            <Fragment key={i}>
              <span className="ln" style={{ "--i": i } as CSSProperties}>
                <span>{line}</span>
              </span>
              {i < lines.length - 1 && " "}
            </Fragment>
          ))}
        </h2>
        {lede && (
          <p data-reveal="rise" className="lede lg:col-span-4 lg:pb-3">
            {lede}
          </p>
        )}
      </div>
    </>
  );
}

/** The ember full stop that ends every headline. */
export function Dot({ tone = "ember" }: { tone?: "ember" | "deep" }) {
  return <span className={tone === "deep" ? "text-ember-deep" : "text-ember"}>.</span>;
}
