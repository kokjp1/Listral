// src/app/auth/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const next = searchParams.get("next") ?? "/profile";

  const err = searchParams.get("error_description");
  if (err) {
    return NextResponse.redirect(
      new URL(`/auth/signin?error=${encodeURIComponent(err)}`, origin)
    );
  }

  // Prepare the redirect *first* so we can write cookies onto it
  const res = NextResponse.redirect(new URL(next, origin));

  // READ cookies via next/headers (Edge: note the await)
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Return string | undefined — exactly what Supabase expects
        get: (name: string) => cookieStore.get(name)?.value,

        // WRITE cookies onto the response (cookieStore is read-only)
        set: (name: string, value: string, options: any) => {
          res.cookies.set({ name, value, ...options });
        },
        remove: (name: string, options: any) => {
          res.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // IMPORTANT: pass a string URL, not a URL object
  await supabase.auth.exchangeCodeForSession(request.url);

  return res; // return the SAME response that now carries Set-Cookie
}
// Note: this route does not need to be "protected" — it can be called