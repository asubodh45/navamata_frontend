import { createFileRoute } from "@tanstack/react-router";
import { Users, CalendarPlus, Mail } from "lucide-react";
import { liveSessions } from "@/data/categories";

export const Route = createFileRoute("/go-live")({
  component: GoLive,
});

const avatars = [
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&w=200&q=80",
];

function GoLive() {
  return (
    <div className="pb-32">
      <section className="relative overflow-hidden bg-ink text-soft-white">
        <img
          src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=2000&q=80"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/60 to-ink" />
        <div className="relative z-10 flex items-center justify-between border-b border-soft-white/10 px-8 py-5 text-[0.65rem] uppercase tracking-[0.28em] text-soft-white/60 md:px-16">
          <span>Go Live · Beta</span>
          <span className="hidden md:inline">Live studios · Vol I</span>
          <span>03 Sessions</span>
        </div>
        <div className="container-page relative z-10 py-24 md:py-32">
          <div className="eyebrow mb-8 text-soft-white/60">In real time</div>
          <h1 className="max-w-4xl font-display font-bold text-[clamp(3.5rem,9vw,8rem)] leading-[0.9] tracking-[-0.035em]">
            Practice,
            <br />
            <em className="not-italic text-soft-white/55">together.</em>
          </h1>
          <p className="mt-10 max-w-xl text-lg leading-relaxed text-soft-white/75">
            Small live studios with our teachers — reserved each month for members.
            Held quietly, in real time, for those who choose to gather.
          </p>
        </div>
      </section>

      <section className="container-page py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="eyebrow mb-3">Upcoming studios</div>
            <h2 className="font-display text-4xl">Three sessions <em className="not-italic text-brand">this fortnight.</em></h2>
          </div>
          <button className="hidden h-11 items-center gap-2 border border-ink px-5 text-xs uppercase tracking-[0.22em] text-ink hover:bg-ink hover:text-soft-white md:inline-flex">
            <CalendarPlus className="h-3.5 w-3.5" /> Schedule a session
          </button>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          {liveSessions.map((s) => (
            <article key={s.id} className="group flex flex-col border hairline">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img src={s.image} alt={s.title} className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]" />
              </div>
              <div className="flex flex-1 flex-col p-7">
                <div className="eyebrow mb-3">{s.date}</div>
                <h3 className="font-display text-2xl">{s.title}</h3>
                <p className="mt-2 text-sm italic text-warm-gray">with {s.instructor}</p>

                <dl className="mt-6 grid grid-cols-2 gap-4 text-xs uppercase tracking-[0.22em] text-warm-gray">
                  <div><dt>Time</dt><dd className="mt-1 font-display text-sm normal-case tracking-normal text-ink">{s.time}</dd></div>
                  <div><dt>Length</dt><dd className="mt-1 font-display text-sm normal-case tracking-normal text-ink">{s.duration}</dd></div>
                </dl>

                <div className="mt-auto pt-7">
                  <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-warm-gray">
                    <span className="inline-flex items-center gap-1.5"><Users className="h-3 w-3" /> {s.filled} attending</span>
                    <span>{s.spots - s.filled} spots</span>
                  </div>
                  <div className="h-px bg-hairline">
                    <div className="h-full bg-ink" style={{ width: `${(s.filled / s.spots) * 100}%` }} />
                  </div>
                  <button className="mt-6 inline-flex h-11 w-full items-center justify-center border border-ink text-xs uppercase tracking-[0.22em] text-ink transition-colors hover:bg-ink hover:text-soft-white">
                    Reserve a place
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Together */}
      <section className="bg-ink text-soft-white">
        <div className="container-page grid gap-12 py-24 md:grid-cols-2">
          <div>
            <div className="eyebrow mb-5 text-soft-white/60">Together</div>
            <h2 className="font-display text-4xl leading-tight md:text-5xl">
              Invite a <em className="not-italic text-brand">small circle.</em>
            </h2>
            <p className="mt-6 max-w-md text-soft-white/75">
              Share a session with up to four others. We hold the space; you bring the company.
            </p>
            <button className="mt-10 inline-flex h-12 items-center gap-2 border border-soft-white px-6 text-xs uppercase tracking-[0.22em] hover:bg-soft-white hover:text-ink">
              <Mail className="h-3.5 w-3.5" /> Send an invitation
            </button>
          </div>
          <div className="flex flex-col justify-center">
            <div className="eyebrow mb-4 text-soft-white/60">Those attending Sunday</div>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {avatars.map((a, i) => (
                  <img key={i} src={a} alt="" className="h-14 w-14 rounded-full border-2 border-ink object-cover" />
                ))}
              </div>
              <div className="ml-3 font-display text-2xl">+ 24 others</div>
            </div>
          </div>
        </div>
      </section>

      {/* Coming soon */}
      <section className="container-page py-24">
        <div className="border hairline px-10 py-20 text-center">
          <div className="eyebrow mb-5">In preparation</div>
          <h3 className="mx-auto max-w-xl font-display text-4xl leading-tight">
            A quiet broadcast studio, <em className="not-italic text-brand">opening this autumn.</em>
          </h3>
          <p className="mx-auto mt-5 max-w-md text-sm text-warm-gray">
            Live ceremonies, monthly intensives, and one-to-one sittings — for Practitioner members.
          </p>
        </div>
      </section>
    </div>
  );
}
