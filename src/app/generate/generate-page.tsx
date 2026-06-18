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
type PackageNameMode = "suggested" | "custom";
type PackagePriceMode = "suggested" | "custom";
type PackageDescriptionMode = "suggested" | "custom";
type PackageNameField = "starterName" | "standardName" | "premiumName";
type PackageNameModeField =
  | "starterNameMode"
  | "standardNameMode"
  | "premiumNameMode";
type PackagePriceField = "starterPrice" | "standardPrice" | "premiumPrice";
type PackagePriceModeField =
  | "starterPriceMode"
  | "standardPriceMode"
  | "premiumPriceMode";
type PackageDescriptionField =
  | "starterDescription"
  | "standardDescription"
  | "premiumDescription";
type PackageDescriptionModeField =
  | "starterDescriptionMode"
  | "standardDescriptionMode"
  | "premiumDescriptionMode";
type SuggestedPriceAction =
  | {
      type: "single";
      nameName: PackageNameField;
      nameModeName: PackageNameModeField;
      priceName: PackagePriceField;
      modeName: PackagePriceModeField;
      descriptionName: PackageDescriptionField;
      descriptionModeName: PackageDescriptionModeField;
    }
  | { type: "all" };

type FormState = {
  creatorName: string;
  creatorHandle: string;
  niche: string;
  platform: Platform;
  followers: string;
  avgViews: string;
  engagementRate: string;
  contactEmail: string;
  starterName: string;
  standardName: string;
  premiumName: string;
  starterNameMode: PackageNameMode;
  standardNameMode: PackageNameMode;
  premiumNameMode: PackageNameMode;
  starterPrice: string;
  standardPrice: string;
  premiumPrice: string;
  starterPriceMode: PackagePriceMode;
  standardPriceMode: PackagePriceMode;
  premiumPriceMode: PackagePriceMode;
  starterDescription: string;
  standardDescription: string;
  premiumDescription: string;
  starterDescriptionMode: PackageDescriptionMode;
  standardDescriptionMode: PackageDescriptionMode;
  premiumDescriptionMode: PackageDescriptionMode;
};

const platformMultipliers: Record<Platform, number> = {
  Instagram: 1,
  YouTube: 1.8,
  TikTok: 0.8,
  X: 0.7,
  Newsletter: 2,
};

const platformPackageDescriptions: Record<
  Platform,
  { starter: string; standard: string; premium: string }
> = {
  Instagram: {
    starter: "1 Story mention",
    standard: "1 Reel + 2 Stories",
    premium: "1 Reel + 3 Stories + usage rights",
  },
  YouTube: {
    starter: "Short sponsor mention",
    standard: "60-second integration",
    premium: "Dedicated segment + pinned link",
  },
  TikTok: {
    starter: "1 short-form mention",
    standard: "1 sponsored video",
    premium: "2 sponsored videos + usage rights",
  },
  X: {
    starter: "1 sponsored post",
    standard: "1 post + 1 repost",
    premium: "Thread + pinned post window",
  },
  Newsletter: {
    starter: "Sponsored mention",
    standard: "Dedicated sponsor block",
    premium: "Featured placement + follow-up mention",
  },
};

const suggestedPackageNames = {
  starter: "Starter",
  standard: "Standard",
  premium: "Premium",
};

