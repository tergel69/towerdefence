// ============================================================
//  supportBuffSystem.js
//  Support tower aura buff system
//  - Support towers (speedBoost, damageAmp, rangeExtend) actively
//    buff nearby towers within a radius.
//  - Buffs stack multiplicatively.
// ============================================================

// ── Support Buff Definitions ─────────────────────────────────
export const SUPPORT_BUFF_DEFS = {
  speedBoost: {
    buffType: 'fireRate',
    radius: 96, // 2 tiles
    multiplier: 1.25, // +25% fire rate
    icon: '\u26A1',
    color: '#fbbf24',
  },
  damageAmp: {
    buffType: 'damage',
    radius: 96,
    multiplier: 1.2, // +20% damage
    icon: '\uD83D\uDCA5',
    color: '#ef4444',
  },
  rangeExtend: {
    buffType: 'range',
    radius: 96,
    multiplier: 1.3, // +30% range
    icon: '\uD83C\uDFAF',
    color: '#60a5fa',
  },
};

// ── Helper: Check if a tower is a support tower ──────────────
function isSupportTower(tower) {
  const towerType = tower?.type || tower?.defId;
  return towerType in SUPPORT_BUFF_DEFS;
}

// ── Helper: Distance between two objects with x,y ────────────
function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// ── State Factory ────────────────────────────────────────────
/**
 * Creates a fresh support buff state object.
 * @returns {{ activeBuffs: Array<{ sourceId, buffType, radius, multiplier, color, icon, x, y }> }}
 */
export function createSupportBuffState() {
  return { activeBuffs: [] };
}

// ── Update Support Buffs ─────────────────────────────────────
/**
 * Scans all support towers and creates/updates buff zones.
 * Each support tower creates a buff zone that affects all
 * non-support towers within its radius.
 *
 * @param {{ activeBuffs: Array }} supportBuffState
 * @param {Array} towers - All placed towers
 * @param {number} dt - Delta time (unused for now, reserved for future pulse animations)
 */
export function updateSupportBuffs(supportBuffState, towers, dt) {
  if (!towers || towers.length === 0) {
    supportBuffState.activeBuffs = [];
    return;
  }

  const newBuffs = [];

  for (const tower of towers) {
    if (!isSupportTower(tower)) continue;

    const towerType = tower.type || tower.defId;
    const buffDef = SUPPORT_BUFF_DEFS[towerType];
    if (!buffDef) continue;

    // Check if there are any non-support towers in range
    const buffedTowers = towers.filter(
      (t) => !isSupportTower(t) && t.id !== tower.id && dist(t, tower) <= buffDef.radius
    );

    // Only create a buff zone if there are towers to buff
    if (buffedTowers.length > 0) {
      newBuffs.push({
        sourceId: tower.id,
        buffType: buffDef.buffType,
        radius: buffDef.radius,
        multiplier: buffDef.multiplier,
        color: buffDef.color,
        icon: buffDef.icon,
        x: tower.x,
        y: tower.y,
        towerCount: buffedTowers.length,
      });
    }
  }

  supportBuffState.activeBuffs = newBuffs;
}

// ── Apply Support Buffs To Tower ─────────────────────────────
/**
 * Returns a modifier object for the given tower based on all
 * overlapping buff zones. Buffs stack multiplicatively.
 *
 * @param {{ activeBuffs: Array }} supportBuffState
 * @param {Object} tower - The tower to check
 * @returns {{ fireRateMultiplier: number, damageMultiplier: number, rangeMultiplier: number }}
 */
export function applySupportBuffsToTower(supportBuffState, tower) {
  const modifiers = {
    fireRateMultiplier: 1.0,
    damageMultiplier: 1.0,
    rangeMultiplier: 1.0,
  };

  if (!supportBuffState?.activeBuffs || supportBuffState.activeBuffs.length === 0) {
    return modifiers;
  }

  for (const buff of supportBuffState.activeBuffs) {
    // Skip if this buff originates from the tower itself
    if (buff.sourceId === tower.id) continue;

    const distance = Math.hypot(tower.x - buff.x, tower.y - buff.y);
    if (distance > buff.radius) continue;

    // Apply multiplicative stacking
    switch (buff.buffType) {
      case 'fireRate':
        modifiers.fireRateMultiplier *= buff.multiplier;
        break;
      case 'damage':
        modifiers.damageMultiplier *= buff.multiplier;
        break;
      case 'range':
        modifiers.rangeMultiplier *= buff.multiplier;
        break;
      default:
        break;
    }
  }

  return modifiers;
}

// ── Get Tower Buff Count ─────────────────────────────────────
/**
 * Returns how many buffs a tower is currently receiving.
 *
 * @param {{ activeBuffs: Array }} supportBuffState
 * @param {Object} tower - The tower to check (needs x, y, id)
 * @returns {number}
 */
export function getTowerBuffCount(supportBuffState, tower) {
  if (!supportBuffState?.activeBuffs || supportBuffState.activeBuffs.length === 0) {
    return 0;
  }

  let count = 0;
  for (const buff of supportBuffState.activeBuffs) {
    if (buff.sourceId === tower.id) continue;

    const distance = Math.hypot(tower.x - buff.x, tower.y - buff.y);
    if (distance <= buff.radius) {
      count++;
    }
  }
  return count;
}

// ── Render Support Buff Auras ────────────────────────────────
/**
 * Renders visual aura circles around support towers showing
 * their buff radius. Draws a dashed circle with the support
 * tower's buff color and a small icon above the tower.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array} towers - All placed towers
 * @param {{ activeBuffs: Array }} supportBuffState
 */
export function renderSupportBuffAuras(ctx, towers, supportBuffState) {
  if (!towers || towers.length === 0) return;
  if (!supportBuffState?.activeBuffs || supportBuffState.activeBuffs.length === 0) return;

  // Collect unique support towers that have active buffs
  const buffedBySource = new Map();
  for (const buff of supportBuffState.activeBuffs) {
    if (!buffedBySource.has(buff.sourceId)) {
      buffedBySource.set(buff.sourceId, []);
    }
    buffedBySource.get(buff.sourceId).push(buff);
  }

  for (const [sourceId] of buffedBySource) {
    const tower = towers.find((t) => t.id === sourceId);
    if (!tower) continue;

    const towerType = tower.type || tower.defId;
    const buffDef = SUPPORT_BUFF_DEFS[towerType];
    if (!buffDef) continue;

    // Draw dashed aura circle
    ctx.save();
    ctx.strokeStyle = buffDef.color;
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.arc(tower.x, tower.y, buffDef.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // Draw icon above the tower
    ctx.save();
    ctx.font = '16px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.globalAlpha = 0.9;
    ctx.fillText(buffDef.icon, tower.x, tower.y - buffDef.radius - 8);
    ctx.restore();
  }
}
