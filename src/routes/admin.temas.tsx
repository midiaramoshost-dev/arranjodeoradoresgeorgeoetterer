import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, CheckCircle2, Circle } from "lucide-react";
import { formatDate } from "@/lib/format";

const illustrationScenarios = [
  {
    concept: "Conceito principal",
    text: (title: string) => `Imagine uma situação em que você precise aplicar o princípio de “${title}”. Em vez de agir por impulso, pare por alguns instantes, relembre o que aprendeu e escolha uma atitude coerente com esse tema.`
  },
  {
    concept: "Aplicação prática",
    text: (title: string) => `Durante a semana, procure uma oportunidade concreta de colocar “${title}” em prática. Uma pequena ação, feita com sinceridade, pode mostrar como esse ensinamento funciona na vida real.`
  },
  {
    concept: "Na família",
    text: (title: string) => `Uma família conversa sobre “${title}” durante uma refeição. Cada pessoa comenta uma situação em que esse princípio pode ser útil e, juntos, escolhem uma atitude para praticá-lo no lar.`
  },
  {
    concept: "Para os jovens",
    text: (title: string) => `Um jovem enfrenta pressão de colegas ou recebe uma mensagem difícil na internet. Lembrar-se de “${title}” o ajuda a pensar antes de responder e a tomar uma decisão equilibrada.`
  },
  {
    concept: "Em uma dificuldade",
    text: (title: string) => `Quando surge um problema inesperado, a pessoa pode se lembrar de “${title}”. Isso não elimina a dificuldade, mas evita uma reação precipitada e ajuda a identificar o próximo passo correto.`
  },
  {
    concept: "Estudo bíblico",
    text: (title: string) => `Ao estudar um relato bíblico relacionado a “${title}”, observe as decisões dos personagens, os resultados de suas escolhas e as qualidades que demonstraram. Depois, pense em como imitar o bom exemplo.`
  },
  {
    concept: "Reunião cristã",
    text: (title: string) => `Em uma reunião cristã, alguém ouve um comentário sobre “${title}” que se aplica diretamente à sua situação. Ao prestar atenção e anotar uma ideia, consegue sair decidido a fazer uma mudança.`
  },
  {
    concept: "Observando a criação",
    text: (title: string) => `Ao observar a ordem e a beleza da criação, uma pessoa medita em como isso reforça o valor de “${title}”. Essa reflexão aumenta sua gratidão e torna o tema mais pessoal.`
  },
  {
    concept: "Ajudando alguém",
    text: (title: string) => `Uma pessoa percebe que um amigo está passando por uma situação relacionada a “${title}”. Em vez de oferecer apenas palavras, ela escuta com atenção e oferece ajuda prática, demonstrando o princípio em ação.`
  },
  {
    concept: "Decisão sábia",
    text: (title: string) => `Antes de escolher o caminho mais fácil, alguém considera como suas opções se relacionam com “${title}”. Pensar nas consequências para si e para outros torna possível tomar uma decisão mais sábia.`
  },
  {
    concept: "Confiança",
    text: (title: string) => `Mesmo sem saber exatamente o que acontecerá, a pessoa segue em frente porque confia na orientação ligada a “${title}”. Cada resultado positivo fortalece ainda mais essa confiança.`
  },
  {
    concept: "Esperança",
    text: (title: string) => `Durante um período difícil, “${title}” funciona como uma âncora. A pessoa reconhece os problemas, mas não perde a esperança e continua fazendo o que é certo todos os dias.`
  },
  {
    concept: "Amor em ação",
    text: (title: string) => `O valor de “${title}” pode ser demonstrado por meio de paciência, bondade e atenção. A pessoa escolhe agir assim mesmo quando ninguém está observando ou agradecendo.`
  },
  {
    concept: "Fé demonstrada",
    text: (title: string) => `A fé relacionada a “${title}” não fica apenas nas palavras. Ela se torna visível quando a pessoa ajusta suas escolhas e mantém uma rotina de boas ações, mesmo em pequenas coisas.`
  },
  {
    concept: "Aplicação semanal",
    text: (title: string) => `Escolha uma meta simples relacionada a “${title}” para esta semana. No fim dos dias, avalie o que mudou em seus pensamentos, conversas e decisões e defina o próximo passo.`
  },
];

