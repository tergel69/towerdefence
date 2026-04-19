import React, { useState } from 'react';

const DIFFICULTIES = {
  easy: {
    name: 'Easy',
    icon: '😊',
    color: '#10b981',
    description: 'For beginners',
    modifiers: {
      enemyHpMultiplier: 0.7,
      enemySpeedMultiplier: 0.85,
      goldMultiplier: 1.3,
      livesMultiplier: 1.5,
      startingGoldBonus: 100,
      startingLivesBonus: 10,
    },
  },
  normal: {
    name: 'Normal',
    icon: '😐',
    color: '#3b82f6',
    description: 'Balanced experience',
    modifiers: {
      enemyHpMultiplier: 1.0,
      enemySpeedMultiplier: 1.0,
      goldMultiplier: 1.0,
      livesMultiplier: 1.0,
      startingGoldBonus: 0,
      startingLivesBonus: 0,
    },
  },
  hard: {
    name: 'Hard',
    icon: '💀',
    color: '#ef4444',
    description: 'For veterans',
    modifiers: {
      enemyHpMultiplier: 1.5,
      enemySpeedMultiplier: 1.2,
      goldMultiplier: 0.8,
      livesMultiplier: 0.7,
      startingGoldBonus: -50,
      startingLivesBonus: -5,
    },
  },
};

export default function DifficultySelector({ onSelect, onClose, currentDifficulty = 'normal' }) {
  const [hoveredDifficulty, setHoveredDifficulty] = useState(null);

  const handleSelect = (difficulty) => {
    onSelect(difficulty);
    onClose();
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
          maxWidth: '700px',
          width: '90%',
          animation: 'slideUp 0.3s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px 32px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#e2e8f0',
              fontFamily: "'Courier New', monospace",
            }}
          >
            🎮 Select Difficulty
          </h2>
          <p
            style={{
              margin: '8px 0 0',
              fontSize: '14px',
              color: '#94a3b8',
              fontFamily: "'Courier New', monospace",
            }}
          >
            Choose your challenge level
          </p>
        </div>

        {/* Difficulty Options */}
        <div
          style={{
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {Object.entries(DIFFICULTIES).map(([key, difficulty]) => {
            const isHovered = hoveredDifficulty === key;
            const isCurrent = currentDifficulty === key;

            return (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                onMouseEnter={() => setHoveredDifficulty(key)}
                onMouseLeave={() => setHoveredDifficulty(null)}
                style={{
                  padding: '20px 24px',
                  background: isCurrent
                    ? `${difficulty.color}20`
                    : isHovered
                      ? `${difficulty.color}15`
                      : 'rgba(255, 255, 255, 0.05)',
                  border: `2px solid ${
                    isCurrent
                      ? difficulty.color
                      : isHovered
                        ? `${difficulty.color}80`
                        : 'rgba(255, 255, 255, 0.1)'
                  }`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: isHovered ? `0 8px 24px ${difficulty.color}30` : 'none',
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    fontSize: '48px',
                    width: '64px',
                    height: '64px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `${difficulty.color}20`,
                    borderRadius: '12px',
                  }}
                >
                  {difficulty.icon}
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '8px',
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: difficulty.color,
                        fontFamily: "'Courier New', monospace",
                      }}
                    >
                      {difficulty.name}
                    </h3>
                    {isCurrent && (
                      <span
                        style={{
                          padding: '4px 8px',
                          background: difficulty.color,
                          color: '#fff',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          fontFamily: "'Courier New', monospace",
                        }}
                      >
                        CURRENT
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      margin: '0 0 12px',
                      fontSize: '14px',
                      color: '#94a3b8',
                      fontFamily: "'Courier New', monospace",
                    }}
                  >
                    {difficulty.description}
                  </p>

                  {/* Modifiers */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                      gap: '8px',
                    }}
                  >
                    {Object.entries(difficulty.modifiers).map(([modKey, modValue]) => {
                      const isPositive =
                        modValue > 0 || (modValue === 1 && modKey.includes('Bonus'));
                      const displayValue = modKey.includes('Multiplier')
                        ? `${((modValue - 1) * 100).toFixed(0)}%`
                        : modValue > 0
                          ? `+${modValue}`
                          : `${modValue}`;

                      return (
                        <div
                          key={modKey}
                          style={{
                            padding: '6px 10px',
                            background: 'rgba(0, 0, 0, 0.3)',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontFamily: "'Courier New', monospace",
                          }}
                        >
                          <span style={{ color: '#64748b' }}>
                            {modKey.replace(/([A-Z])/g, ' $1').trim()}:{' '}
                          </span>
                          <span
                            style={{
                              color: isPositive ? '#10b981' : '#ef4444',
                              fontWeight: 'bold',
                            }}
                          >
                            {displayValue}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 32px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '10px 24px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#e2e8f0',
              cursor: 'pointer',
              fontFamily: "'Courier New', monospace",
              fontSize: '14px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            Cancel
          </button>
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
