// ============================================================
//  particleSystem.test.js
//  Comprehensive tests for particle emission, update, and pooling
// ============================================================

import {
  emitDeathBurst,
  emitImpactSpark,
  emitRewardText,
  emitPlacementBurst,
  emitUpgradeBurst,
  emitWaveConfetti,
  updateParticles,
  getParticlePoolStats,
} from './system/particleSystem';

describe('emitDeathBurst', () => {
  test('creates correct number of particles', () => {
    const particles = [];
    emitDeathBurst(particles, 100, 100, '#ff0000', 12);
    expect(particles).toHaveLength(12);
  });

  test('particles have correct type', () => {
    const particles = [];
    emitDeathBurst(particles, 100, 100, '#ff0000');
    particles.forEach((p) => expect(p.type).toBe('burst'));
  });

  test('particles positioned at origin', () => {
    const particles = [];
    emitDeathBurst(particles, 150, 200, '#ff0000');
    particles.forEach((p) => {
      expect(p.x).toBe(150);
      expect(p.y).toBe(200);
    });
  });

  test('particles have correct color', () => {
    const particles = [];
    emitDeathBurst(particles, 100, 100, '#00ff00');
    particles.forEach((p) => expect(p.color).toBe('#00ff00'));
  });

  test('particles have velocity', () => {
    const particles = [];
    emitDeathBurst(particles, 100, 100, '#ff0000');
    particles.forEach((p) => {
      expect(Math.abs(p.vx) + Math.abs(p.vy)).toBeGreaterThan(0);
    });
  });
});

describe('emitImpactSpark', () => {
  test('creates correct number of sparks', () => {
    const particles = [];
    emitImpactSpark(particles, 100, 100, '#ffff00', 6);
    expect(particles).toHaveLength(6);
  });

  test('sparks have correct type', () => {
    const particles = [];
    emitImpactSpark(particles, 100, 100, '#ffff00');
    particles.forEach((p) => expect(p.type).toBe('spark'));
  });

  test('default count is 6', () => {
    const particles = [];
    emitImpactSpark(particles, 100, 100, '#ffff00');
    expect(particles).toHaveLength(6);
  });
});

describe('emitRewardText', () => {
  test('creates float text particle', () => {
    const particles = [];
    emitRewardText(particles, 100, 100, '+50', '#fbbf24');
    expect(particles).toHaveLength(1);
    expect(particles[0].type).toBe('float');
    expect(particles[0].text).toBe('+50');
  });

  test('text positioned correctly', () => {
    const particles = [];
    emitRewardText(particles, 120, 80, 'UPGRADE', '#fbbf24');
    expect(particles[0].x).toBe(120);
    expect(particles[0].y).toBe(80);
  });

  test('moves upward', () => {
    const particles = [];
    emitRewardText(particles, 100, 100, '+100');
    expect(particles[0].vy).toBe(-55);
  });
});

describe('emitPlacementBurst', () => {
  test('creates ring particle', () => {
    const particles = [];
    emitPlacementBurst(particles, 100, 100, '#4ade80');
    expect(particles.some((p) => p.type === 'ring')).toBe(true);
  });

  test('creates sparkle particles', () => {
    const particles = [];
    emitPlacementBurst(particles, 100, 100, '#4ade80');
    const sparkles = particles.filter((p) => p.type === 'sparkle');
    expect(sparkles.length).toBeGreaterThan(0);
  });

  test('creates multiple particles', () => {
    const particles = [];
    emitPlacementBurst(particles, 100, 100);
    expect(particles.length).toBeGreaterThan(6);
  });
});

describe('emitUpgradeBurst', () => {
  test('creates ring and sparks', () => {
    const particles = [];
    emitUpgradeBurst(particles, 100, 100, '#fbbf24');
    const types = particles.map((p) => p.type);
    expect(types).toContain('ring');
    expect(types).toContain('spark');
  });

  test('creates upgrade text', () => {
    const particles = [];
    emitUpgradeBurst(particles, 100, 100);
    const textParticles = particles.filter((p) => p.type === 'float');
    expect(textParticles.length).toBeGreaterThan(0);
    expect(textParticles[0].text).toBe('UPGRADE');
  });
});

describe('emitWaveConfetti', () => {
  test('creates correct number of particles', () => {
    const particles = [];
    emitWaveConfetti(particles, 100, 100, '#60a5fa', 16);
    expect(particles).toHaveLength(16);
  });

  test('particles burst outward', () => {
    const particles = [];
    emitWaveConfetti(particles, 100, 100, '#60a5fa');
    particles.forEach((p) => {
      expect(Math.abs(p.vx) + Math.abs(p.vy)).toBeGreaterThan(0);
    });
  });

  test('particles have gravity', () => {
    const particles = [];
    emitWaveConfetti(particles, 100, 100);
    particles.forEach((p) => {
      expect(p.gravity).toBeGreaterThan(0);
    });
  });
});

describe('updateParticles', () => {
  test('particles move based on velocity', () => {
    const particles = [];
    emitDeathBurst(particles, 100, 100, '#ff0000', 1);
    particles[0].vx = 50;
    particles[0].vy = 0;
    particles[0].maxLife = 2.0;

    updateParticles(particles, 1.0);

    expect(particles[0].x).toBe(150);
    expect(particles[0].y).toBeCloseTo(100, 0);
  });

  test('gravity affects vertical velocity', () => {
    const particles = [];
    emitImpactSpark(particles, 100, 100, '#ffff00', 1);
    particles[0].vx = 0;
    particles[0].vy = 0;
    particles[0].gravity = 100;
    particles[0].maxLife = 2.0;

    updateParticles(particles, 0.5);

    expect(particles[0].vy).toBeCloseTo(50, 0);
  });

  test('expired particles are removed', () => {
    const particles = [];
    emitDeathBurst(particles, 100, 100, '#ff0000', 1);
    particles[0].maxLife = 0.5;

    updateParticles(particles, 0.6);

    expect(particles).toHaveLength(0);
  });

  test('particle life decreases', () => {
    const particles = [];
    emitDeathBurst(particles, 100, 100, '#ff0000', 1);
    particles[0].maxLife = 1.0;

    updateParticles(particles, 0.3);

    expect(particles[0].life).toBeLessThan(1.0);
  });

  test('velocity damping applied', () => {
    const particles = [];
    emitImpactSpark(particles, 100, 100, '#ffff00', 1);
    particles[0].vx = 100;
    particles[0].vy = 100;
    particles[0].gravity = 0;
    particles[0].maxLife = 2.0;

    const initialVx = particles[0].vx;
    updateParticles(particles, 0.1);

    expect(particles[0].vx).toBeLessThan(initialVx);
  });
});

describe('object pooling', () => {
  test('pool stats track usage', () => {
    const particles = [];
    emitDeathBurst(particles, 100, 100, '#ff0000', 12);
    updateParticles(particles, 2.0);

    const stats = getParticlePoolStats();
    expect(stats.pooled).toBeGreaterThan(0);
    expect(stats.maxSize).toBe(2000);
  });

  test('reuses particles from pool', () => {
    const particles = [];

    for (let i = 0; i < 50; i++) {
      emitImpactSpark(particles, 100, 100, '#ffff00', 6);
      updateParticles(particles, 2.0);
    }

    const stats = getParticlePoolStats();
    expect(stats.pooled).toBeGreaterThan(0);
  });
});
