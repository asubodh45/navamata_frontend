import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { BuyStepper } from "@/components/common/BuyStepper";
import { Field, TextAreaField } from "@/components/auth/Field";
import { matApi, ApiError } from "@/lib/api";

export const Route = createFileRoute("/mat/buy/delivery-address")({
  component: DeliveryAddress,
});

// Calling codes for the phone field — not an exhaustive ISO list, but
// covers the common markets. USA is first/default per the request.
const COUNTRY_CODES = [
  { code: "+1", label: "USA (+1)" },
  { code: "+1", label: "Canada (+1)" },
  { code: "+44", label: "United Kingdom (+44)" },
  { code: "+61", label: "Australia (+61)" },
  { code: "+64", label: "New Zealand (+64)" },
  { code: "+353", label: "Ireland (+353)" },
  { code: "+33", label: "France (+33)" },
  { code: "+49", label: "Germany (+49)" },
  { code: "+34", label: "Spain (+34)" },
  { code: "+39", label: "Italy (+39)" },
  { code: "+31", label: "Netherlands (+31)" },
  { code: "+41", label: "Switzerland (+41)" },
  { code: "+46", label: "Sweden (+46)" },
  { code: "+47", label: "Norway (+47)" },
  { code: "+45", label: "Denmark (+45)" },
  { code: "+351", label: "Portugal (+351)" },
  { code: "+971", label: "UAE (+971)" },
  { code: "+966", label: "Saudi Arabia (+966)" },
  { code: "+91", label: "India (+91)" },
  { code: "+65", label: "Singapore (+65)" },
  { code: "+60", label: "Malaysia (+60)" },
  { code: "+81", label: "Japan (+81)" },
  { code: "+82", label: "South Korea (+82)" },
  { code: "+86", label: "China (+86)" },
  { code: "+852", label: "Hong Kong (+852)" },
  { code: "+63", label: "Philippines (+63)" },
  { code: "+27", label: "South Africa (+27)" },
  { code: "+234", label: "Nigeria (+234)" },
  { code: "+254", label: "Kenya (+254)" },
  { code: "+55", label: "Brazil (+55)" },
  { code: "+52", label: "Mexico (+52)" },
  { code: "+977", label: "Nepal (+977)" },
  { code: "+880", label: "Bangladesh (+880)" },
  { code: "+92", label: "Pakistan (+92)" },
];

function DeliveryAddress() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [countryCode, setCountryCode] = useState("+1");
  const [whatsapp, setWhatsapp] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const required = {
      name: "name",
      line1: "address1",
      city: "city",
      country: "country",
      postal: "postal",
      phone: "phone",
    };
    const e2: Record<string, string> = {};
    for (const [, field] of Object.entries(required)) {
      if (!String(data.get(field) ?? "").trim()) e2[field] = "Required";
    }
    setErrors(e2);
    if (Object.keys(e2).length > 0) return;

    setSubmitting(true);
    try {
      const res = await matApi.saveAddress({
        name: String(data.get("name")),
        line1: String(data.get("address1")),
        line2: String(data.get("address2") || "") || null,
        city: String(data.get("city")),
        country: String(data.get("country")),
        postal: String(data.get("postal")),
        phone: `${countryCode} ${String(data.get("phone")).trim()}`,
        whatsapp,
        notes: String(data.get("notes") || "").trim() || null,
      });
      // next_step is "payment" for a fresh draft, or "measurements" if this
      // user already has a paid order waiting on measurements.
      navigate({
        to: res.next_step === "measurements" ? "/mat/buy/mat-measurements" : "/mat/buy/mat-payment",
      });
    } catch (err) {
      setErrors({ name: err instanceof ApiError ? err.message : "Couldn't save your address." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="pb-32">
      <BuyStepper current={1} />
      <section className="container-page grid gap-16 py-16 lg:grid-cols-[1fr_1.2fr] lg:py-20">
        <div>
          <div className="eyebrow mb-3">Step 02 · Delivery</div>
          <h1 className="font-display text-5xl leading-[1.05]">
            Where shall it <em className="not-italic text-brand">arrive?</em>
          </h1>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-warm-gray">
            Each mat is hand-finished and delivered within ten working days, signed for at the door.
            Carbon-neutral shipping is included.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-8" noValidate>
          <Field label="Full name" name="name" placeholder="Anaïs Laurent" error={errors.name} />
          <Field
            label="Street address"
            name="address1"
            placeholder="14 Rue de Sévigné"
            error={errors.address1}
          />
          <Field label="Apartment, suite (optional)" name="address2" />
          <div className="grid gap-8 md:grid-cols-2">
            <Field label="City" name="city" placeholder="Paris" error={errors.city} />
            <Field label="Postal code" name="postal" placeholder="75004" error={errors.postal} />
          </div>
          <Field label="Country" name="country" placeholder="France" error={errors.country} />

          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-warm-gray">
              Phone number
            </label>
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="h-11 shrink-0 border hairline bg-soft-white px-2 text-sm"
                aria-label="Country calling code"
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.label} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
              <input
                name="phone"
                type="tel"
                placeholder="555 123 4567"
                className="h-11 flex-1 border hairline bg-soft-white px-3 text-sm"
              />
            </div>
            {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
          </div>

          <label className="flex items-center gap-2 text-sm text-charcoal">
            <input
              type="checkbox"
              checked={whatsapp}
              onChange={(e) => setWhatsapp(e.target.checked)}
            />
            WhatsApp available on this number
          </label>

          <TextAreaField label="Delivery notes (optional)" name="notes" />

          <div className="flex items-center justify-between border-t hairline pt-8">
            <Link
              to="/mat/buy"
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
        </form>
      </section>
    </div>
  );
}
