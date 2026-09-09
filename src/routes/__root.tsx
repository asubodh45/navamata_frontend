import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider } from "@/contexts/AuthContext";
import { UIProvider } from "@/contexts/UIContext";
import { MatDrawerProvider } from "@/contexts/MatDrawerContext";
import { MainLayout } from "@/layouts/MainLayout";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="eyebrow mb-6">404</div>
        <h1 className="font-display text-5xl text-ink">Off the path</h1>
        <p className="mt-4 text-sm text-warm-gray">
          The page you're seeking has not yet taken form.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex h-11 items-center border border-ink px-6 text-xs uppercase tracking-[0.22em] text-ink transition-colors hover:bg-ink hover:text-soft-white"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="eyebrow mb-6">Disruption</div>
        <h1 className="font-display text-4xl text-ink">A pause in the practice</h1>
        <p className="mt-4 text-sm text-warm-gray">
          Something interrupted this page. Try again, or return home.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex h-11 items-center border border-ink bg-ink px-6 text-xs uppercase tracking-[0.22em] text-soft-white"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex h-11 items-center border border-ink px-6 text-xs uppercase tracking-[0.22em] text-ink hover:bg-ink hover:text-soft-white"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Navamata — A considered practice" },
      {
        name: "description",
        content:
          "Navamata is a luxury wellness studio and handcrafted mat. A quiet practice for those who return to the mat each morning.",
      },
      { property: "og:title", content: "Navamata — A considered practice" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Inter:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <UIProvider>
        <AuthProvider>
          <MatDrawerProvider>
            <MainLayout>
              <Outlet />
            </MainLayout>
          </MatDrawerProvider>
        </AuthProvider>
      </UIProvider>
    </QueryClientProvider>
  );
}
