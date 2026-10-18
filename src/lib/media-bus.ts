// src/lib/media-bus.ts
// One video with sound at a time: whoever starts playing announces it, and every
// other player pauses (or mutes, for the hero loop) when it hears that.

const EVENT = "sh:media-play";

export function announcePlay(id: string) {
  window.dispatchEvent(new CustomEvent<string>(EVENT, { detail: id }));
}

/** Calls `onOther` whenever a different player starts. Returns an unsubscribe. */
export function onOtherPlay(id: string, onOther: () => void) {
  const handler = (event: Event) => {
    if ((event as CustomEvent<string>).detail !== id) onOther();
  };
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
