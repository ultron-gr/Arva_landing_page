import { Link } from 'react-router-dom';
import { CONTACT_EMAIL } from '../lib/config';
import { usePageMeta } from '../hooks/usePageMeta';

/** Plain-language privacy policy — launch placeholder per spec. */
export default function Privacy() {
  usePageMeta({
    title: 'Privacy Policy — ARVA Studios',
    description: 'How ARVA Studios collects, uses and protects the information you share with us.',
  });

  return (
    <main id="main" className="min-h-screen bg-[#0a0a0a]">
      <div className="mx-auto w-full max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <Link
          to="/"
          data-testid="privacy-back-link"
          className="inline-flex min-h-[44px] items-center gap-2 text-sm text-[color:var(--arva-text-muted)] transition-colors duration-200 hover:text-[color:var(--arva-text)] hover:underline decoration-[color:var(--arva-gold)] underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--arva-gold)] rounded-sm"
        >
          <span aria-hidden="true">←</span> Back to site
        </Link>

        <p className="mt-10 text-xs uppercase tracking-[0.3em] text-[color:var(--arva-gold)]">ARVA Studios</p>
        <h1 className="mt-4 font-display text-4xl uppercase leading-tight text-[color:var(--arva-text)] sm:text-5xl">
          Privacy Policy
        </h1>
        <div className="gold-rule mt-6" aria-hidden="true" />

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-[color:var(--arva-text-muted)]">
          <section aria-labelledby="privacy-collect">
            <h2 id="privacy-collect" className="mb-3 font-display text-xl uppercase text-[color:var(--arva-text)]">
              What we collect
            </h2>
            <p>
              When you submit the contact form we collect your name, email address and — if you
              choose to share them — your company name, project type, budget range and message. We
              also store a one-way cryptographic hash derived from your IP address purely to detect
              abuse (spam floods). We never store your raw IP address.
            </p>
          </section>

          <section aria-labelledby="privacy-why">
            <h2 id="privacy-why" className="mb-3 font-display text-xl uppercase text-[color:var(--arva-text)]">
              Why we collect it
            </h2>
            <p>
              For exactly one reason: to get in touch with you about your project. We send you one
              confirmation email, and your details reach our team so a real person can reply.
              That's the whole pipeline.
            </p>
          </section>

          <section aria-labelledby="privacy-sold">
            <h2 id="privacy-sold" className="mb-3 font-display text-xl uppercase text-[color:var(--arva-text)]">
              What we never do
            </h2>
            <p>
              Your data is never sold, rented, traded or shared with third parties for marketing.
              No ad pixels, no tracking across the web, no newsletter you didn't ask for.
            </p>
          </section>

          <section aria-labelledby="privacy-delete">
            <h2 id="privacy-delete" className="mb-3 font-display text-xl uppercase text-[color:var(--arva-text)]">
              Deletion requests
            </h2>
            <p>
              Want your data gone? Email{' '}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                data-testid="privacy-contact-email-link"
                className="text-[color:var(--arva-text)] underline decoration-[color:var(--arva-gold)] underline-offset-4"
              >
                {CONTACT_EMAIL}
              </a>{' '}
              from the address you submitted and we'll delete every record of it. No questions, no
              retention games.
            </p>
          </section>

          <p className="border-t border-[color:var(--arva-border)] pt-8 text-xs text-[color:var(--arva-text-subtle)]">
            Last updated: December 2026. This is a plain-language launch policy — it will be
            expanded before full launch on January 1, 2027.
          </p>
        </div>
      </div>
    </main>
  );
}
