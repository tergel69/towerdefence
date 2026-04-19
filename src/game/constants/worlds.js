// ============================================================
//  WORLDS.JS
//  World system, levels, and enemy progression constants
// ============================================================

export const WORLDS = {
  forest: {
    id: 'forest',
    name: 'Forest World',
    description: 'The ancient woods hold many secrets...',
    storyIntro:
      'You enter the ancient forest where goblins and treants dwell. The path is lined with mysterious mushrooms and glowing lights.',
    themeColor: '#2d5a1b',
    colors: {
      terrain: '#2d5a1b',
      terrainLight: '#3a7a24',
      terrainDark: '#1e3d12',
      path: '#c8a96e',
      pathEdge: '#a8845a',
      background: '#1a2f1a',
      accent: '#4ade80',
      sky: '#87CEEB',
      decoration: '#228B22',
    },
    unlockRequirement: null, // First world, always unlocked
    levelCount: 12,
    difficulty: 1.0,
  },
  desert: {
    id: 'desert',
    name: 'Desert World',
    description: 'Scorching sands hide ancient treasures...',
    storyIntro:
      'Beyond the forest lies the endless desert. Sand wyrms and scorpion warriors guard the ancient ruins buried in the dunes.',
    themeColor: '#d4a574',
    colors: {
      terrain: '#d4a574',
      terrainLight: '#e8c99b',
      terrainDark: '#b8956e',
      path: '#c9b896',
      pathEdge: '#a89876',
      background: '#8b7355',
      accent: '#fbbf24',
      sky: '#87CEEB',
      decoration: '#daa520',
    },
    unlockRequirement: { world: 'forest', level: 5 },
    levelCount: 12,
    difficulty: 1.3,
  },
  ice: {
    id: 'ice',
    name: 'Ice World',
    description: 'Frozen peaks challenge all who dare enter...',
    storyIntro:
      'The icy mountains are home to frost giants and snow elementals. The frozen path crackles beneath every step.',
    themeColor: '#81d4fa',
    colors: {
      terrain: '#81d4fa',
      terrainLight: '#b3e5fc',
      terrainDark: '#4fc3f7',
      path: '#e0e0e0',
      pathEdge: '#bdbdbd',
      background: '#455a64',
      accent: '#00bcd4',
      sky: '#b3e5fc',
      decoration: '#ffffff',
    },
    unlockRequirement: { world: 'desert', level: 5 },
    levelCount: 12,
    difficulty: 1.6,
  },
  volcanic: {
    id: 'volcanic',
    name: 'Volcanic World',
    description: 'Molten rivers and fire demons await...',
    storyIntro:
      'Deep within the volcanic mountains, fire elementals and lava golems reign supreme. The heat is unbearable for the unprepared.',
    themeColor: '#ff5722',
    colors: {
      terrain: '#5d4037',
      terrainLight: '#795548',
      terrainDark: '#3e2723',
      path: '#ff5722',
      pathEdge: '#bf360c',
      background: '#212121',
      accent: '#ff9800',
      sky: '#ff7043',
      decoration: '#ffab91',
    },
    unlockRequirement: { world: 'ice', level: 5 },
    levelCount: 12,
    difficulty: 2.0,
  },
  cosmic: {
    id: 'cosmic',
    name: 'Cosmic World',
    description: 'Beyond the stars, darkness consumes all...',
    storyIntro:
      'The cosmic void holds ancient cosmic entities of unimaginable power. Only the bravest heroes can face the darkness between worlds.',
    themeColor: '#7c4dff',
    colors: {
      terrain: '#1a1a2e',
      terrainLight: '#16213e',
      terrainDark: '#0f0f23',
      path: '#7c4dff',
      pathEdge: '#536dfe',
      background: '#0a0a15',
      accent: '#e040fb',
    },
  },
};

