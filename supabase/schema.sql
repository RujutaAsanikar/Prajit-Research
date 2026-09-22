-- =====================================================================
-- Prajit Research — database schema, access rules, and storage (v1)
-- Run this once in Supabase → SQL Editor. Safe to re-run.
--
-- BEFORE RUNNING: put your own email address in the admin list (step 1).
-- Whoever signs in with that email becomes the site admin.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- 1. Admin allowlist — EDIT THIS
-- ---------------------------------------------------------------------
create table if not exists public.admin_emails (
  email text primary key
);
insert into public.admin_emails (email) values
  ('ruju25a@gmail.com'),
  ('prajitresearch@gmail.com')
on conflict do nothing;

-- ---------------------------------------------------------------------
-- 2. Reader profiles (one row per signed-in user)
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  full_name   text not null default '',
  firm        text not null default '',
  tier        text not null default 'member' check (tier in ('member','subscriber')),
  is_admin    boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 3. Writeups: public metadata in `notes`, gated text in `note_bodies`
-- ---------------------------------------------------------------------
create table if not exists public.notes (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique check (slug ~ '^[a-z0-9-]{1,80}$'),
  title         text not null,
  summary       text not null default '',
  sector        text not null default '',
  type          text not null default 'Initiation',
  access        text not null default 'member' check (access in ('free','member','subscriber')),
  read_time     text not null default '',
  status        text not null default 'draft' check (status in ('draft','published')),
  published_at  date,
  file_path     text,                       -- path inside the private "documents" bucket: <access>/<slug>.pdf
  version       int  not null default 1,
  created_by    uuid references auth.users (id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists public.note_bodies (
  note_id  uuid primary key references public.notes (id) on delete cascade,
  body     text not null default ''
);

-- ---------------------------------------------------------------------
-- 4. View log and access requests
-- ---------------------------------------------------------------------
create table if not exists public.note_views (
  id         bigint generated always as identity primary key,
  note_id    uuid not null references public.notes (id) on delete cascade,
  viewer_id  uuid,
  viewed_at  timestamptz not null default now()
);
create index if not exists note_views_note_time on public.note_views (note_id, viewed_at);

create table if not exists public.access_requests (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  firm        text not null default '',
  plan        text not null default 'member' check (plan in ('member','subscriber')),
  note        text not null default '',
  status      text not null default 'new' check (status in ('new','approved','declined')),
  created_at  timestamptz not null default now(),
  reviewed_at timestamptz
);

-- ---------------------------------------------------------------------
-- 5. Helper functions (security definer = run with owner rights, bypass RLS)
-- ---------------------------------------------------------------------
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select p.is_admin from public.profiles p where p.id = auth.uid()), false);
$$;

create or replace function public.tier_rank(t text) returns int
language sql immutable as $$
  select case t when 'free' then 0 when 'member' then 1 when 'subscriber' then 2 else 99 end;
$$;

create or replace function public.my_rank() returns int
language sql stable security definer set search_path = public as $$
  select case
    when auth.uid() is null then 0
    else coalesce((select case when p.is_admin then 99 else public.tier_rank(p.tier) end
                   from public.profiles p where p.id = auth.uid()), 1)
  end;
$$;

-- New sign-ins get a profile; admins by allowlist; approved subscriber requests apply automatically.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare v_tier text := 'member';
begin
  if exists (select 1 from public.access_requests r
             where lower(r.email) = lower(new.email) and r.status = 'approved' and r.plan = 'subscriber') then
    v_tier := 'subscriber';
  end if;
  insert into public.profiles (id, email, full_name, firm, tier, is_admin)
  values (
    new.id, new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'firm', ''),
    v_tier,
    exists (select 1 from public.admin_emails a where lower(a.email) = lower(new.email))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Readers may edit their name/firm, never their own tier or admin flag.
create or replace function public.guard_profile_update() returns trigger
language plpgsql as $$
begin
  if not public.is_admin() and (new.tier is distinct from old.tier or new.is_admin is distinct from old.is_admin
                                or new.email is distinct from old.email or new.id is distinct from old.id) then
    raise exception 'Only an admin can change access level';
  end if;
  return new;
end;
$$;
drop trigger if exists profiles_guard on public.profiles;
create trigger profiles_guard before update on public.profiles
  for each row execute procedure public.guard_profile_update();

-- Keep updated_at fresh and bump version when the body changes.
create or replace function public.touch_note() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  if tg_op = 'UPDATE' and new.status = 'published' and new.published_at is null then new.published_at := current_date; end if;
  return new;
end;
$$;
drop trigger if exists notes_touch on public.notes;
create trigger notes_touch before insert or update on public.notes
  for each row execute procedure public.touch_note();

create or replace function public.bump_version() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'UPDATE' and new.body is distinct from old.body then
    update public.notes set version = version + 1, updated_at = now() where id = new.note_id;
  end if;
  return new;
end;
$$;
drop trigger if exists bodies_bump on public.note_bodies;
create trigger bodies_bump after update on public.note_bodies
  for each row execute procedure public.bump_version();

-- Anyone can record a view of a published note (writes only through this function).
create or replace function public.record_view(p_slug text) returns void
language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  select id into v_id from public.notes where slug = p_slug and status = 'published';
  if v_id is null then return; end if;
  insert into public.note_views (note_id, viewer_id) values (v_id, auth.uid());
end;
$$;

