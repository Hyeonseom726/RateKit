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
  const supabase = await createClient();

  await supabase.auth.signOut();

  return NextResponse.redirect(new URL("/login", getRedirectOrigin(requestUrl)));
}
