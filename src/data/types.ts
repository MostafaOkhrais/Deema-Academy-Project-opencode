export type TrackIcon =
  | 'pill'
  | 'brain'
  | 'mic'
  | 'book'
  | 'briefcase';

export type Track = {
  slug: string;
  title: string;
  short: string;
  tagline: string;
  description: string;
  outcomes: string[];
  forWho: string[];
  curriculum: { title: string; detail: string }[];
  format: string;
  duration: string;
  level: string;
  icon: TrackIcon;
  index: string;
};

export type EventType = 'ورشة' | 'لقاء' | 'برنامج';

export type AcademyEvent = {
  slug: string;
  title: string;
  type: EventType;
  summary: string;
  description: string;
  dateLabel: string;
  timeLabel: string;
  location: string;
  mode: 'أونلاين' | 'حضوري' | 'مختلط';
  capacity: number | null;
  seatsLabel: string;
  status: 'open' | 'soon' | 'closed';
  tags: string[];
};

export type FaqCategory =
  | 'التسجيل والمسارات'
  | 'التعلّم والمواعيد'
  | 'الشهادات'
  | 'الرسوم'
  | 'المحتوى';

export type Faq = {
  q: string;
  a: string;
  category: FaqCategory;
};
