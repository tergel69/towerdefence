// ============================================================
//  PATHS.JS
//  Path definitions, variations, and utilities
// ============================================================

import { TILE_SIZE } from './grid';

// ── Default Path ──────────────────────────────────────────────
export const DEFAULT_WAYPOINTS_GRID = [
  [0, 2],
  [4, 2],
  [4, 6],
  [9, 6],
  [9, 2],
  [14, 2],
  [14, 10],
  [5, 10],
  [5, 12],
  [19, 12],
];

export const WAYPOINTS_GRID = DEFAULT_WAYPOINTS_GRID.map(([c, r]) => [c, r]);

// ── Path Variations ───────────────────────────────────────────
export const PATH_VARIATIONS = {
  simple: [
    [0, 7],
    [5, 7],
    [5, 3],
    [12, 3],
    [12, 10],
    [19, 10],
  ],
  scurve: [
    [0, 3],
    [6, 3],
    [6, 10],
    [13, 10],
    [13, 4],
    [19, 4],
  ],
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
  diagonal: [
    [0, 2],
    [5, 5],
    [10, 2],
    [15, 8],
    [10, 12],
    [19, 12],
  ],
  labyrinth: [
    [0, 2],
    [3, 2],
    [3, 5],
    [1, 5],
    [1, 8],
    [6, 8],
    [6, 3],
    [10, 3],
    [10, 7],
    [14, 7],
    [14, 2],
    [17, 2],
    [17, 6],
    [12, 6],
    [12, 10],
    [8, 10],
    [8, 13],
    [4, 13],
    [4, 10],
    [7, 10],
    [7, 12],
    [19, 12],
  ],
  megaZigzag: [
    [0, 6],
    [4, 6],
    [4, 2],
    [8, 2],
    [8, 4],
    [12, 4],
    [12, 8],
    [16, 8],
    [16, 3],
    [19, 3],
    [19, 10],
    [15, 10],
    [15, 12],
    [10, 12],
    [10, 6],
  ],
  doubleSpiral: [
    [0, 2],
    [5, 2],
    [5, 10],
    [2, 10],
    [2, 4],
    [8, 4],
    [8, 12],
    [5, 12],
    [5, 6],
    [11, 6],
    [11, 2],
    [14, 2],
    [14, 8],
    [18, 8],
    [18, 12],
    [12, 12],
    [12, 10],
    [19, 10],
  ],
  chokepoint: [
    [0, 7],
    [4, 7],
    [4, 3],
    [7, 3],
    [7, 7],
    [10, 7],
    [10, 3],
    [13, 3],
    [13, 7],
    [16, 7],
    [16, 3],
    [19, 3],
  ],
  branching: [
    [0, 6],
    [5, 6],
    [5, 2],
    [9, 2],
    [9, 6],
    [14, 6],
    [14, 10],
    [9, 10],
    [9, 14],
    [5, 14],
    [5, 10],
    [0, 10],
  ],
  gauntlet: [
    [0, 2],
    [2, 2],
    [2, 5],
    [5, 5],
    [5, 2],
    [8, 2],
    [8, 5],
    [11, 5],
    [11, 2],
    [14, 2],
    [14, 5],
    [17, 5],
    [17, 8],
    [14, 8],
    [14, 11],
    [11, 11],
    [11, 8],
    [8, 8],
    [8, 11],
    [5, 11],
    [5, 8],
    [2, 8],
    [2, 12],
    [19, 12],
  ],
  splitDecision: [
    [0, 3],
    [4, 3],
    [4, 7],
    [8, 7],
    [8, 3],
    [12, 3],
    [12, 9],
    [16, 9],
    [16, 3],
    [19, 3],
  ],
};

// ── Path Metadata ─────────────────────────────────────────────
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

// ── Path Utilities ────────────────────────────────────────────
export function getRandomPath() {
  const keys = Object.keys(PATH_VARIATIONS);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return PATH_VARIATIONS[randomKey];
}

export function getPathWaypoints(random = false) {
  if (random) {
    return getRandomPath();
  }
  return WAYPOINTS_GRID;
}

export function gridToPixelWaypoints(gridWaypoints) {
  return gridWaypoints.map(([c, r]) => ({
    x: c * TILE_SIZE + TILE_SIZE / 2,
    y: r * TILE_SIZE + TILE_SIZE / 2,
  }));
}

export function buildPathTileSetFromWaypoints(gridWaypoints) {
  const tiles = new Set();
  for (let i = 0; i < gridWaypoints.length - 1; i++) {
    const [c1, r1] = gridWaypoints[i];
    const [c2, r2] = gridWaypoints[i + 1];
    const dc = Math.sign(c2 - c1);
    const dr = Math.sign(r2 - r1);
    let c = c1,
      r = r1;
    while (c !== c2 || r !== r2) {
      tiles.add(`${c},${r}`);
      c += dc;
      r += dr;
    }
    tiles.add(`${c2},${r2}`);
  }
  return tiles;
}

export function buildPathTileSet(waypoints) {
  const set = new Set();
  for (let i = 0; i < waypoints.length - 1; i++) {
    const [c1, r1] = waypoints[i];
    const [c2, r2] = waypoints[i + 1];
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

// ── Runtime Path State ────────────────────────────────────────
let _currentPathWaypointsGrid = null;
let _currentPathPixels = null;
let _currentPathTileSet = null;

export let CURRENT_WAYPOINTS_GRID = WAYPOINTS_GRID;
export let CURRENT_WAYPOINTS_PX = WAYPOINTS_GRID.map(([c, r]) => ({
  x: c * TILE_SIZE + TILE_SIZE / 2,
  y: r * TILE_SIZE + TILE_SIZE / 2,
}));
export let CURRENT_PATH_TILE_SET = buildPathTileSet(WAYPOINTS_GRID);

export const WAYPOINTS_PX = WAYPOINTS_GRID.map(([c, r]) => ({
  x: c * TILE_SIZE + TILE_SIZE / 2,
  y: r * TILE_SIZE + TILE_SIZE / 2,
}));

export const PATH_TILE_SET = buildPathTileSet(WAYPOINTS_GRID);

// Backwards compatibility aliases
export const WAYPOINTS = WAYPOINTS_GRID;
export const PATH_TILES = PATH_TILE_SET;

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

export function initRandomPathForGame() {
  const pathKeys = Object.keys(PATH_VARIATIONS);
  const randomKey = pathKeys[Math.floor(Math.random() * pathKeys.length)];
  rebuildPathState(PATH_VARIATIONS[randomKey]);
  // eslint-disable-next-line no-console
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

export function getCurrentPathGrid() {
  return _currentPathWaypointsGrid;
}

export function getCurrentPathPixels() {
  return _currentPathPixels;
}

export function getCurrentPathTiles() {
  return _currentPathTileSet;
}
