import React from 'react';
import { BusinessLink, LinkType } from '@/types';
import {
  GoogleGIcon,
  WhatsAppIcon,
  InstagramIcon,
  FacebookIcon,
  YouTubeIcon,
} from '@/components/business/linkIcons';
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

interface PublicLinkCardProps {
  link: BusinessLink;
  onLinkClick: (linkId: string, url: string) => void;
  sizeVariant?: 'large' | 'medium' | 'compact';
}

// Maps verbose titles to short, direct, clean tile labels
const VERBOSE_TO_SHORT_TITLE: Record<string, string> = {
  'visit our website': 'Website',
  'visit website': 'Website',
  'our website': 'Website',
  'visit official website': 'Website',
  'official website': 'Website',
  'website': 'Website',
  'follow on instagram': 'Instagram',
  'follow us on instagram': 'Instagram',
  'instagram': 'Instagram',
  'follow on facebook': 'Facebook',
  'follow us on facebook': 'Facebook',
  'facebook': 'Facebook',
  'watch our videos': 'YouTube',
  'watch on youtube': 'YouTube',
  'subscribe on youtube': 'YouTube',
  'youtube': 'YouTube',
  'chat with us': 'WhatsApp',
  'chat on whatsapp': 'WhatsApp',
  'whatsapp': 'WhatsApp',
  'ai google review': 'AI Review',
  'ai google reviews': 'AI Review',
  'leave an ai google review': 'AI Review',
  'leave a google review': 'AI Review',
  'leave a review': 'AI Review',
  'google review': 'AI Review',
  'google reviews': 'AI Review',
  'review on google': 'AI Review',
  'review us on google': 'AI Review',
  'find our location': 'Maps',
  'google maps': 'Maps',
  'view on google maps': 'Maps',
  'maps': 'Maps',
  'pay via upi': 'Payment',
  'upi payment': 'Payment',
  'pay online': 'Payment',
  'pay online securely': 'Payment',
  'payment': 'Payment',
  'customer repeat': 'Customer Repeat',
  'smart stand': 'Customer Repeat',
  'book an appointment': 'Booking',
  'booking': 'Booking',
  'book now': 'Booking',
  'call us directly': 'Call',
  'call': 'Call',
  'call us': 'Call',
  'send us an email': 'Email',
  'email': 'Email',
  'email us': 'Email',
  'view our menu': 'Menu',
  'menu': 'Menu',
  'apply online now': 'Admission',
  'admission': 'Admission',
  'explore recent work': 'Portfolio',
  'portfolio': 'Portfolio',
};

const DEFAULT_TYPE_SHORT_TITLES: Record<LinkType, string> = {
  website: 'Website',
  google_review: 'AI Review',
  facebook: 'Facebook',
  instagram: 'Instagram',
  youtube: 'YouTube',
  whatsapp: 'WhatsApp',
  google_maps: 'Maps',
  upi_payment: 'Payment',
  payment: 'Payment',
  booking: 'Booking',
  call: 'Call',
  email: 'Email',
  menu: 'Menu',
  admission: 'Admission',
  portfolio: 'Portfolio',
  customer_repeat: 'Customer Repeat',
  smart_stand: 'Customer Repeat',
  custom: 'Link',
};

