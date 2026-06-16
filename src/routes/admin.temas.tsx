import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, CheckCircle2, Circle } from "lucide-react";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/admin/temas")({
  component: Temas,
});

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
    if (!matches) return false;
    const used = scheduleByNum.has(t.num);
    if (filter === "free") return !used;
    if (filter === "used") return used;
    return true;
  });

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <h1 className="font-display text-3xl">Temas de discursos</h1>
      <p className="text-muted-foreground mt-1">{themes.length} temas oficiais · use a busca para encontrar.</p>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Buscar por número ou título…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="flex gap-1 bg-muted rounded-md p-1">
          {(["all", "free", "used"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-sm rounded ${filter === f ? "bg-card shadow-sm" : "text-muted-foreground"}`}>
              {f === "all" ? "Todos" : f === "free" ? "Disponíveis" : "Designados"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-2">
        {filtered.map((t) => {
          const sched = scheduleByNum.get(t.num);
          const used = !!sched;
          return (
            <Card key={t.num} className={used ? "border-brand/30 bg-brand/5" : ""}>
              <CardContent className="p-4 flex items-start gap-4">
                <div className="text-xs font-mono w-8 text-muted-foreground pt-0.5">{t.num}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{t.title}</div>
                  {sched && (
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {sched.map((s) => {
                        const sp = speakers.find((x) => x.id === s.speakerId);
                        return (
                          <Badge key={s.id} variant="secondary" className="font-normal">
                            {formatDate(s.date)}{sp ? ` · ${sp.name}` : ""}
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                </div>
                {used ? <CheckCircle2 className="h-5 w-5 text-brand shrink-0" /> : <Circle className="h-5 w-5 text-muted-foreground/40 shrink-0" />}
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-10">Nada encontrado.</p>}
      </div>
    </div>
  );
}
