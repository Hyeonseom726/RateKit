import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function getRedirectOrigin(requestUrl: URL) {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  if (requestUrl.hostname === "0.0.0.0") {
    return "http://localhost:3000";
  }

  return requestUrl.origin;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const redirectOrigin = getRedirectOrigin(requestUrl);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/login", redirectOrigin));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL("/login", redirectOrigin));
  }

  return NextResponse.redirect(new URL("/generate", redirectOrigin));
}
