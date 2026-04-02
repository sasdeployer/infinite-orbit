// ═══════════════════════════════════════════════
// Real-time Artemis II tracking
// Sources: JPL Horizons, DSN Now, simulated fallback
// ═══════════════════════════════════════════════

const HORIZONS_API = "https://ssd.jpl.nasa.gov/api/horizons.api";
const DSN_XML_URL = "https://eyes.nasa.gov/dsn/data/dsn.xml";
const AU_TO_KM = 149597870.7;
const ARTEMIS_II_COMMAND = "-1024";
const ARTEMIS_II_DSN_IDS = ["-24", "-1024"];
const ARTEMIS_II_DSN_NAMES = ["EM2", "ORION", "ORI"];

// Launch: 2026-Apr-02 01:57:23 UTC
const LAUNCH_TIME = new Date("2026-04-02T01:57:23Z").getTime();
// ~10.5 day mission
const MISSION_DURATION_MS = 10.5 * 24 * 60 * 60 * 1000;

export interface TrackingData {
  earthDistanceKm: number | null;
  moonDistanceKm: number | null;
  velocityKmS: number | null;
  dsnActive: boolean;
  dsnStation: string | null;
  dsnDish: string | null;
  dsnSignalStrength: number | null;
  missionElapsedTime: string;
  missionPhase: string;
  dataSource: "horizons" | "dsn" | "simulated" | "unavailable";
  timestamp: number;
}

