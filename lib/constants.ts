export interface GameElement {
  name: string;
  emoji: string;
  description: string;
}

export const STARTING_ELEMENTS: GameElement[] = [
  { name: "Thrust", emoji: "\u{1F525}", description: "The force that moves spacecraft" },
  { name: "Gravity", emoji: "\u{1F30D}", description: "The invisible hand that bends all paths" },
  { name: "Velocity", emoji: "\u26A1", description: "Speed with a direction" },
  { name: "Angle", emoji: "\u{1F4D0}", description: "Orientation in the void" },
];

export const MILESTONES = [
  { name: "Launch", element: "Burn", distance: 0 },
  { name: "Earth Orbit", element: "Orbit", distance: 400 },
  { name: "TLI", element: "Trans-Lunar Injection", distance: 50000 },
  { name: "Lunar Flyby", element: "Lunar Flyby", distance: 384400 },
  { name: "Free Return", element: "Free Return", distance: 300000 },
  { name: "Artemis II", element: "Artemis II Trajectory", distance: 200000 },
  { name: "Splashdown", element: "Mission Complete", distance: 0 },
] as const;

export const COLORS = {
  cyan: "#00F0FF",
  amber: "#FFB800",
  dark: "#000000",
  cardBg: "rgba(0, 240, 255, 0.05)",
  cardBorder: "rgba(0, 240, 255, 0.2)",
  cardGlow: "rgba(0, 240, 255, 0.15)",
  gold: "#FFD700",
} as const;

export const VICTORY_ELEMENTS = ["Artemis II Trajectory", "Mission Complete"];
