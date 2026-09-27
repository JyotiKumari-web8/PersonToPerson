import React from 'react';
import {
  Globe,
  MapPin,
  CreditCard,
  Calendar,
  Utensils,
  GraduationCap,
  Briefcase,
  Link as LinkIcon,
  Phone,
  Mail,
} from 'lucide-react';
import { LinkType } from '@/types';

// Authentic 4-Color Google G Logo SVG
export const GoogleGIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

// Authentic WhatsApp Chat SVG
export const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// Authentic Instagram Camera SVG
export const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

// Authentic Facebook 'f' SVG
export const FacebookIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

// Authentic YouTube Play Button SVG
export const YouTubeIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export interface LinkTypeOption {
  type: LinkType;
  label: string;
  defaultLabel: string;
  defaultSubtitle: string;
  placeholder: string;
  colorClass: string;
  badgeBg: string;
  publicBtnClass: string;
  icon: (props?: { className?: string }) => React.ReactElement;
  brandBadge: () => React.ReactElement;
}

export const LINK_TYPE_CONFIG: Record<LinkType, LinkTypeOption> = {
  website: {
    type: 'website',
    label: 'Official Website',
    defaultLabel: 'Official Website',
    defaultSubtitle: 'Visit our website',
    placeholder: 'https://yourwebsite.com',
    colorClass: 'text-[#C8924A]',
    badgeBg: 'bg-[#3A2115] text-[#F3E6D3] border-[#4A2A1A]',
    publicBtnClass: 'bg-[#3A2115] text-[#FBF5EA]',
    icon: (props) => <Globe className={props?.className || 'w-5 h-5'} />,
    brandBadge: () => (
      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#3A2115] text-[#FBF5EA] flex items-center justify-center shrink-0 shadow-xs border border-[#4A2A1A]">
        <Globe className="w-6 h-6 text-[#FBF5EA]" />
      </div>
    ),
  },
  instagram: {
    type: 'instagram',
    label: 'Instagram',
    defaultLabel: 'Instagram',
    defaultSubtitle: 'Follow us on Instagram',
    placeholder: 'https://instagram.com/yourhandle',
    colorClass: 'text-pink-500',
    badgeBg: 'bg-pink-950/40 text-pink-300 border-pink-800/50',
    publicBtnClass: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white',
    icon: (props) => <InstagramIcon className={props?.className || 'w-5 h-5'} />,
    brandBadge: () => (
      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shrink-0 shadow-xs">
        <InstagramIcon className="w-6 h-6 text-white" />
      </div>
    ),
  },
  youtube: {
    type: 'youtube',
    label: 'YouTube',
    defaultLabel: 'YouTube',
    defaultSubtitle: 'Watch our videos',
    placeholder: 'https://youtube.com/@yourchannel',
    colorClass: 'text-red-500',
    badgeBg: 'bg-red-950/40 text-red-300 border-red-800/50',
    publicBtnClass: 'bg-[#FF0000] text-white',
    icon: (props) => <YouTubeIcon className={props?.className || 'w-5 h-5'} />,
    brandBadge: () => (
      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#FF0000] text-white flex items-center justify-center shrink-0 shadow-xs">
        <YouTubeIcon className="w-6 h-6 text-white" />
      </div>
    ),
  },
  facebook: {
    type: 'facebook',
    label: 'Facebook',
    defaultLabel: 'Facebook',
    defaultSubtitle: 'Follow us on Facebook',
    placeholder: 'https://facebook.com/yourpage',
    colorClass: 'text-blue-500',
    badgeBg: 'bg-blue-950/40 text-blue-300 border-blue-800/50',
    publicBtnClass: 'bg-[#1877F2] text-white',
    icon: (props) => <FacebookIcon className={props?.className || 'w-5 h-5'} />,
    brandBadge: () => (
      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#1877F2] text-white flex items-center justify-center shrink-0 shadow-xs">
        <FacebookIcon className="w-6 h-6 text-white" />
      </div>
    ),
  },
  whatsapp: {
    type: 'whatsapp',
    label: 'WhatsApp',
    defaultLabel: 'WhatsApp',
    defaultSubtitle: 'Chat with us',
    placeholder: '+14159876543 or https://wa.me/...',
    colorClass: 'text-emerald-500',
    badgeBg: 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50',
    publicBtnClass: 'bg-[#25D366] text-white',
    icon: (props) => <WhatsAppIcon className={props?.className || 'w-5 h-5'} />,
    brandBadge: () => (
      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs">
        <WhatsAppIcon className="w-6 h-6 text-white" />
      </div>
    ),
  },
  google_review: {
    type: 'google_review',
    label: 'Google Review',
    defaultLabel: 'Google Review',
    defaultSubtitle: 'Leave a review',
    placeholder: 'https://g.page/r/.../review',
    colorClass: 'text-amber-500',
    badgeBg: 'bg-amber-950/40 text-amber-300 border-amber-800/50',
    publicBtnClass: 'bg-white text-[#2B1A12] border border-[#E4D2BB]',
    icon: (props) => <GoogleGIcon className={props?.className || 'w-5 h-5'} />,
    brandBadge: () => (
      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white border border-[#E4D2BB] flex items-center justify-center shrink-0 shadow-xs p-1.5">
        <GoogleGIcon className="w-6 h-6" />
      </div>
    ),
  },
  google_maps: {
    type: 'google_maps',
    label: 'Google Maps',
    defaultLabel: 'Google Maps',
    defaultSubtitle: 'Find our location',
    placeholder: 'https://maps.google.com/?q=...',
    colorClass: 'text-rose-500',
    badgeBg: 'bg-rose-950/40 text-rose-300 border-rose-800/50',
    publicBtnClass: 'bg-[#EA4335] text-white',
    icon: (props) => <MapPin className={props?.className || 'w-5 h-5'} />,
    brandBadge: () => (
      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white border border-[#E4D2BB] flex items-center justify-center shrink-0 shadow-xs">
        <MapPin className="w-6 h-6 text-[#EA4335]" />
      </div>
    ),
  },
  payment: {
    type: 'payment',
    label: 'Payment',
    defaultLabel: 'Payment',
    defaultSubtitle: 'Pay online securely',
    placeholder: 'https://checkout.stripe.com/... or paypal.me/...',
    colorClass: 'text-emerald-500',
    badgeBg: 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50',
    publicBtnClass: 'bg-[#2563EB] text-white',
    icon: (props) => <CreditCard className={props?.className || 'w-5 h-5'} />,
    brandBadge: () => (
      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#059669] text-white flex items-center justify-center shrink-0 shadow-xs">
        <CreditCard className="w-6 h-6 text-white" />
      </div>
    ),
  },
  booking: {
    type: 'booking',
    label: 'Booking',
    defaultLabel: 'Booking',
    defaultSubtitle: 'Book an appointment',
    placeholder: 'https://calendly.com/... or booking page',
    colorClass: 'text-amber-500',
    badgeBg: 'bg-amber-950/40 text-amber-300 border-amber-800/50',
    publicBtnClass: 'bg-[#D97706] text-white',
    icon: (props) => <Calendar className={props?.className || 'w-5 h-5'} />,
    brandBadge: () => (
      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#D97706] text-white flex items-center justify-center shrink-0 shadow-xs">
        <Calendar className="w-6 h-6 text-white" />
      </div>
    ),
  },
  call: {
    type: 'call',
    label: 'Call',
    defaultLabel: 'Call',
    defaultSubtitle: 'Call us directly',
    placeholder: '+1 234 567 8900',
    colorClass: 'text-emerald-500',
    badgeBg: 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50',
    publicBtnClass: 'bg-[#059669] text-white',
    icon: (props) => <Phone className={props?.className || 'w-5 h-5'} />,
    brandBadge: () => (
      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#059669] text-white flex items-center justify-center shrink-0 shadow-xs">
        <Phone className="w-6 h-6 text-white" />
      </div>
    ),
  },
  email: {
    type: 'email',
    label: 'Email',
    defaultLabel: 'Email',
    defaultSubtitle: 'Send us an email',
    placeholder: 'contact@yourbusiness.com',
    colorClass: 'text-sky-500',
    badgeBg: 'bg-sky-950/40 text-sky-300 border-sky-800/50',
    publicBtnClass: 'bg-[#0284C7] text-white',
    icon: (props) => <Mail className={props?.className || 'w-5 h-5'} />,
    brandBadge: () => (
      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#0284C7] text-white flex items-center justify-center shrink-0 shadow-xs">
        <Mail className="w-6 h-6 text-white" />
      </div>
    ),
  },
  menu: {
    type: 'menu',
    label: 'Menu',
    defaultLabel: 'Menu',
    defaultSubtitle: 'View our menu',
    placeholder: 'https://yourwebsite.com/menu or catalog URL',
    colorClass: 'text-amber-500',
    badgeBg: 'bg-amber-950/40 text-amber-300 border-amber-800/50',
    publicBtnClass: 'bg-[#B45309] text-white',
    icon: (props) => <Utensils className={props?.className || 'w-5 h-5'} />,
    brandBadge: () => (
      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#B45309] text-white flex items-center justify-center shrink-0 shadow-xs">
        <Utensils className="w-6 h-6 text-white" />
      </div>
    ),
  },
  admission: {
    type: 'admission',
    label: 'Admission',
    defaultLabel: 'Admission',
    defaultSubtitle: 'Apply online now',
    placeholder: 'https://forms.gle/... or admission link',
    colorClass: 'text-purple-500',
    badgeBg: 'bg-purple-950/40 text-purple-300 border-purple-800/50',
    publicBtnClass: 'bg-[#7C3AED] text-white',
    icon: (props) => <GraduationCap className={props?.className || 'w-5 h-5'} />,
    brandBadge: () => (
      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#7C3AED] text-white flex items-center justify-center shrink-0 shadow-xs">
        <GraduationCap className="w-6 h-6 text-white" />
      </div>
    ),
  },
  portfolio: {
    type: 'portfolio',
    label: 'Portfolio',
    defaultLabel: 'Portfolio',
    defaultSubtitle: 'Explore recent work',
    placeholder: 'https://behance.net/... or personal site',
    colorClass: 'text-teal-500',
    badgeBg: 'bg-teal-950/40 text-teal-300 border-teal-800/50',
    publicBtnClass: 'bg-[#0D9488] text-white',
    icon: (props) => <Briefcase className={props?.className || 'w-5 h-5'} />,
    brandBadge: () => (
      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#0D9488] text-white flex items-center justify-center shrink-0 shadow-xs">
        <Briefcase className="w-6 h-6 text-white" />
      </div>
    ),
  },
  custom: {
    type: 'custom',
    label: 'Custom Link',
    defaultLabel: 'Custom Link',
    defaultSubtitle: 'Visit link',
    placeholder: 'https://yourwebsite.com/destination',
    colorClass: 'text-[#705B4D]',
    badgeBg: 'bg-[#F3E6D3] text-[#2B1A12] border-[#E4D2BB]',
    publicBtnClass: 'bg-[#3A2115] text-[#FBF5EA]',
    icon: (props) => <LinkIcon className={props?.className || 'w-5 h-5'} />,
    brandBadge: () => (
      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#F3E6D3] text-[#2B1A12] flex items-center justify-center shrink-0 shadow-xs border border-[#E4D2BB]">
        <LinkIcon className="w-6 h-6 text-[#2B1A12]" />
      </div>
    ),
  },
};
