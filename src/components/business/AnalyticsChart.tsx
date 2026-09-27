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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#241810] p-4.5 rounded-2xl border border-[#3D2B1F] shadow-sm">
        <div>
          <h3 className="text-base font-bold text-[#FDFBF7] tracking-tight">Engagement & Activity</h3>
          <p className="text-xs text-[#BFA08A] mt-0.5">Recorded visits and link clicks.</p>
        </div>

        <div className="flex items-center gap-1 bg-[#1B120B] p-1 rounded-xl self-start sm:self-auto border border-[#3D2B1F]">
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
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                filter === item.id
                  ? 'bg-[#2E1F15] text-[#D49B5B] shadow-xs font-bold border border-[#3D2B1F]'
                  : 'text-[#BFA08A] hover:text-[#FDFBF7]'
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
        <div className="bg-[#241810] p-5 rounded-2xl border border-[#3D2B1F] shadow-sm hover:border-[#D49B5B]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#BFA08A] uppercase tracking-wider">
              Profile Visits
            </span>
            <div className="p-2.5 rounded-xl bg-[#2E1F15] text-[#D49B5B] border border-[#3D2B1F]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#FDFBF7] tracking-tight">{totalVisits}</span>
            <span className="text-xs text-[#BFA08A] font-medium">total views</span>
          </div>
          <p className="mt-1 text-[11px] text-[#BFA08A] leading-normal">
            Recorded when customers open your permanent public URL.
          </p>
        </div>

        {/* Total Link Clicks */}
        <div className="bg-[#241810] p-5 rounded-2xl border border-[#3D2B1F] shadow-sm hover:border-[#D49B5B]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#BFA08A] uppercase tracking-wider">
              Link Clicks
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-950/50 text-[#22C55E] border border-emerald-800/60">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#FDFBF7] tracking-tight">{totalClicks}</span>
            <span className="text-xs text-[#BFA08A] font-medium">total interactions</span>
          </div>
          <p className="mt-1 text-[11px] text-[#BFA08A] leading-normal">
            Total number of customer clicks across all active links.
          </p>
        </div>

        {/* Click Through Rate */}
        <div className="bg-[#241810] p-5 rounded-2xl border border-[#3D2B1F] shadow-sm hover:border-[#D49B5B]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#BFA08A] uppercase tracking-wider">
              Click-Through Rate
            </span>
            <div className="p-2.5 rounded-xl bg-[#2E1F15] text-[#D49B5B] border border-[#3D2B1F]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#FDFBF7] tracking-tight">{ctr}%</span>
            <span className="text-xs text-[#BFA08A] font-medium">interaction rate</span>
          </div>
          <p className="mt-1 text-[11px] text-[#BFA08A] leading-normal">
            Ratio of link clicks to unique profile visits.
          </p>
        </div>
      </div>

      {/* Daily Timeline Activity Chart */}
      <div className="bg-[#241810] p-6 rounded-2xl border border-[#3D2B1F] shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="text-sm font-bold text-[#FDFBF7] tracking-tight">Activity Timeline</h4>
            <p className="text-xs text-[#BFA08A] mt-0.5">Daily breakdown of profile visits vs. link clicks</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#D49B5B] inline-block" />
              <span className="text-[#BFA08A]">Visits</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#22C55E] inline-block" />
              <span className="text-[#BFA08A]">Clicks</span>
            </div>
          </div>
        </div>

        {dailyActivity.length === 0 ? (
          <div className="h-44 flex flex-col items-center justify-center text-[#BFA08A] text-xs">
            <Calendar className="w-8 h-8 mb-2 opacity-50" />
            No activity recorded in this period.
          </div>
        ) : (
          <div className="h-48 flex items-end gap-2 sm:gap-3 pt-6 pb-2 border-b border-[#3D2B1F] overflow-x-auto">
            {dailyActivity.map((day) => {
              const visitHeightPct = Math.round((day.visits / maxDayValue) * 100);
              const clickHeightPct = Math.round((day.clicks / maxDayValue) * 100);

              return (
                <div key={day.date} className="flex-1 min-w-[36px] flex flex-col items-center group relative">
                  {/* Tooltip */}
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-[#1B120B] text-[#FDFBF7] text-[10px] rounded-lg px-2.5 py-1.5 pointer-events-none z-10 whitespace-nowrap shadow-md border border-[#3D2B1F]">
                    {day.formattedDate}: {day.visits} visits, {day.clicks} clicks
                  </div>

                  {/* Bars */}
                  <div className="w-full flex items-end justify-center gap-1.5 h-36">
                    {/* Visits bar */}
                    <div
                      style={{ height: `${Math.max(visitHeightPct, 4)}%` }}
                      className={`w-2.5 sm:w-3.5 rounded-t-md transition-all ${
                        day.visits > 0 ? 'bg-[#D49B5B] group-hover:bg-[#E2AF74]' : 'bg-[#2E1F15]'
                      }`}
                    />
                    {/* Clicks bar */}
                    <div
                      style={{ height: `${Math.max(clickHeightPct, 4)}%` }}
                      className={`w-2.5 sm:w-3.5 rounded-t-md transition-all ${
                        day.clicks > 0 ? 'bg-[#22C55E] group-hover:bg-emerald-400' : 'bg-[#2E1F15]'
                      }`}
                    />
                  </div>

                  {/* Day label */}
                  <span className="mt-2 text-[10px] text-[#BFA08A] truncate max-w-full font-semibold">
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
        <div className="lg:col-span-2 bg-[#241810] rounded-2xl border border-[#3D2B1F] p-6 shadow-sm">
          <h4 className="text-sm font-bold text-[#FDFBF7] tracking-tight mb-1">Clicks by Individual Link</h4>
          <p className="text-xs text-[#BFA08A] mb-4">Track which specific links your visitors are clicking</p>

          {clicksByLink.length === 0 ? (
            <div className="py-8 text-center text-[#BFA08A] text-xs">
              No link clicks recorded yet.
            </div>
          ) : (
            <div className="space-y-3.5">
              {clicksByLink.map((item) => {
                const cfg = LINK_TYPE_CONFIG[item.link_type] || LINK_TYPE_CONFIG.custom;
                const percentage =
                  totalClicks > 0 ? Math.round((item.count / totalClicks) * 100) : 0;

                return (
                  <div key={item.linkId} className="space-y-1.5 p-3 rounded-xl bg-[#1B120B] border border-[#3D2B1F]">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <span className={cfg.colorClass}>{cfg.icon({ className: 'w-4 h-4' })}</span>
                        <span className="font-bold text-[#FDFBF7] truncate tracking-tight">{item.label}</span>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#BFA08A] hover:text-[#D49B5B] transition-colors shrink-0"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 font-medium">
                        <span className="text-[#FDFBF7] font-bold">{item.count} clicks</span>
                        <span className="text-[#BFA08A] text-[11px] font-semibold w-9 text-right">
                          {percentage}%
                        </span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-[#2E1F15] rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[#D49B5B] h-2 rounded-full transition-all duration-500"
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
        <div className="bg-[#241810] rounded-2xl border border-[#3D2B1F] p-6 shadow-sm">
          <h4 className="text-sm font-bold text-[#FDFBF7] tracking-tight mb-1">Clicks by Category</h4>
          <p className="text-xs text-[#BFA08A] mb-4">Traffic distribution across link types</p>

          {clicksByType.length === 0 ? (
            <div className="py-8 text-center text-[#BFA08A] text-xs">
              No categories clicked yet.
            </div>
          ) : (
            <div className="space-y-2.5">
              {clicksByType.map((item) => {
                const cfg = LINK_TYPE_CONFIG[item.type as keyof typeof LINK_TYPE_CONFIG] || LINK_TYPE_CONFIG.custom;
                return (
                  <div
                    key={item.type}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#1B120B] border border-[#3D2B1F] text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className={cfg.colorClass}>{cfg.icon({ className: 'w-4 h-4' })}</span>
                      <span className="font-semibold text-[#E6D7C8]">{cfg.label}</span>
                    </div>
                    <span className="font-bold text-[#D49B5B] bg-[#2E1F15] px-2.5 py-0.5 rounded-lg border border-[#3D2B1F] shadow-xs">
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

