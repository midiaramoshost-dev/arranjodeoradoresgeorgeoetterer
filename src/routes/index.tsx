import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Shield,
  MapPin,
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
      <section className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-20 px-4 text-center shadow-inner flex-1 flex items-center justify-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Programa de Reuniões e Oradores
          </h1>
          <p className="text-blue-100 text-base sm:text-xl max-w-2xl mx-auto font-light mb-8">
            Gerencie e consulte de forma rápida e prática as designações de Vida e Ministério Cristão, a agenda de discursos públicos e a lista de oradores.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-base font-bold text-blue-700 shadow-md hover:bg-blue-50 transition-all transform hover:-translate-y-0.5"
            >
              <UserPlus className="h-5 w-5" />
              <span>Acessar Painel de Gestão</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm space-y-2">
          <p className="font-semibold text-slate-300">Arranjo Congregacional - George Oetterer</p>
          <p className="text-slate-500">© {new Date().getFullYear()} George Oetterer. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
