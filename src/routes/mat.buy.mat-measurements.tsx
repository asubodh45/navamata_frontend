import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Play } from "lucide-react";
import { BuyStepper } from "@/components/common/BuyStepper";
import { Field } from "@/components/auth/Field";
import { matApi, ApiError, type MatMeasurementsInput } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mat/buy/mat-measurements")({
  component: Measurements,
  validateSearch: (search: Record<string, unknown>): { order?: string } =>
    typeof search.order === "string" ? { order: search.order } : {},
});

// M1–M12 per the concept PDF. Each has a short video tutorial showing how to
// take it — the actual tutorial clips aren't wired up yet (placeholder video
// panel below), but the naming/hints follow the same 12-point spec used in
// the reference build. fm1–fm9 required, fm10–fm12 optional (matches the
// backend's validation exactly).
const fields: {
  key: keyof MatMeasurementsInput;
  label: string;
  name: string;
  hint: string;
  required: boolean;
}[] = [
  {
    key: "fm1",
    label: "M1",
    name: "Head to Heel",
    hint: "Full standing height — stand against a wall, measure floor to crown.",
    required: true,
  },
  {
    key: "fm2",
    label: "M2",
    name: "Shoulder Width",
    hint: "Measure across both shoulders at the widest point.",
    required: true,
  },
  {
    key: "fm3",
    label: "M3",
    name: "Chest Width",
    hint: "Across the chest at its widest point, arms relaxed.",
    required: true,
  },
  {
    key: "fm4",
    label: "M4",
    name: "Torso Length",
    hint: "From base of neck (C7 vertebra) down to the hip bone.",
    required: true,
  },
  {
    key: "fm5",
    label: "M5",
    name: "Waist to Floor",
    hint: "Standing upright, measure from your natural waist to the floor.",
    required: true,
  },
  {
    key: "fm6",
    label: "M6",
    name: "Arm Span",
    hint: "Arms stretched wide — fingertip to fingertip.",
    required: true,
  },
  {
    key: "fm7",
    label: "M7",
    name: "Hip Width",
    hint: "Across the hips at the widest point.",
    required: true,
  },
  {
    key: "fm8",
    label: "M8",
    name: "Knee Width",
    hint: "Kneel side-by-side. Measure across both knees.",
    required: true,
  },
  {
    key: "fm9",
    label: "M9",
    name: "Knee to Hip",
    hint: "Seated: from the knee cap to the hip bone.",
    required: true,
  },
  {
    key: "fm10",
    label: "M10",
    name: "Foot Length",
    hint: "Place foot on paper, trace, and measure heel to longest toe.",
    required: false,
  },
  {
    key: "fm11",
    label: "M11",
    name: "Elbow Span",
    hint: "Arms bent at 90°. Elbow to elbow across the body.",
    required: false,
  },
  {
    key: "fm12",
    label: "M12",
    name: "Wrist to Fingertip",
    hint: "Hand relaxed and flat. Wrist crease to tip of middle finger.",
    required: false,
  },
];

// Placeholder video-panel backgrounds until real tutorial clips are wired up
// — one distinct dark tone per measurement so the active step is easy to
// track visually even before real footage exists.
const VIDEO_COLORS = [
  "#1a0505",
  "#0a0a18",
  "#081208",
  "#18100a",
  "#12081a",
  "#081818",
  "#1a0810",
  "#0a1408",
  "#100818",
  "#180a08",
  "#0a1810",
  "#080a18",
];

