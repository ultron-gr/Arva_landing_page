import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'utility' | 'nav';

const VARIANT_CLASSES: Record<Variant, string> = {
  // White filled pill, black text, trailing arrow — primary CTA on dark
  primary:
    'inline-flex items-center justify-center gap-2 rounded-none bg-white text-black px-6 py-3.5 min-h-[44px] text-sm font-medium ' +
    'transition-colors duration-200 hover:bg-[#e8e6e0] active:scale-[0.99] ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--arva-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--arva-bg)] ' +
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white',
  // Outlined pill — secondary CTA
  secondary:
    'inline-flex items-center justify-center gap-2 rounded-none border border-[color:var(--arva-border-strong)] bg-transparent text-[color:var(--arva-text)] px-6 py-3.5 min-h-[44px] text-sm font-medium ' +
    'transition-colors duration-200 hover:border-[color:var(--arva-gold-muted)] active:bg-white/5 ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--arva-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--arva-bg)] ' +
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[color:var(--arva-border-strong)]',
  // Small bordered button — header/nav utility (6–8px radius per spec)
  utility:
    'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-none border border-[color:var(--arva-border-strong)] bg-transparent text-[color:var(--arva-text)] px-3.5 py-2 min-h-[44px] text-xs font-medium ' +
    'transition-colors duration-200 hover:border-[color:var(--arva-gold-muted)] active:bg-white/5 ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--arva-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--arva-bg)] ' +
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[color:var(--arva-border-strong)]',
  // "Book a Call →" in the nav — 1px white border, transparent, hover fills white/black
  nav:
    'inline-flex items-center justify-center gap-2 rounded-none border border-white bg-transparent text-white px-5 py-2.5 min-h-[44px] text-sm font-medium ' +
    'transition-colors duration-200 hover:bg-white hover:text-black active:scale-[0.99] ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--arva-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-black ' +
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

export const Button = ({ variant = 'primary', className = '', children, ...rest }: ButtonProps) => (
  <button className={`${VARIANT_CLASSES[variant]} ${className}`.trim()} {...rest}>
    {children}
  </button>
);

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  children: ReactNode;
}

export const ButtonLink = ({ variant = 'primary', className = '', children, ...rest }: ButtonLinkProps) => (
  <a className={`${VARIANT_CLASSES[variant]} ${className}`.trim()} {...rest}>
    {children}
  </a>
);
