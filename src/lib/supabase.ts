import { env } from "@/env";
import { createClient } from "@supabase/supabase-js";

export const adminSupabase = createClient(
  env.SUPABASE_DB_URL,
  env.SUPABASE_SERVICE_ROLE,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);
