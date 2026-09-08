import { Reveal } from '../components/Reveal';
import { Eyebrow } from '../components/Eyebrow';

const TIERS = [
  {
    name: 'Starter',
    price: '₹18,000–25,000',
    bullets: ['Single-workflow automation', 'Lead capture & routing', 'Email / WhatsApp sequences', 'Setup + handover docs'],
  },
  {
    name: 'Growth',
    price: '₹35,000–60,000',
    bullets: ['Multi-system integrations', 'AI assistants trained on your data', 'Sales & ops pipelines', 'Dashboards & reporting'],
  },
  {
    name: 'Full-Stack',
    price: '₹74,000+',
    bullets: ['End-to-end business automation', 'Custom AI agents', 'Internal tools & portals', 'Continuous optimisation'],
  },
];

/** 05 / Automation & AI — three labeled pricing tiers + retainer note. */
export const AutomationAI = () => (
  <section id="automation-ai" aria-labelledby="automation-ai-heading" className="scroll-mt-24 border-t border-[color:var(--arva-border)] bg-[color:var(--arva-bg)] theme-cream">
    <div className="mx-auto w-full max-w-site px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <Reveal>
        <Eyebrow number="05" label="Automation & AI" />
        <div className="gold-rule mt-4" aria-hidden="true" />
      </Reveal>
      <Reveal delay={80}>
        <h2 id="automation-ai-heading" className="mt-8 max-w-3xl font-display uppercase leading-[0.96] tracking-[-0.01em] text-[color:var(--arva-text)] text-[clamp(1.9rem,6.4vw,3.4rem)]">
          Your business running at 3 AM.
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {TIERS.map((t, i) => (
          <Reveal key={t.name} delay={i * 80}>
            <section
              aria-labelledby={`tier-${t.name.toLowerCase()}-heading`}
              data-testid={`automation-tier-${t.name.toLowerCase().replace(/[^a-z]/g, '')}`}
              className="flex h-full flex-col rounded-none border border-[color:var(--arva-border)] bg-[color:var(--arva-surface)] p-6 transition-colors duration-200 hover:border-[color:var(--arva-gold-muted)]"
            >
              <h3 id={`tier-${t.name.toLowerCase()}-heading`} className="font-display text-2xl uppercase tracking-[-0.01em] text-[color:var(--arva-text)]">
                {t.name}
              </h3>
              <p className="mt-2 text-lg font-medium text-[color:var(--arva-gold)]">{t.price}</p>
              <ul className="mt-5 flex-1 space-y-2.5">
                {t.bullets.map((b) => (
                  <li key={b} className="flex gap-3 text-sm leading-relaxed text-[color:var(--arva-text-muted)]">
                    <span aria-hidden="true" className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[color:var(--arva-gold)]" />
                    {b}
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <p className="mt-8 text-sm text-[color:var(--arva-text-muted)]" data-testid="automation-retainer-note">
          Keep it running: retainer plans from <span className="font-medium text-[color:var(--arva-gold)]">₹5,000/month</span> for
          monitoring, fixes and continuous improvement.
        </p>
      </Reveal>
    </div>
  </section>
);
