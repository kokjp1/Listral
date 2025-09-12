// src/app/profile/page.tsx
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase.auth.getSession();
  return (
    <h1>Hello World</h1>
  );
}
