import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  ArrowUpLeft,
  CalendarDays,
  Check,
  ClipboardList,
  Download,
  LayoutDashboard,
  Loader2,
  LogOut,
  RefreshCw,
  Search,
  ShieldAlert,
  Users,
  X,
} from 'lucide-react';
import { events } from '@/data/events';
import { getCurrentUser, getProfile, signOut, type Profile } from '@/lib/auth';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { usePageMeta } from '@/lib/seo';
import { cn } from '@/lib/utils';

type Tab = 'overview' | 'applications' | 'members' | 'registrations';

type AppRow = {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  university: string | null;
  major: string | null;
  year: string | null;
  city: string | null;
  track_title: string;
  status: string;
  member_code: string | null;
};

type MemberRow = {
  id: string;
  full_name: string;
  email: string;
  member_code: string | null;
  track_title: string | null;
  role: string;
  status: string;
};

type RegRow = {
  id: string;
  event_slug: string;
  full_name: string;
  email: string;
  phone: string | null;
  status: string;
  created_at: string;
};

const demoApplications: AppRow[] = [
  {
    id: '1',
    created_at: '2026-10-27T10:12:00Z',
    full_name: 'سارة خالد',
    email: 'sara@example.com',
    phone: '0599000001',
    university: 'جامعة فلسطين',
    major: 'صيدلة',
    year: 'السنة الرابعة',
    city: 'غزة',
    track_title: 'الذكاء الاصطناعي والصحة الرقمية',
    status: 'pending',
    member_code: null,
  },
  {
    id: '2',
    created_at: '2026-10-26T18:30:00Z',
    full_name: 'محمد سامي',
    email: 'moh@example.com',
    phone: '0599000002',
    university: 'الجامعة الإسلامية',
    major: 'طب',
    year: 'السنة الثالثة',
    city: 'خانيونس',
    track_title: 'البحث العلمي والكتابة الأكاديمية',
    status: 'accepted',
    member_code: 'DM-2026-1042',
  },
  {
    id: '3',
    created_at: '2026-10-25T09:05:00Z',
    full_name: 'لينا عادل',
    email: 'lina@example.com',
    phone: '0599000003',
    university: 'جامعة الأزهر',
    major: 'تغذية',
    year: 'خريج/ة',
    city: 'دير البلح',
    track_title: 'الهوية المهنية والعمل عن بُعد',
    status: 'pending',
    member_code: null,
  },
];

const demoMembers: MemberRow[] = [
  {
    id: 'm1',
    full_name: 'محمد سامي',
    email: 'moh@example.com',
    member_code: 'DM-2026-1042',
    track_title: 'البحث العلمي والكتابة الأكاديمية',
    role: 'member',
    status: 'active',
  },
  {
    id: 'm2',
    full_name: 'رهف يوسف',
    email: 'rahaf@example.com',
    member_code: 'DM-2026-0987',
    track_title: 'صناعة المحتوى الطبي',
    role: 'member',
    status: 'active',
  },
];

const demoRegs: RegRow[] = [
  {
    id: 'r1',
    event_slug: 'free-intro-workshop',
    full_name: 'سارة خالد',
    email: 'sara@example.com',
    phone: '0599000001',
    status: 'interest',
    created_at: '2026-10-27T11:00:00Z',
  },
  {
    id: 'r2',
    event_slug: 'free-intro-workshop',
    full_name: 'لينا عادل',
    email: 'lina@example.com',
    phone: '0599000003',
    status: 'interest',
    created_at: '2026-10-26T15:00:00Z',
  },
];

const statusLabels: Record<string, string> = {
  pending: 'قيد المراجعة',
  accepted: 'مقبول',
  rejected: 'مرفوض',
  interview: 'مقابلة',
  active: 'فعّال',
  interest: 'اهتمام',
  registered: 'مسجّل',
  attended: 'حضر',
};

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  accepted: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-800',
  interview: 'bg-sky-100 text-sky-800',
  active: 'bg-emerald-100 text-emerald-800',
  interest: 'bg-sky-100 text-sky-800',
  registered: 'bg-emerald-100 text-emerald-800',
  attended: 'bg-navy/10 text-navy',
};

function generateMemberCode() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `DM-2026-${n}`;
}

