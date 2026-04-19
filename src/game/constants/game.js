// ============================================================
//  GAME.JS
//  Game constants, screen states, and progression
// ============================================================

import { WAYPOINTS_GRID } from './paths';
import { TOWER_DEFS } from './towers';

export const STARTING_MONEY = 150;
export const STARTING_HEALTH = 20;
export const SELL_REFUND_PCT = 0.6; // 60% refund on sell

// â”€â”€ Event System â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const EVENT_WAVES = {
  // Double gold weekend
  doubleGold: {
    trigger: 'weekend',
    effect: { goldMultiplier: 2.0 },
    description: 'All enemy kills worth 2x gold!',
    icon: 'ðŸ’°',
  },
  // Time attack mode
  timeAttack: {
    trigger: 'manual',
    effect: { spawnRate: 1.5, waveTimeLimit: 60 },
    description: 'Kill all enemies in 60 seconds!',
    reward: { gold: 200, unlock: 'timeAttackMode' },
    icon: 'â±ï¸',
  },
  // Treasure wave - bonus drops
  treasure: {
    trigger: 'random',
    chance: 0.05,
    effect: { bonusDrops: true },
    description: 'Treasure chests spawn!',
    drops: ['gold', 'powerup', 'cosmetic'],
    icon: 'ðŸŽ',
  },
};

// Secret bonus rounds
export const SECRET_BONUSES = {
  bananaGlitch: {
    trigger: { wave: 7, lives: 7 },
    effect: 'bananaArmy',
    description: 'ðŸ’ BANANA ARMY ATTACKS!',
    reward: 500,
    enemies: { type: 'fast', count: 77, color: '#FFEB3B' },
  },
  bossRush: {
    trigger: { wave: 10, noLivesLost: true },
    effect: 'consecutiveBosses',
    description: 'BOSS RUSH! 3 bosses in a row!',
    reward: 1000,
    bossCount: 3,
  },
};

// Alternative game modes
export const ALTERNATIVE_MODES = {
  survival: {
    id: 'survival',
    name: 'Survival',
    description: 'Endless until death - how far can you go?',
    condition: 'lives > 0',
    score: 'wavesCompleted',
    unlock: { achievement: 'survival_unlocked' },
  },
  speedrun: {
    id: 'speedrun',
    name: 'Speedrun',
    description: 'Finish level as fast as possible',
    condition: 'levelComplete',
    score: 'timeSeconds',
    tracking: 'bestTime',
    unlock: { achievement: 'speedrun_unlocked' },
  },
  perfect: {
    id: 'perfect',
    name: 'Perfect',
    description: 'No damage allowed - pure skill',
    condition: 'lives === startingLives',
    score: 'waveNumber * 100',
    bonus: 'waveClearBonus',
    unlock: { achievement: 'perfect_unlocked' },
  },
  thrifty: {
    id: 'thrifty',
    name: 'Thrifty',
    description: 'Minimal spending challenge',
    condition: 'goldSpent < 500',
    score: 'goldRemaining',
    tracking: 'bestRemaining',
    unlock: { achievement: 'thrifty_unlocked' },
  },
};

// â”€â”€ Game States â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const GAME_STATE = {
  IDLE: 'idle', // before first wave
  RUNNING: 'running',
  PAUSED: 'paused',
  GAMEOVER: 'gameover',
  VICTORY: 'victory',
};

// Ã¢â€â‚¬Ã¢â€â‚¬ World Progression Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
function offsetWaypoints(waypoints, dx = 0, dy = 0) {
  return waypoints.map(([c, r]) => [c + dx, r + dy]);
}

export const WORLD_ORDER = ['forest', 'desert', 'ice', 'volcanic', 'cosmic'];

