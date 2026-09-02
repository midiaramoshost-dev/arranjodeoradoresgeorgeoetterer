import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, ChevronDown, Clock3, MapPin, Search, Users } from "lucide-react";
import importedData from "@/data/imported.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Agenda Pública | George Oetterer" },
      {
        name: "description",
        content: "Agenda de discursos, oradores e programação da congregação George Oetterer.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("Todos os meses");

  const months = useMemo(
    () => Array.from(new Set(importedData.agenda.map((item) => item.mes))),
    [],
  );

  const filteredAgenda = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");

    return importedData.agenda.filter((item) => {
      const matchesMonth = selectedMonth === "Todos os meses" || item.mes === selectedMonth;
      const content = [
        item.data,
        item.orador,
        item.tema,
        item.temaNum,
        item.congregacao,
        item.presidente,
        item.leitor,
        item.obs,
      ]
        .join(" ")
        .toLocaleLowerCase("pt-BR");

      return matchesMonth && (!normalizedSearch || content.includes(normalizedSearch));
    });
  }, [search, selectedMonth]);

  const groupedAgenda = useMemo(() => {
    return filteredAgenda.reduce<Record<string, typeof importedData.agenda>>((groups, item) => {
      groups[item.mes] ??= [];
      groups[item.mes].push(item);
      return groups;
    }, {});
  }, [filteredAgenda]);

  return (
    <div className="min-h-screen bg-[#f7f4ec] text-[#173b40] selection:bg-[#d6aa62] selection:text-[#173b40]">
      <header className="border-b border-[#d9d0bd] bg-[#173b40] text-[#f7f4ec]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 md:px-8">
          <Link to="/" className="flex items-center gap-3" aria-label="Página inicial">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#d6aa62] font-display text-2xl text-[#173b40]">
              G
            </div>
            <div>
              <p className="font-display text-xl leading-none">George Oetterer</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#d8d1bf]">Agenda pública</p>
            </div>
          </Link>
          <Link
            to="/admin"
            className="rounded-lg border border-[#d8d1bf]/40 px-3 py-2 text-sm transition-colors hover:bg-white/10"
          >
            Área administrativa
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">
        <section className="mb-10 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#a47b35]">Programação 2026</p>
          <h1 className="font-display text-4xl leading-tight text-[#173b40] md:text-6xl">
            Agenda de discursos e reuniões
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#5c6b69] md:text-lg">
            Consulte a programação completa, os temas dos discursos e as designações de cada reunião.
          </p>
        </section>

        <section className="mb-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#d9d0bd] bg-white p-5 shadow-sm">
            <CalendarDays className="mb-4 h-5 w-5 text-[#a47b35]" />
            <p className="text-3xl font-semibold text-[#173b40]">{importedData.agenda.length}</p>
            <p className="mt-1 text-sm text-[#6d7773]">programações registradas</p>
          </div>
          <div className="rounded-2xl border border-[#d9d0bd] bg-white p-5 shadow-sm">
            <Users className="mb-4 h-5 w-5 text-[#a47b35]" />
            <p className="text-3xl font-semibold text-[#173b40]">{importedData.leitores.length}</p>
            <p className="mt-1 text-sm text-[#6d7773]">leitores cadastrados</p>
          </div>
          <div className="rounded-2xl border border-[#d9d0bd] bg-white p-5 shadow-sm">
            <Clock3 className="mb-4 h-5 w-5 text-[#a47b35]" />
            <p className="text-3xl font-semibold text-[#173b40]">{importedData.themes.length}</p>
            <p className="mt-1 text-sm text-[#6d7773]">temas disponíveis</p>
          </div>
        </section>

        <section className="mb-10 rounded-2xl border border-[#d9d0bd] bg-white p-4 shadow-sm md:p-5">
          <div className="grid gap-3 md:grid-cols-[1fr_240px]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b938e]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por tema, orador ou congregação"
                className="h-11 w-full rounded-lg border border-[#d9d0bd] bg-[#fcfbf7] pl-10 pr-3 text-sm outline-none transition focus:border-[#a47b35] focus:ring-2 focus:ring-[#a47b35]/20"
              />
            </label>
            <label className="relative block">
              <select
                value={selectedMonth}
                onChange={(event) => setSelectedMonth(event.target.value)}
                className="h-11 w-full appearance-none rounded-lg border border-[#d9d0bd] bg-[#fcfbf7] px-3 pr-9 text-sm outline-none transition focus:border-[#a47b35] focus:ring-2 focus:ring-[#a47b35]/20"
              >
                <option>Todos os meses</option>
                {months.map((month) => (
                  <option key={month}>{month}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b938e]" />
            </label>
          </div>
        </section>

        <section className="space-y-10">
          {Object.entries(groupedAgenda).map(([month, items]) => (
            <div key={month}>
              <div className="mb-4 flex items-center gap-3">
                <h2 className="font-display text-3xl text-[#173b40]">{month}</h2>
                <div className="h-px flex-1 bg-[#d9d0bd]" />
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {items.map((item, index) => (
                  <article
                    key={`${item.data}-${item.tema}-${index}`}
                    className="rounded-2xl border border-[#d9d0bd] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#a47b35]">{item.data}</p>
                        <h3 className="mt-2 font-display text-2xl leading-snug text-[#173b40]">
                          {item.tema || "Programação a definir"}
                        </h3>
                      </div>
                      {item.temaNum && (
                        <span className="rounded-full bg-[#f0e7d4] px-3 py-1 text-xs font-semibold text-[#8c672d]">
                          Tema {item.temaNum}
                        </span>
                      )}
                    </div>
                    <div className="mt-5 grid gap-3 border-t border-[#eee9dd] pt-4 text-sm text-[#5c6b69] sm:grid-cols-2">
                      <p><strong className="font-medium text-[#173b40]">Orador:</strong> {item.orador || "A definir"}</p>
                      <p><strong className="font-medium text-[#173b40]">Presidente:</strong> {item.presidente || "A definir"}</p>
                      <p><strong className="font-medium text-[#173b40]">Leitor:</strong> {item.leitor || "A definir"}</p>
                      <p className="flex items-start gap-1"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#a47b35]" /><span>{item.congregacao || "Local a definir"}</span></p>
                    </div>
                    {(item.telefone || item.obs) && (
                      <div className="mt-4 rounded-lg bg-[#f7f4ec] px-3 py-2 text-xs text-[#6d7773]">
                        {item.telefone && <span>{item.telefone}</span>}
                        {item.telefone && item.obs && <span> · </span>}
                        {item.obs && <span>{item.obs}</span>}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>
          ))}

          {filteredAgenda.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[#cfc3aa] bg-white p-10 text-center text-[#6d7773]">
              Nenhuma programação encontrada para os filtros selecionados.
            </div>
          )}
        </section>

        <section className="mt-16 border-t border-[#d9d0bd] pt-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#a47b35]">Referência</p>
              <h2 className="mt-1 font-display text-3xl text-[#173b40]">Catálogo de temas</h2>
            </div>
            <p className="text-sm text-[#6d7773]">{importedData.themes.length} temas</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {importedData.themes.map((theme) => (
              <div key={theme.num} className="rounded-lg border border-[#e2dccf] bg-white px-4 py-3 text-sm">
                <span className="mr-2 font-semibold text-[#a47b35]">{theme.num}.</span>
                <span className="text-[#405653]">{theme.title}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-[#d9d0bd] bg-[#173b40] px-5 py-8 text-center text-sm text-[#d8d1bf]">
        Agenda pública · George Oetterer · 2026
      </footer>
    </div>
  );
}
