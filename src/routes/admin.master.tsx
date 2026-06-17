import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { AuthGate } from "@/components/auth-gate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, RotateCcw } from "lucide-react";
import { master, useMaster, type MasterDB } from "@/lib/master-store";

export const Route = createFileRoute("/admin/master")({
  component: () => (
    <AuthGate>
      <AppShell>
        <Master />
      </AppShell>
    </AuthGate>
  ),
});

function Master() {
  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl">Painel Master</h1>
          <p className="text-sm text-muted-foreground">Conteúdo importado da planilha — edite ou exclua qualquer item.</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (confirm("Restaurar todos os dados da planilha original? Suas alterações serão perdidas.")) {
              master.reset();
              toast.success("Dados restaurados");
            }
          }}
        >
          <RotateCcw className="h-4 w-4 mr-2" /> Restaurar planilha
        </Button>
      </div>

      <Tabs defaultValue="agenda" className="w-full">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="agenda">Agenda</TabsTrigger>
          <TabsTrigger value="themes">Temas ({useMaster((s) => s.themes.length)})</TabsTrigger>
          <TabsTrigger value="speakers">Oradores</TabsTrigger>
          <TabsTrigger value="congs">Congregações</TabsTrigger>
          <TabsTrigger value="presidentes">Presidentes (Anciãos)</TabsTrigger>
          <TabsTrigger value="servos">Presidentes (Servos)</TabsTrigger>
          <TabsTrigger value="leitores">Leitores</TabsTrigger>
          <TabsTrigger value="locais">Oradores Locais</TabsTrigger>
        </TabsList>

        <TabsContent value="agenda" className="mt-4"><AgendaTable /></TabsContent>
        <TabsContent value="themes" className="mt-4"><ThemesTable /></TabsContent>
        <TabsContent value="speakers" className="mt-4">
          <PeopleTable listKey="speakers" labels={{ singular: "Orador", plural: "Oradores" }} withPhone />
        </TabsContent>
        <TabsContent value="congs" className="mt-4"><CongsTable /></TabsContent>
        <TabsContent value="presidentes" className="mt-4">
          <PeopleTable listKey="presidentes" labels={{ singular: "Presidente (Ancião)", plural: "Presidentes (Anciãos)" }} />
        </TabsContent>
        <TabsContent value="servos" className="mt-4">
          <PeopleTable listKey="servos" labels={{ singular: "Presidente (Servo)", plural: "Presidentes (Servos)" }} />
        </TabsContent>
        <TabsContent value="leitores" className="mt-4">
          <PeopleTable listKey="leitores" labels={{ singular: "Leitor", plural: "Leitores" }} />
        </TabsContent>
        <TabsContent value="locais" className="mt-4">
          <PeopleTable listKey="oradoresLocais" labels={{ singular: "Orador Local", plural: "Oradores Locais" }} withNotes />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ---------------- AGENDA ---------------- */
