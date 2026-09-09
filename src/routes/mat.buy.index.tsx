import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { mats } from "@/data/mats";
import { BuyStepper } from "@/components/common/BuyStepper";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mat/buy/")({
  component: BuyIndex,
});

function BuyIndex() {
  const [selected, setSelected] = useState(mats[0].id);
  const mat = mats.find((m) => m.id === selected)!;

  return (
    <div className="pb-32">
      <BuyStepper current={0} />
      <section className="container-page grid gap-16 py-16 lg:grid-cols-[1.1fr_1fr] lg:py-20">
        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
          <img src={mat.image} alt={mat.name} className="h-full w-full object-cover transition-opacity duration-700" />
        </div>

        <div className="flex flex-col">
          <div className="eyebrow mb-3">Step 01 · Selection</div>
          <h1 className="font-display text-4xl leading-[1.05] md:text-6xl">{mat.name}</h1>
          <p className="mt-3 text-base italic text-warm-gray">{mat.tagline}</p>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-warm-gray">{mat.description}</p>

          <div className="mt-10">
            <div className="eyebrow mb-4">Finish</div>
            <div className="flex gap-4">
              {mats.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelected(m.id)}
                  className={cn(
                    "flex flex-1 items-center gap-3 border p-4 text-left transition-colors",
                    selected === m.id ? "border-ink" : "border-hairline hover:border-charcoal",
                  )}
                >
                  <span className={cn("h-8 w-8 rounded-full", m.color === "grey" ? "bg-warm-gray" : "bg-ink")} />
                  <div>
                    <div className="text-sm text-ink">{m.color === "grey" ? "Pearl" : "Obsidian"}</div>
                    <div className="text-xs text-warm-gray">${m.price}</div>
                  </div>
                  {selected === m.id && <Check className="ml-auto h-4 w-4 text-ink" />}
                </button>
              ))}
            </div>
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-y-6 border-t hairline pt-8 text-sm">
            {mat.specs.map((s) => (
              <div key={s.label}>
                <dt className="eyebrow mb-1">{s.label}</dt>
                <dd className="font-display text-lg text-ink">{s.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-auto flex items-center justify-between border-t hairline pt-8">
            <div>
              <div className="eyebrow mb-1">Total today</div>
              <div className="font-display text-3xl">${mat.price}</div>
            </div>
            <Link
              to="/mat/buy/delivery-address"
              className="inline-flex h-12 items-center gap-3 bg-ink px-7 text-xs uppercase tracking-[0.22em] text-soft-white hover:bg-charcoal"
            >
              Continue <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
