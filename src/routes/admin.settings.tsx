import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { adminApi, ApiError } from "@/lib/api";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

const THEME_COLOR_KEYS = [
  "theme_color_forest",
  "theme_color_forest_mid",
  "theme_color_forest_lt",
  "theme_color_saffron",
  "theme_color_saffron_lt",
  "theme_color_gold",
  "theme_color_gold_lt",
  "theme_color_cream",
  "theme_color_parchment",
  "theme_color_sand",
  "theme_color_bark",
  "theme_color_charcoal",
  "theme_color_ink",
];

function AdminSettings() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: () => adminApi.settings(),
  });

  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    if (data) setValues(data);
  }, [data]);

  function set(key: string, v: string) {
    setValues((prev) => ({ ...prev, [key]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setSaving(true);
    try {
      const res = await adminApi.updateSettings(values);
      setValues(res.settings);
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      setSavedAt(Date.now());
    } catch (err) {
      if (
        err instanceof ApiError &&
        err.status === 422 &&
        err.body &&
        typeof err.body === "object"
      ) {
        setErrors((err.body as { errors?: Record<string, string> }).errors ?? {});
      }
    } finally {
      setSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div>
        <AdminPageHeader title="Settings" />
        <div className="p-8 text-sm text-warm-gray">Loading…</div>
      </div>
    );
  }

  const priceDollars = values.mat_price_cents ? Number(values.mat_price_cents) / 100 : "";

  return (
    <div>
      <AdminPageHeader title="Settings" />
      <div className="p-8">
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-10">
          <section className="space-y-5">
            <h2 className="eyebrow">Commerce</h2>
            <Field
              label="Mat price (USD)"
              value={priceDollars === "" ? "" : String(priceDollars)}
              onChange={(v) => set("mat_price_cents", String(Math.round(Number(v || 0) * 100)))}
              type="number"
              error={errors.mat_price_cents}
            />
            <Field
              label="Currency (3-letter code)"
              value={values.currency ?? ""}
              onChange={(v) => set("currency", v)}
              error={errors.currency}
            />
          </section>

          <section className="space-y-5">
            <h2 className="eyebrow">Platform</h2>
            <Field
              label="Platform name"
              value={values.platform_name ?? ""}
              onChange={(v) => set("platform_name", v)}
              error={errors.platform_name}
            />
            <Field
              label="Support email"
              value={values.support_email ?? ""}
              onChange={(v) => set("support_email", v)}
              type="email"
              error={errors.support_email}
            />
            <Field
              label="Logo URL"
              value={values.logo_url ?? ""}
              onChange={(v) => set("logo_url", v)}
              error={errors.logo_url}
            />
            <label className="flex items-center gap-2 text-sm text-charcoal">
              <input
                type="checkbox"
                checked={values.maintenance_mode === "1" || values.maintenance_mode === "true"}
                onChange={(e) => set("maintenance_mode", e.target.checked ? "1" : "0")}
              />
              Maintenance mode
            </label>
          </section>

          <section className="space-y-5">
            <h2 className="eyebrow">Theme colours</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {THEME_COLOR_KEYS.map((key) => (
                <div key={key}>
                  <label className="mb-1 block text-[10px] uppercase tracking-[0.1em] text-warm-gray">
                    {key.replace("theme_color_", "").replace("_", " ")}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={/^#[0-9a-fA-F]{6}$/.test(values[key] ?? "") ? values[key] : "#000000"}
                      onChange={(e) => set(key, e.target.value)}
                      className="h-8 w-8 shrink-0 border hairline"
                    />
                    <input
                      value={values[key] ?? ""}
                      onChange={(e) => set(key, e.target.value)}
                      className="h-8 w-full border hairline bg-soft-white px-2 text-xs"
                      placeholder="#RRGGBB"
                    />
                  </div>
                  {errors[key] && (
                    <p className="mt-1 text-[10px] text-destructive">{errors[key]}</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          <div className="flex items-center gap-4 border-t hairline pt-6">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-11 items-center bg-ink px-6 text-xs uppercase tracking-[0.18em] text-soft-white hover:bg-charcoal disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save settings"}
            </button>
            {savedAt && <span className="text-xs text-warm-gray">Saved.</span>}
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-warm-gray">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full border hairline bg-soft-white px-3 text-sm"
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
