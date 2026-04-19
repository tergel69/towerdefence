// ============================================================
//  batchedRendering.js
//  Groups draw calls by type to minimize canvas state changes.
//  Instead of: draw enemy1, draw tower1, draw enemy2, draw tower2...
//  We do: draw ALL enemies, then ALL towers, then ALL projectiles.
//  This reduces fillStyle/shadowBlur state changes significantly.
// ============================================================

import { TILE_SIZE, TOWER_DEFS } from '../constants';

// ── Enemy Batch Renderer ─────────────────────────────────────

/**
 * Sort enemies by type for batched rendering.
 * Groups enemies by color/type to minimize fillStyle changes.
 *
 * @param {Array} enemies
 * @returns {Map<string, Array>} color -> enemies map
 */
export function batchEnemiesByColor(enemies) {
  const batches = new Map();

  for (const enemy of enemies) {
    if (enemy.dead || enemy.reachedEnd) continue;

    const color = enemy.color || '#ff0000';
    if (!batches.has(color)) {
      batches.set(color, []);
    }
    batches.get(color).push(enemy);
  }

  return batches;
}

/**
 * Render all enemies in batched mode.
 * One fillStyle + shadow setup per unique color instead of per enemy.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array} enemies
 * @param {object} options - { colorblindMode, reducedMotion, highContrast }
 */
export function renderEnemiesBatched(ctx, enemies, options = {}) {
  const { reducedMotion = false } = options;
  const batches = batchEnemiesByColor(enemies);

  for (const [color, enemyBatch] of batches) {
    // Set color state ONCE for this batch
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 6;

    for (const enemy of enemyBatch) {
      const size = enemy.size || 8;
      ctx.fillRect(enemy.x - size / 2, enemy.y - size / 2, size, size);
    }

    // Reset shadow
    ctx.shadowBlur = 0;
  }

  // Now draw enemy-specific details (HP bars, boss crowns, etc.)
  // These need per-enemy state changes but are lightweight
  for (const enemy of enemies) {
    if (enemy.dead || enemy.reachedEnd) continue;

    // HP bar
    if (enemy.hp < enemy.maxHp) {
      const barW = enemy.size * 1.5;
      const barH = 3;
      const barX = enemy.x - barW / 2;
      const barY = enemy.y - enemy.size / 2 - 6;
      const hpPct = Math.max(0, enemy.hp / enemy.maxHp);

      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(barX, barY, barW, barH);
      ctx.fillStyle = hpPct > 0.5 ? '#4ade80' : hpPct > 0.25 ? '#fbbf24' : '#ef4444';
      ctx.fillRect(barX, barY, barW * hpPct, barH);
    }

    // Boss crown
    if (enemy.isBoss && !reducedMotion) {
      ctx.fillStyle = '#fbbf24';
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 8;
      const crownSize = 6;
      ctx.beginPath();
      ctx.moveTo(enemy.x - crownSize, enemy.y - enemy.size / 2 - 4);
      ctx.lineTo(enemy.x - crownSize / 2, enemy.y - enemy.size / 2 - 10);
      ctx.lineTo(enemy.x, enemy.y - enemy.size / 2 - 4);
      ctx.lineTo(enemy.x + crownSize / 2, enemy.y - enemy.size / 2 - 10);
      ctx.lineTo(enemy.x + crownSize, enemy.y - enemy.size / 2 - 4);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }
}

// ── Tower Batch Renderer ─────────────────────────────────────

/**
 * Batch towers by type for efficient rendering.
 *
 * @param {Array} towers
 * @returns {Map<string, Array>} type -> towers map
 */
export function batchTowersByType(towers) {
  const batches = new Map();

  for (const tower of towers) {
    const type = tower.type || tower.defId || 'unknown';
    if (!batches.has(type)) {
      batches.set(type, []);
    }
    batches.get(type).push(tower);
  }

  return batches;
}

/**
 * Render all towers in batched mode.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array} towers
 * @param {object} options - { ui, reducedMotion, animSettings, colorblindMode }
 */
export function renderTowersBatched(ctx, towers, options = {}) {
  const { ui = {} } = options;
  const batches = batchTowersByType(towers);
  const hoveredTowerId = ui.hoveredTowerId;
  const selectedTowerId = ui.selectedTower?.id;

  for (const [type, towerBatch] of batches) {
    const def = TOWER_DEFS[type];
    if (!def) continue;

    const baseColor = def.color || '#888';
    const accentColor = def.accentColor || baseColor;

    // Draw tower bodies (batched)
    ctx.fillStyle = baseColor;
    ctx.shadowColor = baseColor;
    ctx.shadowBlur = 4;

    for (const tower of towerBatch) {
      const size = TILE_SIZE - 4;
      ctx.fillRect(tower.x - size / 2, tower.y - size / 2, size, size);
    }

    ctx.shadowBlur = 0;

    // Draw barrel/aim direction (per-tower state)
    for (const tower of towerBatch) {
      if (tower.barrelAngle !== undefined) {
        const barrelLen = TILE_SIZE * 0.35;
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(tower.x, tower.y);
        ctx.lineTo(
          tower.x + Math.cos(tower.barrelAngle) * barrelLen,
          tower.y + Math.sin(tower.barrelAngle) * barrelLen
        );
        ctx.stroke();
      }

      // Muzzle flash
      if (tower.muzzleFlash > 0) {
        ctx.globalAlpha = tower.muzzleFlash;
        ctx.fillStyle = '#fff';
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(tower.x, tower.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }

      // Level indicator
      if (tower.level > 0) {
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${tower.level + 1}`, tower.x, tower.y + TILE_SIZE / 2 - 2);
      }
    }

    // Hover/selected highlight
    for (const tower of towerBatch) {
      if (tower.id === hoveredTowerId || tower.id === selectedTowerId) {
        ctx.strokeStyle = tower.id === selectedTowerId ? '#fbbf24' : '#60a5fa';
        ctx.lineWidth = 2;
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 8;
        ctx.strokeRect(
          tower.x - TILE_SIZE / 2 + 1,
          tower.y - TILE_SIZE / 2 + 1,
          TILE_SIZE - 2,
          TILE_SIZE - 2
        );
        ctx.shadowBlur = 0;
      }
    }
  }
}

// ── Projectile Batch Renderer ────────────────────────────────

/**
 * Render all projectiles in batched mode (grouped by color).
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array} projectiles
 * @param {object} options - { colorblindMode }
 */
export function renderProjectilesBatched(ctx, projectiles, options = {}) {
  const batches = batchEnemiesByColor(projectiles);

  for (const [color, projBatch] of batches) {
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 6;

    for (const proj of projBatch) {
      const radius = proj.radius || 3;
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.shadowBlur = 0;
  }
}

// ── Master Batched Render Helper ─────────────────────────────

/**
 * Create all batch data structures for a frame.
 * Call once per frame, then use the batches in render calls.
 *
 * @param {object} state - { enemies, towers, projectiles }
 * @returns {object} batched data for rendering
 */
export function createBatches(state) {
  return {
    enemyBatches: batchEnemiesByColor(state.enemies),
    towerBatches: batchTowersByType(state.towers),
  };
}
