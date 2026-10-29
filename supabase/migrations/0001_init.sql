-- =============================================================================
-- Deema Academy — initial schema
-- Run with: supabase db push   (or paste into the Supabase SQL editor)
--
-- Notes:
--  * Public marketing content still lives in src/data/* for now; the tables
--    below are the backend of record for applications, members, events and
--    the admin portal.
--  * Member validity is set to one year by default. Adjust the policy in
--    claim_membership() once the membership model is confirmed.
-- =============================================================================

create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- Helpers
-- -----------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- Tables
-- -----------------------------------------------------------------------------

create table public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  full_name     text not null default '',
  email         text not null default '',
  university_id text,
  member_code   text,
  role          text not null default 'applicant'
                check (role in ('applicant', 'member', 'reviewer', 'admin')),
  status        text not null default 'pending'
                check (status in ('pending', 'active', 'expired', 'suspended')),
  track_slug    text,
  track_title   text,
  university    text,
  major         text,
  member_since  date,
  valid_until   date,
  avatar_url    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create unique index profiles_member_code_uq
  on public.profiles (upper(member_code))
  where member_code is not null;

create index profiles_email_idx on public.profiles (lower(email));
create index profiles_role_idx on public.profiles (role);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create table public.applications (
  id            uuid primary key default gen_random_uuid(),
  full_name     text not null,
  email         text not null,
  phone         text not null,
  university    text not null,
  university_id text,
  major         text not null,
  year          text not null,
  city          text not null,
  track_slug    text not null,
  track_title   text not null,
  motivation    text not null default '',
  source        text,
  status        text not null default 'pending'
                check (status in ('pending', 'reviewing', 'waitlisted', 'accepted', 'rejected')),
  member_code   text,
  review_notes  text,
  reviewed_by   uuid references auth.users (id) on delete set null,
  reviewed_at   timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create unique index applications_email_active_uq
  on public.applications (lower(email))
  where status <> 'rejected';

create unique index applications_member_code_uq
  on public.applications (upper(member_code))
  where member_code is not null;

create index applications_status_idx on public.applications (status);
create index applications_created_idx on public.applications (created_at desc);

create table public.event_registrations (
  id            uuid primary key default gen_random_uuid(),
  event_slug    text not null,
  event_title   text not null,
  user_id       uuid references auth.users (id) on delete set null,
  full_name     text not null,
  email         text not null,
  phone         text not null default '',
  university_id text,
  status        text not null default 'interest'
                check (status in ('interest', 'registered', 'waitlisted', 'attended', 'cancelled')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create unique index event_registrations_unique
  on public.event_registrations (event_slug, lower(email));

create index event_registrations_created_idx
  on public.event_registrations (created_at desc);

create table public.tracks (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  short        text not null,
  tagline      text not null default '',
  description  text not null default '',
  level        text not null default '',
  format       text not null default '',
  duration     text not null default '',
  icon         text not null default 'pill',
  track_number integer not null default 1,
  outcomes     text[] not null default '{}',
  for_who      text[] not null default '{}',
  curriculum   jsonb not null default '[]'::jsonb,
  is_published boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table public.events (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  type        text not null default 'ورشة',
  summary     text not null default '',
  description text not null default '',
  date_label  text not null default 'التاريخ يُعلن قريباً',
  time_label  text,
  location    text,
  mode        text not null default 'أونلاين',
  capacity    integer,
  seats_label text,
  status      text not null default 'soon'
              check (status in ('open', 'soon', 'closed')),
  starts_at   timestamptz,
  cover_url   text,
  tags        text[] not null default '{}',
  is_published boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.announcements (
  id         uuid primary key default gen_random_uuid(),
  message    text not null,
  href       text,
  link_label text,
  is_active  boolean not null default true,
  starts_at  timestamptz,
  ends_at    timestamptz,
  created_at timestamptz not null default now()
);

create table public.faqs (
  id           uuid primary key default gen_random_uuid(),
  category     text not null default 'عام',
  question     text not null,
  answer       text not null,
  sort_order   integer not null default 0,
  is_published boolean not null default true,
  created_at   timestamptz not null default now()
);

create unique index faqs_question_uq on public.faqs (question);

create table public.team (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  role         text not null default '',
  bio          text not null default '',
  photo_url    text,
  sort_order   integer not null default 0,
  is_published boolean not null default true,
  created_at   timestamptz not null default now()
);

create table public.certificates (
  id                uuid primary key default gen_random_uuid(),
  profile_id        uuid not null references public.profiles (id) on delete cascade,
  track_slug        text not null,
  title             text not null,
  issued_at         date not null default current_date,
  file_url          text,
  verification_code text not null unique,
  status            text not null default 'valid'
                    check (status in ('valid', 'revoked')),
  created_at        timestamptz not null default now()
);

create table public.complaints (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles (id) on delete set null,
  name       text not null default '',
  email      text not null,
  subject    text not null,
  message    text not null,
  status     text not null default 'new'
             check (status in ('new', 'in_review', 'resolved')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.audit_log (
  id          bigint generated always as identity primary key,
  actor_id    uuid references auth.users (id) on delete set null,
  action      text not null,
  entity_type text not null,
  entity_id   text,
  metadata    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Auth: create a profile for every new user
-- -----------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.email, '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -----------------------------------------------------------------------------
-- updated_at triggers
-- -----------------------------------------------------------------------------

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger applications_updated_at
  before update on public.applications
  for each row execute function public.set_updated_at();

create trigger event_registrations_updated_at
  before update on public.event_registrations
  for each row execute function public.set_updated_at();

create trigger tracks_updated_at
  before update on public.tracks
  for each row execute function public.set_updated_at();

create trigger events_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

create trigger complaints_updated_at
  before update on public.complaints
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Member codes
-- -----------------------------------------------------------------------------

create sequence if not exists public.member_code_seq start with 1042;

create or replace function public.generate_member_code()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code text;
begin
  v_code := 'DM-2026-' || lpad(nextval('public.member_code_seq')::text, 4, '0');
  return v_code;
end;
$$;

revoke all on function public.generate_member_code() from public;

-- -----------------------------------------------------------------------------
-- Accept an application (admin only) — atomic code generation
-- -----------------------------------------------------------------------------

create or replace function public.accept_application(p_application_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_app  public.applications;
  v_code text;
begin
  if not public.is_admin() then
    raise exception 'غير مصرّح لك بهذا الإجراء.' using errcode = '42501';
  end if;

  select * into v_app
  from public.applications
  where id = p_application_id
  for update;

  if not found then
    raise exception 'الطلب غير موجود.' using errcode = 'P0001';
  end if;

  v_code := coalesce(v_app.member_code, public.generate_member_code());

  update public.applications
  set status = 'accepted',
      member_code = v_code,
      reviewed_by = auth.uid(),
      reviewed_at = now()
  where id = p_application_id;

  insert into public.audit_log (actor_id, action, entity_type, entity_id, metadata)
  values (
    auth.uid(),
    'application.accepted',
    'application',
    p_application_id::text,
    jsonb_build_object('member_code', v_code)
  );

  return v_code;
end;
$$;

revoke all on function public.accept_application(uuid) from public;
grant execute on function public.accept_application(uuid) to authenticated;

-- -----------------------------------------------------------------------------
-- Claim a membership after signing up
--
-- The applicant signs up with the same email used in the application, then
-- submits the member code + university ID from the acceptance email.
-- If the application has no university ID (graduates), the email + code are
-- the verification factors.
-- -----------------------------------------------------------------------------

create or replace function public.claim_membership(
  p_university_id text,
  p_member_code text
)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid    uuid := auth.uid();
  v_email  text;
  v_app    public.applications;
  v_profile public.profiles;
begin
  if v_uid is null then
    raise exception 'لازم تسجّل دخول أول.' using errcode = '42501';
  end if;

  if coalesce(trim(p_member_code), '') = '' then
    raise exception 'رمز العضوية مطلوب.' using errcode = '22023';
  end if;

  select email into v_email from auth.users where id = v_uid;

  select * into v_app
  from public.applications
  where status = 'accepted'
    and upper(member_code) = upper(trim(p_member_code))
  limit 1;

  if not found then
    raise exception 'ما لقينا طلب مقبول بهذا الرمز. تأكد من الرمز أو تواصل معنا.'
      using errcode = 'P0001';
  end if;

  if lower(v_app.email) <> lower(coalesce(v_email, '')) then
    raise exception 'الإيميل المستخدم لا يطابق الإيميل المسجّل في الطلب.'
      using errcode = 'P0001';
  end if;

  if v_app.university_id is not null
     and coalesce(trim(p_university_id), '') <> ''
     and upper(trim(v_app.university_id)) <> upper(trim(p_university_id)) then
    raise exception 'الرقم الجامعي لا يطابق الطلب.' using errcode = 'P0001';
  end if;

  if exists (
    select 1 from public.profiles
    where upper(member_code) = upper(v_app.member_code)
      and id <> v_uid
  ) then
    raise exception 'رمز العضوية مستخدم مسبقاً. تواصل معنا.' using errcode = 'P0001';
  end if;

  insert into public.profiles (
    id, full_name, email, university_id, member_code, role, status,
    track_slug, track_title, university, major, member_since, valid_until
  )
  values (
    v_uid, v_app.full_name, v_email, v_app.university_id, v_app.member_code,
    'member', 'active', v_app.track_slug, v_app.track_title, v_app.university,
    v_app.major, current_date, (current_date + interval '1 year')::date
  )
  on conflict (id) do update
    set full_name = excluded.full_name,
        email = excluded.email,
        university_id = excluded.university_id,
        member_code = excluded.member_code,
        role = 'member',
        status = 'active',
        track_slug = excluded.track_slug,
        track_title = excluded.track_title,
        university = excluded.university,
        major = excluded.major,
        member_since = excluded.member_since,
        valid_until = excluded.valid_until,
        updated_at = now()
    where profiles.role <> 'admin';

  select * into v_profile from public.profiles where id = v_uid;
  return v_profile;
end;
$$;

revoke all on function public.claim_membership(text, text) from public;
grant execute on function public.claim_membership(text, text) to authenticated;

-- -----------------------------------------------------------------------------
-- Safe public application lookup (no direct table access)
-- -----------------------------------------------------------------------------

create or replace function public.lookup_application(p_query text)
returns table (
  full_name   text,
  track_title text,
  status      text,
  created_at  timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select a.full_name, a.track_title, a.status, a.created_at
  from public.applications a
  where lower(a.email) = lower(trim(p_query))
     or a.phone = trim(p_query)
  order by a.created_at desc
  limit 5;
$$;

revoke all on function public.lookup_application(text) from public;
grant execute on function public.lookup_application(text) to anon, authenticated;

-- -----------------------------------------------------------------------------
-- Member self-service (safe columns only)
-- -----------------------------------------------------------------------------

create or replace function public.update_my_profile(
  p_full_name text,
  p_avatar_url text default null
)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  v_profile public.profiles;
begin
  if auth.uid() is null then
    raise exception 'لازم تسجّل دخول أول.' using errcode = '42501';
  end if;

  update public.profiles
  set full_name = coalesce(nullif(trim(p_full_name), ''), full_name),
      avatar_url = coalesce(p_avatar_url, avatar_url),
      updated_at = now()
  where id = auth.uid()
  returning * into v_profile;

  if v_profile.id is null then
    raise exception 'الملف غير موجود.' using errcode = 'P0001';
  end if;

  return v_profile;
end;
$$;

revoke all on function public.update_my_profile(text, text) from public;
grant execute on function public.update_my_profile(text, text) to authenticated;

-- -----------------------------------------------------------------------------
-- Public member cards (verification page)
--
-- Security definer view: runs with the owner's rights so anon never gets
-- access to the profiles table, and exposes only the fields printed on a
-- public card. Active members only.
-- -----------------------------------------------------------------------------

create or replace view public.public_member_cards
with (security_barrier = true)
as
select
  member_code,
  full_name,
  track_title,
  status,
  member_since,
  valid_until
from public.profiles
where role = 'member'
  and status = 'active'
  and member_code is not null;

revoke all on public.public_member_cards from public;
grant select on public.public_member_cards to anon, authenticated;

-- -----------------------------------------------------------------------------
-- Row level security
-- -----------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.applications enable row level security;
alter table public.event_registrations enable row level security;
alter table public.tracks enable row level security;
alter table public.events enable row level security;
alter table public.announcements enable row level security;
alter table public.faqs enable row level security;
alter table public.team enable row level security;
alter table public.certificates enable row level security;
alter table public.complaints enable row level security;
alter table public.audit_log enable row level security;

-- Profiles
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  to authenticated
  using (id = auth.uid() or public.is_admin());

create policy "profiles_admin_write"
  on public.profiles for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Applications: anyone may apply; only admins may read/update.
create policy "applications_insert_public"
  on public.applications for insert
  to anon, authenticated
  with check (status = 'pending' and member_code is null);

create policy "applications_admin_select"
  on public.applications for select
  to authenticated
  using (public.is_admin());

create policy "applications_admin_update"
  on public.applications for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Event interest: public insert, admin read.
create policy "registrations_insert_public"
  on public.event_registrations for insert
  to anon, authenticated
  with check (status = 'interest');

create policy "registrations_admin_select"
  on public.event_registrations for select
  to authenticated
  using (public.is_admin());

create policy "registrations_admin_update"
  on public.event_registrations for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Public content
create policy "tracks_public_read"
  on public.tracks for select
  to anon, authenticated
  using (is_published);

create policy "tracks_admin_write"
  on public.tracks for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "events_public_read"
  on public.events for select
  to anon, authenticated
  using (is_published);

create policy "events_admin_write"
  on public.events for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "announcements_public_read"
  on public.announcements for select
  to anon, authenticated
  using (
    is_active
    and (starts_at is null or starts_at <= now())
    and (ends_at is null or ends_at > now())
  );

create policy "announcements_admin_write"
  on public.announcements for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "faqs_public_read"
  on public.faqs for select
  to anon, authenticated
  using (is_published);

create policy "faqs_admin_write"
  on public.faqs for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "team_public_read"
  on public.team for select
  to anon, authenticated
  using (is_published);

create policy "team_admin_write"
  on public.team for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Certificates: the owner or an admin.
create policy "certificates_select_own_or_admin"
  on public.certificates for select
  to authenticated
  using (profile_id = auth.uid() or public.is_admin());

create policy "certificates_admin_write"
  on public.certificates for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Complaints: public insert, admin triage.
create policy "complaints_insert_public"
  on public.complaints for insert
  to anon, authenticated
  with check (status = 'new');

create policy "complaints_admin_select"
  on public.complaints for select
  to authenticated
  using (public.is_admin());

create policy "complaints_admin_update"
  on public.complaints for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Audit log: admins read; writes happen only inside security-definer functions.
create policy "audit_log_admin_select"
  on public.audit_log for select
  to authenticated
  using (public.is_admin());

-- -----------------------------------------------------------------------------
-- Grants (RLS still decides which rows are visible)
-- -----------------------------------------------------------------------------

grant usage on schema public to anon, authenticated;

grant select on
  public.tracks,
  public.events,
  public.announcements,
  public.faqs,
  public.team
to anon, authenticated;

grant insert on
  public.applications,
  public.event_registrations,
  public.complaints
to anon, authenticated;

grant select, insert, update, delete on
  public.profiles,
  public.applications,
  public.event_registrations,
  public.tracks,
  public.events,
  public.announcements,
  public.faqs,
  public.team,
  public.certificates,
  public.complaints
to authenticated;

grant select on public.audit_log to authenticated;

-- -----------------------------------------------------------------------------
-- Storage buckets + policies
-- -----------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', true, 2097152, array['image/png', 'image/jpeg', 'image/webp']),
  ('media', 'media', true, 10485760, array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'video/mp4', 'application/pdf']),
  ('receipts', 'receipts', false, 5242880, array['image/png', 'image/jpeg', 'application/pdf'])
on conflict (id) do nothing;

create policy "avatars_public_read"
  on storage.objects for select
  to public
  using (bucket_id = 'avatars');

create policy "avatars_own_insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatars_own_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'avatars' and owner = auth.uid())
  with check (bucket_id = 'avatars' and owner = auth.uid());

create policy "avatars_own_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'avatars' and owner = auth.uid());

create policy "media_public_read"
  on storage.objects for select
  to public
  using (bucket_id = 'media');

create policy "media_admin_write"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

create policy "receipts_own_insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'receipts'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "receipts_own_read"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'receipts' and owner = auth.uid());

create policy "receipts_admin_read"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'receipts' and public.is_admin());
