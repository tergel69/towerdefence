// ============================================================
//  terrainSystem.js
//  Dynamic terrain tiles that overlay grass and affect enemies.
//  Terrain can be placed by mid-wave events, commander abilities,
//  or as part of wave design.
// ============================================================

import { TILE_SIZE } from '../constants';

// ── Terrain tile definitions ─────────────────────────────────

/**
 * Each terrain type defines:
 *  - name, icon: UI display
 *  - effects: gameplay modifiers applied to enemies on this tile
 *  - visual: rendering properties (overlay color, glow, particles)
 */
export const TERRAIN_DEFS = {
  mud: {
    name: 'Mud',
    icon: '\uD83C\uDF3E', // 🌾
    effects: {
      enemySpeedMultiplier: 0.8, // -20% speed
      damagePerSecond: 0,
      stunChance: 0,
      pushForce: 0,
    },
    visual: {
      color: 'rgba(120, 80, 40, 0.35)',
      glowColor: 'rgba(100, 60, 20, 0.5)',
      particleColor: '#8B6914',
      icon: '\uD83C\uDF3E',
    },
  },

  crystal: {
    name: 'Crystal',
    icon: '\uD83D\uDC8E', // 💎
    effects: {
      enemySpeedMultiplier: 1.0, // no speed change
      damagePerSecond: 5,
      stunChance: 0,
      pushForce: 0,
    },
    visual: {
      color: 'rgba(168, 85, 247, 0.25)',
      glowColor: 'rgba(147, 51, 234, 0.6)',
      particleColor: '#a855f7',
      icon: '\uD83D\uDC8E',
    },
  },

  lava: {
    name: 'Lava',
    icon: '\uD83D\uDD25', // 🔥
    effects: {
      enemySpeedMultiplier: 0.9, // -10% speed
      damagePerSecond: 15,
      stunChance: 0,
      pushForce: 0,
    },
    visual: {
      color: 'rgba(239, 68, 68, 0.3)',
      glowColor: 'rgba(249, 115, 22, 0.7)',
      particleColor: '#ef4444',
      icon: '\uD83D\uDD25',
    },
  },

  wind: {
    name: 'Wind',
    icon: '\uD83C\uDF2C\uFE0F', // 🌬️
    effects: {
      enemySpeedMultiplier: 1.0, // no speed change
      damagePerSecond: 0,
      stunChance: 0.02, // 2% chance per frame to stun briefly
      pushForce: 30, // push force in pixels/sec
    },
    visual: {
      color: 'rgba(156, 163, 175, 0.2)',
      glowColor: 'rgba(107, 114, 128, 0.4)',
      particleColor: '#9ca3af',
      icon: '\uD83C\uDF2C\uFE0F',
    },
  },

  ice_patch: {
    name: 'Ice Patch',
    icon: '\u2744\uFE0F', // ❄️
    effects: {
      enemySpeedMultiplier: 0.6, // -40% speed
      damagePerSecond: 0,
      stunChance: 0,
      pushForce: 0,
      iceTowerSlowBonus: 0.25, // +25% slow synergy with ice towers
    },
    visual: {
      color: 'rgba(147, 197, 253, 0.3)',
      glowColor: 'rgba(96, 165, 250, 0.5)',
      particleColor: '#93c5fd',
      icon: '\u2744\uFE0F',
    },
  },
};

/**
 * List of all terrain type keys.
 */
export const TERRAIN_TYPES = Object.keys(TERRAIN_DEFS);

// ── State management ─────────────────────────────────────────

/**
 * Create initial terrain state.
 * @returns {{ tiles: Array, activeTerrainTiles: Array }}
 */
export function createTerrainState() {
  return {
    tiles: [], // Array of terrain tile objects
    activeTerrainTiles: [], // Cache of tiles currently affecting enemies (for perf)
  };
}

/**
 * Place a terrain tile at the given grid position.
 * Removes any existing terrain at that position first.
 *
 * @param {object} terrainState - { tiles, activeTerrainTiles }
 * @param {string} type - terrain type key (e.g. 'mud', 'crystal')
 * @param {number} col - grid column
 * @param {number} row - grid row
 * @returns {object|null} - the placed terrain tile, or null if invalid
 */
