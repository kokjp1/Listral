"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase/server";

// Adjust to EXACT enum values in your DB:
const ALLOWED_MEDIA_TYPES = ["MOVIE", "SERIES", "GAME", "BOOK"] as const;
const ALLOWED_STATUS = [
  "PLAYING", "PAUSED", "TO_WATCH", "COMPLETED", "CASUAL",
  "PLANNED", "ACTIVE", "DROPPED",
] as const;

type MediaType = (typeof ALLOWED_MEDIA_TYPES)[number];
type StatusType = (typeof ALLOWED_STATUS)[number];

async function getCurrentAppUserId(): Promise<number> {
  const supabase = await createSupabaseServer();
  const { data: { user }, error: uerr } = await supabase.auth.getUser();
  if (uerr || !user?.email) throw new Error("Not authenticated.");

  const { data: existing, error } = await supabase
    .from("users_app")
    .select("id")
    .eq("email", user.email)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (existing?.id) return existing.id as number;

  const name = user.user_metadata?.full_name ?? null;
  const image = user.user_metadata?.avatar_url ?? null;
  const { data: inserted, error: ierr } = await supabase
    .from("users_app")
    .insert({ email: user.email, name, image })
    .select("id")
    .single();
  if (ierr) throw new Error(ierr.message);
  return inserted.id as number;
}

/* CREATE */
export async function createLibraryItem(formData: FormData) {
  const supabase = await createSupabaseServer();
  const user_id = await getCurrentAppUserId();

  // helpers to parse optional numbers
  const num = (v: FormDataEntryValue | null) => {
    const s = (v ?? "").toString().trim();
    return s === "" ? null : Number(s);
  };

  const type = String(formData.get("type") || "").toUpperCase() as MediaType;
  const status = String(formData.get("status") || "").toUpperCase() as StatusType;
  const title = String(formData.get("title") || "").trim();

  if (!title) throw new Error("Title is required.");
  if (!ALLOWED_MEDIA_TYPES.includes(type)) throw new Error("Invalid media type.");
  if (!ALLOWED_STATUS.includes(status)) throw new Error("Invalid status.");

  const { error } = await supabase.from("library_items").insert({
    user_id,
    type,
    title,
    status,
    year: num(formData.get("year")),
    platform_or_author: (formData.get("platform_or_author") || "").toString().trim() || null,
    rating: num(formData.get("rating")),
    progress: num(formData.get("progress")),
    cover_url: (formData.get("cover_url") || "").toString().trim() || null,
    review: (formData.get("review") || "").toString().trim() || null,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/profile");
}

/* UPDATE */
export async function updateLibraryItem(formData: FormData) {
  const supabase = await createSupabaseServer();
  const user_id = await getCurrentAppUserId();

  const id = Number(formData.get("id"));
  if (!id) throw new Error("Missing id.");

  const num = (v: FormDataEntryValue | null) => {
    const s = (v ?? "").toString().trim();
    return s === "" ? null : Number(s);
  };

  const type = String(formData.get("type") || "").toUpperCase() as MediaType;
  const status = String(formData.get("status") || "").toUpperCase() as StatusType;
  const title = String(formData.get("title") || "").trim();

  if (!title) throw new Error("Title is required.");
  if (!ALLOWED_MEDIA_TYPES.includes(type)) throw new Error("Invalid media type.");
  if (!ALLOWED_STATUS.includes(status)) throw new Error("Invalid status.");

  const { error } = await supabase
    .from("library_items")
    .update({
      type,
      title,
      status,
      year: num(formData.get("year")),
      platform_or_author: (formData.get("platform_or_author") || "").toString().trim() || null,
      rating: num(formData.get("rating")),
      progress: num(formData.get("progress")),
      cover_url: (formData.get("cover_url") || "").toString().trim() || null,
      review: (formData.get("review") || "").toString().trim() || null,
    })
    .eq("id", id)
    .eq("user_id", user_id);

  if (error) throw new Error(error.message);
  revalidatePath("/profile");
}
