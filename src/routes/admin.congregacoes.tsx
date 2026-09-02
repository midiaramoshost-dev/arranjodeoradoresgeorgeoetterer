import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { master, useMaster, type Congregation } from "@/lib/master-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, UserRound, Power } from "lucide-react";

export const Route = createFileRoute("/admin/congregacoes")({ component: Congregacoes });

function Congregacoes() {
  const congregacoes = useMaster((s) => s.congregacoes);
  const [editing, setEditing] = useState<Congregation | null>(null);
  const [open, setOpen] = useState(false);
  const startNew = () => { setEditing({ id: "", name: "", active: true, city: "", address: "", phone: "", meetingDay: "", notes: "", coordinator: "", serviceOverseer: "", secretary: "" }); setOpen(true); };
  const remove = (c: Congregation) => { if (confirm(`Remover ${c.name}?`)) master.remove("congregacoes", c.id); };
  return <div className="p-6 md:p-10 max-w-6xl mx-auto">
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6"><div><h1 className="font-display text-3xl">Congregações</h1><p className="text-muted-foreground mt-1">Libere congregações e defina seus responsáveis no painel master.</p></div><Button onClick={startNew} className="bg-brand text-brand-foreground hover:bg-brand/90"><Plus className="h-4 w-4 mr-2" /> Nova congregação</Button></div>
    {congregacoes.length === 0 ? <Card className="border-dashed"><CardContent className="py-16 text-center text-muted-foreground">Nenhuma congregação cadastrada.</CardContent></Card> : <div className="grid md:grid-cols-2 gap-4">{congregacoes.map((c) => <Card key={c.id} className={!c.active ? "opacity-65" : ""}><CardContent className="p-4"><div className="flex items-start gap-3"><div className="flex-1 min-w-0"><div className="flex items-center gap-2"><span className="font-medium truncate">{c.name}</span><span className={`text-[10px] uppercase font-semibold ${c.active ? "text-emerald-600" : "text-muted-foreground"}`}>{c.active ? "Liberada" : "Bloqueada"}</span></div><div className="text-xs text-muted-foreground mt-1">{c.city || "Cidade não informada"}{c.meetingDay && ` · ${c.meetingDay}`}</div><div className="mt-3 grid gap-1 text-xs"><div><b>Coordenador:</b> {c.coordinator || "Não definido"}</div><div><b>Superintendente de Serviço:</b> {c.serviceOverseer || "Não definido"}</div><div><b>Secretário:</b> {c.secretary || "Não definido"}</div></div></div><Button variant="ghost" size="icon" title="Alternar liberação" onClick={() => master.update("congregacoes", c.id, { active: !c.active })}><Power className={c.active ? "h-4 w-4 text-emerald-600" : "h-4 w-4"} /></Button><Button variant="ghost" size="icon" onClick={() => { setEditing(c); setOpen(true); }}><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => remove(c)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div></CardContent></Card>)}</div>}
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>{editing?.id ? "Editar congregação" : "Nova congregação"}</DialogTitle></DialogHeader>{editing && <CongForm initial={editing} onCancel={() => setOpen(false)} onSave={(data) => { if (editing.id) master.update("congregacoes", editing.id, data); else master.add("congregacoes", data); setOpen(false); }} />}</DialogContent></Dialog>
  </div>;
}

function CongForm({ initial, onSave, onCancel }: { initial: Congregation; onSave: (data: Omit<Congregation, "id">) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Omit<Congregation, "id">>({ ...initial });
  const set = (key: keyof Omit<Congregation, "id">, value: string | boolean) => setForm((f) => ({ ...f, [key]: value }));
  const field = (key: keyof Omit<Congregation, "id">, label: string, placeholder?: string) => <div className="space-y-2"><Label>{label}</Label><Input value={String(form[key] || "")} placeholder={placeholder} onChange={(e) => set(key, e.target.value)} /></div>;
  return <form onSubmit={(e) => { e.preventDefault(); if (form.name.trim()) onSave({ ...form, name: form.name.trim() }); }} className="space-y-4">
    {field("name", "Nome *", "Ex.: Congregação Central")}<div className="grid sm:grid-cols-2 gap-4">{field("city", "Cidade")}{field("phone", "Telefone")}</div>{field("address", "Endereço")}{field("meetingDay", "Dias e horários das reuniões", "Ex.: Terças e quintas, às 19h30")}
    <div className="rounded-lg border bg-muted/30 p-3 space-y-3"><div className="flex items-center gap-2 font-medium text-sm"><UserRound className="h-4 w-4" /> Responsáveis da congregação</div>{field("coordinator", "Coordenador")}{field("serviceOverseer", "Superintendente de Serviço")}{field("secretary", "Secretário")}</div>
    <div className="flex items-center gap-2"><input id="active" type="checkbox" checked={Boolean(form.active)} onChange={(e) => set("active", e.target.checked)} /><Label htmlFor="active">Congregação liberada para uso no app</Label></div><div className="space-y-2"><Label>Observações</Label><Textarea value={form.notes || ""} onChange={(e) => set("notes", e.target.value)} rows={3} /></div><DialogFooter><Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button><Button type="submit" className="bg-brand text-brand-foreground hover:bg-brand/90">Salvar</Button></DialogFooter>
  </form>;
}