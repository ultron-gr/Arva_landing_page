import { useEffect, useState } from 'react';
import { Pill } from './Pill';
import { BookACall } from './BookACall';

/**
 * Sticky header — spec: ONLY the square logo mark + right-aligned utility pill
 * + "Book a Call →". No nav links, no hamburger, at any breakpoint.
 * Shrinks modestly on scroll and gains a border + subtle shadow.
 */
export const Header = () => {
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <header
      data-testid="site-header"
      className={`fixed inset-x-0 top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur transition-[padding,box-shadow] duration-200 ${
        scrolled
          ? 'py-2 border-b border-[color:var(--arva-border)] shadow-[0_10px_30px_rgba(0,0,0,0.35)]'
          : 'py-4 border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex w-full max-w-site items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          href="#hero"
          aria-label="ARVA Studios — back to top"
          data-testid="header-logo-link"
          className="block shrink-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--arva-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
        >
          <img
            src="/brand/arva-logo-tile.png"
            alt="ARVA Studios"
            width={40}
            height={40}
            className={`transition-[width,height] duration-200 ${scrolled ? 'h-8 w-8' : 'h-10 w-10'}`}
          />
        </a>
        <nav aria-label="Primary" className="flex items-center gap-2 sm:gap-3">
          <Pill className="hidden xs:inline-flex" data-testid="header-early-access-pill">
            <span className="hidden sm:inline">Early Access — Dec 2026</span>
            <span className="sm:hidden">Early Access</span>
          </Pill>
          <BookACall variant="utility" testId="header-book-call-button" />
        </nav>
      </div>
    </header>
  );
};
