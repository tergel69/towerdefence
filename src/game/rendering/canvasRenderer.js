// ============================================================
//  canvasRenderer.js
//  ALL canvas draw calls live here.
//  Completely decoupled from React — just receives ctx + state.
// ============================================================

import {
  TILE_SIZE,
  COLS,
  ROWS,
  PATH_TILE_SET,
  WAYPOINTS_PX,
  COLORS,
  TOWER_DEFS,
} from '../constants';
import { getTowerStats } from '../system/towerSystem';
import { renderParticles } from '../system/particleSystem';
import { renderTerrainOverlay } from '../system/terrainSystem';
import { WEATHER_DEFS } from '../system/weatherSystem';
import { renderSupportBuffAuras } from '../system/supportBuffSystem';
import { blitOffscreenLayers } from './offscreenLayers';
import {
  getColorblindSafeColor,
  getHighContrastColors,
  getAnimationSettings,
} from '../utils/accessibility';

// RETRO 16 BIT PIXEL PALETTE
// const PIXEL_PALETTE = [
//   '#1a1c2c', '#2c3e50', '#3d566d', '#41a6f6',
//   '#52e3f6', '#f4f4f4', '#94b0c2', '#566c86',
//   '#ffcd75', '#a7f070', '#38b764', '#257179',
//   '#ab5236', '#ff004d', '#ff77a8', '#c64491'
// ];

// Pixel perfect rectangle - no anti aliasing
function drawPixelRect(ctx, x, y, w, h) {
  x = Math.round(x);
  y = Math.round(y);
  w = Math.round(w);
  h = Math.round(h);
  ctx.fillRect(x, y, w, h);
}

// ── Master render call ───────────────────────────────────────
/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} state       - full game state snapshot
 * @param {object} ui          - { selectedType, hoveredCell, selectedTower }
 * @param {object} accessibilitySettings - { colorblindMode, highContrast, reducedMotion }
 * @param {object} offscreenLayers - optional { staticLayer, pathLayer } for performance
 */
export function renderFrame(ctx, state, ui, accessibilitySettings = {}, offscreenLayers = null) {
  const { enemies, towers, projectiles, particles } = state;
  const {
    colorblindMode = false,
    highContrast = false,
    reducedMotion = false,
  } = accessibilitySettings;
  const animSettings = getAnimationSettings(reducedMotion);
  const highContrastColors = getHighContrastColors(highContrast);

  // PIXEL PERFECT MODE - 16 BIT RETRO STYLE
  ctx.imageSmoothingEnabled = false;
  ctx.webkitImageSmoothingEnabled = false;
  ctx.mozImageSmoothingEnabled = false;
  ctx.oImageSmoothingEnabled = false;

  // Clear
  ctx.clearRect(0, 0, COLS * TILE_SIZE, ROWS * TILE_SIZE);

  // Apply screen shake + camera transform
  const { shakeOffset, camera } = ui;
  const hasShake = shakeOffset && (shakeOffset.offsetX !== 0 || shakeOffset.offsetY !== 0);
  const hasCamera = camera && camera.active;

  if (hasShake || hasCamera) {
    ctx.save();
    if (hasShake) {
      ctx.translate(shakeOffset.offsetX, shakeOffset.offsetY);
    }
    if (hasCamera) {
      const centerX = (COLS * TILE_SIZE) / 2;
      const centerY = (ROWS * TILE_SIZE) / 2;
      ctx.translate(centerX, centerY);
      ctx.scale(camera.zoom, camera.zoom);
      ctx.translate(-camera.currentX, -camera.currentY);
    }
  }

  // Draw static background layers (grid + path)
  if (offscreenLayers) {
    // Fast path: blit pre-rendered offscreen canvases
    blitOffscreenLayers(ctx, offscreenLayers);
  } else {
    // Fallback: draw manually (slower but no setup needed)
    drawGrid(ctx, { highContrastColors });
    drawPath(ctx, { highContrastColors });
  }

  // Draw terrain overlays (mud, lava, crystal, etc.)
  const { terrain, supportBuffs } = ui;
  if (terrain && terrain.tiles && terrain.tiles.length > 0) {
    renderTerrainOverlay(ctx, terrain);
  }

  // Draw support tower buff auras
  if (supportBuffs && supportBuffs.activeBuffs && supportBuffs.activeBuffs.length > 0) {
    renderSupportBuffAuras(ctx, towers, supportBuffs);
  }

  drawSynergyAuras(ctx, towers, { ...ui, reducedMotion, animSettings });
  drawTowerRanges(ctx, towers, { ui, highContrast, highContrastColors });
  drawTowers(ctx, towers, {
    ui,
    reducedMotion,
    animSettings,
    colorblindMode,
    highContrast,
    highContrastColors,
  });
  drawEnemies(ctx, enemies, {
    colorblindMode,
    reducedMotion,
    animSettings,
    highContrast,
    highContrastColors,
  });
  drawProjectiles(ctx, projectiles, { colorblindMode });
  if (!reducedMotion) {
    renderParticles(ctx, particles);
  } else {
    renderParticles(ctx, particles, 0.3);
  }
  drawHoverCell(ctx, ui);

  // Day/night overlay - dynamic darkness based on phase
  const { isNight, weather } = ui;
  if (isNight) {
    ctx.save();
    // Subtle blue tint for night atmosphere
    ctx.fillStyle = 'rgba(10, 15, 30, 0.25)';
    ctx.fillRect(0, 0, COLS * TILE_SIZE, ROWS * TILE_SIZE);
    ctx.fillStyle = 'rgba(30, 50, 100, 0.08)';
    ctx.fillRect(0, 0, COLS * TILE_SIZE, ROWS * TILE_SIZE);

    // Draw small stars for ambiance at night
    if (!reducedMotion) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      const starSeed = 42; // deterministic
      for (let i = 0; i < 20; i++) {
        const sx = (starSeed * (i + 1) * 7) % (COLS * TILE_SIZE);
        const sy = (starSeed * (i + 1) * 13) % (ROWS * TILE_SIZE * 0.4);
        const twinkle = Math.sin(Date.now() / 1000 + i) * 0.3 + 0.7;
        ctx.globalAlpha = twinkle * 0.5;
        ctx.fillRect(sx, sy, 1, 1);
      }
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }

  // Weather overlay (if weather system has a visual component)
  if (weather && weather.current && weather.current !== 'clear') {
    const weatherDef = WEATHER_DEFS[weather.current];
    if (weatherDef && weatherDef.color) {
      ctx.save();
      ctx.fillStyle = weatherDef.color;
      ctx.fillRect(0, 0, COLS * TILE_SIZE, ROWS * TILE_SIZE);
      ctx.restore();
    }
  }

  // Restore from shake/camera transform
  if (hasShake || hasCamera) {
    ctx.restore();
  }
}

