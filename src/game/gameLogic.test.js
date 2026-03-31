import { buildPathTileSet, PATH_TILE_SET, WAYPOINTS_GRID } from './constants';
import { createTower, getUpgradeCost, getSellValue, upgradeTower } from './system/towerSystem';
import { createEnemy, damageEnemy, updateEnemies } from './system/enemySystem';
import { createProjectile, updateProjectiles } from './system/projectileSystem';

test('path tiles include every waypoint segment', () => {
  const rebuilt = buildPathTileSet(WAYPOINTS_GRID);
  expect(rebuilt.size).toBe(PATH_TILE_SET.size);
  expect(rebuilt.has('0,2')).toBe(true);
  expect(rebuilt.has('19,12')).toBe(true);
});

test('tower upgrade and sell values stay consistent', () => {
  const tower = createTower('basic', 2, 3);
  expect(getUpgradeCost(tower)).toBe(100);
  expect(upgradeTower(tower)).toBe(true);
  expect(getUpgradeCost(tower)).toBe(150);
  expect(getSellValue(tower)).toBeGreaterThan(0);
});

test('enemy death is removed and rewarded on update', () => {
  const enemy = createEnemy('normal');
  damageEnemy(enemy, enemy.hp);
  const enemies = [enemy];
  const result = updateEnemies(enemies, 0.016);

  expect(enemies).toHaveLength(0);
  expect(result.moneyEarned).toBeGreaterThan(0);
});

test('projectiles damage their target on impact', () => {
  const enemy = createEnemy('normal');
  const tower = createTower('basic', 0, 0);
  const stats = { damage: 12, bulletSpeed: 500, splash: false, splashRadius: 0 };
  const projectile = createProjectile(tower, enemy, stats);
  projectile.x = enemy.x;
  projectile.y = enemy.y;

  const projectiles = [projectile];
  const enemies = [enemy];

  updateProjectiles(projectiles, enemies, 0.016);

  expect(projectiles).toHaveLength(0);
  expect(enemies[0].hp).toBeLessThan(enemies[0].maxHp);
});
