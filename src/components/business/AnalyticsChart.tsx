import React from 'react';
import { AnalyticsSummary, AnalyticsFilter } from '@/types';
import { LINK_TYPE_CONFIG } from './linkIcons';
import { ExternalLink, MousePointerClick, Users, TrendingUp, Calendar } from 'lucide-react';

interface AnalyticsChartProps {
  summary: AnalyticsSummary;
  filter: AnalyticsFilter['period'];
  onFilterChange: (period: AnalyticsFilter['period']) => void;
  isLoading?: boolean;
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  summary,
  filter,
  onFilterChange,
  isLoading,
}) => {
  const { totalVisits, totalClicks, clicksByLink, clicksByType, dailyActivity } = summary;

  // Max value for chart scaling
  const maxDayValue = Math.max(
    ...dailyActivity.map((d) => Math.max(d.visits, d.clicks)),
    5
  );

  const ctr = totalVisits > 0 ? ((totalClicks / totalVisits) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6">
      {/* Filter Bar & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h3 className="text-base font-semibold text-slate-800">Engagement & Activity</h3>
          <p className="text-xs text-slate-500">Real recorded visits and verified link clicks.</p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start sm:self-auto">
          {(
            [
              { id: 'today', label: 'Today' },
              { id: '7days', label: '7 Days' },
              { id: '30days', label: '30 Days' },
              { id: 'all', label: 'All Time' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onFilterChange(item.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                filter === item.id
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Visits */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Profile Visits
            </span>
            <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{totalVisits}</span>
            <span className="text-xs text-slate-400">total views</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Recorded when customers open your permanent public URL.
          </p>
        </div>

        {/* Total Link Clicks */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Link Clicks
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{totalClicks}</span>
            <span className="text-xs text-slate-400">total interactions</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Total number of customer clicks across all active links.
          </p>
        </div>

        {/* Click Through Rate */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Click-Through Rate
            </span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{ctr}%</span>
            <span className="text-xs text-slate-400">interaction rate</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Ratio of link clicks to unique profile visits.
          </p>
        </div>
      </div>

      {/* Daily Timeline Activity Chart */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="text-sm font-semibold text-slate-800">Activity Timeline</h4>
            <p className="text-xs text-slate-500">Daily breakdown of profile visits vs. link clicks</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-sky-500 inline-block" />
              <span className="text-slate-600">Visits</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-emerald-500 inline-block" />
              <span className="text-slate-600">Clicks</span>
            </div>
          </div>
        </div>

        {dailyActivity.length === 0 ? (
          <div className="h-44 flex flex-col items-center justify-center text-slate-400 text-xs">
            <Calendar className="w-8 h-8 mb-2 opacity-50" />
            No activity recorded in this period.
          </div>
        ) : (
          <div className="h-48 flex items-end gap-2 sm:gap-3 pt-6 pb-2 border-b border-slate-100 overflow-x-auto">
            {dailyActivity.map((day) => {
              const visitHeightPct = Math.round((day.visits / maxDayValue) * 100);
              const clickHeightPct = Math.round((day.clicks / maxDayValue) * 100);

              return (
                <div key={day.date} className="flex-1 min-w-[36px] flex flex-col items-center group relative">
                  {/* Tooltip */}
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] rounded px-2 py-1 pointer-events-none z-10 whitespace-nowrap shadow-md">
                    {day.formattedDate}: {day.visits} visits, {day.clicks} clicks
                  </div>

                  {/* Bars */}
                  <div className="w-full flex items-end justify-center gap-1 h-36">
                    {/* Visits bar */}
                    <div
                      style={{ height: `${Math.max(visitHeightPct, 4)}%` }}
                      className={`w-2.5 sm:w-3.5 rounded-t-sm transition-all ${
                        day.visits > 0 ? 'bg-sky-500 group-hover:bg-sky-600' : 'bg-slate-200/50'
                      }`}
                    />
                    {/* Clicks bar */}
                    <div
                      style={{ height: `${Math.max(clickHeightPct, 4)}%` }}
                      className={`w-2.5 sm:w-3.5 rounded-t-sm transition-all ${
                        day.clicks > 0 ? 'bg-emerald-500 group-hover:bg-emerald-600' : 'bg-slate-200/50'
                      }`}
                    />
                  </div>

                  {/* Day label */}
                  <span className="mt-2 text-[10px] text-slate-400 truncate max-w-full font-medium">
                    {day.formattedDate.split(' ')[1] || day.formattedDate}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Breakdown by Individual Link */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <h4 className="text-sm font-semibold text-slate-800 mb-1">Clicks by Individual Link</h4>
          <p className="text-xs text-slate-500 mb-4">Track which specific links your visitors are clicking</p>

          {clicksByLink.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No link clicks recorded yet.
            </div>
          ) : (
            <div className="space-y-3">
              {clicksByLink.map((item) => {
                const cfg = LINK_TYPE_CONFIG[item.link_type] || LINK_TYPE_CONFIG.custom;
                const percentage =
                  totalClicks > 0 ? Math.round((item.count / totalClicks) * 100) : 0;

                return (
                  <div key={item.linkId} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <span className={cfg.colorClass}>{cfg.icon({ className: 'w-3.5 h-3.5' })}</span>
                        <span className="font-medium text-slate-800 truncate">{item.label}</span>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-sky-600 transition-colors shrink-0"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 font-medium">
                        <span className="text-slate-900 font-bold">{item.count} clicks</span>
                        <span className="text-slate-400 text-[11px] w-9 text-right">
                          {percentage}%
                        </span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-sky-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Link Categories Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <h4 className="text-sm font-semibold text-slate-800 mb-1">Clicks by Category</h4>
          <p className="text-xs text-slate-500 mb-4">Traffic distribution across link types</p>

          {clicksByType.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No categories clicked yet.
            </div>
          ) : (
            <div className="space-y-2.5">
              {clicksByType.map((item) => {
                const cfg = LINK_TYPE_CONFIG[item.type as keyof typeof LINK_TYPE_CONFIG] || LINK_TYPE_CONFIG.custom;
                return (
                  <div
                    key={item.type}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className={cfg.colorClass}>{cfg.icon({ className: 'w-4 h-4' })}</span>
                      <span className="font-medium text-slate-700">{cfg.label}</span>
                    </div>
                    <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {item.count}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
