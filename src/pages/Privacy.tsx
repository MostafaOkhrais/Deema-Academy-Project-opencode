import { PageHero } from '@/components/PageHero';
import { usePageMeta } from '@/lib/seo';
import { site } from '@/data/site';

export function Privacy() {
  usePageMeta({
    title: 'سياسة الخصوصية | أكاديمية ديمة',
    description: 'كيف تجمع أكاديمية ديمة بياناتك وتستخدمها وتحميها.',
  });

  return (
    <>
      <PageHero
        kicker="الخصوصية"
        breadcrumb={[{ label: 'سياسة الخصوصية' }]}
        title="خصوصيتك، باختصار."
        lead="آخر تحديث: أكتوبر ٢٠٢٦."
      />

      <section className="grid-white">
        <div className="container-page py-14 md:py-20">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-amber-300/70 bg-amber-50 px-5 py-4 text-[12.5px] leading-[1.9] text-amber-900">
              <strong className="font-medium">مسودة:</strong> هالنص نموذج أولي وبيحتاج مراجعة
              قانونية قبل الإطلاق الرسمي. لا تعتمده كسياسة نهائية.
            </div>

            <div className="prose-ar mt-8 space-y-6">
              <h2 className="font-serif text-[22px] font-bold text-navy">شو بنجمع</h2>
              <p>
                لما تعبّي طلب انتساب أو تسجّل بفعالية، بنجمع الاسم، الإيميل، رقم الجوال،
                الجامعة، التخصص، السنة الدراسية، والمدينة. وبنحفظ كمان مسارك المختار وسبب
                اختيارك.
              </p>

              <h2 className="font-serif text-[22px] font-bold text-navy">ليش بنجمعها</h2>
              <p>
                لمراجعة طلبك، التواصل معك بخصوص الأكاديمية، إدارة تسجيلاتك بالفعاليات، وإصدار
                بطاقة العضوية. ما بنستخدم بياناتك لإعلانات طرف تالت.
              </p>

              <h2 className="font-serif text-[22px] font-bold text-navy">مين بيشوفها</h2>
              <p>
                فريق إدارة الأكاديمية المصرّح له فقط. البيانات محفوظة عند مزوّد قاعدة بيانات
                موثوق، والوصول محمي بصلاحيات على مستوى الصفوف.
              </p>

              <h2 className="font-serif text-[22px] font-bold text-navy">حقوقك</h2>
              <p>
                بتقدر تطلب تعديل بياناتك أو حذفها بمراسلتنا على{' '}
                <a href={`mailto:${site.email}`} className="text-sky-deep underline underline-offset-4">
                  {site.email}
                </a>
                . بنستجيب خلال مدة معقولة بعد التحقق من هويتك.
              </p>

              <h2 className="font-serif text-[22px] font-bold text-navy">ملفات الكوكيز</h2>
              <p>
                الموقع بيستخدم تخزين محلي ضروري للحفاظ على جلستك وتفضيلاتك. ما بنستخدم كوكيز
                تتبّع إعلاني.
              </p>

              <h2 className="font-serif text-[22px] font-bold text-navy">التواصل</h2>
              <p>
                لأي سؤال عن الخصوصية، راسلنا على {site.email}. سنحدّث هالصفحة عند أي تغيير
                جوهري.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
