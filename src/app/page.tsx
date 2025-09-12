// src/app/page.tsx
import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();

  if (session) redirect("/profile");
  redirect("/auth/signin");
}
