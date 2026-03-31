// ============================================================
//  saveSystem.js
//  localStorage based save/load system.
//  Handles game state persistence, settings, achievements, and progression.
// ============================================================

import { WORLDS, getCurrentPathGrid, getWorldLevels, getTowerDef } from '../constants';

const STORAGE_KEYS = {
  GAME_STATE: 'towerdefense_gameState',
  SETTINGS: 'towerdefense_settings',
  STATS: 'towerdefense_stats',
  ACHIEVEMENTS: 'towerdefense_achievements',
  PROGRESS: 'towerdefense_progress',
};

// ── Default Values ───────────────────────────────────────────
const DEFAULT_SETTINGS = {
  masterVolume: 0.7,
  musicVolume: 0.5,
  sfxVolume: 0.8,
  showFps: false,
  particlesEnabled: true,
  screenShakeEnabled: true,
  autoStartWaves: false,
  tutorialCompleted: false,
  // Accessibility settings
  reducedMotion: false,
  colorblindMode: 'none', // 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'
  textSize: 'medium', // 'small' | 'medium' | 'large'
};

const DEFAULT_STATS = {
  totalWavesCompleted: 0,
  totalEnemiesKilled: 0,
  totalGoldEarned: 0,
  totalTowersBuilt: 0,
  totalTowersSold: 0,
  totalDamageDealt: 0,
  longestWave: 0,
  highestScore: 0,
  highestWave: 0,
  maxGold: 0,
  bossesKilled: 0,
  wavesSkipped: 0,
  fastestKillTime: Infinity,
  wavesWithoutDamage: 0,
  gamesWonNoDamage: 0,
  gamesPlayed: 0,
  gamesWon: 0,
  gameTimeSeconds: 0,
};

