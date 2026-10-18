// src/components/work/project-media.tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { announcePlay, onOtherPlay } from "@/lib/media-bus";
import { useCardCover } from "./stack";

type VideoSource =
  | { kind: "youtube"; id: string }
  | { kind: "vimeo"; id: string }
  | { kind: "drive"; id: string }
  | { kind: "file"; url: string };

function parseVideo(url: string): VideoSource {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return { kind: "youtube", id: yt[1] };
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return { kind: "vimeo", id: vimeo[1] };
  const drive = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([\w-]+)/);
  if (drive) return { kind: "drive", id: drive[1] };
  return { kind: "file", url };
}

function embedUrl(source: Exclude<VideoSource, { kind: "file" }>): string {
  switch (source.kind) {
    case "youtube":
      // enablejsapi lets the page pause the player when the viewer moves on.
      return `https://www.youtube-nocookie.com/embed/${source.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`;
    case "vimeo":
      return `https://player.vimeo.com/video/${source.id}?autoplay=1&dnt=1`;
    case "drive":
      return `https://drive.google.com/file/d/${source.id}/preview`;
  }
}

interface ProjectMediaProps {
  id: string;
  title: string;
  videoUrl: string;
  /** Still image or artwork, plus any overlay, shown before playback. */
  children: ReactNode;
}

/**
 * Plays a published project. Nothing heavy loads until the viewer presses play,
 * and only one video plays at a time: starting another, scrolling the card out of
 * view, or covering it with the next card pauses this one.
 */
export function ProjectMedia({ id, title, videoUrl, children }: ProjectMediaProps) {
  const source = useMemo(() => parseVideo(videoUrl), [videoUrl]);
  const [started, setStarted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const subscribeCover = useCardCover();

  const stop = useCallback(() => {
    const frame = iframeRef.current?.contentWindow;
    switch (source.kind) {
      case "file":
        videoRef.current?.pause();
        break;
      case "youtube":
        frame?.postMessage(JSON.stringify({ event: "command", func: "pauseVideo", args: [] }), "*");
        break;
      case "vimeo":
        frame?.postMessage(JSON.stringify({ method: "pause" }), "*");
        break;
      case "drive":
        // Drive's player has no pause API, so close it back to the thumbnail.
        setStarted(false);
        break;
    }
  }, [source]);

  const start = () => {
    setStarted(true);
    announcePlay(id);
  };

  // Another video started: step aside.
  useEffect(() => {
    if (!started) return;
    return onOtherPlay(id, stop);
  }, [started, id, stop]);

  // The next stacked card slid over this one.
  useEffect(() => {
    if (!started || !subscribeCover) return;
    return subscribeCover((covered) => {
      if (covered) stop();
    });
  }, [started, subscribeCover, stop]);

  // Scrolled mostly out of view.
  useEffect(() => {
    const el = rootRef.current;
    if (!started || !el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < 0.35) stop();
      },
      { threshold: [0, 0.35] },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started, stop]);

  // Resuming from the embed's own controls focuses its iframe: claim playback then.
  useEffect(() => {
    if (!started || source.kind === "file") return;
    const onBlur = () =>
      window.setTimeout(() => {
        if (document.activeElement === iframeRef.current) announcePlay(id);
      }, 0);
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, [started, source.kind, id]);

  return (
    <div ref={rootRef} className="absolute inset-0">
      {started ? (
        source.kind === "file" ? (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full bg-ink object-contain"
            src={source.url}
            controls
            autoPlay
            playsInline
            onPlay={() => announcePlay(id)}
            aria-label={`${title} video`}
          />
        ) : (
          <iframe
            ref={iframeRef}
            className="absolute inset-0 h-full w-full bg-ink"
            src={embedUrl(source)}
            title={`${title} video player`}
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
          />
        )
      ) : (
        <button
          type="button"
          onClick={start}
          className="group absolute inset-0 block h-full w-full cursor-pointer overflow-hidden text-left"
        >
          <span className="sr-only">Play {title}</span>
          <span
            aria-hidden="true"
            className="ease-out-expo absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]"
          >
            {children}
          </span>
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ember text-ink shadow-[0_8px_40px_rgb(0_0_0/0.45)] transition-transform duration-300 group-hover:scale-110 lg:h-20 lg:w-20"
          >
            <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 lg:h-7 lg:w-7" fill="currentColor">
              <path d="M7 4.5v15l13-7.5z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
