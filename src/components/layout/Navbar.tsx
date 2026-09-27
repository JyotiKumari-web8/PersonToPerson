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
    <header className="sticky top-0 z-40 bg-[#1B120B]/95 backdrop-blur-md border-b border-[#3D2B1F] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-8.5 h-8.5 rounded-xl bg-[#D49B5B] text-[#140D08] flex items-center justify-center font-bold shadow-xs group-hover:bg-[#E2B176] transition-all">
                <LinkIcon className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-[#FBF9F5] text-sm tracking-tight leading-tight group-hover:text-[#D49B5B] transition-colors">
                  PersonToPerson
                </span>
                <span className="text-[10px] text-[#9E8E81] font-medium">Permanent URL</span>
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
                          ? 'bg-[#2E1F15] text-[#D49B5B] border border-[#3D2B1F] shadow-2xs font-bold'
                          : 'text-[#DDD3CA] hover:text-[#FBF9F5] hover:bg-[#2E1F15]/60 border border-transparent font-medium'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#D49B5B]' : 'text-[#9E8E81]'}`} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>

          {/* Right Header: User Controls */}
          <div className="flex items-center gap-2.5">
            {/* User profile & Logout */}
            {user ? (
              <div className="flex items-center gap-2 pl-1">
                <span className="hidden sm:inline-block text-xs font-semibold text-[#FBF9F5] max-w-[140px] truncate">
                  {user.full_name || user.email}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-[#9E8E81] hover:text-[#EF4444] hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-rose-900/40"
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
                  className="text-xs font-semibold text-[#DDD3CA] hover:text-[#D49B5B] px-3 py-1.5 rounded-xl hover:bg-[#2E1F15] transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="text-xs font-bold text-[#140D08] bg-[#D49B5B] hover:bg-[#E2B176] px-3.5 py-1.5 rounded-xl shadow-xs border border-[#D49B5B] transition-all"
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
                className="md:hidden p-2 rounded-xl text-[#DDD3CA] hover:bg-[#2E1F15] hover:text-[#FBF9F5] focus:outline-none cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {user && mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-[#3D2B1F] bg-[#1B120B] space-y-1">
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
                      ? 'bg-[#2E1F15] text-[#D49B5B] font-bold border border-[#3D2B1F]'
                      : 'text-[#DDD3CA] hover:text-[#FBF9F5] hover:bg-[#2E1F15]/60 font-medium'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-[#D49B5B]' : 'text-[#9E8E81]'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};

