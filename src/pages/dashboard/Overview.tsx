import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { linkService } from '@/services/linkService';
import { analyticsService } from '@/services/analyticsService';
import { BusinessLink, AnalyticsSummary } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { QRCodeCard } from '@/components/business/QRCodeCard';
import { LINK_TYPE_CONFIG } from '@/components/business/linkIcons';
import { getPublicBusinessUrl, getInternalBusinessPath } from '@/lib/utils';
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
      <div className="text-center py-16">
        <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800">No Business Profile Found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
          Please set up your business profile first to generate your permanent URL.
        </p>
        <Link to="/dashboard/profile">
          <Button variant="primary">Create Business Profile</Button>
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
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Welcome back, {business.name}
          </h1>
          <p className="text-xs text-slate-500">
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
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Profile Visits</span>
            <span className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{summary.totalVisits}</div>
          <span className="text-[11px] text-slate-400">Past 7 days</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Link Clicks</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <MousePointerClick className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{summary.totalClicks}</div>
          <span className="text-[11px] text-slate-400">Total customer clicks</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Links</span>
            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <Link2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{activeLinksCount}</div>
          <span className="text-[11px] text-slate-400">of {links.length} total links</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Click Rate</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{ctr}%</div>
          <span className="text-[11px] text-slate-400">Interaction ratio</span>
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
                <p className="text-xs text-slate-500">Links with the highest customer interactions</p>
              </div>
              <Link to="/dashboard/links">
                <Button variant="ghost" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Manage All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {links.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-xs text-slate-500 mb-3">
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
                        className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors bg-slate-50/40"
                      >
                        <div className="flex items-center gap-3 min-w-0 pr-3">
                          <div className={`p-2 rounded-lg border ${cfg.badgeBg} shrink-0`}>
                            {cfg.icon({ className: 'w-4 h-4' })}
                          </div>
                          <div className="min-w-0">
                            <span className="block text-xs font-semibold text-slate-900 truncate">
                              {link.label}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono truncate block max-w-xs sm:max-w-sm">
                              {link.url}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <span className="block text-xs font-bold text-slate-800">
                              {clicks} {clicks === 1 ? 'click' : 'clicks'}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {link.is_active ? 'Active' : 'Hidden'}
                            </span>
                          </div>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-400 hover:text-sky-600 rounded-md hover:bg-white transition-colors"
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
