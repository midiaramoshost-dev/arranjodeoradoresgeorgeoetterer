import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx-js-style";
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
import { Download, Printer, Plus, Trash2, RotateCcw, Search, FileSpreadsheet, Eye } from "lucide-react";

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
const agendaRows = [
  { key: "orador", label: "ORADOR" },
  { key: "tema", label: "TEMA" },
  { key: "congregacao", label: "CONGR" },
  { key: "presidente", label: "PRESIDENTE" },
  { key: "leitor", label: "LEITOR W" },
] as const;

type AgendaFormat = "sheet" | "cards";

function agendaLabelFor(row: (typeof agendaRows)[number], item: AgendaItem) {
  return row.key === "leitor" && item.obs ? item.obs : row.label;
}

function agendaValueFor(row: (typeof agendaRows)[number], item: AgendaItem) {
  return item[row.key] || "";
}

function monthKeyFromItem(item: AgendaItem) {
  return item.mes || "Sem mês";
}

function normalizeMonthLabel(label: string) {
  return label.trim().replace(/\s+/g, " ");
}

function buildAgendaPrintHTML(items: AgendaItem[]) {
  const rows = items
    .map((item) => {
      const body = agendaRows
        .map((row) => {
          const highlighted = Boolean(item.obs && (row.key === "orador" || row.key === "tema" || row.key === "congregacao" || row.key === "presidente" || row.key === "leitor"));
          const label = escapeHTML(agendaLabelFor(row, item));
          const value = escapeHTML(agendaValueFor(row, item));
          return `<tr class="${highlighted ? "highlight" : ""}"><td class="label">${label}</td><td class="value ${row.key === "tema" ? "theme" : ""}">${value}</td></tr>`;
        })
        .join("");
      return `<tbody class="date-block"><tr><th colspan="2" class="date ${item.obs ? "highlight" : ""}">${escapeHTML(item.data)}</th></tr>${body}</tbody>`;
    })
    .join("");

  return `<table class="agenda-model"><colgroup><col style="width:22%"><col style="width:78%"></colgroup>${rows}</table>`;
}

function previewAgenda(items: AgendaItem[], title: string) {
  printHTML(title, buildAgendaPrintHTML(items), "agenda");
}

