// ============================================================
//  comboSystem.js
//  Tracks rapid kills and builds combo chains.
//  Provides combo multipliers for gold/score bonuses.
// ============================================================

/**
 * Combo milestones — thresholds that trigger special messages.
 */
export const COMBO_MILESTONES = [
  { kills: 3, label: 'Triple Kill!', multiplier: 1.2, color: '#4ade80' },
  { kills: 5, label: 'Penta Kill!', multiplier: 1.5, color: '#60a5fa' },
  { kills: 10, label: 'KILLING SPREE!', multiplier: 2.0, color: '#a78bfa' },
  { kills: 15, label: 'RAMPAGE!', multiplier: 2.5, color: '#f472b6' },
  { kills: 25, label: 'MASSACRE!', multiplier: 3.0, color: '#ef4444' },
  { kills: 40, label: 'UNSTOPPABLE!', multiplier: 4.0, color: '#fbbf24' },
  { kills: 60, label: 'GODLIKE!', multiplier: 5.0, color: '#f59e0b' },
];

/**
 * Create a fresh combo tracker.
 */
export function createComboTracker() {
  return {
    kills: 0,
    chainKills: 0,
    chainWindow: 2.0, // seconds to maintain chain
    chainTimer: 0,
    currentMultiplier: 1.0,
    currentMilestone: null,
    lastMilestone: null,
    recentMilestone: null,
    recentMilestoneTimer: 0,
    recentMilestoneDuration: 3.0, // how long milestone message shows
    // Kill feed entries (most recent first)
    killFeed: [],
    maxFeedEntries: 8,
  };
}

/**
 * Register a kill and update combo state.
 * @param {object} combo
 * @param {object} enemy - the enemy that was killed
 * @param {number} baseGold - base gold reward for this kill
 * @param {number} now - current timestamp in seconds
 * @returns {{ goldBonus: number, milestone: object|null, feedEntry: object|null }}
 */
export function registerKill(combo, enemy, baseGold, now) {
  combo.kills++;
  combo.chainKills++;
  combo.chainTimer = combo.chainWindow;

  // Check for milestone
  let milestone = null;
  for (const ms of COMBO_MILESTONES) {
    if (
      combo.chainKills >= ms.kills &&
      (!combo.lastMilestone || ms.kills > combo.lastMilestone.kills)
    ) {
      milestone = ms;
    }
  }

  if (milestone && milestone !== combo.lastMilestone) {
    combo.lastMilestone = milestone;
    combo.currentMilestone = milestone;
    combo.currentMultiplier = milestone.multiplier;
    combo.recentMilestone = milestone;
    combo.recentMilestoneTimer = combo.recentMilestoneDuration;
  }

  // Decay milestone display
  if (combo.recentMilestone) {
    combo.recentMilestoneTimer -= 0; // Updated in updateCombo
  }

  // Calculate gold bonus
  const goldBonus = Math.floor(baseGold * (combo.currentMultiplier - 1));

  // Create kill feed entry
  const feedEntry = {
    id: Date.now() + Math.random(),
    enemyType: enemy.label || enemy.type || 'Enemy',
    isBoss: enemy.isBoss || false,
    gold: baseGold + goldBonus,
    comboCount: combo.chainKills,
    multiplier: combo.currentMultiplier,
    timestamp: now,
    age: 0,
  };

  // Add to feed
  combo.killFeed.unshift(feedEntry);
  if (combo.killFeed.length > combo.maxFeedEntries) {
    combo.killFeed.pop();
  }

  return {
    goldBonus,
    milestone,
    feedEntry,
  };
}

/**
 * Update combo state each frame.
 * @param {object} combo
 * @param {number} dt - Delta time in seconds
 */
export function updateCombo(combo, dt) {
  // Decay chain timer
  if (combo.chainTimer > 0) {
    combo.chainTimer -= dt;
    if (combo.chainTimer <= 0) {
      // Chain broken — reset
      combo.chainKills = 0;
      combo.currentMultiplier = 1.0;
      combo.currentMilestone = null;
    }
  }

  // Decay milestone display
  if (combo.recentMilestone) {
    combo.recentMilestoneTimer -= dt;
    if (combo.recentMilestoneTimer <= 0) {
      combo.recentMilestone = null;
    }
  }

  // Age kill feed entries
  for (let i = combo.killFeed.length - 1; i >= 0; i--) {
    combo.killFeed[i].age += dt;
    if (combo.killFeed[i].age > 5) {
      combo.killFeed.splice(i, 1);
    }
  }
}

/**
 * Get the current combo display info for UI rendering.
 */
export function getComboDisplay(combo) {
  return {
    active: combo.chainKills > 1,
    count: combo.chainKills,
    multiplier: combo.currentMultiplier,
    milestone: combo.recentMilestone,
    timer: combo.chainTimer / combo.chainWindow, // 0-1 progress bar
  };
}
