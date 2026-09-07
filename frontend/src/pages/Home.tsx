import { lazy, Suspense, useState } from 'react';
import { Splash } from '../components/Splash';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Hero } from '../sections/Hero';
import { About } from '../sections/About';
import { Pillars } from '../sections/Pillars';

// Below-the-fold sections — lazy-loaded so they don't weigh down first paint.
const ContentVideo = lazy(() => import('../sections/ContentVideo').then((m) => ({ default: m.ContentVideo })));
const WebProducts = lazy(() => import('../sections/WebProducts').then((m) => ({ default: m.WebProducts })));
const AutomationAI = lazy(() => import('../sections/AutomationAI').then((m) => ({ default: m.AutomationAI })));
const BrandDesign = lazy(() => import('../sections/BrandDesign').then((m) => ({ default: m.BrandDesign })));
const Process = lazy(() => import('../sections/Process').then((m) => ({ default: m.Process })));
const Comparison = lazy(() => import('../sections/Comparison').then((m) => ({ default: m.Comparison })));
const FinalCTA = lazy(() => import('../sections/FinalCTA').then((m) => ({ default: m.FinalCTA })));
const RespectSection = lazy(() => import('../sections/RespectSection').then((m) => ({ default: m.RespectSection })));

const BelowFoldFallback = () => (
  <div className="flex min-h-[40vh] items-center justify-center bg-[#0a0a0a]" aria-hidden="true" />
);

export default function Home() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <>
      <a href="#main" className="skip-link" data-testid="skip-to-content-link">
        Skip to content
      </a>
      {!splashDone && <Splash onDone={() => setSplashDone(true)} />}
      <Header />
      <main id="main">
        <Hero />
        <About />
        <Pillars />
        <Suspense fallback={<BelowFoldFallback />}>
          <ContentVideo />
          <WebProducts />
          <AutomationAI />
          <BrandDesign />
          <Process />
          <Comparison />
          <FinalCTA />
          <RespectSection />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
