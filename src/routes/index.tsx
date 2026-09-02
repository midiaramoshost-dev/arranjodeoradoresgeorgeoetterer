import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Arranjo — Organização simples para congregações" },
      {
        name: "description",
        content:
          "Organize oradores, designações e reuniões Vida e Ministério com clareza e simplicidade.",
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
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 12h14m-6-6 6 6-6 6"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Z"
      />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m7-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.87m-2-9.96a4 4 0 0 1 0 7.75"
      />
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

function Home() {
  return (
    <main className="min-h-screen bg-[#f7f8f6] text-[#173b3e]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 md:px-8">
        <a href="#inicio" className="flex items-center gap-3" aria-label="Arranjo — início">
          <span className="grid size-9 place-items-center rounded-xl bg-[#174f53] text-sm font-bold text-white">
            A
          </span>
          <span className="text-lg font-bold tracking-tight">Arranjo</span>
        </a>

        <a
          href="#comecar"
          className="rounded-full bg-[#174f53] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#103f43]"
        >
          Começar agora
        </a>
      </header>

      <section
        id="inicio"
        className="mx-auto grid max-w-6xl gap-14 px-5 pb-24 pt-16 md:px-8 md:pb-32 md:pt-24 lg:grid-cols-[1fr_0.9fr] lg:items-center"
      >
        <div className="max-w-2xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.16em] text-[#3a8173]">
            Organização sem complicação
          </p>

          <h1 className="font-display text-5xl leading-[1.02] text-[#153c40] sm:text-6xl md:text-7xl">
            Tudo organizado.
            <span className="block text-[#4c8177]">Nada sobrando.</span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-[#647678]">
            Centralize oradores, designações e reuniões em um espaço simples, claro e fácil de usar.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#comecar"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#174f53] px-7 py-3.5 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#103f43]"
            >
              Organizar minha congregação
              <ArrowRightIcon />
            </a>
            <a
              href="#recursos"
              className="inline-flex items-center justify-center rounded-full border border-[#ccd8d4] bg-white px-7 py-3.5 font-semibold text-[#294f51] transition hover:border-[#91ada6]"
            >
              Conhecer recursos
            </a>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-[#dce5e1] bg-white p-4 shadow-[0_24px_70px_-35px_rgba(23,59,62,0.35)] md:p-6">
          <div className="flex items-center justify-between border-b border-[#e7ece9] pb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#899895]">
                Próxima reunião
              </p>
              <p className="mt-1 font-semibold text-[#244b4e]">Terça-feira, 19:30</p>
            </div>
            <span className="rounded-full bg-[#e7f1ed] px-3 py-1.5 text-xs font-semibold text-[#327464]">
              Confirmada
            </span>
          </div>

          <div className="py-6">
            <p className="text-sm text-[#7c8d8a]">Vida e Ministério</p>
            <h2 className="mt-2 text-2xl text-[#1d4447]">Reunião do meio de semana</h2>
          </div>

          <div className="space-y-3">
            {[
              ["Presidente", "André Silva", "AS"],
              ["Oração inicial", "Marcos Paulo", "MP"],
              ["Leitura da Bíblia", "João Costa", "JC"],
            ].map(([role, name, initials]) => (
              <div
                key={role}
                className="flex items-center gap-3 rounded-xl bg-[#f5f7f5] px-4 py-3"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#dcebe5] text-xs font-bold text-[#347463]">
                  {initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-[#85938f]">{role}</p>
                  <p className="truncate text-sm font-semibold text-[#345356]">{name}</p>
                </div>
                <span className="text-[#3b806f]">
                  <CheckIcon />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="recursos" className="border-y border-[#e1e7e3] bg-white">
        <div className="mx-auto grid max-w-6xl gap-px px-5 py-16 md:grid-cols-3 md:px-8 md:py-20">
          <article className="py-6 md:pr-10">
            <span className="grid size-10 place-items-center rounded-xl bg-[#e7f1ed] text-[#357665]">
              <CalendarIcon />
            </span>
            <h2 className="mt-5 text-xl text-[#20474a]">Programação clara</h2>
            <p className="mt-2 leading-7 text-[#6c7d7f]">
              Visualize reuniões e designações sem depender de várias planilhas.
            </p>
          </article>

          <article className="border-[#e5eae7] py-6 md:border-x md:px-10">
            <span className="grid size-10 place-items-center rounded-xl bg-[#e7f1ed] text-[#357665]">
              <UsersIcon />
            </span>
            <h2 className="mt-5 text-xl text-[#20474a]">Pessoas centralizadas</h2>
            <p className="mt-2 leading-7 text-[#6c7d7f]">
              Encontre contatos, temas e disponibilidade em um único lugar.
            </p>
          </article>

          <article className="py-6 md:pl-10">
            <span className="grid size-10 place-items-center rounded-xl bg-[#e7f1ed] text-[#357665]">
              <CheckIcon />
            </span>
            <h2 className="mt-5 text-xl text-[#20474a]">Menos imprevistos</h2>
            <p className="mt-2 leading-7 text-[#6c7d7f]">
              Acompanhe confirmações e mantenha todos alinhados com facilidade.
            </p>
          </article>
        </div>
      </section>

      <section id="comecar" className="px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-4xl leading-tight text-[#173b3e] md:text-5xl">
            Mais clareza para servir melhor.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-[#687a7c]">
            Comece com uma rotina mais simples para toda a congregação.
          </p>
          <a
            href="#inicio"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#174f53] px-8 py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#103f43]"
          >
            Quero começar
            <ArrowRightIcon />
          </a>
        </div>
      </section>

      <footer className="border-t border-[#e1e7e3]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-center text-sm text-[#758486] md:flex-row md:px-8 md:text-left">
          <div className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-lg bg-[#174f53] text-xs font-bold text-white">
              A
            </span>
            <span className="font-semibold text-[#315457]">Arranjo</span>
          </div>
          <p>© {new Date().getFullYear()} Arranjo</p>
        </div>
      </footer>
    </main>
  );
}
