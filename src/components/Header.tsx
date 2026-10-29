import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowUpLeft, Menu, UserRound, X } from 'lucide-react';
import { nav, site, socials } from '@/data/site';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <div className="grid-navy relative z-40 text-sky">
        <div className="container-page flex h-9 items-center justify-between gap-4 text-[12.5px]">
          <Link to="/events/free-intro-workshop" className="group flex min-w-0 items-center gap-2.5">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sky" />
            </span>
            <span className="truncate">الورشة التعريفية المجانية — التسجيل قريباً</span>
            <ArrowLeft className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:-translate-x-0.5" />
          </Link>
          <span className="hidden shrink-0 text-sky/60 sm:block">{site.year} · التعلم عن بُعد</span>
        </div>
      </div>

      <header
        className={cn(
          'sticky top-0 z-50 border-b transition-all duration-300',
          scrolled
            ? 'border-line bg-white/90 shadow-[0_10px_30px_-24px_rgba(0,33,71,0.5)] backdrop-blur-md'
            : 'border-transparent bg-paper',
        )}
      >
        <div className="container-page flex h-[74px] items-center justify-between gap-4">
          <Logo />

          <nav aria-label="التنقل الرئيسي" className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'relative rounded-full px-4 py-2 text-[14.5px] font-medium transition-colors',
                    isActive ? 'text-navy' : 'text-navy/60 hover:text-navy',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    <span
                      className={cn(
                        'absolute inset-x-4 -bottom-0.5 h-[2px] rounded-full bg-sky transition-transform duration-300',
                        isActive ? 'scale-x-100' : 'scale-x-0',
                      )}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-[14px] font-medium text-navy/70 transition-colors hover:text-navy sm:inline-flex"
            >
              <UserRound className="h-4 w-4" strokeWidth={1.8} />
              حسابي
            </Link>
            <Link to="/join" className="btn btn-navy btn-sm md:h-[2.85rem] md:px-5 md:text-[14px]">
              انضم للأكاديمية
              <ArrowUpLeft className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-full border border-navy/15 text-navy lg:hidden"
              aria-label="فتح القائمة"
              aria-expanded={menuOpen}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col lg:hidden">
          <div className="grid-navy absolute inset-0" aria-hidden="true" />
          <div className="relative flex h-full flex-col overflow-y-auto px-5 pb-10 pt-4">
            <div className="flex items-center justify-between">
              <Logo dark />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="grid h-11 w-11 place-items-center rounded-full border border-white/25 text-white"
                aria-label="إغلاق القائمة"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav aria-label="قائمة الجوال" className="mt-14 flex flex-col">
              {nav.map((item, i) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between border-b border-white/10 py-4 font-serif text-[27px] font-bold',
                      isActive ? 'text-sky' : 'text-white',
                    )
                  }
                >
                  {item.label}
                  <span className="font-sans text-[12px] font-normal text-white/35">
                    0{i + 1}
                  </span>
                </NavLink>
              ))}
            </nav>

            <div className="mt-8 flex flex-col gap-3">
              <Link to="/join" className="btn btn-sky w-full">
                انضم للأكاديمية
                <ArrowUpLeft className="h-4 w-4" />
              </Link>
              <Link to="/login" className="btn btn-outline-dark w-full">
                <UserRound className="h-4 w-4" />
                حسابي
              </Link>
            </div>

            <div className="mt-auto pt-10">
              <p className="text-[12px] text-white/40">{site.email}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/20 px-3 py-1.5 text-[12px] text-white/70"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
