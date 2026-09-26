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
    <div className="min-h-screen bg-[#07111F] text-[#F8FAFC] flex flex-col selection:bg-[#14243A] selection:text-[#38BDF8]">
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Business Prompt if no business profile exists yet */}
        {!business ? (
          <div className="mb-6 p-4.5 rounded-2xl bg-[#101D30] border border-[#20344D] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 bg-[#14243A] text-[#38BDF8] border border-[#20344D] rounded-xl shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#F8FAFC] tracking-tight">
                  Business Profile Setup Needed
                </h4>
                <p className="text-xs text-[#94A3B8] leading-normal mt-0.5">
                  Create your business profile to generate your single permanent public URL and QR code.
                </p>
              </div>
            </div>
            <Link
              to="/dashboard/profile"
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-[#0EA5E9] hover:bg-[#0284C7] rounded-xl shadow-xs transition-all shrink-0 border border-[#0EA5E9]"
            >
              Set Up Profile Now
            </Link>
          </div>
        ) : (
          /* Permanent URL Highlight Banner */
          <div className="mb-6 relative overflow-hidden bg-[#0B1728] border border-[#20344D] rounded-2xl p-5 text-white shadow-sm">
            {/* Background subtle radial glow */}
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-[#0EA5E9]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-[#101D30] text-[#38BDF8] border border-[#20344D] px-2.5 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3 text-[#0EA5E9]" />
                    <span>Single Permanent URL</span>
                  </span>
                  <span className="text-[11px] text-[#94A3B8] font-medium">
                    Never changes, even when updating links
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs sm:text-sm font-semibold text-[#F8FAFC] truncate bg-[#101D30] px-3.5 py-1.5 rounded-xl border border-[#20344D] select-all">
                    {publicUrl}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap shrink-0">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#101D30] hover:bg-[#14243A] text-[#F8FAFC] border border-[#20344D] hover:border-[#38BDF8]/40 transition-all cursor-pointer shadow-2xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#22C55E]" /> : <Copy className="w-3.5 h-3.5 text-[#94A3B8]" />}
                  <span>{copied ? 'Copied URL!' : 'Copy Link'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowQRModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#101D30] hover:bg-[#14243A] text-[#F8FAFC] border border-[#20344D] hover:border-[#38BDF8]/40 transition-all cursor-pointer shadow-2xs"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#94A3B8]" />
                  <span>View QR</span>
                </button>

                <a
                  href={getInternalBusinessPath(business.slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white shadow-xs transition-all border border-[#0EA5E9]"
                >
                  <span>Open Profile</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white/90" />
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

