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
  inheritColor = false,
}: {
  className?: string;
  /** CSS font-size for the "ARVA" row — defaults to the intro loader's responsive clamp. */
  fontSize?: string;
  /** Inherit `color` from an ancestor instead of the fixed intro-loader white — for contexts (like the adaptive nav) that flip ink color themselves. */
  inheritColor?: boolean;
}) => (
  <div className={`flex select-none flex-col items-center ${className}`} style={{ fontSize }}>
    <div
      className={`flex items-baseline leading-none font-display font-extrabold uppercase tracking-[-0.01em] text-[1em] ${inheritColor ? 'text-inherit' : 'text-white'}`}
    >
      <span>A</span>
      <span>R</span>
      <span>V</span>
      <span>A</span>
    </div>
    <span
      className={`mt-[0.08em] font-mono text-[0.19em] font-normal uppercase tracking-[0.55em] opacity-70 ${inheritColor ? 'text-inherit' : 'text-white'}`}
    >
      Studios
    </span>
  </div>
);
