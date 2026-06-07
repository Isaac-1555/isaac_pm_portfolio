import {
  PLAYER_ACCELERATION,
  PLAYER_FRICTION,
  BULLET_SPEED,
  BASE_WIDTH,
  BASE_HEIGHT,
  SHOOT_COOLDOWN,
  PROJECT_ENEMY_WIDTH,
  PROJECT_ENEMY_HEIGHT,
  LOOT_TRAY_X,
  LOOT_TRAY_START_Y,
  LOOT_TRAY_GAP,
  LOOT_ANIM_SPEED,
  GAME_PROJECTS,
  SHAKE_DECAY,
  SCORE_POPUP_LIFETIME,
  WAVE_TEXT_DURATION,
  INVULNERABLE_TIME,
  SHIELD_DURATION,
  TEMP_WEAPON_DURATION,
  FLAME_CONE_COUNT,
  FLAME_CONE_SPREAD,
  BULLET_DAMAGE_PER_LEVEL,
  ATTACK_SPEED_FACTOR_PER_LEVEL,
  MULTI_SHOT_EXTRA_PER_LEVEL,
  POWERUP_SPEED,
  COLORS,
  getWaveSideStep,
  getWaveDescendStep,
  getProjectSpawnInterval,
  getProjectSpeed,
  getMaxConcurrentProjectEnemies,
  getPowerUpSpawnInterval,
  getPowerUpDropChance,
  rollPowerUpType,
} from './constants';
import {
  GameState,
  Player,
  Bullet,
  Star,
  GenericEnemy,
  Enemy,
  PowerUp,
  createBullet,
  createEnemy,
  createScorePopup,
  createPowerUp,
} from './entities';
import {
  findPlayerGenericCollision,
  findPlayerProjectCollision,
} from './collision';

const SHOOT_COOLDOWN_MIN = 0.06;
const MULTI_SHOT_SPREAD = 0.1;
const DOUBLE_SHOT_OFFSET_X = 8;
const DOUBLE_SHOT_VX = 60;
const FLAME_BULLET_SPEED = 360;
const FLAME_VERTICAL_VARIANCE = 0.3;
const MAX_LIVES = 5;

function getEffectiveShootCooldown(state: GameState): number {
  const factor = 1 - state.attackSpeedLevel * ATTACK_SPEED_FACTOR_PER_LEVEL;
  return Math.max(SHOOT_COOLDOWN_MIN, SHOOT_COOLDOWN * factor);
}

function spawnBullet(
  state: GameState,
  x: number,
  y: number,
  options: {
    vx?: number;
    vy?: number;
    type?: 'normal' | 'flame' | 'chain' | 'strong';
    damage?: number;
    chainHits?: number;
  } = {}
): void {
  const damage = options.damage ?? state.bulletDamage;
  const type = options.type ?? (state.bulletDamage > 1 ? 'strong' : 'normal');
  state.bullets.push(
    createBullet(x, y, { ...options, damage, type })
  );
}

