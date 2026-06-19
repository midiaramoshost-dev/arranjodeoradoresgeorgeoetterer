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

const KEY = "arranjo_master_v3";
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
  add<K extends ListKey>(key: K, item: Omit<MasterDB[K][number], "id">) {
    setMaster(
      (d) => ({ ...d, [key]: [...(d[key] as any[]), { ...(item as any), id: rid() }] }) as MasterDB,
    );
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
  const w = window.open("", "_blank", "width=900,height=700");
  if (!w) return;
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${title}</title>
  <style>
    body{font-family:system-ui,-apple-system,sans-serif;padding:20px;color:#111}
    h1{font-size:18px;margin:0 0 12px}
    h2{font-size:14px;margin:18px 0 6px;border-bottom:1px solid #ccc;padding-bottom:4px}
    table{width:100%;border-collapse:collapse;font-size:12px;margin-bottom:12px}
    th,td{border:1px solid #999;padding:6px 8px;text-align:left;vertical-align:top}
    th{background:#f0f0f0}
    .card{border:1px solid #999;border-radius:6px;padding:10px;margin-bottom:10px;page-break-inside:avoid}
    .card .row{display:flex;gap:8px;font-size:12px;margin:2px 0}
    .card .row b{min-width:90px;display:inline-block}
    @media print{ button{display:none} }
  </style></head><body>
  <button onclick="window.print()" style="padding:6px 12px;margin-bottom:10px;cursor:pointer">Imprimir</button>
  <h1>${title}</h1>
  ${bodyHTML}
  </body></html>`);
  w.document.close();
}
