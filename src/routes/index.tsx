import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "George Oetterer" },
      { name: "description", content: "George Oetterer" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#120b1f] overflow-hidden relative selection:bg-fuchsia-200 selection:text-[#120b1f]">
      <style>{`
        @keyframes go-pulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.18; transform: scale(1.05); }
        }
        @keyframes go-pulse-delayed {
          0%, 100% { opacity: 0.14; transform: scale(1); }
          50% { opacity: 0.22; transform: scale(1.08); }
        }
        @keyframes go-text-glow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.1) drop-shadow(0 0 24px rgba(244,114,182,0.12)); }
        }
        @keyframes go-line-breathe {
          from { width: 40px; opacity: 0.18; }
          to { width: 180px; opacity: 0.5; }
        }
      `}</style>

      {/* Atmospheric background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-fuchsia-700/20 blur-[120px]"
          style={{ animation: "go-pulse 10s ease-in-out infinite" }}
        />
        <div
          className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-violet-900/30 blur-[140px]"
          style={{ animation: "go-pulse-delayed 12s ease-in-out infinite" }}
        />
      </div>

      {/* Wordmark */}
      <div className="relative z-10 text-center px-6">
        <h1
          className="text-5xl md:text-7xl lg:text-9xl font-light tracking-[0.25em] uppercase leading-none text-transparent bg-clip-text bg-gradient-to-b from-fuchsia-100 via-purple-300 to-violet-500 drop-shadow-[0_0_15px_rgba(244,114,182,0.12)]"
          style={{ fontFamily: "'Cormorant Garamond', serif", animation: "go-text-glow 8s ease-in-out infinite alternate" }}
        >
          George <br className="md:hidden" /> Oetterer
        </h1>

        <div className="mt-8 flex justify-center">
          <div
            className="h-[1px] bg-gradient-to-r from-transparent via-fuchsia-400 to-transparent"
            style={{ animation: "go-line-breathe 3s ease-in-out infinite alternate" }}
          />
        </div>
      </div>

      {/* Subtle grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
