"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
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
  contactEmail: "hello@jamie.com",
};

function sanitizeIntegerInput(value: string) {
  return value.includes("-") ? "" : value.replace(/\D/g, "");
}

function sanitizeDecimalInput(value: string) {
  if (value.includes("-")) {
    return "";
  }

  const [whole = "", ...decimals] = value.replace(/[^\d.]/g, "").split(".");

  return decimals.length > 0 ? `${whole}.${decimals.join("")}` : whole;
}

function parseNonNegativeNumber(value: string) {
  const number = Number(value);

  return Number.isFinite(number) && number >= 0 ? number : 0;
}

function getPlatform(value: string | null): Platform {
  return platforms.includes(value as Platform)
    ? (value as Platform)
    : initialForm.platform;
}

function getInitialForm(searchParams: { get: (name: string) => string | null }) {
  return {
    creatorName: searchParams.get("creatorName") ?? initialForm.creatorName,
    creatorHandle:
      searchParams.get("creatorHandle") ?? initialForm.creatorHandle,
    niche: searchParams.get("niche") ?? initialForm.niche,
    platform: getPlatform(searchParams.get("platform")),
    followers: sanitizeIntegerInput(
      searchParams.get("followers") ?? initialForm.followers,
    ),
    avgViews: sanitizeIntegerInput(
      searchParams.get("avgViews") ?? initialForm.avgViews,
    ),
    engagementRate: sanitizeDecimalInput(
      searchParams.get("engagementRate") ?? initialForm.engagementRate,
    ),
    contactEmail: searchParams.get("contactEmail") ?? initialForm.contactEmail,
  };
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
  function handleInput(event: React.FormEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const nextValue =
      name === "followers" || name === "avgViews"
        ? sanitizeIntegerInput(input.value)
        : name === "engagementRate"
          ? sanitizeDecimalInput(input.value)
          : input.value;

    if (input.value !== nextValue) {
      input.value = nextValue;
    }

    onChange(name, nextValue);
  }

  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </span>
      <span className="flex border border-zinc-800 bg-zinc-950 focus-within:border-zinc-600">
        <input
          name={name}
          type={type === "number" ? "text" : type}
          inputMode={
            name === "engagementRate"
              ? "decimal"
              : type === "number"
                ? "numeric"
                : undefined
          }
          defaultValue={value}
          placeholder={placeholder}
          onChange={handleInput}
          onInput={handleInput}
          onInputCapture={handleInput}
          onKeyDown={
            type === "number"
              ? (event) => {
                  if (["-", "+", "e", "E"].includes(event.key)) {
                    event.preventDefault();
                  }
                }
              : undefined
          }
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
  return (
    <Suspense fallback={<main className="min-h-screen bg-black" />}>
      <GeneratePageContent />
    </Suspense>
  );
}

