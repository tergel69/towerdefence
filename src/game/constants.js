// ============================================================
//  CONSTANTS.JS
//  Central config for the entire game. Edit values here to
//  tweak gameplay without touching logic files.
// ============================================================

// ── Grid ────────────────────────────────────────────────────
export const TILE_SIZE = 48;   // pixels per tile
export const COLS     = 20;    // grid width  (tiles)
export const ROWS     = 14;    // grid height (tiles)

export const CANVAS_WIDTH  = COLS * TILE_SIZE;  // 960px
export const CANVAS_HEIGHT = ROWS * TILE_SIZE;  // 672px

// ── World System ───────────────────────────────────────────
export const WORLDS = {
  forest: {
    id: 'forest',
    name: 'Forest World',
    description: 'The ancient woods hold many secrets...',
    storyIntro: 'You enter the ancient forest where goblins and treants dwell. The path is lined with mysterious mushrooms and glowing lights.',
    themeColor: '#2d5a1b',
    colors: {
      terrain: '#2d5a1b',
      terrainLight: '#3a7a24',
      terrainDark: '#1e3d12',
      path: '#c8a96e',
      pathEdge: '#a8845a',
      background: '#1a2f1a',
      accent: '#4ade80',
      sky: '#87CEEB',
      decoration: '#228B22',
    },
    unlockRequirement: null, // First world, always unlocked
    levelCount: 12,
    difficulty: 1.0,
  },
  desert: {
    id: 'desert',
    name: 'Desert World',
    description: 'Scorching sands hide ancient treasures...',
    storyIntro: 'Beyond the forest lies the endless desert. Sand wyrms and scorpion warriors guard the ancient ruins buried in the dunes.',
    themeColor: '#d4a574',
    colors: {
      terrain: '#d4a574',
      terrainLight: '#e8c99b',
      terrainDark: '#b8956e',
      path: '#c9b896',
      pathEdge: '#a89876',
      background: '#8b7355',
      accent: '#fbbf24',
      sky: '#87CEEB',
      decoration: '#daa520',
    },
    unlockRequirement: { world: 'forest', level: 5 },
    levelCount: 12,
    difficulty: 1.3,
  },
  ice: {
    id: 'ice',
    name: 'Ice World',
    description: 'Frozen peaks challenge all who dare enter...',
    storyIntro: 'The icy mountains are home to frost giants and snow elementals. The frozen path crackles beneath every step.',
    themeColor: '#81d4fa',
    colors: {
      terrain: '#81d4fa',
      terrainLight: '#b3e5fc',
      terrainDark: '#4fc3f7',
      path: '#e0e0e0',
      pathEdge: '#bdbdbd',
      background: '#455a64',
      accent: '#00bcd4',
      sky: '#b3e5fc',
      decoration: '#ffffff',
    },
    unlockRequirement: { world: 'desert', level: 5 },
    levelCount: 12,
    difficulty: 1.6,
  },
  volcanic: {
    id: 'volcanic',
    name: 'Volcanic World',
    description: 'Molten rivers and fire demons await...',
    storyIntro: 'Deep within the volcanic mountains, fire elementals and lava golems reign supreme. The heat is unbearable for the unprepared.',
    themeColor: '#ff5722',
    colors: {
      terrain: '#5d4037',
      terrainLight: '#795548',
      terrainDark: '#3e2723',
      path: '#ff5722',
      pathEdge: '#bf360c',
      background: '#212121',
      accent: '#ff9800',
      sky: '#ff7043',
      decoration: '#ffab91',
    },
    unlockRequirement: { world: 'ice', level: 5 },
    levelCount: 12,
    difficulty: 2.0,
  },
  cosmic: {
    id: 'cosmic',
    name: 'Cosmic World',
    description: 'Beyond the stars, darkness consumes all...',
    storyIntro: 'The cosmic void holds ancient cosmic entities of unimaginable power. Only the bravest heroes can face the darkness between worlds.',
    themeColor: '#7c4dff',
    colors: {
      terrain: '#1a1a2e',
      terrainLight: '#16213e',
      terrainDark: '#0f0f23',
      path: '#7c4dff',
      pathEdge: '#536dfe',
      background: '#0a0a15',
      accent: '#e040fb',
      sky: '#311b92',
      decoration: '#b388ff',
    },
    unlockRequirement: { world: 'volcanic', level: 5 },
    levelCount: 12,
    difficulty: 2.5,
  },
};

// ── Colors (Base/Forest theme by default) ───────────────────
export const COLORS = {
  grass:      '#2d5a1b',
  grassLight: '#3a7a24',
  path:       '#c8a96e',
  pathEdge:   '#a8845a',
  gridLine:   'rgba(0,0,0,0.08)',

  // Tower colors
  towerBase:    '#374151',
  towerBasic:   '#60a5fa',
  towerSplash:  '#f97316',
  towerRange:   'rgba(255,255,255,0.07)',
  towerRangeHover: 'rgba(255,255,255,0.15)',

  // Enemy colors
  enemyNormal:  '#ef4444',
  enemyFast:    '#a855f7',
  enemyTank:    '#78716c',
  healthBarBg:  'rgba(0,0,0,0.5)',
  healthBarFg:  '#22c55e',
  healthBarLow: '#ef4444',

  // Projectile colors
  bulletBasic:  '#facc15',
  bulletSplash: '#fb923c',
  splashRadius: 'rgba(251,146,60,0.25)',

  // UI overlays
  uiDark:   'rgba(0,0,0,0.55)',
  white:    '#ffffff',
  gold:     '#fbbf24',
};

// ── Path (grid coordinates [col, row]) ──────────────────────
// Enemies walk FROM index 0 TO the last index
const DEFAULT_WAYPOINTS_GRID = [
  [0,  2],
  [4,  2],
  [4,  6],
  [9,  6],
  [9,  2],
  [14, 2],
  [14, 10],
  [5,  10],
  [5,  12],
  [19, 12],
];

export const WAYPOINTS_GRID = DEFAULT_WAYPOINTS_GRID.map(([c, r]) => [c, r]);

// Alternative path variations for different levels
export const PATH_VARIATIONS = {
  // Simple winding path
  simple: [
    [0, 7],
    [5, 7],
    [5, 3],
    [12, 3],
    [12, 10],
    [19, 10],
  ],
  // S-curve path
  scurve: [
    [0, 3],
    [6, 3],
    [6, 10],
    [13, 10],
    [13, 4],
    [19, 4],
  ],
  // Double back path
  doubleback: [
    [0, 2],
    [3, 2],
    [3, 11],
    [8, 11],
    [8, 4],
    [14, 4],
    [14, 11],
    [19, 11],
  ],
  // Spiral path
  spiral: [
    [0, 6],
    [8, 6],
    [8, 2],
    [16, 2],
    [16, 12],
    [4, 12],
    [4, 8],
    [19, 8],
  ],
  // Diagonal path
  diagonal: [
    [0, 2],
    [5, 5],
    [10, 2],
    [15, 8],
    [10, 12],
    [19, 12],
  ],
  // NEW: Ultra complex winding paths
  labyrinth: [
    [0, 2], [3, 2], [3, 5], [1, 5], [1, 8], [6, 8], [6, 3], [10, 3], 
    [10, 7], [14, 7], [14, 2], [17, 2], [17, 6], [12, 6], [12, 10], [8, 10],
    [8, 13], [4, 13], [4, 10], [7, 10], [7, 12], [19, 12],
  ],
  megaZigzag: [
    [0, 6], [4, 6], [4, 2], [8, 2], [8, 4], [12, 4], [12, 8], [16, 8],
    [16, 3], [19, 3], [19, 10], [15, 10], [15, 12], [10, 12], [10, 6],
  ],
  doubleSpiral: [
    [0, 2], [5, 2], [5, 10], [2, 10], [2, 4], [8, 4], [8, 12], [5, 12],
    [5, 6], [11, 6], [11, 2], [14, 2], [14, 8], [18, 8], [18, 12], [12, 12],
    [12, 10], [19, 10],
  ],
  // NEW: Chokepoint path - narrow passages ideal for splash damage
  chokepoint: [
    [0, 7], [4, 7], [4, 3], [7, 3], [7, 7], [10, 7], [10, 3], [13, 3], [13, 7], [16, 7], [16, 3], [19, 3],
  ],
  // NEW: Branching path - large loop with multiple placement options
  branching: [
    [0, 6], [5, 6], [5, 2], [9, 2], [9, 6], [14, 6], [14, 10], [9, 10], [9, 14], [5, 14], [5, 10], [0, 10],
  ],
  // NEW: The Gauntlet - longest path, rewards strategic placement
  gauntlet: [
    [0, 2], [2, 2], [2, 5], [5, 5], [5, 2], [8, 2], [8, 5], [11, 5], [11, 2], [14, 2],
    [14, 5], [17, 5], [17, 8], [14, 8], [14, 11], [11, 11], [11, 8], [8, 8], [8, 11],
    [5, 11], [5, 8], [2, 8], [2, 12], [19, 12],
  ],
  // NEW: Split Decision - two possible routes through map
  splitDecision: [
    [0, 3], [4, 3], [4, 7], [8, 7], [8, 3], [12, 3], [12, 9], [16, 9], [16, 3], [19, 3],
  ],
};

/**
 * Get a random path variation for endless mode variety
 * @returns {number[][]} Array of [col, row] waypoints
 */
export function getRandomPath() {
  const keys = Object.keys(PATH_VARIATIONS);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return PATH_VARIATIONS[randomKey];
}

// Path metadata for strategy hints
export const PATH_METADATA = {
  simple: {
    difficulty: 'easy',
    chokepoints: 1,
    idealTowers: ['basic'],
    estimatedTime: 0.8,
    description: 'Simple winding path',
  },
  scurve: {
    difficulty: 'easy',
    chokepoints: 2,
    idealTowers: ['basic', 'splash'],
    estimatedTime: 1.0,
    description: 'S-curve with two turns',
  },
  doubleback: {
    difficulty: 'medium',
    chokepoints: 2,
    idealTowers: ['splash', 'ice'],
    estimatedTime: 1.2,
    description: 'Path doubles back on itself',
  },
  spiral: {
    difficulty: 'medium',
    chokepoints: 3,
    idealTowers: ['splash', 'poison'],
    estimatedTime: 1.3,
    description: 'Spiral pattern around center',
  },
  diagonal: {
    difficulty: 'medium',
    chokepoints: 2,
    idealTowers: ['sniper', 'splash'],
    estimatedTime: 1.1,
    description: 'Diagonal path across map',
  },
  labyrinth: {
    difficulty: 'hard',
    chokepoints: 4,
    idealTowers: ['splash', 'rapid'],
    estimatedTime: 1.4,
    description: 'Complex maze-like path',
  },
  megaZigzag: {
    difficulty: 'hard',
    chokepoints: 5,
    idealTowers: ['sniper', 'splash'],
    estimatedTime: 1.5,
    description: 'Many sharp turns',
  },
  doubleSpiral: {
    difficulty: 'hard',
    chokepoints: 4,
    idealTowers: ['splash', 'poison'],
    estimatedTime: 1.5,
    description: 'Two intertwined spirals',
  },
  chokepoint: {
    difficulty: 'hard',
    chokepoints: 4,
    idealTowers: ['splash', 'ice'],
    estimatedTime: 1.3,
    description: 'Narrow passages - great for area damage',
  },
  branching: {
    difficulty: 'medium',
    chokepoints: 2,
    idealTowers: ['basic', 'sniper'],
    estimatedTime: 1.4,
    description: 'Large loop with many placement options',
  },
  gauntlet: {
    difficulty: 'expert',
    chokepoints: 8,
    idealTowers: ['sniper', 'splash'],
    estimatedTime: 2.0,
    description: 'Longest path - rewards strategic placement',
  },
  splitDecision: {
    difficulty: 'medium',
    chokepoints: 3,
    idealTowers: ['basic', 'splash'],
    estimatedTime: 1.2,
    description: 'Multiple route options',
  },
};

/**
 * Get path waypoints (random or default)
 * @param {boolean} random - Use random path variation
 * @returns {number[][]} Array of [col, row] waypoints
 */
export function getPathWaypoints(random = false) {
  if (random) {
    return getRandomPath();
  }
  return WAYPOINTS_GRID;
}

/**
 * Convert grid waypoints to pixel coordinates
 * @param {number[][]} gridWaypoints - Array of [col, row] waypoints
 * @returns {object[]} Array of {x, y} pixel waypoints
 */
export function gridToPixelWaypoints(gridWaypoints) {
  return gridWaypoints.map(([c, r]) => ({
    x: c * TILE_SIZE + TILE_SIZE / 2,
    y: r * TILE_SIZE + TILE_SIZE / 2,
  }));
}

/**
 * Get list of tiles that are part of the path (for collision detection)
 * @param {number[][]} gridWaypoints - Array of [col, row] waypoints
 * @returns {Set<string>} Set of "col,row" strings
 */
export function buildPathTileSetFromWaypoints(gridWaypoints) {
  const tiles = new Set();
  for (let i = 0; i < gridWaypoints.length - 1; i++) {
    const [c1, r1] = gridWaypoints[i];
    const [c2, r2] = gridWaypoints[i + 1];
    
    const dc = Math.sign(c2 - c1);
    const dr = Math.sign(r2 - r1);
    
    let c = c1, r = r1;
    while (c !== c2 || r !== r2) {
      tiles.add(`${c},${r}`);
      c += dc;
      r += dr;
    }
    tiles.add(`${c2},${r2}`);
  }
  return tiles;
}

// Convert grid waypoints → pixel centers (used by renderer + enemy system)
export const WAYPOINTS_PX = WAYPOINTS_GRID.map(([c, r]) => ({
  x: c * TILE_SIZE + TILE_SIZE / 2,
  y: r * TILE_SIZE + TILE_SIZE / 2,
}));

// Build a Set of "path tile" keys for quick lookup during tower placement
export function buildPathTileSet(waypoints) {
  const set = new Set();

  for (let i = 0; i < waypoints.length - 1; i++) {
    const [c1, r1] = waypoints[i];
    const [c2, r2] = waypoints[i + 1];

    // Walk horizontally or vertically between consecutive waypoints
    if (c1 === c2) {
      const minR = Math.min(r1, r2);
      const maxR = Math.max(r1, r2);
      for (let r = minR; r <= maxR; r++) set.add(`${c1},${r}`);
    } else {
      const minC = Math.min(c1, c2);
      const maxC = Math.max(c1, c2);
      for (let c = minC; c <= maxC; c++) set.add(`${c},${r1}`);
    }
  }
  return set;
}

export const PATH_TILE_SET = buildPathTileSet(WAYPOINTS_GRID);

// ── Random Path System for Endless Mode ───────────────────────
// Store current random path when endless game starts
let _currentPathWaypointsGrid = null;
let _currentPathPixels = null;
let _currentPathTileSet = null;

function rebuildPathState(gridWaypoints) {
  const nextGrid = gridWaypoints.map(([c, r]) => [c, r]);
  const nextPixels = nextGrid.map(([c, r]) => ({
    x: c * TILE_SIZE + TILE_SIZE / 2,
    y: r * TILE_SIZE + TILE_SIZE / 2,
  }));
  const nextTiles = buildPathTileSetFromWaypoints(nextGrid);

  _currentPathWaypointsGrid = nextGrid;
  _currentPathPixels = nextPixels;
  _currentPathTileSet = nextTiles;

  CURRENT_WAYPOINTS_GRID = nextGrid;
  CURRENT_WAYPOINTS_PX = nextPixels;
  CURRENT_PATH_TILE_SET = nextTiles;

  WAYPOINTS_GRID.length = 0;
  WAYPOINTS_GRID.push(...nextGrid);
  WAYPOINTS_PX.length = 0;
  WAYPOINTS_PX.push(...nextPixels);
  PATH_TILE_SET.clear();
  nextTiles.forEach((tile) => PATH_TILE_SET.add(tile));
}

// Default path references 
// These get mutated at runtime when path changes
export let CURRENT_WAYPOINTS_GRID = WAYPOINTS_GRID;
export let CURRENT_WAYPOINTS_PX = WAYPOINTS_PX;
export let CURRENT_PATH_TILE_SET = PATH_TILE_SET;

/**
 * Initialize a random path for endless mode
 * Call this when starting an endless game
 */
export function initRandomPathForGame() {
  const pathKeys = Object.keys(PATH_VARIATIONS);
  const randomKey = pathKeys[Math.floor(Math.random() * pathKeys.length)];
  rebuildPathState(PATH_VARIATIONS[randomKey]);

  console.log('🗺️ Random path selected:', randomKey);
  return randomKey;
}

export function setPathForGame(gridWaypoints) {
  if (!Array.isArray(gridWaypoints) || gridWaypoints.length < 2) {
    return false;
  }
  rebuildPathState(gridWaypoints);
  return true;
}

export function resetDefaultPathForGame() {
  rebuildPathState(DEFAULT_WAYPOINTS_GRID);
}

/**
 * Get current game path (use after initRandomPathForGame)
 */
export function getCurrentPathGrid() {
  return _currentPathWaypointsGrid;
}

/**
 * Get current game path pixels
 */
export function getCurrentPathPixels() {
  return _currentPathPixels;
}

/**
 * Get current game path tiles for checking
 */
export function getCurrentPathTiles() {
  return _currentPathTileSet;
}

