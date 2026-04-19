import React, { memo } from 'react';

interface KillFeedEntry {
  id: number;
  enemyType: string;
  isBoss: boolean;
  gold: number;
  comboCount: number;
  multiplier: number;
  timestamp: number;
  age: number;
}

interface ComboDisplay {
  active: boolean;
  count: number;
  multiplier: number;
  milestone: { label: string; color: string } | null;
  timer: number;
}

interface KillFeedProps {
  combo: ComboDisplay;
  killFeed: KillFeedEntry[];
}

/**
 * KillFeed — shows recent kills in a scrolling feed (top-right).
 * Combo banner shows at the top when chain kills > 1.
 */
export default memo(({ combo, killFeed }: KillFeedProps) => {
  if (!killFeed || killFeed.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 70,
        right: 12,
        width: 220,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        pointerEvents: 'none',
        zIndex: 100,
      }}
    >
      {/* Combo Banner */}
      {combo.active && (
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.85)',
            border: `2px solid ${combo.milestone?.color || '#fbbf24'}`,
            borderRadius: 8,
            padding: '8px 12px',
            textAlign: 'center',
            animation: 'comboPulse 0.5s ease-in-out',
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: combo.milestone?.color || '#fbbf24',
              fontFamily: "'Courier New', monospace",
            }}
          >
            {combo.milestone?.label || `${combo.count}x Combo!`}
          </div>
          <div
            style={{
              fontSize: 12,
              color: '#94a3b8',
              fontFamily: "'Courier New', monospace",
              marginTop: 2,
            }}
          >
            {combo.multiplier.toFixed(1)}x Gold
          </div>
          {/* Progress bar for chain timer */}
          <div
            style={{
              marginTop: 4,
              height: 3,
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${combo.timer * 100}%`,
                background: combo.milestone?.color || '#fbbf24',
                transition: 'width 0.1s linear',
              }}
            />
          </div>
        </div>
      )}

      {/* Kill Feed Entries */}
      {killFeed.slice(0, 6).map((entry) => {
        const alpha = Math.max(0, 1 - entry.age / 5);
        return (
          <div
            key={entry.id}
            style={{
              background: `rgba(0, 0, 0, ${0.7 * alpha})`,
              borderRadius: 6,
              padding: '6px 10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              opacity: alpha,
              transition: 'opacity 0.3s',
              borderLeft: `3px solid ${entry.isBoss ? '#ef4444' : '#4ade80'}`,
            }}
          >
            <div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: entry.isBoss ? 'bold' : 'normal',
                  color: entry.isBoss ? '#fca5a5' : '#e2e8f0',
                  fontFamily: "'Courier New', monospace",
                }}
              >
                {entry.isBoss ? '👑 ' : ''}
                {entry.enemyType}
              </span>
              {entry.comboCount > 2 && (
                <span
                  style={{
                    fontSize: 10,
                    color: '#fbbf24',
                    marginLeft: 6,
                    fontFamily: "'Courier New', monospace",
                  }}
                >
                  {entry.comboCount}x
                </span>
              )}
            </div>
            <span
              style={{
                fontSize: 12,
                color: '#fbbf24',
                fontFamily: "'Courier New', monospace",
              }}
            >
              +{entry.gold}g
            </span>
          </div>
        );
      })}

      <style>{`
        @keyframes comboPulse {
          0% { transform: scale(0.9); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
});
