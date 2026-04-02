"use client";

import { MILESTONES } from "@/lib/constants";

interface TrajectoryProgressProps {
  milestonesReached: string[];
}

export default function TrajectoryProgress({ milestonesReached }: TrajectoryProgressProps) {
  const totalMilestones = MILESTONES.length;
  const reached = milestonesReached.length;
  const progress = (reached / totalMilestones) * 100;

  // Calculate distance based on last reached milestone
  const lastMilestone = MILESTONES.filter((m) => milestonesReached.includes(m.name)).pop();
  const distance = lastMilestone?.distance ?? 0;

  return (
    <div className="trajectory-progress">
      {/* SVG trajectory arc */}
      <div className="trajectory-svg-container">
        <svg viewBox="0 0 400 100" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
          {/* Background arc */}
          <path
            d="M 30 80 Q 200 -20 370 80"
            fill="none"
            stroke="rgba(0, 240, 255, 0.1)"
            strokeWidth="2"
          />
          {/* Progress arc */}
          <path
            d="M 30 80 Q 200 -20 370 80"
            fill="none"
            stroke="var(--color-cyan)"
            strokeWidth="2"
            strokeDasharray="500"
            strokeDashoffset={500 - (500 * progress) / 100}
            className="transition-all duration-1000 ease-out"
          />

          {/* Earth */}
          <circle cx="30" cy="80" r="12" fill="#1a6dd4" opacity="0.8" />
          <text x="30" y="84" textAnchor="middle" fontSize="12">🌍</text>

          {/* Moon */}
          <circle cx="370" cy="80" r="8" fill="#888" opacity="0.8" />
          <text x="370" y="84" textAnchor="middle" fontSize="10">🌑</text>

          {/* Milestone dots */}
          {MILESTONES.map((milestone, i) => {
            const t = i / (totalMilestones - 1);
            const x = 30 + t * 340;
            const y = 80 - Math.sin(t * Math.PI) * 100;
            const isReached = milestonesReached.includes(milestone.name);

            return (
              <g key={milestone.name}>
                <circle
                  cx={x}
                  cy={y}
                  r={isReached ? 5 : 3}
                  fill={isReached ? "var(--color-amber)" : "rgba(255,255,255,0.2)"}
                  className={isReached ? "milestone-glow" : ""}
                />
                {isReached && (
                  <text
                    x={x}
                    y={y - 10}
                    textAnchor="middle"
                    fontSize="7"
                    fill="var(--color-amber)"
                    fontFamily="monospace"
                  >
                    {milestone.name}
                  </text>
                )}
              </g>
            );
          })}

          {/* Spacecraft indicator */}
          {reached > 0 && (
            <text
              x={30 + (reached / totalMilestones) * 340}
              y={80 - Math.sin((reached / totalMilestones) * Math.PI) * 100 - 2}
              textAnchor="middle"
              fontSize="14"
              className="spacecraft-icon"
            >
              🚀
            </text>
          )}
        </svg>
      </div>

      {/* Progress bar */}
      <div className="mt-2 px-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-mono text-[var(--color-cyan)] uppercase tracking-widest">
            Artemis II Progress
          </span>
          <span className="text-xs font-mono text-white/40">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        {distance > 0 && (
          <div className="text-xs text-white/30 font-mono mt-1 text-center">
            🌍→🌑 {distance.toLocaleString()} km from Earth
          </div>
        )}
      </div>
    </div>
  );
}
