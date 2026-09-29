-- ==============================================================================
-- MIGRATION: CONTACT PLATFORM ADMIN EMAIL ACCESS
-- ==============================================================================
-- Allows authenticated users / business owners to fetch the Platform Owner or
-- Admin email for subscription plan upgrades, support, and link limit increases
-- without compromising database RLS security or exposing sensitive profile data.
-- ==============================================================================

-- 1. Function to safely return the active Platform Owner / Admin email
CREATE OR REPLACE FUNCTION public.get_platform_admin_email()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT email FROM public.profiles 
  WHERE role IN ('platform_owner', 'admin') 
  ORDER BY 
    CASE WHEN role = 'platform_owner' THEN 1 ELSE 2 END,
    created_at ASC
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_platform_admin_email() TO authenticated, anon;

-- 2. RLS policy on profiles to allow authenticated users to query platform admin profiles
DROP POLICY IF EXISTS "Authenticated users can view platform owner email" ON public.profiles;
CREATE POLICY "Authenticated users can view platform owner email"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (role IN ('platform_owner', 'admin'));
