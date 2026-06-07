import { ParticlePool } from './entities';

export function updateParticles(pool: ParticlePool, dt: number): void {
  for (let i = 0; i < pool.length; i++) {
    const p = pool[i];
    if (!p.active) continue;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= dt;
    p.vy += 60 * dt;
    if (p.life <= 0) {
      p.active = false;
    }
  }
}

export function drawParticles(
  ctx: CanvasRenderingContext2D,
  pool: ParticlePool
): void {
  for (let i = 0; i < pool.length; i++) {
    const p = pool[i];
    if (!p.active) continue;
    const alpha = Math.max(0, p.life / p.maxLife);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}
