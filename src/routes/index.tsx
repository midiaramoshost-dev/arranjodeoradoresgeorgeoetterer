import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, MapPin } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "George Oetterer - Portal Oficial" },
      {
        name: "description",
        content: "Portal de informações, serviços e gestão do distrito de George Oetterer.",
      },
    ],
  }),
  component: Home,
});

function Home() { 
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <MapPin className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">George Oetterer</span>
          </div>
          <Link
            to="/admin"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            <Shield className="h-4 w-4" />
            <span>Painel de Gestão</span>
          </Link>
        </div>
      </header>

      {/* Main Content - Aguardando novas opções */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full bg-white rounded-2xl p-8 sm:p-12 shadow-sm border border-slate-200 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-4">
            Bem-vindo ao Portal de George Oetterer
          </h1>
          <p className="text-slate-600 mb-8">
            Aguardando novas opções de funcionalidades...
          </p>
          <div className="flex justify-center">
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-sm hover:bg-blue-700 transition-all"
            >
              <Shield className="h-4 w-4" />
              Acessar Painel de Gestão
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p>© {new Date().getFullYear()} George Oetterer. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
