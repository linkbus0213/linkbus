alter table public.sale_products
  add column if not exists color_options jsonb not null default '[]'::jsonb,
  add column if not exists storage_options jsonb not null default '[]'::jsonb;

update public.sale_products
set
  color_options = case when color_options = '[]'::jsonb then jsonb_build_array(
    jsonb_build_object('name','Black','hex','#1f2329','image',coalesce(image_url,'')),
    jsonb_build_object('name','White','hex','#f2f2ee','image',coalesce(image_url,''))
  ) else color_options end,
  storage_options = case when storage_options = '[]'::jsonb then jsonb_build_array(
    jsonb_build_object('label','256G','price',sale_price,'support',support_amount),
    jsonb_build_object('label','512G','price',sale_price,'support',support_amount)
  ) else storage_options end;
