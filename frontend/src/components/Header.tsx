import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { BookACall } from './BookACall';
import { ArvaWordmark } from './intro/ArvaWordmark';
import { useReducedMotion } from '../hooks/useReducedMotion';

type Tone = 'dark' | 'light';

const DESKTOP_BREAKPOINT = '(min-width: 768px)';
// Nav vertical center per breakpoint (top + height / 2) — the thin
// IntersectionObserver band sits exactly here, not at the bar's edges.
const NAV_CENTER_DESKTOP = 52; // top 20px + height 64px / 2
const NAV_CENTER_MOBILE = 40; // top 12px + height 56px / 2

/**
 * Adaptive transparent nav — no fixed panel. It reads the section behind
 * it (`data-nav="dark"|"light"` on every top-level section, set by that
 * section's own background) and flips ink + a whisper-thin veil to match:
 * dark section -> white ink, dark veil; light section -> black ink, light
 * veil. `tone` and `scrolled` are never React state — a single
 * rAF-throttled scroll listener writes `data-tone`/`data-scrolled`
 * straight onto the header element (see that effect for why this ended up
 * as a cached-position lookup rather than the IntersectionObserver this
 * started as), so the nav subtree never re-renders on scroll. Only
 * background-color/color/opacity transition, 120ms linear — no easing, no
 * blur/height/top/width animation.
 *
 * Mobile-first: base styles below are the <lg (hamburger) layout — logo left,
 * hamburger right, everything else lives in a slide-down drawer with room to
 * breathe. The lg: row is a desktop-only addition, not a shrink of it.
 */
export const Header = () => {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const navRef = useRef<HTMLElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Tone + scrolled, both driven by one rAF-throttled scroll tick — no
  // React state, so the nav subtree never re-renders on scroll.
  //
  // Tone started out as a single 1px-band IntersectionObserver, per spec.
  // Dropped it: IO only fires when an element's intersection *changes*,
  // and a fast scroll (a real trackpad fling, repeated Page Down, an
  // anchor jump — not just automated testing) can carry a section's
  // bottom edge past that 1px line between two browser check cycles,
  // silently skipping its enter/exit event and leaving the nav stuck on
  // a stale tone. Instead, each section's document-relative top/bottom is
  // cached once (recomputed on resize/breakpoint-change/DOM mutation),
  // and the scroll tick does a cheap numeric lookup — no per-tick DOM
  // reads, and correct regardless of scroll speed since it's driven by
  // scrollY directly rather than by catching a crossing in the act.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    let sections: { tone: Tone; top: number; bottom: number }[] = [];
    let lineY = NAV_CENTER_MOBILE;

    const recomputeSections = () => {
      const scrollY = window.scrollY;
      sections = [...document.querySelectorAll('[data-nav]')].map((el) => {
        const rect = el.getBoundingClientRect();
        return {
          tone: (el.getAttribute('data-nav') === 'light' ? 'light' : 'dark') as Tone,
          top: rect.top + scrollY,
          bottom: rect.bottom + scrollY,
        };
      });
    };

    const recomputeLine = () => {
      lineY = window.matchMedia(DESKTOP_BREAKPOINT).matches ? NAV_CENTER_DESKTOP : NAV_CENTER_MOBILE;
    };

    const recomputeAll = () => {
      recomputeLine();
      recomputeSections();
    };

    recomputeAll();

    const apply = () => {
      const scrollY = window.scrollY;
      const line = scrollY + lineY;
      const match = sections.find((s) => line >= s.top && line < s.bottom);
      if (match && nav.dataset.tone !== match.tone) nav.dataset.tone = match.tone;
      const nextScrolled = scrollY > 24 ? 'true' : 'false';
      if (nav.dataset.scrolled !== nextScrolled) nav.dataset.scrolled = nextScrolled;
    };
    apply();

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        apply();
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    let resizeTicking = false;
    const onResize = () => {
      if (resizeTicking) return;
      resizeTicking = true;
      requestAnimationFrame(() => {
        recomputeAll();
        apply();
        resizeTicking = false;
      });
    };
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('load', onResize);

    // Below-the-fold sections mount later via React.lazy/Suspense.
    const mo = new MutationObserver(() => {
      recomputeSections();
      apply();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', onResize);
      mo.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Close on tap/click outside the drawer (and outside the toggle, which
  // already handles its own open/close).
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (drawerRef.current?.contains(target) || toggleRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  // Lock body scroll while the drawer is open, without letting the page jump
  // when it closes.
  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    const { body } = document;
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    return () => {
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  const earlyAccessLabel = (
    <span
      className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[color:var(--arva-gold)]"
      data-testid="header-early-access-label"
    >
      <span className="h-1.5 w-1.5 shrink-0 bg-[color:var(--arva-gold)]" aria-hidden="true" />
      Early Access — Dec 2026
    </span>
  );

  // Read at open-time (a plain DOM read, not reactive state) so the drawer
  // opens already matching whatever tone the bar is currently showing.
  const drawerTone: Tone = navRef.current?.dataset.tone === 'light' ? 'light' : 'dark';

  return (
    <header
      ref={navRef}
      data-testid="site-header"
      data-tone="dark"
      data-scrolled="false"
      className="glass-nav fixed left-1/2 top-3 z-50 flex h-14 w-[calc(100%-32px)] -translate-x-1/2 items-center justify-between px-4 md:top-5 md:h-16 md:w-[calc(100%-48px)] md:max-w-[1200px] md:px-7"
    >
      <a
        href="#hero"
        aria-label="ARVA Studios — back to top"
        data-testid="header-logo-link"
        className="block shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--arva-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--nav-ring-offset)]"
      >
        <ArvaWordmark fontSize="clamp(1.5rem, 3vw, 2.4rem)" inheritColor />
      </a>

      {/* Desktop: single row, logo | label | divider | button, each ≥24px apart */}
      <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
        {earlyAccessLabel}
        <span aria-hidden="true" className="h-4 w-px bg-current opacity-20" />
        <BookACall variant="nav" testId="header-book-call-button" />
      </nav>

      {/* Mobile / tablet: hamburger only — label + CTA move into the drawer */}
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        aria-label={open ? 'Close menu' : 'Open menu'}
        data-testid="header-menu-toggle"
        className="flex h-11 w-11 items-center justify-center text-inherit transition-colors duration-200 hover:text-[color:var(--arva-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--arva-gold)] lg:hidden"
      >
        {open ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
      </button>

      {/* Mobile drawer — a separate floating panel directly beneath the bar,
          same glass treatment, sharp corners, and the same tone the bar is
          currently showing. Framer Motion handles the reveal since it needs
          to animate independently of the fixed bar. */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={drawerRef}
            id="mobile-nav-drawer"
            data-tone={drawerTone}
            initial={{ opacity: 0, y: reduced ? 0 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : -8 }}
            transition={{ duration: reduced ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => {
              if ((e.target as HTMLElement).closest('a')) setOpen(false);
            }}
            className="glass-nav fixed left-1/2 top-[80px] w-[calc(100%-32px)] -translate-x-1/2 px-4 py-5 md:top-[96px] md:w-[calc(100%-48px)] md:max-w-[1200px] md:px-7 lg:hidden"
          >
            <div className="flex flex-col items-stretch gap-4">
              {earlyAccessLabel}
              <BookACall variant="nav" className="w-full justify-center" testId="header-book-call-button-mobile" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
