import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { businessService } from '@/services/businessService';
import { linkService } from '@/services/linkService';
import { sponsorService } from '@/services/sponsorService';
import { analyticsService } from '@/services/analyticsService';
import { Business, BusinessLink, Sponsor, LinkType } from '@/types';
import { PublicProfileView } from '@/components/public/PublicProfileView';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Building2, Home, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { buildUpiUri, extractUpiId, isUpiLink } from '@/lib/utils';
import { UpiPaymentModal } from '@/components/public/UpiPaymentModal';

export const PublicProfilePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const [business, setBusiness] = useState<Business | null>(null);
  const [links, setLinks] = useState<BusinessLink[]>([]);
  const [headerSponsors, setHeaderSponsors] = useState<Sponsor[]>([]);
  const [footerSponsors, setFooterSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isSuspended, setIsSuspended] = useState(false);
  const [paymentModalData, setPaymentModalData] = useState<{
    upiId: string;
    upiUri: string;
    businessName: string;
  } | null>(null);

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

        // 1. First fetch active business directly in 1 roundtrip
        const biz = await businessService.getBusinessBySlug(slug);

        if (biz) {
          setBusiness(biz);
          document.title = `${biz.name} — Smart Stand`;

          // Fetch active links and active sponsors in parallel
          const [bizLinks, bizSponsors] = await Promise.all([
            linkService.getLinksByBusinessId(biz.id, true),
            sponsorService.getBusinessSponsors(biz.id),
          ]);

          setLinks(bizLinks);

          // Filter active assignments with active sponsor objects, excluding self-sponsorship
          const activeBizSponsors = bizSponsors.filter((bs) => {
            if (bs.is_active === false || !bs.sponsor || bs.sponsor.is_active === false) {
              return false;
            }
            const normBiz = biz.name.trim().toLowerCase().replace(/[^a-z0-9]/g, '').replace(/aa/g, 'a');
            const normSp = bs.sponsor.name.trim().toLowerCase().replace(/[^a-z0-9]/g, '').replace(/aa/g, 'a');
            return normBiz !== normSp;
          });

          // Current Rule: One business can have ONLY ONE active sponsor at this time
          const singleActive = activeBizSponsors[0];

          const headerList =
            singleActive &&
            (singleActive.placement === 'header' ||
              singleActive.placement === 'both' ||
              !singleActive.placement)
              ? [singleActive.sponsor!]
              : [];

          const footerList =
            singleActive &&
            (singleActive.placement === 'footer' ||
              singleActive.placement === 'both' ||
              !singleActive.placement)
              ? [singleActive.sponsor!]
              : [];

          setHeaderSponsors(headerList);
          setFooterSponsors(footerList);

          // Non-blocking deferred analytics tracking (never blocks profile rendering)
          setTimeout(() => {
            analyticsService.trackVisit(biz.id);
          }, 150);
          return;
        }

        // 2. If not found as active, check minimal status via secure RPC (distinguishes inactive vs 404)
        const status = await businessService.getPublicBusinessStatus(slug);
        if (status && !status.is_active) {
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
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error('Failed to load public profile:', err);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadPublicProfile();
  }, [slug]);

  const handleLinkClick = async (linkId: string, url: string, linkType?: LinkType) => {
    if (business) {
      analyticsService.trackLinkClick(business.id, linkId);
    }
    if (!url || url === '#') return;

    // Detect UPI Payment flow
    const isUpi = isUpiLink(linkType, url);

    if (isUpi) {
      const cleanUpi = extractUpiId(url);
      if (!cleanUpi) return;

      const upiUri = buildUpiUri(cleanUpi, business?.name);
      if (!upiUri) return;

      // The native <a href={resolvedHref}> in PublicLinkCard triggers the standard UPI intent directly on mobile.
      // We do not do window.location.href = upiUri here to prevent duplicate intent requests.

      // Open the UPI Payment Sheet/Modal with pre-filled Businessman UPI ID & dynamic fallback QR
      setPaymentModalData({
        upiId: cleanUpi,
        upiUri,
        businessName: business?.name || 'Business',
      });
      return;
    }

    // Call / tel protocol (handled natively by <a href="tel:...">)
    if (linkType === 'call' || url.startsWith('tel:')) {
      return;
    }

    // Email / mailto protocol (handled natively by <a href="mailto:...">)
    if (linkType === 'email' || url.startsWith('mailto:')) {
      return;
    }

    // Safely open standard external link
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
      <div className="min-h-screen bg-[#F5F2EB] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#FAF8F5] rounded-3xl border border-[#E8E1D5] p-10 flex flex-col items-center justify-center text-center shadow-sm">
          <LoadingSpinner size="lg" label="Loading business profile..." />
        </div>
      </div>
    );
  }

  if (isSuspended && business) {
    return (
      <div className="min-h-screen bg-[#F5F2EB] flex flex-col items-center justify-center p-4 sm:p-6 text-center text-[#1A120B]">
        <div className="max-w-md w-full bg-[#FAF8F5] rounded-3xl border border-[#E8E1D5] p-7 sm:p-8 flex flex-col items-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 border border-amber-200">
            <ShieldAlert className="w-8 h-8 stroke-[1.75]" />
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-amber-50 text-amber-700 border border-amber-200 mb-2.5">
            Profile Inactive
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#1A120B] tracking-tight leading-snug">
            This profile is currently unavailable.
          </h1>
          <p className="mt-2 text-xs text-[#5C493B] leading-relaxed max-w-xs">
            The business page for <strong className="text-[#1A120B]">{business.name}</strong> (<span className="font-mono text-[#8C531B]">/b/{business.slug}</span>) is temporarily inactive. If you are the owner, please check your dashboard or contact support.
          </p>
          <div className="mt-6 w-full flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/" className="w-full sm:w-auto">
              <Button variant="outline" size="md" icon={<Home className="w-4 h-4" />} className="w-full justify-center bg-white border-[#E8E1D5] text-[#1A120B] hover:bg-[#FAF0E6]">
                Return to Smart Stand
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !business) {
    return (
      <div className="min-h-screen bg-[#F5F2EB] flex flex-col items-center justify-center p-4 sm:p-6 text-center text-[#1A120B]">
        <div className="max-w-md w-full bg-[#FAF8F5] rounded-3xl border border-[#E8E1D5] p-7 sm:p-8 flex flex-col items-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-white text-[#8C7767] flex items-center justify-center mb-4 border border-[#E8E1D5]">
            <Building2 className="w-8 h-8 stroke-[1.75]" />
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-white text-[#8C7767] border border-[#E8E1D5] mb-2.5">
            Not Found
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#1A120B] tracking-tight leading-snug">
            Business Profile Not Found
          </h1>
          <p className="mt-2 text-xs text-[#5C493B] leading-relaxed max-w-xs">
            The public business page you are looking for does not exist or may have been updated. Please verify the URL and try again.
          </p>
          <div className="mt-6 w-full flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/" className="w-full sm:w-auto">
              <Button variant="primary" size="md" icon={<Home className="w-4 h-4" />} className="w-full justify-center">
                Explore Smart Stand
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <PublicProfileView
        business={business}
        links={links}
        sponsors={footerSponsors}
        headerSponsors={headerSponsors}
        footerSponsors={footerSponsors}
        onLinkClick={handleLinkClick}
        onSponsorClick={handleSponsorClick}
      />

      {/* Direct UPI Payment Modal with fallback QR & 1-tap app launch */}
      {paymentModalData && (
        <UpiPaymentModal
          isOpen={Boolean(paymentModalData)}
          onClose={() => setPaymentModalData(null)}
          upiId={paymentModalData.upiId}
          businessName={paymentModalData.businessName}
          upiUri={paymentModalData.upiUri}
        />
      )}
    </>
  );
};
