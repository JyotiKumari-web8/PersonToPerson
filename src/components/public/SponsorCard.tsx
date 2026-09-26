import React from 'react';
import { Sponsor } from '@/types';
import { ExternalLink, Award } from 'lucide-react';

interface SponsorCardProps {
  sponsor: Sponsor;
  onSponsorClick: (sponsorId: string, url: string) => void;
}

export const SponsorCard: React.FC<SponsorCardProps> = ({ sponsor, onSponsorClick }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onSponsorClick(sponsor.id, sponsor.website_url);
  };

  return (
    <div className="w-full mt-5 pt-4 border-t border-[#20344D]">
      <div className="flex items-center justify-center gap-1.5 mb-2.5">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#14243A] text-[#94A3B8] text-[9.5px] font-bold uppercase tracking-wider border border-[#20344D]">
          <Award className="w-3 h-3 text-[#0EA5E9]" />
          <span>Official Partner</span>
        </span>
      </div>

      <a
        href={sponsor.website_url}
        onClick={handleClick}
        target="_blank"
        rel="noopener noreferrer"
        className="block group p-3.5 rounded-2xl border border-[#20344D] bg-[#101D30] hover:bg-[#14243A] hover:border-[#38BDF8]/60 transition-all duration-150 cursor-pointer active:scale-[0.985] shadow-2xs"
      >
        <div className="flex items-center gap-3">
          {sponsor.logo_url ? (
            <img
              src={sponsor.logo_url}
              alt={sponsor.name}
              className="w-11 h-11 rounded-xl object-contain border border-[#20344D] p-1 shrink-0 bg-[#0B1728]"
            />
          ) : (
            <div className="w-11 h-11 rounded-xl bg-[#0B1728] text-[#0EA5E9] flex items-center justify-center font-bold text-base shrink-0 border border-[#20344D]">
              {sponsor.name.charAt(0)}
            </div>
          )}

          <div className="min-w-0 flex-1 text-left">
            <div className="flex items-center justify-between gap-1.5">
              <h5 className="text-xs font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors truncate tracking-tight">
                {sponsor.name}
              </h5>
              <ExternalLink className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#38BDF8] transition-colors shrink-0" />
            </div>
            {sponsor.description && (
              <p className="text-[11px] text-[#94A3B8] line-clamp-2 mt-0.5 leading-snug">
                {sponsor.description}
              </p>
            )}
          </div>
        </div>
      </a>
    </div>
  );
};
