import { useEffect, useMemo, useRef, useState } from 'react';

const SIZE = 200;
const CENTER = SIZE / 2;
const RADIUS = 74;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Automotive-gauge sweep: 270° of travel, 90° gap centered at the bottom —
// same layout as a car speedometer/tachometer, not a full 360° ring.
const SWEEP_DEG = 270;
const START_DEG = -135; // clock convention: 0 = top, clockwise positive
const ARC_FRACTION = SWEEP_DEG / 360;
const MAX_ARC_LEN = CIRCUMFERENCE * ARC_FRACTION;
// rotate() needed to move a <circle>'s natural dash-start (3 o'clock / 90°)
// to START_DEG.
const DIAL_ROTATE = START_DEG - 90;

const TICK_STEPS = 24; // 25 tick lines, majors land exactly on 0/25/50/75/100
const LABELS = [0, 25, 50, 75, 100];

/** clock-convention degrees (0 = top, clockwise) → SVG x/y, text kept upright. */
function pointAt(clockDeg: number, r: number) {
  const rad = ((clockDeg - 90) * Math.PI) / 180;
  return { x: CENTER + r * Math.cos(rad), y: CENTER + r * Math.sin(rad) };
}

/** Speedometer-style gradations around the dial — thin lines + numerals, no icons. */
function Ticks() {
  const ticks = useMemo(() => {
    const out = [];
    for (let i = 0; i <= TICK_STEPS; i++) {
      const clockDeg = START_DEG + (SWEEP_DEG / TICK_STEPS) * i;
      const major = i % 6 === 0;
      out.push(
        <line
          key={i}
          x1={CENTER}
          y1={CENTER - RADIUS - 4}
          x2={CENTER}
          y2={CENTER - RADIUS - (major ? 14 : 9)}
          transform={`rotate(${clockDeg} ${CENTER} ${CENTER})`}
          stroke={major ? '#555555' : '#3A3A3A'}
          strokeWidth={major ? 1.75 : 1}
          strokeLinecap="round"
        />,
      );
    }
    return out;
  }, []);

  const labels = useMemo(
    () =>
      LABELS.map((v) => {
        const clockDeg = START_DEG + SWEEP_DEG * (v / 100);
        const { x, y } = pointAt(clockDeg, RADIUS + 24);
        return (
          <text
            key={v}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#555555"
            fontSize="11"
            fontFamily="'Space Mono', monospace"
          >
            {v}
          </text>
        );
      }),
    [],
  );

  return (
    <>
      {ticks}
      {labels}
    </>
  );
}

export interface ProgressGaugeProps {
  /** 0–100 — real load progress from useLoadProgress. The displayed needle/arc
   *  is rate-limited so it always sweeps visibly from 0 instead of jumping,
   *  but it never shows more than this real value. */
  progress: number;
  size?: number;
  className?: string;
}

/** Flat, car-speedometer-style circular gauge — no gradients, glow or shadow. */
export const ProgressGauge = ({ progress, size = 128, className = '' }: ProgressGaugeProps) => {
  const progressRef = useRef(progress);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    let raf: number;
    let last = performance.now();
    const SWEEP_RATE = 130; // %/second cap — real target still gates the ceiling, this just paces the reveal
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      setDisplay((d) => {
        const target = Math.max(0, Math.min(100, progressRef.current));
        if (d >= target) return d;
        return Math.min(target, d + SWEEP_RATE * dt);
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const dash = (display / 100) * MAX_ARC_LEN;
  const needleDeg = START_DEG + SWEEP_DEG * (display / 100);

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={size} height={size} aria-hidden="true">
        <circle cx={CENTER} cy={CENTER} r={RADIUS + 21} fill="none" stroke="#1A1A1A" strokeWidth="1" />
        <Ticks />
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="#2A2A2A"
          strokeWidth="3"
          strokeDasharray={`${MAX_ARC_LEN} ${CIRCUMFERENCE - MAX_ARC_LEN}`}
          transform={`rotate(${DIAL_ROTATE} ${CENTER} ${CENTER})`}
        />
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="#C9A84C"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
          transform={`rotate(${DIAL_ROTATE} ${CENTER} ${CENTER})`}
        />
        <line
          x1={CENTER}
          y1={CENTER - 10}
          x2={CENTER}
          y2={CENTER - RADIUS + 16}
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(${needleDeg} ${CENTER} ${CENTER})`}
        />
        <circle cx={CENTER} cy={CENTER} r="5" fill="#C9A84C" />
      </svg>
      <span
        className="absolute inset-x-0 bottom-[20%] text-center font-mono text-xs text-[color:var(--arva-gold-text)]"
        data-testid="intro-loader-progress-readout"
      >
        {String(Math.round(display)).padStart(3, '0')}%
      </span>
    </div>
  );
};

export default ProgressGauge;
