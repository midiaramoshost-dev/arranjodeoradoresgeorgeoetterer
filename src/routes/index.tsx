import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { useVMM, type VMMMonth, type Week, type Part } from "@/lib/vmm-store";
import {
  Shield,
  MapPin,
  Calendar,
  Users,
  BookOpen,
  Search,
  Clock,
  UserCheck,
  Printer,
  ChevronRight,
  Phone,
  BookOpenCheck,
  UserPlus
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [ 
      { title: "Programa de Reuniões e Oradores" },
      { 
        name: "description",
        content: "Consulte de forma rápida e prática as designações de Vida e Ministério Cristão, a agenda de discursos públicos e a lista de oradores.",
      },
    ],
  }),
  component: Home, 
});

function Home() { 
  const [activeTab, setActiveTab] = useState<"vmm" | "oradores" | "agenda">("vmm");
  const [searchQuery, setSearchQuery] = useState("");

  // Data from stores
  const speakers = useStore((s) => s.speakers);
  const congs = useStore((s) => s.congregations);
  const schedules = useStore((s) => s.schedules);
  const themes = useStore((s) => s.themes);
  const vmmMonths = useVMM((s) => s.months);

  // VMM Active Month
  const [selectedVmmMonthId, setSelectedVmmMonthId] = useState<string>("");
  const activeVmmMonth = useMemo(() => {
    if (vmmMonths.length === 0) return null;
    return vmmMonths.find((m) => m.id === selectedVmmMonthId) || vmmMonths[0];
  }, [vmmMonths, selectedVmmMonthId]);

  // Filtered Speakers
  const filteredSpeakers = useMemo(() => {
    return speakers.filter((s) => {
      const cong = congs.find((c) => c.id === s.congregationId)?.name || "";
      const query = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(query) ||
        cong.toLowerCase().includes(query)
      );
    });
  }, [speakers, congs, searchQuery]);

  // Sorted Schedules
  const sortedSchedules = useMemo(() => {
    return [...schedules].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [schedules]);

  // Helper to print VMM from public view
  const handlePrintVMM = (month: VMMMonth) => {
    const SECTION_COLORS = {
      tesouros: { bg: "#DCE6F1", bar: "#3E7A94", label: "TESOUROS DA PALAVRA DE DEUS" },
      ministerio: { bg: "#FFF3D6", bar: "#D89A2C", label: "FAÇA SEU MELHOR NO MINISTÉRIO" },
      vidacrista: { bg: "#F8D7DA", bar: "#B44A5A", label: "NOSSA VIDA CRISTÃ" },
    };

    const weekBlocks = month.weeks.map((w) => {
      const rows: string[] = [];
      rows.push(`<tr><th colspan="3" class="wk">${w.label}</th></tr>`);
      rows.push(`<tr><td class="role"></td><td class="role">PRESIDENTE</td><td>${w.presidente || "-"}</td></tr>`);
      rows.push(`<tr><td class="role"></td><td class="role">ORAÇÃO INICIAL</td><td>${w.oracaoInicial || "-"}</td></tr>`);
      
      const guessSection = (p: Part) => {
        const t = p.title.toUpperCase();
        if (/TESOURO|JÓIA|JOIA|LEITURA DA BÍBLIA/.test(t)) return "tesouros";
        if (/INICIANDO|CULTIVANDO|FAZENDO|EXPLICANDO/.test(t)) return "ministerio";
        return "vidacrista";
      };

      (["tesouros", "ministerio", "vidacrista"] as const).forEach((sec) => {
        const parts = w.parts.filter((p) => ((p as any).section || guessSection(p)) === sec);
        parts.forEach((p) => {
          rows.push(`<tr class="sec-${sec}"><td class="num">${p.num || ""}</td><td class="title">${p.title}</td><td>${p.assignee || "-"}</td></tr>`);
        });
      });
      rows.push(`<tr><td class="role"></td><td class="role">LEITOR ESTUDO BÍBLICO</td><td>${w.leitorEstudo || "-"}</td></tr>`);
      rows.push(`<tr><td class="role"></td><td class="role">ORAÇÃO FINAL</td><td>${w.oracaoFinal || "-"}</td></tr>`);
      return `<table class="week">${rows.join("")}</table>`;
    }).join("");

    const w = window.open("", "_blank", "width=900,height=1100");
    if (!w) return;
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${month.title}</title>
    <style>
      @page{size:A4 portrait;margin:8mm}
      body{font-family:Arial,sans-serif;color:#111;font-size:11px;margin:0;padding:8px}
      .title-bar{background:#C6E0B4;text-align:center;font-weight:bold;font-style:italic;padding:8px;margin-bottom:10px;border:1px solid #666}
      table.week{width:100%;border-collapse:collapse;margin-bottom:10px;table-layout:fixed}
      table.week td, table.week th{border:1px solid #000;padding:3px 6px;vertical-align:middle}
      table.week th.wk{background:#4F81BD;color:#fff;text-align:center;font-size:12px}
      table.week .role{background:#DDEBF7;font-weight:bold;font-style:italic;text-transform:uppercase;width:35%}
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
    <div class="title-bar">${month.title}</div>
    ${weekBlocks}
    </body></html>`);
    w.document.close();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-slate-900 block leading-none">George Oetterer</span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">Arranjos Congregacionais</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/admin"
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              <Shield className="h-4 w-4" />
              <span>Painel de Gestão</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-12 px-4 text-center shadow-inner">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Programa de Reuniões e Oradores
          </h1>
          <p className="text-blue-100 text-base sm:text-lg max-w-2xl mx-auto font-light mb-6">
            Consulte de forma rápida e prática as designações de Vida e Ministério Cristão, a agenda de discursos públicos e a lista de oradores.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-bold text-blue-700 shadow-md hover:bg-blue-50 transition-all transform hover:-translate-y-0.5"
            >
              <UserPlus className="h-4 w-4" />
              <span>Cadastrar / Acessar Painel</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs Selector */}
        <div className="flex border-b border-slate-200 mb-6 overflow-x-auto scrollbar-none gap-2">
          <button
            onClick={() => setActiveTab("vmm")}
            className={`flex items-center gap-2 py-3 px-4 font-medium text-sm border-b-2 transition-all whitespace-nowrap ${
              activeTab === "vmm"
                ? "border-blue-600 text-blue-600 font-semibold"
                : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Vida e Ministério
          </button>
          <button
            onClick={() => setActiveTab("agenda")}
            className={`flex items-center gap-2 py-3 px-4 font-medium text-sm border-b-2 transition-all whitespace-nowrap ${
              activeTab === "agenda"
                ? "border-blue-600 text-blue-600 font-semibold"
                : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
            }`}
          >
            <Calendar className="h-4 w-4" />
            Agenda de Discursos
          </button>
          <button
            onClick={() => setActiveTab("oradores")}
            className={`flex items-center gap-2 py-3 px-4 font-medium text-sm border-b-2 transition-all whitespace-nowrap ${
              activeTab === "oradores"
                ? "border-blue-600 text-blue-600 font-semibold"
                : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
            }`}
          >
            <Users className="h-4 w-4" />
            Oradores Cadastrados
          </button>
        </div>

        {/* Tab Content: Vida e Ministério */}
        {activeTab === "vmm" && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Selecione o Mês</label>
                <select
                  className="w-full max-w-xs h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={activeVmmMonth?.id || ""}
                  onChange={(e) => setSelectedVmmMonthId(e.target.value)}
                >
                  {vmmMonths.map((m) => (
                    <option key={m.id} value={m.id}>{m.title}</option>
                  ))}
                </select>
              </div>
              {activeVmmMonth && (
                <button
                  onClick={() => handlePrintVMM(activeVmmMonth)}
                  className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-4 py-2 rounded-lg text-sm transition-colors border border-slate-200"
                >
                  <Printer className="h-4 w-4" />
                  Imprimir Programa
                </button>
              )}
            </div>

            {activeVmmMonth ? (
              <div className="space-y-6">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-800 font-bold text-center text-lg italic shadow-sm">
                  {activeVmmMonth.title}
                </div>

                <div className="grid gap-6">
                  {activeVmmMonth.weeks.map((week) => (
                    <div key={week.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                      {/* Week Header */}
                      <div className="bg-blue-600 text-white px-4 py-3 font-bold text-sm sm:text-base flex items-center justify-between">
                        <span>{week.label}</span>
                        <span className="text-xs bg-blue-700 px-2.5 py-1 rounded-full font-normal text-blue-100">Reunião de Meio de Semana</span>
                      </div>

                      {/* Week Roles */}
                      <div className="p-4 space-y-4">
                        <div className="grid sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <div className="flex items-center justify-between text-sm border-b sm:border-b-0 sm:border-r border-slate-200 pb-2 sm:pb-0 sm:pr-4">
                            <span className="font-semibold text-slate-500">PRESIDENTE:</span>
                            <span className="font-bold text-slate-800">{week.presidente || "-"}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm sm:pl-2">
                            <span className="font-semibold text-slate-500">ORAÇÃO INICIAL:</span>
                            <span className="font-bold text-slate-800">{week.oracaoInicial || "-"}</span>
                          </div>
                        </div>

                        {/* Parts list grouped by section colors */}
                        <div className="space-y-3">
                          {week.parts.map((part) => {
                            const isTesouro = /TESOURO|JÓIA|JOIA|LEITURA DA BÍBLIA/.test(part.title.toUpperCase());
                            const isMinisterio = /INICIANDO|CULTIVANDO|FAZENDO|EXPLICANDO/.test(part.title.toUpperCase());
                            
                            let bgClass = "bg-rose-50/50 border-rose-100 text-rose-900";
                            let badgeClass = "bg-rose-600 text-white";
                            let sectionName = "Vida Cristã";

                            if (isTesouro) {
                              bgClass = "bg-sky-50/50 border-sky-100 text-sky-900";
                              badgeClass = "bg-sky-700 text-white";
                              sectionName = "Tesouros";
                            } else if (isMinisterio) {
                              bgClass = "bg-amber-50/50 border-amber-100 text-amber-900";
                              badgeClass = "bg-amber-600 text-white";
                              sectionName = "Ministério";
                            }

                            return (
                              <div key={part.id} className={`p-3 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${bgClass}`}>
                                <div className="flex items-start gap-2.5">
                                  {part.num && (
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded shrink-0 ${badgeClass}`}>
                                      {part.num} min
                                    </span>
                                  )}
                                  <div>
                                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 block">{sectionName}</span>
                                    <span className="font-bold text-sm sm:text-base block leading-tight">{part.title}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-md border border-slate-100 self-start sm:self-auto">
                                  <UserCheck className="h-4 w-4 text-slate-500 shrink-0" />
                                  <span className="font-bold text-sm text-slate-800">{part.assignee || "Não designado"}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Final Roles */}
                        <div className="grid sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <div className="flex items-center justify-between text-sm border-b sm:border-b-0 sm:border-r border-slate-200 pb-2 sm:pb-0 sm:pr-4">
                            <span className="font-semibold text-slate-500">LEITOR DO ESTUDO:</span>
                            <span className="font-bold text-slate-800">{week.leitorEstudo || "-"}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm sm:pl-2">
                            <span className="font-semibold text-slate-500">ORAÇÃO FINAL:</span>
                            <span className="font-bold text-slate-800">{week.oracaoFinal || "-"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                <BookOpenCheck className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500">Nenhum programa de Vida e Ministério cadastrado no momento.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Agenda de Discursos */}
        {activeTab === "agenda" && (
          <div className="space-y-4">
            {sortedSchedules.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                <Calendar className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500">Nenhum discurso agendado para as próximas semanas.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {sortedSchedules.map((sch) => {
                  const speaker = speakers.find((s) => s.id === sch.speakerId);
                  const cong = congs.find((c) => c.id === speaker?.congregationId);
                  const theme = themes.find((t) => t.number === sch.themeNumber);
                  const formattedDate = new Date(sch.date).toLocaleDateString("pt-BR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  });

                  return (
                    <div key={sch.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-blue-300 transition-colors">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm capitalize">
                          <Clock className="h-4 w-4" />
                          <span>{formattedDate}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-900">
                            {theme ? `Nº ${theme.number} - ${theme.title}` : "Tema não especificado"}
                          </h3>
                          <p className="text-slate-500 text-sm">
                            Orador: <span className="font-semibold text-slate-700">{speaker?.name || "A definir"}</span>
                            {cong && ` · Congregação: ${cong.name}`}
                          </p>
                        </div>
                      </div>
                      <div className="bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-100 self-start md:self-auto text-xs font-medium text-slate-600">
                        Discurso Público de Domingo
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Oradores */}
        {activeTab === "oradores" && (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar orador por nome ou congregação..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {filteredSpeakers.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                <Users className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500">Nenhum orador encontrado para a busca realizada.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSpeakers.map((s) => {
                  const co = congs.find((c) => c.id === s.congregationId);
                  const count = schedules.filter((x) => x.speakerId === s.id).length;
                  return (
                    <div key={s.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-start gap-3 hover:shadow-md transition-shadow">
                      <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center shrink-0">
                        {s.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 truncate">{s.name}</h4>
                        <p className="text-xs text-slate-500 font-medium truncate mb-1">
                          {co?.name || "Sem congregação"}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {s.phone && (
                            <span className="inline-flex items-center gap-1 text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                              <Phone className="h-3 w-3" />
                              {s.phone}
                            </span>
                          )}
                          <span className="inline-flex items-center text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-medium">
                            {count} discurso(s) agendado(s)
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm space-y-2">
          <p className="font-semibold text-slate-300">Arranjo Congregacional - George Oetterer</p>
          <p className="text-slate-500">© {new Date().getFullYear()} George Oetterer. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
