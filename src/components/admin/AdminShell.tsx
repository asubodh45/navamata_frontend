import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Users, Video, Package, Wrench, Settings, LogOut } from "lucide-react";
import type { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, staffOk: true },
  { to: "/admin/mat-dashboard", label: "Mat production", icon: Wrench, staffOk: true },
  { to: "/admin/mat-orders", label: "All mat orders", icon: Package, staffOk: false },
  { to: "/admin/videos", label: "Videos", icon: Video, staffOk: false },
  { to: "/admin/users", label: "Accounts", icon: Users, staffOk: false },
  { to: "/admin/settings", label: "Settings", icon: Settings, staffOk: false },
] as const;

/**
 * Layout shell for every /admin/* page (see routes/admin.tsx, which renders
 * this around an <Outlet/>). Guards on the raw backend `user.role` — distinct
 * from the viewer/explorer/practitioner tier used everywhere else in the app.
 */
export function AdminShell({ children }: { children: ReactNode }) {
  const { user, isLoading, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isStaff = user?.role === "admin" || user?.role === "mat_dashboard";
  const isAdmin = user?.role === "admin";

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-warm-gray">
        Loading…
      </div>
    );
  }

  if (!isAuthenticated || !isStaff) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="eyebrow">Restricted</div>
        <p className="font-display text-2xl text-ink">This area is for Navamata staff.</p>
        <Link to="/signin" className="text-xs uppercase tracking-[0.22em] text-ink hover:underline">
          Sign in with a staff account
        </Link>
      </div>
    );
  }

  const visibleNav = NAV.filter((n) => n.staffOk || isAdmin);

  async function handleSignOut() {
    await signOut();
    navigate({ to: "/signin" });
  }

  return (
    <div className="flex min-h-screen bg-muted">
      <aside className="flex w-60 shrink-0 flex-col bg-ink text-soft-white">
        <div className="flex items-center gap-2 border-b border-soft-white/10 px-6 py-6">
          <span className="font-display text-lg">navamata</span>
          <span className="rounded-full border border-soft-white/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-soft-white/60">
            Staff
          </span>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {visibleNav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-soft-white/10 text-soft-white"
                    : "text-soft-white/55 hover:bg-soft-white/5 hover:text-soft-white/85",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-soft-white/10 p-3">
          <div className="px-3 py-2 text-xs text-soft-white/50">
            {user?.name}
            <div className="uppercase tracking-[0.18em] text-soft-white/35">{user?.role}</div>
          </div>
          <button
            onClick={handleSignOut}
            className="mt-1 flex w-full items-center gap-2 rounded px-3 py-2 text-xs uppercase tracking-[0.18em] text-soft-white/55 hover:bg-soft-white/5 hover:text-soft-white/85"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}

/** Page-level heading bar — each child route renders this at the top of its own content. */
export function AdminPageHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b hairline bg-soft-white px-8 py-6">
      <h1 className="font-display text-2xl text-ink">{title}</h1>
      {action}
    </div>
  );
}
