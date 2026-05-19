drop policy if exists "Public read product images" on storage.objects;
create policy "Public read product images"
  on storage.objects
  for select
  to public
  using (bucket_id = 'product-images');

drop policy if exists "Admin upload product images" on storage.objects;
create policy "Admin upload product images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'product-images' and (auth.jwt() ->> 'email') = 'linkbus0213@gmail.com');

drop policy if exists "Admin update product images" on storage.objects;
create policy "Admin update product images"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'product-images' and (auth.jwt() ->> 'email') = 'linkbus0213@gmail.com')
  with check (bucket_id = 'product-images' and (auth.jwt() ->> 'email') = 'linkbus0213@gmail.com');

drop policy if exists "Admin delete product images" on storage.objects;
create policy "Admin delete product images"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'product-images' and (auth.jwt() ->> 'email') = 'linkbus0213@gmail.com');
