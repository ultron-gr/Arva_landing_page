import Watch from './Watch.jsx'
import './JoinMovement.css'

export default function JoinMovement() {
  return (
    <section className="cta">
      <div className="cta__visual">
        <Watch mark="A" />
      </div>

      <div className="cta__copy">
        <h2 className="cta__title">
          Your time
          <br />
          matters.
        </h2>
        <p className="cta__text">
          Clear thinking. Focused execution. No unnecessary meetings.
          <br />
          We keep the process lean, so you can get back to business.
        </p>
        <div className="cta__actions">
          <a className="btn btn--ghost" href="#">Calendar link coming soon</a>
        </div>
      </div>
    </section>
  )
}
