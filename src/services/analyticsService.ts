import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { AnalyticsEvent, AnalyticsSummary, DailyActivityStat, LinkClickStat } from '@/types';
import { localStore } from './store';
import { getDeviceType } from '@/lib/utils';
import { linkService } from './linkService';

export const analyticsService = {
  async trackVisit(businessId: string): Promise<void> {
    if (!businessId) return;

    // Deduplicate rapid repeat refreshes in same tab session
    const sessionKey = `p2p_visited_${businessId}`;
    if (sessionStorage.getItem(sessionKey)) return;
    sessionStorage.setItem(sessionKey, '1');

    const metadata = {
      deviceType: getDeviceType(),
      referrer: document.referrer || 'direct',
      screen: `${window.innerWidth}x${window.innerHeight}`,
    };

    if (isSupabaseConfigured) {
      try {
        await supabase.from('analytics_events').insert({
          business_id: businessId,
          event_type: 'visit',
          metadata,
        });
      } catch (err) {
        console.error('Failed to log visit analytics event:', err);
      }
      return;
    }

    const event: AnalyticsEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      business_id: businessId,
      event_type: 'visit',
      metadata,
      created_at: new Date().toISOString(),
    };
    localStore.recordAnalyticsEvent(event);
  },

  async trackLinkClick(businessId: string, linkId: string): Promise<void> {
    if (!businessId || !linkId) return;

    const metadata = {
      deviceType: getDeviceType(),
      referrer: document.referrer || 'direct',
    };

    if (isSupabaseConfigured) {
      try {
        await supabase.from('analytics_events').insert({
          business_id: businessId,
          link_id: linkId,
          event_type: 'link_click',
          metadata,
        });
      } catch (err) {
        console.error('Failed to log link click:', err);
      }
      return;
    }

    const event: AnalyticsEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      business_id: businessId,
      link_id: linkId,
      event_type: 'link_click',
      metadata,
      created_at: new Date().toISOString(),
    };
    localStore.recordAnalyticsEvent(event);
  },

  async trackSponsorClick(businessId: string, sponsorId: string): Promise<void> {
    if (!businessId) return;

    const metadata = {
      sponsorId,
      deviceType: getDeviceType(),
    };

    if (isSupabaseConfigured) {
      try {
        await supabase.from('analytics_events').insert({
          business_id: businessId,
          event_type: 'sponsor_click',
          metadata,
        });
      } catch (err) {
        console.error('Failed to log sponsor click:', err);
      }
      return;
    }

    const event: AnalyticsEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      business_id: businessId,
      event_type: 'sponsor_click',
      metadata,
      created_at: new Date().toISOString(),
    };
    localStore.recordAnalyticsEvent(event);
  },

  async getAnalyticsSummary(
    businessId: string,
    period: 'today' | '7days' | '30days' | 'all' = '7days'
  ): Promise<AnalyticsSummary> {
    if (!businessId) {
      return {
        totalVisits: 0,
        totalClicks: 0,
        clicksByLink: [],
        clicksByType: [],
        dailyActivity: [],
      };
    }

    // Determine start timestamp
    const now = new Date();
    let startDate: Date | null = null;

    if (period === 'today') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (period === '7days') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === '30days') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    let events: AnalyticsEvent[] = [];

    if (isSupabaseConfigured) {
      let query = supabase
        .from('analytics_events')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: true });

      if (startDate) {
        query = query.gte('created_at', startDate.toISOString());
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching analytics events:', error);
      } else {
        events = (data as AnalyticsEvent[]) || [];
      }
    } else {
      const allEvents = localStore.getAnalytics().filter((e) => e.business_id === businessId);
      events = startDate
        ? allEvents.filter((e) => new Date(e.created_at) >= startDate!)
        : allEvents;
    }

    // Load links to associate labels
    const links = await linkService.getLinksByBusinessId(businessId);
    const linkMap = new Map(links.map((l) => [l.id, l]));

    // Compute Metrics honestly
    let totalVisits = 0;
    let totalClicks = 0;
    const linkClickCountMap: Record<string, number> = {};
    const typeCountMap: Record<string, number> = {};
    const dailyMap: Record<string, { visits: number; clicks: number }> = {};

    // Pre-populate days in range so chart displays zero-count days correctly
    const daysCount = period === 'today' ? 1 : period === '7days' ? 7 : period === '30days' ? 30 : 14;
    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split('T')[0];
      dailyMap[key] = { visits: 0, clicks: 0 };
    }

    events.forEach((evt) => {
      const dateKey = evt.created_at.split('T')[0];
      if (!dailyMap[dateKey]) {
        dailyMap[dateKey] = { visits: 0, clicks: 0 };
      }

      if (evt.event_type === 'visit') {
        totalVisits++;
        dailyMap[dateKey].visits++;
      } else if (evt.event_type === 'link_click') {
        totalClicks++;
        dailyMap[dateKey].clicks++;

        if (evt.link_id) {
          linkClickCountMap[evt.link_id] = (linkClickCountMap[evt.link_id] || 0) + 1;
          const link = linkMap.get(evt.link_id);
          if (link) {
            typeCountMap[link.link_type] = (typeCountMap[link.link_type] || 0) + 1;
          }
        }
      }
    });

    const clicksByLink: LinkClickStat[] = links.map((link) => ({
      linkId: link.id,
      label: link.label,
      url: link.url,
      link_type: link.link_type,
      count: linkClickCountMap[link.id] || 0,
    })).sort((a, b) => b.count - a.count);

    const clicksByType = Object.entries(typeCountMap)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);

    const dailyActivity: DailyActivityStat[] = Object.keys(dailyMap)
      .sort()
      .map((date) => {
        const d = new Date(date + 'T00:00:00');
        const formattedDate = new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
        }).format(d);

        return {
          date,
          formattedDate,
          visits: dailyMap[date].visits,
          clicks: dailyMap[date].clicks,
        };
      });

    return {
      totalVisits,
      totalClicks,
      clicksByLink,
      clicksByType,
      dailyActivity,
    };
  },
};
