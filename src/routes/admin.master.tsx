import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  useMaster,
  master,
  toCSV,
  downloadCSV,
  printHTML,
  smartMatch,
  type AgendaItem,
  type Theme,
  type Person,
} from "@/lib/master-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Download, Printer, Plus, Trash2, RotateCcw, Search } from "lucide-react";

export const Route = createFileRoute("/admin/master")({
  component: MasterPanel,
});

function escapeHTML(s: any): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* Hook: scrolls a newly created row into view & briefly highlights it */
function useFlashNew() {
  const [newId, setNewId] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!newId) return;
    const el = rootRef.current?.querySelector(`[data-row-id="${newId}"]`) as HTMLElement | null;
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-2", "ring-primary");
      const t = setTimeout(() => el.classList.remove("ring-2", "ring-primary"), 1800);
      return () => clearTimeout(t);
    }
  }, [newId]);
  return { newId, setNewId, rootRef };
}

function MasterPanel() {
  return (
    <div className="container mx-auto py-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold">Painel Master — Planilha</h1>
          <p className="text-sm text-muted-foreground">
            Conteúdo completo da planilha 2026. Edite, exclua, busque, exporte e imprima.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (confirm("Restaurar dados originais da planilha? Suas alterações serão perdidas."))
              master.reset();
          }}
        >
          <RotateCcw className="w-4 h-4 mr-1" /> Restaurar planilha
        </Button>
      </div>

      <Tabs defaultValue="agenda">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="agenda">Agenda</TabsTrigger>
          <TabsTrigger value="themes">Temas</TabsTrigger>
          <TabsTrigger value="locais">Oradores Locais</TabsTrigger>
          <TabsTrigger value="presidencia">Presidência</TabsTrigger>
          <TabsTrigger value="leitores">Leitores</TabsTrigger>
          <TabsTrigger value="search">Busca global</TabsTrigger>
        </TabsList>

        <TabsContent value="agenda"><AgendaTab /></TabsContent>
        <TabsContent value="themes"><ThemesTab /></TabsContent>
        <TabsContent value="locais"><PeopleTab listKey="oradoresLocais" label="Oradores Locais" withThemes /></TabsContent>
        <TabsContent value="presidencia"><PeopleTab listKey="presidencia" label="Presidência" /></TabsContent>
        <TabsContent value="leitores"><PeopleTab listKey="leitores" label="Leitores" /></TabsContent>
        <TabsContent value="search"><GlobalSearch /></TabsContent>
      </Tabs>
    </div>
  );
}

