import { Reveal } from '../components/Reveal';
import { Eyebrow } from '../components/Eyebrow';

const SERVICES = [
  { name: 'Long-Form YouTube', desc: 'Search-led, story-driven episodes that compound for years.' },
  { name: 'Short-Form Reels & Shorts', desc: 'Platform-native cuts engineered for retention.' },
  { name: 'Brand Story Films', desc: 'The one film that explains why you exist.' },
  { name: 'Campaign & Ad Video', desc: 'Performance creative built to convert, not just impress.' },
  { name: 'Personal Brand Content', desc: 'Founder-led content that builds trust at scale.' },
];

const PROOF_STATS = [
  { number: '01', label: 'Long-Form Output', value: '2×', caption: 'Long-form per month' },
  { number: '02', label: 'Short-Form Output', value: '4×', caption: 'Short-form per month' },
];

/** 03 / Content & Video — service list + side stat callout (below list on mobile). */
export const ContentVideo = () => (
  <section id="content-video" aria-labelledby="content-video-heading" className="relative scroll-mt-24 border-t border-[color:var(--arva-border)] bg-[color:var(--arva-surface)] theme-cream">
    <div className="mx-auto w-full max-w-site px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <Reveal>
        <Eyebrow number="03" label="Content & Video" />
        <div className="gold-rule mt-4" aria-hidden="true" />
      </Reveal>
      <Reveal delay={80}>
        <h2 id="content-video-heading" className="mt-8 max-w-3xl font-display uppercase leading-[0.96] tracking-[-0.01em] text-[color:var(--arva-text)] text-[clamp(1.9rem,6.4vw,3.4rem)]">
          Content that moves people.
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
        <ul className="divide-y divide-[color:var(--arva-border)]" data-testid="content-video-service-list">
          {SERVICES.map((s, i) => (
            <li key={s.name} className="py-5">
              <Reveal delay={i * 60}>
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-sm text-[color:var(--arva-gold)]" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-display text-xl uppercase tracking-[-0.01em] text-[color:var(--arva-text)]">{s.name}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[color:var(--arva-text-muted)]">{s.desc}</p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={160} className="lg:self-center">
          <div className="flex flex-col gap-4">
            <aside
              aria-label="Content production stat"
              data-testid="content-video-stat-callout"
              className="rounded-none border border-[color:var(--arva-border)] bg-[color:var(--arva-surface-2)] p-8"
            >
              <p className="font-display text-3xl uppercase leading-tight text-[color:var(--arva-text)]">
                One shoot day.
                <br />
                Six formats.
                <br />
                <span className="text-[color:var(--arva-gold)]">Infinite reach.</span>
              </p>
              <p className="mt-5 text-sm leading-relaxed text-[color:var(--arva-text-muted)]">
                Every shoot is planned as a system — one day of production becomes a month of
                long-form, shorts, stills and campaign assets.
              </p>
            </aside>

            <div className="grid grid-cols-2 gap-4" data-testid="content-video-proof-stats">
              {PROOF_STATS.map((s) => (
                <div
                  key={s.number}
                  className="rounded-none border border-[color:var(--arva-border)] bg-[color:var(--arva-surface-2)] p-5"
                  data-testid={`content-video-proof-stat-${s.number}`}
                >
                  <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[color:var(--arva-text-subtle)]">
                    <span className="text-[color:var(--arva-gold)]">{s.number}</span> / {s.label}
                  </p>
                  <p className="mt-3 font-display text-4xl uppercase leading-none text-[color:var(--arva-text)]">{s.value}</p>
                  <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--arva-text-subtle)]">
                    {s.caption}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);
