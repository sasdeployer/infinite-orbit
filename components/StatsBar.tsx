"use client";

interface StatsBarProps {
  discovered: number;
  firstDiscoveries: number;
  totalCombinations: number;
}

export default function StatsBar({ discovered, firstDiscoveries, totalCombinations }: StatsBarProps) {
  return (
    <div className="stats-bar">
      <div className="stat-item">
        <span className="stat-icon">📊</span>
        <span className="stat-value">{discovered}</span>
        <span className="stat-label">discovered</span>
      </div>
      <div className="stat-divider" />
      <div className="stat-item">
        <span className="stat-icon">🏆</span>
        <span className="stat-value">{firstDiscoveries}</span>
        <span className="stat-label">firsts</span>
      </div>
      <div className="stat-divider" />
      <div className="stat-item">
        <span className="stat-icon">🧪</span>
        <span className="stat-value">{totalCombinations}</span>
        <span className="stat-label">attempts</span>
      </div>
    </div>
  );
}
