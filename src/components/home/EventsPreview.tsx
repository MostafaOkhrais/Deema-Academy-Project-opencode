import { Link } from 'react-router-dom';
import { ArrowUpLeft } from 'lucide-react';
import { events } from '@/data/events';
import { SectionHeader } from '@/components/SectionHeader';
import { Reveal } from '@/components/Reveal';
import { EventCard } from '@/components/EventCard';

export function EventsPreview() {
  return (
    <section className="grid-paper">
      <div className="container-page py-20 md:py-28">
        <Reveal>
          <SectionHeader
            kicker="الفعاليات"
            title={
              <>
                أقرب شي إلك، <span className="text-sky-deep">ابدأ منه</span>.
              </>
            }
            lead="ورش ولقاءات قصيرة، أونلاين، بدون التزام طويل. سجّل اهتمامك وبخبرك أول ما يفتح التسجيل."
            action={
              <Link to="/events" className="btn btn-outline btn-sm">
                كل الفعاليات
                <ArrowUpLeft className="h-3.5 w-3.5" />
              </Link>
            }
          />
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event, index) => (
            <Reveal key={event.slug} delay={index * 80} className="h-full">
              <EventCard event={event} index={index} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
