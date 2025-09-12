// src/app/profile/page.tsx
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase.auth.getSession();
  return (
    <pre className="p-6">{JSON.stringify({ session: data.session, error }, null, 2)}</pre>
  );
}
