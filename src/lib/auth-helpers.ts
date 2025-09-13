// src/lib/auth-helpers.ts
import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Create a Supabase browser client for use in Client Components and event handlers.
 * Reads public env vars. No `any` types.
 */
export function createSupabaseBrowser(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // Fail early in the browser to make misconfig obvious during dev
    throw new Error(
      "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  return createBrowserClient(url, key);
}

/**
 * Convenience auth helpers (optional, typed).
 * Safe to import in client components.
 */
export async function signInWithGoogleRedirect(
  supabase: SupabaseClient,
  options?: { redirectTo?: string }
): Promise<void> {
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: options?.redirectTo, // e.g. `${location.origin}/auth/callback`
    },
  });
}

export async function signOutBrowser(supabase: SupabaseClient): Promise<void> {
  await supabase.auth.signOut();
}
