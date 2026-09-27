-- ==============================================================================
-- PersonToPerson: Supabase Storage Bucket & RLS Policies Migration
-- Target: Supabase SQL Editor (Run with admin/postgres privilege)
-- ==============================================================================

-- 1. CREATE 'sponsors' STORAGE BUCKET (IDEMPOTENT)
-- Configures a public bucket with 5MB file size limit and image-only MIME types
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'sponsors',
    'sponsors',
    true,
    5242880, -- 5 MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']::text[]
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']::text[];

-- 2. ENABLE ROW LEVEL SECURITY ON STORAGE.OBJECTS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. STORAGE RLS: PUBLIC CAN VIEW / DISPLAY SPONSOR IMAGES
-- Public visitors on /b/:slug must be able to load and display sponsor logos
DROP POLICY IF EXISTS "Public can view sponsor images" ON storage.objects;
CREATE POLICY "Public can view sponsor images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'sponsors');

-- 4. STORAGE RLS: ADMINS & PLATFORM OWNERS CAN UPLOAD SPONSOR IMAGES
DROP POLICY IF EXISTS "Admins can upload sponsor images" ON storage.objects;
CREATE POLICY "Admins can upload sponsor images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'sponsors' AND
        (public.is_admin() OR public.is_platform_owner())
    );

-- 5. STORAGE RLS: ADMINS & PLATFORM OWNERS CAN UPDATE / REPLACE SPONSOR IMAGES
DROP POLICY IF EXISTS "Admins can update sponsor images" ON storage.objects;
CREATE POLICY "Admins can update sponsor images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'sponsors' AND
        (public.is_admin() OR public.is_platform_owner())
    )
    WITH CHECK (
        bucket_id = 'sponsors' AND
        (public.is_admin() OR public.is_platform_owner())
    );

-- 6. STORAGE RLS: ADMINS & PLATFORM OWNERS CAN DELETE SPONSOR IMAGES
DROP POLICY IF EXISTS "Admins can delete sponsor images" ON storage.objects;
CREATE POLICY "Admins can delete sponsor images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'sponsors' AND
        (public.is_admin() OR public.is_platform_owner())
    );
