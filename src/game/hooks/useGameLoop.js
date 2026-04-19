// ============================================================
//  useGameLoop.js
//  Custom hook that drives the requestAnimationFrame loop.
//  Accepts an `onTick(dt)` callback called every frame.
//  Pausing is handled by simply not scheduling the next frame.
// ============================================================

import { useEffect, useRef, useCallback } from 'react';

/**
 * @param {(dt: number) => void} onTick  - called each frame with delta-time in seconds
 * @param {boolean}              running - when false the loop is suspended
 */
export function useGameLoop(onTick, running) {
  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);
  const onTickRef = useRef(onTick);

  // Keep the callback ref fresh without restarting the loop
  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  const loop = useCallback((timestamp) => {
    if (lastTimeRef.current === null) {
      lastTimeRef.current = timestamp;
    }

    // Cap dt at 100ms to prevent spiral-of-death on tab switch / freeze
    const rawDt = (timestamp - lastTimeRef.current) / 1000;
    const dt = Math.min(rawDt, 0.1);
    lastTimeRef.current = timestamp;

    onTickRef.current(dt);

    rafRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    if (!running) {
      // Pause: cancel the loop and reset last-time so resume is smooth
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = null;
      return;
    }

    // Start / resume
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [running, loop]);
}
