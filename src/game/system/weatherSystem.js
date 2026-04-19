// ============================================================
//  weatherSystem.js
//  Dynamic weather that changes mid-game per world.
//  Weather affects tower fire rates, enemy speed, and visuals.
// ============================================================

/**
 * Weather definitions per world.
 * Each weather type has:
 *  - name, icon: UI display
 *  - effects: gameplay modifiers
 *  - color: visual overlay color
 *  - particleColor: for weather particles
 */
export const WEATHER_DEFS = {
  // Forest
  clear: {
    name: 'Clear Skies',
    icon: '☀️',
    effects: {},
    color: 'rgba(255, 255, 200, 0.03)',
    particleColor: '#fef08a',
  },
  rain: {
    name: 'Heavy Rain',
    icon: '🌧️',
    effects: {
      towerFireRateMultiplier: 0.8, // -20% fire rate
      enemySpeedMultiplier: 0.9, // -10% enemy speed
    },
    color: 'rgba(100, 150, 255, 0.06)',
    particleColor: '#60a5fa',
  },
  fog: {
    name: 'Dense Fog',
    icon: '🌫️',
    effects: {
      towerRangeMultiplier: 0.85, // -15% range
    },
    color: 'rgba(200, 200, 200, 0.08)',
    particleColor: '#d1d5db',
  },

  // Desert
  sandstorm: {
    name: 'Sandstorm',
    icon: '🏜️',
    effects: {
      towerRangeMultiplier: 0.85,
      enemySpeedMultiplier: 0.95,
    },
    color: 'rgba(217, 169, 56, 0.1)',
    particleColor: '#d4a843',
  },
  heatwave: {
    name: 'Heatwave',
    icon: '🔥',
    effects: {
      towerFireRateMultiplier: 1.1,
      enemyHpMultiplier: 0.9,
    },
    color: 'rgba(255, 100, 50, 0.05)',
    particleColor: '#f97316',
  },

  // Ice
  blizzard: {
    name: 'Blizzard',
    icon: '❄️',
    effects: {
      enemySpeedMultiplier: 0.7, // -30% enemy speed
      iceTowerSlowBonus: 1.5, // +50% ice tower slow
    },
    color: 'rgba(150, 200, 255, 0.08)',
    particleColor: '#93c5fd',
  },
  aurora: {
    name: 'Aurora',
    icon: '🌌',
    effects: {
      towerDamageMultiplier: 1.1,
    },
    color: 'rgba(100, 255, 150, 0.04)',
    particleColor: '#34d399',
  },

  // Volcanic
  eruption: {
    name: 'Volcanic Eruption',
    icon: '🌋',
    effects: {
      enemySpeedMultiplier: 0.85,
      towerFireRateMultiplier: 0.9,
    },
    color: 'rgba(255, 50, 50, 0.06)',
    particleColor: '#ef4444',
  },
  ashfall: {
    name: 'Ash Fall',
    icon: '💨',
    effects: {
      towerRangeMultiplier: 0.8,
    },
    color: 'rgba(100, 100, 100, 0.1)',
    particleColor: '#6b7280',
  },

  // Cosmic
  cosmicStorm: {
    name: 'Cosmic Storm',
    icon: '⚡',
    effects: {
      towerDamageMultiplier: 1.2, // +20% damage (random towers get buff)
      towerCooldownMultiplier: 1.3, // +30% cooldown after
    },
    color: 'rgba(139, 92, 246, 0.08)',
    particleColor: '#a78bfa',
  },
  voidRift: {
    name: 'Void Rift',
    icon: '🕳️',
    effects: {
      enemyHpMultiplier: 0.85,
      enemyRewardMultiplier: 1.5,
    },
    color: 'rgba(50, 0, 80, 0.12)',
    particleColor: '#7c3aed',
  },
};

/**
 * World-specific weather pools.
 * Each world has a list of possible weathers and their relative weights.
 */
