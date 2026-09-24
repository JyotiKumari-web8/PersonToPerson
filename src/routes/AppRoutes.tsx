import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from '@/pages/Home';
import { Login } from '@/pages/auth/Login';
import { SignUp } from '@/pages/auth/SignUp';
import { ForgotPassword } from '@/pages/auth/ForgotPassword';
import { ResetPassword } from '@/pages/auth/ResetPassword';
import { PublicProfilePage } from '@/pages/public/PublicProfilePage';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Overview } from '@/pages/dashboard/Overview';
import { BusinessProfile } from '@/pages/dashboard/BusinessProfile';
import { LinksManager } from '@/pages/dashboard/LinksManager';
import { QRCodeCenter } from '@/pages/dashboard/QRCodeCenter';
import { AnalyticsPage } from '@/pages/dashboard/AnalyticsPage';
import { SettingsPage } from '@/pages/dashboard/SettingsPage';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { SponsorsManager } from '@/pages/admin/SponsorsManager';
import { NotFound } from '@/pages/NotFound';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* CORE FEATURE: Single Permanent Public URL */}
      <Route path="/b/:slug" element={<PublicProfilePage />} />

      {/* Protected Business Owner Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Overview />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/profile"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <BusinessProfile />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/links"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <LinksManager />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/qr-code"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <QRCodeCenter />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/analytics"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <AnalyticsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/settings"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SettingsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/sponsors"
        element={
          <AdminRoute>
            <AdminLayout>
              <SponsorsManager />
            </AdminLayout>
          </AdminRoute>
        }
      />

      {/* 404 Catch-All */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};
