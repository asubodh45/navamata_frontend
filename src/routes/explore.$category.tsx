import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getCategoryBySlug, categories } from "@/data/categories";
import { videos } from "@/data/videos";
import { VideoCard } from "@/components/cards/VideoCard";

export const Route = createFileRoute("/explore/$category")({
  component: CategoryPage,
  notFoundComponent: () => (
    <div className="container-page py-32 text-center">
      <div className="eyebrow mb-4">Not found</div>
      <h1 className="font-display text-4xl">This discipline is not in our library.</h1>
    </div>
  ),
  loader: ({ params }) => {
    const cat = getCategoryBySlug(params.category);
    if (!cat) throw notFound();
    return { cat };
  },
});

function CategoryPage() {
  const { cat } = Route.useLoaderData();
  const items = videos.filter((v) => v.category === cat.slug);

  return (
    <div className="pb-32">
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden bg-ink text-soft-white">
        <img src={cat.image} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-65" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/10" />
        <div className="container-page relative flex h-full flex-col justify-end pb-20">
          <div className="eyebrow text-soft-white/60">Discipline</div>
          <h1 className="mt-4 font-display text-6xl md:text-8xl">{cat.name}</h1>
          <p className="mt-4 max-w-lg italic text-soft-white/75">{cat.tagline}</p>
          <p className="mt-3 max-w-lg text-soft-white/70">{cat.description}</p>
        </div>
      </section>

      <section className="container-page py-20">
        <div className="mb-10 flex items-end justify-between">
          <div className="eyebrow">{items.length} practices</div>
          <div className="hidden gap-6 text-xs uppercase tracking-[0.22em] text-warm-gray md:flex">
            <button className="hover:text-ink">All levels</button>
            <button className="hover:text-ink">Duration</button>
            <button className="hover:text-ink">Newest</button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="border hairline px-10 py-32 text-center">
            <div className="eyebrow mb-4">In preparation</div>
            <p className="font-display text-3xl">Practices for this discipline arrive shortly.</p>
          </div>
        ) : (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {items.map((v) => <VideoCard key={v.id} video={v} />)}
          </div>
        )}
      </section>

      <section className="container-page border-t hairline py-20">
        <div className="eyebrow mb-6">Other directions</div>
        <div className="flex flex-wrap gap-3">
          {categories.filter((c) => c.slug !== cat.slug).map((c) => (
            <Link
              key={c.id}
              to="/explore/$category"
              params={{ category: c.slug }}
              className="border hairline px-5 py-2 text-sm text-charcoal transition-colors hover:border-ink hover:text-ink"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
