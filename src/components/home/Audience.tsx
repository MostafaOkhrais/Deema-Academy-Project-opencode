import { Link } from 'react-router-dom';
import { ArrowUpLeft } from 'lucide-react';
import { audience } from '@/data/site';
import { SectionHeader } from '@/components/SectionHeader';
import { Reveal } from '@/components/Reveal';

export function Audience() {
  return (
    <section className="grid-white">
      <div className="container-page py-20 md:py-28">
        <Reveal>
          <SectionHeader
            kicker="عن الأكاديمية"
            title={
              <>
                تخصصك الصحي أكبر من <span className="text-sky-deep">وظيفة وحدة</span>.
              </>
            }
            lead="أكاديمية ديمة مساحة تعلّم عربية بتبلّش من اللي بتدرسه، وبتوسّع خياراتك بدل ما تحصرها بسلك واحد. مش بنوعدك بوظيفة — بنعلّمك تبني المهارات والأدوات اللي بتفتح أبواب."
          />
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {audience.map((item, index) => (
            <Reveal key={item.title} delay={index * 80}>
              <article className="flex h-full flex-col rounded-[26px] border border-line bg-paper/70 p-7 transition-colors duration-300 hover:border-sky-deep/40 hover:bg-white">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-navy/25 font-serif text-[15px] font-bold text-navy">
                  {`٠${index + 1}`}
                </span>
                <h3 className="mt-5 font-serif text-[21px] font-bold leading-snug text-navy">
                  {item.title}
                </h3>
                <p className="mt-3 text-[14px] leading-[1.9] text-muted">{item.body}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-10 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-6">
            <div className="max-w-xl">
              <p className="text-[13.5px] leading-relaxed text-muted">
                «التعلّم مش لحظة التخرج. هو العادة اللي بتبنيها بعدها.»
              </p>
              <span className="mt-2 block text-[12px] text-navy/45">— د. ديمة</span>
            </div>
            <Link to="/about" className="btn btn-outline btn-sm">
              اعرف قصة ديمة
              <ArrowUpLeft className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
