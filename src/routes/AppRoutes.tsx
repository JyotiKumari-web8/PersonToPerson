import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from '@/pages/Home';
import { Login } from '@/pages/auth/Login';
import { SignUp } from '@/pages/auth/SignUp';
import { ForgotPassword } from '@/pages/auth/ForgotPassword';
import { ResetPassword } from '@/pages/auth/ResetPassword';
import { PublicProfilePage } from '@/pages/public/PublicProfilePage';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { NotFound } from '@/pages/NotFound';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

// Lazy-loaded protected pages to ensure public customer profile bundle is ultra-light
const Overview = lazy(() => import('@/pages/dashboard/Overview').then((m) => ({ default: m.Overview })));
const BusinessProfile = lazy(() => import('@/pages/dashboard/BusinessProfile').then((m) => ({ default: m.BusinessProfile })));
const LinksManager = lazy(() => import('@/pages/dashboard/LinksManager').then((m) => ({ default: m.LinksManager })));
const QRCodeCenter = lazy(() => import('@/pages/dashboard/QRCodeCenter').then((m) => ({ default: m.QRCodeCenter })));
const AnalyticsPage = lazy(() => import('@/pages/dashboard/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage })));
const SettingsPage = lazy(() => import('@/pages/dashboard/SettingsPage').then((m) => ({ default: m.SettingsPage })));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const SponsorsManager = lazy(() => import('@/pages/admin/SponsorsManager').then((m) => ({ default: m.SponsorsManager })));
const PlansManager = lazy(() => import('@/pages/admin/PlansManager').then((m) => ({ default: m.PlansManager })));
const AdminBusinessDashboard = lazy(() => import('@/pages/admin/AdminBusinessDashboard').then((m) => ({ default: m.AdminBusinessDashboard })));

const RouteLoadingFallback = () => (
  <div className="min-h-[50vh] flex items-center justify-center p-8">
    <LoadingSpinner size="lg" label="Loading view..." />
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
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
      <Route
        path="/admin/subscriptions"
        element={
          <AdminRoute>
            <AdminLayout>
              <PlansManager />
            </AdminLayout>
          </AdminRoute>
        }
      />

      {/*
        Admin Business Management Routes
        AdminBusinessDashboard acts as the layout (Navbar + admin banner + sub-nav + Outlet).
        Child page components are the SAME ones used in the normal /dashboard routes —
        they automatically receive the managed business via useAuth() which returns the
        adminOverrideBusiness when the Platform Owner is in management mode.
        No DashboardLayout or AdminLayout wrapper needed here.
      */}
      <Route
        path="/admin/business/:businessId"
        element={
          <AdminRoute>
            <AdminBusinessDashboard />
          </AdminRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="profile" element={<BusinessProfile />} />
        <Route path="links" element={<LinksManager />} />
        <Route path="qr-code" element={<QRCodeCenter />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* 404 Catch-All */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
    </Suspense>
  );
};
