import { Reveal } from '../components/Reveal';
import { Eyebrow } from '../components/Eyebrow';

const STATS = [
  { number: '07', label: 'Domain Specialists' },
  { number: '04', label: 'Service Pillars' },
  { number: '01', label: 'Studio Standard' },
];

/** About / manifesto — light cream section. */
export const About = () => (
  <section id="about" aria-labelledby="about-heading" className="theme-cream scroll-mt-24 bg-[#f6f1e6] text-[#0a0a0a]">
    <div className="mx-auto w-full max-w-site px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <Reveal>
        <Eyebrow number="01" label="The Studio" />
        <div className="gold-rule mt-4" aria-hidden="true" />
      </Reveal>
      <Reveal delay={80}>
        <h2
          id="about-heading"
          className="mt-8 max-w-4xl font-display uppercase leading-[0.96] tracking-[-0.01em] text-[clamp(1.9rem,6.4vw,3.4rem)]"
        >
          Most businesses don't have a technology problem. They have a fragmentation problem.
        </h2>
      </Reveal>
      <Reveal delay={160}>
        <p className="mt-8 max-w-2xl text-base leading-relaxed text-[color:var(--arva-text-muted)]">
          ARVA is not another agency that makes websites. We are the digital system behind your
          business — brand, website, software, AI, automation, data and growth, connected and built
          to work as one. Seven specialists. Four pillars. One standard.
        </p>
      </Reveal>
      <div className="mt-14 grid gap-4 sm:grid-cols-3">
        {STATS.map((s, i) => (
          <Reveal key={s.number} delay={i * 80}>
            <div
              className="rounded-xl border border-[color:var(--arva-border)] bg-white p-6"
              data-testid={`about-stat-${s.number}`}
            >
              <p className="font-display text-5xl leading-none">
                {s.number}
                <span className="text-[color:var(--arva-gold)]" aria-hidden="true">.</span>
              </p>
              <p className="mt-3 text-xs uppercase tracking-[0.28em] text-[color:var(--arva-text-subtle)]">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
