import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase } from '../../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import type { Tables } from '../../types/database';

export type UserRole = 'customer' | 'provider' | 'admin';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  avatar_url?: string | null;
  bio?: string | null;
}

interface AuthContextValue {
  user: AppUser;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<UserRole | null>;
  signUp: (email: string, password: string, meta: { name: string; phone: string; role: UserRole }) => Promise<{ error: string | null }>;
  setRole: (role: UserRole) => void;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const GUEST_USER: AppUser = {
  id: '',
  name: 'Guest',
  email: '',
  role: 'customer',
  avatar: 'G',
};

const AuthContext = createContext<AuthContextValue | null>(null);

function profileToAppUser(profile: Tables<'profiles'>): AppUser {
  const initials = profile.name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    role: profile.role as UserRole,
    avatar: initials,
    phone: profile.phone ?? undefined,
    avatar_url: profile.avatar_url,
    bio: profile.bio,
  };
}

async function fetchProfile(userId: string): Promise<Tables<'profiles'> | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) return null;
  return data;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [appUser, setAppUser] = useState<AppUser>(GUEST_USER);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!session?.user;

  const loadProfile = useCallback(async (authUser: User) => {
    const profile = await fetchProfile(authUser.id);
    if (profile) {
      setAppUser(profileToAppUser(profile));
    } else {
      const meta = authUser.user_metadata;
      setAppUser({
        id: authUser.id,
        name: (meta?.name as string) || authUser.email?.split('@')[0] || 'User',
        email: authUser.email || '',
        role: (meta?.role as UserRole) || 'customer',
        avatar: ((meta?.name as string) || 'U').charAt(0).toUpperCase(),
      });
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s?.user) {
        loadProfile(s.user).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s?.user) {
        loadProfile(s.user);
      } else {
        setAppUser(GUEST_USER);
      }
    });

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  async function login(email: string, password: string): Promise<UserRole | null> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error || !data.user) return null;

    const profile = await fetchProfile(data.user.id);
    if (profile) {
      setAppUser(profileToAppUser(profile));
      return profile.role as UserRole;
    }

    const role = (data.user.user_metadata?.role as UserRole) || 'customer';
    return role;
  }

  async function signUp(
    email: string,
    password: string,
    meta: { name: string; phone: string; role: UserRole },
  ): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { name: meta.name, phone: meta.phone, role: meta.role },
      },
    });

    if (error) return { error: error.message };
    return { error: null };
  }

  function setRole(newRole: UserRole) {
    setAppUser(prev => ({ ...prev, role: newRole }));
  }

  async function logout() {
    await supabase.auth.signOut();
    setSession(null);
    setAppUser(GUEST_USER);
  }

  async function refreshProfile() {
    if (session?.user) {
      await loadProfile(session.user);
    }
  }

  return (
    <AuthContext.Provider value={{ user: appUser, isAuthenticated, isLoading, login, signUp, setRole, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
