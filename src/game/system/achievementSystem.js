import {
  checkAndUnlockAchievements,
  getAchievementList,
  getAchievements,
  claimAchievementReward,
} from './saveSystem';

export function evaluateAchievements(stats, currentGold) {
  const before = getAchievements();
  const result = checkAndUnlockAchievements(stats, currentGold);
  const after = result.achievements || getAchievements();
  const unlocked = Object.values(after).filter(
    (achievement) => achievement.unlocked && !before[achievement.id]?.unlocked
  );

  return {
    ...result,
    unlockedAchievements: unlocked,
  };
}

export function listAchievements() {
  return getAchievementList();
}

export function getUnlockedAchievements() {
  return Object.values(getAchievements()).filter((achievement) => achievement.unlocked);
}

export { claimAchievementReward };
