"use client";

import { useReducer, useCallback, useEffect, useRef } from "react";
import { gameReducer, createInitialState } from "@/lib/game-state";
import { type GameElement } from "@/lib/constants";
import ElementTray from "./ElementTray";
import CombineAnimation from "./CombineAnimation";
import TrajectoryProgress from "./TrajectoryProgress";
import StatsBar from "./StatsBar";
import LiveTracker from "./LiveTracker";
import VictoryScreen from "./VictoryScreen";

export default function GameBoard() {
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState);
  const combineTriggered = useRef(false);

  const handleSelect = useCallback((element: GameElement) => {
    dispatch({ type: "SELECT_ELEMENT", element });
  }, []);

  const handleClearSlot = useCallback((index: 0 | 1) => {
    if (index === 0 || index === 1) {
      dispatch({ type: "CLEAR_SELECTION" });
    }
  }, []);

  // Trigger combination when both slots are filled
  useEffect(() => {
    const [s1, s2] = state.selected;
    if (s1 && s2 && !state.isLoading && !combineTriggered.current) {
      combineTriggered.current = true;
      dispatch({ type: "SET_LOADING", loading: true });

      fetch("/api/combine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ element1: s1.name, element2: s2.name }),
      })
        .then((res) => res.json())
        .then((data) => {
          dispatch({
            type: "COMBINE_RESULT",
            result: { name: data.result, emoji: data.emoji, description: data.description },
            isNew: data.isNew ?? false,
            isValid: data.isValid ?? false,
          });
        })
        .catch(() => {
          dispatch({
            type: "COMBINE_RESULT",
            result: { name: "Nothing", emoji: "\u{1F4AB}", description: "Connection lost in the void" },
            isNew: false,
            isValid: false,
          });
        });
    }
    if (!s1 && !s2) {
      combineTriggered.current = false;
    }
  }, [state.selected, state.isLoading]);

  // Update page title
  useEffect(() => {
    document.title = `Infinite Orbit \u2014 ${state.elements.length} discoveries`;
  }, [state.elements.length]);

  const selectedNames = state.selected
    .filter((s): s is GameElement => s !== null)
    .map((s) => s.name);

  return (
    <div className="game-board">
      {/* Combine zone */}
      <CombineAnimation
        slot1={state.selected[0]}
        slot2={state.selected[1]}
        result={state.lastResult}
        isLoading={state.isLoading}
        onClearSlot={handleClearSlot}
      />

      {/* Element tray */}
      <ElementTray
        elements={state.elements}
        onSelect={handleSelect}
        selectedNames={selectedNames}
      />

      {/* Live Artemis II tracking */}
      <LiveTracker />

      {/* Trajectory progress */}
      <TrajectoryProgress milestonesReached={state.milestonesReached} />

      {/* Stats */}
      <StatsBar
        discovered={state.elements.length}
        firstDiscoveries={state.firstDiscoveries}
        totalCombinations={state.totalCombinations}
      />

      {/* Victory screen */}
      {state.isVictory && (
        <VictoryScreen
          combinations={state.totalCombinations}
          discovered={state.elements.length}
          onClose={() => dispatch({ type: "DISMISS_RESULT" })}
        />
      )}
    </div>
  );
}
