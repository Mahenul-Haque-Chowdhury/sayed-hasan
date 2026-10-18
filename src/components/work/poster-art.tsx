// src/components/work/poster-art.tsx
import type { PosterStyle } from "@/content/projects";
import styles from "./poster.module.css";

/**
 * Designed placeholder artwork for each format. Purely decorative;
 * the surrounding frame carries the accessible label.
 */
export function PosterArt({ style }: { style: PosterStyle }) {
  switch (style) {
    case "faceless":
      return <FacelessArt />;
    case "documentary":
      return <DocumentaryArt />;
    case "product":
      return <ProductArt />;
    case "vertical":
      return <VerticalArt />;
  }
}

/** Deterministic waveform heights. */
const wave = Array.from({ length: 72 }, (_, i) => {
  const v = Math.abs(Math.sin(i * 0.63) * 0.6 + Math.sin(i * 1.7) * 0.3 + Math.sin(i * 0.21) * 0.35);
  return 6 + Math.round(v * 34);
});

function FacelessArt() {
  return (
    <div aria-hidden="true" className={styles.art}>
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className={styles.svg}>
        <defs>
          <radialGradient id="fz-glow" cx="62%" cy="42%" r="55%">
            <stop offset="0" stopColor="var(--color-ember)" stopOpacity="0.22" />
            <stop offset="1" stopColor="var(--color-ember)" stopOpacity="0" />
          </radialGradient>
          <clipPath id="fz-globe">
            <circle cx="1000" cy="420" r="320" />
          </clipPath>
        </defs>
        <rect width="1600" height="900" fill="var(--color-ink-2)" />
        <rect width="1600" height="900" fill="url(#fz-glow)" />

        {/* Globe */}
        <g fill="none" stroke="var(--color-ivory)" strokeOpacity="0.16">
          <circle cx="1000" cy="420" r="320" />
          <g clipPath="url(#fz-globe)">
            {[80, 160, 240, 305].map((rx) => (
              <ellipse key={rx} cx="1000" cy="420" rx={rx} ry="320" />
            ))}
            {[-220, -110, 0, 110, 220].map((dy) => (
              <line key={dy} x1="660" x2="1340" y1={420 + dy} y2={420 + dy} />
            ))}
          </g>
        </g>

        {/* Route */}
        <path
          d="M760 600 C 860 470, 930 640, 1040 430 S 1180 300, 1150 250"
          fill="none"
          stroke="var(--color-ember)"
          strokeWidth="3"
          strokeDasharray="2 12"
          strokeLinecap="round"
        />
        <circle cx="760" cy="600" r="7" fill="var(--color-ivory)" />
        <circle cx="1150" cy="250" r="10" fill="var(--color-ember)" />
        <circle cx="1150" cy="250" r="26" fill="none" stroke="var(--color-ember)" strokeOpacity="0.55" />
        <circle cx="1150" cy="250" r="48" fill="none" stroke="var(--color-ember)" strokeOpacity="0.25" />

        {/* Infographic bars */}
        <g>
          {[
            [250, 0.14],
            [180, 0.14],
            [310, 1],
            [140, 0.14],
            [220, 0.14],
          ].map(([w, o], i) => (
            <g key={i}>
              <rect
                x="150"
                y={290 + i * 62}
                width={w}
                height="14"
                rx="2"
                fill={o === 1 ? "var(--color-ember)" : "var(--color-ivory)"}
                fillOpacity={o}
              />
              <rect x="150" y={312 + i * 62} width={w * 0.45} height="5" rx="2" fill="var(--color-ivory)" fillOpacity="0.1" />
            </g>
          ))}
        </g>

        {/* Narration waveform */}
        <g fill="var(--color-ivory)" fillOpacity="0.5">
          {wave.map((h, i) => (
            <rect key={i} x={512 + i * 8} y={728 - h / 2} width="3" height={h} rx="1.5" />
          ))}
        </g>
      </svg>
      <span className={`${styles.caption} eyebrow`}>[ Narration ]</span>
      <div className="grain absolute inset-0" />
    </div>
  );
}

