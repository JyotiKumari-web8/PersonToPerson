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
    <div className="min-h-screen bg-[#07111F] flex flex-col text-[#F8FAFC] selection:bg-[#14243A] selection:text-[#38BDF8] font-sans relative overflow-x-hidden">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#07111F]/90 backdrop-blur-md border-b border-[#20344D] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8.5 h-8.5 rounded-xl bg-[#0EA5E9] text-white flex items-center justify-center font-bold shadow-xs group-hover:bg-[#0284C7] transition-all">
              <LinkIcon className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-[#F8FAFC] text-sm tracking-tight leading-tight group-hover:text-[#38BDF8] transition-colors">
                PersonToPerson
              </span>
              <span className="text-[10px] text-[#94A3B8] font-medium">
                Permanent Business URL
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#CBD5E1]">
            <a href="#why-permanent" className="hover:text-[#38BDF8] transition-colors">
              Why Permanent?
            </a>
            <a href="#how-it-works" className="hover:text-[#38BDF8] transition-colors">
              How It Works
            </a>
            <a href="#features" className="hover:text-[#38BDF8] transition-colors">
              Features
            </a>
            <a href="#faq" className="hover:text-[#38BDF8] transition-colors">
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
                  <Button variant="ghost" size="sm" className="font-semibold text-[#CBD5E1] hover:text-[#F8FAFC]">
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
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14243A] border border-[#20344D] text-[#38BDF8] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#0EA5E9]" />
              <span>Single Permanent Business URL Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold text-[#F8FAFC] tracking-tight leading-[1.14]">
              One permanent link for your business.{' '}
              <span className="text-[#38BDF8]">
                Update your links anytime.
              </span>
            </h1>

            {/* Factual Product Description */}
            <p className="text-base sm:text-lg text-[#94A3B8] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
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
                  className="w-full sm:w-auto font-semibold bg-[#101D30] hover:bg-[#14243A] border-[#20344D] text-[#F8FAFC]"
                  icon={<ExternalLink className="w-4 h-4 text-[#94A3B8]" />}
                >
                  Explore Profile Preview
                </Button>
              </a>
            </div>

            {/* Factual Supporting Points */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#94A3B8] text-left border-t border-[#20344D] max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0EA5E9] shrink-0" />
                <span className="font-semibold text-[#F8FAFC]">One permanent public URL</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0EA5E9] shrink-0" />
                <span className="font-semibold text-[#F8FAFC]">Update destination links anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0EA5E9] shrink-0" />
                <span className="font-semibold text-[#F8FAFC]">QR code points to the same profile</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0EA5E9] shrink-0" />
                <span className="font-semibold text-[#F8FAFC]">Customers see latest active links</span>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <CheckCircle2 className="w-4 h-4 text-[#0EA5E9] shrink-0" />
                <span className="font-semibold text-[#F8FAFC]">Real visitor and link-click analytics</span>
              </div>
            </div>
          </div>

          {/* Hero Right: Product Phone Preview (Belonging to Blue Brand Family) */}
          <div id="preview" className="flex-1 w-full max-w-sm sm:max-w-md mx-auto scroll-mt-24">
            {/* Subtle Label Indicating Product Preview */}
            <div className="mb-3 text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14243A] border border-[#20344D] shadow-2xs text-[#38BDF8] text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                Example Profile Preview
              </span>
            </div>

            {/* Smartphone Outer Chassis */}
            <div className="relative rounded-[40px] p-3 sm:p-3.5 bg-[#07111F] border-2 border-[#20344D] shadow-2xl shadow-black/50">
              {/* Speaker & Camera Notch */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-4 bg-[#0B1728] rounded-full z-30 flex items-center justify-center gap-2 border border-[#20344D]">
                <div className="w-8 h-1 rounded-full bg-[#20344D]" />
                <div className="w-2 h-2 rounded-full bg-[#14243A]" />
              </div>

              {/* Screen Bezel */}
              <div className="rounded-[28px] overflow-hidden bg-[#0B1728] border border-[#20344D] shadow-inner flex flex-col min-h-[480px] text-[#F8FAFC] relative">
                {/* Mobile Browser Address Bar */}
                <div className="bg-[#07111F] pt-6 pb-2 px-3.5 border-b border-[#20344D] flex items-center justify-between text-[11px] text-[#94A3B8] font-mono relative z-10">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-[#94A3B8] font-sans text-xs">🔒</span>
                    <span className="truncate font-medium text-[#F8FAFC]">persontoperson.com/b/example-business</span>
                  </div>
                  <span className="shrink-0 ml-2 px-1.5 py-0.5 rounded-full bg-[#14243A] text-[#94A3B8] text-[9px] font-bold tracking-wider uppercase border border-[#20344D]">
                    Preview
                  </span>
                </div>

                {/* Top Partner Placement Header */}
                <div className="bg-[#0B1728] px-3.5 py-1.5 border-b border-[#20344D] flex items-center justify-between text-[10px] text-[#94A3B8] relative z-10">
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase text-[#94A3B8]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]" />
                    Partner
                  </span>
                  <span className="font-semibold text-[#F8FAFC] truncate">
                    Example Partner Placement
                  </span>
                </div>

                {/* Digital Card Screen Content */}
                <div className="text-center flex-1 flex flex-col justify-between p-4 relative z-10">
                  <div>
                    {/* Business Logo with Luxury Bezel */}
                    <div className="w-16 h-16 rounded-2xl bg-[#14243A] ring-2 ring-[#0B1728] border border-[#20344D] shadow-lg p-0.5 mx-auto flex items-center justify-center">
                      <div className="w-full h-full rounded-[13px] bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] text-white flex items-center justify-center font-extrabold text-2xl shadow-inner">
                        P
                      </div>
                    </div>

                    {/* Brand Info */}
                    <div className="mt-2.5">
                      <h3 className="font-extrabold text-[#F8FAFC] text-base tracking-tight">
                        Example Business Profile
                      </h3>
                      <p className="text-[11px] text-[#38BDF8] mt-0.5 font-medium flex items-center justify-center gap-1">
                        <span>Business Category</span>
                        <span className="text-[#94A3B8]/60">•</span>
                        <span className="text-[#94A3B8]">City, State</span>
                      </p>
                      <p className="text-[11px] text-[#94A3B8] mt-1 line-clamp-1 leading-snug">
                        Add your business description, announcements, and hours here
                      </p>
                    </div>

                    {/* 4 Quick Action Controls */}
                    <div className="grid grid-cols-4 gap-2 mt-3.5 pt-3 border-t border-[#20344D] text-[#F8FAFC] max-w-[260px] mx-auto">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-9.5 h-9.5 rounded-xl bg-[#14243A] border border-[#20344D] flex items-center justify-center text-[#F8FAFC] shadow-2xs hover:bg-[#101D30] transition-colors">
                          <Phone className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-wider">Call</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-9.5 h-9.5 rounded-xl bg-[#14243A] border border-[#20344D] flex items-center justify-center text-[#F8FAFC] shadow-2xs hover:bg-[#101D30] transition-colors">
                          <Mail className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-wider">Email</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-9.5 h-9.5 rounded-xl bg-[#14243A] border border-[#20344D] flex items-center justify-center text-[#F8FAFC] shadow-2xs hover:bg-[#101D30] transition-colors">
                          <MapPin className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-wider">Map</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-9.5 h-9.5 rounded-xl bg-[#14243A] border border-[#20344D] flex items-center justify-center text-[#F8FAFC] shadow-2xs hover:bg-[#101D30] transition-colors">
                          <Share2 className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-wider">Share</span>
                      </div>
                    </div>

                    {/* Dynamic Links Preview */}
                    <div className="space-y-1.5 text-left text-xs mt-3.5">
                      {/* Featured Link */}
                      <div className="p-2.5 rounded-xl border border-[#0EA5E9] bg-gradient-to-r from-[#14243A] via-[#101D30] to-[#0EA5E9]/15 text-[#F8FAFC] flex items-center justify-between shadow-[0_4px_16px_-4px_rgba(14,165,233,0.25)]">
                        <div className="flex items-center gap-2.5 truncate">
                          <div className="w-7 h-7 rounded-lg bg-[#0B1728] border border-[#20344D] flex items-center justify-center text-xs shrink-0 shadow-inner">
                            📋
                          </div>
                          <div className="truncate">
                            <span className="font-semibold block text-[11.5px] leading-tight truncate text-[#F8FAFC]">
                              Menu &amp; Price Catalog
                            </span>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-[#38BDF8] flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5 text-[#38BDF8]" />
                              Featured Link
                            </span>
                          </div>
                        </div>
                        <span className="text-[#38BDF8] font-bold text-xs shrink-0 ml-1">→</span>
                      </div>

                      {/* Regular Link 1 */}
                      <div className="p-2.5 rounded-xl border border-[#20344D] bg-[#101D30] hover:bg-[#14243A] text-[#F8FAFC] flex items-center justify-between shadow-2xs transition-colors">
                        <div className="flex items-center gap-2.5 truncate">
                          <div className="w-7 h-7 rounded-lg bg-[#0B1728] border border-[#20344D] flex items-center justify-center text-xs shrink-0 shadow-inner">
                            ⭐
                          </div>
                          <div className="truncate">
                            <span className="font-semibold block text-[11.5px] leading-tight truncate text-[#F8FAFC]">
                              Google Business Profile
                            </span>
                            <span className="text-[9px] text-[#94A3B8]">
                              Reviews &amp; Ratings
                            </span>
                          </div>
                        </div>
                        <span className="text-[#94A3B8] font-bold text-xs shrink-0 ml-1">→</span>
                      </div>

                      {/* Regular Link 2 */}
                      <div className="p-2.5 rounded-xl border border-[#20344D] bg-[#101D30] hover:bg-[#14243A] text-[#F8FAFC] flex items-center justify-between shadow-2xs transition-colors">
                        <div className="flex items-center gap-2.5 truncate">
                          <div className="w-7 h-7 rounded-lg bg-[#0B1728] border border-[#20344D] flex items-center justify-center text-xs shrink-0 shadow-inner">
                            💬
                          </div>
                          <div className="truncate">
                            <span className="font-semibold block text-[11.5px] leading-tight truncate text-[#F8FAFC]">
                              WhatsApp Direct Message
                            </span>
                            <span className="text-[9px] text-[#94A3B8]">
                              Instant Support
                            </span>
                          </div>
                        </div>
                        <span className="text-[#94A3B8] font-bold text-xs shrink-0 ml-1">→</span>
                      </div>
                    </div>
                  </div>

                  {/* Profile Footer */}
                  <div className="mt-4 pt-3 border-t border-[#20344D] flex items-center justify-between text-[10px] text-[#94A3B8]">
                    <span className="font-mono text-[9.5px] text-[#38BDF8]">
                      persontoperson.com/b/example-business
                    </span>
                    <span className="text-[#94A3B8]/80 text-[9px] font-medium">Permanent URL Preview</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* "Why a permanent business URL matters" Comparison Section */}
      <section id="why-permanent" className="py-20 sm:py-24 bg-[#0B1728] border-y border-[#20344D] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
              Why a permanent business URL matters
            </h2>
            <p className="mt-3 text-[#94A3B8] text-sm sm:text-base leading-relaxed">
              When business details or links change, a permanent URL ensures that printed materials and physical signage continue directing customers to the right place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Column 1: Traditional QR & Printed Links */}
            <div className="rounded-3xl p-8 bg-[#101D30] border border-[#20344D] shadow-sm space-y-5">
              <h3 className="font-extrabold text-[#F8FAFC] text-lg">
                Traditional QR &amp; Printed Links
              </h3>

              <ul className="space-y-4 text-xs sm:text-sm text-[#94A3B8]">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8] mt-2 shrink-0" />
                  <span>Link changes can require updating printed materials</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8] mt-2 shrink-0" />
                  <span>Multiple links can be difficult to manage</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8] mt-2 shrink-0" />
                  <span>Customers may not always find the latest information</span>
                </li>
              </ul>
            </div>

            {/* Column 2: PersonToPerson */}
            <div className="rounded-3xl p-8 bg-[#14243A] border border-[#38BDF8]/40 shadow-lg space-y-5 relative">
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#0B1728] text-[#38BDF8] border border-[#20344D] text-[10px] font-bold uppercase tracking-wider">
                Permanent Business URL
              </div>

              <h3 className="font-extrabold text-[#F8FAFC] text-lg">
                PersonToPerson
              </h3>

              <ul className="space-y-4 text-xs sm:text-sm text-[#F8FAFC]">
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                  <span>One permanent public URL</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                  <span>Update destination links anytime</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                  <span>QR code continues pointing to the same profile</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                  <span>Customers see the latest active links</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (3-Step Visual Architecture) */}
      <section id="how-it-works" className="py-20 sm:py-24 bg-[#07111F] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#101D30] border border-[#20344D] text-[#CBD5E1] text-xs font-semibold mb-3">
              <Layers className="w-4 h-4 text-[#38BDF8]" />
              <span>Simple 3-Step Setup</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
              How PersonToPerson Works
            </h2>
            <p className="mt-3 text-[#94A3B8] text-sm sm:text-base leading-relaxed">
              From account creation to physical deployment in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative p-8 rounded-3xl bg-[#101D30] border border-[#20344D] shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#14243A] text-[#38BDF8] font-extrabold text-lg flex items-center justify-center border border-[#20344D] shadow-xs">
                01
              </div>
              <h3 className="text-lg font-bold text-[#F8FAFC] tracking-tight">
                Claim Your Permanent Slug
              </h3>
              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                Choose your business handle like <code className="bg-[#14243A] px-1.5 py-0.5 rounded text-[#38BDF8] font-mono font-semibold border border-[#20344D]">/b/your-brand</code>.
                Add your business details, contact options, brand logo, and initial destination links.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-8 rounded-3xl bg-[#101D30] border border-[#20344D] shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#14243A] text-[#38BDF8] font-extrabold text-lg flex items-center justify-center border border-[#20344D] shadow-xs">
                02
              </div>
              <h3 className="text-lg font-bold text-[#F8FAFC] tracking-tight">
                Print or Share Once
              </h3>
              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                Download your high-resolution QR code for table stands, menus, and window stickers, or write the URL to contactless NFC cards.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-8 rounded-3xl bg-[#101D30] border border-[#20344D] shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#14243A] text-[#38BDF8] font-extrabold text-lg flex items-center justify-center border border-[#20344D] shadow-xs">
                03
              </div>
              <h3 className="text-lg font-bold text-[#F8FAFC] tracking-tight">
                Update Links Anytime
              </h3>
              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                Whenever you change menus, phone numbers, payment handles, or promotions, update them from your dashboard. Customers always see your latest active links.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Capabilities Grid */}
      <section id="features" className="py-20 sm:py-24 bg-[#0B1728] border-t border-[#20344D] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
              Platform Features
            </h2>
            <p className="mt-3 text-[#94A3B8] text-sm sm:text-base leading-relaxed">
              Designed to connect physical footfall to your active digital destinations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-7 rounded-3xl border border-[#20344D] bg-[#101D30] space-y-3.5 shadow-sm">
              <div className="w-11 h-11 rounded-2xl bg-[#14243A] text-[#38BDF8] flex items-center justify-center font-bold border border-[#20344D] shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F8FAFC] tracking-tight">
                Permanent Public URL
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Generate <code className="bg-[#14243A] px-1.5 py-0.5 rounded text-[#38BDF8] border border-[#20344D] font-mono font-semibold">/b/your-slug</code> once. Your public web address remains consistent across all physical touchpoints.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-7 rounded-3xl border border-[#20344D] bg-[#101D30] space-y-3.5 shadow-sm">
              <div className="w-11 h-11 rounded-2xl bg-[#14243A] text-[#38BDF8] flex items-center justify-center font-bold border border-[#20344D] shadow-xs">
                <MousePointerClick className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F8FAFC] tracking-tight">
                Dynamic Link Management
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Add, toggle, edit, or reorder custom links: menus, WhatsApp chat, Google review links, forms, or payment destinations.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-7 rounded-3xl border border-[#20344D] bg-[#101D30] space-y-3.5 shadow-sm">
              <div className="w-11 h-11 rounded-2xl bg-[#14243A] text-[#38BDF8] flex items-center justify-center font-bold border border-[#20344D] shadow-xs">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F8FAFC] tracking-tight">
                Vector QR &amp; NFC Ready
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Download high-resolution SVG and PNG QR codes suitable for physical printing, or program the URL directly onto NFC smart cards.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-7 rounded-3xl border border-[#20344D] bg-[#101D30] space-y-3.5 shadow-sm">
              <div className="w-11 h-11 rounded-2xl bg-[#14243A] text-[#38BDF8] flex items-center justify-center font-bold border border-[#20344D] shadow-xs">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F8FAFC] tracking-tight">
                Visitor &amp; Link-Click Analytics
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Monitor profile visits and click events on individual destination links from your business owner dashboard.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-7 rounded-3xl border border-[#20344D] bg-[#101D30] space-y-3.5 shadow-sm">
              <div className="w-11 h-11 rounded-2xl bg-[#14243A] text-[#38BDF8] flex items-center justify-center font-bold border border-[#20344D] shadow-xs">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F8FAFC] tracking-tight">
                Mobile-First Digital Profile
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Optimized for smartphone screens with direct actions for Phone, Email, Google Maps navigation, and sharing.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-7 rounded-3xl border border-[#20344D] bg-[#101D30] space-y-3.5 shadow-sm">
              <div className="w-11 h-11 rounded-2xl bg-[#14243A] text-[#38BDF8] flex items-center justify-center font-bold border border-[#20344D] shadow-xs">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F8FAFC] tracking-tight">
                Partner Placements
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Highlight local partners or sponsor organizations in header or footer placements with both image upload and image URL support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="py-20 sm:py-24 bg-[#07111F] border-t border-[#20344D] relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#101D30] border border-[#20344D] text-[#CBD5E1] text-xs font-semibold mb-3">
              <HelpCircle className="w-4 h-4 text-[#38BDF8]" />
              <span>Questions &amp; Answers</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-[#94A3B8] text-sm sm:text-base leading-relaxed">
              Common questions about permanent URLs, QR codes, and profile management.
            </p>
          </div>

          <div className="space-y-3.5">
            {FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-[#20344D] bg-[#101D30] overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 font-bold text-[#F8FAFC] text-sm sm:text-base hover:text-[#38BDF8] transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#94A3B8] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#38BDF8]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-[#CBD5E1] leading-relaxed border-t border-[#20344D]">
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
      <section className="py-20 bg-[#0B1728] border-t border-[#20344D] text-[#F8FAFC] relative z-10 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#F8FAFC] leading-tight">
            One permanent link for your business.
          </h2>

          <p className="text-[#94A3B8] text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
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
                className="w-full sm:w-auto font-semibold bg-[#14243A] hover:bg-[#101D30] text-[#F8FAFC] border-[#20344D]"
                icon={<ExternalLink className="w-4 h-4 text-[#94A3B8]" />}
              >
                Explore Profile Preview
              </Button>
            </a>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-[#94A3B8]">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#38BDF8]" /> One permanent public URL
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#38BDF8]" /> Update links anytime
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#38BDF8]" /> No app required for visitors
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 bg-[#07111F] text-[#94A3B8] text-xs border-t border-[#20344D] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-[#20344D]">
            {/* Brand column */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2.5 text-[#F8FAFC] font-extrabold text-sm">
                <div className="w-7 h-7 rounded-lg bg-[#0EA5E9] text-white flex items-center justify-center font-bold shadow-xs">
                  <LinkIcon className="w-3.5 h-3.5 text-white" />
                </div>
                <span>PersonToPerson</span>
              </div>
              <p className="text-[#94A3B8] text-xs max-w-sm leading-relaxed">
                Permanent business URL and dynamic link platform for physical and local businesses.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-[#F8FAFC] text-xs uppercase tracking-wider">Navigation</h4>
              <ul className="space-y-2 text-[#94A3B8]">
                <li>
                  <a href="#why-permanent" className="hover:text-[#38BDF8] transition-colors">
                    Why Permanent?
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-[#38BDF8] transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-[#38BDF8] transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-[#38BDF8] transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#preview" className="hover:text-[#38BDF8] transition-colors">
                    Example Profile Preview
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#94A3B8] text-[11px]">
            <p>© {new Date().getFullYear()} PersonToPerson. All rights reserved.</p>
            <p>Single Permanent Business URL Platform.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

