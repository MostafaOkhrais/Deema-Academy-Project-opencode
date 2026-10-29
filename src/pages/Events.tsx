import { Link } from 'react-router-dom';
import { CalendarDays, MapPin, PlayCircle, Users } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { Reveal } from '@/components/Reveal';
import { EventCard } from '@/components/EventCard';
import { JoinCta } from '@/components/home/JoinCta';
import { events } from '@/data/events';
import { usePageMeta } from '@/lib/seo';

export function Events() {
  usePageMeta({
    title: 'الفعاليات والورش | أكاديمية ديمة',
    description:
      'ورش ولقاءات أكاديمية ديمة: الورشة التعريفية المجانية، الذكاء الاصطناعي في الصحة، ومختبر المحتوى الطبي.',
  });

  return (
    <>
      <PageHero
        kicker="الفعاليات"
        breadcrumb={[{ label: 'الفعاليات' }]}
        title={
          <>
            ورش قصيرة،
            <br />
            <span className="text-sky">أثر طويل</span>.
          </>
        }
        lead="لقاءات أونلاين على Zoom، بمجموعات صغيرة، وتمرين عملي. مناسبة للتجربة قبل الالتزام بمسار كامل."
      />

      <section className="grid-white">
        <div className="container-page py-16 md:py-24">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-[clamp(1.5rem,2.8vw,2.1rem)]">الفعاليات القادمة</h2>
            <span className="text-[12px] text-navy/45">{events.length} فعاليات · أونلاين</span>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event, index) => (
              <Reveal key={event.slug} delay={index * 70} className="h-full">
                <EventCard event={event} index={index} />
              </Reveal>
            ))}
          </div>

          <Reveal delay={100}>
            <div className="mt-10 grid gap-4 rounded-[28px] border border-line bg-paper p-6 sm:grid-cols-3 md:p-8">
              {[
                {
                  icon: PlayCircle,
                  title: 'جلسات مسجّلة',
                  body: 'إذا فاتك لقاء، التسجيل بيوصلك خلال ٢٤ ساعة.',
                },
                {
                  icon: Users,
                  title: 'مجموعات صغيرة',
                  body: 'أماكن محدودة لضمان وقت للأسئلة والمراجعة.',
                },
                {
                  icon: CalendarDays,
                  title: 'مواعيد مسائية',
                  body: 'مصممة تناسب طالب أو موظف، بعد الدوام.',
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-3">
                  <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-sky-deep" strokeWidth={1.7} />
                  <div>
                    <p className="font-serif text-[16px] font-bold text-navy">{item.title}</p>
                    <p className="mt-1 text-[12.5px] leading-[1.8] text-muted">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
              <p className="inline-flex items-center gap-2 text-[12.5px] text-navy/55">
                <MapPin className="h-4 w-4 text-sky-deep" strokeWidth={1.7} />
                كل الفعاليات أونلاين — رابط الحضور بيوصل بعد تأكيد التسجيل.
              </p>
              <Link to="/faq" className="link-arrow text-navy">
                أسئلة عن الفعاليات
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <JoinCta />
    </>
  );
}
