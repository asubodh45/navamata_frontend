import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <header
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && <div className="eyebrow mb-5">{eyebrow}</div>}
      <h2 className="font-display text-4xl leading-[1.05] text-ink md:text-5xl">{title}</h2>
      {description && (
        <p className="mt-5 text-base leading-relaxed text-warm-gray md:text-lg">{description}</p>
      )}
    </header>
  );
}
