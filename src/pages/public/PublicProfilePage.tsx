import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { businessService } from '@/services/businessService';
import { linkService } from '@/services/linkService';
import { sponsorService } from '@/services/sponsorService';
import { analyticsService } from '@/services/analyticsService';
import { Business, BusinessLink, Sponsor } from '@/types';
import { PublicProfileView } from '@/components/public/PublicProfileView';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Building2, Home } from 'lucide-react';
import { Button } from '@/components/common/Button';

export const PublicProfilePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const [business, setBusiness] = useState<Business | null>(null);
  const [links, setLinks] = useState<BusinessLink[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadPublicProfile() {
      if (!slug) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
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
        setSponsors(bizSponsors.map((bs) => bs.sponsor).filter(Boolean) as Sponsor[]);

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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <LoadingSpinner size="lg" label="Loading business profile..." />
      </div>
    );
  }

  if (notFound || !business) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
          <Building2 className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">Business Profile Not Found</h1>
        <p className="mt-2 text-xs text-slate-500 max-w-sm">
          The public page you are looking for does not exist or may have been suspended. Please check the URL and try again.
        </p>
        <Link to="/" className="mt-6">
          <Button variant="primary" size="sm" icon={<Home className="w-4 h-4" />}>
            Back to PersonToPerson
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <PublicProfileView
      business={business}
      links={links}
      sponsors={sponsors}
      onLinkClick={handleLinkClick}
      onSponsorClick={handleSponsorClick}
    />
  );
};
