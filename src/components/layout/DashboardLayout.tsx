import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { useAuth } from '@/context/AuthContext';
import { copyToClipboard, getPublicBusinessUrl, getInternalBusinessPath } from '@/lib/utils';
import { Copy, Check, ExternalLink, QrCode, AlertCircle, Building2 } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Business Prompt if no business profile exists yet */}
        {!business ? (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 text-amber-800 rounded-lg shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-amber-900">
                  Business Profile Setup Needed
                </h4>
                <p className="text-xs text-amber-700">
                  Create your business profile to generate your single permanent public URL and QR code.
                </p>
              </div>
            </div>
            <Link
              to="/dashboard/profile"
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition-colors shrink-0"
            >
              Set Up Profile Now
            </Link>
          </div>
        ) : (
          /* Permanent URL Highlight Banner */
          <div className="mb-6 bg-linear-to-r from-sky-600 to-blue-700 rounded-2xl p-4 sm:p-5 text-white shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 text-sky-100 px-2 py-0.5 rounded-full">
                    Single Permanent URL
                  </span>
                  <span className="text-[11px] text-sky-200">
                    Never changes, even when updating links
                  </span>
                </div>
                <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-sm sm:text-base font-semibold text-white truncate bg-black/15 px-3 py-1 rounded-lg border border-white/10">
                    {publicUrl}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap shrink-0">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied URL!' : 'Copy Link'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowQRModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>View QR</span>
                </button>

                <a
                  href={getInternalBusinessPath(business.slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white text-sky-700 hover:bg-sky-50 shadow-xs transition-all"
                >
                  <span>Open Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" />
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
