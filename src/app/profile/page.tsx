import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// ⬇️ shadcn/ui
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ListChecks, Play, Tv, Film, Settings, LogOut } from "lucide-react";
import ProfileHeader from "./profileComponents/header";
import Library from "./profileComponents/library";

// ⬇️ Server Action for sign-out (Google OAuth2 included)
export async function signOutAction() {
  "use server";
  const supabase = await createSupabaseServer();
  await supabase.auth.signOut();
  redirect("/auth/signin");
}

export default async function ProfilePage() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/signin");

  return (
    <>
      {/* Profile header */}
      <section className="mx-auto mt-6 w-full max-w-4xl px-4">
        <ProfileHeader
          user={{
            email: user.email ?? null,
            user_metadata: {
              full_name: user.user_metadata?.full_name ?? null,
              avatar_url: user.user_metadata?.avatar_url ?? null,
            },
          }}
        />

        {/* Main grid with sidebar + content */}
        <div className="mt-6 grid gap-6 md:grid-cols-[320px,1fr]">
          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>Quick stats for your media</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between rounded-xl border p-3">
                  <div className="flex items-center gap-2">
                    <Play className="size-4" />
                    <span>Games tracked</span>
                  </div>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border p-3">
                  <div className="flex items-center gap-2">
                    <Tv className="size-4" />
                    <span>Series tracked</span>
                  </div>
                  <span className="font-semibold">8</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border p-3">
                  <div className="flex items-center gap-2">
                    <Film className="size-4" />
                    <span>Films tracked</span>
                  </div>
                  <span className="font-semibold">15</span>
                </div>
              </CardContent>
            </Card>

            {/* <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Quick actions</CardTitle>
                <CardDescription>Update your progress fast</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Button className="justify-start" variant="secondary">
                  <ListChecks className="mr-2 size-4" />
                  Add a new game
                </Button>
                <Button className="justify-start" variant="secondary">
                  <ListChecks className="mr-2 size-4" />
                  Add a new series
                </Button>
                <Button className="justify-start" variant="secondary">
                  <ListChecks className="mr-2 size-4" />
                  Add a new film
                </Button>
              </CardContent>
            </Card> */}
          </div>

          <Library></Library>
        </div>
      </section>
    </>
  );
}
