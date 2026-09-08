import { Reveal } from '../components/Reveal';
import { Eyebrow } from '../components/Eyebrow';

interface PillarDef {
  id: string;
  title: string;
  anchor: string;
  services: string[];
  exploreLabel: string;
  testId: string;
}

const PILLARS: PillarDef[] = [
  {
    id: 'pillar-content-video',
    title: 'Content & Video',
    anchor: '#content-video',
    services: ['Long-form YouTube', 'Reels & Shorts', 'Brand story films', 'Campaign & ad video'],
    exploreLabel: 'Explore Content & Video services',
    testId: 'pillars-explore-content-video-link',
  },
  {
    id: 'pillar-web-products',
    title: 'Web Products',
    anchor: '#web-products',
    services: ['Landing pages', 'Full websites', 'Booking systems', 'Client portals'],
    exploreLabel: 'Explore Web Products services',
    testId: 'pillars-explore-web-products-link',
  },
  {
    id: 'pillar-automation-ai',
    title: 'Automation & AI',
    anchor: '#automation-ai',
    services: ['Workflow automation', 'AI assistants', 'Lead pipelines', 'System integrations'],
    exploreLabel: 'Explore Automation & AI services',
    testId: 'pillars-explore-automation-ai-link',
  },
  {
    id: 'pillar-brand-design',
    title: 'Brand Design',
    anchor: '#brand-design',
    services: ['Logo & brand kits', 'Content graphics', 'UI & digital design', 'Campaign creatives'],
    exploreLabel: 'Explore Brand Design services',
    testId: 'pillars-explore-brand-design-link',
  },
];

/** Four Pillars — 1 col @360, 2 col @sm/md, 4 col @lg+. */
export const Pillars = () => (
  <section id="pillars" aria-labelledby="pillars-heading" className="relative scroll-mt-24 bg-[#0a0a0a]">
    <div className="mx-auto w-full max-w-site px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <Reveal>
        <Eyebrow number="02" label="What We Do" />
        <div className="gold-rule mt-4" aria-hidden="true" />
      </Reveal>
      <Reveal delay={80}>
        <h2
          id="pillars-heading"
          className="mt-8 font-display uppercase leading-[0.96] tracking-[-0.01em] text-[color:var(--arva-text)] text-[clamp(1.9rem,6.4vw,3.4rem)]"
        >
          Four pillars. One studio.
        </h2>
      </Reveal>
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PILLARS.map((p, i) => (
          <Reveal key={p.id} delay={i * 70}>
            <article className="group flex h-full flex-col rounded-none border border-[color:var(--arva-border)] bg-[color:var(--arva-surface)] p-6 transition-colors duration-200 hover:border-[color:var(--arva-gold-muted)]">
              <p className="font-display text-4xl leading-none big-numeral" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-5 font-display text-2xl uppercase leading-tight tracking-[-0.01em] text-[color:var(--arva-text)]">
                {p.title}
              </h3>
              <ul className="mt-4 flex-1 space-y-2">
                {p.services.map((s) => (
                  <li key={s} className="text-sm font-body text-[color:var(--arva-text-muted)]">
                    {s}
                  </li>
                ))}
              </ul>
              <a
                href={p.anchor}
                aria-label={p.exploreLabel}
                data-testid={p.testId}
                className="mt-6 inline-flex min-h-[44px] items-center gap-2 self-start text-sm font-mono text-[color:var(--arva-gold)] decoration-[color:var(--arva-gold)] underline-offset-4 transition-colors duration-200 group-hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--arva-gold)] rounded-none"
              >
                Explore <span aria-hidden="true">→</span>
              </a>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
