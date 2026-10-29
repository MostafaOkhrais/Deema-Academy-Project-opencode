import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowUpLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
  MonitorPlay,
  Users,
} from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { Reveal } from '@/components/Reveal';
import { getEvent } from '@/data/events';
import { registerInterest } from '@/lib/events';
import { usePageMeta } from '@/lib/seo';
import { NotFound } from './NotFound';

const schema = z.object({
  full_name: z.string().min(3, 'اكتب اسمك الكامل'),
  email: z.string().email('الإيميل مش صحيح'),
  phone: z.string().min(8, 'رقم الجوال مش صحيح'),
  university_id: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function EventDetail() {
  const { slug } = useParams();
  const event = getEvent(slug);
  const [sent, setSent] = useState(false);
  const [demo, setDemo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  usePageMeta({
    title: event ? `${event.title} | أكاديمية ديمة` : 'الفعالية غير موجودة | أكاديمية ديمة',
    description: event?.summary,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  if (!event) return <NotFound />;

  const onSubmit = async (values: FormValues) => {
    setError(null);
    const result = await registerInterest({
      event_slug: event.slug,
      event_title: event.title,
      full_name: values.full_name,
      email: values.email,
      phone: values.phone,
      university_id: values.university_id,
    });

    if (result.ok) {
      setSent(true);
      setDemo(result.demo);
      return;
    }
    setError(result.message);
  };

  return (
    <>
      <PageHero
        kicker={event.type}
        breadcrumb={[{ label: 'الفعاليات', to: '/events' }, { label: event.type }]}
        title={event.title}
        lead={event.summary}
      >
        <div className="flex flex-wrap gap-2 text-[12px]">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3.5 py-2 text-white/70">
            <CalendarDays className="h-4 w-4 text-sky" strokeWidth={1.7} />
            {event.dateLabel}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3.5 py-2 text-white/70">
            <MonitorPlay className="h-4 w-4 text-sky" strokeWidth={1.7} />
            {event.mode}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3.5 py-2 text-white/70">
            <Users className="h-4 w-4 text-sky" strokeWidth={1.7} />
            {event.seatsLabel}
          </span>
        </div>
      </PageHero>

      <section className="grid-white">
        <div className="container-page py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div>
              <Reveal>
                <span className="kicker">عن الفعالية</span>
                <p className="mt-4 max-w-2xl text-[15.5px] leading-[2] text-navy/75">
                  {event.description}
                </p>
              </Reveal>

              <Reveal delay={70}>
                <h2 className="mt-10 text-[clamp(1.4rem,2.4vw,1.8rem)]">شو بتطلع به</h2>
                <ul className="mt-4 space-y-3">
                  {[
                    'صورة أوضح عن المسارات والخيارات المتاحة بعد تخصصك',
                    'تمرين أو نقاش عملي بتشارك فيه، مش متابعة فقط',
                    'خطوة تالية محددة تنفّذها بعد اللقاء',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[14px] leading-[1.85] text-navy/75">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-deep" strokeWidth={2} />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={110}>
                <h2 className="mt-10 text-[clamp(1.4rem,2.4vw,1.8rem)]">لمين مناسبة</h2>
                <p className="mt-3 max-w-2xl text-[14px] leading-[1.95] text-muted">
                  لكل من هو بتخصص صحي أو قريب منه: طلاب من كل السنوات، خريجون جدد،
                  وممارسون بدهم يوسّعوا خياراتهم. ما بتطلب خبرة سابقة.
                </p>
              </Reveal>

              <Reveal delay={140}>
                <div className="mt-10 rounded-[24px] border border-navy/10 bg-paper p-6">
                  <p className="font-serif text-[17px] font-bold text-navy">قبل ما تسجّل</p>
                  <ul className="mt-3 space-y-2 text-[13px] leading-[1.85] text-navy/65">
                    <li>• التسجيل مجاني، والأماكن محدودة حسب نوع الفعالية.</li>
                    <li>• رابط Zoom بيوصل بعد تأكيد التسجيل، قبل الموعد بيوم على الأقل.</li>
                    <li>• إذا تغيّر الموعد، بينزل إعلان على صفحة الفعالية وإنستغرام.</li>
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={160}>
                <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-5 text-[12.5px] text-navy/55">
                  <span>شارك الفعالية:</span>
                  <a
                    className="rounded-full border border-navy/15 px-3 py-1.5 text-navy/70 transition-colors hover:border-navy/35"
                    href={`https://wa.me/?text=${encodeURIComponent(`${event.title} — أكاديمية ديمة`)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    واتساب
                  </a>
                  <a
                    className="rounded-full border border-navy/15 px-3 py-1.5 text-navy/70 transition-colors hover:border-navy/35"
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${event.title} — أكاديمية ديمة`)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    X
                  </a>
                  <Link to="/events" className="link-arrow ms-auto text-navy">
                    كل الفعاليات
                    <ArrowUpLeft className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </Reveal>
            </div>

            <Reveal delay={120}>
              <aside className="lg:sticky lg:top-28">
                <div className="rounded-[28px] border border-line bg-white p-6">
                  <p className="text-[11px] font-medium text-sky-deep">التسجيل</p>
                  <h2 className="mt-1 font-serif text-[22px] font-bold text-navy">
                    {event.status === 'open' ? 'احجز مقعدك' : 'سجّل اهتمامك'}
                  </h2>
                  <p className="mt-2 text-[12.5px] leading-[1.8] text-muted">
                    {event.status === 'open'
                      ? 'بعد التسجيل بتوصلك رسالة تأكيد ورابط الحضور.'
                      : 'التسجيل لسا ما فتح. سجّل اهتمامك وبخبرك أول ما تفتح الأماكن.'}
                  </p>

                  {sent ? (
                    <div className="mt-5 rounded-2xl border border-sky-deep/25 bg-sky/10 p-5 text-center">
                      <CheckCircle2 className="mx-auto h-8 w-8 text-sky-deep" strokeWidth={1.8} />
                      <p className="mt-3 font-serif text-[17px] font-bold text-navy">
                        وصلنا اهتمامك
                      </p>
                      <p className="mt-1.5 text-[12.5px] leading-[1.8] text-navy/65">
                        بنتواصل معك على الإيميل أول ما يفتح التسجيل.
                      </p>
                      {demo && (
                        <p className="mt-3 rounded-xl bg-white/70 px-3 py-2 text-[11px] leading-relaxed text-navy/50">
                          وضع تجريبي: الطلب محفوظ على جهازك فقط لحين ربط قاعدة البيانات.
                        </p>
                      )}
                      <Link to="/events" className="btn btn-outline btn-sm mt-4">
                        فعاليات تانية
                      </Link>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-3.5" noValidate>
                      <div>
                        <label className="field-label" htmlFor="full_name">
                          الاسم الكامل
                        </label>
                        <input
                          id="full_name"
                          className="field"
                          placeholder="مثال: أحمد محمد"
                          autoComplete="name"
                          {...register('full_name')}
                        />
                        {errors.full_name && (
                          <p className="mt-1.5 text-[11.5px] text-red-700">{errors.full_name.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="field-label" htmlFor="email">
                          الإيميل
                        </label>
                        <input
                          id="email"
                          type="email"
                          dir="ltr"
                          className="field text-left"
                          placeholder="name@example.com"
                          autoComplete="email"
                          {...register('email')}
                        />
                        {errors.email && (
                          <p className="mt-1.5 text-[11.5px] text-red-700">{errors.email.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="field-label" htmlFor="phone">
                          رقم الجوال (واتساب)
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          dir="ltr"
                          className="field text-left"
                          placeholder="0590000000"
                          autoComplete="tel"
                          {...register('phone')}
                        />
                        {errors.phone && (
                          <p className="mt-1.5 text-[11.5px] text-red-700">{errors.phone.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="field-label" htmlFor="university_id">
                          الرقم الجامعي <span className="text-navy/35">(اختياري)</span>
                        </label>
                        <input
                          id="university_id"
                          dir="ltr"
                          className="field text-left"
                          placeholder="120220145"
                          {...register('university_id')}
                        />
                      </div>

                      {error && (
                        <p className="rounded-xl bg-red-50 px-3 py-2 text-[12px] text-red-700">{error}</p>
                      )}

                      <button type="submit" className="btn btn-navy w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'عمّ نسجّل...' : 'سجّل اهتمامي'}
                        {!isSubmitting && <ArrowUpLeft className="h-4 w-4" />}
                      </button>
                      <p className="text-center text-[10.5px] leading-relaxed text-navy/40">
                        بنستخدم بياناتك للتواصل بخصوص هالفعالية فقط.
                      </p>
                    </form>
                  )}

                  <dl className="mt-6 space-y-3 border-t border-line pt-5 text-[12.5px]">
                    <div className="flex items-start gap-2.5">
                      <CalendarDays className="mt-0.5 h-4 w-4 text-sky-deep" strokeWidth={1.7} />
                      <div>
                        <dt className="text-navy/40">التاريخ</dt>
                        <dd className="mt-0.5 text-navy/80">{event.dateLabel}</dd>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Clock className="mt-0.5 h-4 w-4 text-sky-deep" strokeWidth={1.7} />
                      <div>
                        <dt className="text-navy/40">الوقت</dt>
                        <dd className="mt-0.5 text-navy/80">{event.timeLabel}</dd>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <MapPin className="mt-0.5 h-4 w-4 text-sky-deep" strokeWidth={1.7} />
                      <div>
                        <dt className="text-navy/40">المكان</dt>
                        <dd className="mt-0.5 text-navy/80">{event.location}</dd>
                      </div>
                    </div>
                  </dl>
                </div>
              </aside>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-white">
        <div className="container-page py-14">
          <div className="flex flex-col items-start justify-between gap-6 rounded-[28px] border border-line bg-paper px-6 py-8 md:flex-row md:items-center md:px-10">
            <div>
              <span className="kicker">بعد الفعالية</span>
              <h2 className="mt-2 text-[clamp(1.3rem,2.4vw,1.7rem)]">
                بدك تكمّل؟ تصفّح مسارات الأكاديمية.
              </h2>
              <p className="mt-2 max-w-xl text-[13.5px] leading-[1.9] text-muted">
                كل مسار بيبني على اللي قبله، وبتقدر تبدأ من أي نقطة تناسبك.
              </p>
            </div>
            <Link to="/tracks" className="btn btn-navy shrink-0">
              كل المسارات
              <ArrowUpLeft className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
