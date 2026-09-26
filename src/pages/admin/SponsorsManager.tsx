import React, { useState, useEffect } from 'react';
import { sponsorService } from '@/services/sponsorService';
import { businessService } from '@/services/businessService';
import { Sponsor, Business, BusinessSponsor, SponsorPlacement } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Alert } from '@/components/common/Alert';
import { SponsorImageUploader } from '@/components/admin/SponsorImageUploader';
import { getInternalBusinessPath } from '@/lib/utils';
import {
  Award,
  Plus,
  Trash2,
  Pencil,
  ExternalLink,
  Link2,
  MousePointerClick,
  Eye,
  ArrowUpRight,
} from 'lucide-react';

export const SponsorsManager: React.FC = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [assignments, setAssignments] = useState<BusinessSponsor[]>([]);
  const [sponsorClickCounts, setSponsorClickCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Form states for creating sponsor
  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states for editing sponsor
  const [editingSponsorId, setEditingSponsorId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editLogoUrl, setEditLogoUrl] = useState('');
  const [editWebsiteUrl, setEditWebsiteUrl] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editError, setEditError] = useState<string | null>(null);

  // Form states for assigning sponsor to business
  const [selectedBusinessId, setSelectedBusinessId] = useState('');
  const [selectedSponsorId, setSelectedSponsorId] = useState('');
  const [selectedPlacement, setSelectedPlacement] = useState<SponsorPlacement>('both');
  const [assignError, setAssignError] = useState<string | null>(null);
  const [assignSuccess, setAssignSuccess] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [allSponsors, allBusinesses, allAssignments, clickCounts] = await Promise.all([
        sponsorService.getAllSponsors(),
        businessService.getAllBusinesses(),
        sponsorService.getAllBusinessSponsors(),
        sponsorService.getSponsorClickCounts(),
      ]);
      setSponsors(allSponsors);
      setBusinesses(allBusinesses);
      setAssignments(allAssignments);
      setSponsorClickCounts(clickCounts);
      if (allBusinesses.length > 0 && !selectedBusinessId) setSelectedBusinessId(allBusinesses[0].id);
      if (allSponsors.length > 0 && !selectedSponsorId) setSelectedSponsorId(allSponsors[0].id);
    } catch (err) {
      console.error('Failed to load sponsors data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateSponsor = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Sponsor name is required.');
      return;
    }
    if (!websiteUrl.trim()) {
      setFormError('Sponsor website URL is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      await sponsorService.createSponsor({
        name: name.trim(),
        logo_url: logoUrl.trim() || undefined,
        website_url: websiteUrl.trim(),
        description: description.trim() || undefined,
      });
      setName('');
      setLogoUrl('');
      setWebsiteUrl('');
      setDescription('');
      setIsCreateModalOpen(false);
      await loadData();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to create sponsor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEdit = (sponsor: Sponsor) => {
    setEditingSponsorId(sponsor.id);
    setEditName(sponsor.name);
    setEditLogoUrl(sponsor.logo_url || '');
    setEditWebsiteUrl(sponsor.website_url);
    setEditDescription(sponsor.description || '');
    setEditError(null);
    setIsEditModalOpen(true);
  };

  const handleUpdateSponsor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSponsorId) return;
    setEditError(null);

    if (!editName.trim()) {
      setEditError('Sponsor name is required.');
      return;
    }
    if (!editWebsiteUrl.trim()) {
      setEditError('Sponsor website URL is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      await sponsorService.updateSponsor(editingSponsorId, {
        name: editName.trim(),
        logo_url: editLogoUrl.trim() || undefined,
        website_url: editWebsiteUrl.trim(),
        description: editDescription.trim() || undefined,
      });
      setIsEditModalOpen(false);
      setActionFeedback('Sponsor updated successfully.');
      setTimeout(() => setActionFeedback(null), 3000);
      await loadData();
    } catch (err: unknown) {
      setEditError(err instanceof Error ? err.message : 'Failed to update sponsor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignSponsor = async (e: React.FormEvent) => {
    e.preventDefault();
    setAssignError(null);
    setAssignSuccess(null);

    if (!selectedBusinessId || !selectedSponsorId) {
      setAssignError('Please select both a business and a sponsor.');
      return;
    }

    try {
      setIsSubmitting(true);
      await sponsorService.assignSponsorToBusiness(
        selectedBusinessId,
        selectedSponsorId,
        selectedPlacement
      );
      const biz = businesses.find((b) => b.id === selectedBusinessId);
      const sp = sponsors.find((s) => s.id === selectedSponsorId);
      const placementLabel =
        selectedPlacement === 'both'
          ? 'Header & Footer'
          : selectedPlacement === 'header'
          ? 'Header only'
          : 'Footer only';
      setAssignSuccess(`Assigned "${sp?.name}" to "${biz?.name}" (${placementLabel}).`);
      setTimeout(() => setAssignSuccess(null), 4000);
      setIsAssignModalOpen(false);
      await loadData();
    } catch (err: unknown) {
      setAssignError(err instanceof Error ? err.message : 'Failed to assign sponsor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePlacement = async (assignmentId: string, placement: SponsorPlacement) => {
    try {
      await sponsorService.updateAssignmentPlacement(assignmentId, placement);
      setAssignments((prev) =>
        prev.map((a) => (a.id === assignmentId ? { ...a, placement } : a))
      );
      setActionFeedback(`Placement updated to "${placement === 'both' ? 'Header & Footer' : placement}".`);
      setTimeout(() => setActionFeedback(null), 3000);
    } catch (err) {
      console.error('Failed to update placement:', err);
    }
  };

  const handleToggleAssignmentStatus = async (assignment: BusinessSponsor) => {
    try {
      const nextStatus = !assignment.is_active;
      await sponsorService.toggleAssignmentStatus(assignment.id, nextStatus);
      setAssignments((prev) =>
        prev.map((a) => (a.id === assignment.id ? { ...a, is_active: nextStatus } : a))
      );
      setActionFeedback(nextStatus ? 'Assignment activated.' : 'Assignment suspended.');
      setTimeout(() => setActionFeedback(null), 3000);
    } catch (err) {
      console.error('Failed to toggle assignment status:', err);
    }
  };

  const handleUnassignSponsor = async (
    assignmentId: string,
    sponsorName?: string,
    businessName?: string
  ) => {
    const confirmMsg = `Are you sure you want to unassign "${sponsorName || 'this sponsor'}" from "${businessName || 'this business'}"?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      await sponsorService.removeAssignment(assignmentId);
      setAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
      setActionFeedback(`Unassigned "${sponsorName || 'sponsor'}" successfully.`);
      setTimeout(() => setActionFeedback(null), 3000);
    } catch (err) {
      console.error('Failed to unassign sponsor:', err);
    }
  };

  const handleDeleteSponsor = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this sponsor? All business assignments will also be removed.')) return;
    try {
      await sponsorService.deleteSponsor(id);
      setSponsors((prev) => prev.filter((s) => s.id !== id));
      setAssignments((prev) => prev.filter((a) => a.sponsor_id !== id));
    } catch (err) {
      console.error('Failed to delete sponsor:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC]">Sponsor Management</h1>
          <p className="text-xs text-[#94A3B8]">
            Configure platform partners and manage placements on customer business pages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAssignModalOpen(true)}
            icon={<Link2 className="w-4 h-4" />}
            disabled={sponsors.length === 0 || businesses.length === 0}
          >
            Assign to Business
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Add New Sponsor
          </Button>
        </div>
      </div>

      {assignSuccess && <Alert type="success" message={assignSuccess} />}
      {actionFeedback && <Alert type="info" message={actionFeedback} />}

      {/* SECTION 1: Active Business-Sponsor Assignments Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Current Business-Sponsor Assignments ({assignments.length})</CardTitle>
            <span className="text-xs text-[#94A3B8] hidden sm:inline">
              Control header vs footer placement, status, and live customer profile preview
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <LoadingSpinner label="Loading assignments..." />
          ) : assignments.length === 0 ? (
            <div className="py-8 text-center text-[#94A3B8] text-xs">
              <Link2 className="w-8 h-8 text-[#94A3B8]/40 mx-auto mb-2" />
              <p className="font-semibold text-[#F8FAFC]">No sponsor assignments configured yet</p>
              <p className="mt-1 text-[#94A3B8]">
                Click &ldquo;Assign to Business&rdquo; above to link a partner sponsor to any registered business profile.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0B1728] border-b border-[#20344D] text-[#CBD5E1] font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Business</th>
                    <th className="py-3 px-4">Assigned Sponsor</th>
                    <th className="py-3 px-4">Placement</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#20344D]">
                  {assignments.map((assignment) => {
                    const biz =
                      assignment.business ||
                      businesses.find((b) => b.id === assignment.business_id);
                    const sp =
                      assignment.sponsor ||
                      sponsors.find((s) => s.id === assignment.sponsor_id);
                    const currentPlacement = assignment.placement || 'both';

                    return (
                      <tr key={assignment.id} className="hover:bg-[#14243A]/40 transition-colors">
                        {/* Business Column */}
                        <td className="py-3.5 px-4">
                          <div>
                            <span className="font-semibold text-[#F8FAFC] block truncate max-w-xs">
                              {biz?.name || `Business ID: ${assignment.business_id.substring(0, 8)}...`}
                            </span>
                            {biz?.slug && (
                              <a
                                href={getInternalBusinessPath(biz.slug)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11px] text-[#38BDF8] hover:underline inline-flex items-center gap-0.5 mt-0.5 font-medium"
                                title="Open public profile"
                              >
                                <span>/b/{biz.slug}</span>
                                <ArrowUpRight className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </td>

                        {/* Sponsor Column */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            {sp?.logo_url ? (
                              <a
                                href={sp.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={`Visit ${sp.name} (${sp.website_url})`}
                                className="shrink-0"
                              >
                                <img
                                  src={sp.logo_url}
                                  alt=""
                                  className="w-6 h-6 rounded object-contain border border-[#20344D] bg-[#14243A] shrink-0 hover:border-[#38BDF8] transition-colors"
                                />
                              </a>
                            ) : (
                              <div className="w-6 h-6 rounded bg-[#14243A] text-[#38BDF8] border border-[#20344D] flex items-center justify-center font-bold text-[10px] shrink-0">
                                {sp?.name?.charAt(0) || 'S'}
                              </div>
                            )}
                            <div>
                              <span className="font-medium text-[#F8FAFC] block truncate max-w-xs">
                                {sp?.name || 'Sponsor'}
                              </span>
                              {sp?.website_url && (
                                <a
                                  href={sp.website_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-[#94A3B8] hover:text-[#38BDF8] truncate block max-w-[160px]"
                                >
                                  {sp.website_url}
                                </a>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Placement Selector */}
                        <td className="py-3.5 px-4">
                          <select
                            value={currentPlacement}
                            onChange={(e) =>
                              handleUpdatePlacement(assignment.id, e.target.value as SponsorPlacement)
                            }
                            className="text-xs rounded-lg border border-[#20344D] bg-[#14243A] px-2.5 py-1 text-[#F8FAFC] font-medium shadow-xs focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/20 focus:border-[#38BDF8] cursor-pointer"
                          >
                            <option value="both" className="bg-[#101D30] text-[#F8FAFC]">Both (Header & Footer)</option>
                            <option value="header" className="bg-[#101D30] text-[#F8FAFC]">Header Only</option>
                            <option value="footer" className="bg-[#101D30] text-[#F8FAFC]">Footer Only</option>
                          </select>
                        </td>

                        {/* Status Toggle */}
                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleAssignmentStatus(assignment)}
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                              assignment.is_active
                                ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/60 hover:bg-emerald-900/50'
                                : 'bg-rose-950/40 text-rose-300 border border-rose-800/60 hover:bg-rose-900/50'
                            }`}
                            title="Click to toggle active status"
                          >
                            {assignment.is_active ? 'Active' : 'Suspended'}
                          </button>
                        </td>

                        {/* Actions (Preview & Unassign) */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {biz?.slug && (
                              <a
                                href={getInternalBusinessPath(biz.slug)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-[#CBD5E1] hover:text-[#38BDF8] hover:bg-[#14243A] rounded-lg border border-[#20344D] transition-colors"
                                title="Preview Sponsor Header on live customer page"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Preview</span>
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() =>
                                handleUnassignSponsor(assignment.id, sp?.name, biz?.name)
                              }
                              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-rose-400 hover:bg-rose-950/40 rounded-lg border border-rose-800/60 transition-colors cursor-pointer"
                              title="Unassign sponsor from this business"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Unassign</span>
                            </button>
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

      {/* SECTION 2: Configured Sponsors Grid with Edit, Delete & Click Analytics */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Configured Sponsors ({sponsors.length})</CardTitle>
            <span className="text-xs text-[#94A3B8] hidden sm:inline">
              Create and edit platform sponsor partners
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingSpinner label="Loading sponsors..." />
          ) : sponsors.length === 0 ? (
            <div className="py-8 text-center text-[#94A3B8] text-xs">
              <Award className="w-8 h-8 text-[#94A3B8]/40 mx-auto mb-2" />
              <p className="font-semibold text-[#F8FAFC]">No sponsors created yet</p>
              <p className="mt-1 text-[#94A3B8]">Add official partners to show on customer business pages.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sponsors.map((sponsor) => (
                <div
                  key={sponsor.id}
                  className="p-4 rounded-xl border border-[#20344D] bg-[#0B1728] hover:border-[#38BDF8]/40 transition-all flex items-start justify-between gap-3 shadow-sm"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    {sponsor.logo_url ? (
                      <a
                        href={sponsor.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block shrink-0 group/img relative"
                        title={`Visit ${sponsor.name} (${sponsor.website_url})`}
                      >
                        <img
                          src={sponsor.logo_url}
                          alt={sponsor.name}
                          className="w-12 h-12 rounded-lg object-contain border border-[#20344D] bg-[#14243A] p-1 hover:border-[#38BDF8] hover:shadow-xs transition-all shrink-0"
                        />
                      </a>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-[#14243A] text-[#38BDF8] border border-[#20344D] flex items-center justify-center font-bold text-lg shrink-0">
                        {sponsor.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-[#F8FAFC] truncate">
                        {sponsor.name}
                      </h4>
                      <a
                        href={sponsor.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#38BDF8] hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <span className="truncate max-w-[180px]">{sponsor.website_url}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                      {sponsor.description && (
                        <p className="text-xs text-[#94A3B8] line-clamp-2 mt-1">
                          {sponsor.description}
                        </p>
                      )}

                      {/* Click Analytics Badge */}
                      <div className="flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full bg-[#14243A] text-[#38BDF8] border border-[#20344D] text-[10px] font-medium w-fit">
                        <MousePointerClick className="w-3 h-3 text-[#38BDF8]" />
                        <span>{sponsorClickCounts[sponsor.id] || 0} clicks recorded</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(sponsor)}
                      className="p-1.5 text-[#94A3B8] hover:text-[#38BDF8] rounded-lg hover:bg-[#14243A] transition-colors cursor-pointer"
                      title="Edit sponsor details"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSponsor(sponsor.id)}
                      className="p-1.5 text-[#94A3B8] hover:text-[#EF4444] rounded-lg hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Delete sponsor"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal: Create Sponsor */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Sponsor"
        description="Add a verified partner company"
      >
        <form onSubmit={handleCreateSponsor} className="space-y-4">
          {formError && <Alert type="error" message={formError} />}

          <Input
            label="Sponsor Name"
            placeholder="e.g. Metro Community Partner"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Website / Destination URL"
            placeholder="https://partner-website.com"
            helperText="The link opened in a new tab when visitors click on this sponsor"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            required
          />

          <SponsorImageUploader
            value={logoUrl}
            onChange={setLogoUrl}
            disabled={isSubmitting}
          />

          <div>
            <label className="block text-xs font-bold text-[#CBD5E1] uppercase tracking-wider mb-1.5">
              Short Description
            </label>
            <textarea
              rows={2}
              className="w-full rounded-xl border border-[#20344D] bg-[#14243A] px-3.5 py-2.5 text-xs text-[#F8FAFC] shadow-inner placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/20 focus:border-[#38BDF8] transition-all"
              placeholder="e.g. Official community partner for local businesses."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#20344D]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              Create Sponsor
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Sponsor */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Sponsor"
        description="Update partner company information"
      >
        <form onSubmit={handleUpdateSponsor} className="space-y-4">
          {editError && <Alert type="error" message={editError} />}

          <Input
            label="Sponsor Name"
            placeholder="e.g. Metro Community Partner"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            required
          />

          <Input
            label="Website / Destination URL"
            placeholder="https://partner-website.com"
            helperText="The link opened in a new tab when visitors click on this sponsor"
            value={editWebsiteUrl}
            onChange={(e) => setEditWebsiteUrl(e.target.value)}
            required
          />

          <SponsorImageUploader
            value={editLogoUrl}
            onChange={setEditLogoUrl}
            disabled={isSubmitting}
          />

          <div>
            <label className="block text-xs font-bold text-[#CBD5E1] uppercase tracking-wider mb-1.5">
              Short Description
            </label>
            <textarea
              rows={2}
              className="w-full rounded-xl border border-[#20344D] bg-[#14243A] px-3.5 py-2.5 text-xs text-[#F8FAFC] shadow-inner placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/20 focus:border-[#38BDF8] transition-all"
              placeholder="e.g. Official community partner for local businesses."
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#20344D]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Assign Sponsor to Business */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Assign Sponsor to Business"
        description="Choose a partner and where they should be displayed on the public profile."
      >
        <form onSubmit={handleAssignSponsor} className="space-y-4">
          {assignError && <Alert type="error" message={assignError} />}

          <div>
            <label className="block text-xs font-bold text-[#CBD5E1] uppercase tracking-wider mb-1.5">
              Select Business
            </label>
            <select
              value={selectedBusinessId}
              onChange={(e) => setSelectedBusinessId(e.target.value)}
              className="w-full rounded-xl border border-[#20344D] bg-[#14243A] px-3.5 py-2.5 text-xs text-[#F8FAFC] shadow-inner focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/20 focus:border-[#38BDF8] transition-all cursor-pointer"
            >
              {businesses.map((b) => (
                <option key={b.id} value={b.id} className="bg-[#101D30] text-[#F8FAFC]">
                  {b.name} (/b/{b.slug})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#CBD5E1] uppercase tracking-wider mb-1.5">
              Select Sponsor
            </label>
            <select
              value={selectedSponsorId}
              onChange={(e) => setSelectedSponsorId(e.target.value)}
              className="w-full rounded-xl border border-[#20344D] bg-[#14243A] px-3.5 py-2.5 text-xs text-[#F8FAFC] shadow-inner focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/20 focus:border-[#38BDF8] transition-all cursor-pointer"
            >
              {sponsors.map((s) => (
                <option key={s.id} value={s.id} className="bg-[#101D30] text-[#F8FAFC]">
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#CBD5E1] uppercase tracking-wider mb-1.5">
              Sponsor Placement on Public Profile
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'both', label: 'Both', desc: 'Header & footer' },
                { value: 'header', label: 'Header Only', desc: 'Top of profile' },
                { value: 'footer', label: 'Footer Only', desc: 'Bottom card' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSelectedPlacement(opt.value as SponsorPlacement)}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    selectedPlacement === opt.value
                      ? 'border-[#38BDF8] bg-[#14243A] text-[#F8FAFC] ring-2 ring-[#38BDF8]/20'
                      : 'border-[#20344D] bg-[#0B1728] hover:bg-[#14243A] text-[#CBD5E1]'
                  }`}
                >
                  <div className="text-xs font-bold">{opt.label}</div>
                  <div className="text-[10px] text-[#94A3B8]">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#20344D]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAssignModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              Assign Sponsor
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
