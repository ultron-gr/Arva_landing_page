import { Link } from 'react-router-dom';
import { CONTACT_EMAIL } from '../lib/config';

const LINK_CLS =
  'text-sm font-body text-[color:var(--arva-text-muted)] transition-colors duration-200 hover:text-[color:var(--arva-text)] hover:underline decoration-[color:var(--arva-gold)] underline-offset-4 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--arva-gold)] rounded-none inline-block py-1.5';

const COL_HEAD = 'mb-4 text-xs tracking-[0.28em] uppercase text-[color:var(--arva-text-subtle)]';

// TODO(confirm with ARVA): final Instagram / LinkedIn handles before launch.
// Current handles were derived from the studio name, not confirmed by the client.
const INSTAGRAM_URL = 'https://www.instagram.com/arvastudios';
const LINKEDIN_URL = 'https://www.linkedin.com/company/arvastudios';

export const Footer = () => (
  <footer data-testid="site-footer" className="border-t border-[color:var(--arva-border)] bg-[#0A0A0A]">
    <div className="mx-auto w-full max-w-site px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <img src="/brand/FINAL_LOGO_1.png" alt="ARVA Studios" width={48} height={48} className="h-12 w-12" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-[color:var(--arva-text-muted)]">
            We build the digital system behind your business.
          </p>
          <p className="mt-6 text-xs tracking-[0.24em] uppercase text-[color:var(--arva-text-subtle)]">
            Content · Web · Automation · Design
          </p>
        </div>

        <nav aria-label="Services" data-testid="footer-services-nav">
          <p className={COL_HEAD}>Services</p>
          <ul className="space-y-1">
            <li><a className={LINK_CLS} href="#content-video">Content &amp; Video</a></li>
            <li><a className={LINK_CLS} href="#web-products">Web Products</a></li>
            <li><a className={LINK_CLS} href="#automation-ai">Automation &amp; AI</a></li>
            <li><a className={LINK_CLS} href="#brand-design">Brand Design</a></li>
          </ul>
        </nav>

        <nav aria-label="Studio" data-testid="footer-studio-nav">
          <p className={COL_HEAD}>Studio</p>
          <ul className="space-y-1">
            <li><a className={LINK_CLS} href="#about">About</a></li>
            <li><a className={LINK_CLS} href="#process">Process</a></li>
            <li><a className={LINK_CLS} href="#contact">Start a Project</a></li>
            <li><Link className={LINK_CLS} to="/privacy" data-testid="footer-privacy-link">Privacy Policy</Link></li>
          </ul>
        </nav>

        <nav aria-label="Connect" data-testid="footer-connect-nav">
          <p className={COL_HEAD}>Connect</p>
          <ul className="space-y-1">
            <li>
              <a className={LINK_CLS} href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Instagram</a>
            </li>
            <li>
              <a className={LINK_CLS} href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </li>
            <li>
              <a className={LINK_CLS} href={`mailto:${CONTACT_EMAIL}`} data-testid="footer-email-link">{CONTACT_EMAIL}</a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="mt-16 flex flex-col gap-3 border-t border-[color:var(--arva-border)] pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-[color:var(--arva-text-subtle)]">© 2026 ARVA Studios. Bengaluru, India.</p>
        <p className="text-xs text-[color:var(--arva-text-subtle)]">Early Access Dec 2026 · Full Launch Jan 1, 2027</p>
      </div>
    </div>
  </footer>
);
