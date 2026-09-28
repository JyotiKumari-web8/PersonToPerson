import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LinkType } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Validates whether a given string is a valid URL or phone/email format
 */
export function isValidUrl(urlString: string, type?: LinkType): boolean {
  if (!urlString || typeof urlString !== 'string') return false;
  const trimmed = urlString.trim();

  if (type === 'call') {
    if (trimmed.startsWith('tel:')) return trimmed.length > 4;
    return /^\+?[0-9\s-()]{7,20}$/.test(trimmed);
  }

  if (type === 'email') {
    const clean = trimmed.replace(/^mailto:/i, '');
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean);
  }

  if (type === 'whatsapp') {
    // Can be wa.me link, api.whatsapp.com, chat/web whatsapp, or international phone number
    if (/^(https?:\/\/)?(wa\.me|api\.whatsapp\.com|chat\.whatsapp\.com|web\.whatsapp\.com)\/.+/i.test(trimmed)) {
      return true;
    }
    if (/^\+?[0-9\s-]{7,16}$/.test(trimmed)) {
      return true;
    }
    return false;
  }

  // URL parsing helper for web-based platforms
  let parsed: URL;
  try {
    const withProtocol = trimmed.startsWith('http://') || trimmed.startsWith('https://')
      ? trimmed
      : `https://${trimmed}`;
    parsed = new URL(withProtocol);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return false;
    }
  } catch {
    return false;
  }

  const host = parsed.hostname.toLowerCase();
  const path = parsed.pathname.toLowerCase();

  if (type === 'instagram') {
    const isInsta = host === 'instagram.com' || host.endsWith('.instagram.com') || host === 'instagr.am' || host.endsWith('.instagr.am');
    return isInsta && (path.length > 1 || parsed.search.length > 1);
  }

  if (type === 'facebook') {
    return (
      host === 'facebook.com' ||
      host.endsWith('.facebook.com') ||
      host === 'fb.com' ||
      host.endsWith('.fb.com') ||
      host === 'fb.watch' ||
      host.endsWith('.fb.watch') ||
      host === 'fb.me' ||
      host.endsWith('.fb.me')
    );
  }

  if (type === 'youtube') {
    return (
      host === 'youtube.com' ||
      host.endsWith('.youtube.com') ||
      host === 'youtu.be' ||
      host.endsWith('.youtu.be')
    );
  }

  if (type === 'google_maps') {
    const isMapsHost =
      host === 'maps.google.com' ||
      host.endsWith('.maps.google.com') ||
      host === 'maps.app.goo.gl' ||
      (host === 'goo.gl' && path.startsWith('/maps'));
    const isGoogleMapsPath =
      (host === 'google.com' || host.endsWith('.google.com')) &&
      (path.startsWith('/maps') || parsed.search.toLowerCase().includes('maps'));
    return isMapsHost || isGoogleMapsPath;
  }

  if (type === 'google_review') {
    const isGPage = host === 'g.page' || host.endsWith('.g.page');
    const isGoogle = host === 'google.com' || host.endsWith('.google.com') || host === 'goo.gl' || host.endsWith('.goo.gl');
    const hasReview = path.includes('review') || parsed.search.toLowerCase().includes('review') || path.includes('/local/writereview');
    return isGPage || (isGoogle && hasReview) || isGoogle;
  }

  // Standard web links for website, payment, booking, menu, portfolio, admission, custom
  return true;
}

/**
 * Normalizes input URL so it's guaranteed to work when clicked externally
 */
