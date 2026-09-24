import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Business } from '@/types';
import { localStore } from './store';
import { generateSlug } from '@/lib/utils';

export const businessService = {
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
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data as Business[]) || [];
    }

    return localStore.getBusinesses();
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