// ── Grid ─────────────────────────────────────────────────────
function drawGrid(ctx, options = {}) {
  const { highContrastColors = {} } = options;
  const gridLineColor = highContrastColors.gridLine || COLORS.gridLine;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const isPath = PATH_TILE_SET.has(`${c},${r}`);

      ctx.fillStyle = isPath ? COLORS.path : (c + r) % 2 === 0 ? COLORS.grass : COLORS.grassLight;

      ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);

      // Subtle grid lines on grass only
      if (!isPath) {
        ctx.strokeStyle = gridLineColor;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }
}

// ── Path direction arrows ────────────────────────────────────
function drawPath(ctx, options = {}) {
  const { highContrastColors = {} } = options;

  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  ctx.lineWidth = 6;
  ctx.setLineDash([]);
  ctx.globalAlpha = highContrastColors.gridLine ? 0.5 : 0.35;

  ctx.beginPath();
  ctx.moveTo(WAYPOINTS_PX[0].x, WAYPOINTS_PX[0].y);
  for (let i = 1; i < WAYPOINTS_PX.length; i++) {
    ctx.lineTo(WAYPOINTS_PX[i].x, WAYPOINTS_PX[i].y);
  }
  ctx.stroke();

  ctx.strokeStyle = COLORS.pathEdge;
  ctx.lineWidth = 2;
  ctx.setLineDash([7, 9]);
  ctx.globalAlpha = highContrastColors.gridLine ? 0.85 : 0.75;
  ctx.stroke();
  ctx.restore();
}

