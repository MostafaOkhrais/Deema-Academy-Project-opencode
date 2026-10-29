import { principles } from '@/data/site';
import { SectionHeader } from '@/components/SectionHeader';
import { Reveal } from '@/components/Reveal';

export function Principles() {
  return (
    <section className="grid-paper">
      <div className="container-page py-20 md:py-28">
        <Reveal>
          <SectionHeader
            kicker="مبادئنا"
            title={
              <>
                ست قواعد بتحكم <span className="text-sky-deep">كل شي</span> منعمله.
              </>
            }
            lead="مش شعارات على الحيط. هدول المبادئ اللي بنرجع إلها لما نختار محتوى، أو نرفض فكرة، أو نصحّح معلومة."
          />
        </Reveal>

        <div className="mt-12 grid gap-x-12 gap-y-0 md:grid-cols-2">
          {principles.map((item, index) => (
            <Reveal key={item.title} delay={(index % 2) * 70}>
              <article className="flex gap-4 border-t border-navy/15 py-6">
                <span className="mt-1 w-7 shrink-0 font-serif text-[13px] font-bold text-sky-deep">
                  {`٠${index + 1}`}
                </span>
                <div>
                  <h3 className="font-serif text-[20px] font-bold leading-snug text-navy">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-[1.9] text-muted">{item.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
