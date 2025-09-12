// src/app/auth/signin/page.tsx
"use client";
import { createSupabaseBrowser } from "@/lib/supabase/client";

export default function SignIn() {
  const supabase = createSupabaseBrowser();

  const handleGoogle = async () => {
    const callback = `${window.location.origin}/auth/callback?next=/profile`;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callback, queryParams: { prompt: "consent" } },
    });
  };

  return <button onClick={handleGoogle}>Sign in with Google</button>;
}
