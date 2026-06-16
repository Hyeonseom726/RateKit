import Image from "next/image";
import Link from "next/link";

const sections = [
  {
    title: "Overview",
    body: [
      "RateKit helps creators create pricing pages and sponsorship rate cards. This policy explains the information RateKit may handle and how it may be used as the product evolves.",
    ],
  },
  {
    title: "Information we collect",
    body: [
      "You may enter a creator name, creator handle, niche, platform, audience statistics, contact email, and sponsorship package information.",
      "When you sign in with Google, RateKit may receive basic account information from your Google account, such as your name, email address, and profile image.",
    ],
  },
  {
    title: "How we use information",
    body: [
      "We use information to provide and improve RateKit, generate your pricing pages and rate cards, respond to support requests, and understand how the product is used.",
      "RateKit does not sell user data.",
    ],
  },
  {
    title: "Sharing and third-party services",
    body: [
      "RateKit may use third-party services for hosting, analytics, authentication, databases, email, payments, or AI features as the product evolves. These providers may process information only as needed to deliver their services.",
    ],
  },
  {
    title: "Payments",
    body: [
      "If paid features are introduced, payment processing may be handled by a third-party payment provider. RateKit would not directly store full payment card details.",
    ],
  },
  {
    title: "Data deletion",
    body: [
      "You can request deletion of your information by contacting support@hslab.tools. We will respond and remove eligible data within a reasonable period.",
    ],
  },
  {
    title: "Changes to this policy",
    body: [
      "We may update this policy as RateKit changes. Material updates will be reflected on this page.",
    ],
  },
  {
    title: "Contact",
    body: [
      "Questions or deletion requests can be sent to support@hslab.tools.",
    ],
  },
];

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="mt-5 max-w-2xl leading-7 text-zinc-500">
          A clear overview of how RateKit handles information.
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
        <Link href="/privacy" className="text-zinc-300">
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
  );
}
