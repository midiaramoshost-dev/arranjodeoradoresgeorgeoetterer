import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { AuthGate } from "@/components/auth-gate";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const content = (
    <AppShell>
      <Outlet />
    </AppShell>
  );

  if (pathname === "/admin/vmm" || pathname.startsWith("/admin/vmm/")) {
    return content;
  }

  return <AuthGate>{content}</AuthGate>;
}