const ACHIEVEMENTS_LIST = {
  first_blood: {
    id: 'first_blood',
    name: 'First Blood',
    description: 'Kill your first enemy',
    icon: '🗡️',
    reward: 50,
    condition: (stats) => stats.totalEnemiesKilled >= 1,
  },
  fast_kill: {
    id: 'fast_kill',
    name: 'Speed Demon',
    description: 'Kill an enemy within 2 seconds of spawning',
    icon: '⚡',
    reward: 25,
    condition: (stats) => stats.fastestKillTime <= 2,
  },
  no_damage_wave: {
    id: 'no_damage_wave',
    name: 'Perfect Defense',
    description: 'Complete a wave without losing any lives',
    icon: '🛡️',
    reward: 100,
    condition: (stats) => stats.wavesWithoutDamage >= 1,
  },
  tower_master: {
    id: 'tower_master',
    name: 'Tower Master',
    description: 'Upgrade a tower to max level',
    icon: '⭐',
    reward: 200,
    condition: (stats) => stats.maxTowerLevel >= 4,
  },
  wave_champion: {
    id: 'wave_champion',
    name: 'Wave Champion',
    description: 'Complete wave 10',
    icon: '🏆',
    reward: 500,
    condition: (stats) => stats.highestWave >= 10,
  },
  wealthy: {
    id: 'wealthy',
    name: 'Wealthy',
    description: 'Accumulate 1000 gold at once',
    icon: '💰',
    reward: 100,
    condition: (stats) => stats.maxGold >= 1000,
  },
  boss_slayer: {
    id: 'boss_slayer',
    name: 'Boss Slayer',
    description: 'Defeat a boss enemy',
    icon: '👹',
    reward: 150,
    condition: (stats) => stats.bossesKilled >= 1,
  },
  fifty_kills: {
    id: 'fifty_kills',
    name: 'Massacre',
    description: 'Kill 50 enemies in total',
    icon: '💀',
    reward: 200,
    condition: (stats) => stats.totalEnemiesKilled >= 50,
  },
  hundred_waves: {
    id: 'hundred_waves',
    name: 'Endurance',
    description: 'Complete 100 waves',
    icon: '🌊',
    reward: 1000,
    condition: (stats) => stats.totalWavesCompleted >= 100,
  },
  perfect_game: {
    id: 'perfect_game',
    name: 'Perfect Game',
    description: 'Complete a game without losing any lives',
    icon: '💎',
    reward: 1000,
    condition: (stats) => stats.gamesWonNoDamage >= 1,
  },
  
  // ── NEW: Wave Milestones ─
  wave25: {
    id: 'wave25',
    name: 'Quarter Master',
    description: 'Complete wave 25',
    icon: '🎯',
    reward: 250,
    condition: (stats) => stats.highestWave >= 25,
  },
  wave50: {
    id: 'wave50',
    name: 'Half Century',
    description: 'Complete wave 50',
    icon: '🏅',
    reward: 500,
    condition: (stats) => stats.highestWave >= 50,
  },
  
  // ── NEW: Combat Achievements ─
  no_damage_10_waves: {
    id: 'no_damage_10_waves',
    name: 'Impenetrable',
    description: 'Complete 10 waves without taking damage',
    icon: '🔰',
    reward: 300,
    condition: (stats) => stats.wavesWithoutDamage >= 10,
  },
  kill_streak_50: {
    id: 'kill_streak_50',
    name: 'Onslaught',
    description: 'Kill 50 enemies in a single wave',
    icon: '🔥',
    reward: 400,
    condition: (stats) => stats.maxKillStreak >= 50,
  },
  boss_kill_no_lives: {
    id: 'boss_kill_no_lives',
    name: 'Clutch Victory',
    description: 'Defeat a boss with exactly 1 life remaining',
    icon: '⚔️',
    reward: 200,
    condition: (stats) => stats.bossKillsWithOneLife >= 1,
  },
  
  // ── NEW: Economy Achievements ─
  rich_5000: {
    id: 'rich_5000',
    name: 'Tycoon',
    description: 'Accumulate 5000 gold at once',
    icon: '💵',
    reward: 200,
    condition: (stats) => stats.maxGold >= 5000,
  },
  no_sells_20_waves: {
    id: 'no_sells_20_waves',
    name: 'Committed',
    description: 'Complete 20 waves without selling any towers',
    icon: '🤝',
    reward: 300,
    condition: (stats) => stats.wavesWithoutSelling >= 20,
  },
  
  // ── NEW: Tower Achievements ─
  max_level_5: {
    id: 'max_level_5',
    name: 'Master Builder',
    description: 'Upgrade a tower to level 5 (max)',
    icon: '🏗️',
    reward: 500,
    condition: (stats) => stats.maxTowerLevel >= 5,
  },
  ten_towers: {
    id: 'ten_towers',
    name: 'Fortress',
    description: 'Place 10 towers in a single game',
    icon: '🏰',
    reward: 150,
    condition: (stats) => stats.maxTowersPlaced >= 10,
  },
  
  // ── NEW: Special Enemy Achievements ─
  kill_brute: {
    id: 'kill_brute',
    name: 'Brute Slayer',
    description: 'Defeat a Brute enemy',
    icon: '💪',
    reward: 100,
    condition: (stats) => (stats.specialEnemiesKilled?.brute || 0) >= 1,
  },
  kill_phase: {
    id: 'kill_phase',
    name: 'Phase Breaker',
    description: 'Defeat a Phase Runner',
    icon: '👻',
    reward: 100,
    condition: (stats) => (stats.specialEnemiesKilled?.phase || 0) >= 1,
  },
  kill_juggernaut: {
    id: 'kill_juggernaut',
    name: 'Titan Killer',
    description: 'Defeat a Juggernaut',
    icon: '🦾',
    reward: 200,
    condition: (stats) => (stats.specialEnemiesKilled?.juggernaut || 0) >= 1,
  },
  kill_necromancer: {
    id: 'kill_necromancer',
    name: 'Exorcist',
    description: 'Defeat a Necromancer',
    icon: '☠️',
    reward: 150,
    condition: (stats) => (stats.specialEnemiesKilled?.necromancer || 0) >= 1,
  },
  
  // ── NEW: World Completion ─
  complete_forest: {
    id: 'complete_forest',
    name: 'Forest Champion',
    description: 'Complete all Forest World levels',
    icon: '🌲',
    reward: 500,
    condition: (stats) => stats.worldsCompleted?.forest >= 12,
  },
  complete_desert: {
    id: 'complete_desert',
    name: 'Desert Champion',
    description: 'Complete all Desert World levels',
    icon: '🏜️',
    reward: 600,
    condition: (stats) => (stats.worldsCompleted?.desert || 0) >= 12,
  },
  complete_ice: {
    id: 'complete_ice',
    name: 'Ice Champion',
    description: 'Complete all Ice World levels',
    icon: '❄️',
    reward: 700,
    condition: (stats) => (stats.worldsCompleted?.ice || 0) >= 12,
  },
  complete_volcanic: {
    id: 'complete_volcanic',
    name: 'Volcanic Champion',
    description: 'Complete all Volcanic World levels',
    icon: '🌋',
    reward: 800,
    condition: (stats) => (stats.worldsCompleted?.volcanic || 0) >= 12,
  },
  complete_cosmic: {
    id: 'complete_cosmic',
    name: 'Cosmic Champion',
    description: 'Complete all Cosmic World levels',
    icon: '🌌',
    reward: 1000,
    condition: (stats) => (stats.worldsCompleted?.cosmic || 0) >= 12,
  },
};

