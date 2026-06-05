import {
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  BULLET_WIDTH,
  BULLET_HEIGHT,
  GENERIC_ENEMY_WIDTH,
  GENERIC_ENEMY_HEIGHT,
  PROJECT_ENEMY_WIDTH,
  PROJECT_ENEMY_HEIGHT,
  EXPLOSION_PARTICLE_COUNT,
  PARTICLE_MAX_LIFE,
  PARTICLE_SPEED_MIN,
  PARTICLE_SPEED_MAX,
  STAR_COUNT,
  BASE_WIDTH,
  POWERUP_SIZE,
  POWERUP_DEFS,
  PowerUpType,
  getWaveInterval,
} from './constants';

export type { PowerUpType };

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
}

export interface Bullet {
  x: number;
  y: number;
  width: number;
  height: number;
  active: boolean;
  vx: number;
  vy: number;
  type: 'normal' | 'flame' | 'chain' | 'strong';
  damage: number;
  chainHits: number;
  age: number;
}

export interface Enemy {
  x: number;
  y: number;
  width: number;
  height: number;
  projectId: string;
  projectTitle: string;
  projectInitial: string;
  color: string;
  active: boolean;
  vx: number;
}

export interface GenericEnemy {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'standard' | 'tough' | 'fast';
  active: boolean;
  hits: number;
}

export interface WaveState {
  direction: 1 | -1;
  moveTimer: number;
  moveInterval: number;
  waveNumber: number;
  allDeadTimer: number;
}

export interface LootItem {
  projectId: string;
  projectTitle: string;
  projectInitial: string;
  color: string;
  x: number;
  y: number;
  animating: boolean;
  settled: boolean;
  active: boolean;
  index: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  alpha: number;
  active: boolean;
}

export interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  alpha: number;
}

export interface PowerUp {
  type: PowerUpType;
  x: number;
  y: number;
  width: number;
  height: number;
  vy: number;
  color: string;
  label: string;
  permanent: boolean;
  active: boolean;
  animPhase: number;
}

export interface TempWeapon {
  type: PowerUpType;
  timeLeft: number;
}

export type GamePhase = 'start' | 'playing' | 'gameOver';

export interface ScorePopup {
  x: number;
  y: number;
  value: number;
  color: string;
  life: number;
  maxLife: number;
}

export interface GameState {
  phase: GamePhase;
  player: Player;
  bullets: Bullet[];
  genericEnemies: GenericEnemy[];
  projectEnemies: Enemy[];
  wave: WaveState;
  lootItems: LootItem[];
  particles: Particle[];
  stars: Star[];
  shootCooldown: number;
  projectSpawnTimer: number;
  score: number;
  highScore: number;
  paused: boolean;
  reducedMotion: boolean;
  lives: number;
  invulnerableTimer: number;
  shakeAmount: number;
  scorePopups: ScorePopup[];
  waveReached: number;
  waveTextTimer: number;
  lastWaveNumber: number;
  elapsedTime: number;
  powerUps: PowerUp[];
  powerUpSpawnTimer: number;
  attackSpeedLevel: number;
  multiShotLevel: number;
  bulletDamage: number;
  tempWeapon: TempWeapon | null;
  shieldTimer: number;
}

export function createPlayer(width: number, height: number): Player {
  return {
    x: width / 2,
    y: height - 60,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    vx: 0,
  };
}

export function createBullet(
  x: number,
  y: number,
  options: {
    vx?: number;
    vy?: number;
    type?: 'normal' | 'flame' | 'chain' | 'strong';
    damage?: number;
    chainHits?: number;
  } = {}
): Bullet {
  return {
    x: x - BULLET_WIDTH / 2,
    y,
    width: BULLET_WIDTH,
    height: BULLET_HEIGHT,
    active: true,
    vx: options.vx ?? 0,
    vy: options.vy ?? 0,
    type: options.type ?? 'normal',
    damage: options.damage ?? 1,
    chainHits: options.chainHits ?? 0,
    age: 0,
  };
}

export function createEnemy(config: {
  x: number;
  y: number;
  projectId: string;
  projectTitle: string;
  color: string;
}): Enemy {
  return {
    x: config.x,
    y: config.y,
    width: PROJECT_ENEMY_WIDTH,
    height: PROJECT_ENEMY_HEIGHT,
    projectId: config.projectId,
    projectTitle: config.projectTitle,
    projectInitial: config.projectTitle.charAt(0).toUpperCase(),
    color: config.color,
    active: true,
    vx: 0,
  };
}

