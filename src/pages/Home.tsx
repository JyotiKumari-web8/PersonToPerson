import React, { useState } from 'react';
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
  CheckCircle2,
  Smartphone,
  Phone,
  Mail,
  MapPin,
  Share2,
  ChevronDown,
  Layers,
  BarChart3,
  HeartHandshake,
  Check,
  HelpCircle,
} from 'lucide-react';

const FAQS = [
  {
    question: 'Why use a permanent business URL?',
    answer:
      'A permanent business URL (/b/your-slug) gives your business a single web address to print on physical items like menus, business cards, signs, and stickers. When you need to update your phone number, menu, payment details, or social links, you can update them in your dashboard anytime without changing the printed URL or QR code.',
  },
  {
    question: 'Do customers need to install an app to view my profile?',
    answer:
      'No. Customers do not need to download or install any app. Scanning the QR code or opening the URL takes them directly to your business profile in their standard mobile browser.',
  },
  {
    question: 'Can I update my links without changing the QR code?',
    answer:
      'Yes. Your QR code encodes your permanent public URL. When you add, edit, remove, or reorder destination links from your dashboard, the changes appear on your public profile immediately.',
  },
  {
    question: 'Can I use this URL with physical cards and NFC tags?',
    answer:
      'Yes. You can write your permanent URL to standard NFC cards, digital business cards, or countertop tags. The destination links can be updated anytime while the NFC tag continues pointing to the same profile.',
  },
  {
    question: 'How do partner placements work?',
    answer:
      'Businesses can display an optional partner or sponsor banner on their profile header or footer, including the partner’s name, logo, and external link.',
  },
];