-- Admin reviews a request; approving upgrades an existing account with that email.
create or replace function public.review_request(p_id uuid, p_status text) returns void
language plpgsql security definer set search_path = public as $$
declare r public.access_requests%rowtype;
begin
  if not public.is_admin() then raise exception 'Admins only'; end if;
  if p_status not in ('approved','declined') then raise exception 'Bad status'; end if;
  update public.access_requests set status = p_status, reviewed_at = now() where id = p_id returning * into r;
  if r.id is null then raise exception 'Request not found'; end if;
  if p_status = 'approved' then
    update public.profiles set tier = r.plan
    where lower(email) = lower(r.email) and public.tier_rank(tier) < public.tier_rank(r.plan);
  end if;
end;
$$;

-- Per-writeup view counts for the admin dashboard (respects the caller's rights).
create or replace view public.note_stats with (security_invoker = true) as
select n.id, n.slug, n.title, n.status,
       count(v.id)                                                             as views_total,
       count(v.id) filter (where v.viewed_at > now() - interval '7 days')      as views_7d,
       count(distinct v.viewer_id) filter (where v.viewer_id is not null)      as signed_in_viewers
from public.notes n
left join public.note_views v on v.note_id = n.id
group by n.id, n.slug, n.title, n.status;

-- ---------------------------------------------------------------------
-- 6. Row-level security — who may read/write what
-- ---------------------------------------------------------------------
alter table public.admin_emails    enable row level security;
alter table public.profiles        enable row level security;
alter table public.notes           enable row level security;
alter table public.note_bodies     enable row level security;
alter table public.note_views      enable row level security;
alter table public.access_requests enable row level security;

drop policy if exists "admin_emails admin only"     on public.admin_emails;
create policy "admin_emails admin only" on public.admin_emails for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "profiles read own or admin"  on public.profiles;
create policy "profiles read own or admin" on public.profiles for select
  using (id = auth.uid() or public.is_admin());
drop policy if exists "profiles update own or admin" on public.profiles;
create policy "profiles update own or admin" on public.profiles for update
  using (id = auth.uid() or public.is_admin()) with check (id = auth.uid() or public.is_admin());

drop policy if exists "notes read published or admin" on public.notes;
create policy "notes read published or admin" on public.notes for select
  using (status = 'published' or public.is_admin());
drop policy if exists "notes admin insert" on public.notes;
create policy "notes admin insert" on public.notes for insert with check (public.is_admin());
drop policy if exists "notes admin update" on public.notes;
create policy "notes admin update" on public.notes for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists "notes admin delete" on public.notes;
create policy "notes admin delete" on public.notes for delete using (public.is_admin());

-- The body of a note is only returned to readers whose level is high enough. Guests never receive gated text.
drop policy if exists "bodies entitled read" on public.note_bodies;
create policy "bodies entitled read" on public.note_bodies for select
  using (public.is_admin() or exists (
    select 1 from public.notes n
    where n.id = note_id and n.status = 'published' and public.tier_rank(n.access) <= public.my_rank()));
drop policy if exists "bodies admin write" on public.note_bodies;
create policy "bodies admin write" on public.note_bodies for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "views admin read" on public.note_views;
create policy "views admin read" on public.note_views for select using (public.is_admin());
-- no insert policy: rows are written only by record_view()

drop policy if exists "requests anyone insert" on public.access_requests;
create policy "requests anyone insert" on public.access_requests for insert with check (true);
drop policy if exists "requests admin read" on public.access_requests;
create policy "requests admin read" on public.access_requests for select using (public.is_admin());
-- no direct update policy: status changes go through review_request()

-- ---------------------------------------------------------------------
-- 7. Private file storage for attached documents
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public) values ('documents', 'documents', false)
on conflict (id) do nothing;

drop policy if exists "documents entitled read" on storage.objects;
create policy "documents entitled read" on storage.objects for select
  using (bucket_id = 'documents' and (public.is_admin() or public.tier_rank((storage.foldername(name))[1]) <= public.my_rank()));
drop policy if exists "documents admin insert" on storage.objects;
create policy "documents admin insert" on storage.objects for insert with check (bucket_id = 'documents' and public.is_admin());
drop policy if exists "documents admin update" on storage.objects;
create policy "documents admin update" on storage.objects for update using (bucket_id = 'documents' and public.is_admin());
drop policy if exists "documents admin delete" on storage.objects;
create policy "documents admin delete" on storage.objects for delete using (bucket_id = 'documents' and public.is_admin());

-- ---------------------------------------------------------------------
-- 8. Grants (Supabase defaults usually cover these; explicit for safety)
-- ---------------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant select on public.notes, public.note_bodies, public.note_stats to anon, authenticated;
grant insert on public.access_requests to anon, authenticated;
grant select, update on public.profiles to authenticated;
grant all on public.notes, public.note_bodies, public.access_requests, public.note_views, public.admin_emails to authenticated;
grant execute on function public.record_view(text), public.is_admin(), public.my_rank(), public.tier_rank(text) to anon, authenticated;
grant execute on function public.review_request(uuid, text) to authenticated;

-- ---------------------------------------------------------------------
-- 9. One example writeup (a draft, visible only to admins). Delete it whenever you like.
-- ---------------------------------------------------------------------
insert into public.notes (slug, title, summary, sector, type, access, read_time, status, published_at)
values ('example-writeup', 'Example writeup — edit or delete me', 'This draft shows how a note looks in the admin. It is not visible to readers until you publish it.', 'Methodology', 'Framework', 'free', '2 min', 'draft', null)
on conflict (slug) do nothing;
insert into public.note_bodies (note_id, body)
select id, 'Paragraphs are separated by a blank line.' || E'\n\n' || '## Headings start with two hashes' || E'\n\n' || '- Bullets start with a dash' || E'\n' || '- Like this'
from public.notes where slug = 'example-writeup'
on conflict (note_id) do nothing;
