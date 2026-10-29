import { supabase } from './supabase';

export type Profile = {
  id: string;
  full_name: string;
  email: string;
  member_code: string | null;
  role: 'member' | 'admin' | 'reviewer' | 'applicant';
  track_slug: string | null;
  track_title: string | null;
  university: string | null;
  major: string | null;
  member_since: string | null;
  valid_until: string | null;
  status: string;
  avatar_url: string | null;
};

export async function signIn(email: string, password: string) {
  if (!supabase) throw new Error('demo');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function getCurrentUser() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  if (error) return null;
  return (data as Profile | null) ?? null;
}

export async function activateMember(input: {
  email: string;
  password: string;
  universityId: string;
  memberCode: string;
}) {
  if (!supabase) throw new Error('demo');

  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
  });
  if (error) throw error;

  const { error: claimError } = await supabase.rpc('claim_membership', {
    p_university_id: input.universityId,
    p_member_code: input.memberCode,
  });
  if (claimError) throw claimError;

  return { needsConfirmation: !data.session };
}

export async function claimMembership(universityId: string, memberCode: string) {
  if (!supabase) throw new Error('demo');
  const { error } = await supabase.rpc('claim_membership', {
    p_university_id: universityId,
    p_member_code: memberCode,
  });
  if (error) throw error;
}

export async function requestPasswordReset(email: string) {
  if (!supabase) throw new Error('demo');
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/login`,
  });
  if (error) throw error;
}
