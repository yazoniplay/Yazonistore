-- Yazonistore schema. Run this in Supabase SQL Editor.
create extension if not exists pgcrypto;
create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 role text not null default 'customer' check (role in ('customer','admin')),
 created_at timestamptz not null default now()
);
create table if not exists public.products (
 id uuid primary key default gen_random_uuid(),
 name text not null check (char_length(name) between 1 and 120),
 description text not null default '',
 category text not null default 'Everyday',
 price numeric(10,2) not null check (price >= 0),
 supplier_cost numeric(10,2) not null default 0 check (supplier_cost >= 0),
 image_url text, supplier_url text,
 published boolean not null default false,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table if not exists public.trend_records (
 id uuid primary key default gen_random_uuid(),
 name text not null check (char_length(name) between 1 and 120),
 source text, source_url text,
 observed_views bigint check (observed_views is null or observed_views >= 0),
 checked_at date,
 supplier_cost numeric(10,2) not null default 0 check (supplier_cost >= 0),
 target_price numeric(10,2) not null default 0 check (target_price >= 0),
 notes text,
 status text not null default 'Discovered' check (status in ('Discovered','Researching','Approved','Published','Retired')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create or replace function public.is_store_admin()
returns boolean language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'admin'); $$;
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.trend_records enable row level security;
drop policy if exists "Profiles own or admin read" on public.profiles;
create policy "Profiles own or admin read" on public.profiles for select to authenticated using (id = (select auth.uid()) or public.is_store_admin());
drop policy if exists "Admins manage profiles" on public.profiles;
create policy "Admins manage profiles" on public.profiles for all to authenticated using (public.is_store_admin()) with check (public.is_store_admin());
drop policy if exists "Public read published products" on public.products;
create policy "Public read published products" on public.products for select to anon, authenticated using (published = true or public.is_store_admin());
drop policy if exists "Admins insert products" on public.products;
create policy "Admins insert products" on public.products for insert to authenticated with check (public.is_store_admin());
drop policy if exists "Admins update products" on public.products;
create policy "Admins update products" on public.products for update to authenticated using (public.is_store_admin()) with check (public.is_store_admin());
drop policy if exists "Admins delete products" on public.products;
create policy "Admins delete products" on public.products for delete to authenticated using (public.is_store_admin());
drop policy if exists "Admins read trends" on public.trend_records;
create policy "Admins read trends" on public.trend_records for select to authenticated using (public.is_store_admin());
drop policy if exists "Admins insert trends" on public.trend_records;
create policy "Admins insert trends" on public.trend_records for insert to authenticated with check (public.is_store_admin());
drop policy if exists "Admins update trends" on public.trend_records;
create policy "Admins update trends" on public.trend_records for update to authenticated using (public.is_store_admin()) with check (public.is_store_admin());
drop policy if exists "Admins delete trends" on public.trend_records;
create policy "Admins delete trends" on public.trend_records for delete to authenticated using (public.is_store_admin());
-- Create your admin user in Supabase Auth, then run:
-- insert into public.profiles (id, role) values ('YOUR_AUTH_USER_UUID','admin')
-- on conflict (id) do update set role='admin';
-- Never expose a service_role/secret key in browser code.