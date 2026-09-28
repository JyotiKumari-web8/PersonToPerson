import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { UserProfile, UserRole } from '@/types';
import { localStore } from './store';

export const authService = {
  async getSession() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    }
    const currentUser = localStore.getCurrentUser();
    return currentUser ? { user: { id: currentUser.id, email: currentUser.email } } : null;
  },

  async getCurrentProfile(): Promise<UserProfile | null> {
    if (isSupabaseConfigured) {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) return null;

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        // SECURITY: Elevated roles ('platform_owner' / 'admin') can NEVER be trusted from user_metadata.
        // Strictly force 'business_owner' on fallback.
        return {
          id: user.id,
          email: user.email || '',
          full_name: (user.user_metadata?.full_name as string) || '',
          role: 'business_owner',
        };
      }

      return profile as UserProfile;
    }

    return localStore.getCurrentUser();
  },

  async signUp(email: string, password: string, fullName: string, _role?: UserRole) {
    // SECURITY: Public registration must NEVER assign platform_owner or admin roles.
    // Strictly force 'business_owner'. Elevated roles must be granted via direct database admin.
    const assignedRole: UserRole = 'business_owner';

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: assignedRole,
          },
        },
      });
      if (error) throw error;
      return data;
    }

    // Local fallback
    const users = localStore.getUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email,
      full_name: fullName,
      role: assignedRole,
      created_at: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('p2p_users', JSON.stringify(users));
    localStore.setCurrentUser(newUser);

    return { user: { id: newUser.id, email: newUser.email } };
  },

  async signIn(email: string, password: string) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    }

    // Local fallback
    const users = localStore.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error('Invalid email or password. Please verify your credentials.');
    }

    localStore.setCurrentUser(user);
    return { user: { id: user.id, email: user.email } };
  },

  async signOut() {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return;
    }
    localStore.setCurrentUser(null);
  },

  async resetPassword(email: string) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      return;
    }

    const users = localStore.getUsers();
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!exists) {
      throw new Error('No registered account found with that email address.');
    }
    // Simulation success
    return true;
  },

  async updatePassword(password: string) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      return;
    }
    // Local simulation: update succeeded
    return true;
  },
};
