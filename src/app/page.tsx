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

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 lg:px-8">
        <a href="#" className="text-lg font-semibold tracking-tight text-white">
          Rate<span className="text-indigo-400">Kit</span>
        </a>
        <a
          href="#pricing"
          className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:border-white/30 hover:bg-white/5"
        >
          View pricing
        </a>
      </header>

      <section className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-6 pb-28 pt-20 text-center lg:px-8 lg:pb-36 lg:pt-28">
        <div className="absolute left-1/2 top-20 z-0 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="relative z-10">
          <p className="mb-6 inline-flex rounded-full border border-indigo-400/25 bg-indigo-400/10 px-4 py-2 text-sm font-medium text-indigo-300">
            Pricing pages built for creators
          </p>
          <h1 className="mx-auto max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
            Create creator pricing pages and sponsorship rate cards in minutes.
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-zinc-400 sm:text-xl">
            Stop guessing your rates. Build a clean page brands can understand
            without fighting Canva chaos.
          </p>
          <a
            href="#pricing"
            className="mt-10 inline-flex rounded-full bg-indigo-400 px-7 py-3.5 text-base font-semibold text-zinc-950 transition-colors hover:bg-indigo-300"
          >
            Create my rate card
          </a>
          <p className="mt-4 text-sm text-zinc-500">Start with a free preview.</p>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-20 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-28">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
              The problem
            </p>
            <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Your rates should not live in a cluttered spreadsheet.
            </h2>
          </div>
          <div className="space-y-5 text-lg leading-8 text-zinc-400">
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
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
            How it works
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            From rough rates to ready to share.
          </h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-7"
            >
              <span className="font-mono text-sm text-indigo-400">
                {step.number}
              </span>
              <h3 className="mt-8 text-xl font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-3 leading-7 text-zinc-400">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-24 lg:px-8 lg:pb-32">
        <div className="grid gap-10 rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-400/10 to-white/[0.02] p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
              What you get
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Everything needed to present your value clearly.
            </h2>
          </div>
          <ul className="space-y-4">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 text-zinc-300">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-400/15 text-xs text-indigo-300">
                  ✓
                </span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="pricing"
        className="border-y border-white/10 bg-white/[0.02]"
      >
        <div className="mx-auto w-full max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
              Simple pricing
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Preview for free. Pay only when it is ready.
            </h2>
          </div>
          <div className="mx-auto mt-12 grid max-w-3xl gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-zinc-950 p-8">
              <p className="font-medium text-zinc-300">Free preview</p>
              <p className="mt-5 text-4xl font-semibold tracking-tight text-white">
                $0
              </p>
              <p className="mt-4 leading-7 text-zinc-400">
                Build and review your rate card before you commit.
              </p>
            </div>
            <div className="rounded-2xl border border-indigo-400/40 bg-indigo-400/10 p-8">
              <p className="font-medium text-indigo-300">
                Watermark-free export
              </p>
              <p className="mt-5 text-4xl font-semibold tracking-tight text-white">
                $9
              </p>
              <p className="mt-4 leading-7 text-zinc-300">
                Export a polished, professional rate card without a watermark.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-24 text-center lg:px-8 lg:py-32">
        <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-5xl">
          Make your rates easier to understand and easier to say yes to.
        </h2>
        <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-400">
          Build a clean sponsorship rate card in minutes.
        </p>
        <a
          href="#pricing"
          className="mt-9 inline-flex rounded-full bg-indigo-400 px-7 py-3.5 text-base font-semibold text-zinc-950 transition-colors hover:bg-indigo-300"
        >
          Create my rate card
        </a>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-8 text-sm text-zinc-500 lg:px-8">
          <p className="font-medium text-zinc-300">RateKit</p>
          <p>Built for independent creators.</p>
        </div>
      </footer>
    </main>
  );
}