/* ----------------- AGENDA ----------------- */
function AgendaTab() {
  const agenda = useMaster((d) => d.agenda);
  const [q, setQ] = useState("");
  const [mes, setMes] = useState<string>("");
  const { newId, setNewId, rootRef } = useFlashNew();

  const meses = useMemo(() => Array.from(new Set(agenda.map((a) => a.mes))), [agenda]);
  const filtered = useMemo(
    () =>
      agenda.filter(
        (a) =>
          a.id === newId ||
          ((!mes || a.mes === mes) &&
            smartMatch(q, a.data, a.orador, a.tema, a.temaNum, a.congregacao, a.presidente, a.leitor, a.telefone, a.obs, a.mes)),
      ),
    [agenda, q, mes, newId],
  );

  const columns = [
    { key: "data", label: "Data" },
    { key: "temaNum", label: "Nº" },
    { key: "tema", label: "Tema" },
    { key: "orador", label: "Orador" },
    { key: "congregacao", label: "Congregação" },
    { key: "telefone", label: "Telefone" },
    { key: "presidente", label: "Presidente" },
    { key: "leitor", label: "Leitor" },
    { key: "obs", label: "Obs" },
  ];

  const doPrint = () => {
    const byMes = filtered.reduce<Record<string, AgendaItem[]>>((acc, a) => {
      (acc[a.mes || "Sem mês"] ||= []).push(a);
      return acc;
    }, {});
    const html = Object.entries(byMes)
      .map(([m, items]) => {
        const rows = items
          .map(
            (a) => `<tr>
              <td>${escapeHTML(a.data)}</td>
              <td style="text-align:center">${escapeHTML(a.temaNum)}</td>
              <td>${escapeHTML(a.tema)}</td>
              <td>${escapeHTML(a.orador)}</td>
              <td>${escapeHTML(a.congregacao)}</td>
              <td>${escapeHTML(a.telefone)}</td>
              <td>${escapeHTML(a.presidente)}</td>
              <td>${escapeHTML(a.leitor)}</td>
              <td>${escapeHTML(a.obs)}</td>
            </tr>`,
          )
          .join("");
        return `<h2>${escapeHTML(m)}</h2>
          <table>
            <colgroup>
              <col style="width:9%"><col style="width:5%"><col style="width:22%"><col style="width:14%">
              <col style="width:14%"><col style="width:9%"><col style="width:11%"><col style="width:9%"><col style="width:7%">
            </colgroup>
            <thead><tr>${columns.map((c) => `<th>${c.label}</th>`).join("")}</tr></thead>
            <tbody>${rows}</tbody>
          </table>`;
      })
      .join("");
    printHTML(`Agenda 2026 ${mes ? "— " + mes : ""}`, html);
  };

  const onAdd = () => {
    setQ("");
    const id = master.add("agenda", {
      mes: mes || "Janeiro 2026",
      data: "",
      orador: "",
      tema: "",
      temaNum: "",
      congregacao: "",
      telefone: "",
      presidente: "",
      leitor: "",
      obs: "",
    });
    setNewId(id);
  };

  return (
    <div className="space-y-3" ref={rootRef}>
      <Toolbar
        q={q}
        setQ={setQ}
        placeholder="Buscar em data, orador, tema, congregação, presidente, leitor... (várias palavras = AND)"
        onCSV={() => downloadCSV(`agenda${mes ? "-" + mes : ""}.csv`, toCSV(filtered, [{ key: "mes", label: "Mês" }, ...columns]))}
        onPrint={doPrint}
        onAdd={onAdd}
        extra={
          <select
            className="h-9 rounded-md border bg-background px-2 text-sm"
            value={mes}
            onChange={(e) => setMes(e.target.value)}
          >
            <option value="">Todos os meses</option>
            {meses.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        }
      />
      <div className="text-xs text-muted-foreground">{filtered.length} de {agenda.length} designações</div>
      <div className="grid gap-3">
        {filtered.map((a) => (
          <Card key={a.id} data-row-id={a.id} className="p-3 space-y-2 transition-shadow">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <Field label="Mês" value={a.mes} onChange={(v) => master.update("agenda", a.id, { mes: v })} />
              <Field label="Data" value={a.data} onChange={(v) => master.update("agenda", a.id, { data: v })} />
              <Field label="Nº Tema" value={a.temaNum} onChange={(v) => master.update("agenda", a.id, { temaNum: v })} />
              <Field label="Telefone" value={a.telefone} onChange={(v) => master.update("agenda", a.id, { telefone: v })} />
              <Field label="Orador" value={a.orador} onChange={(v) => master.update("agenda", a.id, { orador: v })} />
              <Field label="Tema" value={a.tema} onChange={(v) => master.update("agenda", a.id, { tema: v })} className="md:col-span-3" />
              <Field label="Congregação" value={a.congregacao} onChange={(v) => master.update("agenda", a.id, { congregacao: v })} />
              <Field label="Presidente" value={a.presidente} onChange={(v) => master.update("agenda", a.id, { presidente: v })} />
              <Field label="Leitor" value={a.leitor} onChange={(v) => master.update("agenda", a.id, { leitor: v })} />
              <Field label="Obs" value={a.obs} onChange={(v) => master.update("agenda", a.id, { obs: v })} />
            </div>
            <div className="flex justify-end">
              <Button size="sm" variant="ghost" onClick={() => {
                if (confirm("Excluir esta designação?")) master.remove("agenda", a.id);
              }}>
                <Trash2 className="w-4 h-4 mr-1" /> Excluir
              </Button>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">Nenhum resultado. Limpe a busca ou clique em "Adicionar".</p>
        )}
      </div>
    </div>
  );
}

/* ----------------- THEMES ----------------- */
function ThemesTab() {
  const themes = useMaster((d) => d.themes);
  const [q, setQ] = useState("");
  const { newId, setNewId, rootRef } = useFlashNew();
  const filtered = useMemo(
    () => themes.filter((t) => t.id === newId || smartMatch(q, t.num, t.title, t.dateFeito, t.obs)),
    [themes, q, newId],
  );
  const columns = [
    { key: "num", label: "Nº" },
    { key: "title", label: "Tema" },
    { key: "dateFeito", label: "Data realizada" },
    { key: "obs", label: "Obs" },
  ];
  const doPrint = () => {
    const rows = filtered
      .map(
        (t) => `<tr>
          <td style="text-align:center">${escapeHTML(t.num)}</td>
          <td>${escapeHTML(t.title)}</td>
          <td style="text-align:center">${escapeHTML(t.dateFeito)}</td>
          <td>${escapeHTML(t.obs)}</td>
        </tr>`,
      )
      .join("");
    const html = `<table>
      <colgroup><col style="width:6%"><col style="width:64%"><col style="width:15%"><col style="width:15%"></colgroup>
      <thead><tr><th>Nº</th><th>Tema</th><th>Data realizada</th><th>Obs</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
    printHTML("Temas dos Discursos Públicos", html);
  };
  const onAdd = () => {
    setQ("");
    const maxNum = themes.reduce((m, t) => Math.max(m, t.num || 0), 0);
    const id = master.add("themes", { num: maxNum + 1, title: "", dateFeito: "", obs: "" } as Omit<Theme, "id">);
    setNewId(id);
  };
  return (
    <div className="space-y-3" ref={rootRef}>
      <Toolbar
        q={q}
        setQ={setQ}
        placeholder="Buscar por número, título, data..."
        onCSV={() => downloadCSV("temas.csv", toCSV(filtered, columns))}
        onPrint={doPrint}
        onAdd={onAdd}
      />
      <div className="text-xs text-muted-foreground">{filtered.length} de {themes.length} temas</div>
      <div className="grid gap-2">
        {filtered.map((t) => (
          <Card key={t.id} data-row-id={t.id} className="p-2 flex flex-wrap items-center gap-2 transition-shadow">
            <Input
              className="w-20"
              type="number"
              value={t.num}
              onChange={(e) => master.update("themes", t.id, { num: Number(e.target.value) })}
            />
            <Input
              className="flex-1 min-w-[240px]"
              placeholder="Título do tema"
              value={t.title}
              onChange={(e) => master.update("themes", t.id, { title: e.target.value })}
            />
            <Input
              className="w-40"
              placeholder="Data realizada"
              value={t.dateFeito || ""}
              onChange={(e) => master.update("themes", t.id, { dateFeito: e.target.value })}
            />
            <Input
              className="w-40"
              placeholder="Obs"
              value={t.obs || ""}
              onChange={(e) => master.update("themes", t.id, { obs: e.target.value })}
            />
            <Button size="icon" variant="ghost" onClick={() => {
              if (confirm("Excluir este tema?")) master.remove("themes", t.id);
            }}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">Nenhum tema encontrado.</p>
        )}
      </div>
    </div>
  );
}

/* ----------------- PEOPLE ----------------- */
function PeopleTab({
  listKey,
  label,
  withThemes,
}: {
  listKey: "oradoresLocais" | "presidencia" | "leitores";
  label: string;
  withThemes?: boolean;
}) {
  const list = useMaster((d) => d[listKey]) as Person[];
  const [q, setQ] = useState("");
  const { newId, setNewId, rootRef } = useFlashNew();
  const filtered = useMemo(
    () => list.filter((p) => p.id === newId || smartMatch(q, p.name, p.themes, p.phone, p.notes)),
    [list, q, newId],
  );
  const columns = withThemes
    ? [{ key: "name", label: "Nome" }, { key: "themes", label: "Temas" }]
    : [{ key: "name", label: "Nome" }];

  const doPrint = () => {
    const rows = filtered
      .map(
        (p: any) => `<tr>${columns.map((c) => `<td>${escapeHTML(p[c.key])}</td>`).join("")}</tr>`,
      )
      .join("");
    const html = `<table>
      <thead><tr>${columns.map((c) => `<th>${c.label}</th>`).join("")}</tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
    printHTML(label, html);
  };

  const onAdd = () => {
    setQ("");
    const id = master.add(listKey, { name: "", themes: "" } as any);
    setNewId(id);
  };

  return (
    <div className="space-y-3" ref={rootRef}>
      <Toolbar
        q={q}
        setQ={setQ}
        placeholder={`Buscar em ${label}...`}
        onCSV={() => downloadCSV(`${listKey}.csv`, toCSV(filtered, columns))}
        onPrint={doPrint}
        onAdd={onAdd}
      />
      <div className="text-xs text-muted-foreground">{filtered.length} de {list.length}</div>
      <div className="grid gap-2">
        {filtered.map((p) => (
          <Card key={p.id} data-row-id={p.id} className="p-2 flex flex-wrap items-center gap-2 transition-shadow">
            <Input
              className="flex-1 min-w-[200px]"
              placeholder="Nome"
              value={p.name}
              onChange={(e) => master.update(listKey, p.id, { name: e.target.value } as any)}
            />
            {withThemes && (
              <Input
                className="flex-1 min-w-[200px]"
                placeholder="Temas que apresenta"
                value={p.themes || ""}
                onChange={(e) => master.update(listKey, p.id, { themes: e.target.value } as any)}
              />
            )}
            <Button size="icon" variant="ghost" onClick={() => {
              if (confirm("Excluir este registro?")) master.remove(listKey, p.id);
            }}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">Nenhum registro encontrado.</p>
        )}
      </div>
    </div>
  );
}

/* ----------------- GLOBAL SEARCH ----------------- */
function GlobalSearch() {
  const d = useMaster((s) => s);
  const [q, setQ] = useState("");

  const agenda = !q
    ? []
    : d.agenda.filter((a) =>
        smartMatch(q, a.data, a.orador, a.tema, a.temaNum, a.congregacao, a.presidente, a.leitor, a.telefone, a.obs, a.mes),
      );
  const themes = !q ? [] : d.themes.filter((t) => smartMatch(q, t.num, t.title, t.dateFeito, t.obs));
  const locais = !q ? [] : d.oradoresLocais.filter((p) => smartMatch(q, p.name, p.themes));
  const pres = !q ? [] : d.presidencia.filter((p) => smartMatch(q, p.name));
  const lei = !q ? [] : d.leitores.filter((p) => smartMatch(q, p.name));

  const total = agenda.length + themes.length + locais.length + pres.length + lei.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          autoFocus
          placeholder='Busca inteligente: "joao 187", "fevereiro central", "permite maldade"...'
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      {!q && <p className="text-sm text-muted-foreground">Digite uma ou várias palavras. A busca ignora acentos e maiúsculas e exige que TODAS as palavras apareçam.</p>}
      {q && <p className="text-xs text-muted-foreground">{total} resultado(s) no total</p>}
      {q && (
        <div className="space-y-4">
          <Section title={`Agenda (${agenda.length})`}>
            {agenda.map((a) => (
              <Card key={a.id} className="p-2 text-sm">
                <b>{a.data}</b> — {a.mes} · {a.orador} · {a.temaNum && `Nº ${a.temaNum} `}{a.tema} · {a.congregacao}
                {a.presidente && ` · Pres: ${a.presidente}`}
                {a.leitor && ` · Leitor: ${a.leitor}`}
              </Card>
            ))}
          </Section>
          <Section title={`Temas (${themes.length})`}>
            {themes.map((t) => (
              <Card key={t.id} className="p-2 text-sm">
                <b>Nº {t.num}</b> — {t.title} {t.dateFeito && `· ${t.dateFeito}`}
              </Card>
            ))}
          </Section>
          <Section title={`Oradores Locais (${locais.length})`}>
            {locais.map((p) => (
              <Card key={p.id} className="p-2 text-sm">
                <b>{p.name}</b> {p.themes && `· Temas: ${p.themes}`}
              </Card>
            ))}
          </Section>
          <Section title={`Presidência (${pres.length})`}>
            {pres.map((p) => (
              <Card key={p.id} className="p-2 text-sm">{p.name}</Card>
            ))}
          </Section>
          <Section title={`Leitores (${lei.length})`}>
            {lei.map((p) => (
              <Card key={p.id} className="p-2 text-sm">{p.name}</Card>
            ))}
          </Section>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-semibold text-sm mb-1">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

/* ----------------- shared UI ----------------- */
function Field({
  label,
  value,
  onChange,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <label className={`flex flex-col text-xs gap-1 ${className || ""}`}>
      <span className="text-muted-foreground">{label}</span>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function Toolbar({
  q,
  setQ,
  placeholder,
  onCSV,
  onPrint,
  onAdd,
  extra,
}: {
  q: string;
  setQ: (v: string) => void;
  placeholder: string;
  onCSV: () => void;
  onPrint: () => void;
  onAdd: () => void;
  extra?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap gap-2 items-center sticky top-0 bg-background z-10 py-2 border-b">
      <div className="flex items-center gap-1 flex-1 min-w-[220px]">
        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
        <Input placeholder={placeholder} value={q} onChange={(e) => setQ(e.target.value)} />
        {q && (
          <Button size="sm" variant="ghost" onClick={() => setQ("")}>Limpar</Button>
        )}
      </div>
      {extra}
      <Button size="sm" onClick={onAdd}>
        <Plus className="w-4 h-4 mr-1" /> Adicionar
      </Button>
      <Button size="sm" variant="outline" onClick={onCSV}>
        <Download className="w-4 h-4 mr-1" /> CSV
      </Button>
      <Button size="sm" variant="outline" onClick={onPrint}>
        <Printer className="w-4 h-4 mr-1" /> Imprimir
      </Button>
    </div>
  );
}
