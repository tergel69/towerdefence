import React from 'react';

/**
 * Results Screen Component
 * Shows after game over or victory with stats summary
 */
export default function ResultsScreen({ 
  isOpen, 
  isVictory,
  stats,
  onPlayAgain,
  onMainMenu,
  onShare = null 
}) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 150,
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #1a1f2e 0%, #0d1117 100%)',
          borderRadius: 20,
          padding: 32,
          width: 380,
          maxWidth: '90vw',
          textAlign: 'center',
          border: `1px solid ${isVictory ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}`,
          boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${isVictory ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)'}`,
        }}
      >
        {/* Victory/Defeat Banner */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: '0.1em',
            marginBottom: 8,
            color: isVictory ? '#22c55e' : '#ef4444',
          }}
        >
          {isVictory ? '🎉 VICTORY!' : '💀 GAME OVER'}
        </div>
        
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 24 }}>
          {isVictory 
            ? 'You defended the base! All waves cleared.' 
            : 'The enemies broke through your defenses.'}
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
            marginBottom: 28,
          }}
        >
          <StatBox label="Wave Reached" value={stats?.wave || 0} color="#60a5fa" />
          <StatBox label="Enemies Killed" value={stats?.enemiesKilled || 0} color="#f87171" />
          <StatBox label="Gold Earned" value={stats?.goldEarned || 0} color="#fbbf24" />
          <StatBox label="Towers Built" value={stats?.towersBuilt || 0} color="#a78bfa" />
          <StatBox label="Score" value={stats?.score || 0} color="#34d399" />
          <StatBox label="Time" value={formatTime(stats?.timeSeconds || 0)} color="#94a3b8" />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={onPlayAgain}
            style={{
              padding: '14px 24px',
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #16a34a, #22c55e)',
              color: '#fff',
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            🔄 Play Again
          </button>

          <button
            onClick={onMainMenu}
            style={{
              padding: '12px 24px',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.2)',
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.05)',
              color: '#e2e8f0',
              fontSize: 14,
            }}
          >
            🏠 Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, color }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 10,
        padding: '12px 8px',
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 700, color, marginBottom: 4 }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </div>
    </div>
  );
}

function formatTime(seconds) {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}