import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { ArrowRight, Check } from "lucide-react";
import { BuyStepper } from "@/components/common/BuyStepper";
import { mats } from "@/data/mats";
import { matApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/mat/buy/order-confirmation")({
  component: OrderConfirmation,
  validateSearch: (search: Record<string, unknown>): { order?: string } =>
    typeof search.order === "string" ? { order: search.order } : {},
});

function OrderConfirmation() {
  const { order: orderUuid } = useSearch({ from: "/mat/buy/order-confirmation" });
  const { refresh } = useAuth();
  const mat = mats[0];

  // Safety net: normally /mat/checkout/success already refreshed the user's
  // tier before redirecting here, but re-fetch anyway in case this page is
  // reached directly (bookmark, page refresh) so "explorer" doesn't linger
  // in the header after a completed purchase.
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data: order, isLoading } = useQuery({
    queryKey: ["mat-order", orderUuid],
    queryFn: () => matApi.getOrder(orderUuid!),
    enabled: !!orderUuid,
  });

  const address = order?.shipping_address;
  const total = order?.amount_paid;

  return (
    <div className="pb-32">
      <BuyStepper current={4} />
      <section className="border-b hairline">
        <div className="container-page py-24 text-center md:py-32">
          <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-full border border-ink">
            <Check className="h-5 w-5 text-ink" />
          </div>
          <div className="eyebrow mb-5">Order placed</div>
          <h1 className="mx-auto max-w-2xl font-display text-5xl leading-[1.05] md:text-7xl">
            Your mat is <em className="not-italic text-brand">on its way.</em>
          </h1>
          <p className="mx-auto mt-7 max-w-md text-base leading-relaxed text-warm-gray">
            We've received your order. A confirmation has been sent to your inbox. Each mat is
            hand-finished and dispatched within ten working days.
          </p>
          {order && (
            <div className="mt-8 inline-flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-charcoal">
              Reference{" "}
              <span className="font-display text-base normal-case tracking-normal text-ink">
                {order.uuid.slice(0, 8).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </section>

      <section className="container-page grid gap-12 py-20 lg:grid-cols-[1fr_1.1fr]">
        <div className="border hairline p-8">
          <div className="eyebrow mb-6">Summary</div>
          <div className="flex gap-5">
            <div className="aspect-square w-28 shrink-0 overflow-hidden bg-muted">
              <img src={mat.image} alt={mat.name} className="h-full w-full object-cover" />
            </div>
            <div>
              <div className="font-display text-xl">{mat.name}</div>
              {isLoading ? (
                <p className="mt-1 text-sm text-warm-gray">Loading order details…</p>
              ) : address ? (
                <p className="mt-2 text-sm text-warm-gray">
                  Delivered to {address.line1}, {address.city}, {address.country}
                </p>
              ) : null}
            </div>
          </div>
          <dl className="mt-8 space-y-3 border-t hairline pt-6 text-sm">
            <Row label="Status" value={order?.status ?? "—"} />
            <Row label="Total" value={total ? `$${total}` : "—"} bold />
          </dl>
        </div>

        <div>
          <div className="eyebrow mb-5">What happens next</div>
          <ol className="space-y-7">
            <Step
              n="01"
              title="Within an hour"
              body="A confirmation email arrives, with order details."
            />
            <Step
              n="02"
              title="Within ten days"
              body="Your mat is hand-finished, inspected, and dispatched carbon-neutral."
            />
            <Step
              n="03"
              title="On arrival"
              body="Unroll it slowly. Let it settle. Begin with our welcome practice — twenty quiet minutes."
            />
          </ol>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              to="/mat/practice"
              className="inline-flex h-12 items-center gap-3 bg-ink px-7 text-xs uppercase tracking-[0.22em] text-soft-white hover:bg-charcoal"
            >
              Continue to practice <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className="text-warm-gray">{label}</dt>
      <dd className={bold ? "font-display text-xl capitalize text-ink" : "capitalize text-ink"}>
        {value}
      </dd>
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <li className="flex gap-5">
      <span className="font-display text-2xl text-warm-gray">{n}</span>
      <div>
        <div className="font-display text-xl text-ink">{title}</div>
        <p className="mt-1 text-sm leading-relaxed text-warm-gray">{body}</p>
      </div>
    </li>
  );
}
