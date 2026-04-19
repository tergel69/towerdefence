// ============================================================
//  INDEX.JS (Barrel Export)
//  Re-exports all constants from modular files
// ============================================================

// Grid configuration
export { TILE_SIZE, COLS, ROWS, CANVAS_WIDTH, CANVAS_HEIGHT } from './grid.js';

// Color palettes
export { COLORS } from './colors.js';

// Path system
export {
  DEFAULT_WAYPOINTS_GRID,
  WAYPOINTS_GRID,
  WAYPOINTS_PX,
  PATH_TILE_SET,
  CURRENT_WAYPOINTS_GRID,
  CURRENT_WAYPOINTS_PX,
  CURRENT_PATH_TILE_SET,
  PATH_VARIATIONS,
  PATH_METADATA,
  getRandomPath,
  getPathWaypoints,
  gridToPixelWaypoints,
  buildPathTileSetFromWaypoints,
  buildPathTileSet,
  initRandomPathForGame,
  setPathForGame,
  resetDefaultPathForGame,
  getCurrentPathGrid,
  getCurrentPathPixels,
  getCurrentPathTiles,
} from './paths.js';

// World system and levels
export {
  WORLDS,
  LEVELS,
  TOWER_CATEGORIES,
  isCategoryUnlocked,
  getUnlockedTowers,
  getUnlockedCategories,
  ENEMY_CATEGORIES,
  isEnemyCategoryUnlocked,
  getUnlockedEnemies,
  ENEMY_SCALING,
  calculateEnemyStats,
  getWorldLevels,
} from './worlds.js';

// Tower definitions
export { TOWER_DEFS, getTowerDef, getTowersForWorld } from './towers.js';

// Enemy definitions
export { ENEMY_DEFS, getEnemyDef } from './enemies.js';

// Wave definitions
export { WAVES, WAVE_TEMPLATES, generateWave } from './waves.js';

// Game constants
export {
  STARTING_MONEY,
  STARTING_HEALTH,
  SELL_REFUND_PCT,
  EVENT_WAVES,
  SECRET_BONUSES,
  ALTERNATIVE_MODES,
  GAME_STATE,
  WORLD_ORDER,
  WORLD_DEFS,
  WORLD_PATH_VARIANTS,
  WORLD_TOWER_UNLOCKS,
  WORLD_LEVELS,
  getLevel,
  SCREEN_STATE,
  PROGRESS,
  WORLD_STORIES,
} from './game.js';

// Backwards compatibility aliases
export { WAYPOINTS, PATH_TILES } from './paths.js';
