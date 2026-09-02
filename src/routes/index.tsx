import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Arranjo de oradores e Vida e Ministério" },
      {
        name: "description",
        content: "Arranjo de oradores e Vida e Ministério.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f4ec] px-5 text-center text-[#173b40]">
      <h1 className="font-display text-4xl leading-tight md:text-6xl">
        Arranjo de oradores e Vida e Ministério
      </h1>
    </main>
  );
}
