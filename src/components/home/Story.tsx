import { Link } from 'react-router-dom';
import { ArrowUpLeft, Quote } from 'lucide-react';
import { story } from '@/data/site';
import { Reveal } from '@/components/Reveal';

export function Story() {
  return (
    <section className="grid-white">
      <div className="container-page py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-16">
          <Reveal className="lg:order-2 lg:sticky lg:top-28">
            <div className="relative mx-auto w-full max-w-[380px] py-4">
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky/30"
              />
              <div className="relative mx-auto w-[250px] overflow-hidden rounded-[28px] border border-line bg-white p-3 shadow-[0_34px_70px_-50px_rgba(0,33,71,0.55)]">
                <img
                  src="/brand/pose-mug.webp"
                  alt="رسم توضيحي لد. ديمة تحمل كوب وتشير بيدها"
                  width={233}
                  height={419}
                  className="w-full rounded-[20px]"
                />
                <div className="flex items-center justify-between gap-2 px-1 pb-1 pt-3">
                  <div>
                    <p className="font-serif text-[15px] font-bold text-navy">د. ديمة</p>
                    <p className="mt-0.5 text-[10.5px] text-muted">صيدلانية · معلّمة محتوى صحي</p>
                  </div>
                  <span className="rounded-full bg-navy px-2.5 py-1 text-[9.5px] text-sky">
                    المؤسِّسة
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100} className="lg:order-1">
            <span className="kicker">القصة</span>
            <h2 className="mt-4 text-[clamp(1.9rem,3.7vw,3.1rem)] leading-[1.3]">
              بلّشت من صيدلة،
              <br />
              ووصلت لـ<span className="text-sky-deep">مسارات متعددة</span>.
            </h2>
            <p className="mt-5 max-w-xl text-[15px] leading-[1.95] text-muted">
              د. ديمة صيدلانية ومعلّمة محتوى صحي. جرّبت الطريق التقليدي، وبعدها بلّشت تسأل
              أسئلة أكبر: كيف أوصل المعلومة الصح لغيري؟ وكيف أستخدم التقنية بدل ما أخاف منها؟
              الأكاديمية هاي هي خلاصة هالأسئلة.
            </p>

            <ol className="relative mt-10 space-y-7 border-r border-navy/12 pr-6">
              {story.map((item) => (
                <li key={item.year} className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute -right-[30px] top-1.5 h-2 w-2 rounded-full bg-sky ring-4 ring-white"
                  />
                  <span className="text-[11.5px] font-medium tracking-wide text-sky-deep">
                    {item.year}
                  </span>
                  <h3 className="mt-1.5 font-serif text-[19px] font-bold text-navy">{item.title}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-[1.9] text-muted">{item.body}</p>
                </li>
              ))}
            </ol>

            <div className="mt-10 rounded-2xl border border-navy/10 bg-paper p-5">
              <Quote className="h-5 w-5 text-sky-deep" strokeWidth={1.8} />
              <p className="mt-2 font-serif text-[17px] leading-[1.7] text-navy">
                «ما بدي حدا يختار تخصصه ويحس إنه حبس حاله. التخصص بداية، والمسارات اللي
                حوله كتير.»
              </p>
            </div>

            <Link to="/about" className="link-arrow mt-6 text-navy">
              اقرأ القصة كاملة
              <ArrowUpLeft className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
