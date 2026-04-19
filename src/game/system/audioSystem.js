// ============================================================
//  audioSystem.js
//  Web Audio API based sound system.
//  Manages sound effects, music, and volume controls.
// ============================================================

// Audio context singleton
let _audioCtx = null;
let _initialized = false;

// Volume settings (0-1)
let _masterVolume = 0.7;
let _musicVolume = 0.5;
let _sfxVolume = 0.8;

// Music state
let _currentMusic = null;
let _musicGain = null;

// ── Initialization ───────────────────────────────────────────
/**
 * Initialize the audio context. Call on first user interaction.
 */
export function initAudio() {
  if (_initialized) return;

  try {
    _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    _initialized = true;

    // Create music gain node
    _musicGain = _audioCtx.createGain();
    _musicGain.connect(_audioCtx.destination);
    _musicGain.gain.value = _musicVolume * _masterVolume;

    // eslint-disable-next-line no-console
    console.log('Audio system initialized');
  } catch (e) {
    // eslint-disable-next-line no-console
  }
}

/**
 * Resume audio context if suspended (browser autoplay policy)
 */
export function resumeAudio() {
  if (_audioCtx && _audioCtx.state === 'suspended') {
    _audioCtx.resume();
  }
}

// ── Volume Controls ───────────────────────────────────────────
export function setMasterVolume(value) {
  _masterVolume = Math.max(0, Math.min(1, value));
  if (_musicGain) {
    _musicGain.gain.value = _musicVolume * _masterVolume;
  }
}

export function setMusicVolume(value) {
  _musicVolume = Math.max(0, Math.min(1, value));
  if (_musicGain) {
    _musicGain.gain.value = _musicVolume * _masterVolume;
  }
}

export function setSfxVolume(value) {
  _sfxVolume = Math.max(0, Math.min(1, value));
}

export function getMasterVolume() {
  return _masterVolume;
}
export function getMusicVolume() {
  return _musicVolume;
}
export function getSfxVolume() {
  return _sfxVolume;
}

/**
 * Adjust music intensity dynamically based on game state.
 * @param {'intense'|'normal'|'quiet'} intensity
 */
export function setMusicIntensity(intensity) {
  const intensityMap = {
    intense: 0.9,
    normal: 0.5,
    quiet: 0.2,
  };
  const targetVolume = intensityMap[intensity] || intensityMap.normal;
  if (_musicGain) {
    // Smooth transition over 0.5s
    const now = _audioCtx?.currentTime || 0;
    _musicGain.gain.setTargetAtTime(targetVolume * _masterVolume, now, 0.3);
  }
}

// ── Sound Effects ───────────────────────────────────────────
/**
 * Play a synthesized sound effect.
 * Uses Web Audio API oscillators for procedurally generated sounds.
 */
export function playSfx(type, options = {}) {
  if (!_initialized || !_audioCtx || _sfxVolume === 0) return;

  const now = _audioCtx.currentTime;
  const gain = _audioCtx.createGain();
  gain.connect(_audioCtx.destination);
  gain.gain.value = _sfxVolume * _masterVolume * (options.volume || 1);

  switch (type) {
    case 'tower_place':
      playTowerPlace(gain, now);
      break;
    case 'tower_fire':
      playTowerFire(gain, now);
      break;
    case 'enemy_death':
      playEnemyDeath(gain, now);
      break;
    case 'enemy_hit':
      playEnemyHit(gain, now);
      break;
    case 'wave_start':
      playWaveStart(gain, now);
      break;
    case 'wave_complete':
      playWaveComplete(gain, now);
      break;
    case 'upgrade':
      playUpgrade(gain, now);
      break;
    case 'sell':
      playSell(gain, now);
      break;
    case 'error':
      playError(gain, now);
      break;
    case 'button_click':
      playButtonClick(gain, now);
      break;
    case 'heal':
      playHeal(gain, now);
      break;
    case 'boss_appear':
      playBossAppear(gain, now);
      break;
    default:
  }
}

// ── Sound Synthesis Functions ───────────────────────────────
function playTowerPlace(gain, time) {
  // Satisfying "thunk" sound
  const osc = _audioCtx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(220, time);
  osc.frequency.exponentialRampToValueAtTime(80, time + 0.1);

  gain.gain.setValueAtTime(1, time);
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);

  osc.connect(gain);
  osc.start(time);
  osc.stop(time + 0.15);
}

