import { Link } from 'react-router-dom';
import { ArrowUpLeft } from 'lucide-react';
import { usePageMeta } from '@/lib/seo';

export function NotFound() {
  usePageMeta({ title: 'الصفحة غير موجودة | أكاديمية ديمة', noindex: true });

  return (
    <section className="grid-navy relative overflow-hidden text-white">
      <div className="container-page flex min-h-[62vh] flex-col items-center justify-center py-20 text-center">
        <span className="font-serif text-[clamp(6rem,18vw,12rem)] font-black leading-none text-sky/20">
          ٤٠٤
        </span>
        <h1 className="-mt-4 text-[clamp(1.8rem,4vw,2.8rem)]">هالصفحة مش موجودة.</h1>
        <p className="mt-4 max-w-md text-[14px] leading-[1.9] text-white/60">
          يمكن الرابط قديم أو مكتوب غلط. ارجع للرئيسية، أو شوف المسارات إذا بدك تكمّل من مكان تاني.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/" className="btn btn-sky">
            الرئيسية
            <ArrowUpLeft className="h-4 w-4" />
          </Link>
          <Link to="/tracks" className="btn btn-outline-dark">
            المسارات
          </Link>
        </div>
      </div>
    </section>
  );
}
