import React, { useState, useEffect, useRef } from 'react';
import { loadProgression } from '../system/saveSystem';
import ChallengeCard from './ChallengeCard';
import LeaderboardPanel from './LeaderboardPanel';
import MetaUpgradePanel from './MetaUpgradePanel';
import DifficultySelector from './DifficultySelector';

/**
 * Animated Button Component
 * Features: hover scale, press feedback, ripple effect, breathing animation, glow effects
 */
function AnimatedButton({
  children,
  onClick,
  variant = 'primary',
  size = 'large',
  disabled = false,
  icon,
  style = {},
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState([]);
  const [breathPhase, setBreathPhase] = useState(0);
  const buttonRef = useRef(null);
  const breathRef = useRef(null);

  // Breathing animation loop for idle state
  useEffect(() => {
    if (!isHovered && !isPressed && !disabled) {
      breathRef.current = setInterval(() => {
        setBreathPhase((prev) => (prev + 1) % 100);
      }, 50);
    } else {
      if (breathRef.current) {
        clearInterval(breathRef.current);
        breathRef.current = null;
      }
    }
    return () => {
      if (breathRef.current) clearInterval(breathRef.current);
    };
  }, [isHovered, isPressed, disabled]);

  // Ripple effect on click
  const handleClick = (e) => {
    if (disabled) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rippleId = Date.now();

    setRipples((prev) => [...prev, { id: rippleId, x, y }]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 600);

    onClick?.(e);
  };

  // Variant styles
  const variantStyles = {
    primary: {
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
      hoverGradient: 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #059669 100%)',
      shadow: '0 8px 32px rgba(16, 185, 129, 0.35)',
      hoverShadow: '0 12px 40px rgba(16, 185, 129, 0.5)',
      color: '#fff',
    },
    campaign: {
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)',
      hoverGradient: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)',
      shadow: '0 8px 32px rgba(59, 130, 246, 0.35)',
      hoverShadow: '0 12px 40px rgba(59, 130, 246, 0.5)',
      color: '#fff',
    },
    endless: {
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)',
      hoverGradient: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 50%, #7c3aed 100%)',
      shadow: '0 8px 32px rgba(139, 92, 246, 0.35)',
      hoverShadow: '0 12px 40px rgba(139, 92, 246, 0.5)',
      color: '#fff',
    },
    continue: {
      gradient: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)',
      hoverGradient: 'linear-gradient(135deg, #93c5fd 0%, #60a5fa 50%, #3b82f6 100%)',
      shadow: '0 8px 32px rgba(96, 165, 250, 0.35)',
      hoverShadow: '0 12px 40px rgba(96, 165, 250, 0.5)',
      color: '#fff',
    },
    settings: {
      gradient: 'rgba(255, 255, 255, 0.08)',
      hoverGradient: 'rgba(255, 255, 255, 0.15)',
      shadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
      hoverShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
      border: 'rgba(255, 255, 255, 0.15)',
      hoverBorder: 'rgba(255, 255, 255, 0.25)',
      color: '#e2e8f0',
    },
    leaderboard: {
      gradient: 'rgba(251, 191, 36, 0.12)',
      hoverGradient: 'rgba(251, 191, 36, 0.25)',
      shadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
      hoverShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
      border: 'rgba(251, 191, 36, 0.3)',
      hoverBorder: 'rgba(251, 191, 36, 0.5)',
      color: '#fbbf24',
    },
  };

  const sizes = {
    large: { padding: '18px 28px', fontSize: 16 },
    medium: { padding: '14px 22px', fontSize: 14 },
    small: { padding: '12px 18px', fontSize: 13 },
  };

  const v = variantStyles[variant];
  const s = sizes[size];

  // Calculate breathing offset for idle animation
  const breathScale =
    isHovered || isPressed || disabled ? 1 : 1 + Math.sin(breathPhase * 0.0628) * 0.01;

  // Calculate transform and shadow based on state
  const getTransform = () => {
    if (disabled) return 'scale(1)';
    if (isPressed) return 'scale(0.96)';
    if (isHovered) return `scale(${1.03 * breathScale})`;
    return `scale(${breathScale})`;
  };

  const getShadow = () => {
    if (disabled) return v.shadow;
    if (isPressed) return v.shadow.replace('32px', '8px').replace('24px', '4px');
    if (isHovered) return v.hoverShadow;
    return v.shadow;
  };

  const getBackground = () => {
    if (disabled) return v.gradient;
    if (isHovered) return v.hoverGradient;
    return v.gradient;
  };

  const getBorder = () => {
    if (variant === 'settings' || variant === 'leaderboard') {
      if (disabled) return v.border;
      if (isHovered) return v.hoverBorder;
      return v.border;
    }
    return 'none';
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => {
        if (disabled) return;
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => !disabled && setIsPressed(false)}
      disabled={disabled}
      style={{
        ...s,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: icon ? 10 : 0,
        borderRadius: 14,
        border: getBorder(),
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: getBackground(),
        color: disabled ? `${v.color}60` : v.color,
        fontWeight: 700,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        fontFamily: "'Inter', -apple-system, sans-serif",
        boxShadow: getShadow(),
        transform: getTransform(),
        transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        outline: 'none',
        opacity: disabled ? 0.5 : 1,
        position: 'relative',
        overflow: 'hidden',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        ...style,
      }}
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          style={{
            position: 'absolute',
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.4)',
            transform: 'translate(-50%, -50%)',
            animation: 'rippleExpand 600ms ease-out forwards',
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Inject ripple keyframes */}
      <style>{`
        @keyframes rippleExpand {
          0% {
            width: 0;
            height: 0;
            opacity: 0.5;
          }
          100% {
            width: 300px;
            height: 300px;
            opacity: 0;
          }
        }
      `}</style>

      {icon && <span style={{ fontSize: size === 'large' ? 18 : 14 }}>{icon}</span>}
      {children}
    </button>
  );
}

