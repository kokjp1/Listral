"use client";
import { Button } from "@/components/ui/button"
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

  return (
    <>
    <Button variant="outline" className="w-1/6" onClick={handleGoogle}>
      Login with Google
      <img src="/images/icons/google-icon.svg" alt="Google Logo" className="w-4" />
    </Button>
    </>
  );


}
