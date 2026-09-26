import React, { useState } from 'react';
import { Business, BusinessLink, Sponsor } from '@/types';
import { PublicLinkCard } from './PublicLinkCard';
import { SponsorCard } from './SponsorCard';
import { SponsorHeader } from './SponsorHeader';
import { getPublicBusinessUrl, copyToClipboard } from '@/lib/utils';
import {
  Phone,
  Mail,
  MapPin,
  Share2,
  Check,
  Copy,
  Link as LinkIcon,
  Sparkles,
} from 'lucide-react';

interface PublicProfileViewProps {
  business: Business;
  links: BusinessLink[];
  sponsors?: Sponsor[];
  headerSponsors?: Sponsor[];
  footerSponsors?: Sponsor[];
  onLinkClick: (linkId: string, url: string) => void;
  onSponsorClick: (sponsorId: string, url: string) => void;
}

export const PublicProfileView: React.FC<PublicProfileViewProps> = ({
  business,
  links,
  sponsors = [],
  headerSponsors = [],
  footerSponsors,
  onLinkClick,
  onSponsorClick,
}) => {
  const [copied, setCopied] = useState(false);
  const activeLinks = links.filter((l) => l.is_active);
  const effectiveFooterSponsors = footerSponsors !== undefined ? footerSponsors : sponsors;

  const handleShare = async () => {
    const profileUrl = window.location.href;
    const shareData = {
      title: business.name,
      text: `Visit ${business.name} on PersonToPerson:`,
      url: profileUrl,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // User cancelled native share sheet
      }
    }

    try {
      const success = await copyToClipboard(profileUrl);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <div className="min-h-screen bg-[#07111F] flex flex-col items-center justify-start sm:py-8 sm:px-4 text-[#F8FAFC] selection:bg-[#0EA5E9]/20 selection:text-[#38BDF8] relative overflow-x-hidden">
      {/* Ambient background glow for desktop presentation */}
      <div
        className="hidden sm:block absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(700px circle at 50% 15%, rgba(14, 165, 233, 0.08) 0%, transparent 70%)',
        }}
      />

      {/* Mobile Card Container: Edge-to-edge on mobile (320-430px), centered chassis on tablet/desktop */}
      <div className="w-full max-w-[430px] mx-auto bg-[#0B1728] min-h-screen sm:min-h-0 sm:rounded-[32px] sm:border sm:border-[#20344D] sm:shadow-[0_24px_70px_-10px_rgba(0,0,0,0.8),0_0_0_1px_rgba(32,52,77,0.5)] overflow-hidden flex flex-col relative z-10">

        {/* Top Sponsor Header (if assigned) */}
        {headerSponsors.length > 0 && (
          <SponsorHeader
            sponsors={headerSponsors}
            onSponsorClick={onSponsorClick}
          />
        )}

        {/* Hero / Header Space */}
        {business.cover_url ? (
          <div className="relative h-28 sm:h-32 w-full bg-[#07111F] overflow-hidden border-b border-[#20344D]">
            <img
              src={business.cover_url}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1728] via-[#0B1728]/60 to-transparent" />
          </div>
        ) : (
          /* Sleek ambient digital banner with subtle lighting */
          <div className="relative h-20 w-full overflow-hidden bg-gradient-to-b from-[#14243A] via-[#0B1728]/70 to-[#0B1728] border-b border-[#20344D]/40 flex items-center justify-center">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle at 50% -20%, rgba(14, 165, 233, 0.22) 0%, transparent 70%)',
              }}
            />
          </div>
        )}

        {/* Profile Identity Section */}
        <div className="px-4 sm:px-5 pb-7 text-center relative flex-1 flex flex-col -mt-10 sm:-mt-11">
          
          {/* Business Logo - Primary Visual Focus */}
          <div className="inline-block relative mx-auto mb-2.5">
            <div className="w-20 h-20 sm:w-[88px] sm:h-[88px] rounded-2xl p-1 bg-[#14243A] ring-4 ring-[#0B1728] border border-[#20344D] shadow-[0_8px_25px_-5px_rgba(0,0,0,0.5)] shrink-0 mx-auto overflow-hidden flex items-center justify-center">
              {business.logo_url ? (
                <img
                  src={business.logo_url}
                  alt={business.name}
                  className="w-full h-full rounded-[14px] object-cover bg-[#07111F]"
                />
              ) : (
                <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] text-white flex items-center justify-center font-extrabold text-3xl shadow-inner">
                  {business.name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* Business Name */}
          <h1 className="text-[22px] sm:text-[25px] font-extrabold text-[#F8FAFC] tracking-tight leading-tight px-2 break-words">
            {business.name}
          </h1>

          {/* Category & Location Badges */}
          {(business.category || business.city) && (
            <div className="flex items-center justify-center gap-2 text-xs text-[#94A3B8] mt-1.5 flex-wrap px-2">
              {business.category && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#14243A] text-[#38BDF8] font-semibold text-[11px] border border-[#20344D] tracking-wide">
                  {business.category}
                </span>
              )}
              {business.city && (
                <span className="inline-flex items-center gap-1 text-[#94A3B8] text-xs font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#0EA5E9] shrink-0" />
                  <span>{business.city}</span>
                </span>
              )}
            </div>
          )}

          {/* Description / Bio */}
          {business.description && (
            <p className="mt-2 text-xs sm:text-[13px] text-[#94A3B8] leading-relaxed max-w-sm mx-auto font-normal px-2">
              {business.description}
            </p>
          )}

          {/* Polished Native Mobile Quick Action Controls (Min touch target 44px+) */}
          <div className="grid grid-flow-col auto-cols-fr gap-2 sm:gap-3 max-w-[320px] w-full mx-auto mt-4 pt-3.5 border-t border-[#20344D]">
            {business.phone && (
              <a
                href={`tel:${business.phone}`}
                className="group flex flex-col items-center gap-1.5 cursor-pointer"
                title="Call business phone number"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#101D30] group-hover:bg-[#14243A] border border-[#20344D] group-hover:border-[#38BDF8] text-[#F8FAFC] group-hover:text-[#38BDF8] flex items-center justify-center transition-all duration-150 active:scale-90 shadow-2xs">
                  <Phone className="w-4.5 h-4.5" />
                </div>
                <span className="text-[10px] font-bold text-[#94A3B8] group-hover:text-[#F8FAFC] uppercase tracking-wider transition-colors">
                  Call
                </span>
              </a>
            )}

            {business.email && (
              <a
                href={`mailto:${business.email}`}
                className="group flex flex-col items-center gap-1.5 cursor-pointer"
                title="Send email to business"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#101D30] group-hover:bg-[#14243A] border border-[#20344D] group-hover:border-[#38BDF8] text-[#F8FAFC] group-hover:text-[#38BDF8] flex items-center justify-center transition-all duration-150 active:scale-90 shadow-2xs">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <span className="text-[10px] font-bold text-[#94A3B8] group-hover:text-[#F8FAFC] uppercase tracking-wider transition-colors">
                  Email
                </span>
              </a>
            )}

            {business.address && (
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(
                  `${business.name} ${business.address} ${business.city || ''}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-1.5 cursor-pointer"
                title="Open location in Maps"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#101D30] group-hover:bg-[#14243A] border border-[#20344D] group-hover:border-[#38BDF8] text-[#F8FAFC] group-hover:text-[#38BDF8] flex items-center justify-center transition-all duration-150 active:scale-90 shadow-2xs">
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <span className="text-[10px] font-bold text-[#94A3B8] group-hover:text-[#F8FAFC] uppercase tracking-wider transition-colors">
                  Map
                </span>
              </a>
            )}

            {/* Native Share button */}
            <button
              type="button"
              onClick={handleShare}
              className="group flex flex-col items-center gap-1.5 cursor-pointer"
              title="Share or copy profile link"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#101D30] group-hover:bg-[#14243A] border border-[#20344D] group-hover:border-[#38BDF8] text-[#F8FAFC] group-hover:text-[#38BDF8] flex items-center justify-center transition-all duration-150 active:scale-90 shadow-2xs">
                {copied ? <Check className="w-4.5 h-4.5 text-[#22C55E]" /> : <Share2 className="w-4.5 h-4.5" />}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${copied ? 'text-[#22C55E]' : 'text-[#94A3B8] group-hover:text-[#F8FAFC]'}`}>
                {copied ? 'Copied' : 'Share'}
              </span>
            </button>
          </div>

          {/* Section Divider & Links Header */}
          <div className="mt-6 mb-2.5 flex items-center justify-between px-1">
            <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#0EA5E9]" />
              <span>Links & Resources</span>
            </span>
            <span className="text-[10px] font-mono text-[#94A3B8] bg-[#14243A] px-2 py-0.5 rounded-full border border-[#20344D]">
              {activeLinks.length} {activeLinks.length === 1 ? 'link' : 'links'}
            </span>
          </div>

          {/* Active Links List */}
          <div className="flex-1 flex flex-col space-y-2.5">
            {activeLinks.length === 0 ? (
              <div className="p-6 text-center rounded-2xl border border-dashed border-[#20344D] bg-[#101D30]/40 my-2">
                <LinkIcon className="w-6 h-6 text-[#94A3B8]/50 mx-auto mb-1.5" />
                <p className="text-xs font-semibold text-[#F8FAFC]">No links added yet</p>
                <p className="text-[11px] text-[#94A3B8] mt-0.5">
                  Check back soon for official links.
                </p>
              </div>
            ) : (
              activeLinks.map((link, index) => (
                <PublicLinkCard
                  key={link.id}
                  link={link}
                  onLinkClick={onLinkClick}
                  isPrimary={index === 0}
                />
              ))
            )}
          </div>

          {/* Footer Sponsors Section */}
          {effectiveFooterSponsors.length > 0 && (
            <div className="space-y-2.5 mt-4">
              {effectiveFooterSponsors.map((sponsor) => (
                <SponsorCard
                  key={sponsor.id}
                  sponsor={sponsor}
                  onSponsorClick={onSponsorClick}
                />
              ))}
            </div>
          )}

          {/* Understated Permanent URL Footer */}
          <div className="mt-8 pt-5 pb-2 border-t border-[#20344D] flex flex-col items-center gap-1.5 text-center">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 font-mono text-[10.5px] sm:text-[11px] text-[#94A3B8] hover:text-[#F8FAFC] bg-[#101D30] hover:bg-[#14243A] px-3 py-1.5 rounded-xl border border-[#20344D] hover:border-[#38BDF8]/50 transition-all cursor-pointer max-w-full group shadow-2xs"
              title="Click to copy permanent profile link"
            >
              <LinkIcon className="w-3.5 h-3.5 text-[#0EA5E9] shrink-0" />
              <span className="text-[#94A3B8]/70 shrink-0">Permanent URL:</span>
              <span className="text-[#38BDF8] font-medium truncate">
                {getPublicBusinessUrl(business.slug).replace(/^https?:\/\//, '')}
              </span>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-[#22C55E] shrink-0 ml-0.5" />
              ) : (
                <Copy className="w-3 h-3 text-[#94A3B8] group-hover:text-[#F8FAFC] shrink-0 ml-0.5" />
              )}
            </button>
            <span className="text-[10px] text-[#94A3B8]/80 font-medium">
              PersonToPerson Digital Business Profile
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