export function normalizeUrl(url: string, type?: LinkType): string {
  const trimmed = url.trim();

  if (type === 'call') {
    if (trimmed.startsWith('tel:')) return trimmed;
    const cleanNumber = trimmed.replace(/[^\d+]/g, '');
    return `tel:${cleanNumber}`;
  }

  if (type === 'email') {
    if (trimmed.toLowerCase().startsWith('mailto:')) return trimmed;
    return `mailto:${trimmed}`;
  }

  if (type === 'whatsapp') {
    if (trimmed.startsWith('https://wa.me/') || trimmed.startsWith('http://wa.me/')) {
      return trimmed;
    }
    // Clean non-digits except leading +
    const cleanNumber = trimmed.replace(/[^\d+]/g, '').replace(/^\+/, '');
    if (cleanNumber) {
      return `https://wa.me/${cleanNumber}`;
    }
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

/**
 * Generates a clean, unique readable slug from a business name
 */
export function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const randomPart = Math.random().toString(36).substring(2, 8);
  return `${base ? base + '-' : 'b-'}${randomPart}`;
}

/**
 * Copies text safely to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      textArea.remove();
      return successful;
    }
  } catch {
    return false;
  }
}

/**
 * Formats date into readable string
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

/**
 * Get device category for non-invasive analytics metadata
 */
export function getDeviceType(): 'mobile' | 'desktop' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop';
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

/**
 * Checks whether a URL is an unconfigured dummy placeholder (e.g. yourdomain.com, example.com)
 */
export function isPlaceholderDomain(url: string): boolean {
  if (!url) return true;
  const lower = url.toLowerCase();
  return (
    lower.includes('yourdomain.com') ||
    lower.includes('example.com') ||
    lower.includes('placeholder')
  );
}

/**
 * Resolves the configured public app base URL.
 * Priority:
 * 1. If running locally:
 *    - If VITE_PUBLIC_APP_URL is explicitly set to a REAL production domain, use it.
 *    - If VITE_PUBLIC_APP_URL is empty OR the placeholder "yourdomain.com", safely default to
 *      window.location.origin so in-app links and local phone scanning ALWAYS work!
 * 2. In production:
 *    - If VITE_PUBLIC_APP_URL is set and not a placeholder, use it.
 *    - Otherwise, use window.location.origin (which is the actual live deployed domain).
 */
export function getPublicBaseUrl(allowLocalFallback = true): string {
  const configuredEnv = (
    import.meta.env.VITE_PUBLIC_APP_URL ||
    import.meta.env.VITE_APP_URL ||
    ''
  ).trim();

  const isLocal = isLocalEnvironment();

  // If a real non-placeholder custom domain is configured, use it
  if (configuredEnv && !isPlaceholderDomain(configuredEnv)) {
    return configuredEnv.replace(/\/+$/, '');
  }

  // During local development or if running in browser, use current origin
  if (typeof window !== 'undefined' && window.location?.origin) {
    if (allowLocalFallback || isLocal || isPlaceholderDomain(configuredEnv)) {
      return window.location.origin.replace(/\/+$/, '');
    }
  }

  return configuredEnv ? configuredEnv.replace(/\/+$/, '') : 'https://person-to-person.vercel.app';
}

/**
 * Checks whether the current environment is running locally
 */
export function isLocalEnvironment(): boolean {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname;
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '[::1]' ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('10.') ||
    hostname.endsWith('.local')
  );
}

/**
 * Builds the single permanent public URL for a business slug.
 * Example: https://person-to-person.vercel.app/b/abc123 or http://localhost:5173/b/abc123
 */
export function getPublicBusinessUrl(slug: string, customBaseUrl?: string): string {
  if (!slug) return '';
  const cleanSlug = slug.trim().replace(/^\/+/g, '').replace(/^b\//, '');
  const base = (customBaseUrl ? customBaseUrl.trim() : getPublicBaseUrl()).replace(/\/+$/, '');
  return `${base}/b/${cleanSlug}`;
}

/**
 * Returns the relative in-app path for a business public page: /b/:slug
 * Guaranteed to open the business profile within the current running app.
 */
export function getInternalBusinessPath(slug: string): string {
  if (!slug) return '';
  const cleanSlug = slug.trim().replace(/^\/+/g, '').replace(/^b\//, '');
  return `/b/${cleanSlug}`;
}
