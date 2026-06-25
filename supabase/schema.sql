create extension if not exists "pgcrypto";

create table if not exists public.admins (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text,
  created_at timestamptz not null default now()
);

create table if not exists public.owners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  avatar_url text,
  bio text,
  created_at timestamptz not null default now()
);

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  price numeric(14,2) not null check (price >= 0),
  property_type text not null,
  location text not null,
  latitude double precision not null,
  longitude double precision not null,
  owner_id uuid references public.owners(id) on delete set null,
  featured boolean not null default false,
  status text not null default 'published' check (status in ('draft','published','sold')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  url text not null,
  public_id text,
  alt text,
  sort_order int not null default 0
);

create table if not exists public.property_videos (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  youtube_url text not null,
  title text,
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  user_name text not null,
  rating int not null check (rating between 1 and 5),
  review text not null,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.properties(id) on delete set null,
  name text not null,
  email text not null,
  phone text not null,
  budget numeric(14,2),
  message text,
  created_at timestamptz not null default now()
);

create index if not exists properties_status_idx on public.properties(status);
create index if not exists properties_featured_idx on public.properties(featured);
create index if not exists properties_price_idx on public.properties(price);
create index if not exists leads_created_at_idx on public.leads(created_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists properties_updated_at on public.properties;
create trigger properties_updated_at
before update on public.properties
for each row execute function public.set_updated_at();

alter table public.admins enable row level security;
alter table public.owners enable row level security;
alter table public.properties enable row level security;
alter table public.property_images enable row level security;
alter table public.property_videos enable row level security;
alter table public.reviews enable row level security;
alter table public.leads enable row level security;

create or replace function public.is_admin()
returns boolean language sql security definer stable as $$
  select exists (select 1 from public.admins where id = auth.uid());
$$;

drop policy if exists "Public can read published properties" on public.properties;
drop policy if exists "Admins manage properties" on public.properties;
drop policy if exists "Public can read owners" on public.owners;
drop policy if exists "Admins manage owners" on public.owners;
drop policy if exists "Public can read property images" on public.property_images;
drop policy if exists "Admins manage property images" on public.property_images;
drop policy if exists "Public can read property videos" on public.property_videos;
drop policy if exists "Admins manage property videos" on public.property_videos;
drop policy if exists "Public can read approved reviews" on public.reviews;
drop policy if exists "Admins manage reviews" on public.reviews;
drop policy if exists "Anyone can create leads" on public.leads;
drop policy if exists "Admins read leads" on public.leads;
drop policy if exists "Admins manage admins" on public.admins;

create policy "Public can read published properties" on public.properties
for select using (status = 'published' or public.is_admin());
create policy "Admins manage properties" on public.properties
for all using (public.is_admin()) with check (public.is_admin());

create policy "Public can read owners" on public.owners for select using (true);
create policy "Admins manage owners" on public.owners for all using (public.is_admin()) with check (public.is_admin());

create policy "Public can read property images" on public.property_images for select using (true);
create policy "Admins manage property images" on public.property_images for all using (public.is_admin()) with check (public.is_admin());

create policy "Public can read property videos" on public.property_videos for select using (true);
create policy "Admins manage property videos" on public.property_videos for all using (public.is_admin()) with check (public.is_admin());

create policy "Public can read approved reviews" on public.reviews for select using (approved = true or public.is_admin());
create policy "Admins manage reviews" on public.reviews for all using (public.is_admin()) with check (public.is_admin());

create policy "Anyone can create leads" on public.leads for insert with check (true);
create policy "Admins read leads" on public.leads for select using (public.is_admin());
create policy "Admins manage admins" on public.admins for all using (public.is_admin()) with check (public.is_admin());

-- Seed after creating the first Supabase Auth user:
-- insert into public.admins (id, email, name) values ('AUTH_USER_UUID', 'admin@example.com', 'Admin');
