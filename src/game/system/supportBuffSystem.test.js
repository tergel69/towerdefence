import {
  applySupportBuffsToTower,
  createSupportBuffState,
  updateSupportBuffs,
} from './supportBuffSystem';

describe('support buff system', () => {
  test('applies nearby support buffs multiplicatively to a tower', () => {
    const supportBuffState = createSupportBuffState();
    const towers = [
      { id: 1, type: 'speedBoost', x: 100, y: 100 },
      { id: 2, type: 'damageAmp', x: 120, y: 100 },
      { id: 3, type: 'basic', x: 110, y: 110 },
    ];

    updateSupportBuffs(supportBuffState, towers, 0.016);

    const modifiers = applySupportBuffsToTower(supportBuffState, towers[2]);

    expect(modifiers.fireRateMultiplier).toBeGreaterThan(1);
    expect(modifiers.damageMultiplier).toBeGreaterThan(1);
    expect(modifiers.rangeMultiplier).toBe(1);
  });

  test('does not buff a support tower from its own aura', () => {
    const supportBuffState = createSupportBuffState();
    const towers = [{ id: 1, type: 'speedBoost', x: 100, y: 100 }];

    updateSupportBuffs(supportBuffState, towers, 0.016);

    const modifiers = applySupportBuffsToTower(supportBuffState, towers[0]);

    expect(modifiers).toEqual({
      fireRateMultiplier: 1,
      damageMultiplier: 1,
      rangeMultiplier: 1,
    });
  });
});
