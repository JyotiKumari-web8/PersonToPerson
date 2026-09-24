import { Business, BusinessLink, AnalyticsEvent, Sponsor, BusinessSponsor, UserProfile } from '@/types';

export const INITIAL_USER: UserProfile = {
  id: 'usr-admin-demo',
  email: 'admin@persontoperson.local',
  full_name: 'Platform Demo Admin',
  role: 'admin',
  created_at: new Date().toISOString(),
};

export const INITIAL_BUSINESS: Business = {
  id: 'biz-lumina-001',
  user_id: 'usr-admin-demo',
  name: 'Lumina Artisan Bistro',
  slug: 'lumina-artisan-bistro',
  logo_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80',
  cover_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&auto=format&fit=crop&q=80',
  description: 'Farm-to-table handcrafted dining, seasonal cocktails, and specialty espresso in downtown.',
  phone: '+1 (555) 234-5678',
  email: 'hello@luminabistro.com',
  address: '142 Market Street, Downtown District',
  category: 'Restaurant & Café',
  city: 'San Francisco, CA',
  is_active: true,
  created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
};

export const INITIAL_LINKS: BusinessLink[] = [
  {
    id: 'link-1',
    business_id: 'biz-lumina-001',
    label: 'Explore Our Seasonal Menu',
    url: 'https://example.com/menu',
    link_type: 'menu',
    is_active: true,
    display_order: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: 'link-2',
    business_id: 'biz-lumina-001',
    label: 'Reserve a Table Online',
    url: 'https://example.com/booking',
    link_type: 'booking',
    is_active: true,
    display_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'link-3',
    business_id: 'biz-lumina-001',
    label: 'Follow Us on Instagram',
    url: 'https://instagram.com/luminabistro',
    link_type: 'instagram',
    is_active: true,
    display_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 'link-4',
    business_id: 'biz-lumina-001',
    label: 'Chat on WhatsApp',
    url: 'https://wa.me/15552345678',
    link_type: 'whatsapp',
    is_active: true,
    display_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: 'link-5',
    business_id: 'biz-lumina-001',
    label: 'Leave a 5-Star Google Review',
    url: 'https://maps.google.com/?q=Lumina+Artisan+Bistro',
    link_type: 'google_review',
    is_active: true,
    display_order: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: 'link-6',
    business_id: 'biz-lumina-001',
    label: 'Contactless Bill Payment',
    url: 'https://checkout.stripe.com/pay/lumina-demo',
    link_type: 'payment',
    is_active: true,
    display_order: 5,
    created_at: new Date().toISOString(),
  },
];

export const INITIAL_SPONSORS: Sponsor[] = [
  {
    id: 'spon-apex-01',
    name: 'Apex Clean Energy',
    logo_url: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=128&auto=format&fit=crop&q=80',
    website_url: 'https://example.com/apex-clean',
    description: 'Empowering local sustainable hospitality with 100% renewable power.',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'spon-prime-02',
    name: 'Prime Artisan Roasters',
    logo_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=128&auto=format&fit=crop&q=80',
    website_url: 'https://example.com/prime-coffee',
    description: 'Ethically sourced single-origin coffee beans roasted weekly.',
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

export const INITIAL_BUSINESS_SPONSORS: BusinessSponsor[] = [
  {
    id: 'bs-01',
    business_id: 'biz-lumina-001',
    sponsor_id: 'spon-apex-01',
    display_order: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    sponsor: INITIAL_SPONSORS[0],
  },
];

export const INITIAL_ANALYTICS: AnalyticsEvent[] = [];
