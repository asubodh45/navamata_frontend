import type { Mat } from "@/types";

export function ProductCard({ mat }: { mat: Mat }) {
  return (
    <article className="group flex flex-col">
      <div className="aspect-[4/5] overflow-hidden bg-muted">
        <img
          src={mat.image}
          alt={mat.name}
          className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex items-end justify-between pt-5">
        <div>
          <div className="eyebrow mb-1.5">{mat.color === "grey" ? "Pearl" : "Obsidian"}</div>
          <h3 className="font-display text-2xl text-ink">{mat.name}</h3>
          <p className="mt-1 text-sm italic text-warm-gray">{mat.tagline}</p>
        </div>
        <span className="font-display text-xl text-ink">${mat.price}</span>
      </div>
    </article>
  );
}
