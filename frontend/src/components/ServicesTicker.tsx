import { useEffect, useRef, useState } from 'react';

const TICKER_ITEMS = [
  'VIDEO PRODUCTION',
  'WEB PRODUCTS',
  'AUTOMATION & AI',
  'BRAND DESIGN',
  'CONTENT STRATEGY',
  'CLIENT PORTALS',
  'BRAND FILMS',
  'LEAD AUTOMATION',
];

const REPEAT_COUNT = 4;
const PIXELS_PER_SECOND = 60;
const FALLBACK_DURATION_S = 40;

const TICKER_TEXT = Array.from({ length: REPEAT_COUNT }, () => `${TICKER_ITEMS.join(' · ')} ·`).join(' ');

/**
 * Full-width auto-scrolling services strip. Two identical copies of the same
 * track sit side by side and the pair translates by exactly one copy's width
 * (-50%) so the loop is seamless; duration is derived from the track's real
 * measured width so the scroll speed holds at ~60px/s regardless of viewport
 * or font metrics.
 */
export const ServicesTicker = () => {
  const trackRef = useRef<HTMLSpanElement>(null);
  const [durationS, setDurationS] = useState(FALLBACK_DURATION_S);

  useEffect(() => {
    const width = trackRef.current?.getBoundingClientRect().width;
    if (width) setDurationS(width / PIXELS_PER_SECOND);
  }, []);

  return (
    <div className="relative h-12 w-full overflow-hidden bg-[#111111]" data-testid="hero-services-ticker" aria-hidden="true">
      <div
        className="flex h-full w-max items-center will-change-transform"
        style={{ animation: `ticker-scroll ${durationS}s linear infinite` }}
      >
        <span ref={trackRef} className="flex shrink-0 whitespace-nowrap font-mono text-[11px] uppercase tracking-wider text-[color:var(--arva-text-muted)]">
          {TICKER_TEXT}
        </span>
        <span className="flex shrink-0 whitespace-nowrap font-mono text-[11px] uppercase tracking-wider text-[color:var(--arva-text-muted)]">
          {TICKER_TEXT}
        </span>
      </div>
    </div>
  );
};
