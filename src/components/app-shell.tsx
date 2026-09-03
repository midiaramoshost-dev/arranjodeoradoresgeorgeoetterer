import { Link, useRouterState } from "@tanstack/react-router";
import {
  CalendarDays,
  BookOpen,
  Users,
  MapPin,
  LayoutDashboard,
  LogOut,
  Shield,
  Database,
  Sparkles,
  Images,
} from "lucide-react";
import { actions, useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

const navigationGroups = [
  {
    label: "Visão geral",
    items: [
      { to: "/admin", label: "Painel master", icon: LayoutDashboard, exact: true },
      { to: "/admin/master", label: "Gestão completa", icon: Database },
    ],
  },
  {
    label: "Gestão do arranjo",
    items: [
      { to: "/admin/agenda", label: "Agenda", icon: CalendarDays },
      { to: "/admin/temas", label: "Temas", icon: BookOpen },
      { to: "/admin/oradores", label: "Oradores", icon: Users },
      { to: "/admin/congregacoes", label: "Congregações", icon: MapPin },
    ],
  },
  {
    label: "Outros recursos",
    items: [
      { to: "/admin/vmm", label: "Vida e Ministério", icon: Sparkles },
      { to: "/#ilustracoes", label: "Ilustrações", icon: Images },
    ],
  },
];

const nav = navigationGroups.flatMap((group) => group.items);

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = useStore((s) => s.auth.isAdmin);

  const handleLogout = () => {
    actions.logout();
  };

  const renderNavItem = (n: (typeof nav)[number], mobile = false) => {
    const isIllustrationsLink = n.to === "/#ilustracoes";
    const active =
      !isIllustrationsLink && (n.exact ? path === n.to : path.startsWith(n.to));
    const Icon = n.icon;

    return (
      <Link
        key={n.to}
        to={n.to}
        className={
          mobile
            ? `flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-brand text-brand-foreground"
                  : "bg-muted text-foreground hover:bg-accent"
              }`
            : `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60"
              }`
        }
        aria-label={n.label}
        title={n.label}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span>{n.label}</span>
      </Link>
    );
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="hidden w-64 flex-col border-r border-border bg-sidebar md:flex">
        <div className="border-b border-sidebar-border px-6 py-6">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand font-display text-lg text-brand-foreground">
              A
            </div>
            <div>
              <div className="font-display text-lg leading-tight">Arranjo</div>
              <div className="text-xs text-muted-foreground">Gestão de oradores</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto p-3" aria-label="Menu de gestão do arranjo">
          {navigationGroups.map((group) => (
            <div key={group.label}>
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => renderNavItem(item))}
              </div>
            </div>
          ))}
        </nav>

        <div className="space-y-2 border-t border-sidebar-border p-3">
          <Link
            to="/"
            className="block px-3 text-xs text-muted-foreground hover:text-foreground"
          >
            ← Ver página pública
          </Link>

          {isAdmin && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="w-full justify-start bg-red-600 text-white hover:bg-red-700"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          )}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-border bg-card px-4 py-3 md:hidden">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex shrink-0 items-center gap-2">
              <Shield className="h-4 w-4 text-brand" />
              <span className="font-display">Gestão do arranjo</span>
            </div>

            {isAdmin && (
              <Button
                type="button"
                size="sm"
                className="shrink-0 bg-red-600 text-white hover:bg-red-700"
                onClick={handleLogout}
                aria-label="Sair do painel administrativo"
                title="Sair"
              >
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            )}
          </div>

          <nav className="flex gap-2 overflow-x-auto pb-1" aria-label="Menu de gestão do arranjo">
            {nav.map((item) => renderNavItem(item, true))}
          </nav>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
