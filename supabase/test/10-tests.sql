-- Access-rule tests. Every "assert" raises if the rule is broken.
\set ON_ERROR_STOP on
\set QUIET on

-- helper to impersonate a user (Supabase sets these per request)
create or replace function public.t_as(p_role text, p_uid uuid) returns void language plpgsql as $$
begin
  perform set_config('role', p_role, true);
  perform set_config('request.jwt.claim.sub', coalesce(p_uid::text, ''), true);
end $$;
create or replace function public.t_reset() returns void language plpgsql as $$
begin
  perform set_config('role', 'postgres', true);
  perform set_config('request.jwt.claim.sub', '', true);
end $$;

-- Users: signing in creates auth.users rows → trigger creates profiles
insert into public.admin_emails(email) values ('admin@prajit.test');
insert into public.access_requests(name,email,plan,status) values ('Pre-approved','sub@prajit.test','subscriber','approved');
insert into auth.users(id,email,raw_user_meta_data) values
  ('00000000-0000-0000-0000-000000000001','admin@prajit.test','{"full_name":"Admin"}'),
  ('00000000-0000-0000-0000-000000000002','member@prajit.test','{"full_name":"Member","firm":"Indie"}'),
  ('00000000-0000-0000-0000-000000000003','sub@prajit.test','{"full_name":"Sub"}');

do $$ begin
  assert (select is_admin from profiles where email='admin@prajit.test'), 'admin flag from allowlist';
  assert (select tier from profiles where email='member@prajit.test') = 'member', 'default tier member';
  assert (select tier from profiles where email='sub@prajit.test') = 'subscriber', 'pre-approved request applied on signup';
  assert (select firm from profiles where email='member@prajit.test') = 'Indie', 'metadata copied';
end $$;

-- Admin creates three notes
begin;
select t_as('authenticated','00000000-0000-0000-0000-000000000001');
insert into notes(slug,title,summary,access,status,published_at) values
  ('free-note','Free','s','free','published','2026-09-01'),
  ('member-note','Member','s','member','published','2026-09-02'),
  ('sub-note','Sub','s','subscriber','published','2026-09-03'),
  ('draft-note','Draft','s','free','draft',null);
insert into note_bodies(note_id,body) select id, 'BODY-'||slug from notes where slug <> 'example-writeup';
insert into storage.objects(bucket_id,name) values ('documents','member/member-note.pdf'),('documents','subscriber/sub-note.pdf');
do $$ begin
  assert (select count(*) from notes) = 5, 'admin sees all notes incl. draft + example';  -- 4 + seeded example
  assert (select count(*) from note_bodies) = 5, 'admin reads all bodies';
end $$;
commit;

-- Guest (anon)
begin;
select t_as('anon', null);
do $$ begin
  assert (select count(*) from notes) = 3, 'guest sees only published notes';
  assert (select count(*) from notes where status='draft') = 0, 'guest never sees drafts';
  assert (select string_agg(body,',' order by body) from note_bodies) = 'BODY-free-note', 'guest gets only free bodies';
  assert (select count(*) from access_requests) = 0, 'guest cannot read requests';
  assert (select count(*) from note_views) = 0, 'guest cannot read view log';
  assert (select count(*) from profiles) = 0, 'guest cannot read profiles';
  assert (select count(*) from storage.objects) = 0, 'guest cannot list private documents';
end $$;
select record_view('member-note');
select record_view('draft-note');   -- ignored
insert into access_requests(name,email,plan,note) values ('Guest Person','guest@prajit.test','subscriber','hi');
do $$ begin
  begin
    insert into notes(slug,title,summary) values ('hack','x','x');
    raise exception 'guest inserted a note';
  exception when insufficient_privilege then null; end;
  begin
    update notes set title='hacked' where slug='free-note';
  exception when others then null; end;
  assert (select title from notes where slug='free-note') = 'Free', 'guest cannot edit notes';
  begin
    insert into note_views(note_id) select id from notes limit 1;
    raise exception 'guest inserted a view row directly';
  exception when insufficient_privilege then null; end;
