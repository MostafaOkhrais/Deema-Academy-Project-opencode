import { supabase } from './supabase';

export type ApplicationInput = {
  full_name: string;
  email: string;
  phone: string;
  university: string;
  university_id?: string;
  major: string;
  year: string;
  city: string;
  track_slug: string;
  track_title: string;
  motivation: string;
  source?: string;
};

const STORAGE_KEY = 'deema_applications';

export type SubmitResult = { ok: true; demo: boolean } | { ok: false; message: string };

export async function submitApplication(input: ApplicationInput): Promise<SubmitResult> {
  if (!supabase) {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as unknown[];
    existing.push({ ...input, created_at: new Date().toISOString(), status: 'pending_demo' });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    await new Promise((r) => setTimeout(r, 650));
    return { ok: true, demo: true };
  }

  const { error } = await supabase.from('applications').insert({
    full_name: input.full_name,
    email: input.email.toLowerCase().trim(),
    phone: input.phone,
    university: input.university,
    university_id: input.university_id?.trim() || null,
    major: input.major,
    year: input.year,
    city: input.city,
    track_slug: input.track_slug,
    track_title: input.track_title,
    motivation: input.motivation,
    source: input.source ?? null,
  });

  if (error) {
    if (error.code === '23505') {
      return {
        ok: false,
        message: 'في طلب مسجّل بنفس الإيميل أو الرقم الجامعي. تواصل معنا إذا بدك تعدّله.',
      };
    }
    return { ok: false, message: 'ما قدرنا نستلم الطلب. جرّب كمان مرة أو ابعتلنا رسالة.' };
  }

  return { ok: true, demo: false };
}

export type ApplicationStatus = {
  full_name: string;
  track_title: string;
  status: string;
  created_at: string;
};

export async function lookupApplication(query: string): Promise<ApplicationStatus[] | null> {
  if (!supabase) return null;

  const { data, error } = await supabase.rpc('lookup_application', {
    p_query: query.trim(),
  });

  if (error) return null;
  return (data as ApplicationStatus[] | null) ?? [];
}
