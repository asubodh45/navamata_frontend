import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Lock } from "lucide-react";
import { BuyStepper } from "@/components/common/BuyStepper";
import { mats, MAT_PRICE_USD } from "@/data/mats";
import { matApi, ApiError } from "@/lib/api";

export const Route = createFileRoute("/mat/buy/mat-payment")({
  component: Payment,
});

/**
 * Payment is a Stripe-hosted Checkout Session (backend_new's createMatCheckout
 * builds this server-side), not a card form we collect ourselves — so this
 * step just confirms the order and redirects to Stripe.
 */
function Payment() {
  const mat = mats[0];
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setError(null);
    setSubmitting(true);
    try {
      const res = await matApi.createCheckout();
      window.location.href = res.checkout_url;
    } catch (err) {
      if (err instanceof ApiError && err.status === 422) {
        setError("Please save your delivery address first.");
      } else if (err instanceof ApiError && err.status === 409) {
        setError("You already have a paid order waiting for measurements.");
      } else {
        setError(
          err instanceof ApiError ? err.message : "Couldn't start checkout. Please try again.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="pb-32">
      <BuyStepper current={2} />
      <section className="container-page grid gap-16 py-16 lg:grid-cols-[1.2fr_1fr] lg:py-20">
        <div className="space-y-10">
          <div>
            <div className="eyebrow mb-3">Step 03 · Payment</div>
            <h1 className="font-display text-5xl leading-[1.05]">
              A single, <em className="not-italic text-brand">secure transaction.</em>
            </h1>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-warm-gray">
              You'll be taken to Stripe's secure checkout to complete payment. Your account becomes
              a Practitioner the moment payment succeeds — measurements are next.
            </p>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex items-center justify-between border-t hairline pt-8">
            <Link
              to="/mat/buy/delivery-address"
              className="text-xs uppercase tracking-[0.22em] text-charcoal hover:text-ink"
            >
              ← Back
            </Link>
            <button
              onClick={handleCheckout}
              disabled={submitting}
              className="inline-flex h-12 items-center gap-3 bg-ink px-7 text-xs uppercase tracking-[0.22em] text-soft-white hover:bg-charcoal disabled:opacity-60"
            >
              {submitting ? "Redirecting…" : "Proceed to payment"}{" "}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <aside className="self-start border hairline bg-soft-white p-8 lg:sticky lg:top-28">
          <div className="eyebrow mb-5">Order</div>
          <div className="flex gap-5">
            <div className="aspect-square w-24 shrink-0 overflow-hidden bg-muted">
              <img src={mat.image} alt={mat.name} className="h-full w-full object-cover" />
            </div>
            <div>
              <div className="font-display text-lg">{mat.name}</div>
              <p className="mt-1 text-xs text-warm-gray">Measurements collected after payment</p>
            </div>
          </div>
          <dl className="mt-8 space-y-3 border-t hairline pt-6 text-sm">
            <Row label="Subtotal" value={`$${MAT_PRICE_USD}`} />
            <Row label="Shipping" value="Complimentary" />
            <Row label="Taxes" value="Included" />
          </dl>
          <dl className="mt-6 flex items-end justify-between border-t hairline pt-6">
            <dt className="eyebrow">Total</dt>
            <dd className="font-display text-3xl">${MAT_PRICE_USD}</dd>
          </dl>
          <p className="mt-8 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-warm-gray">
            <Lock className="h-3 w-3" /> Encrypted · Stripe checkout
          </p>
        </aside>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-warm-gray">{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}
