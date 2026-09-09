import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, SlidersHorizontal, ArrowRight } from "lucide-react";
import { videos } from "@/data/videos";
import { categories } from "@/data/categories";
import { VideoCard } from "@/components/cards/VideoCard";
import { SectionHeader } from "@/components/common/SectionHeader";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/explore")({
  component: ExplorePage,
});

function ExplorePage() {
  const { user } = useAuth();
  const featured = videos[2];
  const recommended = videos.slice(0, 4);
  const recent = videos.slice(4, 8);
  const premium = videos.filter((v) => v.isPremium);
  const continueWatching = videos.filter((v) => typeof v.progress === "number");

  return (
    <div className="pb-32">
      {/* Hero — featured practice */}
      <section className="relative overflow-hidden bg-ink text-soft-white">
        <img
          src={featured.thumbnail}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/10" />
        <div className="container-page relative grid gap-16 py-28 md:grid-cols-[1.2fr_1fr] md:py-40">
          <div>
            <div className="eyebrow text-soft-white/60">Featured practice · {featured.category}</div>
            <h1 className="mt-6 font-display text-5xl leading-[1.02] md:text-7xl">
              {featured.title}
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-soft-white/75">
              {featured.description}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-8 text-xs uppercase tracking-[0.22em] text-soft-white/70">
              <span>{featured.instructor}</span>
              <span>{featured.duration}</span>
              <span>{featured.level}</span>
            </div>
            <Link
              to="/practice/$videoId"
              params={{ videoId: featured.id }}
              className="mt-10 inline-flex h-12 items-center border border-soft-white px-8 text-xs uppercase tracking-[0.22em] text-soft-white transition-colors hover:bg-soft-white hover:text-ink"
            >
              Begin practice
            </Link>
          </div>
        </div>
      </section>

      {/* Search + filter (placeholder) */}
      <section className="border-b hairline">
        <div className="container-page flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center gap-3 border-b hairline pb-3 md:max-w-md md:border-0 md:pb-0">
            <Search className="h-4 w-4 text-warm-gray" />
            <input
              type="search"
              placeholder="Search practices, teachers, breath…"
              className="w-full bg-transparent text-sm placeholder:text-warm-gray focus:outline-none"
            />
          </div>
          <button className="inline-flex items-center gap-2 self-start text-xs uppercase tracking-[0.22em] text-charcoal hover:text-ink md:self-auto">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filter
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="container-page py-24">
        <SectionHeader
          eyebrow="Disciplines"
          title="Five quiet directions of practice."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/explore/$category"
              params={{ category: c.slug }}
              className="group relative aspect-[3/4] overflow-hidden bg-muted"
            >
              <img
                src={c.image}
                alt={c.name}
                className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-soft-white">
                <div className="eyebrow text-soft-white/60">Discipline</div>
                <div className="mt-2 font-display text-2xl">{c.name}</div>
                <p className="mt-1 text-xs italic text-soft-white/70">{c.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Continue watching */}
      {user && continueWatching.length > 0 && (
        <section className="container-page py-16">
          <div className="mb-10 flex items-end justify-between">
            <SectionHeader eyebrow="Where you left off" title="Continue your practice." />
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {continueWatching.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        </section>
      )}

      {/* Recommended */}
      <section className="container-page py-16">
        <div className="mb-10 flex items-end justify-between">
          <SectionHeader eyebrow="Curated for you" title="Recommended this week." />
          <Link
            to="/practice"
            className="hidden items-center gap-2 text-xs uppercase tracking-[0.22em] text-charcoal hover:text-ink md:inline-flex"
          >
            All practices <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {recommended.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      </section>

      {/* Recently added */}
      <section className="container-page py-16">
        <SectionHeader eyebrow="Recently added" title="New in the library." />
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {recent.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      </section>

      {/* Members-only */}
      <section className="container-page py-16">
        <div className="mb-10 flex items-end justify-between">
          <SectionHeader
            eyebrow="Members"
            title="Held for Explorer & Practitioner."
            description="Long-form studies and instructor-led intensives."
          />
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {premium.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      </section>
    </div>
  );
}
