import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import DeleteRateCardButton from "./delete-rate-card-button";
import { createClient } from "@/lib/supabase/server";

type SavedRateCard = {
  id: string;
  creator_name: string | null;
  creator_handle: string | null;
  niche: string | null;
  platform: string | null;
  followers: number | null;
  avg_views: number | null;
  engagement_rate: number | null;
  contact_email: string | null;
  is_paid: boolean | null;
  created_at: string | null;
};

function formatDate(value: string | null) {
  if (!value) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function buildPreviewUrl(card: SavedRateCard) {
  const params = new URLSearchParams({
    cardId: card.id,
    creatorName: card.creator_name ?? "",
    creatorHandle: card.creator_handle ?? "",
    niche: card.niche ?? "",
    platform: card.platform ?? "Instagram",
    followers: String(card.followers ?? 0),
    avgViews: String(card.avg_views ?? 0),
    engagementRate: String(card.engagement_rate ?? 0),
    contactEmail: card.contact_email ?? "",
  });

  return `/preview?${params.toString()}`;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("rate_cards")
    .select(
      "id, creator_name, creator_handle, niche, platform, followers, avg_views, engagement_rate, contact_email, is_paid, created_at",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const cards = (data ?? []) as SavedRateCard[];
  const hasLoadError = Boolean(error);

  return (
    <main className="flex min-h-screen flex-col bg-black text-zinc-100">
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <Link href="/" aria-label="RateKit home">
            <Image
              src="/ratekit-logo.svg"
              alt="RateKit"
              width={142}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/generate"
              className="text-sm text-zinc-500 transition-colors hover:text-stone-200"
            >
              Generate
            </Link>
            <Link
              href="/logout"
              className="text-sm text-zinc-500 transition-colors hover:text-stone-200"
            >
              Sign out
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto w-full max-w-7xl flex-1 border-x border-zinc-800 px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
        <div className="flex flex-col justify-between gap-8 border-b border-zinc-800 pb-10 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
              Dashboard
            </p>
            <h1 className="mt-5 text-4xl font-medium tracking-[-0.04em] text-stone-100 sm:text-6xl">
              Saved rate cards
            </h1>
            <p className="mt-5 max-w-2xl leading-7 text-zinc-500">
              Return to previous drafts, review pricing, and export when you
              are ready.
            </p>
          </div>
          <Link
            href="/generate"
            className="bg-stone-100 px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-amber-200"
          >
            Create new rate card
          </Link>
        </div>

        {hasLoadError ? (
          <div className="mt-10 border border-zinc-800 p-8 sm:p-10">
            <h2 className="text-2xl font-medium text-stone-100">
              Could not load saved rate cards.
            </h2>
            <p className="mt-3 max-w-md leading-7 text-zinc-500">
              Please refresh the page or try again in a moment.
            </p>
          </div>
        ) : cards.length === 0 ? (
          <div className="mt-10 border border-zinc-800 p-8 sm:p-10">
            <h2 className="text-2xl font-medium text-stone-100">
              No saved rate cards yet.
            </h2>
            <p className="mt-3 max-w-md leading-7 text-zinc-500">
              Create your first rate card to see it here.
            </p>
            <Link
              href="/generate"
              className="mt-8 inline-block bg-stone-100 px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-amber-200"
            >
              Create rate card
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid border-l border-t border-zinc-800 lg:grid-cols-2">
            {cards.map((card) => (
              <article
                key={card.id}
                className="min-w-0 border-b border-r border-zinc-800 p-6 sm:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="truncate text-xl font-medium text-stone-100">
                      {card.creator_name || "Untitled rate card"}
                    </h2>
                    <p className="mt-1 truncate text-sm text-zinc-500">
                      {card.creator_handle || "@creator"}
                    </p>
                  </div>
                  <span className="shrink-0 border border-zinc-800 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-300">
                    {card.is_paid ? "Paid" : "Preview"}
                  </span>
                </div>
                <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 border-t border-zinc-800 pt-5 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  <span>{card.platform || "Instagram"}</span>
                  <span className="text-zinc-700">/</span>
                  <span className="min-w-0 [overflow-wrap:anywhere]">
                    {card.niche || "Creator niche"}
                  </span>
                </div>
                <div className="mt-6 flex items-center justify-between gap-4 text-sm text-zinc-500">
                  <span>{formatDate(card.created_at)}</span>
                  <Link
                    href={buildPreviewUrl(card)}
                    className="font-medium text-stone-200 transition-colors hover:text-amber-200"
                  >
                    Open preview
                  </Link>
                </div>
                <div className="mt-5 border-t border-zinc-800 pt-5">
                  <DeleteRateCardButton cardId={card.id} />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      <footer className="border-t border-zinc-800">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-7 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <p className="font-semibold text-zinc-400">RateKit</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/privacy" className="transition-colors hover:text-zinc-300">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-zinc-300">
              Terms
            </Link>
            <a
              href="mailto:support@hslab.tools"
              className="transition-colors hover:text-zinc-300"
            >
              support@hslab.tools
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
