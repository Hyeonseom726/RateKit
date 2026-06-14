"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const platforms = [
  "Instagram",
  "YouTube",
  "TikTok",
  "X",
  "Newsletter",
] as const;

type Platform = (typeof platforms)[number];

type FormState = {
  creatorName: string;
  creatorHandle: string;
  niche: string;
  platform: Platform;
  followers: string;
  avgViews: string;
  engagementRate: string;
  contactEmail: string;
};

const platformMultipliers: Record<Platform, number> = {
  Instagram: 1,
  YouTube: 1.8,
  TikTok: 0.8,
  X: 0.7,
  Newsletter: 2,
};

const initialForm: FormState = {
  creatorName: "Jamie Park",
  creatorHandle: "@jamiecreates",
  niche: "Food, culture & city guides",
  platform: "Instagram",
  followers: "48000",
  avgViews: "18500",
  engagementRate: "4.2",
  contactEmail: "hello@jamie.co",
};

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
  const number = Number(value);

  return Number.isFinite(number) ? number.toLocaleString("en-US") : "0";
}

function formatPrice(value: number) {
  return `$${value.toLocaleString("en-US")}`;
}

function Field({
  label,
  name,
  value,
  type = "text",
  placeholder,
  suffix,
  onChange,
}: {
  label: string;
  name: keyof FormState;
  value: string;
  type?: "text" | "email" | "number";
  placeholder?: string;
  suffix?: string;
  onChange: (name: keyof FormState, value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </span>
      <span className="flex border border-zinc-800 bg-zinc-950 focus-within:border-zinc-600">
        <input
          name={name}
          type={type}
          value={value}
          min={type === "number" ? "0" : undefined}
          step={name === "engagementRate" ? "0.1" : undefined}
          placeholder={placeholder}
          onChange={(event) => onChange(name, event.target.value)}
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-stone-100 outline-none placeholder:text-zinc-700"
        />
        {suffix ? (
          <span className="flex items-center border-l border-zinc-800 px-4 text-sm text-zinc-600">
            {suffix}
          </span>
        ) : null}
      </span>
    </label>
  );
}

export default function GeneratePage() {
  const [form, setForm] = useState<FormState>(initialForm);

  const rates = useMemo(
    () =>
      estimateRates(
        form.platform,
        Number(form.followers) || 0,
        Number(form.avgViews) || 0,
        Number(form.engagementRate) || 0,
      ),
    [form.platform, form.followers, form.avgViews, form.engagementRate],
  );

  function updateField(name: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  return (
    <main className="min-h-screen bg-black text-zinc-100">
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-stone-100"
          >
            RateKit
          </Link>
          <p className="hidden text-xs font-semibold uppercase tracking-[0.18em] text-zinc-600 sm:block">
            Rate card builder
          </p>
          <Link
            href="/"
            className="text-sm text-zinc-500 transition-colors hover:text-stone-200"
          >
            Back home
          </Link>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl border-x border-zinc-800 lg:grid-cols-[0.82fr_1.18fr]">
        <section className="border-b border-zinc-800 px-5 py-10 sm:px-8 lg:border-b-0 lg:border-r lg:px-12 lg:py-14">
          <div className="border-b border-zinc-800 pb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
              Creator details
            </p>
            <h1 className="mt-4 text-3xl font-medium tracking-[-0.03em] text-stone-100">
              Build your rate card
            </h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-zinc-500">
              Enter your audience details to create a practical starting point
              for sponsorship pricing.
            </p>
          </div>

          <form
            onSubmit={(event) => event.preventDefault()}
            className="mt-8 grid gap-6 sm:grid-cols-2"
          >
            <Field
              label="Creator name"
              name="creatorName"
              value={form.creatorName}
              placeholder="Jamie Park"
              onChange={updateField}
            />
            <Field
              label="Creator handle"
              name="creatorHandle"
              value={form.creatorHandle}
              placeholder="@yourhandle"
              onChange={updateField}
            />
            <div className="sm:col-span-2">
              <Field
                label="Niche"
                name="niche"
                value={form.niche}
                placeholder="Food, culture & city guides"
                onChange={updateField}
              />
            </div>
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                Platform
              </span>
              <select
                value={form.platform}
                onChange={(event) =>
                  updateField("platform", event.target.value as Platform)
                }
                className="w-full border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-stone-100 outline-none focus:border-zinc-600"
              >
                {platforms.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform}
                  </option>
                ))}
              </select>
            </label>
            <Field
              label="Followers"
              name="followers"
              value={form.followers}
              type="number"
              placeholder="48000"
              onChange={updateField}
            />
            <Field
              label="Average views"
              name="avgViews"
              value={form.avgViews}
              type="number"
              placeholder="18500"
              onChange={updateField}
            />
            <Field
              label="Engagement rate"
              name="engagementRate"
              value={form.engagementRate}
              type="number"
              placeholder="4.2"
              suffix="%"
              onChange={updateField}
            />
            <div className="sm:col-span-2">
              <Field
                label="Contact email"
                name="contactEmail"
                value={form.contactEmail}
                type="email"
                placeholder="hello@example.com"
                onChange={updateField}
              />
            </div>
          </form>

          <p className="mt-8 border-t border-zinc-800 pt-6 text-xs leading-5 text-zinc-600">
            Estimates are a starting point based on audience size, average
            views, engagement, and platform. Adjust your final pricing for
            usage rights, exclusivity, and production costs.
          </p>
        </section>

        <section className="bg-zinc-950 px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Live preview
            </p>
            <p className="font-mono text-xs text-zinc-700">ESTIMATE / USD</p>
          </div>

          <article className="mx-auto w-full max-w-2xl border border-stone-300 bg-stone-100 text-zinc-950 shadow-[10px_10px_0_0_#27272a]">
            <div className="border-b border-zinc-300 p-6 sm:p-9">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Sponsorship rate card
                  </p>
                  <h2 className="mt-5 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                    {form.creatorName || "Creator name"}
                  </h2>
                  <p className="mt-2 text-sm text-zinc-500">
                    {form.creatorHandle || "@creator"}
                  </p>
                </div>
                <div className="h-10 w-10 shrink-0 border border-zinc-400 bg-amber-200" />
              </div>
              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t border-zinc-300 pt-5 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                <span>{form.platform}</span>
                <span className="text-zinc-300">/</span>
                <span>{form.niche || "Creator niche"}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 border-b border-zinc-300">
              <div className="border-r border-zinc-300 p-4 sm:p-6">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  Followers
                </p>
                <p className="mt-2 font-mono text-base font-semibold sm:text-lg">
                  {formatNumber(form.followers)}
                </p>
              </div>
              <div className="border-r border-zinc-300 p-4 sm:p-6">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  Avg. views
                </p>
                <p className="mt-2 font-mono text-base font-semibold sm:text-lg">
                  {formatNumber(form.avgViews)}
                </p>
              </div>
              <div className="p-4 sm:p-6">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  Engagement
                </p>
                <p className="mt-2 font-mono text-base font-semibold sm:text-lg">
                  {form.engagementRate || "0"}%
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-9">
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

            <div className="flex flex-col gap-2 border-t border-zinc-300 px-6 py-5 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-9">
              <span>Valid for 30 days</span>
              <span className="font-semibold text-zinc-900">
                {form.contactEmail || "contact@example.com"}
              </span>
            </div>
          </article>
        </section>
      </div>
    </main>
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
    <div className="flex items-end justify-between gap-6 border-b border-zinc-300 py-5 last:border-b-0">
      <div>
        <h3 className="font-semibold">{name}</h3>
        <p className="mt-1 text-sm text-zinc-500">{description}</p>
      </div>
      <p className="shrink-0 font-mono text-lg font-semibold">
        {formatPrice(price)}
      </p>
    </div>
  );
}
