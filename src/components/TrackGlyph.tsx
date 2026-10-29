import { Pill, BrainCircuit, Mic, BookOpen, Briefcase } from 'lucide-react';
import type { TrackIcon } from '@/data/types';
import { cn } from '@/lib/utils';

const icons = {
  pill: Pill,
  brain: BrainCircuit,
  mic: Mic,
  book: BookOpen,
  briefcase: Briefcase,
} satisfies Record<TrackIcon, typeof Pill>;

export function TrackGlyph({
  icon,
  className,
}: {
  icon: TrackIcon;
  className?: string;
}) {
  const Icon = icons[icon];
  return <Icon className={cn('h-6 w-6', className)} strokeWidth={1.7} aria-hidden="true" />;
}
