import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { catalogApi, uploadVideoRaw, ApiError } from "@/lib/api";

export const Route = createFileRoute("/admin/videos/new")({
  component: NewVideo,
});

function NewVideo() {
  const navigate = useNavigate();
  const { data: categories } = useQuery({
    queryKey: ["video-categories"],
    queryFn: () => catalogApi.categories(),
  });

  const [accessLevel, setAccessLevel] = useState<"watch" | "free_premium" | "paid_premium">(
    "watch",
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const form = new FormData(e.currentTarget);
    const videoFile = form.get("video") as File | null;
    if (!videoFile || videoFile.size === 0) {
      setFieldErrors({ video: "Choose a video file." });
      return;
    }

    setSubmitting(true);
    try {
      await uploadVideoRaw(form);
      navigate({ to: "/admin/videos" });
    } catch (err) {
      if (
        err instanceof ApiError &&
        err.status === 422 &&
        err.body &&
        typeof err.body === "object"
      ) {
        const errors = (err.body as { errors?: Record<string, string[]> }).errors ?? {};
        setFieldErrors(Object.fromEntries(Object.entries(errors).map(([f, m]) => [f, m[0]])));
      } else {
        setError(err instanceof ApiError ? err.message : "Upload failed.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <AdminPageHeader title="Upload video" />
      <div className="p-8">
        <form onSubmit={handleSubmit} className="max-w-xl space-y-6" encType="multipart/form-data">
          <FormField label="Title" name="title" required error={fieldErrors.title} />
          <FormTextArea label="Description" name="description" error={fieldErrors.description} />

          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-warm-gray">
              Category
            </label>
            <select
              name="category_id"
              required
              className="h-10 w-full border hairline bg-soft-white px-3 text-sm"
            >
              <option value="">Select a category…</option>
              {categories?.data.map((c) => (
                <option key={c.slug} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {fieldErrors.category_id && (
              <p className="mt-1 text-xs text-destructive">{fieldErrors.category_id}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-warm-gray">
              Access level
            </label>
            <select
              name="access_level"
              value={accessLevel}
              onChange={(e) => setAccessLevel(e.target.value as typeof accessLevel)}
              className="h-10 w-full border hairline bg-soft-white px-3 text-sm"
            >
              <option value="watch">Watch (public)</option>
              <option value="free_premium">Free Premium (Practitioners)</option>
              <option value="paid_premium">Paid Premium (buy separately)</option>
            </select>
          </div>

          {accessLevel === "paid_premium" && (
            <FormField
              label="Price (USD)"
              name="price_dollars"
              type="number"
              required
              error={fieldErrors.price_cents}
            />
          )}

          <FormField label="Duration (seconds, optional)" name="duration_seconds" type="number" />

          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-warm-gray">
              Video file
            </label>
            <input
              name="video"
              type="file"
              accept="video/mp4,video/quicktime,video/webm"
              required
              className="text-sm"
            />
            {fieldErrors.video && (
              <p className="mt-1 text-xs text-destructive">{fieldErrors.video}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-warm-gray">
              Thumbnail (optional)
            </label>
            <input name="thumbnail" type="file" accept="image/*" className="text-sm" />
          </div>

          <label className="flex items-center gap-2 text-sm text-charcoal">
            <input type="checkbox" name="is_published" value="1" />
            Publish immediately
          </label>

          {/* price_cents is derived from price_dollars client-side before submit */}
          <PriceCentsBridge accessLevel={accessLevel} />

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex items-center gap-4 pt-4">
            <Link
              to="/admin/videos"
              className="text-xs uppercase tracking-[0.18em] text-charcoal hover:text-ink"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-11 items-center bg-ink px-6 text-xs uppercase tracking-[0.18em] text-soft-white hover:bg-charcoal disabled:opacity-60"
            >
              {submitting ? "Uploading…" : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * The backend wants `price_cents`, the form collects dollars for a human to
 * type — this injects a hidden `price_cents` field derived from
 * `price_dollars` right before submit, since FormData is read at submit time.
 */
function PriceCentsBridge({ accessLevel }: { accessLevel: string }) {
  if (accessLevel !== "paid_premium") return null;
  return (
    <input
      type="hidden"
      name="price_cents"
      ref={(el) => {
        if (!el) return;
        const form = el.closest("form");
        const dollarsInput = form?.querySelector<HTMLInputElement>('input[name="price_dollars"]');
        const sync = () => {
          const dollars = Number(dollarsInput?.value || 0);
          el.value = String(Math.round(dollars * 100));
        };
        dollarsInput?.addEventListener("input", sync);
        sync();
      }}
    />
  );
}

function FormField({
  label,
  name,
  type = "text",
  required,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-warm-gray">
        {label}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        className="h-10 w-full border hairline bg-soft-white px-3 text-sm"
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function FormTextArea({ label, name, error }: { label: string; name: string; error?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-warm-gray">
        {label}
      </label>
      <textarea
        name={name}
        rows={3}
        className="w-full border hairline bg-soft-white px-3 py-2 text-sm"
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
