// ============================================================
//  projectileSystem.js
//  Handles:
//   - Creating projectile instances
//   - Moving projectiles toward their target each frame
//   - Collision detection (simple distance check)
//   - Applying damage (single-target, splash, slow, poison)
// ============================================================

import { damageEnemy, getEnemiesInRadius, slowEnemy, poisonEnemy } from './enemySystem';
import { TOWER_DEFS } from '../constants';
import { emitProjectileTrail } from './particleSystem';

let _nextProjectileId = 1;

// ── Factory ──────────────────────────────────────────────────
/**
 * @param {object} tower   - the firing tower
 * @param {object} target  - the targeted enemy
 * @param {object} stats   - current level stats { damage, splash, bulletSpeed, ... }
 */
export function createProjectile(tower, target, stats) {
  const def = TOWER_DEFS[tower.type];
  return {
    id:          _nextProjectileId++,
    x:           tower.x,
    y:           tower.y,
    targetId:    target.id,
    damage:      stats.damage,
    speed:       stats.bulletSpeed,
    splash:      stats.splash || 0,       // 0 = no splash, >0 = AOE radius
    splashRadius: stats.splashRadius || 0,
    color:       def.bulletColor,
    towerType:   tower.type,               // Store for element effects
    hit:         false,                    // marked true when it lands
    
    // Special effects
    slowAmount:   stats.slowAmount || 0,
    slowDuration: stats.slowDuration || 0,
    poisonDamage: stats.poisonDamage || 0,
    poisonDuration: stats.poisonDuration || 0,
    
    // Snapshot of target position (updated each frame for homing)
    tx:          target.x,
    ty:          target.y,
  };
}

// ── Per-frame update ─────────────────────────────────────────
/**
 * Moves projectiles and resolves hits.
 * Modifies `projectiles` and `enemies` in place.
 *
 * @param {object[]} projectiles  - mutable array
 * @param {object[]} enemies      - mutable array (for damage + AOE)
 * @param {number}   dt
 * @param {object[] | null} [particles]
 */
export function updateProjectiles(projectiles, enemies, dt, particles = null) {
  // Build a quick id→enemy lookup for O(1) target finding
  const enemyMap = new Map(enemies.map(e => [e.id, e]));
  let damageDealt = 0;

  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];

    // Remove already-hit or orphaned bullets
    if (p.hit) {
      projectiles.splice(i, 1);
      continue;
    }

    // Update target position (homing) if target still alive
    const target = enemyMap.get(p.targetId);
    if (target && !target.dead && !target.reachedEnd) {
      p.tx = target.x;
      p.ty = target.y;
    }

    // Move toward current target position
    const dx   = p.tx - p.x;
    const dy   = p.ty - p.y;
    const dist = Math.hypot(dx, dy);
    const step = p.speed * dt;

    if (dist <= step + 4) {
      // ── Hit! ──
      p.hit = true;

      if (p.splash > 0) {
        // AOE: damage all enemies in radius around impact point
        const inRadius = getEnemiesInRadius(enemies, p.tx, p.ty, p.splash);
        for (const e of inRadius) {
          damageDealt += applyProjectileEffects(e, p);
        }
      } else {
        // Single-target: damage the original target if still alive
        if (target && !target.dead) {
          damageDealt += applyProjectileEffects(target, p);
        }
      }

      if (particles) {
        // Tiny impact spark keeps the combat readable even when the projectile is removed immediately.
        particles.push({
          id: Date.now() + i,
          type: 'spark',
          x: p.tx,
          y: p.ty,
          vx: 0,
          vy: 0,
          life: 1,
          maxLife: 0.12,
          size: p.splash > 0 ? 4 : 3,
          color: p.color,
          gravity: 0,
        });
      }

      projectiles.splice(i, 1);
    } else {
      // Still in flight
      p.x += (dx / dist) * step;
      p.y += (dy / dist) * step;
      
      // Emit element-specific trail particles
      if (particles && p.towerType) {
        emitProjectileTrail(particles, p.x, p.y, p.towerType, dt);
      }
    }
  }

  return { damageDealt };
}

/**
 * Apply projectile damage and special effects to an enemy.
 */
function applyProjectileEffects(enemy, projectile) {
  // Apply damage
  damageEnemy(enemy, projectile.damage);
  
  // Apply slow effect
  if (projectile.slowAmount > 0 && projectile.slowDuration > 0) {
    slowEnemy(enemy, projectile.slowAmount, projectile.slowDuration);
  }
  
  // Apply poison effect
  if (projectile.poisonDamage > 0 && projectile.poisonDuration > 0) {
    poisonEnemy(enemy, projectile.poisonDamage, projectile.poisonDuration);
  }

  return projectile.damage;
}

/**
 * Remove a projectile without hitting (e.g., target died before impact)
 */
export function removeProjectile(projectiles, projectileId) {
  const index = projectiles.findIndex(p => p.id === projectileId);
  if (index !== -1) {
    projectiles.splice(index, 1);
  }
}
