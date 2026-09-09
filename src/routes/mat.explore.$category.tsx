import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { catalogApi } from "@/lib/api";
import { apiVideoToVideoItem } from "@/lib/catalogAdapters";
import { VideoCard } from "@/components/cards/VideoCard";

export const Route = createFileRoute("/mat/explore/$category")({
  component: CategoryPage,
});

function CategoryPage() {
  const { category: slug } = Route.useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["category-videos", slug],
    queryFn: () => catalogApi.categoryVideos(slug),
    retry: false,
  });

  if (isError) {
    return (
      <div className="container-page py-32 text-center">
        <div className="eyebrow mb-4">Not found</div>
        <h1 className="font-display text-4xl">This discipline is not in our library.</h1>
        <p className="mt-4 text-sm text-warm-gray">
          {error instanceof Error ? error.message : "Please try another category."}
        </p>
        <Link
          to="/mat/explore"
          className="mt-10 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-ink hover:underline"
        >
          Back to all disciplines
        </Link>
      </div>
    );
  }

  const category = data?.category;
  const items = (data?.data ?? []).map(apiVideoToVideoItem);

  return (
    <div className="pb-32">
      <section className="relative flex h-[45vh] min-h-[320px] flex-col justify-end overflow-hidden bg-ink pb-16 text-soft-white">
        <div className="container-page relative">
          <div className="eyebrow text-soft-white/60">Discipline</div>
          {isLoading ? (
            <div className="mt-4 h-16 w-72 animate-pulse bg-soft-white/10" />
          ) : (
            <>
              <h1 className="mt-4 font-display text-6xl md:text-8xl">{category?.name}</h1>
              {category?.tagline && (
                <p className="mt-4 max-w-lg italic text-soft-white/75">{category.tagline}</p>
              )}
              {category?.description && (
                <p className="mt-3 max-w-lg text-soft-white/70">{category.description}</p>
              )}
            </>
          )}
        </div>
      </section>

      <section className="container-page py-20">
        <div className="mb-10 flex items-end justify-between">
          <div className="eyebrow">
            {isLoading
              ? "Loading…"
              : `${items.length} ${items.length === 1 ? "practice" : "practices"}`}
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[16/10] animate-pulse bg-muted" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="border hairline px-10 py-32 text-center">
            <div className="eyebrow mb-4">In preparation</div>
            <p className="font-display text-3xl">Practices for this discipline arrive shortly.</p>
          </div>
        ) : (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {items.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        )}
      </section>

      <section className="container-page border-t hairline py-20">
        <Link
          to="/mat/explore"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-charcoal transition-colors hover:text-ink"
        >
          ← Other directions
        </Link>
      </section>
    </div>
  );
}
