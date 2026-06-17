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

  const values = {
    creator_name: creatorName,
    creator_handle: creatorHandle,
    niche,
    platform: input.platform,
    followers: Math.floor(parseNonNegativeNumber(input.followers)),
    avg_views: Math.floor(parseNonNegativeNumber(input.avgViews)),
    engagement_rate: parseNonNegativeNumber(input.engagementRate),
    contact_email: contactEmail,
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
