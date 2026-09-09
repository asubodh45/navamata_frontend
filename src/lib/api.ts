/**
 * Backend API client for backend_new (Laravel, Sanctum token auth).
 *
 * Auth model: register/login return an access_token + refresh_token pair
 * (plain Sanctum personal access tokens, not cookies). We keep both in
 * localStorage and attach the access token as a Bearer header. On a 401
 * we try exactly one refresh-and-retry before giving up.
 *
 * SSR note: this app renders on the server (TanStack Start), where
 * `window`/`localStorage` don't exist. Every storage access below is
 * guarded, and callers that need the current user should read it
 * client-side (e.g. in an effect or a client-only query) rather than
 * in a route `loader`, since the server has no access to the browser's
 * stored token.
 */

const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000/api/v1";

const ACCESS_TOKEN_KEY = "navamata_access_token";
const REFRESH_TOKEN_KEY = "navamata_refresh_token";

function hasWindow() {
  return typeof window !== "undefined";
}

export const tokenStore = {
  getAccessToken(): string | null {
    if (!hasWindow()) return null;
    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  getRefreshToken(): string | null {
    if (!hasWindow()) return null;
    return window.localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  setTokens(accessToken: string, refreshToken: string) {
    if (!hasWindow()) return;
    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  clear() {
    if (!hasWindow()) return;
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, message: string, body: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Skip attaching the Bearer token (e.g. for /auth/login, /auth/register). */
  unauthenticated?: boolean;
  /** Internal — prevents infinite refresh loops. */
  _retried?: boolean;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, unauthenticated, _retried, headers, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(headers as Record<string, string> | undefined),
  };

  if (body !== undefined) {
    finalHeaders["Content-Type"] = "application/json";
  }

  if (!unauthenticated) {
    const token = tokenStore.getAccessToken();
    if (token) finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Token expired — try one refresh, then retry the original request.
  if (response.status === 401 && !unauthenticated && !_retried) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      return request<T>(path, { ...options, _retried: true });
    }
    tokenStore.clear();
  }

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    const message =
      (data &&
        typeof data === "object" &&
        "message" in data &&
        typeof (data as { message?: unknown }).message === "string" &&
        (data as { message: string }).message) ||
      `Request failed (${response.status})`;
    throw new ApiError(response.status, message, data);
  }

  return data as T;
}

let refreshPromise: Promise<boolean> | null = null;

function tryRefresh(): Promise<boolean> {
  const refreshToken = tokenStore.getRefreshToken();
  if (!refreshToken) return Promise.resolve(false);

  // De-dupe concurrent 401s into a single refresh call.
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
      .then(async (res) => {
        if (!res.ok) return false;
        const data = await res.json();
        tokenStore.setTokens(data.token, data.refresh_token);
        return true;
      })
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

// ── Shared response shapes ────────────────────────────────────────────────

export interface ApiUser {
  id: number;
  uuid: string;
  name: string;
  email: string;
  role: string;
  is_practitioner: boolean;
  practitioner_since: string | null;
  is_active: boolean;
  email_verified_at: string | null;
  created_at: string | null;
}

export interface AuthResponse {
  user: ApiUser;
  token: string;
  refresh_token: string;
}

export interface ApiCategory {
  id?: number;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  video_count?: number;
}

export interface ApiVideo {
  uuid: string;
  title: string;
  description: string | null;
  category: { slug: string; name: string } | null;
  access_level: "watch" | "free_premium" | "paid_premium";
  price_cents: number | null;
  thumbnail_url: string | null;
  duration_seconds: number | null;
  published_at: string | null;
  can_watch: boolean;
  purchased: boolean;
}

// ── Auth ───────────────────────────────────────────────────────────────────

export const authApi = {
  register(input: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) {
    return request<AuthResponse>("/auth/register", {
      method: "POST",
      body: input,
      unauthenticated: true,
    });
  },
  login(input: { email: string; password: string }) {
    return request<AuthResponse>("/auth/login", {
      method: "POST",
      body: input,
      unauthenticated: true,
    });
  },
  me() {
    return request<ApiUser>("/auth/me");
  },
  logout() {
    return request<{ message: string }>("/auth/logout", { method: "POST" });
  },
  sendVerification() {
    return request<{ message: string }>("/auth/send-verification", { method: "POST" });
  },
};

// ── Catalog ──────────────────────────────────────────────────────────────

export const catalogApi = {
  categories() {
    return request<{ data: ApiCategory[] }>("/videos/categories", { unauthenticated: true });
  },
  categoryVideos(slug: string) {
    return request<{ category: ApiCategory; data: ApiVideo[] }>(
      `/videos/categories/${slug}`,
      // Not forced-unauthenticated: sending a token (when present) personalizes can_watch.
    );
  },
  video(uuid: string) {
    return request<ApiVideo>(`/videos/${uuid}`);
  },
  watch(uuid: string) {
    return request<{ stream_url: string; video: ApiVideo }>(`/videos/${uuid}/watch`, {
      method: "GET",
    });
  },
  practiceLibrary() {
    return request<{ data: ApiVideo[] }>("/practice/videos");
  },
  /** Flat listing of every published video, across all categories. */
  allVideos() {
    return request<{ data: ApiVideo[] }>("/videos", { unauthenticated: true });
  },
  /** Recently-watched videos, most recent first — empty if nothing watched yet. */
  continueWatching() {
    return request<{ data: ApiVideo[] }>("/practice/continue");
  },
};

export interface MatShippingAddress {
  name: string;
  line1: string;
  line2?: string | null;
  city: string;
  country: string;
  postal: string;
  // Optional on the type (not just in the form) because orders placed
  // before this field existed have no phone/whatsapp key at all in their
  // stored shipping_address JSON — there's no backfill/migration, so old
  // records genuinely won't have these when read back.
  phone?: string;
  whatsapp?: boolean;
  // Customer-supplied delivery instructions ("leave with doorman", etc.) —
  // distinct from MatOrder's separate `notes` field, which is an internal
  // staff/production note unrelated to this.
  notes?: string | null;
}

export interface MatOrderSummary {
  uuid: string;
  status: string;
  shipping_address?: MatShippingAddress | null;
}

export interface MatMeasurementsInput {
  fm1: number;
  fm2: number;
  fm3: number;
  fm4: number;
  fm5: number;
  fm6: number;
  fm7: number;
  fm8: number;
  fm9: number;
  fm10?: number | null;
  fm11?: number | null;
  fm12?: number | null;
  fline: "solid" | "border";
  motto?: string;
}

export const matApi = {
  /** Resume endpoint — where the current user left off in the buy flow. */
  draft() {
    return request<{
      data: MatOrderSummary | null;
      next_step: "address" | "payment" | "measurements";
    }>("/mat/order/draft");
  },
  saveAddress(shipping_address: MatShippingAddress) {
    return request<{ uuid: string; status: string; next_step: "payment" | "measurements" }>(
      "/mat/order/draft",
      { method: "POST", body: { shipping_address } },
    );
  },
  /** Creates a Stripe Checkout session; caller should redirect to checkout_url. */
  createCheckout() {
    return request<{ checkout_url: string; session_id: string }>("/mat/checkout", {
      method: "POST",
    });
  },
  confirmCheckout(sessionId: string) {
    return request<{
      paid: boolean;
      order_recorded: boolean;
      order_uuid: string | null;
      order_status: string | null;
      next_step: "measurements" | "confirmation";
    }>(`/mat/checkout/confirm?session_id=${encodeURIComponent(sessionId)}`);
  },
  submitMeasurements(input: MatMeasurementsInput & { pending_order_uuid?: string }) {
    return request<{
      uuid: string;
      status: string;
      dimensions: unknown;
      shipping_address: MatShippingAddress;
      amount_paid: number | null;
      message: string;
    }>("/mat/orders", { method: "POST", body: input });
  },
  getOrder(uuid: string) {
    return request<{
      uuid: string;
      status: string;
      shipping_address: MatShippingAddress;
      measurements: Record<string, unknown> | null;
      generated_dimensions: unknown;
      amount_paid: number | null;
    }>(`/mat/orders/${uuid}`);
  },
};

export const videoCheckoutApi = {
  /** Creates a Stripe Checkout session for a single paid_premium video. */
  createCheckout(uuid: string) {
    return request<{ checkout_url: string; session_id: string }>(`/videos/${uuid}/checkout`, {
      method: "POST",
    });
  },
  confirmCheckout(sessionId: string) {
    return request<{ paid: boolean; purchase_recorded: boolean; video_uuid: string | null }>(
      `/videos/checkout/confirm?session_id=${encodeURIComponent(sessionId)}`,
    );
  },
};

// ── Admin ────────────────────────────────────────────────────────────────

export interface Paginated<T> {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

export interface AdminMatOrder {
  uuid: string;
  status: string;
  shipping_address: MatShippingAddress | null;
  measurements: Record<string, unknown> | null;
  amount_paid: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  user: { id: number; uuid: string; name: string; email: string } | null;
}

export interface AdminVideo {
  uuid: string;
  title: string;
  description: string | null;
  access_level: "watch" | "free_premium" | "paid_premium";
  price_cents: number | null;
  duration_seconds: number | null;
  is_published: boolean;
  published_at: string | null;
  sort_order: number;
  purchases_count?: number;
  category: { id: number; slug: string; name: string } | null;
  thumbnail_url: string | null;
}

export const adminApi = {
  users(params: { search?: string; is_active?: boolean; page?: number } = {}) {
    const q = new URLSearchParams();
    if (params.search) q.set("search", params.search);
    if (params.is_active !== undefined) q.set("is_active", String(params.is_active));
    if (params.page) q.set("page", String(params.page));
    return request<Paginated<ApiUser>>(`/admin/users?${q.toString()}`);
  },
  updateUser(id: number, is_active: boolean) {
    return request<{ message: string; user: ApiUser }>(`/admin/users/${id}`, {
      method: "PATCH",
      body: { is_active },
    });
  },

  settings() {
    return request<Record<string, string>>("/admin/settings");
  },
  updateSettings(data: Record<string, string | number>) {
    return request<{ message: string; settings: Record<string, string> }>("/admin/settings", {
      method: "PATCH",
      body: data,
    });
  },

  matOrders(params: { status?: string; search?: string; page?: number } = {}) {
    const q = new URLSearchParams();
    if (params.status) q.set("status", params.status);
    if (params.search) q.set("search", params.search);
    if (params.page) q.set("page", String(params.page));
    return request<Paginated<AdminMatOrder>>(`/admin/mat-orders?${q.toString()}`);
  },
  matOrder(uuid: string) {
    return request<AdminMatOrder>(`/admin/mat-orders/${uuid}`);
  },

  videos(
    params: {
      category?: string;
      access_level?: string;
      published?: boolean;
      search?: string;
      page?: number;
    } = {},
  ) {
    const q = new URLSearchParams();
    if (params.category) q.set("category", params.category);
    if (params.access_level) q.set("access_level", params.access_level);
    if (params.published !== undefined) q.set("published", String(params.published));
    if (params.search) q.set("search", params.search);
    if (params.page) q.set("page", String(params.page));
    return request<Paginated<AdminVideo>>(`/admin/videos?${q.toString()}`);
  },
  updateVideo(
    uuid: string,
    data: Partial<
      Pick<
        AdminVideo,
        "title" | "description" | "access_level" | "price_cents" | "is_published" | "sort_order"
      >
    > & { category_id?: number },
  ) {
    return request<AdminVideo>(`/admin/videos/${uuid}`, { method: "PATCH", body: data });
  },
  deleteVideo(uuid: string) {
    return request<{ message: string }>(`/admin/videos/${uuid}`, { method: "DELETE" });
  },
  watchVideo(uuid: string) {
    return request<{ stream_url: string }>(`/admin/videos/${uuid}/watch`);
  },
};

/**
 * Multipart video upload — kept separate from the shared `request()` helper
 * since FormData must NOT get a JSON Content-Type header or a JSON.stringify'd body.
 */
export async function uploadVideoRaw(form: FormData): Promise<AdminVideo> {
  const token = tokenStore.getAccessToken();
  const response = await fetch(`${API_BASE}/admin/videos`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: form,
  });
  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json().catch(() => null) : null;
  if (!response.ok) {
    const message =
      (data &&
        typeof data === "object" &&
        "message" in data &&
        String((data as { message?: unknown }).message)) ||
      `Upload failed (${response.status})`;
    throw new ApiError(response.status, message, data);
  }
  return data as AdminVideo;
}

// ── Mat production dashboard (staff: role mat_dashboard or admin) ─────────

export interface MatDashboardOrder {
  uuid: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  user: { id: number; name: string; email: string } | null;
  // Only present when the requesting account is admin — the backend
  // (MatDashboardController::index) omits these fields entirely for
  // mat_dashboard-role responses, so a mat_dashboard user's browser never
  // receives this data even via dev tools/network tab.
  shipping_address?: MatShippingAddress | null;
  measurements?: Record<string, unknown> | null;
  motto?: string | null;
  amount_paid?: number | null;
}

export const matDashboardApi = {
  list(params: { status?: string; search?: string; page?: number } = {}) {
    const q = new URLSearchParams();
    if (params.status) q.set("status", params.status);
    if (params.search) q.set("search", params.search);
    if (params.page) q.set("page", String(params.page));
    return request<Paginated<MatDashboardOrder>>(`/mat/dashboard?${q.toString()}`);
  },
  updateStatus(uuid: string, status: string) {
    return request<{ uuid: string; status: string; previous: string; updated_at: string }>(
      `/mat/dashboard/${uuid}/status`,
      { method: "PATCH", body: { status } },
    );
  },
  addNote(uuid: string, note: string) {
    return request<{ message: string; notes: string }>(`/mat/dashboard/${uuid}/notes`, {
      method: "POST",
      body: { note },
    });
  },
};

export { request as apiRequest, API_BASE, tryRefresh };
