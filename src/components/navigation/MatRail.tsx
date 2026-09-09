import { Link, useRouterState } from "@tanstack/react-router";
import { Compass, ShoppingBag, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const items = [
  {
    to: "/mat/explore",
    eyebrow: "01",
    label: "Explore",
    caption: "Study the object",
    icon: Compass,
  },
  {
    to: "/mat/buy",
    eyebrow: "02",
    label: "Acquire",
    caption: "Commission yours",
    icon: ShoppingBag,
  },
  {
    to: "/practice",
    eyebrow: "03",
    label: "Practice",
    caption: "Return to the mat",
    icon: Play,
  },
];

/**
 * Fixed right-edge navigation rail dedicated to The Mat.
 * Collapsed: a slim vertical strip with icons + "THE MAT" set vertically.
 * Expanded: an editorial panel with numbered links, captions, and hover states.
 */
export function MatRail() {
  const [expanded, setExpanded] = useState(false);
  const currentPath = useRouterState({ select: (r) => r.location.pathname });

  return (
    <aside
      className={cn(
        "fixed left-0 top-1/2 z-30 hidden -translate-y-1/2 md:block",
        "transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        expanded ? "w-[320px]" : "w-[72px]",
      )}
      aria-label="The Mat"
    >
      <div className="relative border-y border-r hairline bg-soft-white/95 backdrop-blur-xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.35)]">
        {/* Toggle handle */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="absolute -right-4 top-6 z-10 flex h-8 w-8 items-center justify-center border hairline bg-soft-white text-charcoal shadow-sm transition-colors hover:bg-ink hover:text-soft-white"
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          {expanded ? (
            <ChevronLeft className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </button>

        {/* Header */}
        <div className="border-b hairline px-4 py-8">
          {expanded ? (
            <div>
              <div className="eyebrow">Chapter</div>
              <div className="mt-2 font-display text-2xl font-semibold text-ink">The Mat</div>
              <p className="mt-2 text-xs italic leading-relaxed text-warm-gray">
                An object, a discipline, a return.
              </p>
            </div>
          ) : (
            <div className="flex justify-center">
              <span className="eyebrow inline-block [writing-mode:vertical-rl] rotate-180 text-ink">
                The Mat
              </span>
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex flex-col">
          {items.map((it) => {
            const active = currentPath.startsWith(it.to);
            const Icon = it.icon;
            return (
              <Link
                key={it.to}
                to={it.to}
                className={cn(
                  "group relative flex items-center border-b hairline transition-colors last:border-b-0",
                  active
                    ? "bg-ink text-soft-white"
                    : "text-charcoal hover:bg-ink hover:text-soft-white",
                  expanded ? "gap-4 px-5 py-6" : "flex-col justify-center gap-2 px-3 py-6",
                )}
              >
                <span
                  className={cn(
                    "flex h-10 w-10 items-center justify-center border hairline transition-colors",
                    active
                      ? "border-soft-white/30"
                      : "border-hairline group-hover:border-soft-white/30",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                {expanded ? (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[0.65rem] uppercase tracking-[0.22em] opacity-60">
                        {it.eyebrow}
                      </span>
                      <span className="font-display text-xl font-semibold tracking-[-0.01em]">
                        {it.label}
                      </span>
                    </div>
                    <div className="mt-1 text-[0.7rem] uppercase tracking-[0.18em] opacity-70">
                      {it.caption}
                    </div>
                  </div>
                ) : (
                  <span className="text-[0.6rem] uppercase tracking-[0.22em]">{it.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer flourish */}
        <div className="border-t hairline px-4 py-5 text-center">
          <span className="text-[0.6rem] uppercase tracking-[0.28em] text-warm-gray">
            {expanded ? "Handcrafted · Osaka" : "◆"}
          </span>
        </div>
      </div>
    </aside>
  );
}
