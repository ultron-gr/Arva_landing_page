import { forwardRef, useId } from 'react';
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';

const FIELD_BASE =
  'w-full rounded-btn border bg-transparent px-4 py-3 min-h-[44px] text-sm text-[color:var(--arva-text)] placeholder:text-[color:var(--arva-text-subtle)] ' +
  'transition-colors duration-200 hover:border-[color:var(--arva-border-strong)] ' +
  'focus:outline-none focus:ring-2 focus:ring-[color:var(--arva-gold)] focus:ring-offset-2 focus:ring-offset-[color:var(--arva-bg)] ' +
  'disabled:opacity-40 disabled:cursor-not-allowed';

const borderFor = (error?: string) =>
  error ? 'border-[color:var(--arva-danger)] focus:ring-[color:var(--arva-danger)]' : 'border-[color:var(--arva-border)]';

interface WrapProps {
  label: string;
  required?: boolean;
  error?: string;
  fieldId: string;
  children: ReactNode;
}

const FieldWrap = ({ label, required, error, fieldId, children }: WrapProps) => (
  <div>
    <label htmlFor={fieldId} className="mb-2 block text-xs tracking-[0.18em] uppercase text-[color:var(--arva-text-subtle)]">
      {label}
      {required && (
        <span className="text-[color:var(--arva-gold)]" aria-hidden="true">
          {' '}*
        </span>
      )}
    </label>
    {children}
    {error && (
      <p id={`${fieldId}-error`} className="mt-2 text-xs text-[color:var(--arva-danger)]" data-testid={`${fieldId}-error`}>
        {error}
      </p>
    )}
  </div>
);

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, required, id, className = '', ...rest }, ref) => {
  const autoId = useId();
  const fieldId = id || autoId;
  return (
    <FieldWrap label={label} required={required} error={error} fieldId={fieldId}>
      <input
        ref={ref}
        id={fieldId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={`${FIELD_BASE} ${borderFor(error)} ${className}`.trim()}
        {...rest}
      />
    </FieldWrap>
  );
});
Input.displayName = 'Input';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  children: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ label, error, required, id, className = '', children, ...rest }, ref) => {
  const autoId = useId();
  const fieldId = id || autoId;
  return (
    <FieldWrap label={label} required={required} error={error} fieldId={fieldId}>
      <div className="relative">
        <select
          ref={ref}
          id={fieldId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          className={`${FIELD_BASE} ${borderFor(error)} appearance-none pr-10 bg-[color:var(--arva-bg)] ${className}`.trim()}
          {...rest}
        >
          {children}
        </select>
        <span aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--arva-text-subtle)]">
          ▾
        </span>
      </div>
    </FieldWrap>
  );
});
Select.displayName = 'Select';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ label, error, required, id, className = '', ...rest }, ref) => {
  const autoId = useId();
  const fieldId = id || autoId;
  return (
    <FieldWrap label={label} required={required} error={error} fieldId={fieldId}>
      <textarea
        ref={ref}
        id={fieldId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={`${FIELD_BASE} ${borderFor(error)} min-h-[120px] resize-y ${className}`.trim()}
        {...rest}
      />
    </FieldWrap>
  );
});
Textarea.displayName = 'Textarea';
