import { Link } from 'react-router-dom';
import { ArrowUpLeft } from 'lucide-react';
import type { Track } from '@/data/types';
import { TrackGlyph } from '@/components/TrackGlyph';
import { cn } from '@/lib/utils';

export function TrackCard({ track, featured = false }: { track: Track; featured?: boolean }) {
  return (
    <Link
      to={`/tracks/${track.slug}`}
      className={cn(
        'group flex h-full flex-col rounded-[28px] border p-7 transition-all duration-300',
        featured
          ? 'grid-navy border-white/10 text-white hover:border-sky/40 md:p-9'
          : 'border-line bg-white text-navy hover:border-navy/30 hover:shadow-[0_24px_50px_-40px_rgba(0,33,71,0.5)]',
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className={cn(
            'grid h-11 w-11 place-items-center rounded-full border',
            featured ? 'border-sky/35 text-sky' : 'border-navy/15 text-navy/75',
          )}
        >
          <TrackGlyph icon={track.icon} className="h-5 w-5" />
        </span>
        <span className={cn('text-[12px]', featured ? 'text-sky/60' : 'text-navy/35')}>
          المسار {track.index}
        </span>
      </div>

      <div className={cn(featured && 'md:grid md:grid-cols-[1.2fr_0.8fr] md:gap-9')}>
        <div>
          <h3
            className={cn(
              'mt-6 font-serif font-black leading-[1.3]',
              featured ? 'text-[clamp(1.6rem,3vw,2.2rem)]' : 'text-[21px]',
            )}
          >
            {track.title}
          </h3>
          <p
            className={cn(
              'mt-2 font-serif text-[15px] font-medium leading-relaxed',
              featured ? 'text-sky' : 'text-sky-deep',
            )}
          >
            {track.tagline}
          </p>
          <p
            className={cn(
              'mt-3 text-[13.5px] leading-[1.9]',
              featured ? 'text-white/60' : 'text-muted',
            )}
          >
            {track.description}
          </p>
        </div>

        <div className={cn('mt-6 flex flex-col justify-end', featured && 'md:mt-0')}>
          <dl
            className={cn(
              'space-y-2 border-t pt-4 text-[12px]',
              featured ? 'border-white/12' : 'border-line',
            )}
          >
            <div className="flex justify-between gap-4">
              <dt className={featured ? 'text-white/40' : 'text-navy/40'}>الصيغة</dt>
              <dd className={featured ? 'text-white/80' : 'text-navy/80'}>{track.format}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className={featured ? 'text-white/40' : 'text-navy/40'}>المدة</dt>
              <dd className={featured ? 'text-white/80' : 'text-navy/80'}>{track.duration}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className={featured ? 'text-white/40' : 'text-navy/40'}>المستوى</dt>
              <dd className={featured ? 'text-white/80' : 'text-navy/80'}>{track.level}</dd>
            </div>
          </dl>

          <span
            className={cn(
              'mt-5 inline-flex items-center gap-2 text-[13px] font-medium',
              featured ? 'text-sky' : 'text-navy',
            )}
          >
            تفاصيل المسار
            <ArrowUpLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
