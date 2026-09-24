import React, { useState, useEffect } from 'react';
import { businessService } from '@/services/businessService';
import { Business } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { copyToClipboard, getPublicBusinessUrl, getInternalBusinessPath } from '@/lib/utils';
import { Search, Building2, ExternalLink, Copy, Check, ShieldCheck } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadBusinesses = async () => {
    try {
      setIsLoading(true);
      const data = await businessService.getAllBusinesses();
      setBusinesses(data);
    } catch (err) {
      console.error('Failed to load businesses for admin:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBusinesses();
  }, []);

  const handleCopyUrl = async (slug: string, id: string) => {
    const url = getPublicBusinessUrl(slug);
    const ok = await copyToClipboard(url);
    if (ok) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleToggleStatus = async (business: Business) => {
    try {
      await businessService.updateBusiness(business.id, {
        is_active: !business.is_active,
      });
      setBusinesses((prev) =>
        prev.map((b) => (b.id === business.id ? { ...b, is_active: !b.is_active } : b))
      );
    } catch (err) {
      console.error('Failed to update business status:', err);
    }
  };

  const filtered = businesses.filter((b) => {
    const q = searchQuery.toLowerCase();
    return (
      b.name.toLowerCase().includes(q) ||
      b.slug.toLowerCase().includes(q) ||
      (b.city && b.city.toLowerCase().includes(q)) ||
      (b.category && b.category.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Registered Businesses Directory
          </h1>
          <p className="text-xs text-slate-500">
            Monitor all active and inactive business profiles and their permanent URLs.
          </p>
        </div>

        <div className="w-full sm:w-72">
          <Input
            placeholder="Search by name, slug, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftAddon={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500">Total Registered</span>
          <div className="mt-1 text-2xl font-bold text-slate-900">{businesses.length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500">Active Profiles</span>
          <div className="mt-1 text-2xl font-bold text-emerald-600">
            {businesses.filter((b) => b.is_active).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500">Inactive / Suspended</span>
          <div className="mt-1 text-2xl font-bold text-slate-400">
            {businesses.filter((b) => !b.is_active).length}
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Businesses ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <LoadingSpinner label="Loading business records..." />
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No matching business profiles found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Business</th>
                    <th className="py-3 px-4">Permanent URL / Slug</th>
                    <th className="py-3 px-4">Category & City</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {b.logo_url ? (
                            <img
                              src={b.logo_url}
                              alt=""
                              className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold shrink-0">
                              {b.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <span className="font-semibold text-slate-900 block truncate max-w-xs">
                              {b.name}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              ID: {b.id.substring(0, 8)}...
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sky-700 font-semibold bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                            /b/{b.slug}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyUrl(b.slug, b.id)}
                            className="p-1 rounded text-slate-400 hover:text-sky-600 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Copy full permanent URL"
                          >
                            {copiedId === b.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        <div>{b.category || '—'}</div>
                        <div className="text-[11px] text-slate-400">{b.city || '—'}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(b)}
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                            b.is_active
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {b.is_active ? 'Active' : 'Suspended'}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <a
                          href={getInternalBusinessPath(b.slug)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-sky-700 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors"
                        >
                          <span>Open</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
