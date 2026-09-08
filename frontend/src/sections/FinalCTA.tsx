import { Reveal } from '../components/Reveal';
import { Eyebrow } from '../components/Eyebrow';
import { Pill } from '../components/Pill';
import { BookACall } from '../components/BookACall';
import { LeadForm } from '../components/LeadForm';

/** 09 / Final CTA + inline lead-capture form — the page's conversion moment. */
export const FinalCTA = () => (
  <section id="contact" aria-labelledby="contact-heading" className="relative noise scroll-mt-24 border-t border-[color:var(--arva-border)] bg-[#000000]">
    <div className="mx-auto w-full max-w-site px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          <Reveal>
            <Eyebrow number="09" label="Start" />
            <div className="gold-rule mt-4" aria-hidden="true" />
          </Reveal>
          <Reveal delay={80}>
            <h2 id="contact-heading" className="mt-8 font-display uppercase leading-[0.96] tracking-[-0.01em] text-[color:var(--arva-text)] text-[clamp(2rem,7vw,3.6rem)]">
              Let's build something that lasts.
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-[color:var(--arva-text-muted)] sm:text-base">
              Tell us where your business is going. We'll show you the system that gets it there —
              content, web, automation and design, connected.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Pill data-testid="cta-early-access-pill">Early Access — Dec 2026</Pill>
              <Pill data-testid="cta-launch-pill">Full Launch — Jan 1, 2027</Pill>
            </div>
          </Reveal>
          <Reveal delay={260}>
            <div className="mt-10">
              <BookACall variant="secondary" testId="cta-book-call-button" />
              <p className="mt-5 text-sm text-[color:var(--arva-text-subtle)]">
                No commitment. No agency speak. Just a real conversation.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={160}>
          <LeadForm />
        </Reveal>
      </div>
    </div>
  </section>
);
