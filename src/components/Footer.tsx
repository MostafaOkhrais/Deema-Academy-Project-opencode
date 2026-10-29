import { Link } from 'react-router-dom';
import { ArrowUpLeft, Mail, MapPin } from 'lucide-react';
import { site, socials } from '@/data/site';
import { tracks } from '@/data/tracks';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="grid-navy relative text-white">
      <div className="container-page pb-8 pt-16 md:pt-20">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-[1.5fr_1fr_1fr_1.1fr]">
          <div className="col-span-2 max-w-sm lg:col-span-1">
            <Logo dark />
            <p className="mt-5 text-[14.5px] leading-[1.9] text-white/60">
              أكاديمية عربية للتعلّم الصحي عن بُعد. بنجمع الصحة والذكاء الاصطناعي والبحث
              وصناعة المحتوى، لأن تخصصك هو البداية مش حدود مستقبلك.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/20 px-3.5 py-1.5 text-[12.5px] text-white/75 transition-colors hover:border-sky hover:text-sky"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="المسارات">
            <h3 className="font-sans text-[13px] font-medium tracking-wide text-sky">المسارات</h3>
            <ul className="mt-4 space-y-2.5">
              {tracks.map((track) => (
                <li key={track.slug}>
                  <Link
                    to={`/tracks/${track.slug}`}
                    className="text-[14px] text-white/65 transition-colors hover:text-white"
                  >
                    {track.short}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="الأكاديمية">
            <h3 className="font-sans text-[13px] font-medium tracking-wide text-sky">الأكاديمية</h3>
            <ul className="mt-4 space-y-2.5">
              {[
                { label: 'عن ديمة', to: '/about' },
                { label: 'الفعاليات', to: '/events' },
                { label: 'الأسئلة الشائعة', to: '/faq' },
                { label: 'انضم للأكاديمية', to: '/join' },
                { label: 'تحقق من طلبك', to: '/join#status' },
                { label: 'حسابي', to: '/login' },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-[14px] text-white/65 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-2 sm:col-span-1">
            <h3 className="font-sans text-[13px] font-medium tracking-wide text-sky">تواصل</h3>
            <ul className="mt-4 space-y-3 text-[14px] text-white/65">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center gap-2 transition-colors hover:text-white"
                >
                  <Mail className="h-4 w-4 text-sky" strokeWidth={1.7} />
                  {site.email}
                </a>
              </li>
              <li className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-sky" strokeWidth={1.7} />
                فلسطين · أونلاين
              </li>
            </ul>
            <Link
              to="/join"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-sky px-5 py-3 text-[13.5px] font-medium text-navy transition-colors hover:bg-[#7dbcd8]"
            >
              ابدأ بالورشة المجانية
              <ArrowUpLeft className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/12 pt-6 text-[12.5px] text-white/45 md:flex-row md:items-center md:justify-between">
          <p>© ٢٠٢٦ أكاديمية ديمة — كل الحقوق محفوظة.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link to="/privacy" className="transition-colors hover:text-white/80">
              الخصوصية
            </Link>
            <Link to="/terms" className="transition-colors hover:text-white/80">
              الشروط
            </Link>
            <span className="text-white/45">{site.domain}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
