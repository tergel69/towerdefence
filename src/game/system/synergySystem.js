// ============================================================
//  synergySystem.js
//  Expanded synergy detection, effects, and visual indicators
// ============================================================

import { TOWER_DEFS } from '../constants';

// ── Synergy Definitions ──────────────────────────────────────
export const SYNERGY_DEFS = {
  // Ice synergy - Freeze Chain (existing)
  freezeChain: {
    id: 'freezeChain',
    name: 'Freeze Chain',
    description: '2+ Ice towers create a freezing aura',
    icon: '❄️',
    requiredTowers: ['frost_bolt', 'blizzard', 'ice', 'crystalGuard'],
    requiredCount: 2,
    effect: { frozenChance: 0.25, slowAura: 0.15 },
    color: '#67e8f9',
  },

  // Poison Stack - NEW
  poisonStack: {
    id: 'poisonStack',
    name: 'Poison Stack',
    description: '2+ Poison towers apply damage 3x faster',
    icon: '☠️',
    requiredTowers: ['poison'],
    requiredCount: 2,
    effect: { poisonTickRate: 3.0, poisonDamageMultiplier: 1.3 },
    color: '#22c55e',
  },

  // Crystal Resonance - NEW
  crystalResonance: {
    id: 'crystalResonance',
    name: 'Crystal Resonance',
    description: '3+ Crystal towers fire simultaneously',
    icon: '💎',
    requiredTowers: ['crystalGuard'],
    requiredCount: 3,
    effect: { simultaneousFire: true, fireRateMultiplier: 1.5 },
    color: '#a78bfa',
  },

  // Tank + DPS - NEW
  tankAndDPS: {
    id: 'tankAndDPS',
    name: 'Tank & DPS',
    description: 'Tank taunts enemies, DPS deals +30% damage',
    icon: '🛡️',
    requiredTowers: ['crystalGuard'], // tanks
    requiredAllies: ['basic', 'sniper', 'archer'], // DPS
    requiredCount: 1,
    effect: { tauntRadius: 80, allyDamageMultiplier: 1.3 },
    color: '#fbbf24',
  },

  // Elemental Burst - NEW
  elementalBurst: {
    id: 'elementalBurst',
    name: 'Elemental Burst',
    description: '3 different elements create AoE explosion on kill',
    icon: '💥',
    requiredElements: ['ice', 'fire', 'lightning'],
    requiredCount: 3,
    effect: { explosionOnKill: true, explosionRadius: 60, explosionDamage: 25 },
    color: '#f97316',
  },

  // Sniper Team (existing)
  sniperTeam: {
    id: 'sniperTeam',
    name: 'Sniper Team',
    description: 'Sniper + Basic tower: +20% damage',
    icon: '🎯',
    requiredTowers: ['sniper'],
    requiredAllies: ['basic', 'archer'],
    requiredCount: 1,
    effect: { damageMultiplier: 1.2 },
    color: '#ce93d8',
  },

  // Support Boost (existing)
  supportBoost: {
    id: 'supportBoost',
    name: 'Support Boost',
    description: 'Basic tower near support gets +10% fire rate',
    icon: '⚡',
    requiredTowers: ['basic'],
    requiredAllies: Object.keys(TOWER_DEFS).filter((id) => TOWER_DEFS[id]?.isSupport),
    requiredCount: 1,
    effect: { fireRateMultiplier: 1.1 },
    color: '#60a5fa',
  },
};

// ── Helper: Get element type for a tower ─────────────────────
function getElementForTower(towerType) {
  const def = TOWER_DEFS[towerType];
  if (!def) return 'physical';

  if (['ice', 'frost_bolt', 'blizzard', 'crystalGuard'].includes(towerType)) return 'ice';
  if (['flamethrower', 'fire_ball', 'magmaCannon'].includes(towerType)) return 'fire';
  if (['poison'].includes(towerType)) return 'poison';
  if (['sniper'].includes(towerType)) return 'precision';
  if (['basic', 'archer'].includes(towerType)) return 'physical';
  if (def.isSupport) return 'support';

  return 'physical';
}

