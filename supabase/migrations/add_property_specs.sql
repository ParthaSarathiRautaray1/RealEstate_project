-- Adds real per-property specs so cards/detail pages stop showing hardcoded
-- "4 Beds / 3 Baths". Run this in the Supabase SQL editor. Safe to re-run.
alter table public.properties add column if not exists bedrooms integer;
alter table public.properties add column if not exists bathrooms integer;
alter table public.properties add column if not exists area_sqft integer;
