import React from 'react';

export default function WavePreview({ waveNumber, entries = [], bonusGold = 0, visible = true }) {
  if (!visible) return null;

  return (
    <div
      style={{
        padding: 12,
        borderRadius: 14,
        background: 'linear-gradient(135deg, rgba(15,23,42,0.96), rgba(30,41,59,0.92))',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 18px 40px rgba(0,0,0,0.25)',
      }}
    >
      <div
        style={{
          fontSize: 10,
          letterSpacing: '0.16em',
          color: 'rgba(255,255,255,0.45)',
          textTransform: 'uppercase',
        }}
      >
        Wave Preview
      </div>
      <div style={{ marginTop: 6, fontSize: 15, fontWeight: 700, color: '#f8fafc' }}>
        Wave {waveNumber}
      </div>
      <div style={{ marginTop: 4, fontSize: 12, color: '#fbbf24' }}>
        Bonus: {bonusGold}g on clear
      </div>
      <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {entries.length === 0 ? (
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
            No enemies previewed yet.
          </div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.type}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                fontSize: 12,
                color: 'rgba(255,255,255,0.82)',
              }}
            >
              <span>{entry.label}</span>
              <span style={{ color: '#cbd5e1' }}>x{entry.count}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
