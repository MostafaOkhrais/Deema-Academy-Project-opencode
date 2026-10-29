import { usePageMeta } from '@/lib/seo';
import { Hero } from '@/components/home/Hero';
import { Audience } from '@/components/home/Audience';
import { Principles } from '@/components/home/Principles';
import { Formats } from '@/components/home/Formats';
import { TracksShowcase } from '@/components/home/TracksShowcase';
import { Journey } from '@/components/home/Journey';
import { EventsPreview } from '@/components/home/EventsPreview';
import { Story } from '@/components/home/Story';
import { FaqPreview } from '@/components/home/FaqPreview';
import { JoinCta } from '@/components/home/JoinCta';

export function Home() {
  usePageMeta({
    title: 'أكاديمية ديمة | فكّر خارج الصندوق',
    description:
      'أكاديمية عربية للتعلّم الصحي عن بُعد: الصيدلة السريرية، الذكاء الاصطناعي والصحة الرقمية، المحتوى الطبي، البحث العلمي، والهوية المهنية. تخصصك هو البداية، مش حدود مستقبلك.',
  });

  return (
    <>
      <Hero />
      <Audience />
      <Principles />
      <Formats />
      <TracksShowcase />
      <Journey />
      <EventsPreview />
      <Story />
      <FaqPreview />
      <JoinCta />
    </>
  );
}
