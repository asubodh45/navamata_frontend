import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Play, Lock, Bookmark, Share2 } from "lucide-react";
import { getVideoById, getRelated } from "@/data/videos";
import { VideoCard } from "@/components/cards/VideoCard";
import { PremiumLock } from "@/components/common/PremiumLock";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/practice/$videoId")({
  component: VideoDetail,
  notFoundComponent: () => (
    <div className="container-page py-32 text-center">
      <div className="eyebrow mb-4">Not found</div>
      <h1 className="font-display text-4xl">This practice could not be located.</h1>
    </div>
  ),
  loader: ({ params }) => {
    const video = getVideoById(params.videoId);
    if (!video) throw notFound();
    return { video, related: getRelated(params.videoId) };
  },
});

function VideoDetail() {
  const { video, related } = Route.useLoaderData();
  const { isAuthenticated } = useAuth();
  const locked = video.isPremium && !isAuthenticated;

  return (
    <div className="pb-32">
      <section className="bg-ink text-soft-white">
        <div className="container-page grid gap-12 py-16 md:grid-cols-[1.4fr_1fr] md:py-24">
          <div className="relative aspect-[16/10] overflow-hidden bg-charcoal">
            <img src={video.thumbnail} alt={video.title} className="h-full w-full object-cover" />
            {locked ? (
              <PremiumLock />
            ) : (
              <button
                aria-label="Play"
                className="absolute inset-0 flex items-center justify-center bg-ink/15 transition-colors hover:bg-ink/30"
              >
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-soft-white text-ink">
                  <Play className="h-6 w-6" fill="currentColor" />
                </span>
              </button>
            )}
          </div>

          <div className="flex flex-col">
            <div className="eyebrow text-soft-white/60 capitalize">
              {video.category} · {video.level}
            </div>
            <h1 className="mt-5 font-display text-4xl leading-[1.05] md:text-5xl">{video.title}</h1>
            <p className="mt-3 text-sm italic text-soft-white/70">with {video.instructor}</p>

            <dl className="mt-8 grid grid-cols-3 gap-6 border-y border-soft-white/15 py-6 text-xs uppercase tracking-[0.22em]">
              <div>
                <dt className="text-soft-white/50">Duration</dt>
                <dd className="mt-2 font-display text-base normal-case tracking-normal">{video.duration}</dd>
              </div>
              <div>
                <dt className="text-soft-white/50">Level</dt>
                <dd className="mt-2 font-display text-base normal-case tracking-normal">{video.level}</dd>
              </div>
              <div>
                <dt className="text-soft-white/50">Style</dt>
                <dd className="mt-2 font-display text-base capitalize normal-case tracking-normal">
                  {video.category}
                </dd>
              </div>
            </dl>

            <p className="mt-8 text-sm leading-relaxed text-soft-white/80">{video.description}</p>

            <div className="mt-auto flex flex-wrap items-center gap-4 pt-10">
              {locked ? (
                <Link
                  to="/signin/explorer"
                  className="inline-flex h-12 items-center border border-soft-white bg-soft-white px-8 text-xs uppercase tracking-[0.22em] text-ink transition-colors hover:bg-transparent hover:text-soft-white"
                >
                  <Lock className="mr-2 h-3.5 w-3.5" /> Open with Explorer
                </Link>
              ) : (
                <button className="inline-flex h-12 items-center border border-soft-white bg-soft-white px-8 text-xs uppercase tracking-[0.22em] text-ink transition-colors hover:bg-transparent hover:text-soft-white">
                  Start practice
                </button>
              )}
              <button className="inline-flex h-12 items-center gap-2 border border-soft-white/40 px-5 text-xs uppercase tracking-[0.22em] text-soft-white/85 hover:border-soft-white">
                <Bookmark className="h-3.5 w-3.5" /> Save
              </button>
              <button className="inline-flex h-12 items-center gap-2 px-2 text-xs uppercase tracking-[0.22em] text-soft-white/60 hover:text-soft-white">
                <Share2 className="h-3.5 w-3.5" /> Share
              </button>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-page py-24">
          <div className="mb-10">
            <div className="eyebrow mb-3">Related practices</div>
            <h2 className="font-display text-4xl">Continue <em className="not-italic text-brand">in this direction.</em></h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {related.map((v: typeof related[number]) => <VideoCard key={v.id} video={v} />)}
          </div>
        </section>
      )}
    </div>
  );
}
