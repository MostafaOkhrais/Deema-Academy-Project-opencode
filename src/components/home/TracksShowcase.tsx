import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpLeft, Check } from 'lucide-react';
import { tracks } from '@/data/tracks';
import { SectionHeader } from '@/components/SectionHeader';
import { Reveal } from '@/components/Reveal';
import { TrackGlyph } from '@/components/TrackGlyph';
import { cn } from '@/lib/utils';

export function TracksShowcase() {
  const [active, setActive] = useState(tracks[0].slug);
  const track = tracks.find((t) => t.slug === active) ?? tracks[0];

  return (
    <section className="grid-white">
      <div className="container-page py-20 md:py-28">
        <Reveal>
          <SectionHeader
            kicker="المسارات"
            title={
              <>
                خمس مسارات، وبداية وحدة <span className="text-sky-deep">بتختارها إنت</span>.
              </>
            }
            lead="كل مسار مبني حول مهارة بتقدر تستخدمها بعد ما تخلصه. اضغط على أي مسار وشوف شو بتطلع به، ولمين بيناسب."
            action={
              <Link to="/tracks" className="btn btn-outline btn-sm">
                كل المسارات
                <ArrowUpLeft className="h-3.5 w-3.5" />
              </Link>
            }
          />
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
          <div
            role="tablist"
            aria-label="المسارات"
            aria-orientation="vertical"
            className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {tracks.map((item) => {
              const selected = item.slug === active;
              return (
                <button
                  key={item.slug}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`track-panel-${item.slug}`}
                  id={`track-tab-${item.slug}`}
                  onClick={() => setActive(item.slug)}
                  className={cn(
                    'group flex shrink-0 items-center gap-4 rounded-2xl border px-4 py-4 text-right transition-all duration-300 lg:w-full lg:px-5',
                    selected
                      ? 'border-navy bg-navy text-white'
                      : 'border-line bg-white text-navy hover:border-navy/30',
                  )}
                >
                  <span
                    className={cn(
                      'grid h-10 w-10 shrink-0 place-items-center rounded-full border',
                      selected ? 'border-sky/40 bg-sky/10 text-sky' : 'border-navy/15 text-navy/70',
                    )}
                  >
                    <TrackGlyph icon={item.icon} className="h-[18px] w-[18px]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        'block text-[10.5px]',
                        selected ? 'text-sky/70' : 'text-navy/40',
                      )}
                    >
                      المسار {item.index}
                    </span>
                    <span className="mt-0.5 block whitespace-nowrap font-serif text-[16px] font-bold leading-snug lg:whitespace-normal">
                      {item.short}
                    </span>
                  </span>
                  <ArrowLeft
                    className={cn(
                      'hidden h-4 w-4 shrink-0 transition-transform lg:block',
                      selected ? 'text-sky' : 'text-navy/25',
                    )}
                  />
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id={`track-panel-${track.slug}`}
            aria-labelledby={`track-tab-${track.slug}`}
            className="relative overflow-hidden rounded-[30px] border border-line bg-paper p-7 md:p-10"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -left-4 -top-10 select-none font-serif text-[170px] font-black leading-none text-navy/[0.045]"
            >
              {track.index}
            </span>

            <div key={track.slug} className="relative animate-[panel-in_.4s_ease]">
              <div className="flex items-start justify-between gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-navy text-sky">
                  <TrackGlyph icon={track.icon} />
                </span>
                <span className="tag">{track.level}</span>
              </div>

              <h3 className="mt-6 font-serif text-[clamp(1.5rem,3vw,2.15rem)] font-black leading-[1.3] text-navy">
                {track.title}
              </h3>
              <p className="mt-2 font-serif text-[17px] font-medium text-sky-deep">
                {track.tagline}
              </p>
              <p className="mt-4 text-[14px] leading-[1.95] text-muted">{track.description}</p>

              <ul className="mt-6 space-y-2.5">
                {track.outcomes.slice(0, 3).map((outcome) => (
                  <li key={outcome} className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-navy/80">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-sky-deep" strokeWidth={2.2} />
                    {outcome}
                  </li>
                ))}
              </ul>

              <div className="mt-7 grid gap-3 border-t border-navy/10 pt-5 text-[12px] sm:grid-cols-3">
                <div>
                  <span className="block text-navy/40">الصيغة</span>
                  <span className="mt-1 block font-medium text-navy">{track.format}</span>
                </div>
                <div>
                  <span className="block text-navy/40">المدة</span>
                  <span className="mt-1 block font-medium text-navy">{track.duration}</span>
                </div>
                <div>
                  <span className="block text-navy/40">المستوى</span>
                  <span className="mt-1 block font-medium text-navy">{track.level}</span>
                </div>
              </div>

              <Link to={`/tracks/${track.slug}`} className="btn btn-navy mt-7">
                تفاصيل المسار
                <ArrowUpLeft className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