export function Admin() {
  usePageMeta({ title: 'لوحة التحكم | أكاديمية ديمة', noindex: true });

  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [applications, setApplications] = useState<AppRow[]>([]);
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [registrations, setRegistrations] = useState<RegRow[]>([]);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const demo = !isSupabaseConfigured;

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (demo) {
        setApplications(demoApplications);
        setMembers(demoMembers);
        setRegistrations(demoRegs);
        setLoading(false);
        return;
      }

      const user = await getCurrentUser();
      if (!user) {
        navigate('/login', { replace: true });
        return;
      }

      const data = await getProfile(user.id);
      if (!mounted) return;

      if (!data || !['admin', 'reviewer'].includes(data.role)) {
        setProfile(data);
        setLoading(false);
        return;
      }

      setProfile(data);

      const [apps, mems, regs] = await Promise.all([
        supabase!.from('applications').select('*').order('created_at', { ascending: false }),
        supabase!
          .from('profiles')
          .select('id, full_name, email, member_code, track_title, role, status')
          .order('member_code', { ascending: false }),
        supabase!
          .from('event_registrations')
          .select('id, event_slug, full_name, email, phone, status, created_at')
          .order('created_at', { ascending: false }),
      ]);

      if (!mounted) return;
      setApplications((apps.data as AppRow[]) ?? []);
      setMembers((mems.data as MemberRow[]) ?? []);
      setRegistrations((regs.data as RegRow[]) ?? []);
      setLoading(false);
    }

    load();
    return () => {
      mounted = false;
    };
  }, [demo, navigate]);

  const filteredApplications = useMemo(() => {
    const q = query.trim().toLowerCase();
    return applications.filter((row) => {
      const matchesStatus = filter === 'all' || row.status === filter;
      const matchesQuery =
        !q ||
        row.full_name.toLowerCase().includes(q) ||
        row.email.toLowerCase().includes(q) ||
        row.track_title.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [applications, filter, query]);

  const updateApplication = async (row: AppRow, status: string) => {
    if (demo) {
      toast.info('الوضع تجريبي — التعديلات ما بتنحفظ.');
      return;
    }

    const memberCode = status === 'accepted' ? row.member_code ?? generateMemberCode() : row.member_code;

    const { error } = await supabase!
      .from('applications')
      .update({ status, member_code: memberCode })
      .eq('id', row.id);

    if (error) {
      toast.error('ما قدرنا نحدّث الطلب.');
      return;
    }

    setApplications((prev) =>
      prev.map((item) => (item.id === row.id ? { ...item, status, member_code: memberCode } : item)),
    );
    toast.success(
      status === 'accepted'
        ? `تم القبول. رمز العضوية: ${memberCode}`
        : 'تم تحديث حالة الطلب.',
    );
  };

  const exportCsv = () => {
    const header = ['الاسم', 'الإيميل', 'الجوال', 'الفعالية', 'الحالة', 'التاريخ'];
    const rows = registrations.map((row) => [
      row.full_name,
      row.email,
      row.phone ?? '',
      events.find((e) => e.slug === row.event_slug)?.title ?? row.event_slug,
      statusLabels[row.status] ?? row.status,
      new Date(row.created_at).toLocaleDateString('ar-EG'),
    ]);
    const csv = [header, ...rows].map((line) => line.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'deema-registrations.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const logout = async () => {
    await signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="grid-white">
        <div className="container-page grid min-h-[50vh] place-items-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-sky-deep" />
        </div>
      </div>
    );
  }

  if (!demo && (!profile || !['admin', 'reviewer'].includes(profile.role))) {
    return (
      <section className="grid-white">
        <div className="container-page py-20">
          <div className="mx-auto max-w-md rounded-[28px] border border-line bg-white p-8 text-center">
            <ShieldAlert className="mx-auto h-9 w-9 text-sky-deep" strokeWidth={1.6} />
            <h1 className="mt-4 font-serif text-[22px] font-bold text-navy">ما عندك صلاحية</h1>
            <p className="mt-2 text-[13px] leading-[1.9] text-muted">
              هالصفحة مخصصة لفريق إدارة الأكاديمية. إذا بتعتقد إنه في خطأ، تواصل معنا.
            </p>
            <Link to="/" className="btn btn-navy btn-sm mt-6">
              الرئيسية
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const stats = [
    {
      label: 'طلبات جديدة',
      value: applications.filter((a) => a.status === 'pending').length,
      icon: ClipboardList,
    },
    { label: 'أعضاء فعّالون', value: members.filter((m) => m.status === 'active').length, icon: Users },
    {
      label: 'اهتمام بالفعاليات',
      value: registrations.filter((r) => r.status === 'interest').length,
      icon: CalendarDays,
    },
    { label: 'إجمالي الطلبات', value: applications.length, icon: LayoutDashboard },
  ];

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'overview', label: 'نظرة عامة' },
    { key: 'applications', label: 'الطلبات', count: applications.filter((a) => a.status === 'pending').length },
    { key: 'members', label: 'الأعضاء', count: members.length },
    { key: 'registrations', label: 'الفعاليات', count: registrations.length },
  ];

  return (
    <div className="min-h-screen bg-[#f7f9fa]">
      <div className="container-page py-8 md:py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] text-sky-deep">إدارة الأكاديمية</p>
            <h1 className="mt-1 font-serif text-[26px] font-black text-navy">لوحة التحكم</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {demo && (
              <span className="rounded-full bg-amber-100 px-3 py-1.5 text-[11px] text-amber-800">
                وضع تجريبي
              </span>
            )}
            <Link to="/" className="btn btn-outline btn-sm">
              الموقع
              <ArrowUpLeft className="h-3.5 w-3.5" />
            </Link>
            {!demo && (
              <button type="button" onClick={logout} className="btn btn-outline btn-sm">
                <LogOut className="h-4 w-4" />
                خروج
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[210px_1fr]">
          <nav className="flex gap-1 overflow-x-auto rounded-2xl border border-line bg-white p-2 lg:flex-col lg:overflow-visible">
            {tabs.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                className={cn(
                  'flex shrink-0 items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 text-right text-[13px] transition-colors',
                  tab === item.key
                    ? 'bg-navy text-white'
                    : 'text-navy/65 hover:bg-paper',
                )}
              >
                <span>{item.label}</span>
                {typeof item.count === 'number' && (
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[10px]',
                      tab === item.key ? 'bg-white/15 text-sky' : 'bg-paper-deep text-navy/50',
                    )}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div>
            {tab === 'overview' && (
              <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {stats.map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-line bg-white p-5">
                      <stat.icon className="h-5 w-5 text-sky-deep" strokeWidth={1.7} />
                      <p className="mt-4 font-serif text-[28px] font-black leading-none text-navy">
                        {stat.value}
                      </p>
                      <p className="mt-2 text-[12px] text-navy/50">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="overflow-hidden rounded-2xl border border-line bg-white">
                  <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
                    <h2 className="font-serif text-[17px] font-bold text-navy">آخر الطلبات</h2>
                    <button
                      type="button"
                      onClick={() => setTab('applications')}
                      className="text-[12px] font-medium text-sky-deep"
                    >
                      عرض الكل
                    </button>
                  </div>
                  <ApplicationsTable
                    rows={applications.slice(0, 4)}
                    onUpdate={updateApplication}
                    compact
                  />
                </div>
              </div>
            )}

            {tab === 'applications' && (
              <div className="overflow-hidden rounded-2xl border border-line bg-white">
                <div className="flex flex-col gap-3 border-b border-line px-5 py-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: 'all', label: 'الكل' },
                      { key: 'pending', label: 'قيد المراجعة' },
                      { key: 'accepted', label: 'مقبول' },
                      { key: 'rejected', label: 'مرفوض' },
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setFilter(item.key)}
                        className={cn(
                          'rounded-full px-3 py-1.5 text-[11.5px] transition-colors',
                          filter === item.key
                            ? 'bg-navy text-white'
                            : 'border border-navy/12 text-navy/55 hover:border-navy/30',
                        )}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/30" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="ابحث بالاسم أو الإيميل..."
                      className="field h-10 w-full pr-9 text-[12.5px] md:w-64"
                    />
                  </div>
                </div>
                <ApplicationsTable rows={filteredApplications} onUpdate={updateApplication} />
              </div>
            )}

            {tab === 'members' && (
              <div className="overflow-hidden rounded-2xl border border-line bg-white">
                <div className="border-b border-line px-5 py-4">
                  <h2 className="font-serif text-[17px] font-bold text-navy">الأعضاء</h2>
                  <p className="mt-1 text-[11.5px] text-navy/45">
                    {members.length} عضو مسجّل — البطاقات بتصدر تلقائياً عند القبول.
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[680px] text-right">
                    <thead>
                      <tr className="text-[11px] text-navy/40">
                        <th className="px-5 py-3 font-medium">الاسم</th>
                        <th className="px-5 py-3 font-medium">رقم العضوية</th>
                        <th className="px-5 py-3 font-medium">المسار</th>
                        <th className="px-5 py-3 font-medium">الدور</th>
                        <th className="px-5 py-3 font-medium">الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((member) => (
                        <tr key={member.id} className="border-t border-line text-[12.5px]">
                          <td className="px-5 py-3.5">
                            <p className="font-medium text-navy">{member.full_name}</p>
                            <p dir="ltr" className="text-left text-[11px] text-navy/40">
                              {member.email}
                            </p>
                          </td>
                          <td dir="ltr" className="px-5 py-3.5 text-left text-navy/70">
                            {member.member_code ?? '—'}
                          </td>
                          <td className="px-5 py-3.5 text-navy/70">{member.track_title ?? '—'}</td>
                          <td className="px-5 py-3.5 text-navy/50">{member.role}</td>
                          <td className="px-5 py-3.5">
                            <span
                              className={cn(
                                'rounded-full px-2.5 py-1 text-[10.5px]',
                                statusStyles[member.status] ?? 'bg-paper text-navy/60',
                              )}
                            >
                              {statusLabels[member.status] ?? member.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {members.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-5 py-10 text-center text-[12px] text-navy/40">
                            ما في أعضاء بعد.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab === 'registrations' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white px-5 py-4">
                  <div>
                    <h2 className="font-serif text-[17px] font-bold text-navy">تسجيلات الفعاليات</h2>
                    <p className="mt-1 text-[11.5px] text-navy/45">
                      {registrations.length} تسجيل — اهتمامات وتأكيدات.
                    </p>
                  </div>
                  <button type="button" onClick={exportCsv} className="btn btn-navy btn-sm">
                    <Download className="h-4 w-4" />
                    تصدير CSV
                  </button>
                </div>

                {events.map((event) => {
                  const rows = registrations.filter((r) => r.event_slug === event.slug);
                  return (
                    <div key={event.slug} className="overflow-hidden rounded-2xl border border-line bg-white">
                      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
                        <p className="text-[13px] font-medium text-navy">{event.title}</p>
                        <span className="text-[11px] text-navy/40">{rows.length}</span>
                      </div>
                      {rows.length > 0 ? (
                        <ul className="divide-y divide-line">
                          {rows.map((row) => (
                            <li key={row.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                              <div>
                                <p className="text-[12.5px] text-navy">{row.full_name}</p>
                                <p dir="ltr" className="text-left text-[10.5px] text-navy/40">
                                  {row.email} {row.phone ? `· ${row.phone}` : ''}
                                </p>
                              </div>
                              <span
                                className={cn(
                                  'rounded-full px-2.5 py-1 text-[10px]',
                                  statusStyles[row.status] ?? 'bg-paper text-navy/60',
                                )}
                              >
                                {statusLabels[row.status] ?? row.status}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="px-5 py-6 text-[11.5px] text-navy/35">ما في تسجيلات بعد.</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ApplicationsTable({
  rows,
  onUpdate,
  compact = false,
}: {
  rows: AppRow[];
  onUpdate: (row: AppRow, status: string) => void;
  compact?: boolean;
}) {
  if (rows.length === 0) {
    return <p className="px-5 py-10 text-center text-[12px] text-navy/40">ما في طلبات مطابقة.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-right">
        <thead>
          <tr className="text-[11px] text-navy/40">
            <th className="px-5 py-3 font-medium">المتقدّم</th>
            <th className="px-5 py-3 font-medium">الجامعة / التخصص</th>
            <th className="px-5 py-3 font-medium">المسار</th>
            <th className="px-5 py-3 font-medium">الحالة</th>
            {!compact && <th className="px-5 py-3 font-medium">إجراءات</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-line align-top text-[12.5px]">
              <td className="px-5 py-3.5">
                <p className="font-medium text-navy">{row.full_name}</p>
                <p dir="ltr" className="text-left text-[11px] text-navy/40">
                  {row.email}
                </p>
                <p className="mt-0.5 text-[10.5px] text-navy/35">
                  {new Date(row.created_at).toLocaleDateString('ar-EG', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </p>
              </td>
              <td className="px-5 py-3.5">
                <p className="text-navy/70">{row.university ?? '—'}</p>
                <p className="text-[11px] text-navy/40">
                  {row.major ?? '—'} {row.year ? `· ${row.year}` : ''}
                </p>
              </td>
              <td className="px-5 py-3.5 text-[11.5px] text-navy/70">{row.track_title}</td>
              <td className="px-5 py-3.5">
                <span
                  className={cn(
                    'inline-block rounded-full px-2.5 py-1 text-[10.5px]',
                    statusStyles[row.status] ?? 'bg-paper text-navy/60',
                  )}
                >
                  {statusLabels[row.status] ?? row.status}
                </span>
                {row.member_code && (
                  <p dir="ltr" className="mt-1 text-left text-[10px] text-navy/40">
                    {row.member_code}
                  </p>
                )}
              </td>
              {!compact && (
                <td className="px-5 py-3.5">
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => onUpdate(row, 'accepted')}
                      className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-1 text-[10.5px] text-white"
                    >
                      <Check className="h-3 w-3" />
                      قبول
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdate(row, 'rejected')}
                      className="inline-flex items-center gap-1 rounded-full border border-red-200 px-2.5 py-1 text-[10.5px] text-red-700"
                    >
                      <X className="h-3 w-3" />
                      رفض
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdate(row, 'pending')}
                      className="inline-flex items-center gap-1 rounded-full border border-navy/15 px-2.5 py-1 text-[10.5px] text-navy/55"
                    >
                      <RefreshCw className="h-3 w-3" />
                      إرجاع
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
