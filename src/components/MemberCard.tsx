import { QRCodeSVG } from 'qrcode.react';
import { site } from '@/data/site';
import type { Profile } from '@/lib/auth';

export function MemberCard({ profile }: { profile: Profile }) {
  const code = profile.member_code ?? 'DM-PENDING';
  const verifyUrl = `https://${site.domain}/verify/${code}`;

  return (
    <div className="relative overflow-hidden rounded-[26px] border border-navy/15 bg-white shadow-[0_30px_70px_-50px_rgba(0,33,71,0.6)]">
      <div className="grid-paper p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <img src="/brand/deema-mark.png" alt="" className="h-7 w-7" />
            <span dir="ltr" className="text-[10px] font-medium leading-[1.05] text-navy">
              Deema
              <br />
              Academy
            </span>
          </div>
          <span className="rounded-full border border-navy/15 bg-white/70 px-2.5 py-1 text-[9px] text-navy/55">
            عضو معتمد
          </span>
        </div>

        <div className="mt-12">
          <p className="text-[9px] tracking-wide text-navy/40">بطاقة انتساب</p>
          <p className="mt-1 line-clamp-1 font-serif text-[26px] font-black text-navy">
            {profile.full_name}
          </p>
          <p className="mt-1 text-[11px] text-sky-deep">
            {profile.track_title ?? 'عضو أكاديمية ديمة'}
          </p>
        </div>

        <div className="mt-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-[8.5px] text-navy/40">رقم العضوية</p>
            <p dir="ltr" className="mt-0.5 text-left text-[10.5px] font-medium tracking-wide text-navy">
              {code}
            </p>
            <p className="mt-4 text-[8.5px] text-navy/40">العام الأكاديمي</p>
            <p className="mt-0.5 text-[10.5px] font-medium text-navy">{site.year}</p>
          </div>
          <div className="rounded-xl bg-white p-2">
            <QRCodeSVG value={verifyUrl} size={72} bgColor="#ffffff" fgColor="#002147" level="M" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between bg-navy px-6 py-3.5">
        <span className="text-[9px] tracking-[0.15em] text-sky">MEMBER</span>
        <span className="font-serif text-[12.5px] font-bold text-white">أكاديمية ديمة</span>
      </div>
    </div>
  );
}
