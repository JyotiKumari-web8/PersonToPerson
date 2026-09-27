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
  isFullSpan?: boolean;
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
  'leave a google review': 'Google',
  'leave a review': 'Google',
  'google review': 'Google',
  'google reviews': 'Google',
  'review on google': 'Google',
  'review us on google': 'Google',
  'find our location': 'Maps',
  'google maps': 'Maps',
  'view on google maps': 'Maps',
  'maps': 'Maps',
  'pay online': 'Payment',
  'pay online securely': 'Payment',
  'payment': 'Payment',
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
  google_review: 'Google',
  facebook: 'Facebook',
  instagram: 'Instagram',
  youtube: 'YouTube',
  whatsapp: 'WhatsApp',
  google_maps: 'Maps',
  payment: 'Payment',
  booking: 'Booking',
  call: 'Call',
  email: 'Email',
  menu: 'Menu',
  admission: 'Admission',
  portfolio: 'Portfolio',
  custom: 'Link',
};

export const PublicLinkCard: React.FC<PublicLinkCardProps> = ({
  link,
  onLinkClick,
  sizeVariant = 'medium',
  isFullSpan = false,
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
    const badgeClasses = {
      large: 'w-11 h-11 sm:w-12 sm:h-12 rounded-xl',
      medium: 'w-10 h-10 sm:w-10.5 sm:h-10.5 rounded-xl',
      compact: 'w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg',
    }[sizeVariant];

    const iconClasses = {
      large: 'w-5.5 h-5.5',
      medium: 'w-5 h-5',
      compact: 'w-4 h-4',
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
          <div className={`${badgeClasses} bg-white border border-[#E4D2BB] flex items-center justify-center shadow-2xs p-1.5`}>
            <GoogleGIcon className={iconClasses} />
          </div>
        );
      case 'google_maps':
        return (
          <div className={`${badgeClasses} bg-white border border-[#E4D2BB] flex items-center justify-center shadow-2xs`}>
            <MapPin className={`${iconClasses} text-[#EA4335]`} />
          </div>
        );
      case 'payment':
        return (
          <div className={`${badgeClasses} bg-[#059669] text-white flex items-center justify-center shadow-2xs`}>
            <CreditCard className={`${iconClasses} text-white`} />
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

  // 1. Full-span tile layout (e.g. 7th link in 7 links: spans across the bottom row)
  if (isFullSpan) {
    return (
      <a
        href={link.url}
        onClick={handleClick}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-row items-center justify-center gap-2.5 px-4 py-2.5 sm:py-3 rounded-2xl border border-[#E4D2BB] bg-[#FFFDF9] hover:bg-white hover:border-[#C8924A]/70 shadow-[0_2px_8px_-2px_rgba(43,26,18,0.06)] hover:shadow-md transition-all duration-150 active:scale-95 cursor-pointer select-none text-center min-h-[52px] sm:min-h-[56px] w-full"
        title={displayTitle}
      >
        <div className="shrink-0 transition-transform group-hover:scale-105 duration-150">
          {renderTileIcon(link.link_type)}
        </div>
        <span className="text-[12px] sm:text-[13px] font-bold text-[#2B1A12] group-hover:text-[#4A2A1A] transition-colors truncate tracking-tight">
          {displayTitle}
        </span>
      </a>
    );
  }

  // 2. Standard adaptive vertical tile
  const sizeClasses = {
    large: {
      card: 'p-3 sm:p-3.5 min-h-[96px] sm:min-h-[102px]',
      iconWrap: 'mb-2',
      text: 'text-xs sm:text-[13px]',
    },
    medium: {
      card: 'p-2.5 sm:p-3 min-h-[84px] sm:min-h-[88px]',
      iconWrap: 'mb-1.5',
      text: 'text-[11.5px] sm:text-xs',
    },
    compact: {
      card: 'p-2 sm:p-2.5 min-h-[74px] sm:min-h-[78px]',
      iconWrap: 'mb-1',
      text: 'text-[10.5px] sm:text-[11px]',
    },
  }[sizeVariant];

  return (
    <a
      href={link.url}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex flex-col items-center justify-center rounded-2xl border border-[#E4D2BB] bg-[#FFFDF9] hover:bg-white hover:border-[#C8924A]/70 shadow-[0_2px_8px_-2px_rgba(43,26,18,0.06)] hover:shadow-md transition-all duration-150 active:scale-95 cursor-pointer select-none text-center w-full h-full ${sizeClasses.card}`}
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