function DocumentaryArt() {
  return (
    <div aria-hidden="true" className={styles.art}>
      <svg viewBox="0 0 2390 1000" preserveAspectRatio="xMidYMid slice" className={styles.svg}>
        <defs>
          <linearGradient id="doc-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0c0a09" />
            <stop offset="0.5" stopColor="#1f140e" />
            <stop offset="0.68" stopColor="#4a210d" />
          </linearGradient>
          <radialGradient id="doc-sun" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#ffd9b5" />
            <stop offset="0.45" stopColor="#ff8a4a" />
            <stop offset="1" stopColor="var(--color-ember)" />
          </radialGradient>
          <radialGradient id="doc-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="var(--color-ember)" stopOpacity="0.4" />
            <stop offset="1" stopColor="var(--color-ember)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="2390" height="1000" fill="url(#doc-sky)" />
        <circle cx="1560" cy="640" r="560" fill="url(#doc-glow)" />
        <circle cx="1560" cy="630" r="118" fill="url(#doc-sun)" />
        <path
          d="M0 650 L180 602 L360 632 L560 560 L760 612 L980 540 L1180 600 L1400 578 L1640 622 L1880 560 L2100 604 L2390 566 L2390 1000 L0 1000Z"
          fill="#1b120d"
        />
        <path
          d="M0 760 C300 690 520 722 760 700 S1200 660 1500 722 S2000 700 2390 682 L2390 1000 L0 1000Z"
          fill="#120d0a"
        />
        <path d="M0 880 C400 822 800 862 1200 842 S2000 802 2390 862 L2390 1000 L0 1000Z" fill="#0a0807" />
      </svg>
      <div className={styles.docTitle}>
        <span className="display text-ivory">
          <em>Act I</em>
        </span>
      </div>
      <div className="grain absolute inset-0" />
    </div>
  );
}

function ProductArt() {
  return (
    <div aria-hidden="true" className={styles.art}>
      <svg viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice" className={styles.svg}>
        <defs>
          <radialGradient id="pr-spot" cx="50%" cy="0%" r="80%">
            <stop offset="0" stopColor="var(--color-ivory)" stopOpacity="0.22" />
            <stop offset="1" stopColor="var(--color-ivory)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="pr-body" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#241c17" />
            <stop offset="0.42" stopColor="#5a463a" />
            <stop offset="1" stopColor="#1c1613" />
          </linearGradient>
          <radialGradient id="pr-floor" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="var(--color-ember)" stopOpacity="0.3" />
            <stop offset="1" stopColor="var(--color-ember)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="800" height="1000" fill="var(--color-ink-2)" />
        <rect width="800" height="1000" fill="url(#pr-spot)" />

        {/* Turntable */}
        <ellipse cx="400" cy="800" rx="250" ry="52" fill="var(--color-ink)" stroke="var(--color-ivory)" strokeOpacity="0.18" />
        <ellipse cx="400" cy="796" rx="190" ry="34" fill="url(#pr-floor)" />

        {/* Product */}
        <rect x="358" y="250" width="84" height="72" rx="9" fill="#3a2f28" />
        <rect x="372" y="316" width="56" height="42" fill="#2c231e" />
        <rect x="298" y="350" width="204" height="450" rx="46" fill="url(#pr-body)" />
        <rect x="493" y="392" width="4" height="370" rx="2" fill="var(--color-ember)" fillOpacity="0.85" />
        <rect x="305" y="392" width="2" height="370" rx="1" fill="var(--color-ivory)" fillOpacity="0.25" />
        <rect x="322" y="478" width="156" height="176" rx="4" fill="var(--color-ivory)" fillOpacity="0.92" />
        <rect x="342" y="506" width="78" height="10" rx="2" fill="var(--color-ink)" fillOpacity="0.75" />
        <rect x="342" y="528" width="112" height="5" rx="2" fill="var(--color-ink)" fillOpacity="0.35" />
        <rect x="342" y="542" width="94" height="5" rx="2" fill="var(--color-ink)" fillOpacity="0.35" />
        <circle cx="448" cy="620" r="11" fill="var(--color-ember)" />

        {/* Callout leaders */}
        <g fill="none" stroke="var(--color-ivory)" strokeOpacity="0.4">
          <polyline points="356,282 200,214 120,214" />
          <polyline points="497,560 620,486 700,486" />
          <polyline points="330,770 210,858 120,858" />
        </g>
        <g fill="var(--color-ivory)">
          <circle cx="356" cy="282" r="4" />
          <circle cx="497" cy="560" r="4" />
          <circle cx="330" cy="770" r="4" />
        </g>
      </svg>
      <span className={`${styles.chip} eyebrow`} style={{ left: "6%", top: "17.5%" }}>
        Hook · 0:00
      </span>
      <span className={`${styles.chip} eyebrow`} style={{ right: "4%", top: "44.5%" }}>
        Demo · 0:04
      </span>
      <span className={`${styles.chip} eyebrow`} style={{ left: "6%", top: "81.5%" }}>
        CTA · 0:12
      </span>
      <div className="grain absolute inset-0" />
    </div>
  );
}

const phones = [
  { words: ["Stop"], highlight: -1, className: "phoneLeft" },
  { words: ["The", "scroll"], highlight: 1, className: "phoneCenter" },
  { words: ["Loop"], highlight: -1, className: "phoneRight" },
] as const;

function VerticalArt() {
  return (
    <div aria-hidden="true" className={`${styles.art} ${styles.fan}`}>
      {phones.map((phone, p) => (
        <div key={p} className={`${styles.phone} ${styles[phone.className]}`}>
          <div className={styles.bars}>
            {[0, 1, 2].map((b) => (
              <span key={b} className={b <= p ? styles.barOn : undefined} />
            ))}
          </div>
          <div className={styles.safe} />
          <p className={`${styles.phoneCaption} wordmark`}>
            {phone.words.map((w, i) => (
              <span key={w} className={i === phone.highlight ? styles.hl : undefined}>
                {w}
              </span>
            ))}
          </p>
          <div className={styles.rail}>
            <span />
            <span />
            <span />
          </div>
        </div>
      ))}
      <div className="grain absolute inset-0" />
    </div>
  );
}
