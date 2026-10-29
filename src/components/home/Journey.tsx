import { Link } from 'react-router-dom';
import { ArrowUpLeft } from 'lucide-react';
import { journey } from '@/data/site';
import { SectionHeader } from '@/components/SectionHeader';
import { Reveal } from '@/components/Reveal';

export function Journey() {
  return (
    <section className="grid-sky text-navy">
      <div className="container-page py-20 md:py-24">
        <Reveal>
          <div>
            <SectionHeader
              kicker="كيف بتبلّش؟"
              tone="sky"
              title={
                <>
                  ثلاث خطوات،{' '}
                  <span className="inline-block -rotate-1 rounded-xl bg-navy px-3 pb-1.5 leading-[1.35] text-white">
                    وإنت جوّا
                  </span>
                  .
                </>
              }
              lead="ما في اختبار قبول ولا التزام طويل. ابدأ بالتعرّف علينا، وبعدها قرّر إنت وين بدك تروح."
            />
          </div>
        </Reveal>

        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {journey.map((item, index) => (
            <Reveal key={item.step} delay={index * 80} className="h-full">
              <li className="flex h-full flex-col rounded-[26px] bg-white/85 p-7 backdrop-blur-sm">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-navy/25 font-serif text-[14px] font-bold text-navy">
                  {item.step}
                </span>
                <h3 className="mt-6 font-serif text-[22px] font-bold text-navy">{item.title}</h3>
                <p className="mt-2.5 text-[13.5px] leading-[1.9] text-navy/65">{item.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={200}>
          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Link to="/events/free-intro-workshop" className="btn btn-navy">
              احجز مقعدك بالورشة المجانية
              <ArrowUpLeft className="h-4 w-4" />
            </Link>
            <Link to="/faq" className="link-arrow text-navy/75">
              عندك سؤال؟ الأسئلة الشائعة
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
