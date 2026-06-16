"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const platforms = [
  "Instagram",
  "YouTube",
  "TikTok",
  "X",
  "Newsletter",
] as const;

type Platform = (typeof platforms)[number];

const platformMultipliers: Record<Platform, number> = {
  Instagram: 1,
  YouTube: 1.8,
  TikTok: 0.8,
  X: 0.7,
  Newsletter: 2,
};

const defaults = {
  creatorName: "Jamie Park",
  creatorHandle: "@jamiecreates",
  niche: "Food, culture & city guides",
  platform: "Instagram" as Platform,
  followers: "48000",
  avgViews: "18500",
  engagementRate: "4.2",
  contactEmail: "hello@jamie.com",
};

function getParam(
  params: { get: (name: string) => string | null },
  name: string,
  fallback: string,
) {
  return params.get(name) ?? fallback;
}

function getPlatform(value: string): Platform {
  return platforms.includes(value as Platform)
    ? (value as Platform)
    : defaults.platform;
}

function parseNonNegativeNumber(value: string) {
  const number = Number(value);

  return Number.isFinite(number) && number >= 0 ? number : 0;
}

function buildRateCardParams(values: Record<string, string>) {
  return new URLSearchParams(values);
}

function estimateRates(
  platform: Platform,
  followers: number,
  avgViews: number,
  engagementRate: number,
) {
  const reachScore = avgViews * 0.025;
  const followerScore = followers * 0.003;
  const engagementBoost = Math.max(1, engagementRate / 3);
  const base =
    (reachScore + followerScore) *
    platformMultipliers[platform] *
    engagementBoost;

  return {
    starter: Math.max(25, Math.round(base * 0.7)),
    standard: Math.max(50, Math.round(base)),
    premium: Math.max(100, Math.round(base * 1.8)),
  };
}

function formatNumber(value: string) {
  return parseNonNegativeNumber(value).toLocaleString("en-US");
}

function formatPrice(value: number) {
  return `$${value.toLocaleString("en-US")}`;
}

function formatHandle(value: string) {
  const handle = value.trim();

  if (!handle) {
    return "@creator";
  }

  return handle.startsWith("@") ? handle : `@${handle}`;
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-black" />}>
      <PreviewPageContent />
    </Suspense>
  );
}

