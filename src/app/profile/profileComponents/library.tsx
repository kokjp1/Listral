// src/app/profile/profileComponents/library.tsx
import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Play, Tv, Film } from "lucide-react";
import AddItemDialog from "./AddItemDialog";
import InlineItemSheet from "./InlineItemSheet";
import { enumLabel } from "@/lib/format";

async function getCurrentAppUserId() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return null;

  const { data, error } = await supabase
    .from("users_app")
    .select("id")
    .eq("email", user.email)
    .maybeSingle();

  if (error) return null;
  return data?.id as number | undefined | null;
}

type Item = {
  id: number;
  type: "GAME" | "SERIES" | "MOVIE" | "BOOK";
  title: string;
  status:
  | "PLAYING"
  | "PAUSED"
  | "TO_WATCH"
  | "COMPLETED"
  | "CASUAL"
  | "PLANNED"
  | "ACTIVE"
  | "DROPPED";
  progress: number | null;
  rating: number | null;
  year: number | null;
  platform_or_author: string | null;
  cover_url: string | null;
  review: string | null; // ← add this
};

function EmptyState({ hint }: { hint: string }) {
  return (
    <div className="flex h-[420px] items-center justify-center">
      <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
        <p className="mb-2">No items yet.</p>
        <p className="mb-4">{hint}</p>
        <AddItemDialog />
      </div>
    </div>
  );
}

function List({ items }: { items: Item[] }) {
  if (!items.length) return <EmptyState hint="Click “Add New” to create your first item." />;

  return (
    <ScrollArea className="max-h-[420px] rounded-xl border p-3">
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
        {items.map((it) => (
          <li key={it.id} className="rounded-xl border transition hover:bg-muted/40">
            <InlineItemSheet item={it}>
              <button className="flex w-full gap-3 p-3 text-left">
                {it.cover_url && (
                  <div className="shrink-0 overflow-hidden rounded-md w-16 aspect-[9/16] h-20">
                    <img src={it.cover_url} alt={it.title} className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{it.title}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {it.year ? `${it.year} · ` : ""}
                        {it.platform_or_author ?? ""}
                      </p>
                    </div>
                    <Badge variant="outline" className="w-fit text-[10px] px-2 py-0.5 sm:text-xs">
                      {enumLabel(it.status)}
                    </Badge>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {it.progress != null && <span>Progress: {it.progress}</span>}
                    {it.progress != null && it.rating != null && <span> · </span>}
                    {it.rating != null && <span>Rating: {it.rating}/10</span>}
                  </div>
                </div>
              </button>
            </InlineItemSheet>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}

// Server component
export default async function Library() {
  const supabase = await createSupabaseServer();
  const userAppId = await getCurrentAppUserId();

  let items: Item[] = [];
  if (userAppId) {
    const { data } = await supabase
      .from("library_items")
      .select("id, type, title, status, progress, rating, year, platform_or_author, cover_url")
      .eq("user_id", userAppId)
      .order("created_at", { ascending: false });

    if (data) items = data as unknown as Item[];
  }

  const games = items.filter((i) => i.type === "GAME");
  const series = items.filter((i) => i.type === "SERIES");
  const films = items.filter((i) => i.type === "MOVIE");

  return (
    <div>
      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row justify-between">
          <div>
            <CardTitle className="pb-2">Library</CardTitle>
            <CardDescription>Switch between your media</CardDescription>
          </div>
          <AddItemDialog />
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

            <TabsContent value="games" className="mt-4">
              <List items={games} />
            </TabsContent>

            <TabsContent value="series" className="mt-4">
              <List items={series} />
            </TabsContent>

            <TabsContent value="films" className="mt-4">
              <List items={films} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
