import ClientGame from "@/components/ClientGame";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Header — SSR, always visible immediately */}
      <header className="sticky top-0 z-40 border-b border-[rgba(0,240,255,0.1)] bg-black/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-mono text-lg sm:text-xl font-bold tracking-wider text-white">
              INFINITE <span className="text-[var(--color-cyan)]">ORBIT</span>
            </h1>
            <p className="text-[10px] sm:text-xs font-mono text-[var(--color-amber)] animate-pulse-slow tracking-widest">
              Recreate Artemis II
            </p>
          </div>
          <div className="text-2xl" title="Artemis II Launch Day">
            &#x1F680;
          </div>
        </div>
      </header>

      {/* Game — client only, no SSR, no hydration issues */}
      <ClientGame />

      {/* Footer */}
      <footer className="relative z-10 text-center py-4 border-t border-[rgba(0,240,255,0.08)]">
        <p className="text-[10px] font-mono text-white/20 mb-2">
          An AI-powered orbital mechanics discovery game
        </p>
        <a
          href="https://nexlayer.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-white/40 hover:text-[var(--color-cyan)] transition-colors"
        >
          Powered by <span className="font-bold text-white/60">Nexlayer</span>
        </a>
      </footer>
    </div>
  );
}
