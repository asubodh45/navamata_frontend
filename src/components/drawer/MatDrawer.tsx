import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useMatDrawer } from "@/contexts/MatDrawerContext";
import { mats } from "@/data/mats";
import { cn } from "@/lib/utils";

/**
 * The two mat strips ARE the modal. Collapsed: thin peeks behind the pill,
 * on the same baseline. Expanded: both strips rise into tall panels with
 * product info printed directly on the mat surface.
 */
export function MatDrawer() {
  const { isOpen, open, close } = useMatDrawer();

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  // Drag-to-open/close (works on pill AND mats)
  const dragStart = useRef<number | null>(null);
  const startedOpen = useRef(false);
  const onPointerDown = (e: React.PointerEvent) => {
    dragStart.current = e.clientY;
    startedOpen.current = isOpen;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragStart.current == null) return;
    const dy = e.clientY - dragStart.current;
    if (!startedOpen.current && dy < -40) {
      dragStart.current = null;
      open();
    } else if (startedOpen.current && dy > 40) {
      dragStart.current = null;
      close();
    }
  };
  const onPointerEnd = () => {
    dragStart.current = null;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        className={cn(
          "fixed inset-0 z-40 bg-ink/50 backdrop-blur-md transition-opacity duration-500",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* Fixed stage at bottom center — full width in both collapsed and open states */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 transition-all duration-700">
        <div className="relative flex flex-col items-center px-0 pb-0">
          {/* Mat strips + pill share the same baseline */}
          <div
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
            onPointerCancel={onPointerEnd}
            className={cn(
              "pointer-events-auto relative flex w-full touch-none items-end justify-center gap-0",
              "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            )}
          >
            <MatStrip mat={mats[0]} tone="grey" isOpen={isOpen} onClose={close} />
            <MatStrip mat={mats[1]} tone="black" isOpen={isOpen} onClose={close} />

            {/* Pill sits ON TOP of the mats, centered on their baseline */}
            <button
              onClick={() => (isOpen ? close() : open())}
              className={cn(
                "group absolute left-1/2 bottom-0 z-10 flex w-[270px] -translate-x-1/2 touch-none items-center justify-center rounded-full bg-brand px-6 py-3.5 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.4)] transition-all duration-500 hover:bg-brand-soft",
                isOpen ? "translate-y-6 scale-90 opacity-0" : "opacity-100",
              )}
              aria-label={isOpen ? "Close mat details" : "Discover the Mat"}
              aria-expanded={isOpen}
            >
              <span className="text-[0.7rem] font-semibold tracking-[0.14em] text-white">
                discover the mat
              </span>
              <span className="ml-2 text-[0.6rem] text-white/80 transition-transform group-hover:-translate-y-0.5">
                ↑
              </span>
            </button>
          </div>

          {/* Close hint when open */}
          <button
            onClick={close}
            className={cn(
              "pointer-events-auto absolute -top-14 left-1/2 -translate-x-1/2 rounded-full border border-soft-white/30 bg-white/5 px-5 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-soft-white backdrop-blur transition-all duration-500 hover:bg-white/10",
              isOpen ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            Close ✕
          </button>
        </div>
      </div>
    </>
  );
}

function MatStrip({
  mat,
  tone,
  isOpen,
  onClose,
}: {
  mat: (typeof mats)[number];
  tone: "grey" | "black";
  isOpen: boolean;
  onClose: () => void;
}) {
  const isGrey = tone === "grey";
  const textOn = isGrey ? "text-ink" : "text-soft-white";
  const subOn = isGrey ? "text-charcoal/70" : "text-soft-white/70";
  const divide = isGrey ? "border-black/10" : "border-white/15";

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-cover bg-top bg-no-repeat shadow-[0_-10px_40px_-12px_rgba(0,0,0,0.5)]",
        "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
        isGrey ? "bg-warm-gray" : "bg-charcoal",
      )}
      style={{
        width: "50%",
        height: isOpen ? "min(78vh, 720px)" : 56,
        borderTopLeftRadius: isOpen ? 28 : 16,
        borderTopRightRadius: isOpen ? 28 : 16,
        backgroundImage: `url(${isGrey ? "/mats/pearl-mat.jpg" : "/mats/obsidian-mat.jpg"})`,
      }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-white/25" />
      <div
        className={cn(
          "absolute left-1/2 top-2.5 h-[2px] w-7 -translate-x-1/2 rounded-full transition-opacity",
          isGrey ? "bg-black/15" : "bg-white/25",
          isOpen ? "opacity-0" : "opacity-100",
        )}
      />

      <div
        className={cn(
          "flex h-full flex-col p-8 transition-opacity duration-500 md:p-10",
          isGrey ? "bg-soft-white/60" : "bg-ink/60",
          isOpen ? "opacity-100 delay-200" : "pointer-events-none opacity-0",
        )}
      >
        <div className={cn("text-[0.65rem] font-semibold uppercase tracking-[0.28em]", subOn)}>
          {isGrey ? "Pearl" : "Obsidian"}
        </div>
        <h3 className={cn("mt-3 font-display text-3xl leading-tight md:text-4xl", textOn)}>
          {mat.name}
        </h3>
        <p className={cn("mt-2 text-sm italic", subOn)}>{mat.tagline}</p>

        <p className={cn("mt-6 text-sm leading-relaxed", subOn)}>{mat.description}</p>

        <dl className={cn("mt-8 grid grid-cols-2 gap-x-6 text-xs", subOn)}>
          {mat.specs.slice(0, 4).map((s) => (
            <div key={s.label} className={cn("flex justify-between border-b py-2", divide)}>
              <dt className="uppercase tracking-[0.14em]">{s.label}</dt>
              <dd className={cn("font-medium", textOn)}>{s.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-auto flex items-end justify-between pt-8">
          <div>
            <div className={cn("text-[0.6rem] uppercase tracking-[0.22em]", subOn)}>From</div>
            <div className={cn("font-display text-3xl font-semibold", textOn)}>${mat.price}</div>
          </div>
          <Link
            to="/mat/buy"
            onClick={onClose}
            className={cn(
              "inline-flex h-11 items-center px-6 text-xs font-semibold uppercase tracking-[0.22em] transition-colors",
              isGrey
                ? "bg-ink text-soft-white hover:bg-charcoal"
                : "bg-soft-white text-ink hover:bg-white/85",
            )}
          >
            Buy Now
          </Link>
        </div>
      </div>
    </div>
  );
}
