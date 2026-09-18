import { Reveal } from '../components/Reveal';
import { ServicesTicker } from '../components/ServicesTicker';
import { HeroParticles } from '../components/HeroParticles';

const PRIMARY_CTA_CLASS =
  'inline-flex items-center justify-center gap-2 rounded-none bg-white px-10 py-[18px] font-mono text-xs uppercase tracking-widest text-black ' +
  'transition-colors duration-200 hover:bg-[color:var(--arva-gold-text)] hover:text-black ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--arva-gold-text)] focus-visible:ring-offset-2 focus-visible:ring-offset-black';

const SECONDARY_CTA_CLASS =
  'inline-flex items-center gap-2 rounded-none bg-transparent px-0 py-[18px] font-mono text-xs uppercase tracking-widest text-[color:var(--arva-text-muted)] ' +
  'transition-colors duration-150 hover:text-white ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--arva-gold-text)] focus-visible:ring-offset-2 focus-visible:ring-offset-black';

/**
 * Hero — the page's single <h1>. Text-only, left-aligned, no illustration:
 * eyebrow, headline, gold hairline rule, subhead, two CTAs, a studio tag
 * pinned to the corner, and a services ticker closing out the section.
 */
export const Hero = () => (
  <section id="hero" aria-labelledby="hero-heading" className="relative flex min-h-screen w-full flex-col overflow-hidden bg-black">
    <HeroParticles />
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1]"
      style={{ background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%)' }}
    />
    <div className="relative z-10 flex flex-1 items-center px-6 py-32 lg:px-[60px]">
      <div className="mx-auto w-full max-w-[1200px]">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-widest text-[color:var(--arva-gold-text)]">
            Bengaluru · Est. 2026
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h1
            id="hero-heading"
            className="mt-6 font-display font-extrabold uppercase leading-[0.88] tracking-[-0.05em] text-white text-[clamp(1.75rem,8vw,6rem)]"
          >
            Build.
            <br />
            Create.
            <br />
            Automate.
          </h1>
        </Reveal>
        <Reveal delay={800}>
          <div className="my-8 h-px w-20 bg-[color:var(--arva-gold-text)]" aria-hidden="true" />
        </Reveal>
        <Reveal delay={240}>
          <p className="max-w-[480px] font-body text-base leading-[1.7] text-[color:var(--arva-text-muted)] lg:text-xl">
            A digital creative studio for founders who are done settling for average.
          </p>
        </Reveal>
        <Reveal delay={320}>
          <div className="mt-12 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <a href="#contact" className={PRIMARY_CTA_CLASS} data-testid="hero-primary-cta-button">
              Book Your Early Access <span aria-hidden="true">→</span>
            </a>
            <a href="#pillars" className={SECONDARY_CTA_CLASS} data-testid="hero-secondary-cta-button">
              What We Do <span aria-hidden="true">↓</span>
            </a>
          </div>
        </Reveal>
      </div>

      <p className="absolute bottom-16 left-6 font-mono text-[9px] uppercase tracking-widest text-[#333333] lg:left-[60px]">
        Arva Studios · Content · Web · Automation · Design
      </p>
    </div>

    <ServicesTicker />
  </section>
);
