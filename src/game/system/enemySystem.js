// ============================================================
//  enemySystem.js
//  Handles:
//   - Creating enemy instances
//   - Moving enemies along WAYPOINTS_PX
//   - Detecting when an enemy reaches the base
//   - Removing dead enemies + granting rewards
//   - Special enemy abilities (healing, shielding)
// ============================================================

import { WAYPOINTS_PX, ENEMY_DEFS } from '../constants';
import { emitDeathBurst, emitRewardText } from './particleSystem';

let _nextEnemyId = 1;

// ── Factory ──────────────────────────────────────────────────
/**
 * Creates a fresh enemy object placed at the first waypoint.
 * @param {string} type  - key in ENEMY_DEFS ('normal' | 'fast' | 'tank' | 'healer' | 'shielded' | 'boss')
 * @param {number} hpScale - optional multiplier for HP (for scaling waves)
 * @param {number} speedScale - optional multiplier for speed (for scaling waves)
 */
export function createEnemy(type, hpScale = 1, speedScale = 1) {
  const def = ENEMY_DEFS[type] || ENEMY_DEFS.normal;
  const start = WAYPOINTS_PX[0];
  const now = Date.now();

  return {
    id:           _nextEnemyId++,
    type:         def.id || type,
    x:            start.x,
    y:            start.y,
    hp:           def.hp * hpScale,
    maxHp:        def.hp * hpScale,
    speed:        def.speed * speedScale,
    baseSpeed:    def.speed * speedScale,  // store original speed for slow recovery
    reward:       def.reward,
    size:         def.size,
    radius:       def.size,
    color:        def.color,
    damage:       def.damage,
    waypointIdx:  1,          // heading toward waypoint index 1 initially
    wpIndex:      1,
    dead:         false,
    reachedEnd:   false,
    label:        def.label,
    spawnTime:    now,        // Track spawn time for entrance animation
    deathTime:    null,       // Track death time for death animation
    
    // Motion trail for fast enemies
    previousPositions: def.speed > 2.5 ? [] : null,
    
    // Special ability properties
    ability:      def.ability || null,
    healAmount:   def.healAmount || 0,
    healRadius:   def.healRadius || 0,
    healInterval: def.healInterval || 0,
    healCooldown: 0,
    shieldThreshold: def.shieldThreshold || 0,
    damageReduction: def.damageReduction || 0,
    isBoss:       def.isBoss || false,
    
    // ── NEW: Phase shift ability (Phase Runner) ─
    phaseDuration: def.phaseDuration || 0,
    phaseCooldown: def.phaseCooldown || 0,
    phaseTimer: 0,
    isPhased: false,
    phaseActiveTimer: 0,
    
    // ── NEW: Teleport ability (Phantom) ─
    teleportInterval: def.teleportInterval || 0,
    teleportDistance: def.teleportDistance || 0,
    teleportTimer: 0,
    
    // ── NEW: Shield ability (Juggernaut) ─
    shieldMax: def.shieldMax || 0,
    shieldCurrent: def.shieldMax || 0,
    shieldRegen: def.shieldRegen || 0,
    shieldRegenDelay: def.shieldRegenDelay || 0,
    shieldRegenTimer: 0,
    lastDamageTime: 0,
    
    // ── NEW: Summon ability (Necromancer) ─
    summonCount: def.summonCount || 0,
    summonInterval: def.summonInterval || 0,
    summonType: def.summonType || null,
    summonTimer: 0,
    summonedCount: 0,
    
    // ── NEW: Spawn on death (Swarm Queen) ─
    spawnOnDeath: def.spawnOnDeath || 0,
    spawnType: def.spawnType || null,
    spawnRadius: def.spawnRadius || 0,
    
    // ── NEW: Invisible ability (Stalker) ─
    invisible: def.invisible || false,
    revealDistance: def.revealDistance || 100,
    
    // ── NEW: Immunity to status effects (Brute) ─
    immuneTo: def.immuneTo || [],
    armor: def.armor || 0,
    
    // Wave scaling regeneration
    regenRate:    0,
    regenCooldown: 0,
    
    // Status effects
    slowed:       false,
    slowAmount:   0,
    slowDuration: 0,
    slowCooldown: 0,
    poisoned:     false,
    poisonDamage: 0,
    poisonStacks: 0,
    poisonDuration: 0,
    poisonCooldown: 0,
  };
}

