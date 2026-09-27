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
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from 'lucide-react';

/**
 * Resilient Sponsor Logo Component with automatic broken image protection
 */
const SponsorLogoThumb: React.FC<{
  src?: string | null;
  name: string;
  className?: string;
}> = ({ src, name, className = 'w-12 h-12' }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!src || hasError) {
    return (
      <div
        className={`${className} rounded-xl bg-[#2E1F15] text-[#D49B5B] border border-[#3D2B1F] flex items-center justify-center font-bold text-base shrink-0 shadow-xs`}
        title={name}
      >
        {name?.charAt(0) || 'S'}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setHasError(true)}
      className={`${className} rounded-xl object-contain border border-[#3D2B1F] bg-[#2E1F15] p-1 shrink-0`}
    />
  );
};

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

  // Form states for creating sponsor (Primary Flow)
  const [name, setName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [placement, setPlacement] = useState<SponsorPlacement>('both');
  const [targetBusinessId, setTargetBusinessId] = useState('all');
  const [isActive, setIsActive] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states for editing sponsor (Primary Flow)
  const [editingSponsorId, setEditingSponsorId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editWebsiteUrl, setEditWebsiteUrl] = useState('');
  const [editLogoUrl, setEditLogoUrl] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPlacement, setEditPlacement] = useState<SponsorPlacement>('both');
  const [editTargetBusinessId, setEditTargetBusinessId] = useState('all');
  const [editIsActive, setEditIsActive] = useState(true);
  const [editError, setEditError] = useState<string | null>(null);

  // Form states for quick assigning sponsor to business
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
      setFormError('Destination website URL is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      // 1. Create sponsor record
      const created = await sponsorService.createSponsor({
        name: name.trim(),
        website_url: websiteUrl.trim(),
        logo_url: logoUrl.trim() || undefined,
        description: description.trim() || undefined,
        is_active: isActive,
      });

      // 2. Assign to selected business or all businesses
      const targetBusinesses =
        targetBusinessId === 'all'
          ? businesses
          : businesses.filter((b) => b.id === targetBusinessId);

      const newAssignments: BusinessSponsor[] = [];
      for (const biz of targetBusinesses) {
        try {
          const asgn = await sponsorService.assignSponsorToBusiness(biz.id, created.id, placement);
          if (!isActive) {
            await sponsorService.toggleAssignmentStatus(asgn.id, false);
          }
          newAssignments.push({
            ...asgn,
            business: biz,
            sponsor: created,
            is_active: isActive,
            placement,
          });
        } catch (asgnErr) {
          console.warn(`Failed to auto-assign sponsor to ${biz.name}:`, asgnErr);
        }
      }

      setSponsors((prev) => [...prev, created]);
      if (newAssignments.length > 0) {
        setAssignments((prev) => [...newAssignments, ...prev]);
      }

      setIsCreateModalOpen(false);
      setName('');
      setWebsiteUrl('');
      setLogoUrl('');
      setDescription('');
      setPlacement('both');
      setIsActive(true);
      setTargetBusinessId('all');

      setActionFeedback(`Sponsor "${created.name}" created and placed successfully.`);
      setTimeout(() => setActionFeedback(null), 3500);
    } catch (err) {
      console.error('Failed to create sponsor:', err);
      setFormError(err instanceof Error ? err.message : 'Failed to create sponsor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEdit = (sponsor: Sponsor) => {
    setEditingSponsorId(sponsor.id);
    setEditName(sponsor.name);
    setEditWebsiteUrl(sponsor.website_url);
    setEditLogoUrl(sponsor.logo_url || '');
    setEditDescription(sponsor.description || '');
    setEditIsActive(sponsor.is_active !== false);

    // Look for existing assignments to prefill placement & target
    const currentAsgns = assignments.filter((a) => a.sponsor_id === sponsor.id);
    if (currentAsgns.length > 0) {
      setEditPlacement(currentAsgns[0].placement || 'both');
      setEditTargetBusinessId(currentAsgns.length === 1 ? currentAsgns[0].business_id : 'all');
    } else {
      setEditPlacement('both');
      setEditTargetBusinessId('all');
    }

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
      setEditError('Destination website URL is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      // 1. Update sponsor details
      const updated = await sponsorService.updateSponsor(editingSponsorId, {
        name: editName.trim(),
        website_url: editWebsiteUrl.trim(),
        logo_url: editLogoUrl.trim() || undefined,
        description: editDescription.trim() || undefined,
        is_active: editIsActive,
      });

      // 2. Sync placement and status to existing assignments
      const currentAsgns = assignments.filter((a) => a.sponsor_id === editingSponsorId);
      for (const asgn of currentAsgns) {
        if (asgn.placement !== editPlacement) {
          await sponsorService.updateAssignmentPlacement(asgn.id, editPlacement);
        }
        if (asgn.is_active !== editIsActive) {
          await sponsorService.toggleAssignmentStatus(asgn.id, editIsActive);
        }
      }

      // If no assignments exist yet, create one
      if (currentAsgns.length === 0 && businesses.length > 0) {
        const targetBizs =
          editTargetBusinessId === 'all'
            ? businesses
            : businesses.filter((b) => b.id === editTargetBusinessId);

        for (const biz of targetBizs) {
          await sponsorService.assignSponsorToBusiness(biz.id, editingSponsorId, editPlacement);
        }
      }

      // 3. Refresh in-memory states
      setSponsors((prev) =>
        prev.map((s) => (s.id === editingSponsorId ? updated : s))
      );
      setAssignments((prev) =>
        prev.map((a) =>
          a.sponsor_id === editingSponsorId
            ? { ...a, sponsor: updated, placement: editPlacement, is_active: editIsActive }
            : a
        )
      );

      setIsEditModalOpen(false);
      setActionFeedback(`Sponsor "${updated.name}" updated successfully.`);
      setTimeout(() => setActionFeedback(null), 3500);
    } catch (err) {
      console.error('Failed to update sponsor:', err);
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

    const targetBiz = businesses.find((b) => b.id === selectedBusinessId);
    const targetSp = sponsors.find((s) => s.id === selectedSponsorId);

    // Self-sponsor validation
    if (targetBiz && targetSp) {
      const normBiz = targetBiz.name.trim().toLowerCase().replace(/[^a-z0-9]/g, '').replace(/aa/g, 'a');
      const normSp = targetSp.name.trim().toLowerCase().replace(/[^a-z0-9]/g, '').replace(/aa/g, 'a');
      if (normBiz === normSp) {
        setAssignError('A business cannot be assigned as its own sponsor.');
        return;
      }
    }

    // Single active sponsor rule validation
    const hasActiveSponsor = assignments.some(
      (a) =>
        a.business_id === selectedBusinessId &&
        a.is_active &&
        a.sponsor_id !== selectedSponsorId
    );
    if (hasActiveSponsor) {
      setAssignError('Only one sponsor can be assigned to a business at this time.');
      return;
    }

    try {
      setIsSubmitting(true);
      const assignment = await sponsorService.assignSponsorToBusiness(
        selectedBusinessId,
        selectedSponsorId,
        selectedPlacement
      );

      const enriched: BusinessSponsor = {
        ...assignment,
        business: targetBiz,
        sponsor: targetSp,
      };

      setAssignments((prev) => {
        const idx = prev.findIndex(
          (a) => a.business_id === selectedBusinessId && a.sponsor_id === selectedSponsorId
        );
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = enriched;
          return next;
        }
        return [enriched, ...prev];
      });

      setIsAssignModalOpen(false);
      setAssignSuccess(`Assigned "${targetSp?.name}" to "${targetBiz?.name}" successfully.`);
      setTimeout(() => setAssignSuccess(null), 4000);
    } catch (err) {
      console.error('Failed to assign sponsor:', err);
      setAssignError(err instanceof Error ? err.message : 'Failed to assign sponsor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePlacement = async (assignmentId: string, newPlacement: SponsorPlacement) => {
    try {
      await sponsorService.updateAssignmentPlacement(assignmentId, newPlacement);
      setAssignments((prev) =>
        prev.map((a) => (a.id === assignmentId ? { ...a, placement: newPlacement } : a))
      );
      setActionFeedback(
        `Placement updated to "${newPlacement === 'both' ? 'Header & Footer' : newPlacement}".`
      );
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
      setActionFeedback(
        err instanceof Error ? err.message : 'Failed to toggle assignment status.'
      );
      setTimeout(() => setActionFeedback(null), 4000);
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
    if (
      !window.confirm(
        'Are you sure you want to delete this sponsor? All business assignments will also be removed.'
      )
    )
      return;
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
          <h1 className="text-xl sm:text-2xl font-bold text-[#FBF9F5]">Sponsor Management</h1>
          <p className="text-xs text-[#9E8E81]">
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
            onClick={() => {
              setName('');
              setWebsiteUrl('');
              setLogoUrl('');
              setDescription('');
              setPlacement('both');
              setIsActive(true);
              setTargetBusinessId('all');
              setFormError(null);
              setIsCreateModalOpen(true);
            }}
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
            <span className="text-xs text-[#9E8E81] hidden sm:inline">
              Live placement on customer business profiles
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <LoadingSpinner label="Loading assignments..." />
          ) : assignments.length === 0 ? (
            <div className="py-8 text-center text-[#9E8E81] text-xs">
              <Link2 className="w-8 h-8 text-[#9E8E81]/40 mx-auto mb-2" />
              <p className="font-semibold text-[#FBF9F5]">No sponsor assignments configured yet</p>
              <p className="mt-1 text-[#9E8E81]">
                Click &ldquo;Add New Sponsor&rdquo; or &ldquo;Assign to Business&rdquo; to place a partner on public profiles.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Multiple Active Sponsors Conflict Alert */}
              {(() => {
                const activeBizIds = assignments
                  .filter((a) => a.is_active)
                  .map((a) => a.business_id);
                const conflictedBizIds = Array.from(
                  new Set(
                    activeBizIds.filter((id, _, arr) => arr.filter((x) => x === id).length > 1)
                  )
                );
                if (conflictedBizIds.length === 0) return null;

                const conflictedBizNames = conflictedBizIds
                  .map((id) => businesses.find((b) => b.id === id)?.name || id)
                  .join(', ');

                return (
                  <div className="mx-4 my-3 p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl text-xs text-amber-300 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Multiple Active Sponsors Detected:</span>
                      <span className="ml-1">
                        {conflictedBizNames} {conflictedBizIds.length > 1 ? 'have' : 'has'} more than one active sponsor assigned. The platform rule allows only 1 active sponsor per business. Extra sponsors should be suspended or unassigned.
                      </span>
                    </div>
                  </div>
                );
              })()}

              <table className="w-full text-left text-xs">
                <thead className="bg-[#1B120B] border-b border-[#3D2B1F] text-[#DDD3CA] font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Business</th>
                    <th className="py-3 px-4">Assigned Sponsor</th>
                    <th className="py-3 px-4">Placement</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3D2B1F]">
                  {assignments.map((assignment) => {
                    const biz =
                      assignment.business ||
                      businesses.find((b) => b.id === assignment.business_id);
                    const sp =
                      assignment.sponsor ||
                      sponsors.find((s) => s.id === assignment.sponsor_id);
                    const currentPlacement = assignment.placement || 'both';

                    const activeCountForBiz = assignments.filter(
                      (a) => a.business_id === assignment.business_id && a.is_active
                    ).length;
                    const hasConflict = activeCountForBiz > 1 && assignment.is_active;

                    return (
                      <tr key={assignment.id} className="hover:bg-[#2E1F15]/40 transition-colors">
                        {/* Business Column */}
                        <td className="py-3.5 px-4">
                          <div>
                            <span className="font-semibold text-[#FBF9F5] block truncate max-w-xs">
                              {biz?.name || `Business ID: ${assignment.business_id.substring(0, 8)}...`}
                            </span>
                            {biz?.slug && (
                              <a
                                href={getInternalBusinessPath(biz.slug)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11px] text-[#D49B5B] hover:underline inline-flex items-center gap-0.5 mt-0.5 font-medium"
                                title="Open public profile"
                              >
                                <span>/b/{biz.slug}</span>
                                <ArrowUpRight className="w-3 h-3" />
                              </a>
                            )}
                            {hasConflict && (
                              <div className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-950/60 text-amber-300 border border-amber-800/70">
                                <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                                <span>Multiple Active Conflict</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Sponsor Column */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <SponsorLogoThumb
                              src={sp?.logo_url}
                              name={sp?.name || 'Sponsor'}
                              className="w-7 h-7"
                            />
                            <div>
                              <span className="font-medium text-[#FBF9F5] block truncate max-w-xs">
                                {sp?.name || 'Sponsor'}
                              </span>
                              {sp?.website_url && (
                                <a
                                  href={sp.website_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-[#9E8E81] hover:text-[#D49B5B] truncate block max-w-[160px]"
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
                            className="text-xs rounded-lg border border-[#3D2B1F] bg-[#2E1F15] px-2.5 py-1 text-[#FBF9F5] font-medium shadow-xs focus:outline-none focus:ring-2 focus:ring-[#D49B5B]/20 focus:border-[#D49B5B] cursor-pointer"
                          >
                            <option value="both" className="bg-[#241810] text-[#FBF9F5]">Both (Header & Footer)</option>
                            <option value="header" className="bg-[#241810] text-[#FBF9F5]">Header Only</option>
                            <option value="footer" className="bg-[#241810] text-[#FBF9F5]">Footer Only</option>
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
                                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-[#DDD3CA] hover:text-[#D49B5B] hover:bg-[#2E1F15] rounded-lg border border-[#3D2B1F] transition-colors"
                                title="Preview Sponsor on live customer page"
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
            <span className="text-xs text-[#9E8E81] hidden sm:inline">
              Manage platform sponsor partners and monitor click performance
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingSpinner label="Loading sponsors..." />
          ) : sponsors.length === 0 ? (
            <div className="py-8 text-center text-[#9E8E81] text-xs">
              <Award className="w-8 h-8 text-[#9E8E81]/40 mx-auto mb-2" />
              <p className="font-semibold text-[#FBF9F5]">No sponsors created yet</p>
              <p className="mt-1 text-[#9E8E81]">Add official partners to show on customer business pages.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sponsors.map((sponsor) => (
                <div
                  key={sponsor.id}
                  className="p-4 rounded-xl border border-[#3D2B1F] bg-[#1B120B] hover:border-[#D49B5B]/40 transition-all flex items-start justify-between gap-3 shadow-sm"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <a
                      href={sponsor.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block shrink-0"
                      title={`Visit ${sponsor.name} (${sponsor.website_url})`}
                    >
                      <SponsorLogoThumb
                        src={sponsor.logo_url}
                        name={sponsor.name}
                        className="w-12 h-12"
                      />
                    </a>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-semibold text-[#FBF9F5] truncate">
                          {sponsor.name}
                        </h4>
                        {sponsor.is_active === false && (
                          <span className="px-1.5 py-0.2 rounded text-[9.5px] font-semibold bg-rose-950/40 text-rose-300 border border-rose-800/60">
                            Inactive
                          </span>
                        )}
                      </div>
                      <a
                        href={sponsor.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#D49B5B] hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <span className="truncate max-w-[180px]">{sponsor.website_url}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                      {sponsor.description && (
                        <p className="text-xs text-[#9E8E81] line-clamp-2 mt-1">
                          {sponsor.description}
                        </p>
                      )}

                      {/* Click Analytics Badge */}
                      <div className="flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full bg-[#2E1F15] text-[#D49B5B] border border-[#3D2B1F] text-[10px] font-medium w-fit">
                        <MousePointerClick className="w-3 h-3 text-[#D49B5B]" />
                        <span>{sponsorClickCounts[sponsor.id] || 0} clicks recorded</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(sponsor)}
                      className="p-1.5 text-[#9E8E81] hover:text-[#D49B5B] rounded-lg hover:bg-[#2E1F15] transition-colors cursor-pointer"
                      title="Edit sponsor details"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSponsor(sponsor.id)}
                      className="p-1.5 text-[#9E8E81] hover:text-[#EF4444] rounded-lg hover:bg-rose-950/40 transition-colors cursor-pointer"
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

      {/* Modal: Create Sponsor (Primary Flow) */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Sponsor"
        description="Configure partner details, logo, placement, and status in one simple step."
      >
        <form onSubmit={handleCreateSponsor} className="space-y-4">
          {formError && <Alert type="error" message={formError} />}

          {/* 1. Sponsor Name */}
          <Input
            label="Sponsor Name"
            placeholder="e.g. Prestige Intelligence"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* 2. Destination URL */}
          <Input
            label="Destination URL"
            placeholder="https://partner-website.com"
            helperText="The link opened in a new tab when visitors click on this sponsor"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            required
          />

          {/* 3. Upload Sponsor Logo */}
          <SponsorImageUploader
            value={logoUrl}
            onChange={setLogoUrl}
            disabled={isSubmitting}
          />

          {/* 4. Short Description */}
          <div>
            <label className="block text-xs font-bold text-[#DDD3CA] uppercase tracking-wider mb-1.5">
              Short Description
            </label>
            <textarea
              rows={2}
              className="w-full rounded-xl border border-[#3D2B1F] bg-[#2E1F15] px-3.5 py-2.5 text-xs text-[#FBF9F5] shadow-inner placeholder:text-[#9E8E81] focus:outline-none focus:ring-2 focus:ring-[#D49B5B]/20 focus:border-[#D49B5B] transition-all"
              placeholder="e.g. Helping businesses to grow faster in market."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* 5. Placement */}
          <div>
            <label className="block text-xs font-bold text-[#DDD3CA] uppercase tracking-wider mb-1.5">
              Placement on Customer Profile
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
                  onClick={() => setPlacement(opt.value as SponsorPlacement)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    placement === opt.value
                      ? 'border-[#D49B5B] bg-[#2E1F15] text-[#FBF9F5] ring-2 ring-[#D49B5B]/20 shadow-xs'
                      : 'border-[#3D2B1F] bg-[#1B120B] hover:bg-[#2E1F15] text-[#DDD3CA]'
                  }`}
                >
                  <div className="text-xs font-bold">{opt.label}</div>
                  <div className="text-[10px] text-[#9E8E81]">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Optional: Target Business Scope */}
          {businesses.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-[#DDD3CA] uppercase tracking-wider mb-1.5">
                Assign to Business
              </label>
              <select
                value={targetBusinessId}
                onChange={(e) => setTargetBusinessId(e.target.value)}
                className="w-full rounded-xl border border-[#3D2B1F] bg-[#2E1F15] px-3.5 py-2.5 text-xs text-[#FBF9F5] shadow-inner focus:outline-none focus:ring-2 focus:ring-[#D49B5B]/20 focus:border-[#D49B5B] transition-all cursor-pointer"
              >
                <option value="all" className="bg-[#241810] text-[#FBF9F5]">
                  All Businesses ({businesses.length})
                </option>
                {businesses.map((b) => (
                  <option key={b.id} value={b.id} className="bg-[#241810] text-[#FBF9F5]">
                    {b.name} (/b/{b.slug})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 6. Active / Inactive */}
          <div>
            <label className="block text-xs font-bold text-[#DDD3CA] uppercase tracking-wider mb-1.5">
              Status
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsActive(true)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700 shadow-xs'
                    : 'bg-[#1B120B] text-[#9E8E81] border-[#3D2B1F] hover:text-[#FBF9F5]'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Active</span>
              </button>
              <button
                type="button"
                onClick={() => setIsActive(false)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  !isActive
                    ? 'bg-rose-950/60 text-rose-300 border-rose-700 shadow-xs'
                    : 'bg-[#1B120B] text-[#9E8E81] border-[#3D2B1F] hover:text-[#FBF9F5]'
                }`}
              >
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>Inactive</span>
              </button>
            </div>
          </div>

          {/* 7. Save */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#3D2B1F]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              Save Sponsor
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Sponsor (Primary Flow) */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Sponsor"
        description="Update partner details, logo, placement, and status."
      >
        <form onSubmit={handleUpdateSponsor} className="space-y-4">
          {editError && <Alert type="error" message={editError} />}

          {/* 1. Sponsor Name */}
          <Input
            label="Sponsor Name"
            placeholder="e.g. Prestige Intelligence"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            required
          />

          {/* 2. Destination URL */}
          <Input
            label="Destination URL"
            placeholder="https://partner-website.com"
            helperText="The link opened in a new tab when visitors click on this sponsor"
            value={editWebsiteUrl}
            onChange={(e) => setEditWebsiteUrl(e.target.value)}
            required
          />

          {/* 3. Upload Sponsor Logo */}
          <SponsorImageUploader
            value={editLogoUrl}
            onChange={setEditLogoUrl}
            disabled={isSubmitting}
          />

          {/* 4. Short Description */}
          <div>
            <label className="block text-xs font-bold text-[#DDD3CA] uppercase tracking-wider mb-1.5">
              Short Description
            </label>
            <textarea
              rows={2}
              className="w-full rounded-xl border border-[#3D2B1F] bg-[#2E1F15] px-3.5 py-2.5 text-xs text-[#FBF9F5] shadow-inner placeholder:text-[#9E8E81] focus:outline-none focus:ring-2 focus:ring-[#D49B5B]/20 focus:border-[#D49B5B] transition-all"
              placeholder="e.g. Helping businesses to grow faster in market."
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
          </div>

          {/* 5. Placement */}
          <div>
            <label className="block text-xs font-bold text-[#DDD3CA] uppercase tracking-wider mb-1.5">
              Placement on Customer Profile
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
                  onClick={() => setEditPlacement(opt.value as SponsorPlacement)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    editPlacement === opt.value
                      ? 'border-[#D49B5B] bg-[#2E1F15] text-[#FBF9F5] ring-2 ring-[#D49B5B]/20 shadow-xs'
                      : 'border-[#3D2B1F] bg-[#1B120B] hover:bg-[#2E1F15] text-[#DDD3CA]'
                  }`}
                >
                  <div className="text-xs font-bold">{opt.label}</div>
                  <div className="text-[10px] text-[#9E8E81]">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 6. Active / Inactive */}
          <div>
            <label className="block text-xs font-bold text-[#DDD3CA] uppercase tracking-wider mb-1.5">
              Status
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditIsActive(true)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  editIsActive
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700 shadow-xs'
                    : 'bg-[#1B120B] text-[#9E8E81] border-[#3D2B1F] hover:text-[#FBF9F5]'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Active</span>
              </button>
              <button
                type="button"
                onClick={() => setEditIsActive(false)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  !editIsActive
                    ? 'bg-rose-950/60 text-rose-300 border-rose-700 shadow-xs'
                    : 'bg-[#1B120B] text-[#9E8E81] border-[#3D2B1F] hover:text-[#FBF9F5]'
                }`}
              >
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>Inactive</span>
              </button>
            </div>
          </div>

          {/* 7. Save */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#3D2B1F]">
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

      {/* Modal: Quick Assign Sponsor to Business */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Assign Sponsor to Business"
        description="Link a partner sponsor to any registered business profile."
      >
        <form onSubmit={handleAssignSponsor} className="space-y-4">
          {assignError && <Alert type="error" message={assignError} />}

          <div>
            <label className="block text-xs font-bold text-[#DDD3CA] uppercase tracking-wider mb-1.5">
              Select Business
            </label>
            <select
              value={selectedBusinessId}
              onChange={(e) => setSelectedBusinessId(e.target.value)}
              className="w-full rounded-xl border border-[#3D2B1F] bg-[#2E1F15] px-3.5 py-2.5 text-xs text-[#FBF9F5] shadow-inner focus:outline-none focus:ring-2 focus:ring-[#D49B5B]/20 focus:border-[#D49B5B] transition-all cursor-pointer"
            >
              {businesses.map((b) => (
                <option key={b.id} value={b.id} className="bg-[#241810] text-[#FBF9F5]">
                  {b.name} (/b/{b.slug})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#DDD3CA] uppercase tracking-wider mb-1.5">
              Select Sponsor
            </label>
            <select
              value={selectedSponsorId}
              onChange={(e) => setSelectedSponsorId(e.target.value)}
              className="w-full rounded-xl border border-[#3D2B1F] bg-[#2E1F15] px-3.5 py-2.5 text-xs text-[#FBF9F5] shadow-inner focus:outline-none focus:ring-2 focus:ring-[#D49B5B]/20 focus:border-[#D49B5B] transition-all cursor-pointer"
            >
              {sponsors.map((s) => (
                <option key={s.id} value={s.id} className="bg-[#241810] text-[#FBF9F5]">
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#DDD3CA] uppercase tracking-wider mb-1.5">
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
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedPlacement === opt.value
                      ? 'border-[#D49B5B] bg-[#2E1F15] text-[#FBF9F5] ring-2 ring-[#D49B5B]/20 shadow-xs'
                      : 'border-[#3D2B1F] bg-[#1B120B] hover:bg-[#2E1F15] text-[#DDD3CA]'
                  }`}
                >
                  <div className="text-xs font-bold">{opt.label}</div>
                  <div className="text-[10px] text-[#9E8E81]">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#3D2B1F]">
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
