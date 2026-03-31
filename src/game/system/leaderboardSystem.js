// ============================================================
//  leaderboardSystem.js
//  Local leaderboard storage and management
// ============================================================

const LEADERBOARD_KEY = 'towerDefense_leaderboards';

// Leaderboard types
export const LEADERBOARD_TYPES = {
  ENDLESS: 'endless',
  SPEED_RUN: 'speed_run',
  STARS: 'stars'
};

// Default empty leaderboards
function getDefaultLeaderboards() {
  return {
    [LEADERBOARD_TYPES.ENDLESS]: [],
    [LEADERBOARD_TYPES.SPEED_RUN]: [],
    [LEADERBOARD_TYPES.STARS]: []
  };
}

// Load leaderboards from storage
export function loadLeaderboards() {
  try {
    const stored = localStorage.getItem(LEADERBOARD_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to load leaderboards:', e);
  }
  return getDefaultLeaderboards();
}

// Save leaderboards to storage
function saveLeaderboards(leaderboards) {
  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboards));
  } catch (e) {
    console.warn('Failed to save leaderboards:', e);
  }
}

// Add a score to a leaderboard
export function addScore(type, entry) {
  const leaderboards = loadLeaderboards();
  const board = leaderboards[type] || [];
  
  // Add new entry with timestamp
  const newEntry = {
    ...entry,
    timestamp: Date.now(),
    id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };
  
  // Add to board and sort by score (descending)
  board.push(newEntry);
  board.sort((a, b) => b.score - a.score);
  
  // Keep only top 10
  board.splice(10);
  
  leaderboards[type] = board;
  saveLeaderboards(leaderboards);
  
  // Return rank
  const rank = board.findIndex(e => e.id === newEntry.id) + 1;
  return { entry: newEntry, rank };
}

// Get leaderboard for a type
export function getLeaderboard(type) {
  const leaderboards = loadLeaderboards();
  return leaderboards[type] || [];
}

// Get player's rank for a specific score
export function getPlayerRank(type, score) {
  const leaderboard = getLeaderboard(type);
  
  for (let i = 0; i < leaderboard.length; i++) {
    if (leaderboard[i].score < score) {
      return i + 1;
    }
  }
  
  return leaderboard.length + 1;
}

// Check if score qualifies for leaderboard
export function qualifiesForLeaderboard(type, score) {
  const leaderboard = getLeaderboard(type);
  
  // Always qualify if less than 10 entries
  if (leaderboard.length < 10) return true;
  
  // Qualify if score is higher than lowest score
  const lowestScore = leaderboard[leaderboard.length - 1]?.score || 0;
  return score > lowestScore;
}

// Get endless mode high score
export function getEndlessHighScore() {
  const leaderboard = getLeaderboard(LEADERBOARD_TYPES.ENDLESS);
  if (leaderboard.length === 0) return 0;
  return leaderboard[0].wave;
}

// Update endless mode score
export function updateEndlessScore(playerName, wave, score) {
  return addScore(LEADERBOARD_TYPES.ENDLESS, {
    playerName: playerName || 'Player',
    wave,
    score
  });
}

// Clear leaderboard
export function clearLeaderboard(type) {
  const leaderboards = loadLeaderboards();
  leaderboards[type] = [];
  saveLeaderboards(leaderboards);
}

// Clear all leaderboards
export function clearAllLeaderboards() {
  localStorage.removeItem(LEADERBOARD_KEY);
}

// Format timestamp for display
export function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  // Less than 1 hour
  if (diff < 3600000) {
    const mins = Math.floor(diff / 60000);
    return `${mins}m ago`;
  }
  
  // Less than 1 day
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours}h ago`;
  }
  
  // Format as date
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
}