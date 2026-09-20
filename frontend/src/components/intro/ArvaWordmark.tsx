/**
 * Native HTML/CSS "ARVA" wordmark — the intro loader's final frame. Built
 * from the project's own type tokens (Syne display, Space Mono label)
 * instead of a PNG so it stays crisp at any size and can be scaled / faded
 * without raster artifacts. Matches the corrected client mark: a plain,
 * straight-legged "R" with no swash.
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
      <span>R</span>
      <span>V</span>
      <span>A</span>
    </div>
    <span className="mt-[0.08em] font-mono text-[0.19em] font-normal uppercase tracking-[0.55em] text-white/70">
      Studios
    </span>
  </div>
);
