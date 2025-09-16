"use client";

import { ReactNode, useEffect, useState } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateLibraryItem, deleteLibraryItem } from "@/functions/crud";
import { Card, CardContent } from "@/components/ui/card";
import { enumLabel } from "@/lib/format";
import { showSuccessToast } from "@/components/ui/toast";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

type Item = {
  id: number;
  type: "GAME" | "SERIES" | "MOVIE" | "BOOK";
  title: string;
  status:
    | "PLANNED"
    | "PLAYING"
    | "CASUAL"
    | "WATCHING"
    | "READING"
    | "PAUSED"
    | "DROPPED"
    | "COMPLETED";
  progress: number | null;
  rating: number | null;
  year: number | null;
  platform_or_author: string | null;
  cover_url: string | null;
  review: string | null;
};

const TYPE_OPTIONS = [
  { label: "Game", value: "GAME" },
  { label: "Series", value: "SERIES" },
  { label: "Film", value: "MOVIE" },
  { label: "Book", value: "BOOK" },
] as const;

const STATUS_OPTIONS = [
  { label: "Planned", value: "PLANNED" },
  { label: "Playing", value: "PLAYING" },
  { label: "Casual", value: "CASUAL" },
  { label: "Watching", value: "WATCHING" },
  { label: "Reading", value: "READING" },
  { label: "Paused", value: "PAUSED" },
  { label: "Dropped", value: "DROPPED" },
  { label: "Completed", value: "COMPLETED" },
] as const;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return isMobile;
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </Button>
  );
}

const getErrorMessage = (e: unknown) =>
  e instanceof Error ? e.message : typeof e === "string" ? e : "Please try again.";

