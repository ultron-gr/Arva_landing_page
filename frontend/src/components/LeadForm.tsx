import { useRef, useState, type FormEvent } from 'react';
import { Input, Select, Textarea } from './Field';
import { Button } from './Button';
import { API_BASE, CONTACT_EMAIL } from '../lib/config';

const PROJECT_OPTIONS = [
  { value: '', label: 'Select a project type…' },
  { value: 'content_video', label: 'Content & Video' },
  { value: 'web_products', label: 'Web Products' },
  { value: 'automation_ai', label: 'Automation & AI' },
  { value: 'brand_design', label: 'Brand Design' },
  { value: 'not_sure', label: 'Not sure yet' },
];

const BUDGET_OPTIONS = [
  { value: '', label: 'Prefer not to say' },
  { value: 'Under ₹25,000', label: 'Under ₹25,000' },
  { value: '₹25,000–50,000', label: '₹25,000–50,000' },
  { value: '₹50,000–1,00,000', label: '₹50,000–1,00,000' },
  { value: '₹1,00,000+', label: '₹1,00,000+' },
];

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;
const TIMEOUT_MS = 10_000;

interface FormValues {
  name: string;
  email: string;
  company: string;
  project_type: string;
  budget_range: string;
  message: string;
}

const EMPTY: FormValues = { name: '', email: '', company: '', project_type: '', budget_range: '', message: '' };

type Status = 'idle' | 'sending' | 'success' | 'error';

export const LeadForm = () => {
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState<string>('');
  const [timedOut, setTimedOut] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const set = (field: keyof FormValues) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormValues, string>> = {};
    if (!values.name.trim()) next.name = 'Name is required.';
    if (!values.email.trim()) next.email = 'Email is required.';
    else if (!EMAIL_RE.test(values.email.trim())) next.email = 'Enter a valid email address.';
    if (!values.project_type) next.project_type = 'Select a project type.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (status === 'sending') return; // never double-submit
    setServerError('');
    setTimedOut(false);
    if (!validate()) return;

    setStatus('sending');
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const res = await fetch(`${API_BASE}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          company: values.company.trim(),
          project_type: values.project_type,
          budget_range: values.budget_range,
          message: values.message.trim(),
          website_url: honeypotRef.current?.value ?? '', // honeypot — humans never fill this
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        setStatus('success');
        return;
      }
      if (res.status === 400 && data.errors) {
        setErrors(data.errors);
        setServerError(data.error || 'Please fix the highlighted fields.');
      } else {
        setServerError(data.error || 'Something went wrong on our side. Please try again.');
      }
      setStatus('error');
    } catch {
      setTimedOut(true);
      setServerError('The request took too long — your connection may have dropped. Your details are still filled in below.');
      setStatus('error');
    } finally {
      window.clearTimeout(timer);
    }
  };

  if (status === 'success') {
    return (
      <div
        role="status"
        aria-live="polite"
        data-testid="lead-form-success-message"
        className="rounded-xl border border-[color:var(--arva-success)]/40 bg-[color:var(--arva-surface)] p-8"
      >
        <p className="font-display text-2xl uppercase tracking-[-0.01em] text-[color:var(--arva-text)]">
          Got it<span className="text-[color:var(--arva-gold)]">.</span>
        </p>
        <p className="mt-4 text-sm leading-relaxed text-[color:var(--arva-text-muted)]">
          Your message is in. A real person from the studio will reply within{' '}
          <span className="text-[color:var(--arva-text)]">1 business day</span> — check your inbox
          for a confirmation.
        </p>
        <p className="mt-4 text-xs text-[color:var(--arva-text-subtle)]">
          Didn't mean to send it, or want to add something? Just reply to the confirmation email or
          write to {CONTACT_EMAIL}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate data-testid="lead-form">
      {/* Honeypot — hidden from real users and screen readers, bots fill it */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Do not fill this field
          <input ref={honeypotRef} type="text" name="website_url" tabIndex={-1} autoComplete="off" data-testid="lead-form-honeypot" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Name"
          required
          id="lead-name"
          data-testid="lead-form-name-input"
          autoComplete="name"
          value={values.name}
          onChange={set('name')}
          error={errors.name}
          placeholder="Your name"
        />
        <Input
          label="Email"
          required
          id="lead-email"
          type="email"
          data-testid="lead-form-email-input"
          autoComplete="email"
          value={values.email}
          onChange={set('email')}
          error={errors.email}
          placeholder="you@company.com"
        />
        <Input
          label="Company"
          id="lead-company"
          data-testid="lead-form-company-input"
          autoComplete="organization"
          value={values.company}
          onChange={set('company')}
          error={errors.company}
          placeholder="Optional"
        />
        <Select
          label="Project type"
          required
          id="lead-project-type"
          data-testid="lead-form-project-type-select"
          value={values.project_type}
          onChange={set('project_type')}
          error={errors.project_type}
        >
          {PROJECT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value} disabled={o.value === ''}>
              {o.label}
            </option>
          ))}
        </Select>
        <Select
          label="Budget range"
          id="lead-budget"
          data-testid="lead-form-budget-select"
          value={values.budget_range}
          onChange={set('budget_range')}
          error={errors.budget_range}
        >
          {BUDGET_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
        <div className="sm:col-span-2">
          <Textarea
            label="Message"
            id="lead-message"
            data-testid="lead-form-message-textarea"
            value={values.message}
            onChange={set('message')}
            error={errors.message}
            placeholder="Tell us what you're building. Optional — but it helps."
          />
        </div>
      </div>

      {/* Error announcements — aria-live so screen readers hear failures */}
      <div aria-live="polite">
        {status === 'error' && serverError && (
          <div
            data-testid="lead-form-error-message"
            className="mt-6 rounded-btn border border-[color:var(--arva-danger)]/50 bg-[color:var(--arva-danger)]/10 p-4 text-sm leading-relaxed text-[color:var(--arva-text)]"
          >
            <p>{serverError}</p>
            <p className="mt-2 text-xs text-[color:var(--arva-text-muted)]">
              {timedOut ? (
                <>
                  You can retry below, or email us directly at{' '}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="underline decoration-[color:var(--arva-gold)] underline-offset-4">
                    {CONTACT_EMAIL}
                  </a>
                  .
                </>
              ) : (
                <>
                  If it keeps failing, email us directly at{' '}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="underline decoration-[color:var(--arva-gold)] underline-offset-4">
                    {CONTACT_EMAIL}
                  </a>
                  — your details stay filled in here.
                </>
              )}
            </p>
          </div>
        )}
      </div>

      <div className="mt-8">
        <Button
          type="submit"
          variant="primary"
          disabled={status === 'sending'}
          data-testid="lead-form-submit-button"
          className="w-full sm:w-auto"
        >
          {status === 'sending' ? (
            'Sending…'
          ) : timedOut ? (
            <>
              Retry <span aria-hidden="true">↻</span>
            </>
          ) : (
            <>
              Book Your Conversation <span aria-hidden="true">→</span>
            </>
          )}
        </Button>
        <p className="mt-4 text-xs leading-relaxed text-[color:var(--arva-text-subtle)]">
          We'll only use this to get in touch about your project.{' '}
          <a
            href="/privacy"
            data-testid="lead-form-privacy-link"
            className="underline decoration-[color:var(--arva-gold)] underline-offset-4 transition-colors duration-200 hover:text-[color:var(--arva-text)]"
          >
            Privacy policy
          </a>
          .
        </p>
      </div>
    </form>
  );
};
