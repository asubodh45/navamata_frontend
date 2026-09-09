import { createFileRoute, Outlet } from "@tanstack/react-router";

/**
 * Thin layout for /admin/videos/* — required because admin.videos.new.tsx
 * shares this file's route prefix, which makes TanStack Router treat this
 * file as the parent layout (same trap as routes/admin.tsx). Without the
 * Outlet here, navigating to /admin/videos/new changed the URL but rendered
 * nothing, since this file's component fully replaced the tree instead of
 * yielding to the child route.
 */
export const Route = createFileRoute("/admin/videos")({
  component: () => <Outlet />,
});