export const WORLD_DEFS = {
  forest: {
    id: 'forest',
    label: 'Forest World',
    shortLabel: 'Forest',
    levelCount: 12,
    theme: {
      terrain: '#2d5a1b',
      terrainAlt: '#3a7a24',
      path: '#9bb36a',
      pathEdge: '#738b4f',
      sky: 'linear-gradient(180deg, #0b1f12 0%, #18361f 58%, #09120d 100%)',
      accent: '#86efac',
      ui: '#22c55e',
    },
    intro:
      'The forest path is alive with movement. Protect the heart grove and unlock the first arsenal.',
    enemyPool: ['normal', 'fast', 'healer', 'sproutling', 'briar_runner', 'treant'],
    towerUnlocks: ['basic', 'splash', 'archer', 'trapper', 'sentinel'],
    availableTowers: ['basic', 'splash', 'archer', 'trapper', 'sentinel'],
    pathVariants: [
      { id: 'canopy', waypoints: WAYPOINTS_GRID },
      { id: 'root-run', waypoints: offsetWaypoints(WAYPOINTS_GRID, 0, 0) },
    ],
  },
  desert: {
    id: 'desert',
    label: 'Desert World',
    shortLabel: 'Desert',
    levelCount: 12,
    unlockRequirement: { world: 'forest', level: 12 },
    theme: {
      terrain: '#8d6e2f',
      terrainAlt: '#a57f36',
      path: '#e3c07a',
      pathEdge: '#c08f3d',
      sky: 'linear-gradient(180deg, #2a1506 0%, #6b3f11 55%, #241002 100%)',
      accent: '#fbbf24',
      ui: '#f59e0b',
    },
    intro: 'Heat shimmers over the dunes. Fast raiders test your defenses with relentless speed.',
    enemyPool: ['fast', 'shielded', 'normal', 'dune_runner', 'sand_wasp', 'sand_sentinel'],
    towerUnlocks: ['flamethrower', 'sandweaver', 'dune_crawler', 'basic', 'splash'],
    availableTowers: ['flamethrower', 'sandweaver', 'dune_crawler'],
    pathVariants: [
      { id: 'dune-road', waypoints: offsetWaypoints(WAYPOINTS_GRID, 0, 0) },
      { id: 'oasis', waypoints: offsetWaypoints(WAYPOINTS_GRID, 0, 0) },
    ],
  },
  ice: {
    id: 'ice',
    label: 'Ice World',
    shortLabel: 'Ice',
    levelCount: 12,
    unlockRequirement: { world: 'desert', level: 12 },
    theme: {
      terrain: '#294a7a',
      terrainAlt: '#3e6ea8',
      path: '#d4e5ff',
      pathEdge: '#8fb3e8',
      sky: 'linear-gradient(180deg, #07111e 0%, #14355c 58%, #07101c 100%)',
      accent: '#93c5fd',
      ui: '#38bdf8',
    },
    intro: 'Frozen winds slow everything except the enemy advance. Time your barrages carefully.',
    enemyPool: ['normal', 'tank', 'shielded', 'frostling', 'glacier_brute', 'ice_wisp'],
    towerUnlocks: ['frost_bolt', 'blizzard', 'crystal_guard', 'basic', 'ice'],
    availableTowers: ['frost_bolt', 'blizzard', 'crystal_guard'],
    pathVariants: [
      { id: 'ice-ridge', waypoints: offsetWaypoints(WAYPOINTS_GRID, 0, 0) },
      { id: 'glacier-loop', waypoints: offsetWaypoints(WAYPOINTS_GRID, 0, 0) },
    ],
  },
  volcanic: {
    id: 'volcanic',
    label: 'Volcanic World',
    shortLabel: 'Volcano',
    levelCount: 12,
    unlockRequirement: { world: 'ice', level: 12 },
    theme: {
      terrain: '#4a1c16',
      terrainAlt: '#6b2118',
      path: '#f59e0b',
      pathEdge: '#dc2626',
      sky: 'linear-gradient(180deg, #170406 0%, #50140d 55%, #090102 100%)',
      accent: '#fb7185',
      ui: '#ef4444',
    },
    intro:
      'Magma spills across the field as the ground itself fights back. Hold firm against the heat.',
    enemyPool: ['fast', 'tank', 'healer', 'ember_imp', 'lava_brute', 'ash_mage'],
    towerUnlocks: ['magma_cannon', 'geyser', 'lava_golem', 'basic', 'splash'],
    availableTowers: ['magma_cannon', 'geyser', 'lava_golem'],
    pathVariants: [
      { id: 'lava-stream', waypoints: offsetWaypoints(WAYPOINTS_GRID, 0, 0) },
      { id: 'ash-trail', waypoints: offsetWaypoints(WAYPOINTS_GRID, 0, 0) },
    ],
  },
  cosmic: {
    id: 'cosmic',
    label: 'Cosmic World',
    shortLabel: 'Cosmic',
    levelCount: 12,
    unlockRequirement: { world: 'volcanic', level: 12 },
    theme: {
      terrain: '#25163f',
      terrainAlt: '#3a2460',
      path: '#c4b5fd',
      pathEdge: '#8b5cf6',
      sky: 'radial-gradient(circle at top, #2f1c5d 0%, #12101f 55%, #05040a 100%)',
      accent: '#d8b4fe',
      ui: '#a855f7',
    },
    intro:
      'The last world bends light and time. Only the strongest towers can survive what comes next.',
    enemyPool: ['shielded', 'boss', 'voidling', 'star_cruiser', 'eclipse_boss'],
    towerUnlocks: ['plasma', 'void_eye', 'star_forge', 'basic', 'sniper'],
    availableTowers: ['plasma', 'void_eye', 'star_forge'],
    pathVariants: [
      { id: 'orbit', waypoints: offsetWaypoints(WAYPOINTS_GRID, 0, 0) },
      { id: 'nebula', waypoints: offsetWaypoints(WAYPOINTS_GRID, 0, 0) },
    ],
  },
};

