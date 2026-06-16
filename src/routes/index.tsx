import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Shield, ArrowRight, MapPin, User } from "lucide-react";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Arranjo de Discursos 2026" },
      { name: "description", content: "Agenda pública dos discursos públicos da congregação." },
    ],
  }),
  component: Home,
});

function Home() {
  const schedules = useStore((s) => s.schedules);
  const themes = useStore((s) => s.themes);
  const speakers = useStore((s) => s.speakers);
  const congs = useStore((s) => s.congregations);

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = [...schedules]
    .filter((s) => s.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 8);

  const themeOf = (n: number) => themes.find((t) => t.num === n);
  const speakerOf = (id?: string) => speakers.find((s) => s.id === id);
  const congOf = (id?: string) => congs.find((c) => c.id === id);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-brand text-brand-foreground grid place-items-center font-display text-xl">A</div>
            <div>
              <div className="font-display text-xl leading-tight">Arranjo de Discursos</div>
              <div className="text-xs text-muted-foreground">Ano de serviço 2026</div>
            </div>
          </div>
          <Link to="/admin">
            <Button variant="outline" size="sm"><Shield className="h-4 w-4 mr-2" /> Área administrativa</Button>
          </Link>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-widest text-brand font-medium">Agenda pública</p>
          <h1 className="mt-3 text-5xl md:text-6xl font-display font-semibold leading-tight">
            Os próximos discursos da nossa congregação.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Acompanhe quem fala, quando e onde. Toda a programação fica organizada em um só lugar.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl flex items-center gap-2"><CalendarDays className="h-5 w-5 text-brand" /> Próximos discursos</h2>
          <Link to="/admin/agenda" className="text-sm text-brand hover:underline flex items-center gap-1">
            Ver tudo <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-16 text-center">
              <CalendarDays className="h-10 w-10 mx-auto text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">Nenhum discurso agendado ainda.</p>
              <Link to="/admin">
                <Button className="mt-4 bg-brand text-brand-foreground hover:bg-brand/90">Começar a agendar</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {upcoming.map((s) => {
              const t = themeOf(s.themeNum);
              const sp = speakerOf(s.speakerId);
              const co = congOf(s.congregationId);
              return (
                <Card key={s.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-sm font-medium text-brand">{formatDate(s.date)}</div>
                      <div className="text-xs text-muted-foreground">Tema nº {s.themeNum}</div>
                    </div>
                    <h3 className="mt-2 font-display text-lg leading-snug">{t?.title || "Tema não encontrado"}</h3>
                    <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                      {sp && <div className="flex items-center gap-2"><User className="h-3.5 w-3.5" /> {sp.name}{co && ` · ${co.name}`}</div>}
                      {s.location && <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> {s.location}</div>}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-6 text-sm text-muted-foreground flex flex-wrap items-center justify-between gap-3">
          <span>© {new Date().getFullYear()} Arranjo de Discursos</span>
          <span className="text-xs">Dados locais · conecte ao Supabase para sincronizar</span>
        </div>
      </footer>
    </div>
  );
}
