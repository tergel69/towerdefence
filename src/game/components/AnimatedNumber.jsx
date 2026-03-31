import React, { useState, useEffect, useRef } from 'react';

/**
 * AnimatedNumber - Displays a number with a counting animation effect
 */
export default function AnimatedNumber({ value, color = "#fff", animate = true, duration = 300 }) {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValue = useRef(value);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  const startValueRef = useRef(0);

  useEffect(() => {
    if (!animate || value === previousValue.current) {
      setDisplayValue(value);
      previousValue.current = value;
      return;
    }

    startValueRef.current = previousValue.current;
    startTimeRef.current = Date.now();

    const animateCount = () => {
      const now = Date.now();
      const startTime = startTimeRef.current;
      if (startTime === null) return;
      
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      const current = Math.round(startValueRef.current + (value - startValueRef.current) * easeOutQuart);
      setDisplayValue(current);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateCount);
      } else {
        previousValue.current = value;
      }
    };

    animationRef.current = requestAnimationFrame(animateCount);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, animate, duration]);

  return (
    <div style={{ 
      color, 
      fontSize: 20, 
      fontWeight: 700,
      transition: 'transform 0.15s ease-out',
      transform: displayValue !== value ? 'scale(1.05)' : 'scale(1)'
    }}>
      {displayValue}
    </div>
  );
}