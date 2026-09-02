import { useSyncExternalStore } from "react";
import themesSeed from "@/data/themes.json";

export type Theme = { num: number; title: string };
export type Speaker = { id: string; name: string; congregationId?: string; phone?: string };
export type Congregation = {
  id: string;
  name: string;
  city?: string;
  address?: string;
  phone?: string;
  meetingDay?: string;
  notes?: string;
};
export type Schedule = {
  id: string;
  date: string; // ISO yyyy-mm-dd
  themeNum: number;
  speakerId?: string;
  chairmanId?: string;
  congregationId?: string;
  location?: string;
  notes?: string;
};

type DB = {
  themes: Theme[];
  speakers: Speaker[];
  congregations: Congregation[];
  schedules: Schedule[];
  auth: { isAdmin: boolean };
  settings: { adminPasswordHash: string | null };
};

const KEY = "arranjo_db_v1";

const initial = (): DB => ({
  themes: (themesSeed as Theme[]).map((t) => ({ num: t.num, title: t.title })),
  speakers: [],
  congregations: [],
  schedules: [],
  auth: { isAdmin: false },
  settings: { adminPasswordHash: null },
});

let state: DB = initial();
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded) return;
  loaded = true;
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<DB>;
      state = { ...initial(), ...parsed, auth: { isAdmin: false } };
      // ensure themes seeded if empty
      if (!state.themes || state.themes.length === 0) state.themes = initial().themes;
    }
  } catch {}
}

function persist() {
  if (typeof window === "undefined") return;
  const { auth: _a, ...rest } = state;
  localStorage.setItem(KEY, JSON.stringify(rest));
}

function emit() {
  listeners.forEach((l) => l());
}

export function getState(): DB {
  load();
  return state;
}

export function setState(updater: (s: DB) => DB) {
  load();
  state = updater(state);
  persist();
  emit();
}

export function useStore<T>(selector: (s: DB) => T): T {
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

// --- helpers ---
const id = () => Math.random().toString(36).slice(2, 10);

export const actions = {
  // Speakers
  addSpeaker(s: Omit<Speaker, "id">) {
    setState((d) => ({ ...d, speakers: [...d.speakers, { ...s, id: id() }] }));
  },
  updateSpeaker(idv: string, patch: Partial<Speaker>) {
    setState((d) => ({ ...d, speakers: d.speakers.map((x) => (x.id === idv ? { ...x, ...patch } : x)) }));
  },
  deleteSpeaker(idv: string) {
    setState((d) => ({
      ...d,
      speakers: d.speakers.filter((x) => x.id !== idv),
      schedules: d.schedules.map((s) =>
        s.speakerId === idv ? { ...s, speakerId: undefined } : s.chairmanId === idv ? { ...s, chairmanId: undefined } : s,
      ),
    }));
  },
  // Congregations
  addCongregation(c: Omit<Congregation, "id">) {
    setState((d) => ({ ...d, congregations: [...d.congregations, { ...c, id: id() }] }));
  },
  updateCongregation(idv: string, patch: Partial<Congregation>) {
    setState((d) => ({ ...d, congregations: d.congregations.map((x) => (x.id === idv ? { ...x, ...patch } : x)) }));
  },
  deleteCongregation(idv: string) {
    setState((d) => ({
      ...d,
      congregations: d.congregations.filter((x) => x.id !== idv),
      speakers: d.speakers.map((s) => (s.congregationId === idv ? { ...s, congregationId: undefined } : s)),
      schedules: d.schedules.map((s) => (s.congregationId === idv ? { ...s, congregationId: undefined } : s)),
    }));
  },
  // Schedules
  addSchedule(s: Omit<Schedule, "id">) {
    setState((d) => ({ ...d, schedules: [...d.schedules, { ...s, id: id() }] }));
  },
  updateSchedule(idv: string, patch: Partial<Schedule>) {
    setState((d) => ({ ...d, schedules: d.schedules.map((x) => (x.id === idv ? { ...x, ...patch } : x)) }));
  },
  deleteSchedule(idv: string) {
    setState((d) => ({ ...d, schedules: d.schedules.filter((x) => x.id !== idv) }));
  },
  // Auth
  async setAdminPassword(pw: string) {
    const hash = await sha256(pw);
    setState((d) => ({ ...d, settings: { ...d.settings, adminPasswordHash: hash } }));
  },
  async login(pw: string): Promise<boolean> {
    const d = getState();
    const hash = await sha256(pw);
    // first time: set this password
    if (!d.settings.adminPasswordHash) {
      setState((s) => ({ ...s, settings: { ...s.settings, adminPasswordHash: hash }, auth: { isAdmin: true } }));
      return true;
    }
    if (hash === d.settings.adminPasswordHash) {
      setState((s) => ({ ...s, auth: { isAdmin: true } }));
      return true;
    }
    return false;
  },
  logout() {
    setState((d) => ({ ...d, auth: { isAdmin: false } }));
  },
};

async function sha256(text: string): Promise<string> {
  const buf = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
