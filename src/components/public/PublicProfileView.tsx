import React, { useState } from 'react';
import { Business, BusinessLink, Sponsor, LinkType } from '@/types';
import { PublicLinkCard } from './PublicLinkCard';
import { SponsorCard } from './SponsorCard';
import { SponsorHeader } from './SponsorHeader';
import { getPublicBusinessUrl, copyToClipboard, isPaymentOrUpiLink } from '@/lib/utils';
import { GoogleGIcon } from '@/components/business/linkIcons';
import {
  Phone,
  Mail,
  MapPin,
  Share2,
  Check,
  Copy,
  Link as LinkIcon,
  ChevronLeft,
  CheckCircle2,
} from 'lucide-react';

interface PublicProfileViewProps {
  business: Business;
  links: BusinessLink[];
  sponsors?: Sponsor[];
  headerSponsors?: Sponsor[];
  footerSponsors?: Sponsor[];
  onLinkClick: (linkId: string, url: string, linkType?: LinkType) => void;
  onSponsorClick: (sponsorId: string, url: string) => void;
}

// Dynamic responsive column span calculation based on total active link count
const getTileColSpan = (index: number, totalCount: number): string => {
  // 1 link: Compact centered tile, never full-width
  if (totalCount === 1) return 'col-span-4 col-start-2 sm:col-span-2 sm:col-start-3';

  // 2 links: Two balanced tiles
  if (totalCount === 2) return 'col-span-3';

  // 3 links: Three balanced tiles
  if (totalCount === 3) return 'col-span-2';

  // 4 links: 2 x 2 balanced grid
  if (totalCount === 4) return 'col-span-3';

  // 5 links: 3 in row 1, 2 balanced in row 2
  if (totalCount === 5) {
    return index < 3 ? 'col-span-2' : 'col-span-3';
  }

  // 6 links: 3 + 3
  if (totalCount === 6) return 'col-span-2';

  // 7 links: 3 + 3 + 1 (The seventh tile is centered and NEVER full-width)
  if (totalCount === 7) {
    if (index === 6) return 'col-span-2 col-start-3';
    return 'col-span-2';
  }

  // 8 or more links: dynamically balanced rows
  const remainder = totalCount % 3;
  if (remainder === 0) return 'col-span-2';
  if (remainder === 1) {
    if (index === totalCount - 1) return 'col-span-2 col-start-3';
    return 'col-span-2';
  }
  if (remainder === 2) {
    if (index >= totalCount - 2) return 'col-span-3';
    return 'col-span-2';
  }
  return 'col-span-2';
};

