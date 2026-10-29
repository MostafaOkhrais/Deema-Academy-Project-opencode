import { useId, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Accordion({
  items,
  className,
}: {
  items: { q: string; a: string; tag?: string }[];
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className={cn('divide-y divide-line border-y border-line', className)}>
      {items.map((item, index) => {
        const isOpen = open === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;

        return (
          <div key={item.q}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : index)}
                className="flex w-full items-start justify-between gap-6 py-5 text-right"
              >
                <span className="flex flex-col gap-1.5">
                  {item.tag && (
                    <span className="text-[11px] font-medium tracking-wide text-sky-deep">
                      {item.tag}
                    </span>
                  )}
                  <span className="font-sans text-[16px] font-medium leading-[1.7] text-navy md:text-[17px]">
                    {item.q}
                  </span>
                </span>
                <span
                  className={cn(
                    'mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-colors',
                    isOpen
                      ? 'border-navy bg-navy text-white'
                      : 'border-navy/20 text-navy',
                  )}
                >
                  {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                'grid transition-all duration-300 ease-out',
                isOpen ? 'grid-rows-[1fr] pb-6' : 'grid-rows-[0fr]',
              )}
            >
              <div className="overflow-hidden">
                <p className="max-w-3xl text-[15px] leading-[1.95] text-muted">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
