-- ==============================================================================
-- PersonToPerson: Admin-Controlled Subscription & Plans System Migration
-- Target: Supabase SQL Editor (Run with admin/postgres privilege)
-- ==============================================================================

-- 1. CREATE PLANS TABLE
-- Fully controlled by Platform Admin. No hardcoded limits or fixed prices in application code.
CREATE TABLE IF NOT EXISTS public.plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    is_free BOOLEAN NOT NULL DEFAULT false,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT 'INR',
    billing_interval TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_interval IN ('monthly', 'yearly', 'lifetime', 'custom')),
    duration_days INTEGER, -- e.g. 30, 365, NULL for lifetime/unlimited
    features JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of feature string keys or objects
    limits JSONB NOT NULL DEFAULT '{"max_links": 3}'::jsonb, -- Key-value limits e.g. {"max_links": 3, "analytics_tier": "basic"}
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. CREATE SUBSCRIPTIONS TABLE
-- Links a business to an admin-assigned plan. Controlled strictly by Platform Admin.
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE RESTRICT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled', 'past_due')),
    start_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ, -- NULL for lifetime / free non-expiring
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_business_subscription UNIQUE (business_id)
);

-- Indexes for high-performance lookup
CREATE INDEX IF NOT EXISTS idx_plans_is_active ON public.plans(is_active);
CREATE INDEX IF NOT EXISTS idx_subscriptions_business_id ON public.subscriptions(business_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);

-- 3. AUTOMATIC UPDATED_AT TRIGGERS
DROP TRIGGER IF EXISTS trg_plans_updated_at ON public.plans;
CREATE TRIGGER trg_plans_updated_at
    BEFORE UPDATE ON public.plans
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS trg_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER trg_subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Plans Policies:
-- Public and authenticated users can view active plans
DROP POLICY IF EXISTS "Public and users can view active plans" ON public.plans;
CREATE POLICY "Public and users can view active plans"
    ON public.plans FOR SELECT
    USING (is_active = true OR public.is_admin());

-- STRICT SECURITY: Only Platform Owner / Admin can insert/update/delete plans
DROP POLICY IF EXISTS "Admins can manage plans" ON public.plans;
CREATE POLICY "Admins can manage plans"
    ON public.plans FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Subscriptions Policies:
-- Business owner can view their own business's subscription; Admin can view all
DROP POLICY IF EXISTS "Owners can view own subscription" ON public.subscriptions;
CREATE POLICY "Owners can view own subscription"
    ON public.subscriptions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.businesses
            WHERE businesses.id = subscriptions.business_id AND businesses.user_id = auth.uid()
        )
        OR public.is_admin()
    );

-- STRICT SECURITY: ONLY Admin can insert, update, or delete subscriptions!
-- Business owners CANNOT create, modify, or escalate their subscriptions via client SDK!
DROP POLICY IF EXISTS "Admins can manage subscriptions" ON public.subscriptions;
CREATE POLICY "Admins can manage subscriptions"
    ON public.subscriptions FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 5. SEED DEFAULT ADMIN-CONTROLLED PLANS (IF EMPTY)
-- FREE is an actual plan managed by Admin, not a hardcoded special case.
INSERT INTO public.plans (name, description, is_free, price, currency, billing_interval, duration_days, features, limits, is_active, display_order)
SELECT 'Free', 'Standard plan for emerging businesses and professionals.', true, 0.00, 'INR', 'lifetime', NULL,
       '["single_permanent_url", "qr_code", "basic_analytics", "standard_icons"]'::jsonb,
       '{"max_links": 3, "analytics_tier": "basic"}'::jsonb, true, 1
WHERE NOT EXISTS (SELECT 1 FROM public.plans WHERE is_free = true);

INSERT INTO public.plans (name, description, is_free, price, currency, billing_interval, duration_days, features, limits, is_active, display_order)
SELECT 'Basic Growth', 'Expanded link capacity and analytics for established retail & services.', false, 499.00, 'INR', 'monthly', 30,
       '["single_permanent_url", "qr_code", "standard_analytics", "standard_icons", "priority_indexing"]'::jsonb,
       '{"max_links": 6, "analytics_tier": "standard"}'::jsonb, true, 2
