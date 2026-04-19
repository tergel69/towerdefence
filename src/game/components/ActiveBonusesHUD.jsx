import React from 'react';

/**
 * Active Bonuses HUD Component
 * Shows current active bonuses and modifiers during gameplay
 */
export default function ActiveBonusesHUD({
  difficulty = 'normal',
  metaBonuses = {},
  activeSynergies = [],
  eventWave = null,
  style = {},
}) {
  const bonuses = [];

  // Difficulty indicator
  if (difficulty !== 'normal') {
    const diffConfig = {
      easy: { icon: '😊', label: 'Easy Mode', color: '#10b981' },
      hard: { icon: '💀', label: 'Hard Mode', color: '#ef4444' },
    };
    const diff = diffConfig[difficulty];
    if (diff) {
      bonuses.push({
        id: 'difficulty',
        icon: diff.icon,
        label: diff.label,
        color: diff.color,
      });
    }
  }

  // Meta upgrade indicators
  if (metaBonuses.startingGold > 0) {
    bonuses.push({
      id: 'meta_gold',
      icon: '💰',
      label: `+${metaBonuses.startingGold} Starting Gold`,
      color: '#fbbf24',
    });
  }
  if (metaBonuses.startingLives > 0) {
    bonuses.push({
      id: 'meta_lives',
      icon: '❤️',
      label: `+${metaBonuses.startingLives} Starting Lives`,
      color: '#ef4444',
    });
  }
  if (metaBonuses.towerDiscount > 0) {
    bonuses.push({
      id: 'meta_discount',
      icon: '🏷️',
      label: `${metaBonuses.towerDiscount}% Tower Discount`,
      color: '#3b82f6',
    });
  }
  if (metaBonuses.enemyReward > 0) {
    bonuses.push({
      id: 'meta_reward',
      icon: '💎',
      label: `+${metaBonuses.enemyReward}% Enemy Rewards`,
      color: '#8b5cf6',
    });
  }
  if (metaBonuses.waveBonus > 0) {
    bonuses.push({
      id: 'meta_wave',
      icon: '🌊',
      label: `+${metaBonuses.waveBonus}% Wave Bonus`,
      color: '#10b981',
    });
  }

  // Active synergies
  activeSynergies.forEach((synergy) => {
    bonuses.push({
      id: `synergy_${synergy.id}`,
      icon: synergy.icon,
      label: synergy.name,
      color: synergy.color,
    });
  });

  // Event wave
  if (eventWave) {
    bonuses.push({
      id: 'event',
      icon: eventWave.icon,
      label: eventWave.name,
      color: eventWave.color,
    });
  }

  if (bonuses.length === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 10,
        left: 10,
        right: 10,
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        zIndex: 40,
        ...style,
      }}
    >
      {bonuses.map((bonus) => (
        <div
          key={bonus.id}
          style={{
            padding: '4px 10px',
            background: `${bonus.color}20`,
            border: `1px solid ${bonus.color}60`,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            fontFamily: "'Courier New', monospace",
            color: bonus.color,
            boxShadow: `0 2px 8px ${bonus.color}30`,
            animation: 'bonusPulse 2s ease-in-out infinite',
          }}
        >
          <span style={{ fontSize: '14px' }}>{bonus.icon}</span>
          <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>{bonus.label}</span>
        </div>
      ))}

      <style>{`
        @keyframes bonusPulse {
          0%, 100% {
            opacity: 0.85;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
