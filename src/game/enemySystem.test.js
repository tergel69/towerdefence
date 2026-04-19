// ============================================================
//  enemySystem.test.js
//  Comprehensive tests for enemy creation, movement, damage, and abilities
// ============================================================

import {
  createEnemy,
  damageEnemy,
  updateEnemies,
  slowEnemy,
  poisonEnemy,
  getEnemiesInRadius,
} from './system/enemySystem';
import {
  ENEMY_DEFS,
  WAYPOINTS_PX,
  TILE_SIZE,
  setPathForGame,
  resetDefaultPathForGame,
} from './constants';

afterEach(() => {
  resetDefaultPathForGame();
});

describe('createEnemy', () => {
  test('creates enemy with correct basic properties', () => {
    const enemy = createEnemy('normal');

    expect(enemy).toHaveProperty('id');
    expect(enemy.type).toBe('normal');
    expect(enemy.x).toBe(WAYPOINTS_PX[0].x);
    expect(enemy.y).toBe(WAYPOINTS_PX[0].y);
    expect(enemy.dead).toBe(false);
    expect(enemy.reachedEnd).toBe(false);
    expect(enemy.waypointIdx).toBe(1);
  });

  test('enemy stats scale correctly', () => {
    const baseHp = ENEMY_DEFS.normal.hp;
    const baseSpeed = ENEMY_DEFS.normal.speed;

    const enemy1 = createEnemy('normal', 1.0, 1.0);
    expect(enemy1.hp).toBe(baseHp);
    expect(enemy1.speed).toBe(baseSpeed);

    const enemy2 = createEnemy('normal', 2.0, 1.5);
    expect(enemy2.hp).toBe(baseHp * 2);
    expect(enemy2.speed).toBe(baseSpeed * 1.5);
  });

  test('each enemy gets unique ID', () => {
    const enemy1 = createEnemy('normal');
    const enemy2 = createEnemy('fast');
    const enemy3 = createEnemy('tank');

    expect(enemy1.id).not.toBe(enemy2.id);
    expect(enemy2.id).not.toBe(enemy3.id);
  });

  test('creates different enemy types correctly', () => {
    const types = ['normal', 'fast', 'tank', 'healer', 'shielded', 'boss'];

    types.forEach((type) => {
      const enemy = createEnemy(type);
      expect(enemy.type).toBe(type);
      expect(ENEMY_DEFS[type]).toBeDefined();
    });
  });

  test('boss enemy has correct properties', () => {
    const boss = createEnemy('boss');

    expect(boss.isBoss).toBe(true);
    expect(boss.hp).toBeGreaterThan(ENEMY_DEFS.normal.hp);
    expect(boss.size).toBeGreaterThan(ENEMY_DEFS.normal.size);
  });

  test('fast enemy has motion trail', () => {
    const fastEnemy = createEnemy('fast');
    expect(fastEnemy.previousPositions).not.toBeNull();
  });

  test('enemy spawn follows the active runtime path', () => {
    const customPath = [
      [2, 2],
      [2, 5],
      [7, 5],
    ];

    expect(setPathForGame(customPath)).toBe(true);

    const enemy = createEnemy('normal');
    expect(enemy.x).toBe(WAYPOINTS_PX[0].x);
    expect(enemy.y).toBe(WAYPOINTS_PX[0].y);
    expect(WAYPOINTS_PX[0].x).toBe(2 * TILE_SIZE + TILE_SIZE / 2);
    expect(WAYPOINTS_PX[0].y).toBe(2 * TILE_SIZE + TILE_SIZE / 2);
  });
});

