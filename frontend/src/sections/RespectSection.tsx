import { Reveal } from '../components/Reveal';
import { Watch } from '../components/watch';
import './RespectSection.css';

export function RespectSection() {
  return (
    <section className="respect" id="respect" aria-labelledby="respect-title">
      <Reveal delay={100} className="respect__visual">
        <Watch mark="A" />
      </Reveal>

      <div className="respect__copy">
        <Reveal delay={100}>
          <h2 id="respect-title" className="respect__title">
            Your time<br className="hidden sm:block" /> matters.
          </h2>
          <div className="respect__rule" aria-hidden="true" />
        </Reveal>
        
        <Reveal delay={180}>
          <p className="respect__text">
            Clear thinking. Focused execution. No unnecessary meetings.
            We keep the process lean, so you can <span className="respect__em">get back to business.</span>
          </p>
        </Reveal>
        
        <Reveal delay={260}>
          <div className="respect__actions">
            <a className="btn btn--gold" href="#calendar">
              <span className="btn__label">Book a call</span>
              <span className="btn__icon" aria-hidden="true">→</span>
            </a>
            <a className="btn btn--ghost" href="#early-access">
              <span className="btn__dot" aria-hidden="true" />
              <span className="btn__label">Join early access</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
