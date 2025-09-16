"use client";

import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useFormStatus } from "react-dom";
import { PlusIcon } from "@radix-ui/react-icons";
import { addLibraryItem } from "@/functions/crud";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </Button>
  );
}

const TYPE_OPTIONS = [
  { label: "Game", value: "GAME" },
  { label: "Series", value: "SERIES" },
  { label: "Film", value: "MOVIE" },
  // { label: "Book", value: "BOOK" },
] as const;

type Status =
  | "PLANNED"
  | "PLAYING"
  | "CASUAL"
  | "WATCHING"
  | "READING"
  | "PAUSED"
  | "DROPPED"
  | "COMPLETED";

const ALL_STATUS_OPTIONS: { label: string; value: Status }[] = [
  { label: "Planned", value: "PLANNED" },
  { label: "Playing", value: "PLAYING" },
  { label: "Casual", value: "CASUAL" },
  { label: "Watching", value: "WATCHING" },
  { label: "Reading", value: "READING" },
  { label: "Paused", value: "PAUSED" },
  { label: "Dropped", value: "DROPPED" },
  { label: "Completed", value: "COMPLETED" },
];

type TypeValue = (typeof TYPE_OPTIONS)[number]["value"] | "BOOK";

const STATUS_BY_TYPE: Record<TypeValue, Status[]> = {
  GAME: ["PLANNED", "PLAYING", "CASUAL", "PAUSED", "DROPPED", "COMPLETED"],
  MOVIE: ["PLANNED", "WATCHING", "CASUAL", "PAUSED", "DROPPED", "COMPLETED"],
  SERIES: ["PLANNED", "WATCHING", "CASUAL", "PAUSED", "DROPPED", "COMPLETED"],
  BOOK: ["PLANNED", "READING", "CASUAL", "PAUSED", "DROPPED", "COMPLETED"],
};

const getStatusOptionsForType = (t: TypeValue) =>
  ALL_STATUS_OPTIONS.filter((o) => STATUS_BY_TYPE[t].includes(o.value));

export default function AddItemDialog() {
  const [open, setOpen] = useState(false);
  const [typeValue, setTypeValue] = useState<TypeValue>(TYPE_OPTIONS[0].value);
  const [statusValue, setStatusValue] = useState<Status>("PLANNED");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusIcon className="mr-2" /> Add New
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add to Library</DialogTitle>
          <DialogDescription>Fill in the details and save it to your collection.</DialogDescription>
        </DialogHeader>

        <form
          action={async (fd) => {
            await addLibraryItem(fd);
            setOpen(false);
          }}
          className="grid gap-4"
        >
          <div className="grid gap-2">
            <Label>Type</Label>
            <Select
              value={typeValue}
              onValueChange={(v) => {
                const next = v as TypeValue;
                setTypeValue(next);
                setStatusValue((s) =>
                  STATUS_BY_TYPE[next].includes(s) ? s : "PLANNED"
                );
              }}
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
            <input name="type" type="hidden" value={typeValue} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" placeholder="e.g., Hades II" required />
          </div>

          <div className="grid gap-2">
            <Label>Status</Label>
            <Select value={statusValue} onValueChange={(v) => setStatusValue(v as Status)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {getStatusOptionsForType(typeValue).map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input name="status" type="hidden" value={statusValue} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="year">Year (optional)</Label>
            <Input id="year" name="year" type="number" inputMode="numeric" placeholder="2024" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="platform_or_author">Platform / Author (optional)</Label>
            <Input id="platform_or_author" name="platform_or_author" placeholder="Steam / HBO / Frank Herbert ..." />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="rating">Rating 1–10 (optional)</Label>
            <Input id="rating" name="rating" type="number" min={1} max={10} inputMode="numeric" placeholder="8" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="progress">Progress (optional)</Label>
            <Input id="progress" name="progress" type="number" min={0} inputMode="numeric" placeholder="e.g., hours or episode #" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cover_url">Cover URL (optional)</Label>
            <Input id="cover_url" name="cover_url" type="url" placeholder="https://..." />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="review">Review (optional)</Label>
            <Textarea id="review" name="review" placeholder="Short thoughts..." />
          </div>

          <DialogFooter className="mt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
