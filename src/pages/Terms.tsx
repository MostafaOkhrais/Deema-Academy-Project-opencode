import { PageHero } from '@/components/PageHero';
import { usePageMeta } from '@/lib/seo';
import { site } from '@/data/site';

export function Terms() {
  usePageMeta({
    title: 'شروط الاستخدام | أكاديمية ديمة',
    description: 'شروط استخدام موقع وخدمات أكاديمية ديمة.',
  });

  return (
    <>
      <PageHero
        kicker="الشروط"
        breadcrumb={[{ label: 'شروط الاستخدام' }]}
        title="شروط واضحة، من الأول."
        lead="آخر تحديث: أكتوبر ٢٠٢٦."
      />

      <section className="grid-white">
        <div className="container-page py-14 md:py-20">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-amber-300/70 bg-amber-50 px-5 py-4 text-[12.5px] leading-[1.9] text-amber-900">
              <strong className="font-medium">مسودة:</strong> هالشروط نموذج أولي وبتحتاج مراجعة
              قانونية قبل الإطلاق الرسمي.
            </div>

            <div className="prose-ar mt-8 space-y-6">
              <h2 className="font-serif text-[22px] font-bold text-navy">طبيعة الخدمة</h2>
              <p>
                أكاديمية ديمة بتقدّم برامج تعليمية في المجالات الصحية والرقمية. المحتوى تعليمي
                عام، وما بيُعتبر استشارة طبية أو تشخيص أو بديل عن الممارسة السريرية المرخّصة.
              </p>

              <h2 className="font-serif text-[22px] font-bold text-navy">التسجيل والقبول</h2>
              <p>
                إرسال طلب الانتساب ما بيعني قبولاً تلقائياً. الأكاديمية بتراجع الطلبات وبتتواصل
                مع المقبولين. بنحتفظ بحق رفض أي طلب أو إيقاف عضوية عند مخالفة الشروط.
              </p>

              <h2 className="font-serif text-[22px] font-bold text-navy">الرسوم والاسترجاع</h2>
              <p>
                الورشة التعريفية مجانية. رسوم أي برنامج مدفوع بتُعلن بوضوح قبل التسجيل، مع سياسة
                استرجاع خاصة فيه. ما بنطلب أي دفعة قبل ما تكون الشروط منشورة على صفحة البرنامج.
              </p>

              <h2 className="font-serif text-[22px] font-bold text-navy">الملكية الفكرية</h2>
              <p>
                المحتوى والمواد والهوية البصرية ملك لأكاديمية ديمة. يُمنع إعادة النشر أو البيع
                دون إذن مكتوب. المشارك بيحتفظ بملكية مشاريعه الخاصة.
              </p>

              <h2 className="font-serif text-[22px] font-bold text-navy">السلوك</h2>
              <p>
                بنتوقع احتراماً متبادلاً في الجلسات والمجموعات. أي إساءة، انتحال، أو مشاركة
                محتوى مرضى بدون موافقة بيؤدي لإيقاف العضوية.
              </p>

              <h2 className="font-serif text-[22px] font-bold text-navy">الشهادات</h2>
              <p>
                شروط أي شهادة بتُعلن مع البرنامج. ما في وعد بشهادة قبل تحديد متطلبات الحضور
                والتسليم.
              </p>

              <h2 className="font-serif text-[22px] font-bold text-navy">التواصل</h2>
              <p>لأي استفسار عن الشروط: {site.email}.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
