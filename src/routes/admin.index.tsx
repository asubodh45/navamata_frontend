import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, Video, Package, Wrench, Settings } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

const TILES = [
  {
    to: "/admin/mat-dashboard",
    label: "Mat production",
    icon: Wrench,
    staffOk: true,
    desc: "Paid orders in the production queue",
  },
  {
    to: "/admin/mat-orders",
    label: "All mat orders",
    icon: Package,
    staffOk: false,
    desc: "Every order, any status, full detail",
  },
  {
    to: "/admin/videos",
    label: "Videos",
    icon: Video,
    staffOk: false,
    desc: "Catalog, access levels, uploads",
  },
  {
    to: "/admin/users",
    label: "Accounts",
    icon: Users,
    staffOk: false,
    desc: "Explorer & Practitioner accounts",
  },
  {
    to: "/admin/settings",
    label: "Settings",
    icon: Settings,
    staffOk: false,
    desc: "Pricing, branding, platform config",
  },
] as const;

function AdminOverview() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const tiles = TILES.filter((t) => t.staffOk || isAdmin);

  return (
    <div>
      <AdminPageHeader title="Overview" />
      <div className="p-8">
        <p className="mb-8 max-w-xl text-sm text-warm-gray">
          Welcome back, {user?.name}. Pick a section below.
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.to}
                to={t.to}
                className="border hairline bg-soft-white p-6 transition-colors hover:border-ink"
              >
                <Icon className="h-5 w-5 text-warm-gray" />
                <div className="mt-4 font-display text-lg text-ink">{t.label}</div>
                <p className="mt-1 text-xs text-warm-gray">{t.desc}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
