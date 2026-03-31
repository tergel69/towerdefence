import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  TILE_SIZE,
  COLS,
  ROWS,
  TOWER_DEFS,
  ENEMY_DEFS,
  PATH_TILES,
  PATH_VARIATIONS,
  STARTING_MONEY,
  STARTING_HEALTH,
  SELL_REFUND_PCT,
  WAVES,
  generateWave,
  WORLDS,
  LEVELS,
  getUnlockedCategories,
  calculateEnemyStats,
  initRandomPathForGame,
  resetDefaultPathForGame,
  setPathForGame,
} from "./constants";

import { useCanvas } from "./hooks/useCanvas";
import { renderFrame } from "./rendering/canvasRenderer";

import {
  createTower,
  getUpgradeCost,
  upgradeTower,
  getSellValue,
} from "./system/towerSystem";

import { createEnemy, updateEnemies } from "./system/enemySystem";
import { updateProjectiles } from "./system/projectileSystem";
import {
  emitImpactSpark,
  emitPlacementBurst,
  emitUpgradeBurst,
  emitWaveConfetti,
  updateParticles,
} from "./system/particleSystem";
import { evaluateAchievements } from "./system/achievementSystem";
import {
  loadSettings,
  loadStats,
  loadGameState,
  saveGameState,
  saveStats,
  checkAndUnlockAchievements,
  clearSavedGame,
  saveSettings,
  loadProgression,
  getWorldsWithStatus,
  getLevelsWithStatus,
  isWorldUnlocked,
  isLevelUnlocked,
  completeLevel,
} from "./system/saveSystem";
import {
  initAudio,
  resumeAudio,
  setMasterVolume,
  setMusicVolume,
  setSfxVolume,
  playSfx,
  startMusic,
  stopMusic,
} from "./system/audioSystem";

import TowerUpgradePanel from "./components/TowerUpgradePanel";
import WavePreview from "./components/WavePreview";
import TowerTooltip from "./components/TowerTooltip";
import AchievementPopup from "./components/AchievementPopup";
import SettingsModal from "./components/SettingsModal";
import MainMenu from "./components/MainMenu";
import TutorialOverlay from "./components/TutorialOverlay";
import ResultsScreen from "./components/ResultsScreen";
import AnimatedNumber from "./components/AnimatedNumber";

interface HoverTile {
  c: number;
  r: number;
  valid: boolean;
}

interface SpawnEntry {
  type: string;
  delay: number;
  hpScale: number;
  speedScale: number;
  rewardMultiplier?: number;
  regenRate?: number;
  isBoss?: boolean;
  _timer?: number;
}

interface GameState {
  money: number;
  lives: number;
  score: number;
  wave: number;
  waveActive: boolean;
  waveSpawnQueue: SpawnEntry[];
  towers: Array<any>;
  enemies: Array<any>;
  projectiles: Array<any>;
  particles: Array<any>;
  paused: boolean;
  gameOver: boolean;
  victory: boolean;
  selectedTower: string;
  selectedWorld?: keyof typeof WORLDS | null;
  selectedLevel?: number | null;
  gameMode?: 'campaign' | 'endless' | 'challenge';
  placedTiles: Set<string>;
  _hoverTile?: HoverTile;
}

const CANVAS_W = COLS * TILE_SIZE;
const CANVAS_H = ROWS * TILE_SIZE;
const START_WAVE_BONUS_BASE = 30;
const BOSS_WAVE_INTERVAL = 5;
const AUTO_START_DELAY = 2.25;
const WAVE_SKIP_BASE_COST = 40;

const getLevelForWorld = (worldId: keyof typeof WORLDS | string, levelNum: number | null) => {
  if (!levelNum) return null;
  const worldLevels = LEVELS[worldId as keyof typeof LEVELS] as Record<number, any> | undefined;
  return worldLevels?.[levelNum] || null;
};

const applyPathForMode = (gameMode: 'campaign' | 'endless' | 'challenge', worldId: string, levelNum: number | null) => {
  if (gameMode !== 'campaign') {
    initRandomPathForGame();
    return;
  }

  const levelDef = levelNum ? getLevelForWorld(worldId, levelNum) : null;
  const pathType = levelDef?.pathType;
  const pathWaypoints = pathType ? PATH_VARIATIONS[pathType as keyof typeof PATH_VARIATIONS] : null;

  if (!setPathForGame(pathWaypoints || [])) {
    resetDefaultPathForGame();
  }
};

let nextId = 1;
const uid = () => nextId++;

function lerpAngle(a: number, b: number, t: number) {
  let diff = b - a;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  return a + diff * t;
}

const createInitialState = (): GameState => ({
  money: STARTING_MONEY,
  lives: STARTING_HEALTH,
  score: 0,
  wave: 0,
  waveActive: false,
  waveSpawnQueue: [],
  towers: [],
  enemies: [],
  projectiles: [],
  particles: [],
  paused: false,
  gameOver: false,
  victory: false,
  selectedTower: "basic",
  selectedWorld: 'forest',
  selectedLevel: 1,
  gameMode: 'campaign',
  placedTiles: new Set<string>(),
});

const buildWaveQueue = (
  waveNumber: number,
  worldId: string = 'forest',
  gameMode: 'campaign' | 'endless' | 'challenge' = 'campaign',
  levelNum: number | null = null
): SpawnEntry[] => {
  const levelDef = gameMode === 'campaign' && levelNum ? getLevelForWorld(worldId, levelNum) : null;
  const waveDef =
    levelDef?.waves?.[waveNumber - 1] ||
    (waveNumber <= WAVES.length ? WAVES[waveNumber - 1] : generateWave(waveNumber));
  let cumulativeDelay = 0;
  const queue: SpawnEntry[] = [];
  
  for (const group of waveDef) {
    const groupDelay = group.delay ?? 0;
    let spawnDelay = Math.max(cumulativeDelay, groupDelay);
    for (let i = 0; i < group.count; i++) {
      const enemyDef = (ENEMY_DEFS as Record<string, any>)[group.type] || (ENEMY_DEFS as Record<string, any>).normal;
      const isBoss = !!enemyDef?.isBoss || group.type === 'boss';
      const stats = calculateEnemyStats(enemyDef, waveNumber, worldId, isBoss, gameMode === 'endless');
      
      queue.push({
        type: group.type,
        delay: spawnDelay,
        hpScale: Math.max(0.1, stats.hp / Math.max(1, enemyDef.hp)) * (group.hpMultiplier || 1),
        speedScale: Math.max(0.1, stats.speed / Math.max(1, enemyDef.speed)) * (group.speedMultiplier || 1),
        rewardMultiplier: (stats.reward / Math.max(1, enemyDef.reward)) * (group.rewardMultiplier || 1),
        regenRate: (group.regenRate || stats.regenRate || 0),
        isBoss,
      });
      spawnDelay += group.interval || 0;
    }
    cumulativeDelay = spawnDelay;
  }

  if (waveNumber % 5 === 0 && !queue.some((entry) => entry.type === "boss")) {
    queue.push({
      type: "boss",
      delay: cumulativeDelay + 1.25,
      hpScale: 1 + (waveNumber - 1) * 0.22,
      speedScale: 1 + (waveNumber - 1) * 0.02,
    });
  }

  return queue;
};

const createSessionStats = () => ({
  wave: 0,
  enemiesKilled: 0,
  bossesKilled: 0,
  goldEarned: 0,
  towersBuilt: 0,
  towersSold: 0,
  damageDealt: 0,
  score: 0,
  timeSeconds: 0,
});

const summarizeWave = (entries: SpawnEntry[]): Array<{ type: string; count: number; label: string }> => {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    counts.set(entry.type, (counts.get(entry.type) || 0) + 1);
  }
  return Array.from(counts.entries()).map(([type, count]) => ({
    type,
    count,
    label: ENEMY_DEFS[type as keyof typeof ENEMY_DEFS]?.label || type,
  }));
};


