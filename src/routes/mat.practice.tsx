import { createFileRoute, Link, Outlet, useNavigate, useMatches } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { catalogApi, videoCheckoutApi, ApiError, type ApiVideo } from "@/lib/api";
import { apiVideoToVideoItem } from "@/lib/catalogAdapters";
import { VideoCard } from "@/components/cards/VideoCard";
import { SectionHeader } from "@/components/common/SectionHeader";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/mat/practice")({
  component: PracticePage,
  validateSearch: (
    search: Record<string, unknown>,
  ): { purchase?: "success" | "cancelled"; session_id?: string } => {
    const result: { purchase?: "success" | "cancelled"; session_id?: string } = {};
    if (search.purchase === "success" || search.purchase === "cancelled")
      result.purchase = search.purchase;
    if (typeof search.session_id === "string") result.session_id = search.session_id;
    return result;
  },
});

/**
 * StripeController::createVideoCheckout's success_url lands here directly
 * (with ?purchase=success&session_id=...) rather than a dedicated route —
 * so purchase confirmation happens inline on this page.
 */
function usePurchaseConfirmation() {
  const { purchase, session_id } = Route.useSearch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [banner, setBanner] = useState<{
    kind: "success" | "error" | "cancelled";
    text: string;
  } | null>(null);
  const attempts = useRef(0);

  useEffect(() => {
    if (purchase === "cancelled") {
      setBanner({ kind: "cancelled", text: "Checkout was cancelled — nothing was charged." });
      navigate({ to: "/mat/practice", search: {}, replace: true });
      return;
    }

    if (purchase === "success" && session_id) {
      let cancelled = false;

      async function poll() {
        try {
          const res = await videoCheckoutApi.confirmCheckout(session_id!);
          if (cancelled) return;

          if (!res.paid) {
            setBanner({ kind: "error", text: "That payment did not complete." });
            return;
          }
          if (!res.purchase_recorded && attempts.current < 6) {
            attempts.current += 1;
            setTimeout(poll, 1500);
            return;
          }
          setBanner({ kind: "success", text: "Purchase complete — it's in your library below." });
          queryClient.invalidateQueries({ queryKey: ["all-videos"] });
        } catch (err) {
          if (cancelled) return;
          setBanner({
            kind: "error",
            text: err instanceof ApiError ? err.message : "Couldn't confirm that purchase.",
          });
        }
      }

      poll();
      navigate({ to: "/mat/practice", search: {}, replace: true });
      return () => {
        cancelled = true;
      };
    }
  }, [purchase, session_id]); // eslint-disable-line react-hooks/exhaustive-deps

  return banner;
}

/** Groups a flat video list by category — the "playlists" shelves below the main grid. */
function groupByCategory(videos: ApiVideo[]) {
  const groups = new Map<string, { name: string; videos: ApiVideo[] }>();
  for (const v of videos) {
    const key = v.category?.slug ?? "uncategorized";
    if (!groups.has(key)) groups.set(key, { name: v.category?.name ?? "More", videos: [] });
    groups.get(key)!.videos.push(v);
  }
  return Array.from(groups.values());
}

function PracticePage() {
  const { isAuthenticated, isLoading: authLoading, role } = useAuth();
  const banner = usePurchaseConfirmation();
  const canBrowse = isAuthenticated && role === "practitioner";

  const { data: continueData, isLoading: continueLoading } = useQuery({
    queryKey: ["continue-watching"],
    queryFn: () => catalogApi.continueWatching(),
    enabled: canBrowse,
  });

  const { data: allData, isLoading } = useQuery({
    queryKey: ["all-videos"],
    queryFn: () => catalogApi.allVideos(),
    enabled: canBrowse,
  });

  // /mat/practice/$videoId is a child route of this one, so it only ever
  // renders inside our <Outlet />. When that child is active, show it
  // instead of the browse/library UI below.
  const matches = useMatches();
  const isDetailRoute = matches.some((m) => m.routeId === "/mat/practice/$videoId");
  if (isDetailRoute) {
    return <Outlet />;
  }

  const continueItems = (continueData?.data ?? []).map(apiVideoToVideoItem);
  const allItems = allData?.data ?? [];
  const playlists = groupByCategory(allItems);

  return (
    <div className="pb-32">
      {banner && (
        <div
          className={`border-b hairline px-8 py-4 text-center text-sm ${
            banner.kind === "success"
              ? "bg-brand/10 text-ink"
              : banner.kind === "cancelled"
                ? "bg-muted text-charcoal"
                : "bg-destructive/10 text-destructive"
          }`}
        >
          {banner.text}
        </div>
      )}

      {!authLoading && !isAuthenticated && (
        <section className="container-page py-24 text-center">
          <p className="font-display text-3xl text-ink">Sign in to see your practice library.</p>
          <Link
            to="/signin"
            className="mt-8 inline-flex h-12 items-center bg-ink px-10 text-xs uppercase tracking-[0.22em] text-soft-white hover:bg-charcoal"
          >
            Sign in
          </Link>
        </section>
      )}

      {isAuthenticated && !canBrowse && (
        <section className="container-page py-24 text-center">
          <p className="font-display text-3xl text-ink">The practice library is for mat owners.</p>
          <p className="mt-4 text-sm text-warm-gray">
            Buy your Navamata mat to unlock the full library.
          </p>
          <Link
            to="/mat/buy"
            className="mt-8 inline-flex h-12 items-center bg-ink px-10 text-xs uppercase tracking-[0.22em] text-soft-white hover:bg-charcoal"
          >
            Acquire the mat
          </Link>
        </section>
      )}

      {(authLoading || canBrowse) && (
        <>
          {/* Continue practice — header shows immediately on page load;
              the row underneath is a skeleton while auth or watch history
              is still loading, then either the real items or nothing. */}
          {(authLoading || continueLoading || continueItems.length > 0) && (
            <section className="container-page pt-16">
              <SectionHeader
                eyebrow="Continue practice"
                title="Return to where you paused."
                className="mb-10"
              />
              {authLoading || continueLoading ? (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="aspect-[16/10] animate-pulse bg-muted" />
                  ))}
                </div>
              ) : (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {continueItems.map((v) => (
                    <VideoCard key={v.id} video={v} />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* All practices — every published video, across every category,
              each showing its real lock state for this account. Header
              always shows immediately; only the grid underneath waits on
              auth + the query. */}
          <section className="container-page py-16">
            <SectionHeader eyebrow="All practices" title="Browse everything." className="mb-10" />
            {authLoading || isLoading ? (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-[16/10] animate-pulse bg-muted" />
                ))}
              </div>
            ) : allItems.length === 0 ? (
              <div className="border hairline px-10 py-32 text-center">
                <p className="font-display text-2xl">Nothing here yet.</p>
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {allItems.map((v) => (
                  <VideoCard key={v.uuid} video={apiVideoToVideoItem(v)} />
                ))}
              </div>
            )}
          </section>

          {/* Playlists — the same catalog, grouped by discipline. */}
          {playlists.length > 0 && (
            <section className="container-page border-t hairline py-16">
              <SectionHeader eyebrow="Playlists" title="By discipline." className="mb-10" />
              <div className="space-y-14">
                {playlists.map((group) => (
                  <div key={group.name}>
                    <h3 className="mb-5 font-display text-xl text-ink">{group.name}</h3>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                      {group.videos.map((v) => (
                        <VideoCard key={v.uuid} video={apiVideoToVideoItem(v)} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
