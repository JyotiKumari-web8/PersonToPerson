import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { linkService } from '@/services/linkService';
import { BusinessLink, LinkType, BusinessSubscriptionDetails } from '@/types';
import { planService } from '@/services/planService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { LinkItemRow } from '@/components/business/LinkItemRow';
import { LinkModal } from '@/components/business/LinkModal';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Alert } from '@/components/common/Alert';
import { Plus, Link2, HelpCircle, AlertCircle } from 'lucide-react';

export const LinksManager: React.FC = () => {
  const { business } = useAuth();
  const [links, setLinks] = useState<BusinessLink[]>([]);
  const [subscription, setSubscription] = useState<BusinessSubscriptionDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<BusinessLink | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = async () => {
    if (!business) return;
    try {
      setIsLoading(true);
      const [linksData, subData] = await Promise.all([
        linkService.getLinksByBusinessId(business.id),
        planService.getSubscriptionByBusinessId(business.id),
      ]);
      setLinks(linksData);
      setSubscription(subData);
    } catch (err) {
      console.error('Failed to load links data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [business]);

  const handleOpenAdd = () => {
    setEditingLink(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (link: BusinessLink) => {
    setEditingLink(link);
    setModalOpen(true);
  };

  const handleSave = async (
    data: {
      label: string;
      url: string;
      link_type: LinkType;
      is_active: boolean;
    },
    targetLinkId?: string
  ) => {
    if (!business) return;

    const idToUpdate = targetLinkId || editingLink?.id;

    if (idToUpdate) {
      await linkService.updateLink(idToUpdate, data);
      setStatusMessage({ type: 'success', text: `Link "${data.label}" updated successfully.` });
    } else {
      await linkService.createLink({
        business_id: business.id,
        ...data,
      });
      setStatusMessage({ type: 'success', text: `Link "${data.label}" created successfully.` });
    }

      await loadData();
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleDelete = async (id: string) => {
    try {
      await linkService.deleteLink(id);
      await loadData();
      setStatusMessage({ type: 'success', text: 'Link deleted successfully.' });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch {
      setStatusMessage({ type: 'error', text: 'Failed to delete link.' });
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      await linkService.updateLink(id, { is_active: active });
      await loadData();
    } catch (err: unknown) {
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to update link status.',
      });
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (!business) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= links.length) return;

    const newLinks = [...links];
    const [moved] = newLinks.splice(index, 1);
    newLinks.splice(targetIndex, 0, moved);

    // Optimistically update
    setLinks(newLinks);

    try {
      const orderedIds = newLinks.map((l) => l.id);
      await linkService.reorderLinks(business.id, orderedIds);
    } catch (err) {
      console.error('Failed to save reordered links:', err);
      await loadData();
    }
  };

  const activeCount = links.filter((l) => l.is_active).length;
  const maxLinks = subscription?.max_links ?? 3;
  const isLimitReached = activeCount >= maxLinks;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#FBF9F5] tracking-tight">Dynamic Link Builder</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#241810] text-[#D49B5B] border border-[#3D2B1F]">
              {subscription?.plan_name || 'Free'} Plan ({activeCount}/{maxLinks} links)
            </span>
          </div>
          <p className="text-xs text-[#9E8E81] mt-0.5">
            Add website, social, payment, booking, reviews, or direct contact links. Reorder anytime.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenAdd}
            icon={<Plus className="w-4 h-4" />}
          >
            Add New Link
          </Button>
        </div>
      </div>

      {statusMessage && (
        <Alert
          type={statusMessage.type}
          message={statusMessage.text}
        />
      )}

      {/* Plan Limit Banner if full */}
      {isLimitReached && (
        <div className="p-4 bg-amber-950/30 rounded-2xl border border-amber-800/50 flex items-center justify-between gap-3 text-xs text-amber-200 shadow-sm">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              You have reached your <strong>{subscription?.plan_name || 'Free'}</strong> plan limit of{' '}
              <strong>{maxLinks} active links</strong>.
            </span>
          </div>
          <span className="text-[11px] text-[#D49B5B] font-semibold shrink-0">
            Contact Admin to upgrade &rsaquo;
          </span>
        </div>
      )}

      {/* Links List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Configured Links ({links.length})</CardTitle>
              <CardDescription>
                {activeCount} of {maxLinks} active link(s) displayed to visitors
              </CardDescription>
            </div>
            <span className="text-xs font-mono font-bold text-[#D49B5B] bg-[#1B120B] px-3 py-1 rounded-xl border border-[#3D2B1F]">
              {activeCount} / {maxLinks} Active
            </span>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <LoadingSpinner label="Loading your links..." />
          ) : links.length === 0 ? (
            <EmptyState
              icon={<Link2 className="w-6 h-6" />}
              title="No links added yet"
              description="Add your official links so customers can visit your website, social pages, or contact you directly."
              action={
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleOpenAdd}
                  icon={<Plus className="w-4 h-4" />}
                >
                  Add Your First Link
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {links.map((link, idx) => (
                <LinkItemRow
                  key={link.id}
                  link={link}
                  isFirst={idx === 0}
                  isLast={idx === links.length - 1}
                  onMoveUp={() => handleMove(idx, 'up')}
                  onMoveDown={() => handleMove(idx, 'down')}
                  onEdit={() => handleOpenEdit(link)}
                  onDelete={() => handleDelete(link.id)}
                  onToggleActive={(active) => handleToggleActive(link.id, active)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Modal */}
      <LinkModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialLink={editingLink}
        existingLinks={links}
        maxLinks={maxLinks}
        planName={subscription?.plan_name}
      />
    </div>
  );
};
