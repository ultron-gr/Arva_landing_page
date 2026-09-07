import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * Splash — full-black, centered wordmark, auto-dismisses into the hero after
 * ~2.6s. Always shows an explicit, keyboard-operable "Skip →" control.
 * prefers-reduced-motion: shortened (not removed) — brief hold, fast fade.
 */
export const Splash = ({ onDone }: { onDone: () => void }) => {
  const reduced = useReducedMotion();
  const [leaving, setLeaving] = useState(false);
  const doneRef = useRef(false);

  const holdMs = reduced ? 700 : 2600;
  const fadeMs = reduced ? 120 : 500;

  const dismiss = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setLeaving(true);
    window.setTimeout(onDone, fadeMs);
  }, [fadeMs, onDone]);

  useEffect(() => {
    const t = window.setTimeout(dismiss, holdMs);
    return () => window.clearTimeout(t);
  }, [dismiss, holdMs]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dismiss]);

  return (
    <div
      data-testid="splash-screen"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black noise"
      style={{ opacity: leaving ? 0 : 1, transition: `opacity ${fadeMs}ms var(--ease-out)` }}
      aria-label="ARVA Studios intro"
    >
      <button
        type="button"
        onClick={dismiss}
        data-testid="splash-skip-button"
        className="absolute right-4 top-4 inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-[color:var(--arva-border)] px-4 py-2 text-xs text-[color:var(--arva-text-muted)] transition-colors duration-200 hover:border-[color:var(--arva-gold-muted)] hover:text-[color:var(--arva-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--arva-gold)]"
      >
        Skip <span aria-hidden="true">→</span>
      </button>

      <img src="/brand/arva-logo-tile.png" alt="" width={72} height={72} className="mb-8 h-[72px] w-[72px]" />
      <p className="font-display text-4xl uppercase tracking-tight text-white sm:text-5xl">Arva Studios</p>
      <div className="gold-rule my-6" aria-hidden="true" />
      <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--arva-text-subtle)]">Bengaluru · Est. 2026</p>
    </div>
  );
};
