import { Reveal } from '../components/Reveal';
import { ButtonLink } from '../components/Button';

/**
 * Hero — the page's single <h1>. Exactly two CTAs above the fold (spec):
 * primary scrolls to the lead form, secondary scrolls to the pillars.
 */
export const Hero = () => (
  <section id="hero" aria-labelledby="hero-heading" className="relative noise scroll-mt-24">
    <div className="mx-auto flex min-h-[92svh] w-full max-w-site flex-col justify-center px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <Reveal>
        <p className="mb-6 text-xs uppercase tracking-[0.3em] text-[color:var(--arva-text-subtle)]">
          Bengaluru · Digital Creative Studio
        </p>
      </Reveal>
      <Reveal delay={80}>
        <h1
          id="hero-heading"
          className="max-w-5xl font-display uppercase leading-[0.94] tracking-[-0.01em] text-[color:var(--arva-text)] text-[clamp(2.55rem,10.5vw,4.5rem)] sm:text-[clamp(3.4rem,8vw,5.6rem)] lg:text-[clamp(4.4rem,5.6vw,6.4rem)]"
        >
          We build the digital system behind your business.
        </h1>
      </Reveal>
      <Reveal delay={160}>
        <p className="mt-8 text-base tracking-wide text-[color:var(--arva-text-muted)] sm:text-lg">
          Strategy. Design. Technology. AI. Automation.
        </p>
      </Reveal>
      <Reveal delay={240}>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <ButtonLink href="#contact" variant="primary" data-testid="hero-primary-cta-button">
            Book Your Early Access <span aria-hidden="true">→</span>
          </ButtonLink>
          <ButtonLink href="#pillars" variant="secondary" data-testid="hero-secondary-cta-button">
            What We Do <span aria-hidden="true">↓</span>
          </ButtonLink>
        </div>
      </Reveal>
    </div>
  </section>
);
