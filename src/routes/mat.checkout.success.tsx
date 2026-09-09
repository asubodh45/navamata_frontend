import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { matApi, ApiError } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/mat/checkout/success")({
  component: CheckoutSuccess,
  validateSearch: (search: Record<string, unknown>): { session_id?: string } =>
    typeof search.session_id === "string" ? { session_id: search.session_id } : {},
});

/**
 * Stripe redirects here after a successful mat payment
 * (StripeController::createMatCheckout's success_url). The webhook that
 * actually records the order can lag slightly behind this redirect, so we
 * poll confirmCheckout a few times before giving up.
 */
function CheckoutSuccess() {
  const { session_id } = useSearch({ from: "/mat/checkout/success" });
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [status, setStatus] = useState<"checking" | "error">("checking");
  const [message, setMessage] = useState<string | null>(null);
  const attempts = useRef(0);

  useEffect(() => {
    if (!session_id) {
      setStatus("error");
      setMessage("Missing checkout session.");
      return;
    }

    let cancelled = false;

    async function poll() {
      try {
        const res = await matApi.confirmCheckout(session_id!);
        if (cancelled) return;

        if (!res.paid) {
          setStatus("error");
          setMessage("Payment was not completed.");
          return;
        }

        if (!res.order_recorded && attempts.current < 6) {
          attempts.current += 1;
          setTimeout(poll, 1500);
          return;
        }

        // Payment succeeded, so the account is a Practitioner now — but
        // AuthContext's `user` is still whatever it was at login/register.
        // Re-fetch /auth/me before navigating so the header, the practice
        // library gate, etc. all reflect the new tier immediately.
        await refresh();

        if (res.next_step === "measurements") {
          navigate({
            to: "/mat/buy/mat-measurements",
            search: { order: res.order_uuid ?? undefined },
          });
        } else {
          navigate({
            to: "/mat/buy/order-confirmation",
            search: { order: res.order_uuid ?? undefined },
          });
        }
      } catch (err) {
        if (cancelled) return;
        setStatus("error");
        setMessage(err instanceof ApiError ? err.message : "Couldn't confirm your payment.");
      }
    }

    poll();
    return () => {
      cancelled = true;
    };
  }, [session_id, navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      {status === "checking" ? (
        <>
          <div className="eyebrow mb-4">Confirming payment</div>
          <p className="font-display text-3xl text-ink">One moment — finishing your order…</p>
        </>
      ) : (
        <>
          <div className="eyebrow mb-4">Something went wrong</div>
          <p className="font-display text-3xl text-ink">{message}</p>
          <p className="mt-4 text-sm text-warm-gray">
            If you were charged, check your email for a receipt, or contact support with your
            payment reference.
          </p>
        </>
      )}
    </div>
  );
}