// ── Settings ────────────────────────────────────────────────
export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save settings:', e);
  }
}

export function loadSettings() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.warn('Failed to load settings:', e);
  }
  return { ...DEFAULT_SETTINGS };
}

// ── Game State ───────────────────────────────────────────────
export function saveGameState(state) {
  try {
    // Only save relevant game state (not functions/objects)
    const saveable = {
      money: state.money,
      lives: state.lives,
      wave: state.wave,
      score: state.score || 0,
      waveActive: !!state.waveActive,
      selectedTower: state.selectedTower || 'basic',
      selectedWorld: state.selectedWorld || null,
      selectedLevel: state.selectedLevel ?? null,
      gameMode: state.gameMode || 'campaign',
      towers: state.towers.map(t => ({
        id: t.id,
        defId: t.defId,
        col: t.col,
        row: t.row,
        level: t.level,
        x: t.x,
        y: t.y,
      })),
      placedTiles: Array.from(state.placedTiles),
      pathWaypoints: getCurrentPathGrid() ? getCurrentPathGrid().map(([c, r]) => [c, r]) : null,
      savedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(saveable));
    return true;
  } catch (e) {
    console.warn('Failed to save game:', e);
    return false;
  }
}

export function loadGameState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
    if (stored) {
      const state = JSON.parse(stored);
      
      // Check if save is valid (not too old, game was in progress)
      if (state.savedAt && Date.now() - state.savedAt < 24 * 60 * 60 * 1000) {
        if (!state.selectedTower) state.selectedTower = 'basic';
        if (!state.selectedWorld) state.selectedWorld = null;
        if (state.selectedLevel === undefined) state.selectedLevel = null;
        if (!state.gameMode) state.gameMode = 'campaign';
        return state;
      }
    }
  } catch (e) {
    console.warn('Failed to load game:', e);
  }
  return null;
}

export function clearSavedGame() {
  localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
}

// ── Stats ───────────────────────────────────────────────────
export function saveStats(stats) {
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch (e) {
    console.warn('Failed to save stats:', e);
  }
}

export function loadStats() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.STATS);
    if (stored) {
      return { ...DEFAULT_STATS, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.warn('Failed to load stats:', e);
  }
  return { ...DEFAULT_STATS };
}

export function updateStats(updates) {
  const stats = loadStats();
  const updated = { ...stats, ...updates };
  saveStats(updated);
  return updated;
}

// ── Achievements ─────────────────────────────────────────────
export function getAchievements() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    if (stored) {
      const parsed = JSON.parse(stored);
      const achievements = {};
      for (const [key, ach] of Object.entries(ACHIEVEMENTS_LIST)) {
        achievements[key] = {
          ...ach,
          unlocked: false,
          unlockedAt: null,
          claimed: false,
          ...(parsed[key] || {}),
        };
      }
      return achievements;
    }
  } catch (e) {
    console.warn('Failed to load achievements:', e);
  }
  
  // Initialize with all achievements as unlocked: false
  const achievements = {};
  for (const [key, ach] of Object.entries(ACHIEVEMENTS_LIST)) {
    achievements[key] = {
      ...ach,
      unlocked: false,
      unlockedAt: null,
      claimed: false,
    };
  }
  return achievements;
}

