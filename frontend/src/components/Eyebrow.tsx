/** Numbered section eyebrow — "03 / CONTENT & VIDEO" — the page's core motif. */
export const Eyebrow = ({ number, label, className = '' }: { number: string; label: string; className?: string }) => (
  <p className={`font-body text-xs tracking-[0.28em] uppercase text-[color:var(--arva-gold-text)] ${className}`.trim()}>
    {number} / {label}
  </p>
);
