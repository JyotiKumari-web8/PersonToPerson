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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Admin Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <ShieldAlert className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Platform Admin Center</h1>
              <p className="text-xs text-slate-500">
                Manage business registrations, assign sponsors, and monitor platform health.
              </p>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    active
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
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