export function createWaveGrid(waveNumber: number): GenericEnemy[] {
  const enemies: GenericEnemy[] = [];
  const rows = Math.min(3 + Math.floor((waveNumber - 1) / 3), 5);
  const cols = Math.min(6 + Math.floor((waveNumber - 1) / 2), 8);
  const spacingX = GENERIC_ENEMY_WIDTH + 10;
  const spacingY = GENERIC_ENEMY_HEIGHT + 8;
  const totalWidth = cols * spacingX;
  const startX = (BASE_WIDTH - totalWidth) / 2 + GENERIC_ENEMY_WIDTH / 2;
  const startY = 30;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const type: 'standard' | 'tough' | 'fast' =
        row === 0 ? 'tough' : row < rows - 1 ? 'standard' : 'fast';
      enemies.push({
        x: startX + col * spacingX,
        y: startY + row * spacingY,
        width: GENERIC_ENEMY_WIDTH,
        height: GENERIC_ENEMY_HEIGHT,
        type,
        active: true,
        hits: type === 'tough' ? 2 : 1,
      });
    }
  }
  return enemies;
}

export function createWaveState(waveNumber: number): WaveState {
  return {
    direction: 1,
    moveTimer: 0,
    moveInterval: getWaveInterval(waveNumber),
    waveNumber,
    allDeadTimer: 1,
  };
}

export function createLootItem(
  projectId: string,
  projectTitle: string,
  color: string,
  x: number,
  y: number,
  index: number
): LootItem {
  return {
    projectId,
    projectTitle,
    projectInitial: projectTitle.charAt(0).toUpperCase(),
    color,
    x,
    y,
    animating: true,
    settled: false,
    active: true,
    index,
  };
}

export function createParticle(
  x: number,
  y: number,
  color: string
): Particle {
  const angle = Math.random() * Math.PI * 2;
  const speed =
    PARTICLE_SPEED_MIN + Math.random() * (PARTICLE_SPEED_MAX - PARTICLE_SPEED_MIN);
  return {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    life: PARTICLE_MAX_LIFE,
    maxLife: PARTICLE_MAX_LIFE,
    size: 2 + Math.random() * 3,
    color,
    alpha: 1,
    active: true,
  };
}

export type ParticlePool = Particle[];

export function createParticlePool(size: number): ParticlePool {
  return Array.from({ length: size }, () => ({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    life: 0,
    maxLife: 1,
    size: 2,
    color: '#fff',
    alpha: 1,
    active: false,
  }));
}

export function spawnParticleFromPool(
  pool: ParticlePool,
  x: number,
  y: number,
  color: string
): ParticlePool {
  const p = pool.find((p) => !p.active);
  if (!p) return pool;
  const angle = Math.random() * Math.PI * 2;
  const speed =
    PARTICLE_SPEED_MIN + Math.random() * (PARTICLE_SPEED_MAX - PARTICLE_SPEED_MIN);
  p.x = x;
  p.y = y;
  p.vx = Math.cos(angle) * speed;
  p.vy = Math.sin(angle) * speed;
  p.life = PARTICLE_MAX_LIFE;
  p.maxLife = PARTICLE_MAX_LIFE;
  p.size = 2 + Math.random() * 3;
  p.color = color;
  p.active = true;
  return pool;
}

export function spawnExplosionFromPool(
  pool: ParticlePool,
  x: number,
  y: number,
  color: string
): ParticlePool {
  for (let i = 0; i < EXPLOSION_PARTICLE_COUNT; i++) {
    spawnParticleFromPool(pool, x, y, color);
  }
  return pool;
}

export function createStars(width: number, height: number): Star[] {
  return Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: 0.5 + Math.random() * 1,
    speed: 6 + Math.random() * 10,
    alpha: 0.15 + Math.random() * 0.35,
  }));
}

export function createScorePopup(
  x: number,
  y: number,
  value: number,
  color: string,
  maxLife: number
): ScorePopup {
  return {
    x,
    y,
    value,
    color,
    life: maxLife,
    maxLife,
  };
}

export function createPowerUp(
  type: PowerUpType,
  x: number,
  y: number,
  vy: number
): PowerUp {
  const def = POWERUP_DEFS[type];
  return {
    type,
    x,
    y,
    width: POWERUP_SIZE,
    height: POWERUP_SIZE,
    vy,
    color: def.color,
    label: def.label,
    permanent: def.permanent,
    active: true,
    animPhase: 0,
  };
}
