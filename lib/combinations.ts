export interface CombinationResult {
  result: string;
  emoji: string;
  description: string;
  isValid: boolean;
}

function key(a: string, b: string): string {
  return [a, b].sort().join("+");
}

const COMBINATIONS: Record<string, CombinationResult> = {};

function add(a: string, b: string, emoji: string, result: string, description: string) {
  COMBINATIONS[key(a, b)] = { result, emoji, description, isValid: true };
}

// ═══════════════════════════════════════════════
// TIER 1: Basic combinations from starting elements
// ═══════════════════════════════════════════════
add("Thrust", "Angle", "\u{1F680}", "Burn", "A controlled push in a specific direction");
add("Gravity", "Velocity", "\u{1F504}", "Orbit", "Falling around a body forever");
add("Thrust", "Gravity", "\u{1F199}", "Escape Velocity", "The speed to break free");
add("Velocity", "Angle", "\u{1F3AF}", "Vector", "Speed with purpose");
add("Gravity", "Angle", "\u{1F4C9}", "Trajectory", "The path gravity carves");
add("Thrust", "Velocity", "\u{1F4A8}", "Acceleration", "Getting faster, fast");

// ═══════════════════════════════════════════════
// TIER 2: Intermediate maneuvers
// ═══════════════════════════════════════════════
add("Burn", "Orbit", "\u{1F501}", "Hohmann Transfer", "The most efficient way between two orbits");
add("Orbit", "Gravity", "\u{1F311}", "Lunar Orbit", "Captured by the Moon");
add("Escape Velocity", "Angle", "\u{1F6E4}\uFE0F", "Trans-Lunar Injection", "Aimed at the Moon, pedal down");
add("Vector", "Orbit", "\u{1F4E1}", "Orbital Mechanics", "The math of falling with style");
add("Burn", "Vector", "\u{1F527}", "Delta-V", "The currency of space travel");
add("Trajectory", "Gravity", "\u{1FA83}", "Free Return", "Let gravity do the driving home");
add("Orbit", "Orbit", "\u{1F517}", "Rendezvous", "Two paths becoming one");
add("Burn", "Trajectory", "\u{1F3AF}", "Course Correction", "Nudging fate by meters per second");
add("Acceleration", "Angle", "\u{1F4AB}", "Maneuver Node", "The precise moment to push");
add("Vector", "Gravity", "\u{1F30C}", "Gravitational Field", "The shape of space itself");

// ═══════════════════════════════════════════════
// TIER 3: Advanced / Artemis-specific
// ═══════════════════════════════════════════════
add("Trans-Lunar Injection", "Lunar Orbit", "\u{1F312}", "Lunar Flyby", "Skimming the Moon and swinging back");
add("Free Return", "Lunar Flyby", "\u{1F3C6}", "Artemis II Trajectory", "The path home \u2014 exactly as NASA planned it");
add("Hohmann Transfer", "Delta-V", "\u2696\uFE0F", "Fuel Budget", "Every gram of propellant accounted for");
add("Delta-V", "Escape Velocity", "\u{1F6F8}", "Interplanetary Transfer", "Beyond the Moon, beyond Earth");
add("Lunar Flyby", "Gravity", "\u{1FAA8}", "Gravity Assist", "Stealing speed from a planet");
add("Orbital Mechanics", "Free Return", "\u{1F9EE}", "Three-Body Problem", "Earth, Moon, spacecraft \u2014 chaos with a solution");
add("Course Correction", "Free Return", "\u{1F6E1}\uFE0F", "Apollo 13 Maneuver", "The most famous free return in history");
add("Artemis II Trajectory", "Delta-V", "\u{1F31F}", "Mission Complete", "You just planned a Moon mission.");

