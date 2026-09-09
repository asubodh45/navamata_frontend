import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Play } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { adminApi, catalogApi, ApiError, type AdminVideo } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/videos/")({
  component: AdminVideos,
});

const ACCESS_LEVELS = ["watch", "free_premium", "paid_premium"] as const;

function AdminVideos() {
  const queryClient = useQueryClient();
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [busyUuid, setBusyUuid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [previewVideo, setPreviewVideo] = useState<AdminVideo | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const { data: categories } = useQuery({
    queryKey: ["video-categories"],
    queryFn: () => catalogApi.categories(),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["admin-videos", category, search],
    queryFn: () =>
      adminApi.videos({
        category: category === "all" ? undefined : category,
        search: search || undefined,
      }),
  });

  async function patch(video: AdminVideo, changes: Partial<AdminVideo>) {
    setError(null);
    setBusyUuid(video.uuid);
    try {
      await adminApi.updateVideo(video.uuid, changes);
      queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't update this video.");
    } finally {
      setBusyUuid(null);
    }
  }

  async function handleDelete(video: AdminVideo) {
    if (!window.confirm(`Delete "${video.title}"? This can't be undone.`)) return;
    setError(null);
    setBusyUuid(video.uuid);
    try {
      await adminApi.deleteVideo(video.uuid);
      queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't delete this video.");
    } finally {
      setBusyUuid(null);
    }
  }

  async function handlePreview(video: AdminVideo) {
    setPreviewVideo(video);
    setPreviewUrl(null);
    setPreviewError(null);
    setPreviewLoading(true);
    try {
      const res = await adminApi.watchVideo(video.uuid);
      setPreviewUrl(res.stream_url);
    } catch (err) {
      setPreviewError(err instanceof ApiError ? err.message : "Couldn't load this video.");
    } finally {
      setPreviewLoading(false);
    }
  }

  function closePreview(open: boolean) {
    if (open) return;
    setPreviewVideo(null);
    setPreviewUrl(null);
    setPreviewError(null);
  }

  const videos = data?.data ?? [];

  return (
    <div>
      <AdminPageHeader
        title="Videos"
        action={
          <Link
            to="/admin/videos/new"
            className="inline-flex h-10 items-center bg-ink px-5 text-xs uppercase tracking-[0.18em] text-soft-white hover:bg-charcoal"
          >
            Upload video
          </Link>
        }
      />
      <div className="p-8">
        <div className="mb-6 flex flex-wrap gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title…"
            className="h-10 w-64 border hairline bg-soft-white px-3 text-sm"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-10 border hairline bg-soft-white px-3 text-sm"
          >
            <option value="all">All categories</option>
            {categories?.data.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

        {isLoading ? (
          <p className="text-sm text-warm-gray">Loading…</p>
        ) : (
          <div className="overflow-x-auto border hairline bg-soft-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b hairline text-left text-xs uppercase tracking-[0.12em] text-warm-gray">
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Access level</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Published</th>
                  <th className="px-4 py-3">Sold</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {videos.map((v) => (
                  <tr key={v.uuid} className="border-b hairline last:border-0">
                    <td className="px-4 py-3 text-ink">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handlePreview(v)}
                          aria-label={`Preview ${v.title}`}
                          className="group relative h-12 w-20 shrink-0 overflow-hidden bg-muted"
                        >
                          {v.thumbnail_url && (
                            <img
                              src={v.thumbnail_url}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          )}
                          <span className="absolute inset-0 flex items-center justify-center bg-ink/25 text-soft-white transition-colors group-hover:bg-ink/45">
                            <Play className="h-4 w-4" fill="currentColor" />
                          </span>
                        </button>
                        <span>{v.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-warm-gray">{v.category?.name ?? "—"}</td>
                    <td className="px-4 py-3">
                      <select
                        value={v.access_level}
                        disabled={busyUuid === v.uuid}
                        onChange={(e) =>
                          patch(v, { access_level: e.target.value as AdminVideo["access_level"] })
                        }
                        className="h-8 border hairline bg-background px-2 text-xs"
                      >
                        {ACCESS_LEVELS.map((l) => (
                          <option key={l} value={l}>
                            {l.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      {v.access_level === "paid_premium" ? (
                        <input
                          type="number"
                          defaultValue={v.price_cents ? v.price_cents / 100 : ""}
                          onBlur={(e) => {
                            const dollars = Number(e.target.value);
                            if (dollars > 0) patch(v, { price_cents: Math.round(dollars * 100) });
                          }}
                          className="h-8 w-20 border hairline bg-background px-2 text-xs"
                          placeholder="$"
                        />
                      ) : (
                        <span className="text-warm-gray">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => patch(v, { is_published: !v.is_published })}
                        disabled={busyUuid === v.uuid}
                        className={v.is_published ? "text-ink" : "text-warm-gray"}
                      >
                        {v.is_published ? "Yes" : "No"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-warm-gray">{v.purchases_count ?? 0}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(v)}
                        disabled={busyUuid === v.uuid}
                        className="text-xs uppercase tracking-[0.12em] text-destructive hover:underline disabled:opacity-40"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {videos.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-warm-gray">
                      No videos match.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={previewVideo !== null} onOpenChange={closePreview}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{previewVideo?.title}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video w-full overflow-hidden bg-charcoal">
            {previewLoading ? (
              <div className="flex h-full items-center justify-center text-sm text-warm-gray">
                Loading…
              </div>
            ) : previewError ? (
              <div className="flex h-full items-center justify-center px-6 text-center text-sm text-destructive">
                {previewError}
              </div>
            ) : previewUrl ? (
              <video src={previewUrl} controls autoPlay className="h-full w-full" />
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
