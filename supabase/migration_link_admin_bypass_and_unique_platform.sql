-- ==============================================================================
-- PersonToPerson: Link Platform Admin Bypass & Unique Active Platform Migration
-- Target: Supabase SQL Editor (Run with admin / postgres privileges)
-- Non-destructive: No DELETE, No UPDATE, No DROP, No TRUNCATE
-- ==============================================================================

-- 1. Update enforce_business_link_limit() to allow Platform Admin / Admin bypass
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
    -- Platform Admin / Admin bypass: allow unrestricted link management
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

-- 2. Create unique index for active non-custom platforms per business
CREATE UNIQUE INDEX IF NOT EXISTS idx_business_links_unique_active_platform
ON public.business_links (business_id, link_type)
WHERE is_active = true AND link_type != 'custom';
