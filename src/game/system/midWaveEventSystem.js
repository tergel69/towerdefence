// ============================================================
//  midWaveEventSystem.js
//  Random events that trigger during waves for extra chaos.
// ============================================================

/**
 * Mid-wave event definitions.
 * Each event has:
 *  - id, name, icon: identification and display
 *  - minWave: minimum wave number to trigger
 *  - chance: probability per wave (0-1)
 *  - trigger: function called when event starts
 *  - update: function called each frame during event
 *  - duration: how long the event lasts (seconds), 0 = instant
 */
export const MID_WAVE_EVENTS = [
  {
    id: 'boss_ambush',
    name: 'Boss Ambush!',
    icon: '👑',
    minWave: 5,
    chance: 0.08,
    duration: 0, // instant
    trigger: (state, createEnemy) => {
      // Spawn an extra boss mid-wave
      const boss = createEnemy('boss', 1.5, 1.2);
      boss.id = Date.now();
      boss.spawnTime = performance.now() / 1000;
      state.enemies.push(boss);
    },
  },
  {
    id: 'speed_surge',
    name: 'Speed Surge!',
    icon: '⚡',
    minWave: 3,
    chance: 0.1,
    duration: 5,
    trigger: (state) => {
      state.enemies.forEach((e) => {
        e.speedMultiplier = (e.speedMultiplier || 1) * 1.5;
        e.speed *= 1.5;
      });
    },
    update: (state, dt) => {
      // No per-frame update needed, duration handles expiry
    },
  },
  {
    id: 'gold_rain',
    name: 'Gold Rain!',
    icon: '💰',
    minWave: 2,
    chance: 0.12,
    duration: 0, // instant
    trigger: (state) => {
      const bonus = 25 + state.wave * 10;
      state.money += bonus;
      state.score += bonus;
    },
  },
  {
    id: 'tower_malfunction',
    name: 'Tower Malfunction!',
    icon: '🔧',
    minWave: 4,
    chance: 0.06,
    duration: 3,
    trigger: (state) => {
      // Disable one random tower temporarily
      if (state.towers.length > 0) {
        const idx = Math.floor(Math.random() * state.towers.length);
        state.towers[idx]._disabled = true;
        state.towers[idx]._disableEnd = performance.now() / 1000 + 3;
      }
    },
  },
  {
    id: 'reinforcements',
    name: 'Reinforcements!',
    icon: '🛡️',
    minWave: 6,
    chance: 0.05,
    duration: 10,
    trigger: (state) => {
      // Spawn 3 temporary basic towers
      const positions = [
        { c: 2, r: 2 },
        { c: 10, r: 6 },
        { c: 16, r: 10 },
      ];
      positions.forEach((pos, i) => {
        const tower = {
          id: Date.now() + i,
          type: 'basic',
          col: pos.c,
          row: pos.r,
          x: pos.c * 48 + 24,
          y: pos.r * 48 + 24,
          level: 0,
          cooldown: 0,
          barrelAngle: 0,
          muzzleFlash: 0,
          target: null,
          _temporary: true,
          _removeTime: performance.now() / 1000 + 10,
        };
        state.towers.push(tower);
      });
    },
  },
  {
    id: 'frozen_time',
    name: 'Frozen Time!',
    icon: '❄️',
    minWave: 5,
    chance: 0.07,
    duration: 4,
    trigger: (state) => {
      // Freeze all enemies temporarily
      state.enemies.forEach((e) => {
        e._frozenUntil = performance.now() / 1000 + 4;
      });
    },
  },
];

/**
 * Active mid-wave event state.
 */
export function createActiveEvent(eventDef) {
  return {
    ...eventDef,
    startTime: performance.now() / 1000,
    endTime: eventDef.duration > 0 ? performance.now() / 1000 + eventDef.duration : 0,
    active: true,
  };
}

/**
 * Check if a mid-wave event should trigger.
 * Called when a wave starts.
 * @param {number} waveNumber
 * @param {number} difficultyMultiplier - scales chance
 * @returns {object|null} - event def or null
 */
export function checkMidWaveEvent(waveNumber, difficultyMultiplier = 1) {
  for (const event of MID_WAVE_EVENTS) {
    if (waveNumber < event.minWave) continue;
    const adjustedChance = event.chance * difficultyMultiplier;
    if (Math.random() < adjustedChance) {
      return event;
    }
  }
  return null;
}

/**
 * Update active mid-wave events.
 * @param {object} state - game state
 * @param {number} dt - delta time
 * @param {Array} activeEvents - array of active events
 * @returns {Array} - updated active events (removes expired)
 */
export function updateActiveEvents(state, dt, activeEvents) {
  const now = performance.now() / 1000;

  for (let i = activeEvents.length - 1; i >= 0; i--) {
    const event = activeEvents[i];

    if (event.duration > 0 && now >= event.endTime) {
      // Event expired - clean up
      event.active = false;

      // Clean up temporary towers
      if (event.id === 'reinforcements') {
        state.towers = state.towers.filter((t) => !t._temporary);
      }

      // Re-enable disabled towers
      if (event.id === 'tower_malfunction') {
        state.towers.forEach((t) => {
          if (t._disabled) {
            t._disabled = false;
            delete t._disableEnd;
          }
        });
      }

      // Restore enemy speed after speed surge
      if (event.id === 'speed_surge') {
        state.enemies.forEach((e) => {
          if (e.speedMultiplier) {
            e.speed = e.baseSpeed || e.speed / e.speedMultiplier;
            delete e.speedMultiplier;
          }
        });
      }

      activeEvents.splice(i, 1);
      continue;
    }

    // Run per-frame update
    if (event.update) {
      event.update(state, dt);
    }
  }

  return activeEvents;
}

/**
 * Apply mid-wave event effects to enemy update.
 * Called in the enemy update loop.
 */
export function applyMidWaveEventEffects(activeEvents, enemy, dt) {
  for (const event of activeEvents) {
    // Speed surge
    if (event.id === 'speed_surge' && event.active) {
      // Speed already applied in trigger, just let it run
    }
    // Tower malfunction - enemies move faster while towers disabled
    if (event.id === 'tower_malfunction' && event.active) {
      // No direct enemy effect
    }
    // Frozen time
    if (event.id === 'frozen_time' && event.active) {
      // Enemies are frozen via _frozenUntil flag
    }
  }
}
