import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

// Rotation applied to the "A" glyph below — 180 reads as an inverted A (∀).
// Set to 0 for an upright A.
const CURSOR_ROTATION = 180;
const CURSOR_SIZE = 32; // px, square bounding box for the cursor svg
const CURSOR_VIEWBOX = 24; // the svg paths below are authored on a 24x24 grid
const CURSOR_SCALE = CURSOR_SIZE / CURSOR_VIEWBOX;
// How quickly the rendered position eases toward the real pointer position
// each frame — 1 would be an exact 1:1 follow, lower is smoother/laggier.
const POSITION_SMOOTHING = 0.35;

// Apex tip position *before* rotation, inside the CURSOR_SIZE box — scaled
// from the 24x24 viewBox the paths below are authored on.
const APEX = { x: 12 * CURSOR_SCALE, y: 1 * CURSOR_SCALE };
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
type Tone = 'dark' | 'light';

function resolveMode(target: EventTarget | null): Mode {
  if (!(target instanceof Element)) return 'default';
  if (target.closest(TEXT_INPUT_SELECTOR)) return 'text';
  if (target.closest(INTERACTIVE_SELECTOR)) return 'pointer';
  return 'default';
}

// Sections already tag themselves `data-nav="dark"|"light"` for the nav
// bar's own tone-flip (see Header.tsx) — reused here instead of
// mix-blend-mode, which doesn't reliably invert against this site's
// off-white (not pure-white) section backgrounds.
function resolveTone(target: EventTarget | null): Tone {
  if (!(target instanceof Element)) return 'dark';
  return target.closest('[data-nav="light"]') ? 'light' : 'dark';
}

/**
 * Sitewide custom cursor — an inverted "A" (the wordmark's apex, rotated
 * 180°) with its hotspot at the tip. Desktop / fine-pointer only; touch and
 * coarse-pointer devices render nothing and keep the native cursor.
 *
 * Position is written straight to the DOM in a rAF loop (never React state)
 * and eased toward the pointer each frame (POSITION_SMOOTHING) for a smooth
 * trailing feel rather than a rigid 1:1 follow. Hover mode (default /
 * pointer-outline / native-text) and tone (black on light sections, white on
 * dark ones) go through state since they change far less often than every
 * pointermove.
 */
export const ArvaCursor = () => {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>('default');
  const [tone, setTone] = useState<Tone>('dark');
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 }); // smoothed, rendered position
  const targetRef = useRef({ x: -100, y: -100 }); // raw pointer position
  const modeRef = useRef<Mode>('default');
  const toneRef = useRef<Tone>('dark');
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
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
      setVisible((v) => v || true);
      const nextMode = resolveMode(e.target);
      if (modeRef.current !== nextMode) {
        modeRef.current = nextMode;
        setMode(nextMode);
      }
      const nextTone = resolveTone(e.target);
      if (toneRef.current !== nextTone) {
        toneRef.current = nextTone;
        setTone(nextTone);
      }
    };
    const onLeave = () => setVisible(false);

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);

    const tick = () => {
      const el = wrapperRef.current;
      const pos = posRef.current;
      const target = targetRef.current;
      pos.x += (target.x - pos.x) * POSITION_SMOOTHING;
      pos.y += (target.y - pos.y) * POSITION_SMOOTHING;
      if (el) el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
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
  const cursorColor = tone === 'light' ? '#000000' : '#ffffff';
  const fadeTransition = reduced ? 'none' : 'opacity 150ms linear';
  const colorTransition = reduced ? 'none' : 'color 150ms linear';

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
            color: cursorColor,
            transition: colorTransition,
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