export function processInput(
  state: GameState,
  dt: number,
  leftPressed: boolean,
  rightPressed: boolean,
  shootPressed: boolean
): void {
  const player = state.player;
  if (state.paused) return;

  if (leftPressed) player.vx -= PLAYER_ACCELERATION * dt;
  if (rightPressed) player.vx += PLAYER_ACCELERATION * dt;
  if (!leftPressed && !rightPressed) {
    if (player.vx > 0) player.vx = Math.max(0, player.vx - PLAYER_FRICTION * dt);
    else if (player.vx < 0) player.vx = Math.min(0, player.vx + PLAYER_FRICTION * dt);
  }

  state.shootCooldown = Math.max(0, state.shootCooldown - dt);
  if (!shootPressed || state.shootCooldown > 0) return;

  const cooldown = getEffectiveShootCooldown(state);
  state.shootCooldown = cooldown;

  const tipY = player.y - player.height / 2;
  const temp = state.tempWeapon;

  if (temp?.type === 'flame_thrower') {
    for (let i = 0; i < FLAME_CONE_COUNT; i++) {
      const t = i / (FLAME_CONE_COUNT - 1) - 0.5;
      const angle = t * FLAME_CONE_SPREAD;
      const vx = Math.sin(angle) * FLAME_BULLET_SPEED;
      const vy = -Math.cos(angle) * FLAME_BULLET_SPEED * (1 - FLAME_VERTICAL_VARIANCE * Math.abs(t));
      spawnBullet(state, player.x, tipY, { vx, vy, type: 'flame', damage: 0 });
    }
    return;
  }

  if (temp?.type === 'double_shot') {
    spawnBullet(state, player.x - DOUBLE_SHOT_OFFSET_X, tipY, {
      vx: -DOUBLE_SHOT_VX,
      vy: -BULLET_SPEED,
    });
    spawnBullet(state, player.x + DOUBLE_SHOT_OFFSET_X, tipY, {
      vx: DOUBLE_SHOT_VX,
      vy: -BULLET_SPEED,
    });
    return;
  }

  if (temp?.type === 'chain_bullets') {
    spawnBullet(state, player.x, tipY, {
      vx: 0,
      vy: -BULLET_SPEED,
      type: 'chain',
      chainHits: 3,
    });
    return;
  }

  const extraShots = state.multiShotLevel * MULTI_SHOT_EXTRA_PER_LEVEL;
  const total = 1 + extraShots;
  for (let i = 0; i < total; i++) {
    const t = total === 1 ? 0 : i / (total - 1) - 0.5;
    const angle = t * MULTI_SHOT_SPREAD * (total - 1);
    const vx = Math.sin(angle) * BULLET_SPEED;
    const vy = -Math.cos(angle) * BULLET_SPEED;
    spawnBullet(state, player.x, tipY, { vx, vy });
  }
}

export function updatePlayer(player: Player, dt: number): void {
  const halfW = player.width / 2;
  player.x += player.vx * dt;
  player.x = Math.max(halfW, Math.min(BASE_WIDTH - halfW, player.x));
}

export function updateBullets(bullets: Bullet[], dt: number): void {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    if (!b.active) continue;
    b.x += (b.vx ?? 0) * dt;
    b.y += (b.vy ?? 0) * dt;
    b.age += dt;
    const outOfBounds =
      b.y + b.height < 0 ||
      b.y > BASE_HEIGHT + 20 ||
      b.x + b.width < 0 ||
      b.x > BASE_WIDTH + 20;
    if (outOfBounds) bullets.splice(i, 1);
  }
}

export function updateWave(state: GameState, dt: number): void {
  const wave = state.wave;
  wave.moveTimer += dt;
  if (wave.moveTimer < wave.moveInterval) return;
  wave.moveTimer = 0;

  const enemies = state.genericEnemies;
  const sideStep = getWaveSideStep(wave.waveNumber);

  let minX = Infinity;
  let maxX = -Infinity;
  for (let i = 0; i < enemies.length; i++) {
    const e = enemies[i];
    if (!e.active || e.deathAnim) continue;
    if (e.x < minX) minX = e.x;
    if (e.x + e.width > maxX) maxX = e.x + e.width;
  }

  const willHitRight = wave.direction === 1 && maxX + sideStep > BASE_WIDTH;
  const willHitLeft = wave.direction === -1 && minX - sideStep < 0;

  if (willHitRight || willHitLeft) {
    wave.direction = (wave.direction * -1) as 1 | -1;
    const descendStep = getWaveDescendStep(wave.waveNumber);
    for (let i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      if (!e.active || e.deathAnim) continue;
      e.y += descendStep;
    }
  } else {
    for (let i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      if (!e.active || e.deathAnim) continue;
      e.x += sideStep * wave.direction;
    }
  }

  for (let i = 0; i < enemies.length; i++) {
    const e = enemies[i];
    if (!e.active) continue;
    if (e.y + e.height > BASE_HEIGHT - 20) {
      state.phase = 'gameOver';
      state.shakeAmount = 12;
      spawnExplosionAt(state, e.x + e.width / 2, e.y + e.height / 2, COLORS.gold);
      return;
    }
  }
}

