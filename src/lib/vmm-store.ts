import { useSyncExternalStore } from "react";

/* ============ TYPES ============ */
export type SectionKey = "tesouros" | "ministerio" | "vidacrista";

export type Part = {
  id: string;
  num?: string; // "1","2","3"...
  title: string; // e.g. "TESOUROS 1ª PARTE"
  assignee: string; // "NOME" or "NOME / NOME"
  role: RoleKind; // determines which pool to draw from
  isPair?: boolean;
};

export type RoleKind =
  | "presidente"
  | "oracao"
  | "orador" // irmão – discurso / tesouros / vida cristã / estudo
  | "leitura" // leitura da bíblia (irmão jovem)
  | "publicadora" // dupla para iniciando conversas / cultivando / fazendo discípulos (mistas)
  | "leitorEstudo"; // leitor do estudo bíblico

export type Week = {
  id: string;
  label: string; // "SEMANA 4 A 10 DE MAIO"
  presidente: string;
  oracaoInicial: string;
  oracaoFinal: string;
  leitorEstudo: string;
  parts: Part[]; // tesouros + ministerio + vidacrista, com section
};

export type PartWithSection = Part & { section: SectionKey };

export type VMMMonth = {
  id: string;
  title: string; // "NOSSA VIDA E MINISTÉRIO - DESIGNAÇÕES MAIO DE 2026"
  weeks: Week[];
};

export type People = {
  presidentes: string[];
  oradores: string[]; // irmãos habilitados p/ discursos/tesouros/estudo/leitura
  publicadoras: string[]; // participantes ministério (podem ser irmãos ou irmãs)
  leitoresEstudo: string[];
  oracoes: string[]; // orações inicial/final
};

export type VMMDB = {
  months: VMMMonth[];
  people: People;
};

const KEY = "vmm_store_v1";
const rid = () => Math.random().toString(36).slice(2, 10);

/* ============ SEED ============ */
function seed(): VMMDB {
  return {
    months: [buildMonthFromTemplate("MAIO DE 2026", [
      "SEMANA 4 A 10 DE MAIO",
      "SEMANA 11 A 17 DE MAIO",
      "SEMANA 18 A 24 DE MAIO",
      "SEMANA 25 A 31 DE MAIO",
    ])],
    people: {
      presidentes: [
        "LEONARDO NASCIMENTO", "EDUARDO JÚNIOR", "NILSON CARVALHO", "JOSÉ CRUZ",
        "RODRIGO PEREIRA", "IGOR VINICIUS", "PAULO MORAES", "SILVANO PASSOS",
        "ANDERSON SILVEIRA",
      ],
      oradores: [
        "VALDIR GONÇALVES", "JOSÉ CRUZ", "LEONARDO APARECIDO", "ANTONY DÉRIO",
        "RODRIGO PEREIRA", "JOSÉ RAMOS", "ALFREDO RAMOS", "JOÃO CARLOS",
        "LEONARDO NASCIMENTO", "SILVANO PASSOS", "MIKAEL GONÇALVES",
        "IGOR VINÍCIUS", "AGENOR ALBUQUERQUE", "THIAGO DÉRIO", "CESAR LIMA",
        "MATEUS OLIVEIRA", "DANIEL SIQUEIRA", "NILSON CARVALHO", "PAULO MORAES",
        "VANDERLEI ALMEIDA", "ANDERSON SILVEIRA", "GUILHERME SILVA",
        "MARCOS OLIVEIRA", "VALTER SILVA", "ISRAEL MELO", "EDUARDO JR",
        "AMERICO BASSI", "AKYLLA DERIO",
      ],
      publicadoras: [
        "CECILIA", "KAROLAINE", "SONIA", "VÂNIA", "AKYLLA", "GUILHERME",
        "EROTILDE", "VERA THOMAS", "SARITA", "ANDRÉIA", "ELIANE", "AGNITA",
        "JOELMA", "AP PASCOAL", "MARCOS", "JOSÉ DERIO", "ANA CLAUDIA",
        "FERNANDA S", "DIVA", "LUCIANA", "THAISSA", "MARCIA", "MATEUS",
        "VANDERLEI", "STEFANIE", "CIDA ARAUJO", "BRUNA MORAES", "EDNA",
        "ARIELE", "FABIANA", "JANETE", "SOLANGE", "CRISTINA D", "FATIMA",
      ],
      leitoresEstudo: [
        "JOSÉ RAMOS", "MIKAEL GONÇALVES", "VALTER SILVA", "DANIEL SIQUEIRA",
        "MARCOS OLIVEIRA", "ISRAEL MELO", "ANTONY DÉRIO", "MATEUS OLIVEIRA",
        "AKYLLA DERIO", "CESAR LIMA", "AGENOR ALBUQUERQUE",
      ],
      oracoes: [
        "EDUARDO JR", "PAULO MORAES", "VALDIR GONÇALVES", "VANDERLEI ALMEIDA",
        "JOSÉ RAMOS", "ISRAEL MELO", "ANTONY DÉRIO", "SILVANO PASSOS",
        "CESAR LIMA", "MATEUS OLIVEIRA", "ALFREDO RAMOS", "JOÃO CARLOS",
        "DANIEL SIQUEIRA", "AKYLLA DERIO", "AGENOR ALBUQUERQUE",
      ],
    },
  };
}