// ── Synergy Aura Effects ─────────────────────────────────────
function drawSynergyAuras(ctx, towers, ui, now = Date.now()) {
  const synergyVisuals = ui.synergyVisuals;
  if (!synergyVisuals || synergyVisuals.length === 0) return;
  const { reducedMotion = false, animSettings = { disableBob: false, disablePulse: false } } = ui;

  // Get tower type positions for each synergy
  for (const synergy of synergyVisuals) {
    const matchingTowers = towers.filter((tower) => {
      const towerType = tower.type || tower.defId;
      return synergy.towers?.includes(towerType) || false;
    });

    if (matchingTowers.length === 0) continue;

    // Draw aura around each tower in the synergy
    for (const tower of matchingTowers) {
      const pulse = reducedMotion ? 0.5 : (now % synergy.pulseSpeed) / synergy.pulseSpeed;
      const alpha = animSettings.disablePulse ? 0.1 : 0.08 + Math.sin(pulse * Math.PI * 2) * 0.04;
      const radius = synergy.radius * (0.9 + (reducedMotion ? 0.05 : pulse * 0.1));

      ctx.save();

      // Outer aura glow
      const gradient = ctx.createRadialGradient(tower.x, tower.y, 0, tower.x, tower.y, radius);
      gradient.addColorStop(0, synergy.color + '20');
      gradient.addColorStop(0.5, synergy.color + '10');
      gradient.addColorStop(1, synergy.color + '00');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(tower.x, tower.y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Pulsing ring
      const hexAlpha = Math.round(alpha * 255)
        .toString(16)
        .padStart(2, '0');
      ctx.strokeStyle = synergy.color + hexAlpha;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(tower.x, tower.y, radius * 0.85, 0, Math.PI * 2);
      ctx.stroke();

      // Synergy icon indicator above tower
      ctx.globalAlpha = animSettings.disablePulse ? 0.7 : 0.7 + Math.sin(pulse * Math.PI * 2) * 0.3;
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(synergy.icon, tower.x, tower.y - TILE_SIZE * 0.7);

      ctx.restore();
    }

    // Draw connection lines between synergistic towers (skip with reduced motion)
    if (matchingTowers.length >= 2 && !reducedMotion) {
      ctx.save();
      ctx.strokeStyle = synergy.color + '30';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 6]);

      for (let i = 0; i < matchingTowers.length; i++) {
        for (let j = i + 1; j < matchingTowers.length; j++) {
          const t1 = matchingTowers[i];
          const t2 = matchingTowers[j];
          const dx = t2.x - t1.x;
          const dy = t2.y - t1.y;
          const dist = Math.hypot(dx, dy);

          // Only draw connections within reasonable range
          if (dist < 300) {
            ctx.globalAlpha = 0.2 + Math.sin(now / 1000 + i + j) * 0.1;
            ctx.beginPath();
            ctx.moveTo(t1.x, t1.y);
            ctx.lineTo(t2.x, t2.y);
            ctx.stroke();
          }
        }
      }

      ctx.setLineDash([]);
      ctx.restore();
    }
  }
}