export function updateProjectEnemies(state: GameState, dt: number): void {
  const waveNumber = state.wave.waveNumber;
  const speed = getProjectSpeed(waveNumber);
  const spawnInterval = getProjectSpawnInterval(waveNumber);
  const maxConcurrent = getMaxConcurrentProjectEnemies(waveNumber);

  state.projectSpawnTimer -= dt;
  if (state.projectSpawnTimer <= 0) {
    const activeCount = state.projectEnemies.filter((e) => e.active).length;
    if (activeCount < maxConcurrent) {
      const project = GAME_PROJECTS[Math.floor(Math.random() * GAME_PROJECTS.length)];
      const x = PROJECT_ENEMY_WIDTH + Math.random() * (BASE_WIDTH - PROJECT_ENEMY_WIDTH * 2);
      state.projectEnemies.push(
        createEnemy({ x, y: -PROJECT_ENEMY_HEIGHT, projectId: project.id, projectTitle: project.title, color: project.color })
      );
    }
    state.projectSpawnTimer =
      spawnInterval.min +
      Math.random() * (spawnInterval.max - spawnInterval.min);
  }

  for (let i = state.projectEnemies.length - 1; i >= 0; i--) {
    const e = state.projectEnemies[i];
    if (e.deathAnim) {
      e.deathAnim.t += dt;
      if (e.deathAnim.t >= e.deathAnim.duration) {
        e.active = false;
        e.deathAnim = null;
        state.projectEnemies.splice(i, 1);
      }
      continue;
    }
    if (!e.active) {
      state.projectEnemies.splice(i, 1);
      continue;
    }
    e.y += speed * dt;
    e.engineAnim.t += dt;
    if (e.y > BASE_HEIGHT + 50) {
      state.projectEnemies.splice(i, 1);
    }
  }
}

export function updateLootItems(state: GameState, dt: number): void {
  for (let i = 0; i < state.lootItems.length; i++) {
    const loot = state.lootItems[i];
    if (!loot.active) continue;
    loot.anim.t += dt;
    if (loot.animating) {
      const targetX = LOOT_TRAY_X;
      const targetY = LOOT_TRAY_START_Y + loot.index * LOOT_TRAY_GAP;
      loot.x += (targetX - loot.x) * Math.min(1, LOOT_ANIM_SPEED * dt);
      loot.y += (targetY - loot.y) * Math.min(1, LOOT_ANIM_SPEED * dt);
      if (Math.abs(loot.x - targetX) < 0.5 && Math.abs(loot.y - targetY) < 0.5) {
        loot.x = targetX;
        loot.y = targetY;
        loot.animating = false;
        loot.settled = true;
      }
    }
  }
}

export function updatePowerUps(state: GameState, dt: number): void {
  for (let i = state.powerUps.length - 1; i >= 0; i--) {
    const p = state.powerUps[i];
    if (!p.active) {
      state.powerUps.splice(i, 1);
      continue;
    }
    p.y += p.vy * dt;
    p.animPhase += dt;
    p.anim.t += dt;
    if (p.y > BASE_HEIGHT + 30) {
      state.powerUps.splice(i, 1);
    }
  }
}

export function updatePowerUpSpawner(state: GameState, dt: number): void {
  state.powerUpSpawnTimer -= dt;
  if (state.powerUpSpawnTimer > 0) return;
  const interval = getPowerUpSpawnInterval(state.wave.waveNumber);
  state.powerUpSpawnTimer = interval;
  const x = 20 + Math.random() * (BASE_WIDTH - 40);
  const type = rollPowerUpType();
  state.powerUps.push(createPowerUp(type, x, -20, POWERUP_SPEED));
}

export function tryDropPowerUp(
  state: GameState,
  x: number,
  y: number
): boolean {
  const chance = getPowerUpDropChance(state.wave.waveNumber);
  if (Math.random() > chance) return false;
  const type = rollPowerUpType();
  state.powerUps.push(createPowerUp(type, x, y, POWERUP_SPEED));
  return true;
}

