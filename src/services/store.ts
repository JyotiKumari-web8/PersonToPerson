import {
  Business,
  BusinessLink,
  AnalyticsEvent,
  Sponsor,
  BusinessSponsor,
  UserProfile,
} from '@/types';
import {
  INITIAL_USER,
  INITIAL_BUSINESS,
  INITIAL_LINKS,
  INITIAL_SPONSORS,
  INITIAL_BUSINESS_SPONSORS,
  INITIAL_ANALYTICS,
} from '@/lib/mockData';

const STORAGE_KEYS = {
  USERS: 'p2p_users',
  CURRENT_USER: 'p2p_current_user',
  BUSINESSES: 'p2p_businesses',
  LINKS: 'p2p_links',
  SPONSORS: 'p2p_sponsors',
  BUSINESS_SPONSORS: 'p2p_business_sponsors',
  ANALYTICS: 'p2p_analytics',
};

// Helper for local storage read/write
export const localStore = {
  getUsers(): UserProfile[] {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      const initial = [INITIAL_USER];
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [INITIAL_USER];
    }
  },

  getCurrentUser(): UserProfile | null {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setCurrentUser(user: UserProfile | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  getBusinesses(): Business[] {
    const raw = localStorage.getItem(STORAGE_KEYS.BUSINESSES);
    if (!raw) {
      const initial = [INITIAL_BUSINESS];
      localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [INITIAL_BUSINESS];
    }
  },

  saveBusinesses(businesses: Business[]) {
    localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(businesses));
  },

  getLinks(): BusinessLink[] {
    const raw = localStorage.getItem(STORAGE_KEYS.LINKS);
    if (!raw) {
      const initial = [...INITIAL_LINKS];
      localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [...INITIAL_LINKS];
    }
  },

  saveLinks(links: BusinessLink[]) {
    localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(links));
  },

  getSponsors(): Sponsor[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SPONSORS);
    if (!raw) {
      const initial = [...INITIAL_SPONSORS];
      localStorage.setItem(STORAGE_KEYS.SPONSORS, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [...INITIAL_SPONSORS];
    }
  },

  saveSponsors(sponsors: Sponsor[]) {
    localStorage.setItem(STORAGE_KEYS.SPONSORS, JSON.stringify(sponsors));
  },

  getBusinessSponsors(): BusinessSponsor[] {
    const raw = localStorage.getItem(STORAGE_KEYS.BUSINESS_SPONSORS);
    if (!raw) {
      const initial = [...INITIAL_BUSINESS_SPONSORS];
      localStorage.setItem(STORAGE_KEYS.BUSINESS_SPONSORS, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [...INITIAL_BUSINESS_SPONSORS];
    }
  },

  saveBusinessSponsors(records: BusinessSponsor[]) {
    localStorage.setItem(STORAGE_KEYS.BUSINESS_SPONSORS, JSON.stringify(records));
  },

  getAnalytics(): AnalyticsEvent[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
    if (!raw) {
      const initial = [...INITIAL_ANALYTICS];
      localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  saveAnalytics(events: AnalyticsEvent[]) {
    localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(events));
  },

  recordAnalyticsEvent(event: AnalyticsEvent) {
    const events = this.getAnalytics();
    events.push(event);
    this.saveAnalytics(events);
  },
};
