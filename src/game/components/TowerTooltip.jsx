import React from 'react';

function formatValue(value, suffix = '') {
  if (value === undefined || value === null) return '0';
  if (typeof value === 'number') {
    if (Number.isInteger(value)) return `${value}${suffix}`;
    return `${value.toFixed(2)}${suffix}`;
  }
  return `${value}${suffix}`;
}

export default function TowerTooltip({ tower, stats, nextStats = null, visible = false }) {
  if (!visible || !tower || !stats) return null;

  const towerType = tower.type || tower.defId || 'basic';

  return (
    <div
      style={{
        padding: 12,
        borderRadius: 12,
        background: 'rgba(8,15,30,0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 18px 40px rgba(0,0,0,0.35)',
      }}
    >
      <div style={{ fontSize: 10, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>
        Tower Stats
      </div>
      <div style={{ marginTop: 6, fontSize: 15, fontWeight: 700, color: '#fff' }}>
        {tower.label || towerType}
      </div>
      <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
        <Stat label="Damage" value={formatValue(stats.damage)} nextValue={nextStats?.damage} />
        <Stat label="Range" value={formatValue(stats.range, 'px')} nextValue={nextStats?.range} />
        <Stat label="Fire Rate" value={formatValue(stats.fireRate, '/s')} nextValue={nextStats?.fireRate} />
        <Stat label="Cost" value={`${tower.cost || 0}g`} />
      </div>
      {(stats.slowAmount || stats.poisonDamage || stats.burnDamage || stats.splashRadius || stats.bossDamage) && (
        <div style={{ marginTop: 10, fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
          {stats.slowAmount ? `Slow ${Math.round(stats.slowAmount * 100)}% for ${stats.slowDuration || 0}s` : null}
          {stats.poisonDamage ? ` Poison ${stats.poisonDamage} over ${stats.poisonDuration || 0}s` : null}
          {stats.burnDamage ? ` Burn ${stats.burnDamage}/s` : null}
          {stats.splashRadius ? ` Splash ${stats.splashRadius}px` : null}
          {stats.bossDamage ? ` Boss Damage x${stats.bossDamage}` : null}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, nextValue }) {
  const diff = typeof nextValue === 'number' && typeof value === 'string'
    ? null
    : typeof nextValue === 'number' && typeof value === 'number'
      ? nextValue === value
        ? null
        : nextValue > value
          ? `+${(nextValue - value).toFixed(0)}`
          : `${(nextValue - value).toFixed(0)}`
      : null;

  return (
    <div style={{ padding: 8, borderRadius: 8, background: 'rgba(255,255,255,0.04)' }}>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ marginTop: 4, display: 'flex', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontWeight: 700, color: '#fff' }}>{value}</span>
        {diff && <span style={{ color: diff.startsWith('+') ? '#4ade80' : '#f87171' }}>{diff}</span>}
      </div>
    </div>
  );
}
