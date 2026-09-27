import { ButtonLink, Button } from './Button';
import { CALENDAR_LINK } from '../lib/config';

/**
 * "Book a Call →" — links to the external scheduling page when
 * VITE_CALENDAR_LINK is set; otherwise shows a clearly-disabled
 * "Calendar link coming soon" state (spec: never link to a dead URL).
 */
export const BookACall = ({
  variant = 'utility',
  className = '',
  testId = 'book-call-button',
}: {
  variant?: 'primary' | 'secondary' | 'utility' | 'nav';
  className?: string;
  testId?: string;
}) => {
  if (CALENDAR_LINK) {
    return (
      <ButtonLink
        variant={variant}
        href={CALENDAR_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        data-testid={testId}
      >
        Book a Call <span aria-hidden="true">→</span>
      </ButtonLink>
    );
  }
  return (
    <Button variant={variant} disabled aria-disabled="true" title="Scheduling opens soon" className={className} data-testid={testId}>
      Calendar link coming soon
    </Button>
  );
};
