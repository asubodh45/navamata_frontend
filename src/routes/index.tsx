import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Play } from "lucide-react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { VideoCard } from "@/components/cards/VideoCard";
import { mats } from "@/data/mats";
import { videos } from "@/data/videos";
import { instructors } from "@/data/instructors";
import { testimonials } from "@/data/testimonials";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Navamata — A considered practice" },
      {
        name: "description",
        content:
          "A handcrafted mat and a quiet on-demand studio for daily practice. Built slowly, in small batches.",
      },
      { property: "og:title", content: "Navamata — A considered practice" },
      {
        property: "og:description",
        content: "A handcrafted mat and a quiet on-demand studio for daily practice.",
      },
    ],
  }),
  component: HomePage,
});

const categories = [
  { name: "Hatha", note: "Foundations & alignment" },
  { name: "Vinyasa", note: "Breath-led movement" },
  { name: "Pranayama", note: "The architecture of breath" },
  { name: "Meditation", note: "Stillness as a discipline" },
  { name: "Restorative", note: "Long holds, deep release" },
  { name: "Yin", note: "Connective tissue & quiet" },
];

const principles = [
  {
    no: "01",
    title: "Built to last a decade",
    body: "Tree-tapped natural rubber, pressed and finished in small batches. The mat is meant to outlast trends.",
  },
  {
    no: "02",
    title: "A small circle of teachers",
    body: "Three to seven instructors per season — no algorithm, no infinite scroll. A library you can finish.",
  },
  {
    no: "03",
    title: "Quiet, by design",
    body: "No streaks, no badges, no notifications. Just the practice, and the morning it belongs to.",
  },
];

