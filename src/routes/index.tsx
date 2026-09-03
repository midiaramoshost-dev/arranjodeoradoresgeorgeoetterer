import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "George Oetterer" },
      {
        name: "description",
        content: "Aplicação George Oetterer integrada ao projeto.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main className="fixed inset-0 z-50 h-screen w-screen overflow-hidden bg-white">
      <iframe
        src="https://georgeoetterer.lovable.app/"
        title="George Oetterer"
        className="h-full w-full border-0 bg-white"
        allow="camera; microphone; clipboard-read; clipboard-write; fullscreen"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </main>
  );
}