// ── Tower range rings ────────────────────────────────────────
function drawTowerRanges(ctx, towers, options = {}) {
  const { ui = {}, highContrast = false, highContrastColors = {} } = options;
  const towerRangeColor = highContrast
    ? highContrastColors.towerRange || 'rgba(255, 255, 255, 0.15)'
    : COLORS.towerRange;
  const towerRangeHoverColor = highContrast ? 'rgba(255, 255, 255, 0.25)' : COLORS.towerRangeHover;
  for (const tower of towers) {
    const stats = getTowerStats(tower);
    const isSelected = ui.selectedTower?.id === tower.id;
    const def = TOWER_DEFS[tower.type];

    // Support tower aura visualization - always visible
    if (def?.support) {
      ctx.save();
      // Create gradient aura effect
      const gradient = ctx.createRadialGradient(
        tower.x,
        tower.y,
        stats.range * 0.3,
        tower.x,
        tower.y,
        stats.range
      );
      gradient.addColorStop(0, 'rgba(96,165,250,0.12)');
      gradient.addColorStop(0.7, 'rgba(96,165,250,0.06)');
      gradient.addColorStop(1, 'rgba(96,165,250,0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(tower.x, tower.y, stats.range, 0, Math.PI * 2);
      ctx.fill();

      // Pulsing ring effect
      const pulse = (Date.now() % 2000) / 2000;
      ctx.strokeStyle = `rgba(96,165,250,${0.3 - pulse * 0.2})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(tower.x, tower.y, stats.range * (0.85 + pulse * 0.15), 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    if (!isSelected) continue; // Only draw range for selected tower

    ctx.beginPath();
    ctx.arc(tower.x, tower.y, stats.range, 0, Math.PI * 2);
    ctx.fillStyle = towerRangeHoverColor;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    if (def?.support) {
      ctx.save();
      ctx.strokeStyle = 'rgba(96,165,250,0.16)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(tower.x, tower.y, stats.range * 0.95, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  // Also show range preview while hovering to place
  if (ui.hoveredCell && ui.selectedType) {
    const def = TOWER_DEFS[ui.selectedType];
    const stats = def.levels[0];
    const px = ui.hoveredCell.c * TILE_SIZE + TILE_SIZE / 2;
    const py = ui.hoveredCell.r * TILE_SIZE + TILE_SIZE / 2;

    ctx.beginPath();
    ctx.arc(px, py, stats.range, 0, Math.PI * 2);
    ctx.fillStyle = towerRangeColor;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

// ── Towers ───────────────────────────────────────────────────
function drawTowers(ctx, towers, options = {}) {
  const {
    ui = {},
    reducedMotion = false,
    animSettings = { disableBob: false },
    colorblindMode = false,
  } = options;
  const now = Date.now();

  for (const tower of towers) {
    const def = TOWER_DEFS[tower.type];
    const towerColor = getColorblindSafeColor(def.color, colorblindMode);
    const half = TILE_SIZE / 2 - 4;
    const { x, y } = tower;
    const isSelected = ui.selectedTower?.id === tower.id;

    // Glow for selected tower
    if (isSelected) {
      ctx.shadowBlur = 16;
      ctx.shadowColor = towerColor;
    }

    // PIXEL TOWER BASE
    ctx.fillStyle = COLORS.towerBase;
    drawPixelRect(ctx, x - half, y - half, half * 2, half * 2);

    // PIXEL TOWER BODY
    ctx.fillStyle = towerColor;
    const bodySize = half - 4;
    drawPixelRect(ctx, x - bodySize, y - bodySize, bodySize * 2, bodySize * 2);

    ctx.shadowBlur = 0; // reset glow before barrel

    // ── Rotating barrel ──────────────────────────────────────
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tower.barrelAngle); // use stored angle
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = tower.type === 'splash' ? 5 : 3.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(half - 2, 0); // barrel points along +x before rotation
    ctx.stroke();

    // Barrel tip flash when recently fired (cooldown < 0.05s)
    if (tower.cooldown < 0.05 && tower.cooldown > 0) {
      ctx.fillStyle = '#fff';
      ctx.shadowBlur = 10;
      ctx.shadowColor = towerColor;
      ctx.beginPath();
      ctx.arc(half - 2, 0, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    if (tower.muzzleFlash > 0 && !reducedMotion) {
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.shadowBlur = 16;
      ctx.shadowColor = towerColor;
      ctx.beginPath();
      ctx.arc(half - 2, 0, 4 + tower.muzzleFlash * 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    ctx.restore();

    // Level indicator dots (bottom of tower)
    for (let i = 0; i <= tower.level; i++) {
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(x - 6 + i * 6, y + half - 5, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Element-specific ambient effects
    drawTowerAmbientEffect(ctx, tower, def, x, y, half, {
      colorblindMode,
      reducedMotion,
      animSettings,
      now,
      towerColor,
    });
  }
}

// ── Element-Specific Ambient Tower Effects ───────────────────
function drawTowerAmbientEffect(ctx, tower, def, x, y, half, options = {}) {
  const {
    reducedMotion = false,
    animSettings = { disablePulse: false },
    colorblindMode = false,
    now = Date.now(),
  } = options;
  const type = tower.type;

  // Skip ambient effects entirely when reduced motion is enabled
  if (reducedMotion) return;

  // Ice Tower - frost particles around tower
  if (type === 'ice' || type === 'frost_bolt') {
    const particleCount = 3;
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2 + now / 1000;
      const dist = half + 6 + Math.sin(now / 400 + i) * 3;
      const px = x + Math.cos(angle) * dist;
      const py = y + Math.sin(angle) * dist - 5;
      ctx.save();
      ctx.globalAlpha = animSettings.disablePulse ? 0.5 : 0.5 + Math.sin(now / 300 + i) * 0.3;
      ctx.fillStyle = '#a5f3fc';
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#67e8f9';
      ctx.beginPath();
      ctx.arc(px, py, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Fire Tower - ember particles
  if (type === 'flamethrower' || type === 'fire_ball') {
    for (let i = 0; i < 4; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = half + Math.random() * 8;
      const px = x + Math.cos(angle) * dist;
      const py = y + Math.sin(angle) * dist - 5;
      ctx.save();
      ctx.globalAlpha = animSettings.disablePulse ? 0.4 : 0.4 + Math.random() * 0.3;
      ctx.fillStyle = Math.random() > 0.5 ? '#f97316' : '#fbbf24';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#f97316';
      ctx.beginPath();
      ctx.arc(px, py, 1.5 + Math.random(), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Poison Tower - green mist
  if (type === 'poison') {
    ctx.save();
    ctx.globalAlpha = animSettings.disablePulse ? 0.15 : 0.15 + Math.sin(now / 500) * 0.08;
    ctx.fillStyle = getColorblindSafeColor('#22c55e', colorblindMode);
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#4ade80';
    ctx.beginPath();
    ctx.arc(x, y, half + 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Tesla/Lightning - electric sparks
  if (type === 'tesla') {
    for (let i = 0; i < 2; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = half + 4;
      const px = x + Math.cos(angle) * dist;
      const py = y + Math.sin(angle) * dist;
      ctx.save();
      ctx.globalAlpha = animSettings.disablePulse ? 0.6 : 0.6 + Math.random() * 0.4;
      ctx.strokeStyle = getColorblindSafeColor('#a855f7', colorblindMode);
      ctx.lineWidth = 1;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#a855f7';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(px, py);
      ctx.stroke();
      ctx.restore();
    }
  }

  // Sniper Tower - laser sight line to target
  if (type === 'sniper' && tower.target) {
    ctx.save();
    ctx.globalAlpha = animSettings.disablePulse ? 0.15 : 0.15 + Math.sin(now / 200) * 0.08;
    ctx.strokeStyle = getColorblindSafeColor('#ef4444', colorblindMode);
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);
    ctx.shadowBlur = 6;
    ctx.shadowColor = getColorblindSafeColor('#ef4444', colorblindMode);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(tower.barrelAngle) * 150, y + Math.sin(tower.barrelAngle) * 150);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  // Crystal Tower - prismatic shimmer
  if (type === 'crystalGuard') {
    ctx.save();
    const shimmerAngle = now / 1000;
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];
    colors.forEach((color, i) => {
      const angle = shimmerAngle + (i / colors.length) * Math.PI * 2;
      const dist = half + 8;
      const px = x + Math.cos(angle) * dist;
      const py = y + Math.sin(angle) * dist;
      ctx.globalAlpha = animSettings.disablePulse ? 0.4 : 0.4 + Math.sin(now / 300 + i) * 0.2;
      ctx.fillStyle = getColorblindSafeColor(color, colorblindMode);
      ctx.shadowBlur = 8;
      ctx.shadowColor = getColorblindSafeColor(color, colorblindMode);
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }
}

// ── Enemies ──────────────────────────────────────────────────
function drawEnemies(ctx, enemies, options = {}) {
  const {
    colorblindMode = false,
    reducedMotion = false,
    animSettings = { disableBob: false, disableShake: false },
    highContrastColors = {},
  } = options;
  const now = Date.now();
  const healthBarBgColor = highContrastColors.healthBarBg || 'rgba(0, 0, 0, 0.5)';

  for (const enemy of enemies) {
    if (enemy.dead || enemy.reachedEnd) continue;

    const { x, y, size, color, hp, maxHp, lastHitTime, spawnTime, deathTime, speed } = enemy;
    const enemyColor = getColorblindSafeColor(color, colorblindMode);

    // Animation calculations
    const timeSinceHit = lastHitTime ? now - lastHitTime : 1000;
    const timeSinceSpawn = spawnTime ? now - spawnTime : 1000;
    const timeSinceDeath = deathTime ? now - deathTime : 0;

    // Spawn entrance animation (scale up with overshoot)
    const SPAWN_DURATION = 300;
    const spawnProgress = reducedMotion ? 1 : Math.min(timeSinceSpawn / SPAWN_DURATION, 1);
    const spawnScale = reducedMotion ? 1 : easeOutBack(spawnProgress);

    // Death animation (shrink and fade)
    const DEATH_DURATION = 400;
    const deathProgress = reducedMotion ? 1 : Math.min(timeSinceDeath / DEATH_DURATION, 1);
    const deathScale = 1 - deathProgress;
    const deathAlpha = 1 - deathProgress;
    const isDying = deathTime && deathProgress < 1;

    // Walking bob animation (organic vertical movement)
    const BOB_AMOUNT = animSettings.disableBob ? 0 : 2;
    const BOB_FREQUENCY = speed > 2 ? 8 : 5;
    const bobOffset = reducedMotion
      ? 0
      : Math.sin((now / 1000) * BOB_FREQUENCY * Math.PI * 2) * BOB_AMOUNT;

    // Apply animations to position
    let drawX = x;
    let drawY = y + bobOffset;
    const drawSize = size * spawnScale * (isDying ? deathScale : 1);

    // Skip if still spawning or fully dead
    if (spawnProgress < 1) {
      drawX = x;
      drawY = y;
    }
    if (isDying && deathProgress >= 1) continue;

    // Calculate damage flash (white flash for 100ms after hit)
    const isFlashing = lastHitTime && timeSinceHit < 100;
    const flashIntensity = isFlashing ? 1 - timeSinceHit / 100 : 0;

    ctx.save();

    // Apply death fade
    if (isDying) {
      ctx.globalAlpha = deathAlpha;
    }

    // Draw fast enemy motion trail (skip with reduced motion)
    if (
      !reducedMotion &&
      speed > 2.5 &&
      enemy.previousPositions &&
      enemy.previousPositions.length > 0
    ) {
      drawFastTrail(ctx, enemy.previousPositions, drawSize, enemyColor, reducedMotion);
    }

    // Boss glow with enhanced pulse
    if (enemy.isBoss) {
      const pulseAlpha = reducedMotion ? 0.4 : 0.4 + Math.sin(now / 300) * 0.2;
      const pulseRadius = reducedMotion ? 24 : 24 + Math.sin(now / 400) * 8;

      // Outer glow ring
      ctx.save();
      ctx.shadowBlur = reducedMotion ? 20 : 30 + Math.sin(now / 250) * 10;
      ctx.shadowColor = enemyColor;
      ctx.strokeStyle = `rgba(255,255,255,${pulseAlpha})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(drawX, drawY, drawSize + pulseRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Inner pulsing ring
      if (!reducedMotion) {
        ctx.shadowBlur = 0;
        ctx.strokeStyle = `rgba(255,255,255,${0.2 + Math.sin(now / 200) * 0.1})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(drawX, drawY, drawSize + 12 + Math.sin(now / 350) * 4, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Crown/indicator above boss
      ctx.globalAlpha = 0.8;
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('👑', drawX, drawY - drawSize - 18);
      ctx.restore();
    }

    // Heal aura for healer/medic enemies
    if (
      (enemy.ability === 'heal' || enemy.ability === 'heal_aura') &&
      (enemy.healRadius || enemy.healRate)
    ) {
      const auraRadius = enemy.healRadius || 80;
      const pulseAlpha = reducedMotion ? 0.3 : 0.3 + Math.sin(now / 500) * 0.15;
      ctx.save();
      ctx.strokeStyle = `rgba(74,222,128,${pulseAlpha})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.arc(drawX, drawY, auraRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      // Small heal icon above enemy
      ctx.globalAlpha = 0.7;
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('💚', drawX, drawY - drawSize - 16);
      ctx.restore();
    }

    // Phase Runner - invulnerability indicator
    if (enemy.isPhased) {
      ctx.save();
      const phaseAlpha = reducedMotion ? 0.6 : 0.4 + Math.sin(now / 200) * 0.2;
      ctx.strokeStyle = `rgba(139, 92, 246, ${phaseAlpha})`;
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 4]);
      ctx.beginPath();
      ctx.arc(drawX, drawY, drawSize + 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      // "INVULNERABLE" text or shield icon
      ctx.globalAlpha = 0.8;
      ctx.font = 'bold 10px sans-serif';
      ctx.fillStyle = '#8b5cf6';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🛡️', drawX, drawY - drawSize - 14);
      ctx.restore();
    }

    // Brute - armor indicator
    if (enemy.armor && enemy.armor > 0) {
      ctx.save();
      const armorAlpha = 0.4 + Math.sin(now / 600) * 0.15;
      ctx.strokeStyle = `rgba(120, 113, 108, ${armorAlpha})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(drawX, drawY, drawSize + 4, 0, Math.PI * 2);
      ctx.stroke();
      // Armor icon
      ctx.globalAlpha = 0.6;
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🛡', drawX, drawY - drawSize - 12);
      ctx.restore();
    }

    // Juggernaut - regenerating shield visualization
    if (enemy.shieldMax && enemy.shieldMax > 0 && enemy.shieldCurrent > 0) {
      const shieldPercent = enemy.shieldCurrent / enemy.shieldMax;
      ctx.save();
      ctx.strokeStyle = `rgba(96,165,250,${0.3 + shieldPercent * 0.4})`;
      ctx.lineWidth = 2.5;
      ctx.setLineDash([5, 3]);
      ctx.beginPath();
      ctx.arc(drawX, drawY, drawSize + 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      // Shield percentage text
      ctx.globalAlpha = 0.7;
      ctx.font = 'bold 9px sans-serif';
      ctx.fillStyle = '#60a5fa';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${Math.round(shieldPercent * 100)}%`, drawX, drawY - drawSize - 16);
      ctx.restore();
    }

    // Phantom - teleport countdown indicator
    if (enemy.ability === 'teleport' && enemy.teleportInterval) {
      const teleportProgress = enemy.teleportTimer / enemy.teleportInterval;
      ctx.save();
      const teleportAlpha = 0.3 + teleportProgress * 0.5;
      ctx.strokeStyle = `rgba(6, 182, 212, ${teleportAlpha})`;
      ctx.lineWidth = 2;
      // Arc showing teleport readiness
      ctx.beginPath();
      ctx.arc(
        drawX,
        drawY,
        drawSize + 7,
        -Math.PI / 2,
        -Math.PI / 2 + Math.PI * 2 * teleportProgress
      );
      ctx.stroke();
      // Flash when about to teleport
      if (teleportProgress > 0.8 && !reducedMotion) {
        ctx.globalAlpha = (teleportProgress - 0.8) * 5 * 0.5;
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.arc(drawX, drawY, drawSize + 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Necromancer - summon progress indicator
    if (enemy.ability === 'summon') {
      const summonProgress = enemy.summonTimer / enemy.summonInterval;
      const summonRemaining = enemy.summonCount - enemy.summonedCount;
      if (summonRemaining > 0) {
        ctx.save();
        ctx.strokeStyle = `rgba(168, 85, 247, ${0.3 + summonProgress * 0.4})`;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(
          drawX,
          drawY,
          drawSize + 9,
          -Math.PI / 2,
          -Math.PI / 2 + Math.PI * 2 * summonProgress
        );
        ctx.stroke();
        ctx.setLineDash([]);
        // Skull icon showing remaining summons
        ctx.globalAlpha = 0.7;
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`💀${summonRemaining}`, drawX, drawY - drawSize - 16);
        ctx.restore();
      }
    }

    // Swarm Queen - spawn indicator (pulsing orange ring)
    if (enemy.spawnOnDeath > 0) {
      ctx.save();
      const spawnPulse = reducedMotion ? 0.5 : 0.4 + Math.sin(now / 300) * 0.2;
      ctx.strokeStyle = `rgba(249, 115, 22, ${spawnPulse})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(drawX, drawY, drawSize + 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Shield visual effect for shielded enemies
    if (enemy.ability === 'shield' && enemy.shieldThreshold > 0) {
      const hpPercent = hp / maxHp;
      if (hpPercent <= enemy.shieldThreshold) {
        const shieldOpacity = hpPercent / enemy.shieldThreshold;
        ctx.strokeStyle = `rgba(96,165,250,${0.3 + (1 - shieldOpacity) * 0.4})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4 - shieldOpacity * 2]);
        ctx.beginPath();
        ctx.arc(drawX, drawY, drawSize + 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Enhanced slow effect visualization (frost particles)
    if (enemy.slowed && enemy.slowAmount > 0) {
      drawSlowEffect(ctx, drawX, drawY, drawSize, enemy.slowAmount, reducedMotion);
    }

    // Body (circle for enemies) with damage flash
    ctx.beginPath();
    ctx.arc(drawX, drawY, drawSize, 0, Math.PI * 2);

    if (isFlashing) {
      ctx.fillStyle = `rgba(255, 255, 255, ${flashIntensity})`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(drawX, drawY, drawSize, 0, Math.PI * 2);
    }

    ctx.fillStyle = enemyColor;
    ctx.fill();
    ctx.strokeStyle = isFlashing ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();

    // Enhanced Health bar (drawn above enemy)
    const barW = drawSize * 2.4;
    const barH = Math.max(4, Math.min(5, drawSize * 0.4));
    const barX = drawX - barW / 2;
    const barY = drawY - drawSize - 12;
    const hpPct = hp / maxHp;

    // Health bar background with subtle gradient
    ctx.fillStyle = healthBarBgColor;
    roundRect(ctx, barX - 1, barY - 1, barW + 2, barH + 2, 3);
    ctx.fill();

    // Health bar background
    ctx.fillStyle = healthBarBgColor;
    roundRect(ctx, barX, barY, barW, barH, 2);
    ctx.fill();

    // Health bar foreground with gradient based on health percentage
    let healthColor;
    if (hpPct > 0.6) {
      healthColor = getColorblindSafeColor('#22c55e', colorblindMode);
    } else if (hpPct > 0.3) {
      healthColor = '#eab308';
    } else {
      healthColor = getColorblindSafeColor('#ef4444', colorblindMode);
    }

    // Add glow effect for health bar with pulse when low
    ctx.save();
    ctx.shadowColor = healthColor;
    ctx.shadowBlur = hpPct < 0.3 ? (reducedMotion ? 4 : 4 + Math.sin(now / 100) * 2) : 3;

    ctx.fillStyle = healthColor;
    roundRect(ctx, barX, barY, barW * hpPct, barH, 2);
    ctx.fill();
    ctx.restore();

    // Status effect indicators
    if (enemy.stunned) {
      // Golden stars around stunned enemy
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.95)';
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#FFD700';
      const stunPulse = reducedMotion ? 0.7 : 0.7 + Math.sin(now / 150) * 0.3;
      ctx.globalAlpha = stunPulse;
      ctx.beginPath();
      ctx.arc(drawX, drawY, drawSize + 5, 0, Math.PI * 2);
      ctx.stroke();
      // Draw star symbols
      ctx.fillStyle = '#FFD700';
      ctx.font = `bold ${drawSize * 0.8}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('★', drawX, drawY - drawSize - 8);
      ctx.restore();
    } else if (enemy.slowed) {
      ctx.save();
      ctx.strokeStyle = 'rgba(96,165,250,0.9)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(drawX, drawY, drawSize + 3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    } else if (enemy.poisoned) {
      ctx.save();
      ctx.strokeStyle = getColorblindSafeColor('#4ade80', colorblindMode);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(drawX, drawY, drawSize + 3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }
}

// ── Fast enemy motion trail ───────────────────────────────────
function drawFastTrail(
  ctx,
  previousPositions,
  size,
  enemyColor = '#a855f7',
  reducedMotion = false
) {
  if (!previousPositions || previousPositions.length < 2) return;

  ctx.save();

  // Skip most trail rendering if reduced motion
  if (reducedMotion) {
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = enemyColor;
    const lastPos = previousPositions[previousPositions.length - 1];
    ctx.beginPath();
    ctx.arc(lastPos.x, lastPos.y, size * 0.9, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }

  // Draw motion blur trail with gradient
  previousPositions.forEach((pos, index) => {
    const progress = index / previousPositions.length;
    const alpha = (1 - progress) * 0.3;
    const trailSize = size * (1 - progress * 0.4);

    ctx.globalAlpha = alpha;
    // Gradient from enemy color to transparent
    const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, trailSize);
    gradient.addColorStop(0, enemyColor + '40');
    gradient.addColorStop(0.7, enemyColor + '20');
    gradient.addColorStop(1, enemyColor + '00');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, trailSize, 0, Math.PI * 2);
    ctx.fill();
  });

  // Add streak lines for very fast enemies
  if (previousPositions.length >= 3) {
    const lastPos = previousPositions[previousPositions.length - 1];
    const firstPos = previousPositions[0];
    ctx.globalAlpha = 0.2;
    ctx.strokeStyle = enemyColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(firstPos.x, firstPos.y);
    ctx.lineTo(lastPos.x, lastPos.y);
    ctx.stroke();
  }

  ctx.restore();
}

// ── Slow effect frost particles ─────────────────────────────────
function drawSlowEffect(ctx, x, y, size, slowAmount, reducedMotion = false) {
  const frostAlpha = Math.min(slowAmount * 0.5, 0.6);

  ctx.save();
  ctx.fillStyle = `rgba(147, 197, 253, ${frostAlpha})`;

  // Draw 6 frost particles around the enemy (skip with reduced motion)
  if (reducedMotion) {
    ctx.restore();
    return;
  }

  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 + Date.now() / 1000;
    const particleDist = size + 6 + Math.sin(Date.now() / 500 + i) * 2;
    const px = x + Math.cos(angle) * particleDist;
    const py = y + Math.sin(angle) * particleDist;

    ctx.beginPath();
    ctx.arc(px, py, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// ── Ease out back function for spawn animation ────────────────
function easeOutBack(x) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

// ── Projectiles ──────────────────────────────────────────────
function drawProjectiles(ctx, projectiles, options = {}) {
  const { colorblindMode = false } = options;
  for (const p of projectiles) {
    const projectileColor = getColorblindSafeColor(p.color, colorblindMode);

    // Draw splash radius preview for splash projectiles
    if (p.splash > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.splash, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,165,0,0.25)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,165,0,0.08)';
      ctx.fill();
      ctx.restore();
    }

    // PIXEL PERFECT BULLETS
    const bulletSize = p.splash > 0 ? 4 : 2;
    ctx.fillStyle = projectileColor;
    drawPixelRect(ctx, p.x - bulletSize / 2, p.y - bulletSize / 2, bulletSize, bulletSize);
  }
}

// ── Hover cell highlight ──────────────────────────────────────
function drawHoverCell(ctx, ui) {
  if (!ui.hoveredCell) return;
  const { c, r, valid } = ui.hoveredCell;

  ctx.fillStyle = valid ? 'rgba(100,255,100,0.18)' : 'rgba(255,60,60,0.18)';
  ctx.strokeStyle = valid ? 'rgba(100,255,100,0.7)' : 'rgba(255,60,60,0.7)';
  ctx.lineWidth = 2;

  ctx.fillRect(c * TILE_SIZE + 1, r * TILE_SIZE + 1, TILE_SIZE - 2, TILE_SIZE - 2);
  ctx.strokeRect(c * TILE_SIZE + 1, r * TILE_SIZE + 1, TILE_SIZE - 2, TILE_SIZE - 2);
}

// ── Utility ───────────────────────────────────────────────────
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}