const initialForm: FormState = {
  creatorName: "",
  creatorHandle: "",
  niche: "",
  platform: "Instagram",
  followers: "",
  avgViews: "",
  engagementRate: "",
  contactEmail: "",
  starterName: "",
  standardName: "",
  premiumName: "",
  starterNameMode: "suggested",
  standardNameMode: "suggested",
  premiumNameMode: "suggested",
  starterPrice: "",
  standardPrice: "",
  premiumPrice: "",
  starterPriceMode: "suggested",
  standardPriceMode: "suggested",
  premiumPriceMode: "suggested",
  starterDescription: "",
  standardDescription: "",
  premiumDescription: "",
  starterDescriptionMode: "suggested",
  standardDescriptionMode: "suggested",
  premiumDescriptionMode: "suggested",
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

function getPackageMode(value: string | null) {
  return value === "custom" ? "custom" : value === "suggested" ? "suggested" : null;
}

function getInitialForm(searchParams: {
  get: (name: string) => string | null;
  has: (name: string) => boolean;
}) {
  const platform = getPlatform(searchParams.get("platform"));
  const followers = sanitizeIntegerInput(
    searchParams.get("followers") ?? initialForm.followers,
  );
  const avgViews = sanitizeIntegerInput(
    searchParams.get("avgViews") ?? initialForm.avgViews,
  );
  const engagementRate = sanitizeDecimalInput(
    searchParams.get("engagementRate") ?? initialForm.engagementRate,
  );
  const starterNameMode =
    getPackageMode(searchParams.get("starterNameMode")) ??
    (searchParams.has("starterName") ? "custom" : initialForm.starterNameMode);
  const standardNameMode =
    getPackageMode(searchParams.get("standardNameMode")) ??
    (searchParams.has("standardName")
      ? "custom"
      : initialForm.standardNameMode);
  const premiumNameMode =
    getPackageMode(searchParams.get("premiumNameMode")) ??
    (searchParams.has("premiumName") ? "custom" : initialForm.premiumNameMode);
  const starterPriceMode =
    getPackageMode(searchParams.get("starterPriceMode")) ??
    (searchParams.has("starterPrice")
      ? "custom"
      : initialForm.starterPriceMode);
  const standardPriceMode =
    getPackageMode(searchParams.get("standardPriceMode")) ??
    (searchParams.has("standardPrice")
      ? "custom"
      : initialForm.standardPriceMode);
  const premiumPriceMode =
    getPackageMode(searchParams.get("premiumPriceMode")) ??
    (searchParams.has("premiumPrice")
      ? "custom"
      : initialForm.premiumPriceMode);
  const starterDescriptionMode =
    getPackageMode(searchParams.get("starterDescriptionMode")) ??
    (searchParams.has("starterDescription")
      ? "custom"
      : initialForm.starterDescriptionMode);
  const standardDescriptionMode =
    getPackageMode(searchParams.get("standardDescriptionMode")) ??
    (searchParams.has("standardDescription")
      ? "custom"
      : initialForm.standardDescriptionMode);
  const premiumDescriptionMode =
    getPackageMode(searchParams.get("premiumDescriptionMode")) ??
    (searchParams.has("premiumDescription")
      ? "custom"
      : initialForm.premiumDescriptionMode);

  return {
    creatorName: searchParams.get("creatorName") ?? initialForm.creatorName,
    creatorHandle:
      searchParams.get("creatorHandle") ?? initialForm.creatorHandle,
    niche: searchParams.get("niche") ?? initialForm.niche,
    platform,
    followers,
    avgViews,
    engagementRate,
    contactEmail: searchParams.get("contactEmail") ?? initialForm.contactEmail,
    starterName: starterNameMode === "custom" && searchParams.has("starterName")
      ? (searchParams.get("starterName") ?? "")
      : initialForm.starterName,
    standardName: standardNameMode === "custom" && searchParams.has("standardName")
      ? (searchParams.get("standardName") ?? "")
      : initialForm.standardName,
    premiumName: premiumNameMode === "custom" && searchParams.has("premiumName")
      ? (searchParams.get("premiumName") ?? "")
      : initialForm.premiumName,
    starterNameMode,
    standardNameMode,
    premiumNameMode,
    starterPrice: starterPriceMode === "custom" && searchParams.has("starterPrice")
      ? sanitizeIntegerInput(searchParams.get("starterPrice") ?? "")
      : initialForm.starterPrice,
    standardPrice: standardPriceMode === "custom" && searchParams.has("standardPrice")
      ? sanitizeIntegerInput(searchParams.get("standardPrice") ?? "")
      : initialForm.standardPrice,
    premiumPrice: premiumPriceMode === "custom" && searchParams.has("premiumPrice")
      ? sanitizeIntegerInput(searchParams.get("premiumPrice") ?? "")
      : initialForm.premiumPrice,
    starterPriceMode,
    standardPriceMode,
    premiumPriceMode,
    starterDescription:
      starterDescriptionMode === "custom" &&
      searchParams.has("starterDescription")
      ? (searchParams.get("starterDescription") ?? "")
      : initialForm.starterDescription,
    standardDescription:
      standardDescriptionMode === "custom" &&
      searchParams.has("standardDescription")
      ? (searchParams.get("standardDescription") ?? "")
      : initialForm.standardDescription,
    premiumDescription:
      premiumDescriptionMode === "custom" &&
      searchParams.has("premiumDescription")
      ? (searchParams.get("premiumDescription") ?? "")
      : initialForm.premiumDescription,
    starterDescriptionMode,
    standardDescriptionMode,
    premiumDescriptionMode,
  };
}

function isPackageNameModeField(name: keyof FormState) {
  return (
    name === "starterNameMode" ||
    name === "standardNameMode" ||
    name === "premiumNameMode"
  );
}

function isPackagePriceField(name: keyof FormState) {
  return (
    name === "starterPrice" ||
    name === "standardPrice" ||
    name === "premiumPrice"
  );
}

function isPackagePriceModeField(name: keyof FormState) {
  return (
    name === "starterPriceMode" ||
    name === "standardPriceMode" ||
    name === "premiumPriceMode"
  );
}

function isPackageDescriptionModeField(name: keyof FormState) {
  return (
    name === "starterDescriptionMode" ||
    name === "standardDescriptionMode" ||
    name === "premiumDescriptionMode"
  );
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

function isAllowedNumericEditKey(event: React.KeyboardEvent<HTMLInputElement>) {
  if (event.metaKey || event.ctrlKey) {
    return true;
  }

  return [
    "Backspace",
    "Delete",
    "Tab",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "Home",
    "End",
  ].includes(event.key);
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
        : isPackagePriceField(name)
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
  const cardId = searchParams.get("cardId") ?? "";
  const [form, setForm] = useState<FormState>(() =>
    getInitialForm(searchParams),
  );
  const [suggestedPriceAction, setSuggestedPriceAction] =
    useState<SuggestedPriceAction | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const hasMeaningfulPricingInputs = Boolean(
    parseNonNegativeNumber(form.followers) > 0 ||
      parseNonNegativeNumber(form.avgViews) > 0 ||
      parseNonNegativeNumber(form.engagementRate) > 0,
  );
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
  const suggestedDescriptions = platformPackageDescriptions[form.platform];
  const finalPackageNames = {
    starter:
      form.starterNameMode === "suggested"
        ? suggestedPackageNames.starter
        : form.starterName,
    standard:
      form.standardNameMode === "suggested"
        ? suggestedPackageNames.standard
        : form.standardName,
    premium:
      form.premiumNameMode === "suggested"
        ? suggestedPackageNames.premium
        : form.premiumName,
  };
  const finalPackagePrices = {
    starter:
      form.starterPriceMode === "suggested"
        ? hasMeaningfulPricingInputs
          ? String(rates.starter)
          : ""
        : form.starterPrice,
    standard:
      form.standardPriceMode === "suggested"
        ? hasMeaningfulPricingInputs
          ? String(rates.standard)
          : ""
        : form.standardPrice,
    premium:
      form.premiumPriceMode === "suggested"
        ? hasMeaningfulPricingInputs
          ? String(rates.premium)
          : ""
        : form.premiumPrice,
  };
  const finalPackageDescriptions = {
    starter:
      form.starterDescriptionMode === "suggested"
        ? suggestedDescriptions.starter
        : form.starterDescription,
    standard:
      form.standardDescriptionMode === "suggested"
        ? suggestedDescriptions.standard
        : form.standardDescription,
    premium:
      form.premiumDescriptionMode === "suggested"
        ? suggestedDescriptions.premium
        : form.premiumDescription,
  };

  function updateField(name: keyof FormState, value: string) {
    const nextValue =
      name === "followers" || name === "avgViews"
        ? sanitizeIntegerInput(value)
        : isPackagePriceField(name)
          ? sanitizeIntegerInput(value)
        : name === "engagementRate"
          ? sanitizeDecimalInput(value)
        : isPackageNameModeField(name)
          ? value === "custom"
            ? "custom"
            : "suggested"
        : isPackagePriceModeField(name)
          ? value === "custom"
            ? "custom"
            : "suggested"
        : isPackageDescriptionModeField(name)
          ? value === "custom"
            ? "custom"
            : "suggested"
          : value;

    setForm((current) => ({ ...current, [name]: nextValue }));
  }

  function updatePackageName(
    nameName: PackageNameField,
    modeName: PackageNameModeField,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [nameName]: value,
      [modeName]: "custom",
    }));
  }

  function updatePackagePrice(
    priceName: PackagePriceField,
    modeName: PackagePriceModeField,
    value: string,
  ) {
    const nextValue = sanitizeIntegerInput(value);

    setForm((current) => ({
      ...current,
      [priceName]: nextValue,
      [modeName]: "custom",
    }));
  }

  function handlePackagePriceInput(
    priceName: PackagePriceField,
    modeName: PackagePriceModeField,
    input: HTMLInputElement,
  ) {
    const value = input.value;
    const nextValue = sanitizeIntegerInput(value);

    if (input.value !== nextValue) {
      input.value = nextValue;
    }

    if (nextValue === form[priceName] && value !== "") {
      return;
    }

    updatePackagePrice(priceName, modeName, nextValue);
  }

  function updatePackageDescription(
    descriptionName: PackageDescriptionField,
    modeName: PackageDescriptionModeField,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [descriptionName]: value,
      [modeName]: "custom",
    }));
  }

  function applySuggestedPackagePrice(
    nameName: PackageNameField,
    nameModeName: PackageNameModeField,
    priceName: PackagePriceField,
    modeName: PackagePriceModeField,
    descriptionName: PackageDescriptionField,
    descriptionModeName: PackageDescriptionModeField,
  ) {
    setForm((current) => ({
      ...current,
      [nameName]: "",
      [nameModeName]: "suggested",
      [priceName]: "",
      [modeName]: "suggested",
      [descriptionName]: "",
      [descriptionModeName]: "suggested",
    }));
  }

  function applyAllSuggestedPackagePrices() {
    setForm((current) => ({
      ...current,
      starterName: "",
      standardName: "",
      premiumName: "",
      starterNameMode: "suggested",
      standardNameMode: "suggested",
      premiumNameMode: "suggested",
      starterPrice: "",
      standardPrice: "",
      premiumPrice: "",
      starterPriceMode: "suggested",
      standardPriceMode: "suggested",
      premiumPriceMode: "suggested",
      starterDescription: "",
      standardDescription: "",
      premiumDescription: "",
      starterDescriptionMode: "suggested",
      standardDescriptionMode: "suggested",
      premiumDescriptionMode: "suggested",
    }));
  }

  function confirmSuggestedPriceAction() {
    if (!suggestedPriceAction) {
      return;
    }

    if (suggestedPriceAction.type === "all") {
      applyAllSuggestedPackagePrices();
    } else {
      applySuggestedPackagePrice(
        suggestedPriceAction.nameName,
        suggestedPriceAction.nameModeName,
        suggestedPriceAction.priceName,
        suggestedPriceAction.modeName,
        suggestedPriceAction.descriptionName,
        suggestedPriceAction.descriptionModeName,
      );
    }

    setSuggestedPriceAction(null);
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
          : isPackagePriceField(name)
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

  function handleFormKeyDown(event: React.KeyboardEvent<HTMLFormElement>) {
    if (event.key === "Enter" || event.key === "Escape") {
      event.preventDefault();
    }
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
              href="/dashboard"
              className="text-sm text-zinc-500 transition-colors hover:text-stone-200"
            >
              Dashboard
            </Link>
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

      <form
        id="rate-card-form"
        ref={formRef}
        action="/preview"
        method="get"
        onInput={handleFormInput}
        onChange={handleFormInput}
        onKeyDown={handleFormKeyDown}
        className="mx-auto w-full max-w-7xl border-x border-zinc-800"
      >
        <div className="grid lg:grid-cols-[0.82fr_1.18fr]">
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

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="border border-zinc-800 bg-zinc-950 p-5 text-sm leading-6 text-zinc-500 sm:col-span-2 lg:hidden">
              <p className="font-medium text-zinc-300">
                Preview opens after you generate it.
              </p>
              <p className="mt-2">
                Mobile preview is shown on the next screen.
              </p>
            </div>
            {cardId ? (
              <input type="hidden" name="cardId" value={cardId} />
            ) : null}
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
              placeholder="@jamiecreates"
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
                placeholder="hello@jamie.com"
                onChange={updateField}
              />
            </div>
          </div>

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
                  name={finalPackageNames.starter || "Package"}
                  description={
                    finalPackageDescriptions.starter || "Package details"
                  }
                  price={finalPackagePrices.starter}
                />
                <PackageRow
                  name={finalPackageNames.standard || "Package"}
                  description={
                    finalPackageDescriptions.standard || "Package details"
                  }
                  price={finalPackagePrices.standard}
                />
                <PackageRow
                  name={finalPackageNames.premium || "Package"}
                  description={
                    finalPackageDescriptions.premium || "Package details"
                  }
                  price={finalPackagePrices.premium}
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
      <section className="border-t border-zinc-800 px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="flex flex-col justify-between gap-5 border-b border-zinc-800 pb-8 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
              Customize packages
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
              RateKit suggests a starting point. Adjust the final prices and
              package details before saving.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSuggestedPriceAction({ type: "all" })}
            className="self-start border border-zinc-800 px-4 py-2 text-xs font-medium text-stone-300 transition-colors hover:border-zinc-600 hover:text-amber-200 lg:self-auto"
          >
            Use all suggestions
          </button>
        </div>

        <div className="mt-6 grid gap-5">
          {[
            {
              title: "Starter",
              nameName: "starterName" as const,
              nameModeName: "starterNameMode" as const,
              priceName: "starterPrice" as const,
              priceModeName: "starterPriceMode" as const,
              descriptionName: "starterDescription" as const,
              descriptionModeName: "starterDescriptionMode" as const,
              finalName: finalPackageNames.starter,
              suggestedName: suggestedPackageNames.starter,
              suggestedPlaceholder: hasMeaningfulPricingInputs
                ? `Use suggested ${formatPrice(rates.starter)}`
                : "Enter metrics first",
              finalPrice: finalPackagePrices.starter,
              finalDescription: finalPackageDescriptions.starter,
              suggestedDescription: suggestedDescriptions.starter,
            },
            {
              title: "Standard",
              nameName: "standardName" as const,
              nameModeName: "standardNameMode" as const,
              priceName: "standardPrice" as const,
              priceModeName: "standardPriceMode" as const,
              descriptionName: "standardDescription" as const,
              descriptionModeName: "standardDescriptionMode" as const,
              finalName: finalPackageNames.standard,
              suggestedName: suggestedPackageNames.standard,
              suggestedPlaceholder: hasMeaningfulPricingInputs
                ? `Use suggested ${formatPrice(rates.standard)}`
                : "Enter metrics first",
              finalPrice: finalPackagePrices.standard,
              finalDescription: finalPackageDescriptions.standard,
              suggestedDescription: suggestedDescriptions.standard,
            },
            {
              title: "Premium",
              nameName: "premiumName" as const,
              nameModeName: "premiumNameMode" as const,
              priceName: "premiumPrice" as const,
              priceModeName: "premiumPriceMode" as const,
              descriptionName: "premiumDescription" as const,
              descriptionModeName: "premiumDescriptionMode" as const,
              finalName: finalPackageNames.premium,
              suggestedName: suggestedPackageNames.premium,
              suggestedPlaceholder: hasMeaningfulPricingInputs
                ? `Use suggested ${formatPrice(rates.premium)}`
                : "Enter metrics first",
              finalPrice: finalPackagePrices.premium,
              finalDescription: finalPackageDescriptions.premium,
              suggestedDescription: suggestedDescriptions.premium,
            },
          ].map((tier) => (
            <div
              key={tier.title}
              className="grid gap-5 border border-zinc-800 p-5 lg:grid-cols-[14rem_18rem_minmax(0,1fr)]"
            >
              <div className="min-w-0">
                <input
                  type="hidden"
                  name={tier.nameName}
                  value={tier.finalName}
                />
                <input
                  type="hidden"
                  name={tier.nameModeName}
                  value={form[tier.nameModeName]}
                />
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                    Package name
                  </span>
                  <input
                    type="text"
                    value={form[tier.nameName]}
                    placeholder={tier.suggestedName}
                    onChange={(event) =>
                      updatePackageName(
                        tier.nameName,
                        tier.nameModeName,
                        event.currentTarget.value,
                      )
                    }
                    onInput={(event) =>
                      updatePackageName(
                        tier.nameName,
                        tier.nameModeName,
                        event.currentTarget.value,
                      )
                    }
                    onInputCapture={(event) =>
                      updatePackageName(
                        tier.nameName,
                        tier.nameModeName,
                        event.currentTarget.value,
                      )
                    }
                    className="w-full border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-stone-100 outline-none placeholder:text-zinc-700 focus:border-zinc-600"
                  />
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setSuggestedPriceAction({
                      type: "single",
                      nameName: tier.nameName,
                      nameModeName: tier.nameModeName,
                      priceName: tier.priceName,
                      modeName: tier.priceModeName,
                      descriptionName: tier.descriptionName,
                      descriptionModeName: tier.descriptionModeName,
                    })
                  }
                  disabled={
                    form[tier.nameModeName] === "suggested" &&
                    form[tier.priceModeName] === "suggested" &&
                    form[tier.descriptionModeName] === "suggested"
                  }
                  className="mt-3 border border-zinc-800 px-3 py-2 text-xs font-medium text-zinc-500 transition-colors hover:border-zinc-600 hover:text-amber-200 disabled:cursor-default disabled:border-zinc-900 disabled:text-zinc-700"
                >
                  Use suggested
                </button>
              </div>
              <div className="min-w-0">
                <input
                  type="hidden"
                  name={tier.priceName}
                  value={tier.finalPrice}
                />
                <input
                  type="hidden"
                  name={tier.priceModeName}
                  value={form[tier.priceModeName]}
                />
                <input
                  type="hidden"
                  name={tier.descriptionName}
                  value={tier.finalDescription}
                />
                <input
                  type="hidden"
                  name={tier.descriptionModeName}
                  value={form[tier.descriptionModeName]}
                />
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                    Custom price
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    required={form[tier.priceModeName] === "custom"}
                    value={form[tier.priceName]}
                    placeholder={tier.suggestedPlaceholder}
                    onChange={(event) =>
                      handlePackagePriceInput(
                        tier.priceName,
                        tier.priceModeName,
                        event.currentTarget,
                      )
                    }
                    onInput={(event) =>
                      handlePackagePriceInput(
                        tier.priceName,
                        tier.priceModeName,
                        event.currentTarget,
                      )
                    }
                    onInputCapture={(event) =>
                      handlePackagePriceInput(
                        tier.priceName,
                        tier.priceModeName,
                        event.currentTarget,
                      )
                    }
                    onKeyDown={(event) => {
                      if (
                        isAllowedNumericEditKey(event) ||
                        /^\d$/.test(event.key)
                      ) {
                        return;
                      }

                      if (event.key.length === 1) {
                        event.preventDefault();
                      }
                    }}
                    className="w-full border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-stone-100 outline-none placeholder:text-zinc-700 focus:border-zinc-600"
                  />
                </label>
              </div>
              <label className="min-w-0">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                  Description
                </span>
                <textarea
                  rows={3}
                  value={form[tier.descriptionName]}
                  placeholder={tier.suggestedDescription}
                  onChange={(event) =>
                    updatePackageDescription(
                      tier.descriptionName,
                      tier.descriptionModeName,
                      event.currentTarget.value,
                    )
                  }
                  onInput={(event) =>
                    updatePackageDescription(
                      tier.descriptionName,
                      tier.descriptionModeName,
                      event.currentTarget.value,
                    )
                  }
                  onInputCapture={(event) =>
                    updatePackageDescription(
                      tier.descriptionName,
                      tier.descriptionModeName,
                      event.currentTarget.value,
                    )
                  }
                  className="min-h-24 w-full resize-y border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm leading-6 text-stone-100 outline-none placeholder:text-zinc-700 focus:border-zinc-600"
                />
              </label>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-6 border-t border-zinc-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-xs leading-5 text-zinc-600">
            Estimates are a starting point based on audience size, average
            views, engagement, and platform. Adjust your final pricing for
            usage rights, exclusivity, and production costs.
          </p>
          <button
            type="submit"
            className="bg-stone-100 px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-amber-200"
          >
            Generate preview
          </button>
        </div>
      </section>
      </form>
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
      {suggestedPriceAction ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-5">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="suggested-price-dialog-title"
            className="w-full max-w-md border border-zinc-800 bg-black p-6 text-zinc-100 shadow-[8px_8px_0_0_#27272a]"
          >
            <h2
              id="suggested-price-dialog-title"
              className="text-xl font-medium text-stone-100"
            >
              {suggestedPriceAction.type === "all"
                ? "Use all suggestions?"
                : "Use suggested package?"}
            </h2>
            <p className="mt-4 text-sm leading-6 text-zinc-500">
              {suggestedPriceAction.type === "all"
                ? "This will replace all custom package names, prices, and descriptions with the current RateKit suggestions."
                : "This will replace the custom name, price, and description for this package with the current RateKit suggestions."}
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setSuggestedPriceAction(null)}
                className="border border-zinc-800 px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:border-zinc-600 hover:text-stone-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmSuggestedPriceAction}
                className="bg-stone-100 px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-amber-200"
              >
                {suggestedPriceAction.type === "all"
                  ? "Use all suggestions"
                  : "Use suggested"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
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
  price: string;
}) {
  const trimmedPrice = price.trim();

  return (
    <div className="grid min-w-0 gap-3 border-b border-zinc-300 py-5 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_minmax(0,12rem)] sm:items-end sm:gap-6">
      <div className="min-w-0">
        <h3 className="min-w-0 [overflow-wrap:anywhere] break-words font-semibold">
          {name}
        </h3>
        <p className="mt-1 min-w-0 [overflow-wrap:anywhere] break-words text-sm text-zinc-500">
          {description}
        </p>
      </div>
      <p className="min-w-0 [overflow-wrap:anywhere] font-mono text-lg font-semibold sm:text-right">
        {trimmedPrice ? formatPrice(parseNonNegativeNumber(trimmedPrice)) : "—"}
      </p>
    </div>
  );
}
