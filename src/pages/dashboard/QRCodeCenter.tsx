import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { QRCodeCard } from '@/components/business/QRCodeCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Printer, ShieldCheck, Smartphone, Sparkles, Building2 } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Link } from 'react-router-dom';

export const QRCodeCenter: React.FC = () => {
  const { business } = useAuth();

  if (!business) {
    return (
      <div className="text-center py-20 bg-[#101D30] rounded-2xl border border-[#20344D] shadow-lg p-8 max-w-lg mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-amber-950/40 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-800/60">
          <Building2 className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-[#F8FAFC] tracking-tight">No Business Profile Found</h3>
        <p className="text-xs text-[#94A3B8] max-w-sm mx-auto mt-1 mb-5 leading-relaxed">
          Please set up your business profile first to generate your permanent QR code.
        </p>
        <Link to="/dashboard/profile">
          <Button variant="primary" size="md">Create Business Profile</Button>
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#F8FAFC] tracking-tight">QR Code Center</h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Download or print your permanent QR code for tabletop displays, stickers, or packaging.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handlePrint}
          icon={<Printer className="w-4 h-4" />}
          className="self-start sm:self-auto"
        >
          Print Display Card
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left: Main QR Card */}
        <QRCodeCard slug={business.slug} businessName={business.name} size={240} />

        {/* Right: How It Works */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">How Permanent URLs Work</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3.5 text-xs text-[#94A3B8] leading-relaxed">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-xl bg-emerald-950/40 text-emerald-300 border border-emerald-800/60 shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-[#F8FAFC] font-bold tracking-tight block">Permanent Slug & QR:</strong>
                  <p className="mt-0.5">
                    Your slug <code className="bg-[#14243A] px-1.5 py-0.5 rounded-md text-[#38BDF8] border border-[#20344D] font-mono font-semibold">/b/{business.slug}</code> is unique and immutable.
                    Even if you change links, phone, or menus later, this QR code continues to point to your profile.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-xl bg-[#14243A] text-[#38BDF8] border border-[#20344D] shrink-0 mt-0.5">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-[#F8FAFC] font-bold tracking-tight block">Instant Customer Access:</strong>
                  <p className="mt-0.5">
                    Customers scan this QR code with their mobile camera to open your mobile-optimized business profile without needing any app.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-xl bg-[#14243A] text-[#38BDF8] border border-[#20344D] shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-[#F8FAFC] font-bold tracking-tight block">Physical Cards / NFC Programming:</strong>
                  <p className="mt-0.5">
                    Platform administrators can copy your permanent public URL and encode it into physical NFC cards or tags manually.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-5 bg-[#0B1728] rounded-2xl border border-[#20344D] text-xs text-[#94A3B8] shadow-sm">
            <h4 className="font-bold text-[#F8FAFC] mb-2 tracking-tight">Display Best Practices</h4>
            <ul className="list-disc pl-4 space-y-1.5 text-[#94A3B8] leading-relaxed">
              <li>Download the Vector SVG format for large professional signage or print shop banners.</li>
              <li>Download high-resolution PNG for digital flyers, social media posts, or invoices.</li>
              <li>Place physical QR codes at reception counters, table stands, and checkout areas.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