// ─── JPL Horizons ────────────────────────────
async function fetchHorizonsDistance(
  center: string,
  label: string
): Promise<{ distanceKm: number; velocityKmS: number } | null> {
  try {
    const now = new Date();
    const start = now.toISOString().slice(0, 10).replace(/-/g, "-");
    const tomorrow = new Date(now.getTime() + 86400000);
    const stop = tomorrow.toISOString().slice(0, 10).replace(/-/g, "-");

    const params = new URLSearchParams({
      format: "json",
      COMMAND: `'${ARTEMIS_II_COMMAND}'`,
      OBJ_DATA: "'NO'",
      MAKE_EPHEM: "'YES'",
      EPHEM_TYPE: "'OBSERVER'",
      CENTER: `'${center}'`,
      QUANTITIES: "'20'",
      STEP_SIZE: "'1h'",
      START_TIME: `'${start}'`,
      STOP_TIME: `'${stop}'`,
    });

    const res = await fetch(`${HORIZONS_API}?${params}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;

    const data = await res.json();
    if (data.error) return null;

    const result: string = data.result || "";
    const soeIdx = result.indexOf("$$SOE");
    const eoeIdx = result.indexOf("$$EOE");
    if (soeIdx === -1 || eoeIdx === -1) return null;

    const block = result.slice(soeIdx + 5, eoeIdx).trim();
    const lines = block.split("\n").filter((l: string) => l.trim());
    // Get the last (most recent) data point
    const lastLine = lines[lines.length - 1];
    if (!lastLine) return null;

    // Parse: date time delta deldot
    const parts = lastLine.trim().split(/\s+/);
    // Find the numeric values — delta is in AU, deldot in km/s
    const numerics = parts.filter((p: string) => /^-?\d+\.?\d*/.test(p) && p.includes("."));
    if (numerics.length < 1) return null;

    const deltaAU = parseFloat(numerics[0]);
    const deldot = numerics.length >= 2 ? parseFloat(numerics[1]) : 0;

    if (isNaN(deltaAU)) return null;

    return {
      distanceKm: Math.round(deltaAU * AU_TO_KM),
      velocityKmS: isNaN(deldot) ? 0 : deldot,
    };
  } catch {
    return null;
  }
}

// ─── DSN Now ─────────────────────────────────
interface DSNResult {
  active: boolean;
  station: string | null;
  dish: string | null;
  rangeKm: number | null;
  signalStrength: number | null;
}

async function fetchDSN(): Promise<DSNResult> {
  try {
    const res = await fetch(DSN_XML_URL, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return { active: false, station: null, dish: null, rangeKm: null, signalStrength: null };

    const xml = await res.text();

    // Parse XML with regex (lightweight, no deps)
    let currentStation = "";
    const stationMatches = [...xml.matchAll(/<station\s+name="([^"]+)"\s+friendlyName="([^"]+)"/g)];
    const dishMatches = [...xml.matchAll(/<dish\s+[^>]*name="([^"]*)"[^>]*>[\s\S]*?<\/dish>/g)];

    for (const dishMatch of dishMatches) {
      const dishXml = dishMatch[0];
      const dishName = dishMatch[1];

      // Check if this dish is tracking Artemis II
      const targetMatch = dishXml.match(/<target\s+[^>]*name="([^"]*)"[^>]*id="([^"]*)"[^>]*uplegRange="([^"]*)"[^>]*downlegRange="([^"]*)"[^>]*rtlt="([^"]*)"/);
      const signalMatch = dishXml.match(/spacecraftID="([^"]*)"/);

      const scId = signalMatch ? signalMatch[1] : "";
      const targetName = targetMatch ? targetMatch[1].toUpperCase() : "";

      const isArtemis =
        ARTEMIS_II_DSN_IDS.includes(scId) ||
        ARTEMIS_II_DSN_NAMES.some((n) => targetName.includes(n));

      if (isArtemis && targetMatch) {
        const rangeKm = parseFloat(targetMatch[3]);
        const downSignalMatch = dishXml.match(/<downSignal[^>]*power="([^"]*)"/);
        const power = downSignalMatch ? parseFloat(downSignalMatch[1]) : null;

        // Find which station this dish belongs to
        for (const sm of stationMatches) {
          // Stations appear before their dishes in the XML
          const stationPos = xml.indexOf(sm[0]);
          const dishPos = xml.indexOf(dishMatch[0]);
          if (stationPos < dishPos) {
            currentStation = sm[2]; // friendlyName
          }
        }

        return {
          active: true,
          station: currentStation || null,
          dish: dishName,
          rangeKm: rangeKm > 0 ? rangeKm : null,
          signalStrength: power,
        };
      }
    }

    return { active: false, station: null, dish: null, rangeKm: null, signalStrength: null };
  } catch {
    return { active: false, station: null, dish: null, rangeKm: null, signalStrength: null };
  }
}

// ─── Simulated Trajectory ────────────────────
// Simplified Artemis II free-return profile
// Based on published NASA mission timeline
function getSimulatedPosition(): { earthKm: number; moonKm: number; phase: string } {
  const now = Date.now();
  const elapsed = now - LAUNCH_TIME;

  if (elapsed < 0) {
    return { earthKm: 0, moonKm: 384400, phase: "Pre-Launch" };
  }

  const t = elapsed / MISSION_DURATION_MS; // 0 to 1 over mission

  if (t > 1) {
    return { earthKm: 0, moonKm: 384400, phase: "Mission Complete" };
  }

  // Simplified trajectory profile (approximate distances)
  // Day 0: Launch, LEO at ~400 km
  // Day 0.5: TLI, climbing fast
  // Day 4: Closest lunar approach ~130 km above surface (Moon radius ~1737 km)
  // Day 4-5: Lunar flyby, swing behind Moon
  // Day 5-10: Free return coast back to Earth
  // Day 10.5: Splashdown

  const MOON_DIST = 384400;
  let earthKm: number;
  let moonKm: number;
  let phase: string;

  if (t < 0.02) {
    // Launch to LEO
    earthKm = 200 + t * 10000;
    moonKm = MOON_DIST - earthKm;
    phase = "Ascent";
  } else if (t < 0.05) {
    // LEO parking orbit
    earthKm = 400;
    moonKm = MOON_DIST - earthKm;
    phase = "Low Earth Orbit";
  } else if (t < 0.38) {
    // TLI to lunar approach (roughly day 0.5 to day 4)
    const progress = (t - 0.05) / 0.33;
    earthKm = 400 + progress * (MOON_DIST - 2000);
    moonKm = MOON_DIST - earthKm + 1737;
    phase = "Trans-Lunar Coast";
  } else if (t < 0.43) {
    // Lunar flyby (day 4-4.5)
    const flybyProgress = (t - 0.38) / 0.05;
    const angle = flybyProgress * Math.PI;
    moonKm = 1870 + Math.sin(angle) * 5000; // closest ~1870 km from center
    earthKm = MOON_DIST - moonKm + 1737;
    phase = "Lunar Flyby";
  } else if (t < 0.48) {
    // Behind the Moon
    const progress = (t - 0.43) / 0.05;
    moonKm = 2000 + progress * 50000;
    earthKm = MOON_DIST + moonKm - 20000;
    phase = "Far Side Passage";
  } else {
    // Free return coast back to Earth (day 5 to 10.5)
    const progress = (t - 0.48) / 0.52;
    earthKm = Math.max(0, (MOON_DIST + 30000) * (1 - progress));
    moonKm = MOON_DIST - earthKm + 1737;
    phase = progress > 0.95 ? "Reentry" : "Free Return Coast";
  }

  return {
    earthKm: Math.max(0, Math.round(earthKm)),
    moonKm: Math.max(0, Math.round(moonKm)),
    phase,
  };
}

// ─── Mission Elapsed Time ────────────────────
function getMET(): string {
  const elapsed = Date.now() - LAUNCH_TIME;
  if (elapsed < 0) return "T-" + formatDuration(-elapsed);
  return "T+" + formatDuration(elapsed);
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) {
    return `${days}d ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

// ─── Combined Fetch ──────────────────────────
// Simple in-memory cache
let cachedData: TrackingData | null = null;
let cacheTime = 0;
const CACHE_TTL = 30_000; // 30 seconds

export async function getTrackingData(): Promise<TrackingData> {
  const now = Date.now();
  if (cachedData && now - cacheTime < CACHE_TTL) {
    // Update MET even from cache
    return { ...cachedData, missionElapsedTime: getMET(), timestamp: now };
  }

  const sim = getSimulatedPosition();
  const met = getMET();

  // Fetch both in parallel
  const [earthData, dsn] = await Promise.all([
    fetchHorizonsDistance("500@399", "Earth"),
    fetchDSN(),
  ]);

  // Optionally fetch Moon distance if Earth data worked
  let moonData: { distanceKm: number; velocityKmS: number } | null = null;
  if (earthData) {
    moonData = await fetchHorizonsDistance("500@301", "Moon");
  }

  let dataSource: TrackingData["dataSource"] = "simulated";
  let earthDistanceKm = sim.earthKm;
  let moonDistanceKm = sim.moonKm;
  let velocityKmS: number | null = null;

  if (earthData) {
    earthDistanceKm = earthData.distanceKm;
    velocityKmS = earthData.velocityKmS;
    dataSource = "horizons";
  }

  if (moonData) {
    moonDistanceKm = moonData.distanceKm;
  }

  // DSN range can override if available and more recent
  if (dsn.active && dsn.rangeKm && dsn.rangeKm > 0) {
    earthDistanceKm = dsn.rangeKm;
    if (!earthData) dataSource = "dsn";
  }

  const result: TrackingData = {
    earthDistanceKm,
    moonDistanceKm,
    velocityKmS,
    dsnActive: dsn.active,
    dsnStation: dsn.station,
    dsnDish: dsn.dish,
    dsnSignalStrength: dsn.signalStrength,
    missionElapsedTime: met,
    missionPhase: sim.phase,
    dataSource,
    timestamp: now,
  };

  cachedData = result;
  cacheTime = now;
  return result;
}
