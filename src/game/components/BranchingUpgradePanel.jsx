import React, { useState } from 'react';
import { TOWER_DEFS } from '../constants';

/**
 * Branching Upgrade Selection Panel
 * Appears when a tower reaches the branch unlock level
 * Allows players to choose an upgrade path
 */
export default function BranchingUpgradePanel({ tower, money, onPurchaseBranch, onClose }) {
  const [selectedBranch, setSelectedBranch] = useState(null);

  if (!tower) return null;

  const towerDef = TOWER_DEFS[tower.type] || TOWER_DEFS[tower.defId];
  if (!towerDef || !towerDef.branches) return null;

  const branches = towerDef.branches;
  const branchKeys = Object.keys(branches);

  const getBranchProgress = (branchKey) => {
    if (!tower.branches || !tower.branches[branchKey]) return 0;
    return tower.branches[branchKey] || 0;
  };

  const getTierCost = (branchKey, tierIndex) => {
    const branch = branches[branchKey];
    if (!branch || !branch.tiers || !branch.tiers[tierIndex]) return null;
    return branch.tiers[tierIndex].cost;
  };

  const isTierPurchased = (branchKey, tierIndex) => {
    const progress = getBranchProgress(branchKey);
    return tierIndex < progress;
  };

  const canAffordTier = (branchKey, tierIndex) => {
    const cost = getTierCost(branchKey, tierIndex);
    if (cost === null) return false;
    if (isTierPurchased(branchKey, tierIndex)) return true;
    return money >= cost;
  };

  return (
    <div
      style={{
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 360,
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.98))',
        borderLeft: '2px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Courier New', monospace",
        color: '#e2e8f0',
        zIndex: 101,
        animation: 'slideIn 0.2s ease-out',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          background: `linear-gradient(135deg, ${towerDef.color}22, transparent)`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              background: towerDef.color,
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: 16,
              color: '#fff',
            }}
          >
            🌿
          </div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: 15 }}>Branching Upgrades</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>
              {towerDef.label} - Level {tower.level + 1}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
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

      {/* Branch Selection */}
      <div
        style={{
          flex: 1,
          padding: '16px 20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {branchKeys.map((branchKey) => {
          const branch = branches[branchKey];
          const isSelected = selectedBranch === branchKey;
          const progress = getBranchProgress(branchKey);

          return (
            <div
              key={branchKey}
              style={{
                background: isSelected
                  ? `${branch.tiers?.[0]?.stats ? towerDef.color : '#3b82f6'}15`
                  : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${
                  isSelected
                    ? `${branch.tiers?.[0]?.stats ? towerDef.color : '#3b82f6'}60`
                    : 'rgba(255, 255, 255, 0.08)'
                }`,
                borderRadius: '12px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onClick={() => setSelectedBranch(branchKey)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.borderColor = `${
                  branch.tiers?.[0]?.stats ? towerDef.color : '#3b82f6'
                }40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isSelected
                  ? `${branch.tiers?.[0]?.stats ? towerDef.color : '#3b82f6'}15`
                  : 'rgba(255, 255, 255, 0.03)';
                e.currentTarget.style.borderColor = isSelected
                  ? `${branch.tiers?.[0]?.stats ? towerDef.color : '#3b82f6'}60`
                  : 'rgba(255, 255, 255, 0.08)';
              }}
            >
              {/* Branch Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: '24px' }}>{branch.icon}</span>
                  <div>
                    <div
                      style={{
                        fontWeight: 'bold',
                        fontSize: 14,
                        color: branch.tiers?.[0]?.stats ? towerDef.color : '#3b82f6',
                      }}
                    >
                      {branch.name}
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{branch.description}</div>
                  </div>
                </div>
                <div
                  style={{
                    padding: '4px 8px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '4px',
                    fontSize: '11px',
                    color: '#64748b',
                  }}
                >
                  {progress}/{branch.tiers?.length || 0}
                </div>
              </div>

              {/* Tier Progress */}
              <div
                style={{
                  display: 'flex',
                  gap: '6px',
                  marginBottom: '12px',
                }}
              >
                {branch.tiers?.map((tier, tierIndex) => {
                  const purchased = isTierPurchased(branchKey, tierIndex);
                  const affordable = canAffordTier(branchKey, tierIndex);

                  return (
                    <div
                      key={tierIndex}
                      style={{
                        flex: 1,
                        height: '4px',
                        background: purchased
                          ? '#10b981'
                          : affordable
                            ? `${towerDef.color}60`
                            : 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '2px',
                        transition: 'all 0.2s',
                      }}
                    />
                  );
                })}
              </div>

              {/* Next Tier Info */}
              {progress < branch.tiers?.length && (
                <div
                  style={{
                    padding: '10px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                >
                  <div
                    style={{
                      color: '#94a3b8',
                      marginBottom: '4px',
                    }}
                  >
                    Next: Tier {progress + 1}
                  </div>
                  <div
                    style={{
                      fontWeight: 'bold',
                      color: towerDef.color,
                    }}
                  >
                    {branch.tiers[progress].description}
                  </div>
                  <div
                    style={{
                      marginTop: '6px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ color: '#64748b' }}>Cost:</span>
                    <span
                      style={{
                        fontWeight: 'bold',
                        color: canAffordTier(branchKey, progress) ? '#10b981' : '#ef4444',
                      }}
                    >
                      💰 {branch.tiers[progress].cost}
                    </span>
                  </div>
                </div>
              )}

              {/* Purchase Button */}
              {progress < branch.tiers?.length && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (canAffordTier(branchKey, progress)) {
                      onPurchaseBranch(branchKey, progress);
                    }
                  }}
                  disabled={!canAffordTier(branchKey, progress)}
                  style={{
                    marginTop: '10px',
                    width: '100%',
                    padding: '10px',
                    background: canAffordTier(branchKey, progress)
                      ? `${towerDef.color}40`
                      : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${
                      canAffordTier(branchKey, progress)
                        ? towerDef.color
                        : 'rgba(255, 255, 255, 0.1)'
                    }`,
                    borderRadius: '8px',
                    color: canAffordTier(branchKey, progress) ? towerDef.color : '#64748b',
                    cursor: canAffordTier(branchKey, progress) ? 'pointer' : 'not-allowed',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    fontFamily: "'Courier New', monospace",
                    transition: 'all 0.2s',
                    opacity: canAffordTier(branchKey, progress) ? 1 : 0.5,
                  }}
                  onMouseEnter={(e) => {
                    if (canAffordTier(branchKey, progress)) {
                      e.target.style.background = `${towerDef.color}60`;
                      e.target.style.transform = 'scale(1.02)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (canAffordTier(branchKey, progress)) {
                      e.target.style.background = `${towerDef.color}40`;
                      e.target.style.transform = 'scale(1)';
                    }
                  }}
                >
                  {canAffordTier(branchKey, progress)
                    ? `Purchase Tier ${progress + 1}`
                    : progress === 0
                      ? 'Unlock Branch'
                      : `Need 💰 ${branch.tiers[progress].cost - money} more`}
                </button>
              )}

              {/* Completed Message */}
              {progress >= branch.tiers?.length && (
                <div
                  style={{
                    padding: '10px',
                    background: 'rgba(16, 185, 129, 0.2)',
                    borderRadius: '8px',
                    textAlign: 'center',
                    color: '#10b981',
                    fontSize: '13px',
                    fontWeight: 'bold',
                  }}
                >
                  ✓ Branch Complete!
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '12px 20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '11px',
          color: '#64748b',
          textAlign: 'center',
        }}
      >
        💡 Select a branch above to view details
      </div>
    </div>
  );
}
