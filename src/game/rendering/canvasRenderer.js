// ============================================================
//  canvasRenderer.js
//  ALL canvas draw calls live here.
//  Completely decoupled from React — just receives ctx + state.
// ============================================================

import {
  TILE_SIZE, COLS, ROWS,
  PATH_TILE_SET, WAYPOINTS_PX,
  COLORS, TOWER_DEFS,
} from '../constants';
import { getTowerStats } from '../system/towerSystem';
import { renderParticles } from '../system/particleSystem';

// ── Master render call ───────────────────────────────────────
/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} state       - full game state snapshot
 * @param {object} ui          - { selectedType, hoveredCell, selectedTower }
 */
export function renderFrame(ctx, state, ui) {
  const { enemies, towers, projectiles, particles } = state;

  // Clear
  ctx.clearRect(0, 0, COLS * TILE_SIZE, ROWS * TILE_SIZE);

  drawGrid(ctx, ui);
  drawPath(ctx);
  drawTowerRanges(ctx, towers, ui);
  drawTowers(ctx, towers, ui);
  drawEnemies(ctx, enemies);
  drawProjectiles(ctx, projectiles);
  renderParticles(ctx, particles);   // particle layer on top
  drawHoverCell(ctx, ui);
}

// ── Grid ─────────────────────────────────────────────────────
function drawGrid(ctx) {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const isPath = PATH_TILE_SET.has(`${c},${r}`);

      ctx.fillStyle = isPath
        ? COLORS.path
        : (c + r) % 2 === 0 ? COLORS.grass : COLORS.grassLight;

      ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);

      // Subtle grid lines on grass only
      if (!isPath) {
        ctx.strokeStyle = COLORS.gridLine;
        ctx.lineWidth   = 0.5;
        ctx.strokeRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }
}

// ── Path direction arrows ────────────────────────────────────
function drawPath(ctx) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  ctx.lineWidth   = 6;
  ctx.setLineDash([]);
  ctx.globalAlpha = 0.35;

  ctx.beginPath();
  ctx.moveTo(WAYPOINTS_PX[0].x, WAYPOINTS_PX[0].y);
  for (let i = 1; i < WAYPOINTS_PX.length; i++) {
    ctx.lineTo(WAYPOINTS_PX[i].x, WAYPOINTS_PX[i].y);
  }
  ctx.stroke();

  ctx.strokeStyle = COLORS.pathEdge;
  ctx.lineWidth = 2;
  ctx.setLineDash([7, 9]);
  ctx.globalAlpha = 0.75;
  ctx.stroke();
  ctx.restore();
}

