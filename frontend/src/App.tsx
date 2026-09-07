import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

// Below-the-fold routes are lazy — they never load on first paint of the home page.
const Privacy = lazy(() => import('./pages/Privacy'));
const NotFound = lazy(() => import('./pages/NotFound'));

const RouteFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
    <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--arva-text-subtle)]">Loading…</p>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
