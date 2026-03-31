import React, { useState } from 'react';

/**
 * Tutorial Overlay Component
 * Shows contextual hints for first-time players
 * Includes contextual tips based on game state
 */
export default function TutorialOverlay({ 
  isOpen, 
  onComplete,
  currentStep: externalStep = undefined,
  gameState = null
}) {
  const [internalStep, setInternalStep] = useState(0);
  const step = externalStep !== undefined ? externalStep : internalStep;

  // Base tutorial steps
  const baseSteps = [
    {
      title: 'Welcome, Commander!',
      content: 'Your mission: defend the base from waves of enemies. Let\'s get you started.',
      position: 'center',
    },
    {
      title: 'Select a Tower',
      content: 'Click any tower in the panel on the right. Each has unique strengths!',
      position: 'right',
    },
    {
      title: 'Place Your Tower',
      content: 'Click on any grass tile to build. Watch your gold - towers cost money!',
      position: 'canvas',
    },
    {
      title: 'Upgrade Towers',
      content: 'Click any placed tower to see upgrade options. Upgrades make towers stronger!',
      position: 'canvas',
    },
    {
      title: 'Start the Wave',
      content: 'Ready? Click "Send Wave" to summon enemies. Defeat them all for gold!',
      position: 'bottom',
    },
    {
      title: 'Survive!',
      content: 'Build wisely, upgrade smartly, and don\'t let enemies reach the exit. Good luck!',
      position: 'center',
    },
  ];

  // Contextual tips based on game state
  const getContextualTip = () => {
    if (!gameState) return null;
    
    const { wave, money, towers, lives } = gameState;
    
    // Low money tip
    if (money < 100 && (!towers || towers.length === 0)) {
      return {
        title: '💰 Tight on Gold?',
        content: 'Start with a basic tower - it\'s cheap and effective against early enemies.',
        position: 'bottom'
      };
    }
    
    // Low lives warning
    if (lives <= 3) {
      return {
        title: '⚠️ Base Under Attack!',
        content: 'Your lives are running low. Focus on upgrading existing towers or place more defenders!',
        position: 'bottom'
      };
    }
    
    // Wave 5+ tip - introduce synergies
    if (wave >= 5 && wave < 10) {
      return {
        title: '🔗 Tower Synergies',
        content: 'Place different tower types near each other to activate bonus effects!',
        position: 'right'
      };
    }
    
    // Wave 10+ boss warning
    if (wave % 6 === 0 && wave > 0) {
      return {
        title: '👹 Boss Wave!',
        content: 'Bosses are tougher! Make sure your towers are upgraded and consider using splash damage towers.',
        position: 'center'
      };
    }
    
    // No towers placed
    if (wave > 0 && (!towers || towers.length === 0)) {
      return {
        title: '🎯 No Towers?',
        content: 'You need towers to defend! Place at least one before starting the next wave.',
        position: 'bottom'
      };
    }
    
    return null;
  };

  // Combine base steps with contextual tip
  const getSteps = () => {
    const tip = getContextualTip();
    if (tip) {
      return [...baseSteps, tip];
    }
    return baseSteps;
  };

  const steps = getSteps();

  if (!isOpen) return null;

  const currentStepData = steps[Math.min(step, steps.length - 1)];

  const handleNext = () => {
    if (step < steps.length - 1) {
      if (externalStep === undefined) {
        setInternalStep(step + 1);
      }
    } else {
      onComplete();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleNext();
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #1a1f2e 0%, #0d1117 100%)',
          borderRadius: 16,
          padding: 32,
          maxWidth: 400,
          textAlign: 'center',
          border: '1px solid rgba(96,165,250,0.3)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Step indicator */}
        <div style={{ marginBottom: 16 }}>
          {steps.map((_, i) => (
            <span
              key={i}
              style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                margin: '0 4px',
                background: i === step ? '#60a5fa' : 'rgba(255,255,255,0.2)',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>

        {/* Title */}
        <h2 style={{ margin: '0 0 12px', color: '#60a5fa', fontSize: 20 }}>
          {currentStepData.title}
        </h2>

        {/* Content */}
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
          {currentStepData.content}
        </p>

        {/* Button */}
        <button
          onClick={handleNext}
          style={{
            padding: '12px 32px',
            borderRadius: 10,
            border: 'none',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, #16a34a, #22c55e)',
            color: '#fff',
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          {step < steps.length - 1 ? 'Next →' : "Let's Go!"}
        </button>

        {/* Skip option */}
        <div style={{ marginTop: 16 }}>
          <button
            onClick={onComplete}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.4)',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            Skip Tutorial
          </button>
        </div>
      </div>
    </div>
  );
}