// ── Tower range rings ────────────────────────────────────────
function drawTowerRanges(ctx, towers, ui) {
  for (const tower of towers) {
    const stats    = getTowerStats(tower);
    const isSelected = ui.selectedTower?.id === tower.id;
    const def = TOWER_DEFS[tower.type];

    // Support tower aura visualization - always visible
    if (def?.support) {
      ctx.save();
      // Create gradient aura effect
      const gradient = ctx.createRadialGradient(
        tower.x, tower.y, stats.range * 0.3,
        tower.x, tower.y, stats.range
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
    ctx.fillStyle   = COLORS.towerRangeHover;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth   = 1;
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
    const def   = TOWER_DEFS[ui.selectedType];
    const stats = def.levels[0];
    const px    = ui.hoveredCell.c * TILE_SIZE + TILE_SIZE / 2;
    const py    = ui.hoveredCell.r * TILE_SIZE + TILE_SIZE / 2;

    ctx.beginPath();
    ctx.arc(px, py, stats.range, 0, Math.PI * 2);
    ctx.fillStyle   = COLORS.towerRange;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth   = 1;
    ctx.stroke();
  }
}

// ── Towers ───────────────────────────────────────────────────
function drawTowers(ctx, towers, ui) {
  for (const tower of towers) {
    const def    = TOWER_DEFS[tower.type];
    const half   = TILE_SIZE / 2 - 4;
    const { x, y } = tower;
    const isSelected = ui.selectedTower?.id === tower.id;

    // Glow for selected tower
    if (isSelected) {
      ctx.shadowBlur  = 16;
      ctx.shadowColor = def.color;
    }

    // Base plate
    ctx.fillStyle = COLORS.towerBase;
    roundRect(ctx, x - half, y - half, half * 2, half * 2, 6);
    ctx.fill();

    // Tower body
    ctx.fillStyle = def.color;
    const bodySize = half - 4;
    roundRect(ctx, x - bodySize, y - bodySize, bodySize * 2, bodySize * 2, 4);
    ctx.fill();

    ctx.shadowBlur = 0;   // reset glow before barrel

    // ── Rotating barrel ──────────────────────────────────────
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tower.barrelAngle);   // use stored angle
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth   = tower.type === 'splash' ? 5 : 3.5;
    ctx.lineCap     = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(half - 2, 0);         // barrel points along +x before rotation
    ctx.stroke();

    // Barrel tip flash when recently fired (cooldown < 0.05s)
    if (tower.cooldown < 0.05 && tower.cooldown > 0) {
      ctx.fillStyle   = '#fff';
      ctx.shadowBlur  = 10;
      ctx.shadowColor = def.color;
      ctx.beginPath();
      ctx.arc(half - 2, 0, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    if (tower.muzzleFlash > 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.shadowBlur = 16;
      ctx.shadowColor = def.color;
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
  }
}

// ── Enemies ──────────────────────────────────────────────────
function drawEnemies(ctx, enemies) {
  const now = Date.now();
  
  for (const enemy of enemies) {
    if (enemy.dead || enemy.reachedEnd) continue;

    const { x, y, size, color, hp, maxHp, lastHitTime, spawnTime, deathTime, speed } = enemy;
    
    // Animation calculations
    const timeSinceHit = lastHitTime ? now - lastHitTime : 1000;
    const timeSinceSpawn = spawnTime ? now - spawnTime : 1000;
    const timeSinceDeath = deathTime ? now - deathTime : 0;
    
    // Spawn entrance animation (scale up with overshoot)
    const SPAWN_DURATION = 300;
    const spawnProgress = Math.min(timeSinceSpawn / SPAWN_DURATION, 1);
    const spawnScale = easeOutBack(spawnProgress);
    const spawnAlpha = spawnProgress;
    
    // Death animation (shrink and fade)
    const DEATH_DURATION = 400;
    const deathProgress = Math.min(timeSinceDeath / DEATH_DURATION, 1);
    const deathScale = 1 - deathProgress;
    const deathAlpha = 1 - deathProgress;
    const isDying = deathTime && deathProgress < 1;
    
    // Walking bob animation (organic vertical movement)
    const BOB_AMOUNT = 2;
    const BOB_FREQUENCY = speed > 2 ? 8 : 5;
    const bobOffset = Math.sin(now / 1000 * BOB_FREQUENCY * Math.PI * 2) * BOB_AMOUNT;
    
    // Tank enemy waddle (slight rotation)
    const WADDLE_ANGLE = speed < 1.5 ? Math.sin(now / 1000 * 3 * Math.PI * 2) * 0.1 : 0;
    
    // Apply animations to position
    let drawX = x;
    let drawY = y + bobOffset;
    let drawSize = size * spawnScale * (isDying ? deathScale : 1);
    let drawAlpha = spawnAlpha * (isDying ? deathAlpha : 1);
    
    // Skip if still spawning or fully dead
    if (spawnProgress < 1) {
      drawX = x;
      drawY = y;
    }
    if (isDying && deathProgress >= 1) continue;
    
    // Calculate damage flash (white flash for 100ms after hit)
    const isFlashing = lastHitTime && timeSinceHit < 100;
    const flashIntensity = isFlashing ? 1 - (timeSinceHit / 100) : 0;

    ctx.save();
    
    // Apply death fade
    if (isDying) {
      ctx.globalAlpha = deathAlpha;
    }
    
    // Draw fast enemy motion trail
    if (speed > 2.5 && enemy.previousPositions && enemy.previousPositions.length > 0) {
      drawFastTrail(ctx, enemy.previousPositions, drawSize);
    }

    // Boss glow with enhanced pulse
    if (enemy.isBoss) {
      const pulseAlpha = 0.4 + Math.sin(now / 300) * 0.2;
      ctx.shadowBlur = 24 + Math.sin(now / 400) * 8;
      ctx.shadowColor = color;
      ctx.strokeStyle = `rgba(255,255,255,${pulseAlpha})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(drawX, drawY, drawSize + 6, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Heal aura for healer enemies
    if (enemy.ability === 'heal') {
      const pulseAlpha = 0.25 + Math.sin(now / 500) * 0.15;
      ctx.strokeStyle = `rgba(74,222,128,${pulseAlpha})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(drawX, drawY, enemy.healRadius || 60, 0, Math.PI * 2);
      ctx.stroke();
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
      drawSlowEffect(ctx, drawX, drawY, drawSize, enemy.slowAmount);
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
    
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = isFlashing ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();

    // Enhanced Health bar (drawn above enemy)
    const barW   = drawSize * 2.4;
    const barH   = Math.max(4, Math.min(5, drawSize * 0.4));
    const barX   = drawX - barW / 2;
    const barY   = drawY - drawSize - 12;
    const hpPct  = hp / maxHp;

    // Health bar background with subtle gradient
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    roundRect(ctx, barX - 1, barY - 1, barW + 2, barH + 2, 3);
    ctx.fill();

    // Health bar background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    roundRect(ctx, barX, barY, barW, barH, 2);
    ctx.fill();

    // Health bar foreground with gradient based on health percentage
    let healthColor;
    if (hpPct > 0.6) {
      healthColor = '#22c55e';
    } else if (hpPct > 0.3) {
      healthColor = '#eab308';
    } else {
      healthColor = '#ef4444';
    }
    
    // Add glow effect for health bar with pulse when low
    ctx.save();
    ctx.shadowColor = healthColor;
    ctx.shadowBlur = hpPct < 0.3 ? 4 + Math.sin(now / 100) * 2 : 3;
    
    ctx.fillStyle = healthColor;
    roundRect(ctx, barX, barY, barW * hpPct, barH, 2);
    ctx.fill();
    ctx.restore();

    // Status effect indicators
    if (enemy.slowed) {
      ctx.save();
      ctx.strokeStyle = 'rgba(96,165,250,0.9)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(drawX, drawY, drawSize + 3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    } else if (enemy.poisoned) {
      ctx.save();
      ctx.strokeStyle = 'rgba(74,222,128,0.9)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(drawX, drawY, drawSize + 3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }
}

// ── Fast enemy motion trail ───────────────────────────────────
function drawFastTrail(ctx, previousPositions, size) {
  if (!previousPositions || previousPositions.length < 2) return;
  
  ctx.save();
  
  previousPositions.forEach((pos, index) => {
    const alpha = (1 - index / previousPositions.length) * 0.25;
    const trailSize = size * (1 - index / previousPositions.length * 0.3);
    
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, trailSize * 0.8, 0, Math.PI * 2);
    ctx.fill();
  });
  
  ctx.restore();
}

// ── Slow effect frost particles ─────────────────────────────────
function drawSlowEffect(ctx, x, y, size, slowAmount) {
  const frostAlpha = Math.min(slowAmount * 0.5, 0.6);
  
  ctx.save();
  ctx.fillStyle = `rgba(147, 197, 253, ${frostAlpha})`;
  
  // Draw 6 frost particles around the enemy
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
function drawProjectiles(ctx, projectiles) {
  for (const p of projectiles) {
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

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.splash > 0 ? 6 : 4, 0, Math.PI * 2);
    ctx.fillStyle   = p.color;
    ctx.shadowBlur  = 8;
    ctx.shadowColor = p.color;
    ctx.fill();
    ctx.shadowBlur  = 0;
  }
}

// ── Hover cell highlight ──────────────────────────────────────
function drawHoverCell(ctx, ui) {
  if (!ui.hoveredCell) return;
  const { c, r, valid } = ui.hoveredCell;

  ctx.fillStyle   = valid
    ? 'rgba(100,255,100,0.18)'
    : 'rgba(255,60,60,0.18)';
  ctx.strokeStyle = valid
    ? 'rgba(100,255,100,0.7)'
    : 'rgba(255,60,60,0.7)';
  ctx.lineWidth   = 2;

  ctx.fillRect  (c * TILE_SIZE + 1, r * TILE_SIZE + 1, TILE_SIZE - 2, TILE_SIZE - 2);
  ctx.strokeRect(c * TILE_SIZE + 1, r * TILE_SIZE + 1, TILE_SIZE - 2, TILE_SIZE - 2);
}

// ── Utility ───────────────────────────────────────────────────
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y,     x + w, y + r,     r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x,     y + h, x,     y + h - r, r);
  ctx.lineTo(x,     y + r);
  ctx.arcTo(x,     y,     x + r, y,         r);
  ctx.closePath();
}
