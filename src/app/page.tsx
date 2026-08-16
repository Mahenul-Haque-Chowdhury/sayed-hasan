"use client";

import { useEffect, useRef, useState } from "react";

const NAME = "SAYED HASAN";

const TITLE_VARIANTS = [
  "SAYED HASAN",
  "sAyEd HaSaN",
  "S A Y E D  H A S A N",
  "😤 SAYED HASAN 😤",
  "SAYED HASAN IS WATCHING",
  "NAESH DEYAS",
  "SAYED HASAN.",
  "SAYED HASAN!!!",
];

const CLICK_TAUNTS = [
  "SAYED HASAN",
  "you clicked. SAYED HASAN thanks you.",
  "SAYED HASAN grows stronger",
  "STOP CLICKING (SAYED HASAN)",
  "sayed hasan sayed hasan sayed hasan",
  "🎬 SAYED HASAN 🎬",
  "another one for SAYED HASAN",
  "SAYED HASAN x100",
];

function speakName() {
  if (typeof window === "undefined") return;
  try {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const utter = new SpeechSynthesisUtterance("SAYED HASAN");
    utter.pitch = Math.random() * 1.5 + 0.5;
    utter.rate = Math.random() * 0.6 + 0.9;
    synth.speak(utter);
  } catch {
    // speech synthesis unsupported, silently ignore
  }
}

interface FloatingTag {
  id: number;
  x: number;
  y: number;
  text: string;
  rotate: number;
  size: number;
  color: string;
}

const COLORS = [
  "#ff004c",
  "#ff9900",
  "#ffee00",
  "#33ff00",
  "#00d4ff",
  "#8f00ff",
  "#ff00d4",
];