// ── Movement ─────────────────────────────────────────────────
/**
 * Moves all enemies one step along their path.
 * Returns { moneyEarned, healthLost } from this frame.
 *
 * @param {object[]} enemies  - mutable array
 * @param {number}   dt       - delta time in seconds
 * @param {object[] | null} [particles]
 * @returns {{ moneyEarned: number, healthLost: number }}
 */
export function updateEnemies(enemies, dt, particles = null) {
  let moneyEarned = 0;
  let healthLost  = 0;
  let enemiesKilled = 0;
  let bossesKilled = 0;

  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];

    // ── Process status effects ──
    processStatusEffects(e, dt);

    // ── Process special abilities ──
    processEnemyAbilities(e, enemies, dt);

    // ── Remove dead enemies ──
    if (e.dead) {
      e.deathTime = Date.now(); // Track death time for death animation
      moneyEarned += e.reward;
      enemiesKilled += 1;
      if (e.isBoss) bossesKilled += 1;
      if (particles) {
        emitDeathBurst(particles, e.x, e.y, e.color);
        emitRewardText(particles, e.x, e.y - 20, `+${e.reward}`);
      }
      if (e.spawnOnDeath > 0 && e.spawnType) {
        for (let spawnIndex = 0; spawnIndex < e.spawnOnDeath; spawnIndex++) {
          const child = createEnemy(e.spawnType, 0.4, 1.15);
          child.x = e.x + Math.cos((spawnIndex / Math.max(1, e.spawnOnDeath)) * Math.PI * 2) * (e.spawnRadius || 24);
          child.y = e.y + Math.sin((spawnIndex / Math.max(1, e.spawnOnDeath)) * Math.PI * 2) * (e.spawnRadius || 24);
          enemies.push(child);
        }
      }
      enemies.splice(i, 1);
      continue;
    }

    // ── Remove enemies that reached the base ──
    if (e.reachedEnd) {
      healthLost += e.damage;
      enemies.splice(i, 1);
      continue;
    }

    // ── Move toward current target waypoint ──
    moveEnemyAlongPath(e, dt);
  }

  return { moneyEarned, healthLost, enemiesKilled, bossesKilled };
}

// ── Status Effects ───────────────────────────────────────────
/**
 * Process slow and poison effects on enemy.
 */
function processStatusEffects(enemy, dt) {
  // Handle slow effect - Brute immune to slow
  if (enemy.slowed) {
    if (enemy.immuneTo && enemy.immuneTo.includes('slow')) {
      enemy.slowed = false;
      enemy.speed = enemy.baseSpeed;
    } else {
      enemy.slowCooldown -= dt;
      if (enemy.slowCooldown <= 0) {
        enemy.slowed = false;
        enemy.speed = enemy.baseSpeed;
      }
    }
  }

  // Handle poison effect - Brute immune to poison
  if (enemy.poisoned) {
    if (enemy.immuneTo && enemy.immuneTo.includes('poison')) {
      enemy.poisoned = false;
      enemy.poisonStacks = 0;
    } else {
      enemy.poisonCooldown -= dt;
      if (enemy.poisonCooldown <= 0) {
        // Apply poison damage
        enemy.hp -= enemy.poisonDamage * enemy.poisonStacks;
        enemy.poisonCooldown = 1; // 1 second tick

        // Decrement duration
        enemy.poisonDuration -= dt;
        if (enemy.poisonDuration <= 0 || enemy.hp <= 0) {
          enemy.poisoned = false;
          enemy.poisonStacks = 0;
        }
      }
    }
  }
  
  // Handle Juggernaut shield regeneration
  if (enemy.shieldMax && enemy.shieldMax > 0) {
    enemy.shieldRegenTimer -= dt;
    if (enemy.shieldRegenTimer <= 0 && enemy.shieldCurrent < enemy.shieldMax) {
      enemy.shieldCurrent = Math.min(enemy.shieldMax, enemy.shieldCurrent + enemy.shieldRegen);
      enemy.shieldRegenTimer = 1; // Regen every second
    }
  }
}

// ── Special Abilities ────────────────────────────────────────
/**
 * Process special enemy abilities (healing, etc.)
 */
