import React from 'react';
import { Sponsor } from '@/types';
import { ExternalLink } from 'lucide-react';

interface SponsorHeaderProps {
  sponsors: Sponsor[];
  onSponsorClick: (sponsorId: string, url: string) => void;
}

export const SponsorHeader: React.FC<SponsorHeaderProps> = ({ sponsors, onSponsorClick }) => {
  const activeSponsors = (sponsors || []).filter((s) => s && s.is_active !== false);

  if (activeSponsors.length === 0) {
    return null;
  }

  // Exactly one active sponsor strip
  const sponsor = activeSponsors[0];
  const hasUrl = Boolean(sponsor.website_url && sponsor.website_url.trim());

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (hasUrl) {
      e.preventDefault();
      onSponsorClick(sponsor.id, sponsor.website_url);
    }
  };

  return (
    <div className="w-full px-4 pt-1 pb-1 bg-[#FBF5EA]">
      <a
        href={hasUrl ? sponsor.website_url : '#'}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={`group flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg bg-[#FFFDF9] hover:bg-white border border-[#E4D2BB] hover:border-[#C8924A]/60 shadow-[0_1px_3px_rgba(43,26,18,0.04)] transition-all select-none ${
          hasUrl ? 'cursor-pointer' : 'cursor-default'
        }`}
        title={hasUrl ? `Visit ${sponsor.name}` : sponsor.name}
      >
        <div className="flex items-center gap-2 min-w-0 pr-1.5">
          {/* Small logo around 24–28px */}
          <div className="w-[26px] h-[26px] rounded-md bg-white border border-[#E4D2BB] flex items-center justify-center font-bold text-[10px] text-[#2B1A12] shrink-0 overflow-hidden p-0.5 shadow-2xs">
            {sponsor.logo_url ? (
              <img
                src={sponsor.logo_url}
                alt={sponsor.name}
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
                className="w-full h-full object-contain rounded-[4px]"
              />
            ) : (
              <span className="w-full h-full rounded-[4px] bg-[#3A2115] text-[#C8924A] flex items-center justify-center font-bold text-[10px]">
                {sponsor.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* Single subtle horizontal row text: small "Sponsored by" text + sponsor name slightly emphasized */}
          <div className="flex items-center gap-1.5 text-xs truncate">
            <span className="text-[11px] text-[#705B4D] font-normal shrink-0">
              Sponsored by
            </span>
            <span className="text-[12px] font-semibold text-[#2B1A12] group-hover:text-[#4A2A1A] truncate tracking-tight">
              {sponsor.name}
            </span>
          </div>
        </div>

        {/* Small external-link arrow */}
        {hasUrl && (
          <ExternalLink className="w-3.5 h-3.5 text-[#C8924A] group-hover:text-[#2B1A12] shrink-0 transition-colors" />
        )}
      </a>
    </div>
  );
};
