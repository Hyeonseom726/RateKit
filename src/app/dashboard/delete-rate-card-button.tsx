"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteRateCard } from "@/app/actions/rate-cards";

export default function DeleteRateCardButton({ cardId }: { cardId: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function openModal() {
    setErrorMessage("");
    setIsOpen(true);
  }

  function closeModal() {
    if (isPending) {
      return;
    }

    setIsOpen(false);
    setErrorMessage("");
  }

  function handleDelete() {
    setErrorMessage("");

    startTransition(async () => {
      const result = await deleteRateCard(cardId);

      if (!result.ok) {
        setErrorMessage("Could not delete this rate card. Please try again.");
        return;
      }

      setIsOpen(false);
      router.refresh();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="border border-red-950/60 px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:border-red-900 hover:text-red-300"
      >
        Delete
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-5">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-rate-card-title"
            className="w-full max-w-md border border-zinc-800 bg-black p-6 text-zinc-100 shadow-[8px_8px_0_0_#27272a] sm:p-8"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-400">
              Delete
            </p>
            <h2
              id="delete-rate-card-title"
              className="mt-4 text-2xl font-medium tracking-[-0.03em] text-stone-100"
            >
              Delete rate card?
            </h2>
            <p className="mt-4 leading-7 text-zinc-500">
              This will permanently remove this saved rate card. This action
              cannot be undone.
            </p>

            {errorMessage ? (
              <p className="mt-5 text-sm leading-6 text-amber-300">
                {errorMessage}
              </p>
            ) : null}

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModal}
                disabled={isPending}
                className="border border-zinc-800 px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:border-zinc-700 hover:text-stone-200 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="border border-red-950/60 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:border-red-900 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
