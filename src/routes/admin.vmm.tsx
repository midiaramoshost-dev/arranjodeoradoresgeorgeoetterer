import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import * as XLSX from "xlsx-js-style";
import {
  useVMM,
  vmm,
  type VMMMonth,
  type Week,
  type Part,
  type SectionKey,
  type People,
} from "@/lib/vmm-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Plus, Trash2, Printer, FileSpreadsheet, Wand2, RotateCcw, ChevronDown, ChevronUp,
} from "lucide-react";

export const Route = createFileRoute("/admin/vmm")({
  component: VMMPanel,
});

/* ============ COLORS ============ */
const SECTION_COLORS: Record<SectionKey, { bg: string; bar: string; label: string }> = {
  tesouros:   { bg: "#DCE6F1", bar: "#3E7A94", label: "TESOUROS DA PALAVRA DE DEUS" },
  ministerio: { bg: "#FFF3D6", bar: "#D89A2C", label: "FAÇA SEU MELHOR NO MINISTÉRIO" },
  vidacrista: { bg: "#F8D7DA", bar: "#B44A5A", label: "NOSSA VIDA CRISTÃ" },
};

const HEADER_GREEN = "#C6E0B4";
const WEEK_HEADER = "#4F81BD";
const ROLE_ROW_BG = "#DDEBF7";

/* ============ COMPONENT ============ */
function VMMPanel() {
  const months = useVMM((s) => s.months);
  const people = useVMM((s) => s.people);
  const [activeId, setActiveId] = useState<string>("");
  const active = useMemo(
    () => months.find((m) => m.id === activeId) || months[0],
    [months, activeId],
  );

  return (
    <div className="container mx-auto py-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold">Nossa Vida e Ministério</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie designações mensais. Auto-designa sem repetir · exporte em XLSX/PDF.
          </p>
        </div>
        <Button
          variant="outline" size="sm"
          onClick={() => { if (confirm("Restaurar dados padrão?")) vmm.reset(); }}
        >
          <RotateCcw className="w-4 h-4 mr-1" /> Restaurar
        </Button>
      </div>

      <Card className="p-4 space-y-3">
        <div className="flex flex-wrap gap-2 items-end">
          <div className="flex-1 min-w-[260px]">
            <label className="text-xs text-muted-foreground">Mês</label>
            <select
              className="w-full h-9 px-2 rounded-md border bg-background"
              value={active?.id || ""}
              onChange={(e) => setActiveId(e.target.value)}
            >
              {months.map((m) => (
                <option key={m.id} value={m.id}>{m.title}</option>
              ))}
            </select>
          </div>
          <NewMonthButton />
          {active && (
            <>
              <Button
                variant="outline" size="sm"
                onClick={() => vmm.autoAssign(active.id, { onlyEmpty: true })}
              >
                <Wand2 className="w-4 h-4 mr-1" /> Preencher vazios
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  if (confirm("Gerar designações do mês? Substitui todos os nomes.")) {
                    vmm.autoAssign(active.id);
                  }
                }}
              >
                <Wand2 className="w-4 h-4 mr-1" /> Auto-designar mês
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportXLSX(active)}>
                <FileSpreadsheet className="w-4 h-4 mr-1" /> XLSX
              </Button>
              <Button variant="outline" size="sm" onClick={() => printMonth(active)}>
                <Printer className="w-4 h-4 mr-1" /> PDF
              </Button>
              <Button
                variant="destructive" size="sm"
                onClick={() => {
                  if (confirm(`Excluir ${active.title}?`)) {
                    vmm.removeMonth(active.id);
                    setActiveId("");
                  }
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </Card>

      {active && <MonthEditor month={active} />}

      <PeoplePools people={people} />
    </div>
  );
}

function NewMonthButton() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [weeksText, setWeeksText] = useState("");
  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Plus className="w-4 h-4 mr-1" /> Novo mês
      </Button>
    );
  }
  return (
    <div className="flex flex-wrap gap-2 items-end p-3 border rounded-md bg-muted/30 w-full">
      <div className="flex-1 min-w-[180px]">
        <label className="text-xs">Nome do mês</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="JULHO DE 2026" />
      </div>
      <div className="flex-[2] min-w-[280px]">
        <label className="text-xs">Semanas (uma por linha)</label>
        <textarea
          className="w-full min-h-[70px] rounded-md border p-2 text-sm bg-background"
          value={weeksText}
          onChange={(e) => setWeeksText(e.target.value)}
          placeholder={"SEMANA 6 A 12 DE JULHO\nSEMANA 13 A 19 DE JULHO\n..."}
        />
      </div>
      <Button
        size="sm"
        onClick={() => {
          if (!name.trim()) return;
          const labels = weeksText.split("\n").map((l) => l.trim()).filter(Boolean);
          if (!labels.length) return;
          vmm.addMonth(name.trim(), labels);
          setOpen(false); setName(""); setWeeksText("");
        }}
      >Criar</Button>
      <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
    </div>
  );
}

