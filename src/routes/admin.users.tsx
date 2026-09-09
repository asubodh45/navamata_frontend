import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { adminApi, ApiError } from "@/lib/api";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

function AdminUsers() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", search],
    queryFn: () => adminApi.users({ search: search || undefined }),
  });

  async function toggleActive(id: number, next: boolean) {
    setError(null);
    setBusyId(id);
    try {
      await adminApi.updateUser(id, next);
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't update this account.");
    } finally {
      setBusyId(null);
    }
  }

  const users = data?.data ?? [];

  return (
    <div>
      <AdminPageHeader title="Accounts" />
      <div className="p-8">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or email…"
          className="mb-6 h-10 w-72 border hairline bg-soft-white px-3 text-sm"
        />

        {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

        {isLoading ? (
          <p className="text-sm text-warm-gray">Loading…</p>
        ) : (
          <div className="overflow-x-auto border hairline bg-soft-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b hairline text-left text-xs uppercase tracking-[0.12em] text-warm-gray">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Tier</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b hairline last:border-0">
                    <td className="px-4 py-3 text-ink">{u.name}</td>
                    <td className="px-4 py-3 text-warm-gray">{u.email}</td>
                    <td className="px-4 py-3">{u.is_practitioner ? "Practitioner" : "Explorer"}</td>
                    <td className="px-4 py-3 text-warm-gray">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={u.is_active ? "text-ink" : "text-destructive"}>
                        {u.is_active ? "Active" : "Deactivated"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => toggleActive(u.id, !u.is_active)}
                        disabled={busyId === u.id}
                        className="text-xs uppercase tracking-[0.12em] text-charcoal hover:text-ink disabled:opacity-40"
                      >
                        {u.is_active ? "Deactivate" : "Reactivate"}
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-warm-gray">
                      No accounts match.
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
