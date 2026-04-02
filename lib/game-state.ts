import { type GameElement, STARTING_ELEMENTS, MILESTONES, VICTORY_ELEMENTS } from "./constants";

export interface GameState {
  elements: GameElement[];
  discovered: Set<string>;
  selected: [GameElement | null, GameElement | null];
  totalCombinations: number;
  firstDiscoveries: number;
  milestonesReached: string[];
  isVictory: boolean;
  lastResult: (GameElement & { isNew: boolean; isValid: boolean }) | null;
  isLoading: boolean;
}

export type GameAction =
  | { type: "SELECT_ELEMENT"; element: GameElement }
  | { type: "CLEAR_SELECTION" }
  | { type: "SET_LOADING"; loading: boolean }
  | {
      type: "COMBINE_RESULT";
      result: GameElement;
      isNew: boolean;
      isValid: boolean;
    }
  | { type: "DISMISS_RESULT" }
  | { type: "RESET" };

export function createInitialState(): GameState {
  return {
    elements: [...STARTING_ELEMENTS],
    discovered: new Set(STARTING_ELEMENTS.map((e) => e.name)),
    selected: [null, null],
    totalCombinations: 0,
    firstDiscoveries: 0,
    milestonesReached: [],
    isVictory: false,
    lastResult: null,
    isLoading: false,
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "SELECT_ELEMENT": {
      if (state.isLoading) return state;
      if (state.selected[0] === null) {
        return { ...state, selected: [action.element, null], lastResult: null };
      }
      if (state.selected[1] === null) {
        return { ...state, selected: [state.selected[0], action.element] };
      }
      return state;
    }

    case "CLEAR_SELECTION":
      return { ...state, selected: [null, null], lastResult: null };

    case "SET_LOADING":
      return { ...state, isLoading: action.loading };

    case "COMBINE_RESULT": {
      const { result, isNew, isValid } = action;
      const newState = {
        ...state,
        selected: [null, null] as [GameElement | null, GameElement | null],
        totalCombinations: state.totalCombinations + 1,
        lastResult: { ...result, isNew, isValid },
        isLoading: false,
      };

      if (isValid && !state.discovered.has(result.name)) {
        const newDiscovered = new Set(state.discovered);
        newDiscovered.add(result.name);
        newState.elements = [...state.elements, result];
        newState.discovered = newDiscovered;

        if (isNew) {
          newState.firstDiscoveries = state.firstDiscoveries + 1;
        }

        // Check milestones
        const newMilestones = MILESTONES.filter(
          (m) => newDiscovered.has(m.element) && !state.milestonesReached.includes(m.name)
        ).map((m) => m.name);

        if (newMilestones.length > 0) {
          newState.milestonesReached = [...state.milestonesReached, ...newMilestones];
        }

        // Check victory
        if (VICTORY_ELEMENTS.some((v) => v === result.name)) {
          newState.isVictory = true;
        }
      }

      return newState;
    }

    case "DISMISS_RESULT":
      return { ...state, lastResult: null };

    case "RESET":
      return createInitialState();

    default:
      return state;
  }
}
