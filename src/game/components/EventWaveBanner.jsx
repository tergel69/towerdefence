import React, { useState, useEffect } from 'react';

/**
 * Event Wave Banner Component
 * Displays at the top of the game screen during event waves
 */
export default function EventWaveBanner({ eventWave, style = {} }) {
  const [isVisible, setIsVisible] = useState(false);
  const [slideIn, setSlideIn] = useState(false);

  useEffect(() => {
    if (eventWave) {
      setIsVisible(true);
      setTimeout(() => setSlideIn(true), 50);
    } else {
      setSlideIn(false);
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [eventWave]);

  if (!isVisible || !eventWave) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '12px 20px',
        background: `linear-gradient(135deg, ${eventWave.color}30, ${eventWave.color}10)`,
        borderBottom: `2px solid ${eventWave.color}60`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        transform: slideIn ? 'translateY(0)' : 'translateY(-100%)',
        opacity: slideIn ? 1 : 0,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 50,
        ...style,
      }}
    >
      {/* Event Icon */}
      <span style={{ fontSize: '28px' }}>{eventWave.icon}</span>

      {/* Event Info */}
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: eventWave.color,
            fontFamily: "'Courier New', monospace",
            textShadow: `0 0 10px ${eventWave.color}80`,
          }}
        >
          {eventWave.name}
        </div>
        <div
          style={{
            fontSize: '12px',
            color: '#94a3b8',
            fontFamily: "'Courier New', monospace",
            marginTop: '4px',
          }}
        >
          {eventWave.description}
        </div>
      </div>

      {/* Decorative Elements */}
      <div
        style={{
          position: 'absolute',
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          gap: '8px',
        }}
      >
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: eventWave.color,
              opacity: 0.6,
              animation: `pulse 1.5s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: 'absolute',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          gap: '8px',
        }}
      >
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: eventWave.color,
              opacity: 0.6,
              animation: `pulse 1.5s ease-in-out ${i * 0.2 + 0.6}s infinite`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }
      `}</style>
    </div>
  );
}
