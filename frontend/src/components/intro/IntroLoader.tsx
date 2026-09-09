import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import TrafficWave from '../originkit/ui/traffic-wave';

/**
 * IntroLoader — a night highway that arrives and resolves into the wordmark.
 * Plays once per browser session (sessionStorage flag), then unmounts to
 * reveal the hero already sitting underneath. Self-contained: delete this
 * folder and its one call site in Home.tsx to go back to a no-intro site.
 */

const SESSION_KEY = 'arva_intro_seen';

const WAVE_MS = 2000;
const ARRIVE_MS = 400;
const LOGO_SETTLE_MS = 500;
const REDUCED_MS = 600;

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

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
  const [skip] = useState(hasSeenIntro);
  const [isMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [phase, setPhase] = useState<Phase>('wave');
  const doneRef = useRef(false);

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

    const t1 = window.setTimeout(() => setPhase('arrive'), WAVE_MS);
    const t2 = window.setTimeout(() => setPhase('logo'), WAVE_MS + ARRIVE_MS);
    const t3 = window.setTimeout(finish, WAVE_MS + ARRIVE_MS + LOGO_SETTLE_MS);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
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
        <motion.img
          src="/brand/arva-logo-white.png"
          alt=""
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: REDUCED_MS / 1000, ease: EASE_OUT }}
          style={{ width: 'min(48vw, 220px)', height: 'auto' }}
        />
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
          transition={{ duration: ARRIVE_MS / 1000, ease: 'easeInOut' }}
        >
          <TrafficWave
            roadColor="#0A0A0A"
            lineColor="#3A3A3A"
            stickColor="#1A1A1A"
            leftLights={['#FFFFFF', '#D4D4D4', '#B0B0B0']}
            rightLights={['#B0B0B0', '#D4D4D4', '#FFFFFF']}
            glow={6}
            fov={arriving ? 130 : 110}
            speed={arriving ? 15 : 9}
            traffic={isMobile ? 8 : 12}
            sticks={isMobile ? 6 : 10}
            boostOn={false}
            maxPixelRatio={isMobile ? 1 : 1.5}
          />
        </motion.div>
      )}

      {phase === 'logo' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.img
            src="/brand/arva-logo-white.png"
            alt=""
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            style={{ width: 'min(48vw, 220px)', height: 'auto' }}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.25, ease: EASE_OUT }}
            style={{ marginTop: 24, height: 1, width: 72, background: 'var(--arva-gold)' }}
          />
        </div>
      )}
    </motion.div>
  );
};