function IllustrationGallery({ title, themeNum }: { title: string; themeNum: number }) {
  const illustrations = illustrationScenarios.map((scenario) => ({
    concept: scenario.concept,
    text: scenario.text(title),
  }));

  return (
    <details className="mt-3 rounded-lg border border-border bg-muted/20 px-3 py-2">
      <summary className="cursor-pointer text-xs font-medium text-brand outline-none focus-visible:ring-2 focus-visible:ring-ring">
        Visualizar 15 ilustrações escritas
      </summary>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {illustrations.map((illustration, index) => (
          <article key={`${themeNum}-${illustration.concept}`} className="rounded-md border bg-card p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-brand">
              {index + 1}. {illustration.concept}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {illustration.text}
            </p>
          </article>
        ))}
      </div>
    </details>
  );
}

export const Route = createFileRoute("/admin/temas")({ component: Temas });

function Temas() {
  const themes = useStore((s) => s.themes);
  const schedules = useStore((s) => s.schedules);
  const speakers = useStore((s) => s.speakers);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "free" | "used">("all");

  const scheduleByNum = useMemo(() => {
    const m = new Map<number, typeof schedules>();
    schedules.forEach((s) => {
      const arr = m.get(s.themeNum) || [];
      arr.push(s);
      m.set(s.themeNum, arr);
    });
    return m;
  }, [schedules]);

  const filtered = themes.filter((t) => {
    const matches = !q || t.title.toLowerCase().includes(q.toLowerCase()) || String(t.num).includes(q);
    const used = scheduleByNum.has(t.num);
    return matches && (filter === "all" || (filter === "free" ? !used : used));
  });

  return (
    <div className="mx-auto max-w-5xl p-6 md:p-10">
      <h1 className="font-display text-3xl">Temas de discursos</h1>
      <p className="mt-1 text-muted-foreground">
        {themes.length} temas oficiais · cada tema possui 15 ilustrações escritas e relacionadas.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Buscar por número ou título…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="flex gap-1 rounded-md bg-muted p-1">
          {(["all", "free", "used"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`rounded px-3 py-1.5 text-sm ${filter === f ? "bg-card shadow-sm" : "text-muted-foreground"}`}>
              {f === "all" ? "Todos" : f === "free" ? "Disponíveis" : "Designados"}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6 space-y-2">
        {filtered.map((t) => {
          const sched = scheduleByNum.get(t.num);
          const used = !!sched;
          return (
            <Card key={t.num} className={used ? "border-brand/30 bg-brand/5" : ""}>
              <CardContent className="flex items-start gap-4 p-4">
                <div className="w-8 pt-0.5 font-mono text-xs text-muted-foreground">{t.num}</div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{t.title}</div>
                  <Badge variant="outline" className="mt-2 font-normal">15 ilustrações escritas</Badge>
                  {sched && (
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {sched.map((s) => {
                        const sp = speakers.find((x) => x.id === s.speakerId);
                        return <Badge key={s.id} variant="secondary" className="font-normal">{formatDate(s.date)}{sp ? ` · ${sp.name}` : ""}</Badge>;
                      })}
                    </div>
                  )}
                  <IllustrationGallery title={t.title} themeNum={t.num} />
                </div>
                {used ? <CheckCircle2 className="h-5 w-5 shrink-0 text-brand" /> : <Circle className="h-5 w-5 shrink-0 text-muted-foreground/40" />}
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && <p className="py-10 text-center text-muted-foreground">Nada encontrado.</p>}
      </div>
    </div>
  );
}
