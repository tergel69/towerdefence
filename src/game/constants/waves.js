// ============================================================
//  WAVES.JS
//  Wave definitions and generation
// ============================================================

export const WAVES = [
  // Wave 1 — tutorial
  [{ type: 'normal', count: 8, interval: 1.2 }],
  // Wave 2
  [
    { type: 'normal', count: 10, interval: 1.0 },
    { type: 'fast', count: 4, interval: 0.8 },
  ],
  // Wave 3
  [
    { type: 'fast', count: 8, interval: 0.7 },
    { type: 'normal', count: 6, interval: 1.0 },
    { type: 'tank', count: 2, interval: 2.5 },
  ],
  // Wave 4
  [
    { type: 'tank', count: 4, interval: 2.0 },
    { type: 'fast', count: 10, interval: 0.5 },
  ],
  // Wave 5 — boss rush
  [
    { type: 'normal', count: 15, interval: 0.6 },
    { type: 'tank', count: 6, interval: 1.8 },
    { type: 'fast', count: 12, interval: 0.4 },
  ],
  // Wave 6 — healer introduction
  [
    { type: 'normal', count: 12, interval: 0.8 },
    { type: 'healer', count: 2, interval: 3.0 },
    { type: 'fast', count: 6, interval: 0.6 },
  ],
  // Wave 7 — shielded enemies
  [
    { type: 'shielded', count: 5, interval: 1.5 },
    { type: 'normal', count: 10, interval: 0.7 },
    { type: 'healer', count: 2, interval: 2.5 },
  ],
  // Wave 8 — mixed assault
  [
    { type: 'fast', count: 12, interval: 0.4 },
    { type: 'tank', count: 5, interval: 2.0 },
    { type: 'healer', count: 3, interval: 2.0 },
    { type: 'shielded', count: 3, interval: 2.5 },
  ],
  // Wave 9 — heavy assault
  [
    { type: 'tank', count: 8, interval: 1.8 },
    { type: 'shielded', count: 6, interval: 2.0 },
    { type: 'healer', count: 4, interval: 1.5 },
    { type: 'fast', count: 15, interval: 0.3 },
  ],
  // Wave 10 — boss wave
  [
    { type: 'boss', count: 1, interval: 0 },
    { type: 'normal', count: 20, interval: 0.5 },
    { type: 'healer', count: 3, interval: 2.0 },
  ],
];

// Enhanced wave generation templates for endless mode variety
export const WAVE_TEMPLATES = {
  // Standard mixed wave
  mixed: {
    composition: [
      { type: 'normal', count: 10, interval: 0.8 },
      { type: 'fast', count: 5, interval: 1.0, delay: 3 },
      { type: 'tank', count: 2, interval: 2.0, delay: 8 },
    ],
  },
  // Rush wave - many fast enemies early
  rush: {
    composition: [
      { type: 'fast', count: 15, interval: 0.5 },
      { type: 'normal', count: 8, interval: 0.8, delay: 5 },
    ],
  },
  // Tank wave - few strong enemies
  tankWave: {
    composition: [
      { type: 'tank', count: 5, interval: 3 },
      { type: 'normal', count: 10, interval: 1, delay: 8 },
    ],
  },
  // Swarm wave - overwhelming numbers
  swarm: {
    composition: [
      { type: 'normal', count: 20, interval: 0.3 },
      { type: 'fast', count: 10, interval: 0.4, delay: 2 },
    ],
  },
  // Healer wave - support enemies
  healerWave: {
    composition: [
      { type: 'healer', count: 5, interval: 2.0 },
      { type: 'normal', count: 12, interval: 0.8, delay: 3 },
      { type: 'fast', count: 6, interval: 0.6, delay: 5 },
    ],
  },
  // Shielded wave - armored enemies
  armored: {
    composition: [
      { type: 'shielded', count: 8, interval: 1.5 },
      { type: 'tank', count: 3, interval: 2.5, delay: 5 },
    ],
  },
  // Brute wave - CC immune heavy enemies
  bruteForce: {
    composition: [
      { type: 'brute', count: 4, interval: 2.5 },
      { type: 'normal', count: 10, interval: 0.8, delay: 4 },
    ],
  },
  // Phase/teleport wave - special mechanics
  phaseShift: {
    composition: [
      { type: 'phase', count: 3, interval: 3.0 },
      { type: 'phantom', count: 4, interval: 2.0, delay: 2 },
      { type: 'normal', count: 8, interval: 0.8, delay: 6 },
    ],
  },
  // Mini-boss wave - boss with support
  miniBoss: {
    composition: [
      { type: 'boss', count: 1, delay: 2 },
      { type: 'normal', count: 8, interval: 0.8, delay: 0 },
      { type: 'healer', count: 3, interval: 2, delay: 4 },
    ],
    bossScaling: 0.5, // 50% of normal boss HP
  },
};

// For waves beyond WAVES.length, auto-scale with template variety:
export function generateWave(waveNumber) {
  const scale = 1 + (waveNumber - WAVES.length) * 0.2; // Reduced from 0.3 for balance

  // Select wave template based on wave number for variety
  const templates = [
    'mixed',
    'rush',
    'tankWave',
    'swarm',
    'healerWave',
    'armored',
    'bruteForce',
    'phaseShift',
  ];

  // Every 5th wave = mini boss
  if ((waveNumber - WAVES.length) % 5 === 0) {
    return WAVE_TEMPLATES.miniBoss.composition.map((group) => ({
      ...group,
      count: Math.floor(group.count * scale),
      interval: group.interval ? Math.max(0.3, group.interval / scale) : undefined,
    }));
  }

  // Select template based on wave number cycle
  const template = templates[(waveNumber - WAVES.length) % templates.length];
  const templateDef = WAVE_TEMPLATES[template];

  // Build wave composition with scaling
  const waveDef = [];

  for (const group of templateDef.composition) {
    const count = Math.floor(group.count * scale);
    const interval = group.interval ? Math.max(0.2, group.interval / scale) : undefined;

    // Add delay offset if specified
    if (group.delay) {
      waveDef.push({ type: group.type, count, interval, delay: group.delay * scale });
    } else {
      waveDef.push({ type: group.type, count, interval });
    }
  }

  // Late waves add special enemies
  if (waveNumber > 20) {
    waveDef.push({ type: 'brute', count: Math.floor(2 * scale), interval: 3.0 });
  }
  if (waveNumber > 30) {
    waveDef.push({ type: 'juggernaut', count: 1, interval: 0 });
  }
  if (waveNumber > 40 && waveNumber % 10 === 0) {
    waveDef.push({ type: 'swarmQueen', count: 3, interval: 1.0 });
  }

  return waveDef;
}

// ── Economy ──────────────────────────────────────────────────
