import { useSyncExternalStore } from "react";
import imported from "@/data/imported.json";

export type Theme = { id: string; num: number; title: string };
export type Person = { id: string; name: string; phone?: string; notes?: string };
export type Congregation = { id: string; name: string };
export type ScheduleEntry = {
  id: string;
  date: string; // ISO yyyy-mm-dd
  rawDate?: string;
  sheet?: string;
  orador: string;
  tema: string;
  themeNum: number | null;
  congr: string;
  presidente: string;
  leitor: string;
  phone?: string;
  notes?: string;
};

export type MasterDB = {
  themes: Theme[];
  speakers: Person[];
  congregations: Congregation[];
  presidentes: Person[]; // anciãos
  servos: Person[]; // servos ministeriais que presidem
  leitores: Person[];
  oradoresLocais: Person[];
  schedules: ScheduleEntry[];
};

const KEY = "arranjo_master_v2";
const rid = () => Math.random().toString(36).slice(2, 10);

function seed(): MasterDB {
  const d = imported as any;
  return {
    themes: (d.themes as { num: number; title: string }[]).map((t) => ({ id: rid(), num: t.num, title: t.title })),
    speakers: (d.speakers as any[]).map((s) => ({ id: rid(), name: s.name, phone: s.phone || "" })),
    congregations: (d.congregations as any[]).map((c) => ({ id: rid(), name: c.name })),
    presidentes: (d.presidentes_ancios as string[]).map((n) => ({ id: rid(), name: n })),
    servos: (d.presidentes_servos as string[]).map((n) => ({ id: rid(), name: n })),
    leitores: (d.leitores as string[]).map((n) => ({ id: rid(), name: n })),
    oradoresLocais: (d.oradores_locais as any[]).map((o) => ({ id: rid(), name: o.name, notes: o.temas })),
    schedules: (d.schedules as any[]).map((s) => ({
      id: rid(),
      date: s.date || "",
      rawDate: s.rawDate || "",
      sheet: s.sheet || "",
      orador: s.orador || "",
      tema: s.tema || "",
      themeNum: s.themeNum ?? null,
      congr: s.congr || "",
      presidente: s.presidente || "",
      leitor: s.leitor || "",
      phone: s.phone || "",
      notes: s.notes || "",
    })),
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
    if (raw) {
      state = { ...seed(), ...JSON.parse(raw) };
    }
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

type ListKey = keyof Omit<MasterDB, never>;

export const master = {
  reset() {
    setMaster(() => seed());
  },
  // generic CRUD
  add<K extends ListKey>(key: K, item: Omit<MasterDB[K][number], "id">) {
    setMaster((d) => ({ ...d, [key]: [...(d[key] as any[]), { ...(item as any), id: rid() }] }) as MasterDB);
  },
  update<K extends ListKey>(key: K, id: string, patch: Partial<MasterDB[K][number]>) {
    setMaster((d) => ({
      ...d,
      [key]: (d[key] as any[]).map((x) => (x.id === id ? { ...x, ...patch } : x)),
    }) as MasterDB);
  },
  remove<K extends ListKey>(key: K, id: string) {
    setMaster((d) => ({ ...d, [key]: (d[key] as any[]).filter((x) => x.id !== id) }) as MasterDB);
  },
};