export const LEVELS = {
  // Forest World Levels (1-12)
  forest: {
    1: {
      id: 'forest_1',
      world: 'forest',
      level: 1,
      name: 'Forest Entrance',
      pathType: 'simple',
      hpMultiplier: 1.0,
      speedMultiplier: 1.0,
      rewardMultiplier: 1.0,
      waves: [
        [{ type: 'normal', count: 6, interval: 1.5 }],
        [{ type: 'normal', count: 8, interval: 1.2 }],
        [
          { type: 'normal', count: 10, interval: 1.0 },
          { type: 'fast', count: 3, interval: 1.0 },
        ],
      ],
      availableTowers: ['basic', 'splash'],
      introText: 'Your journey begins. Defeat the goblin scouts!',
    },
    2: {
      id: 'forest_2',
      world: 'forest',
      level: 2,
      name: 'Mushroom Grove',
      pathType: 'scurve',
      hpMultiplier: 1.1,
      speedMultiplier: 1.0,
      rewardMultiplier: 1.1,
      waves: [
        [{ type: 'normal', count: 8, interval: 1.2 }],
        [
          { type: 'normal', count: 6, interval: 1.0 },
          { type: 'fast', count: 4, interval: 0.8 },
        ],
        [{ type: 'fast', count: 8, interval: 0.7 }],
      ],
      availableTowers: ['basic', 'splash'],
      introText: 'The mushrooms are Watching...',
    },
    3: {
      id: 'forest_3',
      world: 'forest',
      level: 3,
      name: 'Treant Path',
      pathType: 'simple',
      hpMultiplier: 1.2,
      speedMultiplier: 1.0,
      rewardMultiplier: 1.2,
      waves: [
        [{ type: 'normal', count: 10, interval: 1.0 }],
        [
          { type: 'fast', count: 6, interval: 0.8 },
          { type: 'normal', count: 8, interval: 1.0 },
        ],
        [{ type: 'tank', count: 2, interval: 3.0 }],
      ],
      availableTowers: ['basic', 'splash', 'ice'],
      introText: 'Ancient treants guard this path. Prepare for battle!',
    },
    4: {
      id: 'forest_4',
      world: 'forest',
      level: 4,
      name: 'Goblin Camp',
      pathType: 'doubleback',
      hpMultiplier: 1.3,
      speedMultiplier: 1.1,
      rewardMultiplier: 1.3,
      waves: [
        [{ type: 'normal', count: 12, interval: 0.9 }],
        [{ type: 'fast', count: 8, interval: 0.6 }],
        [
          { type: 'tank', count: 3, interval: 2.5 },
          { type: 'normal', count: 10, interval: 0.8 },
        ],
      ],
      availableTowers: ['basic', 'splash', 'ice'],
      introText: 'A goblin camp lies ahead. They outnumber you!',
    },
    5: {
      id: 'forest_5',
      world: 'forest',
      level: 5,
      name: 'The Old Oak',
      pathType: 'spiral',
      hpMultiplier: 1.4,
      speedMultiplier: 1.1,
      rewardMultiplier: 1.4,
      waves: [
        [
          { type: 'normal', count: 10, interval: 0.8 },
          { type: 'fast', count: 6, interval: 0.6 },
        ],
        [{ type: 'tank', count: 4, interval: 2.0 }],
        [
          { type: 'healer', count: 2, interval: 3.0 },
          { type: 'normal', count: 15, interval: 0.7 },
        ],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'poison'],
      introText: 'The Old Oak watches over all. Prove your worth!',
      unlocksWorld: 'desert',
    },
    6: {
      id: 'forest_6',
      world: 'forest',
      level: 6,
      name: 'Elven Ruins',
      pathType: 'diagonal',
      hpMultiplier: 1.5,
      speedMultiplier: 1.2,
      rewardMultiplier: 1.5,
      waves: [
        [{ type: 'fast', count: 10, interval: 0.5 }],
        [{ type: 'shielded', count: 4, interval: 1.8 }],
        [
          { type: 'tank', count: 5, interval: 2.0 },
          { type: 'healer', count: 2, interval: 2.5 },
        ],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'poison', 'sniper'],
      introText: 'Ancient elven ruins hold forgotten power...',
    },
    7: {
      id: 'forest_7',
      world: 'forest',
      level: 7,
      name: 'Wolf Den',
      pathType: 'simple',
      hpMultiplier: 1.6,
      speedMultiplier: 1.3,
      rewardMultiplier: 1.6,
      waves: [
        [{ type: 'fast', count: 15, interval: 0.4 }],
        [
          { type: 'normal', count: 12, interval: 0.8 },
          { type: 'tank', count: 4, interval: 2.0 },
        ],
        [{ type: 'shielded', count: 6, interval: 1.5 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'poison', 'sniper'],
      introText: 'Dire wolves emerge from their den!',
    },
    8: {
      id: 'forest_8',
      world: 'forest',
      level: 8,
      name: 'Fairy Circle',
      pathType: 'scurve',
      hpMultiplier: 1.7,
      speedMultiplier: 1.3,
      rewardMultiplier: 1.7,
      waves: [
        [
          { type: 'healer', count: 3, interval: 2.5 },
          { type: 'normal', count: 12, interval: 0.8 },
        ],
        [
          { type: 'shielded', count: 5, interval: 1.5 },
          { type: 'fast', count: 8, interval: 0.5 },
        ],
        [{ type: 'tank', count: 6, interval: 1.8 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'poison', 'sniper'],
      introText: 'Magical fairies heal their allies!',
    },
    9: {
      id: 'forest_9',
      world: 'forest',
      level: 9,
      name: 'Dark Hollow',
      pathType: 'doubleback',
      hpMultiplier: 1.8,
      speedMultiplier: 1.4,
      rewardMultiplier: 1.8,
      waves: [
        [{ type: 'shielded', count: 8, interval: 1.2 }],
        [
          { type: 'healer', count: 4, interval: 2.0 },
          { type: 'fast', count: 12, interval: 0.4 },
        ],
        [{ type: 'tank', count: 8, interval: 1.5 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'poison', 'sniper'],
      introText: 'Something stirs in the dark hollow...',
    },
    10: {
      id: 'forest_10',
      world: 'forest',
      level: 10,
      name: 'Forest Guardian',
      pathType: 'spiral',
      hpMultiplier: 2.0,
      speedMultiplier: 1.4,
      rewardMultiplier: 2.0,
      waves: [
        [{ type: 'boss', count: 1, interval: 0 }],
        [
          { type: 'normal', count: 15, interval: 0.6 },
          { type: 'healer', count: 3, interval: 2.0 },
        ],
        [{ type: 'shielded', count: 6, interval: 1.5 }],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'poison', 'sniper'],
      introText: 'The Forest Guardian awakens! Defeat it to prove your strength!',
    },
    11: {
      id: 'forest_11',
      world: 'forest',
      level: 11,
      name: 'Shadow Deep',
      pathType: 'diagonal',
      hpMultiplier: 2.2,
      speedMultiplier: 1.5,
      rewardMultiplier: 2.2,
      waves: [
        [{ type: 'fast', count: 20, interval: 0.3 }],
        [{ type: 'shielded', count: 10, interval: 1.2 }],
        [
          { type: 'tank', count: 8, interval: 1.5 },
          { type: 'healer', count: 4, interval: 1.8 },
        ],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'poison', 'sniper'],
      introText: 'The shadows grow darker...',
    },
    12: {
      id: 'forest_12',
      world: 'forest',
      level: 12,
      name: 'Ancient Grove',
      pathType: 'simple',
      hpMultiplier: 2.5,
      speedMultiplier: 1.5,
      rewardMultiplier: 2.5,
      waves: [
        [{ type: 'boss', count: 1, interval: 0 }],
        [
          { type: 'normal', count: 25, interval: 0.4 },
          { type: 'fast', count: 15, interval: 0.3 },
        ],
        [
          { type: 'shielded', count: 12, interval: 1.0 },
          { type: 'healer', count: 5, interval: 1.5 },
        ],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'poison', 'sniper'],
      introText: 'The final challenge! Conquer the Ancient Grove!',
    },
  },

  // Desert World Levels (13-24)
  desert: {
    1: {
      id: 'desert_1',
      world: 'desert',
      level: 1,
      name: 'Sandy Dunes',
      pathType: 'simple',
      hpMultiplier: 1.3,
      speedMultiplier: 1.1,
      rewardMultiplier: 1.3,
      waves: [
        [{ type: 'scorpion', count: 8, interval: 1.2 }],
        [
          { type: 'scorpion', count: 10, interval: 1.0 },
          { type: 'sandWorm', count: 2, interval: 2.0 },
        ],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower'],
      introText: 'Welcome to the desert! Scorpions crawl everywhere!',
    },
    2: {
      id: 'desert_2',
      world: 'desert',
      level: 2,
      name: 'Oasis Springs',
      pathType: 'scurve',
      hpMultiplier: 1.4,
      speedMultiplier: 1.2,
      rewardMultiplier: 1.4,
      waves: [
        [{ type: 'scorpion', count: 12, interval: 1.0 }],
        [{ type: 'sandWorm', count: 4, interval: 1.8 }],
        [
          { type: 'scorpion', count: 8, interval: 0.8 },
          { type: 'fast', count: 5, interval: 0.8 },
        ],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower'],
      introText: 'The oasis provides relief, but danger lurks nearby!',
    },
    3: {
      id: 'desert_3',
      world: 'desert',
      level: 3,
      name: 'Ancient Tomb',
      pathType: 'doubleback',
      hpMultiplier: 1.5,
      speedMultiplier: 1.2,
      rewardMultiplier: 1.5,
      waves: [
        [{ type: 'mummy', count: 6, interval: 1.5 }],
        [{ type: 'sandWorm', count: 5, interval: 1.5 }],
        [
          { type: 'mummy', count: 8, interval: 1.2 },
          { type: 'scorpion', count: 10, interval: 0.8 },
        ],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'sandweaver'],
      introText: 'Ancient mummies awaken in the tomb!',
    },
    4: {
      id: 'desert_4',
      world: 'desert',
      level: 4,
      name: 'Sandstorm Valley',
      pathType: 'diagonal',
      hpMultiplier: 1.6,
      speedMultiplier: 1.3,
      rewardMultiplier: 1.6,
      waves: [
        [{ type: 'sandWorm', count: 8, interval: 1.2 }],
        [{ type: 'fast', count: 12, interval: 0.5 }],
        [
          { type: 'mummy', count: 6, interval: 1.5 },
          { type: 'scorpion', count: 15, interval: 0.6 },
        ],
      ],
      availableTowers: ['basic', 'splash', 'ice', 'archer', 'flamethrower', 'sandweaver'],
      introText: 'A sandstorm approaches! The worms sense the vibration!',
    },
    5: {
      id: 'desert_5',
      world: 'desert',
      level: 5,
      name: 'Pyramid of Sun',
      pathType: 'spiral',
      hpMultiplier: 1.8,
      speedMultiplier: 1.4,
      rewardMultiplier: 1.8,
      waves: [
        [{ type: 'mummy', count: 10, interval: 1.2 }],
        [{ type: 'boss', id: 'pharaoh', count: 1, interval: 0, hpMultiplier: 1.5 }],
        [
          { type: 'sandWorm', count: 6, interval: 1.5 },
          { type: 'healer', count: 2, interval: 2.5 },
        ],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'sandweaver',
        'duneCrawler',
      ],
      introText: 'The Pharaoh awakens! The pyramid reveals its secrets!',
      unlocksWorld: 'ice',
    },
    6: {
      id: 'desert_6',
      world: 'desert',
      level: 6,
      name: 'Canyon Pass',
      pathType: 'simple',
      hpMultiplier: 2.0,
      speedMultiplier: 1.5,
      rewardMultiplier: 2.0,
      waves: [
        [{ type: 'scorpion', count: 20, interval: 0.4 }],
        [{ type: 'sandWorm', count: 8, interval: 1.2 }],
        [{ type: 'mummy', count: 12, interval: 1.0 }],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'sandweaver',
        'duneCrawler',
      ],
      introText: 'The canyon narrows! Prepare for combat!',
    },
    7: {
      id: 'desert_7',
      world: 'desert',
      level: 7,
      name: 'Lost Caravan',
      pathType: 'scurve',
      hpMultiplier: 2.2,
      speedMultiplier: 1.5,
      rewardMultiplier: 2.2,
      waves: [
        [{ type: 'fast', count: 15, interval: 0.4 }],
        [
          { type: 'mummy', count: 10, interval: 1.2 },
          { type: 'healer', count: 3, interval: 2.0 },
        ],
        [{ type: 'sandWorm', count: 10, interval: 1.0 }],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'sandweaver',
        'duneCrawler',
      ],
      introText: 'The spirits of the lost caravan haunt these sands!',
    },
    8: {
      id: 'desert_8',
      world: 'desert',
      level: 8,
      name: 'Temple of Ra',
      pathType: 'doubleback',
      hpMultiplier: 2.4,
      speedMultiplier: 1.6,
      rewardMultiplier: 2.4,
      waves: [
        [{ type: 'boss', id: 'pharaoh', count: 1, interval: 0, hpMultiplier: 2.0 }],
        [{ type: 'mummy', count: 15, interval: 0.8 }],
        [{ type: 'shielded', count: 6, interval: 1.5 }],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'sandweaver',
        'duneCrawler',
      ],
      introText: 'The sun god Ra judges those who enter!',
    },
    9: {
      id: 'desert_9',
      world: 'desert',
      level: 9,
      name: 'Scorpion King',
      pathType: 'spiral',
      hpMultiplier: 2.6,
      speedMultiplier: 1.7,
      rewardMultiplier: 2.6,
      waves: [
        [{ type: 'scorpion', count: 25, interval: 0.3 }],
        [{ type: 'sandWorm', count: 12, interval: 1.0 }],
        [{ type: 'boss', id: 'scorpionKing', count: 1, interval: 0, hpMultiplier: 2.5 }],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'sandweaver',
        'duneCrawler',
      ],
      introText: 'The Scorpion King commands the desert legions!',
    },
    10: {
      id: 'desert_10',
      world: 'desert',
      level: 10,
      name: 'Sands of Time',
      pathType: 'diagonal',
      hpMultiplier: 2.8,
      speedMultiplier: 1.8,
      rewardMultiplier: 2.8,
      waves: [
        [{ type: 'mummy', count: 20, interval: 0.6 }],
        [{ type: 'sandWorm', count: 15, interval: 0.8 }],
        [{ type: 'boss', id: 'pharaoh', count: 2, interval: 2, hpMultiplier: 2.0 }],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'sandweaver',
        'duneCrawler',
      ],
      introText: 'Time itself bends in these sacred sands!',
    },
    11: {
      id: 'desert_11',
      world: 'desert',
      level: 11,
      name: 'Eternal Flame',
      pathType: 'simple',
      hpMultiplier: 3.0,
      speedMultiplier: 1.9,
      rewardMultiplier: 3.0,
      waves: [
        [{ type: 'fast', count: 20, interval: 0.3 }],
        [{ type: 'shielded', count: 10, interval: 1.2 }],
        [{ type: 'mummy', count: 18, interval: 0.5 }],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'sandweaver',
        'duneCrawler',
      ],
      introText: 'The eternal flame burns brighter with each enemy!',
    },
    12: {
      id: 'desert_12',
      world: 'desert',
      level: 12,
      name: 'Desert Throne',
      pathType: 'scurve',
      hpMultiplier: 3.2,
      speedMultiplier: 2.0,
      rewardMultiplier: 3.2,
      waves: [
        [{ type: 'boss', id: 'scorpionKing', count: 1, interval: 0, hpMultiplier: 3.0 }],
        [{ type: 'boss', id: 'pharaoh', count: 1, interval: 0, hpMultiplier: 2.5 }],
        [{ type: 'sandWorm', count: 20, interval: 0.5 }],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'sandweaver',
        'duneCrawler',
      ],
      introText: 'Conquer the Desert Throne to prove your mastery!',
    },
  },

  // Ice World Levels (25-36)
  ice: {
    1: {
      id: 'ice_1',
      world: 'ice',
      level: 1,
      name: 'Frozen Tundra',
      pathType: 'simple',
      hpMultiplier: 1.6,
      speedMultiplier: 1.2,
      rewardMultiplier: 1.6,
      waves: [
        [{ type: 'frostElemental', count: 8, interval: 1.2 }],
        [
          { type: 'iceGolem', count: 3, interval: 2.0 },
          { type: 'frostElemental', count: 6, interval: 1.0 },
        ],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'frostBolt',
        'blizzard',
      ],
      introText: 'The frozen tundra tests your endurance!',
    },
    2: {
      id: 'ice_2',
      world: 'ice',
      level: 2,
      name: 'Glacier Peak',
      pathType: 'diagonal',
      hpMultiplier: 1.8,
      speedMultiplier: 1.3,
      rewardMultiplier: 1.8,
      waves: [
        [{ type: 'frostElemental', count: 12, interval: 1.0 }],
        [{ type: 'iceGolem', count: 5, interval: 1.8 }],
        [{ type: 'snowWolf', count: 8, interval: 0.8 }],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'frostBolt',
        'blizzard',
      ],
      introText: 'The glacier looms above. Ice golems patrol the peaks!',
    },
    3: {
      id: 'ice_3',
      world: 'ice',
      level: 3,
      name: 'Ice Cave',
      pathType: 'doubleback',
      hpMultiplier: 2.0,
      speedMultiplier: 1.4,
      rewardMultiplier: 2.0,
      waves: [
        [{ type: 'iceGolem', count: 6, interval: 1.5 }],
        [
          { type: 'frostElemental', count: 10, interval: 0.8 },
          { type: 'iceGolem', count: 4, interval: 1.5 },
        ],
        [{ type: 'frostMage', count: 3, interval: 2.5 }],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'frostBolt',
        'blizzard',
        'crystalGuard',
      ],
      introText: 'Deep within the ice cave, ancient magic stirs!',
    },
    4: {
      id: 'ice_4',
      world: 'ice',
      level: 4,
      name: 'Snow Village',
      pathType: 'scurve',
      hpMultiplier: 2.2,
      speedMultiplier: 1.5,
      rewardMultiplier: 2.2,
      waves: [
        [{ type: 'snowWolf', count: 15, interval: 0.5 }],
        [{ type: 'frostElemental', count: 12, interval: 0.8 }],
        [{ type: 'iceGolem', count: 8, interval: 1.2 }],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'frostBolt',
        'blizzard',
        'crystalGuard',
      ],
      introText: 'The abandoned village is now home to icy monsters!',
    },
    5: {
      id: 'ice_5',
      world: 'ice',
      level: 5,
      name: 'Frost Keep',
      pathType: 'spiral',
      hpMultiplier: 2.4,
      speedMultiplier: 1.6,
      rewardMultiplier: 2.4,
      waves: [
        [{ type: 'boss', id: 'iceKing', count: 1, interval: 0, hpMultiplier: 2.0 }],
        [{ type: 'frostMage', count: 6, interval: 1.5 }],
        [{ type: 'iceGolem', count: 10, interval: 1.0 }],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'frostBolt',
        'blizzard',
        'crystalGuard',
      ],
      introText: 'The Ice King rules over Frost Keep with frozen authority!',
      unlocksWorld: 'volcanic',
    },
    6: {
      id: 'ice_6',
      world: 'ice',
      level: 6,
      name: 'Crystal Cavern',
      pathType: 'simple',
      hpMultiplier: 2.6,
      speedMultiplier: 1.7,
      rewardMultiplier: 2.6,
      waves: [
        [{ type: 'crystalSpider', count: 10, interval: 0.8 }],
        [{ type: 'frostMage', count: 8, interval: 1.2 }],
        [{ type: 'iceGolem', count: 12, interval: 1.0 }],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'frostBolt',
        'blizzard',
        'crystalGuard',
      ],
      introText: 'Crystal spiders guard the cavern depths!',
    },
    7: {
      id: 'ice_7',
      world: 'ice',
      level: 7,
      name: 'Winter Storm',
      pathType: 'diagonal',
      hpMultiplier: 2.8,
      speedMultiplier: 1.8,
      rewardMultiplier: 2.8,
      waves: [
        [{ type: 'frostElemental', count: 20, interval: 0.4 }],
        [{ type: 'snowWolf', count: 15, interval: 0.5 }],
        [{ type: 'iceGolem', count: 10, interval: 1.2 }],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'frostBolt',
        'blizzard',
        'crystalGuard',
      ],
      introText: 'A winter storm rages! Visibility is near zero!',
    },
    8: {
      id: 'ice_8',
      world: 'ice',
      level: 8,
      name: 'Frozen Throne',
      pathType: 'doubleback',
      hpMultiplier: 3.0,
      speedMultiplier: 1.9,
      rewardMultiplier: 3.0,
      waves: [
        [{ type: 'boss', id: 'iceQueen', count: 1, interval: 0, hpMultiplier: 2.5 }],
        [{ type: 'frostMage', count: 10, interval: 1.0 }],
        [{ type: 'shielded', count: 8, interval: 1.5 }],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'frostBolt',
        'blizzard',
        'crystalGuard',
      ],
      introText: 'The Ice Queen sits upon her frozen throne!',
    },
    9: {
      id: 'ice_9',
      world: 'ice',
      level: 9,
      name: 'Permafrost Deep',
      pathType: 'scurve',
      hpMultiplier: 3.2,
      speedMultiplier: 2.0,
      rewardMultiplier: 3.2,
      waves: [
        [{ type: 'iceGolem', count: 15, interval: 0.8 }],
        [{ type: 'frostElemental', count: 25, interval: 0.3 }],
        [{ type: 'frostMage', count: 8, interval: 1.5 }],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'frostBolt',
        'blizzard',
        'crystalGuard',
      ],
      introText: 'The permafrost runs deep with ancient ice magic!',
    },
    10: {
      id: 'ice_10',
      world: 'ice',
      level: 10,
      name: 'Glacier Heart',
      pathType: 'spiral',
      hpMultiplier: 3.5,
      speedMultiplier: 2.1,
      rewardMultiplier: 3.5,
      waves: [
        [{ type: 'boss', id: 'iceKing', count: 1, interval: 0, hpMultiplier: 3.0 }],
        [{ type: 'boss', id: 'iceQueen', count: 1, interval: 0, hpMultiplier: 2.5 }],
        [{ type: 'iceGolem', count: 20, interval: 0.6 }],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'frostBolt',
        'blizzard',
        'crystalGuard',
      ],
      introText: 'The heart of the glacier pulses with frozen power!',
    },
    11: {
      id: 'ice_11',
      world: 'ice',
      level: 11,
      name: "Ice Dragon's Lair",
      pathType: 'simple',
      hpMultiplier: 3.8,
      speedMultiplier: 2.2,
      rewardMultiplier: 3.8,
      waves: [
        [{ type: 'boss', id: 'iceDragon', count: 1, interval: 0, hpMultiplier: 3.5 }],
        [{ type: 'frostElemental', count: 30, interval: 0.2 }],
        [{ type: 'iceGolem', count: 15, interval: 0.8 }],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'frostBolt',
        'blizzard',
        'crystalGuard',
      ],
      introText: 'The Ice Dragon awakens from its millennia-long slumber!',
    },
    12: {
      id: 'ice_12',
      world: 'ice',
      level: 12,
      name: 'Eternal Winter',
      pathType: 'diagonal',
      hpMultiplier: 4.0,
      speedMultiplier: 2.3,
      rewardMultiplier: 4.0,
      waves: [
        [{ type: 'boss', id: 'iceDragon', count: 1, interval: 0, hpMultiplier: 4.0 }],
        [{ type: 'boss', id: 'iceKing', count: 1, interval: 0, hpMultiplier: 3.5 }],
        [{ type: 'frostElemental', count: 40, interval: 0.15 }],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'frostBolt',
        'blizzard',
        'crystalGuard',
      ],
      introText: 'Eternal winter consumes all. Only you can stop it!',
    },
  },

  // Volcanic World Levels (37-48)
  volcanic: {
    1: {
      id: 'volcanic_1',
      world: 'volcanic',
      level: 1,
      name: 'Lava Flows',
      pathType: 'simple',
      hpMultiplier: 2.0,
      speedMultiplier: 1.4,
      rewardMultiplier: 2.0,
      waves: [
        [{ type: 'lavaElemental', count: 8, interval: 1.2 }],
        [{ type: 'fireImp', count: 12, interval: 0.8 }],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'frostBolt',
        'blizzard',
        'magmaCannon',
        'geyser',
      ],
      introText: 'Molten lava flows through the volcanic landscape!',
    },
    2: {
      id: 'volcanic_2',
      world: 'volcanic',
      level: 2,
      name: 'Cinder Valley',
      pathType: 'scurve',
      hpMultiplier: 2.2,
      speedMultiplier: 1.5,
      rewardMultiplier: 2.2,
      waves: [
        [{ type: 'fireImp', count: 15, interval: 0.6 }],
        [{ type: 'lavaElemental', count: 8, interval: 1.0 }],
        [{ type: 'ashDrake', count: 3, interval: 2.0 }],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'frostBolt',
        'blizzard',
        'magmaCannon',
        'geyser',
      ],
      introText: 'Ash drakes circle the cinder valley!',
    },
    3: {
      id: 'volcanic_3',
      world: 'volcanic',
      level: 3,
      name: 'Volcano Lair',
      pathType: 'doubleback',
      hpMultiplier: 2.4,
      speedMultiplier: 1.6,
      rewardMultiplier: 2.4,
      waves: [
        [{ type: 'lavaGolem', count: 4, interval: 2.0 }],
        [{ type: 'fireImp', count: 18, interval: 0.5 }],
        [{ type: 'lavaElemental', count: 10, interval: 0.8 }],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'frostBolt',
        'blizzard',
        'magmaCannon',
        'geyser',
        'lavaGolem',
      ],
      introText: 'Lava golems guard the volcano entrance!',
    },
    4: {
      id: 'volcanic_4',
      world: 'volcanic',
      level: 4,
      name: 'Fire Dungeon',
      pathType: 'diagonal',
      hpMultiplier: 2.6,
      speedMultiplier: 1.7,
      rewardMultiplier: 2.6,
      waves: [
        [{ type: 'lavaGolem', count: 6, interval: 1.5 }],
        [{ type: 'fireDemon', count: 4, interval: 2.0 }],
        [{ type: 'lavaElemental', count: 15, interval: 0.6 }],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'frostBolt',
        'blizzard',
        'magmaCannon',
        'geyser',
        'lavaGolem',
      ],
      introText: 'Fire demons lurk in the depths of the dungeon!',
    },
    5: {
      id: 'volcanic_5',
      world: 'volcanic',
      level: 5,
      name: 'Molten Core',
      pathType: 'spiral',
      hpMultiplier: 2.8,
      speedMultiplier: 1.8,
      rewardMultiplier: 2.8,
      waves: [
        [{ type: 'boss', id: 'fireElementalLord', count: 1, interval: 0, hpMultiplier: 2.5 }],
        [{ type: 'lavaGolem', count: 8, interval: 1.2 }],
        [{ type: 'fireDemon', count: 6, interval: 1.5 }],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'frostBolt',
        'blizzard',
        'magmaCannon',
        'geyser',
        'lavaGolem',
      ],
      introText: 'The Fire Elemental Lord guards the molten core!',
      unlocksWorld: 'cosmic',
    },
    6: {
      id: 'volcanic_6',
      world: 'volcanic',
      level: 6,
      name: 'Eruption Zone',
      pathType: 'simple',
      hpMultiplier: 3.0,
      speedMultiplier: 1.9,
      rewardMultiplier: 3.0,
      waves: [
        [{ type: 'fireImp', count: 30, interval: 0.3 }],
        [{ type: 'ashDrake', count: 8, interval: 1.0 }],
        [{ type: 'lavaElemental', count: 15, interval: 0.5 }],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'frostBolt',
        'blizzard',
        'magmaCannon',
        'geyser',
        'lavaGolem',
      ],
      introText: 'The volcano is about to erupt!',
    },
    7: {
      id: 'volcanic_7',
      world: 'volcanic',
      level: 7,
      name: 'Inferno Pits',
      pathType: 'scurve',
      hpMultiplier: 3.2,
      speedMultiplier: 2.0,
      rewardMultiplier: 3.2,
      waves: [
        [{ type: 'fireDemon', count: 10, interval: 1.0 }],
        [{ type: 'lavaGolem', count: 12, interval: 1.0 }],
        [{ type: 'boss', id: 'pitLord', count: 1, interval: 0, hpMultiplier: 2.5 }],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'frostBolt',
        'blizzard',
        'magmaCannon',
        'geyser',
        'lavaGolem',
      ],
      introText: 'The Pit Lord commands the inferno pits!',
    },
    8: {
      id: 'volcanic_8',
      world: 'volcanic',
      level: 8,
      name: 'Magma Chamber',
      pathType: 'doubleback',
      hpMultiplier: 3.5,
      speedMultiplier: 2.1,
      rewardMultiplier: 3.5,
      waves: [
        [{ type: 'lavaGolem', count: 15, interval: 0.8 }],
        [{ type: 'fireDemon', count: 12, interval: 1.0 }],
        [{ type: 'ashDrake', count: 10, interval: 0.8 }],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'frostBolt',
        'blizzard',
        'magmaCannon',
        'geyser',
        'lavaGolem',
      ],
      introText: 'The magma chamber bubbles with dangerous energy!',
    },
    9: {
      id: 'volcanic_9',
      world: 'volcanic',
      level: 9,
      name: 'Volcano Summit',
      pathType: 'spiral',
      hpMultiplier: 3.8,
      speedMultiplier: 2.2,
      rewardMultiplier: 3.8,
      waves: [
        [{ type: 'boss', id: 'volcanoGod', count: 1, interval: 0, hpMultiplier: 3.0 }],
        [{ type: 'lavaGolem', count: 20, interval: 0.6 }],
        [{ type: 'fireDemon', count: 15, interval: 0.8 }],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'frostBolt',
        'blizzard',
        'magmaCannon',
        'geyser',
        'lavaGolem',
      ],
      introText: 'The Volcano God awaits at the summit!',
    },
    10: {
      id: 'volcanic_10',
      world: 'volcanic',
      level: 10,
      name: 'Abyssal Fire',
      pathType: 'diagonal',
      hpMultiplier: 4.0,
      speedMultiplier: 2.3,
      rewardMultiplier: 4.0,
      waves: [
        [{ type: 'boss', id: 'fireElementalLord', count: 1, interval: 0, hpMultiplier: 3.5 }],
        [{ type: 'boss', id: 'pitLord', count: 1, interval: 0, hpMultiplier: 3.0 }],
        [{ type: 'lavaGolem', count: 25, interval: 0.5 }],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'frostBolt',
        'blizzard',
        'magmaCannon',
        'geyser',
        'lavaGolem',
      ],
      introText: 'Abyssal fire consumes all in its path!',
    },
    11: {
      id: 'volcanic_11',
      world: 'volcanic',
      level: 11,
      name: "Hell's Gate",
      pathType: 'simple',
      hpMultiplier: 4.3,
      speedMultiplier: 2.4,
      rewardMultiplier: 4.3,
      waves: [
        [{ type: 'fireDemon', count: 20, interval: 0.4 }],
        [{ type: 'lavaElemental', count: 30, interval: 0.3 }],
        [{ type: 'boss', id: 'demonKing', count: 1, interval: 0, hpMultiplier: 4.0 }],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'frostBolt',
        'blizzard',
        'magmaCannon',
        'geyser',
        'lavaGolem',
      ],
      introText: "Hell's Gate opens! The Demon King rises!",
    },
    12: {
      id: 'volcanic_12',
      world: 'volcanic',
      level: 12,
      name: 'Core Apocalypse',
      pathType: 'scurve',
      hpMultiplier: 4.5,
      speedMultiplier: 2.5,
      rewardMultiplier: 4.5,
      waves: [
        [{ type: 'boss', id: 'volcanoGod', count: 1, interval: 0, hpMultiplier: 4.0 }],
        [{ type: 'boss', id: 'demonKing', count: 1, interval: 0, hpMultiplier: 4.5 }],
        [{ type: 'lavaGolem', count: 30, interval: 0.3 }],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'frostBolt',
        'blizzard',
        'magmaCannon',
        'geyser',
        'lavaGolem',
      ],
      introText: 'The apocalypse begins! Defeat the fire lords!',
    },
  },

  // Cosmic World Levels (49-60)
  cosmic: {
    1: {
      id: 'cosmic_1',
      world: 'cosmic',
      level: 1,
      name: 'Nebula Fields',
      pathType: 'simple',
      hpMultiplier: 2.5,
      speedMultiplier: 1.6,
      rewardMultiplier: 2.5,
      waves: [
        [{ type: 'cosmicDrifter', count: 10, interval: 1.0 }],
        [{ type: 'voidSpawn', count: 8, interval: 1.2 }],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'frostBolt',
        'blizzard',
        'magmaCannon',
        'geyser',
        'lavaGolem',
        'plasma',
        'voidEye',
        'starForge',
      ],
      introText: 'Enter the cosmic void. Stars shimmer in the distance...',
    },
    2: {
      id: 'cosmic_2',
      world: 'cosmic',
      level: 2,
      name: 'Asteroid Belt',
      pathType: 'scurve',
      hpMultiplier: 2.7,
      speedMultiplier: 1.7,
      rewardMultiplier: 2.7,
      waves: [
        [{ type: 'voidSpawn', count: 15, interval: 0.6 }],
        [{ type: 'cosmicDrifter', count: 12, interval: 0.8 }],
        [{ type: 'starSentinel', count: 4, interval: 2.0 }],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'frostBolt',
        'blizzard',
        'magmaCannon',
        'geyser',
        'lavaGolem',
        'plasma',
        'voidEye',
        'starForge',
      ],
      introText: 'Navigate through the treacherous asteroid belt!',
    },
    3: {
      id: 'cosmic_3',
      world: 'cosmic',
      level: 3,
      name: 'Dark Matter',
      pathType: 'diagonal',
      hpMultiplier: 2.9,
      speedMultiplier: 1.8,
      rewardMultiplier: 2.9,
      waves: [
        [{ type: 'voidSpawn', count: 18, interval: 0.5 }],
        [{ type: 'darkMatter', count: 5, interval: 1.8 }],
        [{ type: 'cosmicDrifter', count: 15, interval: 0.6 }],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'frostBolt',
        'blizzard',
        'magmaCannon',
        'geyser',
        'lavaGolem',
        'plasma',
        'voidEye',
        'starForge',
      ],
      introText: 'Dark matter warps reality itself!',
    },
    4: {
      id: 'cosmic_4',
      world: 'cosmic',
      level: 4,
      name: 'Supernova Remnant',
      pathType: 'doubleback',
      hpMultiplier: 3.2,
      speedMultiplier: 1.9,
      rewardMultiplier: 3.2,
      waves: [
        [{ type: 'starSentinel', count: 8, interval: 1.2 }],
        [{ type: 'cosmicDrifter', count: 20, interval: 0.4 }],
        [{ type: 'voidLord', count: 2, interval: 3.0 }],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'frostBolt',
        'blizzard',
        'magmaCannon',
        'geyser',
        'lavaGolem',
        'plasma',
        'voidEye',
        'starForge',
      ],
      introText: 'The supernova remnant glows with intense radiation!',
    },
    5: {
      id: 'cosmic_5',
      world: 'cosmic',
      level: 5,
      name: 'Black Hole Edge',
      pathType: 'spiral',
      hpMultiplier: 3.5,
      speedMultiplier: 2.0,
      rewardMultiplier: 3.5,
      waves: [
        [{ type: 'boss', id: 'voidBehemoth', count: 1, interval: 0, hpMultiplier: 3.0 }],
        [{ type: 'darkMatter', count: 10, interval: 1.0 }],
        [{ type: 'voidSpawn', count: 25, interval: 0.3 }],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'frostBolt',
        'blizzard',
        'magmaCannon',
        'geyser',
        'lavaGolem',
        'plasma',
        'voidEye',
        'starForge',
      ],
      introText: 'The void behemoth guards the black hole edge!',
    },
    6: {
      id: 'cosmic_6',
      world: 'cosmic',
      level: 6,
      name: 'Stellar Nursery',
      pathType: 'simple',
      hpMultiplier: 3.8,
      speedMultiplier: 2.1,
      rewardMultiplier: 3.8,
      waves: [
        [{ type: 'cosmicDrifter', count: 30, interval: 0.25 }],
        [{ type: 'starSentinel', count: 12, interval: 0.8 }],
        [{ type: 'voidSpawn', count: 20, interval: 0.4 }],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'frostBolt',
        'blizzard',
        'magmaCannon',
        'geyser',
        'lavaGolem',
        'plasma',
        'voidEye',
        'starForge',
      ],
      introText: 'New stars are born in the stellar nursery!',
    },
    7: {
      id: 'cosmic_7',
      world: 'cosmic',
      level: 7,
      name: 'Cosmic Temple',
      pathType: 'scurve',
      hpMultiplier: 4.0,
      speedMultiplier: 2.2,
      rewardMultiplier: 4.0,
      waves: [
        [{ type: 'starSentinel', count: 15, interval: 0.6 }],
        [{ type: 'voidLord', count: 5, interval: 1.5 }],
        [{ type: 'boss', id: 'cosmicGuardian', count: 1, interval: 0, hpMultiplier: 3.5 }],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'frostBolt',
        'blizzard',
        'magmaCannon',
        'geyser',
        'lavaGolem',
        'plasma',
        'voidEye',
        'starForge',
      ],
      introText: 'The Cosmic Guardian protects the ancient temple!',
    },
    8: {
      id: 'cosmic_8',
      world: 'cosmic',
      level: 8,
      name: 'Galaxy Core',
      pathType: 'diagonal',
      hpMultiplier: 4.3,
      speedMultiplier: 2.3,
      rewardMultiplier: 4.3,
      waves: [
        [{ type: 'darkMatter', count: 15, interval: 0.8 }],
        [{ type: 'voidSpawn', count: 35, interval: 0.2 }],
        [{ type: 'voidLord', count: 8, interval: 1.0 }],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'frostBolt',
        'blizzard',
        'magmaCannon',
        'geyser',
        'lavaGolem',
        'plasma',
        'voidEye',
        'starForge',
      ],
      introText: 'The galaxy core pulses with ancient cosmic energy!',
    },
    9: {
      id: 'cosmic_9',
      world: 'cosmic',
      level: 9,
      name: 'Event Horizon',
      pathType: 'doubleback',
      hpMultiplier: 4.5,
      speedMultiplier: 2.4,
      rewardMultiplier: 4.5,
      waves: [
        [{ type: 'boss', id: 'voidBehemoth', count: 1, interval: 0, hpMultiplier: 4.0 }],
        [{ type: 'darkMatter', count: 20, interval: 0.5 }],
        [{ type: 'voidLord', count: 10, interval: 0.8 }],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'frostBolt',
        'blizzard',
        'magmaCannon',
        'geyser',
        'lavaGolem',
        'plasma',
        'voidEye',
        'starForge',
      ],
      introText: 'Cross the event horizon at your own risk!',
    },
    10: {
      id: 'cosmic_10',
      world: 'cosmic',
      level: 10,
      name: 'Cosmic Throne',
      pathType: 'spiral',
      hpMultiplier: 4.8,
      speedMultiplier: 2.5,
      rewardMultiplier: 4.8,
      waves: [
        [{ type: 'boss', id: 'cosmicGuardian', count: 1, interval: 0, hpMultiplier: 4.5 }],
        [{ type: 'boss', id: 'voidLord', count: 2, interval: 2.0, hpMultiplier: 3.5 }],
        [{ type: 'starSentinel', count: 20, interval: 0.4 }],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'frostBolt',
        'blizzard',
        'magmaCannon',
        'geyser',
        'lavaGolem',
        'plasma',
        'voidEye',
        'starForge',
      ],
      introText: 'The Cosmic Throne awaits the worthy!',
    },
    11: {
      id: 'cosmic_11',
      world: 'cosmic',
      level: 11,
      name: 'Dimension Rift',
      pathType: 'simple',
      hpMultiplier: 5.0,
      speedMultiplier: 2.6,
      rewardMultiplier: 5.0,
      waves: [
        [{ type: 'voidSpawn', count: 50, interval: 0.15 }],
        [{ type: 'darkMatter', count: 25, interval: 0.4 }],
        [{ type: 'boss', id: 'dimensionRift', count: 1, interval: 0, hpMultiplier: 5.0 }],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'frostBolt',
        'blizzard',
        'magmaCannon',
        'geyser',
        'lavaGolem',
        'plasma',
        'voidEye',
        'starForge',
      ],
      introText: 'A dimension rift tears through reality!',
    },
    12: {
      id: 'cosmic_12',
      world: 'cosmic',
      level: 12,
      name: 'Cosmic Finality',
      pathType: 'scurve',
      hpMultiplier: 5.5,
      speedMultiplier: 2.8,
      rewardMultiplier: 5.5,
      waves: [
        [{ type: 'boss', id: 'cosmicDestroyer', count: 1, interval: 0, hpMultiplier: 6.0 }],
        [{ type: 'boss', id: 'voidLord', count: 3, interval: 1.5, hpMultiplier: 4.0 }],
        [{ type: 'darkMatter', count: 30, interval: 0.3 }],
      ],
      availableTowers: [
        'basic',
        'splash',
        'ice',
        'archer',
        'flamethrower',
        'frostBolt',
        'blizzard',
        'magmaCannon',
        'geyser',
        'lavaGolem',
        'plasma',
        'voidEye',
        'starForge',
      ],
      introText: 'The ultimate challenge! Face the Cosmic Destroyer!',
    },
  },
};

// Tower categories for organized display with unlock requirements
export const TOWER_CATEGORIES = {
  basic: {
    id: 'basic',
    name: 'Basic Towers',
    description: 'Essential towers available from the start',
    unlockRequirement: null, // Available from start
    towers: ['basic', 'splash'],
  },
  forest: {
    id: 'forest',
    name: 'Forest Towers',
    description: 'Nature-based towers from the Forest World',
    unlockRequirement: { world: 'forest', level: 3 },
    towers: ['archer', 'trapper', 'sentinel'],
  },
  support: {
    id: 'support',
    name: 'Support Towers',
    description: 'Buff towers to enhance your defenses',
    unlockRequirement: { world: 'forest', level: 5 },
    towers: ['speedBoost', 'damageAmp', 'rangeExtend', 'critChance', 'healingAura', 'energyShield'],
  },
  desert: {
    id: 'desert',
    name: 'Desert Towers',
    description: 'Fire and sand towers from the Desert World',
    unlockRequirement: { world: 'desert', level: 3 },
    towers: ['flamethrower', 'sandweaver', 'duneCrawler'],
  },
  ice: {
    id: 'ice',
    name: 'Ice Towers',
    description: 'Frozen towers from the Ice World',
    unlockRequirement: { world: 'ice', level: 3 },
    towers: ['frostBolt', 'blizzard', 'crystalGuard'],
  },
  volcanic: {
    id: 'volcanic',
    name: 'Volcanic Towers',
    description: 'Magma towers from the Volcanic World',
    unlockRequirement: { world: 'volcanic', level: 3 },
    towers: ['magmaCannon', 'geyser', 'lavaGolem'],
  },
  cosmic: {
    id: 'cosmic',
    name: 'Cosmic Towers',
    description: 'Stellar towers from the Cosmic World',
    unlockRequirement: { world: 'cosmic', level: 3 },
    towers: ['plasma', 'voidEye', 'starForge'],
  },
  sniper: {
    id: 'sniper',
    name: 'Sniper Towers',
    description: 'Long-range precision towers',
    unlockRequirement: { world: 'forest', level: 6 },
    towers: ['sniper'],
  },
  poison: {
    id: 'poison',
    name: 'Poison Towers',
    description: 'Toxic damage over time',
    unlockRequirement: { world: 'forest', level: 5 },
    towers: ['poison'],
  },
  ice_tower: {
    id: 'ice_tower',
    name: 'Ice Tower',
    description: 'Slows enemies with ice attacks',
    unlockRequirement: { world: 'forest', level: 3 },
    towers: ['ice'],
  },
};

// Check if a tower category is unlocked
export function isCategoryUnlocked(categoryId, progression = null) {
  const category = TOWER_CATEGORIES[categoryId];
  if (!category) return false;

  // No requirement = always unlocked
  if (!category.unlockRequirement) return true;

  // If no progression provided, assume locked (caller should provide progression)
  if (!progression) return false;

  const { world, level } = category.unlockRequirement;
  const levelKey = `${world}_${level}`;
  const levelProgress = progression.levels?.[levelKey];

  return levelProgress && levelProgress.completed;
}

// Get all unlocked towers based on progression (caller must pass progression)
export function getUnlockedTowers(progression = null) {
  if (!progression) {
    // Return default towers if no progression provided
    return ['basic', 'splash', 'ice', 'sniper', 'poison'];
  }

  const unlockedTowers = [];
  for (const [categoryId, category] of Object.entries(TOWER_CATEGORIES)) {
    if (isCategoryUnlocked(categoryId, progression)) {
      unlockedTowers.push(...category.towers);
    }
  }
  return unlockedTowers;
}

// Get unlocked tower categories (caller must pass progression)
export function getUnlockedCategories(progression = null) {
  const categories = [];
  for (const [categoryId, category] of Object.entries(TOWER_CATEGORIES)) {
    if (isCategoryUnlocked(categoryId, progression)) {
      categories.push({
        ...category,
        unlocked: true,
      });
    } else {
      categories.push({
        ...category,
        unlocked: false,
        progressNeeded: category.unlockRequirement
          ? `${category.unlockRequirement.world} Level ${category.unlockRequirement.level}`
          : null,
      });
    }
  }
  return categories;
}

// ── Enemy Unlock System ─────────────────────────────────────────
// Enemy categories for unlockable progression
export const ENEMY_CATEGORIES = {
  basic: {
    id: 'basic',
    name: 'Basic Enemies',
    description: 'Common enemies found in all worlds',
    unlockRequirement: null, // Available from start
    enemies: ['normal', 'fast', 'tank'],
  },
  support: {
    id: 'support',
    name: 'Support Enemies',
    description: 'Enemies with special support abilities',
    unlockRequirement: { world: 'forest', level: 3 },
    enemies: ['healer', 'shielded'],
  },
  forest: {
    id: 'forest',
    name: 'Forest Enemies',
    description: 'Creatures from the Forest World',
    unlockRequirement: { world: 'forest', level: 1 },
    enemies: ['sproutling', 'briar_runner', 'treant'],
  },
  desert: {
    id: 'desert',
    name: 'Desert Enemies',
    description: 'Creatures from the Desert World',
    unlockRequirement: { world: 'desert', level: 1 },
    enemies: ['scorpion', 'sandWorm', 'mummy', 'pharaoh', 'scorpionKing'],
  },
  ice: {
    id: 'ice',
    name: 'Ice Enemies',
    description: 'Creatures from the Ice World',
    unlockRequirement: { world: 'ice', level: 1 },
    enemies: [
      'frostElemental',
      'iceGolem',
      'snowWolf',
      'frostMage',
      'crystalSpider',
      'iceKing',
      'iceQueen',
      'iceDragon',
    ],
  },
  volcanic: {
    id: 'volcanic',
    name: 'Volcanic Enemies',
    description: 'Creatures from the Volcanic World',
    unlockRequirement: { world: 'volcanic', level: 1 },
    enemies: [
      'lavaElemental',
      'fireImp',
      'ashDrake',
      'lavaGolem',
      'fireDemon',
      'fireElementalLord',
      'pitLord',
      'volcanoGod',
    ],
  },
  cosmic: {
    id: 'cosmic',
    name: 'Cosmic Enemies',
    description: 'Creatures from the Cosmic World',
    unlockRequirement: { world: 'cosmic', level: 1 },
    enemies: ['voidling', 'starCruiser', 'eclipseBoss'],
  },
  boss: {
    id: 'boss',
    name: 'Boss Enemies',
    description: 'Powerful boss enemies',
    unlockRequirement: { world: 'forest', level: 10 },
    enemies: [
      'boss',
      'pharaoh',
      'scorpionKing',
      'iceKing',
      'iceQueen',
      'iceDragon',
      'fireElementalLord',
      'pitLord',
      'volcanoGod',
      'eclipseBoss',
    ],
  },
};

// Check if an enemy category is unlocked
export function isEnemyCategoryUnlocked(categoryId, progression = null) {
  const category = ENEMY_CATEGORIES[categoryId];
  if (!category) return false;

  if (!category.unlockRequirement) return true;

  // If no progression provided, assume locked
  if (!progression) return false;

  const { world, level } = category.unlockRequirement;
  const levelKey = `${world}_${level}`;
  const levelProgress = progression.levels?.[levelKey];

  return levelProgress && levelProgress.completed;
}

// Get all unlocked enemies based on progression (caller must pass progression)
export function getUnlockedEnemies(progression = null) {
  if (!progression) {
    // Return default enemies if no progression
    return ['normal', 'fast', 'tank'];
  }

  const unlockedEnemies = [];
  for (const [categoryId, category] of Object.entries(ENEMY_CATEGORIES)) {
    if (isEnemyCategoryUnlocked(categoryId, progression)) {
      unlockedEnemies.push(...category.enemies);
    }
  }
  return unlockedEnemies;
}

// Enemy scaling configuration - BALANCED DIFFICULTY WITH PROGRESSIVE CURVES
// Progressive scaling: gentler early, harder late, extreme at 100+
export const ENEMY_SCALING = {
  // Progressive HP scaling - base increase with compounding
  hpMultiplierPerWave: 0.15, // 15% HP increase per wave base
  hpGrowthExponent: 1.12, // 12% compounding per wave

  // Speed scaling - capped to prevent unplayable speeds
  speedMultiplierPerWave: 0.04, // 4% speed increase per wave
  maxSpeedMultiplier: 2.5, // Cap at 2.5x speed

  // Reward scaling - keeps up with tower costs
  rewardMultiplierPerWave: 0.1, // 10% more gold per wave

  // Mid-game difficulty spike for challenge (moved to wave 10)
  difficultPhaseStart: 10, // Waves 10+ get harder
  difficultPhaseMultiplier: 1.4, // 40% extra scaling

  // Late wave bonuses (moved to wave 30)
  lateWaveThreshold: 30, // Waves beyond this get extra scaling
  lateWaveHpBonus: 0.5, // Extra 50% HP for waves 30+

  // Additional multipliers for extreme late game
  wave70Multiplier: 1.8, // 80% extra HP for waves 70+
  wave100Multiplier: 2.5, // 150% extra HP for waves 100+

  // Regeneration - starts later and is weaker
  lateWaveRegenThreshold: 15, // Enemies start regenerating at wave 15
  regenAmountPerWave: 0.8, // +0.8 HP/sec regen per wave
  maxRegenAmount: 20, // Cap regen at 20 HP/sec

  // Boss scaling - separate from wave scaling
  bossHpMultiplier: 3.5, // Bosses get 3.5x HP
  bossSpeedMultiplier: 1.8, // Bosses get 1.8x speed

  // World difficulty bonuses
  worldBonus: {
    forest: 1.0,
    desert: 1.4,
    ice: 1.8,
    volcanic: 2.2,
    cosmic: 2.8,
  },

  // Endless mode difficulty spikes
  endlessDifficultySpike: {
    wave30Multiplier: 1.5, // All stats +50% at wave 30
    wave50Multiplier: 2.0, // All stats double at wave 50
  },
};

// Calculate enemy stats with progressive scaling
export function calculateEnemyStats(
  baseEnemy,
  waveNumber,
  worldId = 'forest',
  isBoss = false,
  isEndless = false
) {
  const scaling = ENEMY_SCALING;
  const worldBonus = scaling.worldBonus[worldId] || 1.0;

  // Progressive HP scaling with exponent for gentler start, harder late
  const waveExcess = waveNumber - 1;
  const compoundingBonus = Math.pow(scaling.hpGrowthExponent, waveExcess);
  let hpMultiplier = (1.0 + waveExcess * scaling.hpMultiplierPerWave) * compoundingBonus;

  // Mid-game difficulty spike at wave 10
  if (waveNumber >= scaling.difficultPhaseStart) {
    hpMultiplier *= scaling.difficultPhaseMultiplier;
  }

  // Late wave bonus (wave 30+)
  if (waveNumber > scaling.lateWaveThreshold) {
    hpMultiplier += scaling.lateWaveHpBonus;
  }

  // Wave 70+ extreme scaling
  if (waveNumber >= 70) {
    hpMultiplier *= scaling.wave70Multiplier;
  }

  // Wave 100+ near-impossible scaling
  if (waveNumber >= 100) {
    hpMultiplier *= scaling.wave100Multiplier;
  }

  hpMultiplier *= worldBonus;

  // Endless mode difficulty spikes
  if (isEndless) {
    if (waveNumber >= 30) {
      hpMultiplier *= scaling.endlessDifficultySpike.wave30Multiplier;
    }
    if (waveNumber >= 50) {
      hpMultiplier *= scaling.endlessDifficultySpike.wave50Multiplier;
    }
  }

  // Speed multiplier with cap
  let speedMultiplier = 1.0 + (waveNumber - 1) * scaling.speedMultiplierPerWave;
  // Cap speed to prevent unplayable game
  speedMultiplier = Math.min(speedMultiplier, scaling.maxSpeedMultiplier);

  if (isBoss) {
    speedMultiplier *= scaling.bossSpeedMultiplier;
  }

  // Reward multiplier scales with HP (higher HP = higher reward value)
  const rewardMultiplier = hpMultiplier * 0.8;

  return {
    hp: Math.round(baseEnemy.hp * hpMultiplier),
    speed: Math.round(baseEnemy.speed * speedMultiplier),
    reward: Math.round(baseEnemy.reward * rewardMultiplier),
  };
}

export function getWorldLevels(worldId) {
  return LEVELS[worldId] || null;
}
