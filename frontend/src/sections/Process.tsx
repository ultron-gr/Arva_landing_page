import { Reveal } from '../components/Reveal';
import { Eyebrow } from '../components/Eyebrow';

const STEPS = [
  {
    name: 'Discover',
    when: 'Week 0',
    desc: 'We map your business, not just your brief. Goals, systems, gaps — everything on the table before anything gets built.',
  },
  {
    name: 'Architect',
    when: 'Week 1',
    desc: 'One blueprint connecting brand, web, automation and content. You approve the plan before a single pixel ships.',
  },
  {
    name: 'Build',
    when: 'Weeks 1–4',
    desc: 'Weekly drops, not month-end surprises. You watch the system come together as it happens.',
  },
  {
    name: 'Deliver',
    when: 'Handover',
    desc: 'Launch, documentation, training. Built to keep working long after we leave the room.',
  },
];

/** 07 / Process — cream section, ordered list, stacked at all sizes. */
export const Process = () => (
  <section id="process" aria-labelledby="process-heading" className="theme-cream scroll-mt-24 bg-[#F5F5F0] text-[#000000]">
    <div className="mx-auto w-full max-w-site px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <Reveal>
        <Eyebrow number="07" label="Process" />
        <div className="gold-rule mt-4" aria-hidden="true" />
      </Reveal>
      <Reveal delay={80}>
        <h2 id="process-heading" className="mt-8 font-display uppercase leading-[0.96] tracking-[-0.01em] text-[clamp(1.9rem,6.4vw,3.4rem)]">
          Four steps. One standard.
        </h2>
      </Reveal>

      {/*
        Mobile-first: base = stacked list (divide-y, no fixed/max height so
        nothing can clip). lg+ swaps to a 4-up horizontal timeline — divide-x
        instead of divide-y, big numeral moves to an absolutely-positioned
        overflow-visible slot above each column so it can render large
        without ever being cropped by a parent overflow.
      */}
      <ol
        className="mt-14 max-w-3xl divide-y divide-[color:var(--arva-border)] lg:mt-20 lg:grid lg:max-w-none lg:grid-cols-4 lg:divide-y-0 lg:divide-x"
        data-testid="process-steps-list"
      >
        {STEPS.map((s, i) => (
          <li key={s.name} className="relative py-7 lg:overflow-visible lg:px-6 lg:pb-0 lg:pt-20 first:lg:pl-0 last:lg:pr-0">
            <Reveal delay={i * 70}>
              <div className="flex items-start gap-5 sm:gap-8 lg:block lg:gap-0">
                <span
                  className="font-display text-4xl leading-none big-numeral sm:text-5xl lg:absolute lg:left-6 lg:top-0 lg:text-6xl xl:text-7xl"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-display text-xl uppercase tracking-[-0.01em] sm:text-2xl">
                    {s.name}{' '}
                    <span className="ml-2 align-middle font-body text-xs font-normal uppercase tracking-[0.24em] text-[color:var(--arva-text-subtle)]">
                      {s.when}
                    </span>
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-[color:var(--arva-text-muted)] sm:text-base lg:max-w-none">{s.desc}</p>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  </section>
);
