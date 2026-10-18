// src/components/copy-email.tsx
"use client";

import { useEffect, useRef, useState } from "react";

/** Shows an email address with a copy button, for visitors without a mail app. */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // Clipboard blocked: select the address so it can be copied by hand.
      const range = document.createRange();
      const node = document.getElementById("contact-email");
      if (!node) return;
      range.selectNodeContents(node);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      return;
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <span id="contact-email" className="text-base text-ink md:text-lg">
        {email}
      </span>
      <button
        type="button"
        onClick={copy}
        className="eyebrow radius-ui min-h-11 border border-ink-line px-3 text-paper-dim transition-colors hover:border-ink hover:text-ink"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Email address copied" : ""}
      </span>
    </div>
  );
}
