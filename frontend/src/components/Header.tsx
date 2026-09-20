import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { BookACall } from './BookACall';
import { ArvaWordmark } from './intro/ArvaWordmark';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * Floating glass nav — spec: ONLY the logo mark + right-aligned utility pill
 * + "Book a Call →". No nav links, at any breakpoint.
 * A centered pill, fixed off the top edge (never in flow), sharp corners,
 * hairline border, backdrop blur instead of a shadow. `.glass-nav` in
 * index.css carries the blur/translucency + its no-blur-support fallback;
 * only background/border opacity change on scroll (no height animation).
 *
 * Mobile-first: base styles below are the <lg (hamburger) layout — logo left,
 * hamburger right, everything else lives in a slide-down drawer with room to
 * breathe. The lg: row is a desktop-only addition, not a shrink of it.
 */
export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const drawerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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

  return (
    <header
      data-testid="site-header"
      className={`glass-nav fixed left-1/2 top-3 z-50 flex h-14 w-[calc(100%-32px)] -translate-x-1/2 items-center justify-between px-4 md:top-5 md:h-16 md:w-[calc(100%-48px)] md:max-w-[1200px] md:px-7 ${
        scrolled ? 'glass-nav--scrolled' : ''
      }`}
    >
      <a
        href="#hero"
        aria-label="ARVA Studios — back to top"
        data-testid="header-logo-link"
        className="block shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--arva-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
      >
        <ArvaWordmark fontSize="clamp(1.5rem, 3vw, 2.4rem)" />
      </a>

      {/* Desktop: single row, logo | label | divider | button, each ≥24px apart */}
      <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
        {earlyAccessLabel}
        <span aria-hidden="true" className="h-4 w-px bg-[color:var(--arva-border-strong)]" />
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
        className={`flex h-11 w-11 items-center justify-center text-white transition-colors duration-200 hover:text-[color:var(--arva-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--arva-gold)] lg:hidden ${
          open ? 'text-[color:var(--arva-gold)]' : ''
        }`}
      >
        {open ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
      </button>

      {/* Mobile drawer — a separate floating panel directly beneath the bar,
          same glass treatment, sharp corners. Framer Motion handles the
          reveal since it needs to animate independently of the fixed bar. */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={drawerRef}
            id="mobile-nav-drawer"
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
