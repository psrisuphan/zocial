import { createClient } from "@supabase/supabase-js";

// Single module-level client shared across the app (client-side only).
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
