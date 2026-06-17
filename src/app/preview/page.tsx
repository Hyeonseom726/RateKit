import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PreviewPageClient from "./preview-client";

export default async function PreviewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <PreviewPageClient />;
}
