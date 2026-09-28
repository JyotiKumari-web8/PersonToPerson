import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { BusinessLink, LinkType } from '@/types';
import { LINK_TYPE_CONFIG } from './linkIcons';
import { isValidUrl } from '@/lib/utils';
import { AlertCircle, Check, ArrowUpRight, Sparkles } from 'lucide-react';

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
  maxLinks?: number;
  planName?: string;
  isPrivileged?: boolean;
}

// Exact list requested by user
const ORDERED_PLATFORMS: { type: LinkType; label: string; shortLabel: string }[] = [
  { type: 'instagram', label: 'Instagram', shortLabel: 'Instagram' },
  { type: 'whatsapp', label: 'WhatsApp', shortLabel: 'WhatsApp' },
  { type: 'facebook', label: 'Facebook', shortLabel: 'Facebook' },
  { type: 'youtube', label: 'YouTube', shortLabel: 'YouTube' },
  { type: 'website', label: 'Website', shortLabel: 'Website' },
  { type: 'google_review', label: 'Google Review', shortLabel: 'Google Review' },
  { type: 'google_maps', label: 'Google Maps', shortLabel: 'Google Maps' },
  { type: 'payment', label: 'Payment', shortLabel: 'Payment' },
  { type: 'booking', label: 'Booking', shortLabel: 'Booking' },
  { type: 'menu', label: 'Menu', shortLabel: 'Menu' },
  { type: 'portfolio', label: 'Portfolio', shortLabel: 'Portfolio' },
  { type: 'admission', label: 'Admission Form', shortLabel: 'Admission Form' },
  { type: 'custom', label: 'Other', shortLabel: 'Other' },
];

/**
 * Smart URL Detector: Recognizes platform from pasted URL
 */
function detectPlatformFromUrl(inputUrl: string): { type: LinkType; defaultLabel: string } | null {
  const url = inputUrl.trim().toLowerCase();
  if (!url) return null;

  if (url.includes('instagram.com') || url.includes('instagr.am')) {
    return { type: 'instagram', defaultLabel: 'Instagram' };
  }
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return { type: 'youtube', defaultLabel: 'YouTube' };
  }
  if (url.includes('wa.me') || url.includes('whatsapp.com') || url.includes('api.whatsapp.com')) {
    return { type: 'whatsapp', defaultLabel: 'WhatsApp' };
  }
  if (url.includes('facebook.com') || url.includes('fb.watch') || url.includes('fb.me')) {
    return { type: 'facebook', defaultLabel: 'Facebook' };
  }
  if (url.includes('goo.gl/maps') || url.includes('maps.google.com') || url.includes('google.com/maps')) {
    return { type: 'google_maps', defaultLabel: 'Google Maps' };
  }
  if (url.includes('g.page') || url.includes('writereview') || (url.includes('google.com') && url.includes('review'))) {
    return { type: 'google_review', defaultLabel: 'Google Review' };
  }
  if (url.includes('paypal.me') || url.includes('stripe.com') || url.includes('razorpay') || url.includes('cash.app')) {
    return { type: 'payment', defaultLabel: 'Payment' };
  }
  if (url.includes('calendly.com') || url.includes('cal.com') || url.includes('booking')) {
    return { type: 'booking', defaultLabel: 'Booking' };
  }
  if (url.includes('menu') || url.includes('zomato.com') || url.includes('swiggy.com')) {
    return { type: 'menu', defaultLabel: 'Menu' };
  }
  if (url.includes('portfolio') || url.includes('behance.net') || url.includes('dribbble.com')) {
    return { type: 'portfolio', defaultLabel: 'Portfolio' };
  }
  if (url.includes('docs.google.com/forms') || url.includes('typeform.com') || url.includes('admission')) {
    return { type: 'admission', defaultLabel: 'Admission Form' };
  }

  return null;
}