export function checkPowerUpCollection(state: GameState): void {
  const player = state.player;
  const pw = player.width;
  const ph = player.height;
  const pcx = player.x;
  const pcy = player.y;
  for (let i = state.powerUps.length - 1; i >= 0; i--) {
    const p = state.powerUps[i];
    if (!p.active) continue;
    const pcx2 = p.x + p.width / 2;
    const pcy2 = p.y + p.height / 2;
    const halfW = pw / 2;
    const halfH = ph / 2;
    const overlap =
      Math.abs(pcx - pcx2) < halfW + p.width / 2 &&
      Math.abs(pcy - pcy2) < halfH + p.height / 2;
    if (overlap) {
      applyPowerUp(state, p.type);
      p.active = false;
      state.powerUps.splice(i, 1);
    }
  }
}

export function applyPowerUp(state: GameState, type: PowerUp['type']): void {
  switch (type) {
    case 'attack_speed':
      state.attackSpeedLevel = Math.min(5, state.attackSpeedLevel + 1);
      break;
    case 'multi_shot':
      state.multiShotLevel = Math.min(3, state.multiShotLevel + 1);
      break;
    case 'stronger_bullets':
      state.bulletDamage = 1 + Math.min(4, state.bulletDamage) * BULLET_DAMAGE_PER_LEVEL;
      break;
    case 'extra_life':
      state.lives = Math.min(MAX_LIVES, state.lives + 1);
      break;
    case 'shield':
      state.shieldTimer = SHIELD_DURATION;
      break;
    case 'double_shot':
    case 'flame_thrower':
    case 'chain_bullets':
      state.tempWeapon = { type, timeLeft: TEMP_WEAPON_DURATION };
      break;
  }
}

export function updateTempWeapon(state: GameState, dt: number): void {
  if (!state.tempWeapon) return;
  state.tempWeapon.timeLeft -= dt;
  if (state.tempWeapon.timeLeft <= 0) {
    state.tempWeapon = null;
  }
}

export function updateShield(state: GameState, dt: number): void {
  if (state.shieldTimer > 0) {
    state.shieldTimer = Math.max(0, state.shieldTimer - dt);
  }
}

export function findNearestEnemy(
  state: GameState,
  x: number,
  y: number,
  range: number
): { enemy: GenericEnemy; index: number } | { enemy: Enemy; index: number } | null {
  let bestDistSq = range * range;
  let bestTarget: { enemy: GenericEnemy; index: number } | { enemy: Enemy; index: number } | null = null;
  for (let i = 0; i < state.genericEnemies.length; i++) {
    const e = state.genericEnemies[i];
    if (!e.active) continue;
    const dx = e.x + e.width / 2 - x;
    const dy = e.y + e.height / 2 - y;
    const d2 = dx * dx + dy * dy;
    if (d2 < bestDistSq) {
      bestDistSq = d2;
      bestTarget = { enemy: e, index: i };
    }
  }
  for (let i = 0; i < state.projectEnemies.length; i++) {
    const e = state.projectEnemies[i];
    if (!e.active) continue;
    const dx = e.x + e.width / 2 - x;
    const dy = e.y + e.height / 2 - y;
    const d2 = dx * dx + dy * dy;
    if (d2 < bestDistSq) {
      bestDistSq = d2;
      bestTarget = { enemy: e, index: i };
    }
  }
  return bestTarget;
}

export function updateStars(stars: Star[], dt: number, width: number, height: number): void {
  for (let i = 0; i < stars.length; i++) {
    const s = stars[i];
    s.y += s.speed * dt;
    if (s.y > height) {
      s.y = -2;
      s.x = Math.random() * width;
    }
  }
}

export function deactivateBullet(bullets: Bullet[], index: number): void {
  const b = bullets[index];
  if (!b) return;
  b.active = false;
}

export function hitGenericEnemy(enemies: GenericEnemy[], index: number, damage: number = 1): number {
  const e = enemies[index];
  if (!e || !e.active || e.deathAnim) return 0;
  e.hits -= damage;
  if (e.hits <= 0) {
    e.deathAnim = { t: 0, duration: 0.6 };
    e.active = false;
    return 1;
  }
  return 0;
}

export function tickGenericAnimations(enemies: GenericEnemy[], dt: number): void {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    if (e.deathAnim) {
      e.deathAnim.t += dt;
      if (e.deathAnim.t >= e.deathAnim.duration) {
        e.deathAnim = null;
      }
    } else if (e.active) {
      e.engineAnim.t += dt;
    }
  }
}