describe('damageEnemy', () => {
  test('damage reduces enemy HP', () => {
    const enemy = createEnemy('normal');
    const initialHp = enemy.hp;

    damageEnemy(enemy, 10);

    expect(enemy.hp).toBe(initialHp - 10);
  });

  test('enemy dies when HP reaches 0', () => {
    const enemy = createEnemy('normal');

    damageEnemy(enemy, enemy.hp);

    expect(enemy.dead).toBe(true);
    expect(enemy.hp).toBe(0);
  });

  test('damage does not affect phased enemy', () => {
    const enemy = createEnemy('normal');
    enemy.isPhased = true;
    enemy.ability = 'phase_shift';
    const initialHp = enemy.hp;

    damageEnemy(enemy, 100);

    expect(enemy.hp).toBe(initialHp);
    expect(enemy.dead).toBe(false);
  });

  test('shield absorbs damage', () => {
    const enemy = createEnemy('shielded');
    enemy.shieldMax = 50;
    enemy.shieldCurrent = 50;
    enemy.hp = 100;
    const initialHp = enemy.hp;

    damageEnemy(enemy, 30);

    expect(enemy.shieldCurrent).toBe(20);
    expect(enemy.hp).toBe(initialHp);
  });

  test('excess damage penetrates shield', () => {
    const enemy = createEnemy('shielded');
    enemy.shieldMax = 50;
    enemy.shieldCurrent = 50;
    enemy.hp = 100;

    damageEnemy(enemy, 80);

    expect(enemy.shieldCurrent).toBe(0);
    expect(enemy.hp).toBe(70);
  });

  test('armor reduces damage', () => {
    const enemy = createEnemy('normal');
    enemy.armor = 0.3;
    const initialHp = enemy.hp;

    damageEnemy(enemy, 100);

    expect(enemy.hp).toBe(initialHp - 70);
  });

  test('tracks last hit time for damage flash', () => {
    const enemy = createEnemy('normal');
    const beforeHit = Date.now();

    damageEnemy(enemy, 10);

    expect(enemy.lastHitTime).toBeGreaterThanOrEqual(beforeHit);
  });

  test('HP cannot go below 0', () => {
    const enemy = createEnemy('normal');

    damageEnemy(enemy, enemy.hp + 1000);

    expect(enemy.hp).toBe(0);
    expect(enemy.dead).toBe(true);
  });
});

describe('updateEnemies', () => {
  test('dead enemy is removed and reward given', () => {
    const enemy = createEnemy('normal');
    damageEnemy(enemy, enemy.hp);
    const enemies = [enemy];

    const result = updateEnemies(enemies, 0.016);

    expect(enemies).toHaveLength(0);
    expect(result.moneyEarned).toBe(ENEMY_DEFS.normal.reward);
    expect(result.enemiesKilled).toBe(1);
  });

  test('enemy reaching end causes health loss', () => {
    const enemy = createEnemy('normal');
    enemy.waypointIdx = WAYPOINTS_PX.length;
    enemy.reachedEnd = true;
    const enemies = [enemy];

    const result = updateEnemies(enemies, 0.016);

    expect(enemies).toHaveLength(0);
    expect(result.healthLost).toBe(ENEMY_DEFS.normal.damage);
  });

  test('enemy movement along path', () => {
    const enemy = createEnemy('normal');
    const startX = enemy.x;
    const startY = enemy.y;
    const enemies = [enemy];

    updateEnemies(enemies, 1.0);

    // Enemy should have moved from starting position
    const distanceMoved = Math.hypot(enemy.x - startX, enemy.y - startY);
    expect(distanceMoved).toBeGreaterThan(0);
  });

  test('boss kill tracked separately', () => {
    const boss = createEnemy('boss');
    damageEnemy(boss, boss.hp);
    const enemies = [boss];

    const result = updateEnemies(enemies, 0.016);

    expect(result.bossesKilled).toBe(1);
  });

  test('spawn on death creates child enemies', () => {
    const parent = createEnemy('normal');
    parent.spawnOnDeath = 3;
    parent.spawnType = 'fast';
    parent.spawnRadius = 24;
    damageEnemy(parent, parent.hp);
    const enemies = [parent];

    updateEnemies(enemies, 0.016);

    expect(enemies.length).toBe(3);
    expect(enemies[0].type).toBe('fast');
  });

  test('multiple enemies processed correctly', () => {
    const enemy1 = createEnemy('normal');
    const enemy2 = createEnemy('fast');
    damageEnemy(enemy1, enemy1.hp);
    const enemies = [enemy1, enemy2];

    const result = updateEnemies(enemies, 0.016);

    expect(enemies).toHaveLength(1);
    expect(result.enemiesKilled).toBe(1);
    expect(result.moneyEarned).toBe(ENEMY_DEFS.normal.reward);
  });
});

