import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, ExternalLink, Copy, Check, Smartphone, ShieldCheck, QrCode } from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';

interface UpiPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  upiId: string;
  businessName: string;
  upiUri: string;
}

export const UpiPaymentModal: React.FC<UpiPaymentModalProps> = ({
  isOpen,
  onClose,
  upiId,
  businessName,
  upiUri,
}) => {
  const [copied, setCopied] = useState(false);

  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    const success = await copyToClipboard(upiId);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="upi-modal-title"
    >
      <div className="relative w-full max-w-sm rounded-3xl bg-[#FFFDF9] border border-[#E8DCCB] shadow-2xl p-5 sm:p-6 text-center text-[#2B1A12] animate-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#8C7767] hover:text-[#2B1A12] hover:bg-[#F0E6D8] transition-colors cursor-pointer"
          aria-label="Close payment modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Security Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF3E7] border border-[#E4D2BB] text-[#705B4D] text-[11px] font-bold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C8924A]" />
          <span>Direct UPI Payment</span>
        </div>

        {/* Header */}
        <h3 id="upi-modal-title" className="text-lg sm:text-xl font-black text-[#2B1A12] tracking-tight leading-snug">
          Pay {businessName}
        </h3>
        <p className="text-xs text-[#705B4D] mt-1 mb-4">
          Businessman's saved UPI ID is pre-filled. Enter amount in your UPI app.
        </p>

        {/* Primary Action: Launch UPI App */}
        <a
          href={upiUri}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#3A2115] via-[#4A2A1A] to-[#3A2115] text-[#FBF5EA] font-bold text-sm shadow-md hover:shadow-lg hover:from-[#4A2A1A] hover:to-[#5A3522] active:scale-[0.98] transition-all mb-4 border border-[#5A3522]/40"
        >
          <Smartphone className="w-4 h-4 text-[#D49B5B]" />
          <span>Pay via UPI App</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#D49B5B] ml-0.5" />
        </a>

        {/* QR Code Fallback Box */}
        <div className="bg-[#FAF3E7]/80 border border-[#E4D2BB]/90 rounded-2xl p-4 flex flex-col items-center shadow-inner mb-3.5">
          <div className="bg-white p-3 rounded-xl shadow-xs border border-[#E8DCCB] mb-2.5">
            <QRCodeSVG
              value={upiUri}
              size={180}
              level="M"
              includeMargin={false}
              className="w-40 h-40 sm:w-44 sm:h-44"
            />
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#3A2115] mb-0.5">
            <QrCode className="w-3.5 h-3.5 text-[#C8924A]" />
            <span>Scan with any UPI App</span>
          </div>
          <p className="text-[10.5px] text-[#705B4D] leading-tight">
            Google Pay • PhonePe • Paytm • BHIM • Any Bank App
          </p>
          <p className="text-[9.5px] text-[#A8988B] mt-1">
            Reliable fallback if your browser or app blocks the direct link
          </p>
        </div>

        {/* Associated Businessman UPI ID (Pre-filled, No manual typing) */}
        <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white border border-[#E8DCCB] text-left mb-3">
          <div className="min-w-0 flex-1">
            <span className="block text-[9.5px] font-bold text-[#8C7767] uppercase tracking-wider">
              Payee UPI ID (Pre-filled)
            </span>
            <span className="block text-xs font-mono font-bold text-[#2B1A12] truncate">
              {upiId}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="px-2.5 py-1.5 rounded-lg bg-[#FAF3E7] hover:bg-[#F0E6D8] border border-[#E4D2BB] text-[#3A2115] text-[11px] font-bold flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
            title="Copy UPI ID"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#C8924A]" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Safe Reassurance */}
        <p className="text-[10px] text-[#A8988B] leading-tight">
          Direct payment to {businessName}. No transaction fee or middleman.
        </p>
      </div>
    </div>
  );
};
