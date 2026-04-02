"use client";

import ShareButtons from "./ShareButtons";

interface VictoryScreenProps {
  combinations: number;
  discovered: number;
  onClose: () => void;
}

export default function VictoryScreen({ combinations, discovered, onClose }: VictoryScreenProps) {
  return (
    <div className="victory-overlay" onClick={onClose}>
      <div className="victory-stars" />
      <div className="victory-content" onClick={(e) => e.stopPropagation()}>
        {/* Warp lines effect */}
        <div className="warp-lines" />

        <div className="text-6xl mb-4">🌟</div>

        <h1 className="victory-title">MISSION COMPLETE</h1>

        <p className="text-[var(--color-cyan)] font-mono text-sm sm:text-base mb-2">
          You recreated NASA&apos;s Artemis II trajectory
        </p>

        <div className="victory-stats">
          <div className="victory-stat">
            <span className="text-3xl font-bold text-white">{combinations}</span>
            <span className="text-xs text-white/50 font-mono">COMBINATIONS</span>
          </div>
          <div className="victory-stat">
            <span className="text-3xl font-bold text-white">{discovered}</span>
            <span className="text-xs text-white/50 font-mono">DISCOVERIES</span>
          </div>
        </div>

        {/* Mini trajectory */}
        <div className="my-6">
          <svg viewBox="0 0 300 60" className="w-full max-w-xs mx-auto">
            <path
              d="M 20 50 Q 150 -20 280 50"
              fill="none"
              stroke="var(--color-cyan)"
              strokeWidth="2"
            />
            <text x="20" y="54" textAnchor="middle" fontSize="16">🌍</text>
            <text x="150" y="10" textAnchor="middle" fontSize="12">🚀</text>
            <text x="280" y="54" textAnchor="middle" fontSize="14">🌑</text>
            <text x="150" y="54" textAnchor="middle" fontSize="8" fill="var(--color-amber)" fontFamily="monospace">
              384,400 km
            </text>
          </svg>
        </div>

        <ShareButtons combinations={combinations} />

        <button
          onClick={onClose}
          className="mt-6 text-sm text-white/30 hover:text-white/60 transition-colors font-mono"
        >
          Keep exploring →
        </button>
      </div>
    </div>
  );
}
