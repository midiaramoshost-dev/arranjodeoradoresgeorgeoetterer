import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { actions, useStore, type Speaker } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, User } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/oradores")({
  component: Oradores,
});

function Oradores() {
  const speakers = useStore((s) => s.speakers);
  const congs = useStore((s) => s.congregations);
  const schedules = useStore((s) => s.schedules);
  const [editing, setEditing] = useState<Speaker | null>(null);
  const [open, setOpen] = useState(false);

  const startNew = () => { setEditing({ id: "", name: "", congregationId: undefined, phone: "" }); setOpen(true); };
  const startEdit = (s: Speaker) => { setEditing(s); setOpen(true); };

  const save = (data: Omit<Speaker, "id">) => {
    if (!data.name.trim()) { toast.error("Nome obrigatório"); return; }
    if (editing?.id) actions.updateSpeaker(editing.id, data);
    else actions.addSpeaker(data);
    toast.success("Salvo");
    setOpen(false);
  };

  const remove = (s: Speaker) => {
    if (!confirm(`Remover ${s.name}?`)) return;
    actions.deleteSpeaker(s.id);
    toast.success("Removido");
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl">Oradores</h1>
          <p className="text-muted-foreground mt-1">{speakers.length} cadastrado(s).</p>
        </div>
        <Button onClick={startNew} className="bg-brand text-brand-foreground hover:bg-brand/90"><Plus className="h-4 w-4 mr-2" /> Novo orador</Button>
      </div>

      {speakers.length === 0 ? (
        <Card className="border-dashed"><CardContent className="py-16 text-center text-muted-foreground">
          <User className="h-10 w-10 mx-auto opacity-40" />
          <p className="mt-3">Nenhum orador cadastrado.</p>
        </CardContent></Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {speakers.map((s) => {
            const co = congs.find((c) => c.id === s.congregationId);
            const count = schedules.filter((x) => x.speakerId === s.id).length;
            return (
              <Card key={s.id}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent text-accent-foreground grid place-items-center font-medium">
                    {s.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{s.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {co?.name || "Sem congregação"}{s.phone ? ` · ${s.phone}` : ""} · {count} discurso(s)
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => startEdit(s)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(s)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.id ? "Editar orador" : "Novo orador"}</DialogTitle></DialogHeader>
          {editing && <SpeakerForm initial={editing} congs={congs} onSave={save} onCancel={() => setOpen(false)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SpeakerForm({ initial, congs, onSave, onCancel }: { initial: Speaker; congs: { id: string; name: string }[]; onSave: (d: Omit<Speaker, "id">) => void; onCancel: () => void }) {
  const [name, setName] = useState(initial.name);
  const [congregationId, setCong] = useState<string | undefined>(initial.congregationId);
  const [phone, setPhone] = useState(initial.phone || "");
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ name: name.trim(), congregationId, phone: phone.trim() || undefined }); }} className="space-y-4">
      <div className="space-y-2"><Label>Nome</Label><Input value={name} onChange={(e) => setName(e.target.value)} maxLength={120} autoFocus /></div>
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
      <div className="space-y-2"><Label>Telefone (opcional)</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={30} /></div>
      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" className="bg-brand text-brand-foreground hover:bg-brand/90">Salvar</Button>
      </DialogFooter>
    </form>
  );
}
