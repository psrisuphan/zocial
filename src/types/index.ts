import type { Session } from "@supabase/supabase-js";

/** A row from the `profiles` table. Keyed on the immutable auth user id. */
export interface Profile {
  id: string;
  username: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Shape exposed by the auth context. State-only by design — it owns the
 * shared session/profile, not the auth *methods*. Each auth method (password,
 * phone OTP, OAuth) keeps its own flow calling supabase.auth.* directly, so
 * adding one needs no change here. Email/phone/provider live on `session`.
 */
export interface AuthContextValue {
  user: Profile | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}
