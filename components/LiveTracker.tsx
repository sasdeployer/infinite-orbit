"use client";

import { useState, useEffect } from "react";

interface TrackingData {
  earthDistanceKm: number | null;
  moonDistanceKm: number | null;
  velocityKmS: number | null;
  dsnActive: boolean;
  dsnStation: string | null;
  dsnDish: string | null;
  missionElapsedTime: string;
  missionPhase: string;
  dataSource: "horizons" | "dsn" | "simulated" | "unavailable";
}

function formatDistance(km: number | null): string {
  if (km === null) return "---";
  if (km > 1000000) return `${(km / 1000000).toFixed(2)}M km`;
  if (km > 1000) return `${Math.round(km).toLocaleString()} km`;
  return `${km} km`;
}

export default function LiveTracker() {
  const [data, setData] = useState<TrackingData | null>(null);
  const [met, setMet] = useState("");

  useEffect(() => {
    let active = true;

    async function poll() {
      try {
        const res = await fetch("/api/tracking");
        if (res.ok && active) {
          const json = await res.json();
          setData(json);
          setMet(json.missionElapsedTime);
        }
      } catch {
        // silent fail
      }
    }

    poll();
    const interval = setInterval(poll, 30000); // poll every 30s

    // Update MET display every second locally
    const metInterval = setInterval(() => {
      setMet((prev) => {
        if (!prev.startsWith("T+")) return prev;
        // Just trigger re-render; actual MET comes from server
        return prev;
      });
    }, 1000);

    return () => {
      active = false;
      clearInterval(interval);
      clearInterval(metInterval);
    };
  }, []);

  if (!data) {
    return (
      <div className="live-tracker">
        <div className="live-tracker-loading">
          <span className="text-[10px] font-mono text-white/30">Acquiring signal...</span>
        </div>
      </div>
    );
  }

  const sourceLabel = data.dataSource === "horizons" ? "JPL" :
                      data.dataSource === "dsn" ? "DSN" :
                      data.dataSource === "simulated" ? "SIM" : "---";

  return (
    <div className="live-tracker">
      {/* MET + Phase */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[rgba(0,240,255,0.08)]">
        <div className="flex items-center gap-2">
          <span className="live-dot" />
          <span className="text-[10px] font-mono text-[var(--color-cyan)] tracking-widest uppercase">
            Live Tracking
          </span>
        </div>
        <span className="text-xs font-mono text-[var(--color-amber)]">
          {met}
        </span>
      </div>

      {/* Data grid */}
      <div className="grid grid-cols-3 gap-px bg-[rgba(0,240,255,0.05)]">
        {/* Earth distance */}
        <div className="tracker-cell">
          <span className="tracker-label">🌍 Earth</span>
          <span className="tracker-value">{formatDistance(data.earthDistanceKm)}</span>
        </div>

        {/* Moon distance */}
        <div className="tracker-cell">
          <span className="tracker-label">🌑 Moon</span>
          <span className="tracker-value">{formatDistance(data.moonDistanceKm)}</span>
        </div>

        {/* Mission phase */}
        <div className="tracker-cell">
          <span className="tracker-label">Phase</span>
          <span className="tracker-value text-[var(--color-amber)]">{data.missionPhase}</span>
        </div>
      </div>

      {/* DSN Status + velocity */}
      <div className="flex items-center justify-between px-4 py-1.5">
        <div className="flex items-center gap-2">
          {data.dsnActive ? (
            <>
              <span className="dsn-active-dot" />
              <span className="text-[9px] font-mono text-green-400">
                DSN {data.dsnStation} {data.dsnDish}
              </span>
            </>
          ) : (
            <>
              <span className="dsn-inactive-dot" />
              <span className="text-[9px] font-mono text-white/25">DSN no signal</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          {data.velocityKmS !== null && (
            <span className="text-[9px] font-mono text-white/30">
              {data.velocityKmS > 0 ? "+" : ""}{data.velocityKmS.toFixed(1)} km/s
            </span>
          )}
          <span className="text-[8px] font-mono text-white/15 uppercase">{sourceLabel}</span>
        </div>
      </div>
    </div>
  );
}
