import {
  COLORS,
  BASE_WIDTH,
  BASE_HEIGHT,
  LOOT_ITEM_SIZE,
  PLAYER_BLINK_RATE,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
} from './constants';
import {
  GameState,
  Player,
  Bullet,
  Enemy,
  GenericEnemy,
  LootItem,
  PowerUp,
  Star,
  ScorePopup,
} from './entities';
import { drawParticles } from './particles';

const shipBody: [number, number][] = [
  [0, -20],
  [10, -8],
  [14, -2],
  [13, 6],
  [18, 12],
  [12, 16],
  [8, 12],
  [5, 18],
  [-5, 18],
  [-8, 12],
  [-12, 16],
  [-18, 12],
  [-13, 6],
  [-14, -2],
  [-10, -8],
];

export function drawStars(ctx: CanvasRenderingContext2D, stars: Star[]): void {
  for (let i = 0; i < stars.length; i++) {
    const s = stars[i];
    ctx.globalAlpha = s.alpha;
    ctx.fillStyle = COLORS.divider;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

export function drawGrid(ctx: CanvasRenderingContext2D): void {
  ctx.strokeStyle = COLORS.divider;
  ctx.globalAlpha = 0.08;
  ctx.lineWidth = 1;
  for (let y = 0; y < BASE_HEIGHT; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(BASE_WIDTH, y);
    ctx.stroke();
  }
  for (let x = 0; x < BASE_WIDTH; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, BASE_HEIGHT);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

export function drawPlayer(
  ctx: CanvasRenderingContext2D,
  player: Player,
  invulnerableTimer: number,
  time: number
): void {
  if (invulnerableTimer > 0) {
    const blink = Math.floor(time * PLAYER_BLINK_RATE) % 2 === 0;
    if (!blink) return;
  }

  const cx = player.x;
  const cy = player.y;

  ctx.save();
  ctx.translate(cx, cy);

  ctx.fillStyle = COLORS.cta;
  ctx.globalAlpha = Math.random() > 0.3 ? 0.6 : 0;
  ctx.fillRect(-2, 17, 4, 6);
  ctx.fillRect(-5, 17, 3, 4);
  ctx.fillRect(2, 17, 3, 4);
  ctx.globalAlpha = 1;

  ctx.beginPath();
  ctx.moveTo(shipBody[0][0], shipBody[0][1]);
  for (let i = 1; i < shipBody.length; i++) {
    ctx.lineTo(shipBody[i][0], shipBody[i][1]);
  }
  ctx.closePath();
  ctx.fillStyle = COLORS.bgDark;
  ctx.strokeStyle = COLORS.bgDark;
  ctx.lineWidth = 1;
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = COLORS.card;
  ctx.beginPath();
  ctx.moveTo(-18, 12);
  ctx.lineTo(-13, 6);
  ctx.lineTo(-8, 12);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(18, 12);
  ctx.lineTo(13, 6);
  ctx.lineTo(8, 12);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = COLORS.cta;
  ctx.fillRect(-2, -2, 4, 14);

  ctx.fillStyle = COLORS.tech;
  ctx.beginPath();
  ctx.moveTo(0, -16);
  ctx.lineTo(-6, -6);
  ctx.lineTo(6, -6);
  ctx.closePath();
  ctx.fill();

  if (invulnerableTimer > 0) {
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = COLORS.cta;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  ctx.restore();
}

export function drawGenericEnemy(
  ctx: CanvasRenderingContext2D,
  enemy: GenericEnemy
): void {
  const cx = enemy.x + enemy.width / 2;
  const cy = enemy.y + enemy.height / 2;
  const hw = enemy.width / 2;
  const hh = enemy.height / 2;

  ctx.save();
  ctx.translate(cx, cy);

  const bodyColor = COLORS.bgDark;
  const accentColor =
    enemy.type === 'tough'
      ? COLORS.gold
      : enemy.type === 'fast'
        ? COLORS.cta
        : COLORS.tech;

  ctx.fillStyle = bodyColor;
  ctx.strokeStyle = COLORS.bgDark;
  ctx.lineWidth = 1.5;

  if (enemy.type === 'tough') {
    ctx.beginPath();
    ctx.moveTo(-hw, -hh * 0.6);
    ctx.lineTo(-hw * 0.7, -hh);
    ctx.lineTo(hw * 0.7, -hh);
    ctx.lineTo(hw, -hh * 0.6);
    ctx.lineTo(hw, hh * 0.6);
    ctx.lineTo(hw * 0.6, hh);
    ctx.lineTo(-hw * 0.6, hh);
    ctx.lineTo(-hw, hh * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = accentColor;
    ctx.fillRect(-hw * 0.4, -hh * 0.3, hw * 0.8, hh * 0.2);
    ctx.fillStyle = COLORS.card;
    ctx.fillRect(-hw * 0.5, -hh * 0.7, hw, hh * 0.25);
  } else if (enemy.type === 'fast') {
    ctx.beginPath();
    ctx.moveTo(0, -hh);
    ctx.lineTo(hw, 0);
    ctx.lineTo(hw * 0.5, hh);
    ctx.lineTo(-hw * 0.5, hh);
    ctx.lineTo(-hw, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.moveTo(0, -hh * 0.5);
    ctx.lineTo(hw * 0.4, 0);
    ctx.lineTo(0, hh * 0.3);
    ctx.lineTo(-hw * 0.4, 0);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.moveTo(0, -hh);
    ctx.lineTo(hw * 0.7, -hh * 0.4);
    ctx.lineTo(hw, hh * 0.1);
    ctx.lineTo(hw * 0.6, hh);
    ctx.lineTo(hw * 0.2, hh * 0.6);
    ctx.lineTo(-hw * 0.2, hh * 0.6);
    ctx.lineTo(-hw * 0.6, hh);
    ctx.lineTo(-hw, hh * 0.1);
    ctx.lineTo(-hw * 0.7, -hh * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.arc(0, -hh * 0.15, hw * 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

export function drawEnemy(ctx: CanvasRenderingContext2D, enemy: Enemy): void {
  if (!enemy.active) return;
  const cx = enemy.x + enemy.width / 2;
  const cy = enemy.y + enemy.height / 2;
  const hw = enemy.width / 2;
  const hh = enemy.height / 2;

  ctx.save();
  ctx.translate(cx, cy);

  ctx.beginPath();
  ctx.moveTo(0, -hh);
  ctx.lineTo(hw, -hh * 0.5);
  ctx.lineTo(hw, hh * 0.5);
  ctx.lineTo(0, hh);
  ctx.lineTo(-hw, hh * 0.5);
  ctx.lineTo(-hw, -hh * 0.5);
  ctx.closePath();
  ctx.fillStyle = enemy.color;
  ctx.strokeStyle = COLORS.bgDark;
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = COLORS.card;
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.moveTo(0, -hh * 0.4);
  ctx.lineTo(hw * 0.4, -hh * 0.2);
  ctx.lineTo(hw * 0.4, hh * 0.2);
  ctx.lineTo(0, hh * 0.4);
  ctx.lineTo(-hw * 0.4, hh * 0.2);
  ctx.lineTo(-hw * 0.4, -hh * 0.2);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.fillStyle = COLORS.textPrimary;
  ctx.font = 'bold 14px ui-monospace, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(enemy.projectInitial, 0, 1);

  ctx.restore();
}

export function drawBullet(ctx: CanvasRenderingContext2D, bullet: Bullet): void {
  if (!bullet.active) return;
  ctx.save();
  let color: string = COLORS.cta;
  let blur = 6;
  let w = bullet.width;
  const h = bullet.height;
  if (bullet.type === 'flame') {
    color = COLORS.warning;
    blur = 4;
    w = Math.max(2, bullet.width - 1);
  } else if (bullet.type === 'chain') {
    color = COLORS.tech;
    blur = 10;
  } else if (bullet.type === 'strong') {
    color = COLORS.gold;
    blur = 8;
  }
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = blur;
  ctx.fillRect(bullet.x, bullet.y, w, h);
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.fillRect(bullet.x + 0.5, bullet.y - 1, w - 1, Math.min(3, h - 1));
  ctx.restore();
}

export function drawPowerUp(
  ctx: CanvasRenderingContext2D,
  powerUp: PowerUp
): void {
  if (!powerUp.active) return;
  const cx = powerUp.x + powerUp.width / 2;
  const cy = powerUp.y + powerUp.height / 2;
  const s = powerUp.width / 2;
  const pulse = 0.85 + 0.15 * Math.sin(powerUp.animPhase * 4);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(pulse, pulse);

  ctx.fillStyle = powerUp.color;
  ctx.shadowColor = powerUp.color;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  for (let j = 0; j < 6; j++) {
    const a = (j * Math.PI) / 3 - Math.PI / 6;
    const px = s * Math.cos(a);
    const py = s * Math.sin(a);
    if (j === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = COLORS.bgDark;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = COLORS.textPrimary;
  ctx.font = 'bold 7px ui-monospace, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(powerUp.label, 0, 0);

  ctx.restore();
}

export function drawShield(
  ctx: CanvasRenderingContext2D,
  player: Player,
  shieldTimer: number,
  time: number
): void {
  if (shieldTimer <= 0) return;
  const pulse = 0.7 + 0.3 * Math.sin(time * 8);
  ctx.save();
  ctx.globalAlpha = pulse * 0.7;
  ctx.strokeStyle = COLORS.success;
  ctx.lineWidth = 2;
  ctx.shadowColor = COLORS.success;
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.arc(player.x, player.y, 26, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

export function drawPowerUpIndicators(
  ctx: CanvasRenderingContext2D,
  state: GameState
): void {
  const x = 8;
  let y = 50;
  const items: { label: string; color: string; timer?: number; maxTimer?: number }[] = [];
  if (state.attackSpeedLevel > 0) {
    items.push({ label: `AS L${state.attackSpeedLevel}`, color: COLORS.tech });
  }
  if (state.multiShotLevel > 0) {
    items.push({ label: `MS L${state.multiShotLevel}`, color: COLORS.warning });
  }
  if (state.bulletDamage > 1) {
    items.push({ label: `DMG ${state.bulletDamage}`, color: COLORS.gold });
  }
  if (state.tempWeapon) {
    items.push({
      label: state.tempWeapon.type.replace('_', ' ').toUpperCase(),
      color: COLORS.cta,
      timer: state.tempWeapon.timeLeft,
      maxTimer: 8,
    });
  }
  if (state.shieldTimer > 0) {
    items.push({
      label: 'SHD',
      color: COLORS.success,
      timer: state.shieldTimer,
      maxTimer: 6,
    });
  }
  if (items.length === 0) return;
  ctx.save();
  ctx.font = 'bold 8px ui-monospace, monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    ctx.fillStyle = item.color;
    ctx.fillRect(x, y + 1, 4, 4);
    ctx.fillStyle = COLORS.textSecondary;
    ctx.fillText(item.label, x + 8, y);
    y += 12;
  }
  ctx.restore();
}

export function drawLootItem(
  ctx: CanvasRenderingContext2D,
  loot: LootItem,
  time: number
): void {
  if (!loot.active) return;
  const s = LOOT_ITEM_SIZE / 2;
  const glow = 0.55 + 0.45 * Math.sin(time * 3 + loot.index);

  ctx.save();
  ctx.translate(loot.x, loot.y);

  ctx.globalAlpha = glow;
  ctx.fillStyle = loot.color;
  ctx.strokeStyle = COLORS.bgDark;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let j = 0; j < 6; j++) {
    const a = (j * Math.PI) / 3 - Math.PI / 6;
    const px = s * Math.cos(a);
    const py = s * Math.sin(a);
    if (j === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.globalAlpha = 1;

  ctx.fillStyle = COLORS.textPrimary;
  ctx.font = 'bold 8px ui-monospace, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(loot.projectInitial, 0, 0);

  ctx.restore();
}

export function drawScore(
  ctx: CanvasRenderingContext2D,
  score: number,
  highScore: number
): void {
  ctx.save();
  ctx.fillStyle = COLORS.textSecondary;
  ctx.font = '10px ui-monospace, monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(`SCORE: ${score}`, 8, 8);
  ctx.textAlign = 'right';
  ctx.fillText(`HI: ${highScore}`, BASE_WIDTH - 8, 8);
  ctx.restore();
}

export function drawLives(
  ctx: CanvasRenderingContext2D,
  lives: number
): void {
  ctx.save();
  const w = PLAYER_WIDTH * 0.5;
  const h = PLAYER_HEIGHT * 0.5;
  const startX = 8;
  const y = 22;
  for (let i = 0; i < lives; i++) {
    const x = startX + i * (w + 4);
    ctx.save();
    ctx.translate(x + w / 2, y + h / 2);
    ctx.scale(0.5, 0.5);
    ctx.beginPath();
    ctx.moveTo(shipBody[0][0], shipBody[0][1]);
    for (let j = 1; j < shipBody.length; j++) {
      ctx.lineTo(shipBody[j][0], shipBody[j][1]);
    }
    ctx.closePath();
    ctx.fillStyle = COLORS.cta;
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

export function drawWaveAnnouncement(
  ctx: CanvasRenderingContext2D,
  waveNumber: number,
  timer: number
): void {
  const t = timer / 1.8;
  if (t <= 0) return;
  const ease = 1 - Math.pow(1 - t, 2);
  const scale = 0.6 + ease * 0.6;
  const alpha = Math.min(1, t * 2) * Math.min(1, (1 - t) * 2);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(BASE_WIDTH / 2, BASE_HEIGHT / 2);
  ctx.scale(scale, scale);
  ctx.fillStyle = COLORS.cta;
  ctx.font = 'bold 32px ui-monospace, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`WAVE ${waveNumber}`, 0, 0);
  ctx.fillStyle = COLORS.textSecondary;
  ctx.font = '10px ui-monospace, monospace';
  ctx.fillText('INCOMING', 0, 26);
  ctx.restore();
}

export function drawScorePopups(
  ctx: CanvasRenderingContext2D,
  popups: ScorePopup[]
): void {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let i = 0; i < popups.length; i++) {
    const p = popups[i];
    const alpha = Math.max(0, p.life / p.maxLife);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.font = 'bold 12px ui-monospace, monospace';
    ctx.fillText(`+${p.value}`, p.x, p.y);
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

export function drawStartScreen(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  time: number
): void {
  ctx.save();
  ctx.fillStyle = 'rgba(46, 60, 61, 0.78)';
  ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);

  const cx = BASE_WIDTH / 2;

  const titlePulse = 0.85 + 0.15 * Math.sin(time * 3);
  ctx.globalAlpha = titlePulse;
  ctx.fillStyle = COLORS.cta;
  ctx.font = 'bold 28px ui-monospace, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PORTFOLIO', cx, 150);
  ctx.fillText('INVADERS', cx, 184);
  ctx.globalAlpha = 1;

  ctx.fillStyle = COLORS.textSecondary;
  ctx.font = '9px ui-monospace, monospace';
  ctx.fillText('A SPACE SHOOTER PORTFOLIO', cx, 210);

  ctx.fillStyle = COLORS.textPrimary;
  ctx.font = '10px ui-monospace, monospace';
  const lineY = 260;
  const lines = [
    '[A/D] or [<-/->]  MOVE',
    '[SPACE]            SHOOT',
    '[CLICK LOOT]       EXPLORE',
  ];
  for (let i = 0; i < lines.length; i++) {
    ctx.textAlign = 'left';
    ctx.fillText(lines[i], cx - 90, lineY + i * 16);
  }

  ctx.fillStyle = COLORS.gold;
  ctx.font = '9px ui-monospace, monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`HIGH SCORE: ${state.highScore}`, cx, 330);

  const blink = Math.floor(time * 2) % 2 === 0;
  if (blink) {
    ctx.fillStyle = COLORS.cta;
    ctx.font = 'bold 13px ui-monospace, monospace';
    ctx.fillText('PRESS SPACE TO START', cx, 400);
  }

  ctx.fillStyle = COLORS.textSecondary;
  ctx.font = '7px ui-monospace, monospace';
  ctx.fillText('v1.0 // DEFEAT WAVES // COLLECT PROJECTS', cx, 440);
  ctx.restore();
}

export function drawGameOverScreen(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  time: number
): void {
  ctx.save();
  ctx.fillStyle = 'rgba(30, 40, 41, 0.82)';
  ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);

  const cx = BASE_WIDTH / 2;

  const flash = Math.floor(time * 4) % 2 === 0;
  ctx.fillStyle = flash ? COLORS.cta : COLORS.warning;
  ctx.font = 'bold 32px ui-monospace, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('GAME OVER', cx, 140);

  ctx.fillStyle = COLORS.textPrimary;
  ctx.font = '11px ui-monospace, monospace';
  const statsY = 200;
  const stats = [
    `FINAL SCORE:  ${state.score}`,
    `HIGH SCORE:   ${state.highScore}`,
    `WAVE REACHED: ${state.waveReached}`,
  ];
  for (let i = 0; i < stats.length; i++) {
    ctx.fillText(stats[i], cx, statsY + i * 22);
  }

  if (state.score > 0 && state.score >= state.highScore && state.score > 0) {
    ctx.fillStyle = COLORS.gold;
    ctx.font = 'bold 10px ui-monospace, monospace';
    ctx.fillText('! NEW HIGH SCORE !', cx, 280);
  }

  const blink = Math.floor(time * 2) % 2 === 0;
  if (blink) {
    ctx.fillStyle = COLORS.cta;
    ctx.font = 'bold 12px ui-monospace, monospace';
    ctx.fillText('PRESS SPACE TO RESTART', cx, 360);
  }

  ctx.fillStyle = COLORS.textSecondary;
  ctx.font = '8px ui-monospace, monospace';
  ctx.fillText('TIP: COLLECT PROJECT DROPS TO EXPLORE WORK', cx, 410);
  ctx.restore();
}

export function drawHitEffect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  time: number
): void {
  ctx.save();
  ctx.strokeStyle = COLORS.cta;
  ctx.globalAlpha = Math.max(0, 1 - time / 0.3);
  ctx.lineWidth = 2;
  const r = 10 + time * 60;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

export function render(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  scaleX: number,
  scaleY: number,
  hitEffects: { x: number; y: number; time: number }[],
  time: number
): void {
  ctx.save();

  const dpr = window.devicePixelRatio || 1;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.scale(scaleX * dpr, scaleY * dpr);

  const shakeX = state.shakeAmount > 0 ? (Math.random() - 0.5) * state.shakeAmount : 0;
  const shakeY = state.shakeAmount > 0 ? (Math.random() - 0.5) * state.shakeAmount : 0;
  ctx.translate(shakeX, shakeY);

  drawGrid(ctx);
  drawStars(ctx, state.stars);

  for (let i = 0; i < state.genericEnemies.length; i++) {
    const e = state.genericEnemies[i];
    if (!e.active) continue;
    drawGenericEnemy(ctx, e);
  }

  for (let i = 0; i < state.projectEnemies.length; i++) {
    const e = state.projectEnemies[i];
    drawEnemy(ctx, e);
  }

  for (let i = 0; i < state.lootItems.length; i++) {
    drawLootItem(ctx, state.lootItems[i], time);
  }

  for (let i = 0; i < state.powerUps.length; i++) {
    drawPowerUp(ctx, state.powerUps[i]);
  }

  for (let i = 0; i < state.bullets.length; i++) {
    drawBullet(ctx, state.bullets[i]);
  }

  if (state.phase !== 'start' && state.lives > 0) {
    drawPlayer(ctx, state.player, state.invulnerableTimer, time);
    drawShield(ctx, state.player, state.shieldTimer, time);
  }
  drawParticles(ctx, state.particles);

  if (state.phase === 'playing') {
    drawScore(ctx, state.score, state.highScore);
    drawLives(ctx, state.lives);
    drawPowerUpIndicators(ctx, state);
    drawScorePopups(ctx, state.scorePopups);
    if (state.waveTextTimer > 0) {
      drawWaveAnnouncement(ctx, state.lastWaveNumber, state.waveTextTimer);
    }
  }

  for (let i = 0; i < hitEffects.length; i++) {
    const h = hitEffects[i];
    drawHitEffect(ctx, h.x, h.y, h.time);
  }

  if (state.phase === 'start') {
    drawStartScreen(ctx, state, time);
  } else if (state.phase === 'gameOver') {
    drawGameOverScreen(ctx, state, time);
  }

  ctx.restore();
}