describe('slowEnemy', () => {
  test('slow reduces enemy speed', () => {
    const enemy = createEnemy('normal');
    const baseSpeed = enemy.speed;

    slowEnemy(enemy, 0.4, 2.0);

    expect(enemy.slowed).toBe(true);
    expect(enemy.speed).toBe(baseSpeed * 0.6);
  });

  test('Brute immune to slow', () => {
    const enemy = createEnemy('normal');
    enemy.immuneTo = ['slow'];
    const baseSpeed = enemy.speed;

    slowEnemy(enemy, 0.4, 2.0);

    expect(enemy.slowed).toBe(false);
    expect(enemy.speed).toBe(baseSpeed);
  });

  test('weaker slow does not override stronger', () => {
    const enemy = createEnemy('normal');

    slowEnemy(enemy, 0.5, 2.0);
    const speedAfterFirst = enemy.speed;

    slowEnemy(enemy, 0.3, 2.0);

    expect(enemy.speed).toBe(speedAfterFirst);
  });

  test('slow expires after duration', () => {
    const enemy = createEnemy('normal');
    const baseSpeed = enemy.speed;

    slowEnemy(enemy, 0.4, 1.0);
    expect(enemy.slowed).toBe(true);

    updateEnemies([enemy], 1.1);

    expect(enemy.slowed).toBe(false);
    expect(enemy.speed).toBe(baseSpeed);
  });
});

describe('poisonEnemy', () => {
  test('poison applies damage over time', () => {
    const enemy = createEnemy('normal');
    const initialHp = enemy.hp;

    poisonEnemy(enemy, 5, 3.0);

    expect(enemy.poisoned).toBe(true);
    expect(enemy.poisonDamage).toBe(5);
    expect(enemy.hp).toBe(initialHp);
  });

  test('Brute immune to poison', () => {
    const enemy = createEnemy('normal');
    enemy.immuneTo = ['poison'];

    poisonEnemy(enemy, 5, 3.0);

    expect(enemy.poisoned).toBe(false);
  });

  test('poison stacks up to max', () => {
    const enemy = createEnemy('normal');

    poisonEnemy(enemy, 5, 3.0, 3);
    poisonEnemy(enemy, 5, 3.0, 3);
    poisonEnemy(enemy, 5, 3.0, 3);
    poisonEnemy(enemy, 5, 3.0, 3);

    expect(enemy.poisonStacks).toBe(3);
  });

  test('poison damage applied on tick', () => {
    const enemy = createEnemy('normal');
    poisonEnemy(enemy, 10, 3.0);
    const initialHp = enemy.hp;

    updateEnemies([enemy], 1.0);

    expect(enemy.hp).toBeLessThan(initialHp);
  });
});

describe('getEnemiesInRadius', () => {
  test('returns enemies within radius', () => {
    const center = { x: 100, y: 100 };
    const enemy1 = createEnemy('normal');
    enemy1.x = center.x + 30;
    enemy1.y = center.y + 30;
    const enemy2 = createEnemy('fast');
    enemy2.x = center.x + 200;
    enemy2.y = center.y + 200;

    const inRadius = getEnemiesInRadius([enemy1, enemy2], center.x, center.y, 50);

    expect(inRadius).toHaveLength(1);
    expect(inRadius[0].id).toBe(enemy1.id);
  });

  test('excludes dead enemies', () => {
    const enemy1 = createEnemy('normal');
    enemy1.x = 100;
    enemy1.y = 100;
    enemy1.dead = true;

    const inRadius = getEnemiesInRadius([enemy1], 100, 100, 50);

    expect(inRadius).toHaveLength(0);
  });

  test('excludes enemies that reached end', () => {
    const enemy1 = createEnemy('normal');
    enemy1.x = 100;
    enemy1.y = 100;
    enemy1.reachedEnd = true;

    const inRadius = getEnemiesInRadius([enemy1], 100, 100, 50);

    expect(inRadius).toHaveLength(0);
  });

  test('returns all enemies in large radius', () => {
    const enemy1 = createEnemy('normal');
    enemy1.x = 50;
    enemy1.y = 50;
    const enemy2 = createEnemy('fast');
    enemy2.x = 150;
    enemy2.y = 150;

    const inRadius = getEnemiesInRadius([enemy1, enemy2], 100, 100, 100);

    expect(inRadius).toHaveLength(2);
  });
});
