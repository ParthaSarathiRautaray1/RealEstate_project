create table if not exists public.property_nearby_places (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  name text not null,
  category text not null,
  distance_km numeric(8,2),
  travel_time text,
  latitude double precision,
  longitude double precision,
  notes text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists property_nearby_places_property_idx
  on public.property_nearby_places(property_id, sort_order);

alter table public.property_nearby_places enable row level security;

drop policy if exists "Public can read nearby places" on public.property_nearby_places;
drop policy if exists "Admins manage nearby places" on public.property_nearby_places;

create policy "Public can read nearby places"
  on public.property_nearby_places for select using (true);

create policy "Admins manage nearby places"
  on public.property_nearby_places for all using (public.is_admin()) with check (public.is_admin());
