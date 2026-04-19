// ============================================================
//  screenShake.js
//  Intensity-based screen shake with exponential decay.
//  Supports stacking shakes with different intensities/durations.
// ============================================================

/**
 * Create a new shake effect and push it to the shake stack.
 * @param {Array} shakeStack - Array of active shake effects
 * @param {number} intensity - Max shake offset in pixels
 * @param {number} duration - Duration in seconds
 */
export function triggerShake(shakeStack, intensity, duration) {
  shakeStack.push({
    intensity,
    maxIntensity: intensity,
    duration,
    elapsed: 0,
  });
}

/**
 * Update all active shakes and compute combined offset.
 * @param {Array} shakeStack
 * @param {number} dt - Delta time in seconds
 * @returns {{ offsetX: number, offsetY: number }}
 */
export function updateShake(shakeStack, dt) {
  // Update elapsed time and remove expired shakes
  for (let i = shakeStack.length - 1; i >= 0; i--) {
    shakeStack[i].elapsed += dt;
    if (shakeStack[i].elapsed >= shakeStack[i].duration) {
      shakeStack.splice(i, 1);
    }
  }

  if (shakeStack.length === 0) {
    return { offsetX: 0, offsetY: 0 };
  }

  // Combine all active shakes (take max intensity, not sum, to avoid crazy values)
  let totalIntensityX = 0;
  let totalIntensityY = 0;

  for (const shake of shakeStack) {
    const progress = shake.elapsed / shake.duration; // 0 → 1
    // Exponential decay: intensity * (1 - progress)^2 for snappy feel
    const currentIntensity = shake.maxIntensity * Math.pow(1 - progress, 2);

    // Random offset with direction change each frame
    const angleX = Math.random() * Math.PI * 2;
    const angleY = Math.random() * Math.PI * 2;
    totalIntensityX += Math.cos(angleX) * currentIntensity;
    totalIntensityY += Math.sin(angleY) * currentIntensity;
  }

  return {
    offsetX: totalIntensityX,
    offsetY: totalIntensityY,
  };
}

/**
 * Preset shake configurations for common game events.
 */
export const SHAKE_PRESETS = {
  bossKill: { intensity: 12, duration: 0.4 },
  splashExplosion: { intensity: 4, duration: 0.12 },
  waveComplete: { intensity: 6, duration: 0.25 },
  towerPlace: { intensity: 2, duration: 0.06 },
  towerDestroyed: { intensity: 3, duration: 0.1 },
  enemyDeath: { intensity: 2, duration: 0.08 },
  commanderAbility: { intensity: 8, duration: 0.3 },
  weatherChange: { intensity: 5, duration: 0.2 },
  heavy: { intensity: 15, duration: 0.5 },
  micro: { intensity: 1.5, duration: 0.04 },
};

/**
 * Clear all active shakes immediately.
 */
export function clearShakes(shakeStack) {
  shakeStack.length = 0;
}
