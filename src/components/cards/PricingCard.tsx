import { Check } from "lucide-react";
import type { PricingTier } from "@/types";
import { cn } from "@/lib/utils";

export function PricingCard({ tier }: { tier: PricingTier }) {
  return (
    <article
      className={cn(
        "flex flex-col border hairline p-10",
        tier.highlighted ? "bg-ink text-soft-white" : "bg-soft-white",
      )}
    >
      <div className={cn("eyebrow", tier.highlighted && "text-soft-white/60")}>{tier.name}</div>
      <div className="mt-6 flex items-baseline gap-2">
        <span className="font-display text-5xl">
          {tier.price === 0 ? "Free" : `$${tier.price}`}
        </span>
        {tier.price > 0 && (
          <span className={cn("text-sm", tier.highlighted ? "text-soft-white/60" : "text-warm-gray")}>
            / {tier.cadence}
          </span>
        )}
      </div>
      <p
        className={cn(
          "mt-4 text-sm leading-relaxed",
          tier.highlighted ? "text-soft-white/75" : "text-warm-gray",
        )}
      >
        {tier.description}
      </p>
      <ul className="mt-8 space-y-3 text-sm">
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-3">
            <Check className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <button
        className={cn(
          "mt-10 inline-flex h-11 items-center justify-center border text-xs uppercase tracking-[0.22em] transition-colors",
          tier.highlighted
            ? "border-soft-white text-soft-white hover:bg-soft-white hover:text-ink"
            : "border-ink text-ink hover:bg-ink hover:text-soft-white",
        )}
      >
        Choose {tier.name}
      </button>
    </article>
  );
}
