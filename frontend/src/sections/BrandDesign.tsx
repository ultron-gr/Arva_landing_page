import { Reveal } from '../components/Reveal';
import { Eyebrow } from '../components/Eyebrow';

const ITEMS = [
  { name: 'Logo & Brand Kit', desc: 'Identity, palette, type and rules — the whole system.' },
  { name: 'Content Graphics', desc: 'Feeds, carousels and thumbnails that stay on-brand.' },
  { name: 'UI & Digital Design', desc: 'Interfaces designed for use, not just for Dribbble.' },
  { name: 'Campaign Creatives', desc: 'Ad sets and launch assets across every placement.' },
  { name: 'Professional Assets', desc: 'Decks, documents and profiles that close rooms.' },
  { name: 'Production Design', desc: 'Packaging, print and physical touchpoints.' },
];

/** 06 / Brand Design — 6-item grid: 1 col @360, 2 @sm, 3 @lg. */
export const BrandDesign = () => (
  <section id="brand-design" aria-labelledby="brand-design-heading" className="scroll-mt-24 border-t border-[color:var(--arva-border)] bg-[#000000]">
    <div className="mx-auto w-full max-w-site px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <Reveal>
        <Eyebrow number="06" label="Brand Design" />
        <div className="gold-rule mt-4" aria-hidden="true" />
      </Reveal>
      <Reveal delay={80}>
        <h2 id="brand-design-heading" className="mt-8 max-w-3xl font-display uppercase leading-[0.96] tracking-[-0.01em] text-[color:var(--arva-text)] text-[clamp(1.9rem,6.4vw,3.4rem)]">
          Design that stops the scroll.
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="brand-design-grid">
        {ITEMS.map((item, i) => (
          <Reveal key={item.name} delay={i * 60}>
            <div className="group h-full rounded-none border border-[color:var(--arva-border)] bg-[color:var(--arva-surface)] p-6 transition-colors duration-200 hover:border-[color:var(--arva-gold-muted)]">
              <p className="font-display text-2xl leading-none big-numeral" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-4 font-display text-lg uppercase tracking-[-0.01em] text-[color:var(--arva-text)]">{item.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--arva-text-muted)]">{item.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