// ── Level Configuration ───────────────────────────────────────
export const LEVELS = {
  // Forest World Levels (1-12)
  forest: {
    1: {
      id: 'forest_1',
      world: 'forest',
      level: 1,
      name: 'Forest Entrance',
      pathType: 'simple',
      hpMultiplier: 1.0,
      speedMultiplier: 1.0,
      rewardMultiplier: 1.0,
      waves: [
        [{ type: 'normal', count: 6, interval: 1.5 }],
        [{ type: 'normal', count: 8, interval: 1.2 }],
        [{ type: 'normal', count: 10, interval: 1.0 }, { type: 'fast', count: 3, interval: 1.0 }],
      ],
      availableTowers: ['basic', 'splash'],
      introText: 'Your journey begins. Defeat the goblin scouts!',
    },
    2: {
      id: 'forest_2',
      world: 'forest',
      level: 2,
      name: 'Mushroom Grove',
      pathType: 'scurve',
      hpMultiplier: 1.1,
      speedMultiplier: 1.0,
      rewardMultiplier: 1.1,
      waves: [
        [{ type: 'normal', count: 8, interval: 1.2 }],
        [{ type: 'normal', count: 6, interval: 1.0 }, { type: 'fast', count: 4, interval: 0.8 }],
        [{ type: 'fast', count: 8, interval: 0.7 }],
      ],
      availableTowers: ['basic', 'splash'],
      introText: 'The mushrooms are Watching...',
    },
    3: {
      id: 'forest_3',
      world: 'forest',
      level: 3,
      name: 'Treant Path',
      pathType: 'simple',
      hpMultiplier: 1.2,
      speedMultiplier: 1.0,
      rewardMultiplier: 1.2,
      waves: [
        [{ type: 'normal', count: 10, interval: 1.0 }],
        [{ type: 'fast', count: 6, interval: 0.8 }, { type: 'normal', count: 8, interval: 1.0 }],
        [{ type: 'tank', count: 2, interval: 3.0 }],
      ],
      availableTowers: ['basic', 'splash', 'ice'],
      introText: 'Ancient treants guard this path. Prepare for battle!',
    },
    4: {
      id: 'forest_4',
      world: 'forest',
      level: 4,
      name: 'Goblin Camp',
      pathType: 'doubleback',
      hpMultiplier: 1.3,
      speedMultiplier: 1.1,
      rewardMultiplier: 1.3,
      waves: [
        [{ type: 'normal', count: 12, interval: 0.9 }],
        [{ type: 'fast', count: 8, interval: 0.6 }],
        [{ type: 'tank', count: 3, interval: 2.5 }, { type: 'normal', count: 10, interval: 0.8 }],
      ],
      availableTowers: ['basic', 'splash', 'ice'],
      introText: 'A goblin camp lies ahead. They outnumber you!',
    },
    5: {
      id: 'forest_5',
      world: 'forest',
      level: 5,
      name: 'The Old Oak',
      pathType: 'spiral',
      hpMultiplier: 1.4,
      speedMultiplier: 1.1,
      rewardMultiplier: 1.4,
      waves: [
        [{ type: 'normal', count: 10, interval: 0.8 }, { type: 'fast', count: 6, interval: 0.6 }],
        [{ type: 'tank', count: 4, interval: 2.0 }],
        [{ type: 'healer', count: 2, interval: 3.0 }, { type: 'normal', count: 15, interval: 0.7 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'poison'],
      introText: 'The Old Oak watches over all. Prove your worth!',
      unlocksWorld: 'desert',
    },
    6: {
      id: 'forest_6',
      world: 'forest',
      level: 6,
      name: 'Elven Ruins',
      pathType: 'diagonal',
      hpMultiplier: 1.5,
      speedMultiplier: 1.2,
      rewardMultiplier: 1.5,
      waves: [
        [{ type: 'fast', count: 10, interval: 0.5 }],
        [{ type: 'shielded', count: 4, interval: 1.8 }],
        [{ type: 'tank', count: 5, interval: 2.0 }, { type: 'healer', count: 2, interval: 2.5 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'poison', 'sniper'],
      introText: 'Ancient elven ruins hold forgotten power...',
    },
    7: {
      id: 'forest_7',
      world: 'forest',
      level: 7,
      name: 'Wolf Den',
      pathType: 'simple',
      hpMultiplier: 1.6,
      speedMultiplier: 1.3,
      rewardMultiplier: 1.6,
      waves: [
        [{ type: 'fast', count: 15, interval: 0.4 }],
        [{ type: 'normal', count: 12, interval: 0.8 }, { type: 'tank', count: 4, interval: 2.0 }],
        [{ type: 'shielded', count: 6, interval: 1.5 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'poison', 'sniper'],
      introText: 'Dire wolves emerge from their den!',
    },
    8: {
      id: 'forest_8',
      world: 'forest',
      level: 8,
      name: 'Fairy Circle',
      pathType: 'scurve',
      hpMultiplier: 1.7,
      speedMultiplier: 1.3,
      rewardMultiplier: 1.7,
      waves: [
        [{ type: 'healer', count: 3, interval: 2.5 }, { type: 'normal', count: 12, interval: 0.8 }],
        [{ type: 'shielded', count: 5, interval: 1.5 }, { type: 'fast', count: 8, interval: 0.5 }],
        [{ type: 'tank', count: 6, interval: 1.8 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'poison', 'sniper'],
      introText: 'Magical fairies heal their allies!',
    },
    9: {
      id: 'forest_9',
      world: 'forest',
      level: 9,
      name: 'Dark Hollow',
      pathType: 'doubleback',
      hpMultiplier: 1.8,
      speedMultiplier: 1.4,
      rewardMultiplier: 1.8,
      waves: [
        [{ type: 'shielded', count: 8, interval: 1.2 }],
        [{ type: 'healer', count: 4, interval: 2.0 }, { type: 'fast', count: 12, interval: 0.4 }],
        [{ type: 'tank', count: 8, interval: 1.5 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'poison', 'sniper'],
      introText: 'Something stirs in the dark hollow...',
    },
    10: {
      id: 'forest_10',
      world: 'forest',
      level: 10,
      name: 'Forest Guardian',
      pathType: 'spiral',
      hpMultiplier: 2.0,
      speedMultiplier: 1.4,
      rewardMultiplier: 2.0,
      waves: [
        [{ type: 'boss', count: 1, interval: 0 }],
        [{ type: 'normal', count: 15, interval: 0.6 }, { type: 'healer', count: 3, interval: 2.0 }],
        [{ type: 'shielded', count: 6, interval: 1.5 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'poison', 'sniper'],
      introText: 'The Forest Guardian awakens! Defeat it to prove your strength!',
    },
    11: {
      id: 'forest_11',
      world: 'forest',
      level: 11,
      name: 'Shadow Deep',
      pathType: 'diagonal',
      hpMultiplier: 2.2,
      speedMultiplier: 1.5,
      rewardMultiplier: 2.2,
      waves: [
        [{ type: 'fast', count: 20, interval: 0.3 }],
        [{ type: 'shielded', count: 10, interval: 1.2 }],
        [{ type: 'tank', count: 8, interval: 1.5 }, { type: 'healer', count: 4, interval: 1.8 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'poison', 'sniper'],
      introText: 'The shadows grow darker...',
    },
    12: {
      id: 'forest_12',
      world: 'forest',
      level: 12,
      name: 'Ancient Grove',
      pathType: 'simple',
      hpMultiplier: 2.5,
      speedMultiplier: 1.5,
      rewardMultiplier: 2.5,
      waves: [
        [{ type: 'boss', count: 1, interval: 0 }],
        [{ type: 'normal', count: 25, interval: 0.4 }, { type: 'fast', count: 15, interval: 0.3 }],
        [{ type: 'shielded', count: 12, interval: 1.0 }, { type: 'healer', count: 5, interval: 1.5 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'poison', 'sniper'],
      introText: 'The final challenge! Conquer the Ancient Grove!',
    },
  },

  // Desert World Levels (13-24)
  desert: {
    1: {
      id: 'desert_1',
      world: 'desert',
      level: 1,
      name: 'Sandy Dunes',
      pathType: 'simple',
      hpMultiplier: 1.3,
      speedMultiplier: 1.1,
      rewardMultiplier: 1.3,
      waves: [
        [{ type: 'scorpion', count: 8, interval: 1.2 }],
        [{ type: 'scorpion', count: 10, interval: 1.0 }, { type: 'sandWorm', count: 2, interval: 2.0 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower'],
      introText: 'Welcome to the desert! Scorpions crawl everywhere!',
    },
    2: {
      id: 'desert_2',
      world: 'desert',
      level: 2,
      name: 'Oasis Springs',
      pathType: 'scurve',
      hpMultiplier: 1.4,
      speedMultiplier: 1.2,
      rewardMultiplier: 1.4,
      waves: [
        [{ type: 'scorpion', count: 12, interval: 1.0 }],
        [{ type: 'sandWorm', count: 4, interval: 1.8 }],
        [{ type: 'scorpion', count: 8, interval: 0.8 }, { type: 'fast', count: 5, interval: 0.8 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower'],
      introText: 'The oasis provides relief, but danger lurks nearby!',
    },
    3: {
      id: 'desert_3',
      world: 'desert',
      level: 3,
      name: 'Ancient Tomb',
      pathType: 'doubleback',
      hpMultiplier: 1.5,
      speedMultiplier: 1.2,
      rewardMultiplier: 1.5,
      waves: [
        [{ type: 'mummy', count: 6, interval: 1.5 }],
        [{ type: 'sandWorm', count: 5, interval: 1.5 }],
        [{ type: 'mummy', count: 8, interval: 1.2 }, { type: 'scorpion', count: 10, interval: 0.8 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'sandweaver'],
      introText: 'Ancient mummies awaken in the tomb!',
    },
    4: {
      id: 'desert_4',
      world: 'desert',
      level: 4,
      name: 'Sandstorm Valley',
      pathType: 'diagonal',
      hpMultiplier: 1.6,
      speedMultiplier: 1.3,
      rewardMultiplier: 1.6,
      waves: [
        [{ type: 'sandWorm', count: 8, interval: 1.2 }],
        [{ type: 'fast', count: 12, interval: 0.5 }],
        [{ type: 'mummy', count: 6, interval: 1.5 }, { type: 'scorpion', count: 15, interval: 0.6 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'sandweaver'],
      introText: 'A sandstorm approaches! The worms sense the vibration!',
    },
    5: {
      id: 'desert_5',
      world: 'desert',
      level: 5,
      name: 'Pyramid of Sun',
      pathType: 'spiral',
      hpMultiplier: 1.8,
      speedMultiplier: 1.4,
      rewardMultiplier: 1.8,
      waves: [
        [{ type: 'mummy', count: 10, interval: 1.2 }],
        [{ type: 'boss', id: 'pharaoh', count: 1, interval: 0, hpMultiplier: 1.5 }],
        [{ type: 'sandWorm', count: 6, interval: 1.5 }, { type: 'healer', count: 2, interval: 2.5 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'sandweaver', 'duneCrawler'],
      introText: 'The Pharaoh awakens! The pyramid reveals its secrets!',
      unlocksWorld: 'ice',
    },
    6: {
      id: 'desert_6',
      world: 'desert',
      level: 6,
      name: 'Canyon Pass',
      pathType: 'simple',
      hpMultiplier: 2.0,
      speedMultiplier: 1.5,
      rewardMultiplier: 2.0,
      waves: [
        [{ type: 'scorpion', count: 20, interval: 0.4 }],
        [{ type: 'sandWorm', count: 8, interval: 1.2 }],
        [{ type: 'mummy', count: 12, interval: 1.0 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'sandweaver', 'duneCrawler'],
      introText: 'The canyon narrows! Prepare for combat!',
    },
    7: {
      id: 'desert_7',
      world: 'desert',
      level: 7,
      name: 'Lost Caravan',
      pathType: 'scurve',
      hpMultiplier: 2.2,
      speedMultiplier: 1.5,
      rewardMultiplier: 2.2,
      waves: [
        [{ type: 'fast', count: 15, interval: 0.4 }],
        [{ type: 'mummy', count: 10, interval: 1.2 }, { type: 'healer', count: 3, interval: 2.0 }],
        [{ type: 'sandWorm', count: 10, interval: 1.0 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'sandweaver', 'duneCrawler'],
      introText: 'The spirits of the lost caravan haunt these sands!',
    },
    8: {
      id: 'desert_8',
      world: 'desert',
      level: 8,
      name: 'Temple of Ra',
      pathType: 'doubleback',
      hpMultiplier: 2.4,
      speedMultiplier: 1.6,
      rewardMultiplier: 2.4,
      waves: [
        [{ type: 'boss', id: 'pharaoh', count: 1, interval: 0, hpMultiplier: 2.0 }],
        [{ type: 'mummy', count: 15, interval: 0.8 }],
        [{ type: 'shielded', count: 6, interval: 1.5 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'sandweaver', 'duneCrawler'],
      introText: 'The sun god Ra judges those who enter!',
    },
    9: {
      id: 'desert_9',
      world: 'desert',
      level: 9,
      name: 'Scorpion King',
      pathType: 'spiral',
      hpMultiplier: 2.6,
      speedMultiplier: 1.7,
      rewardMultiplier: 2.6,
      waves: [
        [{ type: 'scorpion', count: 25, interval: 0.3 }],
        [{ type: 'sandWorm', count: 12, interval: 1.0 }],
        [{ type: 'boss', id: 'scorpionKing', count: 1, interval: 0, hpMultiplier: 2.5 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'sandweaver', 'duneCrawler'],
      introText: 'The Scorpion King commands the desert legions!',
    },
    10: {
      id: 'desert_10',
      world: 'desert',
      level: 10,
      name: 'Sands of Time',
      pathType: 'diagonal',
      hpMultiplier: 2.8,
      speedMultiplier: 1.8,
      rewardMultiplier: 2.8,
      waves: [
        [{ type: 'mummy', count: 20, interval: 0.6 }],
        [{ type: 'sandWorm', count: 15, interval: 0.8 }],
        [{ type: 'boss', id: 'pharaoh', count: 2, interval: 2, hpMultiplier: 2.0 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'sandweaver', 'duneCrawler'],
      introText: 'Time itself bends in these sacred sands!',
    },
    11: {
      id: 'desert_11',
      world: 'desert',
      level: 11,
      name: 'Eternal Flame',
      pathType: 'simple',
      hpMultiplier: 3.0,
      speedMultiplier: 1.9,
      rewardMultiplier: 3.0,
      waves: [
        [{ type: 'fast', count: 20, interval: 0.3 }],
        [{ type: 'shielded', count: 10, interval: 1.2 }],
        [{ type: 'mummy', count: 18, interval: 0.5 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'sandweaver', 'duneCrawler'],
      introText: 'The eternal flame burns brighter with each enemy!',
    },
    12: {
      id: 'desert_12',
      world: 'desert',
      level: 12,
      name: 'Desert Throne',
      pathType: 'scurve',
      hpMultiplier: 3.2,
      speedMultiplier: 2.0,
      rewardMultiplier: 3.2,
      waves: [
        [{ type: 'boss', id: 'scorpionKing', count: 1, interval: 0, hpMultiplier: 3.0 }],
        [{ type: 'boss', id: 'pharaoh', count: 1, interval: 0, hpMultiplier: 2.5 }],
        [{ type: 'sandWorm', count: 20, interval: 0.5 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'sandweaver', 'duneCrawler'],
      introText: 'Conquer the Desert Throne to prove your mastery!',
    },
  },

  // Ice World Levels (25-36)
  ice: {
    1: {
      id: 'ice_1',
      world: 'ice',
      level: 1,
      name: 'Frozen Tundra',
      pathType: 'simple',
      hpMultiplier: 1.6,
      speedMultiplier: 1.2,
      rewardMultiplier: 1.6,
      waves: [
        [{ type: 'frostElemental', count: 8, interval: 1.2 }],
        [{ type: 'iceGolem', count: 3, interval: 2.0 }, { type: 'frostElemental', count: 6, interval: 1.0 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'frostBolt', 'blizzard'],
      introText: 'The frozen tundra tests your endurance!',
    },
    2: {
      id: 'ice_2',
      world: 'ice',
      level: 2,
      name: 'Glacier Peak',
      pathType: 'diagonal',
      hpMultiplier: 1.8,
      speedMultiplier: 1.3,
      rewardMultiplier: 1.8,
      waves: [
        [{ type: 'frostElemental', count: 12, interval: 1.0 }],
        [{ type: 'iceGolem', count: 5, interval: 1.8 }],
        [{ type: 'snowWolf', count: 8, interval: 0.8 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'frostBolt', 'blizzard'],
      introText: 'The glacier looms above. Ice golems patrol the peaks!',
    },
    3: {
      id: 'ice_3',
      world: 'ice',
      level: 3,
      name: 'Ice Cave',
      pathType: 'doubleback',
      hpMultiplier: 2.0,
      speedMultiplier: 1.4,
      rewardMultiplier: 2.0,
      waves: [
        [{ type: 'iceGolem', count: 6, interval: 1.5 }],
        [{ type: 'frostElemental', count: 10, interval: 0.8 }, { type: 'iceGolem', count: 4, interval: 1.5 }],
        [{ type: 'frostMage', count: 3, interval: 2.5 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'frostBolt', 'blizzard', 'crystalGuard'],
      introText: 'Deep within the ice cave, ancient magic stirs!',
    },
    4: {
      id: 'ice_4',
      world: 'ice',
      level: 4,
      name: 'Snow Village',
      pathType: 'scurve',
      hpMultiplier: 2.2,
      speedMultiplier: 1.5,
      rewardMultiplier: 2.2,
      waves: [
        [{ type: 'snowWolf', count: 15, interval: 0.5 }],
        [{ type: 'frostElemental', count: 12, interval: 0.8 }],
        [{ type: 'iceGolem', count: 8, interval: 1.2 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'frostBolt', 'blizzard', 'crystalGuard'],
      introText: 'The abandoned village is now home to icy monsters!',
    },
    5: {
      id: 'ice_5',
      world: 'ice',
      level: 5,
      name: 'Frost Keep',
      pathType: 'spiral',
      hpMultiplier: 2.4,
      speedMultiplier: 1.6,
      rewardMultiplier: 2.4,
      waves: [
        [{ type: 'boss', id: 'iceKing', count: 1, interval: 0, hpMultiplier: 2.0 }],
        [{ type: 'frostMage', count: 6, interval: 1.5 }],
        [{ type: 'iceGolem', count: 10, interval: 1.0 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'frostBolt', 'blizzard', 'crystalGuard'],
      introText: 'The Ice King rules over Frost Keep with frozen authority!',
      unlocksWorld: 'volcanic',
    },
    6: {
      id: 'ice_6',
      world: 'ice',
      level: 6,
      name: 'Crystal Cavern',
      pathType: 'simple',
      hpMultiplier: 2.6,
      speedMultiplier: 1.7,
      rewardMultiplier: 2.6,
      waves: [
        [{ type: 'crystalSpider', count: 10, interval: 0.8 }],
        [{ type: 'frostMage', count: 8, interval: 1.2 }],
        [{ type: 'iceGolem', count: 12, interval: 1.0 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'frostBolt', 'blizzard', 'crystalGuard'],
      introText: 'Crystal spiders guard the cavern depths!',
    },
    7: {
      id: 'ice_7',
      world: 'ice',
      level: 7,
      name: 'Winter Storm',
      pathType: 'diagonal',
      hpMultiplier: 2.8,
      speedMultiplier: 1.8,
      rewardMultiplier: 2.8,
      waves: [
        [{ type: 'frostElemental', count: 20, interval: 0.4 }],
        [{ type: 'snowWolf', count: 15, interval: 0.5 }],
        [{ type: 'iceGolem', count: 10, interval: 1.2 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'frostBolt', 'blizzard', 'crystalGuard'],
      introText: 'A winter storm rages! Visibility is near zero!',
    },
    8: {
      id: 'ice_8',
      world: 'ice',
      level: 8,
      name: 'Frozen Throne',
      pathType: 'doubleback',
      hpMultiplier: 3.0,
      speedMultiplier: 1.9,
      rewardMultiplier: 3.0,
      waves: [
        [{ type: 'boss', id: 'iceQueen', count: 1, interval: 0, hpMultiplier: 2.5 }],
        [{ type: 'frostMage', count: 10, interval: 1.0 }],
        [{ type: 'shielded', count: 8, interval: 1.5 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'frostBolt', 'blizzard', 'crystalGuard'],
      introText: 'The Ice Queen sits upon her frozen throne!',
    },
    9: {
      id: 'ice_9',
      world: 'ice',
      level: 9,
      name: 'Permafrost Deep',
      pathType: 'scurve',
      hpMultiplier: 3.2,
      speedMultiplier: 2.0,
      rewardMultiplier: 3.2,
      waves: [
        [{ type: 'iceGolem', count: 15, interval: 0.8 }],
        [{ type: 'frostElemental', count: 25, interval: 0.3 }],
        [{ type: 'frostMage', count: 8, interval: 1.5 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'frostBolt', 'blizzard', 'crystalGuard'],
      introText: 'The permafrost runs deep with ancient ice magic!',
    },
    10: {
      id: 'ice_10',
      world: 'ice',
      level: 10,
      name: 'Glacier Heart',
      pathType: 'spiral',
      hpMultiplier: 3.5,
      speedMultiplier: 2.1,
      rewardMultiplier: 3.5,
      waves: [
        [{ type: 'boss', id: 'iceKing', count: 1, interval: 0, hpMultiplier: 3.0 }],
        [{ type: 'boss', id: 'iceQueen', count: 1, interval: 0, hpMultiplier: 2.5 }],
        [{ type: 'iceGolem', count: 20, interval: 0.6 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'frostBolt', 'blizzard', 'crystalGuard'],
      introText: 'The heart of the glacier pulses with frozen power!',
    },
    11: {
      id: 'ice_11',
      world: 'ice',
      level: 11,
      name: 'Ice Dragon\'s Lair',
      pathType: 'simple',
      hpMultiplier: 3.8,
      speedMultiplier: 2.2,
      rewardMultiplier: 3.8,
      waves: [
        [{ type: 'boss', id: 'iceDragon', count: 1, interval: 0, hpMultiplier: 3.5 }],
        [{ type: 'frostElemental', count: 30, interval: 0.2 }],
        [{ type: 'iceGolem', count: 15, interval: 0.8 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'frostBolt', 'blizzard', 'crystalGuard'],
      introText: 'The Ice Dragon awakens from its millennia-long slumber!',
    },
    12: {
      id: 'ice_12',
      world: 'ice',
      level: 12,
      name: 'Eternal Winter',
      pathType: 'diagonal',
      hpMultiplier: 4.0,
      speedMultiplier: 2.3,
      rewardMultiplier: 4.0,
      waves: [
        [{ type: 'boss', id: 'iceDragon', count: 1, interval: 0, hpMultiplier: 4.0 }],
        [{ type: 'boss', id: 'iceKing', count: 1, interval: 0, hpMultiplier: 3.5 }],
        [{ type: 'frostElemental', count: 40, interval: 0.15 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'frostBolt', 'blizzard', 'crystalGuard'],
      introText: 'Eternal winter consumes all. Only you can stop it!',
    },
  },

  // Volcanic World Levels (37-48)
  volcanic: {
    1: {
      id: 'volcanic_1',
      world: 'volcanic',
      level: 1,
      name: 'Lava Flows',
      pathType: 'simple',
      hpMultiplier: 2.0,
      speedMultiplier: 1.4,
      rewardMultiplier: 2.0,
      waves: [
        [{ type: 'lavaElemental', count: 8, interval: 1.2 }],
        [{ type: 'fireImp', count: 12, interval: 0.8 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'frostBolt', 'blizzard', 'magmaCannon', 'geyser'],
      introText: 'Molten lava flows through the volcanic landscape!',
    },
    2: {
      id: 'volcanic_2',
      world: 'volcanic',
      level: 2,
      name: 'Cinder Valley',
      pathType: 'scurve',
      hpMultiplier: 2.2,
      speedMultiplier: 1.5,
      rewardMultiplier: 2.2,
      waves: [
        [{ type: 'fireImp', count: 15, interval: 0.6 }],
        [{ type: 'lavaElemental', count: 8, interval: 1.0 }],
        [{ type: 'ashDrake', count: 3, interval: 2.0 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'frostBolt', 'blizzard', 'magmaCannon', 'geyser'],
      introText: 'Ash drakes circle the cinder valley!',
    },
    3: {
      id: 'volcanic_3',
      world: 'volcanic',
      level: 3,
      name: 'Volcano Lair',
      pathType: 'doubleback',
      hpMultiplier: 2.4,
      speedMultiplier: 1.6,
      rewardMultiplier: 2.4,
      waves: [
        [{ type: 'lavaGolem', count: 4, interval: 2.0 }],
        [{ type: 'fireImp', count: 18, interval: 0.5 }],
        [{ type: 'lavaElemental', count: 10, interval: 0.8 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'frostBolt', 'blizzard', 'magmaCannon', 'geyser', 'lavaGolem'],
      introText: 'Lava golems guard the volcano entrance!',
    },
    4: {
      id: 'volcanic_4',
      world: 'volcanic',
      level: 4,
      name: 'Fire Dungeon',
      pathType: 'diagonal',
      hpMultiplier: 2.6,
      speedMultiplier: 1.7,
      rewardMultiplier: 2.6,
      waves: [
        [{ type: 'lavaGolem', count: 6, interval: 1.5 }],
        [{ type: 'fireDemon', count: 4, interval: 2.0 }],
        [{ type: 'lavaElemental', count: 15, interval: 0.6 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'frostBolt', 'blizzard', 'magmaCannon', 'geyser', 'lavaGolem'],
      introText: 'Fire demons lurk in the depths of the dungeon!',
    },
    5: {
      id: 'volcanic_5',
      world: 'volcanic',
      level: 5,
      name: 'Molten Core',
      pathType: 'spiral',
      hpMultiplier: 2.8,
      speedMultiplier: 1.8,
      rewardMultiplier: 2.8,
      waves: [
        [{ type: 'boss', id: 'fireElementalLord', count: 1, interval: 0, hpMultiplier: 2.5 }],
        [{ type: 'lavaGolem', count: 8, interval: 1.2 }],
        [{ type: 'fireDemon', count: 6, interval: 1.5 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'frostBolt', 'blizzard', 'magmaCannon', 'geyser', 'lavaGolem'],
      introText: 'The Fire Elemental Lord guards the molten core!',
      unlocksWorld: 'cosmic',
    },
    6: {
      id: 'volcanic_6',
      world: 'volcanic',
      level: 6,
      name: 'Eruption Zone',
      pathType: 'simple',
      hpMultiplier: 3.0,
      speedMultiplier: 1.9,
      rewardMultiplier: 3.0,
      waves: [
        [{ type: 'fireImp', count: 30, interval: 0.3 }],
        [{ type: 'ashDrake', count: 8, interval: 1.0 }],
        [{ type: 'lavaElemental', count: 15, interval: 0.5 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'frostBolt', 'blizzard', 'magmaCannon', 'geyser', 'lavaGolem'],
      introText: 'The volcano is about to erupt!',
    },
    7: {
      id: 'volcanic_7',
      world: 'volcanic',
      level: 7,
      name: 'Inferno Pits',
      pathType: 'scurve',
      hpMultiplier: 3.2,
      speedMultiplier: 2.0,
      rewardMultiplier: 3.2,
      waves: [
        [{ type: 'fireDemon', count: 10, interval: 1.0 }],
        [{ type: 'lavaGolem', count: 12, interval: 1.0 }],
        [{ type: 'boss', id: 'pitLord', count: 1, interval: 0, hpMultiplier: 2.5 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'frostBolt', 'blizzard', 'magmaCannon', 'geyser', 'lavaGolem'],
      introText: 'The Pit Lord commands the inferno pits!',
    },
    8: {
      id: 'volcanic_8',
      world: 'volcanic',
      level: 8,
      name: 'Magma Chamber',
      pathType: 'doubleback',
      hpMultiplier: 3.5,
      speedMultiplier: 2.1,
      rewardMultiplier: 3.5,
      waves: [
        [{ type: 'lavaGolem', count: 15, interval: 0.8 }],
        [{ type: 'fireDemon', count: 12, interval: 1.0 }],
        [{ type: 'ashDrake', count: 10, interval: 0.8 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'frostBolt', 'blizzard', 'magmaCannon', 'geyser', 'lavaGolem'],
      introText: 'The magma chamber bubbles with dangerous energy!',
    },
    9: {
      id: 'volcanic_9',
      world: 'volcanic',
      level: 9,
      name: 'Volcano Summit',
      pathType: 'spiral',
      hpMultiplier: 3.8,
      speedMultiplier: 2.2,
      rewardMultiplier: 3.8,
      waves: [
        [{ type: 'boss', id: 'volcanoGod', count: 1, interval: 0, hpMultiplier: 3.0 }],
        [{ type: 'lavaGolem', count: 20, interval: 0.6 }],
        [{ type: 'fireDemon', count: 15, interval: 0.8 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'frostBolt', 'blizzard', 'magmaCannon', 'geyser', 'lavaGolem'],
      introText: 'The Volcano God awaits at the summit!',
    },
    10: {
      id: 'volcanic_10',
      world: 'volcanic',
      level: 10,
      name: 'Abyssal Fire',
      pathType: 'diagonal',
      hpMultiplier: 4.0,
      speedMultiplier: 2.3,
      rewardMultiplier: 4.0,
      waves: [
        [{ type: 'boss', id: 'fireElementalLord', count: 1, interval: 0, hpMultiplier: 3.5 }],
        [{ type: 'boss', id: 'pitLord', count: 1, interval: 0, hpMultiplier: 3.0 }],
        [{ type: 'lavaGolem', count: 25, interval: 0.5 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'frostBolt', 'blizzard', 'magmaCannon', 'geyser', 'lavaGolem'],
      introText: 'Abyssal fire consumes all in its path!',
    },
    11: {
      id: 'volcanic_11',
      world: 'volcanic',
      level: 11,
      name: 'Hell\'s Gate',
      pathType: 'simple',
      hpMultiplier: 4.3,
      speedMultiplier: 2.4,
      rewardMultiplier: 4.3,
      waves: [
        [{ type: 'fireDemon', count: 20, interval: 0.4 }],
        [{ type: 'lavaElemental', count: 30, interval: 0.3 }],
        [{ type: 'boss', id: 'demonKing', count: 1, interval: 0, hpMultiplier: 4.0 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'frostBolt', 'blizzard', 'magmaCannon', 'geyser', 'lavaGolem'],
      introText: 'Hell\'s Gate opens! The Demon King rises!',
    },
    12: {
      id: 'volcanic_12',
      world: 'volcanic',
      level: 12,
      name: 'Core Apocalypse',
      pathType: 'scurve',
      hpMultiplier: 4.5,
      speedMultiplier: 2.5,
      rewardMultiplier: 4.5,
      waves: [
        [{ type: 'boss', id: 'volcanoGod', count: 1, interval: 0, hpMultiplier: 4.0 }],
        [{ type: 'boss', id: 'demonKing', count: 1, interval: 0, hpMultiplier: 4.5 }],
        [{ type: 'lavaGolem', count: 30, interval: 0.3 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'frostBolt', 'blizzard', 'magmaCannon', 'geyser', 'lavaGolem'],
      introText: 'The apocalypse begins! Defeat the fire lords!',
    },
  },

  // Cosmic World Levels (49-60)
  cosmic: {
    1: {
      id: 'cosmic_1',
      world: 'cosmic',
      level: 1,
      name: 'Nebula Fields',
      pathType: 'simple',
      hpMultiplier: 2.5,
      speedMultiplier: 1.6,
      rewardMultiplier: 2.5,
      waves: [
        [{ type: 'cosmicDrifter', count: 10, interval: 1.0 }],
        [{ type: 'voidSpawn', count: 8, interval: 1.2 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'frostBolt', 'blizzard', 'magmaCannon', 'geyser', 'lavaGolem', 'plasma', 'voidEye', 'starForge'],
      introText: 'Enter the cosmic void. Stars shimmer in the distance...',
    },
    2: {
      id: 'cosmic_2',
      world: 'cosmic',
      level: 2,
      name: 'Asteroid Belt',
      pathType: 'scurve',
      hpMultiplier: 2.7,
      speedMultiplier: 1.7,
      rewardMultiplier: 2.7,
      waves: [
        [{ type: 'voidSpawn', count: 15, interval: 0.6 }],
        [{ type: 'cosmicDrifter', count: 12, interval: 0.8 }],
        [{ type: 'starSentinel', count: 4, interval: 2.0 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'frostBolt', 'blizzard', 'magmaCannon', 'geyser', 'lavaGolem', 'plasma', 'voidEye', 'starForge'],
      introText: 'Navigate through the treacherous asteroid belt!',
    },
    3: {
      id: 'cosmic_3',
      world: 'cosmic',
      level: 3,
      name: 'Dark Matter',
      pathType: 'diagonal',
      hpMultiplier: 2.9,
      speedMultiplier: 1.8,
      rewardMultiplier: 2.9,
      waves: [
        [{ type: 'voidSpawn', count: 18, interval: 0.5 }],
        [{ type: 'darkMatter', count: 5, interval: 1.8 }],
        [{ type: 'cosmicDrifter', count: 15, interval: 0.6 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'frostBolt', 'blizzard', 'magmaCannon', 'geyser', 'lavaGolem', 'plasma', 'voidEye', 'starForge'],
      introText: 'Dark matter warps reality itself!',
    },
    4: {
      id: 'cosmic_4',
      world: 'cosmic',
      level: 4,
      name: 'Supernova Remnant',
      pathType: 'doubleback',
      hpMultiplier: 3.2,
      speedMultiplier: 1.9,
      rewardMultiplier: 3.2,
      waves: [
        [{ type: 'starSentinel', count: 8, interval: 1.2 }],
        [{ type: 'cosmicDrifter', count: 20, interval: 0.4 }],
        [{ type: 'voidLord', count: 2, interval: 3.0 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'frostBolt', 'blizzard', 'magmaCannon', 'geyser', 'lavaGolem', 'plasma', 'voidEye', 'starForge'],
      introText: 'The supernova remnant glows with intense radiation!',
    },
    5: {
      id: 'cosmic_5',
      world: 'cosmic',
      level: 5,
      name: 'Black Hole Edge',
      pathType: 'spiral',
      hpMultiplier: 3.5,
      speedMultiplier: 2.0,
      rewardMultiplier: 3.5,
      waves: [
        [{ type: 'boss', id: 'voidBehemoth', count: 1, interval: 0, hpMultiplier: 3.0 }],
        [{ type: 'darkMatter', count: 10, interval: 1.0 }],
        [{ type: 'voidSpawn', count: 25, interval: 0.3 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'frostBolt', 'blizzard', 'magmaCannon', 'geyser', 'lavaGolem', 'plasma', 'voidEye', 'starForge'],
      introText: 'The void behemoth guards the black hole edge!',
    },
    6: {
      id: 'cosmic_6',
      world: 'cosmic',
      level: 6,
      name: 'Stellar Nursery',
      pathType: 'simple',
      hpMultiplier: 3.8,
      speedMultiplier: 2.1,
      rewardMultiplier: 3.8,
      waves: [
        [{ type: 'cosmicDrifter', count: 30, interval: 0.25 }],
        [{ type: 'starSentinel', count: 12, interval: 0.8 }],
        [{ type: 'voidSpawn', count: 20, interval: 0.4 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'frostBolt', 'blizzard', 'magmaCannon', 'geyser', 'lavaGolem', 'plasma', 'voidEye', 'starForge'],
      introText: 'New stars are born in the stellar nursery!',
    },
    7: {
      id: 'cosmic_7',
      world: 'cosmic',
      level: 7,
      name: 'Cosmic Temple',
      pathType: 'scurve',
      hpMultiplier: 4.0,
      speedMultiplier: 2.2,
      rewardMultiplier: 4.0,
      waves: [
        [{ type: 'starSentinel', count: 15, interval: 0.6 }],
        [{ type: 'voidLord', count: 5, interval: 1.5 }],
        [{ type: 'boss', id: 'cosmicGuardian', count: 1, interval: 0, hpMultiplier: 3.5 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'frostBolt', 'blizzard', 'magmaCannon', 'geyser', 'lavaGolem', 'plasma', 'voidEye', 'starForge'],
      introText: 'The Cosmic Guardian protects the ancient temple!',
    },
    8: {
      id: 'cosmic_8',
      world: 'cosmic',
      level: 8,
      name: 'Galaxy Core',
      pathType: 'diagonal',
      hpMultiplier: 4.3,
      speedMultiplier: 2.3,
      rewardMultiplier: 4.3,
      waves: [
        [{ type: 'darkMatter', count: 15, interval: 0.8 }],
        [{ type: 'voidSpawn', count: 35, interval: 0.2 }],
        [{ type: 'voidLord', count: 8, interval: 1.0 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'frostBolt', 'blizzard', 'magmaCannon', 'geyser', 'lavaGolem', 'plasma', 'voidEye', 'starForge'],
      introText: 'The galaxy core pulses with ancient cosmic energy!',
    },
    9: {
      id: 'cosmic_9',
      world: 'cosmic',
      level: 9,
      name: 'Event Horizon',
      pathType: 'doubleback',
      hpMultiplier: 4.5,
      speedMultiplier: 2.4,
      rewardMultiplier: 4.5,
      waves: [
        [{ type: 'boss', id: 'voidBehemoth', count: 1, interval: 0, hpMultiplier: 4.0 }],
        [{ type: 'darkMatter', count: 20, interval: 0.5 }],
        [{ type: 'voidLord', count: 10, interval: 0.8 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'frostBolt', 'blizzard', 'magmaCannon', 'geyser', 'lavaGolem', 'plasma', 'voidEye', 'starForge'],
      introText: 'Cross the event horizon at your own risk!',
    },
    10: {
      id: 'cosmic_10',
      world: 'cosmic',
      level: 10,
      name: 'Cosmic Throne',
      pathType: 'spiral',
      hpMultiplier: 4.8,
      speedMultiplier: 2.5,
      rewardMultiplier: 4.8,
      waves: [
        [{ type: 'boss', id: 'cosmicGuardian', count: 1, interval: 0, hpMultiplier: 4.5 }],
        [{ type: 'boss', id: 'voidLord', count: 2, interval: 2.0, hpMultiplier: 3.5 }],
        [{ type: 'starSentinel', count: 20, interval: 0.4 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'frostBolt', 'blizzard', 'magmaCannon', 'geyser', 'lavaGolem', 'plasma', 'voidEye', 'starForge'],
      introText: 'The Cosmic Throne awaits the worthy!',
    },
    11: {
      id: 'cosmic_11',
      world: 'cosmic',
      level: 11,
      name: 'Dimension Rift',
      pathType: 'simple',
      hpMultiplier: 5.0,
      speedMultiplier: 2.6,
      rewardMultiplier: 5.0,
      waves: [
        [{ type: 'voidSpawn', count: 50, interval: 0.15 }],
        [{ type: 'darkMatter', count: 25, interval: 0.4 }],
        [{ type: 'boss', id: 'dimensionRift', count: 1, interval: 0, hpMultiplier: 5.0 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'frostBolt', 'blizzard', 'magmaCannon', 'geyser', 'lavaGolem', 'plasma', 'voidEye', 'starForge'],
      introText: 'A dimension rift tears through reality!',
    },
    12: {
      id: 'cosmic_12',
      world: 'cosmic',
      level: 12,
      name: 'Cosmic Finality',
      pathType: 'scurve',
      hpMultiplier: 5.5,
      speedMultiplier: 2.8,
      rewardMultiplier: 5.5,
      waves: [
        [{ type: 'boss', id: 'cosmicDestroyer', count: 1, interval: 0, hpMultiplier: 6.0 }],
        [{ type: 'boss', id: 'voidLord', count: 3, interval: 1.5, hpMultiplier: 4.0 }],
        [{ type: 'darkMatter', count: 30, interval: 0.3 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'frostBolt', 'blizzard', 'magmaCannon', 'geyser', 'lavaGolem', 'plasma', 'voidEye', 'starForge'],
      introText: 'The ultimate challenge! Face the Cosmic Destroyer!',
    },
  },
};

// Tower categories for organized display with unlock requirements
export const TOWER_CATEGORIES = {
  basic: {
    id: 'basic',
    name: 'Basic Towers',
    description: 'Essential towers available from the start',
    unlockRequirement: null, // Available from start
    towers: ['basic', 'splash'],
  },
  forest: {
    id: 'forest',
    name: 'Forest Towers',
    description: 'Nature-based towers from the Forest World',
    unlockRequirement: { world: 'forest', level: 3 },
    towers: ['archer', 'trapper', 'sentinel'],
  },
  support: {
    id: 'support',
    name: 'Support Towers',
    description: 'Buff towers to enhance your defenses',
    unlockRequirement: { world: 'forest', level: 5 },
    towers: ['speedBoost', 'damageAmp', 'rangeExtend', 'critChance', 'healingAura', 'energyShield'],
  },
  desert: {
    id: 'desert',
    name: 'Desert Towers',
    description: 'Fire and sand towers from the Desert World',
    unlockRequirement: { world: 'desert', level: 3 },
    towers: ['flamethrower', 'sandweaver', 'duneCrawler'],
  },
  ice: {
    id: 'ice',
    name: 'Ice Towers',
    description: 'Frozen towers from the Ice World',
    unlockRequirement: { world: 'ice', level: 3 },
    towers: ['frostBolt', 'blizzard', 'crystalGuard'],
  },
  volcanic: {
    id: 'volcanic',
    name: 'Volcanic Towers',
    description: 'Magma towers from the Volcanic World',
    unlockRequirement: { world: 'volcanic', level: 3 },
    towers: ['magmaCannon', 'geyser', 'lavaGolem'],
  },
  cosmic: {
    id: 'cosmic',
    name: 'Cosmic Towers',
    description: 'Stellar towers from the Cosmic World',
    unlockRequirement: { world: 'cosmic', level: 3 },
    towers: ['plasma', 'voidEye', 'starForge'],
  },
  sniper: {
    id: 'sniper',
    name: 'Sniper Towers',
    description: 'Long-range precision towers',
    unlockRequirement: { world: 'forest', level: 6 },
    towers: ['sniper'],
  },
  poison: {
    id: 'poison',
    name: 'Poison Towers',
    description: 'Toxic damage over time',
    unlockRequirement: { world: 'forest', level: 5 },
    towers: ['poison'],
  },
  ice_tower: {
    id: 'ice_tower',
    name: 'Ice Tower',
    description: 'Slows enemies with ice attacks',
    unlockRequirement: { world: 'forest', level: 3 },
    towers: ['ice'],
  },
};

// Check if a tower category is unlocked
export function isCategoryUnlocked(categoryId, progression = null) {
  const category = TOWER_CATEGORIES[categoryId];
  if (!category) return false;
  
  // No requirement = always unlocked
  if (!category.unlockRequirement) return true;
  
  // If no progression provided, assume locked (caller should provide progression)
  if (!progression) return false;
  
  const { world, level } = category.unlockRequirement;
  const levelKey = `${world}_${level}`;
  const levelProgress = progression.levels?.[levelKey];
  
  return levelProgress && levelProgress.completed;
}

// Get all unlocked towers based on progression (caller must pass progression)
export function getUnlockedTowers(progression = null) {
  if (!progression) {
    // Return default towers if no progression provided
    return ['basic', 'splash', 'ice', 'sniper', 'poison'];
  }
  
  const unlockedTowers = [];
  for (const [categoryId, category] of Object.entries(TOWER_CATEGORIES)) {
    if (isCategoryUnlocked(categoryId, progression)) {
      unlockedTowers.push(...category.towers);
    }
  }
  return unlockedTowers;
}

// Get unlocked tower categories (caller must pass progression)
export function getUnlockedCategories(progression = null) {
  const categories = [];
  for (const [categoryId, category] of Object.entries(TOWER_CATEGORIES)) {
    if (isCategoryUnlocked(categoryId, progression)) {
      categories.push({
        ...category,
        unlocked: true,
      });
    } else {
      categories.push({
        ...category,
        unlocked: false,
        progressNeeded: category.unlockRequirement ? `${category.unlockRequirement.world} Level ${category.unlockRequirement.level}` : null,
      });
    }
  }
  return categories;
}

// ── Enemy Unlock System ─────────────────────────────────────────
// Enemy categories for unlockable progression
export const ENEMY_CATEGORIES = {
  basic: {
    id: 'basic',
    name: 'Basic Enemies',
    description: 'Common enemies found in all worlds',
    unlockRequirement: null, // Available from start
    enemies: ['normal', 'fast', 'tank'],
  },
  support: {
    id: 'support',
    name: 'Support Enemies',
    description: 'Enemies with special support abilities',
    unlockRequirement: { world: 'forest', level: 3 },
    enemies: ['healer', 'shielded'],
  },
  forest: {
    id: 'forest',
    name: 'Forest Enemies',
    description: 'Creatures from the Forest World',
    unlockRequirement: { world: 'forest', level: 1 },
    enemies: ['sproutling', 'briar_runner', 'treant'],
  },
  desert: {
    id: 'desert',
    name: 'Desert Enemies',
    description: 'Creatures from the Desert World',
    unlockRequirement: { world: 'desert', level: 1 },
    enemies: ['scorpion', 'sandWorm', 'mummy', 'pharaoh', 'scorpionKing'],
  },
  ice: {
    id: 'ice',
    name: 'Ice Enemies',
    description: 'Creatures from the Ice World',
    unlockRequirement: { world: 'ice', level: 1 },
    enemies: ['frostElemental', 'iceGolem', 'snowWolf', 'frostMage', 'crystalSpider', 'iceKing', 'iceQueen', 'iceDragon'],
  },
  volcanic: {
    id: 'volcanic',
    name: 'Volcanic Enemies',
    description: 'Creatures from the Volcanic World',
    unlockRequirement: { world: 'volcanic', level: 1 },
    enemies: ['lavaElemental', 'fireImp', 'ashDrake', 'lavaGolem', 'fireDemon', 'fireElementalLord', 'pitLord', 'volcanoGod'],
  },
  cosmic: {
    id: 'cosmic',
    name: 'Cosmic Enemies',
    description: 'Creatures from the Cosmic World',
    unlockRequirement: { world: 'cosmic', level: 1 },
    enemies: ['voidling', 'starCruiser', 'eclipseBoss'],
  },
  boss: {
    id: 'boss',
    name: 'Boss Enemies',
    description: 'Powerful boss enemies',
    unlockRequirement: { world: 'forest', level: 10 },
    enemies: ['boss', 'pharaoh', 'scorpionKing', 'iceKing', 'iceQueen', 'iceDragon', 'fireElementalLord', 'pitLord', 'volcanoGod', 'eclipseBoss'],
  },
};

// Check if an enemy category is unlocked
export function isEnemyCategoryUnlocked(categoryId, progression = null) {
  const category = ENEMY_CATEGORIES[categoryId];
  if (!category) return false;
  
  if (!category.unlockRequirement) return true;
  
  // If no progression provided, assume locked
  if (!progression) return false;
  
  const { world, level } = category.unlockRequirement;
  const levelKey = `${world}_${level}`;
  const levelProgress = progression.levels?.[levelKey];
  
  return levelProgress && levelProgress.completed;
}

// Get all unlocked enemies based on progression (caller must pass progression)
export function getUnlockedEnemies(progression = null) {
  if (!progression) {
    // Return default enemies if no progression
    return ['normal', 'fast', 'tank'];
  }
  
  const unlockedEnemies = [];
  for (const [categoryId, category] of Object.entries(ENEMY_CATEGORIES)) {
    if (isEnemyCategoryUnlocked(categoryId, progression)) {
      unlockedEnemies.push(...category.enemies);
    }
  }
  return unlockedEnemies;
}

// Enemy scaling configuration - BALANCED DIFFICULTY WITH PROGRESSIVE CURVES
// Progressive scaling: gentler early, harder late
export const ENEMY_SCALING = {
  // Progressive HP scaling - base increase with compounding
  hpMultiplierPerWave: 0.20,       // 20% HP increase per wave base
  hpGrowthExponent: 1.08,         // 8% compounding per wave
  
  // Speed scaling - capped to prevent unplayable speeds
  speedMultiplierPerWave: 0.04,   // 4% speed increase per wave
  maxSpeedMultiplier: 2.5,         // Cap at 2.5x speed
  
  // Reward scaling - keeps up with tower costs
  rewardMultiplierPerWave: 0.10,  // 10% more gold per wave
  
  // Mid-game difficulty spike for challenge
  difficultPhaseStart: 15,        // Waves 15+ get harder
  difficultPhaseMultiplier: 1.3,  // 30% extra scaling
  
  // Late wave bonuses - but delayed
  lateWaveThreshold: 20,          // Waves beyond this get extra scaling
  lateWaveHpBonus: 0.30,          // Extra 30% HP for waves 20+
  
  // Regeneration - starts later and is weaker
  lateWaveRegenThreshold: 15,     // Enemies start regenerating at wave 15
  regenAmountPerWave: 0.8,        // +0.8 HP/sec regen per wave
  maxRegenAmount: 20,             // Cap regen at 20 HP/sec
  
  // Boss scaling - separate from wave scaling
  bossHpMultiplier: 3.5,          // Bosses get 3.5x HP
  bossSpeedMultiplier: 1.8,       // Bosses get 1.8x speed
  
  // World difficulty bonuses
  worldBonus: {
    forest: 1.0,
    desert: 1.4,
    ice: 1.8,
    volcanic: 2.2,
    cosmic: 2.8,
  },
  
  // Endless mode difficulty spikes
  endlessDifficultySpike: {
    wave30Multiplier: 1.5,  // All stats +50% at wave 30
    wave50Multiplier: 2.0,   // All stats double at wave 50
  },
};

// Calculate enemy stats with progressive scaling
export function calculateEnemyStats(baseEnemy, waveNumber, worldId = 'forest', isBoss = false, isEndless = false) {
  const scaling = ENEMY_SCALING;
  const worldBonus = scaling.worldBonus[worldId] || 1.0;
  
  // Progressive HP scaling with exponent for gentler start, harder late
  const waveExcess = waveNumber - 1;
  const compoundingBonus = Math.pow(scaling.hpGrowthExponent, waveExcess);
  let hpMultiplier = (1.0 + waveExcess * scaling.hpMultiplierPerWave) * compoundingBonus;
  
  // Mid-game difficulty spike at wave 15
  if (waveNumber >= scaling.difficultPhaseStart) {
    hpMultiplier *= scaling.difficultPhaseMultiplier;
  }
  
  // Late wave bonus
  if (waveNumber > scaling.lateWaveThreshold) {
    hpMultiplier += scaling.lateWaveHpBonus;
  }
  
  hpMultiplier *= worldBonus;
  
  // Endless mode difficulty spikes
  if (isEndless) {
    if (waveNumber >= 30) {
      hpMultiplier *= scaling.endlessDifficultySpike.wave30Multiplier;
    }
    if (waveNumber >= 50) {
      hpMultiplier *= scaling.endlessDifficultySpike.wave50Multiplier;
    }
  }
  
  // Speed multiplier with cap
  let speedMultiplier = 1.0 + (waveNumber - 1) * scaling.speedMultiplierPerWave;
  // Cap speed to prevent unplayable game
  speedMultiplier = Math.min(speedMultiplier, scaling.maxSpeedMultiplier);
  
  if (isBoss) {
    speedMultiplier *= scaling.bossSpeedMultiplier;
    // Also apply boss HP multiplier
    hpMultiplier *= scaling.bossHpMultiplier;
  }
  
  // Reward multiplier
  const rewardMultiplier = 1.0 + (waveNumber - 1) * scaling.rewardMultiplierPerWave;
  
  // Calculate regeneration (starts at wave 15)
  let regenRate = 0;
  if (waveNumber >= scaling.lateWaveRegenThreshold) {
    regenRate = Math.min(
      scaling.maxRegenAmount,
      (waveNumber - scaling.lateWaveRegenThreshold + 1) * scaling.regenAmountPerWave
    );
  }
  
  return {
    hp: Math.floor(baseEnemy.hp * hpMultiplier),
    maxHp: Math.floor(baseEnemy.hp * hpMultiplier),
    speed: baseEnemy.speed * speedMultiplier,
    reward: Math.floor(baseEnemy.reward * rewardMultiplier),
    regenRate,
    hpMultiplier,
    speedMultiplier,
  };
}

// ── Tower Upgrade Enhancement ────────────────────────────────────
// Enhanced upgrade stats that show the difference between levels
export function getTowerUpgradeStats(tower) {
  const type = tower.type || tower.defId;
  const def = TOWER_DEFS[type];
  const currentLevel = tower.level;
  
  if (!def) return null;
  
  const currentStats = def.levels[currentLevel] || null;
  const nextLevelStats = def.levels[currentLevel + 1] || null;
  const maxLevel = def.levels.length - 1;
  const isMaxLevel = currentLevel >= maxLevel;
  
  return {
    current: currentStats,
    next: nextLevelStats,
    upgradeCost: isMaxLevel ? null : def.upgradeCost[currentLevel],
    isMaxLevel,
    currentLevel,
    maxLevel,
    // Calculate percentage improvements
    improvements: nextLevelStats ? {
      damage: ((nextLevelStats.damage - currentStats.damage) / currentStats.damage * 100).toFixed(1),
      range: ((nextLevelStats.range - currentStats.range) / currentStats.range * 100).toFixed(1),
      fireRate: ((nextLevelStats.fireRate - currentStats.fireRate) / currentStats.fireRate * 100).toFixed(1),
    } : null,
  };
}

// ── NEW: Branch Upgrade System ────────────────────────────────────
// Get available branch upgrades for a tower based on level
export function getAvailableBranches(tower) {
  const type = tower.type || tower.defId;
  const def = TOWER_DEFS[type];
  const currentLevel = tower.level || 0;
  
  if (!def || !def.branches) return null;
  
  // Check if branch unlocks are available
  const unlockLevel = def.branchUnlockLevel || 2;
  if (currentLevel < unlockLevel) return null;
  
  return def.branches;
}

// Get current branch progress for a tower
export function getBranchProgress(tower) {
  const type = tower.type || tower.defId;
  const def = TOWER_DEFS[type];
  
  if (!def || !def.branches || !tower.branchProgress) return {};
  return tower.branchProgress;
}

// Check if a branch upgrade is available
export function canPurchaseBranchUpgrade(tower, branchId, tierLevel) {
  const branches = getAvailableBranches(tower);
  if (!branches || !branches[branchId]) return { available: false, reason: 'Branch not available' };
  
  const branch = branches[branchId];
  const currentProgress = tower.branchProgress?.[branchId] || 0;
  
  // Check if tier exists
  if (tierLevel < 1 || tierLevel > branch.tiers.length) {
    return { available: false, reason: 'Invalid tier' };
  }
  
  // Check if already purchased
  if (currentProgress >= tierLevel) {
    return { available: false, reason: 'Already purchased' };
  }
  
  // Check if previous tier is purchased (must buy in order)
  if (tierLevel > 1 && currentProgress < tierLevel - 1) {
    return { available: false, reason: 'Must purchase previous tier first' };
  }
  
  const tier = branch.tiers[tierLevel - 1];
  return {
    available: true,
    cost: tier.cost,
    stats: tier.stats,
    description: tier.description,
  };
}

// Calculate total stats including branch bonuses
export function calculateTotalTowerStats(tower) {
  const type = tower.type || tower.defId;
  const def = TOWER_DEFS[type];
  const currentLevel = tower.level || 0;
  
  if (!def) return null;
  
  // Get base stats from current level
  const baseStats = def.levels[currentLevel] || def.levels[0];
  const stats = { ...baseStats };
  
  // Apply branch bonuses
  if (tower.branchProgress) {
    for (const [branchId, progress] of Object.entries(tower.branchProgress)) {
      const branch = def.branches?.[branchId];
      if (!branch) continue;
      
      // Apply all purchased tiers
      for (let i = 0; i < progress && i < branch.tiers.length; i++) {
        const tierStats = branch.tiers[i].stats;
        for (const [stat, value] of Object.entries(tierStats)) {
          if (stat === 'fireRate' || stat === 'range') {
            // Multiplicative bonuses
            stats[stat] = (stats[stat] || 1) * (typeof value === 'number' && value < 3 ? value : 1);
          } else if (typeof value === 'number') {
            // Additive bonuses
            stats[stat] = (stats[stat] || 0) + value;
          } else {
            // Boolean bonuses
            stats[stat] = value;
          }
        }
      }
    }
  }
  
  return stats;
}

// Helper function to get all levels for a world
export function getWorldLevels(worldId) {
  return LEVELS[worldId] || {};
}

// ── Tower Definitions ────────────────────────────────────────
// Each level is a full stat block (level 1 = index 0, level 2 = index 1)
// Each tower can have optional upgrade branches for advanced progression
export const TOWER_DEFS = {
  // ── Basic Towers (available from start) ─
  basic: {
    id:       'basic',
    label:    'Basic Tower',
    cost:     75,
    color:    '#4FC3F7',
    accentColor: '#0288D1',
    bulletColor: '#E1F5FE',
    description: 'Single-target. Reliable.',
    splash: false,
    world: 'forest',
    levels: [
      { damage: 20, range: 120, fireRate: 1.2, bulletSpeed: 280, splash: 0, splashRadius: 0 },
      { damage: 38, range: 140, fireRate: 1.6, bulletSpeed: 320, splash: 0, splashRadius: 0 },
      { damage: 60, range: 160, fireRate: 2.0, bulletSpeed: 360, splash: 0, splashRadius: 0 },
      { damage: 90, range: 180, fireRate: 2.5, projectileSpeed: 400, splash: false, splashRadius: 0 },
    ],
    upgradeCost: [100, 150, 200],
    // ── NEW: Branching Upgrade System ─
    branches: {
      // Path A: Damage focus
      damage: {
        name: 'Sharp Arrows',
        description: 'Increase raw damage output',
        icon: '⚔️',
        tiers: [
          { level: 1, cost: 50, stats: { damage: +10 }, description: '+10 damage' },
          { level: 2, cost: 100, stats: { damage: +20 }, description: '+20 damage' },
          { level: 3, cost: 200, stats: { damage: +30, critChance: 10 }, description: '+30 damage, 10% crit' },
          { level: 4, cost: 400, stats: { critDamage: 50 }, description: '+50% crit damage' },
        ],
        prerequisites: [],
      },
      // Path B: Speed focus
      speed: {
        name: 'Rapid Fire',
        description: 'Increase attack speed',
        icon: '⚡',
        tiers: [
          { level: 1, cost: 50, stats: { fireRate: 1.2 }, description: '+20% fire rate' },
          { level: 2, cost: 100, stats: { fireRate: 1.4 }, description: '+40% fire rate' },
          { level: 3, cost: 200, stats: { fireRate: 1.6 }, description: '+60% fire rate' },
          { level: 4, cost: 400, stats: { fireRate: 2.0 }, description: 'Double fire rate' },
        ],
        prerequisites: [],
      },
      // Path C: Range/Special
      range: {
        name: 'Eagle Eye',
        description: 'Extend range and reveal hidden',
        icon: '👁️',
        tiers: [
          { level: 1, cost: 50, stats: { range: 1.2 }, description: '+20% range' },
          { level: 2, cost: 100, stats: { range: 1.4 }, description: '+40% range' },
          { level: 3, cost: 200, stats: { range: 1.5, seeInvisible: true }, description: '+50% range, reveal hidden' },
          { level: 4, cost: 400, stats: { aura: 'range', auraBonus: 15 }, description: '+15% range aura to nearby' },
        ],
        prerequisites: [],
      },
    },
    // Branch unlocks at level 2
    branchUnlockLevel: 2,
  },
  splash: {
    id:       'splash',
    label:    'Splash Tower',
    cost:     125,
    color:    '#FFB74D',
    accentColor: '#E65100',
    bulletColor: '#FFCC02',
    description: 'AOE damage. Slow fire rate.',
    splash: true,
    world: 'forest',
    levels: [
      { damage: 15, range: 100, fireRate: 0.6, bulletSpeed: 200, splash: true, splashRadius: 55 },
      { damage: 28, range: 120, fireRate: 0.8, bulletSpeed: 220, splash: true, splashRadius: 70 },
      { damage: 45, range: 140, fireRate: 1.0, bulletSpeed: 240, splash: true, splashRadius: 85 },
      { damage: 65, range: 160, fireRate: 1.3, bulletSpeed: 260, splash: true, splashRadius: 100 },
    ],
    upgradeCost: [150, 200, 250],
    // ── Branching Upgrade System ─
    branches: {
      // Path A: Area focus
      area: {
        name: 'Blast Radius',
        description: 'Increase splash damage area',
        icon: '💥',
        tiers: [
          { level: 1, cost: 75, stats: { splashRadius: 1.2 }, description: '+20% splash radius' },
          { level: 2, cost: 150, stats: { splashRadius: 1.4 }, description: '+40% splash radius' },
          { level: 3, cost: 300, stats: { splashRadius: 1.6, chainLightning: true }, description: '+60% splash, chain lightning' },
          { level: 4, cost: 500, stats: { splashRadius: 2.0 }, description: 'Double splash radius' },
        ],
        prerequisites: [],
      },
      // Path B: Damage focus
      power: {
        name: 'Explosive Power',
        description: 'Increase damage output',
        icon: '🔥',
        tiers: [
          { level: 1, cost: 75, stats: { damage: 1.3 }, description: '+30% damage' },
          { level: 2, cost: 150, stats: { damage: 1.5 }, description: '+50% damage' },
          { level: 3, cost: 300, stats: { damage: 1.8 }, description: '+80% damage' },
          { level: 4, cost: 500, stats: { damage: 2.2, armorPierce: true }, description: '+120% damage, armor piercing' },
        ],
        prerequisites: [],
      },
      // Path C: Fire rate
      rapid: {
        name: 'Quick Load',
        description: 'Increase fire rate',
        icon: '🚀',
        tiers: [
          { level: 1, cost: 75, stats: { fireRate: 1.25 }, description: '+25% fire rate' },
          { level: 2, cost: 150, stats: { fireRate: 1.5 }, description: '+50% fire rate' },
          { level: 3, cost: 300, stats: { fireRate: 1.75 }, description: '+75% fire rate' },
          { level: 4, cost: 500, stats: { fireRate: 2.0 }, description: 'Double fire rate' },
        ],
        prerequisites: [],
      },
    },
    branchUnlockLevel: 2,
  },
  ice: {
    id:       'ice',
    label:    'Ice Tower',
    cost:     100,
    color:    '#81D4FA',
    accentColor: '#0277BD',
    bulletColor: '#B3E5FC',
    description: 'Slows enemies by 40% for 2 seconds.',
    splash: false,
    slowEffect: { amount: 0.4, duration: 2.0 },
    world: 'forest',
    levels: [
      { damage: 10, range: 110, fireRate: 1.0, bulletSpeed: 250, slowAmount: 0.3, slowDuration: 1.5 },
      { damage: 18, range: 130, fireRate: 1.3, bulletSpeed: 280, slowAmount: 0.4, slowDuration: 2.0 },
      { damage: 28, range: 150, fireRate: 1.6, bulletSpeed: 310, slowAmount: 0.5, slowDuration: 2.5 },
      { damage: 40, range: 170, fireRate: 2.0, bulletSpeed: 340, slowAmount: 0.6, slowDuration: 3.0 },
    ],
    upgradeCost: [80, 130, 180],
  },
  sniper: {
    id:       'sniper',
    label:    'Sniper Tower',
    cost:     150,
    color:    '#CE93D8',
    accentColor: '#7B1FA2',
    bulletColor: '#E1BEE7',
    description: 'Long range, high damage. Cannot be dodged.',
    splash: false,
    world: 'forest',
    levels: [
      { damage: 80, range: 200, fireRate: 0.5, bulletSpeed: 500, splash: false, splashRadius: 0 },
      { damage: 120, range: 230, fireRate: 0.6, bulletSpeed: 550, splash: false, splashRadius: 0 },
      { damage: 180, range: 260, fireRate: 0.7, bulletSpeed: 600, splash: false, splashRadius: 0 },
      { damage: 250, range: 300, fireRate: 0.8, bulletSpeed: 650, splash: false, splashRadius: 0 },
    ],
    upgradeCost: [120, 180, 250],
    // ── Branching Upgrade System ─
    branches: {
      // Path A: Extreme range
      longRange: {
        name: 'Hawkeye',
        description: 'Extreme range for picking off enemies',
        icon: '🎯',
        tiers: [
          { level: 1, cost: 100, stats: { range: 1.25 }, description: '+25% range' },
          { level: 2, cost: 200, stats: { range: 1.5 }, description: '+50% range' },
          { level: 3, cost: 350, stats: { range: 1.75, pierce: 2 }, description: '+75% range, pierce 2' },
          { level: 4, cost: 600, stats: { range: 2.0, pierce: 3 }, description: 'Double range, pierce 3' },
        ],
        prerequisites: [],
      },
      // Path B: Critical hits
      crit: {
        name: 'Deadly Aim',
        description: 'Chance for massive critical damage',
        icon: '💀',
        tiers: [
          { level: 1, cost: 100, stats: { critChance: 15 }, description: '+15% crit chance' },
          { level: 2, cost: 200, stats: { critChance: 25, critDamage: 50 }, description: '+25% crit, +50% damage' },
          { level: 3, cost: 350, stats: { critChance: 35, critDamage: 100 }, description: '+35% crit, +100% damage' },
          { level: 4, cost: 600, stats: { critChance: 50, critDamage: 150, oneShotWeak: true }, description: '50% crit, instakill weak' },
        ],
        prerequisites: [],
      },
      // Path C: Armor piercing
      pierce: {
        name: 'Armor Breaker',
        description: 'Bypass enemy armor',
        icon: '🛡️',
        tiers: [
          { level: 1, cost: 100, stats: { armorPierce: 30 }, description: '30% armor pierce' },
          { level: 2, cost: 200, stats: { armorPierce: 50 }, description: '50% armor pierce' },
          { level: 3, cost: 350, stats: { armorPierce: 70, ignoreShield: true }, description: '70% armor pierce, ignore shield' },
          { level: 4, cost: 600, stats: { armorPierce: 100, trueDamage: true }, description: '100% armor pierce, true damage' },
        ],
        prerequisites: [],
      },
    },
    branchUnlockLevel: 2,
  },
  poison: {
    id:       'poison',
    label:    'Poison Tower',
    cost:     115,
    color:    '#4ade80',
    accentColor: '#166534',
    bulletColor: '#86efac',
    description: 'Applies poison damage over time.',
    splash: false,
    world: 'forest',
    levels: [
      { damage: 8, range: 115, fireRate: 0.95, bulletSpeed: 260, poisonDamage: 6, poisonDuration: 3.0 },
      { damage: 12, range: 135, fireRate: 1.15, bulletSpeed: 290, poisonDamage: 8, poisonDuration: 3.5 },
      { damage: 18, range: 155, fireRate: 1.35, bulletSpeed: 320, poisonDamage: 11, poisonDuration: 4.0 },
      { damage: 26, range: 175, fireRate: 1.6, bulletSpeed: 350, poisonDamage: 15, poisonDuration: 4.5 },
    ],
    upgradeCost: [90, 140, 210],
  },

  // ── Forest World Towers ─
  archer: {
    id:       'archer',
    label:    'Archer Tower',
    cost:     90,
    color:    '#8B4513',
    accentColor: '#D2691E',
    bulletColor: '#DEB887',
    description: 'Rapid-fire arrows. High attack speed.',
    splash: false,
    world: 'forest',
    levels: [
      { damage: 12, range: 130, fireRate: 2.5, bulletSpeed: 350 },
      { damage: 20, range: 150, fireRate: 3.0, bulletSpeed: 380 },
      { damage: 30, range: 170, fireRate: 3.5, bulletSpeed: 410 },
      { damage: 45, range: 190, fireRate: 4.0, bulletSpeed: 450 },
    ],
    upgradeCost: [80, 120, 170],
  },
  trapper: {
    id:       'trapper',
    label:    'Trapper Tower',
    cost:     110,
    color:    '#228B22',
    accentColor: '#006400',
    bulletColor: '#90EE90',
    description: 'Roots enemies in place. Immobilizes.',
    splash: false,
    world: 'forest',
    levels: [
      { damage: 8, range: 100, fireRate: 0.8, bulletSpeed: 200, slowAmount: 1.0, slowDuration: 2.0 },
      { damage: 14, range: 120, fireRate: 1.0, bulletSpeed: 230, slowAmount: 1.0, slowDuration: 2.5 },
      { damage: 22, range: 140, fireRate: 1.2, bulletSpeed: 260, slowAmount: 1.0, slowDuration: 3.0 },
      { damage: 32, range: 160, fireRate: 1.5, bulletSpeed: 290, slowAmount: 1.0, slowDuration: 3.5 },
    ],
    upgradeCost: [100, 150, 200],
  },
  sentinel: {
    id:       'sentinel',
    label:    'Sentinel Tower',
    cost:     175,
    color:    '#2E8B57',
    accentColor: '#006400',
    bulletColor: '#ADFF2F',
    description: 'Exceptional range. Pierces multiple enemies.',
    splash: false,
    piercing: true,
    world: 'forest',
    levels: [
      { damage: 25, range: 250, fireRate: 0.6, bulletSpeed: 450, pierceCount: 3 },
      { damage: 40, range: 280, fireRate: 0.7, bulletSpeed: 500, pierceCount: 4 },
      { damage: 60, range: 310, fireRate: 0.8, bulletSpeed: 550, pierceCount: 5 },
      { damage: 85, range: 350, fireRate: 0.9, bulletSpeed: 600, pierceCount: 6 },
    ],
    upgradeCost: [150, 220, 300],
  },

  // ── Desert World Towers ─
  flamethrower: {
    id:       'flamethrower',
    label:    'Flamethrower',
    cost:     140,
    color:    '#FF4500',
    accentColor: '#8B0000',
    bulletColor: '#FFA500',
    description: 'Continuous fire. Burns enemies over time.',
    splash: true,
    world: 'desert',
    burnEffect: { damage: 5, duration: 2.0 },
    levels: [
      { damage: 12, range: 90, fireRate: 3.0, bulletSpeed: 180, splashRadius: 45, burnDamage: 4, burnDuration: 1.5 },
      { damage: 20, range: 110, fireRate: 3.5, bulletSpeed: 200, splashRadius: 55, burnDamage: 6, burnDuration: 2.0 },
      { damage: 30, range: 130, fireRate: 4.0, bulletSpeed: 220, splashRadius: 65, burnDamage: 8, burnDuration: 2.5 },
      { damage: 45, range: 150, fireRate: 4.5, bulletSpeed: 240, splashRadius: 75, burnDamage: 10, burnDuration: 3.0 },
    ],
    upgradeCost: [130, 190, 260],
  },
  sandweaver: {
    id:       'sandweaver',
    label:    'Sandweaver',
    cost:     120,
    color:    '#DAA520',
    accentColor: '#B8860B',
    bulletColor: '#F0E68C',
    description: 'Webs enemies. Extreme slow with moderate damage.',
    splash: false,
    world: 'desert',
    levels: [
      { damage: 10, range: 110, fireRate: 0.7, bulletSpeed: 220, slowAmount: 0.7, slowDuration: 3.0 },
      { damage: 18, range: 130, fireRate: 0.9, bulletSpeed: 250, slowAmount: 0.75, slowDuration: 3.5 },
      { damage: 28, range: 150, fireRate: 1.1, bulletSpeed: 280, slowAmount: 0.8, slowDuration: 4.0 },
      { damage: 40, range: 170, fireRate: 1.3, bulletSpeed: 310, slowAmount: 0.85, slowDuration: 4.5 },
    ],
    upgradeCost: [110, 160, 220],
  },
  duneCrawler: {
    id:       'duneCrawler',
    label:    'Dune Crawler',
    cost:     160,
    color:    '#CD853F',
    accentColor: '#8B4513',
    bulletColor: '#D2691E',
    description: 'Fast attack speed. Chains to nearby enemies.',
    splash: false,
    chainLightning: true,
    world: 'desert',
    levels: [
      { damage: 15, range: 100, fireRate: 2.0, bulletSpeed: 400, chainCount: 2, chainRange: 60 },
      { damage: 25, range: 120, fireRate: 2.5, bulletSpeed: 440, chainCount: 3, chainRange: 70 },
      { damage: 38, range: 140, fireRate: 3.0, bulletSpeed: 480, chainCount: 4, chainRange: 80 },
      { damage: 55, range: 160, fireRate: 3.5, bulletSpeed: 520, chainCount: 5, chainRange: 90 },
    ],
    upgradeCost: [140, 200, 280],
  },

  // ── Ice World Towers ─
  frostBolt: {
    id:       'frostBolt',
    label:    'Frost Bolt',
    cost:     95,
    color:    '#00BCD4',
    accentColor: '#00838F',
    bulletColor: '#E0F7FA',
    description: 'Heavy slow effect. Moderate damage.',
    splash: false,
    world: 'ice',
    levels: [
      { damage: 15, range: 120, fireRate: 1.2, bulletSpeed: 300, slowAmount: 0.5, slowDuration: 2.5 },
      { damage: 25, range: 140, fireRate: 1.5, bulletSpeed: 330, slowAmount: 0.55, slowDuration: 3.0 },
      { damage: 38, range: 160, fireRate: 1.8, bulletSpeed: 360, slowAmount: 0.6, slowDuration: 3.5 },
      { damage: 55, range: 180, fireRate: 2.2, bulletSpeed: 390, slowAmount: 0.65, slowDuration: 4.0 },
    ],
    upgradeCost: [90, 140, 190],
  },
  blizzard: {
    id:       'blizzard',
    label:    'Blizzard Tower',
    cost:     180,
    color:    '#81D4FA',
    accentColor: '#0288D1',
    bulletColor: '#B3E5FC',
    description: 'Area slow effect. Freezes all enemies in range.',
    splash: true,
    areaSlow: true,
    world: 'ice',
    levels: [
      { damage: 8, range: 140, fireRate: 0.4, bulletSpeed: 150, areaSlowAmount: 0.3, areaSlowDuration: 1.0, splashRadius: 80 },
      { damage: 14, range: 160, fireRate: 0.5, bulletSpeed: 170, areaSlowAmount: 0.35, areaSlowDuration: 1.2, splashRadius: 95 },
      { damage: 22, range: 180, fireRate: 0.6, bulletSpeed: 190, areaSlowAmount: 0.4, areaSlowDuration: 1.5, splashRadius: 110 },
      { damage: 32, range: 200, fireRate: 0.7, bulletSpeed: 210, areaSlowAmount: 0.45, areaSlowDuration: 1.8, splashRadius: 125 },
    ],
    upgradeCost: [160, 230, 320],
  },
  crystalGuard: {
    id:       'crystalGuard',
    label:    'Crystal Guard',
    cost:     200,
    color:    '#E1BEE7',
    accentColor: '#8E24AA',
    bulletColor: '#F3E5F5',
    description: 'Piercing attacks. Ignores enemy armor.',
    splash: false,
    piercing: true,
    armorPiercing: true,
    world: 'ice',
    levels: [
      { damage: 45, range: 180, fireRate: 0.7, bulletSpeed: 500, pierceCount: 4, armorPenetration: 0.5 },
      { damage: 70, range: 200, fireRate: 0.85, bulletSpeed: 550, pierceCount: 5, armorPenetration: 0.6 },
      { damage: 100, range: 220, fireRate: 1.0, bulletSpeed: 600, pierceCount: 6, armorPenetration: 0.7 },
      { damage: 140, range: 250, fireRate: 1.2, bulletSpeed: 650, pierceCount: 8, armorPenetration: 0.8 },
    ],
    upgradeCost: [180, 260, 350],
  },

  // ── Volcanic World Towers ─
  magmaCannon: {
    id:       'magmaCannon',
    label:    'Magma Cannon',
    cost:     165,
    color:    '#FF5722',
    accentColor: '#BF360C',
    bulletColor: '#FFCCBC',
    description: 'Burning damage. Applies persistent burn.',
    splash: true,
    world: 'volcanic',
    burnEffect: { damage: 8, duration: 3.0 },
    levels: [
      { damage: 25, range: 130, fireRate: 0.8, bulletSpeed: 280, splashRadius: 60, burnDamage: 6, burnDuration: 2.5 },
      { damage: 40, range: 150, fireRate: 1.0, bulletSpeed: 310, splashRadius: 70, burnDamage: 9, burnDuration: 3.0 },
      { damage: 60, range: 170, fireRate: 1.2, bulletSpeed: 340, splashRadius: 80, burnDamage: 12, burnDuration: 3.5 },
      { damage: 85, range: 190, fireRate: 1.5, bulletSpeed: 370, splashRadius: 90, burnDamage: 15, burnDuration: 4.0 },
    ],
    upgradeCost: [150, 220, 300],
  },
  geyser: {
    id:       'geyser',
    label:    'Geyser Tower',
    cost:     145,
    color:    '#00BCD4',
    accentColor: '#006064',
    bulletColor: '#E0F7FA',
    description: 'Knocks back enemies. Disrupts formations.',
    splash: true,
    knockback: true,
    world: 'volcanic',
    levels: [
      { damage: 12, range: 100, fireRate: 0.9, bulletSpeed: 250, knockbackForce: 40, splashRadius: 50 },
      { damage: 20, range: 120, fireRate: 1.1, bulletSpeed: 280, knockbackForce: 50, splashRadius: 60 },
      { damage: 30, range: 140, fireRate: 1.3, bulletSpeed: 310, knockbackForce: 60, splashRadius: 70 },
      { damage: 45, range: 160, fireRate: 1.6, bulletSpeed: 340, knockbackForce: 70, splashRadius: 80 },
    ],
    upgradeCost: [130, 190, 260],
  },
  lavaGolem: {
    id:       'lavaGolem',
    label:    'Lava Golem',
    cost:     250,
    color:    '#D84315',
    accentColor: '#8D1F00',
    bulletColor: '#FFAB91',
    description: 'Massive damage. Slow but devastating.',
    splash: false,
    world: 'volcanic',
    levels: [
      { damage: 80, range: 110, fireRate: 0.4, bulletSpeed: 200 },
      { damage: 130, range: 130, fireRate: 0.5, bulletSpeed: 230 },
      { damage: 190, range: 150, fireRate: 0.6, bulletSpeed: 260 },
      { damage: 270, range: 170, fireRate: 0.7, bulletSpeed: 290 },
    ],
    upgradeCost: [220, 320, 450],
  },

  // ── Cosmic World Towers ─
  plasma: {
    id:       'plasma',
    label:    'Plasma Tower',
    cost:     185,
    color:    '#7C4DFF',
    accentColor: '#651FFF',
    bulletColor: '#B388FF',
    description: 'Chains between enemies. Hits multiple targets.',
    chainLightning: true,
    world: 'cosmic',
    levels: [
      { damage: 20, range: 140, fireRate: 1.5, bulletSpeed: 450, chainCount: 3, chainRange: 70 },
      { damage: 32, range: 160, fireRate: 1.8, bulletSpeed: 500, chainCount: 4, chainRange: 80 },
      { damage: 48, range: 180, fireRate: 2.1, bulletSpeed: 550, chainCount: 5, chainRange: 90 },
      { damage: 68, range: 200, fireRate: 2.5, bulletSpeed: 600, chainCount: 6, chainRange: 100 },
    ],
    upgradeCost: [170, 240, 330],
  },
  voidEye: {
    id:       'voidEye',
    label:    'Void Eye',
    cost:     220,
    color:    '#311B92',
    accentColor: '#1A0072',
    bulletColor: '#D1C4E9',
    description: 'Teleports enemies. Pulls them toward the tower.',
    pullEffect: true,
    world: 'cosmic',
    levels: [
      { damage: 15, range: 150, fireRate: 0.8, bulletSpeed: 350, pullForce: 50 },
      { damage: 25, range: 170, fireRate: 1.0, bulletSpeed: 390, pullForce: 60 },
      { damage: 38, range: 190, fireRate: 1.2, bulletSpeed: 430, pullForce: 70 },
      { damage: 55, range: 210, fireRate: 1.5, bulletSpeed: 470, pullForce: 80 },
    ],
    upgradeCost: [200, 280, 390],
  },
  starForge: {
    id:       'starForge',
    label:    'Star Forge',
    cost:     350,
    color:    '#FFD600',
    accentColor: '#FF8F00',
    bulletColor: '#FFECB3',
    description: 'Devastating boss killer. Massive single-target damage.',
    splash: false,
    bossKiller: true,
    world: 'cosmic',
    levels: [
      { damage: 150, range: 180, fireRate: 0.35, bulletSpeed: 600, bossMultiplier: 2.0 },
      { damage: 220, range: 200, fireRate: 0.45, bulletSpeed: 650, bossMultiplier: 2.5 },
      { damage: 320, range: 220, fireRate: 0.55, bulletSpeed: 700, bossMultiplier: 3.0 },
      { damage: 450, range: 250, fireRate: 0.65, bulletSpeed: 750, bossMultiplier: 3.5 },
    ],
    upgradeCost: [300, 420, 580],
  },

  // ── Support Towers (Buff System) ─
  speedBoost: {
    id:       'speedBoost',
    label:    'Speed Boost',
    cost:     100,
    color:    '#00E676',
    accentColor: '#00C853',
    bulletColor: '#B9F6CA',
    description: '+20% attack speed to towers in range.',
    isSupport: true,
    buffType: 'speed',
    buffAmount: 0.20,
    buffRadius: 144, // 3 tiles
    levels: [
      { range: 144, buffAmount: 0.20 },
      { range: 168, buffAmount: 0.25 },
      { range: 192, buffAmount: 0.30 },
      { range: 216, buffAmount: 0.35 },
    ],
    upgradeCost: [80, 120, 170],
  },
  damageAmp: {
    id:       'damageAmp',
    label:    'Damage Amp',
    cost:     120,
    color:    '#FF5252',
    accentColor: '#D50000',
    bulletColor: '#FF8A80',
    description: '+25% damage to towers in range.',
    isSupport: true,
    buffType: 'damage',
    buffAmount: 0.25,
    buffRadius: 144,
    levels: [
      { range: 144, buffAmount: 0.25 },
      { range: 168, buffAmount: 0.30 },
      { range: 192, buffAmount: 0.35 },
      { range: 216, buffAmount: 0.40 },
    ],
    upgradeCost: [100, 150, 210],
  },
  rangeExtend: {
    id:       'rangeExtend',
    label:    'Range Extend',
    cost:     90,
    color:    '#448AFF',
    accentColor: '#2962FF',
    bulletColor: '#82B1FF',
    description: '+15% range to towers in range.',
    isSupport: true,
    buffType: 'range',
    buffAmount: 0.15,
    buffRadius: 144,
    levels: [
      { range: 144, buffAmount: 0.15 },
      { range: 168, buffAmount: 0.20 },
      { range: 192, buffAmount: 0.25 },
      { range: 216, buffAmount: 0.30 },
    ],
    upgradeCost: [70, 110, 150],
  },
  critChance: {
    id:       'critChance',
    label:    'Crit Chance',
    cost:     140,
    color:    '#E040FB',
    accentColor: '#AA00FF',
    bulletColor: '#EA80FC',
    description: '+15% critical hit chance to towers in range.',
    isSupport: true,
    buffType: 'crit',
    buffAmount: 0.15,
    buffRadius: 144,
    levels: [
      { range: 144, buffAmount: 0.15 },
      { range: 168, buffAmount: 0.20 },
      { range: 192, buffAmount: 0.25 },
      { range: 216, buffAmount: 0.30 },
    ],
    upgradeCost: [120, 180, 250],
  },
  healingAura: {
    id:       'healingAura',
    label:    'Healing Aura',
    cost:     150,
    color:    '#69F0AE',
    accentColor: '#00C853',
    bulletColor: '#B9F6CA',
    description: 'Repairs nearby towers over time.',
    isSupport: true,
    buffType: 'heal',
    buffAmount: 5,
    buffRadius: 144,
    levels: [
      { range: 144, buffAmount: 5 },
      { range: 168, buffAmount: 8 },
      { range: 192, buffAmount: 12 },
      { range: 216, buffAmount: 15 },
    ],
    upgradeCost: [130, 190, 260],
  },
  energyShield: {
    id:       'energyShield',
    label:    'Energy Shield',
    cost:     200,
    color:    '#40C4FF',
    accentColor: '#00B0FF',
    bulletColor: '#84FFFF',
    description: 'Temporary invulnerability for towers in range (triggered).',
    isSupport: true,
    buffType: 'shield',
    buffAmount: 1,
    buffRadius: 144,
    triggerRadius: 200,
    levels: [
      { range: 144, shieldDuration: 2.0, triggerRadius: 200 },
      { range: 168, shieldDuration: 2.5, triggerRadius: 220 },
      { range: 192, shieldDuration: 3.0, triggerRadius: 240 },
      { range: 216, shieldDuration: 3.5, triggerRadius: 260 },
    ],
    upgradeCost: [170, 250, 340],
  },
  synergyConnector: {
    id:       'synergyConnector',
    label:    'Synergy Connector',
    cost:     180,
    color:    '#FFD740',
    accentColor: '#FFAB00',
    bulletColor: '#FFE57F',
    description: 'Shares cooldown between towers in range.',
    isSupport: true,
    buffType: 'synergy',
    buffAmount: 0.25,
    buffRadius: 168,
    levels: [
      { range: 168, synergyAmount: 0.25 },
      { range: 192, synergyAmount: 0.35 },
      { range: 216, synergyAmount: 0.45 },
      { range: 240, synergyAmount: 0.55 },
    ],
    upgradeCost: [150, 220, 300],
  },
};

// Get tower definition by ID
export function getTowerDef(towerId) {
  return TOWER_DEFS[towerId] || null;
}

// Get towers available for a specific world
export function getTowersForWorld(worldId, unlockedTowers = []) {
  const available = ['basic', 'splash', 'ice', 'sniper', 'poison'];
  
  // Add world-specific towers
  switch(worldId) {
    case 'forest':
      available.push('archer', 'trapper', 'sentinel');
      break;
    case 'desert':
      available.push('flamethrower', 'sandweaver', 'duneCrawler');
      break;
    case 'ice':
      available.push('frostBolt', 'blizzard', 'crystalGuard');
      break;
    case 'volcanic':
      available.push('magmaCannon', 'geyser', 'lavaGolem');
      break;
    case 'cosmic':
      available.push('plasma', 'voidEye', 'starForge');
      break;
  }
  
  // Add support towers (always available after unlocking)
  available.push('speedBoost', 'damageAmp', 'rangeExtend', 'critChance', 'healingAura', 'energyShield', 'synergyConnector');
  
  // Filter by unlocked towers if provided
  if (unlockedTowers.length > 0) {
    return available.filter(t => unlockedTowers.includes(t));
  }
  
  return available;
}

// ── Enemy Definitions ────────────────────────────────────────
export const ENEMY_DEFS = {
  // ── Base Enemies ─
  normal: {
    id:      'normal',
    label:   'Goblin',
    hp:      80,
    speed:   80,
    reward:  15,
    size:    14,
    color:   '#EF5350',
    damage:  1,
    world: 'forest',
  },
  fast: {
    id:      'fast',
    label:   'Wolf',
    hp:      45,
    speed:   160,
    reward:  20,
    size:    11,
    color:   '#AB47BC',
    damage:  1,
    world: 'forest',
  },
  tank: {
    id:      'tank',
    label:   'Treant',
    hp:      280,
    speed:   45,
    reward:  40,
    size:    20,
    color:   '#78909C',
    damage:  3,
    world: 'forest',
  },
  healer: {
    id:      'healer',
    label:   'Fairy',
    hp:      60,
    speed:   55,
    reward:  25,
    size:    12,
    color:   '#4CAF50',
    damage:  1,
    ability: 'heal',
    healAmount: 10,
    healRadius: 60,
    healInterval: 1.0,
    world: 'forest',
  },
  shielded: {
    id:      'shielded',
    label:   'Armored Guard',
    hp:      150,
    speed:   60,
    reward:  35,
    size:    16,
    color:   '#90A4AE',
    damage:  2,
    ability: 'shield',
    shieldThreshold: 0.5,
    damageReduction: 0.5,
    world: 'forest',
  },
  boss: {
    id:      'boss',
    label:   'Forest Guardian',
    hp:      500,
    speed:   30,
    reward:  100,
    size:    28,
    color:   '#D32F2F',
    damage:  5,
    isBoss:  true,
    world: 'forest',
  },
  
  // ── NEW: Special Enemies for enhanced gameplay ─
  brute: {
    id:      'brute',
    label:   'Brute',
    hp:      250,
    speed:   45,
    reward:  30,
    size:    22,
    color:   '#78716c',
    damage:  3,
    // Special: Immune to slow, poison; takes reduced damage
    immuneTo: ['slow', 'poison', 'freeze'],
    armor: 0.3,
    world: 'forest',
  },
  phase: {
    id:      'phase',
    label:   'Phase Runner',
    hp:      80,
    speed:   100,
    reward:  15,
    size:    14,
    color:   '#8b5cf6',
    damage:  1,
    // Special: Briefly becomes invulnerable every 5 seconds
    ability: 'phase_shift',
    phaseDuration: 1.5,
    phaseCooldown: 5,
    world: 'desert',
  },
  phantom: {
    id:      'phantom',
    label:   'Phantom',
    hp:      50,
    speed:   120,
    reward:  20,
    size:    12,
    color:   '#06b6d4',
    damage:  1,
    // Special: Teleports forward 20% of path every 10 seconds
    ability: 'teleport',
    teleportInterval: 10,
    teleportDistance: 0.2,
    world: 'ice',
  },
  medic: {
    id:      'medic',
    label:   'Combat Medic',
    hp:      80,
    speed:   70,
    reward:  25,
    size:    14,
    color:   '#22c55e',
    damage:  1,
    // Special: Heals nearby enemies
    ability: 'heal_aura',
    healRadius: 80,
    healRate: 15,
    healInterval: 1.0,
    world: 'ice',
  },
  necromancer: {
    id:      'necromancer',
    label:   'Necromancer',
    hp:      150,
    speed:   50,
    reward:  40,
    size:    16,
    color:   '#a855f7',
    damage:  2,
    // Special: Spawns weak minions periodically
    ability: 'summon',
    summonCount: 3,
    summonInterval: 8,
    summonType: 'skeleton',
    world: 'volcanic',
  },
  juggernaut: {
    id:      'juggernaut',
    label:   'Juggernaut',
    hp:      500,
    speed:   35,
    reward:  80,
    size:    28,
    color:   '#dc2626',
    damage:  5,
    // Special: Has shield that regenerates
    shieldMax: 200,
    shieldRegen: 10,
    shieldRegenDelay: 3,
    isBoss: false,
    world: 'volcanic',
  },
  swarmQueen: {
    id:      'swarm',
    label:   'Swarm Queen',
    hp:      100,
    speed:   110,
    reward:  25,
    size:    15,
    color:   '#f97316',
    damage:  2,
    // Special: Spawns mini-swarm on death
    spawnOnDeath: 5,
    spawnType: 'swarmling',
    spawnRadius: 50,
    world: 'forest',
  },
  swarmling: {
    id:      'swarmling',
    label:   'Swarmling',
    hp:      28,
    speed:   125,
    reward:  8,
    size:    9,
    color:   '#fbbf24',
    damage:  1,
    world: 'forest',
  },
  stalker: {
    id:      'stalker',
    label:   'Stalker',
    hp:      60,
    speed:   90,
    reward:  18,
    size:    13,
    color:   '#1f2937',
    damage:  1,
    // Special: Invisible until within 100px of tower
    invisible: true,
    revealDistance: 100,
    world: 'cosmic',
  },

  // ── Desert Enemies ─
  scorpion: {
    id:      'scorpion',
    label:   'Sand Scorpion',
    hp:      70,
    speed:   130,
    reward:  18,
    size:    13,
    color:   '#D4A574',
    damage:  1,
    world: 'desert',
  },
  sandWorm: {
    id:      'sandWorm',
    label:   'Sand Worm',
    hp:      200,
    speed:   70,
    reward:  35,
    size:    18,
    color:   '#BCAAA4',
    damage:  2,
    world: 'desert',
  },
  mummy: {
    id:      'mummy',
    label:   'Mummy',
    hp:      120,
    speed:   60,
    reward:  28,
    size:    15,
    color:   '#8D6E63',
    damage:  2,
    world: 'desert',
  },
  pharaoh: {
    id:      'pharaoh',
    label:   'Pharaoh',
    hp:      800,
    speed:   35,
    reward:  200,
    size:    26,
    color:   '#FFD54F',
    damage:  4,
    isBoss:  true,
    world: 'desert',
  },
  scorpionKing: {
    id:      'scorpionKing',
    label:   'Scorpion King',
    hp:      1000,
    speed:   40,
    reward:  250,
    size:    30,
    color:   '#8D1F00',
    damage:  5,
    isBoss:  true,
    world: 'desert',
  },

  // ── Ice Enemies ─
  frostElemental: {
    id:      'frostElemental',
    label:   'Frost Elemental',
    hp:      90,
    speed:   90,
    reward:  22,
    size:    14,
    color:   '#81D4FA',
    damage:  1,
    world: 'ice',
  },
  iceGolem: {
    id:      'iceGolem',
    label:   'Ice Golem',
    hp:      300,
    speed:   40,
    reward:  50,
    size:    22,
    color:   '#B3E5FC',
    damage:  3,
    world: 'ice',
  },
  snowWolf: {
    id:      'snowWolf',
    label:   'Snow Wolf',
    hp:      55,
    speed:   170,
    reward:  20,
    size:    12,
    color:   '#ECEFF1',
    damage:  1,
    world: 'ice',
  },
  frostMage: {
    id:      'frostMage',
    label:   'Frost Mage',
    hp:      80,
    speed:   50,
    reward:  30,
    size:    13,
    color:   '#4FC3F7',
    damage:  2,
    world: 'ice',
  },
  crystalSpider: {
    id:      'crystalSpider',
    label:   'Crystal Spider',
    hp:      100,
    speed:   120,
    reward:  25,
    size:    14,
    color:   '#E1BEE7',
    damage:  1,
    world: 'ice',
  },
  iceKing: {
    id:      'iceKing',
    label:   'Ice King',
    hp:      1200,
    speed:   30,
    reward:  300,
    size:    28,
    color:   '#0288D1',
    damage:  5,
    isBoss:  true,
    world: 'ice',
  },
  iceQueen: {
    id:      'iceQueen',
    label:   'Ice Queen',
    hp:      1000,
    speed:   35,
    reward:  280,
    size:    26,
    color:   '#7B1FA2',
    damage:  4,
    isBoss:  true,
    world: 'ice',
  },
  iceDragon: {
    id:      'iceDragon',
    label:   'Ice Dragon',
    hp:      2000,
    speed:   45,
    reward:  500,
    size:    32,
    color:   '#00BCD4',
    damage:  6,
    isBoss:  true,
    world: 'ice',
  },

  // ── Volcanic Enemies ─
  lavaElemental: {
    id:      'lavaElemental',
    label:   'Lava Elemental',
    hp:      150,
    speed:   75,
    reward:  30,
    size:    16,
    color:   '#FF5722',
    damage:  2,
    world: 'volcanic',
  },
  fireImp: {
    id:      'fireImp',
    label:   'Fire Imp',
    hp:      50,
    speed:   180,
    reward:  18,
    size:    11,
    color:   '#FFAB91',
    damage:  1,
    world: 'volcanic',
  },
  ashDrake: {
    id:      'ashDrake',
    label:   'Ash Drake',
    hp:      250,
    speed:   100,
    reward:  45,
    size:    20,
    color:   '#5D4037',
    damage:  3,
    world: 'volcanic',
  },
  lavaGolem: {
    id:      'lavaGolemEnemy',
    label:   'Lava Golem',
    hp:      400,
    speed:   35,
    reward:  60,
    size:    24,
    color:   '#BF360C',
    damage:  4,
    world: 'volcanic',
  },
  fireDemon: {
    id:      'fireDemon',
    label:   'Fire Demon',
    hp:      180,
    speed:   85,
    reward:  40,
    size:    17,
    color:   '#D84315',
    damage:  3,
    world: 'volcanic',
  },
  fireElementalLord: {
    id:      'fireElementalLord',
    label:   'Fire Elemental Lord',
    hp:      2500,
    speed:   40,
    reward:  600,
    size:    30,
    color:   '#FF3D00',
    damage:  6,
    isBoss:  true,
    world: 'volcanic',
  },
  pitLord: {
    id:      'pitLord',
    label:   'Pit Lord',
    hp:      1800,
    speed:   45,
    reward:  450,
    size:    28,
    color:   '#4E342E',
    damage:  5,
    isBoss:  true,
    world: 'volcanic',
  },
  volcanoGod: {
    id:      'volcanoGod',
    label:   'Volcano God',
    hp:      3500,
    speed:   35,
    reward:  800,
    size:    34,
    color:   '#BF360C',
    damage:  8,
    isBoss:  true,
    world: 'volcanic',
  },
  demonKing: {
    id:      'demonKing',
    label:   'Demon King',
    hp:      4000,
    speed:   40,
    reward:  1000,
    size:    36,
    color:   '#212121',
    damage:  10,
    isBoss:  true,
    world: 'volcanic',
  },

  // ── Cosmic Enemies ─
  cosmicDrifter: {
    id:      'cosmicDrifter',
    label:   'Cosmic Drifter',
    hp:      100,
    speed:   130,
    reward:  25,
    size:    13,
    color:   '#7C4DFF',
    damage:  1,
    world: 'cosmic',
  },
  voidSpawn: {
    id:      'voidSpawn',
    label:   'Void Spawn',
    hp:      60,
    speed:   200,
    reward:  22,
    size:    10,
    color:   '#311B92',
    damage:  1,
    world: 'cosmic',
  },
  starSentinel: {
    id:      'starSentinel',
    label:   'Star Sentinel',
    hp:      300,
    speed:   70,
    reward:  55,
    size:    18,
    color:   '#FFD600',
    damage:  3,
    world: 'cosmic',
  },
  darkMatter: {
    id:      'darkMatter',
    label:   'Dark Matter',
    hp:      400,
    speed:   50,
    reward:  70,
    size:    20,
    color:   '#1A1A2E',
    damage:  4,
    world: 'cosmic',
  },
  voidLord: {
    id:      'voidLord',
    label:   'Void Lord',
    hp:      1500,
    speed:   55,
    reward:  350,
    size:    26,
    color:   '#4A148C',
    damage:  5,
    isBoss:  true,
    world: 'cosmic',
  },
  voidBehemoth: {
    id:      'voidBehemoth',
    label:   'Void Behemoth',
    hp:      3000,
    speed:   40,
    reward:  700,
    size:    32,
    color:   '#0D0221',
    damage:  7,
    isBoss:  true,
    world: 'cosmic',
  },
  cosmicGuardian: {
    id:      'cosmicGuardian',
    label:   'Cosmic Guardian',
    hp:      4000,
    speed:   45,
    reward:  900,
    size:    30,
    color:   '#651FFF',
    damage:  6,
    isBoss:  true,
    world: 'cosmic',
  },
  dimensionRift: {
    id:      'dimensionRift',
    label:   'Dimension Rift',
    hp:      5000,
    speed:   35,
    reward:  1200,
    size:    36,
    color:   '#311B92',
    damage:  8,
    isBoss:  true,
    world: 'cosmic',
  },
  cosmicDestroyer: {
    id:      'cosmicDestroyer',
    label:   'Cosmic Destroyer',
    hp:      8000,
    speed:   50,
    reward:  2500,
    size:    40,
    color:   '#000000',
    damage:  15,
    isBoss:  true,
    world: 'cosmic',
  },
};

// Get enemy definition by ID
export function getEnemyDef(enemyId) {
  return ENEMY_DEFS[enemyId] || null;
}

// ── Wave Definitions (Legacy - for compatibility) ────────────
export const WAVES = [
  // Wave 1 — tutorial
  [
    { type: 'normal', count: 8,  interval: 1.2 },
  ],
  // Wave 2
  [
    { type: 'normal', count: 10, interval: 1.0 },
    { type: 'fast',   count: 4,  interval: 0.8 },
  ],
  // Wave 3
  [
    { type: 'fast',   count: 8,  interval: 0.7 },
    { type: 'normal', count: 6,  interval: 1.0 },
    { type: 'tank',   count: 2,  interval: 2.5 },
  ],
  // Wave 4
  [
    { type: 'tank',   count: 4,  interval: 2.0 },
    { type: 'fast',   count: 10, interval: 0.5 },
  ],
  // Wave 5 — boss rush
  [
    { type: 'normal', count: 15, interval: 0.6 },
    { type: 'tank',   count: 6,  interval: 1.8 },
    { type: 'fast',   count: 12, interval: 0.4 },
  ],
  // Wave 6 — healer introduction
  [
    { type: 'normal', count: 12, interval: 0.8 },
    { type: 'healer', count: 2,  interval: 3.0 },
    { type: 'fast',   count: 6,  interval: 0.6 },
  ],
  // Wave 7 — shielded enemies
  [
    { type: 'shielded', count: 5, interval: 1.5 },
    { type: 'normal',   count: 10, interval: 0.7 },
    { type: 'healer',   count: 2, interval: 2.5 },
  ],
  // Wave 8 — mixed assault
  [
    { type: 'fast',     count: 12, interval: 0.4 },
    { type: 'tank',    count: 5,  interval: 2.0 },
    { type: 'healer',  count: 3,  interval: 2.0 },
    { type: 'shielded', count: 3, interval: 2.5 },
  ],
  // Wave 9 — heavy assault
  [
    { type: 'tank',      count: 8,  interval: 1.8 },
    { type: 'shielded', count: 6,  interval: 2.0 },
    { type: 'healer',   count: 4,  interval: 1.5 },
    { type: 'fast',     count: 15, interval: 0.3 },
  ],
  // Wave 10 — boss wave
  [
    { type: 'boss',     count: 1,  interval: 0 },
    { type: 'normal',  count: 20, interval: 0.5 },
    { type: 'healer',  count: 3,  interval: 2.0 },
  ],
];

// Enhanced wave generation templates for endless mode variety
export const WAVE_TEMPLATES = {
  // Standard mixed wave
  mixed: {
    composition: [
      { type: 'normal', count: 10, interval: 0.8 },
      { type: 'fast', count: 5, interval: 1.0, delay: 3 },
      { type: 'tank', count: 2, interval: 2.0, delay: 8 },
    ],
  },
  // Rush wave - many fast enemies early
  rush: {
    composition: [
      { type: 'fast', count: 15, interval: 0.5 },
      { type: 'normal', count: 8, interval: 0.8, delay: 5 },
    ],
  },
  // Tank wave - few strong enemies
  tankWave: {
    composition: [
      { type: 'tank', count: 5, interval: 3 },
      { type: 'normal', count: 10, interval: 1, delay: 8 },
    ],
  },
  // Swarm wave - overwhelming numbers
  swarm: {
    composition: [
      { type: 'normal', count: 20, interval: 0.3 },
      { type: 'fast', count: 10, interval: 0.4, delay: 2 },
    ],
  },
  // Healer wave - support enemies
  healerWave: {
    composition: [
      { type: 'healer', count: 5, interval: 2.0 },
      { type: 'normal', count: 12, interval: 0.8, delay: 3 },
      { type: 'fast', count: 6, interval: 0.6, delay: 5 },
    ],
  },
  // Shielded wave - armored enemies
  armored: {
    composition: [
      { type: 'shielded', count: 8, interval: 1.5 },
      { type: 'tank', count: 3, interval: 2.5, delay: 5 },
    ],
  },
  // Brute wave - CC immune heavy enemies
  bruteForce: {
    composition: [
      { type: 'brute', count: 4, interval: 2.5 },
      { type: 'normal', count: 10, interval: 0.8, delay: 4 },
    ],
  },
  // Phase/teleport wave - special mechanics
  phaseShift: {
    composition: [
      { type: 'phase', count: 3, interval: 3.0 },
      { type: 'phantom', count: 4, interval: 2.0, delay: 2 },
      { type: 'normal', count: 8, interval: 0.8, delay: 6 },
    ],
  },
  // Mini-boss wave - boss with support
  miniBoss: {
    composition: [
      { type: 'boss', count: 1, delay: 2 },
      { type: 'normal', count: 8, interval: 0.8, delay: 0 },
      { type: 'healer', count: 3, interval: 2, delay: 4 },
    ],
    bossScaling: 0.5,  // 50% of normal boss HP
  },
};

// For waves beyond WAVES.length, auto-scale with template variety:
export function generateWave(waveNumber) {
  const scale = 1 + (waveNumber - WAVES.length) * 0.2; // Reduced from 0.3 for balance
  
  // Select wave template based on wave number for variety
  const templates = ['mixed', 'rush', 'tankWave', 'swarm', 'healerWave', 'armored', 'bruteForce', 'phaseShift'];
  
  // Every 5th wave = mini boss
  if ((waveNumber - WAVES.length) % 5 === 0) {
    return WAVE_TEMPLATES.miniBoss.composition.map(group => ({
      ...group,
      count: Math.floor(group.count * scale),
      interval: group.interval ? Math.max(0.3, group.interval / scale) : undefined,
    }));
  }
  
  // Select template based on wave number cycle
  const template = templates[(waveNumber - WAVES.length) % templates.length];
  const templateDef = WAVE_TEMPLATES[template];
  
  // Build wave composition with scaling
  let waveDef = [];
  
  for (const group of templateDef.composition) {
    const count = Math.floor(group.count * scale);
    const interval = group.interval ? Math.max(0.2, group.interval / scale) : undefined;
    
    // Add delay offset if specified
    if (group.delay) {
      waveDef.push({ type: group.type, count, interval, delay: group.delay * scale });
    } else {
      waveDef.push({ type: group.type, count, interval });
    }
  }
  
  // Late waves add special enemies
  if (waveNumber > 20) {
    waveDef.push({ type: 'brute', count: Math.floor(2 * scale), interval: 3.0 });
  }
  if (waveNumber > 30) {
    waveDef.push({ type: 'juggernaut', count: 1, interval: 0 });
  }
  if (waveNumber > 40 && waveNumber % 10 === 0) {
    waveDef.push({ type: 'swarmQueen', count: 3, interval: 1.0 });
  }
  
  return waveDef;
}

// ── Economy ──────────────────────────────────────────────────
export const STARTING_MONEY  = 150;
export const STARTING_HEALTH = 20;
export const SELL_REFUND_PCT = 0.6; // 60% refund on sell

// ── Event System ────────────────────────────────────────────────
export const EVENT_WAVES = {
  // Double gold weekend
  doubleGold: {
    trigger: 'weekend',
    effect: { goldMultiplier: 2.0 },
    description: 'All enemy kills worth 2x gold!',
    icon: '💰',
  },
  // Time attack mode
  timeAttack: {
    trigger: 'manual',
    effect: { spawnRate: 1.5, waveTimeLimit: 60 },
    description: 'Kill all enemies in 60 seconds!',
    reward: { gold: 200, unlock: 'timeAttackMode' },
    icon: '⏱️',
  },
  // Treasure wave - bonus drops
  treasure: {
    trigger: 'random',
    chance: 0.05,
    effect: { bonusDrops: true },
    description: 'Treasure chests spawn!',
    drops: ['gold', 'powerup', 'cosmetic'],
    icon: '🎁',
  },
};

// Secret bonus rounds
export const SECRET_BONUSES = {
  bananaGlitch: {
    trigger: { wave: 7, lives: 7 },
    effect: 'bananaArmy',
    description: '🐒 BANANA ARMY ATTACKS!',
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

// ── Backwards Compatibility Aliases ───────────────────────────
// For code that imports from the old location
export { WAYPOINTS_PX as WAYPOINTS, PATH_TILE_SET as PATH_TILES };

// ── Game States ───────────────────────────────────────────────
export const GAME_STATE = {
  IDLE:     'idle',      // before first wave
  RUNNING:  'running',
  PAUSED:   'paused',
  GAMEOVER: 'gameover',
  VICTORY:  'victory',
};

// â”€â”€ World Progression â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function offsetWaypoints(waypoints, dx = 0, dy = 0) {
  return waypoints.map(([c, r]) => [c + dx, r + dy]);
}

function makeWorldLevels({
  worldId,
  titlePrefix,
  intro,
  enemyPool,
  towerUnlocks,
  theme,
  pathVariants,
}) {
  const levelNames = [
    'Arrival',
    'Outpost',
    'Hidden Trail',
    'Forked Path',
    'Forward Camp',
    'Deep Wilds',
    'Pressure Point',
    'Night Watch',
    'Siege Line',
    'Elders Rise',
    'Final Gate',
    'World Trial',
  ];

  return levelNames.map((name, index) => {
    const pathVariant = pathVariants[index % pathVariants.length];
    return {
      id: `${worldId}-level-${index + 1}`,
      worldId,
      levelNumber: index + 1,
      title: `${titlePrefix} ${name}`,
      intro: index === 0 ? intro : `Campaign pressure rises in ${titlePrefix.toLowerCase()}.`,
      theme,
      enemyPool,
      towerUnlocks,
      pathVariant: pathVariant.id,
      waypoints: pathVariant.waypoints,
      hpMultiplier: Number((1 + index * 0.14).toFixed(2)),
      speedMultiplier: Number((1 + index * 0.05).toFixed(2)),
      goldReward: 100 + index * 35,
      targetWaves: Math.min(5 + Math.floor(index / 2), 10),
      stars: [
        { stars: 1, label: 'Clear', condition: 'complete' },
        { stars: 2, label: 'Efficient', condition: 'bonus' },
        { stars: 3, label: 'Perfect', condition: 'perfect' },
      ],
    };
  });
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
    intro: 'The forest path is alive with movement. Protect the heart grove and unlock the first arsenal.',
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
    intro: 'Magma spills across the field as the ground itself fights back. Hold firm against the heat.',
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
    intro: 'The last world bends light and time. Only the strongest towers can survive what comes next.',
    enemyPool: ['shielded', 'boss', 'voidling', 'star_cruiser', 'eclipse_boss'],
    towerUnlocks: ['plasma', 'void_eye', 'star_forge', 'basic', 'sniper'],
    availableTowers: ['plasma', 'void_eye', 'star_forge'],
    pathVariants: [
      { id: 'orbit', waypoints: offsetWaypoints(WAYPOINTS_GRID, 0, 0) },
      { id: 'nebula', waypoints: offsetWaypoints(WAYPOINTS_GRID, 0, 0) },
    ],
  },
};

/*
export const WORLDS = WORLD_DEFS;
export const WORLD_PATH_VARIANTS = Object.fromEntries(
  Object.entries(WORLD_DEFS).map(([worldId, world]) => [worldId, world.pathVariants])
);
export const WORLD_TOWER_UNLOCKS = Object.fromEntries(
  Object.entries(WORLD_DEFS).map(([worldId, world]) => [worldId, world.towerUnlocks])
);
export const WORLD_LEVELS = Object.fromEntries(
  Object.entries(WORLD_DEFS).map(([worldId, world]) => [
    worldId,
    makeWorldLevels({
      worldId,
      titlePrefix: world.label.replace(' World', ''),
      intro: world.intro,
      enemyPool: world.enemyPool,
      towerUnlocks: world.towerUnlocks,
      theme: world.theme,
      pathVariants: world.pathVariants,
    }),
  ])
);

export function getTowerDef(towerId) {
  return TOWER_DEFS[towerId] || null;
}

export function getLevel(worldId, levelNum) {
  return WORLD_LEVELS[worldId]?.[levelNum - 1] || null;
}

// â”€â”€ World Progression â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function offsetWaypoints(waypoints, dx = 0, dy = 0) {
  return waypoints.map(([c, r]) => [c + dx, r + dy]);
}

function makeWorldLevels({
  worldId,
  titlePrefix,
  intro,
  enemyPool,
  towerUnlocks,
  theme,
  pathVariants,
}) {
  const levelNames = [
    'Arrival',
    'Outpost',
    'Hidden Trail',
    'Forked Path',
    'Forward Camp',
    'Deep Wilds',
    'Pressure Point',
    'Night Watch',
    'Siege Line',
    'Elders Rise',
    'Final Gate',
    'World Trial',
  ];

  return levelNames.map((name, index) => {
    const pathVariant = pathVariants[index % pathVariants.length];
    return {
      id: `${worldId}-level-${index + 1}`,
      worldId,
      levelNumber: index + 1,
      title: `${titlePrefix} ${name}`,
      intro: index === 0 ? intro : `Campaign pressure rises in ${titlePrefix.toLowerCase()}.`,
      theme,
      enemyPool,
      towerUnlocks,
      pathVariant: pathVariant.id,
      waypoints: pathVariant.waypoints,
      hpMultiplier: Number((1 + index * 0.14).toFixed(2)),
      speedMultiplier: Number((1 + index * 0.05).toFixed(2)),
      goldReward: 100 + index * 35,
      targetWaves: Math.min(5 + Math.floor(index / 2), 10),
      stars: [
        { stars: 1, label: 'Clear', condition: 'complete' },
        { stars: 2, label: 'Efficient', condition: 'bonus' },
        { stars: 3, label: 'Perfect', condition: 'perfect' },
      ],
    };
  });
}

export const WORLD_ORDER = ['forest', 'desert', 'ice', 'volcanic', 'cosmic'];

export const WORLD_DEFS = {
  forest: {
    id: 'forest',
    label: 'Forest World',
    shortLabel: 'Forest',
    theme: {
      terrain: '#2d5a1b',
      terrainAlt: '#3a7a24',
      path: '#9bb36a',
      pathEdge: '#738b4f',
      sky: 'linear-gradient(180deg, #0b1f12 0%, #18361f 58%, #09120d 100%)',
      accent: '#86efac',
      ui: '#22c55e',
    },
    intro: 'The forest path is alive with movement. Protect the heart grove and unlock the first arsenal.',
    enemyPool: ['normal', 'fast', 'healer', 'sproutling', 'briar_runner', 'treant'],
    towerUnlocks: ['basic', 'splash', 'archer', 'trapper', 'sentinel'],
    pathVariants: [
      { id: 'canopy', waypoints: WAYPOINTS_GRID },
      { id: 'root-run', waypoints: offsetWaypoints(WAYPOINTS_GRID, 0, 0) },
    ],
  },
  desert: {
    id: 'desert',
    label: 'Desert World',
    shortLabel: 'Desert',
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
    pathVariants: [
      { id: 'dune-road', waypoints: offsetWaypoints(WAYPOINTS_GRID, 0, 0) },
      { id: 'oasis', waypoints: offsetWaypoints(WAYPOINTS_GRID, 0, 0) },
    ],
  },
  ice: {
    id: 'ice',
    label: 'Ice World',
    shortLabel: 'Ice',
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
    pathVariants: [
      { id: 'ice-ridge', waypoints: offsetWaypoints(WAYPOINTS_GRID, 0, 0) },
      { id: 'glacier-loop', waypoints: offsetWaypoints(WAYPOINTS_GRID, 0, 0) },
    ],
  },
  volcanic: {
    id: 'volcanic',
    label: 'Volcanic World',
    shortLabel: 'Volcano',
    theme: {
      terrain: '#4a1c16',
      terrainAlt: '#6b2118',
      path: '#f59e0b',
      pathEdge: '#dc2626',
      sky: 'linear-gradient(180deg, #170406 0%, #50140d 55%, #090102 100%)',
      accent: '#fb7185',
      ui: '#ef4444',
    },
    intro: 'Magma spills across the field as the ground itself fights back. Hold firm against the heat.',
    enemyPool: ['fast', 'tank', 'healer', 'ember_imp', 'lava_brute', 'ash_mage'],
    towerUnlocks: ['magma_cannon', 'geyser', 'lava_golem', 'basic', 'splash'],
    pathVariants: [
      { id: 'lava-stream', waypoints: offsetWaypoints(WAYPOINTS_GRID, 0, 0) },
      { id: 'ash-trail', waypoints: offsetWaypoints(WAYPOINTS_GRID, 0, 0) },
    ],
  },
  cosmic: {
    id: 'cosmic',
    label: 'Cosmic World',
    shortLabel: 'Cosmic',
    theme: {
      terrain: '#25163f',
      terrainAlt: '#3a2460',
      path: '#c4b5fd',
      pathEdge: '#8b5cf6',
      sky: 'radial-gradient(circle at top, #2f1c5d 0%, #12101f 55%, #05040a 100%)',
      accent: '#d8b4fe',
      ui: '#a855f7',
    },
    intro: 'The last world bends light and time. Only the strongest towers can survive what comes next.',
    enemyPool: ['shielded', 'boss', 'voidling', 'star_cruiser', 'eclipse_boss'],
    towerUnlocks: ['plasma', 'void_eye', 'star_forge', 'basic', 'sniper'],
    pathVariants: [
      { id: 'orbit', waypoints: offsetWaypoints(WAYPOINTS_GRID, 0, 0) },
      { id: 'nebula', waypoints: offsetWaypoints(WAYPOINTS_GRID, 0, 0) },
    ],
  },
};

export const WORLD_PATH_VARIANTS = Object.fromEntries(
  Object.entries(WORLD_DEFS).map(([worldId, world]) => [worldId, world.pathVariants])
);

export const WORLD_TOWER_UNLOCKS = Object.fromEntries(
  Object.entries(WORLD_DEFS).map(([worldId, world]) => [worldId, world.towerUnlocks])
);

export const WORLD_LEVELS = Object.fromEntries(
  Object.entries(WORLD_DEFS).map(([worldId, world]) => [
    worldId,
    makeWorldLevels({
      worldId,
      titlePrefix: world.label.replace(' World', ''),
      intro: world.intro,
      enemyPool: world.enemyPool,
      towerUnlocks: world.towerUnlocks,
      theme: world.theme,
      pathVariants: world.pathVariants,
    }),
  ])
);

*/
Object.assign(TOWER_DEFS, {
  archer: {
    id: 'archer',
    label: 'Archer Tower',
    cost: 95,
    color: '#a3e635',
    accentColor: '#3f6212',
    bulletColor: '#ecfccb',
    description: 'Rapid-fire arrows. Great early-game DPS.',
    splash: false,
    levels: [
      { damage: 12, range: 125, fireRate: 2.4, bulletSpeed: 420 },
      { damage: 18, range: 140, fireRate: 2.8, bulletSpeed: 460 },
      { damage: 26, range: 155, fireRate: 3.2, bulletSpeed: 500 },
      { damage: 34, range: 170, fireRate: 3.8, bulletSpeed: 540 },
    ],
    upgradeCost: [85, 120, 170],
  },
  trapper: {
    id: 'trapper',
    label: 'Trapper Tower',
    cost: 110,
    color: '#84cc16',
    accentColor: '#365314',
    bulletColor: '#d9f99d',
    description: 'Roots and snares enemies with long slows.',
    splash: false,
    levels: [
      { damage: 8, range: 110, fireRate: 1.2, bulletSpeed: 280, slowAmount: 0.25, slowDuration: 1.5 },
      { damage: 12, range: 125, fireRate: 1.4, bulletSpeed: 300, slowAmount: 0.35, slowDuration: 1.8 },
      { damage: 16, range: 140, fireRate: 1.6, bulletSpeed: 320, slowAmount: 0.45, slowDuration: 2.2 },
      { damage: 20, range: 155, fireRate: 1.8, bulletSpeed: 340, slowAmount: 0.5, slowDuration: 2.6 },
    ],
    upgradeCost: [90, 130, 180],
  },
  sentinel: {
    id: 'sentinel',
    label: 'Sentinel Tower',
    cost: 145,
    color: '#22c55e',
    accentColor: '#14532d',
    bulletColor: '#dcfce7',
    description: 'Long range watchtower with piercing shots.',
    splash: false,
    levels: [
      { damage: 30, range: 185, fireRate: 0.8, bulletSpeed: 500, pierce: 1 },
      { damage: 42, range: 205, fireRate: 0.95, bulletSpeed: 520, pierce: 1 },
      { damage: 56, range: 225, fireRate: 1.1, bulletSpeed: 540, pierce: 2 },
      { damage: 72, range: 250, fireRate: 1.25, bulletSpeed: 560, pierce: 2 },
    ],
    upgradeCost: [110, 160, 220],
  },
  flamethrower: {
    id: 'flamethrower',
    label: 'Flamethrower',
    cost: 130,
    color: '#fb923c',
    accentColor: '#9a3412',
    bulletColor: '#fdba74',
    description: 'Short range cone damage that burns enemies.',
    splash: true,
    levels: [
      { damage: 10, range: 95, fireRate: 2.0, bulletSpeed: 240, splash: true, splashRadius: 55, burnDamage: 4, burnDuration: 2.5 },
      { damage: 15, range: 110, fireRate: 2.4, bulletSpeed: 260, splash: true, splashRadius: 65, burnDamage: 6, burnDuration: 3.0 },
      { damage: 21, range: 125, fireRate: 2.8, bulletSpeed: 280, splash: true, splashRadius: 75, burnDamage: 8, burnDuration: 3.5 },
      { damage: 28, range: 140, fireRate: 3.1, bulletSpeed: 300, splash: true, splashRadius: 85, burnDamage: 10, burnDuration: 4.0 },
    ],
    upgradeCost: [100, 150, 210],
  },
  sandweaver: {
    id: 'sandweaver',
    label: 'Sandweaver',
    cost: 120,
    color: '#f59e0b',
    accentColor: '#78350f',
    bulletColor: '#fde68a',
    description: 'Threads sand webs that slow entire waves.',
    splash: false,
    levels: [
      { damage: 9, range: 120, fireRate: 1.05, bulletSpeed: 280, slowAmount: 0.35, slowDuration: 1.8 },
      { damage: 14, range: 140, fireRate: 1.2, bulletSpeed: 300, slowAmount: 0.45, slowDuration: 2.2 },
      { damage: 20, range: 160, fireRate: 1.35, bulletSpeed: 320, slowAmount: 0.55, slowDuration: 2.7 },
      { damage: 27, range: 180, fireRate: 1.55, bulletSpeed: 340, slowAmount: 0.6, slowDuration: 3.0 },
    ],
    upgradeCost: [95, 140, 190],
  },
  dune_crawler: {
    id: 'dune_crawler',
    label: 'Dune Crawler',
    cost: 155,
    color: '#d97706',
    accentColor: '#451a03',
    bulletColor: '#fbbf24',
    description: 'Fast skirmisher tower that excels at chasing priority targets.',
    splash: false,
    levels: [
      { damage: 18, range: 135, fireRate: 2.3, bulletSpeed: 420, pierce: 1, critChance: 0.1 },
      { damage: 24, range: 150, fireRate: 2.6, bulletSpeed: 450, pierce: 1, critChance: 0.12 },
      { damage: 32, range: 165, fireRate: 3.0, bulletSpeed: 470, pierce: 2, critChance: 0.15 },
      { damage: 42, range: 180, fireRate: 3.4, bulletSpeed: 500, pierce: 2, critChance: 0.18 },
    ],
    upgradeCost: [115, 170, 230],
  },
  frost_bolt: {
    id: 'frost_bolt',
    label: 'Frost Bolt',
    cost: 115,
    color: '#7dd3fc',
    accentColor: '#0c4a6e',
    bulletColor: '#e0f2fe',
    description: 'Precise ice shots with strong slowing power.',
    splash: false,
    levels: [
      { damage: 14, range: 130, fireRate: 1.3, bulletSpeed: 320, slowAmount: 0.4, slowDuration: 1.8 },
      { damage: 20, range: 145, fireRate: 1.5, bulletSpeed: 340, slowAmount: 0.45, slowDuration: 2.1 },
      { damage: 28, range: 160, fireRate: 1.7, bulletSpeed: 360, slowAmount: 0.55, slowDuration: 2.6 },
      { damage: 36, range: 175, fireRate: 1.9, bulletSpeed: 380, slowAmount: 0.6, slowDuration: 3.0 },
    ],
    upgradeCost: [95, 145, 200],
  },
  blizzard: {
    id: 'blizzard',
    label: 'Blizzard Tower',
    cost: 150,
    color: '#38bdf8',
    accentColor: '#1e3a8a',
    bulletColor: '#cffafe',
    description: 'Large area slow tower. Controls crowds and elite pushes.',
    splash: true,
    levels: [
      { damage: 11, range: 120, fireRate: 0.9, bulletSpeed: 250, splash: true, splashRadius: 60, slowAmount: 0.35, slowDuration: 1.6 },
      { damage: 15, range: 135, fireRate: 1.0, bulletSpeed: 270, splash: true, splashRadius: 72, slowAmount: 0.45, slowDuration: 2.0 },
      { damage: 20, range: 150, fireRate: 1.15, bulletSpeed: 290, splash: true, splashRadius: 84, slowAmount: 0.55, slowDuration: 2.4 },
      { damage: 26, range: 170, fireRate: 1.3, bulletSpeed: 310, splash: true, splashRadius: 96, slowAmount: 0.6, slowDuration: 2.8 },
    ],
    upgradeCost: [110, 160, 230],
  },
  crystal_guard: {
    id: 'crystal_guard',
    label: 'Crystal Guard',
    cost: 175,
    color: '#c4b5fd',
    accentColor: '#6d28d9',
    bulletColor: '#ede9fe',
    description: 'Piercing crystal shots that hold lanes open.',
    splash: false,
    levels: [
      { damage: 24, range: 165, fireRate: 1.0, bulletSpeed: 430, pierce: 2 },
      { damage: 34, range: 180, fireRate: 1.15, bulletSpeed: 450, pierce: 2 },
      { damage: 46, range: 195, fireRate: 1.3, bulletSpeed: 470, pierce: 3 },
      { damage: 60, range: 210, fireRate: 1.45, bulletSpeed: 490, pierce: 3 },
    ],
    upgradeCost: [130, 190, 260],
  },
  magma_cannon: {
    id: 'magma_cannon',
    label: 'Magma Cannon',
    cost: 160,
    color: '#f97316',
    accentColor: '#7c2d12',
    bulletColor: '#fdba74',
    description: 'Heavy splash damage with lingering burn.',
    splash: true,
    levels: [
      { damage: 22, range: 120, fireRate: 0.7, bulletSpeed: 230, splash: true, splashRadius: 62, burnDamage: 6, burnDuration: 2.5 },
      { damage: 34, range: 135, fireRate: 0.85, bulletSpeed: 250, splash: true, splashRadius: 76, burnDamage: 8, burnDuration: 3.0 },
      { damage: 48, range: 150, fireRate: 1.0, bulletSpeed: 270, splash: true, splashRadius: 90, burnDamage: 11, burnDuration: 3.5 },
      { damage: 66, range: 165, fireRate: 1.2, bulletSpeed: 290, splash: true, splashRadius: 104, burnDamage: 14, burnDuration: 4.0 },
    ],
    upgradeCost: [120, 180, 250],
  },
  geyser: {
    id: 'geyser',
    label: 'Geyser Tower',
    cost: 140,
    color: '#ef4444',
    accentColor: '#7f1d1d',
    bulletColor: '#fecaca',
    description: 'Launches enemies back and disrupts formation.',
    splash: true,
    levels: [
      { damage: 15, range: 115, fireRate: 0.95, bulletSpeed: 250, splash: true, splashRadius: 55, knockback: 15 },
      { damage: 22, range: 130, fireRate: 1.1, bulletSpeed: 270, splash: true, splashRadius: 70, knockback: 18 },
      { damage: 31, range: 145, fireRate: 1.25, bulletSpeed: 290, splash: true, splashRadius: 85, knockback: 22 },
      { damage: 40, range: 160, fireRate: 1.4, bulletSpeed: 310, splash: true, splashRadius: 100, knockback: 26 },
    ],
    upgradeCost: [105, 155, 215],
  },
  lava_golem: {
    id: 'lava_golem',
    label: 'Lava Golem',
    cost: 210,
    color: '#b91c1c',
    accentColor: '#450a0a',
    bulletColor: '#fca5a5',
    description: 'High damage tower with a fire aura.',
    splash: false,
    levels: [
      { damage: 40, range: 150, fireRate: 0.8, bulletSpeed: 320, burnDamage: 8, burnDuration: 2.5, critChance: 0.12 },
      { damage: 56, range: 165, fireRate: 0.95, bulletSpeed: 340, burnDamage: 10, burnDuration: 3.0, critChance: 0.15 },
      { damage: 74, range: 180, fireRate: 1.1, bulletSpeed: 360, burnDamage: 13, burnDuration: 3.5, critChance: 0.18 },
      { damage: 96, range: 195, fireRate: 1.25, bulletSpeed: 380, burnDamage: 16, burnDuration: 4.0, critChance: 0.2 },
    ],
    upgradeCost: [160, 220, 300],
  },
  plasma: {
    id: 'plasma',
    label: 'Plasma Tower',
    cost: 195,
    color: '#c084fc',
    accentColor: '#581c87',
    bulletColor: '#f5d0fe',
    description: 'Chains damage across nearby enemies.',
    splash: true,
    levels: [
      { damage: 26, range: 150, fireRate: 1.2, bulletSpeed: 380, chainTargets: 2 },
      { damage: 36, range: 165, fireRate: 1.35, bulletSpeed: 400, chainTargets: 3 },
      { damage: 48, range: 180, fireRate: 1.55, bulletSpeed: 420, chainTargets: 4 },
      { damage: 62, range: 200, fireRate: 1.75, bulletSpeed: 440, chainTargets: 5 },
    ],
    upgradeCost: [145, 205, 280],
  },
  void_eye: {
    id: 'void_eye',
    label: 'Void Eye',
    cost: 230,
    color: '#a855f7',
    accentColor: '#312e81',
    bulletColor: '#e9d5ff',
    description: 'Teleports focus between targets and punishes elites.',
    splash: false,
    levels: [
      { damage: 34, range: 175, fireRate: 0.95, bulletSpeed: 520, teleportChance: 0.1 },
      { damage: 46, range: 190, fireRate: 1.1, bulletSpeed: 560, teleportChance: 0.15 },
      { damage: 60, range: 210, fireRate: 1.25, bulletSpeed: 600, teleportChance: 0.2 },
      { damage: 78, range: 230, fireRate: 1.4, bulletSpeed: 640, teleportChance: 0.25 },
    ],
    upgradeCost: [170, 240, 320],
  },
  star_forge: {
    id: 'star_forge',
    label: 'Star Forge',
    cost: 280,
    color: '#f0abfc',
    accentColor: '#4c1d95',
    bulletColor: '#faf5ff',
    description: 'Boss hunting tower with massive crit potential.',
    splash: false,
    levels: [
      { damage: 48, range: 190, fireRate: 0.85, bulletSpeed: 560, critChance: 0.2, bossDamage: 1.25 },
      { damage: 66, range: 210, fireRate: 1.0, bulletSpeed: 590, critChance: 0.25, bossDamage: 1.35 },
      { damage: 88, range: 230, fireRate: 1.15, bulletSpeed: 620, critChance: 0.3, bossDamage: 1.5 },
      { damage: 114, range: 255, fireRate: 1.3, bulletSpeed: 660, critChance: 0.35, bossDamage: 1.7 },
    ],
    upgradeCost: [200, 280, 380],
  },
  speed_boost: {
    id: 'speed_boost',
    label: 'Speed Boost',
    cost: 125,
    color: '#34d399',
    accentColor: '#065f46',
    bulletColor: '#a7f3d0',
    description: 'Support tower. Buffs nearby towers with faster attack speed.',
    support: true,
    auraType: 'attackSpeed',
    auraRadius: 72,
    auraValue: 0.2,
    levels: [
      { range: 72, fireRate: 0.2, auraRadius: 72, auraValue: 0.2 },
      { range: 84, fireRate: 0.25, auraRadius: 84, auraValue: 0.25 },
      { range: 96, fireRate: 0.3, auraRadius: 96, auraValue: 0.3 },
      { range: 108, fireRate: 0.35, auraRadius: 108, auraValue: 0.35 },
    ],
    upgradeCost: [100, 150, 220],
  },
  damage_amp: {
    id: 'damage_amp',
    label: 'Damage Amp',
    cost: 145,
    color: '#f59e0b',
    accentColor: '#78350f',
    bulletColor: '#fde68a',
    description: 'Support tower. Increases damage output in a 3x3 grid.',
    support: true,
    auraType: 'damage',
    auraRadius: 72,
    auraValue: 0.25,
    levels: [
      { range: 72, fireRate: 0.18, auraRadius: 72, auraValue: 0.25 },
      { range: 84, fireRate: 0.22, auraRadius: 84, auraValue: 0.3 },
      { range: 96, fireRate: 0.26, auraRadius: 96, auraValue: 0.35 },
      { range: 108, fireRate: 0.3, auraRadius: 108, auraValue: 0.4 },
    ],
    upgradeCost: [110, 170, 240],
  },
  range_extend: {
    id: 'range_extend',
    label: 'Range Extend',
    cost: 135,
    color: '#60a5fa',
    accentColor: '#1d4ed8',
    bulletColor: '#dbeafe',
    description: 'Support tower. Extends nearby tower range.',
    support: true,
    auraType: 'range',
    auraRadius: 72,
    auraValue: 0.15,
    levels: [
      { range: 72, fireRate: 0.18, auraRadius: 72, auraValue: 0.15 },
      { range: 84, fireRate: 0.22, auraRadius: 84, auraValue: 0.18 },
      { range: 96, fireRate: 0.26, auraRadius: 96, auraValue: 0.21 },
      { range: 108, fireRate: 0.3, auraRadius: 108, auraValue: 0.25 },
    ],
    upgradeCost: [100, 155, 225],
  },
  crit_chance: {
    id: 'crit_chance',
    label: 'Crit Chance',
    cost: 170,
    color: '#f472b6',
    accentColor: '#831843',
    bulletColor: '#fbcfe8',
    description: 'Support tower. Grants nearby towers a critical hit chance.',
    support: true,
    auraType: 'critChance',
    auraRadius: 72,
    auraValue: 0.15,
    levels: [
      { range: 72, fireRate: 0.18, auraRadius: 72, auraValue: 0.15 },
      { range: 84, fireRate: 0.22, auraRadius: 84, auraValue: 0.2 },
      { range: 96, fireRate: 0.26, auraRadius: 96, auraValue: 0.25 },
      { range: 108, fireRate: 0.3, auraRadius: 108, auraValue: 0.3 },
    ],
    upgradeCost: [130, 180, 250],
  },
  healing_aura: {
    id: 'healing_aura',
    label: 'Healing Aura',
    cost: 165,
    color: '#4ade80',
    accentColor: '#14532d',
    bulletColor: '#dcfce7',
    description: 'Support tower. Repairs towers over time.',
    support: true,
    auraType: 'repair',
    auraRadius: 72,
    auraValue: 1.5,
    levels: [
      { range: 72, fireRate: 0.2, auraRadius: 72, auraValue: 1.5 },
      { range: 84, fireRate: 0.24, auraRadius: 84, auraValue: 2.0 },
      { range: 96, fireRate: 0.28, auraRadius: 96, auraValue: 2.6 },
      { range: 108, fireRate: 0.32, auraRadius: 108, auraValue: 3.2 },
    ],
    upgradeCost: [120, 180, 240],
  },
  energy_shield: {
    id: 'energy_shield',
    label: 'Energy Shield',
    cost: 190,
    color: '#22d3ee',
    accentColor: '#164e63',
    bulletColor: '#cffafe',
    description: 'Triggered support tower that can shield nearby towers briefly.',
    support: true,
    auraType: 'shield',
    auraRadius: 72,
    auraValue: 1,
    triggerOnHit: true,
    levels: [
      { range: 72, fireRate: 0.2, auraRadius: 72, shieldDuration: 1.5 },
      { range: 84, fireRate: 0.24, auraRadius: 84, shieldDuration: 2.0 },
      { range: 96, fireRate: 0.28, auraRadius: 96, shieldDuration: 2.5 },
      { range: 108, fireRate: 0.32, auraRadius: 108, shieldDuration: 3.0 },
    ],
    upgradeCost: [140, 200, 280],
  },
  synergy_connector: {
    id: 'synergy_connector',
    label: 'Synergy Connector',
    cost: 175,
    color: '#8b5cf6',
    accentColor: '#4c1d95',
    bulletColor: '#ddd6fe',
    description: 'Support tower. Shares cooldown and boosts synergy lines.',
    support: true,
    auraType: 'cooldownShare',
    auraRadius: 72,
    auraValue: 0.1,
    levels: [
      { range: 72, fireRate: 0.18, auraRadius: 72, auraValue: 0.1 },
      { range: 84, fireRate: 0.22, auraRadius: 84, auraValue: 0.14 },
      { range: 96, fireRate: 0.26, auraRadius: 96, auraValue: 0.18 },
      { range: 108, fireRate: 0.3, auraRadius: 108, auraValue: 0.22 },
    ],
    upgradeCost: [130, 190, 260],
  },
});

Object.assign(ENEMY_DEFS, {
  sproutling: {
    id: 'sproutling',
    label: 'Sproutling',
    hp: 70,
    speed: 90,
    reward: 16,
    size: 13,
    color: '#8bc34a',
    damage: 1,
  },
  briar_runner: {
    id: 'briar_runner',
    label: 'Briar Runner',
    hp: 52,
    speed: 170,
    reward: 22,
    size: 11,
    color: '#4caf50',
    damage: 1,
  },
  treant: {
    id: 'treant',
    label: 'Treant',
    hp: 320,
    speed: 42,
    reward: 46,
    size: 21,
    color: '#5d4037',
    damage: 3,
  },
  dune_runner: {
    id: 'dune_runner',
    label: 'Dune Runner',
    hp: 48,
    speed: 180,
    reward: 22,
    size: 11,
    color: '#f59e0b',
    damage: 1,
  },
  sand_wasp: {
    id: 'sand_wasp',
    label: 'Sand Wasp',
    hp: 56,
    speed: 150,
    reward: 26,
    size: 11,
    color: '#fbbf24',
    damage: 1,
  },
  sand_sentinel: {
    id: 'sand_sentinel',
    label: 'Sand Sentinel',
    hp: 240,
    speed: 52,
    reward: 44,
    size: 18,
    color: '#d97706',
    damage: 2,
  },
  frostling: {
    id: 'frostling',
    label: 'Frostling',
    hp: 62,
    speed: 92,
    reward: 18,
    size: 13,
    color: '#7dd3fc',
    damage: 1,
  },
  glacier_brute: {
    id: 'glacier_brute',
    label: 'Glacier Brute',
    hp: 340,
    speed: 48,
    reward: 48,
    size: 22,
    color: '#bae6fd',
    damage: 3,
  },
  ice_wisp: {
    id: 'ice_wisp',
    label: 'Ice Wisp',
    hp: 40,
    speed: 185,
    reward: 20,
    size: 10,
    color: '#dbeafe',
    damage: 1,
  },
  ember_imp: {
    id: 'ember_imp',
    label: 'Ember Imp',
    hp: 56,
    speed: 175,
    reward: 22,
    size: 11,
    color: '#fb7185',
    damage: 1,
  },
  lava_brute: {
    id: 'lava_brute',
    label: 'Lava Brute',
    hp: 360,
    speed: 44,
    reward: 52,
    size: 22,
    color: '#ef4444',
    damage: 3,
  },
  ash_mage: {
    id: 'ash_mage',
    label: 'Ash Mage',
    hp: 90,
    speed: 70,
    reward: 35,
    size: 14,
    color: '#f97316',
    damage: 2,
    ability: 'heal',
    healAmount: 12,
    healRadius: 70,
    healInterval: 1.2,
  },
  voidling: {
    id: 'voidling',
    label: 'Voidling',
    hp: 68,
    speed: 165,
    reward: 28,
    size: 12,
    color: '#a855f7',
    damage: 1,
  },
  star_cruiser: {
    id: 'star_cruiser',
    label: 'Star Cruiser',
    hp: 210,
    speed: 85,
    reward: 48,
    size: 17,
    color: '#d8b4fe',
    damage: 2,
    ability: 'shield',
    shieldThreshold: 0.45,
    damageReduction: 0.45,
  },
  eclipse_boss: {
    id: 'eclipse_boss',
    label: 'Eclipse Boss',
    hp: 700,
    speed: 36,
    reward: 180,
    size: 32,
    color: '#7c3aed',
    damage: 6,
    isBoss: true,
  },
});

// ── Game Screen States ────────────────────────────────────────
export const SCREEN_STATE = {
  MAIN_MENU: 'mainMenu',
  WORLD_SELECT: 'worldSelect',
  LEVEL_SELECT: 'levelSelect',
  GAME: 'game',
  SETTINGS: 'settings',
};

// ── Progression Constants ─────────────────────────────────────
export const PROGRESS = {
  MAX_STARS_PER_LEVEL: 3,
  STAR_THRESHOLDS: {
    ONE_STAR: 0.5,    // 50% of enemies killed
    TWO_STARS: 0.75,  // 75% of enemies killed
    THREE_STARS: 1.0, // 100% of enemies killed (or all)
  },
  LEVEL_UNLOCK_THRESHOLD: 3, // Need 3 stars to unlock next world
};

// ── Story Segments ────────────────────────────────────────────
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
      text: 'Beyond the forest lies the endless desert, home to ancient tombs and deadly scorpions. The Pharaoh\'s treasure awaits those brave enough to claim it.',
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
