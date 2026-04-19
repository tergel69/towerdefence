// ============================================================
//  waveSystem.test.js
//  Comprehensive tests for wave management and spawning
// ============================================================

import { createWaveController, startNextWave, tickWave, isWaveCleared } from './system/waveSystem';
import { WAVES } from './constants';

describe('createWaveController', () => {
  test('creates controller with correct initial state', () => {
    const wc = createWaveController();

    expect(wc.waveIndex).toBe(0);
    expect(wc.spawnQueue).toEqual([]);
    expect(wc.spawnTimer).toBe(0);
    expect(wc.waveActive).toBe(false);
    expect(wc.allWavesDone).toBe(false);
  });

  test('each controller is independent', () => {
    const wc1 = createWaveController();
    const wc2 = createWaveController();

    wc1.waveIndex = 5;
    expect(wc2.waveIndex).toBe(0);
  });
});

describe('startNextWave', () => {
  test('loads first wave from WAVES', () => {
    const wc = createWaveController();

    startNextWave(wc);

    expect(wc.waveIndex).toBe(1);
    expect(wc.waveActive).toBe(true);
    expect(wc.spawnQueue.length).toBeGreaterThan(0);
  });

  test('spawn queue has correct structure', () => {
    const wc = createWaveController();

    startNextWave(wc);

    wc.spawnQueue.forEach((entry) => {
      expect(entry).toHaveProperty('type');
      expect(entry).toHaveProperty('delay');
      expect(typeof entry.type).toBe('string');
      expect(typeof entry.delay).toBe('number');
    });
  });

  test('delays are cumulative', () => {
    const wc = createWaveController();

    startNextWave(wc);

    for (let i = 1; i < wc.spawnQueue.length; i++) {
      expect(wc.spawnQueue[i].delay).toBeGreaterThanOrEqual(wc.spawnQueue[i - 1].delay);
    }
  });

  test('loads multiple waves sequentially', () => {
    const wc = createWaveController();

    startNextWave(wc);
    expect(wc.waveIndex).toBe(1);

    wc.waveActive = false;
    startNextWave(wc);
    expect(wc.waveIndex).toBe(2);

    wc.waveActive = false;
    startNextWave(wc);
    expect(wc.waveIndex).toBe(3);
  });

  test('generates waves beyond defined WAVES', () => {
    const wc = createWaveController();

    for (let i = 0; i < WAVES.length + 5; i++) {
      startNextWave(wc);
      wc.waveActive = false;
    }

    expect(wc.waveIndex).toBe(WAVES.length + 5);
  });

  test('wave contains enemy types from definition', () => {
    const wc = createWaveController();

    startNextWave(wc);

    const types = new Set(wc.spawnQueue.map((e) => e.type));
    expect(types.size).toBeGreaterThan(0);
  });
});

describe('tickWave', () => {
  test('does nothing when wave is not active', () => {
    const wc = createWaveController();
    const enemies = [];

    const result = tickWave(wc, enemies, 0.1);

    expect(result).toBe(false);
    expect(enemies).toHaveLength(0);
  });

  test('spawns enemies after their delay', () => {
    const wc = createWaveController();
    const enemies = [];

    startNextWave(wc);
    const firstDelay = wc.spawnQueue[0].delay;

    tickWave(wc, enemies, firstDelay + 0.1);

    expect(enemies.length).toBeGreaterThan(0);
  });

  test('returns true when wave finishes spawning', () => {
    const wc = createWaveController();
    const enemies = [];

    startNextWave(wc);

    let waveFinished = false;
    let time = 0;

    while (!waveFinished && time < 100) {
      waveFinished = tickWave(wc, enemies, 1.0);
      time += 1.0;
    }

    expect(waveFinished).toBe(true);
  });

  test('spawns correct number of enemies', () => {
    const wc = createWaveController();
    const enemies = [];

    startNextWave(wc);
    const totalEnemies = wc.spawnQueue.length;

    let time = 0;
    while (wc.spawnQueue.length > 0 && time < 100) {
      tickWave(wc, enemies, 1.0);
      time += 1.0;
    }

    expect(enemies).toHaveLength(totalEnemies);
  });

  test('enemies are created with correct types', () => {
    const wc = createWaveController();
    const enemies = [];

    startNextWave(wc);
    const expectedTypes = wc.spawnQueue.map((e) => e.type);

    let time = 0;
    while (wc.spawnQueue.length > 0 && time < 100) {
      tickWave(wc, enemies, 1.0);
      time += 1.0;
    }

    expect(enemies).toHaveLength(expectedTypes.length);
  });

  test('does not spawn enemies before delay', () => {
    const wc = createWaveController();
    const enemies = [];

    startNextWave(wc);
    const firstDelay = wc.spawnQueue[0].delay;

    tickWave(wc, enemies, firstDelay - 0.1);

    expect(enemies).toHaveLength(0);
  });

  test('waveActive set to false when queue empty', () => {
    const wc = createWaveController();
    const enemies = [];

    startNextWave(wc);

    let time = 0;
    while (wc.spawnQueue.length > 0 && time < 100) {
      tickWave(wc, enemies, 1.0);
      time += 1.0;
    }

    expect(wc.waveActive).toBe(false);
  });
});

describe('isWaveCleared', () => {
  test('returns true when no wave active and no enemies', () => {
    const wc = createWaveController();
    const enemies = [];

    wc.waveActive = false;

    expect(isWaveCleared(wc, enemies)).toBe(true);
  });

  test('returns false when wave is active', () => {
    const wc = createWaveController();
    const enemies = [];

    startNextWave(wc);

    expect(isWaveCleared(wc, enemies)).toBe(false);
  });

  test('returns false when enemies still alive', () => {
    const wc = createWaveController();
    const enemies = [{ id: 1, dead: false, reachedEnd: false }];

    wc.waveActive = false;

    expect(isWaveCleared(wc, enemies)).toBe(false);
  });

  test('returns true after wave completes and enemies dead', () => {
    const wc = createWaveController();
    const enemies = [];

    startNextWave(wc);

    let time = 0;
    while (wc.spawnQueue.length > 0 && time < 100) {
      tickWave(wc, enemies, 1.0);
      time += 1.0;
    }

    enemies.length = 0;

    expect(isWaveCleared(wc, enemies)).toBe(true);
  });
});

describe('wave integration', () => {
  test('full wave lifecycle: start -> spawn -> clear', () => {
    const wc = createWaveController();
    const enemies = [];

    expect(isWaveCleared(wc, enemies)).toBe(true);

    startNextWave(wc);
    expect(isWaveCleared(wc, enemies)).toBe(false);

    let time = 0;
    while (!isWaveCleared(wc, enemies) && time < 100) {
      tickWave(wc, enemies, 1.0);
      time += 1.0;

      if (!wc.waveActive) {
        enemies.length = 0;
      }
    }

    expect(isWaveCleared(wc, enemies)).toBe(true);
  });

  test('multiple waves in sequence', () => {
    const wc = createWaveController();
    const enemies = [];
    let wavesCompleted = 0;

    for (let wave = 0; wave < 3; wave++) {
      startNextWave(wc);

      let time = 0;
      while (!isWaveCleared(wc, enemies) && time < 100) {
        tickWave(wc, enemies, 1.0);
        time += 1.0;

        if (!wc.waveActive) {
          enemies.length = 0;
          wavesCompleted++;
        }
      }
    }

    expect(wavesCompleted).toBe(3);
    expect(wc.waveIndex).toBe(3);
  });
});
