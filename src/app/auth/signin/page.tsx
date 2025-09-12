"use client";
import { createSupabaseBrowser } from "@/lib/supabase/client";

export default function SignInPage() {
  const supabase = createSupabaseBrowser();

  async function signIn() {
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: "http://localhost:3000/auth/callback" },
    })
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <button
        onClick={signIn}
        className="rounded-lg px-4 py-2 bg-black text-white"
      >
        Sign in with Google
      </button>
    </div>
  );
}