function playTowerFire(gain, time) {
  // Sharp "pew" sound
  const osc = _audioCtx.createOscillator();
  osc.type = 'square';
  osc.frequency.setValueAtTime(800, time);
  osc.frequency.exponentialRampToValueAtTime(200, time + 0.08);

  gain.gain.setValueAtTime(0.3, time);
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);

  osc.connect(gain);
  osc.start(time);
  osc.stop(time + 0.1);
}

function playEnemyDeath(gain, time) {
  // Pop/splat sound
  const osc = _audioCtx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(400, time);
  osc.frequency.exponentialRampToValueAtTime(50, time + 0.15);

  gain.gain.setValueAtTime(0.8, time);
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);

  osc.connect(gain);
  osc.start(time);
  osc.stop(time + 0.2);
}

function playEnemyHit(gain, time) {
  // Quick "bip" sound
  const osc = _audioCtx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, time);
  osc.frequency.setValueAtTime(400, time + 0.02);

  gain.gain.setValueAtTime(0.4, time);
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);

  osc.connect(gain);
  osc.start(time);
  osc.stop(time + 0.05);
}

function playWaveStart(gain, time) {
  // Rising "whomp" - wave starting
  const osc = _audioCtx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(200, time);
  osc.frequency.exponentialRampToValueAtTime(600, time + 0.3);

  gain.gain.setValueAtTime(0.5, time);
  gain.gain.setValueAtTime(0.5, time + 0.25);
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.4);

  osc.connect(gain);
  osc.start(time);
  osc.stop(time + 0.4);
}

function playWaveComplete(gain, time) {
  // Victory "ding" arpeggio
  const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6

  notes.forEach((freq, i) => {
    const osc = _audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;

    const noteGain = _audioCtx.createGain();
    noteGain.gain.setValueAtTime(0, time + i * 0.1);
    noteGain.gain.linearRampToValueAtTime(0.3, time + i * 0.1 + 0.02);
    noteGain.gain.exponentialRampToValueAtTime(0.01, time + i * 0.1 + 0.3);

    osc.connect(noteGain);
    noteGain.connect(gain);
    osc.start(time + i * 0.1);
    osc.stop(time + i * 0.1 + 0.3);
  });
}

function playUpgrade(gain, time) {
  // Shimmering "shing" - upgrade success
  const osc1 = _audioCtx.createOscillator();
  const osc2 = _audioCtx.createOscillator();

  osc1.type = 'sine';
  osc2.type = 'sine';

  osc1.frequency.setValueAtTime(800, time);
  osc1.frequency.exponentialRampToValueAtTime(1200, time + 0.1);
  osc2.frequency.setValueAtTime(1000, time);
  osc2.frequency.exponentialRampToValueAtTime(1500, time + 0.1);

  gain.gain.setValueAtTime(0.3, time);
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);

  osc1.connect(gain);
  osc2.connect(gain);
  osc1.start(time);
  osc2.start(time);
  osc1.stop(time + 0.2);
  osc2.stop(time + 0.2);
}

function playSell(gain, time) {
  // Descending "whoosh" - selling
  const osc = _audioCtx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(400, time);
  osc.frequency.exponentialRampToValueAtTime(100, time + 0.15);

  // Add filter for softer sound
  const filter = _audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 800;

  gain.gain.setValueAtTime(0.4, time);
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);

  osc.connect(filter);
  filter.connect(gain);
  osc.start(time);
  osc.stop(time + 0.2);
}

function playError(gain, time) {
  const osc = _audioCtx.createOscillator();
  osc.type = 'square';
  osc.frequency.value = 150;

  gain.gain.setValueAtTime(0.3, time);
  gain.gain.setValueAtTime(0.3, time + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);

  osc.connect(gain);
  osc.start(time);
  osc.stop(time + 0.15);
}

function playButtonClick(gain, time) {
  // Quick click
  const osc = _audioCtx.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = 1000;

  gain.gain.setValueAtTime(0.2, time);
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.02);

  osc.connect(gain);
  osc.start(time);
  osc.stop(time + 0.02);
}

function playHeal(gain, time) {
  // Gentle "ding" - healing
  const osc = _audioCtx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, time); // A5
  osc.frequency.setValueAtTime(1100, time + 0.1); // C6

  gain.gain.setValueAtTime(0.3, time);
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);

  osc.connect(gain);
  osc.start(time);
  osc.stop(time + 0.2);
}