/** Default template of parts per week (matching the reference layout) */
export function defaultPartsTemplate(): PartWithSection[] {
  return [
    { id: rid(), num: "1", title: "TESOUROS 1ª PARTE", assignee: "", role: "orador", section: "tesouros" },
    { id: rid(), num: "2", title: "JÓIAS", assignee: "", role: "orador", section: "tesouros" },
    { id: rid(), num: "3", title: "LEITURA DA BÍBLIA", assignee: "", role: "leitura", section: "tesouros" },
    { id: rid(), num: "4", title: "INICIANDO CONVERSAS", assignee: "", role: "publicadora", section: "ministerio", isPair: true },
    { id: rid(), num: "5", title: "CULTIVANDO INTERESSE", assignee: "", role: "publicadora", section: "ministerio", isPair: true },
    { id: rid(), num: "6", title: "FAZENDO DISCÍPULOS", assignee: "", role: "publicadora", section: "ministerio", isPair: true },
    { id: rid(), num: "7", title: "NECESSIDADES LOCAIS", assignee: "", role: "orador", section: "vidacrista" },
    { id: rid(), num: "8", title: "ESTUDO BÍBLICO DE CONGREGAÇÃO", assignee: "", role: "orador", section: "vidacrista" },
  ];
}

export function buildMonthFromTemplate(monthName: string, weekLabels: string[]): VMMMonth {
  return {
    id: rid(),
    title: `NOSSA VIDA E MINISTÉRIO - DESIGNAÇÕES ${monthName.toUpperCase()}`,
    weeks: weekLabels.map((label) => ({
      id: rid(),
      label,
      presidente: "",
      oracaoInicial: "",
      oracaoFinal: "",
      leitorEstudo: "",
      parts: defaultPartsTemplate().map((p) => ({ ...p, id: rid() })),
    })),
  };
}

/* ============ STORE ============ */
let state: VMMDB = seed();
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
function emit() { listeners.forEach((l) => l()); }

export function setVMM(updater: (s: VMMDB) => VMMDB) {
  load();
  state = updater(state);
  persist();
  emit();
}

export function useVMM<T>(selector: (s: VMMDB) => T): T {
  load();
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => selector(state),
    () => selector(state),
  );
}

