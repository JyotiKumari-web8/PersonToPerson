import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/common/Button';
import {
  Link as LinkIcon,
  QrCode,
  ShieldCheck,
  MousePointerClick,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';

export const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-sky-100 selection:text-sky-800">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold shadow-xs">
              <LinkIcon className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 text-sm tracking-tight">PersonToPerson</span>
              <span className="text-[10px] text-slate-400 font-medium">Permanent Business URL</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {user ? (
              <Link to="/dashboard">
                <Button variant="primary" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    Get Started Free
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 text-center lg:text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>Single Permanent Business URL Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            One permanent link for your business.{' '}
            <span className="text-sky-600">Update your links anytime.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            The business owner creates their account, enters their business details, and adds their custom links.
            The system generates <strong>one permanent public URL</strong> and QR code that never breaks—even when you update links or business information later.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Create Business Profile
              </Button>
            </Link>

            <a
              href="/b/lumina-artisan-bistro"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                icon={<ExternalLink className="w-4 h-4" />}
              >
                View Live Demo Page
              </Button>
            </a>
          </div>

          {/* Key Checklist */}
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-600 text-left">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
              <span>Immutable, permanent URL structure</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
              <span>Dynamic link builder for any custom URL</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
              <span>Crisp high-resolution QR code generator</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
              <span>100% honest analytics without fake numbers</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive Phone Mockup */}
        <div className="flex-1 w-full max-w-sm lg:max-w-md mx-auto">
          <div className="relative rounded-3xl p-3 bg-slate-900 shadow-2xl ring-1 ring-slate-800">
            {/* Phone Screen Frame */}
            <div className="rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-inner">
              {/* Fake browser bar */}
              <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span className="truncate">persontoperson.com/b/lumina-artisan-bistro</span>
                <span className="p-0.5 rounded bg-emerald-100 text-emerald-700 text-[9px] font-bold uppercase">
                  Permanent
                </span>
              </div>

              {/* Sample Profile Content Preview */}
              <div className="p-5 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-bold text-2xl mx-auto shadow-md">
                  L
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Lumina Artisan Bistro</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Farm-to-table handcrafted dining & coffee</p>
                </div>

                <div className="space-y-2 text-left text-xs">
                  <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between font-medium">
                    <span>Explore Seasonal Menu</span>
                    <span className="text-sky-600">→</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between font-medium">
                    <span>Reserve a Table Online</span>
                    <span className="text-sky-600">→</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between font-medium">
                    <span>Leave a 5-Star Google Review</span>
                    <span className="text-sky-600">→</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between font-medium">
                    <span>Contactless Bill Payment</span>
                    <span className="text-sky-600">→</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                  Permanent Public Business Profile
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Built for Modern Local Businesses
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500">
              No bloated CRM or complex hardware. Just a reliable permanent link, QR code, and real data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Permanent Public URL</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generate <code className="bg-white px-1.5 py-0.5 rounded text-sky-700 border border-slate-200">/b/your-slug</code> once.
                It never changes, guaranteeing your printed QR codes and physical cards remain active forever.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <MousePointerClick className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Dynamic Link Builder</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Add any link: Payment destinations, WhatsApp chat, menus, Google review links, forms, or custom URLs.
                Toggle, edit, or reorder them at any time.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Vector QR & Real Analytics</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Download crisp PNG and SVG vector QR codes. Track real profile visits and individual link clicks honestly with 0 fake data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-slate-900 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-bold">
            <LinkIcon className="w-4 h-4 text-sky-400" />
            <span>PersonToPerson</span>
          </div>
          <p className="text-slate-500 text-center sm:text-right">
            Production-ready Permanent Business URL Platform.
          </p>
        </div>
      </footer>
    </div>
  );
};
