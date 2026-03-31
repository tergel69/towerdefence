import { TOWER_DEFS } from '../constants';

export function getTowerSynergyModifiers(tower, towers = []) {
  const towerType = tower?.type || tower?.defId;
  if (!towerType) return {};

  const nearby = towers.filter((other) => other.id !== tower.id && distance(tower, other) <= 96);
  const nearbyTypes = nearby.map((other) => other.type || other.defId);

  const modifiers = {};

  const iceCount = nearbyTypes.filter((type) => type === 'frost_bolt' || type === 'blizzard').length;
  if (iceCount >= 2) {
    modifiers.frozenChance = 0.25;
  }

  if (towerType === 'sniper' && nearbyTypes.includes('basic')) {
    modifiers.damageMultiplier = 1.2;
  }

  if (towerType === 'basic' && nearbyTypes.some((type) => TOWER_DEFS[type]?.support)) {
    modifiers.fireRateMultiplier = 1.1;
  }

  return modifiers;
}

function distance(a, b) {
  return Math.hypot((a?.x || 0) - (b?.x || 0), (a?.y || 0) - (b?.y || 0));
}
