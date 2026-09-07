// Centralized runtime config — every env read happens here, nowhere else.

export const BACKEND_URL: string =
  import.meta.env.REACT_APP_BACKEND_URL || '';

export const API_BASE = `${BACKEND_URL}/api`;

const rawCalendarLink = import.meta.env.VITE_CALENDAR_LINK || '';
const PLACEHOLDER_PATTERNS = ['[[', 'PLACEHOLDER', 'example.com/placeholder'];

/** The calendar link, or null when unset / still a placeholder (spec: hide/relabel). */
export const CALENDAR_LINK: string | null =
  rawCalendarLink && !PLACEHOLDER_PATTERNS.some((p) => rawCalendarLink.includes(p))
    ? rawCalendarLink
    : null;

// TODO(confirm with ARVA): public-facing contact email. admin@arvastudios.in is the
// internal Resend account address and must NOT be displayed publicly (user instruction).
// 'pavan@arvastudios.in' is the example the client gave but is NOT yet confirmed as live.
export const CONTACT_EMAIL = 'pavan@arvastudios.in';
