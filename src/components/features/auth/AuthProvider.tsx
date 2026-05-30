"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { AuthContextValue, Profile } from "@/types";

const PROFILE_COLUMNS =
  "id, username, display_name, bio, avatar_url, created_at, updated_at";

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

/**
 * Owns the shared auth *state* — session (from Supabase Auth) and the matching
 * profiles row. Stays out of routing; pages decide where to redirect. Any auth
 * method that creates a session flows through onAuthStateChange, so password,
 * phone OTP, and OAuth all populate this provider without changes here.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadProfile = async (uid: string) => {
      const { data } = await supabase
        .from("profiles")
        .select(PROFILE_COLUMNS)
        .eq("id", uid)
        .single();
      if (active) setUser((data as Profile) ?? null);
    };

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      setSession(data.session);
      if (data.session) await loadProfile(data.session.user.id);
      if (active) setLoading(false);
    };
    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      if (next) {
        loadProfile(next.user.id);
      } else {
        setUser(null);
      }
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
