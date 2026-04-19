import React from 'react';
import { TOWER_DEFS } from '../constants';

/**
 * Slide-in panel that appears when a placed tower is clicked.
 * Shows live stats, upgrade preview with diff, and sell button.
 *
 * Props:
 *   tower      — tower object from stateRef
 *   money      — current player money
 *   onUpgrade  — (towerId) => void
 *   onSell     — (towerId) => void
 *   onClose    — () => void
 */
export default function TowerUpgradePanel({
  tower,
  money,
  onUpgrade,
  onSell,
  onClose,
  onShowBranches,
}) {
  if (!tower) return null;

  const towerType = tower.type || tower.defId;
  const def = TOWER_DEFS[towerType];
  if (!def) return null;

  const stats = def.levels[tower.level];
  const upgradeCost = tower.level < def.levels.length - 1 ? def.upgradeCost[tower.level] : null;

  // Calculate sell value: 60% refund of base + upgrades
  const sellValue = (() => {
    const upgradePaid =
      tower.level > 0 ? def.upgradeCost.slice(0, tower.level).reduce((a, b) => a + b, 0) : 0;
    return Math.floor((def.cost + upgradePaid) * 0.6);
  })();

  const isMaxLevel = upgradeCost === null;
  const canAfford = upgradeCost !== null && money >= upgradeCost;

  // Next-level stats for diff preview
  const nextStats = !isMaxLevel ? def.levels[tower.level + 1] : null;

  // Stat diff helpers
  const diff = (key) => {
    if (!nextStats) return null;
    const curr = stats[key];
    const next = nextStats[key];
    if (next === curr) return null;
    return next > curr ? `+${next - curr}` : `${next - curr}`;
  };

  const diffColor = (key) => {
    const d = diff(key);
    if (!d) return '#aaa';
    return d.startsWith('+') ? '#4ade80' : '#f87171';
  };

  // Determine tower icon based on type
  const getTowerIcon = (type) => {
    switch (type) {
      case 'basic':
        return '🔫';
      case 'splash':
        return '💥';
      case 'ice':
        return '❄️';
      case 'sniper':
        return '🎯';
      case 'poison':
        return '☠️';
      default:
        return '🏰';
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 280,
        background: 'linear-gradient(135deg, rgba(15,23,42,0.97), rgba(30,41,59,0.97))',
        borderLeft: '2px solid rgba(255,255,255,0.1)',
        boxShadow: '-8px 0 32px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Courier New', monospace",
        color: '#e2e8f0',
        zIndex: 100,
        animation: 'slideIn 0.2s ease-out',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          background: `linear-gradient(135deg, ${def.color}22, transparent)`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              background: def.color,
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: 16,
              color: '#fff',
            }}
          >
            {getTowerIcon(towerType)}
          </div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: 15 }}>{def.label}</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>Level {tower.level + 1}</div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            borderRadius: 6,
            color: '#94a3b8',
            width: 28,
            height: 28,
            cursor: 'pointer',
            fontSize: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ✕
        </button>
      </div>

      {/* Stats */}
      <div style={{ flex: 1, padding: 20, overflowY: 'auto' }}>
        <div
          style={{
            fontSize: 10,
            letterSpacing: '0.15em',
            color: '#64748b',
            marginBottom: 12,
            textTransform: 'uppercase',
          }}
        >
          Stats
        </div>

        {[
          { label: 'Damage', key: 'damage', icon: '⚔️', unit: '' },
          { label: 'Fire Rate', key: 'fireRate', icon: '🔥', unit: '/s' },
          { label: 'Range', key: 'range', icon: '🎯', unit: 'px' },
          { label: 'Bullet Speed', key: 'bulletSpeed', icon: '💨', unit: 'px/s' },
        ].map(({ label, key, icon, unit = '' }) => (
          <div
            key={key}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>{icon}</span>
              <span style={{ fontSize: 13, color: '#94a3b8' }}>{label}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 'bold', fontSize: 14 }}>
                {stats[key]}
                {unit}
              </span>
              {nextStats && (
                <span
                  style={{
                    fontSize: 11,
                    color: diffColor(key),
                    fontWeight: 'bold',
                    minWidth: 40,
                    textAlign: 'right',
                  }}
                >
                  {diff(key) || '—'}
                </span>
              )}
            </div>
          </div>
        ))}

        {def.splash && stats.splashRadius > 0 && (
          <div
            style={{
              marginTop: 12,
              padding: 10,
              background: 'rgba(255,204,2,0.1)',
              borderRadius: 8,
              border: '1px solid rgba(255,204,2,0.3)',
              fontSize: 12,
              color: '#fbbf24',
            }}
          >
            💥 Splash Damage: {stats.splashRadius}px radius
          </div>
        )}

        {def.levels[tower.level].slowAmount > 0 && (
          <div
            style={{
              marginTop: 12,
              padding: 10,
              background: 'rgba(129,212,250,0.1)',
              borderRadius: 8,
              border: '1px solid rgba(129,212,250,0.3)',
              fontSize: 12,
              color: '#81D4FA',
            }}
          >
            ❄️ Slow: {Math.round(def.levels[tower.level].slowAmount * 100)}% for{' '}
            {def.levels[tower.level].slowDuration}s
          </div>
        )}

        {def.levels[tower.level].poisonDamage > 0 && (
          <div
            style={{
              marginTop: 12,
              padding: 10,
              background: 'rgba(74,222,128,0.1)',
              borderRadius: 8,
              border: '1px solid rgba(74,222,128,0.3)',
              fontSize: 12,
              color: '#86efac',
            }}
          >
            ☠️ Poison: {def.levels[tower.level].poisonDamage} damage over{' '}
            {def.levels[tower.level].poisonDuration}s
          </div>
        )}

        {/* Description */}
        <div
          style={{
            marginTop: 16,
            padding: 12,
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 8,
            fontSize: 12,
            color: '#64748b',
            lineHeight: 1.6,
          }}
        >
          {def.description}
        </div>

        <div
          style={{
            marginTop: 12,
            padding: 12,
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 8,
            fontSize: 11,
            color: '#94a3b8',
          }}
        >
          <div>💰 Base Cost: {def.cost}g</div>
          <div style={{ marginTop: 4 }}>📊 Total Upgrades: {tower.level}</div>
        </div>
      </div>

      {/* Actions */}
      <div
        style={{
          padding: 16,
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {/* Upgrade button */}
        {!isMaxLevel ? (
          <button
            onClick={() => onUpgrade(tower.id)}
            disabled={!canAfford}
            style={{
              background: canAfford
                ? 'linear-gradient(135deg, #059669, #10b981)'
                : 'rgba(255,255,255,0.05)',
              border: `1px solid ${canAfford ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: 8,
              color: canAfford ? '#fff' : '#64748b',
              padding: '12px',
              cursor: canAfford ? 'pointer' : 'not-allowed',
              fontFamily: 'monospace',
              fontSize: 13,
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s',
            }}
          >
            <span>⬆️ Upgrade to Level {tower.level + 2}</span>
            <span style={{ color: canAfford ? '#fbbf24' : '#64748b' }}>💰 {upgradeCost}g</span>
          </button>
        ) : (
          <div
            style={{
              background: 'rgba(255,215,0,0.1)',
              border: '1px solid rgba(255,215,0,0.3)',
              borderRadius: 8,
              padding: '12px',
              textAlign: 'center',
              fontSize: 13,
              color: '#fbbf24',
              fontWeight: 'bold',
            }}
          >
            ⭐ MAX LEVEL
          </div>
        )}

        {/* Branching Upgrades Button */}
        {def.branches && tower.level >= (def.branchUnlockLevel || 2) - 1 && (
          <button
            onClick={() => onShowBranches?.()}
            style={{
              background: 'rgba(139, 92, 246, 0.15)',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              borderRadius: 8,
              color: '#a78bfa',
              padding: '10px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontSize: 12,
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s',
              marginTop: '8px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(139, 92, 246, 0.25)';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(139, 92, 246, 0.15)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <span>🌿 Branch Upgrades</span>
            <span style={{ color: '#c4b5fd' }}>View →</span>
          </button>
        )}

        {/* Sell button */}
        <button
          onClick={() => onSell(tower.id)}
          style={{
            background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.4)',
            borderRadius: 8,
            color: '#f87171',
            padding: '10px',
            cursor: 'pointer',
            fontFamily: 'monospace',
            fontSize: 12,
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.2s',
          }}
        >
          <span>🗑️ Sell Tower</span>
          <span style={{ color: '#fbbf24' }}>+{sellValue}g</span>
        </button>
      </div>

      {/* CSS animation */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
