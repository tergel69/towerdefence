// ============================================================
//  mathUtils.js
//  Shared math helpers used across systems.
// ============================================================

/** Euclidean distance between two points */
export const dist = (ax, ay, bx, by) => Math.hypot(bx - ax, by - ay);

/** Clamp value between min and max */
export const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

/** Linear interpolation */
export const lerp = (a, b, t) => a + (b - a) * t;

/** Normalize an angle to [0, 2π] */
export const normalizeAngle = (angle) => ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);

/** Returns angle in radians from (ax,ay) pointing toward (bx,by) */
export const angleTo = (ax, ay, bx, by) => Math.atan2(by - ay, bx - ax);

/** Returns true if point (px,py) is within radius of (cx,cy) */
export const inCircle = (px, py, cx, cy, radius) => dist(px, py, cx, cy) <= radius;

/** Generate a random integer in [min, max] inclusive */
export const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
