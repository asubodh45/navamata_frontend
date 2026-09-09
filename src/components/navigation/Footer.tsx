import { Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

export function Footer() {
  return (
    <footer className="mt-32 border-t hairline">
      {/* Newsletter */}
      <div className="border-b hairline">
        <div className="container-page grid gap-12 py-20 md:grid-cols-[1.2fr_1fr] md:items-end">
          <div>
            <div className="eyebrow mb-5">The Letter</div>
            <h3 className="font-display text-4xl leading-tight text-ink md:text-5xl">
              A short note,
              <br />
              <em className="not-italic text-charcoal">on the first of each month.</em>
            </h3>
          </div>
          <NewsletterForm />
        </div>
      </div>

      {/* Sitemap */}
      <div className="container-page grid gap-16 py-20 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="font-display text-3xl">navamata</div>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-warm-gray">
            A quiet practice. A considered object. Built in small batches for those who return to
            the mat each morning.
          </p>
          <ul className="mt-8 flex gap-5 text-xs uppercase tracking-[0.22em] text-charcoal">
            {["Instagram", "Journal", "Spotify"].map((s) => (
              <li key={s}>
                <a href="#" className="transition-colors hover:text-ink">
                  {s}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <FooterCol
          title="The Mat"
          items={[
            { to: "/mat/explore", label: "Explore" },
            { to: "/mat/about", label: "About the mat" },
            { to: "/mat/buy", label: "Acquire" },
          ]}
        />
        <FooterCol
          title="Studio"
          items={[
            { to: "/mat/practice", label: "Library" },
            { to: "/go-live", label: "Go Live" },
            { to: "/my-studio", label: "My Studio" },
          ]}
        />
        <FooterCol
          title="Account"
          items={[
            { to: "/signin", label: "Sign in" },
            { to: "/signin/explorer", label: "Become Explorer" },
            { to: "/signin/practitioner", label: "Become Practitioner" },
          ]}
        />
      </div>

      <div className="border-t hairline">
        <div className="container-page flex h-16 flex-wrap items-center justify-between gap-4 text-xs text-warm-gray">
          <span>© {new Date().getFullYear()} Navamata. All rights reserved.</span>
          <ul className="flex gap-6 uppercase tracking-[0.22em]">
            <li>
              <a href="#" className="hover:text-ink">
                Privacy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-ink">
                Terms
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-ink">
                Imprint
              </a>
            </li>
          </ul>
          <span className="uppercase tracking-[0.22em]">Made slowly</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: { to: string; label: string }[] }) {
  return (
    <div>
      <div className="eyebrow mb-5">{title}</div>
      <ul className="space-y-3 text-sm text-charcoal">
        {items.map((i) => (
          <li key={i.to}>
            <Link to={i.to} className="transition-colors hover:text-ink">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NewsletterForm() {
  const [done, setDone] = useState(false);
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setDone(true);
  }
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex items-end gap-4 border-b border-ink pb-3">
        <input
          type="email"
          required
          placeholder="your email"
          aria-label="Email address"
          className="flex-1 bg-transparent text-base text-ink placeholder:text-warm-gray/70 focus:outline-none"
        />
        <button
          type="submit"
          className="text-xs uppercase tracking-[0.22em] text-ink hover:opacity-70"
        >
          Subscribe
        </button>
      </div>
      <p className="mt-3 text-xs text-warm-gray">
        {done ? "Thank you — see you on the first." : "Twelve letters a year. Never more."}
      </p>
    </form>
  );
}
