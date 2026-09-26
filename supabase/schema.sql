-- ==============================================================================
-- PersonToPerson Database Schema & Row Level Security (RLS) Policies
-- PostgreSQL / Supabase
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'business_owner' CHECK (role IN ('business_owner', 'platform_owner', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. BUSINESSES TABLE
CREATE TABLE IF NOT EXISTS public.businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    cover_url TEXT,
    description TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    category TEXT,
    city TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for instant slug lookup on public pages
CREATE INDEX IF NOT EXISTS idx_businesses_slug ON public.businesses(slug);
CREATE INDEX IF NOT EXISTS idx_businesses_user_id ON public.businesses(user_id);

-- 3. BUSINESS LINKS TABLE
CREATE TABLE IF NOT EXISTS public.business_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    url TEXT NOT NULL,
    link_type TEXT NOT NULL DEFAULT 'custom',
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_business_links_business_id ON public.business_links(business_id);
CREATE INDEX IF NOT EXISTS idx_business_links_order ON public.business_links(business_id, display_order ASC);

-- 4. ANALYTICS EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    link_id UUID REFERENCES public.business_links(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('visit', 'link_click', 'sponsor_click')),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_business_id ON public.analytics_events(business_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON public.analytics_events(business_id, event_type);

-- 5. SPONSORS TABLE
CREATE TABLE IF NOT EXISTS public.sponsors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. BUSINESS SPONSORS (Junction table)
CREATE TABLE IF NOT EXISTS public.business_sponsors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    sponsor_id UUID NOT NULL REFERENCES public.sponsors(id) ON DELETE CASCADE,
    placement TEXT NOT NULL DEFAULT 'both' CHECK (placement IN ('header', 'footer', 'both')),
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(business_id, sponsor_id)
);

ALTER TABLE public.business_sponsors
ADD COLUMN IF NOT EXISTS placement TEXT NOT NULL DEFAULT 'both'
CHECK (placement IN ('header', 'footer', 'both'));

CREATE INDEX IF NOT EXISTS idx_business_sponsors_business_id ON public.business_sponsors(business_id);

-- ==============================================================================
-- AUTOMATIC TIMESTAMP UPDATE TRIGGER
-- ==============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER trg_businesses_updated_at BEFORE UPDATE ON public.businesses FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER trg_business_links_updated_at BEFORE UPDATE ON public.business_links FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER trg_sponsors_updated_at BEFORE UPDATE ON public.sponsors FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ==============================================================================
-- AUTH HOOK TRIGGER: Auto-create profile on auth.users INSERT
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        'business_owner'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_sponsors ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is platform owner / admin
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

-- ------------------------------------------------------------------------------
-- PROFILES POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- BUSINESSES POLICIES
-- ------------------------------------------------------------------------------
-- Public can view active businesses (for customer pages)
CREATE POLICY "Public can view active businesses"
    ON public.businesses FOR SELECT
    USING (is_active = true);

-- Owners can view their own business (even if inactive)
CREATE POLICY "Owners can view own business"
    ON public.businesses FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

-- Owners can insert their own business
CREATE POLICY "Owners can insert own business"
    ON public.businesses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Owners can update their own business
CREATE POLICY "Owners can update own business"
    ON public.businesses FOR UPDATE
    USING (auth.uid() = user_id OR public.is_admin())
    WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- Owners can delete their own business
CREATE POLICY "Owners can delete own business"
    ON public.businesses FOR DELETE
    USING (auth.uid() = user_id OR public.is_admin());

-- ------------------------------------------------------------------------------
-- BUSINESS_LINKS POLICIES
-- ------------------------------------------------------------------------------
-- Public can view active links of active businesses
CREATE POLICY "Public can view active links"
    ON public.business_links FOR SELECT
    USING (
        is_active = true AND
        EXISTS (
            SELECT 1 FROM public.businesses
            WHERE businesses.id = business_links.business_id AND businesses.is_active = true
        )
    );

-- Owners can view all their links
CREATE POLICY "Owners can view own links"
    ON public.business_links FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.businesses
            WHERE businesses.id = business_links.business_id AND businesses.user_id = auth.uid()
        )
        OR public.is_admin()
    );

-- Owners can insert links into their own business
CREATE POLICY "Owners can insert own links"
    ON public.business_links FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.businesses
            WHERE businesses.id = business_links.business_id AND businesses.user_id = auth.uid()
        )
    );

-- Owners can update own links
CREATE POLICY "Owners can update own links"
    ON public.business_links FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.businesses
            WHERE businesses.id = business_links.business_id AND businesses.user_id = auth.uid()
        )
        OR public.is_admin()
    );

-- Owners can delete own links
CREATE POLICY "Owners can delete own links"
    ON public.business_links FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.businesses
            WHERE businesses.id = business_links.business_id AND businesses.user_id = auth.uid()
        )
        OR public.is_admin()
    );

-- ------------------------------------------------------------------------------
-- ANALYTICS_EVENTS POLICIES
-- ------------------------------------------------------------------------------
-- Anyone (including anonymous public customers) can record events
CREATE POLICY "Anyone can record analytics events"
    ON public.analytics_events FOR INSERT
    WITH CHECK (true);

-- Only business owners can read analytics for their business
CREATE POLICY "Owners can view own analytics"
    ON public.analytics_events FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.businesses
            WHERE businesses.id = analytics_events.business_id AND businesses.user_id = auth.uid()
        )
        OR public.is_admin()
    );

-- ------------------------------------------------------------------------------
-- SPONSORS & BUSINESS_SPONSORS POLICIES
-- ------------------------------------------------------------------------------
-- Public can view active sponsors
CREATE POLICY "Public can view active sponsors"
    ON public.sponsors FOR SELECT
    USING (is_active = true);

-- Admins manage sponsors
CREATE POLICY "Admins manage sponsors"
    ON public.sponsors FOR ALL
    USING (public.is_admin());

-- Public can view active business_sponsors
CREATE POLICY "Public can view active business_sponsors"
    ON public.business_sponsors FOR SELECT
    USING (
        is_active = true AND
        EXISTS (
            SELECT 1 FROM public.businesses
            WHERE businesses.id = business_sponsors.business_id AND businesses.is_active = true
        )
    );

-- Business owners and Admins can view and manage business_sponsors
CREATE POLICY "Owners can view own business sponsors"
    ON public.business_sponsors FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.businesses
            WHERE businesses.id = business_sponsors.business_id AND businesses.user_id = auth.uid()
        )
        OR public.is_admin()
    );

CREATE POLICY "Admins manage business_sponsors"
    ON public.business_sponsors FOR ALL
    USING (public.is_admin());

-- ==============================================================================
-- ROLE ESCALATION PREVENTION
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.prevent_profile_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.role IS DISTINCT FROM OLD.role THEN
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

-- ==============================================================================
-- PUBLIC BUSINESS STATUS LOOKUP RPC (MINIMAL & SAFE)
-- ==============================================================================
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

GRANT EXECUTE ON FUNCTION public.get_public_business_status(TEXT) TO anon, authenticated;
