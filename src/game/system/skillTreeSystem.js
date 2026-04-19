// ============================================================
//  skillTreeSystem.js
//  In-match skill tree system:
//   - Defines skill nodes organized in tiers (unlocked by wave)
//   - Manages state for purchased skills and gold spending
//   - Combines skill effects into modifier objects
//   - Applies skill bonuses to tower stats
//   - Provides data for React UI rendering
// ============================================================

// ── Skill Definitions ────────────────────────────────────────
export const SKILL_NODES = {
  // ── Tier 1 (wave 1+) ──────────────────────────────────────
  sharpshooting: {
    id: 'sharpshooting',
    name: 'Sharpshooting',
    icon: '🎯',
    description: '+10% tower damage',
    tier: 1,
    cost: 50,
    maxStacks: 1,
    effect: { damageMultiplier: 1.1 },
  },

  swift_deploy: {
    id: 'swift_deploy',
    name: 'Swift Deploy',
    icon: '⚡',
    description: '+15% tower fire rate',
    tier: 1,
    cost: 50,
    maxStacks: 1,
    effect: { fireRateMultiplier: 1.15 },
  },

  treasure_hunting: {
    id: 'treasure_hunting',
    name: 'Treasure Hunting',
    icon: '💰',
    description: '+20% gold from kills',
    tier: 1,
    cost: 40,
    maxStacks: 1,
    effect: { goldMultiplier: 1.2 },
  },

  // ── Tier 2 (wave 3+) ──────────────────────────────────────
  eagle_eye: {
    id: 'eagle_eye',
    name: 'Eagle Eye',
    icon: '👁️',
    description: '+15% tower range',
    tier: 2,
    cost: 75,
    maxStacks: 1,
    effect: { rangeMultiplier: 1.15 },
  },

  frozen_veins: {
    id: 'frozen_veins',
    name: 'Frozen Veins',
    icon: '❄️',
    description: 'Ice towers slow 30% more',
    tier: 2,
    cost: 75,
    maxStacks: 1,
    effect: { iceSlowMultiplier: 1.3 },
    requiredTowerType: 'ice',
  },

  toxic_cloud: {
    id: 'toxic_cloud',
    name: 'Toxic Cloud',
    icon: '☠️',
    description: 'Poison towers deal +25% poison damage',
    tier: 2,
    cost: 75,
    maxStacks: 1,
    effect: { poisonDamageMultiplier: 1.25 },
    requiredTowerType: 'poison',
  },

  // ── Tier 3 (wave 5+) ──────────────────────────────────────
  critical_strike: {
    id: 'critical_strike',
    name: 'Critical Strike',
    icon: '💥',
    description: '15% chance for towers to deal 2x damage',
    tier: 3,
    cost: 120,
    maxStacks: 1,
    effect: { critChance: 0.15, critDamage: 2.0 },
  },

  chain_lightning: {
    id: 'chain_lightning',
    name: 'Chain Lightning',
    icon: '⚡',
    description: '10% chance for lightning to arc to nearby enemy',
    tier: 3,
    cost: 120,
    maxStacks: 1,
    effect: { chainLightningChance: 0.1, chainLightningRange: 80, chainLightningDamagePct: 0.5 },
  },

  fortification: {
    id: 'fortification',
    name: 'Fortification',
    icon: '🏰',
    description: 'Towers gain +20% HP equivalent, but enemies give 10% less gold',
    tier: 3,
    cost: 100,
    maxStacks: 1,
    effect: { towerHpMultiplier: 1.2, goldMultiplier: 0.9 },
  },

  // ── Tier 4 (wave 8+) ──────────────────────────────────────
  double_trouble: {
    id: 'double_trouble',
    name: 'Double Trouble',
    icon: '🔫',
    description: 'Towers can target 2 enemies simultaneously',
    tier: 4,
    cost: 200,
    maxStacks: 1,
    effect: { multiTarget: 2 },
  },

  time_warp: {
    id: 'time_warp',
    name: 'Time Warp',
    icon: '⏳',
    description: 'Every 3rd shot slows enemy by 50% for 1s',
    tier: 4,
    cost: 200,
    maxStacks: 1,
    effect: { timeWarpSlowAmount: 0.5, timeWarpSlowDuration: 1.0, timeWarpShotInterval: 3 },
  },

  golden_touch: {
    id: 'golden_touch',
    name: 'Golden Touch',
    icon: '✨',
    description: 'All tower sell values increased by 50%',
    tier: 4,
    cost: 150,
    maxStacks: 1,
    effect: { sellValueMultiplier: 1.5 },
  },

  // ── Tier 5 (wave 12+) ─────────────────────────────────────
  ultimate_weapon: {
    id: 'ultimate_weapon',
    name: 'Ultimate Weapon',
    icon: '🗡️',
    description: '+50% tower damage, -20% fire rate',
    tier: 5,
    cost: 400,
    maxStacks: 1,
    effect: { damageMultiplier: 1.5, fireRateMultiplier: 0.8 },
  },

  black_hole: {
    id: 'black_hole',
    name: 'Black Hole',
    icon: '🌀',
    description: 'On kill, 20% chance to pull nearby enemies toward death location',
    tier: 5,
    cost: 350,
    maxStacks: 1,
    effect: { blackHoleChance: 0.2, blackHoleRange: 100, blackHolePullStrength: 30 },
  },
};

