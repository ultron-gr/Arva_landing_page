import { Link } from 'react-router-dom';

/** Branded 404 — spec: never ship the framework default. */
export default function NotFound() {
  return (
    <main id="main" className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-6 text-center noise relative">
      <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--arva-gold)]">ARVA Studios</p>
      <h1 className="mt-6 font-display uppercase leading-none text-[color:var(--arva-text)] text-[clamp(5rem,24vw,12rem)]" data-testid="not-found-heading">
        404
      </h1>
      <div className="gold-rule my-8" aria-hidden="true" />
      <p className="max-w-sm text-sm leading-relaxed text-[color:var(--arva-text-muted)]">
        This page doesn't exist. The system behind your business could, though.
      </p>
      <Link
        to="/"
        data-testid="not-found-home-link"
        className="mt-10 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-black transition-colors duration-200 hover:bg-[#e8e6e0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--arva-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
      >
        Back to the studio <span aria-hidden="true">→</span>
      </Link>
    </main>
  );
}
