import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpLeft, MessagesSquare, Search } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { Reveal } from '@/components/Reveal';
import { Accordion } from '@/components/Accordion';
import { JoinCta } from '@/components/home/JoinCta';
import { faqCategories, faqs } from '@/data/faqs';
import { site } from '@/data/site';
import { usePageMeta } from '@/lib/seo';
import { cn } from '@/lib/utils';

export function Faq() {
  usePageMeta({
    title: 'الأسئلة الشائعة | أكاديمية ديمة',
    description:
      'أجوبة عن التسجيل والمسارات، المواعيد، الشهادات، والرسوم في أكاديمية ديمة.',
  });

  const [category, setCategory] = useState<string>('الكل');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqs.filter((item) => {
      const matchesCategory = category === 'الكل' || item.category === category;
      const matchesQuery = !q || item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <>
      <PageHero
        kicker="الأسئلة الشائعة"
        breadcrumb={[{ label: 'الأسئلة' }]}
        title={
          <>
            كل سؤال إله
            <br />
            <span className="text-sky">جواب واضح</span>.
          </>
        }
        lead="جمعنا أكثر الأسئلة اللي بتوصلنا. إذا ما لقيت جوابك، ابعتلنا وبنرد عليك شخصياً."
      />

      <section className="grid-white">
        <div className="container-page py-16 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            <div>
              <div className="lg:sticky lg:top-28">
                <label htmlFor="faq-search" className="sr-only">
                  ابحث في الأسئلة
                </label>
                <div className="relative">
                  <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/35" />
                  <input
                    id="faq-search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="field h-12 pr-11"
                    placeholder="ابحث في الأسئلة..."
                    type="search"
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {faqCategories.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setCategory(item)}
                      className={cn(
                        'rounded-full border px-3.5 py-1.5 text-[12px] transition-colors',
                        category === item
                          ? 'border-navy bg-navy text-white'
                          : 'border-navy/15 text-navy/60 hover:border-navy/35',
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <div className="mt-8 rounded-[24px] border border-navy/10 bg-white p-6">
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-navy/15 text-navy">
                    <MessagesSquare className="h-5 w-5" strokeWidth={1.7} />
                  </span>
                  <h2 className="mt-4 font-serif text-[19px] font-bold text-navy">
                    سؤالك مش هون؟
                  </h2>
                  <p className="mt-2 text-[13px] leading-[1.85] text-muted">
                    ابعتلنا على الإيميل وبنرد عليك شخصياً خلال أيام العمل.
                  </p>
                  <a href={`mailto:${site.email}`} className="btn btn-navy btn-sm mt-5">
                    {site.email}
                  </a>
                  <Link to="/join" className="link-arrow mt-4 text-navy">
                    أو سجّل بالأكاديمية
                    <ArrowUpLeft className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            <Reveal>
              <div className="flex items-center justify-between gap-4">
                <p className="text-[12.5px] text-navy/45">
                  {filtered.length} سؤال
                  {category !== 'الكل' && ` في «${category}»`}
                </p>
                {(query || category !== 'الكل') && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      setCategory('الكل');
                    }}
                    className="text-[12px] font-medium text-sky-deep underline decoration-sky-deep/30 underline-offset-4"
                  >
                    مسح البحث
                  </button>
                )}
              </div>

              {filtered.length > 0 ? (
                <Accordion
                  key={`${category}-${query}`}
                  className="mt-4"
                  items={filtered.map((item) => ({
                    q: item.q,
                    a: item.a,
                    tag: item.category,
                  }))}
                />
              ) : (
                <div className="mt-6 rounded-[24px] border border-dashed border-navy/20 p-10 text-center">
                  <p className="font-serif text-[18px] font-bold text-navy">ما في نتائج مطابقة</p>
                  <p className="mt-2 text-[13px] text-muted">
                    جرّب كلمة أبسط، أو اختار «الكل» وشوف كل الأسئلة.
                  </p>
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      <JoinCta />
    </>
  );
}
