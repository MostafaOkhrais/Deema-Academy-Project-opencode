import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowUpLeft, BadgeCheck, Loader2, SearchX, ShieldAlert } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { usePageMeta } from '@/lib/seo';
import { site } from '@/data/site';

type CardRecord = {
  member_code: string;
  full_name: string;
  track_title: string | null;
  status: string;
  member_since: string | null;
  valid_until: string | null;
};

export function Verify() {
  const { code } = useParams();
  usePageMeta({
    title: 'التحقق من العضوية | أكاديمية ديمة',
    description: 'تحقق من صحة بطاقة عضوية صادرة عن أكاديمية ديمة.',
    noindex: true,
  });

  const [state, setState] = useState<'loading' | 'found' | 'missing' | 'demo' | 'error'>('loading');
  const [record, setRecord] = useState<CardRecord | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!supabase) {
        setState('demo');
        return;
      }
      const { data, error } = await supabase
        .from('public_member_cards')
        .select('member_code, full_name, track_title, status, member_since, valid_until')
        .eq('member_code', code ?? '')
        .maybeSingle();

      if (!mounted) return;
      if (error) {
        setState('error');
        return;
      }
      if (!data) {
        setState('missing');
        return;
      }
      setRecord(data as CardRecord);
      setState('found');
    }

    load();
    return () => {
      mounted = false;
    };
  }, [code]);

  return (
    <>
      <PageHero
        kicker="التحقق من العضوية"
        breadcrumb={[{ label: 'التحقق' }]}
        title={
          <>
            بطاقة صادرة
            <br />
            من <span className="text-sky">أكاديمية ديمة</span>؟
          </>
        }
        lead="هاي الصفحة بتتحقق من بطاقات الأعضاء الصادرة عنا. امسح رمز QR الموجود على البطاقة للوصول لهون مباشرة."
      />

      <section className="grid-paper">
        <div className="container-page py-16 md:py-24">
          <div className="mx-auto max-w-lg">
            {state === 'loading' && (
              <div className="grid place-items-center rounded-[28px] border border-line bg-white py-20">
                <Loader2 className="h-6 w-6 animate-spin text-sky-deep" />
                <p className="mt-3 text-[12.5px] text-navy/50">عمّ نتحقق من البطاقة...</p>
              </div>
            )}

            {state === 'found' && record && (
              <div className="overflow-hidden rounded-[28px] border border-line bg-white">
                <div className="grid-sky px-7 py-8 text-navy">
                  <BadgeCheck className="h-9 w-9" strokeWidth={1.6} />
                  <p className="mt-4 text-[11.5px] font-medium text-navy/60">بطاقة معتمدة</p>
                  <h2 className="mt-1 font-serif text-[26px] font-black">{record.full_name}</h2>
                  <p className="mt-1 text-[13px] text-navy/70">
                    {record.track_title ?? 'عضو أكاديمية ديمة'}
                  </p>
                </div>
                <dl className="space-y-4 px-7 py-6 text-[13px]">
                  <div className="flex items-center justify-between gap-4 border-b border-line pb-3">
                    <dt className="text-navy/45">رقم العضوية</dt>
                    <dd dir="ltr" className="font-medium text-navy">
                      {record.member_code}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-b border-line pb-3">
                    <dt className="text-navy/45">الحالة</dt>
                    <dd className="font-medium text-sky-deep">
                      {record.status === 'active' ? 'فعّالة' : record.status}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-navy/45">العام الأكاديمي</dt>
                    <dd className="font-medium text-navy">{site.year}</dd>
                  </div>
                </dl>
                <div className="border-t border-line bg-paper px-7 py-4 text-[11px] leading-relaxed text-navy/45">
                  هالبطاقة صادرة إلكترونياً عن أكاديمية ديمة. للتحقق من التفاصيل، راجع الأكاديمية
                  مباشرة.
                </div>
              </div>
            )}

            {state === 'missing' && (
              <div className="rounded-[28px] border border-line bg-white px-7 py-12 text-center">
                <SearchX className="mx-auto h-9 w-9 text-navy/35" strokeWidth={1.6} />
                <h2 className="mt-4 font-serif text-[22px] font-bold text-navy">ما لقينا هالبطاقة</h2>
                <p className="mx-auto mt-2 max-w-sm text-[13px] leading-[1.9] text-muted">
                  الرمز <span dir="ltr" className="text-navy/70">{code}</span> مش موجود أو البطاقة
                  مش مفعّلة. تأكد من الرمز، أو تواصل مع الأكاديمية.
                </p>
                <Link to="/" className="btn btn-navy btn-sm mt-6">
                  الرئيسية
                </Link>
              </div>
            )}

            {(state === 'demo' || state === 'error') && (
              <div className="rounded-[28px] border border-line bg-white px-7 py-12 text-center">
                <ShieldAlert className="mx-auto h-9 w-9 text-sky-deep" strokeWidth={1.6} />
                <h2 className="mt-4 font-serif text-[22px] font-bold text-navy">
                  {state === 'demo' ? 'التحقق غير متاح في الوضع التجريبي' : 'صار خطأ بالتحقق'}
                </h2>
                <p className="mx-auto mt-2 max-w-sm text-[13px] leading-[1.9] text-muted">
                  {state === 'demo'
                    ? 'التحقق من البطاقات بيتفعّل بعد ربط قاعدة البيانات. عرض البطاقة متاح من لوحة العضو.'
                    : 'ما قدرنا نتصل بقاعدة البيانات. جرّب تحديث الصفحة بعد شوي.'}
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <Link to="/account" className="btn btn-navy btn-sm">
                    لوحة العضو
                    <ArrowUpLeft className="h-4 w-4" />
                  </Link>
                  <Link to="/" className="btn btn-outline btn-sm">
                    الرئيسية
                  </Link>
                </div>
              </div>
            )}

            {!isSupabaseConfigured && state === 'demo' && (
              <p className="mt-4 text-center text-[11px] text-navy/35">
                متغيرات البيئة: VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
