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
  const { user, business, isAdmin, logout } = useAuth();
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

  if (isAdmin) {
    navLinks.push({ name: 'Admin', path: '/admin', icon: ShieldAlert });
  }

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold shadow-xs group-hover:bg-sky-700 transition-colors">
                <LinkIcon className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 text-sm tracking-tight">
                  PersonToPerson
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Permanent URL</span>
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
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        active
                          ? 'bg-sky-50 text-sky-700'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${active ? 'text-sky-600' : 'text-slate-400'}`} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>

          {/* Right Header: Supabase Status & User Dropdown */}
          <div className="flex items-center gap-3">
            {/* Database indicator badge */}
            <div
              className={`hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                isSupabaseConfigured
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
              title={
                isSupabaseConfigured
                  ? 'Connected to live Supabase database with RLS'
                  : 'Running in Local Mode (Add Supabase credentials to .env to connect)'
              }
            >
              <Database className="w-3 h-3" />
              <span>{isSupabaseConfigured ? 'Supabase Live' : 'Local Storage Mode'}</span>
            </div>

            {/* Live profile link if business exists */}
            {business && (
              <a
                href={getInternalBusinessPath(business.slug)}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors"
                title="View your public customer page"
              >
                <span>/b/{business.slug}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            {/* User profile & Logout */}
            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block text-xs font-medium text-slate-700 max-w-[120px] truncate">
                  {user.full_name || user.email}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 px-3.5 py-1.5 rounded-lg shadow-xs transition-colors"
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
                className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {user && mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-100 space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-sky-50 text-sky-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-sky-600' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            {business && (
              <a
                href={getInternalBusinessPath(business.slug)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-sky-700 bg-sky-50"
              >
                <span>View Public Profile</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
