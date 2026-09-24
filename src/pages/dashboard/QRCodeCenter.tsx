import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { QRCodeCard } from '@/components/business/QRCodeCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Printer, ShieldCheck, Smartphone, Sparkles } from 'lucide-react';
import { Button } from '@/components/common/Button';

export const QRCodeCenter: React.FC = () => {
  const { business } = useAuth();

  if (!business) {
    return (
      <div className="py-12 text-center text-slate-500">
        Please set up your business profile to view your permanent QR code.
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
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">QR Code Center</h1>
          <p className="text-xs text-slate-500">
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

        {/* Right: How It Works & Permanence Guarantees */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Permanent URL Guarantee</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded-md bg-emerald-50 text-emerald-600 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-slate-800">Permanent Slug & QR:</strong>
                  <p className="mt-0.5">
                    Your slug <code className="bg-slate-100 px-1 py-0.5 rounded text-sky-700">/b/{business.slug}</code> is unique and immutable.
                    Even if you change links, phone, or menus later, this QR code will always work.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded-md bg-sky-50 text-sky-600 mt-0.5">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-slate-800">Instant Customer Access:</strong>
                  <p className="mt-0.5">
                    Customers scan this QR code with their mobile camera to open your mobile-optimized business profile without needing any app.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded-md bg-purple-50 text-purple-600 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-slate-800">Physical Cards / NFC Programming:</strong>
                  <p className="mt-0.5">
                    Platform administrators can copy your permanent public URL and encode it into physical NFC cards or tags manually.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-4 bg-slate-100/70 rounded-xl border border-slate-200 text-xs text-slate-600">
            <h4 className="font-semibold text-slate-800 mb-1">Display Best Practices</h4>
            <ul className="list-disc pl-4 space-y-1 text-slate-500">
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
