import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface RevealProps {
  children: ReactNode;
  /** stagger delay in ms for sibling elements */
  delay?: number;
  className?: string;
}

/** Scroll-triggered reveal via IntersectionObserver. Renders the final state
 *  immediately when the user prefers reduced motion. */
export const Reveal = ({ children, delay = 0, className = '' }: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (reduced) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -32px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <div
      ref={ref}
      className={`reveal ${shown ? 'reveal-in' : ''} ${className}`.trim()}
      style={delay && !reduced ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
};
