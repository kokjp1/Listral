"use client";
import { Button } from "@/components/ui/button"
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { Github } from "lucide-react";
import { MessageCircle } from "lucide-react"; // using Lucide for Discord icon

export default function SignIn() {
  const supabase = createSupabaseBrowser();

  const handleGoogle = async () => {
    const callback = `${window.location.origin}/auth/callback?next=/profile`;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callback, queryParams: { prompt: "consent" } },
    });
  };

  const handleGithub = async () => {
    const callback = `${window.location.origin}/auth/callback?next=/profile`;
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: callback },
    });
  };

  const handleDiscord = async () => {
    const callback = `${window.location.origin}/auth/callback?next=/profile`;
    await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: { redirectTo: callback },
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <Button variant="outline" className="w-1/6 flex items-center gap-2" onClick={handleGoogle}>
        <img src="/images/icons/google-icon.svg" alt="Google Logo" className="w-4" />
        Login with Google
      </Button>

      <Button variant="outline" className="w-1/6 flex items-center gap-2" onClick={handleGithub}>
        <Github className="w-4 h-4" />
        Login with GitHub
      </Button>

      <Button variant="outline" className="w-1/6 flex items-center gap-2" onClick={handleDiscord}>
        <MessageCircle className="w-4 h-4" />
        Login with Discord
      </Button>
    </div>
  );
}
