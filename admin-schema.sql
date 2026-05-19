create table if not exists public.sale_products (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  brand text not null,
  series text not null,
  carrier text not null,
  join_type text not null,
  name text not null,
  subtitle text,
  image_url text,
  sale_price integer,
  rebate integer,
  monthly_fee integer,
  support_amount integer,
  badge text,
  tag text,
  is_visible boolean not null default true,
  sort_order integer default 100
);

alter table public.sale_products enable row level security;

drop policy if exists "Visible products are public" on public.sale_products;
create policy "Visible products are public"
  on public.sale_products
  for select
  to anon, authenticated
  using (is_visible = true or (auth.jwt() ->> 'email') = 'linkbus0213@gmail.com');

drop policy if exists "Admin can manage products" on public.sale_products;
create policy "Admin can manage products"
  on public.sale_products
  for all
  to authenticated
  using ((auth.jwt() ->> 'email') = 'linkbus0213@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'linkbus0213@gmail.com');

drop policy if exists "Admin can read consult requests" on public.consult_requests;
create policy "Admin can read consult requests"
  on public.consult_requests
  for select
  to authenticated
  using ((auth.jwt() ->> 'email') = 'linkbus0213@gmail.com');
