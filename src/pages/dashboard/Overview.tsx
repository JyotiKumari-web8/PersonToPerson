import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { linkService } from '@/services/linkService';
import { analyticsService } from '@/services/analyticsService';
import { BusinessLink, AnalyticsSummary, BusinessSubscriptionDetails } from '@/types';
import { planService } from '@/services/planService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { LINK_TYPE_CONFIG } from '@/components/business/linkIcons';
import {
  Users,
  MousePointerClick,
  Link2,
  TrendingUp,
  Plus,
  Building2,
  ArrowRight,
  ExternalLink,
  BarChart3,
  QrCode,
  Settings as SettingsIcon,
  Award,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Overview: React.FC = () => {
  const { business, isAdmin, isPlatformOwner } = useAuth();
  const [links, setLinks] = useState<BusinessLink[]>([]);
  const [subscription, setSubscription] = useState<BusinessSubscriptionDetails | null>(null);
  const [summary, setSummary] = useState<AnalyticsSummary>({
    totalVisits: 0,
    totalClicks: 0,
    clicksByLink: [],
    clicksByType: [],
    dailyActivity: [],
  });
  const [, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!business) return;
      try {
        setIsLoading(true);
        const [linksData, analyticsData, subData] = await Promise.all([
          linkService.getLinksByBusinessId(business.id),
          analyticsService.getAnalyticsSummary(business.id, '7days'),
          planService.getSubscriptionByBusinessId(business.id),
        ]);
        setLinks(linksData);
        setSummary(analyticsData);
        setSubscription(subData);
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
      <div className="text-center py-20 bg-[#241810] rounded-2xl border border-[#3D2B1F] shadow-lg p-8 max-w-lg mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-amber-950/40 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-800/60">
          <Building2 className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-[#FBF9F5] tracking-tight">No Business Profile Found</h3>
        <p className="text-xs text-[#9E8E81] max-w-sm mx-auto mt-1 mb-5 leading-relaxed">
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
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#FBF9F5] tracking-tight">
              Welcome back, {business.name}
            </h1>
            {subscription && (
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase border ${
                  subscription.is_free
                    ? 'bg-[#2E1F15] text-[#D49B5B] border-[#D49B5B]/30'
                    : 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60'
                }`}
              >
                {subscription.plan_name}
              </span>
            )}
          </div>
          <p className="text-xs text-[#9E8E81] mt-0.5">
            Live overview of your permanent business profile and link performance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/dashboard/links">
            <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
              Add Link
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#241810] p-5 rounded-2xl border border-[#3D2B1F] shadow-sm hover:border-[#D49B5B]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#9E8E81] tracking-tight">Profile Visits</span>
            <span className="p-2 rounded-xl bg-[#2E1F15] text-[#D49B5B] border border-[#3D2B1F]">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-bold text-[#FBF9F5] tracking-tight">{summary.totalVisits}</div>
          <span className="text-[11px] text-[#9E8E81] font-medium">Past 7 days</span>
        </div>

        <div className="bg-[#241810] p-5 rounded-2xl border border-[#3D2B1F] shadow-sm hover:border-[#D49B5B]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#9E8E81] tracking-tight">Link Clicks</span>
            <span className="p-2 rounded-xl bg-emerald-950/50 text-[#22C55E] border border-emerald-800/60">
              <MousePointerClick className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-bold text-[#FBF9F5] tracking-tight">{summary.totalClicks}</div>
          <span className="text-[11px] text-[#9E8E81] font-medium">Total customer clicks</span>
        </div>

        <div className="bg-[#241810] p-5 rounded-2xl border border-[#3D2B1F] shadow-sm hover:border-[#D49B5B]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#9E8E81] tracking-tight">Active Links</span>
            <span className="p-2 rounded-xl bg-[#2E1F15] text-[#D49B5B] border border-[#3D2B1F]">
              <Link2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-bold text-[#FBF9F5] tracking-tight flex items-baseline gap-1.5">
            <span>{activeLinksCount}</span>
            {subscription && (
              <span className="text-xs font-normal text-[#9E8E81] font-mono">
                / {subscription.max_links}
              </span>
            )}
          </div>
          <span className="text-[11px] text-[#9E8E81] font-medium">
            {subscription ? `${subscription.max_links - activeLinksCount} available` : `of ${links.length} total links`}
          </span>
        </div>

        <div className="bg-[#241810] p-5 rounded-2xl border border-[#3D2B1F] shadow-sm hover:border-[#D49B5B]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#9E8E81] tracking-tight">Click Rate (CTR)</span>
            <span className="p-2 rounded-xl bg-[#2E1F15] text-[#D49B5B] border border-[#3D2B1F]">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-bold text-[#FBF9F5] tracking-tight">{ctr}%</div>
          <span className="text-[11px] text-[#9E8E81] font-medium">Interaction ratio</span>
        </div>
      </div>

      {/* Main Grid: Top Links & Management Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent/Top Links */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Top Performing Links</CardTitle>
                <p className="text-xs text-[#9E8E81] mt-0.5">Links with highest customer interactions</p>
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
                  <p className="text-xs text-[#9E8E81] mb-3.5 leading-relaxed">
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
                        className="flex items-center justify-between p-3.5 rounded-xl border border-[#3D2B1F] hover:border-[#D49B5B]/50 transition-all bg-[#1B120B] hover:bg-[#2E1F15] shadow-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0 pr-3">
                          <div className={`p-2.5 rounded-xl border ${cfg.badgeBg} shrink-0 shadow-xs`}>
                            {cfg.icon({ className: 'w-4 h-4' })}
                          </div>
                          <div className="min-w-0">
                            <span className="block text-xs font-bold text-[#FBF9F5] truncate tracking-tight">
                              {link.label}
                            </span>
                            <span className="text-[11px] text-[#9E8E81] font-mono truncate block max-w-xs sm:max-w-sm mt-0.5">
                              {link.url}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <span className="block text-xs font-bold text-[#FBF9F5]">
                              {clicks} {clicks === 1 ? 'click' : 'clicks'}
                            </span>
                            <span className="text-[10px] font-semibold text-[#9E8E81]">
                              {link.is_active ? 'Active' : 'Hidden'}
                            </span>
                          </div>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-[#9E8E81] hover:text-[#D49B5B] rounded-lg hover:bg-[#2E1F15] transition-colors"
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

        {/* Right Col: Quick Access Panel */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                to="/dashboard/links"
                className="flex items-center justify-between p-3 rounded-xl bg-[#1B120B] hover:bg-[#2E1F15] border border-[#3D2B1F] hover:border-[#D49B5B]/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#2E1F15] text-[#D49B5B] group-hover:bg-[#3B281B]">
                    <Link2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#FBF9F5]">Manage Links</span>
                    <span className="text-[11px] text-[#9E8E81]">{links.length} total links configured</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#9E8E81] group-hover:text-[#D49B5B] transition-colors" />
              </Link>

              <Link
                to="/dashboard/profile"
                className="flex items-center justify-between p-3 rounded-xl bg-[#1B120B] hover:bg-[#2E1F15] border border-[#3D2B1F] hover:border-[#D49B5B]/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#2E1F15] text-[#D49B5B] group-hover:bg-[#3B281B]">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#FBF9F5]">Business Profile</span>
                    <span className="text-[11px] text-[#9E8E81]">Logo, contact, and address</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#9E8E81] group-hover:text-[#D49B5B] transition-colors" />
              </Link>

              <Link
                to="/dashboard/analytics"
                className="flex items-center justify-between p-3 rounded-xl bg-[#1B120B] hover:bg-[#2E1F15] border border-[#3D2B1F] hover:border-[#D49B5B]/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#2E1F15] text-[#D49B5B] group-hover:bg-[#3B281B]">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#FBF9F5]">Analytics</span>
                    <span className="text-[11px] text-[#9E8E81]">Visits & click breakdown</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#9E8E81] group-hover:text-[#D49B5B] transition-colors" />
              </Link>

              <Link
                to="/dashboard/qr-code"
                className="flex items-center justify-between p-3 rounded-xl bg-[#1B120B] hover:bg-[#2E1F15] border border-[#3D2B1F] hover:border-[#D49B5B]/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#2E1F15] text-[#D49B5B] group-hover:bg-[#3B281B]">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#FBF9F5]">QR Code Center</span>
                    <span className="text-[11px] text-[#9E8E81]">Download printable SVG/PNG</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#9E8E81] group-hover:text-[#D49B5B] transition-colors" />
              </Link>

              <Link
                to="/dashboard/settings"
                className="flex items-center justify-between p-3 rounded-xl bg-[#1B120B] hover:bg-[#2E1F15] border border-[#3D2B1F] hover:border-[#D49B5B]/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#2E1F15] text-[#D49B5B] group-hover:bg-[#3B281B]">
                    <SettingsIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#FBF9F5]">Settings</span>
                    <span className="text-[11px] text-[#9E8E81]">Account & security</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#9E8E81] group-hover:text-[#D49B5B] transition-colors" />
              </Link>

              {(isAdmin || isPlatformOwner) && (
                <Link
                  to="/admin/sponsors"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#1B120B] hover:bg-[#2E1F15] border border-[#3D2B1F] hover:border-[#D49B5B]/40 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#2E1F15] text-[#D49B5B] group-hover:bg-[#3B281B]">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-[#FBF9F5]">Sponsors</span>
                      <span className="text-[11px] text-[#9E8E81]">Platform sponsor manager</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#9E8E81] group-hover:text-[#D49B5B] transition-colors" />
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
