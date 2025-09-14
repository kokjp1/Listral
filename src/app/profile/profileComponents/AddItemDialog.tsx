"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useFormStatus } from "react-dom";
import { PlusIcon } from "@radix-ui/react-icons";
import { createLibraryItem } from "@/functions/crud";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </Button>
  );
}

// Pretty label → EXACT enum value (matches your DB)
const TYPE_OPTIONS = [
  { label: "Game", value: "GAME" },
  { label: "Series", value: "SERIES" },
  { label: "Film", value: "MOVIE" },
  // { label: "Book", value: "BOOK" }, // enable later if you add a tab
];

const STATUS_OPTIONS = [
  { label: "Playing", value: "PLAYING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Paused", value: "PAUSED" },
  { label: "Casual", value: "CASUAL" },
  { label: "To Watch", value: "TO_WATCH" },
];

export default function AddItemDialog() {
  const [open, setOpen] = useState(false);

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
            await createLibraryItem(fd);
            setOpen(false);
          }}
          className="grid gap-4"
        >
          {/* Type (enum) */}
          <div className="grid gap-2">
            <Label>Type</Label>
            <Select
              defaultValue={TYPE_OPTIONS[0].value}
              onValueChange={(v) => {
                const hidden = document.getElementById("type-hidden") as HTMLInputElement | null;
                if (hidden) hidden.value = v;
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
            <input id="type-hidden" name="type" type="hidden" defaultValue={TYPE_OPTIONS[0].value} />
          </div>

          {/* Title */}
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" placeholder="e.g., Hades II" required />
          </div>

          {/* Status (enum) */}
          <div className="grid gap-2">
            <Label>Status</Label>
            <Select
              defaultValue={STATUS_OPTIONS[0].value}
              onValueChange={(v) => {
                const hidden = document.getElementById("status-hidden") as HTMLInputElement | null;
                if (hidden) hidden.value = v;
              }}
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
            <input
              id="status-hidden"
              name="status"
              type="hidden"
              defaultValue={STATUS_OPTIONS[0].value}
            />
          </div>

          {/* Optional fields */}
          <div className="grid gap-2">
            <Label htmlFor="year">Year (optional)</Label>
            <Input id="year" name="year" type="number" inputMode="numeric" placeholder="2024" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="platform_or_author">Platform / Author (optional)</Label>
            <Input
              id="platform_or_author"
              name="platform_or_author"
              placeholder="Steam / HBO / Frank Herbert ..."
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="rating">Rating 1–10 (optional)</Label>
            <Input id="rating" name="rating" type="number" min={1} max={10} inputMode="numeric" placeholder="8" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="progress">Progress (optional)</Label>
            <Input
              id="progress"
              name="progress"
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="e.g., hours or episode #"
            />
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
