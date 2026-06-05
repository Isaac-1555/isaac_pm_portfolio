export const COLORS = {
  bgBase: '#C4C8C3',
  bgDark: '#3E4C4D',
  bgAccent: '#5A6366',
  textPrimary: '#2B3233',
  textSecondary: '#667073',
  cta: '#F25F5C',
  warning: '#D97B4A',
  success: '#8B9E6B',
  tech: '#4A7C7E',
  gold: '#E07A5F',
  card: '#B5B9B5',
  divider: '#7A8082',
} as const;

export const BASE_WIDTH = 400;
export const BASE_HEIGHT = 520;

export const PLAYER_WIDTH = 38;
export const PLAYER_HEIGHT = 40;
export const PLAYER_SPEED = 260;
export const PLAYER_ACCELERATION = 1400;
export const PLAYER_FRICTION = 900;

export const BULLET_WIDTH = 3;
export const BULLET_HEIGHT = 10;
export const BULLET_SPEED = 480;

export const GENERIC_ENEMY_WIDTH = 36;
export const GENERIC_ENEMY_HEIGHT = 30;

export const WAVE_SIDE_STEP_BASE = 12;
export const WAVE_SIDE_STEP_PER_LEVEL = 3;
export const WAVE_SIDE_STEP_PER_STEP = 2;
export const WAVE_SIDE_STEP_MAX = 22;
export const WAVE_DESCEND_STEP_BASE = 16;
export const WAVE_DESCEND_STEP_PER_LEVEL = 3;
export const WAVE_DESCEND_STEP_MAX = 36;
export const WAVE_BASE_INTERVAL = 0.5;
export const WAVE_SPEED_INCREMENT = 0.03;
export const WAVE_MIN_INTERVAL = 0.1;
export const WAVE_ALL_DEAD_DELAY = 1;

export const PROJECT_ENEMY_WIDTH = 42;
export const PROJECT_ENEMY_HEIGHT = 42;
export const SHOOT_COOLDOWN = 0.3;
export const PROJECT_ENEMY_SPEED_BASE = 35;
export const PROJECT_ENEMY_SPEED_PER_WAVE = 5;
export const PROJECT_ENEMY_SPEED_MAX = 130;
export const PROJECT_SPAWN_MIN_BASE = 9;
export const PROJECT_SPAWN_MIN_PER_WAVE = 0.4;
export const PROJECT_SPAWN_MIN_MIN = 2;
export const PROJECT_SPAWN_MAX_BASE = 14;
export const PROJECT_SPAWN_MAX_PER_WAVE = 0.5;
export const PROJECT_SPAWN_MAX_MIN = 4;
export const PROJECT_MAX_CONCURRENT_BASE = 1;
export const PROJECT_MAX_CONCURRENT_PER_LEVEL = 3;

export const LOOT_ITEM_SIZE = 16;
export const LOOT_TRAY_X = BASE_WIDTH - 15;
export const LOOT_TRAY_START_Y = 36;
export const LOOT_TRAY_GAP = 24;
export const LOOT_CLICK_THRESHOLD = 14;
export const LOOT_ANIM_SPEED = 4;

export const EXPLOSION_PARTICLE_COUNT = 18;
export const PARTICLE_MAX_LIFE = 0.8;
export const PARTICLE_SPEED_MIN = 50;
export const PARTICLE_SPEED_MAX = 150;

export const STAR_COUNT = 35;

export const SCORE_STANDARD = 10;
export const SCORE_TOUGH = 25;
export const SCORE_FAST = 15;
export const SCORE_PROJECT = 50;

export const HIGH_SCORE_KEY = 'portfolio-game-hs';

export const INITIAL_LIVES = 3;
export const INVULNERABLE_TIME = 2;
export const SHAKE_INTENSITY = 6;
export const SHAKE_DECAY = 8;
export const SCORE_POPUP_LIFETIME = 0.8;
export const WAVE_TEXT_DURATION = 1.8;
export const PLAYER_BLINK_RATE = 14;

export interface GameProject {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  websiteUrl: string;
  repoUrl: string;
  color: string;
}

