import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);

  return null;
}

export function Layout() {
  const { pathname } = useLocation();
  const isApp = pathname.startsWith('/admin');

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:right-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-navy focus:px-5 focus:py-3 focus:text-sm focus:text-white"
      >
        تخطَّ إلى المحتوى
      </a>
      <ScrollToTop />
      <Header />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      {!isApp && <Footer />}
    </div>
  );
}
