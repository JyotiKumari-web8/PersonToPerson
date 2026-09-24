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
import { getInternalBusinessPath } from '@/lib/utils';
import { Plus, Link2, ExternalLink, HelpCircle } from 'lucide-react';

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

  const handleSave = async (data: {
    label: string;
    url: string;
    link_type: LinkType;
    is_active: boolean;
  }) => {
    if (!business) return;

    if (editingLink) {
      await linkService.updateLink(editingLink.id, data);
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
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Dynamic Link Builder</h1>
          <p className="text-xs text-slate-500">
            Add custom URLs, payment buttons, booking pages, reviews, or social links. Reorder anytime.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {business && (
            <a
              href={getInternalBusinessPath(business.slug)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" icon={<ExternalLink className="w-4 h-4" />}>
                Preview Live Page
              </Button>
            </a>
          )}
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
      <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 flex items-start gap-2.5 text-xs text-sky-800">
        <HelpCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Tip:</strong> You can add any URL you want (Stripe checkout, WhatsApp chat, Google review, appointment calendar, or custom domain). Use the up/down arrows to change the order your customers see them.
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
              description="No links added yet. Add your first link to make your profile useful for customers."
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
            <div className="space-y-2.5">
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
      />
    </div>
  );
};
