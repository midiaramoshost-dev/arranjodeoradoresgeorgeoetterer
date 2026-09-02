import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, CheckCircle2, Circle } from "lucide-react";
import { formatDate } from "@/lib/format";

const illustrationTypes = [
  "conceito principal", "aplicação prática", "família", "jovens", "oração",
  "estudo bíblico", "reunião cristã", "natureza", "ajuda ao próximo", "decisão sábia",
  "confiança", "esperança", "amor", "fé", "vida cotidiana",
];

function illustrationUrl(title: string, num: number, index: number) {
  const query = encodeURIComponent(`${title}, ${illustrationTypes[index]}, peaceful illustration`);
  return `https://loremflickr.com/640/400/${query}?lock=${num * 100 + index}`;
}

export const Route = createFileRoute("/admin/temas")({ component: Temas });

function Temas() {
  const themes = useStore((s) => s.themes);
  const schedules = useStore((s) => s.schedules);
  const speakers = useStore((s) => s.speakers);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "free" | "used">("all");

  const scheduleByNum = useMemo(() => {
    const m = new Map<number, typeof schedules>();
    schedules.forEach((s) => {
      const arr = m.get(s.themeNum) || [];
      arr.push(s);
      m.set(s.themeNum, arr);
    });
    return m;
  }, [schedules]);

  const filtered = themes.filter((t) => {
    const matches = !q || t.title.toLowerCase().includes(q.toLowerCase()) || String(t.num).includes(q);
    const used = scheduleByNum.has(t.num);
    return matches && (filter === "all" || (filter === "free" ? !used : used));
  });

  return (
    <div className="mx-auto max-w-5xl p-6 md:p-10">
      <h1 className="font-display text-3xl">Temas de discursos</h1>
      <p className="mt-1 text-muted-foreground">{themes.length} temas oficiais · cada tema possui 15 ilustrações relacionadas.</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" placeholder="Buscar por número ou título…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <div className="flex gap-1 rounded-md bg-muted p-1">{(["all", "free", "used"] as const).map((f) => <button key={f} onClick={() => setFilter(f)} className={`rounded px-3 py-1.5 text-sm ${filter === f ? "bg-card shadow-sm" : "text-muted-foreground"}`}>{f === "all" ? "Todos" : f === "free" ? "Disponíveis" : "Designados"}</button>)}</div>
      </div>
      <div className="mt-6 space-y-2">
        {filtered.map((t) => {
          const sched = scheduleByNum.get(t.num);
          const used = !!sched;
          return <Card key={t.num} className={used ? "border-brand/30 bg-brand/5" : ""}><CardContent className="flex items-start gap-4 p-4"><div className="w-8 pt-0.5 font-mono text-xs text-muted-foreground">{t.num}</div><div className="min-w-0 flex-1"><div className="font-medium">{t.title}</div><Badge variant="outline" className="mt-2 font-normal">15 ilustrações</Badge>{sched && <div className="mt-1 flex flex-wrap gap-1.5">{sched.map((s) => { const sp = speakers.find((x) => x.id === s.speakerId); return <Badge key={s.id} variant="secondary" className="font-normal">{formatDate(s.date)}{sp ? ` · ${sp.name}` : ""}</Badge>; })}</div>}<details className="mt-3"><summary className="cursor-pointer text-xs text-muted-foreground">Visualizar ilustrações</summary><div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">{illustrationTypes.map((type, index) => <img key={type} src={illustrationUrl(t.title, t.num, index)} alt={`${type} — ${t.title}`} loading="lazy" className="aspect-[4/3] rounded object-cover" />)}</div></details></div>{used ? <CheckCircle2 className="h-5 w-5 shrink-0 text-brand" /> : <Circle className="h-5 w-5 shrink-0 text-muted-foreground/40" />}</CardContent></Card>;
        })}
        {filtered.length === 0 && <p className="py-10 text-center text-muted-foreground">Nada encontrado.</p>}
      </div>
    </div>
  );
}
