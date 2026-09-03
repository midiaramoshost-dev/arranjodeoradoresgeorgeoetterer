import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { actions, useStore, type Schedule } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Pencil, Trash2, CalendarDays, MapPin, User, ChevronsUpDown, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/agenda")({
  component: Agenda,
});

function Agenda() {
  const schedules = useStore((s) => s.schedules);
  const themes = useStore((s) => s.themes);
  const speakers = useStore((s) => s.speakers);
  const congs = useStore((s) => s.congregations);
  const [editing, setEditing] = useState<Schedule | null>(null);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"upcoming" | "all" | "past">("upcoming");

  const today = new Date().toISOString().slice(0, 10);
  const sorted = useMemo(() => [...schedules].sort((a, b) => a.date.localeCompare(b.date)), [schedules]);
  const filtered = sorted.filter((s) => view === "all" || (view === "upcoming" ? s.date >= today : s.date < today));

  const startNew = () => {
    setEditing({ id: "", date: today, themeNum: themes[0]?.num ?? 1 });
    setOpen(true);
  };

  const save = (data: Omit<Schedule, "id">) => {
    if (!data.date) { toast.error("Data obrigatória"); return; }
    if (!data.themeNum) { toast.error("Tema obrigatório"); return; }
    if (editing?.id) actions.updateSchedule(editing.id, data);
    else actions.addSchedule(data);
    toast.success("Salvo");
    setOpen(false);
  };

  const remove = (s: Schedule) => {
    if (!confirm("Remover este agendamento?")) return;
    actions.deleteSchedule(s.id);
    toast.success("Removido");
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl">Agenda</h1>
          <p className="text-muted-foreground mt-1">{schedules.length} discurso(s) agendado(s).</p>
        </div>
        <Button onClick={startNew} className="bg-brand text-brand-foreground hover:bg-brand/90"><Plus className="h-4 w-4 mr-2" /> Novo agendamento</Button>
      </div>

      <div className="flex gap-1 bg-muted rounded-md p-1 mb-6 w-fit">
        {(["upcoming", "all", "past"] as const).map((v) => (
          <button key={v} onClick={() => setView(v)} className={`px-3 py-1.5 text-sm rounded ${view === v ? "bg-card shadow-sm" : "text-muted-foreground"}`}>
            {v === "upcoming" ? "Próximos" : v === "all" ? "Todos" : "Passados"}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="border-dashed"><CardContent className="py-16 text-center text-muted-foreground">
          <CalendarDays className="h-10 w-10 mx-auto opacity-40" />
          <p className="mt-3">Nenhum discurso por aqui.</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => {
            const t = themes.find((x) => x.num === s.themeNum);
            const sp = speakers.find((x) => x.id === s.speakerId);
            const ch = speakers.find((x) => x.id === s.chairmanId);
            const co = congs.find((x) => x.id === s.congregationId);
            return (
              <Card key={s.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className="bg-brand/10 text-brand hover:bg-brand/15 border-0 font-medium">{formatDate(s.date)}</Badge>
                        <Badge variant="outline">Tema nº {s.themeNum}</Badge>
                      </div>
                      <h3 className="mt-2 font-display text-lg leading-snug">{t?.title || "Tema inexistente"}</h3>
                      <div className="mt-2 text-sm text-muted-foreground space-y-0.5">
                        <div className="flex items-center gap-2"><User className="h-3.5 w-3.5" /> <strong className="font-medium text-foreground">{sp?.name || "Sem orador"}</strong>{co && ` · ${co.name}`}</div>
                        {ch && <div className="flex items-center gap-2"><User className="h-3.5 w-3.5 opacity-60" /> Presidente: {ch.name}</div>}
                        {s.location && <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> {s.location}</div>}
                        {s.cleaningArrangement && <div className="flex items-center gap-2 text-foreground"><Sparkles className="h-3.5 w-3.5 text-brand" /> <span><strong className="font-medium">Arranjo de limpeza:</strong> {s.cleaningArrangement}</span></div>}
                        {s.notes && <div className="text-xs italic mt-1">"{s.notes}"</div>}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button variant="ghost" size="icon" onClick={() => { setEditing(s); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => remove(s)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing?.id ? "Editar agendamento" : "Novo agendamento"}</DialogTitle></DialogHeader>
          {editing && <ScheduleForm initial={editing} onSave={save} onCancel={() => setOpen(false)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ScheduleForm({ initial, onSave, onCancel }: { initial: Schedule; onSave: (d: Omit<Schedule, "id">) => void; onCancel: () => void }) {
  const themes = useStore((s) => s.themes);
  const speakers = useStore((s) => s.speakers);
  const congs = useStore((s) => s.congregations);
  const [date, setDate] = useState(initial.date);
  const [themeNum, setThemeNum] = useState<number>(initial.themeNum);
  const [speakerId, setSpeakerId] = useState<string | undefined>(initial.speakerId);
  const [chairmanId, setChairmanId] = useState<string | undefined>(initial.chairmanId);
  const [congregationId, setCong] = useState<string | undefined>(initial.congregationId);
  const [location, setLocation] = useState(initial.location || "");
  const [cleaningArrangement, setCleaningArrangement] = useState(initial.cleaningArrangement || "");
  const [notes, setNotes] = useState(initial.notes || "");
  const [themeOpen, setThemeOpen] = useState(false);
  const theme = themes.find((t) => t.num === themeNum);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          date,
          themeNum,
          speakerId,
          chairmanId,
          congregationId,
          location: location.trim() || undefined,
          cleaningArrangement: cleaningArrangement.trim() || undefined,
          notes: notes.trim() || undefined,
        });
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2"><Label>Data</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></div>
        <div className="space-y-2">
          <Label>Tema</Label>
          <Popover open={themeOpen} onOpenChange={setThemeOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
                <span className="truncate">{theme ? `${theme.num}. ${theme.title}` : "Selecionar…"}</span>
                <ChevronsUpDown className="h-4 w-4 opacity-50 shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[400px]" align="start">
              <Command>
                <CommandInput placeholder="Buscar tema…" />
                <CommandList>
                  <CommandEmpty>Nenhum tema.</CommandEmpty>
                  <CommandGroup>
                    {themes.map((t) => (
                      <CommandItem key={t.num} value={`${t.num} ${t.title}`} onSelect={() => { setThemeNum(t.num); setThemeOpen(false); }}>
                        <Check className={cn("mr-2 h-4 w-4", themeNum === t.num ? "opacity-100" : "opacity-0")} />
                        <span className="font-mono text-xs w-8 text-muted-foreground">{t.num}</span>
                        <span className="truncate">{t.title}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Orador</Label>
          <Select value={speakerId ?? "none"} onValueChange={(v) => setSpeakerId(v === "none" ? undefined : v)}>
            <SelectTrigger><SelectValue placeholder="Selecionar…" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">— Nenhum —</SelectItem>
              {speakers.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Presidente</Label>
          <Select value={chairmanId ?? "none"} onValueChange={(v) => setChairmanId(v === "none" ? undefined : v)}>
            <SelectTrigger><SelectValue placeholder="Selecionar…" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">— Nenhum —</SelectItem>
              {speakers.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Congregação</Label>
          <Select value={congregationId ?? "none"} onValueChange={(v) => setCong(v === "none" ? undefined : v)}>
            <SelectTrigger><SelectValue placeholder="Selecionar…" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">— Nenhuma —</SelectItem>
              {congs.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2"><Label>Local / Salão</Label><Input value={location} onChange={(e) => setLocation(e.target.value)} maxLength={120} placeholder="Ex.: Salão Central" /></div>
      </div>

      <div className="space-y-2">
        <Label>Arranjo de limpeza</Label>
        <Input value={cleaningArrangement} onChange={(e) => setCleaningArrangement(e.target.value)} maxLength={200} placeholder="Ex.: Grupo 1 — antes e depois da reunião" />
      </div>

      <div className="space-y-2"><Label>Observações</Label><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={500} rows={2} /></div>

      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" className="bg-brand text-brand-foreground hover:bg-brand/90">Salvar</Button>
      </DialogFooter>
    </form>
  );
}
