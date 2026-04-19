// ============================================================
//  particleSystem.js
//  Lightweight pooled particle system.
// ============================================================

let _nextParticleId = 1;

// ── Object Pool ──────────────────────────────────────────────
const _particlePool = {
  pool: [],
  maxPoolSize: 2000,

  acquire() {
    if (this.pool.length > 0) {
      return this.pool.pop();
    }
    return this._createNew();
  },

  release(particle) {
    if (this.pool.length < this.maxPoolSize) {
      this.pool.push(particle);
    }
  },

  _createNew() {
    return {
      id: 0,
      type: 'burst',
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      maxLife: 0,
      size: 0,
      color: '#fff',
      gravity: 0,
      text: '',
      active: false,
    };
  },

  _reset(p) {
    p.id = 0;
    p.type = 'burst';
    p.x = 0;
    p.y = 0;
    p.vx = 0;
    p.vy = 0;
    p.life = 0;
    p.maxLife = 0;
    p.size = 0;
    p.color = '#fff';
    p.gravity = 0;
    p.text = '';
    p.active = false;
  },

  getStats() {
    return { pooled: this.pool.length, maxSize: this.maxPoolSize };
  },
};

// ── Particle Creation Helper ──────────────────────────────────
function _createParticle(particles, config) {
  const p = _particlePool.acquire();
  Object.assign(p, config);
  p.id = _nextParticleId++;
  p.life = 1.0;
  p.active = true;
  particles.push(p);
  return p;
}

export function emitDeathBurst(particles, x, y, color, count = 12) {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
    const speed = 40 + Math.random() * 90;
    _createParticle(particles, {
      type: 'burst',
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      maxLife: 0.55 + Math.random() * 0.25,
      size: 2.5 + Math.random() * 3,
      color,
      gravity: 60,
    });
  }
}

export function emitImpactSpark(particles, x, y, color, count = 6) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 25 + Math.random() * 55;
    _createParticle(particles, {
      type: 'spark',
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      maxLife: 0.25 + Math.random() * 0.15,
      size: 1.5 + Math.random() * 2,
      color,
      gravity: 30,
    });
  }
}

export function emitRewardText(particles, x, y, text, color = '#fbbf24') {
  _createParticle(particles, {
    type: 'float',
    x,
    y,
    vx: (Math.random() - 0.5) * 18,
    vy: -55,
    maxLife: 0.9,
    size: 13,
    text,
    color,
    gravity: 0,
  });
}

export function emitPlacementBurst(particles, x, y, color = '#4ade80') {
  _createParticle(particles, {
    type: 'ring',
    x,
    y,
    vx: 0,
    vy: 0,
    maxLife: 0.4,
    size: 10,
    color,
    gravity: 0,
  });
  emitImpactSpark(particles, x, y, color, 8);

  for (let i = 0; i < 6; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 30 + Math.random() * 40;
    _createParticle(particles, {
      type: 'sparkle',
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      maxLife: 0.5 + Math.random() * 0.3,
      size: 1.5 + Math.random() * 2,
      color,
      gravity: -20,
    });
  }
}

export function emitUpgradeBurst(particles, x, y, color = '#fbbf24') {
  particles.push({
    id: _nextParticleId++,
    type: 'ring',
    x,
    y,
    vx: 0,
    vy: 0,
    life: 1.0,
    maxLife: 0.55,
    size: 14,
    color,
    gravity: 0,
  });
  emitImpactSpark(particles, x, y, color, 10);
  emitRewardText(particles, x, y - 16, 'UPGRADE', color);
}

export function emitWaveConfetti(particles, x, y, color = '#60a5fa', count = 16) {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    const speed = 40 + Math.random() * 80;
    particles.push({
      id: _nextParticleId++,
      type: 'burst',
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 30,
      life: 1.0,
      maxLife: 0.5 + Math.random() * 0.3,
      size: 2 + Math.random() * 2,
      color,
      gravity: 80,
    });
  }
}

/**
 * Emit a floating damage number above a hit enemy.
 * Color-coded: white=normal, yellow=crit, green=poison, cyan=slow, red=true damage
 * @param {Array} particles
 * @param {number} x
 * @param {number} y
 * @param {number} damage
 * @param {object} options
 * @param {'normal'|'crit'|'poison'|'slow'|'true'|'splash'} options.type
 * @param {boolean} options.isBoss - Scales up the number for bosses
 */
export function emitDamageNumber(particles, x, y, damage, options = {}) {
  const { type = 'normal', isBoss = false } = options;

  const colorMap = {
    normal: '#e2e8f0',
    crit: '#fbbf24',
    poison: '#4ade80',
    slow: '#67e8f9',
    true: '#ef4444',
    splash: '#f97316',
  };

  const size = isBoss ? 18 : 13;
  const text = type === 'crit' ? `💥${damage}` : `-${damage}`;

  _createParticle(particles, {
    type: 'float',
    x: x + (Math.random() - 0.5) * 16,
    y: y - 10,
    vx: (Math.random() - 0.5) * 25,
    vy: -70,
    maxLife: 0.8,
    size,
    text,
    color: colorMap[type] || colorMap.normal,
    gravity: 0,
  });
}