// ── Tier unlock wave requirements ───────────────────────────
const TIER_UNLOCK_WAVES = {
  1: 1,
  2: 3,
  3: 5,
  4: 8,
  5: 12,
};

// ── Factory ──────────────────────────────────────────────────
/**
 * Returns a fresh skill tree state object.
 * @returns {object}
 */
export function createSkillTreeState() {
  return {
    unlockedNodes: {}, // { nodeId: level } where level = how many times purchased
    availableTier: 1, // highest tier currently unlocked
    totalSpent: 0,
  };
}

// ── Helper: Get available skills ─────────────────────────────
/**
 * Returns skills the player can currently buy based on wave and gold.
 *
 * @param {object} skillTree   - current skill tree state
 * @param {number} currentWave - current wave number
 * @param {number} playerGold  - player's current gold
 * @returns {Array<object>} array of skill nodes that are available for purchase
 */
export function getAvailableSkills(skillTree, currentWave, playerGold) {
  const available = [];

  // Update available tier based on wave
  let highestTier = 1;
  for (const [tier, waveReq] of Object.entries(TIER_UNLOCK_WAVES)) {
    if (currentWave >= waveReq) {
      highestTier = Math.max(highestTier, Number(tier));
    }
  }
  skillTree.availableTier = highestTier;

  for (const [nodeId, nodeDef] of Object.entries(SKILL_NODES)) {
    // Check if tier is unlocked
    if (nodeDef.tier > skillTree.availableTier) continue;

    // Check if player can afford it
    if (playerGold < nodeDef.cost) continue;

    // Check max stacks
    const currentLevel = skillTree.unlockedNodes[nodeId] || 0;
    if (currentLevel >= nodeDef.maxStacks) continue;

    available.push({
      ...nodeDef,
      currentLevel,
      canAfford: playerGold >= nodeDef.cost,
    });
  }

  return available;
}

// ── Helper: Purchase skill ───────────────────────────────────
/**
 * Attempts to purchase a skill node.
 *
 * @param {object} skillTree - current skill tree state (mutated)
 * @param {string} nodeId    - id of the skill node to purchase
 * @param {number} playerGold - player's current gold
 * @returns {{ success: boolean, newGold: number, node: object|null }}
 */
export function purchaseSkill(skillTree, nodeId, playerGold) {
  const nodeDef = SKILL_NODES[nodeId];
  if (!nodeDef) {
    return { success: false, newGold: playerGold, node: null, reason: 'Unknown skill node' };
  }

  // Check if tier is unlocked
  if (nodeDef.tier > skillTree.availableTier) {
    return { success: false, newGold: playerGold, node: null, reason: 'Tier not yet unlocked' };
  }

  // Check if player can afford it
  if (playerGold < nodeDef.cost) {
    return { success: false, newGold: playerGold, node: null, reason: 'Not enough gold' };
  }

  // Check max stacks
  const currentLevel = skillTree.unlockedNodes[nodeId] || 0;
  if (currentLevel >= nodeDef.maxStacks) {
    return { success: false, newGold: playerGold, node: null, reason: 'Already at max stacks' };
  }

  // Purchase!
  skillTree.unlockedNodes[nodeId] = currentLevel + 1;
  skillTree.totalSpent += nodeDef.cost;

  const newGold = playerGold - nodeDef.cost;

  return {
    success: true,
    newGold,
    node: { ...nodeDef, level: skillTree.unlockedNodes[nodeId] },
  };
}

