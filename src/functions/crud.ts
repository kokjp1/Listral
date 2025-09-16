"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase/server";

const TABLE = "library_items";

export type LibraryItemInput = {
  id?: number;
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
  year?: number | null;
  platform_or_author?: string | null;
  progress?: number | null;
  rating?: number | null;
  cover_url?: string | null;
  review?: string | null;
};

const toNumOrNull = (v: FormDataEntryValue | null): number | null => {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const toStrOrNull = (v: FormDataEntryValue | null): string | null =>
  v == null || String(v).trim() === "" ? null : String(v);

const REVALIDATE_PATH = "/profile";

async function requireUser() {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  if (!data.user) throw new Error("Not authenticated.");
  return { supabase, user: data.user };
}

export async function addLibraryItem(formData: FormData) {
  const { supabase, user } = await requireUser();

  const payload: LibraryItemInput = {
    type: (formData.get("type") as LibraryItemInput["type"]) ?? "GAME",
    title: String(formData.get("title") ?? "").trim(),
    status: (formData.get("status") as LibraryItemInput["status"]) ?? "PLANNED",
    year: toNumOrNull(formData.get("year")),
    platform_or_author: toStrOrNull(formData.get("platform_or_author")),
    progress: toNumOrNull(formData.get("progress")),
    rating: toNumOrNull(formData.get("rating")),
    cover_url: toStrOrNull(formData.get("cover_url")),
    review: toStrOrNull(formData.get("review")),
  };

  if (!payload.title) throw new Error("Title is required.");

  const { error } = await supabase.from(TABLE).insert({
    ...payload,
    user_id: user.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  if (error) throw new Error(error.message);
  if (REVALIDATE_PATH) revalidatePath(REVALIDATE_PATH);
}

export async function updateLibraryItem(formData: FormData) {
  const { supabase, user } = await requireUser();

  const id = Number(formData.get("id"));
  if (!id || Number.isNaN(id)) throw new Error("Missing or invalid id.");

  const payload: LibraryItemInput = {
    id,
    type: (formData.get("type") as LibraryItemInput["type"]) ?? "GAME",
    title: String(formData.get("title") ?? "").trim(),
    status: (formData.get("status") as LibraryItemInput["status"]) ?? "PLANNED",
    year: toNumOrNull(formData.get("year")),
    platform_or_author: toStrOrNull(formData.get("platform_or_author")),
    progress: toNumOrNull(formData.get("progress")),
    rating: toNumOrNull(formData.get("rating")),
    cover_url: toStrOrNull(formData.get("cover_url")),
    review: toStrOrNull(formData.get("review")),
  };

  if (!payload.title) throw new Error("Title is required.");

  const { error } = await supabase
    .from(TABLE)
    .update({
      type: payload.type,
      title: payload.title,
      status: payload.status,
      year: payload.year,
      platform_or_author: payload.platform_or_author,
      progress: payload.progress,
      rating: payload.rating,
      cover_url: payload.cover_url,
      review: payload.review,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  if (REVALIDATE_PATH) revalidatePath(REVALIDATE_PATH);
}

export async function deleteLibraryItem(formData: FormData) {
  const { supabase, user } = await requireUser();

  const id = Number(formData.get("id"));
  if (!id || Number.isNaN(id)) throw new Error("Missing or invalid id.");

  const { error } = await supabase.from(TABLE).delete().eq("id", id).eq("user_id", user.id);

  if (error) throw new Error(error.message);
  if (REVALIDATE_PATH) revalidatePath(REVALIDATE_PATH);
}

export async function addLibraryItemDirect(input: LibraryItemInput) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from(TABLE).insert({
    ...input,
    user_id: user.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
  if (REVALIDATE_PATH) revalidatePath(REVALIDATE_PATH);
}

export async function updateLibraryItemDirect(input: LibraryItemInput & { id: number }) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from(TABLE)
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.id)
    .eq("user_id", user.id);
  if (error) throw new Error(error.message);
  if (REVALIDATE_PATH) revalidatePath(REVALIDATE_PATH);
}

export async function deleteLibraryItemDirect(id: number) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from(TABLE).delete().eq("id", id).eq("user_id", user.id);
  if (error) throw new Error(error.message);
  if (REVALIDATE_PATH) revalidatePath(REVALIDATE_PATH);
}
