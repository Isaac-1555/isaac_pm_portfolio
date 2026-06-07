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
import { getAssetEntry } from './assets/loader';
import { drawSprite, drawAnimated, getFrameSize } from './assets/sprites';
import { drawBackground } from './assets/background';
import {
  playerAssetForLives,
  shieldAssetForWeapon,
  PROJECT_FACTION_EMBLEM,
  POWERUP_BULLET,
} from './assets/assetMap';

const HITBOX_DISPLAY = 1.05;

function getDisplayScale(hitboxW: number, spriteW: number): number {
  if (spriteW <= 0) return 1;
  return (hitboxW * HITBOX_DISPLAY) / spriteW;
}

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

export function drawPlayer(
  ctx: CanvasRenderingContext2D,
  player: Player,
  invulnerableTimer: number,
  state: GameState
): void {
  if (invulnerableTimer > 0) {
    const blink = Math.floor(state.playerAnim.t * PLAYER_BLINK_RATE) % 2 === 0;
    if (!blink) return;
  }

  const cx = player.x;
  const cy = player.y;

  ctx.save();
  ctx.translate(cx, cy);

  ctx.fillStyle = COLORS.cta;
  ctx.globalAlpha = Math.random() > 0.3 ? 0.4 : 0;
  ctx.fillRect(-2, 17, 4, 6);
  ctx.fillRect(-5, 17, 3, 4);
  ctx.fillRect(2, 17, 3, 4);
  ctx.globalAlpha = 1;

  ctx.restore();

  const assetKey = playerAssetForLives(state.lives);
  const playerEntry = getAssetEntry(assetKey);
  if (playerEntry && playerEntry.img.naturalWidth > 0) {
    const { w: sw, h: sh } = getFrameSize(playerEntry);
    const scale = getDisplayScale(PLAYER_WIDTH, sw);
    drawSprite(ctx, playerEntry, cx, cy, { scale });
    const engineEntry = getAssetEntry('player-engine-sheet');
    if (engineEntry) {
      const eSize = getFrameSize(engineEntry);
      const engineCy = cy + (sh * scale) / 2 - 4;
      drawAnimated(ctx, engineEntry, state.playerAnim, cx, engineCy, {
        scale: getDisplayScale(PLAYER_WIDTH, eSize.w) * 0.8,
        alpha: 0.85,
      });
    }
  } else {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(18, 12);
    ctx.lineTo(0, 8);
    ctx.lineTo(-18, 12);
    ctx.closePath();
    ctx.fillStyle = COLORS.cta;
    ctx.fill();
    ctx.restore();
  }
}