export function checkAndUnlockAchievements(stats, currentGold) {
  const achievements = getAchievements();
  let newUnlock = false;
  let totalReward = 0;
  
  for (const [key, ach] of Object.entries(achievements)) {
    if (!ach.unlocked && ACHIEVEMENTS_LIST[key].condition(stats)) {
      achievements[key].unlocked = true;
      achievements[key].unlockedAt = Date.now();
      totalReward += ach.reward;
      newUnlock = true;
      console.log(`🎉 Achievement Unlocked: ${ach.name}!`);
    }
  }
  
  if (newUnlock) {
    try {
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    } catch (e) {
      console.warn('Failed to save achievements:', e);
    }
  }
  
  return { achievements, reward: totalReward };
}

export function claimAchievementReward(achievementId) {
  const achievements = getAchievements();
  const ach = achievements[achievementId];
  
  if (ach && ach.unlocked && !ach.claimed) {
    achievements[achievementId].claimed = true;
    try {
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    } catch (e) {
      console.warn('Failed to save achievement claim:', e);
    }
    return ACHIEVEMENTS_LIST[achievementId].reward;
  }
  return 0;
}

export function getAchievementList() {
  return ACHIEVEMENTS_LIST;
}

// ── Progression System ───────────────────────────────────────
// Get default progression state
function getDefaultProgress() {
  const progress = {
    currentWorld: 'forest',
    completedWorlds: [],
    levels: {},
    unlockedTowers: ['basic', 'splash', 'ice', 'sniper', 'poison'],
    totalStars: 0,
    lastUpdated: Date.now(),
    
    // ── NEW: Meta-Upgrades (Persistent Bonuses) ─
    metaUpgrades: {
      // Gold bonus at game start
      startingGold: {
        level1: false,  // +50 gold
        level2: false,  // +100 gold (total)
        level3: false,  // +200 gold (total)
      },
      // Lives bonus at game start
      startingLives: {
        level1: false,  // +5 lives
        level2: false,  // +10 lives (total)
      },
      // Tower discount
      towerDiscount: {
        level1: false,  // 5% discount
        level2: false,   // 10% discount
        level3: false,  // 15% discount
      },
      // Enemy gold bonus
      enemyReward: {
        level1: false,  // +10% gold
        level2: false,  // +20% gold
      },
      // Wave clear bonus
      waveBonus: {
        level1: false,  // +20 gold per wave
        level2: false,  // +40 gold per wave
      },
    },
    // ── NEW: Cosmetics unlocked
    cosmetics: {
      towerSkins: {
        gold: false,
        crystal: false,
        void: false,
        rainbow: false,
      },
      projectileEffects: {
        fire: false,
        ice: false,
        electric: false,
      },
      killEffects: {
        confetti: false,
        smoke: false,
        explosion: false,
      },
    },
  };
  
  // Initialize all levels with default values
  const worldOrder = ['forest', 'desert', 'ice', 'volcanic', 'cosmic'];
  worldOrder.forEach(worldId => {
    const world = WORLDS[worldId];
    if (world) {
      for (let i = 1; i <= world.levelCount; i++) {
        progress.levels[`${worldId}_${i}`] = {
          stars: 0,
          completed: false,
          highScore: 0,
          attempts: 0,
        };
      }
    }
  });
  
  return progress;
}

// Save progression state
export function saveProgression(progress) {
  try {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify({
      ...progress,
      lastUpdated: Date.now(),
    }));
    return true;
  } catch (e) {
    console.warn('Failed to save progression:', e);
    return false;
  }
}

