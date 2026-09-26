import React from 'react';
import { Navbar } from './Navbar';
import { ShieldAlert, Building2, Award } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { name: 'All Businesses', path: '/admin', icon: Building2 },
    { name: 'Sponsors Management', path: '/admin/sponsors', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-[#07111F] text-[#F8FAFC] flex flex-col selection:bg-[#14243A] selection:text-[#38BDF8]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Admin Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#20344D]">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#0B1728] text-white flex items-center justify-center shadow-xs border border-[#20344D]">
              <ShieldAlert className="w-5 h-5 text-[#0EA5E9]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#F8FAFC] tracking-tight">Platform Admin Center</h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#14243A] text-[#38BDF8] border border-[#20344D]">
                  Staff Only
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Manage business registrations, assign sponsors, and monitor platform health.
              </p>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-2 bg-[#0B1728] p-1 rounded-xl self-start sm:self-auto border border-[#20344D]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    active
                      ? 'bg-[#14243A] text-[#38BDF8] shadow-xs font-bold border border-[#20344D]'
                      : 'text-[#CBD5E1] hover:text-[#F8FAFC]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#38BDF8]' : 'text-[#94A3B8]'}`} />
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

