import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function SectionHeader({
  kicker,
  title,
  lead,
  tone = 'light',
  align = 'start',
  action,
  className,
}: {
  kicker: string;
  title: ReactNode;
  lead?: ReactNode;
  tone?: 'light' | 'dark' | 'sky';
  align?: 'start' | 'center';
  action?: ReactNode;
  className?: string;
}) {
  const dark = tone === 'dark';
  const onSky = tone === 'sky';

  return (
    <div
      className={cn(
        'flex flex-col gap-6',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        <span className={cn('kicker', dark && 'kicker-dark', onSky && 'text-navy/70')}>{kicker}</span>
        <h2
          className={cn(
            'mt-4 text-[clamp(1.9rem,3.7vw,3.15rem)] leading-[1.3]',
            dark ? 'text-white' : 'text-navy',
          )}
        >
          {title}
        </h2>
        {lead && (
          <p
            className={cn(
              'mt-4 text-[1.02rem] leading-[1.9]',
              dark ? 'text-white/65' : onSky ? 'text-navy/75' : 'text-muted',
            )}
          >
            {lead}
          </p>
        )}
        {action && <div className="mt-6">{action}</div>}
      </div>
    </div>
  );
}
