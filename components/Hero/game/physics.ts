import {
  PLAYER_ACCELERATION,
  PLAYER_FRICTION,
  BULLET_SPEED,
  BASE_WIDTH,
  BASE_HEIGHT,
  SHOOT_COOLDOWN,
  WAVE_SIDE_STEP,
  WAVE_DESCEND_STEP,
  PROJECT_ENEMY_SPEED,
  PROJECT_SPAWN_INTERVAL_MIN,
  PROJECT_SPAWN_INTERVAL_MAX,
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
  COLORS,
} from './constants';
import {
  GameState,
  Player,
  Bullet,
  Star,
  GenericEnemy,
  createBullet,
  createEnemy,
  createWaveGrid,
  createScorePopup,
} from './entities';
import {
  findPlayerGenericCollision,
  findPlayerProjectCollision,
} from './collision';

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
  if (shootPressed && state.shootCooldown <= 0) {
    state.bullets.push(
      createBullet(player.x + player.width / 2, player.y - player.height / 2)
    );
    state.shootCooldown = SHOOT_COOLDOWN;
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
    b.y -= BULLET_SPEED * dt;
    if (b.y + b.height < 0) bullets.splice(i, 1);
  }
}

export function updateWave(state: GameState, dt: number): void {
  const wave = state.wave;
  wave.moveTimer += dt;
  if (wave.moveTimer < wave.moveInterval) return;
  wave.moveTimer = 0;

  const enemies = state.genericEnemies;

  for (let i = 0; i < enemies.length; i++) {
    const e = enemies[i];
    if (!e.active) continue;
    e.x += WAVE_SIDE_STEP * wave.direction;
  }

  let atEdge = false;
  for (let i = 0; i < enemies.length; i++) {
    const e = enemies[i];
    if (!e.active) continue;
    if (e.x < 0 || e.x + e.width > BASE_WIDTH) {
      atEdge = true;
      break;
    }
  }

  if (atEdge) {
    wave.direction = (wave.direction * -1) as 1 | -1;
    for (let i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      if (!e.active) continue;
      e.y += WAVE_DESCEND_STEP;
      e.x = Math.max(2, Math.min(BASE_WIDTH - e.width - 2, e.x));
    }
  }

  for (let i = 0; i < enemies.length; i++) {
    const e = enemies[i];
    if (!e.active) continue;
    if (e.y + e.height > BASE_HEIGHT - 40) {
      damagePlayer(state, COLORS.gold);
      state.genericEnemies = createWaveGrid(wave.waveNumber + 1);
      wave.waveNumber++;
      wave.moveInterval = Math.max(
        0.08,
        0.5 - (wave.waveNumber - 1) * 0.025
      );
      wave.direction = 1;
      wave.moveTimer = 0;
      announceWave(state, wave.waveNumber);
      return;
    }
  }
}

export function updateProjectEnemies(state: GameState, dt: number): void {
  state.projectSpawnTimer -= dt;
  if (state.projectSpawnTimer <= 0) {
    const hasActive = state.projectEnemies.some((e) => e.active);
    if (!hasActive) {
      const project = GAME_PROJECTS[Math.floor(Math.random() * GAME_PROJECTS.length)];
      const x = PROJECT_ENEMY_WIDTH + Math.random() * (BASE_WIDTH - PROJECT_ENEMY_WIDTH * 2);
      state.projectEnemies.push(
        createEnemy({ x, y: -PROJECT_ENEMY_HEIGHT, projectId: project.id, projectTitle: project.title, color: project.color })
      );
    }
    state.projectSpawnTimer =
      PROJECT_SPAWN_INTERVAL_MIN +
      Math.random() * (PROJECT_SPAWN_INTERVAL_MAX - PROJECT_SPAWN_INTERVAL_MIN);
  }

  for (let i = state.projectEnemies.length - 1; i >= 0; i--) {
    const e = state.projectEnemies[i];
    if (!e.active) {
      state.projectEnemies.splice(i, 1);
      continue;
    }
    e.y += PROJECT_ENEMY_SPEED * dt;
    if (e.y > BASE_HEIGHT + 50) {
      state.projectEnemies.splice(i, 1);
    }
  }
}

export function updateLootItems(state: GameState, dt: number): void {
  for (let i = 0; i < state.lootItems.length; i++) {
    const loot = state.lootItems[i];
    if (!loot.active) continue;
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

export function hitGenericEnemy(enemies: GenericEnemy[], index: number): number {
  const e = enemies[index];
  if (!e || !e.active) return 0;
  e.hits--;
  if (e.hits <= 0) {
    e.active = false;
    return 1;
  }
  return 0;
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

export function checkPlayerDamage(state: GameState): void {
  if (state.phase !== 'playing') return;
  if (state.invulnerableTimer > 0) return;
  const generic = findPlayerGenericCollision(state.player, state.genericEnemies);
  if (generic) {
    const { enemy } = generic;
    spawnExplosionAt(state, enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, COLORS.gold);
    enemy.active = false;
    damagePlayer(state, COLORS.gold);
    return;
  }
  const project = findPlayerProjectCollision(state.player, state.projectEnemies);
  if (project) {
    const { enemy, index } = project;
    spawnExplosionAt(state, enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.color);
    state.projectEnemies.splice(index, 1);
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
