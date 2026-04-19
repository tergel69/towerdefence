import React from 'react';
import {
  loadSettings,
  saveSettings,
  loadStats,
  getAchievements,
  getAchievementList,
  clearAllData,
} from '../system/saveSystem';
import { setMasterVolume, setMusicVolume, setSfxVolume } from '../system/audioSystem';

/**
 * Settings Modal Component
 * Volume controls, graphics options, data management
 */
export default function SettingsModal({ isOpen, onClose, onApplySettings = null }) {
  if (!isOpen) return null;

  const settings = loadSettings();
  const stats = loadStats();
  const achievements = getAchievements();
  const achievementList = getAchievementList();

  const handleVolumeChange = (type, value) => {
    const newValue = parseFloat(value);
    settings[type] = newValue;

    // Apply to audio system
    if (type === 'masterVolume') setMasterVolume(newValue);
    if (type === 'musicVolume') setMusicVolume(newValue);
    if (type === 'sfxVolume') setSfxVolume(newValue);

    saveSettings(settings);
    if (onApplySettings) onApplySettings(settings);
  };

  const handleToggle = (key) => {
    settings[key] = !settings[key];
    saveSettings(settings);
    if (onApplySettings) onApplySettings(settings);
  };

  const handleClearData = () => {
    if (
      // eslint-disable-next-line no-alert
      window.confirm(
        '⚠️ This will delete ALL your progress, stats, and achievements. Are you sure?'
      )
    ) {
      clearAllData();
      // eslint-disable-next-line no-alert
      alert('All data cleared. Refresh to see changes.');
    }
  };

  // Calculate total achievement progress
  const totalAchievements = Object.keys(achievementList).length;
  const unlockedAchievements = Object.values(achievements).filter((a) => a.unlocked).length;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #1a1f2e 0%, #0d1117 100%)',
          borderRadius: 16,
          padding: 24,
          width: 420,
          maxHeight: '80vh',
          overflow: 'auto',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            paddingBottom: 12,
          }}
        >
          <h2 style={{ margin: 0, color: '#fff', fontSize: 20 }}>⚙️ Settings</h2>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: 8,
              color: '#fff',
              width: 32,
              height: 32,
              cursor: 'pointer',
              fontSize: 18,
            }}
          >
            ✕
          </button>
        </div>

        {/* Audio Section */}
        <Section title="🔊 Audio">
          <Slider
            label="Master Volume"
            value={settings.masterVolume}
            min={0}
            max={1}
            step={0.1}
            onChange={(v) => handleVolumeChange('masterVolume', v)}
          />
          <Slider
            label="Music Volume"
            value={settings.musicVolume}
            min={0}
            max={1}
            step={0.1}
            onChange={(v) => handleVolumeChange('musicVolume', v)}
          />
          <Slider
            label="SFX Volume"
            value={settings.sfxVolume}
            min={0}
            max={1}
            step={0.1}
            onChange={(v) => handleVolumeChange('sfxVolume', v)}
          />
        </Section>

        {/* Graphics Section */}
        <Section title="🎨 Graphics">
          <Toggle
            label="Screen Shake"
            description="Enable damage feedback shake"
            enabled={settings.screenShakeEnabled}
            onToggle={() => handleToggle('screenShakeEnabled')}
          />
          <Toggle
            label="Particle Effects"
            description="Show death and impact particles"
            enabled={settings.particlesEnabled}
            onToggle={() => handleToggle('particlesEnabled')}
          />
          <Toggle
            label="Show FPS Counter"
            description="Display frames per second"
            enabled={settings.showFps}
            onToggle={() => handleToggle('showFps')}
          />
        </Section>

        {/* Gameplay Section */}
        <Section title="🎮 Gameplay">
          <Toggle
            label="Auto-start Waves"
            description="Automatically start next wave"
            enabled={settings.autoStartWaves}
            onToggle={() => handleToggle('autoStartWaves')}
          />
        </Section>

        {/* Accessibility Section */}
        <Section title="♿ Accessibility">
          <Toggle
            label="Colorblind Mode"
            description="Adjust enemy colors for color vision deficiency"
            enabled={settings.colorblindMode}
            onToggle={() => handleToggle('colorblindMode')}
          />
          <Toggle
            label="Reduced Motion"
            description="Minimize animations and visual effects"
            enabled={settings.reducedMotion}
            onToggle={() => handleToggle('reducedMotion')}
          />
          <SelectOption
            label="Text Size"
            description="Adjust UI text size"
            value={settings.textSize || 'medium'}
            options={[
              { value: 'small', label: 'Small' },
              { value: 'medium', label: 'Medium (Default)' },
              { value: 'large', label: 'Large' },
            ]}
            onChange={(v) => {
              settings.textSize = v;
              saveSettings(settings);
              if (onApplySettings) onApplySettings(settings);
            }}
          />
          <Toggle
            label="High Contrast Mode"
            description="Enhance color contrast for better visibility"
            enabled={settings.highContrast}
            onToggle={() => handleToggle('highContrast')}
          />
        </Section>

        {/* Stats Section */}
        <Section title="📊 Statistics">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 8,
              fontSize: 12,
            }}
          >
            <Stat label="Waves Completed" value={stats.totalWavesCompleted} />
            <Stat label="Enemies Killed" value={stats.totalEnemiesKilled} />
            <Stat label="Total Gold" value={stats.totalGoldEarned} />
            <Stat label="Towers Built" value={stats.totalTowersBuilt} />
            <Stat label="Highest Wave" value={stats.highestWave || 0} />
            <Stat label="Highest Score" value={stats.highestScore || 0} />
            <Stat label="Games Played" value={stats.gamesPlayed} />
            <Stat label="Games Won" value={stats.gamesWon} />
          </div>
        </Section>

        {/* Achievements Section */}
        <Section title="🏆 Achievements">
          <div
            style={{
              fontSize: 12,
              marginBottom: 8,
              color: '#fbbf24',
            }}
          >
            {unlockedAchievements} / {totalAchievements} Unlocked
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
            }}
          >
            {Object.entries(achievementList).map(([key, ach]) => {
              const userAch = achievements[key];
              return (
                <div
                  key={key}
                  title={`${ach.name}: ${ach.description}`}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: userAch?.unlocked
                      ? 'rgba(251,191,36,0.2)'
                      : 'rgba(255,255,255,0.05)',
                    border: userAch?.unlocked
                      ? '1px solid #fbbf24'
                      : '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    cursor: 'pointer',
                    opacity: userAch?.unlocked ? 1 : 0.4,
                  }}
                >
                  {ach.icon}
                </div>
              );
            })}
          </div>
        </Section>

        {/* Data Management */}
        <Section title="💾 Data">
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleClearData}
              style={{
                flex: 1,
                background: 'rgba(239,68,68,0.2)',
                border: '1px solid rgba(239,68,68,0.4)',
                borderRadius: 8,
                color: '#f87171',
                padding: '10px',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 'bold',
              }}
            >
              🗑️ Clear All Data
            </button>
          </div>
        </Section>

        {/* Version */}
        <div
          style={{
            textAlign: 'center',
            color: 'rgba(255,255,255,0.3)',
            fontSize: 11,
            marginTop: 16,
          }}
        >
          Tower Defense v0.3 | Built with React + Canvas
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          fontSize: 11,
          letterSpacing: '0.1em',
          color: '#64748b',
          marginBottom: 8,
          textTransform: 'uppercase',
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function Slider({ label, value, min, max, step, onChange }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10,
      }}
    >
      <span style={{ flex: 1, fontSize: 13, color: '#94a3b8' }}>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: 100,
          accentColor: '#4FC3F7',
        }}
      />
      <span
        style={{
          width: 30,
          textAlign: 'right',
          fontSize: 12,
          color: '#64748b',
        }}
      >
        {Math.round(value * 100)}%
      </span>
    </div>
  );
}

