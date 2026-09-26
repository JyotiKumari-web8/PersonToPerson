import React, { useState, useEffect } from 'react';
import { businessService } from '@/services/businessService';
import { Business } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { Alert } from '@/components/common/Alert';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { copyToClipboard, getPublicBusinessUrl, getInternalBusinessPath } from '@/lib/utils';
import {
  Search,
  Building2,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Mail,
  Calendar,
  Eye,
  Phone,
  Tag,
  AlertTriangle,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [modalCopied, setModalCopied] = useState(false);

  // Business Details Modal state (Requirement 3 & 4)
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

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

  const handleModalCopyUrl = async (slug: string) => {
    const url = getPublicBusinessUrl(slug);
    const ok = await copyToClipboard(url);
    if (ok) {
      setModalCopied(true);
      setTimeout(() => setModalCopied(false), 2000);
    }
  };

  const handleToggleStatus = async (business: Business) => {
    try {
      setIsUpdatingStatus(true);
      const newStatus = !business.is_active;
      await businessService.updateBusiness(business.id, {
        is_active: newStatus,
      });

      setBusinesses((prev) =>
        prev.map((b) => (b.id === business.id ? { ...b, is_active: newStatus } : b))
      );

      if (selectedBusiness && selectedBusiness.id === business.id) {
        setSelectedBusiness((prev) => (prev ? { ...prev, is_active: newStatus } : null));
      }

      setActionFeedback(
        `Business "${business.name}" has been ${newStatus ? 'activated' : 'suspended'}.`
      );
      setTimeout(() => setActionFeedback(null), 3500);
    } catch (err) {
      console.error('Failed to update business status:', err);
      setActionFeedback('Failed to update business status. Please check Supabase permissions.');
      setTimeout(() => setActionFeedback(null), 4000);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleOpenDetails = (business: Business) => {
    setSelectedBusiness(business);
    setIsDetailsModalOpen(true);
  };

  const filtered = businesses.filter((b) => {
    const q = searchQuery.toLowerCase();
    return (
      b.name.toLowerCase().includes(q) ||
      b.slug.toLowerCase().includes(q) ||
      (b.owner_email && b.owner_email.toLowerCase().includes(q)) ||
      (b.email && b.email.toLowerCase().includes(q)) ||
      (b.city && b.city.toLowerCase().includes(q)) ||
      (b.category && b.category.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
              Platform Owner Control
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-[#14243A] text-[#38BDF8] border border-[#20344D] shadow-xs">
              Super Admin
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Global view and management of all registered business accounts, owner emails, and permanent URLs.
          </p>
        </div>

        <div className="w-full sm:w-80">
          <Input
            placeholder="Search by name, email, slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftAddon={<Search className="w-4 h-4 text-[#94A3B8]" />}
          />
        </div>
      </div>

      {actionFeedback && <Alert type="info" message={actionFeedback} />}

      {/* Summary Metrics Cards (Requirement 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#101D30] p-5 rounded-2xl border border-[#20344D] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
              Total Businesses
            </span>
            <div className="mt-1 text-2xl font-bold text-[#F8FAFC] tracking-tight">
              {businesses.length}
            </div>
            <span className="text-[10px] text-[#94A3B8] font-medium">Registered on platform</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#14243A] text-[#38BDF8] flex items-center justify-center shrink-0 border border-[#20344D]">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#101D30] p-5 rounded-2xl border border-[#20344D] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
              Active Businesses
            </span>
            <div className="mt-1 text-2xl font-bold text-[#22C55E] tracking-tight">
              {businesses.filter((b) => b.is_active).length}
            </div>
            <span className="text-[10px] text-emerald-400 font-medium">Publicly accessible</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-950/40 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-800/60">
            <Check className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>

        <div className="bg-[#101D30] p-5 rounded-2xl border border-[#20344D] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
              Suspended Businesses
            </span>
            <div className="mt-1 text-2xl font-bold text-[#EF4444] tracking-tight">
              {businesses.filter((b) => !b.is_active).length}
            </div>
            <span className="text-[10px] text-rose-400 font-medium">Disabled by platform owner</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-rose-950/40 text-rose-300 flex items-center justify-center shrink-0 border border-rose-800/60">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Registered Businesses ({filtered.length})</CardTitle>
            <span className="text-xs text-[#94A3B8] font-medium hidden sm:inline">
              Real-time synchronization with Supabase production
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <LoadingSpinner label="Loading business records..." />
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-[#94A3B8] text-xs">
              No matching business profiles found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0B1728] border-b border-[#20344D] text-[#CBD5E1] font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Business</th>
                    <th className="py-3 px-4">Owner Email</th>
                    <th className="py-3 px-4">Permanent URL / Slug</th>
                    <th className="py-3 px-4">Created</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#20344D]">
                  {filtered.map((b) => {
                    const displayOwnerEmail = b.owner_email || b.email || '—';
                    const createdDate = b.created_at
                      ? new Date(b.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : '—';

                    return (
                      <tr key={b.id} className="hover:bg-[#14243A]/40 transition-colors">
                        {/* Business Column */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            {b.logo_url ? (
                              <img
                                src={b.logo_url}
                                alt=""
                                className="w-8 h-8 rounded-lg object-cover border border-[#20344D] shrink-0"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-[#14243A] text-[#38BDF8] border border-[#20344D] flex items-center justify-center font-bold shrink-0">
                                {b.name.charAt(0)}
                              </div>
                            )}
                            <div>
                              <span className="font-semibold text-[#F8FAFC] block truncate max-w-[180px]">
                                {b.name}
                              </span>
                              <span className="text-[10px] text-[#94A3B8] font-mono">
                                {b.category || b.city || `ID: ${b.id.substring(0, 8)}...`}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Owner Email Column (Requirement 2) */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 text-[#CBD5E1] font-medium">
                            <Mail className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                            <span className="truncate max-w-[180px]" title={displayOwnerEmail}>
                              {displayOwnerEmail}
                            </span>
                          </div>
                        </td>

                        {/* Permanent URL / Slug Column */}
                        <td className="py-3.5 px-4 font-mono">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[#38BDF8] font-semibold bg-[#14243A] px-2 py-0.5 rounded border border-[#20344D] text-[11px]">
                              /b/{b.slug}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyUrl(b.slug, b.id)}
                              className="p-1 rounded text-[#94A3B8] hover:text-[#38BDF8] hover:bg-[#14243A] transition-colors cursor-pointer"
                              title="Copy permanent public URL"
                            >
                              {copiedId === b.id ? (
                                <Check className="w-3.5 h-3.5 text-[#22C55E]" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Created Date Column */}
                        <td className="py-3.5 px-4 text-[#94A3B8] text-[11px] whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#94A3B8]" />
                            <span>{createdDate}</span>
                          </div>
                        </td>

                        {/* Status Column (Requirement 5) */}
                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(b)}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                              b.is_active
                                ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/60 hover:bg-emerald-900/50'
                                : 'bg-rose-950/40 text-rose-300 border border-rose-800/60 hover:bg-rose-900/50'
                            }`}
                            title="Click to toggle status (Activate / Suspend)"
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                b.is_active ? 'bg-[#22C55E]' : 'bg-[#EF4444]'
                              }`}
                            />
                            {b.is_active ? 'Active' : 'Suspended'}
                          </button>
                        </td>

                        {/* Actions Column (Requirement 3) */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenDetails(b)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#CBD5E1] hover:text-[#38BDF8] hover:bg-[#14243A] rounded-lg transition-colors cursor-pointer border border-[#20344D]"
                              title="View full business details & architecture tier"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Details</span>
                            </button>
                            <a
                              href={getInternalBusinessPath(b.slug)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#38BDF8] hover:text-[#F8FAFC] bg-[#14243A] hover:bg-[#20344D] rounded-lg transition-colors border border-[#20344D]"
                              title="Open public profile in new tab"
                            >
                              <span>Open</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* MODAL: View Business Details (Requirement 3 & 4) */}
      {selectedBusiness && (
        <Modal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          title={`Business Details: ${selectedBusiness.name}`}
          description="Detailed profile overview, permanent URL settings, and platform operational controls."
        >
          <div className="space-y-5">
            {/* Business Header Card */}
            <div className="flex items-center gap-3.5 p-3.5 bg-[#0B1728] rounded-2xl border border-[#20344D]">
              {selectedBusiness.logo_url ? (
                <img
                  src={selectedBusiness.logo_url}
                  alt=""
                  className="w-12 h-12 rounded-xl object-cover border border-[#20344D] bg-[#14243A] shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-[#14243A] text-[#38BDF8] border border-[#20344D] flex items-center justify-center font-bold text-lg shrink-0">
                  {selectedBusiness.name.charAt(0)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#F8FAFC] truncate">
                    {selectedBusiness.name}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      selectedBusiness.is_active
                        ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/60'
                        : 'bg-rose-950/40 text-rose-300 border border-rose-800/60'
                    }`}
                  >
                    {selectedBusiness.is_active ? 'Active' : 'Suspended'}
                  </span>
                </div>
                <div className="text-xs text-[#94A3B8] font-mono mt-0.5">
                  ID: {selectedBusiness.id}
                </div>
              </div>
            </div>

            {/* Permanent URL Showcase */}
            <div className="p-3 bg-[#14243A] rounded-xl border border-[#20344D] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#CBD5E1]">
                  Permanent Public URL
                </span>
                <div className="text-xs font-mono font-semibold text-[#38BDF8] truncate mt-0.5">
                  {getPublicBusinessUrl(selectedBusiness.slug)}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleModalCopyUrl(selectedBusiness.slug)}
                  icon={modalCopied ? <Check className="w-3.5 h-3.5 text-[#22C55E]" /> : <Copy className="w-3.5 h-3.5" />}
                >
                  {modalCopied ? 'Copied' : 'Copy'}
                </Button>
                <a
                  href={getInternalBusinessPath(selectedBusiness.slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#CBD5E1] hover:text-[#38BDF8] bg-[#0B1728] hover:bg-[#101D30] rounded-xl border border-[#20344D] shadow-xs transition-colors"
                >
                  <span>Open Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-[#20344D] bg-[#0B1728]">
                <div className="flex items-center gap-1.5 text-[#94A3B8] font-semibold mb-1">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Account Owner Email</span>
                </div>
                <div className="text-[#F8FAFC] font-bold truncate">
                  {selectedBusiness.owner_email || selectedBusiness.email || '—'}
                </div>
                <div className="text-[10px] text-[#94A3B8] font-mono mt-0.5">
                  User ID: {selectedBusiness.user_id}
                </div>
              </div>

              <div className="p-3 rounded-xl border border-[#20344D] bg-[#0B1728]">
                <div className="flex items-center gap-1.5 text-[#94A3B8] font-semibold mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Registration Date</span>
                </div>
                <div className="text-[#F8FAFC] font-bold">
                  {selectedBusiness.created_at
                    ? new Date(selectedBusiness.created_at).toLocaleString()
                    : '—'}
                </div>
                <div className="text-[10px] text-[#94A3B8] mt-0.5">
                  Last updated: {selectedBusiness.updated_at ? new Date(selectedBusiness.updated_at).toLocaleString() : '—'}
                </div>
              </div>

              <div className="p-3 rounded-xl border border-[#20344D] bg-[#0B1728]">
                <div className="flex items-center gap-1.5 text-[#94A3B8] font-semibold mb-1">
                  <Phone className="w-3.5 h-3.5" />
                  <span>Contact Phone & City</span>
                </div>
                <div className="text-[#F8FAFC] font-bold">
                  {selectedBusiness.phone || 'Not provided'}
                </div>
                <div className="text-[#94A3B8] mt-0.5">
                  {selectedBusiness.city || 'Not provided'}
                </div>
              </div>

              <div className="p-3 rounded-xl border border-[#20344D] bg-[#0B1728]">
                <div className="flex items-center gap-1.5 text-[#94A3B8] font-semibold mb-1">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Category & Address</span>
                </div>
                <div className="text-[#F8FAFC] font-bold">
                  {selectedBusiness.category || 'Not specified'}
                </div>
                <div className="text-[#94A3B8] mt-0.5 truncate" title={selectedBusiness.address}>
                  {selectedBusiness.address || 'Not provided'}
                </div>
              </div>
            </div>

            {selectedBusiness.description && (
              <div className="p-3 rounded-xl border border-[#20344D] bg-[#0B1728] text-xs">
                <span className="font-semibold text-[#94A3B8] block mb-1">Description</span>
                <p className="text-[#CBD5E1] leading-relaxed">{selectedBusiness.description}</p>
              </div>
            )}

            {/* Status Control Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-[#20344D]">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[#94A3B8] font-medium">Platform status:</span>
                <span className={`font-bold ${selectedBusiness.is_active ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                  {selectedBusiness.is_active ? 'Active on Web' : 'Suspended by Owner'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant={selectedBusiness.is_active ? 'danger' : 'primary'}
                  size="sm"
                  isLoading={isUpdatingStatus}
                  onClick={() => handleToggleStatus(selectedBusiness)}
                  icon={selectedBusiness.is_active ? <AlertTriangle className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                >
                  {selectedBusiness.is_active ? 'Suspend Business' : 'Activate Business'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDetailsModalOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

