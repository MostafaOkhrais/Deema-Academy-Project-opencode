import { Link } from 'react-router-dom';
import { ArrowUpLeft, CircleCheck, Sparkles } from 'lucide-react';
import { stats } from '@/data/site';

export function Hero() {
  return (
    <section className="grid-navy relative overflow-hidden text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-10 h-[420px] w-[420px] rounded-full bg-sky/10 blur-3xl"
      />
      <div className="container-page relative grid gap-12 py-12 md:py-16 lg:grid-cols-[1.03fr_0.97fr] lg:items-center lg:gap-16 lg:py-20">
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-sky/30 bg-sky/[0.07] px-4 py-2 text-[12px] text-sky">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={1.8} />
            أكاديمية ديمة · تعلّم صحي عن بُعد
          </span>

          <h1 className="mt-6 font-serif text-[clamp(3.1rem,7vw,5.9rem)] font-black leading-[1.04]">
            <span className="block">فكّر</span>
            <span className="block text-sky">خارج</span>
            <span className="block">الصندوق</span>
          </h1>

          <p className="mt-7 inline-flex rounded-full bg-sky px-4 py-2 font-serif text-[14px] font-bold leading-snug text-navy md:text-[16px]">
            تخصصك هو البداية، مش حدود مستقبلك.
          </p>

          <div className="mt-6 flex flex-col lg:block">
            <p className="order-2 mt-5 max-w-xl text-[14px] leading-[1.9] text-white/70 md:text-[16.5px] md:leading-[1.95] lg:order-none lg:mt-6">
              مسارات عربية بتربط الصحة بالذكاء الاصطناعي والبحث العلمي وصناعة المحتوى — مع
              د. ديمة، صيدلانية ومعلّمة محتوى صحي. تعلّم بأدواتك، من أي مكان، وابنِ مسار
              مهني أوسع من وظيفة واحدة.
            </p>

            <div className="order-1 mt-6 flex flex-col gap-3 sm:flex-row sm:items-center lg:order-none lg:mt-8">
              <Link to="/events/free-intro-workshop" className="btn btn-sky">
                سجّل بالورشة المجانية
                <ArrowUpLeft className="h-4 w-4" />
              </Link>
              <Link to="/tracks" className="btn btn-outline-dark">
                استكشف المسارات
              </Link>
            </div>
          </div>

          <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-white/45">
            <span className="inline-flex items-center gap-1.5">
              <CircleCheck className="h-3.5 w-3.5 text-sky" strokeWidth={1.8} />
              التسجيل مجاني
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CircleCheck className="h-3.5 w-3.5 text-sky" strokeWidth={1.8} />
              كل التخصصات الصحية
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CircleCheck className="h-3.5 w-3.5 text-sky" strokeWidth={1.8} />
              جلسات مسائية
            </span>
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-[420px] lg:max-w-none">
          <div
            aria-hidden="true"
            className="absolute -right-3 -top-3 h-24 w-24 rounded-[28px] bg-sky md:-right-5 md:-top-5 md:h-32 md:w-32"
          />
          <div className="relative overflow-hidden rounded-[34px] border border-white/15 bg-navy-deep">
            <img
              src="/brand/hero.webp"
              alt="د. ديمة، صيدلانية ومعلّمة محتوى صحي، في لقاء مسجّل"
              width={675}
              height={646}
              className="aspect-[4/4.4] w-full object-cover object-[50%_32%]"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy via-navy/70 to-transparent px-5 pb-5 pt-20">
              <div className="flex items-center gap-3">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-sky" />
                </span>
                <div>
                  <p className="font-serif text-[19px] font-bold leading-tight text-white">د. ديمة</p>
                  <p className="mt-0.5 text-[11.5px] text-white/60">
                    صيدلانية · معلّمة محتوى صحي · مؤسِّسة الأكاديمية
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -left-2 top-5 rounded-2xl bg-white px-4 py-3 text-navy shadow-[0_18px_40px_-28px_rgba(0,0,0,0.7)] md:-left-4">
            <p className="text-[10.5px] font-medium text-sky-deep">الورشة التعريفية</p>
            <p className="mt-0.5 font-serif text-[15px] font-bold">مجانية · أونلاين</p>
          </div>
        </div>
      </div>

      <div className="container-page relative">
        <dl className="grid grid-cols-2 gap-y-6 border-t border-white/12 py-7 md:grid-cols-4 md:divide-x md:divide-white/12 md:py-8 [direction:rtl]">
          {stats.map((stat) => (
            <div key={stat.label} className="md:px-6 md:first:pr-0">
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="font-serif text-[32px] font-black leading-none text-sky md:text-[38px]">
                  {stat.value}
                </span>
                <span className="mt-2 block text-[12.5px] text-white/55">{stat.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