// Load progression state
export function loadProgression() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (stored) {
      const progress = JSON.parse(stored);
      // Merge with default to handle new worlds/levels
      const defaultProgress = getDefaultProgress();
      const mergedMetaUpgrades = {};
      for (const [upgradeId, levels] of Object.entries(defaultProgress.metaUpgrades || {})) {
        mergedMetaUpgrades[upgradeId] = {
          ...levels,
          ...(progress.metaUpgrades?.[upgradeId] || {}),
        };
      }
      const mergedCosmetics = {};
      for (const [category, items] of Object.entries(defaultProgress.cosmetics || {})) {
        mergedCosmetics[category] = {
          ...items,
          ...(progress.cosmetics?.[category] || {}),
        };
      }
      return {
        ...defaultProgress,
        ...progress,
        levels: {
          ...defaultProgress.levels,
          ...(progress.levels || {}),
        },
        metaUpgrades: mergedMetaUpgrades,
        cosmetics: mergedCosmetics,
      };
    }
  } catch (e) {
    console.warn('Failed to load progression:', e);
  }
  return getDefaultProgress();
}

// Check if a world is unlocked
export function isWorldUnlocked(worldId, progression = null) {
  if (!progression) progression = loadProgression();
  
  const world = WORLDS[worldId];
  if (!world) return false;
  
  // First world is always unlocked
  if (!world.unlockRequirement) return true;
  
  // Check if previous world requirement is met
  const { world: prevWorld, level } = world.unlockRequirement;
  const levelKey = `${prevWorld}_${level}`;
  const levelProgress = progression.levels[levelKey];
  
  return levelProgress && levelProgress.completed;
}

// Check if a level is unlocked
export function isLevelUnlocked(worldId, levelNum, progression = null) {
  if (!progression) progression = loadProgression();
  
  // First level is always unlocked
  if (levelNum === 1) return true;
  
  // Check if previous level is completed
  const prevLevelKey = `${worldId}_${levelNum - 1}`;
  const prevLevel = progression.levels[prevLevelKey];
  
  return prevLevel && prevLevel.completed;
}

// Get level progress
export function getLevelProgress(worldId, levelNum, progression = null) {
  if (!progression) progression = loadProgression();
  const levelKey = `${worldId}_${levelNum}`;
  return progression.levels[levelKey] || { stars: 0, completed: false, highScore: 0, attempts: 0 };
}

// Complete a level and save progress
export function completeLevel(worldId, levelNum, score, enemiesKilled, totalEnemies, towersBuilt, wave) {
  const progression = loadProgression();
  const levelKey = `${worldId}_${levelNum}`;
  const world = WORLDS[worldId];
  
  // Calculate stars based on performance
  let stars = 0;
  if (totalEnemies > 0) {
    const killRatio = enemiesKilled / totalEnemies;
    if (killRatio >= 1.0) stars = 3;
    else if (killRatio >= 0.75) stars = 2;
    else if (killRatio >= 0.5) stars = 1;
  }
  
  // Update level progress
  const currentLevel = progression.levels[levelKey] || {};
  const newLevelProgress = {
    stars: Math.max(currentLevel.stars || 0, stars),
    completed: true,
    highScore: Math.max(currentLevel.highScore || 0, score),
    attempts: (currentLevel.attempts || 0) + 1,
  };
  progression.levels[levelKey] = newLevelProgress;
  progression.totalStars = Object.values(progression.levels).reduce((sum, lp) => sum + (lp.stars || 0), 0);
  
  // Update current world if needed
  if (levelNum >= world.levelCount && !progression.completedWorlds.includes(worldId)) {
    progression.completedWorlds.push(worldId);
    
    // Check for next world unlock
    const worldIndex = Object.keys(WORLDS).indexOf(worldId);
    const nextWorldId = Object.keys(WORLDS)[worldIndex + 1];
    if (nextWorldId) {
      progression.currentWorld = nextWorldId;
    }
  } else if (progression.currentWorld === worldId && levelNum < world.levelCount) {
    progression.currentWorld = worldId;
  }
  
  // Unlock new towers based on level
  const level = getWorldLevels(worldId)?.[levelNum];
  if (level && level.availableTowers) {
    level.availableTowers.forEach(towerId => {
      const tower = getTowerDef(towerId);
      if (tower && !progression.unlockedTowers.includes(towerId)) {
        progression.unlockedTowers.push(towerId);
      }
    });
  }
  
  saveProgression(progression);
  return { stars, levelProgress: newLevelProgress, progression };
}

