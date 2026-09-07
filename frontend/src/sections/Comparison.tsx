import { Reveal } from '../components/Reveal';
import { Eyebrow } from '../components/Eyebrow';

const AGENCY_POINTS = [
  'One service. Four vendors. No shared vision.',
  'Volume over quality.',
  'Cold outreach.',
];

const ARVA_POINTS = [
  'One studio. Content + Web + Automation + Design. Connected.',
  'Fewer deliverables. More intentional. Each one built to last.',
  'Content that earns clients. Work that proves itself. Legacy, not just output.',
];

/** 08 / Comparison — true side-by-side split from lg; stacks dark-first below. */
export const Comparison = () => (
  <section id="comparison" aria-labelledby="comparison-heading" className="scroll-mt-24 border-t border-[color:var(--arva-border)]">
    <h2 id="comparison-heading" className="sr-only">
      What most agencies do versus what ARVA does
    </h2>
    <div className="grid lg:grid-cols-2">
      {/* Dark panel first — both in DOM order and in mobile stacking */}
      <div className="bg-[#0a0a0a] px-4 py-20 sm:px-6 sm:py-24 lg:px-12 lg:py-28" data-testid="comparison-agencies-panel">
        <div className="mx-auto max-w-xl lg:ml-auto lg:mr-0">
          <Reveal>
            <Eyebrow number="08" label="The Difference" />
            <h3 className="mt-6 font-display uppercase leading-[0.96] tracking-[-0.01em] text-[color:var(--arva-text-subtle)] text-[clamp(1.7rem,5.6vw,2.6rem)]">
              What most agencies do
            </h3>
            <div className="mt-4 h-px w-14 bg-[color:var(--arva-border-strong)]" aria-hidden="true" />
          </Reveal>
          <ul className="mt-10 space-y-6">
            {AGENCY_POINTS.map((p, i) => (
              <Reveal key={p} delay={i * 70}>
                <li className="flex gap-4 text-base leading-relaxed text-[color:var(--arva-text-muted)]">
                  <span aria-hidden="true" className="font-display text-sm text-[color:var(--arva-text-subtle)]">✕</span>
                  {p}
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>

      {/* Light panel */}
      <div className="theme-cream bg-[#f6f1e6] px-4 py-20 text-[#0a0a0a] sm:px-6 sm:py-24 lg:px-12 lg:py-28" data-testid="comparison-arva-panel">
        <div className="mx-auto max-w-xl lg:ml-0">
          <Reveal>
            <p className="font-body text-xs uppercase tracking-[0.28em] text-[color:var(--arva-gold-text)]">08 / The ARVA Way</p>
            <h3 className="mt-6 font-display uppercase leading-[0.96] tracking-[-0.01em] text-[clamp(1.7rem,5.6vw,2.6rem)]">
              What ARVA does
            </h3>
            <div className="gold-rule mt-4" aria-hidden="true" />
          </Reveal>
          <ul className="mt-10 space-y-6">
            {ARVA_POINTS.map((p, i) => (
              <Reveal key={p} delay={i * 70}>
                <li className="flex gap-4 text-base leading-relaxed text-[color:var(--arva-text-muted)]">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--arva-gold)]" />
                  {p}
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);
