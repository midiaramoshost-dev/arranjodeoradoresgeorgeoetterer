import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { BookOpen, CalendarDays, Database, Plus, Search, ShieldCheck, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMaster } from "@/lib/master-store";

export const Route = createFileRoute("/admin/")({ component: Dashboard });

function Dashboard() {
  const agenda = useMaster((s) => s.agenda);
  const themes = useMaster((s) => s.themes);
  const oradores = useMaster((s) => s.oradoresLocais);
  const leitores = useMaster((s) => s.leitores);
  const upcoming = useMemo(() => agenda.filter((item) => item.data).slice(0, 5), [agenda]);
  const stats = [
    { label: "Designações", value: agenda.length, icon: CalendarDays },
    { label: "Temas", value: themes.length, icon: BookOpen },
    { label: "Oradores locais", value: oradores.length, icon: Users },
    { label: "Leitores", value: leitores.length, icon: ShieldCheck },
  ];

  return (
    <div className="mx-auto max-w-6xl p-6 md:p-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-sm font-medium uppercase tracking-[0.16em] text-brand">Gestão completa</p><h1 className="font-display text-3xl">Painel adm master</h1><p className="mt-1 text-muted-foreground">Controle agenda, temas, oradores, presidência e leitores em um só lugar.</p></div>
        <Link to="/admin/master"><Button className="bg-brand text-brand-foreground hover:bg-brand/90"><Database className="mr-2 h-4 w-4" /> Abrir painel master</Button></Link>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{stats.map(({ label, value, icon: Icon }) => <Card key={label}><CardContent className="p-5"><Icon className="mb-3 h-5 w-5 text-brand" /><div className="text-3xl font-display font-semibold">{value}</div><div className="mt-1 text-sm text-muted-foreground">{label}</div></CardContent></Card>)}</div>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Card><CardContent className="p-5"><div className="mb-4 flex items-center justify-between"><h2 className="font-display text-xl">Ações rápidas</h2><Database className="h-5 w-5 text-brand" /></div><div className="grid gap-2"><Link to="/admin/master"><Button variant="outline" className="w-full justify-start"><Plus className="mr-2 h-4 w-4" /> Adicionar designação</Button></Link><Link to="/admin/master"><Button variant="outline" className="w-full justify-start"><BookOpen className="mr-2 h-4 w-4" /> Gerenciar temas e pessoas</Button></Link><Link to="/admin/master"><Button variant="outline" className="w-full justify-start"><Search className="mr-2 h-4 w-4" /> Fazer busca global</Button></Link></div></CardContent></Card>
        <Card><CardContent className="p-5"><h2 className="mb-4 font-display text-xl">Próximas designações</h2>{upcoming.length === 0 ? <p className="py-6 text-center text-sm text-muted-foreground">Nenhuma designação cadastrada.</p> : <div className="space-y-2">{upcoming.map((item) => <div key={item.id} className="rounded-lg border p-3"><div className="text-xs font-medium text-brand">{item.data} · {item.mes}</div><div className="mt-1 font-medium">{item.tema || "Tema a definir"}</div><div className="text-sm text-muted-foreground">{item.orador || "Orador a definir"}{item.congregacao ? ` · ${item.congregacao}` : ""}</div></div>)}</div>}</CardContent></Card>
      </div>
    </div>
  );
}
