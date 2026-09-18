import { useEffect, useState } from 'react';

export interface LoadProgress {
  /** 0–100, weighted by real DOM/font/window-load milestones — never faked or guessed. */
  progress: number;
  /** True once every tracked critical-path milestone has actually resolved. */
  ready: boolean;
}

// Weighted so fonts — the biggest FOUT risk for the Syne/Space Mono wordmark
// and hero type — count for the most, but no single signal gates completion alone.
const WEIGHT_DOM = 30;
const WEIGHT_FONTS = 45;
const WEIGHT_LOAD = 25;

/**
 * Tracks real browser resource-loading signals (DOM parse, font-face loading,
 * window load) instead of a guessed percentage. Consumers decide their own
 * floor/ceiling policy around `ready` — this hook only reports what's
 * actually true right now.
 */
export function useLoadProgress(): LoadProgress {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof document === 'undefined') {
      setProgress(100);
      setReady(true);
      return;
    }

    let cancelled = false;
    const done = { dom: false, fonts: false, load: false };

    const recompute = () => {
      if (cancelled) return;
      const pct = (done.dom ? WEIGHT_DOM : 0) + (done.fonts ? WEIGHT_FONTS : 0) + (done.load ? WEIGHT_LOAD : 0);
      setProgress(pct);
      if (done.dom && done.fonts && done.load) setReady(true);
    };

    if (document.readyState !== 'loading') {
      done.dom = true;
    } else {
      document.addEventListener('DOMContentLoaded', () => { done.dom = true; recompute(); }, { once: true });
    }

    if (document.fonts) {
      document.fonts.ready
        .then(() => { done.fonts = true; recompute(); })
        .catch(() => { done.fonts = true; recompute(); });
    } else {
      // Font Loading API unsupported (older Safari) — don't block readiness on it.
      done.fonts = true;
    }

    if (document.readyState === 'complete') {
      done.load = true;
    } else {
      window.addEventListener('load', () => { done.load = true; recompute(); }, { once: true });
    }

    recompute();
    return () => {
      cancelled = true;
    };
  }, []);

  return { progress, ready };
}
