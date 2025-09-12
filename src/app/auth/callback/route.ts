import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  const supabase = await createSupabaseServer();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL("/profile", url.origin));
    }
  }

  // No code or exchange failed → back to sign-in
  return NextResponse.redirect(new URL("/auth/signin", url.origin));
}
