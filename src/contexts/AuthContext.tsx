import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { authApi, tokenStore, ApiError, type ApiUser } from "@/lib/api";
import type { UserRole } from "@/types";

interface AuthContextValue {
  user: ApiUser | null;
  role: UserRole;
  isAuthenticated: boolean;
  /** True once the initial "am I logged in?" check has finished. */
  isLoading: boolean;
  login: (email: string, password: string) => Promise<ApiUser>;
  register: (input: { name: string; email: string; password: string }) => Promise<ApiUser>;
  signOut: () => Promise<void>;
  /** Re-fetch /auth/me — call after actions that change the user's tier (e.g. buying the mat). */
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function roleFor(user: ApiUser | null): UserRole {
  if (!user) return "viewer";
  return user.is_practitioner ? "practitioner" : "explorer";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount (client-only — the server has no access to the stored token),
  // check whether we already have a valid session.
  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      if (!tokenStore.getAccessToken()) {
        setIsLoading(false);
        return;
      }
      try {
        const me = await authApi.me();
        if (!cancelled) setUser(me);
      } catch {
        tokenStore.clear();
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role: roleFor(user),
      isAuthenticated: !!user,
      isLoading,
      async login(email, password) {
        const res = await authApi.login({ email, password });
        tokenStore.setTokens(res.token, res.refresh_token);
        setUser(res.user);
        return res.user;
      },
      async register({ name, email, password }) {
        const res = await authApi.register({
          name,
          email,
          password,
          password_confirmation: password,
        });
        tokenStore.setTokens(res.token, res.refresh_token);
        setUser(res.user);
        return res.user;
      },
      async signOut() {
        try {
          await authApi.logout();
        } catch {
          // Even if the network call fails, clear local state so the UI reflects signed-out.
        }
        tokenStore.clear();
        setUser(null);
      },
      async refresh() {
        try {
          const me = await authApi.me();
          setUser(me);
        } catch (err) {
          if (err instanceof ApiError && err.status === 401) {
            tokenStore.clear();
            setUser(null);
          }
        }
      },
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