end $$;
commit;

-- Member
begin;
select t_as('authenticated','00000000-0000-0000-0000-000000000002');
do $$ begin
  assert (select string_agg(body,',' order by body) from note_bodies) = 'BODY-free-note,BODY-member-note', 'member gets free+member bodies only';
  assert (select count(*) from profiles) = 1, 'member sees only own profile';
  assert (select count(*) from storage.objects) = 1 and (select name from storage.objects) = 'member/member-note.pdf', 'member can only see member docs';
  assert (select count(*) from access_requests) = 0, 'member cannot read requests';
end $$;
update profiles set full_name='Member Renamed' where id='00000000-0000-0000-0000-000000000002';
do $$ begin
  begin
    update profiles set tier='subscriber' where id='00000000-0000-0000-0000-000000000002';
    raise exception 'member escalated own tier';
  exception when others then
    if sqlerrm like '%member escalated%' then raise; end if;
  end;
  begin
    update profiles set is_admin=true where id='00000000-0000-0000-0000-000000000002';
    raise exception 'member made self admin';
  exception when others then
    if sqlerrm like '%member made self%' then raise; end if;
  end;
  begin
    perform review_request((select id from access_requests limit 1), 'approved');
    raise exception 'member reviewed a request';
  exception when others then
    if sqlerrm like '%member reviewed%' then raise; end if;
  end;
  begin
    insert into note_bodies(note_id, body) select id, 'x' from notes where slug='sub-note';
    raise exception 'member wrote a body';
  exception when others then
    if sqlerrm like '%member wrote%' then raise; end if;
  end;
end $$;
select record_view('sub-note');
commit;

-- Subscriber
begin;
select t_as('authenticated','00000000-0000-0000-0000-000000000003');
do $$ begin
  assert (select count(*) from note_bodies) = 3, 'subscriber gets all published bodies';
  assert (select count(*) from storage.objects) = 2, 'subscriber sees all documents';
end $$;
commit;

-- Admin: stats, review request, version bump, tier change
begin;
select t_as('authenticated','00000000-0000-0000-0000-000000000001');
do $$ begin
  assert (select views_total from note_stats where slug='member-note') = 1, 'view counted';
  assert (select views_total from note_stats where slug='sub-note') = 1, 'gated view counted too';
  assert (select signed_in_viewers from note_stats where slug='sub-note') = 1, 'signed-in viewer counted';
  assert (select views_total from note_stats where slug='draft-note') = 0, 'draft views ignored';
  assert (select count(*) from access_requests where status='new') = 1, 'admin sees the new request';
end $$;
select review_request((select id from access_requests where status='new'), 'approved');
update note_bodies set body='BODY-free-note v2' where note_id=(select id from notes where slug='free-note');
update profiles set tier='subscriber' where email='member@prajit.test';
do $$ begin
  assert (select status from access_requests where email='guest@prajit.test') = 'approved', 'request approved';
  assert (select version from notes where slug='free-note') = 2, 'version bumped on body change';
  assert (select tier from profiles where email='member@prajit.test') = 'subscriber', 'admin changed tier';
  assert (select count(*) from profiles) = 3, 'admin sees all profiles';
end $$;
delete from notes where slug='draft-note';
do $$ begin
  assert (select count(*) from note_bodies where note_id not in (select id from notes)) = 0, 'body deleted with note';
end $$;
commit;

-- The upgraded member now reads subscriber bodies
begin;
select t_as('authenticated','00000000-0000-0000-0000-000000000002');
do $$ begin
  assert (select count(*) from note_bodies) = 3, 'upgraded member reads everything';
end $$;
commit;

select t_reset();
\echo ALL ACCESS-RULE TESTS PASSED
