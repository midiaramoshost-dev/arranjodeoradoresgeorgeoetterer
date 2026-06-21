import { useSyncExternalStore } from "react";
import imported from "@/data/imported.json";

export type Theme = { id: string; num: number; title: string; dateFeito?: string; obs?: string };
export type Person = { id: string; name: string; themes?: string; phone?: string; notes?: string };
export type AgendaItem = {
  id: string;
  mes: string;
  data: string;
  orador: string;
  tema: string;
  temaNum: string;
  congregacao: string;
  telefone: string;
  presidente: string;
  leitor: string;
  obs: string;
};

export type MasterDB = {
  themes: Theme[];
  agenda: AgendaItem[];
  oradoresLocais: Person[];
  presidencia: Person[];
  leitores: Person[];
};

const KEY = "arranjo_master_v4";
const rid = () => Math.random().toString(36).slice(2, 10);

function seed(): MasterDB {
  const d = imported as any;
  return {
    themes: (d.themes as any[]).map((t) => ({
      id: rid(),
      num: t.num,
      title: t.title || "",
      dateFeito: t.dateFeito || "",
      obs: t.obs || "",
    })),
    agenda: (d.agenda as any[]).map((a) => ({
      id: rid(),
      mes: a.mes || "",
      data: a.data || "",
      orador: a.orador || "",
      tema: a.tema || "",
      temaNum: a.temaNum || "",
      congregacao: a.congregacao || "",
      telefone: a.telefone || "",
      presidente: a.presidente || "",
      leitor: a.leitor || "",
      obs: a.obs || "",
    })),
    oradoresLocais: (d.oradoresLocais as any[]).map((o) => ({
      id: rid(),
      name: o.name,
      themes: o.themes || "",
    })),
    presidencia: (d.presidencia as string[]).map((n) => ({ id: rid(), name: n })),
    leitores: (d.leitores as string[]).map((n) => ({ id: rid(), name: n })),
  };
}

let state: MasterDB = seed();
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded) return;
  loaded = true;
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...seed(), ...JSON.parse(raw) };
  } catch {}
}

function persist() {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(state));
}

function emit() {
  listeners.forEach((l) => l());
}

export function setMaster(updater: (s: MasterDB) => MasterDB) {
  load();
  state = updater(state);
  persist();
  emit();
}

export function useMaster<T>(selector: (s: MasterDB) => T): T {
  load();
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => selector(state),
    () => selector(state),
  );
}

type ListKey = keyof MasterDB;

export const master = {
  reset() {
    setMaster(() => seed());
  },
  add<K extends ListKey>(key: K, item: Omit<MasterDB[K][number], "id">): string {
    const id = rid();
    setMaster(
      (d) => ({ ...d, [key]: [{ ...(item as any), id }, ...(d[key] as any[])] }) as MasterDB,
    );
    return id;
  },
  update<K extends ListKey>(key: K, id: string, patch: Partial<MasterDB[K][number]>) {
    setMaster(
      (d) =>
        ({
          ...d,
          [key]: (d[key] as any[]).map((x) => (x.id === id ? { ...x, ...patch } : x)),
        }) as MasterDB,
    );
  },
  remove<K extends ListKey>(key: K, id: string) {
    setMaster(
      (d) => ({ ...d, [key]: (d[key] as any[]).filter((x) => x.id !== id) }) as MasterDB,
    );
  },
};

// ---- Search helpers ----
export function norm(s: any): string {
  return String(s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
export function tokens(q: string): string[] {
  return norm(q).split(/\s+/).filter(Boolean);
}
export function smartMatch(q: string, ...fields: any[]): boolean {
  const toks = tokens(q);
  if (!toks.length) return true;
  const hay = fields.map(norm).join(" \u0001 ");
  return toks.every((t) => hay.includes(t));
}

// ---- Export helpers ----
export function toCSV(rows: Record<string, any>[], columns: { key: string; label: string }[]): string {
  const esc = (v: any) => {
    const s = v == null ? "" : String(v);
    return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const head = columns.map((c) => esc(c.label)).join(",");
  const body = rows.map((r) => columns.map((c) => esc(r[c.key])).join(",")).join("\n");
  return head + "\n" + body;
}

export function downloadCSV(filename: string, csv: string) {
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function printHTML(title: string, bodyHTML: string) {
  const w = window.open("", "_blank", "width=1100,height=800");
  if (!w) return;
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${title}</title>
  <style>
    @page { size: A4 landscape; margin: 10mm }
    *{box-sizing:border-box}
    body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;padding:14px;color:#111}
    h1{font-size:18px;margin:0 0 10px;text-align:center}
    h2{font-size:13px;margin:14px 0 6px;background:#222;color:#fff;padding:4px 8px;border-radius:3px}
    table{width:100%;border-collapse:collapse;font-size:11px;margin-bottom:10px;table-layout:fixed}
    th,td{border:1px solid #444;padding:4px 6px;text-align:left;vertical-align:top;word-wrap:break-word;overflow-wrap:break-word}
    th{background:#e8e8e8;font-weight:600;font-size:11px}
    tr:nth-child(even) td{background:#fafafa}
    .toolbar{margin-bottom:10px;text-align:center}
    .toolbar button{padding:8px 16px;cursor:pointer;font-size:13px;background:#0066cc;color:#fff;border:none;border-radius:4px;margin:0 4px}
    @media print{ .toolbar{display:none} h2{background:#222 !important;-webkit-print-color-adjust:exact;print-color-adjust:exact} tr:nth-child(even) td{background:#fafafa !important;-webkit-print-color-adjust:exact;print-color-adjust:exact} th{background:#e8e8e8 !important;-webkit-print-color-adjust:exact;print-color-adjust:exact} table{page-break-inside:auto} tr{page-break-inside:avoid} h2{page-break-after:avoid} }
  </style></head><body>
  <div class="toolbar"><button onclick="window.print()">Imprimir / Salvar PDF</button><button onclick="window.close()">Fechar</button></div>
  <h1>${title}</h1>
  ${bodyHTML}
  </body></html>`);
  w.document.close();
}
