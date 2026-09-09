import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import {
  matDashboardApi,
  API_BASE,
  tokenStore,
  tryRefresh,
  ApiError,
  type MatDashboardOrder,
} from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/admin/mat-dashboard")({
  component: MatDashboard,
});

const STATUSES = ["pending", "in_process", "completed", "shipped"] as const;

function MatDashboard() {
  const { user } = useAuth();
  // Full order details (shipping address, measurements, motto, amount) are
  // only ever present in the API response for admin — mat_dashboard-role
  // responses omit them entirely at the backend, so this isn't just a UI
  // hide. Gating the modal on role here additionally keeps the mat
  // production view's behavior completely unchanged for mat_dashboard staff.
  const isAdmin = user?.role === "admin";
  const queryClient = useQueryClient();
  const [detailsOrder, setDetailsOrder] = useState<MatDashboardOrder | null>(null);
  const [status, setStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [busyUuid, setBusyUuid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoadingUuid, setPreviewLoadingUuid] = useState<string | null>(null);

  // Revoke the blob URL on unmount so we don't leak memory if the admin
  // navigates away while a preview is open.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-mat-dashboard", status, search],
    queryFn: () =>
      matDashboardApi.list({
        status: status === "all" ? undefined : status,
        search: search || undefined,
      }),
  });

  async function handleStatusChange(uuid: string, next: string) {
    setError(null);
    setBusyUuid(uuid);
    try {
      await matDashboardApi.updateStatus(uuid, next);
      queryClient.invalidateQueries({ queryKey: ["admin-mat-dashboard"] });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't update status.");
    } finally {
      setBusyUuid(null);
    }
  }

  async function handleAddNote(uuid: string) {
    const note = noteDrafts[uuid]?.trim();
    if (!note) return;
    setError(null);
    setBusyUuid(uuid);
    try {
      await matDashboardApi.addNote(uuid, note);
      setNoteDrafts((prev) => ({ ...prev, [uuid]: "" }));
      queryClient.invalidateQueries({ queryKey: ["admin-mat-dashboard"] });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't save note.");
    } finally {
      setBusyUuid(null);
    }
  }

  // The mat-dashboard "/svg" endpoint (despite the route name and its
  // suggested .ai download filename) actually returns a real PDF byte
  // stream — MatDashboardController::downloadSvg sets
  // Content-Type: application/pdf and builds it with TCPDF. That means it
  // can be rendered directly in the browser (embed/iframe from a blob URL)
  // with no backend changes at all — reused here for both download and
  // live preview.
  async function fetchMatFile(uuid: string, _retried = false): Promise<Blob | null> {
    const token = tokenStore.getAccessToken();

    const res = await fetch(`${API_BASE}/mat/dashboard/${uuid}/svg`, {
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    // Token expired/invalid — refresh once and retry, same as the shared request() client.
    if (res.status === 401 && !_retried) {
      const refreshed = await tryRefresh();
      if (refreshed) {
        return fetchMatFile(uuid, true);
      }
      tokenStore.clear();
      setError("Your session expired — please log in again.");
      return null;
    }

    if (!res.ok) return null;
    return res.blob();
  }

  async function downloadSvg(uuid: string) {
    setError(null);
    const blob = await fetchMatFile(uuid);
    if (!blob) {
      setError("Couldn't download the layout file.");
      return;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `navamata_mat_${uuid.slice(0, 8)}.ai`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function previewMat(uuid: string) {
    setError(null);
    setPreviewLoadingUuid(uuid);
    const blob = await fetchMatFile(uuid);
    setPreviewLoadingUuid(null);
    if (!blob) {
      setError("Couldn't load the mat preview.");
      return;
    }
    setPreviewUrl(URL.createObjectURL(blob));
  }

  function closePreview() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  }

  const orders = data?.data ?? [];

  return (
    <div>
      <AdminPageHeader title="Mat production" />
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

        {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

        {isLoading ? (
          <p className="text-sm text-warm-gray">Loading…</p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-warm-gray">No orders match.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div
                key={o.uuid}
                onClick={isAdmin ? () => setDetailsOrder(o) : undefined}
                className={
                  isAdmin
                    ? "cursor-pointer border hairline bg-soft-white p-5 transition-colors hover:border-ink"
                    : "border hairline bg-soft-white p-5"
                }
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-display text-lg text-ink">{o.user?.name ?? "—"}</div>
                    <div className="text-xs text-warm-gray">
                      {o.user?.email} · {o.uuid.slice(0, 8).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={o.status}
                      disabled={busyUuid === o.uuid}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleStatusChange(o.uuid, e.target.value)}
                      className="h-9 border hairline bg-background px-2 text-xs uppercase tracking-[0.12em] capitalize"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        previewMat(o.uuid);
                      }}
                      disabled={previewLoadingUuid === o.uuid}
                      className="h-9 border hairline px-3 text-xs uppercase tracking-[0.12em] text-charcoal hover:border-ink hover:text-ink disabled:opacity-50"
                    >
                      {previewLoadingUuid === o.uuid ? "Loading…" : "Preview mat"}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadSvg(o.uuid);
                      }}
                      className="h-9 border hairline px-3 text-xs uppercase tracking-[0.12em] text-charcoal hover:border-ink hover:text-ink"
                    >
                      Download layout
                    </button>
                  </div>
                </div>

                {o.notes && (
                  <pre className="mt-4 whitespace-pre-wrap border-t hairline pt-4 font-sans text-xs text-warm-gray">
                    {o.notes}
                  </pre>
                )}

                <div className="mt-4 flex gap-2">
                  <input
                    value={noteDrafts[o.uuid] ?? ""}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      setNoteDrafts((prev) => ({ ...prev, [o.uuid]: e.target.value }))
                    }
                    placeholder="Add an internal note…"
                    className="h-9 flex-1 border hairline bg-background px-3 text-xs"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddNote(o.uuid);
                    }}
                    disabled={busyUuid === o.uuid || !noteDrafts[o.uuid]?.trim()}
                    className="h-9 border border-ink bg-ink px-4 text-xs uppercase tracking-[0.12em] text-soft-white disabled:opacity-40"
                  >
                    Save note
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-6"
          onClick={closePreview}
        >
          <div
            className="relative flex h-[88vh] w-full max-w-2xl flex-col bg-soft-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b hairline px-5 py-3">
              <span className="text-xs uppercase tracking-[0.18em] text-warm-gray">
                Mat layout preview
              </span>
              <button
                onClick={closePreview}
                aria-label="Close preview"
                className="text-charcoal hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <embed
              src={previewUrl}
              type="application/pdf"
              className="min-h-0 flex-1"
              title="Mat layout preview"
            />
          </div>
        </div>
      )}

      {isAdmin && detailsOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-6"
          onClick={() => setDetailsOrder(null)}
        >
          <div
            className="relative flex max-h-[88vh] w-full max-w-lg flex-col bg-soft-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b hairline px-5 py-3">
              <span className="text-xs uppercase tracking-[0.18em] text-warm-gray">
                Order details
              </span>
              <button
                onClick={() => setDetailsOrder(null)}
                aria-label="Close details"
                className="text-charcoal hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="overflow-y-auto p-6">
              <div className="mb-6">
                <div className="font-display text-xl text-ink">
                  {detailsOrder.user?.name ?? "—"}
                </div>
                <div className="text-sm text-warm-gray">{detailsOrder.user?.email}</div>
              </div>

              <dl className="mb-6 grid grid-cols-2 gap-y-3 border-y hairline py-4 text-sm">
                <dt className="text-warm-gray">Reference</dt>
                <dd className="font-mono text-xs text-ink">
                  {detailsOrder.uuid.slice(0, 8).toUpperCase()}
                </dd>
                <dt className="text-warm-gray">Status</dt>
                <dd className="capitalize text-ink">{detailsOrder.status.replace("_", " ")}</dd>
                <dt className="text-warm-gray">Placed</dt>
                <dd className="text-ink">{new Date(detailsOrder.created_at).toLocaleString()}</dd>
                {typeof detailsOrder.amount_paid === "number" && (
                  <>
                    <dt className="text-warm-gray">Paid</dt>
                    <dd className="text-ink">${detailsOrder.amount_paid}</dd>
                  </>
                )}
              </dl>

              <div className="mb-6">
                <div className="eyebrow mb-3">Delivery address</div>
                {detailsOrder.shipping_address ? (
                  <div className="text-sm leading-relaxed text-ink">
                    <div>{detailsOrder.shipping_address.name}</div>
                    <div>{detailsOrder.shipping_address.line1}</div>
                    {detailsOrder.shipping_address.line2 && (
                      <div>{detailsOrder.shipping_address.line2}</div>
                    )}
                    <div>
                      {detailsOrder.shipping_address.city}, {detailsOrder.shipping_address.postal}
                    </div>
                    <div>{detailsOrder.shipping_address.country}</div>
                    {detailsOrder.shipping_address.phone && (
                      <div className="mt-2 text-warm-gray">
                        {detailsOrder.shipping_address.phone}
                        {detailsOrder.shipping_address.whatsapp && (
                          <span className="ml-2 text-[10px] uppercase tracking-[0.1em] text-brand">
                            WhatsApp available
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-warm-gray">No address on file.</p>
                )}
              </div>

              {detailsOrder.shipping_address?.notes && (
                <div className="mb-6">
                  <div className="eyebrow mb-2">Delivery notes</div>
                  <p className="text-sm leading-relaxed text-ink">
                    {detailsOrder.shipping_address.notes}
                  </p>
                </div>
              )}

              <div className="mb-6">
                <div className="eyebrow mb-3">Measurements</div>
                {detailsOrder.measurements && Object.keys(detailsOrder.measurements).length > 0 ? (
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    {Object.entries(detailsOrder.measurements).map(([key, value]) => (
                      <div key={key}>
                        <div className="text-[10px] uppercase tracking-[0.12em] text-warm-gray">
                          {key}
                        </div>
                        <div className="text-ink">{String(value)} cm</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-warm-gray">Not submitted yet.</p>
                )}
              </div>

              {detailsOrder.motto && (
                <div className="mb-6">
                  <div className="eyebrow mb-2">Motto</div>
                  <p className="text-sm italic text-ink">"{detailsOrder.motto}"</p>
                </div>
              )}

              {detailsOrder.notes && (
                <div>
                  <div className="eyebrow mb-2">Internal notes</div>
                  <pre className="whitespace-pre-wrap font-sans text-xs text-warm-gray">
                    {detailsOrder.notes}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
