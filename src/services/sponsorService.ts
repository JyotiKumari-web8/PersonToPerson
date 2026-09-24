import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { BusinessSponsor, Sponsor } from '@/types';
import { localStore } from './store';

export const sponsorService = {
  async getAllSponsors(): Promise<Sponsor[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching sponsors:', error);
        return [];
      }
      return (data as Sponsor[]) || [];
    }

    return localStore.getSponsors();
  },

  async createSponsor(payload: {
    name: string;
    logo_url?: string;
    website_url: string;
    description?: string;
  }): Promise<Sponsor> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('sponsors')
        .insert({
          name: payload.name.trim(),
          logo_url: payload.logo_url || null,
          website_url: payload.website_url.trim(),
          description: payload.description || null,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Sponsor;
    }

    const newSponsor: Sponsor = {
      id: `spon-${Date.now()}`,
      name: payload.name.trim(),
      logo_url: payload.logo_url,
      website_url: payload.website_url.trim(),
      description: payload.description,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    const sponsors = localStore.getSponsors();
    sponsors.push(newSponsor);
    localStore.saveSponsors(sponsors);
    return newSponsor;
  },

  async updateSponsor(id: string, updates: Partial<Sponsor>): Promise<Sponsor> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('sponsors')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Sponsor;
    }

    const sponsors = localStore.getSponsors();
    const index = sponsors.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('Sponsor not found.');

    sponsors[index] = {
      ...sponsors[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    localStore.saveSponsors(sponsors);
    return sponsors[index];
  },

  async deleteSponsor(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('sponsors').delete().eq('id', id);
      if (error) throw error;
      return true;
    }

    let sponsors = localStore.getSponsors();
    sponsors = sponsors.filter((s) => s.id !== id);
    localStore.saveSponsors(sponsors);
    return true;
  },

  async getBusinessSponsors(businessId: string): Promise<BusinessSponsor[]> {
    if (!businessId) return [];

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('business_sponsors')
        .select(`
          id,
          business_id,
          sponsor_id,
          display_order,
          is_active,
          created_at,
          sponsor:sponsors(*)
        `)
        .eq('business_id', businessId)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching business sponsors:', error);
        return [];
      }

      return (data as unknown as BusinessSponsor[]) || [];
    }

    const links = localStore.getBusinessSponsors().filter(
      (bs) => bs.business_id === businessId && bs.is_active
    );
    const sponsors = localStore.getSponsors();

    return links
      .map((l) => ({
        ...l,
        sponsor: sponsors.find((s) => s.id === l.sponsor_id && s.is_active),
      }))
      .filter((l) => Boolean(l.sponsor)) as BusinessSponsor[];
  },

  async assignSponsorToBusiness(businessId: string, sponsorId: string): Promise<BusinessSponsor> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('business_sponsors')
        .upsert(
          {
            business_id: businessId,
            sponsor_id: sponsorId,
            is_active: true,
          },
          { onConflict: 'business_id,sponsor_id' }
        )
        .select(`*, sponsor:sponsors(*)`)
        .single();

      if (error) throw error;
      return data as unknown as BusinessSponsor;
    }

    const all = localStore.getBusinessSponsors();
    const existingIndex = all.findIndex(
      (bs) => bs.business_id === businessId && bs.sponsor_id === sponsorId
    );

    const sponsors = localStore.getSponsors();
    const sponsorObj = sponsors.find((s) => s.id === sponsorId);

    if (existingIndex >= 0) {
      all[existingIndex].is_active = true;
      localStore.saveBusinessSponsors(all);
      return { ...all[existingIndex], sponsor: sponsorObj };
    }

    const newRecord: BusinessSponsor = {
      id: `bs-${Date.now()}`,
      business_id: businessId,
      sponsor_id: sponsorId,
      display_order: 0,
      is_active: true,
      created_at: new Date().toISOString(),
      sponsor: sponsorObj,
    };

    all.push(newRecord);
    localStore.saveBusinessSponsors(all);
    return newRecord;
  },

  async removeSponsorFromBusiness(businessId: string, sponsorId: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('business_sponsors')
        .delete()
        .eq('business_id', businessId)
        .eq('sponsor_id', sponsorId);

      if (error) throw error;
      return true;
    }

    let all = localStore.getBusinessSponsors();
    all = all.filter((bs) => !(bs.business_id === businessId && bs.sponsor_id === sponsorId));
    localStore.saveBusinessSponsors(all);
    return true;
  },
};
