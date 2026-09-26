import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { linkService } from '@/services/linkService';
import { analyticsService } from '@/services/analyticsService';
import { BusinessLink, AnalyticsSummary } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { QRCodeCard } from '@/components/business/QRCodeCard';
import { LINK_TYPE_CONFIG } from '@/components/business/linkIcons';
import { getInternalBusinessPath } from '@/lib/utils';
import {
  Users,
  MousePointerClick,
  Link2,
  TrendingUp,
  Plus,
  ExternalLink,
  Building2,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Overview: React.FC = () => {
  const { business } = useAuth();
  const [links, setLinks] = useState<BusinessLink[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary>({
    totalVisits: 0,
    totalClicks: 0,
    clicksByLink: [],
    clicksByType: [],
    dailyActivity: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!business) return;
      try {
        setIsLoading(true);
        const [linksData, analyticsData] = await Promise.all([
          linkService.getLinksByBusinessId(business.id),
          analyticsService.getAnalyticsSummary(business.id, '7days'),
        ]);
        setLinks(linksData);
        setSummary(analyticsData);
      } catch (err) {
        console.error('Failed to load overview data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [business]);

  if (!business) {
    return (
      <div className="text-center py-20 bg-[#101D30] rounded-2xl border border-[#20344D] shadow-lg p-8 max-w-lg mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-amber-950/40 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-800/60">
          <Building2 className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-[#F8FAFC] tracking-tight">No Business Profile Found</h3>
        <p className="text-xs text-[#94A3B8] max-w-sm mx-auto mt-1 mb-5 leading-relaxed">
          Please set up your business profile first to generate your permanent URL and customer page.
        </p>
        <Link to="/dashboard/profile">
          <Button variant="primary" size="md">Create Business Profile</Button>
        </Link>
      </div>
    );
  }

  const activeLinksCount = links.filter((l) => l.is_active).length;
  const ctr =
    summary.totalVisits > 0
      ? ((summary.totalClicks / summary.totalVisits) * 100).toFixed(1)
      : '0.0';

  return (
    <div className="space-y-6">
      {/* Welcome & Quick Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#F8FAFC] tracking-tight">
            Welcome back, {business.name}
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Here is a live summary of your permanent business profile and link performance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/dashboard/links">
            <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
              Add Link
            </Button>
          </Link>
          <a
            href={getInternalBusinessPath(business.slug)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" icon={<ExternalLink className="w-4 h-4" />}>
              Preview Page
            </Button>
          </a>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#101D30] p-5 rounded-2xl border border-[#20344D] shadow-sm hover:border-[#38BDF8]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#94A3B8] tracking-tight">Profile Visits</span>
            <span className="p-2 rounded-xl bg-[#14243A] text-[#38BDF8] border border-[#20344D]">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight">{summary.totalVisits}</div>
          <span className="text-[11px] text-[#94A3B8] font-medium">Past 7 days</span>
        </div>

        <div className="bg-[#101D30] p-5 rounded-2xl border border-[#20344D] shadow-sm hover:border-[#38BDF8]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#94A3B8] tracking-tight">Link Clicks</span>
            <span className="p-2 rounded-xl bg-emerald-950/50 text-[#22C55E] border border-emerald-800/60">
              <MousePointerClick className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight">{summary.totalClicks}</div>
          <span className="text-[11px] text-[#94A3B8] font-medium">Total customer clicks</span>
        </div>

        <div className="bg-[#101D30] p-5 rounded-2xl border border-[#20344D] shadow-sm hover:border-[#38BDF8]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#94A3B8] tracking-tight">Active Links</span>
            <span className="p-2 rounded-xl bg-[#14243A] text-[#38BDF8] border border-[#20344D]">
              <Link2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight">{activeLinksCount}</div>
          <span className="text-[11px] text-[#94A3B8] font-medium">of {links.length} total links</span>
        </div>

        <div className="bg-[#101D30] p-5 rounded-2xl border border-[#20344D] shadow-sm hover:border-[#38BDF8]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#94A3B8] tracking-tight">Click Rate</span>
            <span className="p-2 rounded-xl bg-[#14243A] text-[#38BDF8] border border-[#20344D]">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight">{ctr}%</div>
          <span className="text-[11px] text-[#94A3B8] font-medium">Interaction ratio</span>
        </div>
      </div>

      {/* Main Grid: QR & Top Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent/Top Links */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Top Performing Links</CardTitle>
                <p className="text-xs text-[#94A3B8] mt-0.5">Links with the highest customer interactions</p>
              </div>
              <Link to="/dashboard/links">
                <Button variant="ghost" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Manage All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {links.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-xs text-[#94A3B8] mb-3.5 leading-relaxed">
                    No links added yet. Add your first link to make your profile useful for customers.
                  </p>
                  <Link to="/dashboard/links">
                    <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
                      Create Your First Link
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {links.slice(0, 5).map((link) => {
                    const cfg = LINK_TYPE_CONFIG[link.link_type] || LINK_TYPE_CONFIG.custom;
                    const stat = summary.clicksByLink.find((s) => s.linkId === link.id);
                    const clicks = stat ? stat.count : 0;

                    return (
                      <div
                        key={link.id}
                        className="flex items-center justify-between p-3.5 rounded-xl border border-[#20344D] hover:border-[#38BDF8]/50 transition-all bg-[#0B1728] hover:bg-[#14243A] shadow-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0 pr-3">
                          <div className={`p-2.5 rounded-xl border ${cfg.badgeBg} shrink-0 shadow-xs`}>
                            {cfg.icon({ className: 'w-4 h-4' })}
                          </div>
                          <div className="min-w-0">
                            <span className="block text-xs font-bold text-[#F8FAFC] truncate tracking-tight">
                              {link.label}
                            </span>
                            <span className="text-[11px] text-[#94A3B8] font-mono truncate block max-w-xs sm:max-w-sm mt-0.5">
                              {link.url}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <span className="block text-xs font-bold text-[#F8FAFC]">
                              {clicks} {clicks === 1 ? 'click' : 'clicks'}
                            </span>
                            <span className="text-[10px] font-semibold text-[#94A3B8]">
                              {link.is_active ? 'Active' : 'Hidden'}
                            </span>
                          </div>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-[#94A3B8] hover:text-[#38BDF8] rounded-lg hover:bg-[#14243A] transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Permanent QR Card */}
        <div className="lg:col-span-1">
          <QRCodeCard slug={business.slug} businessName={business.name} size={180} />
        </div>
      </div>
    </div>
  );
};

