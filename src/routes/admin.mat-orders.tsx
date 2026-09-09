import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { adminApi } from "@/lib/api";

export const Route = createFileRoute("/admin/mat-orders")({
  component: AdminMatOrders,
});

const STATUSES = [
  "draft",
  "awaiting_measurements",
  "pending",
  "in_process",
  "completed",
  "shipped",
] as const;

function AdminMatOrders() {
  const [status, setStatus] = useState<string>("all");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-mat-orders", status, search],
    queryFn: () =>
      adminApi.matOrders({
        status: status === "all" ? undefined : status,
        search: search || undefined,
      }),
  });

  const orders = data?.data ?? [];

  return (
    <div>
      <AdminPageHeader title="All mat orders" />
      <div className="p-8">
        <div className="mb-6 flex flex-wrap gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, order ref…"
            className="h-10 w-64 border hairline bg-soft-white px-3 text-sm"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-10 border hairline bg-soft-white px-3 text-sm capitalize"
          >
            <option value="all">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <p className="text-sm text-warm-gray">Loading…</p>
        ) : (
          <div className="overflow-x-auto border hairline bg-soft-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b hairline text-left text-xs uppercase tracking-[0.12em] text-warm-gray">
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Placed</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.uuid} className="border-b hairline last:border-0">
                    <td className="px-4 py-3">
                      <div className="text-ink">{o.user?.name ?? "—"}</div>
                      <div className="text-xs text-warm-gray">{o.user?.email}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {o.uuid.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3 capitalize">{o.status.replace("_", " ")}</td>
                    <td className="px-4 py-3">{o.amount_paid ? `$${o.amount_paid}` : "—"}</td>
                    <td className="px-4 py-3 text-warm-gray">
                      {new Date(o.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-warm-gray">
                      No orders match.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
