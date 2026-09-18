import { useEffect, useRef, useState } from 'react';
import { motion, animate, useMotionValue } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useLoadProgress } from '../../hooks/useLoadProgress';
import TrafficWave from '../originkit/ui/traffic-wave';
import { ArvaWordmark } from './ArvaWordmark';
import { ProgressGauge } from './ProgressGauge';

/**
 * IntroLoader — a night highway that decelerates and resolves into the
 * wordmark. Plays once per browser session (sessionStorage flag), then
 * unmounts to reveal the hero already sitting underneath. Self-contained:
 * delete this folder and its one call site in Home.tsx to go back to a
 * no-intro site.
 *
 * Duration is network-aware: the "wave" phase runs until real critical-path
 * assets (fonts, DOM parse, window load — see useLoadProgress) are ready,
 * bounded by FLOOR_MS (never flashes instantly on a fast connection) and
 * CEILING_MS (never leaves a slow connection staring at it indefinitely).
 */

const SESSION_KEY = 'arva_intro_seen';

// Short choreographed transitions once we decide to leave the wave phase —
// these are fixed on purpose, they're not "waiting for load," just a settle beat.
const ARRIVE_MS = 400;
// Wordmark fade/scale reveal — deliberately slow (expo-out) so it reads as a
// resolve, not a flash. The gold underline starts 0.2s in and runs 0.3s.
const LOGO_REVEAL_MS = 2000;
// Settle must outlast the wordmark reveal so `finish()` never cuts it off
// mid-fade — 200ms leaves a small beat to breathe before exit.
const LOGO_SETTLE_MS = LOGO_REVEAL_MS + 200;
const REDUCED_MS = 600;

// Real-readiness gate around the wave/travel phase — see Task 2 in the loader
// spec. The travel effect always gets its full ~2s run before real-readiness
// is even allowed to cut it short; CEILING_MS remains the safety net for a
// slow connection where assets genuinely aren't ready yet.
const FLOOR_MS = 2000;
const CEILING_MS = 4500;
const POLL_MS = 100;

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

// Cruise → decelerate: speed and fov both ease down toward these resting
// values during the "arrive" phase, instead of snapping to a faster boost.
// That's what reads as the highway slowing to a stop under the logo rather
// than rushing past it.
const CRUISE_SPEED = 9;
const CRUISE_FOV = 110;
const REST_SPEED = 1.5;
const REST_FOV = 94;

type Phase = 'wave' | 'arrive' | 'logo';

function hasSeenIntro(): boolean {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

function markIntroSeen(): void {
  try {
    window.sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    // Private-mode / storage disabled — intro just replays next time.
  }
}

export const IntroLoader = ({ onDone }: { onDone: () => void }) => {
  const reduced = useReducedMotion();
  const { progress, ready } = useLoadProgress();
  const [skip] = useState(hasSeenIntro);
  const [isMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [phase, setPhase] = useState<Phase>('wave');
  const doneRef = useRef(false);
  const readyRef = useRef(ready);

  useEffect(() => {
    readyRef.current = ready;
  }, [ready]);

  // Driven by framer-motion's animate() below — a real per-frame ease-out
  // tween, not a single instant prop swap, so the deceleration is progressive
  // at every viewport size (the tween is time-based, not size-based).
  const speedMV = useMotionValue(CRUISE_SPEED);
  const fovMV = useMotionValue(CRUISE_FOV);
  const [speed, setSpeed] = useState(CRUISE_SPEED);
  const [fov, setFov] = useState(CRUISE_FOV);

  useEffect(() => {
    const unsubSpeed = speedMV.on('change', setSpeed);
    const unsubFov = fovMV.on('change', setFov);
    return () => {
      unsubSpeed();
      unsubFov();
    };
  }, [speedMV, fovMV]);

  useEffect(() => {
    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      markIntroSeen();
      onDone();
    };

    if (skip) {
      finish();
      return;
    }

    if (reduced) {
      const t = window.setTimeout(finish, REDUCED_MS);
      return () => window.clearTimeout(t);
    }

    const mountedAt = performance.now();
    let advanced = false;
    let arriveTimer: number | undefined;
    let logoTimer: number | undefined;

    const advance = () => {
      if (advanced) return;
      advanced = true;
      window.clearInterval(pollId);
      setPhase('arrive');
      animate(speedMV, REST_SPEED, { duration: ARRIVE_MS / 1000, ease: EASE_OUT });
      animate(fovMV, REST_FOV, { duration: ARRIVE_MS / 1000, ease: EASE_OUT });
      arriveTimer = window.setTimeout(() => {
        setPhase('logo');
        logoTimer = window.setTimeout(finish, LOGO_SETTLE_MS);
      }, ARRIVE_MS);
    };

    // Polls real readiness instead of trusting a single fixed timer: fires as
    // soon as assets are ready (past the floor), or unconditionally at the
    // ceiling — whichever comes first.
    const pollId = window.setInterval(() => {
      const elapsed = performance.now() - mountedAt;
      if (elapsed >= CEILING_MS) {
        advance();
        return;
      }
      if (readyRef.current && elapsed >= FLOOR_MS) {
        advance();
      }
    }, POLL_MS);

    return () => {
      window.clearInterval(pollId);
      if (arriveTimer) window.clearTimeout(arriveTimer);
      if (logoTimer) window.clearTimeout(logoTimer);
    };
    // Runs once per mount — re-evaluating mid-sequence would restart the clock.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (skip) return null;

  if (reduced) {
    return (
      <motion.div
        className="fixed inset-0 z-[100] flex h-[100dvh] w-[100dvw] items-center justify-center bg-black"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        aria-hidden="true"
      >
        {/* Reduced motion: no tween on the mark itself — render it already settled. */}
        <ArvaWordmark />
        <div className="absolute inset-x-0 bottom-10 flex justify-center">
          <ProgressGauge progress={progress} size={128} />
        </div>
      </motion.div>
    );
  }

  const wavePlaying = phase === 'wave' || phase === 'arrive';
  const arriving = phase === 'arrive';

  return (
    <motion.div
      className="fixed inset-0 z-[100] h-[100dvh] w-[100dvw] overflow-hidden bg-black"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      aria-hidden="true"
    >
      {wavePlaying && (
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: arriving ? 0 : 1 }}
          transition={{ duration: ARRIVE_MS / 1000, ease: 'easeOut' }}
        >
          <TrafficWave
            roadColor="#0A0A0A"
            lineColor="#3A3A3A"
            stickColor="#1A1A1A"
            leftLights={['#FFFFFF', '#D4D4D4', '#B0B0B0']}
            rightLights={['#B0B0B0', '#D4D4D4', '#FFFFFF']}
            glow={6}
            fov={fov}
            speed={speed}
            traffic={isMobile ? 8 : 12}
            sticks={isMobile ? 6 : 10}
            boostOn={false}
            maxPixelRatio={isMobile ? 1 : 1.5}
          />
        </motion.div>
      )}

      {phase === 'logo' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: LOGO_REVEAL_MS / 1000, ease: EASE_OUT }}
          >
            <ArvaWordmark />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.3, delay: 0.2, ease: EASE_OUT }}
            style={{ marginTop: 24, height: 1, width: 72, background: 'var(--arva-gold)' }}
          />
        </div>
      )}

      <div className="absolute inset-x-0 bottom-10 flex justify-center">
        <ProgressGauge progress={progress} size={128} />
      </div>
    </motion.div>
  );
};
