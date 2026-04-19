// ============================================================
//  towerSystem.test.js
//  Comprehensive tests for tower creation, upgrade, targeting, and selling
// ============================================================

import {
  createTower,
  getTowerStats,
  getUpgradeCost,
  upgradeTower,
  getSellValue,
  updateTowers,
} from './system/towerSystem';
import { TOWER_DEFS, TILE_SIZE } from './constants';

describe('createTower', () => {
  test('creates tower with correct basic properties', () => {
    const tower = createTower('basic', 5, 7);

    expect(tower).toHaveProperty('id');
    expect(tower.type).toBe('basic');
    expect(tower.defId).toBe('basic');
    expect(tower.col).toBe(5);
    expect(tower.row).toBe(7);
    expect(tower.level).toBe(0);
    expect(tower.cooldown).toBe(0);
    expect(tower.target).toBeNull();
    expect(tower.barrelAngle).toBe(-Math.PI / 2);
  });

  test('positions tower at center of tile', () => {
    const col = 5;
    const row = 7;
    const tower = createTower('basic', col, row);

    expect(tower.x).toBe(col * TILE_SIZE + TILE_SIZE / 2);
    expect(tower.y).toBe(row * TILE_SIZE + TILE_SIZE / 2);
  });

  test('each tower gets unique ID', () => {
    const tower1 = createTower('basic', 0, 0);
    const tower2 = createTower('splash', 1, 1);
    const tower3 = createTower('ice', 2, 2);

    expect(tower1.id).not.toBe(tower2.id);
    expect(tower2.id).not.toBe(tower3.id);
    expect(tower1.id).not.toBe(tower3.id);
  });

  test('creates different tower types correctly', () => {
    const types = ['basic', 'splash', 'ice', 'sniper', 'poison'];

    types.forEach((type) => {
      const tower = createTower(type, 0, 0);
      expect(tower.type).toBe(type);
      expect(TOWER_DEFS[type]).toBeDefined();
    });
  });
});

describe('getTowerStats', () => {
  test('returns correct stats for level 0 tower', () => {
    const tower = createTower('basic', 0, 0);
    const stats = getTowerStats(tower);
    const def = TOWER_DEFS.basic;

    expect(stats.damage).toBe(def.levels[0].damage);
    expect(stats.range).toBe(def.levels[0].range);
    expect(stats.fireRate).toBe(def.levels[0].fireRate);
  });

  test('returns correct stats for upgraded tower', () => {
    const tower = createTower('basic', 0, 0);
    upgradeTower(tower);
    const stats = getTowerStats(tower);
    const def = TOWER_DEFS.basic;

    expect(tower.level).toBe(1);
    expect(stats.damage).toBe(def.levels[1].damage);
    expect(stats.range).toBe(def.levels[1].range);
  });

  test('returns stats for max level tower', () => {
    const tower = createTower('basic', 0, 0);
    const maxLevel = TOWER_DEFS.basic.levels.length - 1;

    for (let i = 0; i < maxLevel; i++) {
      upgradeTower(tower);
    }

    const stats = getTowerStats(tower);
    expect(tower.level).toBe(maxLevel);
    expect(stats.damage).toBe(TOWER_DEFS.basic.levels[maxLevel].damage);
  });
});

describe('getUpgradeCost', () => {
  test('returns correct cost for level 0 tower', () => {
    const tower = createTower('basic', 0, 0);
    expect(getUpgradeCost(tower)).toBe(100);
  });

  test('returns null for max level tower', () => {
    const tower = createTower('basic', 0, 0);
    const maxLevel = TOWER_DEFS.basic.levels.length - 1;

    for (let i = 0; i < maxLevel; i++) {
      upgradeTower(tower);
    }

    expect(getUpgradeCost(tower)).toBeNull();
  });

  test('returns increasing costs for successive levels', () => {
    const tower = createTower('basic', 0, 0);
    const costs = [];

    let cost = getUpgradeCost(tower);
    while (cost !== null) {
      costs.push(cost);
      upgradeTower(tower);
      cost = getUpgradeCost(tower);
    }

    expect(costs).toEqual([100, 150, 200]);
  });
});

describe('upgradeTower', () => {
  test('successfully upgrades tower', () => {
    const tower = createTower('basic', 0, 0);
    const result = upgradeTower(tower);

    expect(result).toBe(true);
    expect(tower.level).toBe(1);
  });

  test('fails to upgrade max level tower', () => {
    const tower = createTower('basic', 0, 0);
    const maxLevel = TOWER_DEFS.basic.levels.length - 1;

    for (let i = 0; i < maxLevel; i++) {
      upgradeTower(tower);
    }

    const result = upgradeTower(tower);
    expect(result).toBe(false);
    expect(tower.level).toBe(maxLevel);
  });

  test('upgraded tower has improved stats', () => {
    const tower = createTower('basic', 0, 0);
    const statsBefore = getTowerStats(tower);

    upgradeTower(tower);
    const statsAfter = getTowerStats(tower);

    expect(statsAfter.damage).toBeGreaterThan(statsBefore.damage);
    expect(statsAfter.range).toBeGreaterThanOrEqual(statsBefore.range);
  });
});

