// src/components/chapter-marker.tsx
interface ChapterMarkerProps {
  number: string;
  label: string;
  tone?: "dark" | "paper";
}

/** A timeline marker that opens each chapter. */
export function ChapterMarker({ number, label, tone = "dark" }: ChapterMarkerProps) {
  const paper = tone === "paper";
  return (
    <div
      data-reveal="wipe-x"
      className={`eyebrow relative border-t pt-4 ${paper ? "border-ink-line text-paper-dim" : "border-line text-ivory-dim"}`}
    >
      <span
        aria-hidden="true"
        className={`absolute -top-px left-0 h-3.5 w-2.5 [clip-path:polygon(0_0,100%_0,100%_65%,50%_100%,0_65%)] ${
          paper ? "bg-ember-deep" : "bg-ember"
        }`}
      />
      <p className="pl-6">
        <span className={paper ? "text-ember-deep" : "text-ember"}>{number}</span> <span className="ml-2">{label}</span>
      </p>
    </div>
  );
}
