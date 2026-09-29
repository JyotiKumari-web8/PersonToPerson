import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { UserProfile, UserRole } from '@/types';
import { localStore } from './store';
import { INITIAL_USER } from '@/lib/mockData';

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

  async updateProfile(data: { full_name?: string; email?: string }) {
    if (isSupabaseConfigured) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated.');

      // Update Supabase Auth user (email)
      if (data.email && data.email !== user.email) {
        const { error } = await supabase.auth.updateUser({ email: data.email });
        if (error) throw error;
        // Also update profiles table
        await supabase
          .from('profiles')
          .update({ email: data.email })
          .eq('id', user.id);
      }

      // Update display name in Auth user_metadata and profiles table
      if (data.full_name !== undefined) {
        const { error: authError } = await supabase.auth.updateUser({
          data: { full_name: data.full_name },
        });
        if (authError) throw authError;
        await supabase
          .from('profiles')
          .update({ full_name: data.full_name })
          .eq('id', user.id);
      }
      return;
    }

    // Local fallback: update current user and sync to users list
    const currentUser = localStore.getCurrentUser();
    if (currentUser) {
      if (data.full_name !== undefined) currentUser.full_name = data.full_name;
      if (data.email) currentUser.email = data.email;
      localStore.setCurrentUser(currentUser);

      const users = localStore.getUsers();
      const idx = users.findIndex((u) => u.id === currentUser.id);
      if (idx !== -1) {
        users[idx] = { ...currentUser };
        localStore.saveUsers(users);
      }
    }
  },

  /**
   * Fetches the Platform Owner/Admin email for "Contact Admin" feature.
   * Resolves from Supabase profiles / RPC function or local user profile store.
   */
  async getAdminEmail(): Promise<string> {
    if (isSupabaseConfigured) {
      try {
        // 1. Try RPC function if available (bypasses RLS safely via SECURITY DEFINER)
        const { data: rpcEmail, error: rpcErr } = await supabase.rpc('get_platform_admin_email');
        if (!rpcErr && rpcEmail && typeof rpcEmail === 'string' && rpcEmail.trim()) {
          return rpcEmail.trim();
        }

        // 2. Query profiles directly (works with RLS policy for platform owner/admin roles)
        const { data, error } = await supabase
          .from('profiles')
          .select('email, role')
          .in('role', ['platform_owner', 'admin'])
          .order('role', { ascending: true })
          .limit(1)
          .maybeSingle();

        if (!error && data?.email && typeof data.email === 'string' && data.email.trim()) {
          return (data.email as string).trim();
        }
      } catch (err) {
        console.warn('Could not query admin email from Supabase:', err);
      }
    }

    // Local fallback: get from localStore
    const users = localStore.getUsers();
    const platformOwner = users.find(
      (u) => u.role === 'platform_owner' && u.email && !u.email.includes('persontoperson.local')
    );
    if (platformOwner?.email) return platformOwner.email;

    const admin = users.find(
      (u) => u.role === 'admin' && u.email && !u.email.includes('persontoperson.local')
    );
    if (admin?.email) return admin.email;

    const currentUser = localStore.getCurrentUser();
    if (
      currentUser &&
      (currentUser.role === 'platform_owner' || currentUser.role === 'admin') &&
      currentUser.email &&
      !currentUser.email.includes('persontoperson.local')
    ) {
      return currentUser.email;
    }

    return INITIAL_USER.email;
  },
};
