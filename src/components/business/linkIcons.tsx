import React from 'react';
import {
  Globe,
  MessageCircle,
  Star,
  MapPin,
  CreditCard,
  Calendar,
  Utensils,
  GraduationCap,
  Briefcase,
  Link as LinkIcon,
} from 'lucide-react';
import { LinkType } from '@/types';

// Custom crisp SVG icons for social platforms
const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export interface LinkTypeOption {
  type: LinkType;
  label: string;
  defaultLabel: string;
  placeholder: string;
  colorClass: string;
  badgeBg: string;
  icon: (props?: { className?: string }) => React.ReactElement;
}

export const LINK_TYPE_CONFIG: Record<LinkType, LinkTypeOption> = {
  website: {
    type: 'website',
    label: 'Official Website',
    defaultLabel: 'Visit Our Website',
    placeholder: 'https://yourwebsite.com',
    colorClass: 'text-sky-600',
    badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
    icon: (props) => <Globe className={props?.className || 'w-5 h-5'} />,
  },
  instagram: {
    type: 'instagram',
    label: 'Instagram',
    defaultLabel: 'Follow on Instagram',
    placeholder: 'https://instagram.com/yourhandle',
    colorClass: 'text-pink-600',
    badgeBg: 'bg-pink-50 text-pink-700 border-pink-200',
    icon: (props) => <InstagramIcon className={props?.className || 'w-5 h-5'} />,
  },
  facebook: {
    type: 'facebook',
    label: 'Facebook',
    defaultLabel: 'Follow on Facebook',
    placeholder: 'https://facebook.com/yourpage',
    colorClass: 'text-blue-600',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: (props) => <FacebookIcon className={props?.className || 'w-5 h-5'} />,
  },
  whatsapp: {
    type: 'whatsapp',
    label: 'WhatsApp Direct Chat',
    defaultLabel: 'Message on WhatsApp',
    placeholder: '+15551234567 or https://wa.me/...',
    colorClass: 'text-emerald-600',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: (props) => <MessageCircle className={props?.className || 'w-5 h-5'} />,
  },
  google_review: {
    type: 'google_review',
    label: 'Google Review',
    defaultLabel: 'Leave a Google Review',
    placeholder: 'https://g.page/r/.../review',
    colorClass: 'text-amber-500',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: (props) => <Star className={props?.className || 'w-5 h-5'} />,
  },
  google_maps: {
    type: 'google_maps',
    label: 'Google Maps / Directions',
    defaultLabel: 'Find Us on Google Maps',
    placeholder: 'https://maps.google.com/?q=...',
    colorClass: 'text-red-500',
    badgeBg: 'bg-red-50 text-red-700 border-red-200',
    icon: (props) => <MapPin className={props?.className || 'w-5 h-5'} />,
  },
  payment: {
    type: 'payment',
    label: 'Payment Link',
    defaultLabel: 'Pay Online',
    placeholder: 'https://checkout.stripe.com/... or https://paypal.me/...',
    colorClass: 'text-emerald-600',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: (props) => <CreditCard className={props?.className || 'w-5 h-5'} />,
  },
  booking: {
    type: 'booking',
    label: 'Booking / Reservation',
    defaultLabel: 'Book an Appointment',
    placeholder: 'https://calendly.com/... or booking page',
    colorClass: 'text-indigo-600',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    icon: (props) => <Calendar className={props?.className || 'w-5 h-5'} />,
  },
  menu: {
    type: 'menu',
    label: 'Menu / Price List',
    defaultLabel: 'View Our Menu',
    placeholder: 'https://example.com/menu.pdf or link',
    colorClass: 'text-amber-600',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: (props) => <Utensils className={props?.className || 'w-5 h-5'} />,
  },
  admission: {
    type: 'admission',
    label: 'Admission / Enrollment Form',
    defaultLabel: 'Apply / Admission Form',
    placeholder: 'https://forms.gle/... or admission link',
    colorClass: 'text-purple-600',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: (props) => <GraduationCap className={props?.className || 'w-5 h-5'} />,
  },
  portfolio: {
    type: 'portfolio',
    label: 'Portfolio / Showcase',
    defaultLabel: 'View Portfolio',
    placeholder: 'https://behance.net/... or personal site',
    colorClass: 'text-teal-600',
    badgeBg: 'bg-teal-50 text-teal-700 border-teal-200',
    icon: (props) => <Briefcase className={props?.className || 'w-5 h-5'} />,
  },
  custom: {
    type: 'custom',
    label: 'Custom Link',
    defaultLabel: 'Click Here',
    placeholder: 'https://example.com/any-destination',
    colorClass: 'text-slate-600',
    badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: (props) => <LinkIcon className={props?.className || 'w-5 h-5'} />,
  },
};
