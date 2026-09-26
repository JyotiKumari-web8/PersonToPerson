import { Business, BusinessLink, AnalyticsEvent, Sponsor, BusinessSponsor, UserProfile } from '@/types';

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
