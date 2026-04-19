// ============================================================
//  CONSTANTS.JS (BACKWARDS COMPATIBILITY)
//  This file re-exports all constants from modular files.
//  New code should import directly from the specific modules.
// ============================================================

// Grid configuration
export { TILE_SIZE, COLS, ROWS, CANVAS_WIDTH, CANVAS_HEIGHT } from './constants/grid.js';

// Color palettes
export { COLORS } from './constants/colors.js';

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
} from './constants/paths.js';

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
} from './constants/worlds.js';

// Tower definitions
export { TOWER_DEFS, getTowerDef, getTowersForWorld } from './constants/towers.js';

// Enemy definitions
export { ENEMY_DEFS, getEnemyDef } from './constants/enemies.js';

// Wave definitions
export { WAVES, WAVE_TEMPLATES, generateWave } from './constants/waves.js';

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
  SCREEN_STATE,
  PROGRESS,
  WORLD_STORIES,
} from './constants/game.js';

// Backwards compatibility aliases
export { WAYPOINTS, PATH_TILES } from './constants/paths.js';
