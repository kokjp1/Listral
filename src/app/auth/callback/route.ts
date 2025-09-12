// src/app/auth/callback/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // gewoon doorsturen naar /profile
  return NextResponse.redirect(new URL("/profile", req.url));
}