describe('getSellValue', () => {
  test('sell value is positive for base tower', () => {
    const tower = createTower('basic', 0, 0);
    const value = getSellValue(tower);

    expect(value).toBeGreaterThan(0);
    expect(value).toBe(Math.floor(TOWER_DEFS.basic.cost * 0.6));
  });

  test('sell value increases with upgrades', () => {
    const tower = createTower('basic', 0, 0);
    const baseValue = getSellValue(tower);

    upgradeTower(tower);
    const upgradedValue = getSellValue(tower);

    expect(upgradedValue).toBeGreaterThan(baseValue);
  });

  test('sell value uses custom refund percentage', () => {
    const tower = createTower('basic', 0, 0);
    const value50 = getSellValue(tower, 0.5);
    const value80 = getSellValue(tower, 0.8);

    expect(value80).toBeGreaterThan(value50);
  });
});

describe('updateTowers', () => {
  test('tower targets enemy within range', () => {
    const tower = createTower('basic', 5, 5);
    const enemy = {
      id: 1,
      x: tower.x + 50,
      y: tower.y + 50,
      waypointIdx: 5,
      dead: false,
      reachedEnd: false,
    };
    const projectiles = [];

    updateTowers([tower], [enemy], projectiles, 0.1);

    expect(tower.target).toBe(enemy.id);
  });

  test('tower does not target enemy out of range', () => {
    const tower = createTower('basic', 0, 0);
    const enemy = {
      id: 1,
      x: 5000,
      y: 5000,
      waypointIdx: 5,
      dead: false,
      reachedEnd: false,
    };
    const projectiles = [];

    updateTowers([tower], [enemy], projectiles, 0.1);

    expect(tower.target).toBeNull();
  });

  test('tower fires projectile when cooldown is ready', () => {
    const tower = createTower('basic', 5, 5);
    const enemy = {
      id: 1,
      x: tower.x + 50,
      y: tower.y + 50,
      waypointIdx: 5,
      dead: false,
      reachedEnd: false,
    };
    const projectiles = [];

    tower.cooldown = 0;
    updateTowers([tower], [enemy], projectiles, 0.1);

    expect(projectiles.length).toBeGreaterThan(0);
    expect(tower.cooldown).toBeGreaterThan(0);
  });

  test('tower respects cooldown', () => {
    const tower = createTower('basic', 5, 5);
    const enemy = {
      id: 1,
      x: tower.x + 50,
      y: tower.y + 50,
      waypointIdx: 5,
      dead: false,
      reachedEnd: false,
    };
    const projectiles = [];

    tower.cooldown = 10;
    updateTowers([tower], [enemy], projectiles, 0.1);

    expect(projectiles.length).toBe(0);
  });

  test('tower barrel angle rotates toward target', () => {
    const tower = createTower('basic', 5, 5);
    const enemy = {
      id: 1,
      x: tower.x + 100,
      y: tower.y,
      waypointIdx: 5,
      dead: false,
      reachedEnd: false,
    };
    const projectiles = [];

    const initialAngle = tower.barrelAngle;
    updateTowers([tower], [enemy], projectiles, 0.1);

    expect(tower.barrelAngle).not.toBe(initialAngle);
    expect(tower.barrelAngle).toBeCloseTo(0, 1);
  });

  test('ignores dead enemies', () => {
    const tower = createTower('basic', 5, 5);
    const deadEnemy = {
      id: 1,
      x: tower.x + 50,
      y: tower.y + 50,
      waypointIdx: 5,
      dead: true,
      reachedEnd: false,
    };
    const projectiles = [];

    updateTowers([tower], [deadEnemy], projectiles, 0.1);

    expect(tower.target).toBeNull();
  });

  test('ignores enemies that reached end', () => {
    const tower = createTower('basic', 5, 5);
    const escapedEnemy = {
      id: 1,
      x: tower.x + 50,
      y: tower.y + 50,
      waypointIdx: 5,
      dead: false,
      reachedEnd: true,
    };
    const projectiles = [];

    updateTowers([tower], [escapedEnemy], projectiles, 0.1);

    expect(tower.target).toBeNull();
  });

  test('prioritizes enemy furthest along path', () => {
    const tower = createTower('basic', 5, 5);
    const enemy1 = {
      id: 1,
      x: tower.x + 50,
      y: tower.y + 50,
      waypointIdx: 3,
      dead: false,
      reachedEnd: false,
    };
    const enemy2 = {
      id: 2,
      x: tower.x - 50,
      y: tower.y - 50,
      waypointIdx: 7,
      dead: false,
      reachedEnd: false,
    };
    const projectiles = [];

    updateTowers([tower], [enemy1, enemy2], projectiles, 0.1);

    expect(tower.target).toBe(enemy2.id);
  });

  test('cooldown decreases over time', () => {
    const tower = createTower('basic', 5, 5);
    const enemy = {
      id: 1,
      x: tower.x + 50,
      y: tower.y + 50,
      waypointIdx: 5,
      dead: false,
      reachedEnd: false,
    };
    const projectiles = [];

    updateTowers([tower], [enemy], projectiles, 0.1);
    const cooldownAfter = tower.cooldown;

    updateTowers([tower], [enemy], projectiles, 0.1);

    expect(tower.cooldown).toBeLessThan(cooldownAfter);
  });
});