// ═══════════════════════════════════════════════
// TIER 4: Fun / Easter eggs
// ═══════════════════════════════════════════════
add("Gravity", "Gravity", "\u26AB", "Black Hole", "Too much of a good thing");
add("Thrust", "Thrust", "\u{1F4A5}", "Explosion", "More is not always better");
add("Burn", "Burn", "\u{1F525}", "Rapid Unscheduled Disassembly", "SpaceX's favorite euphemism");
add("Black Hole", "Velocity", "\u{1F35D}", "Spaghettification", "Stretchy death");
add("Orbit", "Acceleration", "\u{1F6EC}", "Deorbit", "What goes up must come down");
add("Escape Velocity", "Escape Velocity", "\u{1F30C}", "Warp Drive", "Physics says no. Engineers say not yet.");

// ═══════════════════════════════════════════════
// TIER 5: Extended space exploration combos
// ═══════════════════════════════════════════════

// Rocket components
add("Thrust", "Explosion", "\u{1F680}", "SLS Rocket", "Built to return humans to the Moon");
add("SLS Rocket", "Burn", "\u{1F6F0}\uFE0F", "Orion Capsule", "Home for four on a Moon trip");
add("Orion Capsule", "Trajectory", "\u{1F469}\u200D\u{1F680}", "Crew Module", "Where astronauts eat, sleep, and float");
add("Explosion", "Burn", "\u{1F4A3}", "Staging", "Dropping weight to go faster");
add("Staging", "SLS Rocket", "\u{1F3D7}\uFE0F", "Multi-Stage Rocket", "Stack them up, drop them off");
add("Acceleration", "Staging", "\u26A1", "Solid Rocket Boosters", "3.6 million pounds of thrust each, 126 seconds");

// Reentry & landing
add("Deorbit", "Trajectory", "\u{1F525}", "Reentry", "The hottest part of coming home");
add("Reentry", "Angle", "\u{1F4D0}", "Reentry Corridor", "Too steep you burn, too shallow you bounce");
add("Reentry", "Velocity", "\u{1F6E1}\uFE0F", "Heat Shield", "5,000\u00B0F and holding");
add("Heat Shield", "Orion Capsule", "\u{1F30A}", "Splashdown", "The Pacific Ocean welcomes you home");
add("Deorbit", "Gravity", "\u{1F4A8}", "Atmospheric Drag", "The air that slows you down");
add("Atmospheric Drag", "Angle", "\u{1FA82}", "Parachute Deploy", "Three giant canopies saving four lives");

// Solar & power
add("Orbit", "Angle", "\u2600\uFE0F", "Solar Array", "Catching sunlight at 17,500 mph");
add("Solar Array", "Velocity", "\u{1F50B}", "Power System", "Electricity in the void");
add("Solar Array", "Gravity", "\u{1F31E}", "Solar Orbit", "Dancing with the Sun");

// Communication
add("Acceleration", "Vector", "\u{1F4E1}", "Ground Station", "Houston, we hear you");
add("Lunar Flyby", "Orbit", "\u{1F4F5}", "Communication Blackout", "The loneliest minutes in space");
add("Ground Station", "Orion Capsule", "\u{1F4AC}", "CAPCOM", "The only voice astronauts hear");

// Radiation & environment
add("Orbit", "Escape Velocity", "\u2622\uFE0F", "Van Allen Belts", "Earth's radioactive moat");
add("Van Allen Belts", "Heat Shield", "\u{1F9F2}", "Radiation Shielding", "Keeping cosmic rays at bay");
add("Black Hole", "Gravity", "\u{1F300}", "Event Horizon", "The point of no return");
add("Event Horizon", "Velocity", "\u2728", "Hawking Radiation", "Even black holes evaporate");

// Crew members
add("Crew Module", "Burn", "\u{1F468}\u200D\u{1F680}", "Commander Wiseman", "Reid Wiseman \u2014 leading the way back to the Moon");
add("Crew Module", "Vector", "\u{1F468}\u200D\u{1F680}", "Pilot Glover", "Victor Glover \u2014 hands on the stick");
add("Crew Module", "Orbital Mechanics", "\u{1F469}\u200D\u{1F680}", "MS Koch", "Christina Koch \u2014 328-day spaceflight record holder");
add("Crew Module", "Trajectory", "\u{1F468}\u200D\u{1F680}", "MS Hansen", "Jeremy Hansen \u2014 Canada's Moon voyager");
add("Commander Wiseman", "Pilot Glover", "\u{1F91D}", "Crew Handshake", "Trust built in zero gravity");
add("MS Koch", "MS Hansen", "\u{1F469}\u200D\u{1F52C}", "Science Team", "The experiments ride along");

