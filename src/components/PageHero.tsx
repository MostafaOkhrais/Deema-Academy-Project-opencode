import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function PageHero({
  kicker,
  title,
  lead,
  children,
  breadcrumb,
  className,
}: {
  kicker: string;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
  breadcrumb?: { label: string; to?: string }[];
  className?: string;
}) {
  return (
    <section className={cn('grid-navy relative overflow-hidden text-white', className)}>
      <div className="container-page relative py-14 md:py-20">
        {breadcrumb && (
          <nav aria-label="مسار التنقل" className="mb-8 flex flex-wrap items-center gap-2 text-[12.5px] text-white/45">
            <Link to="/" className="transition-colors hover:text-white">
              الرئيسية
            </Link>
            {breadcrumb.map((item) => (
              <span key={item.label} className="flex items-center gap-2">
                <span aria-hidden="true">/</span>
                {item.to ? (
                  <Link to={item.to} className="transition-colors hover:text-white">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-white/75">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        <span className="kicker kicker-dark">{kicker}</span>
        <h1 className="mt-4 max-w-4xl text-[clamp(2.2rem,5vw,4.2rem)] leading-[1.22]">{title}</h1>
        {lead && <p className="mt-5 max-w-2xl text-[1.02rem] leading-[1.95] text-white/65">{lead}</p>}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
