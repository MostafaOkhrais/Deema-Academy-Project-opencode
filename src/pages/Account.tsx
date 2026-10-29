import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowUpLeft,
  BadgeCheck,
  BookOpen,
  CalendarDays,
  ClipboardList,
  Loader2,
  LogOut,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { MemberCard } from '@/components/MemberCard';
import { events } from '@/data/events';
import {
  claimMembership,
  getCurrentUser,
  getProfile,
  signOut,
  type Profile,
} from '@/lib/auth';
import { isSupabaseConfigured } from '@/lib/supabase';
import { usePageMeta } from '@/lib/seo';

const demoProfile: Profile = {
  id: 'demo',
  full_name: 'ديمة أحمد',
  email: 'deema@example.com',
  member_code: 'DM-2026-0241',
  role: 'member',
  track_slug: 'ai-digital-health',
  track_title: 'الذكاء الاصطناعي والصحة الرقمية',
  university: 'جامعة فلسطين',
  major: 'صيدلة',
  member_since: '2026-10-01',
  valid_until: '2027-09-01',
  status: 'active',
  avatar_url: null,
};

export function Account() {
  usePageMeta({ title: 'لوحة العضو | أكاديمية ديمة', noindex: true });

  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [demo, setDemo] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [universityId, setUniversityId] = useState('');
  const [memberCode, setMemberCode] = useState('');

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!isSupabaseConfigured) {
        if (!mounted) return;
        setProfile(demoProfile);
        setDemo(true);
        setLoading(false);
        return;
      }

      const user = await getCurrentUser();
      if (!user) {
        navigate('/login', { replace: true });
        return;
      }

      const data = await getProfile(user.id);
      if (!mounted) return;
      setProfile(data);
      setLoading(false);
    }

    load();
    return () => {
      mounted = false;
    };
  }, [navigate]);

  const logout = async () => {
    await signOut();
    navigate('/login');
  };

  const claim = async (e: React.FormEvent) => {
    e.preventDefault();
    setClaimError(null);
    setClaiming(true);
    try {
      await claimMembership(universityId, memberCode);
      const user = await getCurrentUser();
      if (user) setProfile(await getProfile(user.id));
    } catch {
      setClaimError('ما قدرنا نربط العضوية. تأكد من الرقم الجامعي ورمز العضوية.');
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="grid-white">
        <div className="container-page grid min-h-[50vh] place-items-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-sky-deep" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <section className="grid-white">
        <div className="container-page py-16 md:py-24">
          <div className="mx-auto max-w-lg rounded-[28px] border border-line bg-white p-7">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-sky/20 text-sky-deep">
              <ShieldCheck className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <h1 className="mt-5 font-serif text-[24px] font-black text-navy">اربط عضويتك</h1>
            <p className="mt-2 text-[13px] leading-[1.9] text-muted">
              حسابك جاهز، بس لسا مش مربوط بعضوية معتمدة. أدخل الرقم الجامعي ورمز العضوية
              اللي وصلك بالإيميل.
            </p>
            <form onSubmit={claim} className="mt-5 space-y-3">
              <input
                dir="ltr"
                className="field text-left"
                placeholder="الرقم الجامعي"
                value={universityId}
                onChange={(e) => setUniversityId(e.target.value)}
                required
              />
              <input
                dir="ltr"
                className="field text-left uppercase"
                placeholder="DM-2026-XXXX"
                value={memberCode}
                onChange={(e) => setMemberCode(e.target.value)}
                required
              />
              {claimError && <p className="text-[12px] text-red-700">{claimError}</p>}
              <button type="submit" className="btn btn-navy w-full" disabled={claiming}>
                {claiming ? <Loader2 className="h-4 w-4 animate-spin" /> : 'ربط العضوية'}
              </button>
            </form>
            <button type="button" onClick={logout} className="mt-4 text-[12px] text-navy/45">
              تسجيل الخروج
            </button>
          </div>
        </div>
      </section>
    );
  }

  const firstName = profile.full_name.split(' ')[0];

  return (
    <>
      <section className="grid-navy text-white">
        <div className="container-page py-10 md:py-14">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-[11.5px] text-sky">لوحة العضو · العام {`٢٠٢٦/٢٠٢٧`}</p>
              <h1 className="mt-2 text-[clamp(1.8rem,3.6vw,2.6rem)]">أهلاً، {firstName}.</h1>
              <p className="mt-2 text-[13px] text-white/55">
                {profile.university} · {profile.major}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link to="/account#settings" className="btn btn-outline-dark btn-sm">
                <Settings className="h-4 w-4" />
                الإعدادات
              </Link>
              <button type="button" onClick={logout} className="btn btn-outline-dark btn-sm">
                <LogOut className="h-4 w-4" />
                خروج
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { label: 'حالة العضوية', value: 'فعّالة', icon: BadgeCheck },
              { label: 'المسار', value: profile.track_title ?? '—', icon: BookOpen },
              { label: 'صلاحية البطاقة', value: '٢٠٢٦/٢٠٢٧', icon: CalendarDays },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-3.5"
              >
                <item.icon className="h-5 w-5 shrink-0 text-sky" strokeWidth={1.7} />
                <div className="min-w-0">
                  <p className="text-[10.5px] text-white/40">{item.label}</p>
                  <p className="mt-0.5 truncate text-[13px] font-medium text-white">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {demo && (
            <p className="mt-4 inline-flex rounded-full bg-amber-400/15 px-3.5 py-1.5 text-[11px] text-amber-200">
              وضع تجريبي — البيانات وهمية لحين ربط قاعدة البيانات.
            </p>
          )}
        </div>
      </section>

      <section className="grid-paper">
        <div className="container-page py-12 md:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <MemberCard profile={profile} />
              <div className="mt-4 flex flex-wrap gap-2">
                <Link to={`/verify/${profile.member_code}`} className="btn btn-outline btn-sm">
                  <ShieldCheck className="h-4 w-4" />
                  صفحة التحقق
                </Link>
                <span className="btn btn-outline btn-sm cursor-default text-navy/40">
                  تحميل PDF قريباً
                </span>
              </div>
              <p className="mt-4 text-[11px] leading-[1.8] text-navy/40">
                رقم العضوية: <span dir="ltr">{profile.member_code}</span> — أي حدا يقدر يتحقق
                من البطاقة عبر مسح رمز QR.
              </p>
            </div>

            <div className="space-y-5">
              <div className="rounded-[26px] border border-line bg-white p-6">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="font-serif text-[20px] font-bold text-navy">فعالياتك القادمة</h2>
                  <Link to="/events" className="link-arrow text-[12px] text-navy/60">
                    كل الفعاليات
                  </Link>
                </div>
                <ul className="mt-4 space-y-2.5">
                  {events.slice(0, 2).map((event) => (
                    <li key={event.slug}>
                      <Link
                        to={`/events/${event.slug}`}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-line px-4 py-3.5 transition-colors hover:border-navy/25"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-[13.5px] font-medium text-navy">{event.title}</p>
                          <p className="mt-1 text-[11px] text-navy/45">
                            {event.dateLabel} · {event.location}
                          </p>
                        </div>
                        <ArrowUpLeft className="h-4 w-4 shrink-0 text-navy/30" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[26px] border border-line bg-white p-6">
                <h2 className="font-serif text-[20px] font-bold text-navy">خطوتك التالية</h2>
                <ul className="mt-4 space-y-3">
                  {[
                    { done: true, label: 'تفعيل العضوية' },
                    { done: true, label: 'اختيار المسار' },
                    { done: false, label: 'حضور الورشة التعريفية' },
                    { done: false, label: 'إكمال أول تمرين في المسار' },
                  ].map((task) => (
                    <li key={task.label} className="flex items-center gap-3 text-[13px]">
                      <span
                        className={
                          task.done
                            ? 'grid h-5 w-5 place-items-center rounded-full bg-sky text-navy'
                            : 'grid h-5 w-5 place-items-center rounded-full border border-navy/20 text-transparent'
                        }
                      >
                        ✓
                      </span>
                      <span className={task.done ? 'text-navy/40 line-through' : 'text-navy/75'}>
                        {task.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { icon: ClipboardList, title: 'شهاداتي', body: 'بتظهر هنا بعد إصدارها.' },
                  { icon: Settings, title: 'بياناتي', body: 'حدّث بياناتك وتواصلك.' },
                ].map((card) => (
                  <div key={card.title} className="rounded-[22px] border border-line bg-white p-5">
                    <card.icon className="h-5 w-5 text-sky-deep" strokeWidth={1.7} />
                    <p className="mt-3 font-serif text-[15px] font-bold text-navy">{card.title}</p>
                    <p className="mt-1 text-[11.5px] leading-relaxed text-navy/45">{card.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
