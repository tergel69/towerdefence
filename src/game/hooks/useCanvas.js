// ============================================================
//  useCanvas.js
//  Utility hook — returns a canvasRef and its 2D context.
//  Handles HiDPI (retina) scaling automatically.
// ============================================================

import { useRef, useEffect, useCallback } from 'react';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants';

/**
 * @returns {{ canvasRef, getCtx }}
 *   canvasRef — attach to <canvas ref={canvasRef} />
 *   getCtx    — returns the scaled 2D context (or null before mount)
 */
export function useCanvas() {
  const canvasRef = useRef(null);
  const ctxRef    = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;

    // Physical pixel size
    canvas.width  = CANVAS_WIDTH  * dpr;
    canvas.height = CANVAS_HEIGHT * dpr;

    // CSS display size stays the same
    canvas.style.width  = `${CANVAS_WIDTH}px`;
    canvas.style.height = `${CANVAS_HEIGHT}px`;

    if (process.env.NODE_ENV === 'test') return;

    let ctx;
    try {
      ctx = canvas.getContext('2d');
    } catch {
      return;
    }
    if (!ctx) return;
    ctx.scale(dpr, dpr); // scale once — all draw calls use logical pixels
    ctxRef.current = ctx;
  }, []);

  const getCtx = useCallback(() => ctxRef.current, []);

  return { canvasRef, getCtx };
}
