import React, { useState } from 'react';
import { BusinessLink } from '@/types';
import { LINK_TYPE_CONFIG } from '@/components/business/linkIcons';
import { ExternalLink } from 'lucide-react';

interface PublicLinkCardProps {
  link: BusinessLink;
  onLinkClick: (linkId: string, url: string) => void;
  isPrimary?: boolean;
}

// Maps verbose titles to short, direct, recognizable platform/action titles
const VERBOSE_TITLE_MAP: Record<string, string> = {
  'visit our website': 'Official Website',
  'visit website': 'Official Website',
  'our website': 'Official Website',
  'visit official website': 'Official Website',
  'website': 'Official Website',
  'official website': 'Official Website',
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
  'leave a google review': 'Google Review',
  'leave a review': 'Google Review',
  'google review': 'Google Review',
  'google reviews': 'Google Review',
  'review on google': 'Google Review',
  'review us on google': 'Google Review',
  'find our location': 'Google Maps',
  'google maps': 'Google Maps',
  'view on google maps': 'Google Maps',
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

export const PublicLinkCard: React.FC<PublicLinkCardProps> = ({
  link,
  onLinkClick,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const cfg = LINK_TYPE_CONFIG[link.link_type] || LINK_TYPE_CONFIG.custom;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onLinkClick(link.id, link.url);
  };

  // Resolve short, direct title:
  const rawLabel = (link.label || '').trim();
  const lowerLabel = rawLabel.toLowerCase();
  const displayTitle = VERBOSE_TITLE_MAP[lowerLabel] || rawLabel || cfg.defaultLabel;
  const displaySubtitle = cfg.defaultSubtitle;

  return (
    <a
      href={link.url}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      className={`group relative flex items-center justify-between w-full p-3 sm:p-3.5 rounded-[20px] border border-[#E4D2BB] bg-[#FDFBF7] hover:bg-[#FFFFFF] hover:border-[#C8924A]/70 shadow-[0_2px_8px_-2px_rgba(43,26,18,0.06)] hover:shadow-[0_8px_20px_-4px_rgba(43,26,18,0.12)] transition-all duration-150 cursor-pointer select-none active:scale-[0.985] min-h-[64px] ${
        isPressed ? 'scale-[0.985]' : ''
      }`}
    >
      <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 pr-2">
        {/* Authentic Recognizable Brand/Action Icon Badge */}
        {cfg.brandBadge()}

        {/* Short Direct Title and Clear Subtitle */}
        <div className="min-w-0 text-left">
          <span className="block text-[14.5px] sm:text-[15.5px] font-extrabold text-[#2B1A12] group-hover:text-[#4A2A1A] transition-colors truncate tracking-tight">
            {displayTitle}
          </span>
          <span className="block text-[11px] sm:text-xs text-[#705B4D] font-medium truncate mt-0.5">
            {displaySubtitle}
          </span>
        </div>
      </div>

      {/* Outward Link Arrow Box */}
      <div className="w-8 h-8 rounded-xl border border-[#E4D2BB] bg-[#FFFDF9] group-hover:bg-white group-hover:border-[#C8924A]/70 flex items-center justify-center text-[#705B4D] group-hover:text-[#2B1A12] transition-colors shrink-0 shadow-2xs">
        <ExternalLink className="w-3.5 h-3.5" />
      </div>
    </a>
  );
};
