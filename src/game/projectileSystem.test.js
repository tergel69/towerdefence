// ============================================================
//  projectileSystem.test.js
//  Comprehensive tests for projectile creation, movement, and collision
// ============================================================

import {
  createProjectile,
  updateProjectiles,
  getProjectilePoolStats,
} from './system/projectileSystem';
import { createTower } from './system/towerSystem';
import { createEnemy } from './system/enemySystem';

describe('createProjectile', () => {
  test('creates projectile with correct properties', () => {
    const tower = createTower('basic', 5, 5);
    const enemy = createEnemy('normal');
    enemy.x = tower.x + 100;
    enemy.y = tower.y;

    const stats = { damage: 20, bulletSpeed: 300, splash: 0, splashRadius: 0 };
    const projectile = createProjectile(tower, enemy, stats);

    expect(projectile).toHaveProperty('id');
    expect(projectile.x).toBe(tower.x);
    expect(projectile.y).toBe(tower.y);
    expect(projectile.targetId).toBe(enemy.id);
    expect(projectile.damage).toBe(20);
    expect(projectile.speed).toBe(300);
    expect(projectile.hit).toBe(false);
  });

  test('projectile origin is tower center', () => {
    const tower = createTower('basic', 3, 4);
    const enemy = createEnemy('normal');

    const stats = { damage: 10, bulletSpeed: 200, splash: 0, splashRadius: 0 };
    const projectile = createProjectile(tower, enemy, stats);

    expect(projectile.x).toBe(tower.x);
    expect(projectile.y).toBe(tower.y);
  });

  test('projectile stores tower type for effects', () => {
    const tower = createTower('ice', 5, 5);
    const enemy = createEnemy('normal');

    const stats = { damage: 10, bulletSpeed: 200, splash: 0, splashRadius: 0 };
    const projectile = createProjectile(tower, enemy, stats);

    expect(projectile.towerType).toBe('ice');
  });

  test('splash projectile has radius', () => {
    const tower = createTower('splash', 5, 5);
    const enemy = createEnemy('normal');

    const stats = { damage: 15, bulletSpeed: 200, splash: true, splashRadius: 60 };
    const projectile = createProjectile(tower, enemy, stats);

    expect(projectile.splash).toBe(true);
    expect(projectile.splashRadius).toBe(60);
  });

  test('projectile has special effects when applicable', () => {
    const tower = createTower('ice', 5, 5);
    const enemy = createEnemy('normal');

    const stats = {
      damage: 10,
      bulletSpeed: 200,
      splash: 0,
      splashRadius: 0,
      slowAmount: 0.4,
      slowDuration: 2.0,
      poisonDamage: 5,
      poisonDuration: 3.0,
    };
    const projectile = createProjectile(tower, enemy, stats);

    expect(projectile.slowAmount).toBe(0.4);
    expect(projectile.slowDuration).toBe(2.0);
    expect(projectile.poisonDamage).toBe(5);
    expect(projectile.poisonDuration).toBe(3.0);
  });

  test('each projectile gets unique ID', () => {
    const tower = createTower('basic', 0, 0);
    const enemy1 = createEnemy('normal');
    const enemy2 = createEnemy('fast');

    const stats = { damage: 10, bulletSpeed: 200, splash: 0, splashRadius: 0 };
    const p1 = createProjectile(tower, enemy1, stats);
    const p2 = createProjectile(tower, enemy2, stats);

    expect(p1.id).not.toBe(p2.id);
  });
});

