"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function getAuthRedirectOrigin() {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  if (window.location.hostname === "0.0.0.0") {
    return "http://localhost:3000";
  }

  return window.location.origin;
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function signInWithGoogle() {
    setIsLoading(true);
    setErrorMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${getAuthRedirectOrigin()}/auth/callback`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-zinc-100">
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
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
          <Link
            href="/"
            className="text-sm text-zinc-500 transition-colors hover:text-zinc-200"
          >
            Back home
          </Link>
        </div>
      </header>

      <div className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center border-x border-zinc-800 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_0.82fr] lg:px-12">
        <section className="border-b border-zinc-800 pb-10 lg:border-b-0 lg:border-r lg:pr-12">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
            Account
          </p>
          <h1 className="mt-5 max-w-xl text-4xl font-medium leading-tight tracking-[-0.04em] text-stone-100 sm:text-6xl">
            Sign in to RateKit
          </h1>
          <p className="mt-5 max-w-md leading-7 text-zinc-500">
            Save your rate cards, manage exports, and return when brands ask
            for updates.
          </p>
          <ul className="mt-10 divide-y divide-zinc-800 border-y border-zinc-800 text-sm text-zinc-400">
            {[
              "Save generated cards",
              "Export when ready",
              "Keep edits in one place",
            ].map((feature, index) => (
              <li key={feature} className="flex items-center gap-5 py-4">
                <span className="font-mono text-xs text-amber-300">
                  0{index + 1}
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="pt-10 lg:pl-12 lg:pt-0">
          <div className="border border-zinc-800 p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Continue
            </p>
            <button
              type="button"
              onClick={signInWithGoogle}
              disabled={isLoading}
              className="mt-6 w-full bg-stone-100 px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Redirecting..." : "Continue with Google"}
            </button>
            <p className="mt-5 text-sm leading-6 text-zinc-500">
              Google sign-in is used to keep your rate cards connected to your
              account.
            </p>

            {errorMessage ? (
              <p className="mt-4 text-sm leading-6 text-amber-300">
                {errorMessage}
              </p>
            ) : null}
          </div>
        </section>
      </div>
      <footer className="border-t border-zinc-800">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-5 py-7 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between sm:px-8">
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
