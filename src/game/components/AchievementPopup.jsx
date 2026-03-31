import React from 'react';

export default function AchievementPopup({ achievement, reward = 0, onClose }) {
  if (!achievement) return null;

  return (
    <div
      style={{
        position: 'fixed',
        right: 20,
        top: 20,
        zIndex: 300,
        width: 320,
        padding: 16,
        borderRadius: 16,
        background: 'linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,41,59,0.94))',
        border: '1px solid rgba(251,191,36,0.35)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.45)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ fontSize: 10, letterSpacing: '0.16em', color: '#fbbf24', textTransform: 'uppercase' }}>
          Achievement Unlocked
        </div>
        <button
          onClick={onClose}
          style={{
            width: 28,
            height: 28,
            border: 'none',
            borderRadius: 8,
            background: 'rgba(255,255,255,0.08)',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          ×
        </button>
      </div>
      <div style={{ marginTop: 10, display: 'flex', gap: 12, alignItems: 'center' }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            display: 'grid',
            placeItems: 'center',
            background: 'rgba(251,191,36,0.12)',
            border: '1px solid rgba(251,191,36,0.25)',
            fontSize: 20,
          }}
        >
          {achievement.icon || '🏆'}
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{achievement.name}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 4 }}>
            {achievement.description}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 12, fontSize: 12, color: '#fbbf24', fontWeight: 700 }}>
        +{reward} gold
      </div>
    </div>
  );
}
