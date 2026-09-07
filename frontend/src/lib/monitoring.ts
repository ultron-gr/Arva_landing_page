// Sentry init — loaded lazily (post-idle) so monitoring never taxes first paint.
import * as Sentry from '@sentry/react';

const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn, // frontend Sentry project — separate DSN from the backend
    sendDefaultPii: false,
    tracesSampleRate: 0.1,
  });
} else {
  // eslint-disable-next-line no-console
  console.warn('VITE_SENTRY_DSN not set — frontend error monitoring is disabled.');
}