export const Home: React.FC = () => {
  const { user } = useAuth();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#140D08] flex flex-col text-[#FDFBF7] selection:bg-[#2E1F15] selection:text-[#D49B5B] font-sans relative overflow-x-hidden">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#140D08]/90 backdrop-blur-md border-b border-[#3D2B1F] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8.5 h-8.5 rounded-xl bg-[#D49B5B] text-[#140D08] flex items-center justify-center font-bold shadow-xs group-hover:bg-[#C08546] transition-all">
              <LinkIcon className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-[#FDFBF7] text-sm tracking-tight leading-tight group-hover:text-[#D49B5B] transition-colors">
                PersonToPerson
              </span>
              <span className="text-[10px] text-[#BFA08A] font-medium">
                Permanent Business URL
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#E6D7C8]">
            <a href="#why-permanent" className="hover:text-[#D49B5B] transition-colors">
              Why Permanent?
            </a>
            <a href="#how-it-works" className="hover:text-[#D49B5B] transition-colors">
              How It Works
            </a>
            <a href="#features" className="hover:text-[#D49B5B] transition-colors">
              Features
            </a>
            <a href="#faq" className="hover:text-[#D49B5B] transition-colors">
              FAQ
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            {user ? (
              <Link to="/dashboard">
                <Button variant="primary" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="font-semibold text-[#E6D7C8] hover:text-[#FDFBF7]">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    variant="primary"
                    size="sm"
                    className="font-semibold"
                  >
                    Get Started Free
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Hero Left Content */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#241810] border border-[#3D2B1F] text-[#D49B5B] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#D49B5B]" />
              <span>Single Permanent Business URL Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold text-[#FDFBF7] tracking-tight leading-[1.14]">
              One permanent link for your business.{' '}
              <span className="text-[#D49B5B]">
                Update your links anytime.
              </span>
            </h1>

            {/* Factual Product Description */}
            <p className="text-base sm:text-lg text-[#BFA08A] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Create one permanent business URL and QR code. Update your website, WhatsApp, Google Review, payment, social links and more without changing the public URL.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-1">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto font-bold px-7"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Create Business Profile
                </Button>
              </Link>

              <a
                href="#preview"
                className="w-full sm:w-auto"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto font-semibold bg-[#241810] hover:bg-[#2E1F15] border-[#3D2B1F] text-[#FDFBF7]"
                  icon={<ExternalLink className="w-4 h-4 text-[#BFA08A]" />}
                >
                  Explore Profile Preview
                </Button>
              </a>
            </div>

            {/* Factual Supporting Points */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#BFA08A] text-left border-t border-[#3D2B1F] max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D49B5B] shrink-0" />
                <span className="font-semibold text-[#FDFBF7]">One permanent public URL</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D49B5B] shrink-0" />
                <span className="font-semibold text-[#FDFBF7]">Update destination links anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D49B5B] shrink-0" />
                <span className="font-semibold text-[#FDFBF7]">QR code points to the same profile</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D49B5B] shrink-0" />
                <span className="font-semibold text-[#FDFBF7]">Customers see latest active links</span>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <CheckCircle2 className="w-4 h-4 text-[#D49B5B] shrink-0" />
                <span className="font-semibold text-[#FDFBF7]">Real visitor and link-click analytics</span>
              </div>
            </div>
          </div>

          {/* Hero Right: Product Phone Preview (Warm Cream Public Experience) */}
          <div id="preview" className="flex-1 w-full max-w-sm sm:max-w-md mx-auto scroll-mt-24">
            {/* Subtle Label Indicating Product Preview */}
            <div className="mb-3 text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#241810] border border-[#3D2B1F] shadow-2xs text-[#D49B5B] text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                Customer Mobile Experience
              </span>
            </div>

            {/* Smartphone Outer Chassis */}
            <div className="relative rounded-[40px] p-3 sm:p-3.5 bg-[#1B120B] border-2 border-[#3D2B1F] shadow-2xl shadow-black/60">
              {/* Speaker & Camera Notch */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-4 bg-[#140D08] rounded-full z-30 flex items-center justify-center gap-2 border border-[#3D2B1F]">
                <div className="w-8 h-1 rounded-full bg-[#3D2B1F]" />
                <div className="w-2 h-2 rounded-full bg-[#2E1F15]" />
              </div>

              {/* Screen Bezel (Warm Cream Customer Canvas) */}
              <div className="rounded-[28px] overflow-hidden bg-[#FAF8F5] border border-[#E8E1D5] shadow-inner flex flex-col min-h-[480px] text-[#1A120B] relative">
                {/* Mobile Browser Address Bar */}
                <div className="bg-[#F5F2EB] pt-6 pb-2 px-3.5 border-b border-[#E8E1D5] flex items-center justify-between text-[11px] text-[#5C493B] font-mono relative z-10">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-[#5C493B] font-sans text-xs">🔒</span>
                    <span className="truncate font-semibold text-[#1A120B]">persontoperson.com/b/example-business</span>
                  </div>
                  <span className="shrink-0 ml-2 px-1.5 py-0.5 rounded-full bg-white text-[#8C7767] text-[9px] font-bold tracking-wider uppercase border border-[#E8E1D5]">
                    Preview
                  </span>
                </div>

                {/* Top Partner Placement Header */}
                <div className="bg-[#FAF8F5] px-3.5 py-1.5 border-b border-[#E8E1D5] flex items-center justify-between text-[10px] text-[#5C493B] relative z-10">
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase text-[#8C531B]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D49B5B]" />
                    Partner
                  </span>
                  <span className="font-semibold text-[#1A120B] truncate">
                    Example Partner Placement
                  </span>
                </div>

                {/* Digital Card Screen Content */}
                <div className="text-center flex-1 flex flex-col justify-between p-4 relative z-10 bg-[#FAF8F5]">
                  <div>
                    {/* Business Logo with Luxury Bezel */}
                    <div className="w-16 h-16 rounded-2xl bg-white ring-2 ring-[#FAF8F5] border border-[#E8E1D5] shadow-sm p-0.5 mx-auto flex items-center justify-center">
                      <div className="w-full h-full rounded-[13px] bg-[#D49B5B] text-[#140D08] flex items-center justify-center font-black text-2xl shadow-inner">
                        P
                      </div>
                    </div>

                    {/* Brand Info */}
                    <div className="mt-2.5">
                      <h3 className="font-extrabold text-[#1A120B] text-base tracking-tight">
                        Example Business Profile
                      </h3>
                      <p className="text-[11px] text-[#8C531B] mt-0.5 font-medium flex items-center justify-center gap-1">
                        <span>Local Business</span>
                        <span className="text-[#8C7767]/60">•</span>
                        <span className="text-[#5C493B]">City, State</span>
                      </p>
                      <p className="text-[11px] text-[#5C493B] mt-1 line-clamp-1 leading-snug">
                        Add your business description, announcements, and hours here
                      </p>
                    </div>

                    {/* 4 Quick Action Controls */}
                    <div className="grid grid-cols-4 gap-2 mt-3.5 pt-3 border-t border-[#E8E1D5] text-[#1A120B] max-w-[260px] mx-auto">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-9.5 h-9.5 rounded-xl bg-white border border-[#E8E1D5] flex items-center justify-center text-[#1A120B] shadow-2xs hover:bg-[#FAF0E6] transition-colors">
                          <Phone className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[9px] font-bold text-[#5C493B] uppercase tracking-wider">Call</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-9.5 h-9.5 rounded-xl bg-white border border-[#E8E1D5] flex items-center justify-center text-[#1A120B] shadow-2xs hover:bg-[#FAF0E6] transition-colors">
                          <Mail className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[9px] font-bold text-[#5C493B] uppercase tracking-wider">Email</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-9.5 h-9.5 rounded-xl bg-white border border-[#E8E1D5] flex items-center justify-center text-[#1A120B] shadow-2xs hover:bg-[#FAF0E6] transition-colors">
                          <MapPin className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[9px] font-bold text-[#5C493B] uppercase tracking-wider">Map</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-9.5 h-9.5 rounded-xl bg-white border border-[#E8E1D5] flex items-center justify-center text-[#1A120B] shadow-2xs hover:bg-[#FAF0E6] transition-colors">
                          <Share2 className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[9px] font-bold text-[#5C493B] uppercase tracking-wider">Share</span>
                      </div>
                    </div>

                    {/* Dynamic Links Preview */}
                    <div className="space-y-1.5 text-left text-xs mt-3.5">
                      {/* Featured Link */}
                      <div className="p-2.5 rounded-xl border-2 border-[#D49B5B] bg-white text-[#1A120B] flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-2.5 truncate">
                          <div className="w-7 h-7 rounded-lg bg-[#FAF8F5] border border-[#E8E1D5] flex items-center justify-center text-xs shrink-0 shadow-inner">
                            📋
                          </div>
                          <div className="truncate">
                            <span className="font-bold block text-[11.5px] leading-tight truncate text-[#1A120B]">
                              Menu &amp; Price Catalog
                            </span>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-[#8C531B] flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5 text-[#D49B5B]" />
                              Featured Link
                            </span>
                          </div>
                        </div>
                        <span className="text-[#8C531B] font-bold text-xs shrink-0 ml-1">→</span>
                      </div>

                      {/* Regular Link 1 */}
                      <div className="p-2.5 rounded-xl border border-[#E8E1D5] bg-white hover:border-[#D49B5B] text-[#1A120B] flex items-center justify-between shadow-2xs transition-colors">
                        <div className="flex items-center gap-2.5 truncate">
                          <div className="w-7 h-7 rounded-lg bg-[#FAF8F5] border border-[#E8E1D5] flex items-center justify-center text-xs shrink-0 shadow-inner">
                            ⭐
                          </div>
                          <div className="truncate">
                            <span className="font-bold block text-[11.5px] leading-tight truncate text-[#1A120B]">
                              Google Business Profile
                            </span>
                            <span className="text-[9px] text-[#5C493B]">
                              Reviews &amp; Ratings
                            </span>
                          </div>
                        </div>
                        <span className="text-[#8C7767] font-bold text-xs shrink-0 ml-1">→</span>
                      </div>

                      {/* Regular Link 2 */}
                      <div className="p-2.5 rounded-xl border border-[#E8E1D5] bg-white hover:border-[#D49B5B] text-[#1A120B] flex items-center justify-between shadow-2xs transition-colors">
                        <div className="flex items-center gap-2.5 truncate">
                          <div className="w-7 h-7 rounded-lg bg-[#FAF8F5] border border-[#E8E1D5] flex items-center justify-center text-xs shrink-0 shadow-inner">
                            💬
                          </div>
                          <div className="truncate">
                            <span className="font-bold block text-[11.5px] leading-tight truncate text-[#1A120B]">
                              WhatsApp Direct Message
                            </span>
                            <span className="text-[9px] text-[#5C493B]">
                              Instant Support
                            </span>
                          </div>
                        </div>
                        <span className="text-[#8C7767] font-bold text-xs shrink-0 ml-1">→</span>
                      </div>
                    </div>
                  </div>

                  {/* Profile Footer */}
                  <div className="mt-4 pt-3 border-t border-[#E8E1D5] flex items-center justify-between text-[10px] text-[#5C493B]">
                    <span className="font-mono text-[9.5px] text-[#8C531B] font-semibold">
                      persontoperson.com/b/example-business
                    </span>
                    <span className="text-[#8C7767] text-[9px] font-medium">Permanent URL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* "Why a permanent business URL matters" Comparison Section */}
      <section id="why-permanent" className="py-20 sm:py-24 bg-[#1B120B] border-y border-[#3D2B1F] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FDFBF7] tracking-tight">
              Why a permanent business URL matters
            </h2>
            <p className="mt-3 text-[#BFA08A] text-sm sm:text-base leading-relaxed">
              When business details or links change, a permanent URL ensures that printed materials and physical signage continue directing customers to the right place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Column 1: Traditional QR & Printed Links */}
            <div className="rounded-3xl p-8 bg-[#241810] border border-[#3D2B1F] shadow-sm space-y-5">
              <h3 className="font-extrabold text-[#FDFBF7] text-lg">
                Traditional QR &amp; Printed Links
              </h3>

              <ul className="space-y-4 text-xs sm:text-sm text-[#BFA08A]">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8C7767] mt-2 shrink-0" />
                  <span>Link changes can require updating printed materials</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8C7767] mt-2 shrink-0" />
                  <span>Multiple links can be difficult to manage</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8C7767] mt-2 shrink-0" />
                  <span>Customers may not always find the latest information</span>
                </li>
              </ul>
            </div>

            {/* Column 2: PersonToPerson */}
            <div className="rounded-3xl p-8 bg-[#2E1F15] border border-[#D49B5B]/40 shadow-lg space-y-5 relative">
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#1B120B] text-[#D49B5B] border border-[#3D2B1F] text-[10px] font-bold uppercase tracking-wider">
                Permanent Business URL
              </div>

              <h3 className="font-extrabold text-[#FDFBF7] text-lg">
                PersonToPerson
              </h3>

              <ul className="space-y-4 text-xs sm:text-sm text-[#FDFBF7]">
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-[#D49B5B] shrink-0 mt-0.5" />
                  <span>One permanent public URL</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-[#D49B5B] shrink-0 mt-0.5" />
                  <span>Update destination links anytime</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-[#D49B5B] shrink-0 mt-0.5" />
                  <span>QR code continues pointing to the same profile</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-[#D49B5B] shrink-0 mt-0.5" />
                  <span>Customers see the latest active links</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (3-Step Visual Architecture) */}
      <section id="how-it-works" className="py-20 sm:py-24 bg-[#140D08] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#241810] border border-[#3D2B1F] text-[#E6D7C8] text-xs font-semibold mb-3">
              <Layers className="w-4 h-4 text-[#D49B5B]" />
              <span>Simple 3-Step Setup</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FDFBF7] tracking-tight">
              How PersonToPerson Works
            </h2>
            <p className="mt-3 text-[#BFA08A] text-sm sm:text-base leading-relaxed">
              From account creation to physical deployment in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative p-8 rounded-3xl bg-[#241810] border border-[#3D2B1F] shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#2E1F15] text-[#D49B5B] font-extrabold text-lg flex items-center justify-center border border-[#3D2B1F] shadow-xs">
                01
              </div>
              <h3 className="text-lg font-bold text-[#FDFBF7] tracking-tight">
                Claim Your Permanent Slug
              </h3>
              <p className="text-xs sm:text-sm text-[#BFA08A] leading-relaxed">
                Choose your business handle like <code className="bg-[#2E1F15] px-1.5 py-0.5 rounded text-[#D49B5B] font-mono font-semibold border border-[#3D2B1F]">/b/your-brand</code>.
                Add your business details, contact options, brand logo, and initial destination links.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-8 rounded-3xl bg-[#241810] border border-[#3D2B1F] shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#2E1F15] text-[#D49B5B] font-extrabold text-lg flex items-center justify-center border border-[#3D2B1F] shadow-xs">
                02
              </div>
              <h3 className="text-lg font-bold text-[#FDFBF7] tracking-tight">
                Print or Share Once
              </h3>
              <p className="text-xs sm:text-sm text-[#BFA08A] leading-relaxed">
                Download your high-resolution QR code for table stands, menus, and window stickers, or write the URL to contactless NFC cards.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-8 rounded-3xl bg-[#241810] border border-[#3D2B1F] shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#2E1F15] text-[#D49B5B] font-extrabold text-lg flex items-center justify-center border border-[#3D2B1F] shadow-xs">
                03
              </div>
              <h3 className="text-lg font-bold text-[#FDFBF7] tracking-tight">
                Update Links Anytime
              </h3>
              <p className="text-xs sm:text-sm text-[#BFA08A] leading-relaxed">
                Whenever you change menus, phone numbers, payment handles, or promotions, update them from your dashboard. Customers always see your latest active links.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Capabilities Grid */}
      <section id="features" className="py-20 sm:py-24 bg-[#1B120B] border-t border-[#3D2B1F] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FDFBF7] tracking-tight">
              Platform Features
            </h2>
            <p className="mt-3 text-[#BFA08A] text-sm sm:text-base leading-relaxed">
              Designed to connect physical footfall to your active digital destinations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-7 rounded-3xl border border-[#3D2B1F] bg-[#241810] space-y-3.5 shadow-sm">
              <div className="w-11 h-11 rounded-2xl bg-[#2E1F15] text-[#D49B5B] flex items-center justify-center font-bold border border-[#3D2B1F] shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#FDFBF7] tracking-tight">
                Permanent Public URL
              </h3>
              <p className="text-xs text-[#BFA08A] leading-relaxed">
                Generate <code className="bg-[#2E1F15] px-1.5 py-0.5 rounded text-[#D49B5B] border border-[#3D2B1F] font-mono font-semibold">/b/your-slug</code> once. Your public web address remains consistent across all physical touchpoints.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-7 rounded-3xl border border-[#3D2B1F] bg-[#241810] space-y-3.5 shadow-sm">
              <div className="w-11 h-11 rounded-2xl bg-[#2E1F15] text-[#D49B5B] flex items-center justify-center font-bold border border-[#3D2B1F] shadow-xs">
                <MousePointerClick className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#FDFBF7] tracking-tight">
                Dynamic Link Management
              </h3>
              <p className="text-xs text-[#BFA08A] leading-relaxed">
                Add, toggle, edit, or reorder custom links: menus, WhatsApp chat, Google review links, forms, or payment destinations.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-7 rounded-3xl border border-[#3D2B1F] bg-[#241810] space-y-3.5 shadow-sm">
              <div className="w-11 h-11 rounded-2xl bg-[#2E1F15] text-[#D49B5B] flex items-center justify-center font-bold border border-[#3D2B1F] shadow-xs">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#FDFBF7] tracking-tight">
                Vector QR &amp; NFC Ready
              </h3>
              <p className="text-xs text-[#BFA08A] leading-relaxed">
                Download high-resolution SVG and PNG QR codes suitable for physical printing, or program the URL directly onto NFC smart cards.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-7 rounded-3xl border border-[#3D2B1F] bg-[#241810] space-y-3.5 shadow-sm">
              <div className="w-11 h-11 rounded-2xl bg-[#2E1F15] text-[#D49B5B] flex items-center justify-center font-bold border border-[#3D2B1F] shadow-xs">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#FDFBF7] tracking-tight">
                Visitor &amp; Link-Click Analytics
              </h3>
              <p className="text-xs text-[#BFA08A] leading-relaxed">
                Monitor profile visits and click events on individual destination links from your business owner dashboard.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-7 rounded-3xl border border-[#3D2B1F] bg-[#241810] space-y-3.5 shadow-sm">
              <div className="w-11 h-11 rounded-2xl bg-[#2E1F15] text-[#D49B5B] flex items-center justify-center font-bold border border-[#3D2B1F] shadow-xs">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#FDFBF7] tracking-tight">
                Mobile-First Digital Profile
              </h3>
              <p className="text-xs text-[#BFA08A] leading-relaxed">
                Optimized for smartphone screens with direct actions for Phone, Email, Google Maps navigation, and sharing.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-7 rounded-3xl border border-[#3D2B1F] bg-[#241810] space-y-3.5 shadow-sm">
              <div className="w-11 h-11 rounded-2xl bg-[#2E1F15] text-[#D49B5B] flex items-center justify-center font-bold border border-[#3D2B1F] shadow-xs">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#FDFBF7] tracking-tight">
                Partner Placements
              </h3>
              <p className="text-xs text-[#BFA08A] leading-relaxed">
                Highlight local partners or sponsor organizations in header or footer placements with both image upload and image URL support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="py-20 sm:py-24 bg-[#140D08] border-t border-[#3D2B1F] relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#241810] border border-[#3D2B1F] text-[#E6D7C8] text-xs font-semibold mb-3">
              <HelpCircle className="w-4 h-4 text-[#D49B5B]" />
              <span>Questions &amp; Answers</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FDFBF7] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-[#BFA08A] text-sm sm:text-base leading-relaxed">
              Common questions about permanent URLs, QR codes, and profile management.
            </p>
          </div>

          <div className="space-y-3.5">
            {FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-[#3D2B1F] bg-[#241810] overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 font-bold text-[#FDFBF7] text-sm sm:text-base hover:text-[#D49B5B] transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#BFA08A] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#D49B5B]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-[#E6D7C8] leading-relaxed border-t border-[#3D2B1F]">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Closing CTA Section */}
      <section className="py-20 bg-[#1B120B] border-t border-[#3D2B1F] text-[#FDFBF7] relative z-10 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#FDFBF7] leading-tight">
            One permanent link for your business.
          </h2>

          <p className="text-[#BFA08A] text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Create your profile and start sharing your permanent business URL and QR code.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto font-bold px-8"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Create Business Profile
              </Button>
            </Link>

            <a
              href="#preview"
              className="w-full sm:w-auto"
            >
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto font-semibold bg-[#241810] hover:bg-[#2E1F15] text-[#FDFBF7] border-[#3D2B1F]"
                icon={<ExternalLink className="w-4 h-4 text-[#BFA08A]" />}
              >
                Explore Profile Preview
              </Button>
            </a>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-[#BFA08A]">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#D49B5B]" /> One permanent public URL
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#D49B5B]" /> Update links anytime
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#D49B5B]" /> No app required for visitors
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 bg-[#140D08] text-[#BFA08A] text-xs border-t border-[#3D2B1F] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-[#3D2B1F]">
            {/* Brand column */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2.5 text-[#FDFBF7] font-extrabold text-sm">
                <div className="w-7 h-7 rounded-lg bg-[#D49B5B] text-[#140D08] flex items-center justify-center font-bold shadow-xs">
                  <LinkIcon className="w-3.5 h-3.5 text-[#140D08]" />
                </div>
                <span>PersonToPerson</span>
              </div>
              <p className="text-[#BFA08A] text-xs max-w-sm leading-relaxed">
                Permanent business URL and dynamic link platform for physical and local businesses.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-[#FDFBF7] text-xs uppercase tracking-wider">Navigation</h4>
              <ul className="space-y-2 text-[#BFA08A]">
                <li>
                  <a href="#why-permanent" className="hover:text-[#D49B5B] transition-colors">
                    Why Permanent?
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-[#D49B5B] transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-[#D49B5B] transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-[#D49B5B] transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#preview" className="hover:text-[#D49B5B] transition-colors">
                    Example Profile Preview
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#8C7767] text-[11px]">
            <p>© {new Date().getFullYear()} PersonToPerson. All rights reserved.</p>
            <p>Single Permanent Business URL Platform.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

