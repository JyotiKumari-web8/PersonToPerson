import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { isSupabaseConfigured } from '@/lib/supabase';
import { getInternalBusinessPath } from '@/lib/utils';
import {
  Link as LinkIcon,
  LayoutDashboard,
  Building2,
  Link2,
  QrCode,
  BarChart3,
  Settings,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Database,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, business, isAdmin, isPlatformOwner, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Business Profile', path: '/dashboard/profile', icon: Building2 },
    { name: 'Links', path: '/dashboard/links', icon: Link2 },
    { name: 'QR Code', path: '/dashboard/qr-code', icon: QrCode },
    { name: 'Analytics', path: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  if (isPlatformOwner || isAdmin) {
    navLinks.push({ name: 'Platform Admin', path: '/admin', icon: ShieldAlert });
  }

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#07111F]/90 backdrop-blur-md border-b border-[#20344D] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-8.5 h-8.5 rounded-xl bg-[#0EA5E9] text-white flex items-center justify-center font-bold shadow-xs group-hover:bg-[#0284C7] transition-all">
                <LinkIcon className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-[#F8FAFC] text-sm tracking-tight leading-tight group-hover:text-[#38BDF8] transition-colors">
                  PersonToPerson
                </span>
                <span className="text-[10px] text-[#94A3B8] font-medium">Permanent URL</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            {user && (
              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all duration-150 ${
                        active
                          ? 'bg-[#14243A] text-[#38BDF8] border border-[#20344D] shadow-2xs font-bold'
                          : 'text-[#CBD5E1] hover:text-[#F8FAFC] hover:bg-[#14243A]/60 border border-transparent font-medium'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#38BDF8]' : 'text-[#94A3B8]'}`} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>

          {/* Right Header: Supabase Status & User Dropdown */}
          <div className="flex items-center gap-2.5">
            {/* Database indicator badge */}
            <div
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                isSupabaseConfigured
                  ? 'bg-emerald-950/40 text-[#22C55E] border-emerald-800/50'
                  : 'bg-amber-950/40 text-amber-300 border-amber-800/50'
              }`}
              title={
                isSupabaseConfigured
                  ? 'Connected to live Supabase database with RLS'
                  : 'Running in Local Mode (Add Supabase credentials to .env to connect)'
              }
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseConfigured ? 'bg-[#22C55E]' : 'bg-amber-400'}`} />
              <Database className="w-3 h-3" />
              <span>{isSupabaseConfigured ? 'Supabase Live' : 'Local Storage Mode'}</span>
            </div>

            {/* Live profile link if business exists */}
            {business && (
              <a
                href={getInternalBusinessPath(business.slug)}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-[#F8FAFC] bg-[#14243A] hover:bg-[#1A2E4A] border border-[#20344D] shadow-2xs transition-all"
                title="View your public customer page"
              >
                <span className="font-mono text-[#38BDF8]">/b/{business.slug}</span>
                <ExternalLink className="w-3 h-3 text-[#38BDF8]" />
              </a>
            )}

            {/* User profile & Logout */}
            {user ? (
              <div className="flex items-center gap-2 pl-1">
                <span className="hidden sm:inline-block text-xs font-semibold text-[#F8FAFC] max-w-[120px] truncate">
                  {user.full_name || user.email}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-[#94A3B8] hover:text-[#EF4444] hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-rose-900/40"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-[#CBD5E1] hover:text-[#38BDF8] px-3 py-1.5 rounded-xl hover:bg-[#14243A] transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="text-xs font-semibold text-white bg-[#0EA5E9] hover:bg-[#0284C7] px-3.5 py-1.5 rounded-xl shadow-xs border border-[#0EA5E9] transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu hamburger */}
            {user && (
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-[#CBD5E1] hover:bg-[#14243A] hover:text-[#F8FAFC] focus:outline-none cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {user && mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-[#20344D] bg-[#07111F] space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors ${
                    active
                      ? 'bg-[#14243A] text-[#38BDF8] font-bold border border-[#20344D]'
                      : 'text-[#CBD5E1] hover:text-[#F8FAFC] hover:bg-[#14243A]/60 font-medium'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-[#38BDF8]' : 'text-[#94A3B8]'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            {business && (
              <a
                href={getInternalBusinessPath(business.slug)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold text-[#F8FAFC] bg-[#14243A] border border-[#20344D]"
              >
                <span>View Public Profile</span>
                <ExternalLink className="w-4 h-4 text-[#38BDF8]" />
              </a>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

