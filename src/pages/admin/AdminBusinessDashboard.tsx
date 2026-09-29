import React, { useEffect, useState } from 'react';
import { useParams, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { businessService } from '@/services/businessService';
import { Business } from '@/types';
import { Navbar } from '@/components/layout/Navbar';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import {
  ArrowLeft,
  ShieldAlert,
  LayoutDashboard,
  Building2,
  Link2,
  QrCode,
  BarChart3,
  Settings,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { getInternalBusinessPath } from '@/lib/utils';

export const AdminBusinessDashboard: React.FC = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();
  const { setAdminOverrideBusiness, isPlatformOwner } = useAuth();

  const [managedBusiness, setManagedBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isPlatformOwner) {
      setError('Access denied. Platform Owner role required.');
      setIsLoading(false);
      return;
    }

    async function load() {
      if (!businessId) {
        setError('No business ID provided.');
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const all = await businessService.getAllBusinesses();
        const found = all.find((b) => b.id === businessId) || null;
        if (!found) {
          setError('Business not found or access denied.');
          setIsLoading(false);
          return;
        }
        setManagedBusiness(found);
        // Set the admin override so all child dashboard pages receive this business via useAuth()
        setAdminOverrideBusiness(found);
      } catch (err) {
        console.error('Admin business management load error:', err);
        setError('Failed to load business data.');
      } finally {
        setIsLoading(false);
      }
    }
    load();

    // Clear the override when the admin leaves this management context
    return () => {
      setAdminOverrideBusiness(null);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId, isPlatformOwner]);

  const handleBackToAdmin = () => {
    setAdminOverrideBusiness(null);
    navigate('/admin');
  };

  // Sub-navigation items mirroring the regular business dashboard
  const navItems = [
    { label: 'Dashboard', path: '', icon: LayoutDashboard, end: true },
    { label: 'Business Profile', path: 'profile', icon: Building2 },
    { label: 'Links', path: 'links', icon: Link2 },
    { label: 'QR Code', path: 'qr-code', icon: QrCode },
    { label: 'Analytics', path: 'analytics', icon: BarChart3 },
    { label: 'Settings', path: 'settings', icon: Settings },
  ];

  // ── Loading state ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#140D08] text-[#FBF9F5] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" label="Loading business management..." />
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────
  if (error || !managedBusiness) {
    return (
      <div className="min-h-screen bg-[#140D08] text-[#FBF9F5] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-sm">
            <div className="w-12 h-12 rounded-xl bg-rose-950/40 text-rose-400 flex items-center justify-center mx-auto mb-3 border border-rose-800/60">
              <AlertCircle className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-[#FBF9F5] mb-1">{error || 'Business not found'}</p>
            <button
              type="button"
              onClick={handleBackToAdmin}
              className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-[#D49B5B] hover:text-[#E2B176] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Platform Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Full management layout ────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#140D08] text-[#FBF9F5] flex flex-col selection:bg-[#2E1F15] selection:text-[#D49B5B]">
      <Navbar />

      {/* Admin Management Mode Banner */}
      <div className="sticky top-16 z-30 bg-amber-950/60 border-b border-amber-800/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {/* Left: context label */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-amber-900/60 text-amber-400 flex items-center justify-center shrink-0 border border-amber-800/60">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400">
                  Admin Management Mode
                </span>
                <span className="text-[11px] text-amber-200/70 font-medium truncate">
                  Managing: <strong className="text-amber-200">{managedBusiness.name}</strong>
                  <span className="text-amber-400/60 ml-1 font-mono">· /b/{managedBusiness.slug}</span>
                </span>
              </div>
              <p className="text-[10px] text-amber-400/70 mt-0.5">
                All changes apply to this business. You remain logged in as Platform Owner.
              </p>
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={getInternalBusinessPath(managedBusiness.slug)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:text-amber-100 bg-amber-900/40 hover:bg-amber-900/70 border border-amber-800/60 rounded-xl transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public Profile</span>
            </a>
            <button
              type="button"
              onClick={handleBackToAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#FBF9F5] hover:text-amber-200 bg-amber-800/60 hover:bg-amber-800/80 border border-amber-700/60 rounded-xl transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Platform Admin
            </button>
          </div>
        </div>

        {/* Sub-Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-2.5 overflow-x-auto">
          <nav className="flex items-center gap-1 w-max sm:w-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const to = item.path
                ? `/admin/business/${businessId}/${item.path}`
                : `/admin/business/${businessId}`;
              return (
                <NavLink
                  key={item.label}
                  to={to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-amber-800/70 text-amber-200 border border-amber-700/60 shadow-xs'
                        : 'text-amber-300/70 hover:text-amber-200 hover:bg-amber-900/40 border border-transparent'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Page Content — uses the existing dashboard page components via Outlet */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
};