WHERE NOT EXISTS (SELECT 1 FROM public.plans WHERE name = 'Basic Growth');

INSERT INTO public.plans (name, description, is_free, price, currency, billing_interval, duration_days, features, limits, is_active, display_order)
SELECT 'Pro Enterprise', 'Maximum link flexibility, advanced analytics, and partner brand positioning.', false, 1499.00, 'INR', 'yearly', 365,
       '["single_permanent_url", "qr_code", "advanced_analytics", "standard_icons", "partner_sponsor_placement", "priority_support"]'::jsonb,
       '{"max_links": 12, "analytics_tier": "advanced"}'::jsonb, true, 3
WHERE NOT EXISTS (SELECT 1 FROM public.plans WHERE name = 'Pro Enterprise');

-- 6. AUTO-ASSIGN FREE PLAN TO EXISTING BUSINESSES WITHOUT A SUBSCRIPTION
INSERT INTO public.subscriptions (business_id, plan_id, status, start_date, expires_at)
SELECT b.id, p.id, 'active', now(), NULL
FROM public.businesses b
CROSS JOIN LATERAL (
    SELECT id FROM public.plans WHERE is_free = true AND is_active = true ORDER BY created_at ASC LIMIT 1
) p
WHERE NOT EXISTS (SELECT 1 FROM public.subscriptions s WHERE s.business_id = b.id);

-- 7. AUTO-ASSIGN FREE PLAN TRIGGER FOR NEW BUSINESSES
CREATE OR REPLACE FUNCTION public.handle_new_business_subscription()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_free_plan_id UUID;
BEGIN
    SELECT id INTO v_free_plan_id
    FROM public.plans
    WHERE is_free = true AND is_active = true
    ORDER BY created_at ASC
    LIMIT 1;

    IF v_free_plan_id IS NOT NULL THEN
        INSERT INTO public.subscriptions (business_id, plan_id, status, start_date, expires_at)
        VALUES (NEW.id, v_free_plan_id, 'active', now(), NULL)
        ON CONFLICT (business_id) DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_new_business_subscription ON public.businesses;
CREATE TRIGGER trg_new_business_subscription
    AFTER INSERT ON public.businesses
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_business_subscription();

-- 8. SERVER-SIDE DATABASE PLAN ENFORCEMENT: Max Active Links Trigger on business_links
-- Treats frontend as UNTRUSTED. Directly prevents API / devtools bypassing.
-- Hardened against concurrency race conditions via row-level lock on the business record.
CREATE OR REPLACE FUNCTION public.enforce_business_link_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_max_links INTEGER;
    v_current_count INTEGER;
    v_plan_name TEXT;
    v_sub_status TEXT;