// ── Helper: Get combined skill modifiers ─────────────────────
/**
 * Combines all active skill effects into a single modifier object.
 *
 * @param {object} skillTree - current skill tree state
 * @returns {object} combined modifier object
 */
export function getSkillModifiers(skillTree) {
  const combined = {};

  for (const [nodeId, level] of Object.entries(skillTree.unlockedNodes)) {
    if (level <= 0) continue;

    const nodeDef = SKILL_NODES[nodeId];
    if (!nodeDef) continue;

    // Apply effect (scale by level for stackable skills)
    for (const [key, value] of Object.entries(nodeDef.effect)) {
      if (combined[key] === undefined) {
        combined[key] = value;
      } else {
        // For multipliers, multiply them together
        if (key.endsWith('Multiplier') || key === 'critDamage') {
          combined[key] *= value;
        } else {
          // For additive stats (like critChance), add them
          combined[key] += value;
        }
      }
    }
  }

  return combined;
}

// ── Helper: Apply skill modifiers to tower stats ─────────────
/**
 * Applies relevant skill bonuses to tower stats.
 * Returns a new stats object with modifiers applied.
 *
 * @param {object} stats      - base tower stats { damage, fireRate, range, ... }
 * @param {object} skillTree  - current skill tree state
 * @param {string} towerType  - type of tower (for type-specific bonuses)
 * @returns {object} modified stats
 */
export function applySkillModifiersToTower(stats, skillTree, towerType) {
  if (!skillTree || Object.keys(skillTree.unlockedNodes).length === 0) {
    return { ...stats };
  }

  const modifiers = getSkillModifiers(skillTree);
  const modified = { ...stats };

  // Damage multiplier
  if (modifiers.damageMultiplier) {
    modified.damage = Math.round(modified.damage * modifiers.damageMultiplier);
  }

  // Fire rate multiplier
  if (modifiers.fireRateMultiplier) {
    modified.fireRate = Math.round(modified.fireRate * modifiers.fireRateMultiplier * 100) / 100;
  }

  // Range multiplier
  if (modifiers.rangeMultiplier) {
    modified.range = Math.round(modified.range * modifiers.rangeMultiplier);
  }

  // Ice slow multiplier (applied to slowAmount)
  if (modifiers.iceSlowMultiplier && towerType && isIceTower(towerType)) {
    if (modified.slowAmount) {
      modified.slowAmount = Math.min(0.95, modified.slowAmount * modifiers.iceSlowMultiplier);
    }
  }

  // Poison damage multiplier (applied to poisonDamage)
  if (modifiers.poisonDamageMultiplier && towerType && isPoisonTower(towerType)) {
    if (modified.poisonDamage) {
      modified.poisonDamage = Math.round(modified.poisonDamage * modifiers.poisonDamageMultiplier);
    }
  }

  // Tower HP multiplier (for fortification)
  if (modifiers.towerHpMultiplier) {
    modified.towerHp = Math.round((modified.towerHp || 0) * modifiers.towerHpMultiplier);
  }

  // Critical strike - add crit properties
  if (modifiers.critChance) {
    modified.critChance = modifiers.critChance;
    modified.critDamage = modifiers.critDamage || 2.0;
  }

  // Chain lightning
  if (modifiers.chainLightningChance) {
    modified.chainLightningChance = modifiers.chainLightningChance;
    modified.chainLightningRange = modifiers.chainLightningRange || 80;
    modified.chainLightningDamagePct = modifiers.chainLightningDamagePct || 0.5;
  }

  // Multi-target (double trouble)
  if (modifiers.multiTarget) {
    modified.multiTarget = modifiers.multiTarget;
  }

  // Time warp
  if (modifiers.timeWarpShotInterval) {
    modified.timeWarpSlowAmount = modifiers.timeWarpSlowAmount || 0.5;
    modified.timeWarpSlowDuration = modifiers.timeWarpSlowDuration || 1.0;
    modified.timeWarpShotInterval = modifiers.timeWarpShotInterval;
  }

  // Black hole
  if (modifiers.blackHoleChance) {
    modified.blackHoleChance = modifiers.blackHoleChance;
    modified.blackHoleRange = modifiers.blackHoleRange || 100;
    modified.blackHolePullStrength = modifiers.blackHolePullStrength || 0.3;
  }

  return modified;
}

