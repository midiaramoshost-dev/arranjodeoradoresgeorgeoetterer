import { Link, useRouterState } from "@tanstack/react-router";
import { CalendarDays, BookOpen, Users, MapPin, LayoutDashboard, LogOut, Shield, Database, Sparkles, Images } from "lucide-react";
import { actions, useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/admin", label: "Painel", icon: LayoutDashboard, exact: true },
  { to: "/admin/master", label: "Master (Planilha)", icon: Database },
  { to: "/admin/vmm", label: "Vida e Ministério", icon: Sparkles },
  { to: "/#ilustracoes", label: "Ilustrações", icon: Images },
  { to: "/admin/agenda", label: "Agenda", icon: CalendarDays },
  { to: "/admin/temas", label: "Temas", icon: BookOpen },
  { to: "/admin/oradores", label: "Oradores", icon: Users },
  { to: "/admin/congregacoes", label: "Congregações", icon: MapPin },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = useStore((s) => s.auth.isAdmin);

  return (
    <div className="min-h-screen flex w-full bg-background">
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-sidebar">
        <div className="px-6 py-6 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-brand text-brand-foreground grid place-items-center font-display text-lg">A</div>
            <div>
              <div className="font-display text-lg leading-tight">Arranjo</div>
              <div className="text-xs text-muted-foreground">Discursos 2026</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((n) => {
            const isIllustrationsLink = n.to === "/#ilustracoes";
            const active = !isIllustrationsLink && (n.exact ? path === n.to : path.startsWith(n.to));
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60"
                }`}
              >
                <Icon className="h-4 w-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-sidebar-border space-y-2">
          <Link to="/" className="block text-xs text-muted-foreground hover:text-foreground px-3">
            ← Ver agenda pública
          </Link>
          {isAdmin && (
            <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => actions.logout()}>
              <LogOut className="h-4 w-4 mr-2" /> Sair
            </Button>
          )}
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden border-b border-border px-4 h-14 flex items-center justify-between bg-card">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-brand" />
            <span className="font-display">Admin</span>
          </div>
          <nav className="flex gap-1 overflow-auto">
            {nav.map((n) => {
              const isIllustrationsLink = n.to === "/#ilustracoes";
              const active = !isIllustrationsLink && (n.exact ? path === n.to : path.startsWith(n.to));
              const Icon = n.icon;
              return (
                <Link key={n.to} to={n.to} className={`p-2 rounded-md ${active ? "bg-accent" : ""}`} aria-label={n.label} title={n.label}>
                  <Icon className="h-4 w-4" />
                </Link>
              );
            })}
          </nav>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
