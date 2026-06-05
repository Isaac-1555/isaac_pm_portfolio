import {
  COLORS,
  BASE_WIDTH,
  BASE_HEIGHT,
  LOOT_ITEM_SIZE,
} from './constants';
import {
  GameState,
  Player,
  Bullet,
  Enemy,
  GenericEnemy,
  LootItem,
  Star,
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

export function drawPlayer(ctx: CanvasRenderingContext2D, player: Player): void {
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
  ctx.fillStyle = COLORS.cta;
  ctx.shadowColor = COLORS.cta;
  ctx.shadowBlur = 6;
  ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.fillRect(bullet.x + 0.5, bullet.y - 1, bullet.width - 1, 3);
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

  for (let i = 0; i < state.bullets.length; i++) {
    drawBullet(ctx, state.bullets[i]);
  }

  drawPlayer(ctx, state.player);
  drawParticles(ctx, state.particles);
  drawScore(ctx, state.score, state.highScore);

  for (let i = 0; i < hitEffects.length; i++) {
    const h = hitEffects[i];
    drawHitEffect(ctx, h.x, h.y, h.time);
  }

  ctx.restore();
}
