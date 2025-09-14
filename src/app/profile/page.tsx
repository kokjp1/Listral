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

  console.log(user);

  if (!user) redirect("/auth/signin");

  return (
    <>
      {/* Profile header */}
      <section className="mx-auto mt-6 w-full max-w-screen-2xl px-4">
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

            <Card className="rounded-2xl">
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
            </Card>
          </div>

          {/* Content: Tabs for Games / Series / Films (MVP) */}
          <div>
            <Card className="rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle>Library</CardTitle>
                <CardDescription>Switch between your media</CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-4">
                <Tabs defaultValue="games" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="games">
                      <Play className="mr-2 size-4" />
                      Games
                    </TabsTrigger>
                    <TabsTrigger value="series">
                      <Tv className="mr-2 size-4" />
                      Series
                    </TabsTrigger>
                    <TabsTrigger value="films">
                      <Film className="mr-2 size-4" />
                      Films
                    </TabsTrigger>
                  </TabsList>

                  {/* Games */}
                  <TabsContent value="games" className="mt-4">
                    <ScrollArea className="h-[420px] rounded-xl border p-3">
                      <ul className="grid gap-3 md:grid-cols-2">
                        {[
                          { title: "Hades II", status: "Playing", hours: 12 },
                          { title: "Cyberpunk 2077", status: "Completed", hours: 84 },
                          { title: "Helldivers 2", status: "Casual", hours: 20 },
                          { title: "Stardew Valley", status: "Paused", hours: 36 },
                        ].map((g) => (
                          <li key={g.title} className="rounded-xl border p-3">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{g.title}</p>
                              <Badge variant="outline">{g.status}</Badge>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">{g.hours} hrs</p>
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </TabsContent>

                  {/* Series */}
                  <TabsContent value="series" className="mt-4">
                    <ScrollArea className="h-[420px] rounded-xl border p-3">
                      <ul className="grid gap-3 md:grid-cols-2">
                        {[
                          { title: "Dr. Stone: Science Future", progress: "S02E09" },
                          { title: "Arcane", progress: "S01E05" },
                          { title: "Peacemaker", progress: "S01E03" },
                        ].map((s) => (
                          <li key={s.title} className="rounded-xl border p-3">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{s.title}</p>
                              <Badge variant="secondary">{s.progress}</Badge>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">Tap to update episode</p>
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </TabsContent>

                  {/* Films */}
                  <TabsContent value="films" className="mt-4">
                    <ScrollArea className="h-[420px] rounded-xl border p-3">
                      <ul className="grid gap-3 md:grid-cols-2">
                        {[
                          { title: "Dune: Part Two", status: "Watched" },
                          { title: "The Batman", status: "To Watch" },
                          { title: "Spider-Verse", status: "Watched" },
                        ].map((f) => (
                          <li key={f.title} className="rounded-xl border p-3">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{f.title}</p>
                              <Badge variant="outline">{f.status}</Badge>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">Add a rating soon</p>
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
