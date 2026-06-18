import Image from "next/image";
import Link from "next/link";

const sections = [
  {
    title: "Acceptance of terms",
    body: [
      "By using RateKit, you agree to these terms. If you do not agree, please do not use the service.",
    ],
  },
  {
    title: "What RateKit does",
    body: [
      "RateKit helps creators build pricing pages and sponsorship rate cards from information they provide, including package names, prices, descriptions, audience metrics, and contact details.",
    ],
  },
  {
    title: "User responsibility",
    body: [
      "You are responsible for the accuracy of the information you enter and for reviewing, customizing, and using your final package names, prices, descriptions, deliverables, and business terms before sharing or using a rate card.",
      "You are responsible for what you publish or share through RateKit.",
    ],
  },
  {
    title: "Pricing estimates",
    body: [
      "RateKit provides suggested sponsorship rates as starting points only. They are not financial, legal, tax, or business advice, and RateKit does not decide your final pricing.",
    ],
  },
  {
    title: "Free previews and watermarks",
    body: [
      "Free previews may include RateKit watermarks. You may use previews to review your rate card before choosing any future paid feature.",
    ],
  },
  {
    title: "Paid features",
    body: [
      "Paid features, such as watermark-free export, may be offered. Prices and feature details are shown before purchase. Payments may be processed by a third-party payment provider or merchant of record, and that provider's terms may also apply.",
    ],
  },
  {
    title: "Public sharing",
    body: [
      "Public share links, when available, may make selected rate card information visible to anyone with the link.",
      "Do not publish or share information that you do not want brands or link recipients to see.",
    ],
  },
  {
    title: "Prohibited use",
    body: [
      "Do not use RateKit to submit or distribute illegal, harmful, misleading, abusive, or infringing content, or to interfere with the service.",
    ],
  },
  {
    title: "Service changes",
    body: [
      "RateKit may change, limit, or discontinue features as the product evolves. We aim to communicate material changes clearly.",
    ],
  },
  {
    title: "Contact",
    body: ["Questions about these terms can be sent to support@hslab.tools."],
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-zinc-100">
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" aria-label="RateKit home">
            <Image
              src="/ratekit-logo.svg"
              alt="RateKit"
              width={178}
              height={48}
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

      <article className="mx-auto w-full max-w-4xl border-x border-zinc-800 px-5 py-16 sm:px-8 sm:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
          Legal
        </p>
        <h1 className="mt-5 text-4xl font-medium tracking-[-0.04em] text-stone-100 sm:text-6xl">
          Terms of Service
        </h1>
        <p className="mt-5 max-w-2xl leading-7 text-zinc-500">
          Simple terms for using RateKit.
        </p>

        <div className="mt-14 divide-y divide-zinc-800 border-t border-zinc-800">
          {sections.map((section) => (
            <section key={section.title} className="grid gap-5 py-9 sm:grid-cols-[12rem_1fr]">
              <h2 className="font-medium text-stone-200">{section.title}</h2>
              <div className="space-y-4 leading-7 text-zinc-500">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>

      <LegalFooter />
    </main>
  );
}

function LegalFooter() {
  return (
    <footer className="border-t border-zinc-800">
      <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center gap-x-5 gap-y-2 px-5 py-7 text-xs text-zinc-600 sm:px-8">
        <Link href="/privacy" className="transition-colors hover:text-zinc-300">
          Privacy
        </Link>
        <Link href="/terms" className="text-zinc-300">
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
  );
}
