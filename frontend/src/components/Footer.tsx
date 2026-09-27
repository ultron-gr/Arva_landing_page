import { Link } from 'react-router-dom';
import { Instagram, Linkedin } from 'lucide-react';
import { Reveal } from './Reveal';
import { BookACall } from './BookACall';

const LINK_CLS =
  'text-sm font-body text-[color:var(--arva-text-muted)] transition-colors duration-200 hover:text-[color:var(--arva-text)] hover:underline decoration-[color:var(--arva-gold)] underline-offset-4 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--arva-gold)] rounded-none inline-block py-1.5';

const COL_HEAD = 'mb-4 text-xs tracking-[0.28em] text-[color:var(--arva-text-subtle)]';

const SOCIAL_CLS =
  'flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--arva-border)] text-[color:var(--arva-text-muted)] ' +
  'transition-colors duration-200 hover:border-[color:var(--arva-gold)] hover:text-[color:var(--arva-gold)] ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--arva-gold)]';

// TODO(confirm with ARVA): final Instagram / LinkedIn handles before launch.
// Current handles were derived from the studio name, not confirmed by the client.
const INSTAGRAM_URL = 'https://www.instagram.com/arvastudios';
const LINKEDIN_URL = 'https://www.linkedin.com/company/arvastudios';
const WEBSITE_URL = 'https://arvastudios.in';
const WEBSITE_LABEL = 'arvastudios.in';

/**
 * 11 / Footer — 4 labeled columns (spec):
 * 1. Identity — logo, one-liner, location, socials.
 * 2. Services. 3. Studio. 4. Connect — website + the "Book a Call" slot,
 * kept in its own column rather than wedged between others.
 * Socials live only in column 1 — not duplicated in Connect.
 */
export const Footer = () => (
  <footer data-testid="site-footer" className="border-t border-[color:var(--arva-border)] bg-[#0A0A0A]">
    <div className="mx-auto w-full max-w-site px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        <Reveal className="sm:col-span-2 lg:col-span-1">
          <img src="/brand/arva-logo-white.png" alt="ARVA Studios" width={140} height={140} className="h-auto w-[140px]" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-[color:var(--arva-text-muted)]">
            We build the digital system behind your business.
          </p>
          <p className="mt-4 text-xs tracking-[0.24em] text-[color:var(--arva-text-subtle)]">
            Bengaluru, India · Est. 2026
          </p>

          <div className="mt-6 flex items-center gap-3" data-testid="footer-social-row">
            <a className={SOCIAL_CLS} href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="ARVA Studios on Instagram">
              <Instagram size={16} strokeWidth={1.75} />
            </a>
            <a className={SOCIAL_CLS} href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label="ARVA Studios on LinkedIn">
              <Linkedin size={16} strokeWidth={1.75} />
            </a>
          </div>
        </Reveal>

        <Reveal>
          <nav aria-label="Services" data-testid="footer-services-nav">
            <p className={COL_HEAD}>Services</p>
            <ul className="space-y-1">
              <li><a className={LINK_CLS} href="#content-video">Content &amp; Video</a></li>
              <li><a className={LINK_CLS} href="#web-products">Web Products</a></li>
              <li><a className={LINK_CLS} href="#automation-ai">Automation &amp; AI</a></li>
              <li><a className={LINK_CLS} href="#brand-design">Brand Design</a></li>
            </ul>
          </nav>
        </Reveal>

        <Reveal>
          <nav aria-label="Studio" data-testid="footer-studio-nav">
            <p className={COL_HEAD}>Studio</p>
            <ul className="space-y-1">
              <li><a className={LINK_CLS} href="#about">About</a></li>
              <li><a className={LINK_CLS} href="#process">Process</a></li>
              <li><a className={LINK_CLS} href="#contact">Start a Project</a></li>
              <li><Link className={LINK_CLS} to="/privacy" data-testid="footer-privacy-link">Privacy Policy</Link></li>
            </ul>
          </nav>
        </Reveal>

        <Reveal className="sm:col-span-2 lg:col-span-1">
          <nav aria-label="Connect" data-testid="footer-connect-nav">
            <p className={COL_HEAD}>Connect</p>
            <a className={LINK_CLS} href={WEBSITE_URL} target="_blank" rel="noopener noreferrer" data-testid="footer-website-link">
              {WEBSITE_LABEL}
            </a>

            <div className="mt-5">
              <BookACall variant="secondary" testId="footer-book-call-button" />
              <p className="mt-3 text-xs text-[color:var(--arva-text-subtle)]">
                No commitment. Real conversation only.
              </p>
            </div>
          </nav>
        </Reveal>
      </div>

      <div className="mt-16 flex flex-col gap-3 border-t-[0.5px] border-[color:var(--arva-border)] pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-[color:var(--arva-text-subtle)]">© 2026 ARVA Studios. Bengaluru, India.</p>
        <p className="text-xs text-[color:var(--arva-text-subtle)]">Early Access Dec 2026 · Full Launch Jan 1, 2027</p>
      </div>
    </div>
  </footer>
);
