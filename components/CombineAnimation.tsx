"use client";

import { type GameElement } from "@/lib/constants";

interface CombineAnimationProps {
  slot1: GameElement | null;
  slot2: GameElement | null;
  result: (GameElement & { isNew: boolean; isValid: boolean }) | null;
  isLoading: boolean;
  onClearSlot: (index: 0 | 1) => void;
}

export default function CombineAnimation({ slot1, slot2, result, isLoading, onClearSlot }: CombineAnimationProps) {
  return (
    <div className="combine-zone">
      {/* Instruction hint */}
      {!slot1 && !result && !isLoading && (
        <p className="text-[10px] font-mono text-white/25 mb-2 tracking-widest uppercase">
          Select two elements to combine
        </p>
      )}

      {/* Combination slots */}
      <div className="flex items-center justify-center gap-3 sm:gap-5">
        <button
          onClick={() => onClearSlot(0)}
          className={`combine-slot ${slot1 ? "combine-slot-filled" : ""}`}
        >
          {slot1 ? (
            <span className="flex items-center gap-2">
              <span className="text-2xl">{slot1.emoji}</span>
              <span className="text-sm font-medium">{slot1.name}</span>
            </span>
          ) : (
            <span className="flex flex-col items-center gap-0.5">
              <span className="text-white/15 text-lg">?</span>
              <span className="text-white/15 text-[9px] font-mono tracking-wider">ELEMENT</span>
            </span>
          )}
        </button>

        <div className="flex flex-col items-center">
          <span className="text-[var(--color-cyan)] text-2xl font-bold leading-none">+</span>
        </div>

        <button
          onClick={() => onClearSlot(1)}
          className={`combine-slot ${slot2 ? "combine-slot-filled" : ""}`}
        >
          {slot2 ? (
            <span className="flex items-center gap-2">
              <span className="text-2xl">{slot2.emoji}</span>
              <span className="text-sm font-medium">{slot2.name}</span>
            </span>
          ) : (
            <span className="flex flex-col items-center gap-0.5">
              <span className="text-white/15 text-lg">?</span>
              <span className="text-white/15 text-[9px] font-mono tracking-wider">ELEMENT</span>
            </span>
          )}
        </button>
      </div>

      {/* Result area */}
      <div className="min-h-[60px] flex items-center justify-center mt-2">
        {isLoading && (
          <div className="flex items-center gap-3 text-[var(--color-cyan)]">
            <div className="loading-dots">
              <span /><span /><span />
            </div>
            <span className="text-sm font-mono">Computing trajectory...</span>
          </div>
        )}

        {result && !isLoading && (
          <div className={`result-card ${result.isValid ? "result-valid" : "result-invalid"} ${result.isNew ? "result-first" : ""}`}>
            {result.isNew && result.isValid && (
              <div className="first-discovery-banner">
                🏆 FIRST DISCOVERY!
              </div>
            )}
            <div className="flex items-center gap-3">
              <span className="text-3xl">{result.emoji}</span>
              <div>
                <div className="font-bold text-white text-base">{result.name}</div>
                <div className="text-xs text-white/50 leading-snug">{result.description}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
