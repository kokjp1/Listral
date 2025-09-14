"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { GitHubLogoIcon, DiscordLogoIcon,  } from "@radix-ui/react-icons";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const supabase = createSupabaseBrowser();

  const callback = () =>
    `${window.location.origin}/auth/callback?next=/profile`;

  const signIn = async (provider: "google" | "github" | "discord") => {
    await supabase.auth.signInWithOAuth({
      provider,
      options:
        provider === "google"
          ? { redirectTo: callback(), queryParams: { prompt: "consent" } }
          : { redirectTo: callback() },
    });
  };

  return (
    <div className={cn("flex flex-col gap-6 w-1/4", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welkom terug</CardTitle>
          <CardDescription>
            Login met je Google, GitHub, or Discord account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={() => signIn("google")}
            >
              <img src="/images/icons/GoogleLogoIcon.svg" alt="Google" className="h-4 w-4" />
              Login met Google
            </Button>

            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={() => signIn("github")}
            >
              <GitHubLogoIcon className="h-4 w-4" />
              Login met GitHub
            </Button>

            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={() => signIn("discord")}
            >
              <DiscordLogoIcon className="h-4 w-4" />
              Login met Discord
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        Voor meer informatie, bekijk de <a href="https://hva-19.gitbook.io/listral-wiki/" target="blank">wiki van Listral</a>
      </div>
    </div>
  );
}
