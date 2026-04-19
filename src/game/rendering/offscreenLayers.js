// ============================================================
//  offscreenLayers.js
//  Offscreen canvas layering for performance optimization.
//  Static layers (grid, path) are drawn once to offscreen canvases
//  and blitted each frame instead of re-drawing from scratch.
// ============================================================

import { COLS, ROWS, TILE_SIZE, PATH_TILE_SET, COLORS } from '../constants';

const CANVAS_W = COLS * TILE_SIZE;
const CANVAS_H = ROWS * TILE_SIZE;

/**
 * Create offscreen canvas layers.
 * Returns { staticLayer, pathLayer } — each is an OffscreenCanvas or canvas element.
 */
export function createOffscreenLayers() {
  // Use OffscreenCanvas if available, fallback to regular canvas
  const StaticCanvas = typeof OffscreenCanvas !== 'undefined' ? OffscreenCanvas : HTMLCanvasElement;

  const staticLayer = new StaticCanvas(CANVAS_W, CANVAS_H);
  const pathLayer = new StaticCanvas(CANVAS_W, CANVAS_H);

  const staticCtx = staticLayer.getContext('2d');
  const pathCtx = pathLayer.getContext('2d');

  if (staticCtx) {
    staticCtx.imageSmoothingEnabled = false;
    drawGridStatic(staticCtx);
  }
  if (pathCtx) {
    pathCtx.imageSmoothingEnabled = false;
    drawPathStatic(pathCtx);
  }

  return { staticLayer, pathLayer, staticCtx, pathCtx };
}

/**
 * Draw grid to offscreen canvas (static — never changes).
 */
function drawGridStatic(ctx) {
  const gridLineColor = COLORS.gridLine || 'rgba(255,255,255,0.06)';

  ctx.fillStyle = COLORS.grass || '#2d5a27';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  ctx.strokeStyle = gridLineColor;
  ctx.lineWidth = 1;

  for (let r = 0; r <= ROWS; r++) {
    ctx.beginPath();
    ctx.moveTo(0, r * TILE_SIZE);
    ctx.lineTo(CANVAS_W, r * TILE_SIZE);
    ctx.stroke();
  }
  for (let c = 0; c <= COLS; c++) {
    ctx.beginPath();
    ctx.moveTo(c * TILE_SIZE, 0);
    ctx.lineTo(c * TILE_SIZE, CANVAS_H);
    ctx.stroke();
  }
}

/**
 * Draw path tiles to offscreen canvas (static unless path changes).
 */
function drawPathStatic(ctx) {
  const pathColor = COLORS.path || '#8b7355';
  const pathBorderColor = COLORS.pathBorder || '#6b5a3e';

  for (const key of PATH_TILE_SET) {
    const [c, r] = key.split(',').map(Number);
    const x = c * TILE_SIZE;
    const y = r * TILE_SIZE;

    // Path fill
    ctx.fillStyle = pathColor;
    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

    // Path border
    ctx.strokeStyle = pathBorderColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, TILE_SIZE - 1, TILE_SIZE - 1);
  }
}

/**
 * Blit offscreen layers onto the main canvas.
 * Call this at the start of renderFrame instead of drawing grid/path manually.
 *
 * @param {CanvasRenderingContext2D} mainCtx
 * @param {object} layers - { staticLayer, pathLayer }
 */
export function blitOffscreenLayers(mainCtx, layers) {
  const { staticLayer, pathLayer } = layers;

  // Draw static grid background
  if (staticLayer) {
    mainCtx.drawImage(staticLayer, 0, 0, CANVAS_W, CANVAS_H);
  }

  // Draw path overlay
  if (pathLayer) {
    mainCtx.drawImage(pathLayer, 0, 0, CANVAS_W, CANVAS_H);
  }
}

/**
 * Rebuild the path layer (call only when path changes).
 */
export function rebuildPathLayer(layers) {
  if (!layers.pathCtx) return;

  const ctx = layers.pathCtx;
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  drawPathStatic(ctx);
}

/**
 * Rebuild the static grid layer (call when visual settings change).
 */
export function rebuildStaticLayer(layers) {
  if (!layers.staticCtx) return;

  const ctx = layers.staticCtx;
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  drawGridStatic(ctx);
}
