"use client";

import {
  createContext, useContext, useEffect, useState, useCallback,
  type ReactNode,
} from "react";
import { supabase, type Profile } from "@/lib/supabase";
import type { Session, User, AuthError } from "@supabase/supabase-js";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
type AuthResult = { error: AuthError | null };

interface AuthContextValue {
  user:        User    | null;
  profile:     Profile | null;
  session:     Session | null;
  loading:     boolean;
  profileLoading: boolean;

  signUp:      (email: string, password: string, fullName: string) => Promise<AuthResult>;
  signIn:      (email: string, password: string)                   => Promise<AuthResult>;
  signInGoogle:()                                                  => Promise<AuthResult>;
  signOut:     ()                                                  => Promise<void>;
  updateProfile: (data: Partial<Pick<Profile, "full_name" | "phone" | "avatar_url">>) => Promise<AuthResult>;
  refreshProfile: () => Promise<void>;
}

/* ─────────────────────────────────────────
   Context
───────────────────────────────────────── */
const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

/* ─────────────────────────────────────────
   Provider
───────────────────────────────────────── */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,           setUser]           = useState<User    | null>(null);
  const [session,        setSession]        = useState<Session | null>(null);
  const [profile,        setProfile]        = useState<Profile | null>(null);
  const [loading,        setLoading]        = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  /* Fetch profile row from DB */
  const fetchProfile = useCallback(async (uid: string) => {
    setProfileLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", uid)
      .single();
    if (!error && data) setProfile(data as Profile);
    setProfileLoading(false);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user.id);
  }, [user, fetchProfile]);

  /* Listen to auth state changes */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const s = data.session;
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) fetchProfile(s.user.id);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) fetchProfile(s.user.id);
      else setProfile(null);
    });

    return () => listener.subscription.unsubscribe();
  }, [fetchProfile]);

  /* ── Auth actions ── */
  const signUp = async (email: string, password: string, fullName: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/profile`,
      },
    });
    return { error };
  };

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signInGoogle = async (): Promise<AuthResult> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/profile` },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

const updateProfile = async (
  data: Partial<Pick<Profile, "full_name" | "phone" | "avatar_url">>
): Promise<AuthResult> => {
  if (!user) {
    return {
      error: {
        name: "AuthError",
        message: "Not authenticated",
        status: 401,
      } as AuthError,
    };
  }

  const { error } = await supabase
    .from("profiles")
    .update(data)
    .eq("id", user.id);

  if (error) {
    return {
      error: {
        name: "AuthError",
        message: error.message,
        status: 400,
      } as AuthError,
    };
  }

  await fetchProfile(user.id);

  return { error: null };
};

  return (
    <AuthContext.Provider value={{
      user, profile, session, loading, profileLoading,
      signUp, signIn, signInGoogle, signOut, updateProfile, refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}