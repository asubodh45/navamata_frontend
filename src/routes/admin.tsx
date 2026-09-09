import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";

/**
 * Layout route for everything under /admin — shares one AdminShell
 * (auth/role guard + sidebar) across all admin.*.tsx children via Outlet.
 */
export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}
