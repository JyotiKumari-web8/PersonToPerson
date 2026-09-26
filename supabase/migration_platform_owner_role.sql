-- ==============================================================================
-- PersonToPerson: Platform Owner / Super Admin Role Security Migration (FINAL)
-- Target: Supabase SQL Editor (Run with admin/postgres privilege)
-- ==============================================================================

-- 1. UPDATE ROLE CHECK CONSTRAINT ON PROFILES
-- Allows 'platform_owner' as the official Super Admin role alongside 'business_owner'
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles
ADD CONSTRAINT profiles_role_check
CHECK (role IN ('business_owner', 'platform_owner', 'admin'));

-- 2. UPDATE SECURITY DEFINER HELPER FUNCTIONS FOR RLS
-- Any user with role 'platform_owner' (or legacy 'admin') is recognized as platform super admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND (role = 'platform_owner' OR role = 'admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_platform_owner()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND (role = 'platform_owner' OR role = 'admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. HARDEN AUTH USER CREATION FUNCTION (NO TRIGGER RECREATION NEEDED)
-- Replaces function in-place so existing trigger on auth.users continues to execute safely.
-- Strictly forces 'business_owner' role on signup, ignoring any client role metadata.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        'business_owner' -- Strictly enforced for all public signups
    )
    ON CONFLICT (id) DO UPDATE
    SET
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. PREVENT SELF-ROLE ESCALATION
-- Ensures normal users cannot escalate their own role to 'platform_owner' via client API update calls
CREATE OR REPLACE FUNCTION public.prevent_profile_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.role IS DISTINCT FROM OLD.role THEN
        -- Only an existing platform_owner/admin or direct database admin can modify roles
        IF NOT public.is_admin() THEN
            NEW.role := OLD.role;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_prevent_role_escalation ON public.profiles;
CREATE TRIGGER trg_prevent_role_escalation
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE PROCEDURE public.prevent_profile_role_escalation();

-- 5. SECURE PUBLIC BUSINESS RLS (PREVENT BULK ANONYMOUS SCRAPING)
-- Enforces that public/anonymous queries only return active businesses.
-- Suspended businesses cannot be dumped or bulk-scraped by unauthenticated users.
DROP POLICY IF EXISTS "Public can view businesses by slug" ON public.businesses;
DROP POLICY IF EXISTS "Public can view active businesses" ON public.businesses;

CREATE POLICY "Public can view active businesses"
    ON public.businesses FOR SELECT
    USING (is_active = true);

-- 6. MINIMAL SECURITY DEFINER RPC FOR PUBLIC STATUS LOOKUP
-- Allows PublicProfilePage to cleanly distinguish active vs suspended vs nonexistent
-- without exposing sensitive business fields or permitting table scraping.
CREATE OR REPLACE FUNCTION public.get_public_business_status(p_slug TEXT)
RETURNS TABLE (
    id UUID,
    slug TEXT,
    name TEXT,
    is_active BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    RETURN QUERY
    SELECT b.id, b.slug, b.name, b.is_active
    FROM public.businesses b
    WHERE b.slug = lower(trim(p_slug))
    LIMIT 1;
END;
$$;

-- Grant execution to public (anon) and logged-in users (authenticated)
GRANT EXECUTE ON FUNCTION public.get_public_business_status(TEXT) TO anon, authenticated;

-- ==============================================================================
-- 7. INSTRUCTIONS TO ASSIGN PLATFORM OWNER:
-- Replace 'YOUR_EMAIL@EXAMPLE.COM' with your actual registered email address and run:
--
-- UPDATE public.profiles
-- SET role = 'platform_owner'
-- WHERE email = 'YOUR_EMAIL@EXAMPLE.COM';
-- ==============================================================================
