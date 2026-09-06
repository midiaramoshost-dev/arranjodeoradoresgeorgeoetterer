import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield } from "lucide-react";

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

      {/* Botão flutuante premium para acessar o painel administrativo */}
      <Link
        to="/admin"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-brand/90 px-5 py-3 text-sm font-medium text-brand-foreground shadow-xl backdrop-blur-md transition-all duration-300 hover:bg-brand hover:scale-105 hover:shadow-brand/30 active:scale-95 border border-white/10"
        title="Acessar Painel Administrativo"
      >
        <Shield className="h-4 w-4 animate-pulse" />
        <span>Painel de Gestão</span>
      </Link>
    </main>
  );
}
