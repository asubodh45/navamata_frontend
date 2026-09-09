import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

interface AuthShellProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  aside?: {
    image: string;
    quote: string;
    caption: string;
  };
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * Two-column premium auth scaffold. Reused across sign-in and registration.
 * Left: imagery + editorial. Right: the form.
 */
export function AuthShell({ eyebrow, title, description, aside, children, footer }: AuthShellProps) {
  return (
    <section className="container-page py-16 md:py-24">
      <div className="grid min-h-[78vh] gap-px overflow-hidden border hairline bg-hairline md:grid-cols-[1.05fr_1fr]">
        {/* Aside */}
        <aside className="relative hidden bg-ink text-soft-white md:flex md:flex-col md:justify-between">
          {aside && (
            <img
              src={aside.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-55"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/30 to-ink/80" />
          <div className="relative p-10">
            <Link to="/" className="font-display text-2xl tracking-[-0.02em] text-soft-white">
              navamata
            </Link>
          </div>
          {aside && (
            <div className="relative p-10">
              <blockquote className="font-display text-3xl leading-snug">“{aside.quote}”</blockquote>
              <div className="mt-6 text-xs uppercase tracking-[0.22em] text-soft-white/70">
                {aside.caption}
              </div>
            </div>
          )}
        </aside>

        {/* Form panel */}
        <div className="flex flex-col bg-soft-white">
          <div className="flex flex-1 flex-col justify-center px-8 py-14 md:px-16 md:py-20">
            <div className="eyebrow">{eyebrow}</div>
            <h1 className="mt-6 font-display text-5xl leading-[1.02] text-ink md:text-6xl">
              {title}
            </h1>
            {description && (
              <p className="mt-5 max-w-md text-sm leading-relaxed text-warm-gray md:text-base">
                {description}
              </p>
            )}
            <div className="mt-12">{children}</div>
          </div>
          {footer && (
            <div className="border-t hairline bg-soft-white px-8 py-6 md:px-16">{footer}</div>
          )}
        </div>
      </div>
    </section>
  );
}