/**
 * Animated Title Component
 * Features: entrance animation, gradient text
 */
function AnimatedTitle() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation after mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ textAlign: 'center', marginBottom: 48 }}>
      <h1
        style={{
          fontSize: 'clamp(40px, 10vw, 72px)',
          fontWeight: 800,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 35%, #fbbf24 70%, #f87171 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0,
          fontFamily: "'Orbitron', 'Rajdhani', sans-serif",
          transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
          opacity: isVisible ? 1 : 0,
          transition: 'all 800ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        Tower Defense
      </h1>
      <p
        style={{
          color: 'rgba(255,255,255,0.55)',
          fontSize: 'clamp(14px, 3vw, 18px)',
          marginTop: 16,
          fontWeight: 400,
          letterSpacing: '0.08em',
          transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
          opacity: isVisible ? 1 : 0,
          transition: 'all 600ms cubic-bezier(0.4, 0, 0.2, 1) 200ms',
        }}
      >
        Build. Upgrade. Survive.
      </p>
    </div>
  );
}

/**
 * Stats Card Component
 * Enhanced visual with animated entrance
 */
function StatsCard({ stats, totalStars }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        marginTop: 40,
        padding: '20px 28px',
        borderRadius: 20,
        background: 'rgba(20, 25, 35, 0.9)',
        border: '1px solid rgba(255,255,255,0.08)',
        textAlign: 'center',
        backdropFilter: 'blur(10px)',
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        opacity: isVisible ? 1 : 0,
        transition: 'all 500ms cubic-bezier(0.4, 0, 0.2, 1) 400ms',
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: 'rgba(255,255,255,0.45)',
          letterSpacing: '0.16em',
          marginBottom: 16,
          fontWeight: 600,
        }}
      >
        YOUR STATS
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 36, fontSize: 14 }}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              color: '#fbbf24',
              fontWeight: 700,
              fontSize: 26,
              fontFamily: "'Orbitron', sans-serif",
            }}
          >
            {stats.gamesPlayed}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 4 }}>GAMES</div>
        </div>
        <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }} />
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              color: '#60a5fa',
              fontWeight: 700,
              fontSize: 26,
              fontFamily: "'Orbitron', sans-serif",
            }}
          >
            {stats.totalWavesCompleted}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 4 }}>WAVES</div>
        </div>
        <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }} />
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              color: '#f87171',
              fontWeight: 700,
              fontSize: 26,
              fontFamily: "'Orbitron', sans-serif",
            }}
          >
            {stats.totalEnemiesKilled}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 4 }}>KILLS</div>
        </div>
      </div>
      {totalStars > 0 && (
        <div style={{ marginTop: 14, fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
          ★ {totalStars} Campaign Stars
        </div>
      )}
    </div>
  );
}

