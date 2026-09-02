import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Arranjo — Oradores e Vida e Ministério" },
      {
        name: "description",
        content:
          "Organize oradores, designações e reuniões Vida e Ministério de forma simples, visual e colaborativa.",
      },
    ],
  }),
  component: Home,
});

function ArrowRightIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m7-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.87m-2-9.96a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Zm-8 13h4" />
    </svg>
  );
}

function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f7f2] text-[#16383c]">
      <section className="relative border-b border-[#dce5df]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(79,167,145,0.18),transparent_32%),radial-gradient(circle_at_10%_75%,rgba(239,190,102,0.17),transparent_28%)]" />

        <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">
          <a href="#inicio" className="flex items-center gap-3" aria-label="Arranjo — início">
            <span className="grid size-10 place-items-center rounded-2xl bg-[#174f53] text-sm font-bold text-white shadow-lg shadow-[#174f53]/20">
              A
            </span>
            <span className="text-lg font-bold tracking-tight text-[#173b40]">Arranjo</span>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-medium text-[#496266] md:flex" aria-label="Navegação principal">
            <a className="transition-colors hover:text-[#174f53]" href="#recursos">Recursos</a>
            <a className="transition-colors hover:text-[#174f53]" href="#como-funciona">Como funciona</a>
            <a className="transition-colors hover:text-[#174f53]" href="#beneficios">Benefícios</a>
          </nav>

          <a
            href="#comecar"
            className="rounded-full bg-[#174f53] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#174f53]/20 transition hover:-translate-y-0.5 hover:bg-[#0f4145]"
          >
            Começar agora
          </a>
        </header>

        <div id="inicio" className="relative z-10 mx-auto grid max-w-7xl gap-14 px-5 pb-20 pt-14 md:px-8 md:pb-28 md:pt-20 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#c9ddd5] bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#28665e] shadow-sm backdrop-blur">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#46a58b] opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-[#31836f]" />
              </span>
              Organização que traz tranquilidade
            </div>

            <h1 className="font-display text-5xl leading-[0.98] text-[#153c40] sm:text-6xl md:text-7xl">
              Menos planilhas.
              <span className="mt-2 block text-[#3a8b78]">Mais tempo para o que importa.</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-[#587075] md:text-xl">
              Centralize oradores, designações e reuniões Vida e Ministério em uma experiência simples, bonita e feita para colaborar.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#comecar"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#174f53] px-7 py-4 font-bold text-white shadow-xl shadow-[#174f53]/20 transition hover:-translate-y-1 hover:bg-[#0f4145]"
              >
                Organizar minha congregação
                <ArrowRightIcon />
              </a>
              <a
                href="#como-funciona"
                className="inline-flex items-center justify-center rounded-full border border-[#cbdad5] bg-white/75 px-7 py-4 font-bold text-[#234f52] backdrop-blur transition hover:border-[#79a99b] hover:bg-white"
              >
                Ver como funciona
              </a>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#607478]">
              <span className="flex items-center gap-2"><span className="grid size-5 place-items-center rounded-full bg-[#dcefe6] text-[#26705f]"><CheckIcon /></span>Fácil de usar</span>
              <span className="flex items-center gap-2"><span className="grid size-5 place-items-center rounded-full bg-[#dcefe6] text-[#26705f]"><CheckIcon /></span>Responsivo</span>
              <span className="flex items-center gap-2"><span className="grid size-5 place-items-center rounded-full bg-[#dcefe6] text-[#26705f]"><CheckIcon /></span>Tudo em um só lugar</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-2xl lg:mx-0">
            <div className="absolute -left-10 top-20 size-28 rounded-full bg-[#efc778]/30 blur-2xl" />
            <div className="absolute -right-8 bottom-10 size-36 rounded-full bg-[#54a58f]/25 blur-3xl" />

            <div className="relative rotate-[1deg] rounded-[2rem] border border-white/80 bg-white/90 p-3 shadow-[0_35px_80px_-25px_rgba(23,59,64,0.38)] backdrop-blur md:p-5">
              <div className="overflow-hidden rounded-[1.4rem] border border-[#dce7e2] bg-[#f9faf7]">
                <div className="flex items-center justify-between border-b border-[#e1e8e4] bg-white px-5 py-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#81918e]">Visão semanal</p>
                    <p className="mt-1 font-bold text-[#21494d]">12 — 18 de agosto</p>
                  </div>
                  <div className="flex -space-x-2">
                    <span className="grid size-9 place-items-center rounded-full border-2 border-white bg-[#f0c978] text-xs font-bold text-[#5c4820]">JM</span>
                    <span className="grid size-9 place-items-center rounded-full border-2 border-white bg-[#83b9aa] text-xs font-bold text-white">RL</span>
                    <span className="grid size-9 place-items-center rounded-full border-2 border-white bg-[#315f65] text-xs font-bold text-white">+4</span>
                  </div>
                </div>

                <div className="grid gap-3 p-4 sm:grid-cols-2 md:p-5">
                  <article className="rounded-2xl border border-[#dce7e2] bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-[#e4f2ed] px-3 py-1 text-xs font-bold text-[#28705f]">Vida e Ministério</span>
                      <span className="text-xs text-[#879592]">Ter, 19:30</span>
                    </div>
                    <h2 className="mt-5 text-lg font-bold text-[#21494d]">Reunião do meio de semana</h2>
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-3 rounded-xl bg-[#f5f7f4] p-3">
                        <span className="grid size-8 place-items-center rounded-full bg-[#d9aa61] text-xs font-bold text-white">AS</span>
                        <div>
                          <p className="text-xs text-[#879592]">Presidente</p>
                          <p className="text-sm font-semibold text-[#38575a]">André Silva</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-xl bg-[#f5f7f4] p-3">
                        <span className="grid size-8 place-items-center rounded-full bg-[#4b8d80] text-xs font-bold text-white">MP</span>
                        <div>
                          <p className="text-xs text-[#879592]">Oração inicial</p>
                          <p className="text-sm font-semibold text-[#38575a]">Marcos Paulo</p>
                        </div>
                      </div>
                    </div>
                  </article>

                  <article className="rounded-2xl border border-[#dce7e2] bg-[#174f53] p-4 text-white shadow-lg shadow-[#174f53]/15">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-[#d7eee7]">Discurso público</span>
                      <span className="text-xs text-white/60">Dom, 18:00</span>
                    </div>
                    <p className="mt-6 text-xs font-medium uppercase tracking-[0.15em] text-[#94c6ba]">Tema da semana</p>
                    <h2 className="mt-2 text-xl leading-snug text-white">Como fortalecer sua amizade com Deus?</h2>
                    <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
                      <span className="grid size-9 place-items-center rounded-full bg-[#efc778] text-xs font-bold text-[#4b3c20]">JC</span>
                      <div>
                        <p className="text-xs text-white/55">Orador visitante</p>
                        <p className="text-sm font-semibold">João Costa</p>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-7 -left-3 flex items-center gap-3 rounded-2xl border border-white bg-white p-3 pr-5 shadow-xl md:-left-10">
              <span className="grid size-10 place-items-center rounded-xl bg-[#e2f1eb] text-[#347967]"><CheckIcon /></span>
              <div>
                <p className="text-xs text-[#7a8c89]">Programação</p>
                <p className="text-sm font-bold text-[#244b4e]">100% organizada</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="beneficios" className="bg-[#174f53] text-white">
        <div className="mx-auto grid max-w-7xl divide-y divide-white/10 px-5 md:grid-cols-3 md:divide-x md:divide-y-0 md:px-8">
          <div className="py-8 text-center md:py-10">
            <strong className="font-display text-3xl text-[#f0ca82]">Uma só visão</strong>
            <p className="mt-1 text-sm text-white/65">para toda a programação</p>
          </div>
          <div className="py-8 text-center md:py-10">
            <strong className="font-display text-3xl text-[#f0ca82]">Menos retrabalho</strong>
            <p className="mt-1 text-sm text-white/65">ao organizar designações</p>
          </div>
          <div className="py-8 text-center md:py-10">
            <strong className="font-display text-3xl text-[#f0ca82]">Mais clareza</strong>
            <p className="mt-1 text-sm text-white/65">para todos os envolvidos</p>
          </div>
        </div>
      </section>

      <section id="recursos" className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#3a8b78]">Tudo mais simples</p>
          <h2 className="mt-4 font-display text-4xl leading-tight text-[#173b40] md:text-5xl">Organização leve, clara e sem complicação.</h2>
          <p className="mt-5 text-lg leading-8 text-[#66797c]">Recursos essenciais para cuidar da programação com confiança e ganhar tempo toda semana.</p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          <article className="group rounded-[1.75rem] border border-[#dce5df] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#173b40]/10">
            <span className="grid size-12 place-items-center rounded-2xl bg-[#dff0e9] text-[#2f7968] transition group-hover:scale-110"><CalendarIcon /></span>
            <h3 className="mt-6 text-2xl text-[#1e464a]">Agenda visual</h3>
            <p className="mt-3 leading-7 text-[#697b7e]">Veja reuniões, partes e responsáveis em uma programação clara e fácil de consultar.</p>
          </article>

          <article className="group rounded-[1.75rem] border border-[#dce5df] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#173b40]/10">
            <span className="grid size-12 place-items-center rounded-2xl bg-[#f8e9c8] text-[#9b7029] transition group-hover:scale-110"><UsersIcon /></span>
            <h3 className="mt-6 text-2xl text-[#1e464a]">Oradores centralizados</h3>
            <p className="mt-3 leading-7 text-[#697b7e]">Mantenha contatos, congregações, temas e disponibilidade sempre ao alcance.</p>
          </article>

          <article className="group rounded-[1.75rem] border border-[#dce5df] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#173b40]/10">
            <span className="grid size-12 place-items-center rounded-2xl bg-[#e5e9f3] text-[#566b9b] transition group-hover:scale-110"><BellIcon /></span>
            <h3 className="mt-6 text-2xl text-[#1e464a]">Confirmações rápidas</h3>
            <p className="mt-3 leading-7 text-[#697b7e]">Acompanhe cada designação e reduza imprevistos antes das reuniões.</p>
          </article>
        </div>
      </section>

      <section id="como-funciona" className="px-5 pb-20 md:px-8 md:pb-28">
        <div className="mx-auto grid max-w-7xl gap-10 overflow-hidden rounded-[2.25rem] bg-[#e5efe9] p-7 md:p-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#3a8b78]">Como funciona</p>
            <h2 className="mt-4 font-display text-4xl leading-tight text-[#173b40] md:text-5xl">Da escala pronta à reunião em três passos.</h2>
          </div>

          <ol className="grid gap-4 sm:grid-cols-3">
            {[
              ["01", "Cadastre", "Adicione oradores e participantes."],
              ["02", "Organize", "Monte a programação da semana."],
              ["03", "Compartilhe", "Mantenha todos alinhados."],
            ].map(([number, title, description]) => (
              <li key={number} className="rounded-2xl bg-white/80 p-5 shadow-sm">
                <span className="text-sm font-black text-[#3a8b78]">{number}</span>
                <h3 className="mt-6 text-xl text-[#21494d]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#6a7d7e]">{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="comecar" className="px-5 pb-10 md:px-8 md:pb-14">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.25rem] bg-[#153f43] px-6 py-16 text-center text-white shadow-2xl shadow-[#153f43]/20 md:px-12 md:py-20">
          <div className="pointer-events-none absolute -left-20 -top-24 size-72 rounded-full border-[50px] border-white/5" />
          <div className="pointer-events-none absolute -bottom-28 -right-16 size-80 rounded-full border-[55px] border-[#efc778]/10" />
          <div className="relative mx-auto max-w-3xl">
            <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#b6dbd1]">Comece de um jeito melhor</span>
            <h2 className="mt-6 font-display text-4xl leading-tight md:text-6xl">Sua próxima programação pode ser a mais tranquila.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/65">Tenha clareza para organizar e simplicidade para colaborar — tudo em um só lugar.</p>
            <a
              href="#inicio"
              className="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-[#efc778] px-8 py-4 font-bold text-[#3d351f] shadow-xl shadow-black/15 transition hover:-translate-y-1 hover:bg-[#f6d592]"
            >
              Quero começar agora
              <ArrowRightIcon />
            </a>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 text-center text-sm text-[#718184] md:flex-row md:px-8 md:text-left">
        <div className="flex items-center gap-3">
          <span className="grid size-8 place-items-center rounded-xl bg-[#174f53] text-xs font-bold text-white">A</span>
          <span className="font-bold text-[#274d50]">Arranjo</span>
        </div>
        <p>Organização simples para servir melhor.</p>
        <p>© {new Date().getFullYear()} Arranjo</p>
      </footer>
    </main>
  );
}