export default function InlineItemSheet({
  item,
  children,
}: {
  item: Item;
  children: ReactNode;
}) {
  const isMobile = useIsMobile();
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [typeValue, setTypeValue] = useState<Item["type"]>(item.type);
  const [statusValue, setStatusValue] = useState<Item["status"]>(item.status);

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={isMobile ? "h-[85vh] rounded-t-2xl p-6" : "w-full sm:max-w-[560px] p-6"}
      >
        <SheetHeader className="flex flex-row p-0 pt-4">
          {item.cover_url && (
            <img
              src={item.cover_url}
              alt={item.title}
              className="w-16 rounded-sm object-cover mr-2"
            />
          )}
          <div>
            <SheetTitle>{item.title}</SheetTitle>
            <SheetDescription>
              {item.year ? `${item.year} · ` : ""}
              {item.platform_or_author ?? ""}
            </SheetDescription>
          </div>
          <Button
            variant={editing ? "secondary" : "default"}
            onClick={() => setEditing((v) => !v)}
            className="ml-auto mt-auto"
          >
            {editing ? "Cancel" : "Edit"}
          </Button>
        </SheetHeader>

        <Separator className="my-3" />

        {!editing ? (
          // VIEW MODE
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Card className="rounded-xl">
              <CardContent>
                <p className="text-xs text-muted-foreground">Type</p>
                <p className="mt-1 font-medium">{enumLabel(item.type)}</p>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardContent>
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="mt-1 font-medium">
                  {enumLabel(item.status.replaceAll("_", " "))}
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardContent>
                <p className="text-xs text-muted-foreground">Year</p>
                <p className="mt-1 font-medium">{item.year ?? "N/A"}</p>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardContent>
                <p className="text-xs text-muted-foreground">Platform / Author</p>
                <p className="mt-1 truncate font-medium">
                  {item.platform_or_author ?? "N/A"}
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardContent>
                <p className="text-xs text-muted-foreground">Progress</p>
                <p className="mt-1 font-medium">{item.progress ?? "N/A"}</p>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardContent>
                <p className="text-xs text-muted-foreground">Rating</p>
                <p className="mt-1 font-medium">
                  {item.rating != null ? `${item.rating}/10` : "N/A"}
                </p>
              </CardContent>
            </Card>

            <div className="sm:col-span-2">
              <Label className="text-muted-foreground">Review</Label>
              <Card className="mt-2 rounded-xl">
                <CardContent>
                  <p className="whitespace-pre-line text-sm text-muted-foreground">
                    {item.review?.trim() || "Geen review geschreven"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          // EDIT MODE
          <>
           {/* Standalone delete form (outside the edit form) */}
           <form
             id={`delete-item-${item.id}`}
             action={async (fd) => {
               try {
                 await deleteLibraryItem(fd);
                 showSuccessToast({
                   title: "Deleted",
                   description: `"${item.title}" was removed from your library.`,
                 });
                 setEditing(false);
                 router.refresh();
               } catch (e: unknown) {
                 toast.error("Delete failed", { description: getErrorMessage(e) });
               }
             }}
             className="hidden"
           >
             <input type="hidden" name="id" value={item.id} />
           </form>

            <form
              action={async (fd) => {
                try {
                  await updateLibraryItem(fd);
                  setEditing(false);
                  router.refresh();
                  showSuccessToast({
                    title: "Saved",
                    description: "Your changes were updated.",
                  });
                } catch (e: unknown) {
                  toast.error("Save failed", { description: getErrorMessage(e) });
                }
              }}
              className="mt-4 grid grid-cols-1 gap-4"
            >
              <input type="hidden" name="id" value={item.id} />

              <div className="grid gap-2">
                <Label>Type</Label>
                <Select
                  value={typeValue}
                  onValueChange={(v) => setTypeValue(v as Item["type"])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPE_OPTIONS.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" name="type" value={typeValue} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" defaultValue={item.title} required />
              </div>

              <div className="grid gap-2">
                <Label>Status</Label>
                <Select
                  value={statusValue}
                  onValueChange={(v) => setStatusValue(v as Item["status"])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" name="status" value={statusValue} />
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    name="year"
                    type="number"
                    defaultValue={item.year ?? undefined}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="platform_or_author">Platform / Author</Label>
                  <Input
                    id="platform_or_author"
                    name="platform_or_author"
                    defaultValue={item.platform_or_author ?? ""}
                  />
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="progress">Progress</Label>
                  <Input
                    id="progress"
                    name="progress"
                    type="number"
                    defaultValue={item.progress ?? undefined}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="rating">Rating (1–10)</Label>
                  <Input
                    id="rating"
                    name="rating"
                    type="number"
                    min={1}
                    max={10}
                    defaultValue={item.rating ?? undefined}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cover_url">Cover URL</Label>
                <Input
                  id="cover_url"
                  name="cover_url"
                  type="url"
                  defaultValue={item.cover_url ?? ""}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="review">Review</Label>
                <Textarea id="review" name="review" defaultValue={item.review ?? ""} />
              </div>

              <div className="mt-4 flex items-center justify-between">
                {/* Left: Delete trigger */}
                <AlertDialog>
                   <AlertDialogTrigger asChild>
                     <Button variant="destructive">Delete</Button>
                   </AlertDialogTrigger>

                   <AlertDialogContent>
                     <AlertDialogHeader>
                       <AlertDialogTitle>Delete “{item.title}”?</AlertDialogTitle>
                       <AlertDialogDescription>
                         This action permanently removes the item from your library. You can’t undo this.
                       </AlertDialogDescription>
                     </AlertDialogHeader>

                     <AlertDialogFooter>
                       <AlertDialogCancel>Cancel</AlertDialogCancel>

                       {/* OPTION A: use the `form` attribute */}
                       <AlertDialogAction asChild>
                         <button type="submit" form={`delete-item-${item.id}`}>
                           Confirm delete
                         </button>
                       </AlertDialogAction>
                     </AlertDialogFooter>
                   </AlertDialogContent>
                 </AlertDialog>

                {/* Right: Cancel/Save */}
                <div className="flex items-center gap-2">
                   <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
                     Cancel
                   </Button>
                   <SaveButton />
                 </div>
               </div>
               
             </form>
           </>
        )}
      </SheetContent>
    </Sheet>
  );
}
