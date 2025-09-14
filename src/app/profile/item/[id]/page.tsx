import { createSupabaseServer } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import InlineItemSheet from "../../profileComponents/InlineItemSheet";

export default async function ItemDetailIntercept(
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;

  const supabase = await createSupabaseServer();
  const { data: item, error } = await supabase
    .from("library_items")
    .select("*")
    .eq("id", Number(id))
    .maybeSingle();

  if (error || !item) notFound();

  // Renders as a Sheet OVER the /profile page
}