/* ============ MONTH EDITOR ============ */
function MonthEditor({ month }: { month: VMMMonth }) {
  return (
    <div className="space-y-3">
      <Card className="p-3 flex flex-wrap items-center gap-2" style={{ background: HEADER_GREEN }}>
        <input
          className="flex-1 min-w-[240px] bg-transparent font-bold italic text-lg outline-none"
          value={month.title}
          onChange={(e) => vmm.updateMonth(month.id, { title: e.target.value })}
        />
        <AddWeekButton monthId={month.id} />
      </Card>
      {month.weeks.map((w) => (
        <WeekEditor key={w.id} monthId={month.id} week={w} />
      ))}
    </div>
  );
}

function AddWeekButton({ monthId }: { monthId: string }) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  if (!open) {
    return (
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        <Plus className="w-4 h-4 mr-1" /> Semana
      </Button>
    );
  }
  return (
    <div className="flex gap-1 items-center">
      <Input
        className="h-8 w-56" placeholder="SEMANA ... DE MÊS"
        value={label} onChange={(e) => setLabel(e.target.value)}
      />
      <Button
        size="sm"
        onClick={() => { if (label.trim()) { vmm.addWeek(monthId, label.trim()); setOpen(false); setLabel(""); } }}
      >OK</Button>
      <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>x</Button>
    </div>
  );
}

