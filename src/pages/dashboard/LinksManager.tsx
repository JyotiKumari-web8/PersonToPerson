import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { linkService } from '@/services/linkService';
import { BusinessLink, LinkType } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { LinkItemRow } from '@/components/business/LinkItemRow';
import { LinkModal } from '@/components/business/LinkModal';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Alert } from '@/components/common/Alert';
import { Plus, Link2, HelpCircle } from 'lucide-react';

export const LinksManager: React.FC = () => {
  const { business } = useAuth();
  const [links, setLinks] = useState<BusinessLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<BusinessLink | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadLinks = async () => {
    if (!business) return;
    try {
      setIsLoading(true);
      const data = await linkService.getLinksByBusinessId(business.id);
      setLinks(data);
    } catch (err) {
      console.error('Failed to load links:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLinks();
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

    await loadLinks();
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleDelete = async (id: string) => {
    try {
      await linkService.deleteLink(id);
      setLinks((prev) => prev.filter((l) => l.id !== id));
      setStatusMessage({ type: 'success', text: 'Link deleted successfully.' });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch {
      setStatusMessage({ type: 'error', text: 'Failed to delete link.' });
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      await linkService.updateLink(id, { is_active: active });
      setLinks((prev) =>
        prev.map((l) => (l.id === id ? { ...l, is_active: active } : l))
      );
    } catch {
      setStatusMessage({ type: 'error', text: 'Failed to update link status.' });
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
      await loadLinks();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#FBF9F5] tracking-tight">Dynamic Link Builder</h1>
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

      {/* Info Tip */}
      <div className="p-4 bg-[#241810] rounded-2xl border border-[#3D2B1F] flex items-start gap-3 text-xs text-[#DDD3CA] shadow-sm">
        <HelpCircle className="w-4 h-4 text-[#D49B5B] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="font-bold text-[#FBF9F5]">Tip:</strong> Each predefined link type (e.g. Website, Instagram, WhatsApp, Maps) can be added once with its unique URL. You can reorder links using the up/down arrows to change how customers see them.
        </p>
      </div>

      {/* Links List */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Configured Links ({links.length})</CardTitle>
            <CardDescription>
              {links.filter((l) => l.is_active).length} active link(s) displayed to visitors
            </CardDescription>
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
      />
    </div>
  );
};
