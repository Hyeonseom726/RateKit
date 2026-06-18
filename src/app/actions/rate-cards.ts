"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const platforms = [
  "Instagram",
  "YouTube",
  "TikTok",
  "X",
  "Newsletter",
] as const;

type Platform = (typeof platforms)[number];

export type SaveRateCardInput = {
  cardId?: string;
  creatorName: string;
  creatorHandle: string;
  niche: string;
  platform: string;
  followers: string;
  avgViews: string;
  engagementRate: string;
  contactEmail: string;
  starterName?: string;
  standardName?: string;
  premiumName?: string;
  starterPrice: string;
  standardPrice: string;
  premiumPrice: string;
  starterDescription: string;
  standardDescription: string;
  premiumDescription: string;
};

export type SaveRateCardResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export type DeleteRateCardResult =
  | { ok: true }
  | { ok: false; error: string };

function trimString(value: string) {
  return value.trim();
}

function isPlatform(value: string): value is Platform {
  return platforms.includes(value as Platform);
}

function parseNonNegativeNumber(value: string) {
  const number = Number(value);

  return Number.isFinite(number) && number >= 0 ? number : 0;
}

function parsePackagePrice(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  const number = Number(trimmedValue);

  return Number.isFinite(number) && number >= 0 ? Math.floor(number) : null;
}

export async function saveRateCard(
  input: SaveRateCardInput,
): Promise<SaveRateCardResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      error: "Please sign in to save your rate card.",
    };
  }

  const creatorName = trimString(input.creatorName);
  const creatorHandle = trimString(input.creatorHandle);
  const niche = trimString(input.niche);
  const contactEmail = trimString(input.contactEmail);
  const starterName =
    input.starterName === undefined ? "Starter" : trimString(input.starterName);
  const standardName =
    input.standardName === undefined
      ? "Standard"
      : trimString(input.standardName);
  const premiumName =
    input.premiumName === undefined ? "Premium" : trimString(input.premiumName);

  if (!creatorName) {
    return { ok: false, error: "Creator name is required before saving." };
  }

  if (!contactEmail) {
    return { ok: false, error: "Contact email is required before saving." };
  }

  if (!isPlatform(input.platform)) {
    return {
      ok: false,
      error: "Please choose a valid platform.",
    };
  }

  const starterPrice = parsePackagePrice(input.starterPrice);
  const standardPrice = parsePackagePrice(input.standardPrice);
  const premiumPrice = parsePackagePrice(input.premiumPrice);

  if (
    starterPrice === null ||
    standardPrice === null ||
    premiumPrice === null
  ) {
    return {
      ok: false,
      error: "Please enter prices for all packages before saving.",
    };
  }

  const values = {
    creator_name: creatorName,
    creator_handle: creatorHandle,
    niche,
    platform: input.platform,
    followers: Math.floor(parseNonNegativeNumber(input.followers)),
    avg_views: Math.floor(parseNonNegativeNumber(input.avgViews)),
    engagement_rate: parseNonNegativeNumber(input.engagementRate),
    contact_email: contactEmail,
    starter_name: starterName,
    standard_name: standardName,
    premium_name: premiumName,
    starter_price: starterPrice,
    standard_price: standardPrice,
    premium_price: premiumPrice,
    starter_description: trimString(input.starterDescription),
    standard_description: trimString(input.standardDescription),
    premium_description: trimString(input.premiumDescription),
  };

  const cardId = input.cardId?.trim();

  if (cardId) {
    const { data, error } = await supabase
      .from("rate_cards")
      .update({
        ...values,
        updated_at: new Date().toISOString(),
      })
      .eq("id", cardId)
      .eq("user_id", user.id)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("Failed to update rate card:", error.message);

      return {
        ok: false,
        error: "Could not update this rate card. Please try again.",
      };
    }

    if (!data?.id) {
      return {
        ok: false,
        error: "Could not update this rate card. Please try again.",
      };
    }

    revalidatePath("/dashboard");

    return { ok: true, id: cardId };
  }

  const { data, error } = await supabase
    .from("rate_cards")
    .insert({
      user_id: user.id,
      ...values,
      is_paid: false,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to save rate card:", error.message);

    return {
      ok: false,
      error: "Could not save this rate card. Please try again.",
    };
  }

  if (!data?.id) {
    return { ok: false, error: "Saved rate card was missing an id." };
  }

  revalidatePath("/dashboard");

  return { ok: true, id: data.id };
}

export async function deleteRateCard(
  cardId: string,
): Promise<DeleteRateCardResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Please sign in to delete rate cards." };
  }

  const id = cardId.trim();

  if (!id) {
    return { ok: false, error: "Could not delete this rate card." };
  }

  const { error } = await supabase
    .from("rate_cards")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to delete rate card:", error.message);

    return {
      ok: false,
      error: "Could not delete this rate card. Please try again.",
    };
  }

  revalidatePath("/dashboard");

  return { ok: true };
}
