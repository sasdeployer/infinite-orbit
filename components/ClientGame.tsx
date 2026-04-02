"use client";

import dynamic from "next/dynamic";

const StarField = dynamic(() => import("@/components/StarField"), { ssr: false });
const GameBoard = dynamic(() => import("@/components/GameBoard"), { ssr: false });

export default function ClientGame() {
  return (
    <>
      <StarField />
      <main className="relative z-10 max-w-3xl mx-auto">
        <GameBoard />
      </main>
    </>
  );
}
