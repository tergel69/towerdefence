// ============================================================
//  spatialGrid.js
//  Grid-based spatial hashing for O(1) proximity queries.
//  Replaces O(n*m) tower-enemy distance checks.
// ============================================================

const GRID_CELL_SIZE = 96; // 2 tiles per cell

export function createSpatialGrid(width, height) {
  const cols = Math.ceil(width / GRID_CELL_SIZE);
  const rows = Math.ceil(height / GRID_CELL_SIZE);
  return {
    cols,
    rows,
    cells: new Array(cols * rows), // each cell is an array of enemy refs
  };
}

export function clearGrid(grid) {
  for (let i = 0; i < grid.cells.length; i++) {
    grid.cells[i] = null;
  }
}

function getCellIndex(grid, x, y) {
  const col = Math.floor(x / GRID_CELL_SIZE);
  const row = Math.floor(y / GRID_CELL_SIZE);
  if (col < 0 || col >= grid.cols || row < 0 || row >= grid.rows) return -1;
  return row * grid.cols + col;
}

export function insertEnemy(grid, enemy) {
  const idx = getCellIndex(grid, enemy.x, enemy.y);
  if (idx < 0) return;
  if (!grid.cells[idx]) grid.cells[idx] = [];
  grid.cells[idx].push(enemy);
}

export function rebuildGrid(grid, enemies) {
  clearGrid(grid);
  for (const enemy of enemies) {
    if (!enemy.dead) insertEnemy(grid, enemy);
  }
}

/**
 * Get enemies within radius of a point.
 * Checks the center cell and 8 neighboring cells.
 */
export function queryRadius(grid, x, y, radius) {
  const results = [];
  const col = Math.floor(x / GRID_CELL_SIZE);
  const row = Math.floor(y / GRID_CELL_SIZE);
  const cellRadius = Math.ceil(radius / GRID_CELL_SIZE);

  for (let dr = -cellRadius; dr <= cellRadius; dr++) {
    for (let dc = -cellRadius; dc <= cellRadius; dc++) {
      const testCol = col + dc;
      const testRow = row + dr;
      if (testCol < 0 || testCol >= grid.cols || testRow < 0 || testRow >= grid.rows) continue;
      const idx = testRow * grid.cols + testCol;
      const cell = grid.cells[idx];
      if (!cell) continue;
      for (const enemy of cell) {
        if (enemy.dead) continue;
        const dx = enemy.x - x;
        const dy = enemy.y - y;
        if (dx * dx + dy * dy <= radius * radius) {
          results.push(enemy);
        }
      }
    }
  }
  return results;
}
