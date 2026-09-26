import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { BusinessSponsor, Sponsor, SponsorPlacement } from '@/types';
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
      let rawData: unknown[] | null = null;
      const primary = await supabase
        .from('business_sponsors')
        .select(`
          id,
          business_id,
          sponsor_id,
          placement,
          display_order,
          is_active,
          created_at,
          sponsor:sponsors(*)
        `)
        .eq('business_id', businessId)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      // Fallback if column 'placement' does not exist yet in Supabase
      if (primary.error && primary.error.message?.includes('placement')) {
        const fallback = await supabase
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
        rawData = fallback.data;
      } else if (primary.error) {
        console.error('Error fetching business sponsors:', primary.error);
        return [];
      } else {
        rawData = primary.data;
      }

      return (((rawData as unknown as BusinessSponsor[]) || []).map((bs) => ({
        ...bs,
        placement: bs.placement || 'both',
      }))) as BusinessSponsor[];
    }

    const links = localStore.getBusinessSponsors().filter(
      (bs) => bs.business_id === businessId && bs.is_active
    );
    const sponsors = localStore.getSponsors();

    return links
      .map((l) => ({
        ...l,
        placement: l.placement || 'both',
        sponsor: sponsors.find((s) => s.id === l.sponsor_id && s.is_active),
      }))
      .filter((l) => Boolean(l.sponsor)) as BusinessSponsor[];
  },

  async getAllBusinessSponsors(): Promise<BusinessSponsor[]> {
    if (isSupabaseConfigured) {
      let rawData: unknown[] | null = null;
      const primary = await supabase
        .from('business_sponsors')
        .select(`
          id,
          business_id,
          sponsor_id,
          placement,
          display_order,
          is_active,
          created_at,
          sponsor:sponsors(*),
          business:businesses(id, name, slug)
        `)
        .order('created_at', { ascending: false });

      // Fallback if column 'placement' does not exist yet in Supabase
      if (primary.error && primary.error.message?.includes('placement')) {
        const fallback = await supabase
          .from('business_sponsors')
          .select(`
            id,
            business_id,
            sponsor_id,
            display_order,
            is_active,
            created_at,
            sponsor:sponsors(*),
            business:businesses(id, name, slug)
          `)
          .order('created_at', { ascending: false });
        rawData = fallback.data;
      } else if (primary.error) {
        console.error('Error fetching all business sponsors:', primary.error);
        return [];
      } else {
        rawData = primary.data;
      }

      return (((rawData as unknown as BusinessSponsor[]) || []).map((bs) => ({
        ...bs,
        placement: bs.placement || 'both',
      }))) as BusinessSponsor[];
    }

    const assignments = localStore.getBusinessSponsors();
    const sponsors = localStore.getSponsors();
    const businesses = localStore.getBusinesses();

    return assignments.map((bs) => ({
      ...bs,
      placement: bs.placement || 'both',
      sponsor: sponsors.find((s) => s.id === bs.sponsor_id),
      business: businesses.find((b) => b.id === bs.business_id),
    }));
  },

  async assignSponsorToBusiness(
    businessId: string,
    sponsorId: string,
    placement: SponsorPlacement = 'both'
  ): Promise<BusinessSponsor> {
    if (isSupabaseConfigured) {
      const payload: Record<string, unknown> = {
        business_id: businessId,
        sponsor_id: sponsorId,
        placement,
        is_active: true,
      };

      let record: unknown = null;
      const primary = await supabase
        .from('business_sponsors')
        .upsert(payload, { onConflict: 'business_id,sponsor_id' })
        .select(`*, sponsor:sponsors(*)`)
        .single();

      // Fallback if placement column does not exist yet
      if (primary.error && primary.error.message?.includes('placement')) {
        delete payload.placement;
        const retry = await supabase
          .from('business_sponsors')
          .upsert(payload, { onConflict: 'business_id,sponsor_id' })
          .select(`*, sponsor:sponsors(*)`)
          .single();
        if (retry.error) throw retry.error;
        record = retry.data;
      } else if (primary.error) {
        throw primary.error;
      } else {
        record = primary.data;
      }

      const bsRecord = record as BusinessSponsor;
      return {
        ...bsRecord,
        placement: bsRecord?.placement || placement,
      };
    }

    const all = localStore.getBusinessSponsors();
    const existingIndex = all.findIndex(
      (bs) => bs.business_id === businessId && bs.sponsor_id === sponsorId
    );

    const sponsors = localStore.getSponsors();
    const sponsorObj = sponsors.find((s) => s.id === sponsorId);

    if (existingIndex >= 0) {
      all[existingIndex].is_active = true;
      all[existingIndex].placement = placement;
      localStore.saveBusinessSponsors(all);
      return { ...all[existingIndex], sponsor: sponsorObj };
    }

    const newRecord: BusinessSponsor = {
      id: `bs-${Date.now()}`,
      business_id: businessId,
      sponsor_id: sponsorId,
      placement,
      display_order: 0,
      is_active: true,
      created_at: new Date().toISOString(),
      sponsor: sponsorObj,
    };

    all.push(newRecord);
    localStore.saveBusinessSponsors(all);
    return newRecord;
  },

  async updateAssignmentPlacement(
    assignmentId: string,
    placement: SponsorPlacement
  ): Promise<boolean> {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('business_sponsors')
        .update({ placement })
        .eq('id', assignmentId);

      if (error) {
        if (error.message?.includes('placement')) {
          console.warn('Database column placement does not exist yet. Please run migration.');
          return false;
        }
        throw error;
      }
      return true;
    }

    const all = localStore.getBusinessSponsors();
    const idx = all.findIndex((bs) => bs.id === assignmentId);
    if (idx >= 0) {
      all[idx].placement = placement;
      localStore.saveBusinessSponsors(all);
      return true;
    }
    return false;
  },

  async toggleAssignmentStatus(
    assignmentId: string,
    isActive: boolean
  ): Promise<boolean> {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('business_sponsors')
        .update({ is_active: isActive })
        .eq('id', assignmentId);

      if (error) throw error;
      return true;
    }

    const all = localStore.getBusinessSponsors();
    const idx = all.findIndex((bs) => bs.id === assignmentId);
    if (idx >= 0) {
      all[idx].is_active = isActive;
      localStore.saveBusinessSponsors(all);
      return true;
    }
    return false;
  },

  async removeAssignment(assignmentId: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('business_sponsors')
        .delete()
        .eq('id', assignmentId);

      if (error) throw error;
      return true;
    }

    let all = localStore.getBusinessSponsors();
    all = all.filter((bs) => bs.id !== assignmentId);
    localStore.saveBusinessSponsors(all);
    return true;
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

  async getSponsorClickCounts(): Promise<Record<string, number>> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('metadata')
        .eq('event_type', 'sponsor_click');

      if (error || !data) return {};
      const counts: Record<string, number> = {};
      data.forEach((row: { metadata?: Record<string, unknown> }) => {
        const id = row.metadata?.sponsorId;
        if (typeof id === 'string') {
          counts[id] = (counts[id] || 0) + 1;
        }
      });
      return counts;
    }

    const allEvents = localStore.getAnalytics().filter((e) => e.event_type === 'sponsor_click');
    const counts: Record<string, number> = {};
    allEvents.forEach((row) => {
      const id = row.metadata?.sponsorId;
      if (typeof id === 'string') {
        counts[id] = (counts[id] || 0) + 1;
      }
    });
    return counts;
  },
};
