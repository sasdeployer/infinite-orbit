"use client";

import { type GameElement } from "@/lib/constants";
import ElementCard from "./ElementCard";

interface ElementTrayProps {
  elements: GameElement[];
  onSelect: (element: GameElement) => void;
  selectedNames: string[];
}

export default function ElementTray({ elements, onSelect, selectedNames }: ElementTrayProps) {
  return (
    <div className="element-tray">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--color-cyan-dim)]">
        <span className="text-xs font-mono text-[var(--color-cyan)] uppercase tracking-widest">
          Elements
        </span>
        <span className="text-xs font-mono text-white/40">
          {elements.length} discovered
        </span>
      </div>
      <div className="element-tray-grid">
        {elements.map((el) => (
          <ElementCard
            key={el.name}
            element={el}
            onClick={onSelect}
            isSelected={selectedNames.includes(el.name)}
          />
        ))}
      </div>
    </div>
  );
}
