// ============================================================
//  eventSystem.js
//  Special event waves (double gold, time attack, treasure waves)
// ============================================================

// Event wave definitions
export const EVENT_WAVE_TYPES = {
  DOUBLE_GOLD: {
    id: 'double_gold',
    name: '💰 Double Gold Wave',
    description: 'All enemies drop double gold!',
    color: '#fbbf24',
    icon: '💰',
    effect: { goldMultiplier: 2.0 },
    frequency: 0.15, // 15% chance on non-boss waves
    minWave: 3,
  },
  TIME_ATTACK: {
    id: 'time_attack',
    name: '⏱️ Time Attack Wave',
    description: 'Defeat all enemies in 30 seconds for bonus rewards!',
    color: '#ef4444',
    icon: '⏱️',
    effect: { timeLimit: 30, timeBonus: 100 },
    frequency: 0.1,
    minWave: 5,
  },
  TREASURE_WAVE: {
    id: 'treasure_wave',
    name: '🎁 Treasure Wave',
    description: 'Special treasure enemies appear with massive rewards!',
    color: '#a855f7',
    icon: '🎁',
    effect: { treasureSpawnChance: 0.3, treasureMultiplier: 5.0 },
    frequency: 0.08,
    minWave: 7,
  },
  SWARM_WAVE: {
    id: 'swarm_wave',
    name: '🐜 Swarm Wave',
    description: 'Double the enemies, double the rewards!',
    color: '#22c55e',
    icon: '🐜',
    effect: { enemyCountMultiplier: 2.0, rewardMultiplier: 2.0 },
    frequency: 0.1,
    minWave: 10,
  },
  BOSS_RUSH: {
    id: 'boss_rush',
    name: '👹 Boss Rush',
    description: 'Multiple bosses appear! Extreme danger and rewards!',
    color: '#dc2626',
    icon: '👹',
    effect: { bossCount: 3, bossHpMultiplier: 0.8, rewardMultiplier: 3.0 },
    frequency: 0.05,
    minWave: 15,
  },
};

// Event wave state
let currentEventWave = null;
let eventWaveHistory = [];

/**
 * Determine if the next wave should be an event wave
 * @param {number} waveNumber - Upcoming wave number
 * @param {object} options - Configuration options
 * @returns {object|null} Event wave config or null
 */
export function determineEventWave(waveNumber, options = {}) {
  const { eventChance = 1.0, disableEvents = false } = options;

  // No events if disabled or on boss waves (every 5th)
  if (disableEvents || waveNumber % 5 === 0) {
    return null;
  }

  // Check minimum wave requirement for events
  const eligibleEvents = Object.values(EVENT_WAVE_TYPES).filter(
    (event) => waveNumber >= event.minWave
  );

  if (eligibleEvents.length === 0) return null;

  // Random chance to trigger an event
  const roll = Math.random() * eventChance;

  // Find the highest frequency event that matches our roll
  eligibleEvents.sort((a, b) => b.frequency - a.frequency);

  let cumulativeChance = 0;
  for (const event of eligibleEvents) {
    cumulativeChance += event.frequency;
    if (roll <= cumulativeChance) {
      return event;
    }
  }

  return null;
}

/**
 * Apply event wave modifiers to enemy spawn queue
 * @param {Array} spawnQueue - Original spawn queue
 * @param {object} eventConfig - Event wave configuration
 * @returns {Array} Modified spawn queue
 */