function AgendaTable() {
  const items = useMaster((s) => s.schedules);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<MasterDB["schedules"][number] | null>(null);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const t = q.toLowerCase().trim();
    const sorted = [...items].sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    if (!t) return sorted;
    return sorted.filter((s) =>
      [s.date, s.rawDate, s.orador, s.tema, s.congr, s.presidente, s.leitor, String(s.themeNum ?? "")]
        .join(" ").toLowerCase().includes(t),
    );
  }, [items, q]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center flex-wrap">
        <Input placeholder="Buscar por data, orador, tema..." value={q} onChange={(e) => setQ(e.target.value)} className="max-w-md" />
        <Button size="sm" onClick={() => { setEditing({ id: "", date: "", rawDate: "", orador: "", tema: "", themeNum: null, congr: "", presidente: "", leitor: "", phone: "", notes: "" }); setOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Nova designação
        </Button>
        <span className="text-sm text-muted-foreground ml-auto">{filtered.length} de {items.length}</span>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Orador</TableHead>
              <TableHead>Tema</TableHead>
              <TableHead>Congregação</TableHead>
              <TableHead>Presidente</TableHead>
              <TableHead>Leitor</TableHead>
              <TableHead className="w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="whitespace-nowrap text-xs">{s.date || s.rawDate}</TableCell>
                <TableCell>{s.orador}{s.phone ? <div className="text-xs text-muted-foreground">{s.phone}</div> : null}</TableCell>
                <TableCell><div className="max-w-xs">{s.themeNum ? <span className="text-muted-foreground mr-1">#{s.themeNum}</span> : null}{s.tema}</div></TableCell>
                <TableCell>{s.congr}</TableCell>
                <TableCell>{s.presidente}</TableCell>
                <TableCell>{s.leitor}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => { setEditing(s); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => { if (confirm("Excluir designação?")) { master.remove("schedules", s.id); toast.success("Excluído"); } }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!filtered.length && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Nada encontrado</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editing?.id ? "Editar designação" : "Nova designação"}</DialogTitle></DialogHeader>
          {editing && (
            <ScheduleForm
              initial={editing}
              onSave={(v) => {
                if (editing.id) master.update("schedules", editing.id, v);
                else master.add("schedules", v);
                setOpen(false);
                toast.success("Salvo");
              }}
              onCancel={() => setOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ScheduleForm({ initial, onSave, onCancel }: { initial: MasterDB["schedules"][number]; onSave: (v: any) => void; onCancel: () => void }) {
  const [f, setF] = useState(initial);
  const set = (k: keyof typeof f, v: any) => setF((s) => ({ ...s, [k]: v }));
  return (
    <form onSubmit={(e) => { e.preventDefault(); const { id: _, ...rest } = f; onSave(rest); }} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Data</Label><Input type="date" value={f.date} onChange={(e) => set("date", e.target.value)} /></div>
        <div><Label>Texto da data (opcional)</Label><Input value={f.rawDate || ""} onChange={(e) => set("rawDate", e.target.value)} placeholder="ex: Dom 03/JAN 2026" /></div>
        <div className="col-span-2"><Label>Orador</Label><Input value={f.orador} onChange={(e) => set("orador", e.target.value)} /></div>
        <div><Label>Telefone</Label><Input value={f.phone || ""} onChange={(e) => set("phone", e.target.value)} /></div>
        <div><Label>Nº Tema</Label><Input type="number" value={f.themeNum ?? ""} onChange={(e) => set("themeNum", e.target.value ? Number(e.target.value) : null)} /></div>
        <div className="col-span-2"><Label>Tema</Label><Input value={f.tema} onChange={(e) => set("tema", e.target.value)} /></div>
        <div className="col-span-2"><Label>Congregação</Label><Input value={f.congr} onChange={(e) => set("congr", e.target.value)} /></div>
        <div><Label>Presidente</Label><Input value={f.presidente} onChange={(e) => set("presidente", e.target.value)} /></div>
        <div><Label>Leitor</Label><Input value={f.leitor} onChange={(e) => set("leitor", e.target.value)} /></div>
        <div className="col-span-2"><Label>Observações</Label><Input value={f.notes || ""} onChange={(e) => set("notes", e.target.value)} /></div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Salvar</Button>
      </DialogFooter>
    </form>
  );
}

/* ---------------- THEMES ---------------- */
function ThemesTable() {
  const items = useMaster((s) => s.themes);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<MasterDB["themes"][number] | null>(null);
  const [open, setOpen] = useState(false);
  const filtered = useMemo(() => {
    const t = q.toLowerCase().trim();
    const sorted = [...items].sort((a, b) => a.num - b.num);
    if (!t) return sorted;
    return sorted.filter((x) => String(x.num).includes(t) || x.title.toLowerCase().includes(t));
  }, [items, q]);
  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center flex-wrap">
        <Input placeholder="Buscar por nº ou título..." value={q} onChange={(e) => setQ(e.target.value)} className="max-w-md" />
        <Button size="sm" onClick={() => { setEditing({ id: "", num: 0, title: "" }); setOpen(true); }}><Plus className="h-4 w-4 mr-2" /> Novo tema</Button>
        <span className="text-sm text-muted-foreground ml-auto">{filtered.length} de {items.length}</span>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader><TableRow><TableHead className="w-20">Nº</TableHead><TableHead>Título</TableHead><TableHead className="w-24"></TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-mono">{t.num}</TableCell>
                <TableCell>{t.title}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => { setEditing(t); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => { if (confirm("Excluir tema?")) { master.remove("themes", t.id); toast.success("Excluído"); } }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.id ? "Editar tema" : "Novo tema"}</DialogTitle></DialogHeader>
          {editing && (
            <form onSubmit={(e) => {
              e.preventDefault();
              const { id, ...rest } = editing;
              if (!rest.num || !rest.title.trim()) return toast.error("Preencha nº e título");
              if (id) master.update("themes", id, rest); else master.add("themes", rest);
              setOpen(false); toast.success("Salvo");
            }} className="space-y-3">
              <div><Label>Nº</Label><Input type="number" value={editing.num || ""} onChange={(e) => setEditing({ ...editing, num: Number(e.target.value) })} /></div>
              <div><Label>Título</Label><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
              <DialogFooter><Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button><Button type="submit">Salvar</Button></DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------------- PEOPLE (generic) ---------------- */
function PeopleTable({
  listKey,
  labels,
  withPhone,
  withNotes,
}: {
  listKey: "speakers" | "presidentes" | "servos" | "leitores" | "oradoresLocais";
  labels: { singular: string; plural: string };
  withPhone?: boolean;
  withNotes?: boolean;
}) {
  const items = useMaster((s) => s[listKey]) as { id: string; name: string; phone?: string; notes?: string }[];
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<{ id: string; name: string; phone?: string; notes?: string } | null>(null);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const t = q.toLowerCase().trim();
    const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name));
    if (!t) return sorted;
    return sorted.filter((x) => x.name.toLowerCase().includes(t));
  }, [items, q]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center flex-wrap">
        <Input placeholder={`Buscar ${labels.plural.toLowerCase()}...`} value={q} onChange={(e) => setQ(e.target.value)} className="max-w-md" />
        <Button size="sm" onClick={() => { setEditing({ id: "", name: "", phone: "", notes: "" }); setOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Novo
        </Button>
        <span className="text-sm text-muted-foreground ml-auto">{filtered.length} de {items.length}</span>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              {withPhone && <TableHead>Telefone</TableHead>}
              {withNotes && <TableHead>Notas</TableHead>}
              <TableHead className="w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.name}</TableCell>
                {withPhone && <TableCell className="text-muted-foreground">{p.phone}</TableCell>}
                {withNotes && <TableCell className="text-muted-foreground text-sm">{p.notes}</TableCell>}
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => { setEditing(p); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => { if (confirm(`Excluir ${labels.singular.toLowerCase()}?`)) { master.remove(listKey, p.id); toast.success("Excluído"); } }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!filtered.length && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Nada encontrado</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.id ? `Editar ${labels.singular.toLowerCase()}` : `Novo ${labels.singular.toLowerCase()}`}</DialogTitle></DialogHeader>
          {editing && (
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!editing.name.trim()) return toast.error("Informe o nome");
              const { id, ...rest } = editing;
              const payload: any = { name: rest.name.trim() };
              if (withPhone) payload.phone = rest.phone || "";
              if (withNotes) payload.notes = rest.notes || "";
              if (id) master.update(listKey, id, payload); else master.add(listKey, payload);
              setOpen(false); toast.success("Salvo");
            }} className="space-y-3">
              <div><Label>Nome</Label><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
              {withPhone && <div><Label>Telefone</Label><Input value={editing.phone || ""} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} /></div>}
              {withNotes && <div><Label>Notas</Label><Input value={editing.notes || ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} /></div>}
              <DialogFooter><Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button><Button type="submit">Salvar</Button></DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------------- CONGREGATIONS ---------------- */
function CongsTable() {
  const items = useMaster((s) => s.congregations);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<MasterDB["congregations"][number] | null>(null);
  const [open, setOpen] = useState(false);
  const filtered = useMemo(() => {
    const t = q.toLowerCase().trim();
    const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name));
    if (!t) return sorted;
    return sorted.filter((x) => x.name.toLowerCase().includes(t));
  }, [items, q]);
  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center flex-wrap">
        <Input placeholder="Buscar congregações..." value={q} onChange={(e) => setQ(e.target.value)} className="max-w-md" />
        <Button size="sm" onClick={() => { setEditing({ id: "", name: "" }); setOpen(true); }}><Plus className="h-4 w-4 mr-2" /> Nova</Button>
        <span className="text-sm text-muted-foreground ml-auto">{filtered.length} de {items.length}</span>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead className="w-24"></TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.name}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => { setEditing(c); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => { if (confirm("Excluir congregação?")) { master.remove("congregations", c.id); toast.success("Excluído"); } }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.id ? "Editar congregação" : "Nova congregação"}</DialogTitle></DialogHeader>
          {editing && (
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!editing.name.trim()) return toast.error("Informe o nome");
              const { id, ...rest } = editing;
              if (id) master.update("congregations", id, rest); else master.add("congregations", rest);
              setOpen(false); toast.success("Salvo");
            }} className="space-y-3">
              <div><Label>Nome</Label><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
              <DialogFooter><Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button><Button type="submit">Salvar</Button></DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