/**
 * Emit a shockwave ring effect (for boss deaths, elemental burst, etc.)
 */
export function emitShockwave(particles, x, y, color = '#f97316', radius = 80) {
  _createParticle(particles, {
    type: 'ring',
    x,
    y,
    vx: 0,
    vy: 0,
    maxLife: 0.5,
    size: radius,
    color,
    gravity: 0,
  });
}

/**
 * Emit a golden flash across the map (perfect wave, treasure events)
 */
export function emitGoldenFlash(particles, x, y) {
  _createParticle(particles, {
    type: 'sparkle',
    x,
    y,
    vx: 0,
    vy: 0,
    maxLife: 0.6,
    size: 30,
    color: '#fbbf24',
    gravity: 0,
  });
}

/**
 * Emit a lightning arc between two points.
 * Creates a series of jagged spark particles along the path.
 *
 * @param {Array} particles
 * @param {number} x1, {number} y1 - start point
 * @param {number} x2, {number} y2 - end point
 * @param {string} color - lightning color
 * @param {number} segments - number of zigzag segments (default 5)
 */
export function emitLightningArc(particles, x1, y1, x2, y2, color = '#a855f7', segments = 5) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy);
  const segmentLen = dist / segments;

  let prevX = x1;
  let prevY = y1;

  for (let i = 0; i < segments; i++) {
    const t = (i + 1) / segments;
    const targetX = x1 + dx * t;
    const targetY = y1 + dy * t;

    // Offset midpoint for zigzag
    const midX = (prevX + targetX) / 2 + (Math.random() - 0.5) * segmentLen * 0.5;
    const midY = (prevY + targetY) / 2 + (Math.random() - 0.5) * segmentLen * 0.5;

    // Create spark along the two segments
    particles.push({
      id: _nextParticleId++,
      type: 'laser',
      x: midX,
      y: midY,
      vx: 0,
      vy: 0,
      life: 1.0,
      maxLife: 0.15,
      size: 2.5,
      color,
      gravity: 0,
    });

    // Additional sparks around the arc
    if (Math.random() < 0.6) {
      particles.push({
        id: _nextParticleId++,
        type: 'spark',
        x: midX + (Math.random() - 0.5) * 12,
        y: midY + (Math.random() - 0.5) * 12,
        vx: (Math.random() - 0.5) * 40,
        vy: (Math.random() - 0.5) * 40,
        life: 1.0,
        maxLife: 0.1 + Math.random() * 0.08,
        size: 1.5 + Math.random(),
        color: '#ffffff',
        gravity: 0,
      });
    }

    prevX = targetX;
    prevY = targetY;
  }
}

/**
 * Emit an airstrike bombardment effect.
 * Multiple explosions across the map with shockwaves and sparks.
 */
export function emitAirstrike(particles, enemies, count = 5) {
  if (!enemies || enemies.length === 0) return;

  // Pick random enemy positions for strike points
  const strikePoints = [];
  const usedIndices = new Set();
  for (let i = 0; i < Math.min(count, enemies.length); i++) {
    let idx;
    do {
      idx = Math.floor(Math.random() * enemies.length);
    } while (usedIndices.has(idx));
    usedIndices.add(idx);
    strikePoints.push({ x: enemies[idx].x, y: enemies[idx].y });
  }

  for (const point of strikePoints) {
    // Shockwave ring
    _createParticle(particles, {
      type: 'ring',
      x: point.x,
      y: point.y,
      vx: 0,
      vy: 0,
      maxLife: 0.6,
      size: 40,
      color: '#f97316',
      gravity: 0,
    });

    // Explosion burst
    for (let i = 0; i < 15; i++) {
      const angle = (Math.PI * 2 * i) / 15;
      const speed = 60 + Math.random() * 120;
      _createParticle(particles, {
        type: 'burst',
        x: point.x,
        y: point.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 20,
        maxLife: 0.4 + Math.random() * 0.3,
        size: 3 + Math.random() * 3,
        color: Math.random() > 0.5 ? '#f97316' : '#fbbf24',
        gravity: 80,
      });
    }
  }
}

