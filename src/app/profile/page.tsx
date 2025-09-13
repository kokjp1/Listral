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
      <h1>Hello {user.email}</h1>

      {/* Profile header */}
      <section className="mx-auto mt-6 w-full max-w-screen-2xl px-4">
        <div className="flex flex-col gap-4 rounded-2xl border bg-background/50 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="size-14">
              <AvatarFallback className="text-lg">
                {user.email?.[0]?.toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold leading-tight">Your Profile</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <Badge variant="secondary">Member</Badge>
                <Badge variant="outline">MVP</Badge>
              </div>
            </div>
          </div>
          <div className="flex w-full max-w-md items-center gap-2 sm:w-auto">
            <Input placeholder="Search your library…" className="h-10" />
            <Button className="h-10" variant="secondary" size="icon" aria-label="Settings">
              <Settings className="size-4" />
            </Button>

            {/* ⬇️ Sign out button posts to server action */}
            <form action={signOutAction}>
              <Button className="h-10" variant="outline" size="icon" aria-label="Sign out" type="submit">
                <LogOut className="size-4" />
              </Button>
            </form>
          </div>
        </div>

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