export default function Home() {
  const [clickCount, setClickCount] = useState(0);
  const [shaking, setShaking] = useState(false);
  const [tags, setTags] = useState<FloatingTag[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupNoCount, setPopupNoCount] = useState(0);
  const [yesDodges, setYesDodges] = useState(0);
  const [yesPos, setYesPos] = useState<{ top: number; left: number } | null>(
    null
  );
  const [yesEscaped, setYesEscaped] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches
  );
  const yesBtnRef = useRef<HTMLButtonElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const idRef = useRef(0);
  const lastTrailTime = useRef(0);

  // background audio: try to autoplay immediately, and if the browser
  // blocks it, fall back to starting on the very first user interaction
  useEffect(() => {
    const audio = new Audio("/audio-editor-output.mp3");
    audio.loop = true;
    audio.volume = 1;
    audioRef.current = audio;

    audio.play().catch(() => {
      function startOnInteraction() {
        audio.play().catch(() => {});
        window.removeEventListener("click", startOnInteraction);
        window.removeEventListener("keydown", startOnInteraction);
        window.removeEventListener("pointerdown", startOnInteraction);
      }
      window.addEventListener("click", startOnInteraction);
      window.addEventListener("keydown", startOnInteraction);
      window.addEventListener("pointerdown", startOnInteraction);
    });

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  // detect touch/mobile devices: no cursor to dodge, so hide the YES button
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    function handleChange(e: MediaQueryListEvent) {
      setIsMobile(e.matches);
    }
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  // title cycling + flashing favicon-ish tab
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % TITLE_VARIANTS.length;
      document.title = TITLE_VARIANTS[i];
    }, 700);
    return () => clearInterval(interval);
  }, []);

  // random unsolicited voice shout every so often
  useEffect(() => {
    const interval = setInterval(() => {
      speakName();
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  // random popup ambush
  useEffect(() => {
    const timeout = setTimeout(() => setShowPopup(true), 4000);
    return () => clearTimeout(timeout);
  }, []);

  // cursor trail spawning tiny name tags
  useEffect(() => {
    function handleMove(e: MouseEvent) {
      const now = Date.now();
      if (now - lastTrailTime.current < 90) return;
      lastTrailTime.current = now;
      const el = document.createElement("div");
      el.textContent = NAME;
      el.style.position = "fixed";
      el.style.left = `${e.clientX + (Math.random() * 20 - 10)}px`;
      el.style.top = `${e.clientY + (Math.random() * 20 - 10)}px`;
      el.style.fontSize = "10px";
      el.style.fontWeight = "bold";
      el.style.color =
        COLORS[Math.floor(Math.random() * COLORS.length)];
      el.style.pointerEvents = "none";
      el.style.zIndex = "9999";
      el.style.transition = "opacity 1s, transform 1s";
      el.style.whiteSpace = "nowrap";
      document.body.appendChild(el);
      requestAnimationFrame(() => {
        el.style.opacity = "0";
        el.style.transform = "translateY(-30px) scale(0.5)";
      });
      setTimeout(() => el.remove(), 1000);
    }
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  function handleGlobalClick(e: React.MouseEvent) {
    setClickCount((c) => c + 1);
    setShaking(true);
    speakName();
    setTimeout(() => setShaking(false), 400);

    const id = idRef.current++;
    const text =
      CLICK_TAUNTS[Math.floor(Math.random() * CLICK_TAUNTS.length)];
    const tag: FloatingTag = {
      id,
      x: e.clientX,
      y: e.clientY,
      text,
      rotate: Math.random() * 60 - 30,
      size: Math.random() * 16 + 14,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
    setTags((prev) => [...prev, tag]);
    setTimeout(() => {
      setTags((prev) => prev.filter((t) => t.id !== id));
    }, 1200);
  }

  function handlePopupNo() {
    setPopupNoCount((c) => c + 1);
    setShowPopup(false);
    setTimeout(() => setShowPopup(true), 400);
  }

  function dodgeYesButton() {
    setYesDodges((d) => d + 1);
    setYesEscaped(true);
    speakName();
    const margin = 80;
    const top = margin + Math.random() * (window.innerHeight - margin * 2);
    const left = margin + Math.random() * (window.innerWidth - margin * 2);
    setYesPos({ top, left });
  }

  const nameSizeMultiplier = 1 + Math.min(clickCount, 40) * 0.03;

  return (
    <div
      onClick={handleGlobalClick}
      className={`relative flex flex-1 flex-col items-center justify-center overflow-hidden select-none ${
        shaking ? "shaking" : ""
      }`}
      style={{
        background:
          "radial-gradient(circle at 50% 50%, #2a0040 0%, #0a0014 70%)",
      }}
    >
      {/* background name spam grid */}
      <div className="absolute inset-0 grid grid-cols-4 gap-4 p-4 opacity-10 pointer-events-none select-none sm:grid-cols-8">
        {Array.from({ length: 64 }).map((_, i) => (
          <span
            key={i}
            className="whitespace-nowrap text-xs font-black"
            style={{ transform: `rotate(${(i % 7) * 5 - 15}deg)` }}
          >
            {NAME}
          </span>
        ))}
      </div>

      {/* top marquee */}
      <div className="absolute top-0 left-0 w-full overflow-hidden border-b-4 border-yellow-400 bg-black py-2">
        <div className="marquee">
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className="mx-4 whitespace-nowrap text-xl font-black text-yellow-400"
            >
              SAYED HASAN •
            </span>
          ))}
        </div>
      </div>

      {/* bottom marquee reverse */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden border-t-4 border-pink-500 bg-black py-2">
        <div className="marquee-reverse">
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className="mx-4 whitespace-nowrap text-xl font-black text-pink-500"
            >
              SAYED HASAN •
            </span>
          ))}
        </div>
      </div>

      {/* spinning name badge */}
      <div className="spin-slow absolute right-6 top-16 hidden text-4xl sm:block">
        🌀
      </div>
      <div className="spin-slow absolute left-6 bottom-16 hidden text-4xl sm:block">
        🎬
      </div>

      {/* main content */}
      <main className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
        <h1
          className="title-wiggle rainbow-text text-5xl font-black tracking-tight drop-shadow-[0_0_20px_rgba(255,0,212,0.6)] sm:text-7xl md:text-8xl"
          style={{ transform: `scale(${nameSizeMultiplier})` }}
        >
          SAYED HASAN
        </h1>

        <p className="max-w-md text-lg font-bold text-white/80">
          click anywhere. it does not stop. it will never stop. this is
          SAYED HASAN&apos;s website now.
        </p>

        <div className="rounded-full border-2 border-dashed border-yellow-400 bg-black/40 px-6 py-2 text-sm font-bold text-yellow-300">
          clicks fed to SAYED HASAN: {clickCount}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            speakName();
            setShaking(true);
            setTimeout(() => setShaking(false), 400);
          }}
          className="pop-in rounded-full bg-pink-500 px-8 py-4 text-xl font-black text-white shadow-[0_0_30px_rgba(255,0,212,0.8)] transition-transform hover:scale-110 active:scale-95"
        >
          🔊 SAY THE NAME AGAIN
        </button>
      </main>

      {/* floating click taunts */}
      {tags.map((tag) => (
        <span
          key={tag.id}
          className="float-away pointer-events-none fixed z-50 font-black"
          style={{
            left: tag.x,
            top: tag.y,
            transform: `rotate(${tag.rotate}deg)`,
            fontSize: `${tag.size}px`,
            color: tag.color,
            textShadow: "0 0 8px rgba(0,0,0,0.8)",
          }}
        >
          {tag.text}
        </span>
      ))}

      {/* ambush popup */}
      {showPopup && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <div className="pop-in mx-4 max-w-sm rounded-2xl border-4 border-yellow-400 bg-zinc-900 p-6 text-center shadow-2xl">
            <p className="mb-4 text-xl font-black text-white">
              Do you accept that{" "}
              <span className="rainbow-text">SAYED HASAN</span> is the
              greatest video editor of all time?
            </p>
            {popupNoCount > 0 && (
              <p className="mb-3 text-sm font-bold text-red-400">
                unacceptable. SAYED HASAN demands you try again. (
                {popupNoCount} {popupNoCount === 1 ? "attempt" : "attempts"}{" "}
                rejected)
              </p>
            )}
            {!isMobile && yesDodges > 0 && (
              <p className="mb-3 text-sm font-bold text-green-400">
                YES has evaded you {yesDodges}{" "}
                {yesDodges === 1 ? "time" : "times"}. it will not stop.
              </p>
            )}
            <div className="relative flex h-24 items-center justify-center gap-4">
              {!isMobile && !yesEscaped && (
                <button
                  ref={yesBtnRef}
                  onMouseEnter={dodgeYesButton}
                  onClick={dodgeYesButton}
                  onFocus={dodgeYesButton}
                  className="rounded-full bg-green-500 px-6 py-2 font-black text-white transition-none"
                >
                  YES
                </button>
              )}
              <button
                onClick={handlePopupNo}
                className="rounded-full bg-red-500 px-6 py-2 font-black text-white hover:scale-105"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* once YES has been touched once, it escapes the popup and roams
          the whole screen forever, teleporting away from the cursor */}
      {!isMobile && yesEscaped && yesPos && (
        <button
          onMouseEnter={dodgeYesButton}
          onClick={dodgeYesButton}
          onFocus={dodgeYesButton}
          style={{
            position: "fixed",
            top: yesPos.top,
            left: yesPos.left,
            transform: "translate(-50%, -50%)",
          }}
          className="z-110 rounded-full bg-green-500 px-6 py-2 font-black text-white shadow-[0_0_20px_rgba(34,197,94,0.8)] transition-none"
        >
          YES
        </button>
      )}
    </div>
  );
}
