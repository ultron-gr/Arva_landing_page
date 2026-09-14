import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@fontsource/syne/700.css';
import '@fontsource/syne/800.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/space-mono/400.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Defer non-critical chunks (Sentry monitoring + Supabase Auth client) to idle —
// performance-first tie-breaker: nothing optional rides the critical path.
const defer = (cb: () => void) => {
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(cb, { timeout: 4000 });
  } else {
    window.setTimeout(cb, 2500);
  }
};
defer(() => {
  void import('./lib/monitoring');
  void import('./lib/supabase'); // initializes Supabase Auth for the future client portal
});
