import React, { createContext, useContext, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';

export interface Profile {
  full_name?: string | null;
  phone?: string | null;
  budget_band?: string | null;
  area_interest?: string | null;
  timeline?: string | null;
  bedrooms_min?: number | null;
  priorities?: string[] | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, meta: Profile) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (patch: Profile) => Promise<{ error?: string }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * PREVIEW MODE auth.
 *
 * The original backend lived on the Famous "databasepad" service, which we no
 * longer have credentials for. While we move DOORS onto its own Supabase, this
 * provider runs the site with no database: sign-in always succeeds (no email or
 * password required) so the portal and engine can be viewed. When the real
 * backend is wired up, restore the Supabase-backed version of this file.
 */
const DEMO_USER = {
  id: 'demo-user',
  email: 'preview@doors-properties.com',
} as unknown as User;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const signIn = async (_email: string, _password: string) => {
    setUser(DEMO_USER);
    return {};
  };

  const signUp = async (_email: string, _password: string, meta: Profile) => {
    setUser(DEMO_USER);
    setProfile(meta);
    return {};
  };

  const signOut = async () => {
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (patch: Profile) => {
    setProfile((prev) => ({ ...(prev || {}), ...patch }));
    return {};
  };

  const refreshProfile = async () => {};

  return (
    <AuthContext.Provider
      value={{
        user,
        session: null,
        profile,
        loading: false,
        signUp,
        signIn,
        signOut,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
