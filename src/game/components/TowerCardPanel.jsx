import React, { useState, useEffect, useMemo, useRef } from 'react';
import { TOWER_DEFS, getUnlockedTowers } from '../constants';
import { loadProgression } from '../system/saveSystem';

/**
 * Tower Card Component
 */
function TowerCard({ tower, selected, onClick, canAfford }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const def = TOWER_DEFS[tower];
  if (!def) return null;

  const isSelected = selected === tower;
  const canBuy = canAfford && def.cost <= canAfford;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      disabled={!canBuy}
      style={{
        width: 130,
        height: 160,
        padding: 12,
        borderRadius: 16,
        border: isSelected
          ? `2px solid ${def.color}`
          : `1px solid ${canBuy ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)'}`,
        cursor: canBuy ? 'pointer' : 'not-allowed',
        background: isSelected
          ? `linear-gradient(135deg, ${def.color}30, ${def.accentColor}20)`
          : canBuy
            ? 'rgba(30, 35, 45, 0.95)'
            : 'rgba(20, 25, 35, 0.8)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isPressed ? 'scale(0.95)' : isHovered ? 'scale(1.03)' : 'scale(1)',
        boxShadow: isSelected
          ? `0 0 20px ${def.color}40, 0 8px 24px rgba(0,0,0,0.3)`
          : isHovered && canBuy
            ? '0 4px 16px rgba(0,0,0,0.3)'
            : '0 2px 8px rgba(0,0,0,0.2)',
        opacity: canBuy ? 1 : 0.5,
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Tower Icon */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          background: `linear-gradient(135deg, ${def.color}, ${def.accentColor})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          boxShadow: `0 4px 16px ${def.color}40`,
        }}
      >
        {def.icon || '🏰'}
      </div>

      {/* Tower Name */}
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: '#fff',
          textAlign: 'center',
        }}
      >
        {def.label}
      </div>

      {/* Cost */}
      <div
        style={{
          padding: '6px 12px',
          borderRadius: 8,
          background: canBuy ? 'rgba(251, 191, 36, 0.2)' : 'rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <span style={{ fontSize: 14 }}>💰</span>
        <span
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: canBuy ? '#fbbf24' : 'rgba(255,255,255,0.4)',
          }}
        >
          {def.cost}
        </span>
      </div>

      {/* Stats Preview */}
      <div
        style={{
          fontSize: 9,
          color: 'rgba(255,255,255,0.5)',
          textAlign: 'center',
        }}
      >
        {def.damage ? `⚔️ ${def.damage}` : '🌟 Support'}
      </div>
    </button>
  );
}

/**
 * Reroll Button Component
 */
function RerollButton({ onClick, cost, canAfford }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const canReroll = canAfford >= cost;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      disabled={!canReroll}
      style={{
        width: 80,
        height: 160,
        padding: 12,
        borderRadius: 16,
        border: `1px solid ${canReroll ? 'rgba(139, 92, 246, 0.4)' : 'rgba(255,255,255,0.08)'}`,
        cursor: canReroll ? 'pointer' : 'not-allowed',
        background: canReroll
          ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(124, 58, 237, 0.15))'
          : 'rgba(20, 25, 35, 0.8)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        transition: 'all 150ms ease',
        transform: isPressed ? 'scale(0.95)' : isHovered ? 'scale(1.03)' : 'scale(1)',
        opacity: canReroll ? 1 : 0.5,
      }}
    >
      <div style={{ fontSize: 28 }}>🔄</div>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#a78bfa', textAlign: 'center' }}>
        REROLL
      </div>
      <div
        style={{
          padding: '4px 10px',
          borderRadius: 6,
          background: 'rgba(251, 191, 36, 0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <span style={{ fontSize: 12 }}>💰</span>
        <span
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: canReroll ? '#fbbf24' : 'rgba(255,255,255,0.3)',
          }}
        >
          {cost}
        </span>
      </div>
    </button>
  );
}

/**
 * Tower Card Panel Component
 * Shows random tower cards below the game field with reroll mechanic
 */
export default function TowerCardPanel({
  currentGold,
  selectedTower,
  onSelectTower,
  onReroll,
  rerollCost = 50,
  unlockedTowerIds = null,
}) {
  const [cards, setCards] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const rerollTimerRef = useRef(null);

  // Get available towers based on unlock progression
  const availableTowers = useMemo(() => {
    // Get actual unlocked towers from progression
    const progression = loadProgression();
    const unlocked =
      unlockedTowerIds !== null && unlockedTowerIds !== undefined && unlockedTowerIds.length > 0
        ? unlockedTowerIds
        : getUnlockedTowers(progression);
    return unlocked.filter((towerId) => TOWER_DEFS[towerId]);
  }, [unlockedTowerIds]);

  // Shuffle and select 3 random towers
  const selectRandomCards = () => {
    const shuffled = [...availableTowers];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const selected = shuffled.slice(0, Math.min(3, shuffled.length));
    setCards(selected);
    return selected;
  };

  // Initialize cards on mount
  useEffect(() => {
    if (cards.length === 0) {
      selectRandomCards();
    }
  }, [availableTowers]);

  useEffect(() => {
    return () => {
      if (rerollTimerRef.current) {
        clearTimeout(rerollTimerRef.current);
      }
    };
  }, []);

  // Handle reroll with animation and cleanup
  const handleReroll = () => {
    if (currentGold < rerollCost) return;

    // Check if we're already animating to prevent interruption
    if (isAnimating) return;

    setIsAnimating(true);
    setCards([]); // Clear cards for animation

    if (rerollTimerRef.current) {
      clearTimeout(rerollTimerRef.current);
    }

    rerollTimerRef.current = setTimeout(() => {
      selectRandomCards();
      setIsAnimating(false);
      rerollTimerRef.current = null;
      onReroll?.();
    }, 300);
  };

  // Handle card click
  const handleCardClick = (towerId) => {
    if (currentGold < TOWER_DEFS[towerId]?.cost) return;
    onSelectTower?.(towerId);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: '16px 24px',
        background: 'linear-gradient(180deg, rgba(10, 14, 20, 0.95), rgba(15, 20, 30, 0.98))',
        borderRadius: 24,
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Reroll Button */}
      <RerollButton onClick={handleReroll} cost={rerollCost} canAfford={currentGold} />

      {/* Tower Cards with animation */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          opacity: isAnimating ? 0 : 1,
          transform: isAnimating ? 'translateX(20px)' : 'translateX(0)',
          transition: 'all 300ms ease',
        }}
      >
        {cards.length > 0
          ? cards.map((towerId) => (
              <TowerCard
                key={towerId}
                tower={towerId}
                selected={selectedTower}
                onClick={() => handleCardClick(towerId)}
                canAfford={currentGold}
              />
            ))
          : // Loading/empty state
            [0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 130,
                  height: 160,
                  borderRadius: 16,
                  background: 'rgba(30, 35, 45, 0.5)',
                  border: '1px dashed rgba(255,255,255,0.1)',
                }}
              />
            ))}
      </div>
    </div>
  );
}
