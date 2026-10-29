import { Link, useParams } from 'react-router-dom';
import { ArrowUpLeft, CircleCheck, Clock, Layers, MonitorPlay } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { Reveal } from '@/components/Reveal';
import { TrackGlyph } from '@/components/TrackGlyph';
import { TrackCard } from '@/components/TrackCard';
import { JoinCta } from '@/components/home/JoinCta';
import { getTrack, tracks } from '@/data/tracks';
import { site } from '@/data/site';
import { usePageMeta } from '@/lib/seo';
import { NotFound } from './NotFound';

export function TrackDetail() {
  const { slug } = useParams();
  const track = getTrack(slug);

  usePageMeta({
    title: track ? `${track.title} | أكاديمية ديمة` : 'المسار غير موجود | أكاديمية ديمة',
    description: track?.description,
  });

  if (!track) return <NotFound />;

  const related = tracks.filter((item) => item.slug !== track.slug).slice(0, 2);

  return (
    <>
      <PageHero
        kicker={`المسار ${track.index}`}
        breadcrumb={[{ label: 'المسارات', to: '/tracks' }, { label: track.short }]}
        title={track.title}
        lead={track.tagline}
      >
        <div className="flex flex-wrap gap-2 text-[12px]">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3.5 py-2 text-white/70">
            <MonitorPlay className="h-4 w-4 text-sky" strokeWidth={1.7} />
            {track.format}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3.5 py-2 text-white/70">
            <Clock className="h-4 w-4 text-sky" strokeWidth={1.7} />
            {track.duration}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3.5 py-2 text-white/70">
            <Layers className="h-4 w-4 text-sky" strokeWidth={1.7} />
            {track.level}
          </span>
        </div>
      </PageHero>

      <section className="grid-white">
        <div className="container-page py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div>
              <Reveal>
                <span className="kicker">عن المسار</span>
                <p className="mt-4 max-w-2xl text-[16px] leading-[2] text-navy/75">
                  {track.description}
                </p>
              </Reveal>

              <Reveal delay={60}>
                <h2 className="mt-12 text-[clamp(1.5rem,2.6vw,1.95rem)]">شو بتطلع به</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {track.outcomes.map((outcome) => (
                    <li
                      key={outcome}
                      className="flex items-start gap-2.5 rounded-2xl border border-line bg-paper/60 p-4 text-[13.5px] leading-[1.8] text-navy/80"
                    >
                      <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-sky-deep" strokeWidth={2} />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={100}>
                <h2 className="mt-12 text-[clamp(1.5rem,2.6vw,1.95rem)]">محتوى المسار</h2>
                <ol className="mt-5 divide-y divide-line border-y border-line">
                  {track.curriculum.map((module, index) => (
                    <li key={module.title} className="flex gap-4 py-5">
                      <span className="mt-0.5 w-8 shrink-0 font-serif text-[13px] font-bold text-sky-deep">
                        {`٠${index + 1}`}
                      </span>
                      <div>
                        <h3 className="font-serif text-[17px] font-bold text-navy">{module.title}</h3>
                        <p className="mt-1 text-[13px] leading-[1.85] text-muted">{module.detail}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </Reveal>

              <Reveal delay={140}>
                <h2 className="mt-12 text-[clamp(1.5rem,2.6vw,1.95rem)]">لمين بيناسب</h2>
                <ul className="mt-4 space-y-2.5">
                  {track.forWho.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[14px] leading-relaxed text-navy/75">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-deep" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={160}>
                <div className="mt-10 rounded-2xl border border-navy/10 bg-paper p-5 text-[12.5px] leading-[1.9] text-navy/60">
                  المواعيد والرسوم وشروط الشهادة بتُعلن لكل دفعة على حدة قبل فتح التسجيل.
                  ما منوعد بشي قبل ما يكون موثّق على صفحة البرنامج.
                </div>
              </Reveal>
            </div>

            <Reveal delay={120}>
              <aside className="lg:sticky lg:top-28">
                <div className="rounded-[28px] border border-line bg-white p-6">
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-navy text-sky">
                      <TrackGlyph icon={track.icon} />
                    </span>
                    <div>
                      <p className="text-[11px] text-navy/40">المسار {track.index}</p>
                      <p className="mt-0.5 font-serif text-[16px] font-bold text-navy">
                        {track.short}
                      </p>
                    </div>
                  </div>

                  <dl className="mt-6 space-y-3 border-t border-line pt-5 text-[13px]">
                    <div className="flex justify-between gap-4">
                      <dt className="text-navy/45">الصيغة</dt>
                      <dd className="text-left font-medium text-navy">{track.format}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-navy/45">المدة</dt>
                      <dd className="text-left font-medium text-navy">{track.duration}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-navy/45">المستوى</dt>
                      <dd className="text-left font-medium text-navy">{track.level}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-navy/45">اللغة</dt>
                      <dd className="text-left font-medium text-navy">العربية</dd>
                    </div>
                  </dl>

                  <Link to={`/join?track=${track.slug}`} className="btn btn-navy mt-6 w-full">
                    سجّل اهتمامك بالمسار
                    <ArrowUpLeft className="h-4 w-4" />
                  </Link>
                  <a
                    href={`mailto:${site.email}?subject=${encodeURIComponent(`سؤال عن مسار ${track.short}`)}`}
                    className="btn btn-outline mt-2 w-full"
                  >
                    اسأل عن المسار
                  </a>
                  <p className="mt-4 text-center text-[11px] text-navy/40">
                    التسجيل مش مفتوح؟ بنحفظ اهتمامك وبخبرك أول ما يفتح.
                  </p>
                </div>

                <div className="mt-4 rounded-[24px] border border-line bg-paper p-5">
                  <p className="font-serif text-[15px] font-bold text-navy">مش متأكد من اختيارك؟</p>
                  <p className="mt-2 text-[12.5px] leading-[1.85] text-muted">
                    ابدأ بالورشة المجانية. بتشوف الأسلوب والمسارات، وبتقرر بعدها.
                  </p>
                  <Link to="/events/free-intro-workshop" className="link-arrow mt-3 text-navy">
                    الورشة المجانية
                    <ArrowUpLeft className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </aside>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="grid-paper">
        <div className="container-page py-16 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-[clamp(1.5rem,2.6vw,1.95rem)]">مسارات تانية ممكن تعجبك</h2>
            <Link to="/tracks" className="link-arrow text-navy">
              كل المسارات
              <ArrowUpLeft className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {related.map((item, index) => (
              <Reveal key={item.slug} delay={index * 70} className="h-full">
                <TrackCard track={item} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <JoinCta />
    </>
  );
}
