// src/lib/supabase/server.ts
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Next.js 15: cookies() may be async in Server Actions/Edge,
 * so we await it and expose a typed Supabase client.
 */
export async function createSupabaseServer(): Promise<SupabaseClient> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  const cookieStore = await cookies(); // <-- important in Next 15

  return createServerClient(url, key, {
    cookies: {
      get(name: string): string | undefined {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions): void {
        // In RSC this can throw; wrap to avoid hard crashes.
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // noop – setting cookies is only allowed in Server Actions/Route Handlers
        }
      },
      remove(name: string, options: CookieOptions): void {
        try {
          cookieStore.set({ name, value: "", ...options, maxAge: 0 });
        } catch {
          // noop
        }
      },
    },
  });
}

/** Optional convenience */
export async function getServerUser() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return { user, error };
}
