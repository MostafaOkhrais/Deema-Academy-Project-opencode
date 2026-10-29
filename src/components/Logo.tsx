import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function Logo({
  dark = false,
  showWordmark = true,
  className,
}: {
  dark?: boolean;
  showWordmark?: boolean;
  className?: string;
}) {
  return (
    <Link
      to="/"
      dir="ltr"
      aria-label="أكاديمية ديمة — الصفحة الرئيسية"
      className={cn('inline-flex shrink-0 items-center gap-2.5', className)}
    >
      <img
        src="/brand/deema-mark.png"
        alt=""
        width={44}
        height={44}
        className="h-10 w-10 object-contain md:h-11 md:w-11"
      />
      {showWordmark && (
        <span
          dir="ltr"
          className={cn(
            'text-left font-sans text-[16px] font-medium leading-[1.08] tracking-[-0.015em]',
            dark ? 'text-white' : 'text-navy',
          )}
        >
          <span className="block">Deema</span>
          <span className="block">Academy</span>
        </span>
      )}
    </Link>
  );
}
