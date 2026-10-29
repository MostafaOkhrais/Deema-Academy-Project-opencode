import { PageHero } from '@/components/PageHero';
import { Reveal } from '@/components/Reveal';
import { TrackCard } from '@/components/TrackCard';
import { JoinCta } from '@/components/home/JoinCta';
import { tracks } from '@/data/tracks';
import { usePageMeta } from '@/lib/seo';

export function Tracks() {
  usePageMeta({
    title: 'المسارات | أكاديمية ديمة',
    description:
      'خمسة مسارات في أكاديمية ديمة: الصيدلة السريرية، الذكاء الاصطناعي والصحة الرقمية، المحتوى الطبي، البحث العلمي، والهوية المهنية.',
  });

  return (
    <>
      <PageHero
        kicker="المسارات"
        breadcrumb={[{ label: 'المسارات' }]}
        title={
          <>
            اختر المسار اللي
            <br />
            بيفتح لك <span className="text-sky">باب</span> جديد.
          </>
        }
        lead="خمسة مسارات مبنية على مهارات قابلة للاستخدام. كل مسار فيه محتوى، جلسات، وتمرين عملي — والمدة والمستوى مذكورين بوضوح قبل ما تسجّل."
      />

      <section className="grid-white">
        <div className="container-page py-16 md:py-24">
          <div className="grid gap-5 md:grid-cols-2">
            {tracks.map((track, index) => (
              <Reveal
                key={track.slug}
                delay={index * 60}
                className={`h-full ${index === 0 ? 'md:col-span-2' : ''}`}
              >
                <TrackCard track={track} featured={index === 0} />
              </Reveal>
            ))}
          </div>

          <Reveal delay={100}>
            <div className="mt-10 rounded-[24px] border border-navy/10 bg-paper p-6 text-[13px] leading-[1.9] text-navy/60">
              <strong className="font-medium text-navy">ملاحظة:</strong> المواعيد والرسوم
              بتُعلن مع كل دفعة على صفحة المسار. إذا في مسار مش فاتح للتسجيل حالياً، سجّل
              اهتمامك وبخبرك أول ما يفتح.
            </div>
          </Reveal>
        </div>
      </section>

      <JoinCta />
    </>
  );
}
