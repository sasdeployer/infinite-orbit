"use client";

import { type GameElement } from "@/lib/constants";

interface ElementCardProps {
  element: GameElement;
  onClick: (element: GameElement) => void;
  isSelected: boolean;
  isNew?: boolean;
  size?: "sm" | "md";
}

export default function ElementCard({ element, onClick, isSelected, isNew, size = "sm" }: ElementCardProps) {
  return (
    <button
      onClick={() => onClick(element)}
      className={`
        element-card group relative
        ${size === "sm" ? "px-3 py-2 text-sm" : "px-4 py-3 text-base"}
        ${isSelected ? "element-card-selected" : ""}
        ${isNew ? "element-card-new" : ""}
      `}
      title={element.description}
    >
      <span className="mr-1.5">{element.emoji}</span>
      <span className="font-medium">{element.name}</span>
      {isNew && (
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[var(--color-gold)] animate-pulse" />
      )}
    </button>
  );
}