/* ============ ACTIONS ============ */
export const vmm = {
  reset() { setVMM(() => seed()); },
  addMonth(monthName: string, weekLabels: string[]) {
    const m = buildMonthFromTemplate(monthName, weekLabels);
    setVMM((s) => ({ ...s, months: [m, ...s.months] }));
    return m.id;
  },
  removeMonth(id: string) {
    setVMM((s) => ({ ...s, months: s.months.filter((m) => m.id !== id) }));
  },
  updateMonth(id: string, patch: Partial<VMMMonth>) {
    setVMM((s) => ({ ...s, months: s.months.map((m) => m.id === id ? { ...m, ...patch } : m) }));
  },
  addWeek(monthId: string, label: string) {
    setVMM((s) => ({
      ...s,
      months: s.months.map((m) => m.id === monthId ? {
        ...m,
        weeks: [...m.weeks, {
          id: rid(), label, presidente: "", oracaoInicial: "", oracaoFinal: "", leitorEstudo: "",
          parts: defaultPartsTemplate().map((p) => ({ ...p, id: rid() })),
        }],
      } : m),
    }));
  },
  removeWeek(monthId: string, weekId: string) {
    setVMM((s) => ({
      ...s,
      months: s.months.map((m) => m.id === monthId ? { ...m, weeks: m.weeks.filter((w) => w.id !== weekId) } : m),
    }));
  },
  updateWeek(monthId: string, weekId: string, patch: Partial<Week>) {
    setVMM((s) => ({
      ...s,
      months: s.months.map((m) => m.id === monthId ? {
        ...m,
        weeks: m.weeks.map((w) => w.id === weekId ? { ...w, ...patch } : w),
      } : m),
    }));
  },
  addPart(monthId: string, weekId: string, part: Omit<Part, "id"> & { section?: SectionKey }) {
    setVMM((s) => ({
      ...s,
      months: s.months.map((m) => m.id === monthId ? {
        ...m,
        weeks: m.weeks.map((w) => w.id === weekId ? {
          ...w,
          parts: [...w.parts, { ...part, id: rid() } as Part],
        } : w),
      } : m),
    }));
  },
  removePart(monthId: string, weekId: string, partId: string) {
    setVMM((s) => ({
      ...s,
      months: s.months.map((m) => m.id === monthId ? {
        ...m,
        weeks: m.weeks.map((w) => w.id === weekId ? { ...w, parts: w.parts.filter((p) => p.id !== partId) } : w),
      } : m),
    }));
  },
  updatePart(monthId: string, weekId: string, partId: string, patch: Partial<Part>) {
    setVMM((s) => ({
      ...s,
      months: s.months.map((m) => m.id === monthId ? {
        ...m,
        weeks: m.weeks.map((w) => w.id === weekId ? {
          ...w,
          parts: w.parts.map((p) => p.id === partId ? { ...p, ...patch } : p),
        } : w),
      } : m),
    }));
  },
  addPerson(pool: keyof People, name: string) {
    setVMM((s) => ({ ...s, people: { ...s.people, [pool]: [...s.people[pool], name] } }));
  },
  removePerson(pool: keyof People, name: string) {
    setVMM((s) => ({ ...s, people: { ...s.people, [pool]: s.people[pool].filter((n) => n !== name) } }));
  },
  /** Auto-designa mês inteiro sem repetir pessoas dentro do mês */
  autoAssign(monthId: string, opts: { onlyEmpty?: boolean } = {}) {
    setVMM((s) => {
      const m = s.months.find((x) => x.id === monthId);
      if (!m) return s;
      const used = new Set<string>();
      const pick = (pool: string[]): string => {
        const remaining = pool.filter((n) => !used.has(n));
        const chosen = remaining.length > 0
          ? remaining[Math.floor(Math.random() * remaining.length)]
          : pool[Math.floor(Math.random() * pool.length)] || "";
        if (chosen) used.add(chosen);
        return chosen;
      };
      const pickPair = (pool: string[]): string => {
        const a = pick(pool);
        const b = pick(pool);
        return b ? `${a} / ${b}` : a;
      };
      const p = s.people;
      const shouldSet = (current: string) => !opts.onlyEmpty || !current?.trim();

      const newWeeks: Week[] = m.weeks.map((w) => {
        const nw: Week = { ...w };
        if (shouldSet(nw.presidente)) nw.presidente = pick(p.presidentes);
        if (shouldSet(nw.oracaoInicial)) nw.oracaoInicial = pick(p.oracoes);
        if (shouldSet(nw.oracaoFinal)) nw.oracaoFinal = pick(p.oracoes);
        if (shouldSet(nw.leitorEstudo)) nw.leitorEstudo = pick(p.leitoresEstudo);
        nw.parts = w.parts.map((part) => {
          if (!shouldSet(part.assignee)) return part;
          let pool: string[] = [];
          if (part.role === "orador") pool = p.oradores;
          else if (part.role === "leitura") pool = p.oradores;
          else if (part.role === "leitorEstudo") pool = p.leitoresEstudo;
          else if (part.role === "publicadora") pool = p.publicadoras;
          else if (part.role === "oracao") pool = p.oracoes;
          else if (part.role === "presidente") pool = p.presidentes;
          const assignee = part.isPair ? pickPair(pool) : pick(pool);
          return { ...part, assignee };
        });
        return nw;
      });

      return {
        ...s,
        months: s.months.map((mm) => mm.id === monthId ? { ...mm, weeks: newWeeks } : mm),
      };
    });
  },
};
