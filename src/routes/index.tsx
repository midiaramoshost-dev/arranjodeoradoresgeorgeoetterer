import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, MapPin, Phone, Calendar, Info, ArrowRight } from "lucide-react";

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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
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

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 py-20 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-semibold bg-white/20 text-white mb-4">
            <MapPin className="h-3 w-3" /> Distrito de Iperó / SP
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
            Portal George Oetterer
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Acesse serviços, notícias, informações úteis e colabore com o desenvolvimento da nossa comunidade.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-blue-50 transition-all"
            >
              Acessar Painel Administrativo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Cards de Destaque */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="bg-blue-50 text-blue-600 p-3 rounded-xl w-fit mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Painel de Gestão</h3>
              <p className="text-slate-600 text-sm mb-4">
                Área administrativa para gerenciamento de dados, relatórios e configurações do portal.
              </p>
            </div>
            <Link
              to="/admin"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm inline-flex items-center gap-1"
            >
              Acessar painel <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl w-fit mb-4">
                <Phone className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Telefones Úteis</h3>
              <p className="text-slate-600 text-sm mb-4">
                Encontre contatos de emergência, postos de saúde, escolas e serviços públicos locais.
              </p>
            </div>
            <span className="text-slate-400 text-sm">Em breve</span>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="bg-amber-50 text-amber-600 p-3 rounded-xl w-fit mb-4">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Eventos & Notícias</h3>
              <p className="text-slate-600 text-sm mb-4">
                Fique por dentro das novidades, obras, eventos culturais e avisos importantes do distrito.
              </p>
            </div>
            <span className="text-slate-400 text-sm">Em breve</span>
          </div>
        </div>

        {/* Sobre o Distrito */}
        <section className="mt-16 bg-white rounded-2xl p-8 border border-slate-200">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-blue-600 font-semibold mb-3">
              <Info className="h-5 w-5" />
              <span>Sobre George Oetterer</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Nossa Comunidade</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              George Oetterer é um importante distrito do município de Iperó, localizado na Região Metropolitana de Sorocaba. Com uma comunidade vibrante e em constante crescimento, o distrito se destaca pela sua hospitalidade e localização estratégica.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Este portal foi desenvolvido para facilitar o acesso dos moradores aos serviços públicos, notícias locais e ferramentas de gestão, promovendo mais transparência e integração.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p>© {new Date().getFullYear()} George Oetterer. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