// ── Helper: Check if tower matches synergy requirement ───────
function towerMatchesSynergy(towerType, requiredTowers) {
  if (!requiredTowers || !Array.isArray(requiredTowers)) return false;
  return requiredTowers.includes(towerType);
}

// ── Master Synergy Detection ─────────────────────────────────
/**
 * Detect all active synergies for a set of towers
 * @param {Array} towers - All placed towers
 * @returns {Array} List of active synergies
 */
export function detectActiveSynergies(towers) {
  if (!towers || towers.length === 0) return [];

  const activeSynergies = [];
  const towerTypes = towers.map((t) => t.type || t.defId);
  const elements = new Set(towerTypes.map(getElementForTower));

  // Check each synergy definition
  for (const [key, synergy] of Object.entries(SYNERGY_DEFS)) {
    let matchingTowers = [];

    // Handle element-based synergies (like Elemental Burst)
    if (synergy.requiredElements && !synergy.requiredTowers) {
      const hasRequiredElements = synergy.requiredElements.every((elem) => elements.has(elem));
      if (!hasRequiredElements) continue;

      // All towers of matching elements participate
      matchingTowers = towerTypes.filter((type) =>
        synergy.requiredElements.includes(getElementForTower(type))
      );
    } else {
      // Handle tower-type-based synergies
      matchingTowers = towerTypes.filter((type) =>
        towerMatchesSynergy(type, synergy.requiredTowers)
      );
    }

    // Check count requirement
    if (matchingTowers.length < synergy.requiredCount) continue;

    // Check ally requirement if exists
    if (synergy.requiredAllies) {
      const hasAlly = towerTypes.some((type) => synergy.requiredAllies.includes(type));
      if (!hasAlly) continue;
    }

    // Synergy is active!
    activeSynergies.push({
      ...synergy,
      key,
      towerCount: matchingTowers.length,
      towers: matchingTowers,
    });
  }

  return activeSynergies;
}

// ── Behavioral Effects ───────────────────────────────────────
/**
 * Apply runtime behavioral synergy effects (not just stat modifiers).
 * Called each frame from the game loop.
 *
 * @param {Array} activeSynergies - List of active synergies from detectActiveSynergies
 * @param {Object} state - { towers, enemies, projectiles, particles }
 * @param {number} dt - Delta time in seconds
 * @param {Array} particles - Particle array to push VFX into (optional)
 * @returns {Object} { freezeChains: Array, crystalFires: Array, explosions: Array }
 */
export function applySynergyBehavioralEffects(activeSynergies, state, dt, particles) {
  if (!activeSynergies || activeSynergies.length === 0) {
    return { freezeChains: [], crystalFires: [], explosions: [], tauntPulls: [] };
  }

  const { towers, enemies, projectiles } = state;
  const results = { freezeChains: [], crystalFires: [], explosions: [], tauntPulls: [] };
  const activeSynergyIds = new Set(activeSynergies.map((s) => s.key));

  // ── Freeze Chain ───────────────────────────────────────────
  if (activeSynergyIds.has('freezeChain')) {
    const freezeChainResults = applyFreezeChain(towers, enemies, projectiles, particles);
    results.freezeChains = freezeChainResults;
  }

  // ── Elemental Burst ────────────────────────────────────────
  if (activeSynergyIds.has('elementalBurst')) {
    const explosionResults = applyElementalBurst(enemies, particles);
    results.explosions = explosionResults;
  }

  // ── Crystal Resonance ──────────────────────────────────────
  if (activeSynergyIds.has('crystalResonance')) {
    const crystalFireResults = applyCrystalResonance(towers, dt);
    results.crystalFires = crystalFireResults;
  }

  // ── Tank & DPS ─────────────────────────────────────────────
  if (activeSynergyIds.has('tankAndDPS')) {
    const tauntResults = applyTankAndDPS(towers, enemies, dt);
    results.tauntPulls = tauntResults;
  }

  return results;
}