export default function TowerDefenseGame() {
  const { canvasRef } = useCanvas();
  
  // 🔧 FIX: Initialize canvas as ready - context will be validated in render loop
  const [canvasReady, setCanvasReady] = useState(true);
  const [settings, setSettings] = useState(() => loadSettings());
  const [persistentStats, setPersistentStats] = useState(() => loadStats());
  const [isMobile, setIsMobile] = useState(false);
  const [showPauseMenu, setShowPauseMenu] = useState(false);
  
  const stateRef = useRef<GameState>(createInitialState());
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const sessionStartRef = useRef<number>(Date.now());
  const sessionStatsRef = useRef(createSessionStats());
  const waveDamageTakenRef = useRef<number>(0);
  const nextWaveDelayRef = useRef<number>(0);
  const autoSavedRef = useRef(false);

  const [ui, setUi] = useState(() => ({
    money: STARTING_MONEY,
    lives: STARTING_HEALTH,
    score: 0,
    wave: 0,
    paused: false,
    gameOver: false,
    victory: false,
    waveActive: false,
  }));
  const [selectedTower, setSelectedTower] = useState("basic");
  const [showSettings, setShowSettings] = useState(false);
  const selectedTowerRef = useRef(selectedTower);
  const [selectedTowerId, setSelectedTowerId] = useState<number | null>(null);
  const [hoveredTowerId, setHoveredTowerId] = useState<string | null>(null);
  const [achievementPopup, setAchievementPopup] = useState<{ name: string; description: string; icon?: string; reward?: number } | null>(null);

  useEffect(() => {
    if (!achievementPopup) return;
    const timer = window.setTimeout(() => setAchievementPopup(null), 3500);
    return () => window.clearTimeout(timer);
  }, [achievementPopup]);

  // Game flow state - 🔧 FIX: Ensure proper initialization
  const [gameState, setGameState] = useState<'menu' | 'worldSelect' | 'levelSelect' | 'playing' | 'gameover'>('menu');
  const [showTutorial, setShowTutorial] = useState(false);
  const [sessionStats, setSessionStats] = useState(() => createSessionStats());
  const [gameMode, setGameMode] = useState<'campaign' | 'endless' | 'challenge'>('campaign');
  
  // World and level selection state
  const [selectedWorld, setSelectedWorld] = useState<keyof typeof WORLDS | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [worldsData, setWorldsData] = useState<any[]>([]);
  const [levelsData, setLevelsData] = useState<any[]>([]);
  // Progression state for tower/enemy unlocks
  const [progression] = useState<any>(() => loadProgression());

  // 🔧 FIX: Load settings on mount
  useEffect(() => {
    const initialSettings = loadSettings();
    setMasterVolume(initialSettings.masterVolume);
    setMusicVolume(initialSettings.musicVolume);
    setSfxVolume(initialSettings.sfxVolume);
    setShowTutorial(!initialSettings.tutorialCompleted);
    setIsMobile(window.innerWidth < 980);
    const handleResize = () => setIsMobile(window.innerWidth < 980);
    window.addEventListener("resize", handleResize);
    console.log('🎮 Game mounted | Settings:', initialSettings);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load world data when entering world select
  useEffect(() => {
    if (gameState === 'worldSelect' || gameState === 'levelSelect') {
      const worlds = getWorldsWithStatus();
      setWorldsData(worlds);
    }
  }, [gameState]);

  // Load level data when entering level select or changing world
  useEffect(() => {
    if (gameState === 'levelSelect' && selectedWorld) {
      const levels = getLevelsWithStatus(selectedWorld);
      setLevelsData(levels);
    }
  }, [gameState, selectedWorld]);

  useEffect(() => {
    setMasterVolume(settings.masterVolume);
    setMusicVolume(settings.musicVolume);
    setSfxVolume(settings.sfxVolume);
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    setPersistentStats(loadStats());
  }, []);

  // 🔧 FIX: Update selectedTowerRef when state changes
  useEffect(() => {
    selectedTowerRef.current = selectedTower;
    stateRef.current.selectedTower = selectedTower;
  }, [selectedTower]);

  useEffect(() => {
    stateRef.current.selectedWorld = selectedWorld;
  }, [selectedWorld]);

  useEffect(() => {
    stateRef.current.selectedLevel = selectedLevel;
  }, [selectedLevel]);

  useEffect(() => {
    stateRef.current.gameMode = gameMode;
  }, [gameMode]);

  // 🔧 FIX: Sync canvas ready state once the game screen is actually mounted
  useEffect(() => {
    if (gameState !== 'playing') {
      setCanvasReady(true);
      return;
    }

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      const ready = !!ctx;
      setCanvasReady(ready);
      console.log('🖼️ Canvas ready check | Context available:', ready);
    }
  }, [gameState, canvasRef]);

  const syncUi = useCallback(() => {
    const s = stateRef.current;
    setUi({
      money: s.money,
      lives: s.lives,
      score: s.score,
      wave: s.wave,
      paused: s.paused,
      gameOver: s.gameOver,
      victory: s.victory,
      waveActive: s.waveActive,
    });
  }, []);

  const syncPersistentStats = useCallback((updater: (current: any) => any) => {
    const current = loadStats();
    const next = updater(current);
    saveStats(next);
    setPersistentStats(next);
    return next;
  }, []);

  const commitSessionStats = useCallback((updates: Partial<ReturnType<typeof createSessionStats>>) => {
    sessionStatsRef.current = { ...sessionStatsRef.current, ...updates };
    setSessionStats(sessionStatsRef.current);
  }, []);

  const saveProgress = useCallback(() => {
    saveGameState(stateRef.current);
    autoSavedRef.current = true;
  }, []);

  const hydrateSavedGame = useCallback((saved: any) => {
    const next = createInitialState();
    next.money = saved.money ?? STARTING_MONEY;
    next.lives = saved.lives ?? STARTING_HEALTH;
    next.score = saved.score ?? 0;
    next.wave = saved.wave ?? 0;
    next.waveActive = !!saved.waveActive;
    next.selectedTower = saved.selectedTower || "basic";
    next.selectedWorld = saved.selectedWorld || 'forest';
    next.selectedLevel = saved.selectedLevel ?? null;
    next.gameMode = saved.gameMode || 'campaign';
    next.placedTiles = new Set<string>(saved.placedTiles || []);
    next.towers = (saved.towers || []).map((tower: any) => {
      const placed = createTower(tower.defId || tower.type || "basic", tower.col, tower.row);
      placed.id = tower.id;
      placed.level = tower.level || 0;
      placed.x = tower.x ?? placed.x;
      placed.y = tower.y ?? placed.y;
      return placed;
    });
    stateRef.current = next;
    nextId = Math.max(0, ...next.towers.map((tower) => tower.id || 0)) + 1;
    if (Array.isArray(saved.pathWaypoints) && saved.pathWaypoints.length >= 2) {
      setPathForGame(saved.pathWaypoints);
    } else {
      applyPathForMode(next.gameMode || 'campaign', next.selectedWorld || 'forest', next.selectedLevel ?? null);
    }
    setSelectedTower(next.selectedTower);
    setSelectedWorld(next.selectedWorld || null);
    setSelectedLevel(next.selectedLevel ?? null);
    setGameMode(next.gameMode || 'campaign');
    setSelectedTowerId(null);
    syncUi();
    saveProgress();
  }, [saveProgress, syncUi]);

  const startWave = useCallback(() => {
    const s = stateRef.current;
    if (s.waveActive || s.gameOver) return;
    const activeWorld = s.selectedWorld || selectedWorld || 'forest';
    const activeLevel = s.selectedLevel ?? selectedLevel ?? null;

    s.wave += 1;
    s.waveActive = true;
    s.waveSpawnQueue = buildWaveQueue(s.wave, activeWorld, gameMode, activeLevel);
    s.waveSpawnQueue.forEach((entry) => {
      entry._timer = entry.delay;
    });
    waveDamageTakenRef.current = 0;
    nextWaveDelayRef.current = 0;
    console.log('🌊 Wave started:', s.wave);
    playSfx('wave_start', { volume: 0.8 });
    if (s.wave % BOSS_WAVE_INTERVAL === 0) {
      playSfx('boss_appear', { volume: 0.65 });
    }
    syncUi();
    saveProgress();
  }, [gameMode, saveProgress, selectedLevel, selectedWorld, syncUi]);

  const update = useCallback(
    (dt: number) => {
      const s = stateRef.current;

      if (gameState !== 'playing' || s.paused || s.gameOver) return;

      sessionStatsRef.current.timeSeconds += dt;

      if (s.waveActive && s.waveSpawnQueue.length > 0) {
        s.waveSpawnQueue = s.waveSpawnQueue.filter((entry) => {
          if (entry._timer === undefined) entry._timer = entry.delay;
          entry._timer -= dt;
          if (entry._timer <= 0) {
            // Spawn enemy with all scaling properties
            const enemy = createEnemy(entry.type, entry.hpScale, entry.speedScale);
            enemy.id = uid();
            enemy.spawnTime = performance.now() / 1000;
            
            // Apply additional scaling from wave
            if (entry.rewardMultiplier) {
              enemy.reward = Math.floor(enemy.reward * entry.rewardMultiplier);
            }
            if (entry.regenRate) {
              enemy.regenRate = entry.regenRate;
              enemy.regenCooldown = 0;
            }
            
            stateRef.current.enemies.push(enemy);
            return false;
          }
          return true;
        });
      }

      updateTowersLikeLoop(s, dt);
      const projectileResult = updateProjectiles(s.projectiles, s.enemies, dt, s.particles) as any;

      const enemyResult = updateEnemies(s.enemies, dt, s.particles) as any;
      const { moneyEarned, healthLost, enemiesKilled, bossesKilled } = enemyResult;
      s.money += moneyEarned;
      s.score += moneyEarned;
      s.lives -= healthLost;

      if (moneyEarned > 0) {
        commitSessionStats({
          goldEarned: sessionStatsRef.current.goldEarned + moneyEarned,
          score: s.score,
          timeSeconds: sessionStatsRef.current.timeSeconds,
        });
      }

      if (enemiesKilled > 0) {
        commitSessionStats({
          enemiesKilled: sessionStatsRef.current.enemiesKilled + enemiesKilled,
          bossesKilled: sessionStatsRef.current.bossesKilled + bossesKilled,
          damageDealt: sessionStatsRef.current.damageDealt + projectileResult.damageDealt,
          score: s.score,
          timeSeconds: sessionStatsRef.current.timeSeconds,
        });
        const updatedStats = syncPersistentStats((current) => ({
          ...current,
          totalEnemiesKilled: (current.totalEnemiesKilled || 0) + enemiesKilled,
          bossesKilled: (current.bossesKilled || 0) + bossesKilled,
          totalGoldEarned: (current.totalGoldEarned || 0) + moneyEarned,
          totalDamageDealt: (current.totalDamageDealt || 0) + projectileResult.damageDealt,
          maxGold: Math.max(current.maxGold || 0, s.money),
        }));
        const unlockResult = evaluateAchievements(updatedStats, s.money);
        if (unlockResult.reward > 0) {
          s.money += unlockResult.reward;
        }
        if (unlockResult.unlockedAchievements?.[0]) {
          const unlocked = unlockResult.unlockedAchievements[0];
          setAchievementPopup({
            name: unlocked.name,
            description: unlocked.description,
            icon: unlocked.icon,
            reward: unlocked.reward,
          });
        }
      }

      if (healthLost > 0) {
        waveDamageTakenRef.current += healthLost;
      }

      if (s.lives <= 0) {
        s.lives = 0;
        s.gameOver = true;
        setGameState('gameover');
        setShowPauseMenu(false);
        stopMusic();
        playSfx('enemy_death', { volume: 0.8 });
        clearSavedGame();
        const updatedStats = syncPersistentStats((current) => ({
          ...current,
          gamesPlayed: (current.gamesPlayed || 0) + 1,
          highestScore: Math.max(current.highestScore || 0, s.score),
          highestWave: Math.max(current.highestWave || 0, s.wave),
          gameTimeSeconds: (current.gameTimeSeconds || 0) + Math.floor(sessionStatsRef.current.timeSeconds),
          maxGold: Math.max(current.maxGold || 0, s.money),
        }));
        checkAndUnlockAchievements(updatedStats, s.money);
        console.log('💀 Game Over!');
      }

      if (s.waveActive && s.waveSpawnQueue.length === 0 && s.enemies.length === 0) {
        s.waveActive = false;
        const bonus = START_WAVE_BONUS_BASE + s.wave * 12;
        s.money += bonus;
        s.score += bonus;
        const perfectWave = waveDamageTakenRef.current === 0;
        const activeWorld = s.selectedWorld || selectedWorld || 'forest';
        const activeLevel = s.selectedLevel ?? selectedLevel ?? null;
        const activeLevelDef = gameMode === 'campaign' && activeWorld && activeLevel
          ? getLevelForWorld(activeWorld, activeLevel)
          : null;
        const completedCampaignLevel = !!activeLevelDef && s.wave >= activeLevelDef.waves.length;
        nextWaveDelayRef.current = settings.autoStartWaves || gameMode === 'endless' ? AUTO_START_DELAY : 0;

        commitSessionStats({
          wave: s.wave,
          score: s.score,
          goldEarned: sessionStatsRef.current.goldEarned + bonus,
        });
        const updatedStats = syncPersistentStats((current) => ({
          ...current,
          totalWavesCompleted: (current.totalWavesCompleted || 0) + 1,
          longestWave: Math.max(current.longestWave || 0, s.wave),
          highestWave: Math.max(current.highestWave || 0, s.wave),
          highestScore: Math.max(current.highestScore || 0, s.score),
          totalGoldEarned: (current.totalGoldEarned || 0) + bonus,
          wavesWithoutDamage: perfectWave ? (current.wavesWithoutDamage || 0) + 1 : (current.wavesWithoutDamage || 0),
          maxGold: Math.max(current.maxGold || 0, s.money),
        }));
        const unlockResult = evaluateAchievements(updatedStats, s.money);
        if (unlockResult.reward > 0) {
          s.money += unlockResult.reward;
        }
        if (unlockResult.unlockedAchievements?.[0]) {
          const unlocked = unlockResult.unlockedAchievements[0];
          setAchievementPopup({
            name: unlocked.name,
            description: unlocked.description,
            icon: unlocked.icon,
            reward: unlocked.reward,
          });
        }
        playSfx('wave_complete', { volume: 0.65 });
        emitWaveConfetti(s.particles, CANVAS_W / 2, 110, '#fbbf24', 18);
        saveProgress();

        if (completedCampaignLevel) {
          s.victory = true;
          s.gameOver = true;
          setGameState('gameover');
          setShowPauseMenu(false);
          stopMusic();
          clearSavedGame();
          if (activeWorld && activeLevel) {
            const totalEnemies = activeLevelDef?.waves?.reduce((sum: number, wave: any[]) => sum + wave.reduce((waveSum: number, group: any) => waveSum + (group.count || 0), 0), 0) || sessionStatsRef.current.enemiesKilled;
            completeLevel(activeWorld, activeLevel, s.score, sessionStatsRef.current.enemiesKilled, totalEnemies, sessionStatsRef.current.towersBuilt, s.wave);
          }
          syncPersistentStats((current) => ({
            ...current,
            gamesPlayed: (current.gamesPlayed || 0) + 1,
            gamesWon: (current.gamesWon || 0) + 1,
            highestScore: Math.max(current.highestScore || 0, s.score),
            highestWave: Math.max(current.highestWave || 0, s.wave),
            gameTimeSeconds: (current.gameTimeSeconds || 0) + Math.floor(sessionStatsRef.current.timeSeconds),
            maxGold: Math.max(current.maxGold || 0, s.money),
          }));
        }

        if (!settings.autoStartWaves) {
          console.log('✅ Wave complete! Bonus:', bonus);
        }
      }

      if (!s.waveActive && (settings.autoStartWaves || gameMode === 'endless') && nextWaveDelayRef.current > 0) {
        nextWaveDelayRef.current -= dt;
        if (nextWaveDelayRef.current <= 0) {
          startWave();
        }
      }

      if (s.money > (persistentStats.maxGold || 0)) {
        syncPersistentStats((current) => ({
          ...current,
          maxGold: Math.max(current.maxGold || 0, s.money),
        }));
      }

      updateParticles(s.particles, dt);
      syncUi();
    },
    [gameState, settings.autoStartWaves, persistentStats, commitSessionStats, syncPersistentStats, startWave, syncUi, saveProgress, selectedLevel, selectedWorld, gameMode]
  );

  const render = useCallback(() => {
    const ctx = canvasRef.current ? canvasRef.current.getContext('2d') : null;
    
    if (!ctx) {
      return;
    }

    const s = stateRef.current;
    const hoveredCell = s._hoverTile
      ? { c: s._hoverTile.c, r: s._hoverTile.r, valid: s._hoverTile.valid }
      : undefined;
    const selectedTowerObj = selectedTowerId == null
      ? null
      : s.towers.find((tower) => tower.id === selectedTowerId) ?? null;

    renderFrame(ctx, s as any, {
      selectedType: selectedTower,
      hoveredCell,
      selectedTower: selectedTowerObj,
    } as any);
  }, [canvasRef, selectedTower, selectedTowerId]);

  // 🔧 FIX: Improved game loop with better dependency handling
  useEffect(() => {
    // Only start loop when in playing state and canvas is ready
    if (gameState !== 'playing' || !canvasReady) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    let animationFrameId: number;
    
    const loop = (timestamp: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }

      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = timestamp;

      update(dt);
      render();
      syncUi();

      animationFrameId = requestAnimationFrame(loop);
      rafRef.current = animationFrameId;
    };

    animationFrameId = requestAnimationFrame(loop);
    rafRef.current = animationFrameId;
    
    console.log('🔄 Game loop started');

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTimeRef.current = null;
      console.log('🛑 Game loop cleaned up');
    };
  }, [gameState, canvasReady, render, syncUi, update]); // 🔧 All dependencies included

  const togglePause = useCallback(() => {
    const s = stateRef.current;
    s.paused = !s.paused;
    if (!s.paused) {
      lastTimeRef.current = null; // Reset timer on resume
      setShowPauseMenu(false);
      resumeAudio();
    } else {
      setShowPauseMenu(true);
    }
    console.log(s.paused ? '⏸️ Paused' : '▶️ Resumed');
    syncUi();
  }, [syncUi]);

  const restartGame = useCallback(() => {
    console.log('🔄 Restarting game...');
    nextId = 1;
    
    resetDefaultPathForGame();
    
    stateRef.current = createInitialState();
    lastTimeRef.current = null;
    sessionStartRef.current = Date.now();
    sessionStatsRef.current = createSessionStats();
    setSessionStats(sessionStatsRef.current);
    waveDamageTakenRef.current = 0;
    nextWaveDelayRef.current = 0;
    setShowPauseMenu(false);
    setSelectedTower("basic");
    setSelectedTowerId(null);
    clearSavedGame();
    syncUi();
  }, [syncUi]);

  const handleUpgrade = useCallback((towerId: number) => {
    const s = stateRef.current;
    const tower = s.towers.find((candidate) => candidate.id === towerId);
    if (!tower) return;

    const cost = getUpgradeCost(tower);
    if (cost === null || s.money < cost) {
      console.log('💰 Not enough gold for upgrade');
      return;
    }

    if (upgradeTower(tower)) {
      s.money -= cost;
      console.log('⬆️ Tower upgraded! Cost:', cost);
      playSfx('upgrade', { volume: 0.65 });
      emitUpgradeBurst(s.particles, tower.x, tower.y, TOWER_DEFS[tower.type as keyof typeof TOWER_DEFS]?.color || '#fbbf24');
      saveProgress();
      syncUi();
    }
  }, [saveProgress, syncUi]);

  const handleSell = useCallback((towerId: number) => {
    const s = stateRef.current;
    const towerIndex = s.towers.findIndex((candidate) => candidate.id === towerId);
    if (towerIndex === -1) return;

    const tower = s.towers[towerIndex];
    const refund = getSellValue(tower, SELL_REFUND_PCT);
    s.money += refund;
    s.placedTiles.delete(`${tower.col},${tower.row}`);
    s.towers.splice(towerIndex, 1);
    setSelectedTowerId(null);
    commitSessionStats({
      towersSold: sessionStatsRef.current.towersSold + 1,
      timeSeconds: sessionStatsRef.current.timeSeconds,
    });
    syncPersistentStats((current) => ({
      ...current,
      totalTowersSold: (current.totalTowersSold || 0) + 1,
      totalGoldEarned: (current.totalGoldEarned || 0) + refund,
      maxGold: Math.max(current.maxGold || 0, s.money),
    }));
    console.log('💸 Tower sold! Refund:', refund);
    playSfx('sell', { volume: 0.65 });
    saveProgress();
    syncUi();
  }, [commitSessionStats, saveProgress, syncPersistentStats, syncUi]);

  const getCanvasPoint = useCallback((clientX: number, clientY: number) => {
    if (!canvasRef.current) return null;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    return {
      px: (clientX - rect.left) * scaleX,
      py: (clientY - rect.top) * scaleY,
    };
  }, [canvasRef]);

  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const s = stateRef.current;
    if (s.paused || s.gameOver) return;
    const point = getCanvasPoint(event.clientX, event.clientY);
    if (!point) return;
    const { px, py } = point;
    const col = Math.floor(px / TILE_SIZE);
    const row = Math.floor(py / TILE_SIZE);
    const key = `${col},${row}`;

    // Check if clicking on existing tower
    const clickedTower = s.towers.find((tower) => tower.col === col && tower.row === row);
    if (clickedTower) {
      setSelectedTowerId(clickedTower.id);
      console.log('🗼 Tower selected:', clickedTower.id);
      return;
    }

    // Validate placement
    if (col < 0 || row < 0 || col >= COLS || row >= ROWS) return;
    if (PATH_TILES.has(key) || s.placedTiles.has(key)) {
      console.log('🚫 Invalid placement tile');
      return;
    }

    const def = TOWER_DEFS[selectedTowerRef.current as keyof typeof TOWER_DEFS];
    if (!def) {
      console.log('❌ Tower definition not found');
      return;
    }
    if (s.money < def.cost) {
      console.log('💰 Not enough gold to build');
      return;
    }

    const tower = createTower(selectedTowerRef.current, col, row);
    s.towers.push(tower);
    s.placedTiles.add(key);
    s.money -= def.cost;
    commitSessionStats({
      towersBuilt: sessionStatsRef.current.towersBuilt + 1,
      timeSeconds: sessionStatsRef.current.timeSeconds,
    });
    syncPersistentStats((current) => ({
      ...current,
      totalTowersBuilt: (current.totalTowersBuilt || 0) + 1,
      maxGold: Math.max(current.maxGold || 0, s.money),
    }));
    console.log('🏗️ Tower built:', def.id, '| Cost:', def.cost);
    playSfx('tower_place', { volume: 0.7 });
    emitPlacementBurst(s.particles, tower.x, tower.y, def.color);
    saveProgress();
    syncUi();
  }, [commitSessionStats, getCanvasPoint, saveProgress, syncPersistentStats, syncUi]);

  const handleCanvasMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getCanvasPoint(event.clientX, event.clientY);
    if (!point) return;
    const { px, py } = point;
    const c = Math.floor(px / TILE_SIZE);
    const r = Math.floor(py / TILE_SIZE);
    const key = `${c},${r}`;
    
    const towerDef = TOWER_DEFS[selectedTowerRef.current as keyof typeof TOWER_DEFS];
    const valid =
      c >= 0 &&
      r >= 0 &&
      c < COLS &&
      r < ROWS &&
      !PATH_TILES.has(key) &&
      !stateRef.current.placedTiles.has(key) &&
      stateRef.current.money >= (towerDef?.cost ?? 0);

    stateRef.current._hoverTile = { c, r, valid };
  }, [getCanvasPoint]);

  const handleMouseLeave = useCallback(() => {
    stateRef.current._hoverTile = undefined;
  }, []);

  const handleTouchStart = useCallback((event: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = event.touches[0];
    if (!touch) return;
    handleCanvasClick({
      ...event,
      clientX: touch.clientX,
      clientY: touch.clientY,
      preventDefault: () => event.preventDefault(),
    } as any);
  }, [handleCanvasClick]);

  const handleTouchMove = useCallback((event: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = event.touches[0];
    if (!touch) return;
    handleCanvasMouseMove({
      ...event,
      clientX: touch.clientX,
      clientY: touch.clientY,
      preventDefault: () => event.preventDefault(),
    } as any);
  }, [handleCanvasMouseMove]);

  // Group tower buttons by category
  const towerButtons = useMemo(() => {
    const categories = getUnlockedCategories(progression);
    const buttons: React.ReactNode[] = [];
    
    categories.forEach((category) => {
      // Add category header
      buttons.push(
        <div
          key={`category-${category.id}`}
          style={{
            padding: '8px 12px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: 8,
            marginTop: 12,
            marginBottom: 4,
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 13, color: '#fbbf24' }}>
            {category.name}
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
            {category.description}
          </div>
        </div>
      );
      
      // Add tower buttons for this category
      category.towers.forEach((towerId) => {
        const def = (TOWER_DEFS as Record<string, any>)[towerId];
        if (!def) return;
        
        buttons.push(
          <button
            key={def.id}
            onClick={() => setSelectedTower(def.id)}
            onMouseEnter={(e) => {
              setHoveredTowerId(def.id);
              if (selectedTower !== def.id) {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = `0 4px 16px ${def.color}30`;
              }
            }}
            onMouseLeave={(e) => {
              setHoveredTowerId(null);
              if (selectedTower !== def.id) {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "scale(0.96)";
            }}
            onMouseUp={(e) => {
              // Check if mouse is still over the button
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX;
              const y = e.clientY;
              const isOver = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
              
              if (isOver) {
                e.currentTarget.style.transform = "scale(1.02)";
              } else {
                e.currentTarget.style.transform = "scale(1)";
              }
            }}
            style={{
              background:
                selectedTower === def.id
                  ? `linear-gradient(135deg, ${def.accentColor}, ${def.color})`
                  : "rgba(255,255,255,0.05)",
              border: `1px solid ${selectedTower === def.id ? def.color : "rgba(255,255,255,0.12)"}`,
              borderRadius: 10,
              color: "#fff",
              padding: "10px 12px",
              cursor: "pointer",
              textAlign: "left",
              fontFamily: "monospace",
              transition: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
              transform: "scale(1)",
              boxShadow: "none",
            }}
          >
            <div style={{ fontWeight: 700 }}>{def.label}</div>
            <div style={{ color: "#fbbf24", fontSize: 12 }}>Cost: {def.cost}g</div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 11, marginTop: 3 }}>
              {def.description}
            </div>
          </button>
        );
      });
    });
    
    return buttons;
  }, [selectedTower, progression]);

  const selectedTowerModel = selectedTowerId === null
    ? null
    : stateRef.current.towers.find((tower) => tower.id === selectedTowerId) ?? null;
  const hoveredTowerDef = hoveredTowerId ? TOWER_DEFS[hoveredTowerId as keyof typeof TOWER_DEFS] : null;
  const hoveredTowerStats = hoveredTowerDef?.levels?.[0] ?? null;
  const hoveredTowerNextStats = hoveredTowerDef?.levels?.[1] ?? null;
  const nextWavePreview = useMemo(
    () => summarizeWave(buildWaveQueue(ui.wave + 1, selectedWorld || 'forest', gameMode, selectedLevel)),
    [ui.wave, selectedWorld, selectedLevel, gameMode]
  );
  const currentSessionStats = { ...sessionStats, timeSeconds: sessionStatsRef.current.timeSeconds };

  // Game flow handlers
  const handleStartNewGame = useCallback(() => {
    console.log('🎮 Starting new game...');
    initAudio();
    resumeAudio();
    startMusic('action');
    restartGame(); // Reset state first
    setGameMode('campaign');
    setSelectedWorld('forest');
    setSelectedLevel(1);
    stateRef.current.selectedWorld = 'forest';
    stateRef.current.selectedLevel = 1;
    stateRef.current.gameMode = 'campaign';
    applyPathForMode('campaign', 'forest', 1);
    setGameState('playing');
    setShowTutorial(!settings.tutorialCompleted);
  }, [restartGame, settings.tutorialCompleted]);

  const handleStartEndless = useCallback(() => {
    console.log('♾️ Starting endless mode...');
    initAudio();
    resumeAudio();
    startMusic('action');
    restartGame();
    setGameMode('endless');
    setSelectedWorld('forest');
    setSelectedLevel(null);
    stateRef.current.selectedWorld = 'forest';
    stateRef.current.selectedLevel = null;
    stateRef.current.gameMode = 'endless';
    applyPathForMode('endless', 'forest', null);
    setGameState('playing');
    setShowTutorial(false);
  }, [restartGame]);

  const handleStartChallenge = useCallback(() => {
    console.log('🎯 Starting daily challenge...');
    initAudio();
    resumeAudio();
    startMusic('action');
    restartGame();
    setGameMode('challenge');
    setSelectedWorld('forest');
    setSelectedLevel(null);
    stateRef.current.selectedWorld = 'forest';
    stateRef.current.selectedLevel = null;
    stateRef.current.gameMode = 'challenge';
    applyPathForMode('challenge', 'forest', null);
    setGameState('playing');
    setShowTutorial(false);
  }, [restartGame]);

  const handleContinue = useCallback(() => {
    console.log('▶️ Continuing saved game...');
    initAudio();
    resumeAudio();
    startMusic('action');
    const savedGame = loadGameState();
    if (savedGame) {
      hydrateSavedGame(savedGame);
      setGameState('playing');
      setShowTutorial(false);
    } else {
      restartGame();
      setGameState('playing');
      setGameMode('campaign');
      setSelectedWorld('forest');
      setSelectedLevel(1);
      stateRef.current.selectedWorld = 'forest';
      stateRef.current.selectedLevel = 1;
      stateRef.current.gameMode = 'campaign';
      applyPathForMode('campaign', 'forest', 1);
    }
  }, [hydrateSavedGame, restartGame]);

  // World and Level Selection Handlers
  const handleEnterWorldSelect = useCallback(() => {
    const worlds = getWorldsWithStatus();
    setWorldsData(worlds);
    setGameState('worldSelect');
  }, []);

  const handleSelectWorld = useCallback((worldId: keyof typeof WORLDS) => {
    if (isWorldUnlocked(worldId)) {
      setSelectedWorld(worldId);
      const levels = getLevelsWithStatus(worldId);
      setLevelsData(levels);
      setGameState('levelSelect');
    }
  }, []);

  const handleSelectLevel = useCallback((levelNum: number) => {
    if (selectedWorld && isLevelUnlocked(selectedWorld, levelNum)) {
      setSelectedLevel(levelNum);
      // Start the game with the selected level
      restartGame();
      setGameMode('campaign');
      stateRef.current.selectedWorld = selectedWorld;
      stateRef.current.selectedLevel = levelNum;
      stateRef.current.gameMode = 'campaign';
      applyPathForMode('campaign', selectedWorld, levelNum);
      setGameState('playing');
      startMusic('action');
    }
  }, [restartGame, selectedWorld]);

  const handleBackToWorlds = useCallback(() => {
    setSelectedWorld(null);
    setGameState('worldSelect');
  }, []);

  const handleSkipWave = useCallback(() => {
    const s = stateRef.current;
    if (s.waveActive || s.gameOver) return;

    const skipCost = WAVE_SKIP_BASE_COST + s.wave * 15;
    if (s.money < skipCost) {
      console.log('💸 Not enough gold to skip the wave');
      return;
    }

    s.money -= skipCost;
    syncPersistentStats((current) => ({
      ...current,
      wavesSkipped: (current.wavesSkipped || 0) + 1,
      maxGold: Math.max(current.maxGold || 0, s.money),
    }));
    startWave();
    saveProgress();
    syncUi();
  }, [saveProgress, startWave, syncPersistentStats, syncUi]);

  const handleTutorialComplete = useCallback(() => {
    console.log('✅ Tutorial complete');
    setShowTutorial(false);
    setSettings((current: typeof settings) => ({ ...current, tutorialCompleted: true }));
  }, []);

  const tutorialOverlay = showTutorial ? (
    <TutorialOverlay
      isOpen={showTutorial}
      onComplete={handleTutorialComplete}
    />
  ) : null;

  const handlePlayAgain = useCallback(() => {
    console.log('🔁 Playing again...');
    restartGame();
    initAudio();
    resumeAudio();
    startMusic('action');
    setGameState('playing');
  }, [restartGame]);

  const handleBackToMenu = useCallback(() => {
    console.log('🏠 Returning to menu...');
    if (gameState === 'playing' && !stateRef.current.gameOver) {
      saveProgress();
    }
    setShowPauseMenu(false);
    stopMusic();
    setGameState('menu');
    syncUi();
  }, [gameState, saveProgress, syncUi]);

  // 🔧 FIX: Render fallback if canvas isn't ready
  if (!canvasReady && gameState === 'playing') {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#08111f", color: "#fff" }}>
        <div style={{ textAlign: "center", padding: 24 }}>
          <h2>🎮 Loading Game...</h2>
          <p style={{ color: "rgba(255,255,255,0.7)" }}>Initializing canvas...</p>
          <button 
            onClick={() => window.location.reload()}
            style={{ marginTop: 16, padding: "10px 24px", background: "#3b82f6", border: "none", borderRadius: 8, color: "#fff", cursor: "pointer" }}
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // Render Main Menu
  if (gameState === 'menu') {
    const savedGame = loadGameState();
    return (
      <>
        <MainMenu
          hasSaveGame={!!savedGame}
          onStartNewGame={handleStartNewGame}
          onStartEndless={handleStartEndless}
          onContinue={handleContinue}
          onOpenSettings={() => setShowSettings(true)}
          onEnterWorldSelect={handleEnterWorldSelect}
          onStartChallenge={handleStartChallenge}
          stats={persistentStats}
        />
        <SettingsModal
          {...({
            isOpen: showSettings,
            onClose: () => setShowSettings(false),
            onApplySettings: (next: any) => setSettings({ ...next }),
          } as any)}
        />
      </>
    );
  }

  // Render World Select Screen
  if (gameState === 'worldSelect') {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "radial-gradient(circle at top, rgba(59,130,246,0.18), transparent 32%), linear-gradient(180deg, #08111f 0%, #0b1020 45%, #06070c 100%)",
          color: "#e5e7eb",
          fontFamily: "Courier New, monospace",
          padding: 16,
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontSize: "clamp(22px, 4vw, 36px)", letterSpacing: "0.14em", textTransform: "uppercase", background: "linear-gradient(90deg, #60a5fa, #fbbf24, #f87171)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Select World
          </h1>
          <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.35)", fontSize: 14 }}>
            Choose your next adventure
          </p>
        </div>

        {/* World Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, maxWidth: 1200, margin: "0 auto" }}>
          {worldsData.map((world: any) => (
            <div
              key={world.id}
              onClick={() => world.unlocked && handleSelectWorld(world.id)}
              style={{
                padding: 20,
                borderRadius: 16,
                background: world.unlocked 
                  ? `linear-gradient(135deg, ${world.colors.terrain}22, ${world.colors.background}44)`
                  : 'rgba(255,255,255,0.03)',
                border: `2px solid ${world.unlocked ? world.themeColor + '66' : 'rgba(255,255,255,0.1)'}`,
                cursor: world.unlocked ? 'pointer' : 'not-allowed',
                opacity: world.unlocked ? 1 : 0.5,
                transition: 'all 0.2s ease',
                transform: world.unlocked ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              {/* World Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h2 style={{ margin: 0, fontSize: 18, color: world.themeColor }}>{world.name}</h2>
                {world.completed && <span style={{ fontSize: 20 }}>🏆</span>}
                {!world.unlocked && <span style={{ fontSize: 16, opacity: 0.6 }}>🔒</span>}
              </div>

              {/* Progress */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Progress</span>
                  <span style={{ color: '#fbbf24' }}>{world.stars} / {world.maxStars} ⭐</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${(world.stars / world.maxStars) * 100}%`, height: '100%', background: world.themeColor, transition: 'width 0.3s ease' }} />
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
                  {world.levelsCompleted} / {world.levelCount} levels completed
                </div>
              </div>

              {/* Description */}
              <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                {world.description}
              </p>

              {/* Unlock hint */}
              {!world.unlocked && world.unlockRequirement && (
                <div style={{ marginTop: 12, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                  🔓 Complete {world.unlockRequirement.level} in {WORLDS[world.unlockRequirement.world as keyof typeof WORLDS]?.name}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button
            onClick={handleBackToMenu}
            style={{
              padding: '12px 32px',
              fontSize: 14,
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 8,
              color: '#e5e7eb',
              cursor: 'pointer',
            }}
          >
            ← Back to Menu
          </button>
        </div>

        <SettingsModal
          {...({
            isOpen: showSettings,
            onClose: () => setShowSettings(false),
            onApplySettings: (next: any) => setSettings({ ...next }),
          } as any)}
        />
      </div>
    );
  }

  // Render Level Select Screen
  if (gameState === 'levelSelect' && selectedWorld) {
    const world = WORLDS[selectedWorld];
    return (
      <div
        style={{
          minHeight: "100vh",
          background: `radial-gradient(circle at top, ${world?.colors?.accent || '#60a5fa'}22, transparent 32%), linear-gradient(180deg, #08111f 0%, #0b1020 45%, #06070c 100%)`,
          color: "#e5e7eb",
          fontFamily: "Courier New, monospace",
          padding: 16,
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontSize: "clamp(22px, 4vw, 36px)", letterSpacing: "0.14em", textTransform: "uppercase", color: world?.themeColor || '#60a5fa' }}>
            {world?.name || 'Select Level'}
          </h1>
          <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.35)", fontSize: 14 }}>
            Choose your challenge
          </p>
        </div>

        {/* Level Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, maxWidth: 900, margin: "0 auto" }}>
          {levelsData.map((level: any) => (
            <div
              key={level.level}
              onClick={() => level.unlocked && handleSelectLevel(level.level)}
              style={{
                padding: 16,
                borderRadius: 12,
                background: level.unlocked 
                  ? `linear-gradient(135deg, ${world?.colors?.terrain || '#2d5a1b'}33, ${world?.colors?.background || '#1a2f1a'}44)`
                  : 'rgba(255,255,255,0.03)',
                border: `2px solid ${level.unlocked ? (world?.themeColor || '#2d5a1b') + '66' : 'rgba(255,255,255,0.1)'}`,
                cursor: level.unlocked ? 'pointer' : 'not-allowed',
                opacity: level.unlocked ? 1 : 0.5,
                textAlign: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              {/* Level Number */}
              <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: level.unlocked ? world?.themeColor : 'rgba(255,255,255,0.3)' }}>
                {level.level}
              </div>

              {/* Stars */}
              <div style={{ fontSize: 14, marginBottom: 4 }}>
                {level.completed 
                  ? '⭐'.repeat(level.stars) 
                  : '☆'.repeat(3)
                }
              </div>

              {/* Status */}
              <div style={{ fontSize: 10, color: level.completed ? '#4ade80' : 'rgba(255,255,255,0.4)' }}>
                {level.completed ? '✓ Complete' : level.unlocked ? 'Ready' : 'Locked'}
              </div>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button
            onClick={handleBackToWorlds}
            style={{
              padding: '12px 32px',
              fontSize: 14,
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 8,
              color: '#e5e7eb',
              cursor: 'pointer',
            }}
          >
            ← Back to Worlds
          </button>
        </div>

        <SettingsModal
          {...({
            isOpen: showSettings,
            onClose: () => setShowSettings(false),
            onApplySettings: (next: any) => setSettings({ ...next }),
          } as any)}
        />
      </div>
    );
  }

  // Render Game Over / Victory Screen
  if (gameState === 'gameover' || ui.gameOver) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "radial-gradient(circle at top, rgba(59,130,246,0.18), transparent 32%), linear-gradient(180deg, #08111f 0%, #0b1020 45%, #06070c 100%)",
          color: "#e5e7eb",
          fontFamily: "Courier New, monospace",
          padding: 16,
          boxSizing: "border-box",
        }}
      >
        <ResultsScreen
          isOpen={true}
          isVictory={ui.victory}
          stats={currentSessionStats}
          onPlayAgain={handlePlayAgain}
          onMainMenu={handleBackToMenu}
        />
        <div style={{ textAlign: 'center', padding: 20 }}>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
            Wave {ui.wave} • Score {ui.score}
          </div>
        </div>
        <SettingsModal
          {...({
            isOpen: showSettings,
            onClose: () => setShowSettings(false),
            onApplySettings: (next: any) => setSettings({ ...next }),
          } as any)}
        />
      </div>
    );
  }

  // 🔧 MAIN GAME RENDER - Canvas now properly displays
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, rgba(59,130,246,0.18), transparent 32%), linear-gradient(180deg, #08111f 0%, #0b1020 45%, #06070c 100%)",
        color: "#e5e7eb",
        fontFamily: "Courier New, monospace",
        padding: 16,
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 14 }}>
        <div style={{ textTransform: "uppercase", letterSpacing: "0.2em", fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 8 }}>
          Indie Release Build
        </div>
        <h1 style={{ margin: 0, fontSize: "clamp(22px, 4vw, 36px)", letterSpacing: "0.14em", textTransform: "uppercase", background: "linear-gradient(90deg, #60a5fa, #fbbf24, #f87171)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Tower Defense
        </h1>
        <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.35)", fontSize: 12 }}>
          Build, upgrade, and survive the wave
        </p>
      </div>

      {/* Stats Bar */}
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 14 }}>
        {[
          { label: "Gold", value: ui.money, color: "#fbbf24", animate: true },
          { label: "Lives", value: ui.lives, color: "#f87171" },
          { label: "Score", value: ui.score, color: "#60a5fa" },
          { label: "Wave", value: ui.wave, color: "#cbd5e1" },
        ].map((entry) => (
          <div key={entry.label} style={{ minWidth: 100, padding: "10px 14px", borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", textTransform: "uppercase" }}>{entry.label}</div>
            <AnimatedNumber value={entry.value} color={entry.color} animate={entry.animate} />
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginBottom: 12, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.42)' }}>
        {gameMode === 'endless' ? 'Endless Mode' : `Campaign: ${selectedWorld || 'forest'}${selectedLevel ? ` / Level ${selectedLevel}` : ''}`}
      </div>

      {/* Main Game Area */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1fr) 280px", gap: 14, alignItems: "start", maxWidth: isMobile ? "100%" : 1320, margin: "0 auto" }}>
        
        {/* Canvas Container */}
        <div style={{ position: "relative" }}>
          <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseLeave}
            style={{
              width: "100%",
              maxWidth: CANVAS_W,
              height: "auto",
              display: "block",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 22px 80px rgba(0,0,0,0.55)",
              cursor: "crosshair",
              background: "#0f172a",
              touchAction: "none",
            }}
          />

          {!ui.gameOver && (
            <div style={{ marginTop: 12, padding: 12, borderRadius: 16, background: "rgba(20, 25, 35, 0.95)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 14px 36px rgba(0,0,0,0.28)", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(5, minmax(0, 1fr))", gap: 10 }}>
              {!ui.waveActive ? (
                <button
                  onClick={startWave}
                  style={{
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: "none",
                    cursor: "pointer",
                    background: "linear-gradient(135deg, #16a34a, #22c55e)",
                    color: "#fff",
                    fontWeight: 700,
                    minHeight: 48,
                    transition: "transform 0.1s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  Send Wave {ui.wave + 1}
                </button>
              ) : (
                <div style={{ padding: "12px 14px", borderRadius: 10, textAlign: "center", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)", color: "#fca5a5", fontWeight: 700, minHeight: 48, display: "grid", placeItems: "center" }}>
                  Wave {ui.wave} active
                </div>
              )}

              {!ui.waveActive && (
                <button
                  onClick={handleSkipWave}
                  style={{
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: "1px solid rgba(245,158,11,0.3)",
                    cursor: "pointer",
                    background: "rgba(245,158,11,0.12)",
                    color: "#fde68a",
                    fontWeight: 700,
                    minHeight: 48,
                  }}
                >
                  Skip Wave ({WAVE_SKIP_BASE_COST + ui.wave * 15}g)
                </button>
              )}

              <button
                onClick={togglePause}
                style={{
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.1)",
                  cursor: "pointer",
                  background: ui.paused ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)",
                  color: "#fff",
                  fontWeight: 700,
                  minHeight: 48,
                }}
              >
                {ui.paused ? "Resume" : "Pause"}
              </button>

              <button
                onClick={restartGame}
                style={{
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: "1px solid rgba(248,113,113,0.35)",
                  cursor: "pointer",
                  background: "rgba(248,113,113,0.12)",
                  color: "#fecaca",
                  fontWeight: 700,
                  minHeight: 48,
                }}
              >
                Restart
              </button>

              <button
                onClick={() => setShowSettings(true)}
                style={{
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: "1px solid rgba(96,165,250,0.35)",
                  cursor: "pointer",
                  background: "rgba(96,165,250,0.12)",
                  color: "#93c5fd",
                  fontWeight: 700,
                  minHeight: 48,
                }}
              >
                Settings
              </button>
            </div>
          )}

          {/* Tower Card Panel - New Card-Based Selection */}
          {/* {!ui.gameOver && (
            <TowerCardPanel
              currentGold={ui.money}
              selectedTower={selectedTower}
              onSelectTower={setSelectedTower}
              onReroll={() => {
                const cost = 50;
                if (ui.money >= cost) {
                  stateRef.current.money -= cost;
                  playSfx('ui_click', { volume: 0.5 });
                }
              }}
              rerollCost={50}
              
            />
          )} */}

          {/* Pause Overlay */}
          {showPauseMenu && ui.paused && !ui.gameOver && (
            <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", borderRadius: 14, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)", zIndex: 20 }}>
              <div style={{ width: 280, maxWidth: "88%", padding: 20, borderRadius: 16, background: "rgba(10,15,28,0.92)", border: "1px solid rgba(255,255,255,0.12)", textAlign: "center" }}>
                <div style={{ fontSize: 34, letterSpacing: "0.2em", fontWeight: 700, marginBottom: 12 }}>
                  PAUSED
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <button onClick={togglePause} style={{ padding: "12px 16px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #16a34a, #22c55e)", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
                    Resume
                  </button>
                  <button onClick={restartGame} style={{ padding: "12px 16px", borderRadius: 10, border: "1px solid rgba(248,113,113,0.35)", background: "rgba(248,113,113,0.12)", color: "#fecaca", fontWeight: 700, cursor: "pointer" }}>
                    Restart
                  </button>
                  <button onClick={handleBackToMenu} style={{ padding: "12px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.16)", background: "rgba(255,255,255,0.06)", color: "#e2e8f0", fontWeight: 700, cursor: "pointer" }}>
                    Main Menu
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tower Upgrade Panel */}
          {selectedTowerModel && (
            <TowerUpgradePanel
              tower={selectedTowerModel}
              money={ui.money}
              onUpgrade={handleUpgrade}
              onSell={handleSell}
              onClose={() => setSelectedTowerId(null)}
            />
          )}
        </div>

        {/* Sidebar Controls - Enhanced Card Design */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          
          {/* Resources Panel */}
          <div style={{ padding: 16, borderRadius: 16, background: "rgba(20, 25, 35, 0.95)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(251, 191, 36, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>💰</div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "#fbbf24" }}>{ui.money}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em" }}>GOLD</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(239, 68, 68, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>❤️</div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "#ef4444" }}>{ui.lives}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em" }}>LIVES</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tower Selection */}
          <div style={{ padding: 14, borderRadius: 16, background: "rgba(20, 25, 35, 0.95)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>Towers</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{towerButtons}</div>
          </div>

          <WavePreview
            waveNumber={ui.wave + 1}
            entries={nextWavePreview.slice(0, 5) as any}
            bonusGold={START_WAVE_BONUS_BASE + (ui.wave + 1) * 12}
            visible={!ui.gameOver}
          />

          <TowerTooltip
            visible={!!hoveredTowerDef}
            tower={hoveredTowerDef}
            stats={hoveredTowerStats}
            nextStats={hoveredTowerNextStats as any}
          />

          {/* Controls Help - Enhanced Card */}
          <div style={{ padding: 14, borderRadius: 16, background: "rgba(20, 25, 35, 0.95)", border: "1px solid rgba(255,255,255,0.08)", fontSize: 12, lineHeight: 1.8, backdropFilter: "blur(10px)" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
              Controls
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0" }}>
              <span style={{ width: 20, height: 20, borderRadius: 6, background: "rgba(59, 130, 246, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#60a5fa" }}>1</span>
              <span style={{ color: "rgba(255,255,255,0.7)" }}>Choose a tower</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0" }}>
              <span style={{ width: 20, height: 20, borderRadius: 6, background: "rgba(59, 130, 246, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#60a5fa" }}>2</span>
              <span style={{ color: "rgba(255,255,255,0.7)" }}>Click grid to build</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0" }}>
              <span style={{ width: 20, height: 20, borderRadius: 6, background: "rgba(59, 130, 246, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#60a5fa" }}>3</span>
              <span style={{ color: "rgba(255,255,255,0.7)" }}>Select tower to upgrade</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0" }}>
              <span style={{ width: 20, height: 20, borderRadius: 6, background: "rgba(59, 130, 246, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#60a5fa" }}>4</span>
              <span style={{ color: "rgba(255,255,255,0.7)" }}>Send waves to start</span>
            </div>
          </div>

          
          <div style={{ display: "none" }}>
            {!ui.gameOver && !ui.waveActive && (
              <button
                onClick={startWave}
                style={{
                  padding: "11px 14px",
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  background: "linear-gradient(135deg, #16a34a, #22c55e)",
                  color: "#fff",
                  fontWeight: 700,
                  transition: "transform 0.1s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                Send Wave {ui.wave + 1}
              </button>
            )}

            {!ui.gameOver && !ui.waveActive && (
              <button
                onClick={handleSkipWave}
                style={{
                  padding: "11px 14px",
                  borderRadius: 10,
                  border: "1px solid rgba(245,158,11,0.3)",
                  cursor: "pointer",
                  background: "rgba(245,158,11,0.12)",
                  color: "#fde68a",
                  fontWeight: 700,
                }}
              >
                Skip Wave ({WAVE_SKIP_BASE_COST + ui.wave * 15}g)
              </button>
            )}

            {!ui.gameOver && ui.waveActive && (
              <div style={{ padding: "11px 14px", borderRadius: 10, textAlign: "center", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)", color: "#fca5a5", fontWeight: 700 }}>
                Wave {ui.wave} active
              </div>
            )}

            <button
              onClick={togglePause}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.1)",
                cursor: "pointer",
                background: ui.paused ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)",
                color: "#fff",
                fontWeight: 700,
              }}
            >
              {ui.paused ? "▶️ Resume" : "⏸️ Pause"}
            </button>

            <button
              onClick={restartGame}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid rgba(248,113,113,0.35)",
                cursor: "pointer",
                background: "rgba(248,113,113,0.12)",
                color: "#fecaca",
                fontWeight: 700,
              }}
            >
              🔄 Restart
            </button>

            <button
              onClick={() => setShowSettings(true)}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid rgba(96,165,250,0.35)",
                cursor: "pointer",
                background: "rgba(96,165,250,0.12)",
                color: "#93c5fd",
                fontWeight: 700,
              }}
              >
              ⚙️ Settings
            </button>
          </div>

          {/* Enemy Legend - Enhanced */}
          {/* <div style={{ padding: 14, borderRadius: 16, background: "rgba(20, 25, 35, 0.95)", border: "1px solid rgba(255,255,255,0.06)", fontSize: 12, backdropFilter: "blur(10px)" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
              Enemies
            </div>
            {Object.values(ENEMY_DEFS).map((def) => (
              <div key={def.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 8px", borderRadius: 8, marginBottom: 4, transition: "background 150ms ease" }}>
                <span style={{ width: 14, height: 14, borderRadius: 999, background: def.color, display: "inline-block", boxShadow: `0 0 10px ${def.color}60` }} />
                <span style={{ flex: 1, color: "rgba(255,255,255,0.85)" }}>
                  {def.label}
                </span>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>
                  {def.hp} HP
                </span>
              </div>
            ))}
          </div> */}
        </div>
      </div>

      {/* Modals - Rendered at root level to avoid z-index issues */}
      <SettingsModal
        {...({
          isOpen: showSettings,
          onClose: () => setShowSettings(false),
          onApplySettings: (next: any) => setSettings({ ...next }),
        } as any)}
      />
      <ResultsScreen
        isOpen={ui.gameOver || ui.victory}
        isVictory={ui.victory}
        stats={currentSessionStats}
        onPlayAgain={handlePlayAgain}
        onMainMenu={handleBackToMenu}
      />
      <AchievementPopup
        achievement={achievementPopup}
        reward={achievementPopup?.reward || 0}
        onClose={() => setAchievementPopup(null)}
      />
      {tutorialOverlay}
    </div>
  );
}

// 🔧 Helper function - unchanged but included for completeness
function updateTowersLikeLoop(state: GameState, dt: number) {
  for (const tower of state.towers) {
    const def = TOWER_DEFS[(tower.type || tower.defId) as keyof typeof TOWER_DEFS];
    if (!def) continue;

    const stats = def.levels[tower.level];
    tower.muzzleFlash = Math.max(0, (tower.muzzleFlash || 0) - dt * 2.5);
    tower.cooldown = Math.max(0, tower.cooldown - dt);

    let bestEnemy: any = null;
    let bestScore = -Infinity;

    for (const enemy of state.enemies) {
      if (enemy.dead || enemy.reachedEnd) continue;

      const dx = enemy.x - tower.x;
      const dy = enemy.y - tower.y;
      const distance = Math.hypot(dx, dy);
      if (distance > (stats as any).range) continue;

      const progress = enemy.waypointIdx ?? enemy.wpIndex ?? 0;
      const score = progress * 1000 - distance;
      if (score > bestScore) {
        bestScore = score;
        bestEnemy = enemy;
      }
    }

    if (!bestEnemy) {
      tower.target = null;
      continue;
    }

    tower.target = bestEnemy.id;

    const desiredAngle = Math.atan2(bestEnemy.y - tower.y, bestEnemy.x - tower.x);
    tower.barrelAngle = lerpAngle(tower.barrelAngle, desiredAngle, Math.min(1, dt * 10));

    if (tower.cooldown > 0) continue;

    state.projectiles.push({
      id: uid(),
      x: tower.x,
      y: tower.y,
      targetId: bestEnemy.id,
      speed: (stats as any).bulletSpeed || (stats as any).projectileSpeed || 280,
      damage: (stats as any).damage || 0,
      splash: !!(stats as any).splash || !!(stats as any).splashRadius,
      splashRadius: (stats as any).splashRadius || (stats as any).splash || 0,
      color: def.bulletColor,
      radius: def.id === "basic" ? 4 : 6,
      slowAmount: (stats as any).slowAmount || 0,
      slowDuration: (stats as any).slowDuration || 0,
      poisonDamage: (stats as any).poisonDamage || 0,
      poisonDuration: (stats as any).poisonDuration || 0,
    });

    tower.cooldown = 1 / ((stats as any).fireRate || 1);
    tower.muzzleFlash = 1;
    emitImpactSpark(state.particles, tower.x, tower.y, def.bulletColor);
    playSfx('tower_fire', { volume: 0.35 });
  }
}
