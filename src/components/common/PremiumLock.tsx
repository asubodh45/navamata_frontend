import { Lock } from "lucide-react";

interface PremiumLockProps {
  title?: string;
  subtitle?: string;
}

/** Tasteful overlay shown over premium-locked content. */
export function PremiumLock({
  title = "For Explorer & Practitioner members",
  subtitle = "Open the full library, monthly live studios, and the personal practice journal.",
}: PremiumLockProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-ink/55 px-8 text-center text-soft-white backdrop-blur-[2px]">
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-soft-white/40">
        <Lock className="h-4 w-4" />
      </div>
      <div className="mt-5 max-w-sm font-display text-2xl leading-tight">{title}</div>
      <p className="mt-2 max-w-sm text-xs leading-relaxed text-soft-white/70">{subtitle}</p>
    </div>
  );
}
