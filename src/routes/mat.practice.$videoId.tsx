import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Play, Lock, ShoppingBag } from "lucide-react";
import { catalogApi, videoCheckoutApi, ApiError } from "@/lib/api";
import { PremiumLock } from "@/components/common/PremiumLock";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/mat/practice/$videoId")({
  component: VideoDetail,
});

function VideoDetail() {
  const { videoId } = Route.useParams();
  const { isAuthenticated, role } = useAuth();
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [watchError, setWatchError] = useState<string | null>(null);
  const [requesting, setRequesting] = useState(false);
  const [buying, setBuying] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);

  const {
    data: video,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["video", videoId],
    queryFn: () => catalogApi.video(videoId),
    retry: false,
  });

  async function handlePlay() {
    setWatchError(null);
    setRequesting(true);
    try {
      const res = await catalogApi.watch(videoId);
      setStreamUrl(res.stream_url);
    } catch (err) {
      setWatchError(
        err instanceof ApiError ? err.message : "Couldn't start this practice. Please try again.",
      );
    } finally {
      setRequesting(false);
    }
  }

  async function handleBuy() {
    setBuyError(null);
    setBuying(true);
    try {
      const res = await videoCheckoutApi.createCheckout(videoId);
      window.location.href = res.checkout_url;
    } catch (err) {
      setBuyError(
        err instanceof ApiError ? err.message : "Couldn't start checkout. Please try again.",
      );
    } finally {
      setBuying(false);
    }
  }

  if (isLoading) {
    return <div className="container-page py-32 text-center text-warm-gray">Loading…</div>;
  }

  if (isError || !video) {
    return (
      <div className="container-page py-32 text-center">
        <div className="eyebrow mb-4">Not found</div>
        <h1 className="font-display text-4xl">This practice could not be located.</h1>
      </div>
    );
  }

  const locked = !video.can_watch;
  // A practitioner is only offered "buy this video" once they already clear
  // the mat gate — i.e. the video is specifically paid_premium and unpurchased,
  // not locked for lack of a mat (createVideoCheckout returns 403 mat_required
  // for non-practitioners, so this button only ever shows where it will work).
  const canBuyThisVideo =
    locked && role === "practitioner" && video.access_level === "paid_premium" && !video.purchased;
  const priceLabel =
    typeof video.price_cents === "number" ? `$${(video.price_cents / 100).toFixed(2)}` : null;

  return (
    <div className="pb-32">
      <section className="bg-ink text-soft-white">
        <div className="container-page grid gap-12 py-16 md:grid-cols-[1.4fr_1fr] md:py-24">
          <div className="relative aspect-[16/10] overflow-hidden bg-charcoal">
            {video.thumbnail_url && (
              <img
                src={video.thumbnail_url}
                alt={video.title}
                className="h-full w-full object-cover"
              />
            )}
            {streamUrl ? (
              <video src={streamUrl} controls autoPlay className="absolute inset-0 h-full w-full" />
            ) : locked ? (
              <PremiumLock
                title={
                  canBuyThisVideo
                    ? `Purchase this session${priceLabel ? ` — ${priceLabel}` : ""}`
                    : "For Practitioners — mat owners"
                }
                subtitle={
                  canBuyThisVideo
                    ? "This is a paid premium video. Buy it once to watch it any time."
                    : "Buy the Navamata mat to unlock the practice library."
                }
              />
            ) : (
              <button
                aria-label="Play"
                onClick={handlePlay}
                disabled={requesting}
                className="absolute inset-0 flex items-center justify-center bg-ink/15 transition-colors hover:bg-ink/30 disabled:opacity-60"
              >
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-soft-white text-ink">
                  <Play className="h-6 w-6" fill="currentColor" />
                </span>
              </button>
            )}
          </div>

          <div className="flex flex-col">
            <div className="eyebrow text-soft-white/60 capitalize">{video.category?.name}</div>
            <h1 className="mt-5 font-display text-4xl leading-[1.05] md:text-5xl">{video.title}</h1>

            {video.description && (
              <p className="mt-8 text-sm leading-relaxed text-soft-white/80">{video.description}</p>
            )}

            {watchError && <p className="mt-6 text-sm text-destructive-foreground">{watchError}</p>}
            {buyError && <p className="mt-6 text-sm text-destructive-foreground">{buyError}</p>}

            <div className="mt-auto flex flex-wrap items-center gap-4 pt-10">
              {canBuyThisVideo ? (
                <button
                  onClick={handleBuy}
                  disabled={buying}
                  className="inline-flex h-12 items-center border border-soft-white bg-soft-white px-8 text-xs uppercase tracking-[0.22em] text-ink transition-colors hover:bg-transparent hover:text-soft-white disabled:opacity-60"
                >
                  <ShoppingBag className="mr-2 h-3.5 w-3.5" />
                  {buying
                    ? "Redirecting…"
                    : `Buy this session${priceLabel ? ` — ${priceLabel}` : ""}`}
                </button>
              ) : locked ? (
                <Link
                  to={isAuthenticated ? "/mat/buy" : "/signin/explorer"}
                  className="inline-flex h-12 items-center border border-soft-white bg-soft-white px-8 text-xs uppercase tracking-[0.22em] text-ink transition-colors hover:bg-transparent hover:text-soft-white"
                >
                  <Lock className="mr-2 h-3.5 w-3.5" />
                  {isAuthenticated ? "Acquire the mat" : "Create a free account"}
                </Link>
              ) : (
                !streamUrl && (
                  <button
                    onClick={handlePlay}
                    disabled={requesting}
                    className="inline-flex h-12 items-center border border-soft-white bg-soft-white px-8 text-xs uppercase tracking-[0.22em] text-ink transition-colors hover:bg-transparent hover:text-soft-white disabled:opacity-60"
                  >
                    {requesting ? "Preparing…" : "Start practice"}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
