// src/lib/auth-helpers.ts
import { createSupabaseServer } from "./supabase/server";

export async function getSessionAndEnsureUser() {
  const supabase = await createSupabaseServer(); // <-- await

  const { data: { session }, error: sessionErr } = await supabase.auth.getSession();
  if (sessionErr) throw sessionErr;
  if (!session) return { session: null, userId: null } as const;

  const { user } = session;
  const email = user.email!;
  const name = (user.user_metadata as any)?.name ?? null;
  const image = (user.user_metadata as any)?.picture ?? null;
  const authUserId = user.id;

  await supabase
    .from("users_app")
    .upsert({ email, name, image, auth_user_id: authUserId }, { onConflict: "email" });

  const { data: row, error } = await supabase
    .from("users_app")
    .select("id")
    .eq("email", email)
    .single();

  if (error) throw error;

  return { session, userId: row!.id as number } as const;
}
