import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isPlatformOwner, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07111F]">
        <LoadingSpinner size="lg" label="Checking permissions..." />
      </div>
    );
  }

  // Strictly block business owners and non-platform-owners
  const hasAccess = Boolean(user && (isPlatformOwner || isAdmin));
  if (!hasAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