BEGIN
    -- Platform Admin / Admin bypass: allow unrestricted management
    IF public.is_admin() THEN
        RETURN NEW;
    END IF;

    -- Only enforce if link is being set to active
    IF NEW.is_active = true AND (TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.is_active = false)) THEN
        -- CONCURRENCY SAFETY: Acquire row-level lock on the parent business to prevent race conditions
        PERFORM 1 FROM public.businesses WHERE id = NEW.business_id FOR UPDATE;

        -- 1. Fetch current subscription and plan limits for the business
        SELECT
            (p.limits->>'max_links')::INTEGER,
            p.name,
            s.status
        INTO
            v_max_links,
            v_plan_name,
            v_sub_status
        FROM public.subscriptions s
        JOIN public.plans p ON p.id = s.plan_id
        WHERE s.business_id = NEW.business_id;

        -- 2. Fallback to default active Free plan if no subscription record exists
        IF v_max_links IS NULL THEN
            SELECT
                (limits->>'max_links')::INTEGER,
                name
            INTO
                v_max_links,
                v_plan_name
            FROM public.plans
            WHERE is_free = true AND is_active = true
            ORDER BY created_at ASC
            LIMIT 1;
        END IF;

        -- 3. If subscription is expired or cancelled, disallow activating new links
        IF v_sub_status = 'expired' OR v_sub_status = 'cancelled' THEN
            RAISE EXCEPTION 'Subscription is % for this business. Please contact Platform Admin to renew.', v_sub_status;
        END IF;

        -- 4. Count active links and enforce limit if max_links is configured and positive
        IF v_max_links IS NOT NULL AND v_max_links > 0 THEN
            SELECT count(*) INTO v_current_count
            FROM public.business_links
            WHERE business_id = NEW.business_id
              AND is_active = true
              AND (TG_OP = 'INSERT' OR id != NEW.id);

            IF v_current_count >= v_max_links THEN
                RAISE EXCEPTION 'Plan limit exceeded: Your current plan (%) allows a maximum of % active links. Contact Platform Admin to upgrade.', v_plan_name, v_max_links;
            END IF;
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_business_link_limit ON public.business_links;
CREATE TRIGGER trg_enforce_business_link_limit
    BEFORE INSERT OR UPDATE ON public.business_links
    FOR EACH ROW EXECUTE PROCEDURE public.enforce_business_link_limit();

-- 9. SAFE RPC FOR BUSINESS SUBSCRIPTION & USAGE DETAILS
-- Protected: Only the business owner or Platform Admin can query subscription details.
CREATE OR REPLACE FUNCTION public.get_business_subscription_details(p_business_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_result JSONB;
    v_active_links_count INTEGER;
BEGIN
    -- Authorization check: caller must be admin or the owner of this business
    IF NOT public.is_admin() THEN
        IF NOT EXISTS (
            SELECT 1 FROM public.businesses
            WHERE id = p_business_id AND user_id = auth.uid()
        ) THEN
            RAISE EXCEPTION 'Access denied: You are not authorized to view this subscription.';
        END IF;
    END IF;

    -- Count active links for this business
    SELECT count(*) INTO v_active_links_count
    FROM public.business_links
    WHERE business_id = p_business_id AND is_active = true;

    -- Fetch subscription with plan details
    SELECT jsonb_build_object(
        'subscription_id', s.id,
        'business_id', s.business_id,
        'status', s.status,
        'start_date', s.start_date,
        'expires_at', s.expires_at,
        'notes', s.notes,
        'plan_id', p.id,
        'plan_name', p.name,
        'plan_description', p.description,
        'is_free', p.is_free,
        'price', p.price,
        'currency', p.currency,
        'billing_interval', p.billing_interval,
        'features', p.features,
        'limits', p.limits,
        'max_links', COALESCE((p.limits->>'max_links')::INTEGER, 3),
        'active_links_count', v_active_links_count
    ) INTO v_result
    FROM public.subscriptions s
    JOIN public.plans p ON p.id = s.plan_id
    WHERE s.business_id = p_business_id;

    -- Graceful fallback if no explicit subscription row exists yet
    IF v_result IS NULL THEN
        SELECT jsonb_build_object(
            'subscription_id', NULL,
            'business_id', p_business_id,
            'status', 'active',
            'start_date', now(),
            'expires_at', NULL,
            'notes', 'Default unassigned plan',
            'plan_id', p.id,
            'plan_name', p.name,
            'plan_description', p.description,
            'is_free', p.is_free,
            'price', p.price,
            'currency', p.currency,
            'billing_interval', p.billing_interval,
            'features', p.features,
            'limits', p.limits,
            'max_links', COALESCE((p.limits->>'max_links')::INTEGER, 3),
            'active_links_count', v_active_links_count
        ) INTO v_result
        FROM public.plans p
        WHERE p.is_free = true AND p.is_active = true
        ORDER BY p.created_at ASC
        LIMIT 1;
    END IF;

    RETURN v_result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_business_subscription_details(UUID) TO anon, authenticated;
