import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { useAuth } from '@/context/AuthContext';
import { copyToClipboard, getPublicBusinessUrl, getInternalBusinessPath } from '@/lib/utils';
import { Copy, Check, ExternalLink, QrCode, Building2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Modal } from '@/components/common/Modal';
import { QRCodeCard } from '@/components/business/QRCodeCard';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { business } = useAuth();
  const [copied, setCopied] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  const publicUrl = business ? getPublicBusinessUrl(business.slug) : '';

  const handleCopy = async () => {
    if (!publicUrl) return;
    const success = await copyToClipboard(publicUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#140D08] text-[#FBF9F5] flex flex-col selection:bg-[#2E1F15] selection:text-[#D49B5B]">
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Business Prompt if no business profile exists yet */}
        {!business ? (
          <div className="mb-6 p-4.5 rounded-2xl bg-[#241810] border border-[#3D2B1F] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 bg-[#2E1F15] text-[#D49B5B] border border-[#3D2B1F] rounded-xl shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#FBF9F5] tracking-tight">
                  Business Profile Setup Needed
                </h4>
                <p className="text-xs text-[#9E8E81] leading-normal mt-0.5">
                  Create your business profile to generate your single permanent public URL and QR code.
                </p>
              </div>
            </div>
            <Link
              to="/dashboard/profile"
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-[#140D08] bg-[#D49B5B] hover:bg-[#E2B176] rounded-xl shadow-xs transition-all shrink-0 border border-[#D49B5B]"
            >
              Set Up Profile Now
            </Link>
          </div>
        ) : (
          /* Permanent URL Highlight Banner */
          <div className="mb-6 relative overflow-hidden bg-[#1B120B] border border-[#3D2B1F] rounded-2xl p-5 text-[#FBF9F5] shadow-sm">
            {/* Background subtle radial glow */}
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-[#D49B5B]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-[#241810] text-[#D49B5B] border border-[#3D2B1F] px-2.5 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3 text-[#D49B5B]" />
                    <span>Single Permanent URL</span>
                  </span>
                  <span className="text-[11px] text-[#9E8E81] font-medium">
                    Never changes, even when updating links
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs sm:text-sm font-semibold text-[#FBF9F5] truncate bg-[#241810] px-3.5 py-1.5 rounded-xl border border-[#3D2B1F] select-all">
                    {publicUrl}
                  </span>
                </div>
              </div>

              {/* Action Buttons: 1 canonical spot for copy, QR, open profile */}
              <div className="flex items-center gap-2 flex-wrap shrink-0">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#241810] hover:bg-[#2E1F15] text-[#FBF9F5] border border-[#3D2B1F] hover:border-[#D49B5B]/50 transition-all cursor-pointer shadow-2xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#22C55E]" /> : <Copy className="w-3.5 h-3.5 text-[#9E8E81]" />}
                  <span>{copied ? 'Copied URL!' : 'Copy Link'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowQRModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#241810] hover:bg-[#2E1F15] text-[#FBF9F5] border border-[#3D2B1F] hover:border-[#D49B5B]/50 transition-all cursor-pointer shadow-2xs"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#9E8E81]" />
                  <span>View QR</span>
                </button>

                <a
                  href={getInternalBusinessPath(business.slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-[#D49B5B] hover:bg-[#E2B176] text-[#140D08] shadow-xs transition-all border border-[#D49B5B]"
                >
                  <span>Open Profile</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#140D08]" />
                </a>
              </div>
            </div>
          </div>
        )}

        {children}
      </main>

      {/* QR Code Quick Modal */}
      {business && (
        <Modal
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)}
          title="Permanent QR Code"
          description={`Points permanently to ${publicUrl}`}
          maxWidth="md"
        >
          <QRCodeCard slug={business.slug} businessName={business.name} size={220} />
        </Modal>
      )}
    </div>
  );
};

