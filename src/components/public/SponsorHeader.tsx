import React from 'react';
import { Sponsor } from '@/types';
import { ExternalLink, Award } from 'lucide-react';

interface SponsorHeaderProps {
  sponsors: Sponsor[];
  onSponsorClick: (sponsorId: string, url: string) => void;
}

export const SponsorHeader: React.FC<SponsorHeaderProps> = ({ sponsors, onSponsorClick }) => {
  const activeSponsors = (sponsors || []).filter((s) => s && s.is_active !== false);

  if (activeSponsors.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-[#0B1728] border-b border-[#20344D] divide-y divide-[#20344D] transition-colors">
      {activeSponsors.map((sponsor) => {
        const hasUrl = Boolean(sponsor.website_url && sponsor.website_url.trim());

        const innerContent = (
          <div className="flex items-center justify-between w-full px-3.5 sm:px-4 py-2 gap-2 text-xs">
            {/* Left: Official Partner badge */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#14243A] text-[#94A3B8] border border-[#20344D] text-[9.5px] font-semibold tracking-wide uppercase">
                <Award className="w-3 h-3 text-[#0EA5E9]" />
                <span>Partner</span>
              </span>
            </div>

            {/* Right: Sponsor Logo, Name & Link icon */}
            <div className="flex items-center gap-2 min-w-0">
              {sponsor.logo_url && (
                <img
                  src={sponsor.logo_url}
                  alt=""
                  className="w-5 h-5 rounded object-contain border border-[#20344D] bg-[#14243A] p-0.5 shrink-0"
                />
              )}
              <span className="font-semibold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors truncate max-w-[140px] sm:max-w-[200px]">
                {sponsor.name}
              </span>
              {hasUrl && (
                <ExternalLink className="w-3 h-3 text-[#94A3B8] group-hover:text-[#38BDF8] transition-colors shrink-0" />
              )}
            </div>
          </div>
        );

        if (hasUrl) {
          return (
            <a
              key={sponsor.id}
              href={sponsor.website_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                onSponsorClick(sponsor.id, sponsor.website_url);
              }}
              className="block group hover:bg-[#101D30] transition-colors cursor-pointer"
              title={`Visit ${sponsor.name}`}
            >
              {innerContent}
            </a>
          );
        }

        return (
          <div key={sponsor.id} className="block">
            {innerContent}
          </div>
        );
      })}
    </div>
  );
};
