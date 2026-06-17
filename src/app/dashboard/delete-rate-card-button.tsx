"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteRateCard } from "@/app/actions/rate-cards";

export default function DeleteRateCardButton({ cardId }: { cardId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(
      "Delete this rate card? This cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      await deleteRateCard(cardId);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="border border-red-950/60 px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:border-red-900 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
