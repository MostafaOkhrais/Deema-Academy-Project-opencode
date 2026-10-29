import { supabase } from './supabase';

const KEY = 'deema_event_interest';

export type EventInterestInput = {
  event_slug: string;
  event_title: string;
  full_name: string;
  email: string;
  phone: string;
  university_id?: string;
};

export type InterestResult = { ok: true; demo: boolean } | { ok: false; message: string };

export async function registerInterest(input: EventInterestInput): Promise<InterestResult> {
  if (!supabase) {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? '[]') as unknown[];
    saved.push({ ...input, created_at: new Date().toISOString() });
    localStorage.setItem(KEY, JSON.stringify(saved));
    await new Promise((r) => setTimeout(r, 600));
    return { ok: true, demo: true };
  }

  const { error } = await supabase.from('event_registrations').insert({
    event_slug: input.event_slug,
    full_name: input.full_name,
    email: input.email.toLowerCase().trim(),
    phone: input.phone,
    university_id: input.university_id ?? null,
    status: 'interest',
  });

  if (error) {
    if (error.code === '23505') return { ok: true, demo: false };
    return { ok: false, message: 'ما قدرنا نسجّل اهتمامك. جرّب مرة تانية.' };
  }

  return { ok: true, demo: false };
}
