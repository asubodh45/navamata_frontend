import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  to: string;
  label: string;
  index: string;
}

const steps: Step[] = [
  { to: "/mat/buy", label: "Selection", index: "01" },
  { to: "/mat/buy/delivery-address", label: "Delivery", index: "02" },
  { to: "/mat/buy/mat-payment", label: "Payment", index: "03" },
  { to: "/mat/buy/mat-measurements", label: "Measurements", index: "04" },
  { to: "/mat/buy/order-confirmation", label: "Confirmation", index: "05" },
];

export function BuyStepper({ current }: { current: number }) {
  return (
    <div className="border-b hairline">
      <div className="container-page flex items-center gap-2 overflow-x-auto py-6 md:gap-6">
        {steps.map((s, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <Link
              key={s.to}
              to={s.to}
              className={cn(
                "flex shrink-0 items-center gap-3 text-xs uppercase tracking-[0.22em] transition-colors",
                active ? "text-ink" : done ? "text-charcoal" : "text-warm-gray",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center border text-[10px]",
                  active
                    ? "border-ink bg-ink text-soft-white"
                    : done
                      ? "border-ink text-ink"
                      : "border-hairline text-warm-gray",
                )}
              >
                {done ? <Check className="h-3 w-3" /> : s.index}
              </span>
              <span className="hidden md:inline">{s.label}</span>
              {i < steps.length - 1 && (
                <span className="ml-2 hidden h-px w-10 bg-hairline md:inline-block" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
