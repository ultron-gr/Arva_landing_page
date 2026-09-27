/**
 * Native HTML/CSS + inline-SVG "ARVA" wordmark — the intro loader's final
 * frame. Built from the project's own type tokens (Syne display, Space Mono
 * label) instead of a PNG so it stays crisp at any size and can be scaled /
 * faded without raster artifacts. The looped tail under the "R" is a small
 * SVG accent approximating the client logo's distinctive swash — it is a
 * stylistic echo, not a pixel-trace of the source artwork. It inherits the
 * letterform's own color (no gold accent — the source mark is monochrome).
 */
export const ArvaWordmark = ({
  className = '',
  fontSize = 'clamp(2.6rem, 12vw, 4.75rem)',
}: {
  className?: string;
  /** CSS font-size for the "ARVA" row — defaults to the intro loader's responsive clamp. */
  fontSize?: string;
}) => (
  <div className={`flex select-none flex-col items-center ${className}`} style={{ fontSize }}>
    <div className="flex items-baseline leading-none font-display font-extrabold uppercase tracking-[-0.01em] text-white text-[1em]">
      <span>A</span>
      <span className="relative inline-block">
        R
        <svg
          viewBox="0 0 24 16"
          aria-hidden="true"
          className="pointer-events-none absolute h-[0.22em] w-[0.34em] text-current"
          style={{ bottom: '-0.03em', right: '-0.02em' }}
        >
          <path
            d="M3 2 C 9 2, 9 12, 16 12 C 19 12, 21 10.5, 21 8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span>V</span>
      <span>A</span>
    </div>
    <span className="mt-[0.08em] font-mono text-[0.19em] font-normal uppercase tracking-[0.55em] text-white/70">
      Studios
    </span>
  </div>
);
