-- DOORS website backend schema
-- Target: Chris's own Supabase project (DOORS, ref stgpdnxengnhsliqwavh)
-- Replaces the temporary Famous "databasepad" backend.
-- Applied 07/07/2026. Idempotent: safe to re-run.

-- ---------------------------------------------------------------------------
-- profiles: one row per registered buyer (keyed to the auth user)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text,
  full_name     text,
  phone         text,
  budget_band   text,
  area_interest text,
  timeline      text,
  bedrooms_min  int,
  priorities    text[],
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- doors_properties: the full listing set (studio-managed via the engine)
-- ---------------------------------------------------------------------------
create table if not exists public.doors_properties (
  id               uuid primary key default gen_random_uuid(),
  ref              text unique not null,
  title            text not null,
  area             text,
  price_band       text,
  exact_price      text,
  address          text,
  size_sqm         int,
  erf_sqm          int,
  bedrooms         int,
  bathrooms        int,
  summary          text,
  image_url        text,
  video_url        text,
  character        text[],
  gallery          text[],
  specifics        text[],
  discretion_level text not null default 'public-curated',
  pipeline_stage   text not null default 'mandate_won',
  status           text not null default 'active',
  is_published     boolean not null default false,
  is_demo          boolean not null default false,
  owner_id         uuid,
  created_at       timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- doors_team: who may enter the private engine (studio). admin | agent.
-- Rows may be added by email before that person signs up; whoami matches on
-- either user_id or email.
-- ---------------------------------------------------------------------------
create table if not exists public.doors_team (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete set null,
  email      text not null,
  full_name  text,
  role       text not null default 'agent',
  created_at timestamptz not null default now()
);
create unique index if not exists doors_team_email_key on public.doors_team (lower(email));

-- ---------------------------------------------------------------------------
-- doors_settings: single-row app settings (the launch/marketing gate)
-- ---------------------------------------------------------------------------
create table if not exists public.doors_settings (
  id                          int primary key default 1,
  mandate_marketing_unlocked  boolean not null default false,
  ffc_reference               text,
  updated_at                  timestamptz not null default now(),
  constraint doors_settings_singleton check (id = 1)
);
insert into public.doors_settings (id, mandate_marketing_unlocked)
values (1, false)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- doors_viewing_requests: buyer-raised viewing / introduction requests
-- (buyer inserts directly; studio reads + updates status via the engine)
-- ---------------------------------------------------------------------------
create table if not exists public.doors_viewing_requests (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  property_ref text not null,
  request_type text not null default 'viewing',
  message      text,
  status       text not null default 'open',
  created_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- doors_outreach: studio-managed marketing campaigns
-- ---------------------------------------------------------------------------
create table if not exists public.doors_outreach (
  id            uuid primary key default gen_random_uuid(),
  property_ref  text,
  title         text,
  kind          text not null default 'editorial',
  audience_note text,
  status        text not null default 'draft',
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- doors_private_introductions: which private homes a buyer has been shown
-- (studio writes via engine; buyer reads own rows)
-- ---------------------------------------------------------------------------
create table if not exists public.doors_private_introductions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  property_ref text not null,
  created_at   timestamptz not null default now(),
  unique (user_id, property_ref)
);

-- ---------------------------------------------------------------------------
-- doors_saved_homes: buyer's saved listings
-- ---------------------------------------------------------------------------
create table if not exists public.doors_saved_homes (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  property_ref text not null,
  created_at   timestamptz not null default now(),
  unique (user_id, property_ref)
);

-- ---------------------------------------------------------------------------
-- doors_viewed_homes: buyer's recently viewed listings
-- ---------------------------------------------------------------------------
create table if not exists public.doors_viewed_homes (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  property_ref text not null,
  viewed_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- doors_enquiries: public lead capture (buyer/seller enquiry forms)
-- ---------------------------------------------------------------------------
create table if not exists public.doors_enquiries (
  id            uuid primary key default gen_random_uuid(),
  kind          text not null,
  name          text,
  email         text,
  phone         text,
  message       text,
  budget_band   text,
  area_interest text,
  property_ref  text,
  source        text,
  created_at    timestamptz not null default now()
);

-- ===========================================================================
-- Row Level Security
-- The engine (doors-engine edge function) uses the service_role key and
-- bypasses RLS entirely. These policies only govern the direct-from-browser
-- calls made with the publishable/anon key + the signed-in buyer's JWT.
-- ===========================================================================
alter table public.profiles                   enable row level security;
alter table public.doors_properties           enable row level security;
alter table public.doors_team                  enable row level security;
alter table public.doors_settings              enable row level security;
alter table public.doors_viewing_requests      enable row level security;
alter table public.doors_outreach              enable row level security;
alter table public.doors_private_introductions enable row level security;
alter table public.doors_saved_homes           enable row level security;
alter table public.doors_viewed_homes          enable row level security;
alter table public.doors_enquiries             enable row level security;

-- profiles: a buyer owns their own row
drop policy if exists profiles_own_all on public.profiles;
create policy profiles_own_all on public.profiles
  for all to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);

-- saved homes: buyer manages own
drop policy if exists saved_own_all on public.doors_saved_homes;
create policy saved_own_all on public.doors_saved_homes
  for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- viewed homes: buyer manages own
drop policy if exists viewed_own_all on public.doors_viewed_homes;
create policy viewed_own_all on public.doors_viewed_homes
  for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- private introductions: buyer reads own (studio writes via service role)
drop policy if exists intro_own_select on public.doors_private_introductions;
create policy intro_own_select on public.doors_private_introductions
  for select to authenticated
  using (auth.uid() = user_id);

-- viewing requests: buyer inserts + reads own (studio reads via service role)
drop policy if exists req_own_insert on public.doors_viewing_requests;
create policy req_own_insert on public.doors_viewing_requests
  for insert to authenticated
  with check (auth.uid() = user_id);
drop policy if exists req_own_select on public.doors_viewing_requests;
create policy req_own_select on public.doors_viewing_requests
  for select to authenticated
  using (auth.uid() = user_id);

-- enquiries: anyone (anon or authed) may submit a lead; nobody may read via the API
drop policy if exists enquiries_insert on public.doors_enquiries;
create policy enquiries_insert on public.doors_enquiries
  for insert to anon, authenticated
  with check (true);

-- doors_properties: public may read PUBLISHED public-curated listings; a signed-in
-- buyer may additionally read the private listings they have been introduced to.
-- (The engine writes via service_role and bypasses RLS.)
drop policy if exists properties_public_read on public.doors_properties;
create policy properties_public_read on public.doors_properties
  for select to anon, authenticated
  using (is_published = true and discretion_level = 'public-curated');

drop policy if exists properties_intro_read on public.doors_properties;
create policy properties_intro_read on public.doors_properties
  for select to authenticated
  using (exists (select 1 from public.doors_private_introductions i
                 where i.user_id = auth.uid() and i.property_ref = doors_properties.ref));

-- doors_team / doors_settings / doors_outreach:
-- no client policies -> locked to service_role (the engine) only.