function Toggle({ label, description, enabled, onToggle }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        padding: '8px 10px',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 8,
      }}
    >
      <div>
        <div style={{ fontSize: 13, color: '#e2e8f0' }}>{label}</div>
        <div style={{ fontSize: 11, color: '#64748b' }}>{description}</div>
      </div>
      <button
        onClick={onToggle}
        style={{
          width: 44,
          height: 24,
          borderRadius: 12,
          background: enabled ? '#10b981' : 'rgba(255,255,255,0.1)',
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          transition: 'all 0.2s',
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: '#fff',
            position: 'absolute',
            top: 3,
            left: enabled ? 23 : 3,
            transition: 'all 0.2s',
          }}
        />
      </button>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        padding: '6px 8px',
        borderRadius: 6,
      }}
    >
      <div style={{ fontSize: 10, color: '#64748b' }}>{label}</div>
      <div style={{ fontSize: 14, color: '#4FC3F7', fontWeight: 'bold' }}>
        {value.toLocaleString()}
      </div>
    </div>
  );
}

function SelectOption({ label, description, value, options, onChange }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        padding: '8px 10px',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 8,
      }}
    >
      <div>
        <div style={{ fontSize: 13, color: '#e2e8f0' }}>{label}</div>
        <div style={{ fontSize: 11, color: '#64748b' }}>{description}</div>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 6,
          color: '#e2e8f0',
          padding: '4px 8px',
          fontSize: 12,
          cursor: 'pointer',
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