// Launch site
add("SLS Rocket", "Trajectory", "\u{1F3D6}\uFE0F", "Kennedy Space Center", "Pad 39B \u2014 where Moon missions begin");
add("Kennedy Space Center", "Burn", "\u{1F4A8}", "Liftoff", "T-minus zero. All engines running.");
add("Liftoff", "Orbit", "\u{1F30D}", "Low Earth Orbit", "The parking orbit before the big push");
add("Low Earth Orbit", "Trans-Lunar Injection", "\u{1F31B}", "TLI Burn", "Three minutes that change everything");

// Famous maneuvers & physics
add("Gravity Assist", "Interplanetary Transfer", "\u{1F31F}", "Voyager Trajectory", "The grand tour of the solar system");
add("Hohmann Transfer", "Orbit", "\u{1F504}", "Phasing Orbit", "Timing is everything in space");
add("Delta-V", "Fuel Budget", "\u{1F9EA}", "Tsiolkovsky Equation", "The tyranny of the rocket equation");
add("Tsiolkovsky Equation", "Staging", "\u{1F4CA}", "Mass Ratio", "Why rockets are mostly fuel");
add("Three-Body Problem", "Gravity Assist", "\u{1F52D}", "Lagrange Point", "Where gravity takes a coffee break");
add("Lagrange Point", "Solar Array", "\u{1F6F0}\uFE0F", "James Webb", "Parked at L2, seeing the first light");

// Fun combos
add("Spaghettification", "Gravity Assist", "\u{1F355}", "Pizza Effect", "Tidal forces make great flatbread");
add("Warp Drive", "Three-Body Problem", "\u{1F47D}", "Alien Contact", "They were watching the whole time");
add("Rapid Unscheduled Disassembly", "Orbit", "\u{1F6F8}", "Space Debris", "Kessler syndrome says hello");
add("Space Debris", "Orbit", "\u26A0\uFE0F", "Kessler Syndrome", "One crash creates a thousand");
add("Explosion", "Gravity", "\u{1F30B}", "Rocket Equation", "The cruel math of leaving Earth");
add("Communication Blackout", "Reentry", "\u{1F4F4}", "Radio Silence", "The scariest four minutes for mission control");
add("Splashdown", "Crew Module", "\u{1F389}", "Recovery", "Navy recovery ship standing by");
add("Mission Complete", "Recovery", "\u{1F3C5}", "Moon Mission Badge", "Earned, not given");
add("Alien Contact", "CAPCOM", "\u{1F4E2}", "First Contact Protocol", "We come in peace... probably");
add("Warp Drive", "Alien Contact", "\u{1F320}", "Federation", "To boldly go where no one has gone before");
add("Velocity", "Velocity", "\u{1F3CE}\uFE0F", "Relativistic Speed", "Time starts to get weird");
add("Relativistic Speed", "Black Hole", "\u231B", "Time Dilation", "Your clock runs slow near heavy things");
add("Angle", "Angle", "\u{1F4D0}", "Full Rotation", "360 degrees of freedom");
add("Lunar Orbit", "Lunar Orbit", "\u{1F311}", "Lunar Gateway", "A space station around the Moon");
add("Lunar Gateway", "Crew Module", "\u{1F311}", "Artemis III", "Next stop: lunar surface");

export function lookupCombination(a: string, b: string): CombinationResult | null {
  return COMBINATIONS[key(a, b)] ?? null;
}

export function getAllCombinations(): Record<string, CombinationResult> {
  return COMBINATIONS;
}
