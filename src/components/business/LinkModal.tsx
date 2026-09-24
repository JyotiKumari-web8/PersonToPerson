import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { BusinessLink, LinkType } from '@/types';
import { LINK_TYPE_CONFIG } from './linkIcons';
import { isValidUrl } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    label: string;
    url: string;
    link_type: LinkType;
    is_active: boolean;
  }) => Promise<void>;
  initialLink?: BusinessLink | null;
}

export const LinkModal: React.FC<LinkModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialLink,
}) => {
  const [linkType, setLinkType] = useState<LinkType>('website');
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialLink) {
      setLinkType(initialLink.link_type);
      setLabel(initialLink.label);
      setUrl(initialLink.url);
      setIsActive(initialLink.is_active);
      setError(null);
    } else {
      setLinkType('website');
      setLabel(LINK_TYPE_CONFIG['website'].defaultLabel);
      setUrl('');
      setIsActive(true);
      setError(null);
    }
  }, [initialLink, isOpen]);

  const handleTypeChange = (type: LinkType) => {
    setLinkType(type);
    // If label was default or empty, prefill new default
    if (!label || Object.values(LINK_TYPE_CONFIG).some((cfg) => cfg.defaultLabel === label)) {
      setLabel(LINK_TYPE_CONFIG[type].defaultLabel);
    }
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
      setError(
        linkType === 'whatsapp'
          ? 'Please enter a valid phone number (with country code) or a wa.me URL.'
          : 'Please enter a valid URL (e.g. https://example.com).'
      );
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave({
        label: trimmedLabel,
        url: trimmedUrl,
        link_type: linkType,
        is_active: isActive,
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving the link.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentConfig = LINK_TYPE_CONFIG[linkType];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialLink ? 'Edit Link' : 'Add New Link'}
      description="Configure any destination link. It will update on your public page immediately."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Link Type Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Link Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(Object.keys(LINK_TYPE_CONFIG) as LinkType[]).map((type) => {
              const cfg = LINK_TYPE_CONFIG[type];
              const isSelected = linkType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleTypeChange(type)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left text-xs font-medium transition-all ${
                    isSelected
                      ? 'border-sky-500 bg-sky-50 text-sky-800 ring-2 ring-sky-200 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className={cfg.colorClass}>{cfg.icon({ className: 'w-4 h-4' })}</span>
                  <span className="truncate">{cfg.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Button Label */}
        <Input
          label="Button Label / Call to Action"
          placeholder="e.g. Reserve a Table, Pay Now, View Menu"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          required
          helperText="This is the text your customers see on the button."
        />

        {/* Destination URL */}
        <Input
          label="Destination URL"
          placeholder={currentConfig.placeholder}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          helperText={
            linkType === 'payment'
              ? 'Enter your Stripe payment link, PayPal link, or gateway checkout URL.'
              : linkType === 'whatsapp'
              ? 'Enter international phone number with country code (e.g. +14155552671) or wa.me URL.'
              : 'Include full web address (e.g. https://yourdomain.com).'
          }
        />

        {/* Active Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div>
            <label className="text-xs font-semibold text-slate-700 block">Link Status</label>
            <p className="text-[11px] text-slate-500">
              {isActive ? 'Visible on your public profile' : 'Hidden from customers'}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isActive}
            onClick={() => setIsActive(!isActive)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 ${
              isActive ? 'bg-sky-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                isActive ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
            {initialLink ? 'Save Changes' : 'Add Link'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