export function placeTerrain(terrainState, type, col, row) {
  // Validate terrain type
  if (!TERRAIN_DEFS[type]) {
    return null;
  }

  // Remove any existing terrain at this position
  removeTerrain(terrainState, col, row);

  const tile = {
    id: Date.now() + Math.random(),
    type,
    col,
    row,
    x: col * TILE_SIZE + TILE_SIZE / 2, // center pixel x
    y: row * TILE_SIZE + TILE_SIZE / 2, // center pixel y
    effects: { ...TERRAIN_DEFS[type].effects },
    visual: { ...TERRAIN_DEFS[type].visual },
    placedAt: performance.now() / 1000,
  };

  terrainState.tiles.push(tile);
  return tile;
}

/**
 * Remove a terrain tile at the given grid position.
 *
 * @param {object} terrainState - { tiles, activeTerrainTiles }
 * @param {number} col - grid column
 * @param {number} row - grid row
 * @returns {object|null} - the removed terrain tile, or null if none found
 */
export function removeTerrain(terrainState, col, row) {
  const idx = terrainState.tiles.findIndex((t) => t.col === col && t.row === row);
  if (idx === -1) return null;

  const removed = terrainState.tiles.splice(idx, 1)[0];
  // Also remove from active cache if present
  const activeIdx = terrainState.activeTerrainTiles.indexOf(removed);
  if (activeIdx !== -1) {
    terrainState.activeTerrainTiles.splice(activeIdx, 1);
  }
  return removed;
}

/**
 * Get the terrain tile at a given grid position.
 *
 * @param {object} terrainState - { tiles, activeTerrainTiles }
 * @param {number} col - grid column
 * @param {number} row - grid row
 * @returns {object|null} - terrain tile or null
 */
export function getTerrainAt(terrainState, col, row) {
  return terrainState.tiles.find((t) => t.col === col && t.row === row) || null;
}

// ── Effect application ───────────────────────────────────────

/**
 * Apply terrain effects to all enemies each frame.
 * Checks which enemies are currently on terrain tiles and applies
 * speed modifiers, damage, stun, and push effects.
 *
 * @param {object} terrainState - { tiles, activeTerrainTiles }
 * @param {Array} enemies - array of enemy objects
 * @param {number} dt - delta time in seconds
 * @param {Array} particles - particle array for emitting effects
 */
export function applyTerrainEffects(terrainState, enemies, dt, particles) {
  const { tiles } = terrainState;

  // Clear active cache each frame (rebuild below)
  terrainState.activeTerrainTiles = [];

  if (tiles.length === 0 || enemies.length === 0) return;

  const halfTile = TILE_SIZE / 2; // 24 - radius for overlap check

  for (const enemy of enemies) {
    if (enemy.hp <= 0) continue;

    // Skip frozen enemies (they're already immobilized)
    const now = performance.now() / 1000;
    if (enemy._frozenUntil && now < enemy._frozenUntil) continue;
    if (enemy.stunned) continue;

    for (const tile of tiles) {
      // Distance check: enemy center vs terrain tile center
      const dx = enemy.x - tile.x;
      const dy = enemy.y - tile.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Enemy is "on" the terrain tile if within half tile size
      if (dist > halfTile) continue;

      // Mark tile as active (has at least one enemy on it)
      if (!terrainState.activeTerrainTiles.includes(tile)) {
        terrainState.activeTerrainTiles.push(tile);
      }

      const def = TERRAIN_DEFS[tile.type];
      const effects = tile.effects;

      // Apply speed multiplier
      if (effects.enemySpeedMultiplier !== 1.0) {
        // Stack multiplicatively with existing speed modifiers
        const currentSpeedMult = enemy._terrainSpeedMultiplier || 1.0;
        enemy._terrainSpeedMultiplier = currentSpeedMult * effects.enemySpeedMultiplier;
      }

      // Apply damage over time
      if (effects.damagePerSecond > 0) {
        const damage = effects.damagePerSecond * dt;
        enemy.hp -= damage;
        enemy._lastDamageSource = enemy._lastDamageSource || 'terrain';

        // Emit damage particles occasionally
        if (particles && Math.random() < 0.3) {
          particles.push({
            id: Date.now() + Math.random(),
            type: 'spark',
            x: enemy.x + (Math.random() - 0.5) * 12,
            y: enemy.y + (Math.random() - 0.5) * 12,
            vx: (Math.random() - 0.5) * 20,
            vy: -20 - Math.random() * 30,
            life: 1.0,
            maxLife: 0.2 + Math.random() * 0.15,
            size: 1.5 + Math.random() * 2,
            color: def.visual.particleColor,
            gravity: -40,
          });
        }
      }

      // Apply stun chance (wind terrain)
      if (effects.stunChance > 0 && Math.random() < effects.stunChance && !enemy.stunned) {
        enemy.stunned = true;
        enemy.stunCooldown = 0.3; // brief 0.3s stun
      }

      // Apply push force (wind terrain)
      if (effects.pushForce > 0) {
        // Push perpendicular to enemy movement direction (or random if stationary)
        const pushAngle =
          enemy.vx !== 0 || enemy.vy !== 0
            ? Math.atan2(enemy.vy, enemy.vx) + Math.PI / 2
            : Math.random() * Math.PI * 2;

        // Alternate push direction randomly
        const direction = Math.random() > 0.5 ? 1 : -1;
        const pushX = Math.cos(pushAngle) * effects.pushForce * dt * direction;
        const pushY = Math.sin(pushAngle) * effects.pushForce * dt * direction;

        enemy.x += pushX;
        enemy.y += pushY;

        // Emit wind swirl particles
        if (particles && Math.random() < 0.2) {
          particles.push({
            id: Date.now() + Math.random(),
            type: 'sparkle',
            x: enemy.x + (Math.random() - 0.5) * 16,
            y: enemy.y + (Math.random() - 0.5) * 16,
            vx: pushX * 30,
            vy: pushY * 30,
            life: 1.0,
            maxLife: 0.3 + Math.random() * 0.2,
            size: 1.5 + Math.random() * 1.5,
            color: def.visual.particleColor,
            gravity: 0,
          });
        }
      }
    }
  }
}

