import type { ReactNode } from 'react';

/** Small bordered pill badge — e.g. "Early Access — Dec 2026". Never gold-filled. */
export const Pill = ({ children, className = '', ...rest }: { children: ReactNode; className?: string; 'data-testid'?: string }) => (
  <span
    className={`inline-flex items-center gap-2 whitespace-nowrap rounded-none border border-[color:var(--arva-border)] px-3 py-1.5 text-xs tracking-wide text-[color:var(--arva-text-muted)] ${className}`.trim()}
    {...rest}
  >
    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-none bg-[color:var(--arva-gold)]" />
    {children}
  </span>
);
