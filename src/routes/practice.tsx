import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { videos } from "@/data/videos";
import { programs } from "@/data/categories";
import { VideoCard } from "@/components/cards/VideoCard";
import { SectionHeader } from "@/components/common/SectionHeader";

export const Route = createFileRoute("/practice")({
  component: PracticePage,
});

function PracticePage() {
  const cont = videos.filter((v) => typeof v.progress === "number");
  const completed = videos.slice(3, 6);
  const saved = videos.slice(1, 4);
  const favorites = videos.slice(0, 3);
  const recommended = videos.slice(4, 8);

  return (
    <div className="pb-32">
      <section className="relative overflow-hidden bg-ink text-soft-white">
        <img
          src="https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=2000&q=80"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/60 to-ink" />
        <div className="relative z-10 flex items-center justify-between border-b border-soft-white/10 px-8 py-5 text-[0.65rem] uppercase tracking-[0.28em] text-soft-white/60 md:px-16">
          <span>Your practice</span>
          <span className="hidden md:inline">Vol I — MMXXVI</span>
          <span>The library</span>
        </div>
        <div className="container-page relative z-10 py-24 md:py-32">
          <div className="eyebrow mb-8 text-soft-white/60">Your practice</div>
          <h1 className="max-w-4xl font-display font-bold text-[clamp(3.5rem,9vw,8rem)] leading-[0.9] tracking-[-0.035em]">
            A library
            <br />
            <em className="not-italic text-brand">kept close.</em>
          </h1>
          <p className="mt-10 max-w-xl text-lg leading-relaxed text-soft-white/75">
            Sessions you have begun, returned to, set aside. Held in one quiet place.
          </p>
        </div>
      </section>

      {/* Continue */}
      {cont.length > 0 && (
        <Section eyebrow="Continue practice" title="Return to where you paused.">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {cont.map((v) => <VideoCard key={v.id} video={v} />)}
          </div>
        </Section>
      )}

      {/* Programs */}
      <Section eyebrow="Programs" title="Multi-week curricula.">
        <div className="grid gap-8 md:grid-cols-3">
          {programs.map((p) => (
            <article key={p.id} className="group flex flex-col">
              <div className="aspect-[4/5] overflow-hidden bg-muted">
                <img src={p.image} alt={p.title} className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]" />
              </div>
              <div className="pt-5">
                <div className="eyebrow mb-2">{p.weeks} weeks · {p.sessions} sessions</div>
                <h3 className="font-display text-2xl text-ink">{p.title}</h3>
                <p className="mt-2 text-sm text-warm-gray">{p.description}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* Saved */}
      <Section eyebrow="Saved" title="Set aside for later.">
        <div className="grid gap-8 md:grid-cols-3">
          {saved.map((v) => <VideoCard key={v.id} video={v} />)}
        </div>
      </Section>

      {/* Favorites */}
      <Section eyebrow="Favorites" title="Returned to often.">
        <div className="grid gap-8 md:grid-cols-3">
          {favorites.map((v) => <VideoCard key={v.id} video={v} />)}
        </div>
      </Section>

      {/* Completed */}
      <Section eyebrow="Recently completed" title="A record of practice.">
        <div className="grid gap-8 md:grid-cols-3">
          {completed.map((v) => <VideoCard key={v.id} video={v} />)}
        </div>
      </Section>

      {/* Recommended */}
      <Section eyebrow="Recommended" title="Chosen for you.">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {recommended.map((v) => <VideoCard key={v.id} video={v} />)}
        </div>
        <div className="mt-12">
          <Link to="/explore" className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-charcoal hover:text-ink">
            Browse the full library <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </Section>
    </div>
  );
}

function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="container-page py-20">
      <SectionHeader eyebrow={eyebrow} title={title} className="mb-12" />
      {children}
    </section>
  );
}
