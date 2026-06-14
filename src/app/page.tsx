const steps = [
  {
    number: "01",
    title: "Add your offers",
    description: "List your content packages, deliverables, and starting rates.",
  },
  {
    number: "02",
    title: "Make it yours",
    description: "Choose the details that help brands understand your value.",
  },
  {
    number: "03",
    title: "Share with brands",
    description: "Send one polished page instead of another messy PDF.",
  },
];

const benefits = [
  "A clear, brand-friendly pricing page",
  "Flexible packages and sponsorship rates",
  "A polished link that is easy to share",
  "Watermark-free export when you are ready",
];

function SectionLabel({
  number,
  children,
}: {
  number: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
      <span className="font-mono text-amber-300">{number}</span>
      <span>{children}</span>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-zinc-100">
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <a href="#" className="text-lg font-semibold tracking-tight text-stone-100">
            RateKit
          </a>
          <div className="flex items-center gap-5">
            <a
              href="#how-it-works"
              className="hidden text-sm text-zinc-500 transition-colors hover:text-zinc-200 sm:block"
            >
              How it works
            </a>
            <a
              href="#pricing"
              className="border border-zinc-700 px-4 py-2 text-sm font-medium text-stone-200 transition-colors hover:border-zinc-500 hover:bg-zinc-900"
            >
              View pricing
            </a>
          </div>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-7xl border-x border-zinc-800 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="flex flex-col justify-center border-b border-zinc-800 px-5 py-20 sm:px-8 sm:py-28 lg:border-b-0 lg:border-r lg:px-12 lg:py-36">
          <p className="mb-8 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
            Pricing pages for independent creators
          </p>
          <h1 className="max-w-3xl text-5xl font-medium leading-[1.04] tracking-[-0.04em] text-stone-100 sm:text-6xl lg:text-7xl">
            Create creator pricing pages and sponsorship rate cards in minutes.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-zinc-400">
            Stop guessing your rates. Build a clean page brands can understand
            without fighting Canva chaos.
          </p>
          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <a
              href="#pricing"
              className="bg-stone-100 px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-amber-200"
            >
              Create my rate card
            </a>
            <span className="text-sm text-zinc-600">Free to preview</span>
          </div>
        </div>

        <div className="flex items-center justify-center bg-zinc-950 px-5 py-16 sm:px-8 lg:px-12">
          <div className="w-full max-w-md border border-stone-300 bg-stone-100 p-6 text-zinc-950 shadow-[8px_8px_0_0_#27272a] sm:p-8">
            <div className="flex items-start justify-between border-b border-zinc-300 pb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Creator rate card
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                  Jamie Park
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Food, culture &amp; city guides
                </p>
              </div>
              <div className="h-9 w-9 border border-zinc-400 bg-amber-200" />
            </div>
            <div className="py-6">
              <div className="flex items-end justify-between border-b border-zinc-300 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Short-form video
                  </p>
                  <p className="mt-2 text-sm text-zinc-600">
                    Concept, production, 30-day usage
                  </p>
                </div>
                <p className="font-mono text-lg font-semibold">$850</p>
              </div>
              <div className="flex items-end justify-between border-b border-zinc-300 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Brand package
                  </p>
                  <p className="mt-2 text-sm text-zinc-600">
                    1 video, 3 stories, link placement
                  </p>
                </div>
                <p className="font-mono text-lg font-semibold">$1,400</p>
              </div>
              <div className="flex items-end justify-between pt-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Monthly partner
                  </p>
                  <p className="mt-2 text-sm text-zinc-600">
                    Custom recurring collaboration
                  </p>
                </div>
                <p className="font-mono text-lg font-semibold">Let&apos;s talk</p>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-zinc-300 pt-5 text-xs text-zinc-500">
              <span>Valid for 30 days</span>
              <span className="font-semibold text-zinc-900">hello@jamie.co</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-800">
        <div className="mx-auto grid w-full max-w-7xl border-x border-zinc-800 lg:grid-cols-[0.45fr_1fr]">
          <div className="border-b border-zinc-800 px-5 py-12 sm:px-8 lg:border-b-0 lg:border-r lg:px-12">
            <SectionLabel number="01">The problem</SectionLabel>
          </div>
          <div className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
            <h2 className="max-w-3xl text-3xl font-medium leading-tight tracking-[-0.03em] text-stone-100 sm:text-5xl">
              Your rates should not live in a cluttered spreadsheet.
            </h2>
            <div className="mt-10 grid gap-6 border-t border-zinc-800 pt-8 text-base leading-7 text-zinc-400 sm:grid-cols-2">
              <p>
                Brands want to quickly understand what you offer, what it costs,
                and how to work with you.
              </p>
              <p>
                RateKit turns scattered pricing notes into one focused,
                professional page that makes the next step obvious.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="mx-auto w-full max-w-7xl border-x border-zinc-800 px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
      >
        <SectionLabel number="02">How it works</SectionLabel>
        <h2 className="mt-6 max-w-2xl text-3xl font-medium tracking-[-0.03em] text-stone-100 sm:text-5xl">
          From rough rates to ready to share.
        </h2>
        <div className="mt-14 grid border-l border-t border-zinc-800 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="border-b border-r border-zinc-800 p-7 sm:p-8"
            >
              <span className="font-mono text-xs text-zinc-600">
                {step.number}
              </span>
              <h3 className="mt-16 text-xl font-medium text-stone-100">
                {step.title}
              </h3>
              <p className="mt-3 max-w-xs leading-7 text-zinc-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-zinc-800 bg-zinc-950">
        <div className="mx-auto grid w-full max-w-7xl border-x border-zinc-800 lg:grid-cols-2">
          <div className="border-b border-zinc-800 px-5 py-20 sm:px-8 lg:border-b-0 lg:border-r lg:px-12 lg:py-28">
            <SectionLabel number="03">What you get</SectionLabel>
            <h2 className="mt-6 max-w-xl text-3xl font-medium leading-tight tracking-[-0.03em] text-stone-100 sm:text-5xl">
              Everything needed to present your value clearly.
            </h2>
          </div>
          <ul className="divide-y divide-zinc-800 px-5 py-10 sm:px-8 lg:px-12 lg:py-16">
            {benefits.map((benefit, index) => (
              <li
                key={benefit}
                className="flex items-center gap-5 py-6 text-zinc-300"
              >
                <span className="font-mono text-xs text-amber-300">
                  0{index + 1}
                </span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="pricing"
        className="mx-auto w-full max-w-7xl border-x border-zinc-800 px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
      >
        <SectionLabel number="04">Simple pricing</SectionLabel>
        <div className="mt-6 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <h2 className="max-w-2xl text-3xl font-medium tracking-[-0.03em] text-stone-100 sm:text-5xl">
            Preview for free. Pay only when it is ready.
          </h2>
          <p className="max-w-sm text-sm leading-6 text-zinc-500">
            Build the full page first. Export without a watermark when you are
            happy with it.
          </p>
        </div>
        <div className="mt-14 grid border-l border-t border-zinc-800 md:grid-cols-2">
          <div className="border-b border-r border-zinc-800 p-8 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Free preview
            </p>
            <p className="mt-12 font-mono text-5xl text-stone-100">$0</p>
            <p className="mt-6 max-w-sm leading-7 text-zinc-500">
              Build and review your rate card before you commit.
            </p>
          </div>
          <div className="border-b border-r border-zinc-800 bg-stone-100 p-8 text-zinc-950 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Watermark-free export
            </p>
            <p className="mt-12 font-mono text-5xl">$9</p>
            <p className="mt-6 max-w-sm leading-7 text-zinc-600">
              Export a polished, professional rate card without a watermark.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-10 border-x border-zinc-800 px-5 py-20 sm:px-8 lg:flex-row lg:items-end lg:px-12 lg:py-28">
          <div>
            <SectionLabel number="05">Ready when you are</SectionLabel>
            <h2 className="mt-6 max-w-3xl text-3xl font-medium leading-tight tracking-[-0.03em] text-stone-100 sm:text-5xl">
              Make your rates easier to understand and easier to say yes to.
            </h2>
          </div>
          <a
            href="#pricing"
            className="shrink-0 bg-stone-100 px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-amber-200"
          >
            Create my rate card
          </a>
        </div>
      </section>

      <footer className="border-t border-zinc-800">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-7 text-xs text-zinc-600 sm:px-8 lg:px-12">
          <p className="font-semibold text-zinc-400">RateKit</p>
          <p>Built for independent creators.</p>
        </div>
      </footer>
    </main>
  );
}
