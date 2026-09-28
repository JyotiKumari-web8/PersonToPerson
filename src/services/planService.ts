import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Plan, Subscription, BusinessSubscriptionDetails, SubscriptionStatus } from '@/types';
import { localStore } from './store';

const isUUID = (str: string): boolean =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

export const planService = {
  /**
   * Fetch all plans. Platform admin sees all; public/users see active ones.
   */
  async getAllPlans(includeInactive: boolean = false): Promise<Plan[]> {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('plans').select('*').order('display_order', { ascending: true });
        if (!includeInactive) {
          query = query.eq('is_active', true);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data as Plan[];
        }
        if (error && error.code !== 'PGRST205') {
          console.error('Error fetching plans from Supabase:', error);
        }
      } catch (err) {
        console.warn('Supabase plans query exception, failing safe to restricted Free tier:', err);
      }

      // PRODUCTION SECURITY: Fail safe to minimal restricted Free plan.
      // Never allow browser localStorage to inject plans in production.
      return [
        {
          id: 'safe-free',
          name: 'Free',
          description: 'Standard free access tier',
          is_free: true,
          price: 0,
          currency: 'INR',
          billing_interval: 'lifetime',
          duration_days: null,
          features: ['single_permanent_url', 'qr_code', 'standard_icons'],
          limits: { max_links: 3, analytics_tier: 'basic' },
          is_active: true,
          display_order: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
    }

    const plans = localStore.getPlans();
    const filtered = includeInactive ? plans : plans.filter((p) => p.is_active);
    return filtered.sort((a, b) => a.display_order - b.display_order);
  },

  async getPlanById(id: string): Promise<Plan | null> {
    if (!id) return null;
    if (isSupabaseConfigured) {
      if (isUUID(id)) {
        try {
          const { data, error } = await supabase.from('plans').select('*').eq('id', id).maybeSingle();
          if (!error && data) return data as Plan;
        } catch (err) {
          console.warn('Error fetching plan by ID from Supabase:', err);
        }
      }
      return null;
    }

    const plans = localStore.getPlans();
    return plans.find((p) => p.id === id) || null;
  },

  /**
   * Admin: Create a new plan with dynamic limits and features
   */
  async createPlan(data: {
    name: string;
    description?: string;
    is_free: boolean;
    price: number;
    currency?: string;
    billing_interval: 'monthly' | 'yearly' | 'lifetime' | 'custom';
    duration_days?: number | null;
    features: string[];
    limits: {
      max_links?: number;
      analytics_tier?: 'basic' | 'standard' | 'advanced';
      [key: string]: unknown;
    };
    is_active?: boolean;
    display_order?: number;
  }): Promise<Plan> {
    const payload = {
      name: data.name.trim(),
      description: data.description?.trim() || null,
      is_free: data.is_free,
      price: data.is_free ? 0 : Number(data.price) || 0,
      currency: data.currency || 'INR',
      billing_interval: data.billing_interval,
      duration_days: data.duration_days ?? null,
      features: data.features || [],
      limits: data.limits || { max_links: 3 },
      is_active: data.is_active ?? true,
      display_order: data.display_order ?? 0,
    };

    if (isSupabaseConfigured) {
      const { data: created, error } = await supabase.from('plans').insert(payload).select().single();
      if (error) {
        if (error.code === 'PGRST205') {
          throw new Error('Database migration pending: Please run migration_plans_subscriptions.sql in Supabase SQL editor.');
        }
        throw error;
      }
      return created as Plan;
    }

    const newPlan: Plan = {
      id: `plan-${Date.now()}`,
      name: payload.name,
      description: payload.description || undefined,
      is_free: payload.is_free,
      price: payload.price,
      currency: payload.currency,
      billing_interval: payload.billing_interval,
      duration_days: payload.duration_days,
      features: payload.features,
      limits: payload.limits,
      is_active: payload.is_active,
      display_order: payload.display_order,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const plans = localStore.getPlans();
    plans.push(newPlan);
    localStore.savePlans(plans);
    return newPlan;
  },

  /**
   * Admin: Update an existing plan
   */
  async updatePlan(id: string, updates: Partial<Plan>): Promise<Plan> {
    const cleanUpdates = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    if (cleanUpdates.is_free) {
      cleanUpdates.price = 0;
    }

    if (isSupabaseConfigured) {
      if (!isUUID(id)) {
        throw new Error('Invalid plan ID format for database.');
      }
      const { data, error } = await supabase.from('plans').update(cleanUpdates).eq('id', id).select().single();
      if (error) {
        if (error.code === 'PGRST205') {
          throw new Error('Database migration pending: Please run migration_plans_subscriptions.sql in Supabase SQL editor.');
        }
        throw error;
      }
      return data as Plan;
    }

    const plans = localStore.getPlans();
    const index = plans.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Plan not found.');

    plans[index] = { ...plans[index], ...cleanUpdates };
    localStore.savePlans(plans);
    return plans[index];
  },

  /**
   * Admin: Delete plan (if not in use) or deactivate
   */
  async deletePlan(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      if (!isUUID(id)) {
        throw new Error('Invalid plan ID format for database.');
      }
      const { error } = await supabase.from('plans').delete().eq('id', id);
      if (error) {
        if (error.code === 'PGRST205') {
          throw new Error('Database migration pending: Please run migration_plans_subscriptions.sql in Supabase SQL editor.');
        }
        throw error;
      }
      return true;
    }

    let plans = localStore.getPlans();
    plans = plans.filter((p) => p.id !== id);
    localStore.savePlans(plans);
    return true;
  },

  /**
   * Admin: Fetch all subscriptions with business and plan details
   */
  async getAllSubscriptions(): Promise<Subscription[]> {
    if (isSupabaseConfigured) {
      try {
        const { data: subs, error: subError } = await supabase
          .from('subscriptions')
          .select(`
            id,
            business_id,
            plan_id,
            status,
            start_date,
            expires_at,
            notes,
            created_at,
            updated_at,
            plans (*)
          `)
          .order('created_at', { ascending: false });

        if (!subError && subs) {
          const { data: businesses } = await supabase.from('businesses').select('id, name, slug, user_id');
          const bizMap = new Map((businesses || []).map((b) => [b.id, b]));

          return subs.map((s: any) => ({
            id: s.id,
            business_id: s.business_id,
            plan_id: s.plan_id,
            status: s.status,
            start_date: s.start_date,
            expires_at: s.expires_at,
            notes: s.notes,
            created_at: s.created_at,
            updated_at: s.updated_at,
            plan: s.plans as Plan,
            business: bizMap.get(s.business_id) || undefined,
          })) as Subscription[];
        }
      } catch (err) {
        console.warn('Failed to load subscriptions from Supabase:', err);
      }

      // PRODUCTION SECURITY: Never fall back to mock subscriptions in production
      return [];
    }

    const subs = localStore.getSubscriptions();
    const plans = localStore.getPlans();
    const businesses = localStore.getBusinesses();

    const planMap = new Map(plans.map((p) => [p.id, p]));
    const bizMap = new Map(businesses.map((b) => [b.id, b]));

    return subs.map((s) => ({
      ...s,
      plan: planMap.get(s.plan_id),
      business: bizMap.get(s.business_id),
    }));
  },

  /**
   * Get subscription and active link limits/usage for a given business
   */
  async getSubscriptionByBusinessId(businessId: string): Promise<BusinessSubscriptionDetails | null> {
    if (!businessId) return null;

    if (isSupabaseConfigured && isUUID(businessId)) {
      try {
        // Attempt RPC first for single-roundtrip authoritative calculation
        const { data: rpcData, error: rpcError } = await supabase.rpc('get_business_subscription_details', {
          p_business_id: businessId,
        });

        if (!rpcError && rpcData) {
          return rpcData as BusinessSubscriptionDetails;
        }

        // Direct table query fallback
        const { data: sub } = await supabase
          .from('subscriptions')
          .select('*, plans (*)')
          .eq('business_id', businessId)
          .maybeSingle();

        const { count: linkCount } = await supabase
          .from('business_links')
          .select('id', { count: 'exact', head: true })
          .eq('business_id', businessId)
          .eq('is_active', true);

        if (sub && sub.plans) {
          const plan = sub.plans as Plan;
          return {
            subscription_id: sub.id,
            business_id: businessId,
            status: sub.status as SubscriptionStatus,
            start_date: sub.start_date,
            expires_at: sub.expires_at,
            notes: sub.notes,
            plan_id: plan.id,
            plan_name: plan.name,
            plan_description: plan.description,
            is_free: plan.is_free,
            price: plan.price,
            currency: plan.currency,
            billing_interval: plan.billing_interval,
            features: plan.features || [],
            limits: plan.limits || {},
            max_links: Number(plan.limits?.max_links) || 3,
            active_links_count: linkCount || 0,
          };
        }

        // Default Free Plan fallback
        const { data: defaultPlan } = await supabase
          .from('plans')
          .select('*')
          .eq('is_free', true)
          .eq('is_active', true)
          .order('created_at', { ascending: true })
          .limit(1)
          .maybeSingle();

        if (defaultPlan) {
          return {
            subscription_id: null,
            business_id: businessId,
            status: 'active',
            start_date: new Date().toISOString(),
            expires_at: null,
            notes: 'Default Free Plan',
            plan_id: defaultPlan.id,
            plan_name: defaultPlan.name,
            plan_description: defaultPlan.description,
            is_free: defaultPlan.is_free,
            price: defaultPlan.price,
            currency: defaultPlan.currency,
            billing_interval: defaultPlan.billing_interval,
            features: defaultPlan.features || [],
            limits: defaultPlan.limits || {},
            max_links: Number(defaultPlan.limits?.max_links) || 3,
            active_links_count: linkCount || 0,
          };
        }
      } catch (err) {
        console.warn('Error fetching subscription by business ID from Supabase:', err);
      }

      // PRODUCTION SECURITY: When Supabase is configured, NEVER read plan limits or subscriptions
      // from localStorage. Fail safely to the minimal restricted Free tier.
      return {
        subscription_id: null,
        business_id: businessId,
        status: 'active',
        start_date: new Date().toISOString(),
        expires_at: null,
        notes: 'Strict Safe Free Tier (Database Mode)',
        plan_id: 'default-free',
        plan_name: 'Free',
        plan_description: 'Standard free access tier',
        is_free: true,
        price: 0,
        currency: 'INR',
        billing_interval: 'lifetime',
        features: ['single_permanent_url', 'qr_code', 'standard_icons'],
        limits: { max_links: 3, analytics_tier: 'basic' },
        max_links: 3,
        active_links_count: 0,
      };
    }

    // LocalStore fallback (ONLY for pure offline development without Supabase)
    const subs = localStore.getSubscriptions();
    const plans = localStore.getPlans();
    const links = localStore.getLinks().filter((l) => l.business_id === businessId && l.is_active);

    const sub = subs.find((s) => s.business_id === businessId);
    let plan = sub ? plans.find((p) => p.id === sub.plan_id) : null;

    if (!plan) {
      plan = plans.find((p) => p.is_free && p.is_active) || plans[0];
    }

    if (!plan) return null;

    return {
      subscription_id: sub ? sub.id : null,
      business_id: businessId,
      status: sub ? sub.status : 'active',
      start_date: sub ? sub.start_date : new Date().toISOString(),
      expires_at: sub ? sub.expires_at : null,
      notes: sub ? sub.notes : 'Default Free Plan',
      plan_id: plan.id,
      plan_name: plan.name,
      plan_description: plan.description,
      is_free: plan.is_free,
      price: plan.price,
      currency: plan.currency,
      billing_interval: plan.billing_interval,
      features: plan.features || [],
      limits: plan.limits || {},
      max_links: Number(plan.limits?.max_links) || 3,
      active_links_count: links.length,
    };
  },

  /**
   * Admin: Assign or change a business's subscription plan
   */
  async assignPlanToBusiness(
    businessId: string,
    planId: string,
    options?: {
      startDate?: string;
      expiresAt?: string | null;
      status?: SubscriptionStatus;
      notes?: string;
    }
  ): Promise<Subscription> {
    const plan = await this.getPlanById(planId);
    if (!plan) throw new Error('Selected plan does not exist.');

    // Calculate default expiry date based on plan duration if not explicitly provided
    let calculatedExpiresAt = options?.expiresAt;
    if (calculatedExpiresAt === undefined) {
      if (plan.is_free || !plan.duration_days) {
        calculatedExpiresAt = null;
      } else {
        const d = new Date();
        d.setDate(d.getDate() + plan.duration_days);
        calculatedExpiresAt = d.toISOString();
      }
    }

    const payload = {
      business_id: businessId,
      plan_id: planId,
      status: options?.status || 'active',
      start_date: options?.startDate || new Date().toISOString(),
      expires_at: calculatedExpiresAt,
      notes: options?.notes || null,
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      if (!isUUID(businessId) || !isUUID(planId)) {
        throw new Error('Invalid business or plan ID format for database.');
      }
      const { data, error } = await supabase
        .from('subscriptions')
        .upsert(payload, { onConflict: 'business_id' })
        .select('*, plans (*)')
        .single();

      if (error) {
        if (error.code === 'PGRST205') {
          throw new Error('Database migration pending: Please run migration_plans_subscriptions.sql in Supabase SQL editor.');
        }
        throw error;
      }

      return {
        id: data.id,
        business_id: data.business_id,
        plan_id: data.plan_id,
        status: data.status as SubscriptionStatus,
        start_date: data.start_date,
        expires_at: data.expires_at,
        notes: data.notes,
        created_at: data.created_at,
        updated_at: data.updated_at,
        plan: data.plans as Plan,
      };
    }

    const subs = localStore.getSubscriptions();
    const existingIndex = subs.findIndex((s) => s.business_id === businessId);

    const updatedSub: Subscription = {
      id: existingIndex !== -1 ? subs[existingIndex].id : `sub-${Date.now()}`,
      business_id: businessId,
      plan_id: planId,
      status: payload.status as SubscriptionStatus,
      start_date: payload.start_date,
      expires_at: payload.expires_at,
      notes: payload.notes || undefined,
      created_at: existingIndex !== -1 ? subs[existingIndex].created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
      plan,
    };

    if (existingIndex !== -1) {
      subs[existingIndex] = updatedSub;
    } else {
      subs.push(updatedSub);
    }

    localStore.saveSubscriptions(subs);
    return updatedSub;
  },

  /**
   * Admin: Cancel or update subscription status
   */
  async updateSubscriptionStatus(
    subscriptionId: string,
    status: SubscriptionStatus,
    expiresAt?: string | null
  ): Promise<Subscription> {
    const updates: Partial<Subscription> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (expiresAt !== undefined) {
      updates.expires_at = expiresAt;
    }

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .update(updates)
          .eq('id', subscriptionId)
          .select('*, plans (*)')
          .single();

        if (!error && data) {
          return {
            ...data,
            plan: data.plans as Plan,
          } as Subscription;
        }
        if (error && error.code !== 'PGRST205') throw error;
      } catch (err: any) {
        if (err?.code !== 'PGRST205') {
          console.error('Failed to update subscription status in Supabase:', err);
          throw err;
        }
      }
    }

    const subs = localStore.getSubscriptions();
    const index = subs.findIndex((s) => s.id === subscriptionId);
    if (index === -1) throw new Error('Subscription not found.');

    subs[index] = { ...subs[index], ...updates };
    localStore.saveSubscriptions(subs);
    return subs[index];
  },
};