describe('updateProjectiles', () => {
  test('projectile moves toward target', () => {
    const tower = createTower('basic', 0, 0);
    const enemy = createEnemy('normal');
    enemy.x = 200;
    enemy.y = 0;

    const stats = { damage: 10, bulletSpeed: 100, splash: 0, splashRadius: 0 };
    const projectile = createProjectile(tower, enemy, stats);
    const projectiles = [projectile];
    const enemies = [enemy];

    updateProjectiles(projectiles, enemies, 0.5);

    expect(projectile.x).toBeGreaterThan(0);
  });

  test('projectile hits target and is removed', () => {
    const tower = createTower('basic', 0, 0);
    const enemy = createEnemy('normal');
    enemy.x = 10;
    enemy.y = 0;

    const stats = { damage: 15, bulletSpeed: 500, splash: 0, splashRadius: 0 };
    const projectile = createProjectile(tower, enemy, stats);
    projectile.x = enemy.x;
    projectile.y = enemy.y;

    const projectiles = [projectile];
    const enemies = [enemy];

    updateProjectiles(projectiles, enemies, 0.016);

    expect(projectiles).toHaveLength(0);
  });

  test('projectile damages target enemy', () => {
    const tower = createTower('basic', 0, 0);
    const enemy = createEnemy('normal');
    const initialHp = enemy.hp;

    const stats = { damage: 25, bulletSpeed: 500, splash: 0, splashRadius: 0 };
    const projectile = createProjectile(tower, enemy, stats);
    projectile.x = enemy.x;
    projectile.y = enemy.y;

    const projectiles = [projectile];
    const enemies = [enemy];

    updateProjectiles(projectiles, enemies, 0.016);

    expect(enemy.hp).toBe(initialHp - 25);
  });

  test('splash projectile damages all enemies in radius', () => {
    const tower = createTower('splash', 5, 5);
    const enemy1 = createEnemy('normal');
    enemy1.x = 100;
    enemy1.y = 100;
    const enemy2 = createEnemy('fast');
    enemy2.x = 110;
    enemy2.y = 110;

    const stats = { damage: 20, bulletSpeed: 200, splash: true, splashRadius: 50 };
    const projectile = createProjectile(tower, enemy1, stats);
    projectile.x = 100;
    projectile.y = 100;

    const projectiles = [projectile];
    const enemies = [enemy1, enemy2];

    updateProjectiles(projectiles, enemies, 0.016);

    expect(projectiles).toHaveLength(0);
  });

  test('projectile applies slow effect', () => {
    const tower = createTower('ice', 5, 5);
    const enemy = createEnemy('normal');

    const stats = {
      damage: 10,
      bulletSpeed: 500,
      splash: 0,
      splashRadius: 0,
      slowAmount: 0.5,
      slowDuration: 2.0,
    };
    const projectile = createProjectile(tower, enemy, stats);
    projectile.x = enemy.x;
    projectile.y = enemy.y;

    const projectiles = [projectile];
    const enemies = [enemy];

    updateProjectiles(projectiles, enemies, 0.016);

    expect(enemy.slowed).toBe(true);
  });

  test('projectile applies poison effect', () => {
    const tower = createTower('poison', 5, 5);
    const enemy = createEnemy('normal');

    const stats = {
      damage: 5,
      bulletSpeed: 500,
      splash: 0,
      splashRadius: 0,
      poisonDamage: 8,
      poisonDuration: 3.0,
    };
    const projectile = createProjectile(tower, enemy, stats);
    projectile.x = enemy.x;
    projectile.y = enemy.y;

    const projectiles = [projectile];
    const enemies = [enemy];

    updateProjectiles(projectiles, enemies, 0.016);

    expect(enemy.poisoned).toBe(true);
    expect(enemy.poisonDamage).toBe(8);
  });

  test('projectile tracks damage dealt', () => {
    const tower = createTower('basic', 0, 0);
    const enemy = createEnemy('normal');

    const stats = { damage: 30, bulletSpeed: 500, splash: 0, splashRadius: 0 };
    const projectile = createProjectile(tower, enemy, stats);
    projectile.x = enemy.x;
    projectile.y = enemy.y;

    const projectiles = [projectile];
    const enemies = [enemy];

    const result = updateProjectiles(projectiles, enemies, 0.016);

    expect(result.damageDealt).toBe(30);
  });

  test('projectile homing follows moving target', () => {
    const tower = createTower('basic', 0, 0);
    const enemy = createEnemy('normal');
    enemy.x = 100;
    enemy.y = 100;

    const stats = { damage: 10, bulletSpeed: 200, splash: 0, splashRadius: 0 };
    const projectile = createProjectile(tower, enemy, stats);
    projectile.x = 10;
    projectile.y = 10;

    const projectiles = [projectile];
    const enemies = [enemy];

    updateProjectiles(projectiles, enemies, 0.1);

    expect(projectile.tx).toBe(enemy.x);
    expect(projectile.ty).toBe(enemy.y);
  });

  test('dead target does not affect projectile', () => {
    const tower = createTower('basic', 0, 0);
    const enemy = createEnemy('normal');
    enemy.x = 500;
    enemy.y = 500;
    enemy.dead = true;

    const stats = { damage: 10, bulletSpeed: 100, splash: 0, splashRadius: 0 };
    const projectile = createProjectile(tower, enemy, stats);
    const initialTx = projectile.tx;
    const initialTy = projectile.ty;

    const projectiles = [projectile];
    const enemies = [enemy];

    updateProjectiles(projectiles, enemies, 0.1);

    expect(projectile.tx).toBe(initialTx);
    expect(projectile.ty).toBe(initialTy);
  });

  test('object pool reduces allocations', () => {
    const stats = { damage: 10, bulletSpeed: 500, splash: 0, splashRadius: 0 };

    for (let i = 0; i < 100; i++) {
      const tower = createTower('basic', 0, 0);
      const enemy = createEnemy('normal');
      enemy.x = 10;
      enemy.y = 10;
      const projectile = createProjectile(tower, enemy, stats);
      projectile.x = enemy.x;
      projectile.y = enemy.y;
      updateProjectiles([projectile], [enemy], 0.016);
    }

    const poolStats = getProjectilePoolStats();
    expect(poolStats.pooled).toBeGreaterThan(0);
  });
});