// ── Helper: Get gold multiplier ──────────────────────────────
/**
 * Returns the gold multiplier from skills (for kill rewards).
 * Use this in enemySystem when granting rewards.
 *
 * @param {object} skillTree - current skill tree state
 * @returns {number} gold multiplier (default 1.0)
 */
export function getGoldMultiplier(skillTree) {
  const modifiers = getSkillModifiers(skillTree);
  return modifiers.goldMultiplier || 1.0;
}

// ── Helper: Get sell value multiplier ────────────────────────
/**
 * Returns the sell value multiplier from skills.
 * Use this in towerSystem when calculating sell values.
 *
 * @param {object} skillTree - current skill tree state
 * @returns {number} sell value multiplier (default 1.0)
 */
export function getSellValueMultiplier(skillTree) {
  const modifiers = getSkillModifiers(skillTree);
  return modifiers.sellValueMultiplier || 1.0;
}

// ── Helper: Render skill tree UI data ────────────────────────
/**
 * Returns a data structure for React UI rendering.
 * NOT React components - just plain data.
 *
 * @param {object} skillTree   - current skill tree state
 * @param {number} currentWave - current wave number
 * @returns {object} UI data structure
 */
export function renderSkillTreeUI(skillTree, currentWave) {
  const tiers = {};

  // Organize skills by tier
  for (const [tierNum, waveReq] of Object.entries(TIER_UNLOCK_WAVES)) {
    const tier = Number(tierNum);
    const isUnlocked = currentWave >= waveReq;

    tiers[tier] = {
      tier,
      waveRequirement: waveReq,
      isUnlocked,
      skills: [],
    };

    // Add skills for this tier
    for (const [nodeId, nodeDef] of Object.entries(SKILL_NODES)) {
      if (nodeDef.tier !== tier) continue;

      const currentLevel = skillTree.unlockedNodes[nodeId] || 0;
      const isMaxed = currentLevel >= nodeDef.maxStacks;

      tiers[tier].skills.push({
        id: nodeId,
        name: nodeDef.name,
        icon: nodeDef.icon,
        description: nodeDef.description,
        cost: nodeDef.cost,
        maxStacks: nodeDef.maxStacks,
        currentLevel,
        isMaxed,
        isPurchased: currentLevel > 0,
        effect: nodeDef.effect,
      });
    }
  }

  return {
    tiers: Object.values(tiers).sort((a, b) => a.tier - b.tier),
    totalSpent: skillTree.totalSpent,
    availableTier: skillTree.availableTier,
    unlockedCount: Object.keys(skillTree.unlockedNodes).length,
    totalSkills: Object.keys(SKILL_NODES).length,
  };
}

// ── Helper: Handle chain lightning on kill ───────────────────
/**
 * Check for chain lightning proc on kill.
 * Call this from the game loop when an enemy dies.
 *
 * @param {object} deadEnemy     - the enemy that just died
 * @param {Array}  enemies       - all enemies array
 * @param {Array}  projectiles   - projectile array (not used directly)
 * @param {Array}  particles     - particle array for VFX
 * @param {object} skillTree     - skill tree state
 * @returns {boolean} whether chain lightning fired
 */
export function handleChainLightningOnKill(deadEnemy, enemies, projectiles, particles, skillTree) {
  if (!skillTree?.unlockedNodes?.chain_lightning) return false;

  const modifiers = getSkillModifiers(skillTree);
  const chainChance = modifiers.chainLightningChance || 0;
  if (chainChance <= 0 || Math.random() > chainChance) return false;

  // Find nearest enemy within range
  const range = modifiers.chainLightningRange || 80;
  let nearest = null;
  let nearestDist = range;

  for (const enemy of enemies) {
    if (enemy.dead || enemy.reachedEnd || enemy === deadEnemy) continue;

    const dx = enemy.x - deadEnemy.x;
    const dy = enemy.y - deadEnemy.y;
    const dist = Math.hypot(dx, dy);

    if (dist < nearestDist) {
      nearestDist = dist;
      nearest = enemy;
    }
  }

  if (!nearest) return false;

  const chainDamage = Math.round(
    (deadEnemy.maxHp || 50) * (modifiers.chainLightningDamagePct || 0.5)
  );

  // Apply damage to the chained enemy
  nearest.hp -= chainDamage;
  if (nearest.hp <= 0) nearest.dead = true;

  // Emit lightning arc VFX
  if (particles) {
    const dx = nearest.x - deadEnemy.x;
    const dy = nearest.y - deadEnemy.y;
    const segments = 5;
    for (let i = 0; i < segments; i++) {
      const t = i / segments;
      const midX = deadEnemy.x + dx * t + (Math.random() - 0.5) * 20;
      const midY = deadEnemy.y + dy * t + (Math.random() - 0.5) * 20;
      particles.push({
        id: Date.now() + Math.random(),
        type: 'laser',
        x: midX,
        y: midY,
        vx: 0,
        vy: 0,
        life: 1.0,
        maxLife: 0.15,
        size: 2.5,
        color: '#a855f7',
        gravity: 0,
      });
    }
  }

  return true;
}