// ── Freeze Chain ─────────────────────────────────────────────
function applyFreezeChain(towers, enemies, projectiles, particles) {
  const freezeChains = [];
  const iceTowerTypes = ['frost_bolt', 'blizzard', 'ice', 'crystalGuard'];

  for (const projectile of projectiles || []) {
    if (!projectile.targetId || !iceTowerTypes.includes(projectile.sourceType)) continue;
    // 25% chance per shot
    if (Math.random() > 0.25) continue;

    const target = (enemies || []).find((e) => e.id === projectile.targetId);
    if (!target) continue;

    const slowAmount = target.slowAmount || 0;
    // If target is already slowed by 30%+, freeze instead
    if (slowAmount >= 0.3) {
      target.frozen = true;
      target.frozenDuration = 1.5;
      freezeChains.push({ enemyId: target.id, frozenDuration: 1.5 });

      // VFX: small frost burst
      if (particles) {
        particles.push({
          id: Date.now() + Math.random(),
          type: 'burst',
          x: target.x,
          y: target.y,
          vx: 0,
          vy: 0,
          maxLife: 0.4,
          size: 20,
          color: '#67e8f9',
          gravity: 0,
        });
      }
    }
  }

  return freezeChains;
}

// ── Elemental Burst ──────────────────────────────────────────
function applyElementalBurst(enemies, particles) {
  const explosions = [];

  // Track enemies that died this frame
  for (const enemy of enemies || []) {
    if (!enemy.diedThisFrame) continue;

    const deathX = enemy.x;
    const deathY = enemy.y;

    // Deal 25 AoE damage to all enemies within 60px
    for (const other of enemies || []) {
      if (other.id === enemy.id || other.hp <= 0) continue;
      const dist = Math.hypot(other.x - deathX, other.y - deathY);
      if (dist <= 60) {
        other.hp -= 25;
        if (other.hp <= 0 && !other.diedThisFrame) {
          // Chain: this enemy also explodes
          other.diedThisFrame = true;
        }
      }
    }

    explosions.push({ x: deathX, y: deathY, radius: 60, damage: 25 });

    // VFX: expanding ring
    if (particles) {
      particles.push({
        id: Date.now() + Math.random(),
        type: 'ring',
        x: deathX,
        y: deathY,
        vx: 0,
        vy: 0,
        maxLife: 0.5,
        size: 60,
        color: '#f97316',
        gravity: 0,
      });
      // Burst particle
      particles.push({
        id: Date.now() + Math.random(),
        type: 'burst',
        x: deathX,
        y: deathY,
        vx: 0,
        vy: 0,
        maxLife: 0.3,
        size: 30,
        color: '#fbbf24',
        gravity: 0,
      });
    }
  }

  return explosions;
}

// ── Crystal Resonance ────────────────────────────────────────
function applyCrystalResonance(towers, dt) {
  const crystalFires = [];
  const crystalTowers = (towers || []).filter((t) => (t.type || t.defId) === 'crystalGuard');

  if (crystalTowers.length < 3) return crystalFires;

  // When one crystal tower fires (just fired this frame), trigger nearby crystals
  for (const crystal of crystalTowers) {
    if (!crystal.justFired) continue;

    for (const other of crystalTowers) {
      if (other.id === crystal.id) continue;
      const dist = Math.hypot(other.x - crystal.x, other.y - crystal.y);
      if (dist <= 120) {
        other.shouldFire = true;
        crystalFires.push({ towerId: other.id, triggeredBy: crystal.id });
      }
    }
  }

  return crystalFires;
}