export const GAME_PROJECTS: GameProject[] = [
  {
    id: 'satbrain',
    title: 'SatBrain',
    subtitle: 'AI-Powered Study Assistant',
    description:
      'Transforms documents into interactive learning materials with AI summaries, quizzes, flashcards, and visual charts.',
    tags: ['AI/ML', 'EdTech', 'Full Stack'],
    websiteUrl: 'https://satbrain.vercel.app/',
    repoUrl: 'https://github.com/Isaac-1555/project_goldmine',
    color: COLORS.gold,
  },
  {
    id: 'barcode-lists',
    title: 'Barcode Lists',
    subtitle: 'Internal Chrome Extension',
    description:
      'Streamlines barcode management with shared access and AI-powered extraction for Calgary Coop store personnel.',
    tags: ['Chrome Ext', 'AI/OCR', 'Internal Tool'],
    websiteUrl:
      'https://chromewebstore.google.com/detail/barcode-lists/colpoghjdbjnmciefnipaefbdflgjifg',
    repoUrl: 'https://github.com/Isaac-1555/Barcode-Lists',
    color: COLORS.tech,
  },
  {
    id: 'pocket-resume',
    title: 'Pocket Resume',
    subtitle: 'Context-Aware AI Browser Extension',
    description:
      'Tailors resumes to any job description using AI. Works on LinkedIn, Indeed, and all major job boards.',
    tags: ['GenAI', 'Productivity', 'Chrome Ext'],
    websiteUrl:
      'https://chromewebstore.google.com/detail/pocketresume/mdplmgfkpgalajmchilemiamifoaneip',
    repoUrl: 'https://github.com/Isaac-1555/pocket-resume',
    color: COLORS.warning,
  },
  {
    id: 'd4c',
    title: 'D4C',
    subtitle: 'Personal Coding Agent',
    description:
      'Custom coding agent built from the pi coding agent with personalized preferences and workflow enhancements.',
    tags: ['AI', 'Dev Tool', 'TypeScript'],
    websiteUrl: '',
    repoUrl: 'https://github.com/Isaac-1555/D4C',
    color: COLORS.success,
  },
  {
    id: 'coachgg',
    title: 'CoachGG',
    subtitle: 'Esports Coaching Platform',
    description:
      'Helping amateur esports players reach pro level with team management and analytics features.',
    tags: ['Esports', 'Platform', 'Community'],
    websiteUrl: '',
    repoUrl: 'https://github.com/Isaac-1555/coachgg',
    color: COLORS.cta,
  },
];

export function getWaveInterval(waveNumber: number): number {
  return Math.max(
    WAVE_MIN_INTERVAL,
    WAVE_BASE_INTERVAL - (waveNumber - 1) * WAVE_SPEED_INCREMENT
  );
}

export function getWaveSideStep(waveNumber: number): number {
  const tiers = Math.floor((waveNumber - 1) / WAVE_SIDE_STEP_PER_LEVEL);
  return Math.min(
    WAVE_SIDE_STEP_MAX,
    WAVE_SIDE_STEP_BASE + tiers * WAVE_SIDE_STEP_PER_STEP
  );
}

export function getWaveDescendStep(waveNumber: number): number {
  const tiers = Math.floor((waveNumber - 1) / 2);
  return Math.min(
    WAVE_DESCEND_STEP_MAX,
    WAVE_DESCEND_STEP_BASE + tiers * WAVE_DESCEND_STEP_PER_LEVEL
  );
}

export function getProjectSpawnInterval(waveNumber: number): { min: number; max: number } {
  return {
    min: Math.max(
      PROJECT_SPAWN_MIN_MIN,
      PROJECT_SPAWN_MIN_BASE - (waveNumber - 1) * PROJECT_SPAWN_MIN_PER_WAVE
    ),
    max: Math.max(
      PROJECT_SPAWN_MAX_MIN,
      PROJECT_SPAWN_MAX_BASE - (waveNumber - 1) * PROJECT_SPAWN_MAX_PER_WAVE
    ),
  };
}

export function getProjectSpeed(waveNumber: number): number {
  return Math.min(
    PROJECT_ENEMY_SPEED_MAX,
    PROJECT_ENEMY_SPEED_BASE + (waveNumber - 1) * PROJECT_ENEMY_SPEED_PER_WAVE
  );
}

export function getMaxConcurrentProjectEnemies(waveNumber: number): number {
  return Math.min(
    PROJECT_MAX_CONCURRENT_PER_LEVEL,
    PROJECT_MAX_CONCURRENT_BASE + Math.floor((waveNumber - 1) / 2)
  );
}
