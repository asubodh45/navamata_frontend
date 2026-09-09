import { createFileRoute, Link, useSearch } from "@tanstack/react-router";

export const Route = createFileRoute("/mat/order")({
  component: OrderCancelled,
  validateSearch: (search: Record<string, unknown>) => ({
    cancelled: search.cancelled === "1" || search.cancelled === 1,
  }),
});

/**
 * Stripe's cancel_url for mat checkout (StripeController::createMatCheckout)
 * points here. Nothing was charged — this just routes the person back in.
 */
function OrderCancelled() {
  const { cancelled } = useSearch({ from: "/mat/order" });

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="eyebrow mb-4">{cancelled ? "Checkout cancelled" : "Your order"}</div>
      <p className="font-display text-3xl text-ink">Nothing was charged.</p>
      <p className="mt-4 max-w-sm text-sm text-warm-gray">
        Your delivery address is saved — you can pick payment back up whenever you're ready.
      </p>
      <Link
        to="/mat/buy/mat-payment"
        className="mt-8 inline-flex h-12 items-center bg-ink px-8 text-xs uppercase tracking-[0.22em] text-soft-white hover:bg-charcoal"
      >
        Return to payment
      </Link>
    </div>
  );
}
