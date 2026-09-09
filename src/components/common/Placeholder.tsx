import type { ReactNode } from "react";
import { SectionHeader } from "./SectionHeader";

interface PlaceholderProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}

/** Generic premium placeholder page shell. Each route swaps this for real UI later. */
export function PagePlaceholder({ eyebrow, title, description, children }: PlaceholderProps) {
  return (
    <div className="container-page py-24 md:py-32">
      <SectionHeader eyebrow={eyebrow} title={title} description={description} />
      <div className="mt-16">
        {children ?? (
          <div className="grid h-[420px] place-items-center border hairline">
            <span className="eyebrow">Coming into form</span>
          </div>
        )}
      </div>
    </div>
  );
}
