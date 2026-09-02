import { useMemo, useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { CalendarDays, ChevronDown, Clock3, FilterX, MapPin, Search, Users } from 'lucide-react';
import importedData from '@/data/imported.json';

const illustrationScenarios = [
  { concept: 'Situação do dia a dia', text: (title: string) => `Pense em uma situação comum em que você precise aplicar o tema ${title}. Ao analisar as opções com calma e escolher uma atitude coerente com esse assunto, o aprendizado deixa de ser apenas teórico.` },
  { concept: 'Decisão pessoal', text: (title: string) => `Antes de tomar uma decisão importante relacionada a ${title}, uma pessoa pode comparar seus desejos imediatos com os princípios envolvidos. Essa pausa ajuda a escolher um caminho mais sábio.` },
  { concept: 'Dentro da família', text: (title: string) => `Uma família pode conversar sobre ${title} durante uma refeição e pensar em uma ação prática para a semana. Assim, todos percebem como o tema pode melhorar o ambiente do lar.` },
  { concept: 'Para os jovens', text: (title: string) => `Um jovem pode enfrentar uma situação na escola, nas amizades ou na internet que tenha relação com ${title}. Lembrar desse tema pode ajudá-lo a agir com equilíbrio mesmo quando sofre pressão.` },
  { concept: 'Em uma dificuldade', text: (title: string) => `Quando surge um problema inesperado, refletir sobre ${title} pode evitar uma reação impulsiva. A pessoa consegue identificar o que está sob seu controle e agir de modo mais confiante.` },
  { concept: 'Durante o estudo', text: (title: string) => `Ao estudar um relato bíblico relacionado a ${title}, observe as escolhas, os resultados e as qualidades demonstradas pelos personagens. Depois, pense em uma maneira de imitar esse bom exemplo.` },
  { concept: 'Na congregação', text: (title: string) => `Uma reunião cristã oferece oportunidades para aprender sobre ${title}, ouvir experiências e receber encorajamento. Participar com atenção torna mais fácil colocar o conselho em prática.` },
  { concept: 'Observando a criação', text: (title: string) => `Ao observar a ordem e a beleza da criação, uma pessoa pode meditar em como isso se relaciona com ${title}. Essa reflexão fortalece a gratidão e torna o assunto mais pessoal.` },
  { concept: 'Ajudando alguém', text: (title: string) => `Imagine encontrar alguém passando por uma dificuldade ligada a ${title}. Oferecer tempo, escuta e ajuda prática pode transformar uma explicação sobre o tema em uma demonstração real de amor.` },
  { concept: 'Escolha equilibrada', text: (title: string) => `Para aplicar ${title}, considere não apenas o que parece mais fácil agora, mas também as consequências para você e para outras pessoas. Uma escolha equilibrada costuma produzir melhores resultados.` },
  { concept: 'Confiança', text: (title: string) => `Mesmo sem conhecer todos os detalhes do futuro, alguém pode avançar com confiança ao seguir a orientação relacionada a ${title}. A confiança cresce quando vemos os benefícios de agir corretamente.` },
  { concept: 'Esperança', text: (title: string) => `Em um período difícil, ${title} pode funcionar como uma âncora. A pessoa não ignora os problemas atuais, mas mantém uma esperança firme e continua fazendo o que é certo.` },
  { concept: 'Amor em ação', text: (title: string) => `O amor relacionado a ${title} aparece em atitudes pacientes, bondosas e atenciosas. Ele pode ser demonstrado mesmo quando ninguém está observando e quando seria mais fácil desistir.` },
  { concept: 'Fé demonstrada', text: (title: string) => `A fé não é apenas concordar com uma ideia sobre ${title}; ela também envolve agir de acordo com aquilo que se aprendeu. Pequenas atitudes constantes tornam essa fé visível.` },
  { concept: 'Aplicação semanal', text: (title: string) => `Escolha uma ação simples para aplicar ${title} durante esta semana. No fim dos dias, avalie o que mudou em seus pensamentos, conversas e decisões.` },
];

function IllustrationGallery({ title, themeNum }: { title: string; themeNum: number }) {
  const illustrations = illustrationScenarios.map((scenario) => ({ concept: scenario.concept, text: scenario.text(title) }));
  return (
    <details className='mt-3 rounded-xl border border-[#e2dccf] bg-[#fcfbf7] px-3 py-2 transition-colors open:border-[#d6aa62]'>
      <summary className='cursor-pointer list-inside text-xs font-semibold text-[#8c672d] outline-none focus-visible:ring-2 focus-visible:ring-[#a47b35]'>
        Ver 15 ilustrações escritas especificamente para este tema
      </summary>
      <div className='mt-3 grid gap-2 sm:grid-cols-2 md:grid-cols-3'>
        {illustrations.map((illustration, index) => (
          <article key={`${themeNum}-${illustration.concept}`} className='rounded-lg border border-[#e2dccf] bg-white p-3'>
            <p className='text-[10px] font-semibold uppercase tracking-wide text-[#a47b35]'>{index + 1}. {illustration.concept}</p>
            <p className='mt-2 text-xs leading-relaxed text-[#405653]'>{illustration.text}</p>
          </article>
        ))}
      </div>
    </details>
  );
}

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Agenda Pública | George Oetterer' },
      { name: 'description', content: 'Agenda de discursos, oradores e programação da congregação George Oetterer.' },
    ],
  }),
  component: Home,
});