export function drawShield(
  ctx: CanvasRenderingContext2D,
  player: Player,
  shieldTimer: number,
  state: GameState
): void {
  if (shieldTimer <= 0) return;
  const key = shieldAssetForWeapon(state.tempWeapon?.type ?? null);
  const entry = getAssetEntry(key);
  if (entry) {
    const { w: sw, h: sh } = getFrameSize(entry);
    const size = Math.max(sw, sh);
    const scale = (PLAYER_WIDTH * 2.4) / size;
    const pulse = 0.85 + 0.15 * Math.sin(state.playerAnim.t * 6);
    drawAnimated(ctx, entry, state.playerAnim, player.x, player.y, {
      scale: scale * pulse,
      alpha: 0.9,
    });
    return;
  }
  const pulse = 0.7 + 0.3 * Math.sin(state.playerAnim.t * 8);
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

export function drawGenericEnemy(
  ctx: CanvasRenderingContext2D,
  enemy: GenericEnemy
): void {
  if (enemy.deathAnim) {
    const entry = getAssetEntry(`enemy-${enemy.assetKey.replace('enemy-', '').replace(/-base$/, '-destroy')}`);
    if (entry) {
      const { w: sw } = getFrameSize(entry);
      const cx = enemy.x + enemy.width / 2;
      const cy = enemy.y + enemy.height / 2;
      const scale = getDisplayScale(enemy.width, sw);
      const t = enemy.deathAnim.t / enemy.deathAnim.duration;
      const alpha = 1 - t;
      const drift = t * 6;
      drawSprite(ctx, entry, cx + drift, cy + drift * 0.5, { scale, alpha });
    }
    return;
  }
  const cx = enemy.x + enemy.width / 2;
  const cy = enemy.y + enemy.height / 2;

  const baseEntry = getAssetEntry(enemy.assetKey);
  if (baseEntry && baseEntry.img.naturalWidth > 0) {
    const { w: sw } = getFrameSize(baseEntry);
    const scale = getDisplayScale(enemy.width, sw);
    drawSprite(ctx, baseEntry, cx, cy, { scale });
  } else {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = COLORS.bgDark;
    ctx.fillRect(-enemy.width / 2, -enemy.height / 2, enemy.width, enemy.height);
    ctx.fillStyle = enemy.type === 'tough' ? COLORS.gold : enemy.type === 'fast' ? COLORS.cta : COLORS.tech;
    ctx.fillRect(-enemy.width / 4, -enemy.height / 4, enemy.width / 2, enemy.height / 2);
    ctx.restore();
  }

  const engineEntry = getAssetEntry(enemy.engineAssetKey);
  if (engineEntry && engineEntry.img.naturalWidth > 0) {
    const eSize = getFrameSize(engineEntry);
    const engineCy = cy - enemy.height * 0.3;
    const scale = getDisplayScale(enemy.width, eSize.w) * 0.5;
    drawAnimated(ctx, engineEntry, enemy.engineAnim, cx, engineCy, { scale, alpha: 0.9 });
  }
}

export function drawEnemy(ctx: CanvasRenderingContext2D, enemy: Enemy): void {
  if (!enemy.active && !enemy.deathAnim) return;

  const cx = enemy.x + enemy.width / 2;
  const cy = enemy.y + enemy.height / 2;

  if (enemy.deathAnim) {
    const entry = getAssetEntry(enemy.destroyKey);
    if (entry) {
      const { w: sw } = getFrameSize(entry);
      const scale = getDisplayScale(enemy.width, sw);
      const t = enemy.deathAnim.t / enemy.deathAnim.duration;
      const alpha = 1 - t;
      const drift = t * 8;
      drawSprite(ctx, entry, cx + drift, cy + drift * 0.5, { scale, alpha });
    }
    return;
  }

  const baseEntry = getAssetEntry(enemy.assetKey);
  if (baseEntry && baseEntry.img.naturalWidth > 0) {
    const { w: sw } = getFrameSize(baseEntry);
    const scale = getDisplayScale(enemy.width, sw);
    drawSprite(ctx, baseEntry, cx, cy, { scale });
  } else {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.beginPath();
    ctx.moveTo(0, -enemy.height / 2);
    ctx.lineTo(enemy.width / 2, -enemy.height / 4);
    ctx.lineTo(enemy.width / 2, enemy.height / 4);
    ctx.lineTo(0, enemy.height / 2);
    ctx.lineTo(-enemy.width / 2, enemy.height / 4);
    ctx.lineTo(-enemy.width / 2, -enemy.height / 4);
    ctx.closePath();
    ctx.fillStyle = enemy.color;
    ctx.fill();
    ctx.restore();
  }

  const engineEntry = getAssetEntry(enemy.engineAssetKey);
  if (engineEntry && engineEntry.img.naturalWidth > 0) {
    const eSize = getFrameSize(engineEntry);
    const engineCy = cy - enemy.height * 0.3;
    const scale = getDisplayScale(enemy.width, eSize.w) * 0.6;
    drawAnimated(ctx, engineEntry, enemy.engineAnim, cx, engineCy, { scale, alpha: 0.9 });
  }

  const labelY = cy + enemy.height * 0.32;
  ctx.save();
  ctx.fillStyle = COLORS.textPrimary;
  ctx.font = 'bold 8px ui-monospace, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(enemy.projectInitial, cx, labelY);
  ctx.restore();
}

export function drawBullet(ctx: CanvasRenderingContext2D, bullet: Bullet): void {
  if (!bullet.active) return;
  let assetKey: string | null = null;
  if (bullet.type === 'flame') assetKey = 'bullet-flame';
  else if (bullet.type === 'chain') assetKey = 'bullet-zapper';
  else if (bullet.type === 'strong') assetKey = 'bullet-big';
  else assetKey = 'bullet-auto';

  const entry = getAssetEntry(assetKey);
  if (entry && entry.img.naturalWidth > 0) {
    const { w: sw, h: sh } = getFrameSize(entry);
    const cx = bullet.x + bullet.width / 2;
    const cy = bullet.y + bullet.height / 2;
    const scale = Math.max(bullet.width / sw, bullet.height / sh) * 1.1;
    if (entry.config.frames && entry.config.frames > 1) {
      drawAnimated(ctx, entry, { t: bullet.age }, cx, cy, { scale });
    } else {
      drawSprite(ctx, entry, cx, cy, { scale });
    }
    return;
  }
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
  const entry = getAssetEntry(powerUp.assetKey);
  if (entry && entry.img.naturalWidth > 0) {
    const { w: sw, h: sh } = getFrameSize(entry);
    const scale = Math.max(powerUp.width / sw, powerUp.height / sh) * 1.05;
    if (entry.config.frames && entry.config.frames > 1) {
      drawAnimated(ctx, entry, powerUp.anim, cx, cy, { scale });
    } else {
      drawSprite(ctx, entry, cx, cy, { scale });
    }
    return;
  }
  const s = powerUp.width / 2;
  const pulse = 0.85 + 0.15 * Math.sin(powerUp.animPhase * 4);
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(pulse, pulse);
  ctx.fillStyle = powerUp.color;
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
  ctx.fillStyle = COLORS.textPrimary;
  ctx.font = 'bold 7px ui-monospace, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(powerUp.label, 0, 0);
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
  const cx = loot.x;
  const cy = loot.y;
  const entry = getAssetEntry(loot.emblemKey);
  if (entry && entry.img.naturalWidth > 0) {
    const { w: sw, h: sh } = getFrameSize(entry);
    const size = LOOT_ITEM_SIZE;
    const scale = Math.max(size / sw, size / sh) * 1.4;
    if (entry.config.frames && entry.config.frames > 1) {
      drawAnimated(ctx, entry, loot.anim, cx, cy, { scale });
    } else {
      drawSprite(ctx, entry, cx, cy, { scale });
    }
  }
  const s = LOOT_ITEM_SIZE / 2;
  const glow = 0.55 + 0.45 * Math.sin(time * 3 + loot.index);
  ctx.save();
  ctx.translate(cx, cy);
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
  const fullEntry = getAssetEntry('player-full');
  for (let i = 0; i < lives; i++) {
    const x = startX + i * (w + 4);
    if (fullEntry && fullEntry.img.naturalWidth > 0) {
      const { w: sw, h: sh } = getFrameSize(fullEntry);
      const scale = Math.max(w / sw, h / sh) * 1.05;
      drawSprite(ctx, fullEntry, x + w / 2, y + h / 2, { scale });
    } else {
      ctx.save();
      ctx.translate(x + w / 2, y + h / 2);
      ctx.beginPath();
      ctx.moveTo(0, -h * 0.5);
      ctx.lineTo(w * 0.5, h * 0.5);
      ctx.lineTo(0, h * 0.3);
      ctx.lineTo(-w * 0.5, h * 0.5);
      ctx.closePath();
      ctx.fillStyle = COLORS.cta;
      ctx.fill();
      ctx.restore();
    }
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
    '[A/D] or [<-/->]      MOVE',
    '[SPACE]               SHOOT',
    '[CLICK LOOT]          EXPLORE',
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

export function drawLoadingScreen(
  ctx: CanvasRenderingContext2D,
  progress: number
): void {
  ctx.save();
  ctx.fillStyle = COLORS.bgBase;
  ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);
  ctx.fillStyle = COLORS.bgDark;
  ctx.font = 'bold 16px ui-monospace, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('LOADING ASSETS', BASE_WIDTH / 2, BASE_HEIGHT / 2 - 10);
  const barW = 200;
  const barH = 12;
  const x = (BASE_WIDTH - barW) / 2;
  const y = BASE_HEIGHT / 2 + 10;
  ctx.strokeStyle = COLORS.bgDark;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, barW, barH);
  ctx.fillStyle = COLORS.cta;
  ctx.fillRect(x + 2, y + 2, (barW - 4) * progress, barH - 4);
  ctx.fillStyle = COLORS.textSecondary;
  ctx.font = '9px ui-monospace, monospace';
  ctx.fillText(`${Math.floor(progress * 100)}%`, BASE_WIDTH / 2, y + barH + 14);
  ctx.restore();
}

export function render(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  scaleX: number,
  scaleY: number,
  hitEffects: { x: number; y: number; time: number }[],
  time: number,
  loadProgress: number = 1,
  assetsReady: boolean = true
): void {
  ctx.save();

  const dpr = window.devicePixelRatio || 1;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.imageSmoothingEnabled = false;
  ctx.scale(scaleX * dpr, scaleY * dpr);

  if (!assetsReady) {
    drawLoadingScreen(ctx, loadProgress);
    ctx.restore();
    return;
  }

  const shakeX = state.shakeAmount > 0 ? (Math.random() - 0.5) * state.shakeAmount : 0;
  const shakeY = state.shakeAmount > 0 ? (Math.random() - 0.5) * state.shakeAmount : 0;
  ctx.translate(shakeX, shakeY);

  drawBackground(ctx, BASE_HEIGHT);
  drawStars(ctx, state.stars);

  for (let i = 0; i < state.genericEnemies.length; i++) {
    const e = state.genericEnemies[i];
    if (!e.active && !e.deathAnim) continue;
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
    drawPlayer(ctx, state.player, state.invulnerableTimer, state);
    drawShield(ctx, state.player, state.shieldTimer, state);
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

void PROJECT_FACTION_EMBLEM;
void POWERUP_BULLET;
