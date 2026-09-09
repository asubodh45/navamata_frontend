import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, Flame, Clock, Heart, Package, Sparkles } from "lucide-react";
import { videos } from "@/data/videos";
import { programs, liveSessions } from "@/data/categories";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/my-studio")({
  component: MyStudio,
});

const weekdays = ["M", "T", "W", "T", "F", "S", "S"];
const practiceDays = [true, true, false, true, true, true, false];

function MyStudio() {
  const { user } = useAuth();
  const upcoming = liveSessions.slice(0, 2);
  const saved = videos.slice(0, 3);

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
          <span>Your studio</span>
          <span className="hidden md:inline">Vol I — MMXXVI</span>
          <span>Day 14</span>
        </div>
        <div className="container-page relative z-10 py-24 md:py-32">
          <div className="eyebrow mb-8 text-soft-white/60">A quiet record</div>
          <h1 className="font-display font-bold text-[clamp(3.5rem,9vw,8rem)] leading-[0.9] tracking-[-0.035em]">
            Good morning,
            <br />
            <em className="not-italic text-soft-white/55">{user?.name?.split(" ")[0] ?? "friend"}.</em>
          </h1>
          <p className="mt-10 max-w-xl text-lg leading-relaxed text-soft-white/75">
            A quiet record of your practice — sessions arriving, sessions completed, the rhythm
            you keep.
          </p>
        </div>
      </section>

      <div className="container-page grid gap-12 py-16 lg:grid-cols-3">
        {/* Streak */}
        <Widget icon={<Flame className="h-4 w-4" />} eyebrow="Practice streak" highlight>
          <div className="font-display text-7xl leading-none">14</div>
          <p className="mt-3 text-sm text-soft-white/70">consecutive days of practice</p>
          <div className="mt-8 flex gap-2">
            {weekdays.map((d, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className={`h-9 w-full border ${practiceDays[i] ? "border-soft-white bg-soft-white/15" : "border-soft-white/20"}`} />
                <span className="text-[10px] uppercase tracking-[0.22em] text-soft-white/55">{d}</span>
              </div>
            ))}
          </div>
        </Widget>

        {/* Calendar */}
        <Widget icon={<Calendar className="h-4 w-4" />} eyebrow="This week">
          <div className="font-display text-3xl text-ink">5 sessions scheduled</div>
          <ul className="mt-6 divide-y hairline">
            {[
              { day: "Tue", title: "Morning Foundations", time: "07:00" },
              { day: "Wed", title: "Breath as Anchor", time: "21:00" },
              { day: "Fri", title: "Slow Vinyasa", time: "18:30" },
            ].map((row) => (
              <li key={row.title} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <div className="eyebrow mb-1">{row.day}</div>
                  <div className="text-ink">{row.title}</div>
                </div>
                <span className="text-warm-gray">{row.time}</span>
              </li>
            ))}
          </ul>
        </Widget>

        {/* Time practiced */}
        <Widget icon={<Clock className="h-4 w-4" />} eyebrow="This month">
          <div className="font-display text-7xl leading-none">18h</div>
          <p className="mt-3 text-sm text-warm-gray">42 sessions · 27 distinct practices</p>
          <div className="mt-8 h-px bg-hairline" />
          <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
            <Stat label="Hatha" value="6h" />
            <Stat label="Vinyasa" value="5h" />
            <Stat label="Breath" value="3h" />
          </div>
        </Widget>
      </div>

      {/* Upcoming live */}
      <section className="bg-ink text-soft-white">
        <div className="container-page py-24">
          <div className="mb-14 flex items-end justify-between">
            <div>
              <div className="eyebrow mb-4 text-soft-white/60">Upcoming live</div>
              <h2 className="font-display text-5xl font-bold leading-[1.02] md:text-6xl">
                Sessions you've <em className="not-italic text-brand">reserved.</em>
              </h2>
            </div>
            <Link to="/go-live" className="hidden text-xs uppercase tracking-[0.24em] text-soft-white/70 hover:text-soft-white md:block">
              All live sessions →
            </Link>
          </div>
          <div className="grid gap-px bg-soft-white/10 md:grid-cols-2">
            {upcoming.map((s) => (
              <article key={s.id} className="group flex gap-6 bg-ink p-8">
                <div className="aspect-square w-32 shrink-0 overflow-hidden bg-charcoal">
                  <img src={s.image} alt={s.title} className="h-full w-full object-cover grayscale transition-all duration-[1200ms] group-hover:grayscale-0" />
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="eyebrow mb-2 text-soft-white/50">{s.date} · {s.time}</div>
                    <h3 className="font-display text-2xl font-bold">{s.title}</h3>
                    <p className="mt-1 text-sm text-soft-white/60">with {s.instructor}</p>
                  </div>
                  <div className="text-xs uppercase tracking-[0.24em] text-soft-white/50">
                    {s.filled}/{s.spots} attending
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Two-column lower */}
      <section className="container-page grid gap-12 py-16 lg:grid-cols-[1.3fr_1fr]">
        {/* Programs */}
        <div>
          <div className="eyebrow mb-3">Programs in progress</div>
          <h2 className="mb-10 font-display text-4xl">Curricula you are <em className="not-italic text-brand">following.</em></h2>
          <div className="space-y-6">
            {programs.slice(0, 2).map((p, i) => {
              const pct = [62, 28][i];
              return (
                <article key={p.id} className="flex gap-6 border hairline p-6">
                  <div className="aspect-square w-28 shrink-0 overflow-hidden bg-muted">
                    <img src={p.image} alt={p.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="eyebrow mb-2">{p.weeks} weeks</div>
                    <h3 className="font-display text-xl">{p.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-warm-gray">{p.description}</p>
                    <div className="mt-auto pt-4">
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-warm-gray">
                        <span>{pct}% complete</span>
                        <span>session {Math.round((pct / 100) * p.sessions)} of {p.sessions}</span>
                      </div>
                      <div className="mt-2 h-px bg-hairline">
                        <div className="h-full bg-ink" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Side widgets */}
        <div className="space-y-10">
          <div>
            <div className="eyebrow mb-3 inline-flex items-center gap-2"><Heart className="h-3.5 w-3.5" /> Favourites</div>
            <ul className="divide-y hairline border-y hairline">
              {saved.map((v) => (
                <li key={v.id}>
                  <Link to="/mat/practice/$videoId" params={{ videoId: v.id }} className="flex items-center justify-between py-4 text-sm text-ink hover:text-charcoal">
                    <span className="font-display text-lg">{v.title}</span>
                    <span className="text-warm-gray">{v.duration}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="eyebrow mb-3 inline-flex items-center gap-2"><Package className="h-3.5 w-3.5" /> Purchased</div>
            <div className="border hairline p-6">
              <div className="font-display text-xl">Navamata — Pearl</div>
              <p className="mt-1 text-sm text-warm-gray">Shipped 14 May · arriving this week</p>
            </div>
          </div>

          <div>
            <div className="eyebrow mb-3 inline-flex items-center gap-2"><Sparkles className="h-3.5 w-3.5" /> Add-ons</div>
            <div className="border hairline p-6 text-sm text-warm-gray">
              The cushion, the strap, the journal — coming this autumn.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Widget({
  icon, eyebrow, highlight, children,
}: { icon: React.ReactNode; eyebrow: string; highlight?: boolean; children: React.ReactNode }) {
  return (
    <article className={`border hairline p-8 ${highlight ? "bg-ink text-soft-white" : "bg-soft-white"}`}>
      <div className={`mb-6 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] ${highlight ? "text-soft-white/60" : "text-warm-gray"}`}>
        {icon}{eyebrow}
      </div>
      {children}
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="eyebrow mb-1">{label}</div>
      <div className="font-display text-2xl">{value}</div>
    </div>
  );
}
