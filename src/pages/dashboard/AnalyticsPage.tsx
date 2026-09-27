import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { analyticsService } from '@/services/analyticsService';
import { AnalyticsSummary, AnalyticsFilter } from '@/types';
import { AnalyticsChart } from '@/components/business/AnalyticsChart';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { getInternalBusinessPath } from '@/lib/utils';
import { BarChart3, ExternalLink, Building2 } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Link } from 'react-router-dom';

export const AnalyticsPage: React.FC = () => {
  const { business } = useAuth();
  const [period, setPeriod] = useState<AnalyticsFilter['period']>('7days');
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      if (!business) return;
      try {
        setIsLoading(true);
        const data = await analyticsService.getAnalyticsSummary(business.id, period);
        setSummary(data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAnalytics();
  }, [business, period]);

  if (!business) {
    return (
      <div className="text-center py-20 bg-[#241810] rounded-2xl border border-[#3D2B1F] shadow-lg p-8 max-w-lg mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-amber-950/40 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-800/60">
          <Building2 className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-[#FDFBF7] tracking-tight">No Business Profile Found</h3>
        <p className="text-xs text-[#BFA08A] max-w-sm mx-auto mt-1 mb-5 leading-relaxed">
          Please set up your business profile to view your real analytics.
        </p>
        <Link to="/dashboard/profile">
          <Button variant="primary" size="md">Create Business Profile</Button>
        </Link>
      </div>
    );
  }

  const hasActivity = summary && (summary.totalVisits > 0 || summary.totalClicks > 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#FDFBF7] tracking-tight">Traffic & Analytics</h1>
          <p className="text-xs text-[#BFA08A] mt-0.5">
            Recorded interactions for your business. Track page visits and specific link clicks.
          </p>
        </div>

        <a
          href={getInternalBusinessPath(business.slug)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline" size="sm" icon={<ExternalLink className="w-4 h-4" />}>
            Open Public Profile
          </Button>
        </a>
      </div>

      {isLoading ? (
        <LoadingSpinner label="Compiling analytics data..." />
      ) : !hasActivity ? (
        <div className="space-y-6">
          <EmptyState
            icon={<BarChart3 className="w-6 h-6" />}
            title="No activity recorded yet"
            description="No activity yet. Analytics will appear when customers visit your public profile."
            action={
              <a
                href={getInternalBusinessPath(business.slug)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="primary" size="sm" icon={<ExternalLink className="w-4 h-4" />}>
                  Test Your Public Page
                </Button>
              </a>
            }
          />
          {summary && (
            <AnalyticsChart
              summary={summary}
              filter={period}
              onFilterChange={setPeriod}
              isLoading={isLoading}
            />
          )}
        </div>
      ) : (
        <AnalyticsChart
          summary={summary}
          filter={period}
          onFilterChange={setPeriod}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

