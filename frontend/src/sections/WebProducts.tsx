import { Reveal } from '../components/Reveal';
import { Eyebrow } from '../components/Eyebrow';

const ROWS = [
  { product: 'Landing Page', desc: 'One page. One goal. Built to convert.', price: '₹18,000+' },
  { product: 'Full Website', desc: 'Multi-page site with CMS, SEO and analytics.', price: '₹35,000+' },
  { product: 'Booking System', desc: 'Scheduling, reminders and payments in one flow.', price: '₹45,000+' },
  { product: 'Client Portal', desc: 'Logins, dashboards and documents for your clients.', price: '₹60,000+' },
  { product: 'E-Commerce', desc: 'Catalog, checkout, inventory — ready to sell.', price: '₹90,000+' },
  { product: 'Internal Tool', desc: 'Custom software that replaces the spreadsheet chaos.', price: '₹75,000+' },
];

const BUILT_WITH = ['Next.js', 'Framer', 'Supabase', 'Neon', 'Clerk', 'Vercel', 'Cloudflare R2'];

/** 04 / Web Products — real <table> with scoped row headers from md up, stacked cards below. */
export const WebProducts = () => (
  <section id="web-products" aria-labelledby="web-products-heading" className="scroll-mt-24 border-t border-[color:var(--arva-border)] bg-[#0a0a0a]">
    <div className="mx-auto w-full max-w-site px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <Reveal>
        <Eyebrow number="04" label="Web Products" />
        <div className="gold-rule mt-4" aria-hidden="true" />
      </Reveal>
      <Reveal delay={80}>
        <h2 id="web-products-heading" className="mt-8 max-w-3xl font-display uppercase leading-[0.96] tracking-[-0.01em] text-[color:var(--arva-text)] text-[clamp(1.9rem,6.4vw,3.4rem)]">
          Products built to work while you sleep.
        </h2>
      </Reveal>

      {/* md+ — real table with scoped headers */}
      <Reveal delay={140}>
        <div className="mt-14 hidden overflow-hidden rounded-xl border border-[color:var(--arva-border)] md:block">
          <table className="w-full border-collapse" data-testid="web-products-pricing-table">
            <caption className="sr-only">Web product starting prices in Indian Rupees</caption>
            <thead>
              <tr className="bg-[color:var(--arva-surface)]">
                <th scope="col" className="px-6 py-4 text-left text-xs uppercase tracking-[0.28em] text-[color:var(--arva-text-subtle)]">Product</th>
                <th scope="col" className="px-6 py-4 text-left text-xs uppercase tracking-[0.28em] text-[color:var(--arva-text-subtle)]">What you get</th>
                <th scope="col" className="px-6 py-4 text-right text-xs uppercase tracking-[0.28em] text-[color:var(--arva-text-subtle)]">Starting at</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.product} className="border-t border-[color:var(--arva-border)] transition-colors duration-200 hover:bg-white/[0.03]">
                  <th scope="row" className="px-6 py-5 text-left font-display text-lg uppercase tracking-[-0.01em] text-[color:var(--arva-text)]">
                    {r.product}
                  </th>
                  <td className="px-6 py-5 text-sm text-[color:var(--arva-text-muted)]">{r.desc}</td>
                  <td className="px-6 py-5 text-right text-base font-medium text-[color:var(--arva-gold)]">{r.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      {/* below md — stacked price cards */}
      <div className="mt-14 grid gap-4 md:hidden" data-testid="web-products-pricing-cards">
        {ROWS.map((r, i) => (
          <Reveal key={r.product} delay={i * 50}>
            <div className="rounded-xl border border-[color:var(--arva-border)] bg-[color:var(--arva-surface)] p-5">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-lg uppercase tracking-[-0.01em] text-[color:var(--arva-text)]">{r.product}</h3>
                <p className="whitespace-nowrap text-base font-medium text-[color:var(--arva-gold)]">{r.price}</p>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--arva-text-muted)]">{r.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <p className="mt-8 text-sm text-[color:var(--arva-text-muted)]">
          All prices are starting points. Final scope after a conversation.{' '}
          <span className="text-[color:var(--arva-text)]">Conversations are free.</span>
        </p>
      </Reveal>

      <Reveal delay={180}>
        <div className="mt-12">
          <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--arva-text-subtle)]">Built with</p>
          <ul className="mt-4 flex flex-wrap gap-2" data-testid="web-products-built-with">
            {BUILT_WITH.map((t) => (
              <li key={t} className="inline-flex items-center rounded-full border border-[color:var(--arva-border)] px-3 py-1.5 text-xs text-[color:var(--arva-text-muted)]">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </div>
  </section>
);
