import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpLeft, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { activateMember, requestPasswordReset, signIn } from '@/lib/auth';
import { isSupabaseConfigured } from '@/lib/supabase';
import { usePageMeta } from '@/lib/seo';
import { cn } from '@/lib/utils';

type Mode = 'login' | 'activate';

export function Login() {
  usePageMeta({
    title: 'حسابي | أكاديمية ديمة',
    description: 'سجّل دخولك لحساب أكاديمية ديمة، أو فعّل عضويتك برمز العضوية.',
    noindex: true,
  });

  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [universityId, setUniversityId] = useState('');
  const [memberCode, setMemberCode] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);

    if (!isSupabaseConfigured) {
      setError('الدخول بيتفعّل بعد ربط قاعدة البيانات. في الوضع التجريبي بتقدر تشوف لوحة العضو.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(email, password);
        navigate('/account');
      } else {
        const result = await activateMember({
          email,
          password,
          universityId,
          memberCode,
        });
        if (result.needsConfirmation) {
          setNotice('تم إنشاء الحساب. تأكد من إيميلك أولاً، بعدها سجّل دخول لربط العضوية.');
        } else {
          navigate('/account');
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      setError(
        message.includes('Invalid login credentials')
          ? 'الإيميل أو كلمة المرور مش صحيحة.'
          : message.includes('already registered')
            ? 'الإيميل مسجّل مسبقاً. جرّب تسجيل الدخول.'
            : 'ما قدرنا نكمل العملية. تأكد من البيانات وجرّب مرة تانية.',
      );
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!email || !isSupabaseConfigured) return;
    try {
      await requestPasswordReset(email);
      setNotice('بعتنالك رابط إعادة تعيين كلمة المرور على الإيميل.');
    } catch {
      setError('ما قدرنا نرسل رابط الاستعادة. تأكد من الإيميل.');
    }
  };

  return (
    <>
      <PageHero
        kicker="حسابي"
        breadcrumb={[{ label: 'تسجيل الدخول' }]}
        title={
          <>
            رجعت؟ <span className="text-sky">أهلاً فيك</span>.
          </>
        }
        lead="سجّل دخولك لمتابعة مسارك، بطاقتك الرقمية، وتسجيلاتك بالفعاليات."
      />

      <section className="grid-white">
        <div className="container-page py-14 md:py-20">
          <div className="mx-auto grid max-w-4xl items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="hidden lg:block">
              <span className="kicker">بوابة العضو</span>
              <h2 className="mt-4 text-[clamp(1.6rem,2.8vw,2.2rem)] leading-[1.35]">
                كل شي إلك
                <br />
                بمكان <span className="text-sky-deep">واحد</span>.
              </h2>
              <ul className="mt-6 space-y-4">
                {[
                  'بطاقتك الرقمية مع رمز QR للتحقق',
                  'تسجيلاتك في الورش والمسارات',
                  'شهاداتك وملفاتك عند إصدارها',
                  'تحديث بياناتك الشخصية',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-navy/70">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sky-deep" strokeWidth={1.8} />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-2xl border border-navy/10 bg-paper p-5 text-[12px] leading-[1.85] text-navy/55">
                ما عندك حساب؟ سجّل بالأكاديمية أولاً، وبعد قبول طلبك بتستلم رمز العضوية
                لتفعيل حسابك.
                <Link to="/join" className="mt-3 flex items-center gap-1 font-medium text-sky-deep">
                  سجّل اهتمامك
                  <ArrowUpLeft className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="rounded-[30px] border border-line bg-white p-6 md:p-8">
              <div className="flex rounded-full bg-paper p-1">
                {(
                  [
                    { key: 'login', label: 'تسجيل الدخول' },
                    { key: 'activate', label: 'تفعيل حسابك' },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      setMode(item.key);
                      setError(null);
                      setNotice(null);
                    }}
                    className={cn(
                      'flex-1 rounded-full px-4 py-2.5 text-[12.5px] font-medium transition-colors',
                      mode === item.key ? 'bg-navy text-white' : 'text-navy/55 hover:text-navy',
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
                <div>
                  <label className="field-label" htmlFor="login-email">
                    الإيميل
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    dir="ltr"
                    className="field text-left"
                    placeholder="name@example.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {mode === 'activate' && (
                    <p className="mt-1.5 text-[10.5px] leading-relaxed text-navy/40">
                      استخدم نفس الإيميل اللي قدّمت فيه طلب الانتساب.
                    </p>
                  )}
                </div>

                {mode === 'activate' && (
                  <>
                    <div>
                      <label className="field-label" htmlFor="university-id">
                        الرقم الجامعي
                      </label>
                      <input
                        id="university-id"
                        dir="ltr"
                        className="field text-left"
                        placeholder="120220145"
                        value={universityId}
                        onChange={(e) => setUniversityId(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="field-label" htmlFor="member-code">
                        رمز العضوية
                      </label>
                      <input
                        id="member-code"
                        dir="ltr"
                        className="field text-left uppercase"
                        placeholder="DM-2026-XXXX"
                        value={memberCode}
                        onChange={(e) => setMemberCode(e.target.value)}
                        required
                      />
                      <p className="mt-1.5 text-[10.5px] leading-relaxed text-navy/40">
                        الرمز بيوصلك بالإيميل بعد قبول طلب الانتساب.
                      </p>
                    </div>
                  </>
                )}

                <div>
                  <label className="field-label" htmlFor="login-password">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      dir="ltr"
                      className="field pl-11 text-left"
                      placeholder="••••••••"
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute left-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-navy/40 hover:text-navy"
                      aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="rounded-xl bg-red-50 px-3 py-2 text-[12px] leading-relaxed text-red-700">
                    {error}
                  </p>
                )}
                {notice && (
                  <p className="rounded-xl bg-sky/15 px-3 py-2 text-[12px] leading-relaxed text-sky-deep">
                    {notice}
                  </p>
                )}

                <button type="submit" className="btn btn-navy w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      لحظة...
                    </>
                  ) : mode === 'login' ? (
                    <>
                      دخول
                      <ArrowUpLeft className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      فعّل العضوية
                      <ArrowUpLeft className="h-4 w-4" />
                    </>
                  )}
                </button>

                {mode === 'login' && (
                  <div className="flex items-center justify-between text-[11.5px]">
                    <button
                      type="button"
                      onClick={resetPassword}
                      className="text-sky-deep underline decoration-sky-deep/30 underline-offset-4"
                    >
                      نسيت كلمة المرور؟
                    </button>
                    <Link to="/join" className="text-navy/55 hover:text-navy">
                      ما عندك حساب؟
                    </Link>
                  </div>
                )}
              </form>

              {!isSupabaseConfigured && (
                <div className="mt-5 rounded-2xl border border-dashed border-navy/20 bg-paper p-4">
                  <p className="text-[11.5px] leading-[1.8] text-navy/55">
                    وضع تجريبي: المصادقة بتتفعّل بعد ربط Supabase. بتقدر تشوف شكل لوحة العضو
                    من الزر تحت.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('/account')}
                    className="btn btn-outline btn-sm mt-3"
                  >
                    عرض لوحة العضو التجريبية
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