// Element-specific projectile trails
export function emitProjectileTrail(particles, x, y, towerType, dt) {
  const trailConfigs = {
    // Ice - frost sparkle trail
    frost_bolt: () => {
      if (Math.random() > 0.3) return;
      particles.push({
        id: _nextParticleId++,
        type: 'spark',
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1.0,
        maxLife: 0.15 + Math.random() * 0.1,
        size: 1.5 + Math.random(),
        color: '#a5f3fc',
        gravity: 0,
      });
    },
    // Fire - ember trail
    fire_ball: () => {
      if (Math.random() > 0.4) return;
      particles.push({
        id: _nextParticleId++,
        type: 'burst',
        x: x + (Math.random() - 0.5) * 6,
        y: y + (Math.random() - 0.5) * 6,
        vx: (Math.random() - 0.5) * 20 - 10,
        vy: (Math.random() - 0.5) * 20 - 10,
        life: 1.0,
        maxLife: 0.2 + Math.random() * 0.15,
        size: 1 + Math.random() * 1.5,
        color: Math.random() > 0.5 ? '#f97316' : '#fbbf24',
        gravity: -30,
      });
    },
    // Poison - green mist
    poison: () => {
      if (Math.random() > 0.25) return;
      particles.push({
        id: _nextParticleId++,
        type: 'mist',
        x: x + (Math.random() - 0.5) * 12,
        y: y + (Math.random() - 0.5) * 12,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 1.0,
        maxLife: 0.3 + Math.random() * 0.2,
        size: 3 + Math.random() * 3,
        color: '#22c55e',
        gravity: 5,
      });
    },
    // Lightning/tesla - electric spark
    tesla: () => {
      if (Math.random() > 0.5) return;
      particles.push({
        id: _nextParticleId++,
        type: 'spark',
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 30,
        vy: (Math.random() - 0.5) * 30,
        life: 1.0,
        maxLife: 0.08 + Math.random() * 0.05,
        size: 1 + Math.random() * 1.5,
        color: '#a855f7',
        gravity: 0,
      });
    },
    // Sniper - laser trail
    sniper: () => {
      if (Math.random() > 0.6) return;
      particles.push({
        id: _nextParticleId++,
        type: 'laser',
        x,
        y,
        vx: 0,
        vy: 0,
        life: 1.0,
        maxLife: 0.1,
        size: 2,
        color: '#ef4444',
        gravity: 0,
      });
    },
  };

  const trailFn = trailConfigs[towerType];
  if (trailFn) {
    trailFn();
  }
}

export function updateParticles(particles, dt) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life -= dt / p.maxLife;
    if (p.life <= 0) {
      particles.splice(i, 1);
      _particlePool.release(p);
      continue;
    }

    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += p.gravity * dt;
    p.vx *= 0.92;
  }
}

export function renderParticles(ctx, particles, countMultiplier = 1.0) {
  // Skip rendering if multiplier is very low (reduced motion mode)
  if (countMultiplier <= 0) return;

  const maxParticles = Math.max(1, Math.floor((particles?.length || 0) * countMultiplier));

  for (let i = 0; i < maxParticles; i++) {
    const p = particles[i];
    if (!p) continue;

    const alpha = Math.max(0, p.life);
    ctx.globalAlpha = alpha;

    if (p.type === 'float') {
      ctx.font = `bold ${p.size}px monospace`;
      ctx.textAlign = 'center';
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 6;
      ctx.shadowColor = p.color;
      ctx.fillText(p.text, p.x, p.y);
      ctx.shadowBlur = 0;
    } else if (p.type === 'ring') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 3;
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (1 + (1 - p.life) * 2.2), 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    } else if (p.type === 'sparkle') {
      // Star-shaped sparkle particles
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      const scale = 1 + (1 - p.life) * 0.5;
      const size = p.size * scale;

      // Draw 4-point star
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - size * 2);
      ctx.lineTo(p.x + size * 0.4, p.y - size * 0.4);
      ctx.lineTo(p.x + size * 2, p.y);
      ctx.lineTo(p.x + size * 0.4, p.y + size * 0.4);
      ctx.lineTo(p.x, p.y + size * 2);
      ctx.lineTo(p.x - size * 0.4, p.y + size * 0.4);
      ctx.lineTo(p.x - size * 2, p.y);
      ctx.lineTo(p.x - size * 0.4, p.y - size * 0.4);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
    } else if (p.type === 'mist') {
      // Poison mist - translucent circle
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life * 0.4;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = alpha;
    } else if (p.type === 'laser') {
      // Laser trail - thin line
      ctx.strokeStyle = p.color;
      ctx.globalAlpha = p.life * 0.8;
      ctx.lineWidth = p.size;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.beginPath();
      ctx.moveTo(p.x - 3, p.y);
      ctx.lineTo(p.x + 3, p.y);
      ctx.stroke();
      ctx.globalAlpha = alpha;
      ctx.shadowBlur = 0;
    } else {
      ctx.fillStyle = p.color;
      ctx.shadowBlur = p.type === 'burst' ? 6 : 3;
      ctx.shadowColor = p.color;
      const angle = Math.atan2(p.vy, p.vx);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(angle);
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
      ctx.shadowBlur = 0;
    }
  }

  ctx.globalAlpha = 1;
  ctx.textAlign = 'left';
}

export function getParticlePoolStats() {
  return _particlePool.getStats();
}
