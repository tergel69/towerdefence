import React, { useState } from 'react';
import { 
  getLeaderboard, 
  LEADERBOARD_TYPES, 
  formatTimestamp,
  clearLeaderboard 
} from '../system/leaderboardSystem';

/**
 * LeaderboardPanel - Displays game leaderboards
 */
export default function LeaderboardPanel({ onClose }) {
  const [activeTab, setActiveTab] = useState(LEADERBOARD_TYPES.ENDLESS);
  
  const tabs = [
    { id: LEADERBOARD_TYPES.ENDLESS, label: 'Endless' },
    { id: LEADERBOARD_TYPES.SPEED_RUN, label: 'Speed Run' },
    { id: LEADERBOARD_TYPES.STARS, label: 'Stars' }
  ];
  
  const leaderboard = getLeaderboard(activeTab);
  
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 200,
    }} onClick={onClose}>
      <div style={{
        background: 'linear-gradient(135deg, #1a1f2e 0%, #0d1117 100%)',
        borderRadius: 20,
        padding: 24,
        maxWidth: 420,
        width: '90%',
        maxHeight: '80vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid rgba(96,165,250,0.3)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20
        }}>
          <h2 style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 700,
            color: '#f8fafc'
          }}>
            🏆 Leaderboard
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.5)',
              fontSize: 24,
              cursor: 'pointer',
              padding: 4,
              lineHeight: 1
            }}
          >
            ✕
          </button>
        </div>
        
        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: 8,
          marginBottom: 16,
          flexWrap: 'wrap'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                minWidth: 100,
                padding: '10px 16px',
                borderRadius: 10,
                border: 'none',
                background: activeTab === tab.id 
                  ? 'linear-gradient(135deg, #3b82f6, #2563eb)' 
                  : 'rgba(255,255,255,0.06)',
                color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.6)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Leaderboard List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          minHeight: 200
        }}>
          {leaderboard.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: 40,
              color: 'rgba(255,255,255,0.4)',
              fontSize: 14
            }}>
              No scores yet. Be the first!
            </div>
          ) : (
            leaderboard.map((entry, index) => (
              <div
                key={entry.id || index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 14px',
                  borderRadius: 12,
                  marginBottom: 8,
                  background: index < 3 
                    ? `rgba(${index === 0 ? '234,179,8' : index === 1 ? '156,163,175' : '205,127,50'},0.15)`
                    : 'rgba(255,255,255,0.04)',
                  border: index < 3 
                    ? `1px solid ${index === 0 ? 'rgba(234,179,8,0.3)' : index === 1 ? 'rgba(156,163,175,0.3)' : 'rgba(205,127,50,0.3)'}`
                    : '1px solid transparent'
                }}
              >
                {/* Rank */}
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  marginRight: 12,
                  background: index === 0 
                    ? 'linear-gradient(135deg, #eab308, #ca8a04)'
                    : index === 1 
                    ? 'linear-gradient(135deg, #9ca3af, #6b7280)'
                    : index === 2
                    ? 'linear-gradient(135deg, #cd7f32, #a0522d)'
                    : 'rgba(255,255,255,0.1)',
                  color: index < 3 ? '#000' : 'rgba(255,255,255,0.6)'
                }}>
                  {index + 1}
                </div>
                
                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#f8fafc'
                  }}>
                    {entry.playerName || 'Player'}
                  </div>
                  <div style={{
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.4)'
                  }}>
                    {entry.wave ? `Wave ${entry.wave}` : formatTimestamp(entry.timestamp)}
                  </div>
                </div>
                
                {/* Score */}
                <div style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#fbbf24'
                }}>
                  {entry.score.toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Clear Button (for testing) */}
        {leaderboard.length > 0 && (
          <button
            onClick={() => clearLeaderboard(activeTab)}
            style={{
              marginTop: 16,
              padding: '10px 16px',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(239,68,68,0.1)',
              color: 'rgba(239,68,68,0.8)',
              fontSize: 12,
              cursor: 'pointer',
              alignSelf: 'center'
            }}
          >
            Clear {activeTab} Scores
          </button>
        )}
      </div>
    </div>
  );
}