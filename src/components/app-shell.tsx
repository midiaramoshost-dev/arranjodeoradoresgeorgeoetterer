import { Link, useRouterState } from "@tanstack/react-router";
import {
  CalendarDays,
  BookOpen,
  MapPin,
  LayoutDashboard,
  LogOut,
  Database,
  Sparkles,
  Images,
  ArrowLeft,
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
            ? `flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-brand text-brand-foreground shadow-md shadow-brand/10"
                  : "bg-muted/60 text-foreground/80 hover:bg-accent hover:text-foreground"
              }`
            : `flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm transition-all duration-200 ${
                active
                  ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground shadow-sm border-l-2 border-brand pl-3"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground hover:translate-x-0.5"
              }`
        }
        aria-label={n.label}
        title={n.label}
      >
        <Icon className={`h-4.5 w-4.5 shrink-0 transition-transform ${active ? "scale-110 text-brand" : "opacity-80"}`} />
        <span>{n.label}</span>
      </Link>
    );
  };

  return (
    <div className="flex min-h-screen w-full bg-background/95">
      <aside className="hidden w-64 flex-col border-r border-border/80 bg-sidebar/95 backdrop-blur-md md:flex">
        <div className="border-b border-sidebar-border/60 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand to-primary font-display text-xl font-bold text-brand-foreground shadow-md shadow-brand/20">
              A
            </div>
            <div>
              <div className="font-display text-lg font-bold leading-tight tracking-tight">Arranjo</div>
              <div className="text-xs text-muted-foreground/90">Gestão de oradores</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto p-4" aria-label="Menu de gestão do arranjo">
          {navigationGroups.map((group) => (
            <div key={group.label} className="space-y-1.5">
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground/70">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => renderNavItem(item))}
              </div>
            </div>
          ))}
        </nav>

        <div className="space-y-3 border-t border-sidebar-border/60 p-4">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-brand transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Ver página pública</span>
          </Link>

          {isAdmin && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="w-full justify-start rounded-lg bg-red-600/90 text-white hover:bg-red-600 shadow-sm transition-all hover:shadow-md hover:shadow-red-600/10"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          )}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-border/60 bg-card/80 backdrop-blur-md px-4 py-4 md:hidden">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex shrink-0 items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand to-primary font-display text-sm font-bold text-brand-foreground shadow-sm">
                A
              </div>
              <span className="font-display font-bold text-base tracking-tight">Gestão do arranjo</span>
            </div>

            {isAdmin && (
              <Button
                type="button"
                size="sm"
                className="shrink-0 bg-red-600/90 text-white hover:bg-red-600 rounded-lg"
                onClick={handleLogout}
                aria-label="Sair do painel administrativo"
                title="Sair"
              >
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            )}
          </div>

          <nav className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none" aria-label="Menu de gestão do arranjo">
            {nav.map((item) => renderNavItem(item, true))}
          </nav>
        </header>

        <main className="flex-1 overflow-auto bg-background/50">{children}</main>
      </div>
    </div>
  );
}