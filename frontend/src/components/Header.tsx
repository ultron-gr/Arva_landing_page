import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { BookACall } from './BookACall';
import { ArvaWordmark } from './intro/ArvaWordmark';

/**
 * Flat header — spec: ONLY the logo mark + right-aligned utility pill
 * + "Book a Call →". No nav links, at any breakpoint.
 * Transparent at rest; solid blurred-black bar once scrolled. No rounded
 * corners anywhere in the bar — matches the sharp-cornered nav pattern
 * used across the rest of the site.
 *
 * Mobile-first: base styles below are the <lg (hamburger) layout — logo left,
 * hamburger right, everything else lives in a slide-down drawer with room to
 * breathe. The lg: row is a desktop-only addition, not a shrink of it.
 */
export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 12);
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
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled
          ? 'border-[color:var(--arva-border)] bg-black/80 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-[20px]'
          : 'border-transparent bg-transparent'
      }`}
    >
      <div
        className={`mx-auto flex w-full max-w-site items-center justify-between px-6 transition-[height] duration-300 lg:px-[60px] ${
          scrolled ? 'h-12 lg:h-16' : 'h-16 lg:h-[72px]'
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
      </div>

      {/* Mobile drawer — stacked, generously spaced, min 44px touch targets */}
      <div
        id="mobile-nav-drawer"
        className={`grid border-t bg-black/95 backdrop-blur transition-[grid-template-rows,border-color] duration-300 ease-out lg:hidden ${
          open ? 'grid-rows-[1fr] border-[color:var(--arva-border)]' : 'grid-rows-[0fr] border-transparent'
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col items-stretch gap-4 px-4 py-5 sm:px-6">
            {earlyAccessLabel}
            <BookACall variant="nav" className="w-full justify-center" testId="header-book-call-button-mobile" />
          </div>
        </div>
      </div>
    </header>
  );
};
