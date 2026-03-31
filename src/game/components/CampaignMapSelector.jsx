import React, { useId, useMemo } from 'react';
import {
  WORLDS,
  getWorldLevels,
  getLevelsWithStatus,
  loadProgression,
  PATH_VARIATIONS,
  PATH_METADATA,
} from '../constants';
import './MapPreview.css';

function PathCanvas({ waypoints, pathColor = '#c8a96e', size = 200 }) {
  const gridId = useId();
  const tileSize = size / 20;

  return (
    <svg width={size} height={size} className="path-canvas" role="img" aria-label="Map preview">
      <defs>
        <pattern id={gridId} width={tileSize} height={tileSize} patternUnits="userSpaceOnUse">
          <rect width={tileSize} height={tileSize} fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width={size} height={size} fill={`url(#${gridId})`} />
      <rect width={size} height={size} fill="#1a2f1a" opacity="0.24" />

      {waypoints.length > 1 && (
        <polyline
          points={waypoints
            .map(([c, r]) => `${c * tileSize + tileSize / 2},${r * tileSize + tileSize / 2}`)
            .join(' ')}
          fill="none"
          stroke={pathColor}
          strokeWidth={tileSize * 0.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
        />
      )}

      {waypoints.map(([c, r], i) => (
        <circle
          key={`${c}-${r}-${i}`}
          cx={c * tileSize + tileSize / 2}
          cy={r * tileSize + tileSize / 2}
          r={tileSize * 0.24}
          fill={i === 0 ? '#22c55e' : i === waypoints.length - 1 ? '#ef4444' : pathColor}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}

function MapCard({ worldId, onSelectLevel }) {
  const world = WORLDS[worldId];
  const progression = useMemo(() => loadProgression(), []);
  const worldLevels = useMemo(() => getWorldLevels(worldId), [worldId]);
  const levelsWithStatus = useMemo(
    () => getLevelsWithStatus(worldId, progression),
    [worldId, progression]
  );

  const firstLevel = worldLevels?.[1] || null;
  const pathType = firstLevel?.pathType || 'simple';
  const pathWaypoints = PATH_VARIATIONS[pathType] || PATH_VARIATIONS.simple;
  const pathMeta = PATH_METADATA[pathType] || PATH_METADATA.simple;
  const availableTowers = firstLevel?.availableTowers || [];
  const completedCount = levelsWithStatus.filter((level) => level.completed).length;

  if (!world) return null;

  return (
    <div className="map-card">
      <div className="map-card-header" style={{ borderColor: world.themeColor }}>
        <h3>{world.name}</h3>
        <span className="map-difficulty" style={{ color: world.themeColor }}>
          Difficulty: {world.difficulty}x
        </span>
      </div>

      <div className="map-preview-container">
        <PathCanvas waypoints={pathWaypoints} pathColor={world.colors?.path || '#c8a96e'} />
        <div className="path-info-overlay">
          <span className="path-type">{pathType}</span>
        </div>
      </div>

      <div className="map-stats">
        <div className="stat">
          <span className="stat-label">Levels</span>
          <span className="stat-value">{world.levelCount}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Cleared</span>
          <span className="stat-value">{completedCount}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Chokes</span>
          <span className="stat-value">{pathMeta.chokepoints || 1}</span>
        </div>
      </div>

      <div className="strategy-hints">
        <h4>Strategy Hints</h4>
        <ul>
          <li><strong>Recommended:</strong> {pathMeta.idealTowers?.join(', ') || 'basic'}</li>
          <li><strong>Difficulty:</strong> {pathMeta.difficulty || 'medium'}</li>
          <li>{pathMeta.description || 'Standard path'}</li>
        </ul>
      </div>

      <div className="tower-recommendations">
        <h4>Best Towers</h4>
        <div className="tower-tags">
          {availableTowers.map((tower) => (
            <span key={tower} className="tower-tag">{tower}</span>
          ))}
        </div>
      </div>

      <div className="level-select">
        <h4>Select Level</h4>
        <div className="level-grid">
          {Array.from({ length: world.levelCount }, (_, index) => index + 1).map((levelNum) => {
            const levelStatus = levelsWithStatus.find((level) => level.level === levelNum);
            const isUnlocked = !!levelStatus?.unlocked;

            return (
              <button
                key={levelNum}
                type="button"
                className={`level-btn ${levelStatus?.completed ? 'completed' : ''} ${isUnlocked ? '' : 'locked'}`}
                onClick={() => isUnlocked && onSelectLevel?.(worldId, levelNum)}
                disabled={!isUnlocked}
              >
                {levelNum}
                {levelStatus?.completed && <span className="stars">{'⭐'.repeat(levelStatus.stars)}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function CampaignMapSelector({ onSelectLevel }) {
  const worldIds = Object.keys(WORLDS);

  return (
    <div className="campaign-map-selector">
      <div className="campaign-header">
        <h2>Campaign Maps</h2>
        <p>Pick a world, preview the route, and jump straight into a level.</p>
      </div>

      <div className="maps-grid">
        {worldIds.map((worldId) => (
          <MapCard
            key={worldId}
            worldId={worldId}
            onSelectLevel={onSelectLevel}
          />
        ))}
      </div>
    </div>
  );
}