const getTileSizeVariant = (totalCount: number): 'large' | 'medium' | 'compact' => {
  if (totalCount <= 3) return 'large';
  if (totalCount <= 6) return 'medium';
  return 'compact';
};

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
  const activeLinks = links.filter(
    (l) => l.is_active && !isPaymentOrUpiLink(l)
  );
  const googleReviewLink = activeLinks.find((l) => l.link_type === 'google_review');
  const customerRepeatLink = activeLinks.find(
    (l) => l.link_type === 'customer_repeat' || (l.link_type as string) === 'smart_stand'
  );
  const otherActiveLinks = activeLinks.filter(
    (l) =>
      l.link_type !== 'google_review' &&
      l.link_type !== 'customer_repeat' &&
      (l.link_type as string) !== 'smart_stand'
  );
  const effectiveFooterSponsors = footerSponsors !== undefined ? footerSponsors : sponsors;

  const handleShare = async () => {
    const profileUrl = window.location.href;
    const shareData = {
      title: business.name,
      text: `Connect with ${business.name}:`,
      url: profileUrl,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // User closed native share sheet
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

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-[#EDE4D5] flex flex-col items-center justify-start sm:py-8 sm:px-4 text-[#2B1A12] selection:bg-[#F3E6D3] selection:text-[#3A2115] relative overflow-x-hidden">
      {/* Warm Ambient Backdrop Glow for Desktop View */}
      <div
        className="hidden sm:block absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(800px circle at 50% 15%, rgba(200, 146, 74, 0.15) 0%, rgba(58, 33, 21, 0.05) 50%, transparent 80%)',
        }}
      />

      {/* Mobile Card Chassis: Edge-to-edge on mobile (320px-430px), centered premium phone card on desktop */}
      <div className="w-full max-w-[430px] mx-auto bg-[#FBF5EA] min-h-screen sm:min-h-0 sm:rounded-[38px] sm:border sm:border-[#E4D2BB] sm:shadow-[0_24px_64px_-16px_rgba(43,26,18,0.22),0_0_0_1px_rgba(228,210,187,0.7)] overflow-hidden flex flex-col relative z-10">

        {/* Top Controls: [ Back ] and [ Share ] */}
        <div className="relative flex items-center justify-between px-4 pt-3.5 pb-1 bg-[#FBF5EA] z-20">
          <button
            type="button"
            onClick={handleBack}
            className="w-8.5 h-8.5 rounded-full bg-white hover:bg-[#F3E6D3] border border-[#E4D2BB] flex items-center justify-center text-[#2B1A12] transition-all cursor-pointer active:scale-95 shadow-2xs"
            title="Back"
          >
            <ChevronLeft className="w-4.5 h-4.5 text-[#2B1A12]" />
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="w-8.5 h-8.5 rounded-full bg-white hover:bg-[#F3E6D3] border border-[#E4D2BB] flex items-center justify-center text-[#2B1A12] transition-all cursor-pointer active:scale-95 shadow-2xs"
            title="Share Profile"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Share2 className="w-3.5 h-3.5 text-[#2B1A12]" />}
          </button>
        </div>

        {/* Dedicated Compact Header Sponsor Strip */}
        {headerSponsors.length > 0 && (
          <SponsorHeader sponsors={headerSponsors} onSponsorClick={onSponsorClick} />
        )}

        {/* Profile Content Container: Continuous Clean Warm Cream Background (No brown banner or wave) */}
        <div className="px-4 sm:px-5 pt-3 pb-8 text-center relative flex-1 flex flex-col bg-[#FBF5EA]">

          {/* Circular Business Logo with Warm Cream Ring & Soft Gold Accent */}
          <div className="inline-block relative mx-auto mb-2.5 z-20">
            <div className="w-20 h-20 sm:w-[84px] sm:h-[84px] rounded-full p-1 bg-[#FBF5EA] ring-4 ring-[#FBF5EA] border border-[#E4D2BB] shadow-[0_10px_25px_-5px_rgba(43,26,18,0.2)] shrink-0 mx-auto overflow-hidden flex items-center justify-center">
              {business.logo_url ? (
                <img
                  src={business.logo_url}
                  alt={business.name}
                  className="w-full h-full rounded-full object-cover bg-white"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-[#3A2115] text-[#C8924A] flex items-center justify-center font-extrabold text-2xl border border-[#4A2A1A]">
                  {business.name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* Business Name with Verified Gold Badge */}
          <div className="flex items-center justify-center gap-1.5 px-2">
            <h1 className="text-xl sm:text-[22px] font-extrabold text-[#2B1A12] tracking-tight leading-tight break-words">
              {business.name}
            </h1>
            <CheckCircle2 className="w-5 h-5 text-[#C8924A] shrink-0 fill-[#F3E6D3]" />
          </div>

          {/* Address / Location with Pin */}
          {business.address && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#705B4D] mt-1.5 font-medium px-2">
              <MapPin className="w-3.5 h-3.5 text-[#C8924A] shrink-0" />
              <span className="truncate max-w-xs">{business.address}</span>
            </div>
          )}

          {/* Phone Number with Phone Icon */}
          {business.phone && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#705B4D] mt-1 font-mono font-medium">
              <Phone className="w-3 h-3 text-[#C8924A] shrink-0" />
              <span>{business.phone}</span>
            </div>
          )}

          {/* Short Description */}
          {business.description && (
            <p className="mt-2 text-xs sm:text-[13px] text-[#705B4D] leading-relaxed max-w-sm mx-auto font-normal px-2">
              {business.description}
            </p>
          )}

          {/* Quick Action Touch Buttons: [ CALL ] [ EMAIL ] [ MAP ] [ SHARE ] */}
          <div className="grid grid-cols-4 gap-2 sm:gap-2.5 max-w-[340px] w-full mx-auto mt-4 pt-4 border-t border-[#E4D2BB]">
            {/* CALL */}
            <a
              href={business.phone ? `tel:${business.phone}` : '#'}
              onClick={(e) => {
                if (!business.phone) e.preventDefault();
              }}
              className={`flex flex-col items-center gap-1 p-2 sm:p-2.5 rounded-2xl border border-[#E4D2BB] bg-[#FFFDF9] hover:bg-white hover:border-[#C8924A]/70 shadow-[0_2px_8px_-2px_rgba(43,26,18,0.06)] hover:shadow-md transition-all active:scale-95 cursor-pointer ${
                !business.phone ? 'opacity-40 pointer-events-none' : ''
              }`}
              title="Call Business"
            >
              <div className="w-9 h-9 rounded-xl bg-[#F7EEDF] flex items-center justify-center text-[#2B1A12] shadow-2xs">
                <Phone className="w-4 h-4 text-[#2B1A12]" />
              </div>
              <span className="text-[10px] font-bold text-[#705B4D] uppercase tracking-wider">
                Call
              </span>
            </a>

            {/* EMAIL */}
            <a
              href={business.email ? `mailto:${business.email}` : '#'}
              onClick={(e) => {
                if (!business.email) e.preventDefault();
              }}
              className={`flex flex-col items-center gap-1 p-2 sm:p-2.5 rounded-2xl border border-[#E4D2BB] bg-[#FFFDF9] hover:bg-white hover:border-[#C8924A]/70 shadow-[0_2px_8px_-2px_rgba(43,26,18,0.06)] hover:shadow-md transition-all active:scale-95 cursor-pointer ${
                !business.email ? 'opacity-40 pointer-events-none' : ''
              }`}
              title="Send Email"
            >
              <div className="w-9 h-9 rounded-xl bg-[#F7EEDF] flex items-center justify-center text-[#2B1A12] shadow-2xs">
                <Mail className="w-4 h-4 text-[#2B1A12]" />
              </div>
              <span className="text-[10px] font-bold text-[#705B4D] uppercase tracking-wider">
                Email
              </span>
            </a>

            {/* MAP */}
            <a
              href={
                business.address
                  ? `https://maps.google.com/?q=${encodeURIComponent(
                      `${business.name} ${business.address}`
                    )}`
                  : '#'
              }
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (!business.address) e.preventDefault();
              }}
              className={`flex flex-col items-center gap-1 p-2 sm:p-2.5 rounded-2xl border border-[#E4D2BB] bg-[#FFFDF9] hover:bg-white hover:border-[#C8924A]/70 shadow-[0_2px_8px_-2px_rgba(43,26,18,0.06)] hover:shadow-md transition-all active:scale-95 cursor-pointer ${
                !business.address ? 'opacity-40 pointer-events-none' : ''
              }`}
              title="Open Location in Google Maps"
            >
              <div className="w-9 h-9 rounded-xl bg-[#F7EEDF] flex items-center justify-center text-[#2B1A12] shadow-2xs">
                <MapPin className="w-4 h-4 text-[#2B1A12]" />
              </div>
              <span className="text-[10px] font-bold text-[#705B4D] uppercase tracking-wider">
                Map
              </span>
            </a>

            {/* SHARE */}
            <button
              type="button"
              onClick={handleShare}
              className="flex flex-col items-center gap-1 p-2 sm:p-2.5 rounded-2xl border border-[#E4D2BB] bg-[#FFFDF9] hover:bg-white hover:border-[#C8924A]/70 shadow-[0_2px_8px_-2px_rgba(43,26,18,0.06)] hover:shadow-md transition-all active:scale-95 cursor-pointer"
              title="Share Profile Link"
            >
              <div className="w-9 h-9 rounded-xl bg-[#F7EEDF] flex items-center justify-center text-[#2B1A12] shadow-2xs">
                {copied ? <Check className="w-4 h-4 text-[#16A34A]" /> : <Share2 className="w-4 h-4 text-[#2B1A12]" />}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${copied ? 'text-[#16A34A]' : 'text-[#705B4D]'}`}>
                {copied ? 'Copied' : 'Share'}
              </span>
            </button>
          </div>

          {/* Links Section Header */}
          <div className="mt-6 mb-3 flex items-center justify-between px-1">
            <div className="flex items-center gap-2 text-sm font-bold text-[#2B1A12]">
              <span className="text-sm select-none" role="img" aria-label="Links">🔗</span>
              <span className="tracking-tight">Our Links</span>
            </div>
            <span className="text-[11px] font-bold text-[#705B4D] bg-[#F3E6D3] px-2.5 py-0.5 rounded-full border border-[#E4D2BB] shadow-2xs">
              {activeLinks.length} {activeLinks.length === 1 ? 'link' : 'links'}
            </span>
          </div>

          {/* 1. Special Items: AI Google Review + Repeat Customer (ALWAYS Visible) */}
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5 mb-3">
            {/* AI Google Review */}
            {googleReviewLink ? (
              <a
                href={googleReviewLink.url}
                onClick={(e) => {
                  e.preventDefault();
                  onLinkClick(googleReviewLink.id, googleReviewLink.url);
                }}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border border-[#E8DCCB]/80 bg-[#FFFDF9] hover:bg-white hover:border-[#C8924A]/70 shadow-[0_2px_8px_-2px_rgba(43,26,18,0.06)] hover:shadow-md transition-all duration-150 active:scale-95 cursor-pointer text-center min-h-[92px]"
                title="AI Google Review"
              >
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white border border-[#E4D2BB] flex items-center justify-center shadow-2xs p-2.5 shrink-0 mb-1.5 transition-transform group-hover:scale-105">
                  <GoogleGIcon className="w-7.5 h-7.5 sm:w-8 sm:h-8" />
                </div>
                <span className="font-bold text-xs text-[#2B1A12] tracking-tight">AI Google Review</span>
                <span className="text-[9.5px] font-semibold text-emerald-600 mt-0.5">Active</span>
              </a>
            ) : (
              <div
                className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border border-dashed border-[#E4D2BB]/70 bg-[#FAF3E7]/50 text-center min-h-[92px] opacity-60 cursor-not-allowed select-none"
                title="AI Google Review (Not configured)"
              >
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white/70 border border-[#E4D2BB]/60 flex items-center justify-center shadow-2xs p-2.5 shrink-0 mb-1.5 grayscale opacity-75">
                  <GoogleGIcon className="w-7.5 h-7.5 sm:w-8 sm:h-8" />
                </div>
                <span className="font-bold text-xs text-[#705B4D] tracking-tight">AI Google Review</span>
                <span className="text-[9.5px] text-[#A8988B] font-medium mt-0.5">Not Configured</span>
              </div>
            )}

            {/* Repeat Customer */}
            {customerRepeatLink ? (
              <a
                href={customerRepeatLink.url || '#'}
                onClick={(e) => {
                  e.preventDefault();
                  onLinkClick(customerRepeatLink.id, customerRepeatLink.url || '#');
                }}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border border-[#E8DCCB]/80 bg-[#FFFDF9] hover:bg-white hover:border-[#C8924A]/70 shadow-[0_2px_8px_-2px_rgba(43,26,18,0.06)] hover:shadow-md transition-all duration-150 active:scale-95 cursor-pointer text-center min-h-[92px]"
                title="Repeat Customer"
              >
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#241810] border border-[#3D2B1F] flex items-center justify-center shadow-2xs p-2 shrink-0 mb-1.5 transition-transform group-hover:scale-105 overflow-hidden">
                  <img src="/prestige-logo.png" alt="Repeat Customer" className="w-8.5 h-8.5 sm:w-9 sm:h-9 object-contain" />
                </div>
                <span className="font-bold text-xs text-[#2B1A12] tracking-tight">Repeat Customer</span>
                <span className="text-[9.5px] font-semibold text-purple-600 mt-0.5">Active</span>
              </a>
            ) : (
              <div
                className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border border-dashed border-[#E4D2BB]/70 bg-[#FAF3E7]/50 text-center min-h-[92px] opacity-60 cursor-not-allowed select-none"
                title="Repeat Customer (Not configured)"
              >
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#241810]/60 border border-[#3D2B1F]/60 flex items-center justify-center shadow-2xs p-2 shrink-0 mb-1.5 grayscale opacity-75 overflow-hidden">
                  <img src="/prestige-logo.png" alt="Repeat Customer" className="w-8.5 h-8.5 sm:w-9 sm:h-9 object-contain" />
                </div>
                <span className="font-bold text-xs text-[#705B4D] tracking-tight">Repeat Customer</span>
                <span className="text-[9.5px] text-[#A8988B] font-medium mt-0.5">Not Configured</span>
              </div>
            )}
          </div>

          {/* 2. Additional Configured Links: Adaptive Responsive Icon Grid */}
          {otherActiveLinks.length > 0 && (
            <div className="flex-1">
              <div
                className={`grid grid-cols-6 ${
                  otherActiveLinks.length <= 3
                    ? 'gap-2.5 sm:gap-3'
                    : otherActiveLinks.length <= 6
                    ? 'gap-2 sm:gap-2.5'
                    : 'gap-1.5 sm:gap-2'
                }`}
              >
                {otherActiveLinks.map((link, index) => {
                  const colSpan = getTileColSpan(index, otherActiveLinks.length);
                  const sizeVariant = getTileSizeVariant(otherActiveLinks.length);

                  return (
                    <div key={link.id} className={colSpan}>
                      <PublicLinkCard
                        link={link}
                        businessName={business.name}
                        onLinkClick={onLinkClick}
                        sizeVariant={sizeVariant}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Sponsors Section: Deep Chocolate Panel (As in Reference UI) */}
          {effectiveFooterSponsors.length > 0 && (
            <div className="mt-6 rounded-[24px] bg-[#3A2115] p-3.5 sm:p-4 text-[#FBF5EA] shadow-md border border-[#4A2A1A]">
              <div className="flex items-center justify-between px-1 mb-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#F3E6D3] tracking-wide">
                  <span className="text-sm">📢</span>
                  <span>Our Sponsors</span>
                </div>
                <span className="text-[10px] text-[#C8924A] font-semibold tracking-wide">
                  Official Partners &rsaquo;
                </span>
              </div>
              <div className="space-y-2">
                {effectiveFooterSponsors.map((sponsor) => (
                  <SponsorCard
                    key={sponsor.id}
                    sponsor={sponsor}
                    onSponsorClick={onSponsorClick}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Permanent Business URL Pill at Bottom */}
          <div className="mt-7 pt-4 pb-2 border-t border-[#E4D2BB] flex flex-col items-center gap-1.5 text-center">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 font-mono text-[10.5px] sm:text-[11px] text-[#705B4D] hover:text-[#2B1A12] bg-[#F7EEDF] hover:bg-[#F3E6D3] px-3.5 py-1.5 rounded-xl border border-[#E4D2BB] transition-all cursor-pointer max-w-full shadow-2xs group"
              title="Click to copy permanent profile link"
            >
              <LinkIcon className="w-3 h-3 text-[#C8924A] shrink-0" />
              <span className="text-[#705B4D] shrink-0">Permanent:</span>
              <span className="text-[#2B1A12] font-bold truncate">
                {getPublicBusinessUrl(business.slug).replace(/^https?:\/\//, '')}
              </span>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-[#16A34A] shrink-0 ml-0.5" />
              ) : (
                <Copy className="w-3 h-3 text-[#705B4D] group-hover:text-[#2B1A12] shrink-0 ml-0.5" />
              )}
            </button>
            <span className="text-[10.5px] text-[#705B4D]/80 font-medium">
              Smart Stand by Prestige Intelligence
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