// Reset progression (for new game)
export function resetProgression() {
  const freshProgress = getDefaultProgress();
  saveProgression(freshProgress);
  return freshProgress;
}

// Get all worlds with their unlock status
export function getWorldsWithStatus(progression = null) {
  if (!progression) progression = loadProgression();
  
  const worldOrder = ['forest', 'desert', 'ice', 'volcanic', 'cosmic'];
  return worldOrder.map(worldId => {
    const world = WORLDS[worldId];
    const unlocked = isWorldUnlocked(worldId, progression);
    const completed = progression.completedWorlds.includes(worldId);
    
    // Calculate stars for this world
    let worldStars = 0;
    let levelsCompleted = 0;
    for (let i = 1; i <= world.levelCount; i++) {
      const levelProgress = getLevelProgress(worldId, i, progression);
      worldStars += levelProgress.stars || 0;
      if (levelProgress.completed) levelsCompleted++;
    }
    
    return {
      ...world,
      unlocked,
      completed,
      stars: worldStars,
      maxStars: world.levelCount * 3,
      levelsCompleted,
    };
  });
}

// Get levels for a specific world
export function getLevelsWithStatus(worldId, progression = null) {
  if (!progression) progression = loadProgression();
  
  const world = WORLDS[worldId];
  if (!world) return [];
  
  const levels = [];
  for (let i = 1; i <= world.levelCount; i++) {
    const levelKey = `${worldId}_${i}`;
    const levelProgress = progression.levels[levelKey] || { stars: 0, completed: false, highScore: 0, attempts: 0 };
    const unlocked = isLevelUnlocked(worldId, i, progression);
    
    levels.push({
      level: i,
      unlocked,
      stars: levelProgress.stars || 0,
      completed: levelProgress.completed || false,
      highScore: levelProgress.highScore || 0,
      attempts: levelProgress.attempts || 0,
    });
  }
  
  return levels;
}

// Check if new world unlocked (for showing story modal)
export function checkNewWorldUnlocked(oldProgress, newProgress) {
  const oldCompleted = oldProgress?.completedWorlds || [];
  const newCompleted = newProgress?.completedWorlds || [];
  
  for (const worldId of newCompleted) {
    if (!oldCompleted.includes(worldId)) {
      return worldId;
    }
  }
  return null;
}

// ── Export All Data (for debugging/backup) ───────────────────
export function exportAllData() {
  return {
    settings: loadSettings(),
    stats: loadStats(),
    achievements: getAchievements(),
    gameState: loadGameState(),
    exportedAt: Date.now(),
  };
}

export function importAllData(data) {
  try {
    if (data.settings) saveSettings(data.settings);
    if (data.stats) saveStats(data.stats);
    if (data.achievements) {
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(data.achievements));
    }
    return true;
  } catch (e) {
    console.warn('Failed to import data:', e);
    return false;
  }
}

// ── Clear All Data ───────────────────────────────────────────
export function clearAllData() {
  localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  localStorage.removeItem(STORAGE_KEYS.STATS);
  localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
  console.log('All game data cleared');
}

// ── Meta-Upgrade System ──────────────────────────────────────────
// Cost definition for meta-upgrades
export const META_UPGRADE_COSTS = {
  startingGold: {
    level1: { cost: 1000, bonus: 50 },
    level2: { cost: 2500, bonus: 100 },
    level3: { cost: 5000, bonus: 200 },
  },
  startingLives: {
    level1: { cost: 1500, bonus: 5 },
    level2: { cost: 3500, bonus: 10 },
  },
  towerDiscount: {
    level1: { cost: 2000, bonus: 5 },
    level2: { cost: 4000, bonus: 10 },
    level3: { cost: 8000, bonus: 15 },
  },
  enemyReward: {
    level1: { cost: 2500, bonus: 10 },
    level2: { cost: 5000, bonus: 20 },
  },
  waveBonus: {
    level1: { cost: 3000, bonus: 20 },
    level2: { cost: 6000, bonus: 40 },
  },
};