function processEnemyAbilities(enemy, enemies, dt) {
  // Process regeneration (from wave scaling)
  if (enemy.regenRate && enemy.regenRate > 0) {
    enemy.regenCooldown = (enemy.regenCooldown || 0) - dt;
    if (enemy.regenCooldown <= 0 && enemy.hp < enemy.maxHp) {
      enemy.hp = Math.min(enemy.maxHp, enemy.hp + enemy.regenRate);
      enemy.regenCooldown = 1; // Regenerate every second
    }
  }

  // Heal ability
  if (enemy.ability === 'heal') {
    enemy.healCooldown -= dt;
    if (enemy.healCooldown <= 0) {
      // Find enemies in healing radius
      for (const other of enemies) {
        if (other === enemy || other.dead) continue;
        const dist = Math.hypot(other.x - enemy.x, other.y - enemy.y);
        if (dist <= enemy.healRadius && other.hp < other.maxHp) {
          other.hp = Math.min(other.maxHp, other.hp + enemy.healAmount);
        }
      }
      enemy.healCooldown = enemy.healInterval;
    }
  }
  
  // Heal aura ability (Combat Medic)
  if (enemy.ability === 'heal_aura') {
    enemy.healCooldown -= dt;
    if (enemy.healCooldown <= 0) {
      for (const other of enemies) {
        if (other === enemy || other.dead) continue;
        const dist = Math.hypot(other.x - enemy.x, other.y - enemy.y);
        if (dist <= enemy.healRadius && other.hp < other.maxHp) {
          other.hp = Math.min(other.maxHp, other.hp + enemy.healRate);
        }
      }
      enemy.healCooldown = enemy.healInterval || 1.0;
    }
  }
  
  // Phase shift ability
  if (enemy.ability === 'phase_shift') {
    if (enemy.isPhased) {
      enemy.phaseActiveTimer = (enemy.phaseActiveTimer || 0) - dt;
      if (enemy.phaseActiveTimer <= 0) {
        enemy.isPhased = false;
        enemy.phaseActiveTimer = 0;
        enemy.phaseTimer = 0;
      }
    } else {
      enemy.phaseTimer = (enemy.phaseTimer || 0) + dt;
      if (enemy.phaseTimer >= enemy.phaseCooldown) {
        enemy.isPhased = true;
        enemy.phaseActiveTimer = enemy.phaseDuration || 1.5;
        enemy.phaseTimer = 0;
      }
    }
  }
  
  // Teleport ability
  if (enemy.ability === 'teleport') {
    enemy.teleportTimer = (enemy.teleportTimer || 0) + dt;
    if (enemy.teleportTimer >= enemy.teleportInterval) {
      enemy.teleportTimer = 0;
      // Teleport forward on path
      const pathProgress = enemy.wpIndex / WAYPOINTS_PX.length;
      const newProgress = Math.min(0.99, pathProgress + enemy.teleportDistance);
      const newIndex = Math.floor(newProgress * (WAYPOINTS_PX.length - 1)) + 1;
      if (newIndex < WAYPOINTS_PX.length) {
        enemy.wpIndex = newIndex;
        enemy.waypointIdx = newIndex;
        const waypoint = WAYPOINTS_PX[newIndex];
        if (waypoint) {
          enemy.x = waypoint.x;
          enemy.y = waypoint.y;
        }
      }
    }
  }
  
  // Summon ability (Necromancer)
  if (enemy.ability === 'summon') {
    enemy.summonTimer = (enemy.summonTimer || 0) + dt;
    if (enemy.summonTimer >= enemy.summonInterval && enemy.summonedCount < enemy.summonCount) {
      enemy.summonTimer = 0;
      enemy.summonedCount++;
      const minionType = enemy.summonType || 'normal';
      const minion = createEnemy(minionType, 0.5, 1.2);
      minion.x = enemy.x;
      minion.y = enemy.y;
      enemies.push(minion);
    }
  }
}

// ── Internal helpers ─────────────────────────────────────────
function moveEnemyAlongPath(enemy, dt) {
  const waypointIdx = enemy.waypointIdx ?? enemy.wpIndex ?? 0;
  if (waypointIdx >= WAYPOINTS_PX.length) {
    enemy.reachedEnd = true;
    return;
  }

  const target = WAYPOINTS_PX[waypointIdx];
  const dx = target.x - enemy.x;
  const dy = target.y - enemy.y;
  const dist = Math.hypot(dx, dy);
  const step = enemy.speed * dt;

  if (dist <= step) {
    // Snap to waypoint and advance
    enemy.x = target.x;
    enemy.y = target.y;
    enemy.waypointIdx = waypointIdx + 1;
    enemy.wpIndex = waypointIdx + 1;

    // Check if this was the last waypoint
    if (enemy.waypointIdx >= WAYPOINTS_PX.length) {
      enemy.reachedEnd = true;
    }
  } else {
    // Move proportionally
    enemy.x += (dx / dist) * step;
    enemy.y += (dy / dist) * step;
  }
  
  // Track motion trail for fast enemies
  if (enemy.previousPositions) {
    enemy.previousPositions.push({ x: enemy.x, y: enemy.y });
    // Keep only last 5 positions
    if (enemy.previousPositions.length > 5) {
      enemy.previousPositions.shift();
    }
  }
}

