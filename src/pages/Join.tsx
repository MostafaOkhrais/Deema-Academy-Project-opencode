import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { QRCodeSVG } from 'qrcode.react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpLeft,
  CheckCircle2,
  Loader2,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { Reveal } from '@/components/Reveal';
import { TrackGlyph } from '@/components/TrackGlyph';
import { tracks } from '@/data/tracks';
import { site } from '@/data/site';
import { lookupApplication, submitApplication, type ApplicationStatus } from '@/lib/applications';
import { isSupabaseConfigured } from '@/lib/supabase';
import { usePageMeta } from '@/lib/seo';
import { cn } from '@/lib/utils';

const schema = z.object({
  full_name: z.string().min(3, 'اكتب الاسم الكامل'),
  email: z
    .string()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 'الإيميل مش صحيح'),
  phone: z.string().min(8, 'رقم الجوال مش صحيح'),
  university: z.string().min(2, 'اكتب اسم الجامعة'),
  university_id: z.string().optional(),
  major: z.string().min(2, 'اكتب التخصص'),
  year: z.string().min(1, 'اختر السنة الدراسية'),
  city: z.string().min(2, 'اكتب المدينة'),
  track_slug: z.string().min(1, 'اختر مسار'),
  motivation: z.string().min(24, 'اكتب سطرين على الأقل عن سبب اختيارك'),
  source: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const years = [
  'السنة الأولى',
  'السنة الثانية',
  'السنة الثالثة',
  'السنة الرابعة',
  'السنة الخامسة',
  'السنة السادسة',
  'خريج/ة',
];

const sources = ['إنستغرام', 'تيك توك', 'يوتيوب', 'توصية صديق', 'بحث جوجل', 'مكان تاني'];

const statusLabels: Record<string, string> = {
  pending: 'قيد المراجعة',
  pending_demo: 'قيد المراجعة (تجريبي)',
  accepted: 'مقبول',
  rejected: 'مرفوض',
  interview: 'بانتظار مقابلة',
  general: 'عضوية عامة',
  waitlist: 'قائمة انتظار',
};

export function Join() {
  usePageMeta({
    title: 'انضم للأكاديمية | أكاديمية ديمة',
    description:
      'سجّل اهتمامك بمسارات أكاديمية ديمة. طلب من خطوتين، ومراجعة شخصية، وبطاقة انتساب رقمية بعد القبول.',
  });

  const [searchParams] = useSearchParams();
  const presetTrack = searchParams.get('track') ?? '';
  const [step, setStep] = useState(1);
  const [sent, setSent] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      university: '',
      university_id: '',
      major: '',
      year: '',
      city: '',
      track_slug: tracks.some((t) => t.slug === presetTrack) ? presetTrack : '',
      motivation: '',
      source: '',
    },
  });

  const name = watch('full_name');
  const selectedTrackSlug = watch('track_slug');
  const selectedTrack = tracks.find((t) => t.slug === selectedTrackSlug);

  useEffect(() => {
    if (presetTrack && tracks.some((t) => t.slug === presetTrack)) {
      setValue('track_slug', presetTrack, { shouldValidate: true });
    }
  }, [presetTrack, setValue]);

  const goNext = async () => {
    const valid = await trigger([
      'full_name',
      'email',
      'phone',
      'university',
      'university_id',
      'major',
      'year',
      'city',
    ]);
    if (valid) setStep(2);
  };

  const onSubmit = async (values: FormValues) => {
    setSubmitError(null);
    const track = tracks.find((t) => t.slug === values.track_slug);
    const result = await submitApplication({
      ...values,
      track_title: track?.title ?? values.track_slug,
    });

    if (result.ok) {
      setSent(true);
      setDemoMode(result.demo);
      window.scrollTo({ top: 220, behavior: 'smooth' });
      return;
    }
    setSubmitError(result.message);
  };

  return (
    <>
      <PageHero
        kicker="الانتساب"
        breadcrumb={[{ label: 'انضم' }]}
        title={
          <>
            سجّل اهتمامك،
            <br />
            وابدأ من <span className="text-sky">وين إنت</span>.
          </>
        }
        lead="طلب من خطوتين: بياناتك الأكاديمية، والمسار اللي بدك تبدأ منه. بنراجع كل طلب شخصياً، وبنتواصل معك قبل أي التزام."
      />

      <section className="grid-white" id="apply">
        <div className="container-page py-14 md:py-20">
          <div className="grid items-start gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:gap-14">
            <div className="order-2 lg:sticky lg:top-28">
              <div className="mx-auto max-w-[380px] lg:mx-0">
                <div className="relative overflow-hidden rounded-[26px] border border-navy/15 bg-white shadow-[0_30px_70px_-50px_rgba(0,33,71,0.6)]">
                  <div className="grid-paper p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <img src="/brand/deema-mark.png" alt="" className="h-6 w-6" />
                        <span dir="ltr" className="text-[9px] font-medium leading-[1.05] text-navy">
                          Deema
                          <br />
                          Academy
                        </span>
                      </div>
                      <span className="rounded-full border border-navy/15 bg-white/70 px-2.5 py-1 text-[9px] text-navy/55">
                        قيد المراجعة
                      </span>
                    </div>

                    <div className="mt-10">
                      <p className="text-[9px] tracking-wide text-navy/40">بطاقة انتساب</p>
                      <p className="mt-1 line-clamp-1 font-serif text-[23px] font-black text-navy">
                        {name?.trim() || 'اسمك هنا'}
                      </p>
                      <p className="mt-1 text-[10.5px] text-sky-deep">
                        {selectedTrack?.title ?? 'المسار اللي بتختاره'}
                      </p>
                    </div>

                    <div className="mt-9 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-[8.5px] text-navy/40">العام الأكاديمي</p>
                        <p className="mt-0.5 text-[10.5px] font-medium text-navy">{site.year}</p>
                        <p className="mt-4 text-[8px] leading-relaxed text-navy/35">
                          تُصدر البطاقة بعد قبول الطلب
                        </p>
                      </div>
                      <div className="rounded-xl bg-white p-1.5">
                        <QRCodeSVG
                          value={`https://${site.domain}/verify/preview`}
                          size={62}
                          bgColor="#ffffff"
                          fgColor="#002147"
                          level="M"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-navy px-5 py-3">
                    <span className="text-[9px] text-sky">MEMBER</span>
                    <span className="font-serif text-[12px] font-bold text-white">
                      أكاديمية ديمة
                    </span>
                  </div>
                </div>

                <p className="mt-4 flex items-start gap-2 text-[11.5px] leading-[1.8] text-navy/45">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sky-deep" strokeWidth={1.8} />
                  هاي معاينة توضيحية. البطاقة الرسمية بتصدر بعد مراجعة الطلب، وبتقدر تتحقق منها
                  عبر رابط QR.
                </p>

                <div className="mt-6 rounded-[22px] border border-navy/10 bg-paper p-5">
                  <p className="font-serif text-[15px] font-bold text-navy">شو بيصير بعد التسجيل؟</p>
                  <ol className="mt-3 space-y-2.5 text-[12px] leading-[1.8] text-navy/60">
                    <li className="flex gap-2">
                      <span className="text-sky-deep">١.</span> بنراجع طلبك ونتأكد من البيانات.
                    </li>
                    <li className="flex gap-2">
                      <span className="text-sky-deep">٢.</span> بنتواصل معك على الإيميل/واتساب.
                    </li>
                    <li className="flex gap-2">
                      <span className="text-sky-deep">٣.</span> بتستلم تفاصيل البدء والبطاقة.
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            <Reveal className="order-1">
              <div className="rounded-[30px] border border-line bg-white p-6 md:p-9">
                {sent ? (
                  <div className="py-8 text-center">
                    <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-sky/20">
                      <CheckCircle2 className="h-8 w-8 text-sky-deep" strokeWidth={1.8} />
                    </span>
                    <h2 className="mt-6 font-serif text-[26px] font-black text-navy">وصلنا طلبك.</h2>
                    <p className="mx-auto mt-3 max-w-md text-[13.5px] leading-[1.9] text-muted">
                      شكراً لثقتك. بنراجع الطلب وبنتواصل معك على الإيميل أو واتساب خلال أيام
                      العمل. إذا فتحت الورشة المجانية، بتوصلك دعوة قبل غيرك.
                    </p>
                    {demoMode && (
                      <p className="mx-auto mt-4 max-w-md rounded-xl bg-amber-50 px-4 py-3 text-[11.5px] leading-relaxed text-amber-800">
                        وضع تجريبي: الطلب محفوظ على جهازك فقط. لتفعيل استقبال الطلبات، اربط
                        مشروع Supabase بمتغيرات البيئة.
                      </p>
                    )}
                    <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                      <Link to="/tracks" className="btn btn-navy">
                        تصفّح المسارات
                        <ArrowUpLeft className="h-4 w-4" />
                      </Link>
                      <Link to="/" className="btn btn-outline">
                        الرئيسية
                      </Link>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSent(false);
                        setStep(1);
                      }}
                      className="mt-6 text-[12px] text-sky-deep underline decoration-sky-deep/30 underline-offset-4"
                    >
                      تقديم طلب تاني
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-1 items-center gap-2">
                        <span
                          className={cn(
                            'grid h-8 w-8 place-items-center rounded-full text-[12px] font-medium',
                            step >= 1 ? 'bg-navy text-white' : 'bg-paper text-navy/40',
                          )}
                        >
                          ١
                        </span>
                        <span className="text-[12.5px] font-medium text-navy">بياناتك</span>
                        <span className="mx-1 h-px flex-1 bg-line" />
                      </div>
                      <div className="flex flex-1 items-center gap-2">
                        <span
                          className={cn(
                            'grid h-8 w-8 place-items-center rounded-full text-[12px] font-medium',
                            step >= 2 ? 'bg-navy text-white' : 'bg-paper text-navy/40',
                          )}
                        >
                          ٢
                        </span>
                        <span
                          className={cn(
                            'text-[12.5px] font-medium',
                            step >= 2 ? 'text-navy' : 'text-navy/45',
                          )}
                        >
                          المسار
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 h-1 overflow-hidden rounded-full bg-paper">
                      <div
                        className="h-full rounded-full bg-sky transition-all duration-500"
                        style={{ width: step === 1 ? '50%' : '100%' }}
                      />
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="mt-7" noValidate>
                      {step === 1 ? (
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="sm:col-span-2">
                            <label className="field-label" htmlFor="full_name">
                              الاسم الكامل
                            </label>
                            <input
                              id="full_name"
                              className="field"
                              placeholder="مثال: ديمة أحمد"
                              autoComplete="name"
                              {...register('full_name')}
                            />
                            {errors.full_name && (
                              <p className="mt-1.5 text-[11.5px] text-red-700">
                                {errors.full_name.message}
                              </p>
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
                              <p className="mt-1.5 text-[11.5px] text-red-700">
                                {errors.email.message}
                              </p>
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
                              <p className="mt-1.5 text-[11.5px] text-red-700">
                                {errors.phone.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="field-label" htmlFor="university">
                              الجامعة
                            </label>
                            <input
                              id="university"
                              className="field"
                              placeholder="مثال: جامعة فلسطين"
                              {...register('university')}
                            />
                            {errors.university && (
                              <p className="mt-1.5 text-[11.5px] text-red-700">
                                {errors.university.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="field-label" htmlFor="university_id">
                              الرقم الجامعي{' '}
                              <span className="text-navy/35">(اختياري للخريجين)</span>
                            </label>
                            <input
                              id="university_id"
                              dir="ltr"
                              className="field text-left"
                              placeholder="120220145"
                              {...register('university_id')}
                            />
                          </div>

                          <div>
                            <label className="field-label" htmlFor="major">
                              التخصص
                            </label>
                            <input
                              id="major"
                              className="field"
                              placeholder="مثال: صيدلة"
                              {...register('major')}
                            />
                            {errors.major && (
                              <p className="mt-1.5 text-[11.5px] text-red-700">
                                {errors.major.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="field-label" htmlFor="year">
                              السنة الدراسية
                            </label>
                            <select id="year" className="field" {...register('year')}>
                              <option value="">اختار السنة</option>
                              {years.map((year) => (
                                <option key={year} value={year}>
                                  {year}
                                </option>
                              ))}
                            </select>
                            {errors.year && (
                              <p className="mt-1.5 text-[11.5px] text-red-700">
                                {errors.year.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="field-label" htmlFor="city">
                              المدينة
                            </label>
                            <input
                              id="city"
                              className="field"
                              placeholder="مثال: غزة"
                              {...register('city')}
                            />
                            {errors.city && (
                              <p className="mt-1.5 text-[11.5px] text-red-700">
                                {errors.city.message}
                              </p>
                            )}
                          </div>

                          <div className="sm:col-span-2 mt-1 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-[11px] leading-relaxed text-navy/40">
                              بياناتك بتستخدم للمراجعة والتواصل فقط.
                            </p>
                            <button type="button" onClick={goNext} className="btn btn-navy shrink-0">
                              التالي: اختيار المسار
                              <ArrowLeft className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <fieldset>
                            <legend className="field-label">أي مسار بتحب تبدأ منه؟</legend>
                            <div className="mt-1 grid gap-2.5">
                              {tracks.map((track) => {
                                const active = selectedTrackSlug === track.slug;
                                return (
                                  <label
                                    key={track.slug}
                                    className={cn(
                                      'flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition-all',
                                      active
                                        ? 'border-sky-deep bg-sky/10'
                                        : 'border-line bg-white hover:border-navy/25',
                                    )}
                                  >
                                    <input
                                      type="radio"
                                      value={track.slug}
                                      className="sr-only"
                                      {...register('track_slug')}
                                    />
                                    <span
                                      className={cn(
                                        'mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border',
                                        active
                                          ? 'border-navy bg-navy text-sky'
                                          : 'border-navy/15 text-navy/60',
                                      )}
                                    >
                                      <TrackGlyph icon={track.icon} className="h-4 w-4" />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                      <span className="block font-serif text-[15px] font-bold text-navy">
                                        {track.title}
                                      </span>
                                      <span className="mt-0.5 block text-[11.5px] leading-relaxed text-navy/50">
                                        {track.tagline}
                                      </span>
                                    </span>
                                    <span
                                      className={cn(
                                        'mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border',
                                        active ? 'border-sky-deep bg-sky-deep' : 'border-navy/20',
                                      )}
                                    >
                                      {active && <span className="h-2 w-2 rounded-full bg-white" />}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                            {errors.track_slug && (
                              <p className="mt-1.5 text-[11.5px] text-red-700">
                                {errors.track_slug.message}
                              </p>
                            )}
                          </fieldset>

                          <div className="mt-5">
                            <label className="field-label" htmlFor="motivation">
                              ليش اخترت هالمسار؟ <span className="text-navy/35">(سطرين)</span>
                            </label>
                            <textarea
                              id="motivation"
                              className="field"
                              rows={4}
                              placeholder="شو اللي جذبك بالمسار؟ وشو بتتمنى تطلع به؟"
                              {...register('motivation')}
                            />
                            {errors.motivation && (
                              <p className="mt-1.5 text-[11.5px] text-red-700">
                                {errors.motivation.message}
                              </p>
                            )}
                          </div>

                          <div className="mt-4">
                            <label className="field-label" htmlFor="source">
                              كيف عرفت عنا؟ <span className="text-navy/35">(اختياري)</span>
                            </label>
                            <select id="source" className="field" {...register('source')}>
                              <option value="">اختار</option>
                              {sources.map((source) => (
                                <option key={source} value={source}>
                                  {source}
                                </option>
                              ))}
                            </select>
                          </div>

                          {submitError && (
                            <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-[12px] text-red-700">
                              {submitError}
                            </p>
                          )}

                          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <button
                              type="button"
                              onClick={() => setStep(1)}
                              className="btn btn-outline"
                            >
                              <ArrowRight className="h-4 w-4" />
                              رجوع
                            </button>
                            <button
                              type="submit"
                              className="btn btn-navy"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  عمّ نرسل...
                                </>
                              ) : (
                                <>
                                  أرسل الطلب
                                  <ArrowUpLeft className="h-4 w-4" />
                                </>
                              )}
                            </button>
                          </div>
                          <p className="mt-4 text-[10.5px] leading-relaxed text-navy/40">
                            بإرسال الطلب، إنت بتوافق على استخدام بياناتك لمراجعة طلبك والتواصل
                            معك بخصوص الأكاديمية. ما منشاركها مع أي طرف تالت.
                          </p>
                        </div>
                      )}
                    </form>
                  </>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <StatusLookup />
    </>
  );
}

function StatusLookup() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ApplicationStatus[] | null>(null);
  const [checked, setChecked] = useState(false);

  const check = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setChecked(false);
    const data = await lookupApplication(query.trim());
    setResults(data);
    setChecked(true);
    setLoading(false);
  };

  return (
    <section className="grid-paper" id="status">
      <div className="container-page py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="kicker">متابعة الطلب</span>
          <h2 className="mt-4 text-[clamp(1.7rem,3.2vw,2.4rem)]">بدك تعرف وين وصل طلبك؟</h2>
          <p className="mt-3 text-[13.5px] leading-[1.9] text-muted">
            اكتب الإيميل أو رقم الجوال اللي سجّلت فيه، وبنطلعلك حالة الطلب.
          </p>

          <form onSubmit={check} className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/30" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="field h-12 bg-white pr-11"
                placeholder="الإيميل أو رقم الجوال"
                dir="auto"
                aria-label="الإيميل أو رقم الجوال"
              />
            </div>
            <button type="submit" className="btn btn-navy h-12" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'تحقق'}
            </button>
          </form>

          {checked && (
            <div className="mx-auto mt-6 max-w-md text-right">
              {!isSupabaseConfigured ? (
                <p className="rounded-2xl border border-navy/10 bg-white px-5 py-4 text-[12.5px] leading-[1.9] text-navy/60">
                  متابعة الطلبات بتتفعّل بعد ربط قاعدة البيانات. في الوضع التجريبي، الطلبات
                  محفوظة على جهازك فقط.
                </p>
              ) : results && results.length > 0 ? (
                <ul className="space-y-2">
                  {results.map((item, index) => (
                    <li
                      key={`${item.created_at}-${index}`}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-white px-5 py-3.5"
                    >
                      <div>
                        <p className="text-[13px] font-medium text-navy">{item.track_title}</p>
                        <p className="mt-0.5 text-[11px] text-navy/40">
                          {new Date(item.created_at).toLocaleDateString('ar-EG', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <span className="rounded-full bg-sky/20 px-3 py-1 text-[11px] font-medium text-sky-deep">
                        {statusLabels[item.status] ?? item.status}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rounded-2xl border border-navy/10 bg-white px-5 py-4 text-[12.5px] text-navy/60">
                  ما لقينا طلب بهذه البيانات. تأكد من الإيميل أو الرقم، أو تواصل معنا.
                </p>
              )}
            </div>
          )}

          <p className="mt-5 text-[11px] text-navy/35">
            بتواجه مشكلة؟ راسلنا على{' '}
            <a href={`mailto:${site.email}`} className="text-sky-deep underline underline-offset-4">
              {site.email}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