function HomePage() {
  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
          HERO — full-bleed dark editorial with imagery
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] overflow-hidden bg-ink text-soft-white">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=2400&q=80"
            alt=""
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/50 to-ink" />
        </div>

        {/* Top meta rail */}
        <div className="relative z-10 flex items-center justify-between border-b border-soft-white/10 px-8 py-5 text-[0.65rem] uppercase tracking-[0.28em] text-soft-white/60 md:px-16">
          <span className="flex items-center gap-3">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand" />
            Vol I — MMXXVI
          </span>
          <span className="hidden md:inline">Est. Slowly, In Studio</span>
          <span className="text-brand-soft">Spring Season</span>
        </div>

        <div className="container-page relative z-10 grid min-h-[calc(92vh-58px)] items-center gap-16 py-20 md:grid-cols-[1.4fr_1fr] md:py-28">
          <div>
            <div className="eyebrow mb-10 flex items-center gap-3 text-soft-white/70">
              <span className="h-px w-8 bg-brand" />
              <span className="text-brand-soft">A handcrafted studio</span>
            </div>
            <h1 className="font-display font-semibold text-[clamp(4rem,11vw,10rem)] leading-[0.88] tracking-[-0.035em]">
              The mat,
              <br />
              <em className="not-italic text-brand-soft">reconsidered.</em>
            </h1>
            <p className="mt-10 max-w-lg text-lg leading-relaxed text-soft-white/75">
              Navamata is a quiet studio and a single, handcrafted mat. Built for those who treat
              practice as a daily architecture — not a workout.
            </p>
            <div className="mt-12 flex flex-wrap items-center gap-4">
              <Link
                to="/mat/explore"
                className="inline-flex h-14 items-center bg-soft-white px-10 text-xs font-semibold uppercase tracking-[0.24em] text-ink transition-transform hover:-translate-y-0.5"
              >
                Discover the Mat
              </Link>
              <Link
                to="/mat/practice"
                className="group inline-flex h-14 items-center gap-3 border border-soft-white/40 px-8 text-xs font-semibold uppercase tracking-[0.24em] text-soft-white transition-colors hover:bg-soft-white hover:text-ink"
              >
                <Play className="h-3.5 w-3.5" fill="currentColor" />
                Enter the studio
              </Link>
            </div>
          </div>

          {/* Right side image */}
          <div className="hidden md:block">
            <div className="relative aspect-[3/4] w-full overflow-hidden border border-soft-white/10 bg-charcoal">
              <img
                src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=80"
                alt="Practitioner in seated meditation"
                className="h-full w-full object-cover grayscale"
              />
              <div className="absolute bottom-6 -right-4 w-44 bg-soft-white p-5 text-ink shadow-2xl">
                <div className="text-[0.6rem] uppercase tracking-[0.28em] text-warm-gray">Now practicing</div>
                <div className="mt-2 font-display text-xl font-semibold leading-tight">Morning Foundations</div>
                <div className="mt-1 text-xs text-warm-gray">Ines Moreau · 28 min</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom ticker */}
        <div className="relative z-10 flex items-center justify-between border-t border-soft-white/10 px-8 py-4 text-[0.65rem] uppercase tracking-[0.28em] text-soft-white/50 md:px-16">
          <span>08 Teachers</span>
          <span>02 Finishes</span>
          <span className="hidden md:inline">36 Sessions</span>
          <span>Decade-built</span>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          MANIFESTO — heavy typographic statement
         ═══════════════════════════════════════════════════════════ */}
      <section className="border-t hairline bg-soft-white">
        <div className="container-page py-32 md:py-40">
          <div className="grid gap-16 md:grid-cols-[1fr_2fr]">
            <div className="eyebrow">Manifesto — 01</div>
            <div>
              <p className="font-display text-4xl font-semibold leading-[1.1] tracking-[-0.02em] text-ink md:text-6xl">
                We do not sell a mat. We sell a decade of mornings, a room made quiet by discipline,
                and one <em className="not-italic text-brand">honest object</em> to stand on.
              </p>
              <div className="mt-14 flex items-center gap-6">
                <div className="h-px w-16 bg-brand" />
                <span className="text-xs uppercase tracking-[0.24em] text-charcoal">
                  The founders — Kyoto, Paris, Copenhagen
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          PRINCIPLES — dark band
         ═══════════════════════════════════════════════════════════ */}
      <section className="bg-ink text-soft-white">
        <div className="container-page py-32">
          <div className="mb-20 flex items-end justify-between">
            <div>
              <div className="eyebrow mb-6 text-soft-white/60">Why Navamata</div>
              <h2 className="font-display text-5xl font-semibold leading-[1.02] md:text-6xl">
                Three quiet refusals.
              </h2>
            </div>
            <span className="hidden text-xs uppercase tracking-[0.24em] text-soft-white/40 md:block">
              § 01 / 03
            </span>
          </div>
          <div className="grid gap-px bg-soft-white/10 md:grid-cols-3">
            {principles.map((p) => (
              <div key={p.no} className="bg-ink p-10 md:p-14">
                <div className="font-display text-6xl font-semibold text-brand/70">{p.no}</div>
                <h3 className="mt-10 font-display text-3xl font-semibold text-soft-white">
                  {p.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-soft-white/65">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          THE MATS — editorial dual showcase
         ═══════════════════════════════════════════════════════════ */}
      <section className="bg-soft-white">
        <div className="container-page py-32">
          <div className="mb-20 grid items-end gap-12 md:grid-cols-[2fr_1fr]">
            <div>
              <div className="eyebrow mb-6">Two finishes — one object</div>
              <h2 className="font-display text-5xl font-semibold leading-[1.02] tracking-[-0.02em] text-ink md:text-7xl">
                Pearl, or Obsidian.
                <br />
                <em className="not-italic text-warm-gray">Nothing in between.</em>
              </h2>
            </div>
            <p className="text-base leading-relaxed text-warm-gray">
              A single mat, pressed from tree-tapped rubber. Two finishes, chosen to sit quietly in
              a home for the next ten years.
            </p>
          </div>

          <div className="grid gap-px bg-hairline md:grid-cols-2">
            {mats.map((mat, idx) => (
              <article
                key={mat.id}
                className={`group relative overflow-hidden ${
                  idx === 0 ? "bg-secondary" : "bg-ink text-soft-white"
                }`}
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={mat.image}
                    alt={mat.name}
                    className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105"
                  />
                </div>
                <div className="p-10 md:p-12">
                  <div className="flex items-baseline justify-between">
                    <div className={`eyebrow ${idx === 1 ? "text-soft-white/60" : ""}`}>
                      {mat.color === "grey" ? "01 · Pearl" : "02 · Obsidian"}
                    </div>
                    <div className="font-display text-2xl font-semibold">${mat.price}</div>
                  </div>
                  <h3 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-5xl">
                    {mat.name}
                  </h3>
                  <p
                    className={`mt-3 text-base italic ${
                      idx === 1 ? "text-soft-white/60" : "text-warm-gray"
                    }`}
                  >
                    {mat.tagline}
                  </p>
                  <Link
                    to="/mat/buy"
                    className={`mt-10 inline-flex h-12 items-center gap-2 border px-8 text-xs font-semibold uppercase tracking-[0.24em] transition-colors ${
                      idx === 1
                        ? "border-soft-white/50 text-soft-white hover:bg-soft-white hover:text-ink"
                        : "border-ink text-ink hover:bg-ink hover:text-soft-white"
                    }`}
                  >
                    Acquire — {mat.color === "grey" ? "Pearl" : "Obsidian"}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          DISCIPLINES — dense dark grid
         ═══════════════════════════════════════════════════════════ */}
      <section className="bg-charcoal text-soft-white">
        <div className="container-page py-32">
          <div className="mb-16 flex items-end justify-between gap-12">
            <div>
              <div className="eyebrow mb-6 text-soft-white/60">Disciplines</div>
              <h2 className="font-display text-5xl font-semibold leading-[1.02] md:text-6xl">
                A library you can
                <br />
                hold in mind.
              </h2>
            </div>
            <Link
              to="/mat/practice"
              className="hidden text-xs uppercase tracking-[0.24em] text-soft-white/70 hover:text-soft-white md:block"
            >
              See all sessions →
            </Link>
          </div>
          <ul className="grid gap-px bg-soft-white/10 sm:grid-cols-2 md:grid-cols-3">
            {categories.map((c, i) => (
              <li
                key={c.name}
                className="group flex items-end justify-between bg-charcoal p-10 transition-colors hover:bg-ink"
              >
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-soft-white/40">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="mt-5 font-display text-4xl font-semibold">{c.name}</div>
                  <div className="mt-2 text-sm text-soft-white/60">{c.note}</div>
                </div>
                <ArrowUpRight className="h-5 w-5 opacity-40 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:opacity-100" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          STUDIO PREVIEW — video library
         ═══════════════════════════════════════════════════════════ */}
      <section className="border-t hairline bg-soft-white">
        <div className="container-page py-32">
          <div className="mb-16 flex items-end justify-between gap-12">
            <SectionHeader
              eyebrow="The studio"
              title={
                <span className="font-semibold">
                  Sessions for the morning,
                  <br />
                  and the moments between.
                </span>
              }
            />
            <Link
              to="/mat/practice"
              className="hidden text-xs uppercase tracking-[0.24em] text-charcoal hover:text-ink md:block"
            >
              Enter library →
            </Link>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {videos.slice(0, 4).map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          TEACHERS — dark portrait wall
         ═══════════════════════════════════════════════════════════ */}
      <section className="bg-ink text-soft-white">
        <div className="container-page py-32">
          <div className="mb-16 grid gap-12 md:grid-cols-[1fr_1fr]">
            <div>
              <div className="eyebrow mb-6 text-soft-white/60">In residence — Vol I</div>
              <h2 className="font-display text-5xl font-semibold leading-[1.02] md:text-6xl">
                A small circle
                <br />
                of teachers.
              </h2>
            </div>
            <p className="max-w-md self-end text-base leading-relaxed text-soft-white/70">
              Each season we host a handful of teachers — chosen for clarity, not reach. Three to
              seven voices per volume, and no more.
            </p>
          </div>
          <div className="grid gap-px bg-soft-white/10 md:grid-cols-3">
            {instructors.map((t, i) => (
              <article key={t.id} className="group bg-ink p-6">
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={t.portrait}
                    alt={t.name}
                    className="h-full w-full object-cover grayscale transition-all duration-[1400ms] group-hover:scale-105 group-hover:grayscale-0"
                  />
                </div>
                <div className="mt-6 flex items-baseline justify-between">
                  <span className="text-xs uppercase tracking-[0.24em] text-soft-white/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-xs uppercase tracking-[0.24em] text-soft-white/60">
                    {t.discipline}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-3xl font-semibold">{t.name}</h3>
                <p className="mt-2 text-sm text-soft-white/60">{t.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          TESTIMONIALS
         ═══════════════════════════════════════════════════════════ */}
      <section className="bg-secondary">
        <div className="container-page py-32">
          <div className="grid gap-16 md:grid-cols-2">
            {testimonials.map((t, i) => (
              <figure key={t.id} className="border-l-2 border-ink pl-10">
                <div className="mb-6 font-display text-5xl font-semibold text-ink/20">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <blockquote className="font-display text-3xl font-semibold leading-[1.15] tracking-[-0.015em] text-ink md:text-4xl">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-10 text-xs uppercase tracking-[0.24em] text-warm-gray">
                  {t.author} — {t.role}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CTA — final dark call
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-ink text-soft-white">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=2000&q=80"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
        </div>
        <div className="container-page relative z-10 py-40">
          <div className="max-w-3xl">
            <div className="eyebrow mb-8 text-soft-white/60">Begin</div>
            <h2 className="font-display text-6xl font-semibold leading-[0.95] tracking-[-0.03em] md:text-8xl">
              Step on the mat.
              <br />
              <em className="not-italic text-soft-white/55">The rest will follow.</em>
            </h2>
            <div className="mt-14 flex flex-wrap items-center gap-4">
              <Link
                to="/signin/explorer"
                className="inline-flex h-14 items-center bg-soft-white px-10 text-xs font-semibold uppercase tracking-[0.24em] text-ink transition-transform hover:-translate-y-0.5"
              >
                Become an Explorer
              </Link>
              <Link
                to="/signin"
                className="inline-flex h-14 items-center border border-soft-white/50 px-10 text-xs font-semibold uppercase tracking-[0.24em] text-soft-white transition-colors hover:bg-soft-white hover:text-ink"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
