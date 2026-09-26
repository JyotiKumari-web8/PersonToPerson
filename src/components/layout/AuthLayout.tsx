import React from 'react';
import { Link } from 'react-router-dom';
import { Link as LinkIcon, ShieldCheck, QrCode, BarChart3, CheckCircle2, Lock } from 'lucide-react';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  activeTab?: 'login' | 'signup' | 'forgot' | 'reset';
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  children,
  activeTab = 'login',
}) => {
  return (
    <div className="min-h-screen bg-[#07111F] text-[#F8FAFC] flex flex-col justify-center py-10 sm:py-16 px-4 sm:px-6 lg:px-8 selection:bg-[#14243A] selection:text-[#38BDF8] relative overflow-hidden">
      {/* Ambient background glow & subtle engineering grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(1000px circle at 50% -10%, rgba(14, 165, 233, 0.08) 0%, transparent 65%),
            linear-gradient(to right, rgba(32, 52, 77, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(32, 52, 77, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 36px 36px, 36px 36px',
          maskImage: 'radial-gradient(ellipse 80% 65% at 50% 45%, #000 70%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 65% at 50% 45%, #000 70%, transparent 100%)',
          opacity: 0.5,
        }}
      />

      <div className="w-full max-w-6xl mx-auto relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center">
          
          {/* Left Column: Trust & Brand Showcase (Desktop only) */}
          <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col justify-center pr-4">
            {/* Brand Logo */}
            <Link to="/" className="inline-flex items-center gap-3 mb-6 group w-fit">
              <div className="w-11 h-11 rounded-2xl bg-[#0EA5E9] text-white flex items-center justify-center font-bold shadow-xs group-hover:bg-[#0284C7] transition-all">
                <LinkIcon className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-[#F8FAFC] text-2xl tracking-tight">
                PersonToPerson
              </span>
            </Link>

            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14243A] border border-[#20344D] text-[#38BDF8] text-xs font-bold w-fit mb-4">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0EA5E9]" />
              <span>Permanent Business URL Architecture</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl xl:text-4xl font-extrabold text-[#F8FAFC] tracking-tight leading-tight mb-4">
              One permanent link for all your customer interactions.
            </h1>

            <p className="text-sm text-[#94A3B8] leading-relaxed mb-8 max-w-xl">
              Never reprint your QR tabletop cards or re-program NFC cards again. Your permanent public link routes customers to your latest dynamic links, contact methods, and menus in real time.
            </p>

            {/* 3 Pillars of Trust */}
            <div className="space-y-4 mb-8 max-w-lg">
              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#101D30] border border-[#20344D] shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-[#14243A] text-[#38BDF8] border border-[#20344D] flex items-center justify-center shrink-0 mt-0.5">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#F8FAFC]">Immutable QR & NFC URL</h4>
                  <p className="text-[11px] text-[#94A3B8] mt-0.5 leading-normal">
                    Your unique slug <code className="bg-[#14243A] text-[#38BDF8] px-1 py-0.5 rounded font-mono font-semibold">/b/:slug</code> is permanent and never breaks.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#101D30] border border-[#20344D] shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-[#14243A] text-[#38BDF8] border border-[#20344D] flex items-center justify-center shrink-0 mt-0.5">
                  <LinkIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#F8FAFC]">Live Dynamic Link Updates</h4>
                  <p className="text-[11px] text-[#94A3B8] mt-0.5 leading-normal">
                    Add or update payment links, WhatsApp chats, reservation pages, and menus in seconds without physical reprints.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#101D30] border border-[#20344D] shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-[#14243A] text-[#38BDF8] border border-[#20344D] flex items-center justify-center shrink-0 mt-0.5">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#F8FAFC]">Profile & Link Analytics</h4>
                  <p className="text-[11px] text-[#94A3B8] mt-0.5 leading-normal">
                    Track profile visits and individual link clicks directly from your dashboard.
                  </p>
                </div>
              </div>
            </div>

            {/* Live Profile Mini Preview */}
            <div className="p-4 rounded-2xl bg-[#0B1728] border border-[#20344D] shadow-md max-w-lg flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#101D30] border border-[#20344D] text-[#0EA5E9] flex items-center justify-center font-bold text-sm shrink-0">
                  P
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#F8FAFC] truncate">Example Business Profile</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#38BDF8] block truncate">
                    /b/example-business
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#101D30] border border-[#20344D] text-[10px] font-semibold text-[#38BDF8] shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                <span>Example Preview</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Dark Auth Card */}
          <div className="lg:col-span-6 xl:col-span-5 w-full max-w-md mx-auto">
            {/* Mobile Header (Hidden on Desktop) */}
            <div className="lg:hidden text-center mb-6">
              <Link to="/" className="inline-flex items-center gap-2.5 mb-3 group">
                <div className="w-10 h-10 rounded-xl bg-[#0EA5E9] text-white flex items-center justify-center font-bold shadow-xs group-hover:bg-[#0284C7] transition-all">
                  <LinkIcon className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-[#F8FAFC] text-xl tracking-tight">PersonToPerson</span>
              </Link>
              <h2 className="text-2xl font-extrabold text-[#F8FAFC] tracking-tight">{title}</h2>
              <p className="mt-1 text-xs text-[#94A3B8] max-w-xs mx-auto">
                {subtitle}
              </p>
            </div>

            {/* Desktop Card Header Title */}
            <div className="hidden lg:block mb-4">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
                <Lock className="w-3 h-3 text-[#0EA5E9]" />
                <span>Secure Authentication</span>
              </div>
              <h2 className="text-2xl font-extrabold text-[#F8FAFC] tracking-tight">{title}</h2>
              <p className="mt-0.5 text-xs text-[#94A3B8]">{subtitle}</p>
            </div>

            {/* Main Form Card */}
            <div className="bg-[#101D30] rounded-3xl border border-[#20344D] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden transition-all">
              {children}
            </div>

            {/* Security Bottom Trust Banner */}
            <div className="mt-4 flex items-center justify-center gap-2 text-center text-[11px] text-[#94A3B8]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
              <span>Secure authentication for your business account</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
