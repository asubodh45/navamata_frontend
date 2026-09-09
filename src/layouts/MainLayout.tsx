import type { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { MatRail } from "@/components/navigation/MatRail";
import { MatDrawer } from "@/components/drawer/MatDrawer";

export function MainLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");

  // The admin dashboard has its own sidebar chrome (see routes/admin.tsx) —
  // the public storefront header/footer/mat-rail don't belong there.
  if (isAdmin) {
    return <div className="min-h-screen bg-background text-foreground">{children}</div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <MatRail />
      <MatDrawer />
    </div>
  );
}