// ── Derived World Exports ─────────────────────────────────────
export const WORLDS = WORLD_DEFS;
export const WORLD_PATH_VARIANTS = Object.fromEntries(
  Object.entries(WORLD_DEFS).map(([worldId, world]) => [worldId, world.pathVariants])
);
export const WORLD_TOWER_UNLOCKS = Object.fromEntries(
  Object.entries(WORLD_DEFS).map(([worldId, world]) => [worldId, world.towerUnlocks])
);
export const WORLD_LEVELS = Object.fromEntries(
  Object.entries(WORLD_DEFS).map(([worldId, world]) => [worldId, world.levelCount])
);

export function getTowerDef(towerId) {
  return TOWER_DEFS[towerId] || null;
}

export function getLevel(worldId, levelNum) {
  const world = WORLD_DEFS[worldId];
  if (!world || levelNum < 1 || levelNum > world.levelCount) return null;
  return { worldId, levelNum, theme: world.theme, enemyPool: world.enemyPool };
}

// ── Game Screen States ────────────────────────────────────────

export const SCREEN_STATE = {
  MAIN_MENU: 'mainMenu',
  WORLD_SELECT: 'worldSelect',
  LEVEL_SELECT: 'levelSelect',
  GAME: 'game',
  SETTINGS: 'settings',
};

// â”€â”€ Progression Constants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const PROGRESS = {
  MAX_STARS_PER_LEVEL: 3,
  STAR_THRESHOLDS: {
    ONE_STAR: 0.5, // 50% of enemies killed
    TWO_STARS: 0.75, // 75% of enemies killed
    THREE_STARS: 1.0, // 100% of enemies killed (or all)
  },
  LEVEL_UNLOCK_THRESHOLD: 3, // Need 3 stars to unlock next world
};

// â”€â”€ Story Segments â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const WORLD_STORIES = {
  forest: {
    intro: {
      title: 'The Ancient Forest',
      text: 'You arrive at the edge of the ancient forest, where goblin tribes and magical creatures dwell. The kingdom needs you to clear this land of monsters to establish a new fortress.',
      buttonText: 'Enter the Forest',
    },
    completion: {
      title: 'Forest Conquered!',
      text: 'You have defeated the guardian of the forest and brought peace to the woodland realm. But a new threat emerges from beyond the desert sands...',
      buttonText: 'Continue to Desert',
    },
  },
  desert: {
    intro: {
      title: 'The Scorched Sands',
      text: "Beyond the forest lies the endless desert, home to ancient tombs and deadly scorpions. The Pharaoh's treasure awaits those brave enough to claim it.",
      buttonText: 'Enter the Desert',
    },
    completion: {
      title: 'Desert Mastered!',
      text: 'The Scorpion King and Pharaoh have been defeated. The desert is yours. But the frozen peaks call to you, hiding an ancient evil within the ice...',
      buttonText: 'Continue to Ice World',
    },
  },
  ice: {
    intro: {
      title: 'The Frozen Peaks',
      text: 'The ice world is a treacherous place where frost giants and ice dragons rule. Only the strongest can survive the eternal winter.',
      buttonText: 'Scale the Ice',
    },
    completion: {
      title: 'Ice World Frozen!',
      text: 'The Ice Dragon has fallen, and the frozen peaks are safe at last. But deep within the volcanic mountains, even greater dangers await...',
      buttonText: 'Journey to Volcanic World',
    },
  },
  volcanic: {
    intro: {
      title: 'The Molten Depths',
      text: 'Volcanic mountains loom with fire demons and lava golems. The heat is unbearable, but the secrets within are worth any price.',
      buttonText: 'Enter the Volcano',
    },
    completion: {
      title: 'Volcano Vanquished!',
      text: 'The Demon King has been banished back to the depths. The final frontier awaits - the cosmic void itself, where ancient entities of unimaginable power dwell...',
      buttonText: 'Enter the Cosmic Void',
    },
  },
  cosmic: {
    intro: {
      title: 'The Cosmic Void',
      text: 'Beyond the stars lies the cosmic void, where darkness consumes all. Only here can you face the ultimate evil and save all worlds.',
      buttonText: 'Enter the Cosmos',
    },
    completion: {
      title: 'Cosmic Champion!',
      text: 'You have defeated the Cosmic Destroyer and saved the universe! Your legend will be told for eternity across all worlds.',
      buttonText: 'Victory!',
    },
  },
};
