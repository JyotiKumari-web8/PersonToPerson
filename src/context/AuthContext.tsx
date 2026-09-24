import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { UserProfile, Business } from '@/types';
import { authService } from '@/services/authService';
import { businessService } from '@/services/businessService';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  business: Business | null;
  isAdmin: boolean;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  refreshBusiness: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string, role?: 'business_owner' | 'admin') => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadUserData = useCallback(async () => {
    try {
      setIsLoading(true);
      const profile = await authService.getCurrentProfile();
      setUser(profile);

      if (profile) {
        const biz = await businessService.getBusinessByUserId(profile.id);
        setBusiness(biz);
      } else {
        setBusiness(null);
      }
    } catch (err) {
      console.error('Failed to load user session:', err);
      setUser(null);
      setBusiness(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserData();

    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session) {
          await loadUserData();
        } else {
          setUser(null);
          setBusiness(null);
          setIsLoading(false);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [loadUserData]);

  const refreshUser = async () => {
    const profile = await authService.getCurrentProfile();
    setUser(profile);
  };

  const refreshBusiness = async () => {
    if (user) {
      const biz = await businessService.getBusinessByUserId(user.id);
      setBusiness(biz);
    }
  };

  const login = async (email: string, password: string) => {
    await authService.signIn(email, password);
    await loadUserData();
  };

  const signup = async (
    email: string,
    password: string,
    fullName: string,
    role: 'business_owner' | 'admin' = 'business_owner'
  ) => {
    await authService.signUp(email, password, fullName, role);
    await loadUserData();
  };

  const logout = async () => {
    await authService.signOut();
    setUser(null);
    setBusiness(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        business,
        isAdmin,
        isLoading,
        refreshUser,
        refreshBusiness,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