export const PublicLinkCard: React.FC<PublicLinkCardProps> = ({
  link,
  onLinkClick,
  sizeVariant = 'medium',
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onLinkClick(link.id, link.url);
  };

  const rawLabel = (link.label || '').trim();
  const lowerLabel = rawLabel.toLowerCase();
  const displayTitle =
    VERBOSE_TO_SHORT_TITLE[lowerLabel] ||
    (rawLabel ? rawLabel : DEFAULT_TYPE_SHORT_TITLES[link.link_type] || 'Link');

  const renderTileIcon = (type: LinkType) => {
    // Noticeably larger badge containers for impactful presentation
    const badgeClasses = {
      large: 'w-13 h-13 sm:w-14 sm:h-14 rounded-2xl',
      medium: 'w-12 h-12 sm:w-13 sm:h-13 rounded-2xl',
      compact: 'w-11 h-11 sm:w-11.5 sm:h-11.5 rounded-xl',
    }[sizeVariant];

    // Noticeably larger icons with proper aspect ratio and centered
    const iconClasses = {
      large: 'w-7.5 h-7.5 sm:w-8 sm:h-8',
      medium: 'w-7 h-7 sm:w-7.5 sm:h-7.5',
      compact: 'w-6 h-6 sm:w-6.5 sm:h-6.5',
    }[sizeVariant];

    switch (type) {
      case 'website':
        return (
          <div className={`${badgeClasses} bg-[#3A2115] text-[#FBF5EA] flex items-center justify-center shadow-2xs border border-[#4A2A1A]`}>
            <Globe className={`${iconClasses} text-[#FBF5EA]`} />
          </div>
        );
      case 'instagram':
        return (
          <div className={`${badgeClasses} bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow-2xs`}>
            <InstagramIcon className={`${iconClasses} text-white`} />
          </div>
        );
      case 'youtube':
        return (
          <div className={`${badgeClasses} bg-[#FF0000] text-white flex items-center justify-center shadow-2xs`}>
            <YouTubeIcon className={`${iconClasses} text-white`} />
          </div>
        );
      case 'facebook':
        return (
          <div className={`${badgeClasses} bg-[#1877F2] text-white flex items-center justify-center shadow-2xs`}>
            <FacebookIcon className={`${iconClasses} text-white`} />
          </div>
        );
      case 'whatsapp':
        return (
          <div className={`${badgeClasses} bg-[#25D366] text-white flex items-center justify-center shadow-2xs`}>
            <WhatsAppIcon className={`${iconClasses} text-white`} />
          </div>
        );
      case 'google_review':
        return (
          <div className={`${badgeClasses} bg-white border border-[#E4D2BB] flex items-center justify-center shadow-2xs p-2`}>
            <GoogleGIcon className={iconClasses} />
          </div>
        );
      case 'google_maps':
        return (
          <div className={`${badgeClasses} bg-white border border-[#E4D2BB] flex items-center justify-center shadow-2xs`}>
            <MapPin className={`${iconClasses} text-[#EA4335]`} />
          </div>
        );
      case 'upi_payment':
        return (
          <div className={`${badgeClasses} bg-[#7C3AED] text-white flex items-center justify-center shadow-2xs`}>
            <CreditCard className={`${iconClasses} text-white`} />
          </div>
        );
      case 'payment':
        return (
          <div className={`${badgeClasses} bg-[#059669] text-white flex items-center justify-center shadow-2xs`}>
            <CreditCard className={`${iconClasses} text-white`} />
          </div>
        );
      case 'customer_repeat':
      case 'smart_stand':
        return (
          <div className={`${badgeClasses} bg-[#241810] border border-[#3D2B1F] flex items-center justify-center shadow-2xs p-2 overflow-hidden`}>
            <img src="/prestige-logo.png" alt="Customer Repeat" className={`${iconClasses} object-contain`} />
          </div>
        );
      case 'booking':
        return (
          <div className={`${badgeClasses} bg-[#D97706] text-white flex items-center justify-center shadow-2xs`}>
            <Calendar className={`${iconClasses} text-white`} />
          </div>
        );
      case 'call':
        return (
          <div className={`${badgeClasses} bg-[#059669] text-white flex items-center justify-center shadow-2xs`}>
            <Phone className={`${iconClasses} text-white`} />
          </div>
        );
      case 'email':
        return (
          <div className={`${badgeClasses} bg-[#0284C7] text-white flex items-center justify-center shadow-2xs`}>
            <Mail className={`${iconClasses} text-white`} />
          </div>
        );
      case 'menu':
        return (
          <div className={`${badgeClasses} bg-[#B45309] text-white flex items-center justify-center shadow-2xs`}>
            <Utensils className={`${iconClasses} text-white`} />
          </div>
        );
      case 'admission':
        return (
          <div className={`${badgeClasses} bg-[#7C3AED] text-white flex items-center justify-center shadow-2xs`}>
            <GraduationCap className={`${iconClasses} text-white`} />
          </div>
        );
      case 'portfolio':
        return (
          <div className={`${badgeClasses} bg-[#0D9488] text-white flex items-center justify-center shadow-2xs`}>
            <Briefcase className={`${iconClasses} text-white`} />
          </div>
        );
      default:
        return (
          <div className={`${badgeClasses} bg-[#3A2115] text-[#C8924A] flex items-center justify-center shadow-2xs border border-[#4A2A1A]`}>
            <LinkIcon className={`${iconClasses} text-[#C8924A]`} />
          </div>
        );
    }
  };

  // Standard adaptive vertical tile with reduced unnecessary outer spacing
  const sizeClasses = {
    large: {
      card: 'p-2 sm:p-2.5 min-h-[92px] sm:min-h-[98px]',
      iconWrap: 'mb-1.5',
      text: 'text-xs sm:text-[12.5px]',
    },
    medium: {
      card: 'p-1.5 sm:p-2 min-h-[82px] sm:min-h-[86px]',
      iconWrap: 'mb-1',
      text: 'text-[11px] sm:text-[11.5px]',
    },
    compact: {
      card: 'p-1.5 sm:p-2 min-h-[72px] sm:min-h-[76px]',
      iconWrap: 'mb-0.5',
      text: 'text-[10px] sm:text-[10.5px]',
    },
  }[sizeVariant];

  return (
    <a
      href={link.url || '#'}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex flex-col items-center justify-center rounded-2xl border border-[#E8DCCB]/80 bg-[#FFFDF9] hover:bg-white hover:border-[#C8924A]/70 shadow-[0_2px_8px_-2px_rgba(43,26,18,0.06)] hover:shadow-md transition-all duration-150 active:scale-95 cursor-pointer select-none text-center w-full h-full ${sizeClasses.card}`}
      title={displayTitle}
    >
      {/* Brand / Action Icon Badge */}
      <div className={`shrink-0 transition-transform group-hover:scale-105 duration-150 ${sizeClasses.iconWrap}`}>
        {renderTileIcon(link.link_type)}
      </div>

      {/* Short Title Label */}
      <span className={`font-bold text-[#2B1A12] group-hover:text-[#4A2A1A] transition-colors truncate max-w-full tracking-tight px-0.5 ${sizeClasses.text}`}>
        {displayTitle}
      </span>
    </a>
  );
};
