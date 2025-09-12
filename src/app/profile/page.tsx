// src/app/profile/page.tsx
import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = await createSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/auth/signin");
  return <h1>Hello World</h1>;
}