export function calculateGenericScore(type: 'standard' | 'tough' | 'fast'): number {
  if (type === 'tough') return 25;
  if (type === 'fast') return 15;
  return 10;
}

export function updateInvulnerability(state: GameState, dt: number): void {
  if (state.invulnerableTimer > 0) {
    state.invulnerableTimer = Math.max(0, state.invulnerableTimer - dt);
  }
}

export function updateScreenShake(state: GameState, dt: number): void {
  if (state.shakeAmount > 0) {
    state.shakeAmount = Math.max(0, state.shakeAmount - SHAKE_DECAY * dt);
  }
}

export function updateScorePopups(state: GameState, dt: number): void {
  for (let i = state.scorePopups.length - 1; i >= 0; i--) {
    const p = state.scorePopups[i];
    p.life -= dt;
    p.y -= 30 * dt;
    if (p.life <= 0) {
      state.scorePopups.splice(i, 1);
    }
  }
}

export function updateWaveText(state: GameState, dt: number): void {
  if (state.waveTextTimer > 0) {
    state.waveTextTimer = Math.max(0, state.waveTextTimer - dt);
  }
}

export function addScorePopup(
  state: GameState,
  x: number,
  y: number,
  value: number,
  color: string
): void {
  state.scorePopups.push(createScorePopup(x, y, value, color, SCORE_POPUP_LIFETIME));
}

export function damagePlayer(state: GameState, sourceColor: string = COLORS.cta): void {
  if (state.shieldTimer > 0) {
    state.shieldTimer = 0;
    spawnExplosionAt(state, state.player.x, state.player.y, COLORS.success);
    return;
  }
  if (state.invulnerableTimer > 0) return;
  state.lives -= 1;
  state.invulnerableTimer = INVULNERABLE_TIME;
  state.shakeAmount = 6;
  spawnExplosionAt(
    state,
    state.player.x,
    state.player.y,
    sourceColor
  );
  if (state.lives <= 0) {
    state.phase = 'gameOver';
    state.shakeAmount = 10;
    spawnExplosionAt(state, state.player.x, state.player.y, COLORS.cta);
    spawnExplosionAt(state, state.player.x, state.player.y, COLORS.warning);
  }
}

export function updatePlayerAnim(state: GameState, dt: number): void {
  state.playerAnim.t += dt;
  state.playerLivesCache = state.lives;
}

export function checkPlayerDamage(state: GameState): void {
  if (state.phase !== 'playing') return;
  if (state.invulnerableTimer > 0) return;
  const generic = findPlayerGenericCollision(state.player, state.genericEnemies);
  if (generic) {
    const { enemy } = generic;
    spawnExplosionAt(state, enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, COLORS.gold);
    enemy.deathAnim = { t: 0, duration: 0.6 };
    damagePlayer(state, COLORS.gold);
    return;
  }
  const project = findPlayerProjectCollision(state.player, state.projectEnemies);
  if (project) {
    const { enemy } = project;
    spawnExplosionAt(state, enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.color);
    enemy.deathAnim = { t: 0, duration: 0.6 };
    damagePlayer(state, enemy.color);
  }
}

export function spawnExplosionAt(
  state: GameState,
  x: number,
  y: number,
  color: string
): void {
  for (let i = 0; i < 24; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 60 + Math.random() * 140;
    const p = state.particles.find((p) => !p.active);
    if (!p) return;
    p.x = x;
    p.y = y;
    p.vx = Math.cos(angle) * speed;
    p.vy = Math.sin(angle) * speed;
    p.life = 0.6 + Math.random() * 0.4;
    p.maxLife = 1;
    p.size = 2 + Math.random() * 3;
    p.color = color;
    p.active = true;
  }
}

export function announceWave(state: GameState, waveNumber: number): void {
  state.waveTextTimer = WAVE_TEXT_DURATION;
  state.lastWaveNumber = waveNumber;
  if (waveNumber > state.waveReached) {
    state.waveReached = waveNumber;
  }
}
