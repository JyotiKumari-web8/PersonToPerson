import React from 'react';
import { Navbar } from './Navbar';
import { ShieldAlert, Building2, Award, CreditCard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { name: 'All Businesses', path: '/admin', icon: Building2 },
    { name: 'Plans & Subscriptions', path: '/admin/subscriptions', icon: CreditCard },
    { name: 'Sponsors Management', path: '/admin/sponsors', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-[#140D08] text-[#FBF9F5] flex flex-col selection:bg-[#2E1F15] selection:text-[#D49B5B]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Admin Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#3D2B1F]">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#241810] text-[#D49B5B] flex items-center justify-center shadow-xs border border-[#3D2B1F]">
              <ShieldAlert className="w-5 h-5 text-[#D49B5B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#FBF9F5] tracking-tight">Platform Admin Center</h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#2E1F15] text-[#D49B5B] border border-[#3D2B1F]">
                  Staff Only
                </span>
              </div>
              <p className="text-xs text-[#9E8E81] mt-0.5">
                Manage business registrations, assign sponsors, and monitor platform health.
              </p>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-2 bg-[#1B120B] p-1 rounded-xl self-start sm:self-auto border border-[#3D2B1F]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    active
                      ? 'bg-[#2E1F15] text-[#D49B5B] shadow-xs font-bold border border-[#3D2B1F]'
                      : 'text-[#DDD3CA] hover:text-[#FBF9F5]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#D49B5B]' : 'text-[#9E8E81]'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {children}
      </main>
    </div>
  );
};

