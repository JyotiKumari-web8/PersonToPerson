import React, { useState, useEffect } from 'react';
import { sponsorService } from '@/services/sponsorService';
import { businessService } from '@/services/businessService';
import { Sponsor, Business, BusinessSponsor } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Alert } from '@/components/common/Alert';
import { Award, Plus, Trash2, ExternalLink, Link2, Check } from 'lucide-react';

export const SponsorsManager: React.FC = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Form states for creating sponsor
  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states for assigning sponsor to business
  const [selectedBusinessId, setSelectedBusinessId] = useState('');
  const [selectedSponsorId, setSelectedSponsorId] = useState('');
  const [assignError, setAssignError] = useState<string | null>(null);
  const [assignSuccess, setAssignSuccess] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [allSponsors, allBusinesses] = await Promise.all([
        sponsorService.getAllSponsors(),
        businessService.getAllBusinesses(),
      ]);
      setSponsors(allSponsors);
      setBusinesses(allBusinesses);
      if (allBusinesses.length > 0) setSelectedBusinessId(allBusinesses[0].id);
      if (allSponsors.length > 0) setSelectedSponsorId(allSponsors[0].id);
    } catch (err) {
      console.error('Failed to load sponsors:', err);
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
      await sponsorService.assignSponsorToBusiness(selectedBusinessId, selectedSponsorId);
      const biz = businesses.find((b) => b.id === selectedBusinessId);
      const sp = sponsors.find((s) => s.id === selectedSponsorId);
      setAssignSuccess(`Assigned "${sp?.name}" to "${biz?.name}". It will now appear on their public page.`);
      setTimeout(() => setAssignSuccess(null), 4000);
      setIsAssignModalOpen(false);
    } catch (err: unknown) {
      setAssignError(err instanceof Error ? err.message : 'Failed to assign sponsor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSponsor = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this sponsor?')) return;
    try {
      await sponsorService.deleteSponsor(id);
      setSponsors((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Failed to delete sponsor:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Sponsor Management</h1>
          <p className="text-xs text-slate-500">
            Configure platform partners and link them to specific business public profiles.
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

      <Card>
        <CardHeader>
          <CardTitle>Configured Sponsors ({sponsors.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingSpinner label="Loading sponsors..." />
          ) : sponsors.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              <Award className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">No sponsors created yet</p>
              <p className="mt-1 text-slate-400">Add official partners to show on customer business pages.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sponsors.map((sponsor) => (
                <div
                  key={sponsor.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex items-start justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    {sponsor.logo_url ? (
                      <img
                        src={sponsor.logo_url}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-lg shrink-0">
                        {sponsor.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-slate-900 truncate">
                        {sponsor.name}
                      </h4>
                      <a
                        href={sponsor.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-sky-600 hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <span className="truncate max-w-[200px]">{sponsor.website_url}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                      {sponsor.description && (
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                          {sponsor.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteSponsor(sponsor.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
                    title="Delete sponsor"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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
            placeholder="e.g. Apex Cloud Solutions"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Website URL"
            placeholder="https://sponsorwebsite.com"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            required
          />

          <Input
            label="Logo Image URL"
            placeholder="https://example.com/logo.png"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Short Description
            </label>
            <textarea
              rows={2}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="e.g. Official cloud partner for high-growth local restaurants."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
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

      {/* Modal: Assign Sponsor to Business */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Assign Sponsor to Business"
        description="The selected sponsor will appear in the Partner section of the public page."
      >
        <form onSubmit={handleAssignSponsor} className="space-y-4">
          {assignError && <Alert type="error" message={assignError} />}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Business
            </label>
            <select
              value={selectedBusinessId}
              onChange={(e) => setSelectedBusinessId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {businesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} (/b/{b.slug})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Sponsor
            </label>
            <select
              value={selectedSponsorId}
              onChange={(e) => setSelectedSponsorId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {sponsors.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
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