export const WORLD_WEATHER = {
  forest: [
    { type: 'clear', weight: 50 },
    { type: 'rain', weight: 30 },
    { type: 'fog', weight: 20 },
  ],
  desert: [
    { type: 'clear', weight: 40 },
    { type: 'sandstorm', weight: 35 },
    { type: 'heatwave', weight: 25 },
  ],
  ice: [
    { type: 'clear', weight: 35 },
    { type: 'blizzard', weight: 40 },
    { type: 'aurora', weight: 25 },
  ],
  volcanic: [
    { type: 'clear', weight: 30 },
    { type: 'eruption', weight: 35 },
    { type: 'ashfall', weight: 35 },
  ],
  cosmic: [
    { type: 'clear', weight: 30 },
    { type: 'cosmicStorm', weight: 40 },
    { type: 'voidRift', weight: 30 },
  ],
};

/**
 * Weather change interval (in waves).
 * Weather changes every N waves.
 */
export const WEATHER_CHANGE_INTERVAL = 3;

/**
 * Warning time before weather changes (in seconds).
 */
export const WEATHER_WARNING_TIME = 5;

/**
 * Pick a random weather type for a world, weighted.
 */
export function pickRandomWeather(worldId) {
  const pool = WORLD_WEATHER[worldId] || WORLD_WEATHER.forest;
  const totalWeight = pool.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const entry of pool) {
    roll -= entry.weight;
    if (roll <= 0) {
      return entry.type;
    }
  }
  return pool[0].type;
}

/**
 * Create initial weather state.
 */
export function createWeatherState(worldId = 'forest') {
  return {
    current: 'clear',
    next: pickRandomWeather(worldId),
    worldId,
    active: true,
    timer: WEATHER_CHANGE_INTERVAL, // waves until change
    warningTimer: 0,
    changing: false,
  };
}

/**
 * Update weather state each frame.
 * @param {object} weather
 * @param {number} dt
 * @param {number} wave - current wave number
 * @returns {{ changed: boolean, warning: boolean }}
 */
export function updateWeather(weather, dt, wave) {
  let changed = false;
  let warning = false;

  if (!weather.active) return { changed, warning };

  // Check if it's time to change weather (every N waves)
  const wavesSinceLastChange = wave % WEATHER_CHANGE_INTERVAL;
  if (wavesSinceLastChange === 0 && weather.timer > 0) {
    weather.timer = 0;
  }

  // Countdown timer when actively changing
  if (weather.timer > 0) {
    weather.timer -= dt / 60; // approximate wave duration
    if (weather.timer <= WEATHER_WARNING_TIME && !weather.changing) {
      weather.changing = true;
      weather.warningTimer = WEATHER_WARNING_TIME;
    }
  }

  // Warning countdown
  if (weather.warningTimer > 0) {
    weather.warningTimer -= dt;
    warning = true;
    if (weather.warningTimer <= 0) {
      // Apply weather change
      weather.current = weather.next;
      weather.next = pickRandomWeather(weather.worldId);
      weather.changing = false;
      weather.timer = WEATHER_CHANGE_INTERVAL;
      changed = true;
    }
  }

  return { changed, warning };
}

/**
 * Get combined weather effects.
 */
export function getWeatherEffects(weather) {
  const def = WEATHER_DEFS[weather.current];
  return def ? def.effects : {};
}

/**
 * Apply weather effects to a tower's effective stats.
 * @param {object} stats - tower stats object
 * @param {object} weatherEffects - current weather effects
 * @returns {object} - modified stats
 */
export function applyWeatherToTower(stats, weatherEffects) {
  const modified = { ...stats };

  if (weatherEffects.towerFireRateMultiplier) {
    modified.fireRate = (modified.fireRate || 1) * weatherEffects.towerFireRateMultiplier;
  }
  if (weatherEffects.towerDamageMultiplier) {
    modified.damage = (modified.damage || 1) * weatherEffects.towerDamageMultiplier;
  }
  if (weatherEffects.towerRangeMultiplier) {
    modified.range = (modified.range || 1) * weatherEffects.towerRangeMultiplier;
  }
  if (weatherEffects.towerCooldownMultiplier) {
    modified.cooldown = (modified.cooldown || 0) * weatherEffects.towerCooldownMultiplier;
  }

  return modified;
}

/**
 * Apply weather effects to enemy movement speed.
 */
export function applyWeatherToEnemy(speed, weatherEffects) {
  if (weatherEffects.enemySpeedMultiplier) {
    return speed * weatherEffects.enemySpeedMultiplier;
  }
  return speed;
}
