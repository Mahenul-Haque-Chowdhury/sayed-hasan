// src/components/hero/showreel.tsx
"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { site } from "@/content/site";
import { announcePlay, onOtherPlay } from "@/lib/media-bus";

const REEL_ID = "showreel";

interface ShowreelVideoProps {
  src: string;
  autoPlay: boolean;
  ref: RefObject<HTMLVideoElement | null>;
}

/**
 * Optional hero showreel, activated by setting `site.showreel.videoUrl`.
 * Always starts muted, and rests while the hero is off screen.
 */
export function ShowreelVideo({ src, autoPlay, ref }: ShowreelVideoProps) {
  const pausedByScroll = useRef(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && !v.paused) {
        pausedByScroll.current = true;
        v.pause();
      } else if (entry.isIntersecting && pausedByScroll.current) {
        pausedByScroll.current = false;
        void v.play().catch(() => {});
      }
    });
    observer.observe(v);
    return () => observer.disconnect();
  }, [ref]);

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover"
      src={src}
      poster={site.showreel.poster ?? undefined}
      autoPlay={autoPlay}
      muted
      loop
      playsInline
      preload={autoPlay ? "auto" : "metadata"}
    />
  );
}

export function ShowreelControls({ videoRef }: { videoRef: RefObject<HTMLVideoElement | null> }) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const sync = () => {
      setPlaying(!v.paused);
      setMuted(v.muted);
    };
    sync();
    v.addEventListener("play", sync);
    v.addEventListener("pause", sync);
    v.addEventListener("volumechange", sync);
    // A project video started: drop back to a silent loop.
    const off = onOtherPlay(REEL_ID, () => {
      v.muted = true;
    });
    return () => {
      v.removeEventListener("play", sync);
      v.removeEventListener("pause", sync);
      v.removeEventListener("volumechange", sync);
      off();
    };
  }, [videoRef]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  };

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    if (!v.muted) {
      announcePlay(REEL_ID);
      if (v.paused) void v.play();
    }
  };

  return (
    <div className="flex gap-2">
      <button type="button" onClick={togglePlay} className="btn btn-ghost min-h-11 px-4 text-xs">
        {playing ? "Pause showreel" : "Play showreel"}
      </button>
      <button type="button" onClick={toggleSound} aria-pressed={!muted} className="btn btn-ghost min-h-11 px-4 text-xs">
        Sound {muted ? "on" : "off"}
      </button>
    </div>
  );
}
