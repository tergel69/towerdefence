// ============================================================
//  towerSystem.js
//  Handles:
//   - Creating tower instances
//   - Per-frame targeting logic (find closest enemy in range)
//   - Fire-rate cooldown management
//   - Upgrade logic
//   - Sell logic
// ============================================================

import { TOWER_DEFS, TILE_SIZE, SELL_REFUND_PCT } from '../constants';
import { createProjectile } from './projectileSystem';

let _nextTowerId = 1;

// ── Factory ──────────────────────────────────────────────────
/**
 * @param {string} type   - 'basic' | 'splash'
 * @param {number} col    - grid column
 * @param {number} row    - grid row
 */
export function createTower(type, col, row) {
  return {
    id: _nextTowerId++,
    type,
    defId: type,
    col,
    row,
    // Center of the tile in pixels
    x: col * TILE_SIZE + TILE_SIZE / 2,
    y: row * TILE_SIZE + TILE_SIZE / 2,
    level: 0, // index into def.levels[]
    cooldown: 0, // seconds until next shot
    target: null, // currently targeted enemy id
    barrelAngle: -Math.PI / 2, // starts pointing up
  };
}

// ── Per-frame update ─────────────────────────────────────────
/**
 * Updates all towers: find targets, tick cooldowns, fire.
 * New projectiles are pushed into `projectiles`.
 *
 * @param {object[]} towers
 * @param {object[]} enemies
 * @param {object[]} projectiles  - mutable array (projectiles appended here)
 * @param {number}   dt
 */
export function updateTowers(towers, enemies, projectiles, dt) {
  for (const tower of towers) {
    const stats = getTowerStats(tower);

    // Tick cooldown down
    tower.cooldown = Math.max(0, tower.cooldown - dt);

    // Find the enemy closest to the EXIT that is within range
    // (prioritise enemies furthest along the path)
    const target = getTargetEnemy(tower, enemies, stats.range);

    if (target) {
      // ── Smoothly rotate barrel toward target ──────────────
      const desiredAngle = Math.atan2(target.y - tower.y, target.x - tower.x);
      tower.barrelAngle = lerpAngle(
        tower.barrelAngle,
        desiredAngle,
        Math.min(1, dt * 10) // rotation speed (rad/s factor)
      );
      tower.target = target.id;
    } else {
      tower.target = null;
    }

    if (tower.cooldown > 0 || !target) continue;

    // Fire!
    projectiles.push(createProjectile(tower, target, stats));

    // Reset cooldown based on fire rate (shots per second)
    tower.cooldown = 1 / stats.fireRate;
  }
}

// ── Targeting ────────────────────────────────────────────────
function getTargetEnemy(tower, enemies, range) {
  let best = null;
  let bestProgress = -1; // higher waypointIdx + normalized sub-progress = further along

  for (const enemy of enemies) {
    if (enemy.dead || enemy.reachedEnd) continue;

    const dx = enemy.x - tower.x;
    const dy = enemy.y - tower.y;
    const dist = Math.hypot(dx, dy);

    if (dist > range) continue;

    // Use waypointIdx as primary sort; can refine with sub-tile progress
    const progress = enemy.waypointIdx ?? enemy.wpIndex ?? 0;
    if (progress > bestProgress) {
      bestProgress = progress;
      best = enemy;
    }
  }

  return best;
}

// ── Stats helper ─────────────────────────────────────────────
/**
 * Returns the live stat block for a tower's current level.
 */
export function getTowerStats(tower) {
  const type = tower.type || tower.defId;
  const def = TOWER_DEFS[type];
  return def.levels[tower.level];
}

// ── Upgrade ──────────────────────────────────────────────────
/**
 * Returns the cost to upgrade `tower` to next level, or null if max.
 */
export function getUpgradeCost(tower) {
  const type = tower.type || tower.defId;
  const def = TOWER_DEFS[type];
  if (tower.level >= def.levels.length - 1) return null;
  return def.upgradeCost[tower.level];
}

/**
 * Upgrades tower in place. Returns true on success.
 */
export function upgradeTower(tower) {
  const type = tower.type || tower.defId;
  const def = TOWER_DEFS[type];
  if (tower.level >= def.levels.length - 1) return false;
  tower.level++;
  return true;
}

// ── Sell ─────────────────────────────────────────────────────
/**
 * Returns how much money the player gets for selling `tower`.
 */
export function getSellValue(tower, refundPct = 0.6) {
  const type = tower.type || tower.defId;
  const def = TOWER_DEFS[type];
  const baseCost = def.cost;
  const upgradePaid = def.upgradeCost.slice(0, tower.level).reduce((a, b) => a + b, 0);
  return Math.floor((baseCost + upgradePaid) * (refundPct ?? SELL_REFUND_PCT));
}

// ── Angle interpolation ───────────────────────────────────────
/**
 * Shortest-path angle interpolation (handles 0/2π wraparound)
 * @param {number} a - current angle
 * @param {number} b - target angle
 * @param {number} t - interpolation factor (0-1)
 * @returns {number}
 */
function lerpAngle(a, b, t) {
  let diff = b - a;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  return a + diff * t;
}
