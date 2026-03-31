// ============================================================
//  particleSystem.js
//  Lightweight pooled particle system.
// ============================================================

let _nextParticleId = 1;

export function emitDeathBurst(particles, x, y, color, count = 12) {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
    const speed = 40 + Math.random() * 90;
    particles.push({
      id: _nextParticleId++,
      type: 'burst',
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1.0,
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
    particles.push({
      id: _nextParticleId++,
      type: 'spark',
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1.0,
      maxLife: 0.25 + Math.random() * 0.15,
      size: 1.5 + Math.random() * 2,
      color,
      gravity: 30,
    });
  }
}

export function emitRewardText(particles, x, y, text, color = '#fbbf24') {
  particles.push({
    id: _nextParticleId++,
    type: 'float',
    x,
    y,
    vx: (Math.random() - 0.5) * 18,
    vy: -55,
    life: 1.0,
    maxLife: 0.9,
    size: 13,
    text,
    color,
    gravity: 0,
  });
}

export function emitPlacementBurst(particles, x, y, color = '#4ade80') {
  particles.push({
    id: _nextParticleId++,
    type: 'ring',
    x,
    y,
    vx: 0,
    vy: 0,
    life: 1.0,
    maxLife: 0.4,
    size: 10,
    color,
    gravity: 0,
  });
  emitImpactSpark(particles, x, y, color, 8);
  
  // Add sparkle particles for enhanced placement feedback
  for (let i = 0; i < 6; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 30 + Math.random() * 40;
    particles.push({
      id: _nextParticleId++,
      type: 'sparkle',
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1.0,
      maxLife: 0.5 + Math.random() * 0.3,
      size: 1.5 + Math.random() * 2,
      color,
      gravity: -20, // Float upward
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
      continue;
    }

    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += p.gravity * dt;
    p.vx *= 0.92;
  }
}

export function renderParticles(ctx, particles) {
  for (const p of particles) {
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