function Home() {
  const [search, setSearch] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('Todos os meses');
  const months = useMemo(() => Array.from(new Set(importedData.agenda.map((item) => item.mes))), []);
  const incompleteAgendaCount = useMemo(() => importedData.agenda.filter((item) => !item.tema || !item.orador || !item.congregacao || !item.presidente || !item.leitor).length, []);
  const emptyAgendaCount = useMemo(() => importedData.agenda.filter((item) => !item.tema && !item.orador && !item.congregacao).length, []);
  const filteredAgenda = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('pt-BR');
    return importedData.agenda.filter((item) => {
      const matchesMonth = selectedMonth === 'Todos os meses' || item.mes === selectedMonth;
      const content = [item.data, item.orador, item.tema, item.temaNum, item.congregacao, item.telefone, item.presidente, item.leitor, item.obs].join(' ').toLocaleLowerCase('pt-BR');
      return matchesMonth && (!normalizedSearch || content.includes(normalizedSearch));
    });
  }, [search, selectedMonth]);
  const groupedAgenda = useMemo(() => filteredAgenda.reduce<Record<string, typeof importedData.agenda>>((groups, item) => { groups[item.mes] ??= []; groups[item.mes].push(item); return groups; }, {}), [filteredAgenda]);
  const hasFilters = Boolean(search.trim()) || selectedMonth !== 'Todos os meses';
  const clearFilters = () => { setSearch(''); setSelectedMonth('Todos os meses'); };

  return (
    <div className='min-h-screen bg-[#f7f4ec] text-[#173b40] selection:bg-[#d6aa62] selection:text-[#173b40]'>
      <header className='sticky top-0 z-20 border-b border-[#31565a] bg-[#173b40]/95 text-[#f7f4ec] shadow-sm backdrop-blur'>
        <div className='mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8'>
          <Link to='/' className='flex items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#d6aa62]' aria-label='Página inicial'>
            <div className='grid h-11 w-11 place-items-center rounded-xl bg-[#d6aa62] font-display text-2xl text-[#173b40]'>G</div>
            <div><p className='font-display text-xl leading-none'>George Oetterer</p><p className='mt-1 text-[10px] uppercase tracking-[0.18em] text-[#d8d1bf] sm:text-xs'>Agenda pública</p></div>
          </Link>
          <Link to='/admin' className='rounded-lg border border-[#d8d1bf]/40 px-3 py-2 text-xs transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6aa62] sm:text-sm'>Área administrativa</Link>
        </div>
      </header>
      <main className='mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14'>
        <section className='mb-10 grid items-end gap-8 lg:grid-cols-[1fr_auto]'><div className='max-w-3xl'><p className='mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#a47b35]'>Programação 2026</p><h1 className='font-display text-4xl leading-tight text-[#173b40] md:text-6xl'>Agenda de discursos e reuniões</h1><p className='mt-4 max-w-2xl text-base leading-relaxed text-[#5c6b69] md:text-lg'>Consulte a programação completa, os temas dos discursos e as designações de cada reunião.</p></div><div className='rounded-2xl border border-[#d9d0bd] bg-white/70 px-5 py-4 text-sm text-[#5c6b69] shadow-sm'><span className='font-semibold text-[#173b40]'>Atualização pública</span><br />Consulte os detalhes antes da reunião.</div></section>
        <section className='mb-10 grid gap-4 sm:grid-cols-3' aria-label='Resumo da agenda'>{[{ icon: CalendarDays, value: importedData.agenda.length, label: 'programações registradas' }, { icon: Users, value: importedData.leitores.length, label: 'leitores cadastrados' }, { icon: Clock3, value: importedData.themes.length, label: 'temas disponíveis' }].map(({ icon: Icon, value, label }) => <div key={label} className='rounded-2xl border border-[#d9d0bd] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md'><Icon className='mb-4 h-5 w-5 text-[#a47b35]' /><p className='text-3xl font-semibold text-[#173b40]'>{value}</p><p className='mt-1 text-sm text-[#6d7773]'>{label}</p></div>)}</section>
        {incompleteAgendaCount > 0 && <section className='mb-10 rounded-2xl border border-[#e3c98e] bg-[#fff8e8] px-5 py-4 text-sm text-[#6d572b]' role='status'><p className='font-semibold text-[#8c672d]'>Conteúdo em atualização</p><p className='mt-1 leading-relaxed'>{incompleteAgendaCount} {incompleteAgendaCount === 1 ? 'programação possui' : 'programações possuem'} algum campo pendente.{emptyAgendaCount > 0 && ` ${emptyAgendaCount} ${emptyAgendaCount === 1 ? 'registro ainda está' : 'registros ainda estão'} sem tema, orador e congregação definidos.`}</p></section>}
        <section className='mb-10 rounded-2xl border border-[#d9d0bd] bg-white p-4 shadow-sm md:p-5' aria-label='Filtros da agenda'><div className='grid gap-3 md:grid-cols-[1fr_240px_auto]'><label className='relative block'><span className='sr-only'>Buscar na agenda</span><Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b938e]' /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder='Buscar por tema, orador ou congregação' className='h-11 w-full rounded-lg border border-[#d9d0bd] bg-[#fcfbf7] pl-10 pr-3 text-sm outline-none transition focus:border-[#a47b35] focus:ring-2 focus:ring-[#a47b35]/20' /></label><label className='relative block'><span className='sr-only'>Filtrar por mês</span><select value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)} className='h-11 w-full appearance-none rounded-lg border border-[#d9d0bd] bg-[#fcfbf7] px-3 pr-9 text-sm outline-none transition focus:border-[#a47b35] focus:ring-2 focus:ring-[#a47b35]/20'><option>Todos os meses</option>{months.map((month) => <option key={month}>{month}</option>)}</select><ChevronDown className='pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b938e]' /></label>{hasFilters && <button type='button' onClick={clearFilters} className='inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#d9d0bd] px-3 text-sm font-medium text-[#6d572b] transition hover:bg-[#f7f4ec] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a47b35]'><FilterX className='h-4 w-4' /> Limpar</button>}</div><p className='mt-3 text-xs text-[#6d7773]'>{filteredAgenda.length} {filteredAgenda.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}</p></section>
        <section className='space-y-10'>{Object.entries(groupedAgenda).map(([month, items]) => <div key={month}><div className='mb-4 flex items-center gap-3'><h2 className='font-display text-3xl text-[#173b40]'>{month}</h2><div className='h-px flex-1 bg-[#d9d0bd]' /></div><div className='grid gap-4 lg:grid-cols-2'>{items.map((item, index) => <article key={`${item.data}-${item.tema}-${index}`} className='rounded-2xl border border-[#d9d0bd] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md'><div className='flex flex-wrap items-start justify-between gap-3'><div><p className='text-sm font-semibold uppercase tracking-[0.12em] text-[#a47b35]'>{item.data}</p><h3 className='mt-2 font-display text-2xl leading-snug text-[#173b40]'>{item.tema || 'Programação a definir'}</h3></div>{item.temaNum && <span className='rounded-full bg-[#f0e7d4] px-3 py-1 text-xs font-semibold text-[#8c672d]'>Tema {item.temaNum}</span>}</div><div className='mt-5 grid gap-3 border-t border-[#eee9dd] pt-4 text-sm text-[#5c6b69] sm:grid-cols-2'><p><strong className='font-medium text-[#173b40]'>Orador:</strong> {item.orador || 'A definir'}</p><p><strong className='font-medium text-[#173b40]'>Presidente:</strong> {item.presidente || 'A definir'}</p><p><strong className='font-medium text-[#173b40]'>Leitor:</strong> {item.leitor || 'A definir'}</p><p className='flex items-start gap-1'><MapPin className='mt-0.5 h-4 w-4 shrink-0 text-[#a47b35]' /><span>{item.congregacao || 'Local a definir'}</span></p></div>{(item.telefone || item.obs) && <div className='mt-4 rounded-lg bg-[#f7f4ec] px-3 py-2 text-xs text-[#6d7773]'>{item.telefone && <span>{item.telefone}</span>}{item.telefone && item.obs && <span> · </span>}{item.obs && <span>{item.obs}</span>}</div>}</article>)}</div></div>)}{filteredAgenda.length === 0 && <div className='rounded-2xl border border-dashed border-[#cfc3aa] bg-white p-10 text-center text-[#6d7773]'><Search className='mx-auto h-8 w-8 text-[#a47b35]' /><p className='mt-3 font-medium text-[#405653]'>Nenhuma programação encontrada</p><p className='mt-1 text-sm'>Tente ajustar os filtros ou limpar a busca.</p>{hasFilters && <button type='button' onClick={clearFilters} className='mt-4 rounded-lg bg-[#173b40] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#28565a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6aa62]'>Limpar filtros</button>}</div>}</section>
        <section className='mt-16 border-t border-[#d9d0bd] pt-10'><div className='mb-5 flex flex-wrap items-end justify-between gap-4'><div><p className='text-sm font-semibold uppercase tracking-[0.2em] text-[#a47b35]'>Referência</p><h2 className='mt-1 font-display text-3xl text-[#173b40]'>Catálogo de temas</h2></div><p className='text-sm text-[#6d7773]'>{importedData.themes.length} temas · 15 ilustrações escritas por tema</p></div><div className='grid gap-2 sm:grid-cols-2 lg:grid-cols-3'>{importedData.themes.map((theme) => <div key={theme.num} className='rounded-lg border border-[#e2dccf] bg-white px-4 py-3 text-sm'><span className='mr-2 font-semibold text-[#a47b35]'>{theme.num}.</span><span className='text-[#405653]'>{theme.title}</span><IllustrationGallery title={theme.title} themeNum={theme.num} /></div>)}</div></section>
      </main>
      <footer className='border-t border-[#d9d0bd] bg-[#173b40] px-5 py-8 text-center text-sm text-[#d8d1bf]'>Agenda pública · George Oetterer · 2026</footer>
    </div>
  );
}