function GeneratePageContent() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState<FormState>(() =>
    getInitialForm(searchParams),
  );
  const formRef = useRef<HTMLFormElement | null>(null);

  const rates = useMemo(
    () =>
      estimateRates(
        form.platform,
        parseNonNegativeNumber(form.followers),
        parseNonNegativeNumber(form.avgViews),
        parseNonNegativeNumber(form.engagementRate),
      ),
    [form.platform, form.followers, form.avgViews, form.engagementRate],
  );

  function updateField(name: keyof FormState, value: string) {
    const nextValue =
      name === "followers" || name === "avgViews"
        ? sanitizeIntegerInput(value)
        : name === "engagementRate"
          ? sanitizeDecimalInput(value)
          : value;

    setForm((current) => ({ ...current, [name]: nextValue }));
  }

  useEffect(() => {
    const formElement = formRef.current;

    if (!formElement) {
      return;
    }

    function handleNativeInput(event: Event) {
      const field = event.target;

      if (
        !(field instanceof HTMLInputElement) &&
        !(field instanceof HTMLSelectElement)
      ) {
        return;
      }

      const name = field.name as keyof FormState;

      if (!name || !(name in initialForm)) {
        return;
      }

      const nextValue =
        name === "followers" || name === "avgViews"
          ? sanitizeIntegerInput(field.value)
          : name === "engagementRate"
            ? sanitizeDecimalInput(field.value)
            : name === "platform"
              ? getPlatform(field.value)
              : field.value;

      if (field.value !== nextValue) {
        field.value = nextValue;
      }

      setForm((current) => ({ ...current, [name]: nextValue }));
    }

    formElement.addEventListener("input", handleNativeInput, true);
    formElement.addEventListener("change", handleNativeInput, true);

    return () => {
      formElement.removeEventListener("input", handleNativeInput, true);
      formElement.removeEventListener("change", handleNativeInput, true);
    };
  }, []);

  function handlePlatformInput(event: React.FormEvent<HTMLSelectElement>) {
    updateField("platform", getPlatform(event.currentTarget.value));
  }

  function handleFormInput(event: React.FormEvent<HTMLFormElement>) {
    const field = event.target;

    if (!(field instanceof HTMLInputElement || field instanceof HTMLSelectElement)) {
      return;
    }

    const name = field.name as keyof FormState;

    if (!name || !(name in initialForm)) {
      return;
    }

    const nextValue =
      name === "platform" ? getPlatform(field.value) : field.value;

    updateField(name, nextValue);
  }

  return (
    <main className="min-h-screen bg-black text-zinc-100">
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <Link
            href="/"
            aria-label="RateKit home"
          >
            <Image
              src="/ratekit-logo.svg"
              alt="RateKit"
              width={142}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </Link>
          <p className="hidden text-xs font-semibold uppercase tracking-[0.18em] text-zinc-600 sm:block">
            Rate card builder
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/logout"
              className="text-sm text-zinc-500 transition-colors hover:text-stone-200"
            >
              Sign out
            </Link>
            <Link
              href="/"
              className="text-sm text-zinc-500 transition-colors hover:text-stone-200"
            >
              Back home
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl border-x border-zinc-800 lg:grid-cols-[0.82fr_1.18fr]">
        <section className="relative z-10 border-b border-zinc-800 px-5 py-10 sm:px-8 lg:border-b-0 lg:border-r lg:px-12 lg:py-14">
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
            id="rate-card-form"
            ref={formRef}
            action="/preview"
            method="get"
            onInput={handleFormInput}
            onChange={handleFormInput}
            className="mt-8 grid gap-6 sm:grid-cols-2"
          >
            <div className="border border-zinc-800 bg-zinc-950 p-5 text-sm leading-6 text-zinc-500 sm:col-span-2 lg:hidden">
              <p className="font-medium text-zinc-300">
                Preview opens after you generate it.
              </p>
              <p className="mt-2">
                Mobile preview is shown on the next screen.
              </p>
            </div>
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
                name="platform"
                defaultValue={form.platform}
                onChange={handlePlatformInput}
                onInput={handlePlatformInput}
                onInputCapture={handlePlatformInput}
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
            <button
              type="submit"
              className="mt-2 w-full bg-stone-100 px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-amber-200 sm:col-span-2"
            >
              Generate preview
            </button>
          </form>

          <p className="mt-8 border-t border-zinc-800 pt-6 text-xs leading-5 text-zinc-600">
            Estimates are a starting point based on audience size, average
            views, engagement, and platform. Adjust your final pricing for
            usage rights, exclusivity, and production costs.
          </p>
        </section>

        <section className="hidden bg-zinc-950 px-5 py-10 sm:px-8 lg:block lg:px-12 lg:py-14">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Live preview
            </p>
            <p className="font-mono text-xs text-zinc-700">ESTIMATE / USD</p>
          </div>

          <article className="relative isolate mx-auto w-full max-w-2xl overflow-hidden border border-stone-300 bg-stone-100 text-zinc-950 shadow-[10px_10px_0_0_#27272a]">
            <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
              <span className="-rotate-[28deg] whitespace-nowrap text-3xl font-semibold tracking-[0.22em] text-zinc-500/20 sm:text-4xl">
                PREVIEW · RATEKIT
              </span>
            </div>

            <div className="relative z-10 min-w-0 border-b border-zinc-300 p-6 sm:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Sponsorship rate card
              </p>
              <h2 className="mt-5 [overflow-wrap:anywhere] text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                {form.creatorName || "Creator name"}
              </h2>
              <p className="mt-2 [overflow-wrap:anywhere] text-sm text-zinc-500">
                {formatHandle(form.creatorHandle)}
              </p>
              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t border-zinc-300 pt-5 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                <span>{form.platform}</span>
                <span className="text-zinc-300">/</span>
                <span className="min-w-0 [overflow-wrap:anywhere]">
                  {form.niche || "Creator niche"}
                </span>
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-3 border-b border-zinc-300">
              <div className="min-w-0 border-r border-zinc-300 p-4 sm:p-6">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  Followers
                </p>
                <p className="mt-2 [overflow-wrap:anywhere] font-mono text-base font-semibold sm:text-lg">
                  {formatNumber(form.followers)}
                </p>
              </div>
              <div className="min-w-0 border-r border-zinc-300 p-4 sm:p-6">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  Avg. views
                </p>
                <p className="mt-2 [overflow-wrap:anywhere] font-mono text-base font-semibold sm:text-lg">
                  {formatNumber(form.avgViews)}
                </p>
              </div>
              <div className="min-w-0 p-4 sm:p-6">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  Engagement
                </p>
                <p className="mt-2 [overflow-wrap:anywhere] font-mono text-base font-semibold sm:text-lg">
                  {form.engagementRate || "0"}%
                </p>
              </div>
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
                  {form.contactEmail || "contact@example.com"}
                </span>
              </div>
              <p className="mt-4 border-t border-zinc-300 pt-4 text-center font-semibold uppercase tracking-[0.16em] text-zinc-400">
                Made with RateKit
              </p>
            </div>
          </article>
        </section>
      </div>
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
        <h3 className="font-semibold">{name}</h3>
        <p className="mt-1 text-sm text-zinc-500">{description}</p>
      </div>
      <p className="min-w-0 [overflow-wrap:anywhere] font-mono text-lg font-semibold sm:text-right">
        {formatPrice(price)}
      </p>
    </div>
  );
}
