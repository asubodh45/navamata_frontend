import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { catalogApi } from "@/lib/api";
import { apiCategoryToCategory } from "@/lib/catalogAdapters";
import { SectionHeader } from "@/components/common/SectionHeader";

export const Route = createFileRoute("/mat/explore")({
  head: () => ({
    meta: [
      { title: "Explore — Navamata" },
      { name: "description", content: "The six disciplines of the Navamata practice." },
    ],
  }),
  component: MatExplorePage,
  validateSearch: (search: Record<string, unknown>): { purchase?: "cancelled" } =>
    search.purchase === "cancelled" ? { purchase: "cancelled" } : {},
});

// Fetched client-side (not in a route loader): the category listing is
// public, but if a session token is present the videos inside each category
// personalize can_watch — and that token only exists in browser storage.
function MatExplorePage() {
  const { purchase } = Route.useSearch();
  const navigate = useNavigate();
  const [showCancelled, setShowCancelled] = useState(purchase === "cancelled");

  useEffect(() => {
    if (purchase === "cancelled") {
      navigate({ to: "/mat/explore", search: {}, replace: true });
    }
  }, [purchase]); // eslint-disable-line react-hooks/exhaustive-deps

  const { data, isLoading, isError } = useQuery({
    queryKey: ["video-categories"],
    queryFn: () => catalogApi.categories(),
  });

  const categories = data?.data.map(apiCategoryToCategory) ?? [];

  return (
    <div className="pb-32">
      {showCancelled && (
        <div className="flex items-center justify-between border-b hairline bg-muted px-8 py-4 text-sm text-charcoal">
          <span>Checkout was cancelled — nothing was charged.</span>
          <button
            onClick={() => setShowCancelled(false)}
            className="text-xs uppercase tracking-[0.22em] hover:text-ink"
          >
            Dismiss
          </button>
        </div>
      )}
      <section className="relative overflow-hidden bg-ink text-soft-white">
        <div className="relative z-10 flex items-center justify-between border-b border-soft-white/10 px-8 py-5 text-[0.65rem] uppercase tracking-[0.28em] text-soft-white/60 md:px-16">
          <span>Chapter · The Mat</span>
          <span className="hidden md:inline">Six directions of practice</span>
        </div>
        <div className="container-page relative z-10 py-24 md:py-32">
          <div className="eyebrow mb-8 text-soft-white/60">Explore</div>
          <h1 className="max-w-3xl font-display font-bold text-[clamp(3rem,8vw,6.5rem)] leading-[0.9] tracking-[-0.035em]">
            Six quiet
            <br />
            <em className="not-italic text-soft-white/55">directions of practice.</em>
          </h1>
          <p className="mt-10 max-w-md text-lg leading-relaxed text-soft-white/75">
            Every discipline holds free previews to watch now, and a deeper library that opens once
            you bring the mat home.
          </p>
          <Link
            to="/mat/about"
            className="mt-10 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-soft-white/80 hover:text-soft-white"
          >
            Learn about the mat itself →
          </Link>
        </div>
      </section>

      <section className="container-page py-24">
        <SectionHeader eyebrow="Disciplines" title="Choose where to begin." />

        {isError && (
          <p className="mt-10 text-sm text-destructive">
            Couldn't load the categories right now. Please try again shortly.
          </p>
        )}

        {isLoading ? (
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] animate-pulse bg-muted" />
            ))}
          </div>
        ) : (
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <Link
                key={c.slug}
                to="/mat/explore/$category"
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
        )}
      </section>
    </div>
  );
}
