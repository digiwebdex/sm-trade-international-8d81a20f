
-- Phase 2: Production schema upgrades

-- 1. Add product_code (slug) to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS product_code TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS products_product_code_idx ON public.products(product_code) WHERE product_code IS NOT NULL;

-- 2. Add short_description to products (existing description_en becomes full_description)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS short_description_en TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS short_description_bn TEXT;

-- 3. Add stock column to product_variants
ALTER TABLE public.product_variants ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 999;

-- 4. Create "products" storage bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 5. Storage policy for public read on products bucket
DROP POLICY IF EXISTS "Products images public read" ON storage.objects;
CREATE POLICY "Products images public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

DROP POLICY IF EXISTS "Auth users can upload products images" ON storage.objects;
CREATE POLICY "Auth users can upload products images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Auth users can update products images" ON storage.objects;
CREATE POLICY "Auth users can update products images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'products' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Auth users can delete products images" ON storage.objects;
CREATE POLICY "Auth users can delete products images"
ON storage.objects FOR DELETE
USING (bucket_id = 'products' AND auth.role() = 'authenticated');

-- 6. Add index on products for search
CREATE INDEX IF NOT EXISTS products_name_en_idx ON public.products USING gin(to_tsvector('english', name_en));
CREATE INDEX IF NOT EXISTS products_category_id_idx ON public.products(category_id);
CREATE INDEX IF NOT EXISTS products_is_active_idx ON public.products(is_active);

-- 7. Auto-generate product_code from existing products using slugified name_en
UPDATE public.products 
SET product_code = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(name_en, '[^a-zA-Z0-9\s]', '', 'g'), '\s+', '-', 'g'))
WHERE product_code IS NULL;
