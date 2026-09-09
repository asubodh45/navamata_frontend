import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { mats } from "@/data/mats";
import { SectionHeader } from "@/components/common/SectionHeader";

export const Route = createFileRoute("/mat/about")({
  component: MatAbout,
});

function MatAbout() {
  return (
    <div className="pb-32">
      <section className="relative overflow-hidden bg-ink text-soft-white">
        <div className="relative z-10 flex items-center justify-between border-b border-soft-white/10 px-8 py-5 text-[0.65rem] uppercase tracking-[0.28em] text-soft-white/60 md:px-16">
          <span>Chapter · The Mat</span>
          <span className="hidden md:inline">Est. Slowly, In Studio</span>
          <span>Vol I</span>
        </div>
        <div className="container-page relative z-10 grid gap-20 py-24 md:grid-cols-[1.3fr_1fr] md:py-32">
          <div className="flex flex-col justify-center">
            <div className="eyebrow mb-8 text-soft-white/60">The Mat</div>
            <h1 className="font-display font-bold text-[clamp(3rem,8vw,7rem)] leading-[0.9] tracking-[-0.035em]">
              An object built
              <br />
              <em className="not-italic text-soft-white/55">to outlast a decade.</em>
            </h1>
            <p className="mt-10 max-w-md text-lg leading-relaxed text-soft-white/75">
              Hand-finished in small batches from natural tree rubber. Engineered for daily practice
              and considered, in every detail, as a quiet companion.
            </p>
            <div className="mt-12 flex flex-wrap gap-4">
              <Link
                to="/mat/buy"
                className="inline-flex h-14 items-center bg-soft-white px-10 text-xs font-semibold uppercase tracking-[0.24em] text-ink transition-transform hover:-translate-y-0.5"
              >
                Acquire the mat
              </Link>
              <a
                href="#materials"
                className="inline-flex h-14 items-center gap-2 border border-soft-white/40 px-8 text-xs font-semibold uppercase tracking-[0.24em] text-soft-white hover:bg-soft-white hover:text-ink"
              >
                Materials <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden border border-soft-white/10 bg-charcoal">
            <img
              src={mats[0].image}
              alt={mats[0].name}
              className="h-full w-full object-cover grayscale"
            />
          </div>
        </div>
      </section>

      {/* The two finishes */}
      <section className="container-page py-24">
        <SectionHeader
          eyebrow="Two finishes"
          title="One mat, in pearl or obsidian."
          description="Identical geometry, weight, and grip. A choice of mood."
          align="center"
          className="mx-auto"
        />
        <div className="mt-16 grid gap-14 md:grid-cols-2">
          {mats.map((m) => (
            <article key={m.id} className="group flex flex-col">
              <div className="aspect-[4/5] overflow-hidden bg-muted">
                <img
                  src={m.image}
                  alt={m.name}
                  className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]"
                />
              </div>
              <div className="pt-6">
                <div className="eyebrow mb-2">{m.color === "grey" ? "Pearl" : "Obsidian"}</div>
                <div className="flex items-end justify-between">
                  <h3 className="font-display text-3xl">{m.name}</h3>
                  <span className="font-display text-2xl">${m.price}</span>
                </div>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-warm-gray">
                  {m.description}
                </p>
                <Link
                  to="/mat/buy"
                  className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-ink hover:text-charcoal"
                >
                  Choose this finish <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Materials */}
      <section id="materials" className="bg-ink py-24 text-soft-white">
        <div className="container-page grid gap-16 md:grid-cols-[1fr_1.4fr]">
          <div>
            <div className="eyebrow mb-4 text-soft-white/60">Materials</div>
            <h2 className="font-display text-4xl leading-tight md:text-5xl">
              Tree rubber, in its <em className="not-italic text-brand">quietest form.</em>
            </h2>
            <p className="mt-6 max-w-md text-soft-white/75">
              Sourced from a single cooperative in Kerala. Cured slowly. Finished by hand.
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-y-8 self-end border-t border-soft-white/15 pt-10 text-sm md:grid-cols-3">
            {mats[0].specs.map((s) => (
              <div key={s.label}>
                <dt className="eyebrow mb-2 text-soft-white/55">{s.label}</dt>
                <dd className="font-display text-xl">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="container-page py-24 text-center">
        <h2 className="mx-auto max-w-2xl font-display text-4xl leading-tight md:text-5xl">
          Ready to <em className="not-italic text-brand">begin?</em>
        </h2>
        <Link
          to="/mat/buy"
          className="mt-10 inline-flex h-12 items-center bg-ink px-10 text-xs uppercase tracking-[0.22em] text-soft-white hover:bg-charcoal"
        >
          Acquire the mat
        </Link>
      </section>
    </div>
  );
}