export const LinkModal: React.FC<LinkModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialLink,
  existingLinks = [],
  maxLinks,
  planName = 'Free',
  isPrivileged = false,
}) => {
  const [linkType, setLinkType] = useState<LinkType>('instagram');
  const [url, setUrl] = useState('');
  const [label, setLabel] = useState('Instagram');
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if limit is reached for adding new active links (admin bypass)
  const activeLinksCount = existingLinks.filter((l) => l.is_active).length;
  const isLimitReached = Boolean(
    !isPrivileged && !initialLink && maxLinks && maxLinks > 0 && activeLinksCount >= maxLinks
  );

  // Helper: Determine if a platform type is already used by an active link
  const isPlatformAlreadyUsed = (type: LinkType) => {
    // EDIT MODE EXCEPTION: Its own current platform must remain selectable
    if (initialLink && initialLink.link_type === type) return false;
    // Check if any other active link has this platform type
    return existingLinks.some(
      (l) => l.is_active && l.link_type === type && l.id !== initialLink?.id
    );
  };

  useEffect(() => {
    if (!isOpen) return;

    setError(null);

    if (initialLink) {
      setLinkType(initialLink.link_type);
      setUrl(initialLink.url);
      setLabel(initialLink.label);
      setIsActive(initialLink.is_active);
    } else {
      // Find first unused platform that doesn't already have an active link
      const unused = ORDERED_PLATFORMS.find(
        (p) => !existingLinks.some((l) => l.is_active && l.link_type === p.type)
      );
      const chosenType = unused ? unused.type : 'custom';
      const defaultLbl = ORDERED_PLATFORMS.find((p) => p.type === chosenType)?.label || 'Other';

      setLinkType(chosenType);
      setUrl('');
      setLabel(defaultLbl);
      setIsActive(true);
    }
  }, [initialLink, isOpen]);

  // Handle manual platform button selection
  const handleSelectPlatform = (type: LinkType, defaultLbl: string) => {
    // Cannot select already used platform
    if (isPlatformAlreadyUsed(type)) return;
    if (type === linkType) return;

    // BUG 2: When platform changes:
    // 1. Immediately clear Destination URL.
    // 2. Reset validation state.
    // 3. Change Button Label automatically to the platform's label.
    // 4. Show an empty URL field.
    // 5. Do NOT carry old URL into new platform.
    setLinkType(type);
    setUrl('');
    setError(null);
    setLabel(defaultLbl);
  };

  // Smart URL input handler
  const handleUrlInput = (rawVal: string) => {
    setUrl(rawVal);
    setError(null);

    // Run smart URL detection on paste/type
    const detected = detectPlatformFromUrl(rawVal);
    if (detected) {
      if (detected.type === linkType) return;

      // BUG 4: If pasted URL belongs to an already-used platform:
      // Show duplicate-platform validation and prevent switching/saving.
      if (isPlatformAlreadyUsed(detected.type)) {
        setError(`A link for ${detected.defaultLabel} is already active. Duplicate platforms are not allowed.`);
        return;
      }

      // Switch to detected unused platform
      setLinkType(detected.type);
      const prevDefault = ORDERED_PLATFORMS.find((p) => p.type === linkType)?.label;
      if (!label || label === prevDefault) {
        setLabel(detected.defaultLabel);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedUrl = url.trim();
    const trimmedLabel = label.trim();

    if (!trimmedUrl) {
      setError('Please enter a destination URL.');
      return;
    }

    if (!trimmedLabel) {
      setError('Please enter a label for this link.');
      return;
    }

    // BUG 1 & BUG 4: Prevent duplicate active platform
    if (isPlatformAlreadyUsed(linkType)) {
      setError(`A link for ${selectedPlatformCfg.label} is already active. Duplicate platforms are not allowed.`);
      return;
    }

    // BUG 3: Platform-specific URL validation
    if (!isValidUrl(trimmedUrl, linkType)) {
      if (linkType === 'instagram') {
        setError('Please enter a valid Instagram URL (e.g. https://instagram.com/yourhandle).');
      } else if (linkType === 'facebook') {
        setError('Please enter a valid Facebook URL (e.g. https://facebook.com/yourpage).');
      } else if (linkType === 'youtube') {
        setError('Please enter a valid YouTube URL (e.g. https://youtube.com/@channel or https://youtu.be/...).');
      } else if (linkType === 'whatsapp') {
        setError('Please enter a valid WhatsApp link (e.g. https://wa.me/91...) or phone number.');
      } else if (linkType === 'google_maps') {
        setError('Please enter a valid Google Maps URL (e.g. https://maps.google.com/...).');
      } else if (linkType === 'google_review') {
        setError('Please enter a valid Google Review URL.');
      } else {
        setError('Please enter a valid URL (e.g. https://example.com).');
      }
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave(
        {
          link_type: linkType,
          url: trimmedUrl,
          label: trimmedLabel,
          is_active: isActive,
        },
        initialLink?.id
      );
      onClose();
    } catch (err: unknown) {
      console.error('Failed to save link:', err);
      setError(
        err instanceof Error ? err.message : 'Please enter a valid link.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPlatformCfg = ORDERED_PLATFORMS.find((p) => p.type === linkType) || ORDERED_PLATFORMS[0];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialLink ? 'Edit Link' : 'Add Link'}
      description="Select platform, paste destination URL, and save."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 text-xs bg-rose-950/40 text-rose-300 border border-rose-800/60 rounded-xl leading-relaxed">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* Plan Limit Warning (Only shown to normal business owners when limit reached) */}
        {isLimitReached && (
          <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl text-xs text-amber-200 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-400">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Plan Limit Reached ({activeLinksCount} / {maxLinks})</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#DDD3CA]">
              Your current <strong className="text-[#FBF9F5]">{planName}</strong> plan allows up to{' '}
              {maxLinks} active links. Contact Admin to upgrade your plan.
            </p>
          </div>
        )}

        {/* Step 1: Select Platform — Large, Mobile-First Touch Targets */}
        <div>
          <label className="block text-[11px] font-bold text-[#DDD3CA] uppercase tracking-wider mb-2">
            1. Select Platform
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
            {ORDERED_PLATFORMS.map((platform) => {
              const isSelected = linkType === platform.type;
              const cfg = LINK_TYPE_CONFIG[platform.type] || LINK_TYPE_CONFIG.custom;
              const isAlreadyAdded = isPlatformAlreadyUsed(platform.type);

              return (
                <button
                  key={platform.type}
                  type="button"
                  disabled={isAlreadyAdded}
                  onClick={() => !isAlreadyAdded && handleSelectPlatform(platform.type, platform.label)}
                  className={`flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl border text-left transition-all min-h-[48px] select-none ${
                    isAlreadyAdded
                      ? 'opacity-40 cursor-not-allowed border-[#2E1F15] bg-[#140D08]/60 text-[#7A6B5D]'
                      : isSelected
                      ? 'border-[#D49B5B] bg-[#2E1F15] text-[#FBF9F5] ring-2 ring-[#D49B5B]/30 shadow-xs font-bold cursor-pointer'
                      : 'border-[#3D2B1F] bg-[#1B120B] text-[#DDD3CA] hover:border-[#D49B5B]/50 hover:bg-[#241810] cursor-pointer'
                  }`}
                >
                  <div className="shrink-0">
                    {cfg.icon({ className: `w-4 h-4 ${isAlreadyAdded ? 'text-[#7A6B5D]' : 'text-[#D49B5B]'}` })}
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="text-xs truncate block">{platform.shortLabel}</span>
                    {isAlreadyAdded && (
                      <span className="text-[10px] text-[#A8988B] block font-medium">Already Added</span>
                    )}
                  </div>

                  {isSelected && !isAlreadyAdded && (
                    <div className="w-2 h-2 rounded-full bg-[#D49B5B] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Paste URL with Smart Detection */}
        <div>
          <label className="block text-[11px] font-bold text-[#DDD3CA] uppercase tracking-wider mb-1.5">
            2. Destination URL
          </label>
          <Input
            placeholder={
              linkType === 'whatsapp'
                ? 'https://wa.me/919876543210'
                : linkType === 'instagram'
                ? 'https://instagram.com/yourhandle'
                : linkType === 'facebook'
                ? 'https://facebook.com/yourpage'
                : linkType === 'youtube'
                ? 'https://youtube.com/@yourchannel'
                : 'Paste URL here (e.g. https://...)'
            }
            value={url}
            onChange={(e) => handleUrlInput(e.target.value)}
            required
            helperText="Paste destination link. URL is validated for the selected platform."
          />
        </div>

        {/* Step 3: Button Label */}
        <div>
          <label className="block text-[11px] font-bold text-[#DDD3CA] uppercase tracking-wider mb-1.5">
            3. Button Label
          </label>
          <Input
            placeholder="e.g. Instagram, WhatsApp, Our Menu"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            required
            helperText="Short text shown on the public tile."
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#3D2B1F]">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
            className="px-5 font-bold"
          >
            {initialLink ? 'Save Changes' : 'Save Link'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