function Measurements() {
  const navigate = useNavigate();
  const { order } = useSearch({ from: "/mat/buy/mat-measurements" });
  const [values, setValues] = useState<Record<string, string>>({});
  const [activeField, setActiveField] = useState(0);
  const [motto, setMotto] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function setValue(key: string, v: string) {
    setValues((prev) => ({ ...prev, [key]: v }));
  }

  const filledCount = fields.filter((f) => values[f.key] && values[f.key] !== "").length;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    const nextErrors: Record<string, string> = {};
    for (const f of fields) {
      const raw = values[f.key];
      if (!raw && f.required) {
        nextErrors[f.key] = "Required";
        continue;
      }
      if (raw) {
        const n = Number(raw);
        if (Number.isNaN(n) || n < (f.required ? 1 : 0) || n > 300) {
          nextErrors[f.key] = "Enter a value between 1 and 300 cm";
        }
      }
    }
    if (motto.length > 18) nextErrors.motto = "18 characters max";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload: MatMeasurementsInput & { pending_order_uuid?: string } = {
      fm1: Number(values.fm1),
      fm2: Number(values.fm2),
      fm3: Number(values.fm3),
      fm4: Number(values.fm4),
      fm5: Number(values.fm5),
      fm6: Number(values.fm6),
      fm7: Number(values.fm7),
      fm8: Number(values.fm8),
      fm9: Number(values.fm9),
      fm10: values.fm10 ? Number(values.fm10) : null,
      fm11: values.fm11 ? Number(values.fm11) : null,
      fm12: values.fm12 ? Number(values.fm12) : null,
      // The alignment-line choice was removed from the UI (not needed) —
      // the backend still requires a value, so a fixed default is sent
      // silently rather than asking the person to pick one.
      fline: "solid",
      motto: motto || undefined,
      pending_order_uuid: order,
    };

    setSubmitting(true);
    try {
      const res = await matApi.submitMeasurements(payload);
      navigate({ to: "/mat/buy/order-confirmation", search: { order: res.uuid } });
    } catch (err) {
      if (
        err instanceof ApiError &&
        err.status === 422 &&
        err.body &&
        typeof err.body === "object"
      ) {
        const reason = (err.body as { reason?: string }).reason;
        if (reason === "address_required") {
          navigate({ to: "/mat/buy/delivery-address" });
          return;
        }
      }
      setServerError(err instanceof ApiError ? err.message : "Couldn't save your measurements.");
    } finally {
      setSubmitting(false);
    }
  }

  const active = fields[activeField];

  return (
    <div className="pb-32">
      <BuyStepper current={3} />
      <section className="container-page py-16 lg:py-20">
        <div className="mb-12 max-w-2xl">
          <div className="eyebrow mb-3">Step 04 · Measurements</div>
          <h1 className="font-display text-5xl leading-[1.05]">
            Twelve points, <em className="not-italic text-brand">precisely yours.</em>
          </h1>
          <p className="mt-6 text-sm leading-relaxed text-warm-gray">
            Nine measurements are required; the last three refine the fit further. Follow the video
            tutorial alongside the form — click a field to jump to its video. All values in
            centimetres.
          </p>
        </div>

        <form onSubmit={onSubmit} noValidate className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          {/* LEFT — video tutorial panel */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            {/* Step tabs */}
            <div className="mb-4 flex flex-wrap gap-2">
              {fields.map((f, i) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setActiveField(i)}
                  aria-label={`Video for ${f.name}`}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border text-xs transition-colors",
                    activeField === i
                      ? "border-ink bg-ink text-soft-white"
                      : values[f.key]
                        ? "border-brand/40 bg-brand/10 text-brand"
                        : "border-hairline text-charcoal hover:border-charcoal",
                  )}
                >
                  {values[f.key] ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
                </button>
              ))}
            </div>

            {/* Video placeholder */}
            <div
              className="relative flex aspect-video items-center justify-center overflow-hidden border hairline"
              style={{ background: VIDEO_COLORS[activeField] }}
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-soft-white/90 text-ink">
                <Play className="h-5 w-5" fill="currentColor" />
              </span>
              <div className="absolute bottom-4 left-4 flex items-center gap-2.5">
                <span className="bg-brand px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-soft-white">
                  {active.label}
                </span>
                <span className="text-xs text-soft-white/70">{active.name}</span>
              </div>
            </div>

            {/* Video info */}
            <div className="mt-4 border hairline bg-soft-white p-5">
              <div className="mb-2.5 flex items-start justify-between gap-3">
                <h3 className="font-display text-lg text-ink">
                  {active.label} — {active.name}
                </h3>
                <span className="whitespace-nowrap text-xs text-warm-gray">
                  Step {activeField + 1} of {fields.length}
                </span>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-warm-gray">{active.hint}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveField((t) => Math.max(0, t - 1))}
                  disabled={activeField === 0}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 border hairline py-2 text-xs uppercase tracking-[0.12em] text-charcoal hover:border-ink hover:text-ink disabled:opacity-30"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Prev
                </button>
                <button
                  type="button"
                  onClick={() => setActiveField((t) => Math.min(fields.length - 1, t + 1))}
                  disabled={activeField === fields.length - 1}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 border hairline py-2 text-xs uppercase tracking-[0.12em] text-charcoal hover:border-ink hover:text-ink disabled:opacity-30"
                >
                  Next <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <p className="mt-4 text-xs text-warm-gray">
              {filledCount}/{fields.length} measurements filled
            </p>
          </div>
          {/* RIGHT — measurement inputs */}
          <div className="space-y-10">
            <div className="grid gap-8 sm:grid-cols-2">
              {fields.map((f, i) => (
                <Field
                  key={f.key}
                  label={`${f.label} — ${f.name}${f.required ? "" : " (optional)"}`}
                  name={f.key}
                  type="number"
                  inputMode="decimal"
                  min={f.required ? 1 : 0}
                  max={300}
                  value={values[f.key] ?? ""}
                  onChange={(e) => setValue(f.key, e.target.value)}
                  onFocus={() => setActiveField(i)}
                  error={errors[f.key]}
                  placeholder="cm"
                />
              ))}
            </div>

            <Field
              label="Personal motto (optional)"
              name="motto"
              value={motto}
              onChange={(e) => setMotto(e.target.value)}
              maxLength={18}
              hint={`${motto.length}/18 characters`}
              error={errors.motto}
              placeholder="A short line for your mat"
            />

            {serverError && <p className="text-sm text-destructive">{serverError}</p>}

            <div className="flex items-center justify-between border-t hairline pt-8">
              <Link
                to="/mat/buy/mat-payment"
                className="text-xs uppercase tracking-[0.22em] text-charcoal hover:text-ink"
              >
                ← Back
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-12 items-center gap-3 bg-ink px-7 text-xs uppercase tracking-[0.22em] text-soft-white hover:bg-charcoal disabled:opacity-60"
              >
                {submitting ? "Saving…" : "Continue"} <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