/**
 * Main Menu Component
 * Redesigned with improved layout, animations, and visual hierarchy
 */
export default function MainMenu({
  hasSaveGame,
  onStartNewGame,
  onStartEndless,
  onContinue,
  onOpenSettings,
  onEnterWorldSelect,
  onStartChallenge,
  stats,
  difficulty = 'normal',
  onDifficultyChange,
}) {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showMetaUpgrades, setShowMetaUpgrades] = useState(false);
  const [showDifficultySelector, setShowDifficultySelector] = useState(false);
  const progression = loadProgression();
  const totalStars = progression?.totalStars || 0;

  const handleMetaPurchase = (cost) => {
    setShowMetaUpgrades(false);
  };

  const handleDifficultySelect = (newDifficulty) => {
    onDifficultyChange?.(newDifficulty);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 0%, #1e293b 0%, #0a0e14 70%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 16px',
        zIndex: 100,
        overflow: 'auto',
      }}
    >
      {/* Animated Title */}
      <AnimatedTitle />

      {/* Two-column layout for buttons */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          maxWidth: 520,
          width: '100%',
          justifyContent: 'center',
        }}
      >
        {/* Primary Actions Column */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            flex: '1 1 220px',
            maxWidth: 280,
          }}
        >
          <AnimatedButton variant="primary" size="large" onClick={onStartNewGame} icon="🎮">
            New Game
          </AnimatedButton>

          {onStartEndless && (
            <AnimatedButton variant="endless" size="large" onClick={onStartEndless} icon="∞">
              Endless
            </AnimatedButton>
          )}

          {onEnterWorldSelect && (
            <AnimatedButton variant="campaign" size="large" onClick={onEnterWorldSelect} icon="🗺️">
              Campaign
            </AnimatedButton>
          )}

          {hasSaveGame && (
            <AnimatedButton variant="continue" size="large" onClick={onContinue} icon="▶️">
              Continue
            </AnimatedButton>
          )}
        </div>

        {/* Quick Access Column */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            flex: '1 1 180px',
            maxWidth: 220,
          }}
        >
          <AnimatedButton variant="settings" size="medium" onClick={onOpenSettings} icon="⚙️">
            Settings
          </AnimatedButton>

          <AnimatedButton
            variant="leaderboard"
            size="medium"
            onClick={() => setShowLeaderboard(true)}
            icon="🏆"
          >
            Leaderboard
          </AnimatedButton>

          <AnimatedButton
            variant="endless"
            size="medium"
            onClick={() => setShowMetaUpgrades(true)}
            icon="⭐"
          >
            Upgrades
          </AnimatedButton>

          <AnimatedButton
            variant="campaign"
            size="medium"
            onClick={() => setShowDifficultySelector(true)}
            icon="🎮"
          >
            Difficulty
          </AnimatedButton>
        </div>
      </div>

      {/* Daily Challenge */}
      {onStartChallenge && (
        <div style={{ marginTop: 28, width: '100%', maxWidth: 400 }}>
          <ChallengeCard onStartChallenge={onStartChallenge} />
        </div>
      )}

      {/* Leaderboard Modal */}
      {showLeaderboard && <LeaderboardPanel onClose={() => setShowLeaderboard(false)} />}

      {/* Meta Upgrade Panel */}
      {showMetaUpgrades && (
        <MetaUpgradePanel
          onClose={() => setShowMetaUpgrades(false)}
          currentGold={stats?.maxGold || 0}
          onPurchase={handleMetaPurchase}
        />
      )}

      {/* Difficulty Selector */}
      {showDifficultySelector && (
        <DifficultySelector
          onSelect={handleDifficultySelect}
          onClose={() => setShowDifficultySelector(false)}
          currentDifficulty={difficulty}
        />
      )}

      {/* Stats Card */}
      {stats && (stats.gamesPlayed > 0 || stats.totalWavesCompleted > 0) && (
        <StatsCard stats={stats} totalStars={totalStars} />
      )}

      {/* Version */}
      <div
        style={{ position: 'absolute', bottom: 16, color: 'rgba(255,255,255,0.2)', fontSize: 11 }}
      >
        v0.4 | Indie Release
      </div>
    </div>
  );
}