function playBossAppear(gain, time) {
  // Deep ominous rumble - boss appears
  const osc1 = _audioCtx.createOscillator();
  const osc2 = _audioCtx.createOscillator();

  osc1.type = 'sine';
  osc2.type = 'sawtooth';

  osc1.frequency.setValueAtTime(60, time);
  osc1.frequency.exponentialRampToValueAtTime(30, time + 1);
  osc2.frequency.setValueAtTime(80, time);
  osc2.frequency.exponentialRampToValueAtTime(40, time + 1);

  // Heavy distortion
  const dist = _audioCtx.createWaveShaper();
  dist.curve = makeDistortionCurve(50);

  gain.gain.setValueAtTime(0.6, time);
  gain.gain.linearRampToValueAtTime(0.4, time + 0.5);
  gain.gain.exponentialRampToValueAtTime(0.01, time + 1.2);

  osc1.connect(dist);
  osc2.connect(dist);
  dist.connect(gain);
  osc1.start(time);
  osc2.start(time);
  osc1.stop(time + 1.2);
  osc2.stop(time + 1.2);
}

// ── Utility ───────────────────────────────────────────────────
function makeDistortionCurve(amount) {
  const samples = 44100;
  const curve = new Float32Array(samples);
  const deg = Math.PI / 180;

  for (let i = 0; i < samples; i++) {
    const x = (i * 2) / samples - 1;
    curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
  }

  return curve;
}

// ── Music ───────────────────────────────────────────────────
/**
 * Start background music. Uses a simple procedural loop.
 * For a full game, you'd load actual audio files.
 */
export function startMusic(type = 'action') {
  if (!_initialized || !_audioCtx) return;

  // Stop current music
  if (_currentMusic) {
    _currentMusic.stop();
  }

  // Create a simple looping pattern
  // In production, you'd load actual music files
  _currentMusic = createMusicLoop(type);
  if (_currentMusic.output && _musicGain) {
    _currentMusic.output.connect(_musicGain);
  }
  _currentMusic.start();
}

export function stopMusic() {
  if (_currentMusic) {
    _currentMusic.stop();
    _currentMusic = null;
  }
}

/**
 * Create a procedural music loop
 */
function createMusicLoop(type) {
  // Simple bass drone + rhythm pattern
  const now = _audioCtx.currentTime;

  // Master gain for music
  const musicMaster = _audioCtx.createGain();
  musicMaster.gain.value = 0.3;

  // Bass oscillator
  const bass = _audioCtx.createOscillator();
  bass.type = 'sine';
  bass.frequency.value = type === 'action' ? 55 : 40; // A1 or E1

  const bassGain = _audioCtx.createGain();
  bassGain.gain.value = 0.4;

  // Simple pattern using scheduled notes
  // In production, this would be replaced with actual music files
  bass.connect(bassGain);
  bassGain.connect(musicMaster);

  // Loop the music (in production, load actual audio file)
  bass.start(now);

  // Create a simple envelope for looping feel
  const lfo = _audioCtx.createOscillator();
  lfo.frequency.value = 0.5; // Every 2 seconds
  const lfoGain = _audioCtx.createGain();
  lfoGain.gain.value = 0.1;
  lfo.connect(lfoGain);
  lfoGain.connect(bassGain.gain);
  lfo.start(now);

  return {
    output: musicMaster,
    start() {},
    stop() {
      try {
        bass.stop();
      } catch {}
      try {
        lfo.stop();
      } catch {}
      try {
        bass.disconnect();
      } catch {}
      try {
        lfo.disconnect();
      } catch {}
      try {
        bassGain.disconnect();
      } catch {}
      try {
        lfoGain.disconnect();
      } catch {}
      try {
        musicMaster.disconnect();
      } catch {}
    },
  };
}

// ── Combat Feedback ─────────────────────────────────────────
/**
 * Screen shake utility - returns shake parameters
 */
export function createScreenShake(intensity = 10, duration = 0.2) {
  return {
    intensity,
    duration,
    elapsed: 0,
    active: true,
  };
}

// Export singleton-like API
const audioSystem = {
  initAudio,
  resumeAudio,
  setMasterVolume,
  setMusicVolume,
  setSfxVolume,
  getMasterVolume,
  getMusicVolume,
  getSfxVolume,
  playSfx,
  startMusic,
  stopMusic,
  createScreenShake,
};

export default audioSystem;
