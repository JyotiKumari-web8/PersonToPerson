import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { BusinessLink, LinkType } from '@/types';
import { LINK_TYPE_CONFIG } from './linkIcons';
import { isValidUrl } from '@/lib/utils';
import { AlertCircle, Check, Pencil } from 'lucide-react';

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    data: {
      label: string;
      url: string;
      link_type: LinkType;
      is_active: boolean;
    },
    targetLinkId?: string
  ) => Promise<void>;
  initialLink?: BusinessLink | null;
  existingLinks?: BusinessLink[];
}

const PREDEFINED_TYPES: LinkType[] = [
  'website',
  'instagram',
  'youtube',
  'facebook',
  'whatsapp',
  'google_maps',
  'google_review',
  'payment',
  'booking',
  'call',
  'email',
  'menu',
  'admission',
  'portfolio',
  'custom',
];

export const LinkModal: React.FC<LinkModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialLink,
  existingLinks = [],
}) => {
  const [linkType, setLinkType] = useState<LinkType>('website');
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [activeTargetId, setActiveTargetId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Independent URL drafts per link type to prevent carrying over URLs
  const [draftUrls, setDraftUrls] = useState<Partial<Record<LinkType, string>>>({});

  // Helper to find if a predefined link type already has an existing link record
  const findExistingByType = (type: LinkType): BusinessLink | undefined => {
    if (type === 'custom') return undefined;
    return existingLinks.find((l) => l.link_type === type);
  };

  useEffect(() => {
    if (!isOpen) return;

    setError(null);

    if (initialLink) {
      setLinkType(initialLink.link_type);
      setLabel(initialLink.label);
      setUrl(initialLink.url);
      setIsActive(initialLink.is_active);
      setActiveTargetId(initialLink.id);
      setDraftUrls((prev) => ({ ...prev, [initialLink.link_type]: initialLink.url }));
    } else {
      // Find the first available unused link type, or default to 'website'
      const firstAvailable =
        PREDEFINED_TYPES.find((t) => t !== 'custom' && !existingLinks.some((l) => l.link_type === t)) ||
        'website';

      const existingForFirst = findExistingByType(firstAvailable);

      setLinkType(firstAvailable);
      if (existingForFirst) {
        setLabel(existingForFirst.label);
        setUrl(existingForFirst.url);
        setIsActive(existingForFirst.is_active);
        setActiveTargetId(existingForFirst.id);
      } else {
        setLabel(LINK_TYPE_CONFIG[firstAvailable].defaultLabel);
        setUrl('');
        setIsActive(true);
        setActiveTargetId(null);
      }
    }
  }, [initialLink, isOpen]);

  const handleTypeSelect = (selectedType: LinkType) => {
    // 1. Save current URL draft for previous linkType if we weren't editing an existing link
    if (!activeTargetId && url) {
      setDraftUrls((prev) => ({ ...prev, [linkType]: url }));
    }

    setLinkType(selectedType);
    setError(null);

    // 2. Check if selected type is already added
    const existing = findExistingByType(selectedType);

    if (existing) {
      // Mode: EDIT existing link for this type
      setActiveTargetId(existing.id);
      setLabel(existing.label);
      setUrl(existing.url);
      setIsActive(existing.is_active);
    } else {
      // Mode: ADD new link for this type
      setActiveTargetId(null);
      setLabel(LINK_TYPE_CONFIG[selectedType].defaultLabel);
      // Independent URL: use stored draft for this type, NEVER carry over another type's URL
      setUrl(draftUrls[selectedType] || '');
      setIsActive(true);
    }
  };

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    setDraftUrls((prev) => ({ ...prev, [linkType]: newUrl }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedLabel = label.trim();
    const trimmedUrl = url.trim();

    if (!trimmedLabel) {
      setError('Please provide a descriptive button label.');
      return;
    }

    if (!trimmedUrl) {
      setError('Please enter a destination URL.');
      return;
    }

    if (!isValidUrl(trimmedUrl, linkType)) {
      if (linkType === 'whatsapp') {
        setError('Please enter a valid phone number (with country code) or a wa.me URL.');
      } else if (linkType === 'call') {
        setError('Please enter a valid phone number.');
      } else if (linkType === 'email') {
        setError('Please enter a valid email address.');
      } else {
        setError('Please enter a valid web URL (e.g. https://yourbusiness.com).');
      }
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave(
        {
          label: trimmedLabel,
          url: trimmedUrl,
          link_type: linkType,
          is_active: isActive,
        },
        activeTargetId || undefined
      );
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving the link.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentConfig = LINK_TYPE_CONFIG[linkType];
  const isEditingExisting = Boolean(activeTargetId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditingExisting ? `Edit ${currentConfig.label}` : 'Add New Link'}
      description={
        isEditingExisting
          ? `Editing existing ${currentConfig.label} link. Changes will update immediately on your public page.`
          : 'Choose a link type and enter your destination. Each predefined type can only be added once.'
      }
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="flex items-center gap-2 p-3 text-xs bg-rose-950/40 text-rose-300 border border-rose-800/60 rounded-xl leading-relaxed">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Visual Selectable Link Cards */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[11px] font-bold text-[#DDD3CA] uppercase tracking-wider">
              Select Link Type
            </label>
            <span className="text-[11px] text-[#9E8E81]">
              {isEditingExisting ? 'Editing already added link' : 'Select a type to add'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
            {PREDEFINED_TYPES.map((type) => {
              const cfg = LINK_TYPE_CONFIG[type];
              const isSelected = linkType === type;
              const existingRecord = findExistingByType(type);
              const isAlreadyAdded = Boolean(existingRecord);

              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleTypeSelect(type)}
                  className={`flex flex-col justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer relative min-h-[64px] ${
                    isSelected
                      ? 'border-[#D49B5B] bg-[#2E1F15] text-[#FBF9F5] ring-2 ring-[#D49B5B]/30 shadow-xs'
                      : 'border-[#3D2B1F] bg-[#1B120B] text-[#DDD3CA] hover:border-[#D49B5B]/40 hover:bg-[#241810]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={cfg.colorClass}>{cfg.icon({ className: 'w-4 h-4' })}</span>
                    <span className="text-xs font-bold truncate">{cfg.label}</span>
                  </div>

                  <div className="mt-1 flex items-center justify-between gap-1">
                    {isAlreadyAdded ? (
                      <span className="inline-flex items-center gap-1 text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-emerald-950/50 text-[#22C55E] border border-emerald-800/50">
                        {isSelected ? (
                          <>
                            <Pencil className="w-2.5 h-2.5" />
                            <span>Editing</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-2.5 h-2.5" />
                            <span>Already Added</span>
                          </>
                        )}
                      </span>
                    ) : (
                      <span className="text-[9.5px] text-[#9E8E81]">Available</span>
                    )}

                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D49B5B]" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Existing Link Notice */}
        {isEditingExisting && (
          <div className="p-3 bg-[#241810] border border-[#3D2B1F] rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#DDD3CA]">
              <span className="text-[#22C55E] font-bold">✓ Already Added:</span>
              <span>This link already exists. Saving will update its destination.</span>
            </div>
          </div>
        )}

        {/* Button Label */}
        <Input
          label="Button Label / Call to Action"
          placeholder="e.g. Reserve a Table, Pay Now, View Menu"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          required
          helperText="Text displayed on the button for your customers."
        />

        {/* Destination URL (Independent URL per type) */}
        <Input
          label={
            linkType === 'call'
              ? 'Phone Number'
              : linkType === 'email'
              ? 'Email Address'
              : linkType === 'whatsapp'
              ? 'WhatsApp Number or URL'
              : 'Destination URL'
          }
          placeholder={currentConfig.placeholder}
          value={url}
          onChange={(e) => handleUrlChange(e.target.value)}
          required
          helperText={
            linkType === 'payment'
              ? 'Enter your Stripe payment link, PayPal link, or gateway checkout URL.'
              : linkType === 'whatsapp'
              ? 'Enter international phone number with country code (e.g. +14159876543) or wa.me URL.'
              : linkType === 'call'
              ? 'Enter phone number with optional country code (e.g. +1 555-123-4567).'
              : linkType === 'email'
              ? 'Enter email address (e.g. contact@yourbusiness.com).'
              : 'Full web address (e.g. https://yourbusiness.com).'
          }
        />

        {/* Active Toggle */}
        <div className="flex items-center justify-between pt-3 border-t border-[#3D2B1F]">
          <div>
            <label className="text-xs font-bold text-[#FBF9F5] block">Link Visibility</label>
            <p className="text-[11px] text-[#9E8E81]">
              {isActive ? 'Visible on your public profile' : 'Hidden from customers'}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isActive}
            onClick={() => setIsActive(!isActive)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#D49B5B]/30 ${
              isActive ? 'bg-[#D49B5B]' : 'bg-[#2E1F15] border border-[#3D2B1F]'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                isActive ? 'translate-x-5 bg-[#140D08]' : 'translate-x-0 bg-[#9E8E81]'
              }`}
            />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#3D2B1F]">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
            {isEditingExisting ? 'Save Changes' : 'Add Link'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
