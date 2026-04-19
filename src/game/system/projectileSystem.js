// ============================================================
//  projectileSystem.js
//  Handles:
//   - Creating projectile instances
//   - Moving projectiles toward their target each frame
//   - Collision detection (simple distance check)
//   - Applying damage (single-target, splash, slow, poison)
//   - Object pooling for performance
// ============================================================

import { damageEnemy, getEnemiesInRadius, slowEnemy, poisonEnemy, stunEnemy } from './enemySystem';
import { TOWER_DEFS } from '../constants';
import { emitProjectileTrail, emitDamageNumber } from './particleSystem';

let _nextProjectileId = 1;

// ── Object Pool ──────────────────────────────────────────────
// Reuse projectile objects to reduce garbage collection pressure
const _projectilePool = {
  pool: [],
  maxPoolSize: 500,

  acquire() {
    if (this.pool.length > 0) {
      return this.pool.pop();
    }
    return this._createNew();
  },

  release(projectile) {
    if (this.pool.length < this.maxPoolSize) {
      this._reset(projectile);
      this.pool.push(projectile);
    }
  },

  _createNew() {
    return {
      id: 0,
      x: 0,
      y: 0,
      targetId: 0,
      damage: 0,
      speed: 0,
      splash: 0,
      splashRadius: 0,
      color: '#fff',
      towerType: null,
      hit: false,
      slowAmount: 0,
      slowDuration: 0,
      poisonDamage: 0,
      poisonDuration: 0,
      tx: 0,
      ty: 0,
      active: false,
    };
  },

  _reset(p) {
    p.id = 0;
    p.x = 0;
    p.y = 0;
    p.targetId = 0;
    p.damage = 0;
    p.speed = 0;
    p.splash = 0;
    p.splashRadius = 0;
    p.color = '#fff';
    p.towerType = null;
    p.hit = false;
    p.slowAmount = 0;
    p.slowDuration = 0;
    p.poisonDamage = 0;
    p.poisonDuration = 0;
    p.tx = 0;
    p.ty = 0;
    p.active = false;
  },

  getStats() {
    return { pooled: this.pool.length, maxSize: this.maxPoolSize };
  },
};

// ── Factory ──────────────────────────────────────────────────
/**
 * @param {object} tower   - the firing tower
 * @param {object} target  - the targeted enemy
 * @param {object} stats   - current level stats { damage, splash, bulletSpeed, ... }
 */
export function createProjectile(tower, target, stats) {
  const def = TOWER_DEFS[tower.type];
  const projectile = _projectilePool.acquire();

  projectile.id = _nextProjectileId++;
  projectile.x = tower.x;
  projectile.y = tower.y;
  projectile.targetId = target.id;
  projectile.damage = stats.damage;
  projectile.speed = stats.bulletSpeed;
  projectile.splash = stats.splash || 0;
  projectile.splashRadius = stats.splashRadius || 0;
  projectile.color = def.bulletColor;
  projectile.towerType = tower.type;
  projectile.hit = false;
  projectile.slowAmount = stats.slowAmount || 0;
  projectile.slowDuration = stats.slowDuration || 0;
  projectile.poisonDamage = stats.poisonDamage || 0;
  projectile.poisonDuration = stats.poisonDuration || 0;
  projectile.stunDuration = stats.stunDuration || 0;
  projectile.tx = target.x;
  projectile.ty = target.y;
  projectile.active = true;

  return projectile;
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
  const enemyMap = new Map(enemies.map((e) => [e.id, e]));
  let damageDealt = 0;

  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];

    if (p.hit) {
      projectiles.splice(i, 1);
      _projectilePool.release(p);
      continue;
    }

    const target = enemyMap.get(p.targetId);
    if (target && !target.dead && !target.reachedEnd) {
      p.tx = target.x;
      p.ty = target.y;
    }

    const dx = p.tx - p.x;
    const dy = p.ty - p.y;
    const dist = Math.hypot(dx, dy);
    const step = p.speed * dt;

    if (dist <= step + 4) {
      p.hit = true;

      if (p.splash > 0) {
        const inRadius = getEnemiesInRadius(enemies, p.tx, p.ty, p.splash);
        for (const e of inRadius) {
          damageDealt += applyProjectileEffects(e, p, particles);
        }
      } else {
        if (target && !target.dead) {
          damageDealt += applyProjectileEffects(target, p, particles);
        }
      }

      if (particles) {
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
      _projectilePool.release(p);
    } else {
      p.x += (dx / dist) * step;
      p.y += (dy / dist) * step;

      if (particles && p.towerType) {
        emitProjectileTrail(particles, p.x, p.y, p.towerType, dt);
      }
    }
  }

  return { damageDealt };
}

function applyProjectileEffects(enemy, projectile, particles = null) {
  // Apply critical strike damage
  let finalDamage = projectile.damage;
  if (projectile.isCrit && projectile.critMultiplier) {
    finalDamage = Math.floor(projectile.damage * projectile.critMultiplier);
  }

  // Apply damage
  const damageDealt = damageEnemy(enemy, finalDamage);

  // Emit damage number
  if (particles) {
    const isCrit = projectile.isCrit || false;
    const isPoison = projectile.poisonDamage > 0;
    const isSlow = projectile.slowAmount > 0;
    const isSplash = projectile.splash > 0;

    let type = 'normal';
    if (isCrit) type = 'crit';
    else if (isPoison) type = 'poison';
    else if (isSlow) type = 'slow';
    else if (isSplash) type = 'splash';

    emitDamageNumber(particles, enemy.x, enemy.y, damageDealt, {
      type,
      isBoss: enemy.isBoss || false,
    });
  }

  // Apply slow effect
  if (projectile.slowAmount > 0 && projectile.slowDuration > 0) {
    slowEnemy(enemy, projectile.slowAmount, projectile.slowDuration);
  }

  // Apply time warp slow (every 3rd shot)
  if (projectile.timeWarpSlow) {
    slowEnemy(enemy, 0.5, 1.0); // 50% slow for 1 second
  }

  // Apply poison effect
  if (projectile.poisonDamage > 0 && projectile.poisonDuration > 0) {
    poisonEnemy(enemy, projectile.poisonDamage, projectile.poisonDuration);
  }

  // Apply stun effect
  if (projectile.stunDuration > 0) {
    stunEnemy(enemy, projectile.stunDuration);
  }

  return damageDealt;
}

export function removeProjectile(projectiles, projectileId) {
  const index = projectiles.findIndex((p) => p.id === projectileId);
  if (index !== -1) {
    const projectile = projectiles.splice(index, 1)[0];
    _projectilePool.release(projectile);
  }
}

export function getProjectilePoolStats() {
  return _projectilePool.getStats();
}
