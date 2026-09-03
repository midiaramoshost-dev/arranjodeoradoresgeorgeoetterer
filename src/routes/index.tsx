import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Organização que traz tranquilidade" },
      {
        name: "description",
        content:
          "Centralize oradores, designações e reuniões Vida e Ministério em uma experiência simples, bonita e feita para colaborar.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f8f6] px-5 py-16 text-[#173b3e] md:px-8">
      <section className="mx-auto max-w-4xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#3a8173]">
          Organização que traz tranquilidade
        </p>

        <h1 className="mt-6 font-display text-5xl leading-[1.05] text-[#153c40] sm:text-6xl md:text-7xl">
          Menos planilhas.
          <span className="block text-[#4c8177]">Mais tempo para o que importa.</span>
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-[#647678] md:text-xl">
          Centralize oradores, designações e reuniões Vida e Ministério em uma experiência simples, bonita e feita para colaborar.
        </p>
      </section>
    </main>
  );
}
