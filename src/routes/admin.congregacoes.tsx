import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { actions, useStore, type Congregation } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/congregacoes")({
  component: Congregacoes,
});

function Congregacoes() {
  const congs = useStore((s) => s.congregations);
  const speakers = useStore((s) => s.speakers);
  const [editing, setEditing] = useState<Congregation | null>(null);
  const [open, setOpen] = useState(false);

  const startNew = () => { setEditing({ id: "", name: "", city: "" }); setOpen(true); };

  const save = (data: Omit<Congregation, "id">) => {
    if (!data.name.trim()) { toast.error("Nome obrigatório"); return; }
    if (editing?.id) actions.updateCongregation(editing.id, data);
    else actions.addCongregation(data);
    toast.success("Salvo");
    setOpen(false);
  };

  const remove = (c: Congregation) => {
    if (!confirm(`Remover ${c.name}?`)) return;
    actions.deleteCongregation(c.id);
    toast.success("Removido");
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl">Congregações</h1>
          <p className="text-muted-foreground mt-1">{congs.length} cadastrada(s).</p>
        </div>
        <Button onClick={startNew} className="bg-brand text-brand-foreground hover:bg-brand/90"><Plus className="h-4 w-4 mr-2" /> Nova</Button>
      </div>

      {congs.length === 0 ? (
        <Card className="border-dashed"><CardContent className="py-16 text-center text-muted-foreground">
          <p>Nenhuma congregação cadastrada.</p>
        </CardContent></Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {congs.map((c) => {
            const count = speakers.filter((s) => s.congregationId === c.id).length;
            return (
              <Card key={c.id}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{c.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{c.city || "—"} · {count} orador(es)</div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => { setEditing(c); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(c)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.id ? "Editar congregação" : "Nova congregação"}</DialogTitle></DialogHeader>
          {editing && <CongForm initial={editing} onSave={save} onCancel={() => setOpen(false)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CongForm({ initial, onSave, onCancel }: { initial: Congregation; onSave: (d: Omit<Congregation, "id">) => void; onCancel: () => void }) {
  const [name, setName] = useState(initial.name);
  const [city, setCity] = useState(initial.city || "");
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ name: name.trim(), city: city.trim() || undefined }); }} className="space-y-4">
      <div className="space-y-2"><Label>Nome</Label><Input value={name} onChange={(e) => setName(e.target.value)} maxLength={120} autoFocus /></div>
      <div className="space-y-2"><Label>Cidade (opcional)</Label><Input value={city} onChange={(e) => setCity(e.target.value)} maxLength={120} /></div>
      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" className="bg-brand text-brand-foreground hover:bg-brand/90">Salvar</Button>
      </DialogFooter>
    </form>
  );
}
