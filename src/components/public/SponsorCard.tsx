import React, { useState } from 'react';
import { Sponsor } from '@/types';
import { ExternalLink } from 'lucide-react';

interface SponsorCardProps {
  sponsor: Sponsor;
  onSponsorClick: (sponsorId: string, url: string) => void;
}

export const SponsorCard: React.FC<SponsorCardProps> = ({ sponsor, onSponsorClick }) => {
  const [imgError, setImgError] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onSponsorClick(sponsor.id, sponsor.website_url);
  };

  return (
    <a
      href={sponsor.website_url}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      className="block group p-3 sm:p-3.5 rounded-2xl border border-[#E4D2BB] bg-[#FAF5EA] hover:bg-[#FFFDF9] transition-all duration-150 cursor-pointer active:scale-[0.985] shadow-xs"
    >
      <div className="flex items-center gap-3">
        {/* Sponsor Logo with Broken Image Protection */}
        {sponsor.logo_url && !imgError ? (
          <img
            src={sponsor.logo_url}
            alt={sponsor.name}
            onError={() => setImgError(true)}
            className="w-10 h-10 rounded-xl object-contain border border-[#E4D2BB] p-1 shrink-0 bg-white"
          />
        ) : (
          <div className="w-10 h-10 rounded-xl bg-[#3A2115] text-[#C8924A] flex items-center justify-center font-bold text-sm shrink-0 border border-[#4A2A1A]">
            {sponsor.name?.charAt(0) || 'S'}
          </div>
        )}

        <div className="min-w-0 flex-1 text-left">
          <div className="flex items-center justify-between gap-1.5">
            <h5 className="text-xs sm:text-[13px] font-bold text-[#2B1A12] group-hover:text-[#4A2A1A] transition-colors truncate tracking-tight">
              {sponsor.name}
            </h5>
            <div className="w-6 h-6 rounded-lg border border-[#E4D2BB] bg-white flex items-center justify-center text-[#705B4D] group-hover:text-[#2B1A12] transition-colors shrink-0 shadow-2xs">
              <ExternalLink className="w-3 h-3" />
            </div>
          </div>
          {sponsor.description && (
            <p className="text-[11px] text-[#705B4D] line-clamp-1 mt-0.5 leading-snug">
              {sponsor.description}
            </p>
          )}
        </div>
      </div>
    </a>
  );
};
