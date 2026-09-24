import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { analyticsService } from '@/services/analyticsService';
import { AnalyticsSummary, AnalyticsFilter } from '@/types';
import { AnalyticsChart } from '@/components/business/AnalyticsChart';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { getInternalBusinessPath } from '@/lib/utils';
import { BarChart3, ExternalLink } from 'lucide-react';
import { Button } from '@/components/common/Button';

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
      <div className="py-12 text-center text-slate-500">
        Please set up your business profile to view your analytics.
      </div>
    );
  }

  const hasActivity = summary && (summary.totalVisits > 0 || summary.totalClicks > 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Real Traffic & Analytics</h1>
          <p className="text-xs text-slate-500">
            Real recorded interactions without fake numbers. Track page visits and specific link conversions.
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
        <LoadingSpinner label="Compiling real analytics data..." />
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