// ── Damage & Effects ─────────────────────────────────────────
/**
 * Apply damage to a single enemy.
 * Marks it dead if hp drops to 0.
 * Handles shielded enemies, phase shift, armor, and status immunities.
 */
export function damageEnemy(enemy, amount) {
  // ── Phase shift check - invulnerable when phased ─
  if (enemy.isPhased) {
    return; // No damage taken while phased
  }
  
  // ── Check for shield ability (Juggernaut) ─
  if (enemy.shieldMax && enemy.shieldMax > 0) {
    // Track last damage time for shield regen
    enemy.lastDamageTime = Date.now();
    enemy.shieldRegenTimer = enemy.shieldRegenDelay || 3;
    
    // Shield absorbs damage first
    if (enemy.shieldCurrent > 0) {
      const damageToShield = Math.min(enemy.shieldCurrent, amount);
      enemy.shieldCurrent -= damageToShield;
      amount -= damageToShield;
      
      if (amount <= 0) {
        enemy.lastHitTime = Date.now();
        return; // All damage absorbed by shield
      }
    }
  }
  
  // ── Check for shield ability (standard) ─
  if (enemy.ability === 'shield' && enemy.shieldThreshold > 0) {
    const hpPercent = enemy.hp / enemy.maxHp;
    if (hpPercent <= enemy.shieldThreshold) {
      amount *= (1 - enemy.damageReduction);
    }
  }
  
  // ── Brute armor - reduces all incoming damage ─
  if (enemy.armor && enemy.armor > 0) {
    amount *= (1 - enemy.armor);
  }
  
  enemy.hp = Math.max(0, enemy.hp - amount);
  
  // Track last hit time for damage flash effect
  enemy.lastHitTime = Date.now();
  
  if (enemy.hp <= 0) {
    enemy.dead = true;
  }
}

/**
 * Apply slow effect to enemy.
 * Brute enemies are immune to slow.
 * @param {object} enemy - target enemy
 * @param {number} amount - slow amount (0-1, where 0.4 = 40% slow)
 * @param {number} duration - duration in seconds
 */
export function slowEnemy(enemy, amount, duration) {
  // Check immunity
  if (enemy.immuneTo && enemy.immuneTo.includes('slow')) {
    return;
  }
  if (enemy.slowed && amount <= enemy.slowAmount) {
    // Don't override with weaker slow
    return;
  }
  enemy.slowed = true;
  enemy.slowAmount = amount;
  enemy.slowDuration = duration;
  enemy.slowCooldown = duration;
  enemy.speed = enemy.baseSpeed * (1 - amount);
}

/**
 * Apply poison effect to enemy.
 * Brute enemies are immune to poison.
 * @param {object} enemy - target enemy
 * @param {number} damage - damage per tick
 * @param {number} duration - duration in seconds
 * @param {number} maxStacks - maximum stacks (default 3)
 */
export function poisonEnemy(enemy, damage, duration, maxStacks = 3) {
  // Check immunity
  if (enemy.immuneTo && enemy.immuneTo.includes('poison')) {
    return;
  }
  if (enemy.poisoned && enemy.poisonStacks >= maxStacks) {
    // Refresh duration instead of adding stacks
    enemy.poisonDuration = duration;
    enemy.poisonCooldown = 1;
    return;
  }
  
  enemy.poisoned = true;
  enemy.poisonDamage = damage;
  enemy.poisonStacks = Math.min(enemy.poisonStacks + 1, maxStacks);
  enemy.poisonDuration = duration;
  enemy.poisonCooldown = 1; // Apply immediately
}

/**
 * Returns enemies within `radius` pixels of point (x, y).
 * Used by splash projectiles.
 */
export function getEnemiesInRadius(enemies, x, y, radius) {
  return enemies.filter(e => {
    if (e.dead || e.reachedEnd) return false;
    const dx = e.x - x;
    const dy = e.y - y;
    return Math.hypot(dx, dy) <= radius;
  });
}

/**
 * Get all enemies within range of a point (for healing calculation)
 */
export function getEnemiesInRange(enemies, x, y, radius) {
  return enemies.filter(e => {
    if (e.dead || e.reachedEnd) return false;
    const dx = e.x - x;
    const dy = e.y - y;
    return Math.hypot(dx, dy) <= radius;
  });
}