/**
 * Get the combined terrain speed multiplier for an enemy.
 * Call this after applyTerrainEffects to read the accumulated effect.
 * Resets the internal tracker after reading.
 *
 * @param {object} enemy - enemy object
 * @returns {number} - combined speed multiplier (1.0 = no change)
 */
export function getTerrainSpeedMultiplier(enemy) {
  const mult = enemy._terrainSpeedMultiplier || 1.0;
  // Reset for next frame
  delete enemy._terrainSpeedMultiplier;
  return mult;
}

/**
 * Get the ice tower slow bonus from terrain (synergy with ice_patch).
 *
 * @param {object} terrainState
 * @param {object} enemy
 * @returns {number} - bonus slow multiplier (0.25 = +25% slow)
 */
export function getIceTerrainSlowBonus(terrainState, enemy) {
  let bonus = 0;

  for (const tile of terrainState.tiles) {
    if (tile.effects.iceTowerSlowBonus > 0) {
      const dx = enemy.x - tile.x;
      const dy = enemy.y - tile.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= TILE_SIZE / 2) {
        bonus += tile.effects.iceTowerSlowBonus;
      }
    }
  }

  return bonus;
}

// ── Rendering ────────────────────────────────────────────────

/**
 * Render terrain overlay tiles on the canvas.
 * Draws semi-transparent colored overlays with icon indicators.
 * Call this from canvasRenderer after drawing the base grid.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} terrainState - { tiles, activeTerrainTiles }
 */
export function renderTerrainOverlay(ctx, terrainState) {
  const { tiles } = terrainState;

  if (tiles.length === 0) return;

  for (const tile of tiles) {
    const visual = tile.visual;
    const x = tile.col * TILE_SIZE;
    const y = tile.row * TILE_SIZE;

    // Check if tile is currently active (has enemies on it) for glow effect
    const isActive = terrainState.activeTerrainTiles.includes(tile);

    // Draw base color overlay
    ctx.fillStyle = visual.color;
    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

    // Draw glow effect when active
    if (isActive && visual.glowColor) {
      ctx.save();
      ctx.shadowBlur = 12;
      ctx.shadowColor = visual.glowColor;
      ctx.fillStyle = visual.glowColor;
      ctx.globalAlpha = 0.3;
      ctx.fillRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
      ctx.restore();
    }

    // Draw icon centered on the tile
    ctx.save();
    ctx.globalAlpha = 0.7;
    ctx.font = `${TILE_SIZE * 0.45}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(visual.icon, tile.x, tile.y);
    ctx.restore();
  }

  // Reset context state
  ctx.globalAlpha = 1;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
}
