// ============================================================
//  challengeSystem.js
//  Daily challenge rotation and validation system
// ============================================================

// Challenge definitions
export const CHALLENGE_TYPES = {
  SPEED_RUN: {
    id: 'speed_run',
    name: 'Speed Run',
    description: 'Kill all enemies in under 60 seconds',
    difficulty: 'easy',
    reward: 100,
    validate: (gameState, startTime) => {
      const elapsed = (Date.now() - startTime) / 1000;
      const allDead = gameState.enemies.every(e => e.dead || e.reachedEnd);
      return elapsed < 60 && allDead;
    }
  },
  TIGHT_BUDGET: {
    id: 'tight_budget',
    name: 'Tight Budget',
    description: 'Complete wave with under 200 gold spent',
    difficulty: 'medium',
    reward: 150,
    validate: (gameState, startMoney, spentAmount) => {
      return spentAmount <= 200;
    }
  },
  NO_LIVES_LOST: {
    id: 'no_lives_lost',
    name: 'No Lives Lost',
    description: 'Complete 3 waves without taking damage',
    difficulty: 'hard',
    reward: 250,
    validate: (gameState, wavesWithoutDamage) => {
      return wavesWithoutDamage >= 3;
    }
  },
  SINGLE_TOWER: {
    id: 'single_tower',
    name: 'Single Tower',
    description: 'Win using only one tower type',
    difficulty: 'expert',
    reward: 400,
    validate: (gameState, towerTypes) => {
      const uniqueTypes = new Set(towerTypes);
      return uniqueTypes.size === 1;
    }
  },
  ELEMENTAL_ONLY: {
    id: 'elemental_only',
    name: 'Elemental Only',
    description: 'Use only towers from one element',
    difficulty: 'expert',
    reward: 400,
    validate: (gameState, towerElements) => {
      const uniqueElements = new Set(towerElements.filter(e => e));
      return uniqueElements.size === 1;
    }
  }
};

// Challenge rotation - challenges change daily at midnight
const CHALLENGE_ORDER = [
  'speed_run',
  'tight_budget',
  'no_lives_lost',
  'single_tower',
  'elemental_only'
];

// Get today's challenge based on date
export function getDailyChallenge() {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const challengeIndex = dayOfYear % CHALLENGE_ORDER.length;
  const challengeId = CHALLENGE_ORDER[challengeIndex];
  
  return Object.values(CHALLENGE_TYPES).find(c => c.id === challengeId);
}

// Get next challenge info
export function getNextChallengeInfo() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const now = new Date();
  const msUntilMidnight = tomorrow - now;
  const hoursUntilMidnight = Math.floor(msUntilMidnight / (1000 * 60 * 60));
  const minutesUntilMidnight = Math.floor((msUntilMidnight % (1000 * 60 * 60)) / (1000 * 60));
  
  const tomorrowChallenge = getDailyChallengeAt(tomorrow);
  
  return {
    nextChallenge: tomorrowChallenge,
    resetsIn: `${hoursUntilMidnight}h ${minutesUntilMidnight}m`
  };
}

function getDailyChallengeAt(date) {
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const challengeIndex = dayOfYear % CHALLENGE_ORDER.length;
  const challengeId = CHALLENGE_ORDER[challengeIndex];
  
  return Object.values(CHALLENGE_TYPES).find(c => c.id === challengeId);
}

// Challenge state management
const CHALLENGE_STORAGE_KEY = 'towerDefense_dailyChallenge';

export function getChallengeState() {
  try {
    const stored = localStorage.getItem(CHALLENGE_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to load challenge state:', e);
  }
  
  return {
    date: null,
    completed: false,
    attempts: 0,
    streak: 0
  };
}

export function saveChallengeState(state) {
  try {
    localStorage.setItem(CHALLENGE_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save challenge state:', e);
  }
}

export function checkAndClaimChallengeReward(challengeId) {
  const state = getChallengeState();
  const today = new Date().toDateString();
  
  // Check if already completed today
  if (state.date === today && state.completed) {
    return { claimed: false, reason: 'already_completed' };
  }
  
  // Check if this is the correct challenge for today
  const dailyChallenge = getDailyChallenge();
  if (dailyChallenge.id !== challengeId) {
    return { claimed: false, reason: 'wrong_challenge' };
  }
  
  // Mark as completed
  state.date = today;
  state.completed = true;
  state.streak += 1;
  saveChallengeState(state);
  
  return { 
    claimed: true, 
    reward: dailyChallenge.reward,
    streak: state.streak
  };
}

export function recordChallengeAttempt() {
  const state = getChallengeState();
  const today = new Date().toDateString();
  
  if (state.date !== today) {
    // New day, reset
    state.attempts = 1;
    state.completed = false;
  } else {
    state.attempts += 1;
    // Reset streak on failure
    if (state.attempts >= 3) {
      state.streak = 0;
    }
  }
  
  saveChallengeState(state);
}

// Validate challenge completion
export function validateChallenge(challengeId, validationData) {
  const challenge = Object.values(CHALLENGE_TYPES).find(c => c.id === challengeId);
  if (!challenge) return false;
  
  switch (challengeId) {
    case 'speed_run':
      return challenge.validate(validationData.gameState, validationData.startTime);
    case 'tight_budget':
      return challenge.validate(validationData.gameState, validationData.startMoney, validationData.spentAmount);
    case 'no_lives_lost':
      return challenge.validate(validationData.gameState, validationData.wavesWithoutDamage);
    case 'single_tower':
      return challenge.validate(validationData.gameState, validationData.towerTypes);
    case 'elemental_only':
      return challenge.validate(validationData.gameState, validationData.towerElements);
    default:
      return false;
  }
}

// Get difficulty color
export function getDifficultyColor(difficulty) {
  switch (difficulty) {
    case 'easy': return '#4ade80';
    case 'medium': return '#fbbf24';
    case 'hard': return '#f97316';
    case 'expert': return '#ef4444';
    default: return '#94a3b8';
  }
}