function WeekEditor({ monthId, week }: { monthId: string; week: Week }) {
  const [collapsed, setCollapsed] = useState(false);
  const partsBySection = useMemo(() => {
    const groups: Record<SectionKey, Part[]> = { tesouros: [], ministerio: [], vidacrista: [] };
    week.parts.forEach((p) => {
      const s = (p as any).section as SectionKey | undefined;
      const guess: SectionKey = s || guessSection(p);
      groups[guess].push(p);
    });
    return groups;
  }, [week.parts]);

  return (
    <Card className="overflow-hidden">
      <div
        className="px-3 py-2 flex items-center gap-2 text-white font-semibold"
        style={{ background: WEEK_HEADER }}
      >
        <button onClick={() => setCollapsed((c) => !c)} className="opacity-80 hover:opacity-100">
          {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
        <input
          className="flex-1 bg-transparent outline-none"
          value={week.label}
          onChange={(e) => vmm.updateWeek(monthId, week.id, { label: e.target.value })}
        />
        <Button
          size="sm" variant="ghost" className="text-white hover:bg-white/20"
          onClick={() => { if (confirm(`Excluir ${week.label}?`)) vmm.removeWeek(monthId, week.id); }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {!collapsed && (
        <div className="p-3 space-y-2">
          <RoleRow label="PRESIDENTE" value={week.presidente}
            onChange={(v) => vmm.updateWeek(monthId, week.id, { presidente: v })} />
          <RoleRow label="ORAÇÃO INICIAL" value={week.oracaoInicial}
            onChange={(v) => vmm.updateWeek(monthId, week.id, { oracaoInicial: v })} />

          {(["tesouros", "ministerio", "vidacrista"] as SectionKey[]).map((sec) => (
            <SectionBlock key={sec} section={sec} parts={partsBySection[sec]}
              monthId={monthId} weekId={week.id} />
          ))}

          <RoleRow label="LEITOR ESTUDO BÍBLICO" value={week.leitorEstudo}
            onChange={(v) => vmm.updateWeek(monthId, week.id, { leitorEstudo: v })} />
          <RoleRow label="ORAÇÃO FINAL" value={week.oracaoFinal}
            onChange={(v) => vmm.updateWeek(monthId, week.id, { oracaoFinal: v })} />
        </div>
      )}
    </Card>
  );
}

function guessSection(p: Part): SectionKey {
  const t = p.title.toUpperCase();
  if (/TESOURO|JÓIA|JOIA|LEITURA DA BÍBLIA/.test(t)) return "tesouros";
  if (/INICIANDO|CULTIVANDO|FAZENDO|EXPLICANDO/.test(t)) return "ministerio";
  return "vidacrista";
}

function RoleRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid grid-cols-[220px_1fr] gap-2 items-center rounded-md px-2 py-1"
      style={{ background: ROLE_ROW_BG }}>
      <div className="text-xs font-bold uppercase">{label}</div>
      <Input className="h-8" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function SectionBlock({
  section, parts, monthId, weekId,
}: { section: SectionKey; parts: Part[]; monthId: string; weekId: string }) {
  const c = SECTION_COLORS[section];
  return (
    <div className="rounded-md overflow-hidden border">
      <div className="px-2 py-1 text-white text-xs font-bold uppercase" style={{ background: c.bar }}>
        {c.label}
      </div>
      <div className="p-2 space-y-1" style={{ background: c.bg }}>
        {parts.map((p) => (
          <div key={p.id} className="grid grid-cols-[40px_1fr_1fr_auto] gap-2 items-center">
            <Input className="h-8" value={p.num || ""} placeholder="#"
              onChange={(e) => vmm.updatePart(monthId, weekId, p.id, { num: e.target.value })} />
            <Input className="h-8 italic font-semibold uppercase" value={p.title}
              onChange={(e) => vmm.updatePart(monthId, weekId, p.id, { title: e.target.value })} />
            <div className="flex gap-1 items-center">
              <Input className="h-8" value={p.assignee}
                onChange={(e) => vmm.updatePart(monthId, weekId, p.id, { assignee: e.target.value })} />
              <label className="text-[10px] flex items-center gap-1 whitespace-nowrap">
                <input type="checkbox" checked={!!p.isPair}
                  onChange={(e) => vmm.updatePart(monthId, weekId, p.id, { isPair: e.target.checked })} />
                dupla
              </label>
            </div>
            <Button size="sm" variant="ghost"
              onClick={() => vmm.removePart(monthId, weekId, p.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button size="sm" variant="outline" className="mt-1"
          onClick={() => vmm.addPart(monthId, weekId, {
            title: "NOVA PARTE", assignee: "", role: "orador", section,
          } as any)}>
          <Plus className="w-4 h-4 mr-1" /> Adicionar parte
        </Button>
      </div>
    </div>
  );
}

/* ============ PEOPLE POOLS ============ */
function PeoplePools({ people }: { people: People }) {
  const pools: { key: keyof People; label: string }[] = [
    { key: "presidentes", label: "Presidentes" },
    { key: "oradores", label: "Oradores / Irmãos" },
    { key: "publicadoras", label: "Publicadoras (Ministério)" },
    { key: "leitoresEstudo", label: "Leitores do Estudo" },
    { key: "oracoes", label: "Orações (inicial/final)" },
  ];
  return (
    <Card className="p-4">
      <h2 className="font-semibold mb-3">Pessoas por função</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {pools.map((p) => <Pool key={p.key} pool={p.key} label={p.label} items={people[p.key]} />)}
      </div>
    </Card>
  );
}

function Pool({ pool, label, items }: { pool: keyof People; label: string; items: string[] }) {
  const [name, setName] = useState("");
  return (
    <div className="border rounded-md p-2">
      <div className="text-sm font-semibold mb-2">{label} <span className="text-xs text-muted-foreground">({items.length})</span></div>
      <div className="flex gap-1 mb-2">
        <Input className="h-8" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" />
        <Button size="sm" onClick={() => { if (name.trim()) { vmm.addPerson(pool, name.trim().toUpperCase()); setName(""); } }}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className="max-h-40 overflow-auto space-y-0.5">
        {items.map((n) => (
          <div key={n} className="flex justify-between items-center text-xs px-2 py-0.5 rounded hover:bg-muted">
            <span>{n}</span>
            <button className="text-destructive" onClick={() => vmm.removePerson(pool, n)}>
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============ EXPORTS ============ */
function escapeHTML(s: any) {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function printMonth(month: VMMMonth) {
  const weekBlocks = month.weeks.map((w) => {
    const rows: string[] = [];
    rows.push(`<tr><th colspan="3" class="wk">${escapeHTML(w.label)}</th></tr>`);
    rows.push(`<tr><td class="role"></td><td class="role">PRESIDENTE</td><td>${escapeHTML(w.presidente)}</td></tr>`);
    rows.push(`<tr><td class="role"></td><td class="role">ORAÇÃO INICIAL</td><td>${escapeHTML(w.oracaoInicial)}</td></tr>`);
    (["tesouros","ministerio","vidacrista"] as SectionKey[]).forEach((sec) => {
      const parts = w.parts.filter((p) => ((p as any).section || guessSection(p)) === sec);
      parts.forEach((p) => {
        rows.push(`<tr class="sec-${sec}"><td class="num">${escapeHTML(p.num || "")}</td><td class="title">${escapeHTML(p.title)}</td><td>${escapeHTML(p.assignee)}</td></tr>`);
      });
    });
    rows.push(`<tr><td class="role"></td><td class="role">LEITOR ESTUDO BÍBLICO</td><td>${escapeHTML(w.leitorEstudo)}</td></tr>`);
    rows.push(`<tr><td class="role"></td><td class="role">ORAÇÃO FINAL</td><td>${escapeHTML(w.oracaoFinal)}</td></tr>`);
    return `<table class="week">${rows.join("")}</table>`;
  }).join("");

  const html = `
  <div class="title-bar">${escapeHTML(month.title)}</div>
  ${weekBlocks}`;

  const w = window.open("", "_blank", "width=900,height=1100");
  if (!w) return;
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHTML(month.title)}</title>
  <style>
    @page{size:A4 portrait;margin:8mm}
    body{font-family:Arial,sans-serif;color:#111;font-size:11px;margin:0;padding:8px}
    .title-bar{background:${HEADER_GREEN};text-align:center;font-weight:bold;font-style:italic;padding:8px;margin-bottom:10px;border:1px solid #666}
    table.week{width:100%;border-collapse:collapse;margin-bottom:10px;table-layout:fixed}
    table.week td, table.week th{border:1px solid #000;padding:3px 6px;vertical-align:middle}
    table.week th.wk{background:${WEEK_HEADER};color:#fff;text-align:center;font-size:12px}
    table.week .role{background:${ROLE_ROW_BG};font-weight:bold;font-style:italic;text-transform:uppercase;width:35%}
    table.week .num{background:#7B2E36;color:#fff;text-align:center;font-weight:bold;width:6%}
    table.week .title{font-weight:bold;font-style:italic;text-transform:uppercase;width:40%}
    table.week tr.sec-tesouros td{background:${SECTION_COLORS.tesouros.bg}}
    table.week tr.sec-ministerio td{background:${SECTION_COLORS.ministerio.bg}}
    table.week tr.sec-vidacrista td{background:${SECTION_COLORS.vidacrista.bg}}
    table.week tr.sec-tesouros .num{background:${SECTION_COLORS.tesouros.bar}}
    table.week tr.sec-ministerio .num{background:${SECTION_COLORS.ministerio.bar}}
    table.week tr.sec-vidacrista .num{background:${SECTION_COLORS.vidacrista.bar}}
    .tb{margin:8px 0;text-align:center}
    .tb button{padding:6px 14px;margin:0 4px;background:#0066cc;color:#fff;border:none;border-radius:4px;cursor:pointer}
    @media print{.tb{display:none} *{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
  </style></head><body>
  <div class="tb"><button onclick="window.print()">Imprimir / PDF</button><button onclick="window.close()">Fechar</button></div>
  ${html}
  </body></html>`);
  w.document.close();
}

function exportXLSX(month: VMMMonth) {
  type Cell = { v: string; s?: any; merge?: number };
  const rows: Cell[][] = [];
  const merges: { s: { r: number; c: number }; e: { r: number; c: number } }[] = [];

  const border = { style: "thin", color: { rgb: "000000" } } as const;
  const borders = { top: border, bottom: border, left: border, right: border };
  const base = { alignment: { vertical: "center", wrapText: true }, border: borders, font: { name: "Arial", sz: 10 } };

  // Title
  rows.push([
    { v: month.title, s: { ...base, alignment: { horizontal: "center", vertical: "center" }, font: { name: "Arial", sz: 12, bold: true, italic: true }, fill: { patternType: "solid", fgColor: { rgb: "C6E0B4" } } } },
    { v: "" }, { v: "" },
  ]);
  merges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } });

  month.weeks.forEach((w) => {
    // Week header
    const r = rows.length;
    rows.push([
      { v: w.label, s: { ...base, alignment: { horizontal: "center", vertical: "center" }, font: { name: "Arial", sz: 11, bold: true, color: { rgb: "FFFFFF" } }, fill: { patternType: "solid", fgColor: { rgb: "4F81BD" } } } },
      { v: "" }, { v: "" },
    ]);
    merges.push({ s: { r, c: 0 }, e: { r, c: 2 } });

    const roleStyle = { ...base, font: { name: "Arial", sz: 10, bold: true, italic: true }, fill: { patternType: "solid", fgColor: { rgb: "DDEBF7" } } };
    const pushRole = (label: string, value: string) => {
      rows.push([
        { v: "", s: { ...base, fill: { patternType: "solid", fgColor: { rgb: "DDEBF7" } } } },
        { v: label, s: roleStyle },
        { v: value, s: base },
      ]);
    };
    pushRole("PRESIDENTE", w.presidente);
    pushRole("ORAÇÃO INICIAL", w.oracaoInicial);

    (["tesouros","ministerio","vidacrista"] as SectionKey[]).forEach((sec) => {
      const col = SECTION_COLORS[sec];
      const bg = col.bg.replace("#", "");
      const bar = col.bar.replace("#", "");
      const parts = w.parts.filter((p) => ((p as any).section || guessSection(p)) === sec);
      parts.forEach((p) => {
        rows.push([
          { v: p.num || "", s: { ...base, alignment: { horizontal: "center", vertical: "center" }, font: { name: "Arial", sz: 10, bold: true, color: { rgb: "FFFFFF" } }, fill: { patternType: "solid", fgColor: { rgb: bar } } } },
          { v: p.title, s: { ...base, font: { name: "Arial", sz: 10, bold: true, italic: true }, fill: { patternType: "solid", fgColor: { rgb: bg } } } },
          { v: p.assignee, s: { ...base, fill: { patternType: "solid", fgColor: { rgb: bg } } } },
        ]);
      });
    });

    pushRole("LEITOR ESTUDO BÍBLICO", w.leitorEstudo);
    pushRole("ORAÇÃO FINAL", w.oracaoFinal);

    // blank spacer row
    rows.push([{ v: "" }, { v: "" }, { v: "" }]);
  });

  const aoa = rows.map((r) => r.map((c) => c.v));
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws["!merges"] = merges;
  ws["!cols"] = [{ wch: 6 }, { wch: 38 }, { wch: 34 }];
  ws["!rows"] = rows.map(() => ({ hpt: 20 }));

  // apply styles
  for (let r = 0; r < rows.length; r++) {
    for (let c = 0; c < rows[r].length; c++) {
      const ref = XLSX.utils.encode_cell({ r, c });
      if (!ws[ref]) ws[ref] = { t: "s", v: rows[r][c].v };
      if (rows[r][c].s) ws[ref].s = rows[r][c].s;
    }
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Designações");
  const safe = month.title.replace(/[^a-z0-9]+/gi, "_");
  XLSX.writeFile(wb, `${safe}.xlsx`);
}
