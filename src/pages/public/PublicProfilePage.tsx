import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { businessService } from '@/services/businessService';
import { linkService } from '@/services/linkService';
import { sponsorService } from '@/services/sponsorService';
import { analyticsService } from '@/services/analyticsService';
import { Business, BusinessLink, Sponsor } from '@/types';
import { PublicProfileView } from '@/components/public/PublicProfileView';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Building2, Home, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/common/Button';

export const PublicProfilePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const [business, setBusiness] = useState<Business | null>(null);
  const [links, setLinks] = useState<BusinessLink[]>([]);
  const [headerSponsors, setHeaderSponsors] = useState<Sponsor[]>([]);
  const [footerSponsors, setFooterSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isSuspended, setIsSuspended] = useState(false);

  useEffect(() => {
    async function loadPublicProfile() {
      if (!slug) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setIsSuspended(false);
        setNotFound(false);

        // 1. Check minimal public status via secure RPC (active vs suspended vs nonexistent)
        const status = await businessService.getPublicBusinessStatus(slug);

        if (!status) {
          // Nonexistent business -> 404
          setNotFound(true);
          return;
        }

        if (!status.is_active) {
          // Suspended business -> show dedicated suspended screen without exposing sensitive fields
          setBusiness({
            id: status.id,
            name: status.name,
            slug: status.slug,
            is_active: false,
            user_id: '',
            created_at: '',
          });
          setIsSuspended(true);
          document.title = `${status.name} — Profile Unavailable`;
          return;
        }

        // 2. Active business -> query full RLS-protected business record
        const biz = await businessService.getBusinessBySlug(slug);

        if (!biz) {
          setNotFound(true);
          return;
        }

        setBusiness(biz);

        // Update document title for SEO
        document.title = `${biz.name} — PersonToPerson`;

        // Fetch active links and active sponsors in parallel
        const [bizLinks, bizSponsors] = await Promise.all([
          linkService.getLinksByBusinessId(biz.id, true),
          sponsorService.getBusinessSponsors(biz.id),
        ]);

        setLinks(bizLinks);

        // Filter active assignments with active sponsor objects
        const activeBizSponsors = bizSponsors.filter(
          (bs) => bs.is_active !== false && bs.sponsor && bs.sponsor.is_active !== false
        );

        const headerList = activeBizSponsors
          .filter((bs) => bs.placement === 'header' || bs.placement === 'both' || !bs.placement)
          .map((bs) => bs.sponsor!)
          .filter(Boolean);

        const footerList = activeBizSponsors
          .filter((bs) => bs.placement === 'footer' || bs.placement === 'both' || !bs.placement)
          .map((bs) => bs.sponsor!)
          .filter(Boolean);

        setHeaderSponsors(headerList);
        setFooterSponsors(footerList);

        // Record real visit analytics event (deduplicated per session)
        analyticsService.trackVisit(biz.id);
      } catch (err) {
        console.error('Failed to load public profile:', err);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadPublicProfile();
  }, [slug]);

  const handleLinkClick = async (linkId: string, url: string) => {
    if (business) {
      analyticsService.trackLinkClick(business.id, linkId);
    }
    // Safely open external link
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSponsorClick = async (sponsorId: string, url: string) => {
    if (business) {
      analyticsService.trackSponsorClick(business.id, sponsorId);
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07111F] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#101D30] rounded-3xl border border-[#20344D] p-10 flex flex-col items-center justify-center text-center">
          <LoadingSpinner size="lg" label="Loading business profile..." />
        </div>
      </div>
    );
  }

  if (isSuspended && business) {
    return (
      <div className="min-h-screen bg-[#07111F] flex flex-col items-center justify-center p-4 sm:p-6 text-center text-[#F8FAFC]">
        <div className="max-w-md w-full bg-[#101D30] rounded-3xl border border-[#20344D] p-7 sm:p-8 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-950/40 text-amber-400 flex items-center justify-center mb-4 border border-amber-800/40">
            <ShieldAlert className="w-8 h-8 stroke-[1.75]" />
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-amber-950/40 text-amber-300 border border-amber-800/40 mb-2.5">
            Profile Inactive
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#F8FAFC] tracking-tight leading-snug">
            This profile is currently unavailable.
          </h1>
          <p className="mt-2 text-xs text-[#94A3B8] leading-relaxed max-w-xs">
            The business page for <strong className="text-[#F8FAFC]">{business.name}</strong> (<span className="font-mono text-[#F8FAFC]">/b/{business.slug}</span>) is temporarily inactive. If you are the owner, please check your dashboard or contact support.
          </p>
          <div className="mt-6 w-full flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/" className="w-full sm:w-auto">
              <Button variant="outline" size="md" icon={<Home className="w-4 h-4" />} className="w-full justify-center bg-[#14243A] border-[#20344D] text-[#F8FAFC] hover:bg-[#101D30]">
                Return to PersonToPerson
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !business) {
    return (
      <div className="min-h-screen bg-[#07111F] flex flex-col items-center justify-center p-4 sm:p-6 text-center text-[#F8FAFC]">
        <div className="max-w-md w-full bg-[#101D30] rounded-3xl border border-[#20344D] p-7 sm:p-8 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-[#14243A] text-[#94A3B8] flex items-center justify-center mb-4 border border-[#20344D]">
            <Building2 className="w-8 h-8 stroke-[1.75]" />
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-[#14243A] text-[#94A3B8] border border-[#20344D] mb-2.5">
            Not Found
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#F8FAFC] tracking-tight leading-snug">
            Business Profile Not Found
          </h1>
          <p className="mt-2 text-xs text-[#94A3B8] leading-relaxed max-w-xs">
            The public business page you are looking for does not exist or may have been updated. Please verify the URL and try again.
          </p>
          <div className="mt-6 w-full flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/" className="w-full sm:w-auto">
              <Button variant="primary" size="md" icon={<Home className="w-4 h-4" />} className="w-full justify-center">
                Explore PersonToPerson
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PublicProfileView
      business={business}
      links={links}
      sponsors={footerSponsors}
      headerSponsors={headerSponsors}
      footerSponsors={footerSponsors}
      onLinkClick={handleLinkClick}
      onSponsorClick={handleSponsorClick}
    />
  );
};
