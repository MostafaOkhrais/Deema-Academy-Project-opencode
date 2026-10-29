import { Link } from 'react-router-dom';
import { ArrowUpLeft, Sparkles } from 'lucide-react';
import { Reveal } from '@/components/Reveal';

export function JoinCta() {
  return (
    <section className="bg-paper pb-20 md:pb-28">
      <div className="container-page">
        <Reveal>
          <div className="grid-navy relative overflow-hidden rounded-[36px] px-6 py-12 text-white md:px-12 md:py-14 lg:px-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-sky/10 blur-2xl"
            />
            <div className="relative grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                <span className="kicker kicker-dark">ابدأ من هون</span>
                <h2 className="mt-4 max-w-xl text-[clamp(2rem,3.8vw,3.2rem)] leading-[1.28]">
                  سجّل بالورشة المجانية،
                  <br />
                  وشوف إذا هالمكان <span className="text-sky">إلك</span>.
                </h2>
                <p className="mt-4 max-w-lg text-[14.5px] leading-[1.9] text-white/60">
                  ساعة ونصف أونلاين: بنحكي عن المسارات، بنجاوب على أسئلتك، وبنعطيك خطة
                  بداية واضحة — سواء أكملت معنا أو لأ.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link to="/join" className="btn btn-sky">
                    سجّل الآن
                    <ArrowUpLeft className="h-4 w-4" />
                  </Link>
                  <Link to="/tracks" className="btn btn-outline-dark">
                    تصفّح المسارات أولاً
                  </Link>
                </div>
                <p className="mt-5 inline-flex items-center gap-2 text-[12px] text-white/45">
                  <Sparkles className="h-3.5 w-3.5 text-sky" />
                  مجاني · أونلاين · بدون التزام
                </p>
              </div>

              <div className="relative mx-auto hidden w-full max-w-[240px] lg:block">
                <div
                  aria-hidden="true"
                  className="absolute inset-x-3 bottom-0 top-8 rounded-full bg-sky/20"
                />
                <img
                  src="/brand/pose-point.webp"
                  alt="د. ديمة تشير بيدها"
                  width={235}
                  height={419}
                  className="relative mx-auto max-h-[300px] w-auto rounded-[24px] object-contain"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
