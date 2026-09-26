import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Business, PublicBusinessStatus } from '@/types';
import { localStore } from './store';
import { generateSlug } from '@/lib/utils';

export const businessService = {
  /**
   * Minimal public status check via secure SECURITY DEFINER RPC.
   * Returns ONLY id, slug, name, and is_active without exposing sensitive details.
   */
  async getPublicBusinessStatus(slug: string): Promise<PublicBusinessStatus | null> {
    if (!slug) return null;
    const cleanSlug = slug.trim().toLowerCase();

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.rpc('get_public_business_status', {
          p_slug: cleanSlug,
        });

        if (error) {
          // If RPC is not yet created in Supabase database, graceful fallback
          console.warn('RPC get_public_business_status fallback:', error.message);
          const fallback = await this.getBusinessBySlug(cleanSlug);
          return fallback
            ? { id: fallback.id, slug: fallback.slug, name: fallback.name, is_active: fallback.is_active }
            : null;
        }

        const record = Array.isArray(data) ? data[0] : data;
        return record
          ? {
              id: record.id,
              slug: record.slug,
              name: record.name,
              is_active: Boolean(record.is_active),
            }
          : null;
      } catch (err) {
        console.warn('Error calling get_public_business_status RPC:', err);
        const fallback = await this.getBusinessBySlug(cleanSlug);
        return fallback
          ? { id: fallback.id, slug: fallback.slug, name: fallback.name, is_active: fallback.is_active }
          : null;
      }
    }

    const businesses = localStore.getBusinesses();
    const found = businesses.find((b) => b.slug.toLowerCase() === cleanSlug);
    return found
      ? { id: found.id, slug: found.slug, name: found.name, is_active: found.is_active }
      : null;
  },

  async getBusinessBySlug(slug: string): Promise<Business | null> {
    if (!slug) return null;
    const cleanSlug = slug.trim().toLowerCase();

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('slug', cleanSlug)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('Error fetching business by slug:', error);
        return null;
      }
      return data as Business | null;
    }

    const businesses = localStore.getBusinesses();
    const found = businesses.find(
      (b) => b.slug.toLowerCase() === cleanSlug && b.is_active
    );
    return found || null;
  },

  async getBusinessByUserId(userId: string): Promise<Business | null> {
    if (!userId) return null;

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .maybeSingle();

      if (error) {
        console.error('Error fetching business by user_id:', error);
        return null;
      }
      return data as Business | null;
    }

    const businesses = localStore.getBusinesses();
    const found = businesses.find((b) => b.user_id === userId);
    return found || null;
  },

  async getAllBusinesses(): Promise<Business[]> {
    if (isSupabaseConfigured) {
      const { data: businesses, error } = await supabase
        .from('businesses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!businesses || businesses.length === 0) return [];

      // Enrich with owner profile details for Platform Owner view
      try {
        const userIds = Array.from(new Set(businesses.map((b) => b.user_id).filter(Boolean)));
        if (userIds.length > 0) {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, email, full_name')
            .in('id', userIds);

          const profileMap = new Map((profiles || []).map((p) => [p.id, p]));

          return businesses.map((b) => {
            const ownerProfile = profileMap.get(b.user_id);
            return {
              ...b,
              owner_email: ownerProfile?.email || b.email || undefined,
              owner_name: ownerProfile?.full_name || undefined,
            };
          }) as Business[];
        }
      } catch (profileErr) {
        console.warn('Could not load owner profiles for admin view:', profileErr);
      }

      return businesses as Business[];
    }

    const businesses = localStore.getBusinesses();
    const users = localStore.getUsers();
    const userMap = new Map(users.map((u) => [u.id, u]));

    return businesses.map((b) => ({
      ...b,
      owner_email: userMap.get(b.user_id)?.email || b.email || undefined,
      owner_name: userMap.get(b.user_id)?.full_name || undefined,
    }));
  },

  async checkSlugAvailability(slug: string, currentBusinessId?: string): Promise<boolean> {
    const cleanSlug = slug.trim().toLowerCase();
    if (!cleanSlug) return false;

    if (isSupabaseConfigured) {
      let query = supabase.from('businesses').select('id').eq('slug', cleanSlug);
      if (currentBusinessId) {
        query = query.neq('id', currentBusinessId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return !data || data.length === 0;
    }

    const businesses = localStore.getBusinesses();
    const duplicate = businesses.find(
      (b) => b.slug.toLowerCase() === cleanSlug && b.id !== currentBusinessId
    );
    return !duplicate;
  },

  async createBusiness(payload: {
    user_id: string;
    name: string;
    slug?: string;
    logo_url?: string;
    cover_url?: string;
    description?: string;
    phone?: string;
    email?: string;
    address?: string;
    category?: string;
    city?: string;
  }): Promise<Business> {
    let finalSlug = payload.slug ? payload.slug.trim().toLowerCase() : generateSlug(payload.name);
    
    // Ensure slug uniqueness
    let isAvailable = await this.checkSlugAvailability(finalSlug);
    let counter = 1;
    while (!isAvailable) {
      finalSlug = `${generateSlug(payload.name)}-${counter++}`;
      isAvailable = await this.checkSlugAvailability(finalSlug);
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('businesses')
        .insert({
          user_id: payload.user_id,
          name: payload.name.trim(),
          slug: finalSlug,
          logo_url: payload.logo_url || null,
          cover_url: payload.cover_url || null,
          description: payload.description || null,
          phone: payload.phone || null,
          email: payload.email || null,
          address: payload.address || null,
          category: payload.category || null,
          city: payload.city || null,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Business;
    }

    // Local fallback
    const newBusiness: Business = {
      id: `biz-${Date.now()}`,
      user_id: payload.user_id,
      name: payload.name.trim(),
      slug: finalSlug,
      logo_url: payload.logo_url,
      cover_url: payload.cover_url,
      description: payload.description,
      phone: payload.phone,
      email: payload.email,
      address: payload.address,
      category: payload.category,
      city: payload.city,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    const businesses = localStore.getBusinesses();
    businesses.push(newBusiness);
    localStore.saveBusinesses(businesses);
    return newBusiness;
  },

  async updateBusiness(
    id: string,
    updates: Partial<Omit<Business, 'id' | 'user_id' | 'created_at'>>
  ): Promise<Business> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('businesses')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Business;
    }

    const businesses = localStore.getBusinesses();
    const index = businesses.findIndex((b) => b.id === id);
    if (index === -1) throw new Error('Business not found.');

    businesses[index] = {
      ...businesses[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    localStore.saveBusinesses(businesses);
    return businesses[index];
  },
};
