import { Link } from 'react-router-dom';
import { ArrowUpLeft, CircleCheck } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { Reveal } from '@/components/Reveal';
import { Principles } from '@/components/home/Principles';
import { JoinCta } from '@/components/home/JoinCta';
import { audience, story } from '@/data/site';
import { usePageMeta } from '@/lib/seo';

export function About() {
  usePageMeta({
    title: 'عن ديمة | أكاديمية ديمة',
    description:
      'قصة د. ديمة: صيدلانية ومعلّمة محتوى صحي، ورؤية أكاديمية ديمة لتوسيع المسارات المهنية في التخصصات الصحية.',
  });

  return (
    <>
      <PageHero
        kicker="عن الأكاديمية"
        breadcrumb={[{ label: 'عن ديمة' }]}
        title={
          <>
            تخصصك بداية،
            <br />
            مش <span className="text-sky">نهاية</span> القصة.
          </>
        }
        lead="أكاديمية ديمة مساحة تعلّم عربية بتربط العلوم الصحية بالمهارات اللي بتفرق فعلاً في السوق: تفكير سريري، أدوات رقمية، بحث، ومحتوى. من دون وعود فارغة."
      />

      <section className="grid-white">
        <div className="container-page py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <Reveal>
              <span className="kicker">الرؤية</span>
              <h2 className="mt-4 text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[1.32]">
                كل ممارس صحي قادر يبني
                <br />
                <span className="text-sky-deep">مسار مهني هو اختاره</span>.
              </h2>
              <div className="prose-ar mt-5 max-w-xl">
                <p>
                  في فجوة بين اللي بتدرسه بالجامعة واللي بيحتاجه سوق العمل. مش لأن الجامعة
                  غلط، بس لأن المهن الصحية اتوسّعت: صحة رقمية، محتوى علمي، بحث، تعليم،
                  وإدارة مشاريع.
                </p>
                <p>
                  أكاديمية ديمة بتحاول تسدّ هاي الفجوة بمسارات قصيرة وعملية، بتعلّمك مهارة
                  بتستخدمها، وبتوريك كيف تربطها بتخصصك.
                </p>
              </div>

              <ul className="mt-7 space-y-3">
                {[
                  'محتوى عربي مبني على مصادر، مش ترجمة سريعة',
                  'تطبيق عملي ومشروع في كل مسار',
                  'أدوات رقمية وذكاء اصطناعي بحدود أخلاقية واضحة',
                  'احترام وقتك: جلسات مسائية ومحتوى قابل للرجوع',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[14px] leading-relaxed text-navy/80">
                    <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-sky-deep" strokeWidth={2} />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={100}>
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="absolute -bottom-4 -left-4 h-28 w-28 rounded-[26px] bg-sky"
                />
                <div className="relative overflow-hidden rounded-[30px] border border-line bg-navy-deep">
                  <img
                    src="/brand/hero.webp"
                    alt="د. ديمة، صيدلانية ومعلّمة محتوى صحي"
                    width={678}
                    height={638}
                    className="aspect-[5/4.2] w-full object-cover object-[50%_30%]"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy via-navy/60 to-transparent px-5 pb-5 pt-20">
                    <p className="font-serif text-[18px] font-bold text-white">د. ديمة</p>
                    <p className="mt-0.5 text-[11.5px] text-white/60">
                      صيدلانية · معلّمة محتوى صحي
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-[11.5px] leading-relaxed text-navy/45">
                  من الصيدلة إلى تعليم المحتوى الصحي — قصة واحدة، ومسارات كثيرة.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="grid-paper">
        <div className="container-page py-20 md:py-24">
          <Reveal>
            <span className="kicker">القصة</span>
            <h2 className="mt-4 max-w-2xl text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[1.32]">
              من صيدلة الجامعة إلى <span className="text-sky-deep">التعلّم الصحي</span>.
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {story.map((item, index) => (
              <Reveal key={item.year} delay={index * 70} className="h-full">
                <article className="flex h-full flex-col rounded-[24px] border border-navy/10 bg-white p-6">
                  <span className="font-serif text-[13px] font-bold text-sky-deep">{item.year}</span>
                  <h3 className="mt-3 font-serif text-[18px] font-bold leading-snug text-navy">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-[1.9] text-muted">{item.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="grid-white">
        <div className="container-page py-20 md:py-24">
          <Reveal>
            <span className="kicker">لمين؟</span>
            <h2 className="mt-4 text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[1.32]">
              الأكاديمية لكل من حسّ إن الخيارات <span className="text-sky-deep">أضيق من طموحه</span>.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {audience.map((item, index) => (
              <Reveal key={item.title} delay={index * 70} className="h-full">
                <div className="flex h-full flex-col rounded-[24px] border border-line bg-paper/70 p-6">
                  <span className="font-serif text-[12px] font-bold text-sky-deep">
                    {`٠${index + 1}`}
                  </span>
                  <h3 className="mt-3 font-serif text-[20px] font-bold text-navy">{item.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-[1.9] text-muted">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={150}>
            <div className="mt-10 flex flex-col gap-4 rounded-[26px] border border-navy/12 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[14px] leading-relaxed text-navy/70">
                إذا حبيت تعرف إذا الأكاديمية بتناسبك، ابدأ بالورشة المجانية قبل أي قرار.
              </p>
              <Link to="/events/free-intro-workshop" className="btn btn-navy shrink-0">
                سجّل بالورشة
                <ArrowUpLeft className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Principles />
      <JoinCta />
    </>
  );
}
