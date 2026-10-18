// src/lib/timecode.ts
export const FPS = 24;

/** Formats a frame count as an HH:MM:SS:FF timecode. */
export function toTimecode(frames: number, fps: number = FPS): string {
  const total = Math.max(0, Math.floor(frames));
  const ff = total % fps;
  const seconds = Math.floor(total / fps);
  return [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60, ff]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
}

/** Maps page scroll distance to frames: every 3px scrolled is one frame. */
export function scrollToFrames(scrollY: number): number {
  return scrollY / 3;
}

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