// Get current meta-upgrade bonuses
export function getMetaUpgradeBonuses(progression = null) {
  if (!progression) progression = loadProgression();
  const meta = progression.metaUpgrades || {};
  
  return {
    startingGold: (
      (meta.startingGold?.level1 ? 50 : 0) +
      (meta.startingGold?.level2 ? 100 : 0) +
      (meta.startingGold?.level3 ? 200 : 0)
    ),
    startingLives: (
      (meta.startingLives?.level1 ? 5 : 0) +
      (meta.startingLives?.level2 ? 10 : 0)
    ),
    towerDiscount: (
      (meta.towerDiscount?.level1 ? 5 : 0) +
      (meta.towerDiscount?.level2 ? 10 : 0) +
      (meta.towerDiscount?.level3 ? 15 : 0)
    ),
    enemyReward: (
      (meta.enemyReward?.level1 ? 10 : 0) +
      (meta.enemyReward?.level2 ? 20 : 0)
    ),
    waveBonus: (
      (meta.waveBonus?.level1 ? 20 : 0) +
      (meta.waveBonus?.level2 ? 40 : 0)
    ),
  };
}

// Purchase meta-upgrade
export function purchaseMetaUpgrade(upgradeId, level, currentGold) {
  const costs = META_UPGRADE_COSTS[upgradeId];
  if (!costs || !costs[level]) return { success: false, reason: 'Invalid upgrade' };
  
  const cost = costs[level].cost;
  if (currentGold < cost) return { success: false, reason: 'Not enough gold' };
  
  const progression = loadProgression();
  if (progression.metaUpgrades?.[upgradeId]?.[level]) {
    return { success: false, reason: 'Already purchased' };
  }
  
  // Mark as purchased
  if (!progression.metaUpgrades) progression.metaUpgrades = {};
  if (!progression.metaUpgrades[upgradeId]) progression.metaUpgrades[upgradeId] = {};
  progression.metaUpgrades[upgradeId][level] = true;
  
  saveProgression(progression);
  return { success: true, cost };
}

// ── Cosmetics System ─────────────────────────────────────────────
export const COSMETIC_COSTS = {
  towerSkins: {
    gold: { cost: 500, name: 'Golden' },
    crystal: { cost: 1000, name: 'Crystal' },
    void: { cost: 2000, name: 'Void' },
    rainbow: { cost: 3000, name: 'Rainbow' },
  },
  projectileEffects: {
    fire: { cost: 800, name: 'Fire Trail' },
    ice: { cost: 800, name: 'Ice Crystals' },
    electric: { cost: 1000, name: 'Lightning' },
  },
  killEffects: {
    confetti: { cost: 500, name: 'Confetti' },
    smoke: { cost: 500, name: 'Smoke' },
    explosion: { cost: 1200, name: 'Explosion' },
  },
};

// Purchase cosmetic
export function purchaseCosmetic(category, itemId, currentGold) {
  const costs = COSMETIC_COSTS[category];
  if (!costs || !costs[itemId]) return { success: false, reason: 'Invalid cosmetic' };
  
  const cost = costs[itemId].cost;
  if (currentGold < cost) return { success: false, reason: 'Not enough gold' };
  
  const progression = loadProgression();
  if (progression.cosmetics?.[category]?.[itemId]) {
    return { success: false, reason: 'Already owned' };
  }
  
  // Mark as owned
  if (!progression.cosmetics) progression.cosmetics = {};
  if (!progression.cosmetics[category]) progression.cosmetics[category] = {};
  progression.cosmetics[category][itemId] = true;
  
  saveProgression(progression);
  return { success: true, cost };
}

// Default export
export default {
  saveSettings,
  loadSettings,
  saveGameState,
  loadGameState,
  clearSavedGame,
  saveStats,
  loadStats,
  updateStats,
  getAchievements,
  checkAndUnlockAchievements,
  claimAchievementReward,
  getAchievementList,
  exportAllData,
  importAllData,
  clearAllData,
  // Progression functions
  saveProgression,
  loadProgression,
  isWorldUnlocked,
  isLevelUnlocked,
  getLevelProgress,
  completeLevel,
  resetProgression,
  getWorldsWithStatus,
  getLevelsWithStatus,
  checkNewWorldUnlocked,
};
