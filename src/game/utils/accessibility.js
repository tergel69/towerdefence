// ============================================================
//  accessibility.js
//  Colorblind mode, high contrast, and text size utilities
// ============================================================

// Colorblind-friendly color mappings
// Protanopia/Deuteranopia (red-green confusion)
const COLORBLIND_SAFE_COLORS = {
  // Original -> Colorblind safe
  '#ef4444': '#1e88e5', // Red -> Blue
  '#a855f7': '#ff9800', // Purple -> Orange
  '#22c55e': '#fdd835', // Green -> Yellow
  '#78716c': '#8d6e63', // Brown -> Light Brown
  '#60a5fa': '#e91e63', // Blue -> Pink
};

// High contrast mode enhancements
const HIGH_CONTRAST_COLORS = {
  // Increase contrast for better visibility
  healthBarBg: 'rgba(0, 0, 0, 0.85)',
  healthBarBorder: 'rgba(255, 255, 255, 0.4)',
  towerRange: 'rgba(255, 255, 255, 0.15)',
  gridLine: 'rgba(0, 0, 0, 0.2)',
};

/**
 * Get colorblind-safe color for a given color
 * @param {string} color - Original color hex
 * @param {boolean} colorblindMode - Is colorblind mode enabled?
 * @returns {string} Safe color hex
 */
export function getColorblindSafeColor(color, colorblindMode = false) {
  if (!colorblindMode) return color;
  return COLORBLIND_SAFE_COLORS[color] || color;
}

/**
 * Get high contrast color overrides
 * @param {boolean} highContrast - Is high contrast enabled?
 * @returns {object} Color overrides or empty
 */
export function getHighContrastColors(highContrast = false) {
  if (!highContrast) return {};
  return HIGH_CONTRAST_COLORS;
}

/**
 * Get text size multiplier based on setting
 * @param {string} textSize - 'small' | 'medium' | 'large'
 * @returns {number} Multiplier
 */
export function getTextSizeMultiplier(textSize = 'medium') {
  switch (textSize) {
    case 'small':
      return 0.85;
    case 'large':
      return 1.25;
    case 'medium':
    default:
      return 1.0;
  }
}

/**
 * Check if animations should be reduced
 * @param {boolean} reducedMotion - Is reduced motion enabled?
 * @returns {object} Animation settings
 */
export function getAnimationSettings(reducedMotion = false) {
  if (reducedMotion) {
    return {
      particleCount: 0.3, // 30% of normal particles
      animationDuration: 0.5, // 50% duration
      disableShake: true,
      disableBob: true,
      disablePulse: false, // Keep subtle pulses
    };
  }
  return {
    particleCount: 1.0,
    animationDuration: 1.0,
    disableShake: false,
    disableBob: false,
    disablePulse: false,
  };
}

/**
 * Apply accessibility settings to canvas context
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} settings - Accessibility settings object
 */
export function applyAccessibilitySettings(ctx, settings = {}) {
  const { highContrast = false } = settings;

  // Apply high contrast overrides
  if (highContrast) {
    ctx.globalAlpha = Math.max(ctx.globalAlpha, 0.9);
  }

  // Note: Color mapping is done at the source level via getColorblindSafeColor
  // Text size is applied at the React component level
  // This function is for context-level adjustments only
}
