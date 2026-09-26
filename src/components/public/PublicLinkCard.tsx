import React, { useState } from 'react';
import { BusinessLink } from '@/types';
import { LINK_TYPE_CONFIG } from '@/components/business/linkIcons';
import { ExternalLink, ArrowRight, Sparkles } from 'lucide-react';

interface PublicLinkCardProps {
  link: BusinessLink;
  onLinkClick: (linkId: string, url: string) => void;
  isPrimary?: boolean;
}

export const PublicLinkCard: React.FC<PublicLinkCardProps> = ({
  link,
  onLinkClick,
  isPrimary = false,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const cfg = LINK_TYPE_CONFIG[link.link_type] || LINK_TYPE_CONFIG.custom;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onLinkClick(link.id, link.url);
  };

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
      className={`group relative flex items-center justify-between w-full min-h-[56px] px-3.5 py-3 rounded-2xl border transition-all duration-150 cursor-pointer select-none ${
        isPressed ? 'scale-[0.985]' : ''
      } ${
        isPrimary
          ? 'bg-gradient-to-r from-[#14243A] via-[#14243A] to-[#0EA5E9]/15 hover:bg-[#101D30] border-[#0EA5E9]/80 hover:border-[#38BDF8] shadow-[0_4px_20px_-4px_rgba(14,165,233,0.22)]'
          : 'bg-[#101D30] hover:bg-[#14243A] border-[#20344D] hover:border-[#38BDF8]/50 shadow-2xs'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 pr-2">
        {/* Category-tinted squircle icon container */}
        <div className="w-10 h-10 rounded-xl bg-[#0B1728] border border-[#20344D] flex items-center justify-center shrink-0 transition-transform duration-150 group-hover:scale-105 shadow-inner">
          {cfg.icon({ className: `w-[18px] h-[18px] ${cfg.colorClass}` })}
        </div>

        {/* Title and Category info */}
        <div className="min-w-0 text-left">
          <span className="block text-[13.5px] font-semibold text-[#F8FAFC] group-hover:text-white transition-colors truncate tracking-tight">
            {link.label}
          </span>
          <span className="text-[11px] text-[#94A3B8] font-medium flex items-center gap-1.5 mt-0.5">
            {isPrimary && (
              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#0EA5E9] bg-[#0B1728] border border-[#0EA5E9]/40 px-1.5 py-0.5 rounded tracking-wider uppercase">
                <Sparkles className="w-2.5 h-2.5 text-[#0EA5E9]" />
                Featured
              </span>
            )}
            <span className="truncate">{cfg.label}</span>
          </span>
        </div>
      </div>

      {/* Action Indicator Pill */}
      <div
        className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-xl bg-[#0B1728] border transition-colors ${
          isPrimary
            ? 'border-[#0EA5E9]/40 text-[#0EA5E9] group-hover:border-[#38BDF8] group-hover:bg-[#14243A]'
            : 'border-[#20344D] text-[#94A3B8] group-hover:text-[#38BDF8] group-hover:border-[#38BDF8]/60'
        }`}
      >
        {link.link_type === 'whatsapp' || link.link_type === 'payment' ? (
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
        ) : (
          <ExternalLink className="w-3.5 h-3.5" />
        )}
      </div>
    </a>
  );
};
