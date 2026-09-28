import { Business, BusinessLink, AnalyticsEvent, Sponsor, BusinessSponsor, UserProfile, Plan, Subscription } from '@/types';

/**
 * DEVELOPMENT-ONLY SEED DATA
 * Used strictly as an offline fallback when Supabase credentials are not configured in .env.
 * Production mode connects directly to live Supabase and NEVER accesses these fixtures.
 */

export const INITIAL_USER: UserProfile = {
  id: 'usr-admin-demo',
  email: 'dev-admin@persontoperson.local',
  full_name: 'Local Dev Admin',
  role: 'admin',
  created_at: new Date().toISOString(),
};

export const INITIAL_BUSINESS: Business = {
  id: 'biz-sample-001',
  user_id: 'usr-admin-demo',
  name: 'Sample Business (Development)',
  slug: 'sample-business',
  logo_url: '',
  cover_url: '',
  description: 'Sample business profile for local offline development and UI verification.',
  phone: '+1 234 567 8900',
  email: 'sample@persontoperson.local',
  address: '100 Sample Boulevard',
  category: 'General Business',
  city: 'Sample City',
  is_active: true,
  created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
};

export const INITIAL_LINKS: BusinessLink[] = [
  {
    id: 'link-1',
    business_id: 'biz-sample-001',
    label: 'Sample Menu Link',
    url: 'https://sample.persontoperson.local/menu',
    link_type: 'menu',
    is_active: true,
    display_order: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: 'link-2',
    business_id: 'biz-sample-001',
    label: 'Sample Booking Link',
    url: 'https://sample.persontoperson.local/booking',
    link_type: 'booking',
    is_active: true,
    display_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'link-3',
    business_id: 'biz-sample-001',
    label: 'Sample Social Link',
    url: 'https://sample.persontoperson.local/social',
    link_type: 'instagram',
    is_active: true,
    display_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 'link-4',
    business_id: 'biz-sample-001',
    label: 'Sample WhatsApp Link',
    url: 'https://wa.me/14159876543',
    link_type: 'whatsapp',
    is_active: true,
    display_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: 'link-5',
    business_id: 'biz-sample-001',
    label: 'Sample Review Link',
    url: 'https://sample.persontoperson.local/review',
    link_type: 'google_review',
    is_active: true,
    display_order: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: 'link-6',
    business_id: 'biz-sample-001',
    label: 'Sample Payment Link',
    url: 'https://sample.persontoperson.local/payment',
    link_type: 'payment',
    is_active: true,
    display_order: 5,
    created_at: new Date().toISOString(),
  },
];

export const INITIAL_SPONSORS: Sponsor[] = [
  {
    id: 'spon-sample-01',
    name: 'Sample Community Partner',
    logo_url: '',
    website_url: 'https://sample.persontoperson.local/partner',
    description: 'Sample partner placement for development testing.',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'spon-sample-02',
    name: 'Sample Local Sponsor',
    logo_url: '',
    website_url: 'https://sample.persontoperson.local/sponsor',
    description: 'Sample sponsor placement for development testing.',
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

export const INITIAL_BUSINESS_SPONSORS: BusinessSponsor[] = [
  {
    id: 'bs-01',
    business_id: 'biz-sample-001',
    sponsor_id: 'spon-sample-01',
    placement: 'both',
    display_order: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    sponsor: INITIAL_SPONSORS[0],
  },
];

export const INITIAL_ANALYTICS: AnalyticsEvent[] = [];

export const INITIAL_PLANS: Plan[] = [
  {
    id: 'plan-free',
    name: 'Free',
    description: 'Standard plan for individual professionals and emerging businesses.',
    is_free: true,
    price: 0,
    currency: 'INR',
    billing_interval: 'lifetime',
    duration_days: null,
    features: ['single_permanent_url', 'qr_code', 'basic_analytics', 'standard_icons'],
    limits: { max_links: 3, analytics_tier: 'basic' },
    is_active: true,
    display_order: 1,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
  {
    id: 'plan-basic',
    name: 'Basic Growth',
    description: 'Expanded link capacity and analytics for established retail & services.',
    is_free: false,
    price: 499,
    currency: 'INR',
    billing_interval: 'monthly',
    duration_days: 30,
    features: ['single_permanent_url', 'qr_code', 'standard_analytics', 'standard_icons', 'priority_indexing'],
    limits: { max_links: 6, analytics_tier: 'standard' },
    is_active: true,
    display_order: 2,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(),
  },
  {
    id: 'plan-pro',
    name: 'Pro Enterprise',
    description: 'Maximum link flexibility, advanced analytics, and partner brand positioning.',
    is_free: false,
    price: 1499,
    currency: 'INR',
    billing_interval: 'yearly',
    duration_days: 365,
    features: ['single_permanent_url', 'qr_code', 'advanced_analytics', 'standard_icons', 'partner_sponsor_placement', 'priority_support'],
    limits: { max_links: 12, analytics_tier: 'advanced' },
    is_active: true,
    display_order: 3,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
  },
];

export const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub-sample-01',
    business_id: 'biz-sample-001',
    plan_id: 'plan-free',
    status: 'active',
    start_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    expires_at: null,
    notes: 'Default Free Plan',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
  },
];
