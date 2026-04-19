import React, { useState } from 'react';
import {
  META_UPGRADE_COSTS,
  getMetaUpgradeBonuses,
  purchaseMetaUpgrade,
  loadProgression,
} from '../system/saveSystem';

const UPGRADE_CONFIG = {
  startingGold: {
    name: 'Starting Gold',
    icon: '💰',
    description: 'Begin each game with bonus gold',
    color: '#fbbf24',
  },
  startingLives: {
    name: 'Starting Lives',
    icon: '❤️',
    description: 'Begin each game with bonus lives',
    color: '#ef4444',
  },
  towerDiscount: {
    name: 'Tower Discount',
    icon: '🏷️',
    description: 'Reduce tower purchase costs by %',
    color: '#3b82f6',
  },
  enemyReward: {
    name: 'Enemy Rewards',
    icon: '💎',
    description: 'Increase gold from enemy kills by %',
    color: '#8b5cf6',
  },
  waveBonus: {
    name: 'Wave Bonus',
    icon: '🌊',
    description: 'Increase gold from wave completion by %',
    color: '#10b981',
  },
};

export default function MetaUpgradePanel({ onClose, currentGold, onPurchase }) {
  const [purchasing, setPurchasing] = useState(null);
  const [error, setError] = useState(null);
  const progression = loadProgression();
  const bonuses = getMetaUpgradeBonuses(progression);
  const meta = progression.metaUpgrades || {};

  const handlePurchase = async (upgradeId, level) => {
    if (purchasing) return;

    setPurchasing(`${upgradeId}_${level}`);
    setError(null);

    // Simulate async operation for better UX
    await new Promise((resolve) => setTimeout(resolve, 100));

    const result = purchaseMetaUpgrade(upgradeId, level, currentGold);

    if (result.success) {
      onPurchase(result.cost);
      setPurchasing(null);
    } else {
      setError(result.reason);
      setPurchasing(null);
      setTimeout(() => setError(null), 3000);
    }
  };

  const isPurchased = (upgradeId, level) => {
    return meta[upgradeId]?.[`level${level}`] || false;
  };

  const getTotalBonus = (upgradeId) => {
    return bonuses[upgradeId] || 0;
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.98))',
          border: '2px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
          maxWidth: '900px',
          width: '90%',
          maxHeight: '85vh',
          overflow: 'auto',
          animation: 'slideUp 0.3s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px 32px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), transparent)',
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#e2e8f0',
                fontFamily: "'Courier New', monospace",
              }}
            >
              ⭐ Meta Upgrades
            </h2>
            <p
              style={{
                margin: '8px 0 0',
                fontSize: '14px',
                color: '#94a3b8',
                fontFamily: "'Courier New', monospace",
              }}
            >
              Permanent bonuses that persist across games
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#fbbf24',
                fontFamily: "'Courier New', monospace",
              }}
            >
              💰 {currentGold} Gold
            </div>
            <button
              onClick={onClose}
              style={{
                marginTop: '8px',
                padding: '8px 16px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                color: '#e2e8f0',
                cursor: 'pointer',
                fontFamily: "'Courier New', monospace",
                fontSize: '13px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              padding: '12px 32px',
              background: 'rgba(239, 68, 68, 0.2)',
              borderLeft: '3px solid #ef4444',
              color: '#fca5a5',
              fontFamily: "'Courier New', monospace",
              fontSize: '13px',
            }}
          >
            {error}
          </div>
        )}

        {/* Upgrade Cards */}
        <div
          style={{
            padding: '24px 32px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
          }}
        >
          {Object.entries(UPGRADE_CONFIG).map(([upgradeId, config]) => {
            const levels = META_UPGRADE_COSTS[upgradeId];
            const totalBonus = getTotalBonus(upgradeId);

            return (
              <div
                key={upgradeId}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${config.color}40`,
                  borderRadius: '12px',
                  padding: '20px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.borderColor = `${config.color}80`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = `${config.color}40`;
                }}
              >
                {/* Upgrade Header */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '32px', marginRight: '12px' }}>{config.icon}</span>
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: config.color,
                        fontFamily: "'Courier New', monospace",
                      }}
                    >
                      {config.name}
                    </h3>
                    <p
                      style={{
                        margin: '4px 0 0',
                        fontSize: '12px',
                        color: '#94a3b8',
                        fontFamily: "'Courier New', monospace",
                      }}
                    >
                      {config.description}
                    </p>
                  </div>
                </div>

                {/* Current Bonus */}
                <div
                  style={{
                    padding: '10px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    textAlign: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: '13px',
                      color: '#94a3b8',
                      fontFamily: "'Courier New', monospace",
                    }}
                  >
                    Current Bonus:{' '}
                  </span>
                  <span
                    style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: config.color,
                      fontFamily: "'Courier New', monospace",
                    }}
                  >
                    +{totalBonus}
                    {upgradeId.includes('Discount') ||
                    upgradeId.includes('Reward') ||
                    upgradeId.includes('Bonus')
                      ? '%'
                      : ''}
                  </span>
                </div>

                {/* Level Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {Object.entries(levels).map(([levelKey, levelData]) => {
                    const purchased = isPurchased(upgradeId, levelKey.replace('level', ''));
                    const isPurchasing =
                      purchasing === `${upgradeId}_${levelKey.replace('level', '')}`;
                    const canAfford = currentGold >= levelData.cost;

                    return (
                      <button
                        key={levelKey}
                        onClick={() =>
                          !purchased && handlePurchase(upgradeId, levelKey.replace('level', ''))
                        }
                        disabled={purchased || isPurchasing}
                        style={{
                          padding: '10px 12px',
                          background: purchased
                            ? 'rgba(16, 185, 129, 0.2)'
                            : canAfford
                              ? `${config.color}30`
                              : 'rgba(255, 255, 255, 0.05)',
                          border: `1px solid ${
                            purchased
                              ? '#10b981'
                              : canAfford
                                ? config.color
                                : 'rgba(255, 255, 255, 0.1)'
                          }`,
                          borderRadius: '8px',
                          color: purchased ? '#10b981' : canAfford ? config.color : '#64748b',
                          cursor: purchased || isPurchasing ? 'default' : 'pointer',
                          fontFamily: "'Courier New', monospace",
                          fontSize: '12px',
                          fontWeight: 'bold',
                          transition: 'all 0.2s',
                          opacity: purchased ? 0.7 : 1,
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                        onMouseEnter={(e) => {
                          if (!purchased && canAfford) {
                            e.target.style.background = `${config.color}50`;
                            e.target.style.transform = 'scale(1.02)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!purchased) {
                            e.target.style.background = purchased
                              ? 'rgba(16, 185, 129, 0.2)'
                              : canAfford
                                ? `${config.color}30`
                                : 'rgba(255, 255, 255, 0.05)';
                            e.target.style.transform = 'scale(1)';
                          }
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>
                            {levelKey.replace('level', 'Level ')}: +{levelData.bonus}
                            {upgradeId.includes('Discount') ||
                            upgradeId.includes('Reward') ||
                            upgradeId.includes('Bonus')
                              ? '%'
                              : ''}
                          </span>
                          <span>
                            {purchased ? '✓' : isPurchasing ? '⏳' : `💰 ${levelData.cost}`}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 32px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
            color: '#64748b',
            fontSize: '12px',
            fontFamily: "'Courier New', monospace",
          }}
        >
          💡 Tip: These bonuses apply to all game modes and persist permanently!
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
