import React from 'react';
import { Business, BusinessLink, Sponsor } from '@/types';
import { PublicLinkCard } from './PublicLinkCard';
import { SponsorCard } from './SponsorCard';
import { Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';

interface PublicProfileViewProps {
  business: Business;
  links: BusinessLink[];
  sponsors: Sponsor[];
  onLinkClick: (linkId: string, url: string) => void;
  onSponsorClick: (sponsorId: string, url: string) => void;
}

export const PublicProfileView: React.FC<PublicProfileViewProps> = ({
  business,
  links,
  sponsors,
  onLinkClick,
  onSponsorClick,
}) => {
  const activeLinks = links.filter((l) => l.is_active);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-between pb-12 selection:bg-sky-100 selection:text-sky-800">
      {/* Centered Mobile Container */}
      <div className="w-full max-w-md mx-auto bg-white min-h-screen sm:min-h-0 sm:my-8 sm:rounded-3xl sm:border sm:border-slate-200/90 sm:shadow-md overflow-hidden flex flex-col">
        
        {/* Cover Image / Header Banner */}
        <div className="relative h-36 sm:h-40 w-full bg-linear-to-r from-sky-400 via-sky-500 to-blue-600">
          {business.cover_url && (
            <img
              src={business.cover_url}
              alt=""
              className="w-full h-full object-cover"
            />
          )}
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />
        </div>

        {/* Profile Info Section */}
        <div className="px-6 pb-6 text-center relative -mt-16 flex-1 flex flex-col">
          {/* Logo / Avatar */}
          <div className="inline-block relative mx-auto mb-3">
            {business.logo_url ? (
              <img
                src={business.logo_url}
                alt={business.name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md bg-white mx-auto"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-bold text-3xl border-4 border-white shadow-md mx-auto">
                {business.name.charAt(0)}
              </div>
            )}
            <div
              className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-xs"
              title="Verified Permanent Business URL"
            >
              <CheckCircle2 className="w-5 h-5 text-sky-500 fill-sky-50" />
            </div>
          </div>

          {/* Business Name */}
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
            {business.name}
          </h1>

          {/* Category & City Pills */}
          {(business.category || business.city) && (
            <div className="flex items-center justify-center gap-1.5 flex-wrap mt-1.5">
              {business.category && (
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                  {business.category}
                </span>
              )}
              {business.city && (
                <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {business.city}
                </span>
              )}
            </div>
          )}

          {/* Short Description */}
          {business.description && (
            <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
              {business.description}
            </p>
          )}

          {/* Quick Contact Bar */}
          {(business.phone || business.email || business.address) && (
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-3">
              {business.phone && (
                <a
                  href={`tel:${business.phone}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-700 bg-slate-100 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-200 border border-slate-200 transition-colors"
                  title="Call business directly"
                >
                  <Phone className="w-3.5 h-3.5 text-sky-600" />
                  <span>Call</span>
                </a>
              )}
              {business.email && (
                <a
                  href={`mailto:${business.email}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-700 bg-slate-100 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-200 border border-slate-200 transition-colors"
                  title="Send email"
                >
                  <Mail className="w-3.5 h-3.5 text-sky-600" />
                  <span>Email</span>
                </a>
              )}
              {business.address && (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(
                    `${business.name} ${business.address} ${business.city || ''}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-700 bg-slate-100 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-200 border border-slate-200 transition-colors"
                  title="View on Google Maps"
                >
                  <MapPin className="w-3.5 h-3.5 text-sky-600" />
                  <span>Directions</span>
                </a>
              )}
            </div>
          )}

          {/* Active Links Container */}
          <div className="mt-6 flex-1 flex flex-col space-y-3">
            {activeLinks.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
                <p className="text-xs text-slate-500">
                  No active links configured right now. Please check back soon!
                </p>
              </div>
            ) : (
              activeLinks.map((link) => (
                <PublicLinkCard
                  key={link.id}
                  link={link}
                  onLinkClick={onLinkClick}
                />
              ))
            )}
          </div>

          {/* Sponsors Section (ONLY rendered if active sponsor is configured) */}
          {sponsors && sponsors.length > 0 && (
            <div className="space-y-2">
              {sponsors.map((sponsor) => (
                <SponsorCard
                  key={sponsor.id}
                  sponsor={sponsor}
                  onSponsorClick={onSponsorClick}
                />
              ))}
            </div>
          )}

          {/* Footer Branding */}
          <div className="mt-8 pt-4 border-t border-slate-100 text-center">
            <span className="text-[11px] font-medium text-slate-400">
              PersonToPerson • Permanent Public Business Profile
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
