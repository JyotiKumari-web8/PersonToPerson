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
    <div className="bg-[#241810] rounded-2xl border border-[#3D2B1F] p-6 flex flex-col items-center text-center shadow-lg">
      <div className="flex items-center gap-2 mb-4 self-start sm:self-center">
        <div className="p-1.5 rounded-xl bg-[#2E1F15] text-[#D49B5B] border border-[#3D2B1F]">
          <QrCode className="w-4 h-4" />
        </div>
        <h3 className="text-base font-bold text-[#FDFBF7] tracking-tight">Permanent Public QR Code</h3>
      </div>

      {/* Development / Testing URL Switcher */}
      {isLocal && (
        <div className="mb-4 w-full max-w-md bg-[#1B120B] border border-[#3D2B1F] rounded-xl p-3 text-xs text-left">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="font-semibold text-[#E6D7C8]">QR Destination:</span>
            <div className="inline-flex rounded-lg bg-[#2E1F15] p-0.5 border border-[#3D2B1F]">
              <button
                type="button"
                onClick={() => setUrlMode('configured')}
                className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  urlMode === 'configured'
                    ? 'bg-[#241810] text-[#D49B5B] shadow-xs font-bold border border-[#3D2B1F]'
                    : 'text-[#BFA08A] hover:text-[#FDFBF7]'
                }`}
              >
                Production Domain
              </button>
              <button
                type="button"
                onClick={() => setUrlMode('local')}
                className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  urlMode === 'local'
                    ? 'bg-[#241810] text-[#D49B5B] shadow-xs font-bold border border-[#3D2B1F]'
                    : 'text-[#BFA08A] hover:text-[#FDFBF7]'
                }`}
              >
                Local / Network
              </button>
            </div>
          </div>
          <p className="text-[11px] text-[#BFA08A] leading-snug">
            {urlMode === 'configured' ? (
              <span className="flex items-center gap-1.5 text-[#E6D7C8]">
                <Globe className="w-3 h-3 text-[#D49B5B] shrink-0" />
                Using production domain ({defaultPublicBase})
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-[#BFA08A]">
                <Wifi className="w-3 h-3 text-[#22C55E] shrink-0" />
                Using current host/network for scanning with a mobile device on the same Wi-Fi.
              </span>
            )}
          </p>
        </div>
      )}

      {/* QR Code Container (Kept clean white for 100% optical readability by physical cameras) */}
      <div
        ref={qrRef}
        className="p-5.5 bg-white rounded-2xl border-4 border-[#2E1F15] shadow-lg flex items-center justify-center transition-all duration-200"
      >
        <QRCodeSVG
          value={publicUrl}
          size={size}
          level="H"
          includeMargin={false}
          imageSettings={{
            src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23d49b5b" stroke="%23ffffff" stroke-width="1.5"%3E%3Ccircle cx="12" cy="12" r="10" fill="%23d49b5b"/%3E%3Cpath d="M8 12h8m-4-4l4 4-4 4" stroke="%23ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/%3E%3C/svg%3E',
            x: undefined,
            y: undefined,
            height: 32,
            width: 32,
            excavate: true,
          }}
        />
      </div>

      {/* URL Display Box */}
      <div className="mt-4 w-full max-w-md bg-[#1B120B] border border-[#3D2B1F] rounded-xl p-3 flex items-center justify-between gap-2 shadow-inner">
        <span className="text-xs font-mono text-[#D49B5B] font-semibold truncate select-all">
          {publicUrl}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 p-1.5 rounded-lg text-[#BFA08A] hover:text-[#D49B5B] hover:bg-[#2E1F15] border border-transparent hover:border-[#3D2B1F] transition-all cursor-pointer"
          title="Copy URL"
        >
          {copied ? <Check className="w-4 h-4 text-[#22C55E]" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 w-full max-w-md">
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
      <div className="mt-4 pt-3.5 border-t border-[#3D2B1F] flex items-center justify-center gap-3 text-xs text-[#BFA08A]">
        <span className="font-semibold text-[#E6D7C8]">Download QR:</span>
        <button
          type="button"
          onClick={downloadPNG}
          className="text-[#D49B5B] hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" /> High-Res PNG
        </button>
        <span className="text-[#3D2B1F]">•</span>
        <button
          type="button"
          onClick={downloadSVG}
          className="text-[#D49B5B] hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" /> Vector SVG
        </button>
      </div>

      <p className="mt-3 text-[11px] text-[#BFA08A] max-w-sm leading-normal">
        Permanent destination for {businessName}. Even if you update your destination links in the future, this QR code continues directing visitors to your permanent public profile.
      </p>
    </div>
  );
};