// ── Helper: Handle black hole on kill ────────────────────────
/**
 * Check for black hole proc on kill.
 * Pulls nearby enemies toward the death location.
 *
 * @param {object} deadEnemy - the enemy that just died
 * @param {Array}  enemies   - all enemies array (mutated for position)
 * @param {Array}  particles - particle array for VFX
 * @param {object} skillTree - skill tree state
 * @returns {boolean} whether black hole fired
 */
export function handleBlackHoleOnKill(deadEnemy, enemies, particles, skillTree) {
  if (!skillTree?.unlockedNodes?.black_hole) return false;

  const modifiers = getSkillModifiers(skillTree);
  const bhChance = modifiers.blackHoleChance || 0;
  if (bhChance <= 0 || Math.random() > bhChance) return false;

  const range = modifiers.blackHoleRange || 100;
  const pullStrength = modifiers.blackHolePullStrength || 30; // pixels

  let pulledCount = 0;

  for (const enemy of enemies) {
    if (enemy.dead || enemy.reachedEnd || enemy === deadEnemy) continue;

    const dx = enemy.x - deadEnemy.x;
    const dy = enemy.y - deadEnemy.y;
    const dist = Math.hypot(dx, dy);

    if (dist <= range && dist > 1) {
      // Pull enemy toward death location
      const pullFactor = pullStrength / dist;
      enemy.x -= dx * pullFactor;
      enemy.y -= dy * pullFactor;
      pulledCount++;
    }
  }

  // Emit black hole VFX (dark vortex ring)
  if (particles && pulledCount > 0) {
    particles.push({
      id: Date.now() + Math.random(),
      type: 'ring',
      x: deadEnemy.x,
      y: deadEnemy.y,
      vx: 0,
      vy: 0,
      maxLife: 0.8,
      size: range * 0.5,
      color: '#7c3aed',
      gravity: 0,
    });
    // Swirl particles
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12;
      const speed = 20 + Math.random() * 30;
      particles.push({
        id: Date.now() + Math.random(),
        type: 'spark',
        x: deadEnemy.x,
        y: deadEnemy.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        maxLife: 0.4 + Math.random() * 0.3,
        size: 2 + Math.random() * 2,
        color: '#a78bfa',
        gravity: 0,
      });
    }
  }

  return pulledCount > 0;
}

// ── Helper: Check time warp slow on shot ─────────────────────
/**
 * Check if time warp slow should be applied on a shot.
 * Track shot count per tower and apply slow every N shots.
 *
 * @param {object} skillTree  - current skill tree state
 * @param {object} tower      - the firing tower
 * @returns {object|null} slow effect data or null
 */
export function checkTimeWarpShot(skillTree, tower) {
  if (!skillTree?.unlockedNodes?.time_warp) return null;

  const modifiers = getSkillModifiers(skillTree);
  if (!modifiers.timeWarpShotInterval) return null;

  // Increment shot counter on tower
  if (!tower._timeWarpShotCount) {
    tower._timeWarpShotCount = 0;
  }
  tower._timeWarpShotCount++;

  // Check if this is the Nth shot
  if (tower._timeWarpShotCount % modifiers.timeWarpShotInterval !== 0) {
    return null;
  }

  return {
    slowAmount: modifiers.timeWarpSlowAmount || 0.5,
    slowDuration: modifiers.timeWarpSlowDuration || 1.0,
  };
}

// ── Internal helpers ─────────────────────────────────────────
function isIceTower(towerType) {
  return ['frost_bolt', 'blizzard', 'ice', 'crystalGuard'].includes(towerType);
}

function isPoisonTower(towerType) {
  return towerType === 'poison';
}
