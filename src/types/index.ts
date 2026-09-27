export type UserRole = 'business_owner' | 'platform_owner' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  role: UserRole;
  created_at?: string;
}

export interface PublicBusinessStatus {
  id: string;
  slug: string;
  name: string;
  is_active: boolean;
}

export interface Business {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  logo_url?: string;
  cover_url?: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  category?: string;
  city?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;

  // Platform Owner inspection fields
  owner_email?: string;
  owner_name?: string;

  // Future-ready architectural fields for subscription/trial tiers (Requirement 4)
  subscription_status?: 'trialing' | 'active' | 'past_due' | 'canceled' | 'lifetime';
  trial_ends_at?: string | null;
  subscription_tier?: 'free' | 'starter' | 'pro' | 'enterprise';
}

export type LinkType =
  | 'website'
  | 'instagram'
  | 'youtube'
  | 'facebook'
  | 'whatsapp'
  | 'google_review'
  | 'google_maps'
  | 'payment'
  | 'booking'
  | 'call'
  | 'email'
  | 'menu'
  | 'admission'
  | 'portfolio'
  | 'custom';

export interface BusinessLink {
  id: string;
  business_id: string;
  label: string;
  url: string;
  link_type: LinkType;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at?: string;
}

export type EventType = 'visit' | 'link_click' | 'sponsor_click';

export interface AnalyticsEvent {
  id: string;
  business_id: string;
  link_id?: string | null;
  event_type: EventType;
  metadata?: {
    referrer?: string;
    userAgent?: string;
    deviceType?: 'mobile' | 'desktop' | 'tablet';
    [key: string]: unknown;
  };
  created_at: string;
}

export interface Sponsor {
  id: string;
  name: string;
  logo_url?: string;
  website_url: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export type SponsorPlacement = 'header' | 'footer' | 'both';

export interface BusinessSponsor {
  id: string;
  business_id: string;
  sponsor_id: string;
  placement?: SponsorPlacement;
  display_order: number;
  is_active: boolean;
  created_at: string;
  sponsor?: Sponsor;
  business?: { id: string; name: string; slug: string };
}

export interface AnalyticsFilter {
  period: 'today' | '7days' | '30days' | 'all';
}

export interface LinkClickStat {
  linkId: string;
  label: string;
  url: string;
  link_type: LinkType;
  count: number;
}

export interface DailyActivityStat {
  date: string; // YYYY-MM-DD
  formattedDate: string;
  visits: number;
  clicks: number;
}

export interface AnalyticsSummary {
  totalVisits: number;
  totalClicks: number;
  clicksByLink: LinkClickStat[];
  clicksByType: { type: string; count: number }[];
  dailyActivity: DailyActivityStat[];
}
