import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Church, CalendarDays, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const themes = useStore((s) => s.themes);
  const speakers = useStore((s) => s.speakers);
  const congs = useStore((s) => s.congregations);
  const schedules = useStore((s) => s.schedules);

  const today = new Date().toISOString().slice(0, 10);
  const next = [...schedules].filter((s) => s.date >= today).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);
  const usedNums = new Set(schedules.map((s) => s.themeNum));

  const stats = [
    { label: "Temas disponíveis", value: themes.length - usedNums.size, total: themes.length, icon: BookOpen, to: "/admin/temas" },
    { label: "Oradores", value: speakers.length, icon: Users, to: "/admin/oradores" },
    { label: "Congregações", value: congs.length, icon: Church, to: "/admin/congregacoes" },
    { label: "Discursos agendados", value: schedules.length, icon: CalendarDays, to: "/admin/agenda" },
  ];

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl">Painel</h1>
          <p className="text-muted-foreground mt-1">Visão geral do arranjo de discursos.</p>
        </div>
        <Link to="/admin/agenda">
          <Button className="bg-brand text-brand-foreground hover:bg-brand/90"><Plus className="h-4 w-4 mr-2" /> Novo agendamento</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} to={s.to}>
              <Card className="hover:shadow-md hover:border-brand/40 transition-all">
                <CardContent className="p-5">
                  <Icon className="h-5 w-5 text-brand mb-3" />
                  <div className="text-3xl font-display font-semibold">{s.value}{s.total ? <span className="text-base text-muted-foreground"> / {s.total}</span> : null}</div>
                  <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl">Próximos discursos</h2>
          <Link to="/admin/agenda" className="text-sm text-brand hover:underline flex items-center gap-1">Ver todos <ArrowRight className="h-3 w-3" /></Link>
        </div>
        {next.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-10 text-center text-muted-foreground">
              Nenhum discurso agendado. <Link to="/admin/agenda" className="text-brand hover:underline">Crie o primeiro</Link>.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {next.map((s) => {
              const t = themes.find((x) => x.num === s.themeNum);
              const sp = speakers.find((x) => x.id === s.speakerId);
              return (
                <Card key={s.id}>
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-brand font-medium">{formatDate(s.date)}</div>
                      <div className="font-medium truncate">{t?.title}</div>
                      <div className="text-sm text-muted-foreground truncate">{sp?.name || "Sem orador"}{s.location ? ` · ${s.location}` : ""}</div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