function PreviewPageContent() {
  const params = useSearchParams();
  const [copied, setCopied] = useState(false);
  const creatorName = getParam(params, "creatorName", defaults.creatorName);
  const creatorHandle = getParam(
    params,
    "creatorHandle",
    defaults.creatorHandle,
  );
  const niche = getParam(params, "niche", defaults.niche);
  const platform = getPlatform(
    getParam(params, "platform", defaults.platform),
  );
  const followers = getParam(params, "followers", defaults.followers);
  const avgViews = getParam(params, "avgViews", defaults.avgViews);
  const engagementRate = getParam(
    params,
    "engagementRate",
    defaults.engagementRate,
  );
  const contactEmail = getParam(
    params,
    "contactEmail",
    defaults.contactEmail,
  );
  const rates = estimateRates(
    platform,
    parseNonNegativeNumber(followers),
    parseNonNegativeNumber(avgViews),
    parseNonNegativeNumber(engagementRate),
  );
  const editParams = buildRateCardParams({
    creatorName,
    creatorHandle,
    niche,
    platform,
    followers: String(parseNonNegativeNumber(followers)),
    avgViews: String(parseNonNegativeNumber(avgViews)),
    engagementRate: String(parseNonNegativeNumber(engagementRate)),
    contactEmail,
  });

  async function copyPreviewLink() {
    if (!navigator.clipboard) {
      return;
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be blocked by browser permissions.
    }
  }

  return (
    <main className="min-h-screen bg-black px-5 py-8 text-zinc-100 sm:px-8 sm:py-12">
      <div className="mx-auto w-full max-w-2xl">
        <Link href="/" aria-label="RateKit home" className="mb-6 inline-block">
          <Image
            src="/ratekit-logo.svg"
            alt="RateKit"
            width={142}
            height={40}
            className="h-8 w-auto"
            priority
          />
        </Link>
        <div className="mb-6 flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href={`/generate?${editParams.toString()}`}
              className="text-sm text-zinc-500 transition-colors hover:text-stone-200"
            >
              ← Edit rate card
            </Link>
            <button
              type="button"
              onClick={copyPreviewLink}
              className="border border-zinc-700 px-4 py-2 text-sm font-medium text-stone-200 transition-colors hover:border-zinc-500 hover:bg-zinc-900"
            >
              {copied ? "Copied" : "Copy preview link"}
            </button>
          </div>
          <p className="text-xs text-zinc-600">
            Free preview. Export without watermark for $4 when ready.
          </p>
        </div>

        <article className="relative w-full overflow-hidden border border-stone-300 bg-stone-100 text-zinc-950 shadow-[10px_10px_0_0_#27272a]">
          <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="-rotate-[28deg] whitespace-nowrap text-3xl font-semibold tracking-[0.22em] text-zinc-500/20 sm:text-4xl">
              PREVIEW · RATEKIT
            </span>
          </div>

          <div className="relative z-10 min-w-0 border-b border-zinc-300 p-6 sm:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Sponsorship rate card
            </p>
            <h1 className="mt-5 [overflow-wrap:anywhere] text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              {creatorName || "Creator name"}
            </h1>
            <p className="mt-2 [overflow-wrap:anywhere] text-sm text-zinc-500">
              {formatHandle(creatorHandle)}
            </p>
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t border-zinc-300 pt-5 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
              <span>{platform}</span>
              <span className="text-zinc-300">/</span>
              <span className="min-w-0 [overflow-wrap:anywhere]">
                {niche || "Creator niche"}
              </span>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-3 border-b border-zinc-300">
            <Stat label="Followers" value={formatNumber(followers)} />
            <Stat label="Avg. views" value={formatNumber(avgViews)} />
            <Stat
              label="Engagement"
              value={`${parseNonNegativeNumber(engagementRate)}%`}
              last
            />
          </div>

          <div className="relative z-10 p-6 sm:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Sponsorship packages
            </p>
            <div className="mt-5 border-t border-zinc-300">
              <PackageRow
                name="Starter"
                description="Single sponsored placement"
                price={rates.starter}
              />
              <PackageRow
                name="Standard"
                description="Core campaign collaboration"
                price={rates.standard}
              />
              <PackageRow
                name="Premium"
                description="Expanded campaign package"
                price={rates.premium}
              />
            </div>
          </div>

          <div className="relative z-10 border-t border-zinc-300 px-6 py-5 text-xs text-zinc-500 sm:px-9">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span>Valid for 30 days</span>
              <span className="min-w-0 [overflow-wrap:anywhere] font-semibold text-zinc-900">
                {contactEmail || "contact@example.com"}
              </span>
            </div>
            <p className="mt-4 border-t border-zinc-300 pt-4 text-center font-semibold uppercase tracking-[0.16em] text-zinc-400">
              Made with RateKit
            </p>
          </div>
        </article>
      </div>
      <footer className="mx-auto mt-12 flex w-full max-w-2xl flex-col gap-4 border-t border-zinc-800 pt-7 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
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
      </footer>
    </main>
  );
}

function Stat({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={`min-w-0 p-4 sm:p-6 ${last ? "" : "border-r border-zinc-300"}`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p className="mt-2 [overflow-wrap:anywhere] font-mono text-base font-semibold sm:text-lg">
        {value}
      </p>
    </div>
  );
}

function PackageRow({
  name,
  description,
  price,
}: {
  name: string;
  description: string;
  price: number;
}) {
  return (
    <div className="grid min-w-0 gap-3 border-b border-zinc-300 py-5 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_minmax(0,12rem)] sm:items-end sm:gap-6">
      <div className="min-w-0">
        <h2 className="font-semibold">{name}</h2>
        <p className="mt-1 text-sm text-zinc-500">{description}</p>
      </div>
      <p className="min-w-0 [overflow-wrap:anywhere] font-mono text-lg font-semibold sm:text-right">
        {formatPrice(price)}
      </p>
    </div>
  );
}
