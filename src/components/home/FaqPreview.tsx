import { Link } from 'react-router-dom';
import { ArrowUpLeft, MessagesSquare } from 'lucide-react';
import { faqs } from '@/data/faqs';
import { site } from '@/data/site';
import { SectionHeader } from '@/components/SectionHeader';
import { Reveal } from '@/components/Reveal';
import { Accordion } from '@/components/Accordion';

export function FaqPreview() {
  return (
    <section className="grid-paper">
      <div className="container-page py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          <Reveal>
            <SectionHeader
              kicker="الأسئلة الشائعة"
              title={
                <>
                  عندك سؤال؟
                  <br />
                  <span className="text-sky-deep">أكيد في جواب.</span>
                </>
              }
              lead="جمعنا أكثر الأسئلة اللي بتوصلنا عن التسجيل، المواعيد، الشهادات، والرسوم."
            />

            <div className="mt-8 rounded-[24px] border border-navy/12 bg-white p-6">
              <span className="grid h-10 w-10 place-items-center rounded-full border border-navy/15 text-navy">
                <MessagesSquare className="h-5 w-5" strokeWidth={1.7} />
              </span>
              <h3 className="mt-4 font-serif text-[19px] font-bold text-navy">ما لقيت جوابك؟</h3>
              <p className="mt-2 text-[13px] leading-[1.85] text-muted">
                ابعتلنا سؤالك وبنرد عليك شخصياً. إذا في شي مش واضح، منفضّل نحكيه.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <a href={`mailto:${site.email}`} className="btn btn-navy btn-sm">
                  ابعت رسالة
                </a>
                <Link to="/faq" className="btn btn-outline btn-sm">
                  كل الأسئلة
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <Accordion
              items={faqs.slice(0, 5).map((item) => ({
                q: item.q,
                a: item.a,
                tag: item.category,
              }))}
            />
            <Link to="/faq" className="link-arrow mt-6 text-navy">
              شوف كل الأسئلة
              <ArrowUpLeft className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
