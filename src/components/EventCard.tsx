import { Link } from 'react-router-dom';
import { ArrowUpLeft, CalendarDays, MapPin, Users } from 'lucide-react';
import type { AcademyEvent } from '@/data/types';
import { cn } from '@/lib/utils';

const posters = [
  'grid-sky text-navy',
  'grid-navy text-white',
  'bg-paper text-navy border-b border-line',
];

export function EventCard({ event, index = 0 }: { event: AcademyEvent; index?: number }) {
  const poster = posters[index % posters.length];
  const dark = index % posters.length === 1;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-line bg-white transition-shadow duration-300 hover:shadow-[0_28px_60px_-40px_rgba(0,33,71,0.55)]">
      <div className={cn('relative flex min-h-[230px] flex-col justify-between overflow-hidden p-6', poster)}>
        <div className="flex items-start justify-between gap-3">
          <span className={cn('tag', dark ? 'bg-sky text-navy' : 'bg-navy text-white')}>{event.type}</span>
          <span
            className={cn(
              'rounded-full border px-3 py-1 text-[11px]',
              dark ? 'border-white/25 text-white/70' : 'border-navy/15 text-navy/70',
            )}
          >
            {event.mode}
          </span>
        </div>

        <h3 className="relative z-10 mt-8 max-w-[16ch] font-serif text-[clamp(1.45rem,2.2vw,1.85rem)] leading-[1.35]">
          {event.title}
        </h3>

        <div
          className={cn(
            'relative z-10 mt-6 flex items-center gap-2 text-[12.5px]',
            dark ? 'text-sky' : 'text-navy/65',
          )}
        >
          <CalendarDays className="h-4 w-4" strokeWidth={1.7} />
          {event.dateLabel}
        </div>

        <div
          aria-hidden="true"
          className={cn(
            'absolute -left-8 -top-10 h-40 w-40 rounded-full border',
            dark ? 'border-white/10' : 'border-navy/10',
          )}
        />
        <div
          aria-hidden="true"
          className={cn(
            'absolute -left-2 -top-2 h-24 w-24 rounded-full',
            dark ? 'bg-white/[0.04]' : 'bg-navy/[0.04]',
          )}
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-[14px] leading-[1.85] text-muted">{event.summary}</p>

        <dl className="mt-5 space-y-2.5 text-[12.5px] text-navy/70">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-sky-deep" strokeWidth={1.7} />
            <dt className="sr-only">المكان</dt>
            <dd>{event.location}</dd>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-sky-deep" strokeWidth={1.7} />
            <dt className="sr-only">المقاعد</dt>
            <dd>{event.seatsLabel}</dd>
          </div>
        </dl>

        <div className="mt-auto pt-6">
          <Link
            to={`/events/${event.slug}`}
            className="link-arrow text-navy"
            aria-label={`تفاصيل ${event.title}`}
          >
            التفاصيل والتسجيل
            <ArrowUpLeft className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
