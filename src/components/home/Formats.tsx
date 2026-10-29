import { Compass, MessagesSquare, MonitorPlay, Users } from 'lucide-react';
import { formats } from '@/data/site';
import { SectionHeader } from '@/components/SectionHeader';
import { Reveal } from '@/components/Reveal';

const icons = {
  monitor: MonitorPlay,
  message: MessagesSquare,
  users: Users,
  compass: Compass,
} as const;

export function Formats() {
  return (
    <section className="grid-navy text-white">
      <div className="container-page py-20 md:py-28">
        <Reveal>
          <SectionHeader
            tone="dark"
            kicker="صيغ التعلّم"
            title={
              <>
                أربع طرق للتعلّم، <span className="text-sky">بإيقاعك</span>.
              </>
            }
            lead="مش كل حدا بيتعلم بنفس الطريقة. كل مسار بيستخدم مزيج من الصيغ هاي، وبتعرف بالضبط شو متوقع منك قبل التسجيل."
          />
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {formats.map((item, index) => {
            const Icon = icons[item.icon as keyof typeof icons];
            return (
              <Reveal key={item.title} delay={index * 70}>
                <article className="group flex h-full flex-col rounded-[24px] border border-white/12 bg-white/[0.04] p-6 transition-colors duration-300 hover:border-sky/40 hover:bg-white/[0.07]">
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-sky/30 text-sky">
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <span className="mt-6 text-[11px] tracking-wide text-sky/80">{item.meta}</span>
                  <h3 className="mt-2 font-serif text-[20px] font-bold text-white">{item.title}</h3>
                  <p className="mt-2.5 text-[13.5px] leading-[1.9] text-white/55">{item.body}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