export function applyEventWaveModifiers(spawnQueue, eventConfig) {
  if (!eventConfig || !eventConfig.effect) return spawnQueue;

  const effect = eventConfig.effect;
  let modifiedQueue = [...spawnQueue];

  // Double Gold: No enemy changes, gold is handled in reward logic
  if (eventConfig.id === 'double_gold') {
    // Mark queue as double gold for reward calculation
    modifiedQueue = modifiedQueue.map((entry) => ({
      ...entry,
      eventModifier: { goldMultiplier: effect.goldMultiplier },
    }));
  }

  // Time Attack: Add time tracking
  if (eventConfig.id === 'time_attack') {
    modifiedQueue = modifiedQueue.map((entry) => ({
      ...entry,
      eventModifier: { isTimeAttack: true },
    }));
  }

  // Treasure Wave: Spawn treasure enemies
  if (eventConfig.id === 'treasure_wave') {
    const treasureEntries = [];

    modifiedQueue.forEach((entry) => {
      if (Math.random() < effect.treasureSpawnChance) {
        treasureEntries.push({
          ...entry,
          type: 'treasure',
          isTreasure: true,
          rewardMultiplier: effect.treasureMultiplier,
          hpScale: entry.hpScale * 0.5, // Treasures have less HP
          eventModifier: { isTreasure: true },
        });
      }
    });

    modifiedQueue = [...modifiedQueue, ...treasureEntries];
  }

  // Swarm Wave: Double enemies
  if (eventConfig.id === 'swarm_wave') {
    const doubled = modifiedQueue.map((entry) => ({
      ...entry,
      delay: entry.delay / 2, // Spawn twice as fast
      eventModifier: { rewardMultiplier: effect.rewardMultiplier },
    }));
    modifiedQueue = [...modifiedQueue, ...doubled];
  }

  // Boss Rush: Add multiple bosses
  if (eventConfig.id === 'boss_rush') {
    const lastEntry = modifiedQueue[modifiedQueue.length - 1];
    const bossDelay = lastEntry ? lastEntry.delay + 2.0 : 5.0;

    for (let i = 0; i < effect.bossCount - 1; i++) {
      modifiedQueue.push({
        type: 'boss',
        delay: bossDelay + i * 3.0,
        hpScale: effect.bossHpMultiplier,
        speedScale: 1.0,
        rewardMultiplier: effect.rewardMultiplier,
        isBoss: true,
        eventModifier: { isBossRush: true },
      });
    }
  }

  return modifiedQueue;
}

/**
 * Calculate event wave rewards
 * @param {string} eventId - Event wave type
 * @param {object} completionData - Data about wave completion
 * @returns {number} Bonus reward amount
 */
export function calculateEventRewards(eventId, completionData) {
  const eventConfig = EVENT_WAVE_TYPES[eventId];
  if (!eventConfig) return 0;

  let bonus = 0;
  const effect = eventConfig.effect;

  // Time Attack bonus
  if (eventId === 'time_attack' && completionData.completionTime) {
    if (completionData.completionTime <= effect.timeLimit) {
      bonus += effect.timeBonus;
    }
  }

  // Boss Rush bonus
  if (eventId === 'boss_rush') {
    bonus += completionData.bossesKilled * 50 || 0;
  }

  return bonus;
}

/**
 * Get current active event wave
 * @returns {object|null} Current event wave config
 */
export function getCurrentEventWave() {
  return currentEventWave;
}

/**
 * Set active event wave
 * @param {object|null} eventConfig - Event wave configuration
 */
export function setCurrentEventWave(eventConfig) {
  currentEventWave = eventConfig;
  if (eventConfig) {
    eventWaveHistory.push({
      ...eventConfig,
      timestamp: Date.now(),
    });
  }
}

/**
 * Get event wave history
 * @returns {Array} History of event waves
 */
export function getEventWaveHistory() {
  return [...eventWaveHistory];
}

/**
 * Clear event wave history
 */
export function clearEventWaveHistory() {
  eventWaveHistory = [];
}

/**
 * Get event wave banner data for UI display
 * @returns {object|null} Banner data or null
 */
export function getEventWaveBannerData() {
  if (!currentEventWave) return null;

  return {
    id: currentEventWave.id,
    name: currentEventWave.name,
    description: currentEventWave.description,
    color: currentEventWave.color,
    icon: currentEventWave.icon,
  };
}
