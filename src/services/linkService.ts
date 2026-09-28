import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { BusinessLink, LinkType } from '@/types';
import { localStore } from './store';
import { normalizeUrl } from '@/lib/utils';
import { planService } from './planService';
import { authService } from './authService';

export const linkService = {
  async getLinksByBusinessId(businessId: string, activeOnly: boolean = false): Promise<BusinessLink[]> {
    if (!businessId) return [];

    if (isSupabaseConfigured) {
      let query = supabase
        .from('business_links')
        .select('*')
        .eq('business_id', businessId)
        .order('display_order', { ascending: true });

      if (activeOnly) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching links:', error);
        return [];
      }
      return (data as BusinessLink[]) || [];
    }

    const links = localStore.getLinks().filter((l) => l.business_id === businessId);
    const filtered = activeOnly ? links.filter((l) => l.is_active) : links;
    return filtered.sort((a, b) => a.display_order - b.display_order);
  },

  async createLink(payload: {
    business_id: string;
    label: string;
    url: string;
    link_type: LinkType;
    is_active?: boolean;
    display_order?: number;
  }): Promise<BusinessLink> {
    const existing = await this.getLinksByBusinessId(payload.business_id, false);
    const cleanedUrl = normalizeUrl(payload.url, payload.link_type);
    const willBeActive = payload.is_active ?? true;

    // BUG 1 & BUG 4: Prevent duplicate active link for the same platform
    if (willBeActive) {
      const duplicate = existing.find((l) => l.is_active && l.link_type === payload.link_type);
      if (duplicate) {
        throw new Error(
          `A link for this platform is already active. Duplicate platforms are not allowed.`
        );
      }
    }

    // BUG 5: Proactive Plan Limits check (Platform Admin / Admin bypass)
    if (willBeActive) {
      const profile = await authService.getCurrentProfile().catch(() => null);
      const isPrivileged = profile?.role === 'platform_owner' || profile?.role === 'admin';

      if (!isPrivileged) {
        try {
          const sub = await planService.getSubscriptionByBusinessId(payload.business_id);
          if (sub && sub.max_links > 0 && sub.active_links_count >= sub.max_links) {
            throw new Error(
              `Plan limit reached: Your current ${sub.plan_name} plan allows up to ${sub.max_links} active links. Contact Platform Admin to upgrade.`
            );
          }
        } catch (subErr: any) {
          if (subErr?.message?.includes('Plan limit reached')) {
            throw subErr;
          }
        }
      }
    }

    const nextOrder = payload.display_order ?? (existing.length > 0 ? Math.max(...existing.map((l) => l.display_order)) + 1 : 0);

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('business_links')
        .insert({
          business_id: payload.business_id,
          label: payload.label.trim(),
          url: cleanedUrl,
          link_type: payload.link_type,
          is_active: payload.is_active ?? true,
          display_order: nextOrder,
        })
        .select()
        .single();

      if (error) throw error;
      return data as BusinessLink;
    }

    const newLink: BusinessLink = {
      id: `link-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      business_id: payload.business_id,
      label: payload.label.trim(),
      url: cleanedUrl,
      link_type: payload.link_type,
      is_active: payload.is_active ?? true,
      display_order: nextOrder,
      created_at: new Date().toISOString(),
    };

    const links = localStore.getLinks();
    links.push(newLink);
    localStore.saveLinks(links);
    return newLink;
  },

  async updateLink(
    id: string,
    updates: Partial<Omit<BusinessLink, 'id' | 'business_id' | 'created_at'>>
  ): Promise<BusinessLink> {
    const cleanUpdates = { ...updates };
    if (cleanUpdates.url && cleanUpdates.link_type) {
      cleanUpdates.url = normalizeUrl(cleanUpdates.url, cleanUpdates.link_type);
    } else if (cleanUpdates.url) {
      cleanUpdates.url = normalizeUrl(cleanUpdates.url);
    }

    if (cleanUpdates.label) {
      cleanUpdates.label = cleanUpdates.label.trim();
    }

    // If updating platform type or activating link, enforce duplicate prevention and plan limits
    if (cleanUpdates.is_active === true || cleanUpdates.link_type) {
      try {
        let currentBizId: string | null = null;
        let wasActive = true;
        let currentType: LinkType | null = null;

        if (isSupabaseConfigured) {
          const { data: linkRec } = await supabase
            .from('business_links')
            .select('business_id, is_active, link_type')
            .eq('id', id)
            .maybeSingle();
          if (linkRec) {
            currentBizId = linkRec.business_id;
            wasActive = Boolean(linkRec.is_active);
            currentType = linkRec.link_type as LinkType;
          }
        } else {
          const localL = localStore.getLinks().find((l) => l.id === id);
          if (localL) {
            currentBizId = localL.business_id;
            wasActive = localL.is_active;
            currentType = localL.link_type;
          }
        }

        const effectiveType = cleanUpdates.link_type || currentType;
        const effectiveActive = cleanUpdates.is_active !== undefined ? cleanUpdates.is_active : wasActive;

        // Prevent duplicate active platform
        if (currentBizId && effectiveActive && effectiveType) {
          const allLinks = await this.getLinksByBusinessId(currentBizId, false);
          const duplicate = allLinks.find(
            (l) => l.is_active && l.link_type === effectiveType && l.id !== id
          );
          if (duplicate) {
            throw new Error('A link for this platform is already active. Duplicate platforms are not allowed.');
          }
        }

        // Plan limits check (Platform Admin / Admin bypass)
        if (currentBizId && cleanUpdates.is_active === true && !wasActive) {
          const profile = await authService.getCurrentProfile().catch(() => null);
          const isPrivileged = profile?.role === 'platform_owner' || profile?.role === 'admin';

          if (!isPrivileged) {
            const sub = await planService.getSubscriptionByBusinessId(currentBizId);
            if (sub && sub.max_links > 0 && sub.active_links_count >= sub.max_links) {
              throw new Error(
                `Plan limit reached: Your current ${sub.plan_name} plan allows up to ${sub.max_links} active links. Contact Platform Admin to upgrade.`
              );
            }
          }
        }
      } catch (err: any) {
        if (
          err?.message?.includes('Plan limit reached') ||
          err?.message?.includes('already active')
        ) {
          throw err;
        }
      }
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('business_links')
        .update({
          ...cleanUpdates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as BusinessLink;
    }

    const links = localStore.getLinks();
    const index = links.findIndex((l) => l.id === id);
    if (index === -1) throw new Error('Link not found.');

    links[index] = {
      ...links[index],
      ...cleanUpdates,
      updated_at: new Date().toISOString(),
    };
    localStore.saveLinks(links);
    return links[index];
  },

  async deleteLink(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('business_links').delete().eq('id', id);
      if (error) throw error;
      return true;
    }

    let links = localStore.getLinks();
    links = links.filter((l) => l.id !== id);
    localStore.saveLinks(links);
    return true;
  },

  async reorderLinks(businessId: string, orderedLinkIds: string[]): Promise<BusinessLink[]> {
    if (isSupabaseConfigured) {
      // Update each order in Supabase
      const updatePromises = orderedLinkIds.map((id, index) =>
        supabase
          .from('business_links')
          .update({ display_order: index, updated_at: new Date().toISOString() })
          .eq('id', id)
      );
      await Promise.all(updatePromises);
      return this.getLinksByBusinessId(businessId);
    }

    const allLinks = localStore.getLinks();
    const updatedLinks = allLinks.map((l) => {
      if (l.business_id === businessId) {
        const orderIdx = orderedLinkIds.indexOf(l.id);
        if (orderIdx !== -1) {
          return { ...l, display_order: orderIdx, updated_at: new Date().toISOString() };
        }
      }
      return l;
    });

    localStore.saveLinks(updatedLinks);
    return updatedLinks
      .filter((l) => l.business_id === businessId)
      .sort((a, b) => a.display_order - b.display_order);
  },
};
