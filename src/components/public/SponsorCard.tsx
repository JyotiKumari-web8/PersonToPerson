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
    <div className="w-full mt-6 pt-6 border-t border-slate-200/80">
      <div className="flex items-center justify-center gap-1.5 mb-2.5">
        <Award className="w-3.5 h-3.5 text-sky-600" />
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Official Partner
        </span>
      </div>

      <a
        href={sponsor.website_url}
        onClick={handleClick}
        target="_blank"
        rel="noopener noreferrer"
        className="block group p-4 rounded-xl border border-sky-100 bg-linear-to-b from-sky-50/50 to-white hover:border-sky-300 transition-all shadow-xs"
      >
        <div className="flex items-center gap-3">
          {sponsor.logo_url ? (
            <img
              src={sponsor.logo_url}
              alt={sponsor.name}
              className="w-11 h-11 rounded-lg object-cover border border-slate-200 shrink-0 bg-white"
            />
          ) : (
            <div className="w-11 h-11 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-base shrink-0">
              {sponsor.name.charAt(0)}
            </div>
          )}

          <div className="min-w-0 flex-1 text-left">
            <div className="flex items-center gap-1.5">
              <h5 className="text-xs font-semibold text-slate-800 group-hover:text-sky-700 transition-colors truncate">
                {sponsor.name}
              </h5>
              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-sky-600 shrink-0" />
            </div>
            {sponsor.description && (
              <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                {sponsor.description}
              </p>
            )}
          </div>
        </div>
      </a>
    </div>
  );
};
