// ============================================================
//  waveSystem.js
//  Manages the wave queue, spawn timing, and difficulty scaling.
//  Pure logic — no React, no canvas.
// ============================================================

import { WAVES, generateWave } from '../constants';
import { createEnemy }          from './enemySystem';

/**
 * Creates the initial wave controller state object.
 * Store this inside your stateRef.
 */
export function createWaveController() {
  return {
    waveIndex:      0,         // which wave we're on (0-based)
    spawnQueue:     [],        // pending { type, delay } entries
    spawnTimer:     0,         // counts DOWN; spawn when <= 0
    waveActive:     false,     // is a wave currently spawning?
    allWavesDone:   false,
  };
}

/**
 * Loads the next wave into the spawn queue.
 * Call this when the player presses "Start Wave" or auto-advance.
 *
 * @param {object} wc - waveController (mutated in place)
 */
export function startNextWave(wc) {
  const waveDef = wc.waveIndex < WAVES.length
    ? WAVES[wc.waveIndex]
    : generateWave(wc.waveIndex + 1);

  // Flatten into a timed queue: each entry is { type, timeUntilSpawn }
  let cumulativeDelay = 0;
  wc.spawnQueue = [];

  for (const group of waveDef) {
    for (let i = 0; i < group.count; i++) {
      wc.spawnQueue.push({
        type:  group.type,
        delay: cumulativeDelay,
      });
      cumulativeDelay += group.interval;
    }
  }

  wc.spawnTimer   = 0;
  wc.waveActive   = true;
  wc.waveIndex++;
}

/**
 * Ticks the wave controller each frame.
 * Pops enemies from the spawn queue and pushes them into `enemies`.
 *
 * @param {object}   wc       - waveController (mutated)
 * @param {object[]} enemies  - enemy array (mutated)
 * @param {number}   dt
 * @returns {boolean} true if the wave just finished spawning
 */
export function tickWave(wc, enemies, dt) {
  if (!wc.waveActive || wc.spawnQueue.length === 0) return false;

  wc.spawnTimer += dt;

  // Spawn all enemies whose delay has been reached
  while (
    wc.spawnQueue.length > 0 &&
    wc.spawnTimer >= wc.spawnQueue[0].delay
  ) {
    const entry = wc.spawnQueue.shift();
    enemies.push(createEnemy(entry.type));
  }

  if (wc.spawnQueue.length === 0) {
    wc.waveActive = false;
    return true; // wave finished spawning
  }

  return false;
}

/**
 * True when there are no enemies left alive AND no spawns pending.
 * Used to auto-start the next wave or show "wave cleared" message.
 */
export function isWaveCleared(wc, enemies) {
  return !wc.waveActive && enemies.length === 0;
}
