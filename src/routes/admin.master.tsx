import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  useMaster,
  master,
  toCSV,
  downloadCSV,
  printHTML,
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

function matches(q: string, ...fields: (string | number | undefined | null)[]) {
  if (!q) return true;
  const s = q.toLowerCase();
  return fields.some((f) => String(f ?? "").toLowerCase().includes(s));
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
        <TabsList>
          <TabsTrigger value="agenda">Agenda</TabsTrigger>
          <TabsTrigger value="themes">Temas (194)</TabsTrigger>
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

  const meses = useMemo(() => Array.from(new Set(agenda.map((a) => a.mes))), [agenda]);
  const filtered = useMemo(
    () =>
      agenda.filter(
        (a) =>
          (!mes || a.mes === mes) &&
          matches(q, a.data, a.orador, a.tema, a.temaNum, a.congregacao, a.presidente, a.leitor, a.telefone, a.obs),
      ),
    [agenda, q, mes],
  );

  const columns = [
    { key: "mes", label: "Mês" },
    { key: "data", label: "Data" },
    { key: "orador", label: "Orador" },
    { key: "temaNum", label: "Nº" },
    { key: "tema", label: "Tema" },
    { key: "congregacao", label: "Congregação" },
    { key: "telefone", label: "Telefone" },
    { key: "presidente", label: "Presidente" },
    { key: "leitor", label: "Leitor" },
    { key: "obs", label: "Obs" },
  ];

  const doPrint = () => {
    const byMes = filtered.reduce<Record<string, AgendaItem[]>>((acc, a) => {
      (acc[a.mes] ||= []).push(a);
      return acc;
    }, {});
    const html = Object.entries(byMes)
      .map(
        ([m, items]) => `<h2>${m}</h2>` +
          items
            .map(
              (a) => `<div class="card">
              <div class="row"><b>Data:</b> ${a.data}</div>
              <div class="row"><b>Orador:</b> ${a.orador} ${a.telefone ? `— ${a.telefone}` : ""}</div>
              <div class="row"><b>Tema:</b> ${a.temaNum ? `Nº ${a.temaNum} — ` : ""}${a.tema}</div>
              <div class="row"><b>Congregação:</b> ${a.congregacao}</div>
              <div class="row"><b>Presidente:</b> ${a.presidente}</div>
              <div class="row"><b>Leitor:</b> ${a.leitor}</div>
              ${a.obs ? `<div class="row"><b>Obs:</b> ${a.obs}</div>` : ""}
            </div>`,
            )
            .join(""),
      )
      .join("");
    printHTML(`Agenda 2026 ${mes ? "— " + mes : ""}`, html);
  };

  return (
    <div className="space-y-3">
      <Toolbar
        q={q}
        setQ={setQ}
        placeholder="Buscar em data, orador, tema, congregação, presidente, leitor..."
        onCSV={() => downloadCSV(`agenda${mes ? "-" + mes : ""}.csv`, toCSV(filtered, columns))}
        onPrint={doPrint}
        onAdd={() =>
          master.add("agenda", {
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
          })
        }
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
          <Card key={a.id} className="p-3 space-y-2">
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
              <Button size="sm" variant="ghost" onClick={() => master.remove("agenda", a.id)}>
                <Trash2 className="w-4 h-4 mr-1" /> Excluir
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ----------------- THEMES ----------------- */
function ThemesTab() {
  const themes = useMaster((d) => d.themes);
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () => themes.filter((t) => matches(q, t.num, t.title, t.dateFeito, t.obs)),
    [themes, q],
  );
  const columns = [
    { key: "num", label: "Nº" },
    { key: "title", label: "Tema" },
    { key: "dateFeito", label: "Data realizada" },
    { key: "obs", label: "Obs" },
  ];
  const doPrint = () => {
    const html = `<table><thead><tr><th>Nº</th><th>Tema</th><th>Data realizada</th><th>Obs</th></tr></thead><tbody>${filtered
      .map((t) => `<tr><td>${t.num}</td><td>${t.title}</td><td>${t.dateFeito ?? ""}</td><td>${t.obs ?? ""}</td></tr>`)
      .join("")}</tbody></table>`;
    printHTML("Temas dos Discursos Públicos", html);
  };
  return (
    <div className="space-y-3">
      <Toolbar
        q={q}
        setQ={setQ}
        placeholder="Buscar por número ou título..."
        onCSV={() => downloadCSV("temas.csv", toCSV(filtered, columns))}
        onPrint={doPrint}
        onAdd={() => master.add("themes", { num: (themes.at(-1)?.num ?? 0) + 1, title: "", dateFeito: "", obs: "" } as Omit<Theme, "id">)}
      />
      <div className="text-xs text-muted-foreground">{filtered.length} de {themes.length} temas</div>
      <div className="grid gap-2">
        {filtered.map((t) => (
          <Card key={t.id} className="p-2 flex items-center gap-2">
            <Input
              className="w-20"
              type="number"
              value={t.num}
              onChange={(e) => master.update("themes", t.id, { num: Number(e.target.value) })}
            />
            <Input
              className="flex-1"
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
            <Button size="icon" variant="ghost" onClick={() => master.remove("themes", t.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </Card>
        ))}
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
  const filtered = useMemo(
    () => list.filter((p) => matches(q, p.name, p.themes, p.phone, p.notes)),
    [list, q],
  );
  const columns = withThemes
    ? [
        { key: "name", label: "Nome" },
        { key: "themes", label: "Temas" },
      ]
    : [{ key: "name", label: "Nome" }];

  const doPrint = () => {
    const html = `<table><thead><tr>${columns.map((c) => `<th>${c.label}</th>`).join("")}</tr></thead><tbody>${filtered
      .map((p: any) => `<tr>${columns.map((c) => `<td>${p[c.key] ?? ""}</td>`).join("")}</tr>`)
      .join("")}</tbody></table>`;
    printHTML(label, html);
  };

  return (
    <div className="space-y-3">
      <Toolbar
        q={q}
        setQ={setQ}
        placeholder={`Buscar em ${label}...`}
        onCSV={() => downloadCSV(`${listKey}.csv`, toCSV(filtered, columns))}
        onPrint={doPrint}
        onAdd={() => master.add(listKey, { name: "", themes: "" } as any)}
      />
      <div className="text-xs text-muted-foreground">{filtered.length} de {list.length}</div>
      <div className="grid gap-2">
        {filtered.map((p) => (
          <Card key={p.id} className="p-2 flex items-center gap-2">
            <Input
              className="flex-1"
              placeholder="Nome"
              value={p.name}
              onChange={(e) => master.update(listKey, p.id, { name: e.target.value } as any)}
            />
            {withThemes && (
              <Input
                className="flex-1"
                placeholder="Temas que apresenta"
                value={p.themes || ""}
                onChange={(e) => master.update(listKey, p.id, { themes: e.target.value } as any)}
              />
            )}
            <Button size="icon" variant="ghost" onClick={() => master.remove(listKey, p.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </Card>
        ))}
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
        matches(q, a.data, a.orador, a.tema, a.temaNum, a.congregacao, a.presidente, a.leitor, a.telefone, a.obs, a.mes),
      );
  const themes = !q ? [] : d.themes.filter((t) => matches(q, t.num, t.title, t.dateFeito, t.obs));
  const locais = !q ? [] : d.oradoresLocais.filter((p) => matches(q, p.name, p.themes));
  const pres = !q ? [] : d.presidencia.filter((p) => matches(q, p.name));
  const lei = !q ? [] : d.leitores.filter((p) => matches(q, p.name));

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          autoFocus
          placeholder="Buscar em tudo: temas, oradores, leitores, presidentes, datas, congregações, telefones..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      {!q && <p className="text-sm text-muted-foreground">Digite algo para buscar em todo o conteúdo.</p>}
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
    <div className="flex flex-wrap gap-2 items-center">
      <div className="flex items-center gap-1 flex-1 min-w-[220px]">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input placeholder={placeholder} value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {extra}
      <Button size="sm" variant="outline" onClick={onAdd}>
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
