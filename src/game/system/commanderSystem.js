// ============================================================
//  commanderSystem.js
//  Player-active abilities with cooldowns.
// ============================================================

import { emitShockwave, emitGoldenFlash, emitLightningArc, emitAirstrike } from './particleSystem';

export const COMMANDER_ABILITIES = {
  freeze: {
    id: 'freeze',
    name: 'Freeze',
    icon: '❄️',
    description: 'Freeze all enemies for 2s',
    cooldown: 20,
    unlockWave: 5,
    color: '#67e8f9',
  },
  airstrike: {
    id: 'airstrike',
    name: 'Airstrike',
    icon: '💥',
    description: 'Deal 50 damage to all enemies',
    cooldown: 30,
    unlockWave: 10,
    color: '#f97316',
  },
  goldRush: {
    id: 'goldRush',
    name: 'Gold Rush',
    icon: '⚡',
    description: '2x tower fire rate for 8s',
    cooldown: 45,
    unlockWave: 15,
    color: '#fbbf24',
  },
  repair: {
    id: 'repair',
    name: 'Repair',
    icon: '🔧',
    description: 'Heal all support towers',
    cooldown: 25,
    unlockWave: 8,
    color: '#4ade80',
  },
  nuke: {
    id: 'nuke',
    name: 'Nuke',
    icon: '☢️',
    description: 'Destroy all enemies (costs 100g)',
    cooldown: 120,
    unlockWave: 20,
    color: '#ef4444',
    goldCost: 100,
  },
};

export function createCommanderState() {
  const abilities = {};
  for (const [id, def] of Object.entries(COMMANDER_ABILITIES)) {
    abilities[id] = {
      ...def,
      currentCooldown: 0,
      ready: true,
    };
  }
  return { abilities, activeEffects: [] };
}

export function canUseAbility(state, abilityId) {
  const ability = state.abilities[abilityId];
  if (!ability) return { canUse: false, reason: 'Unknown ability' };
  if (ability.currentCooldown > 0) return { canUse: false, reason: 'On cooldown' };
  if (ability.goldCost && state.gold !== undefined) {
    // Gold check done at call site
  }
  return { canUse: true };
}

export function activateAbility(state, abilityId, gameState, particles) {
  const ability = state.abilities[abilityId];
  if (!ability || ability.currentCooldown > 0) return { success: false };

  const now = performance.now() / 1000;
  const enemies = gameState.enemies || [];

  switch (abilityId) {
    case 'freeze':
      enemies.forEach((e) => {
        e._frozenUntil = now + 2;
      });
      // VFX: Blue shockwave from each enemy
      if (particles && enemies.length > 0) {
        for (const e of enemies.slice(0, 10)) {
          emitShockwave(particles, e.x, e.y, '#67e8f9', 30);
        }
        // Central big shockwave
        const centerX = enemies.reduce((s, e) => s + e.x, 0) / enemies.length;
        const centerY = enemies.reduce((s, e) => s + e.y, 0) / enemies.length;
        emitShockwave(particles, centerX, centerY, '#22d3ee', 80);
      }
      break;

    case 'airstrike':
      // VFX: Airstrike bombardment
      if (particles) {
        emitAirstrike(particles, enemies, 6);
      }
      enemies.forEach((e) => {
        e.hp -= 50;
        if (e.hp <= 0) e.dead = true;
      });
      break;

    case 'goldRush':
      state.activeEffects.push({
        id: 'goldRush',
        endTime: now + 8,
        effect: { towerFireRateMultiplier: 2 },
      });
      // VFX: Golden flash across the map
      if (particles) {
        emitGoldenFlash(particles, 480, 336);
        emitShockwave(particles, 480, 336, '#fbbf24', 120);
      }
      break;

    case 'repair':
      // Heal all support towers (visual only - actual heal happens via tower system)
      if (particles && gameState.towers) {
        for (const tower of gameState.towers) {
          const towerType = tower.type || tower.defId;
          // Support towers typically have 'Boost' in name or isSupport flag
          const isSupport =
            towerType.includes('Boost') ||
            towerType.includes('speedBoost') ||
            towerType.includes('damageAmp') ||
            towerType.includes('rangeExtend');
          if (isSupport) {
            emitShockwave(particles, tower.x, tower.y, '#4ade80', 25);
          }
        }
      }
      break;

    case 'nuke':
      if (gameState.money < 100) return { success: false, reason: 'Not enough gold' };
      gameState.money -= 100;
      // VFX: Lightning arcs to all enemies + golden flash
      if (particles && enemies.length > 0) {
        const centerX = 480;
        const centerY = 336;
        // Lightning arcs from center to each enemy (up to 12 for performance)
        const maxArcs = Math.min(12, enemies.length);
        for (let i = 0; i < maxArcs; i++) {
          const e = enemies[i];
          emitLightningArc(particles, centerX, centerY, e.x, e.y, '#ef4444', 6);
        }
        // Big golden flash
        emitGoldenFlash(particles, centerX, centerY);
        emitShockwave(particles, centerX, centerY, '#ef4444', 150);
      }
      enemies.forEach((e) => {
        e.dead = true;
      });
      break;

    default:
      break;
  }

  ability.currentCooldown = ability.cooldown;
  ability.ready = false;
  return { success: true };
}

export function updateCommander(state, dt) {
  const now = performance.now() / 1000;
  for (const ability of Object.values(state.abilities)) {
    if (ability.currentCooldown > 0) {
      ability.currentCooldown -= dt;
      if (ability.currentCooldown <= 0) {
        ability.currentCooldown = 0;
        ability.ready = true;
      }
    }
  }
  // Remove expired active effects
  for (let i = state.activeEffects.length - 1; i >= 0; i--) {
    if (now >= state.activeEffects[i].endTime) {
      state.activeEffects.splice(i, 1);
    }
  }
}

export function getActiveCommanderEffects(state) {
  const combined = {};
  for (const effect of state.activeEffects) {
    Object.assign(combined, effect.effect);
  }
  return combined;
}
