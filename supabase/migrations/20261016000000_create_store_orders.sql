-- Yazonistore order ledger. Payments are written only by the server-side PayPal capture function.
create table if not exists public.orders (
 id uuid primary key default gen_random_uuid(),
 paypal_order_id text not null unique,
 payment_status text not null default 'COMPLETED' check (payment_status in ('COMPLETED')),
 fulfillment_status text not null default 'unfulfilled' check (fulfillment_status in ('unfulfilled','processing','shipped','cancelled')),
 currency_code text not null default 'SEK' check (currency_code = 'SEK'),
 amount numeric(12,2) not null check (amount > 0),
 payer_email text,
 payer_id text,
 items jsonb not null default '[]'::jsonb check (jsonb_typeof(items) = 'array'),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_fulfillment_status_idx on public.orders (fulfillment_status);
alter table public.orders enable row level security;
drop policy if exists "Store admins can read orders" on public.orders;
create policy "Store admins can read orders" on public.orders for select to authenticated
using (exists (select 1 from public.store_admins where store_admins.user_id = (select auth.uid())));
drop policy if exists "Store admins can update order fulfillment" on public.orders;
create policy "Store admins can update order fulfillment" on public.orders for update to authenticated
using (exists (select 1 from public.store_admins where store_admins.user_id = (select auth.uid())))
with check (exists (select 1 from public.store_admins where store_admins.user_id = (select auth.uid())));
grant select, update on public.orders to authenticated;
revoke all on public.orders from anon;
