import React, { useRef, useState, useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/common/Button';
import {
  copyToClipboard,
  getPublicBaseUrl,
  getPublicBusinessUrl,
  getInternalBusinessPath,
  isLocalEnvironment,
  isPlaceholderDomain,
} from '@/lib/utils';
import { Copy, Check, Download, ExternalLink, QrCode, Globe, Wifi } from 'lucide-react';

interface QRCodeCardProps {
  slug: string;
  businessName: string;
  size?: number;
}

export const QRCodeCard: React.FC<QRCodeCardProps> = ({
  slug,
  businessName,
  size = 200,
}) => {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  // Check environment & base URLs
  const isLocal = isLocalEnvironment();
  const configuredEnvUrl = (import.meta.env.VITE_PUBLIC_APP_URL || import.meta.env.VITE_APP_URL || '').trim();
  const hasRealConfiguredDomain = Boolean(configuredEnvUrl && !isPlaceholderDomain(configuredEnvUrl));
  const defaultPublicBase = getPublicBaseUrl();
  const localHostOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';

  // In local development: default to 'local' (so it always works) unless a real custom domain is configured
  const [urlMode, setUrlMode] = useState<'configured' | 'local'>(
    hasRealConfiguredDomain ? 'configured' : 'local'
  );

  // Active base URL depending on mode
  const activeBaseUrl = useMemo(() => {
    if (isLocal && urlMode === 'local') {
      return localHostOrigin;
    }
    return defaultPublicBase;
  }, [isLocal, urlMode, defaultPublicBase, localHostOrigin]);

  // Unified public URL used across QR, Copy, Open, and Downloads
  const publicUrl = useMemo(() => {
    return getPublicBusinessUrl(slug, activeBaseUrl);
  }, [slug, activeBaseUrl]);

  const handleCopy = async () => {
    const success = await copyToClipboard(publicUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadPNG = () => {
    const canvas = document.createElement('canvas');
    const qrSvg = qrRef.current?.querySelector('svg');
    if (!qrSvg) return;

    const svgData = new XMLSerializer().serializeToString(qrSvg);
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const scale = 4; // High-res 4x
      canvas.width = size * scale;
      canvas.height = size * scale;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `${slug}-qr-code.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const downloadSVG = () => {
    const qrSvg = qrRef.current?.querySelector('svg');
    if (!qrSvg) return;

    const svgData = new XMLSerializer().serializeToString(qrSvg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.download = `${slug}-qr-code.svg`;
    downloadLink.href = url;
    downloadLink.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center text-center shadow-xs">
      <div className="flex items-center gap-2 mb-3 self-start sm:self-center">
        <QrCode className="w-5 h-5 text-sky-600" />
        <h3 className="text-base font-semibold text-slate-800">Permanent Public QR Code</h3>
      </div>

      {/* Development / Testing URL Switcher */}
      {isLocal && (
        <div className="mb-4 w-full max-w-md bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 text-xs text-left">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="font-semibold text-slate-700">QR Destination Target:</span>
            <div className="inline-flex rounded-lg bg-slate-200/70 p-0.5">
              <button
                type="button"
                onClick={() => setUrlMode('configured')}
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  urlMode === 'configured'
                    ? 'bg-white text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Production Domain
              </button>
              <button
                type="button"
                onClick={() => setUrlMode('local')}
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  urlMode === 'local'
                    ? 'bg-white text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Local / Network
              </button>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">
            {urlMode === 'configured' ? (
              <span className="flex items-center gap-1 text-sky-800">
                <Globe className="w-3 h-3 text-sky-600 shrink-0" />
                Using production domain from <code className="font-mono bg-sky-100/60 px-1 rounded">VITE_PUBLIC_APP_URL</code> ({defaultPublicBase})
              </span>
            ) : (
              <span className="flex items-center gap-1 text-slate-600">
                <Wifi className="w-3 h-3 text-emerald-600 shrink-0" />
                Using current host/network for scanning with a mobile phone on the same Wi-Fi.
              </span>
            )}
          </p>
        </div>
      )}

      {/* QR Code Container */}
      <div
        ref={qrRef}
        className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-center transition-transform hover:scale-102"
      >
        <QRCodeSVG
          value={publicUrl}
          size={size}
          level="H"
          includeMargin={false}
          imageSettings={{
            src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%230284c7" stroke="%23ffffff" stroke-width="1.5"%3E%3Ccircle cx="12" cy="12" r="10" fill="%230284c7"/%3E%3Cpath d="M8 12h8m-4-4l4 4-4 4" stroke="%23ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/%3E%3C/svg%3E',
            x: undefined,
            y: undefined,
            height: 32,
            width: 32,
            excavate: true,
          }}
        />
      </div>

      {/* URL Display Box */}
      <div className="mt-4 w-full max-w-md bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-2">
        <span className="text-xs font-mono text-slate-800 font-semibold truncate select-all">
          {publicUrl}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-white border border-transparent hover:border-slate-200 transition-all cursor-pointer"
          title="Copy URL"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 w-full max-w-md">
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={handleCopy}
          icon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          className="flex-1 min-w-[130px]"
        >
          {copied ? 'Copied URL!' : 'Copy Permanent Link'}
        </Button>

        <a
          href={getInternalBusinessPath(slug)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-w-[130px]"
        >
          <Button
            type="button"
            variant="secondary"
            size="sm"
            icon={<ExternalLink className="w-4 h-4" />}
            className="w-full"
          >
            Open Live Profile
          </Button>
        </a>
      </div>

      {/* Download Options */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-center gap-3 text-xs text-slate-500">
        <span className="font-medium text-slate-600">Download QR:</span>
        <button
          type="button"
          onClick={downloadPNG}
          className="text-sky-600 hover:text-sky-700 font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" /> High-Res PNG
        </button>
        <span className="text-slate-300">•</span>
        <button
          type="button"
          onClick={downloadSVG}
          className="text-sky-600 hover:text-sky-700 font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" /> Vector SVG
        </button>
      </div>

      <p className="mt-3 text-[11px] text-slate-400 max-w-sm">
        Permanent destination for {businessName}. Even if you change your links or information in the future, this QR code and public URL will never break.
      </p>
    </div>
  );
};
