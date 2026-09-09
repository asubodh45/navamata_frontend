import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center border hairline px-10 py-24 text-center">
      <div className="eyebrow mb-5">Empty</div>
      <h3 className="font-display text-3xl text-ink">{title}</h3>
      {description && (
        <p className="mt-3 max-w-md text-sm leading-relaxed text-warm-gray">{description}</p>
      )}
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}