function exportAgendaXLSX(items: AgendaItem[], filename: string) {
  const sheetData: string[][] = [];
  const merges: XLSX.Range[] = [];
  const headerRows = new Set<number>();
  const highlightRows = new Set<number>();
  const themeRows = new Set<number>();

  items.forEach((item) => {
    const headerIndex = sheetData.length;
    sheetData.push([item.data, ""]);
    merges.push({ s: { r: headerIndex, c: 0 }, e: { r: headerIndex, c: 1 } });
    headerRows.add(headerIndex);
    if (item.obs) highlightRows.add(headerIndex);

    agendaRows.forEach((row) => {
      const rowIndex = sheetData.length;
      sheetData.push([agendaLabelFor(row, item), agendaValueFor(row, item)]);
      if (item.obs) highlightRows.add(rowIndex);
      if (row.key === "tema") themeRows.add(rowIndex);
    });
  });

  const ws = XLSX.utils.aoa_to_sheet(sheetData);
  ws["!merges"] = merges;
  ws["!cols"] = [{ wch: 22 }, { wch: 70 }];
  ws["!rows"] = sheetData.map((_, i) => ({ hpt: headerRows.has(i) ? 18 : 16 }));
  ws["!margins"] = { left: 0.2, right: 0.2, top: 0.25, bottom: 0.25, header: 0.1, footer: 0.1 };

  const range = XLSX.utils.decode_range(ws["!ref"] || "A1:B1");
  for (let r = range.s.r; r <= range.e.r; r += 1) {
    for (let c = range.s.c; c <= range.e.c; c += 1) {
      const ref = XLSX.utils.encode_cell({ r, c });
      if (!ws[ref]) ws[ref] = { t: "s", v: "" };
      const isHeader = headerRows.has(r);
      const isHighlight = highlightRows.has(r);
      const isTheme = themeRows.has(r);
      ws[ref].s = {
        font: { name: "Arial", sz: isHeader ? 10 : 9, bold: isHeader || isTheme },
        alignment: { horizontal: isHeader || c === 0 ? "center" : "center", vertical: "center", wrapText: true },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
        fill: isHeader
          ? { patternType: "solid", fgColor: { rgb: isHighlight ? "F6A000" : "BFBFBF" } }
          : isHighlight && c === 0
            ? { patternType: "solid", fgColor: { rgb: "F6A000" } }
            : undefined,
      };
    }
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Agenda");
  XLSX.writeFile(wb, filename);
}

function AgendaTab() {
  const agenda = useMaster((d) => d.agenda);
  const [q, setQ] = useState("");
  const [mes, setMes] = useState<string>("");
  const [format, setFormat] = useState<AgendaFormat>("sheet");
  const { newId, setNewId, rootRef } = useFlashNew();

  const meses = useMemo(() => Array.from(new Set(agenda.map((a) => normalizeMonthLabel(monthKeyFromItem(a))))), [agenda]);
  const filtered = useMemo(
    () =>
      agenda.filter(
        (a) =>
          a.id === newId ||
          ((!mes || normalizeMonthLabel(monthKeyFromItem(a)) === mes) &&
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

  const onAdd = () => {
    setQ("");
    const id = master.add("agenda", {
      mes: mes || "Fevereiro 2026",
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
        placeholder="Buscar em data, orador, tema, congregação, presidente, leitor..."
        onCSV={() => downloadCSV(`agenda${mes ? "-" + mes : ""}.csv`, toCSV(filtered, [{ key: "mes", label: "Mês" }, ...columns]))}
        onPrint={() => previewAgenda(filtered, `Agenda 2026${mes ? " — " + mes : ""}`)}
        onXLSX={() => exportAgendaXLSX(filtered, `agenda${mes ? "-" + mes : ""}.xlsx`)}
        onAdd={onAdd}
        extra={
          <>
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
            <div className="flex rounded-md border bg-background p-0.5">
              <button
                type="button"
                className={`px-2.5 py-1 text-xs rounded ${format === "sheet" ? "bg-accent font-medium" : "text-muted-foreground"}`}
                onClick={() => setFormat("sheet")}
              >
                Planilha
              </button>
              <button
                type="button"
                className={`px-2.5 py-1 text-xs rounded ${format === "cards" ? "bg-accent font-medium" : "text-muted-foreground"}`}
                onClick={() => setFormat("cards")}
              >
                Editar
              </button>
            </div>
          </>
        }
      />
      <div className="text-xs text-muted-foreground">{filtered.length} de {agenda.length} designações</div>

      {format === "sheet" ? (
        <div className="overflow-x-auto rounded-md border bg-card p-2">
          <table className="w-full min-w-[620px] border-collapse text-[12px] text-foreground">
            <colgroup><col className="w-[22%]" /><col className="w-[78%]" /></colgroup>
            {filtered.map((a) => (
              <tbody key={a.id} data-row-id={a.id} className="transition-shadow">
                <tr>
                  <td colSpan={2} className={`border border-black px-2 py-0.5 text-center font-bold ${a.obs ? "bg-[#f6a000]" : "bg-[#bfbfbf]"}`}>
                    <InlineCell value={a.data} onChange={(v) => master.update("agenda", a.id, { data: v })} className="font-bold text-center" />
                  </td>
                </tr>
                {agendaRows.map((row) => {
                  const highlighted = Boolean(a.obs && (row.key === "orador" || row.key === "tema" || row.key === "congregacao" || row.key === "presidente" || row.key === "leitor"));
                  return (
                    <tr key={row.key}>
                      <td className={`border border-black px-2 py-0.5 text-center ${highlighted ? "bg-[#f6a000]" : "bg-card"}`}>
                        {row.key === "leitor" && a.obs ? (
                          <InlineCell value={a.obs} onChange={(v) => master.update("agenda", a.id, { obs: v })} className="text-center" />
                        ) : (
                          agendaLabelFor(row, a)
                        )}
                      </td>
                      <td className={`border border-black px-2 py-0.5 text-center ${row.key === "tema" ? "font-bold" : ""}`}>
                        <InlineCell
                          value={agendaValueFor(row, a)}
                          onChange={(v) => master.update("agenda", a.id, { [row.key]: v } as Partial<AgendaItem>)}
                          className={row.key === "tema" ? "font-bold text-center" : "text-center"}
                        />
                      </td>
                    </tr>
                  );
                })}
                <tr className="print:hidden">
                  <td colSpan={2} className="border border-black bg-muted/30 px-2 py-1 text-right">
                    <Button size="sm" variant="ghost" onClick={() => {
                      if (confirm("Excluir esta designação?")) master.remove("agenda", a.id);
                    }}>
                      <Trash2 className="w-4 h-4 mr-1" /> Excluir
                    </Button>
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">Nenhum resultado. Limpe a busca ou clique em "Adicionar".</p>
          )}
        </div>
      ) : (
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
                <Field label="Discurso final / obs" value={a.obs} onChange={(v) => master.update("agenda", a.id, { obs: v })} />
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
      )}
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

function InlineCell({ value, onChange, className }: { value: string; onChange: (v: string) => void; className?: string }) {
  return (
    <input
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className={`h-5 w-full min-w-0 border-0 bg-transparent p-0 text-[12px] leading-none outline-none focus:bg-background focus:ring-1 focus:ring-ring ${className || ""}`}
    />
  );
}

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
  onXLSX,
  onAdd,
  extra,
}: {
  q: string;
  setQ: (v: string) => void;
  placeholder: string;
  onCSV: () => void;
  onPrint: () => void;
  onXLSX?: () => void;
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
      {onXLSX && (
        <Button size="sm" variant="outline" onClick={onXLSX}>
          <FileSpreadsheet className="w-4 h-4 mr-1" /> XLSX
        </Button>
      )}
      <Button size="sm" variant="outline" onClick={onPrint}>
        <Printer className="w-4 h-4 mr-1" /> Imprimir
      </Button>
    </div>
  );
}
