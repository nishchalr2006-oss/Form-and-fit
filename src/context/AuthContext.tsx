import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isOwner: boolean;
  isAdmin: boolean;
  login: (email: string, role?: UserRole) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  setOwnerSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    // Check saved session in localStorage
    const saved = localStorage.getItem('form_fit_user_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isSupabaseConfigured()) {
      // Fetch initial session from Supabase
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          fetchUserProfile(session.user.id, session.user.email || '');
        } else {
          setLoading(false);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          fetchUserProfile(session.user.id, session.user.email || '');
        } else {
          setUser(null);
          localStorage.removeItem('form_fit_user_session');
          setLoading(false);
        }
      });

      return () => subscription.unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      }

      if (data) {
        const profile: UserProfile = {
          id: data.id,
          email: data.email || email,
          full_name: data.full_name,
          phone: data.phone,
          role: data.role as UserRole,
          created_at: data.created_at,
        };
        setUser(profile);
        localStorage.setItem('form_fit_user_session', JSON.stringify(profile));
      } else {
        // Create profile fallback
        const newProfile: UserProfile = {
          id: userId,
          email: email,
          role: 'customer',
          created_at: new Date().toISOString(),
        };
        setUser(newProfile);
        localStorage.setItem('form_fit_user_session', JSON.stringify(newProfile));
      }
    } catch (err) {
      console.error('Profile fetch exception:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, requestedRole: UserRole = 'customer') => {
    setLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) {
          setLoading(false);
          return { success: false, message: error.message };
        }
        return { success: true, message: 'Magic login link sent to your email.' };
      } else {
        // Direct session initialization for testing
        const simulatedProfile: UserProfile = {
          id: `usr_${Math.random().toString(36).substring(2, 9)}`,
          email: email,
          full_name: email.split('@')[0].toUpperCase(),
          role: requestedRole,
          created_at: new Date().toISOString(),
        };
        setUser(simulatedProfile);
        localStorage.setItem('form_fit_user_session', JSON.stringify(simulatedProfile));
        setLoading(false);
        return { success: true };
      }
    } catch (err: any) {
      setLoading(false);
      return { success: false, message: err?.message || 'Login failed' };
    }
  };

  const setOwnerSession = () => {
    const ownerProfile: UserProfile = {
      id: 'owner_primary_account',
      email: 'owner@formandfit.in',
      full_name: 'Store Owner',
      role: 'owner',
      created_at: new Date().toISOString(),
    };
    setUser(ownerProfile);
    localStorage.setItem('form_fit_user_session', JSON.stringify(ownerProfile));
  };

  const logout = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('form_fit_user_session');
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem('form_fit_user_session', JSON.stringify(updated));

    if (isSupabaseConfigured()) {
      await supabase.from('profiles').update(data).eq('id', user.id);
    }
  };

  const isOwner = user?.role === 'owner';
  const isAdmin = user?.role === 'owner' || user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isOwner,
        isAdmin,
        login,
        logout,
        updateProfile,
        setOwnerSession,
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
