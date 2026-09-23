import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

// Rotation applied to the "A" glyph below — 180 reads as an inverted A (∀).
// Set to 0 for an upright A.
const CURSOR_ROTATION = 180;
const CURSOR_SIZE = 22; // px, square bounding box for the cursor svg

// Apex tip position *before* rotation, inside the CURSOR_SIZE box — scaled
// down from the 24x24 viewBox below (22/24 = 0.9167).
const APEX = { x: 11, y: 0.92 };
// After CURSOR_ROTATION the apex tip's position inside the box moves to the
// opposite corner. This is the point pinned to the real pointer coordinates
// so the click hotspot always sits exactly at the tip, whichever way it faces.
const HOTSPOT =
  CURSOR_ROTATION === 180 ? { x: CURSOR_SIZE - APEX.x, y: CURSOR_SIZE - APEX.y } : { x: APEX.x, y: APEX.y };

const DESKTOP_POINTER_QUERY = '(hover: hover) and (pointer: fine)';
const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, label';
const TEXT_INPUT_SELECTOR =
  'textarea, [contenteditable], [contenteditable="true"], ' +
  'input:not([type]), input[type="text"], input[type="email"], input[type="password"], ' +
  'input[type="search"], input[type="tel"], input[type="url"], input[type="number"]';

type Mode = 'default' | 'pointer' | 'text';

function resolveMode(target: EventTarget | null): Mode {
  if (!(target instanceof Element)) return 'default';
  if (target.closest(TEXT_INPUT_SELECTOR)) return 'text';
  if (target.closest(INTERACTIVE_SELECTOR)) return 'pointer';
  return 'default';
}

/**
 * Sitewide custom cursor — an inverted "A" (the wordmark's apex, rotated
 * 180°) with its hotspot at the tip. Desktop / fine-pointer only; touch and
 * coarse-pointer devices render nothing and keep the native cursor.
 *
 * Position is written straight to the DOM in a rAF loop (never React state)
 * so it tracks the pointer with no lag. Hover mode (default / pointer-outline
 * / native-text) goes through state since it changes far less often than
 * every pointermove.
 */
export const ArvaCursor = () => {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>('default');
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const modeRef = useRef<Mode>('default');
  const rafRef = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_POINTER_QUERY);
    const apply = () => setEnabled(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add('arva-cursor-enabled');
    return () => document.documentElement.classList.remove('arva-cursor-enabled');
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const onPointerMove = (e: PointerEvent) => {
      posRef.current.x = e.clientX;
      posRef.current.y = e.clientY;
      setVisible((v) => v || true);
      const nextMode = resolveMode(e.target);
      if (modeRef.current !== nextMode) {
        modeRef.current = nextMode;
        setMode(nextMode);
      }
    };
    const onLeave = () => setVisible(false);

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);

    const tick = () => {
      const el = wrapperRef.current;
      if (el) el.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  const showCursor = visible && mode !== 'text';
  const isOutline = mode === 'pointer';
  const fadeTransition = reduced ? 'none' : 'opacity 150ms linear';

  return (
    <>
      <style>{`
        @media ${DESKTOP_POINTER_QUERY} {
          html.arva-cursor-enabled,
          html.arva-cursor-enabled body,
          html.arva-cursor-enabled *:not(input):not(textarea):not([contenteditable]) {
            cursor: none !important;
          }
          html.arva-cursor-enabled input,
          html.arva-cursor-enabled textarea,
          html.arva-cursor-enabled [contenteditable] {
            cursor: text !important;
          }
        }
      `}</style>
      <div
        ref={wrapperRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 9999,
          pointerEvents: 'none',
          visibility: showCursor ? 'visible' : 'hidden',
          willChange: 'transform',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: -HOTSPOT.x,
            top: -HOTSPOT.y,
            width: CURSOR_SIZE,
            height: CURSOR_SIZE,
            transform: `rotate(${CURSOR_ROTATION}deg)`,
            color: '#ffffff',
            mixBlendMode: 'difference',
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width={CURSOR_SIZE}
            height={CURSOR_SIZE}
            style={{ position: 'absolute', inset: 0, opacity: isOutline ? 0 : 1, transition: fadeTransition }}
          >
            <path d="M12 1 L23 23 H19.6 L12 7.6 L4.4 23 H1 Z" fill="currentColor" />
            <rect x="6.6" y="15.2" width="10.8" height="1.8" fill="currentColor" />
          </svg>
          <svg
            viewBox="0 0 24 24"
            width={CURSOR_SIZE}
            height={CURSOR_SIZE}
            style={{ position: 'absolute', inset: 0, opacity: isOutline ? 1 : 0, transition: fadeTransition }}
          >
            <path
              d="M12 1 L23 23 H19.6 L12 7.6 L4.4 23 H1 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinejoin="round"
            />
            <rect
              x="6.6"
              y="15.2"
              width="10.8"
              height="1.8"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            />
          </svg>
        </div>
      </div>
    </>
  );
};

export default ArvaCursor;