// ── Tank & DPS ───────────────────────────────────────────────
function applyTankAndDPS(towers, enemies, dt) {
  const tauntPulls = [];
  const tankTowers = (towers || []).filter((t) => (t.type || t.defId) === 'crystalGuard');
  const dpsTowerTypes = ['basic', 'sniper', 'archer'];

  for (const tank of tankTowers) {
    // Check if there's a DPS tower nearby (within some reasonable range, e.g., 150px)
    const hasNearbyDPS = (towers || []).some(
      (t) =>
        dpsTowerTypes.includes(t.type || t.defId) && Math.hypot(t.x - tank.x, t.y - tank.y) <= 150
    );

    if (!hasNearbyDPS) continue;

    // Taunt: pull enemies within 80px toward the tank
    for (const enemy of enemies || []) {
      if (enemy.hp <= 0) continue;
      const dist = Math.hypot(enemy.x - tank.x, enemy.y - tank.y);
      if (dist <= 80 && dist > 0) {
        const dx = tank.x - enemy.x;
        const dy = tank.y - enemy.y;
        const pullStrength = 2; // px/frame
        enemy.x += (dx / dist) * pullStrength;
        enemy.y += (dy / dist) * pullStrength;
        tauntPulls.push({ enemyId: enemy.id, tankId: tank.id });
      }
    }
  }

  return tauntPulls;
}

// ── Apply Synergy Modifiers to Tower ─────────────────────────
/**
 * Get synergy modifiers for a specific tower based on active synergies
 * @param {Object} tower - Tower to check
 * @param {Array} towers - All placed towers
 * @returns {Object} Modifier object
 */
export function getTowerSynergyModifiers(tower, towers = []) {
  const towerType = tower?.type || tower?.defId;
  if (!towerType) return {};

  const modifiers = {};
  const activeSynergies = detectActiveSynergies(towers);

  for (const synergy of activeSynergies) {
    // Check if this tower benefits from the synergy
    if (synergy.towers?.includes(towerType)) {
      Object.assign(modifiers, synergy.effect);
    }

    // Check ally bonuses
    if (synergy.requiredAllies?.includes(towerType)) {
      if (synergy.effect.allyDamageMultiplier) {
        modifiers.damageMultiplier = synergy.effect.allyDamageMultiplier;
      }
      if (synergy.effect.fireRateMultiplier && !modifiers.fireRateMultiplier) {
        modifiers.fireRateMultiplier = synergy.effect.fireRateMultiplier;
      }
    }
  }

  // Also apply behavioral effect results if towers have state flags
  const behavioralResults = applySynergyBehavioralEffects(
    activeSynergies,
    {
      towers,
      enemies: [],
      projectiles: [],
      particles: null,
    },
    0,
    null
  );

  // Merge crystal fire triggers into modifiers
  if (behavioralResults.crystalFires.length > 0) {
    const towerFire = behavioralResults.crystalFires.find((f) => f.towerId === tower.id);
    if (towerFire) {
      modifiers.shouldFire = true;
    }
  }

  return modifiers;
}

// ── Get Synergy Visual Indicators ────────────────────────────
/**
 * Get visual indicators for rendering active synergies
 * @param {Array} activeSynergies - List of active synergies
 * @returns {Array} Visual indicator objects
 */
export function getSynergyVisuals(activeSynergies) {
  return activeSynergies.map((synergy) => ({
    id: synergy.id,
    color: synergy.color,
    icon: synergy.icon,
    name: synergy.name,
    radius: synergy.effect?.tauntRadius || synergy.effect?.explosionRadius || 96,
    pulseSpeed: synergy.id === 'freezeChain' ? 2000 : 3000,
  }));
}

// ── Get Synergy Tooltip Data ─────────────────────────────────
/**
 * Get tooltip data for synergy display in UI
 * @param {string} towerType - Tower type to get synergies for
 * @param {Array} towers - All placed towers
 * @returns {Array} Tooltip objects
 */
export function getSynergyTooltips(towerType, towers = []) {
  if (!towerType) return [];

  const tooltips = [];
  const activeSynergies = detectActiveSynergies(towers);

  for (const synergy of activeSynergies) {
    if (synergy.towers?.includes(towerType)) {
      tooltips.push({
        name: synergy.name,
        description: synergy.description,
        icon: synergy.icon,
        color: synergy.color,
        active: true,
      });
    }
  }

  return tooltips;
}
